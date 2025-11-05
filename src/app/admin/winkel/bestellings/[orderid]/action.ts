// src/app/admin/winkel/bestellings/[orderid]/action.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from 'resend';
import { 
  getOrderReadyForCollectionHtml, 
  getOrderCancelledHtml, 
  getOrderCompletedHtml 
} from '@/utils/emailTemplates';
import { createClient as createAdminClient } from '@supabase/supabase-js';
// REGSTELLING #1: Voer die SupabaseClient-tipe in
import type { SupabaseClient } from '@supabase/supabase-js';

// Tipe om die e-pos funksie te help
type OrderCustomerInfo = {
  customerName: string;
  customerEmail: string;
  orderRef: string;
  orderTotal: string;
}

/**
 * Hanteer die opdatering van 'n bestelling se status EN stuur e-pos kennisgewings.
 */
export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient(); // Gewone kliënt vir admin-tjek
  
  // --- 1. Magtiging-tjek ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin') {
    return redirect('/');
  }
  // --- Einde van Magtiging ---

  const orderId = formData.get('orderId') as string;
  const newStatus = formData.get('status') as string;
  const collectorName = formData.get('collector_name') as string | null;

  if (!orderId || !newStatus) {
    console.error("Missing order ID or new status");
    return redirect('/admin/winkel/bestellings?error=Ongeldige data');
  }

  // Skep die Service Role kliënt vir databasis-aksies
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // --- 2. Dateer die status op ---
  // REGSTELLING #2: Gebruik 'shipping_address_line2' vir die afhaler-naam
  let updateData: { status: string; shipping_address_line2?: string } = { status: newStatus };
  
  if (newStatus === 'completed' && collectorName) {
    // Stoor die afhaler se naam in 'shipping_address_line2'
    updateData.shipping_address_line2 = `Afgehaal deur: ${collectorName}`;
  }
  // --- EINDE VAN REGSTELLING #2 ---

  const { error: updateError } = await supabaseAdmin
    .from('shop_orders')
    .update(updateData)
    .eq('id', orderId);

  if (updateError) {
    console.error(`Failed to update status for order ${orderId}:`, updateError);
    return redirect(`/admin/winkel/bestellings/${orderId}?error=${encodeURIComponent(updateError.message)}`);
  }

  console.log(`Order ${orderId} status updated to ${newStatus}`);

  // --- 3. Stuur Kennisgewing E-pos (Indien nodig) ---
  if (
    newStatus === 'ready_for_collection' || 
    newStatus === 'cancelled' || 
    (newStatus === 'completed' && collectorName)
  ) {
    try {
      const customerInfo = await getOrderCustomerInfo(supabaseAdmin, orderId);
      if (!customerInfo.customerEmail) {
        throw new Error(`Geen e-pos gevind vir bestelling ${orderId} nie.`);
      }

      const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
      let emailHtml: string = '';
      let emailSubject: string = '';

      switch (newStatus) {
        case 'ready_for_collection':
          emailHtml = getOrderReadyForCollectionHtml(customerInfo);
          emailSubject = `Jou Britsie-Winkel Bestelling is Gereed vir Afhaal! (#${customerInfo.orderRef})`;
          break;
        case 'cancelled':
          emailHtml = getOrderCancelledHtml(customerInfo);
          emailSubject = `Jou Britsie-Winkel Bestelling is Gekanselleer (#${customerInfo.orderRef})`;
          break;
        case 'completed':
          emailHtml = getOrderCompletedHtml({ ...customerInfo, collectorName: collectorName! });
          emailSubject = `Jou Britsie-Winkel Bestelling is Afgehaal (#${customerInfo.orderRef})`;
          break;
      }

      await resend.emails.send({
        from: 'Hoërskool Brits Winkel <info@nicolabsdigital.co.za>',
        to: [customerInfo.customerEmail],
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`Kennisgewing-epos (${newStatus}) gestuur na ${customerInfo.customerEmail}`);

    } catch (emailError) {
      console.error(`Kon nie kennisgewing-epos stuur vir order ${orderId}:`, emailError);
      revalidatePath(`/admin/winkel/bestellings/${orderId}`);
      revalidatePath(`/admin/winkel/bestellings`);
      return redirect(`/admin/winkel/bestellings/${orderId}?error=Status opgedateer, maar kon nie e-pos stuur nie: ${emailError instanceof Error ? emailError.message : ''}`);
    }
  }

  // --- 4. Herlaai die bladsye ---
  revalidatePath(`/admin/winkel/bestellings/${orderId}`);
  revalidatePath(`/admin/winkel/bestellings`);
  
  redirect(`/admin/winkel/bestellings/${orderId}?success=Status opgedateer`);
}


/**
 * Hulpfunksie om kliënt-inligting te kry vir e-posse
 */
async function getOrderCustomerInfo(
  supabaseAdmin: SupabaseClient, 
  orderId: string
): Promise<OrderCustomerInfo> {
  
  // REGSTELLING #3: Ons haal nie 'email' uit 'profiles' nie, net 'full_name' en 'cell_phone'
  const { data: order, error } = await supabaseAdmin
    .from('shop_orders')
    .select('user_id, guest_name, guest_email, human_readable_id, total_amount, profiles(full_name, cell_phone)')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    // Hierdie is waar die 'profiles_1.email' fout vandaan gekom het
    console.error(`getOrderCustomerInfo DB Fout:`, error?.message);
    throw new Error(`Kon nie bestelling ${orderId} kry nie: ${error?.message}`);
  }

  let customerName: string = 'Britsie Kliënt';
  let customerEmail: string | null = null;

  if (order.user_id) {
    // Ingetekende gebruiker
    // REGSTELLING #4: Hanteer 'profiles' as 'n array
    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
    customerName = profile?.full_name || 'Britsie Kliënt';
    
    // Kry e-pos vanaf AUTH
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (userData && userData.user) {
        customerEmail = userData.user.email || null;
    }
  } else {
    // Gas-gebruiker
    customerName = order.guest_name || 'Kliënt';
    customerEmail = order.guest_email;
  }

  if (!customerEmail) {
    throw new Error('Kan nie kliënt e-posadres bepaal nie.');
  }

  return {
    customerName,
    customerEmail,
    orderRef: order.human_readable_id || orderId.substring(0, 8),
    orderTotal: new Intl.NumberFormat('af-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(order.total_amount)
  };
}