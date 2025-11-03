// src/app/winkel/checkout/actions.ts
'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";
import type { DbProfile } from "@/types/supabase";

/**
 * Gaan haal die ingetekende gebruiker se profiel-inligting.
 */
export async function getUserProfile(): Promise<DbProfile | null> {
  const supabase = await createClient(); //

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null; 
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Fout in getUserProfile: SUPABASE_SERVICE_ROLE_KEY is nie opgestel nie.");
    return null;
  }
  const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey);
  
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select(
      'id, role, full_name, cell_phone, shipping_address_line1, shipping_address_line2, shipping_city, shipping_province, shipping_code'
    )
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error("Checkout: Kon nie profiel vind vir ingetekende gebruiker:", user.id, error);
    return null;
  }

  const userEmail = user.email;
  // Ons forseer die tipe-omskakeling (type assertion) hier.
  return { ...profile, email: userEmail } as DbProfile;
}

// Die createOrderAndInitiatePayment funksie is VERWYDER 
// en woon nou in /api/yoco/create-checkout/route.ts