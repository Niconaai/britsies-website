// src/app/admin/winkel/bestellings/[orderid]/action.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Hanteer die opdatering van 'n bestelling se status.
 */
export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();
  
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

  if (!orderId || !newStatus) {
    console.error("Missing order ID or new status");
    return redirect('/admin/winkel/bestellings?error=Ongeldige data');
  }

  // --- 2. Dateer die status op ---
  const { error } = await supabase
    .from('shop_orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    return redirect(`/admin/winkel/bestellings/${orderId}?error=${encodeURIComponent(error.message)}`);
  }

  console.log(`Order ${orderId} status updated to ${newStatus}`);

  // --- 3. Herlaai die bladsye ---
  revalidatePath(`/admin/winkel/bestellings/${orderId}`);
  revalidatePath(`/admin/winkel/bestellings`);
  
  // Stuur terug na die lys-bladsy
  redirect('/admin/winkel/bestellings');
}