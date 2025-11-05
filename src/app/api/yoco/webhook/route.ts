// src/app/api/yoco/webhook/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Resend } from 'resend';
import { getOrderConfirmationHtml, getShopAdminNotificationHtml } from '@/utils/emailTemplates';
import type { DbShopOrder, DbShopOrderItem, DbProfile } from "@/types/supabase";

// --- TIPES SPESIFIEK VIR HIERDIE LÊER ---

type YocoWebhookPayload = {
  id: string; 
  type: 'charge.succeeded' | 'charge.failed';
  data: {
    id: string; 
    live_mode: boolean;
    amount: number;
    currency: string;
    status: 'succeeded' | 'failed' | 'pending';
    metadata: {
      order_id?: string; // Ons interne UUID
      order_ref?: string; // Ons human_readable_id
    };
    createdDate: string; // Vir die 'paid_at' veld
  };
};

type OrderWithItemsAndProfile = DbShopOrder & {
  shop_order_items: DbShopOrderItem[];
  profiles: Pick<DbProfile, 'full_name' | 'email'> | null;
};

// --- E-POS STUUR FUNKSIE ---
async function sendOrderEmails(
  order: OrderWithItemsAndProfile, 
  customerName: string, 
  customerEmail: string,
  supabaseAdmin: SupabaseClient
) {
  const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
  if (!resend) {
    console.error("Webhook E-pos-fout: Resend API-sleutel is nie opgestel nie.");
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
    console.log(`Webhook: Kliënt-bevestiging gestuur na ${customerEmail}`);
  } catch (error) {
    console.error(`Webhook: Kon nie KLIËNT e-pos stuur nie:`, error);
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
    console.log(`Webhook: Admin-kennisgewing gestuur na ${adminEmail}`);

  } catch (error) {
    console.error(`Webhook: Kon nie ADMIN e-pos stuur nie:`, error);
  }
}

/**
 * Valideer die Yoco Webhook Handtekening
 * (Gebaseer op die korrekte voorbeeld wat jy gestuur het)
 */
async function verifyYocoSignature(
  webhookId: string | null,
  signatureHeader: string | null,
  timestampHeader: string | null,
  rawBody: string,
  secret: string
): Promise<boolean> {
  if (!webhookId || !signatureHeader || !timestampHeader || !secret) {
    console.error("Webhook Fout: Vereiste headers of geheim is weg.");
    return false;
  }

  // 1. Valideer timestamp om "replay attacks" te voorkom
  const MAX_WEBHOOK_AGE_SECONDS = 3 * 60; // 3 minute
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const webhookTimestamp = parseInt(timestampHeader, 10);

  if (isNaN(webhookTimestamp) || Math.abs(currentTimestamp - webhookTimestamp) > MAX_WEBHOOK_AGE_SECONDS) {
      console.error(`Webhook Fout: Timestamp-validering misluk. Webhook: ${webhookTimestamp}, Bediener: ${currentTimestamp}`);
      return false;
  }

  // 2. Haal die 'v1' handtekening uit die header
  const signatureParts = signatureHeader.split(' ');
  let hashFromHeader = '';
  for (const part of signatureParts) {
      const [version, signature] = part.split(',');
      if (version === 'v1') {
          hashFromHeader = signature;
          break;
      }
  }

  if (!hashFromHeader) {
      console.error("Webhook Fout: Kon nie 'v1' handtekening in header vind nie.");
      return false;
  }

  // 3. Dekodeer die geheim
  const secretParts = secret.split('_');
  if (secretParts.length < 2 || !secretParts[1]) {
      console.error("Webhook Fout: Ongeldige webhook-geheim formaat. Verwag 'whsec_...'.");
      return false;
  }
  const secretBytes = Buffer.from(secretParts[1], 'base64');

  // 4. Konstrueer die 'signedPayload'
  const signedPayload = `${webhookId}.${timestampHeader}.${rawBody}`;

  // 5. Skep die verwagte handtekening
  const expectedSignature = crypto
    .createHmac('sha256', secretBytes)
    .update(signedPayload)
    .digest('base64');

  // 6. Vergelyk handtekeninge veilig
  try {
    const hashBuffer = Buffer.from(hashFromHeader, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');
    
    if (hashBuffer.length !== expectedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
  } catch (error) {
    console.error("Webhook Fout: Fout tydens handtekening-vergelyking.", error);
    return false;
  }
}

/**
 * HOOF WEBHOOK HANTERAAR
 */
export async function POST(request: NextRequest) {
  // Gebruik dieselfde .env veranderlike as ons create-checkout roete
  const webhookSecret = process.env.YOCO_WEBHOOK; 
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!webhookSecret || !supabaseServiceKey || !supabaseUrl) {
    console.error("Webhook Fout: Omgewingsveranderlikes is nie opgestel nie.");
    return new NextResponse('Webhook-geheim nie opgestel nie', { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const rawBody = await request.text();
  
  // Haal headers
  const webhookId = request.headers.get('webhook-id');
  const signatureHeader = request.headers.get('webhook-signature');
  const timestampHeader = request.headers.get('webhook-timestamp');

  // --- STAP 1: Valideer Handtekening ---
  const isValid = await verifyYocoSignature(webhookId, signatureHeader, timestampHeader, rawBody, webhookSecret);
  
  if (!isValid) {
    console.warn("Ongemagtigde webhook ontvang. Handtekening-validering misluk.");
    return new NextResponse('Ongeldige handtekening', { status: 401 });
  }

  // --- STAP 2: Verwerk die Webhook ---
  try {
    const event = JSON.parse(rawBody) as YocoWebhookPayload;
    console.log('Geldige Yoco webhook-gebeurtenis ontvang:', event.type);

    // Ons Checkout API gebruik 'charge.succeeded'
    if (event.type === 'charge.succeeded' && event.data.status === 'succeeded') {
      const charge = event.data;
      
      // Ons metadata gebruik 'order_id'
      const orderId = charge.metadata?.order_id;

      if (!orderId) {
        console.error("Webhook Fout: 'order_id' nie gevind in metadata vir charge:", charge.id);
        return new NextResponse('Missing order_id in metadata', { status: 400 });
      }

      // Dateer ONS tabel op ('shop_orders')
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from('shop_orders')
        .update({
          status: 'processing',
          //paid_at: new Date(charge.createdDate).toISOString(),
          yoco_charge_id: charge.id,
          // 'total_amount' is reeds gestoor, ons hoef nie 'paid_amount' te stoor nie
        })
        .eq('id', orderId)
        .eq('status', 'pending_payment') // SLEGS as dit nog hangende is
        .select(`
          *,
          shop_order_items(*),
          profiles ( full_name, cell_phone )
        `)
        .single<OrderWithItemsAndProfile>();

      if (updateError) {
        console.error(`Supabase opdateringsfout vir orderId ${orderId}:`, updateError);
        // Moet steeds 200 terugstuur om Yoco te stop
      } else if (updatedOrder) {
        console.log(`Bestelling ${orderId} suksesvol opgedateer na 'processing'.`);

        // Kry kliënt-inligting
        let customerEmail: string | null = null;
        let customerName: string | null = null;

        if (updatedOrder.user_id && updatedOrder.profiles) {
          customerName = updatedOrder.profiles.full_name;
          customerEmail = updatedOrder.profiles.email;
        } else {
          customerName = updatedOrder.guest_name;
          customerEmail = updatedOrder.guest_email;
        }
        
        // Vang-net vir ingetekende gebruikers wie se e-pos nie op profiel is nie
        if (updatedOrder.user_id && !customerEmail) {
           const { data: userData } = await supabaseAdmin.auth.admin.getUserById(updatedOrder.user_id);
           if (userData && userData.user) {
              customerEmail = userData.user.email || null;
           }
        }

        // Stuur E-posse
        if (customerEmail && customerName) {
          await sendOrderEmails(updatedOrder, customerName, customerEmail, supabaseAdmin);
        } else {
          console.warn(`Webhook: Kon nie e-pos stuur nie - kliënt-inligting onvolledig vir bestelling ${orderId}.`);
        }
      } else {
        console.log(`Webhook: Bestelling ${orderId} reeds verwerk. Ignoreer.`);
      }

    } else if (event.type === 'charge.failed') {
        const charge = event.data;
        const orderId = charge.metadata?.order_id;
        if(orderId) {
            await supabaseAdmin
                .from('shop_orders')
                .update({ status: 'failed', admin_notes: `Yoco betaling het misluk (Charge ID: ${charge.id})` })
                .eq('id', orderId);
        }
    }

    // Altyd 200 OK terugstuur na Yoco
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Fout met verwerking van Yoco webhook:', error);
    return new NextResponse('Webhook verwerking fout', { status: 500 });
  }
}