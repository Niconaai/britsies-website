// src/app/winkel/checkout/actions.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import type { DbProfile } from "@/types/supabase";

type PaymentResult = 
  | { success: true; url: string; } 
  | { success: false; error: string; };

export async function getUserProfile(): Promise<DbProfile | null> {
  const supabase = await createClient(); //

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      'id, created_at, role, full_name, cell_phone, email, shipping_address_line1, shipping_address_line2, shipping_city, shipping_province, shipping_code'
    )
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error("Checkout: Kon nie profiel vind vir ingetekende gebruiker:", user.id, error);
    return null;
  }

  // Voeg die gebruiker se e-pos by (wat in 'auth.users' tabel is)
  const userEmail = user.email || profile.email;

  return { ...profile, email: userEmail } as DbProfile;
}

/**
 * STAP 2: Skep die bestelling en stuur na Yoco.
 * Ons sal hierdie later implementeer.
 */
export async function createOrderAndInitiatePayment(formData: FormData): Promise<PaymentResult> {
  'use server';
  
  const data = Object.fromEntries(formData);
  console.log("--- NUWE BESTELLING WORD GESKEP ---");
  console.log(data);
  console.log("---------------------------------");
  
  // TODO:
  // 1. Valideer die data
  // 2. Skep `shop_orders` rekord (met 'pending_payment')
  // 3. Skep `shop_order_items` rekords
  // 4. Roep Yoco API met die `order_id` en `total_amount`
  // 5. Stuur die Yoco `checkout_url` terug na die kliënt

  // Vir nou, stuur ons net 'n toets-URL terug
  // const checkout_url = "https://pay.yoco.com/..."
  // return { success: true, url: checkout_url };

  // Vir eers, stuur ons na 'n tydelike sukses-bladsy
  // redirect(`/winkel/bestelling/sukses/test-order-id`);
  
  return { success: false, error: "Yoco-integrasie is nog nie opgestel nie." };
}