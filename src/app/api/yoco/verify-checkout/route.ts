// src/app/api/yoco/verify-checkout/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getOrderConfirmationHtml, getShopAdminNotificationHtml } from '@/utils/emailTemplates';
import type { DbShopOrder, DbShopOrderItem, DbProfile } from "@/types/supabase";

// Tipe vir ons interne databasis-navraag
type OrderWithItemsAndProfile = DbShopOrder & {
  shop_order_items: DbShopOrderItem[];
  profiles: Pick<DbProfile, 'full_name' | 'email'> | null;
};

// --- E-POS STUUR FUNKSIE (GEKOPIEER VANAF WEBHOOK-LOGIKA) ---
// Dit word NOU deur hierdie roete hanteer.
async function sendOrderEmails(
  order: OrderWithItemsAndProfile, 
  customerName: string, 
  customerEmail: string,
  supabaseAdmin: SupabaseClient
) {
  const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
  if (!resend) {
    console.error("Verify E-pos-fout: Resend API-sleutel is nie opgestel nie.");
    return;
  }
  
  const orderRef = order.human_readable_id || order.id.substring(0, 8);
  const orderTotal = new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(order.total_amount);

  // --- 1. Stuur KLIËNT-epos ---
  try {
    const emailHtml = getOrderConfirmationHtml({
        customerName: customerName || 'Kliënt',
        orderRef: orderRef,
        orderTotal: orderTotal,
    });
    await resend.emails.send({
      from: 'Hoërskool Brits Winkel <info@nicolabsdigital.co.za>',
      to: [customerEmail],
      subject: `Bestelling Bevestig: #${orderRef}`,
      html: emailHtml,
    });
    console.log(`Verify: Kliënt-bevestiging gestuur na ${customerEmail}`);
  } catch (error) {
    console.error(`Verify: Kon nie KLIËNT e-pos stuur nie:`, error);
  }

  // --- 2. Stuur ADMIN-epos ---
  try {
    const { data: settingData, error: settingError } = await supabaseAdmin
        .from('system_settings')
        .select('value')
        .eq('key', 'shop_manager_email')
        .single();
        
    if (settingError || !settingData?.value) {
      throw new Error(`Kon nie 'shop_manager_email' van DB kry nie: ${settingError?.message}`);
    }
    
    const adminEmail = settingData.value;
    
    const adminEmailHtml = getShopAdminNotificationHtml({
      customerName: customerName || 'Gas Kliënt',
      orderRef: orderRef,
      orderTotal: orderTotal,
      orderId: order.id,
      items: order.shop_order_items.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity
      }))
    });

    await resend.emails.send({
      from: 'Nuwe Britsie Winkelbestelling <info@nicolabsdigital.co.za>',
      to: [adminEmail],
      subject: `NUWE BESTELLING ONTVANG: #${orderRef} (${customerName})`,
      html: adminEmailHtml,
    });
    console.log(`Verify: Admin-kennisgewing gestuur na ${adminEmail}`);
  } catch (error) {
    console.error(`Verify: Kon nie ADMIN e-pos stuur nie:`, error);
  }
}
// --- EINDE VAN E-POS STUUR FUNKSIE ---


/**
 * Hierdie roete word deur ONS EIE sukses-bladsy geroep as 'n fallback.
 * Dit poll Yoco handmatig om die status van 'n checkout te kry.
 * Logika gebaseer op jou voorbeeld-lêer.
 */
export async function POST(request: NextRequest) {
  const { checkoutId } = await request.json();

  if (!checkoutId) {
    return NextResponse.json({ error: 'Checkout ID is required' }, { status: 400 });
  }

  const secretKey = process.env.YOCO_SECRET_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!secretKey || !supabaseServiceKey || !supabaseUrl) {
    console.error("Verify Fout: Omgewingsveranderlikes is nie opgestel nie.");
    return NextResponse.json({ error: 'Interne bedienerfout' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log(`Verify: Gaan Yoco-status na vir checkoutId: ${checkoutId}`);
    const response = await fetch(`https://payments.yoco.com/api/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Yoco verify API fout:', data);
      throw new Error('Kon nie betaling met Yoco verifieer nie');
    }

    const orderId = data.metadata.order_id;
    const status = data.state || data.status;

    if (status === 'successful' || status === 'succeeded' || status === 'completed') {
      if (!orderId) {
        throw new Error("Verify Fout: 'order_id' nie gevind in Yoco metadata nie.");
      }

      // ******** BEGIN REGSTELLING ********
      // Gebruik die huidige tyd, nie 'data.createdDate' nie
      const paidAtTimestamp = new Date().toISOString();
      // ******** EINDE REGSTELLING ********

      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from('shop_orders')
        .update({
          status: 'processing',
          //paid_at: paidAtTimestamp, // <-- GEBRUIK DIE VEILIGE WAARDE
          yoco_charge_id: data.id, 
        })
        .eq('id', orderId)
        .eq('status', 'pending_payment') 
        .select(`
          *,
          shop_order_items(*),
          profiles ( full_name, cell_phone )
        `)
        .single<OrderWithItemsAndProfile>();

      if (updateError) {
        console.error(`Verify DB Fout: Kon nie status opdateer vir Order ${orderId}:`, updateError.message);
        return NextResponse.json({ success: true, status: 'paid_db_error' });
      }
      
      if (!updatedOrder) {
        console.log(`Verify: Bestelling ${orderId} reeds verwerk (waarskynlik deur webhook). Ignoreer.`);
        return NextResponse.json({ success: true, status: 'paid' });
      }

      console.log(`Verify: Bestelling ${orderId} suksesvol opgedateer na 'processing'.`);

      // Stuur e-posse
      let customerEmail: string | null = null;
      let customerName: string | null = null;

      if (updatedOrder.user_id && updatedOrder.profiles) {
        customerName = updatedOrder.profiles.full_name;
        customerEmail = updatedOrder.profiles.email;
      } else {
        customerName = updatedOrder.guest_name;
        customerEmail = updatedOrder.guest_email;
      }
      
      if (updatedOrder.user_id && !customerEmail) {
         const { data: userData } = await supabaseAdmin.auth.admin.getUserById(updatedOrder.user_id);
         if (userData && userData.user) {
            customerEmail = userData.user.email || null;
         }
      }

      if (customerEmail && customerName) {
        await sendOrderEmails(updatedOrder, customerName, customerEmail, supabaseAdmin);
      } else {
        console.warn(`Verify: Kon nie e-pos stuur nie - kliënt-inligting onvolledig vir bestelling ${orderId}.`);
      }

      return NextResponse.json({ success: true, status: 'paid' });

    } else {
      console.log(`Verify: Status vir checkoutId ${checkoutId} is nog nie 'successful': ${status}`);
      return NextResponse.json({ success: false, status: status });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Interne Bediener Fout';
    console.error('Fout met verifikasie van Yoco-betaling:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}