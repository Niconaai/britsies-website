// src/app/admin/instellings/actions.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Hulpfunksie om admin te kontroleer
async function checkAdminAuth() {
  const supabase = await createClient(); //
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') throw new Error("Not authorized");
  
  return supabase;
}

// Bediener-aksie om die instellings op te dateer
export async function updateSettings(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const applicationEmail = formData.get('application_admin_email') as string;
  const shopEmail = formData.get('shop_manager_email') as string;

  // Ons gebruik 'upsert' om die rekords te skep of op te dateer
  const { error } = await supabase
    .from('system_settings')
    .upsert([
      { key: 'application_admin_email', value: applicationEmail },
      { key: 'shop_manager_email', value: shopEmail }
    ]);

  if (error) {
    console.error("Fout met opdatering van instellings:", error);
    return redirect('/admin/instellings?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/admin/instellings');
  return redirect('/admin/instellings?success=true');
}