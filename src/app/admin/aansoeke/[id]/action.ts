// src/app/admin/aansoeke/[id]/actions.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Hanteer die opdatering van 'n aansoek se status.
 */
export async function updateApplicationStatus(formData: FormData) {
  const supabase = await createClient();
  
  const applicationId = formData.get('applicationId') as string;
  const newStatus = formData.get('status') as string;

  if (!applicationId || !newStatus) {
    console.error("Missing application ID or new status");
    return; // TODO: Stuur foutboodskap terug
  }

  // --- 1. Magtiging-tjek ---
  try {
    await checkAdminAuth(supabase);
  } catch (authError) {
    console.error("Auth error in updateApplicationStatus:", authError);
    return redirect('/login');
  }
  // --- Einde van Magtiging ---

  // --- 2. Dateer die status op ---
  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId);

  if (error) {
    console.error("Failed to update status:", error);
    // TODO: Stuur 'n foutboodskap terug
    return;
  }

  console.log(`Application ${applicationId} status updated to ${newStatus}`);

  // --- 3. Herlaai die bladsy ---
  revalidatePath(`/admin/aansoeke/${applicationId}`);
  revalidatePath(`/admin`);
}

// +++ FUNKSIES VIR LÊERS +++

/**
 * 'n Interne hulp-funksie om admin-status te verifieer.
 * Dit sal 'n fout gooi as die gebruiker nie 'n admin is nie.
 */
async function checkAdminAuth(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("checkAdminAuth: No user found.");
    throw new Error("Not authenticated");
  }
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (error) {
     console.error("checkAdminAuth: Error fetching profile.", error);
     throw new Error("Profile not found");
  }

  if (profile?.role !== 'admin') {
    console.error(`checkAdminAuth: User ${user.id} is not an admin.`);
    throw new Error("User is not an admin");
  }
  
  return user;
}

/**
 * Genereer 'n veilige, tydelike skakel om 'n lêer te BEKYK
 */
export async function getSecureFileViewUrl(storagePath: string): Promise<string> {
  if (!storagePath) {
    throw new Error("No storage path provided.");
  }
  
  const supabase = await createClient();
  
  try {
    await checkAdminAuth(supabase); // Beveilig die funksie
  } catch (authError) {
     return redirect('/login');
  }

  const { data, error } = await supabase.storage
    .from('application-uploads')
    .createSignedUrl(storagePath, 60, { // Skakel is 60 sekondes geldig
      download: false // Laat blaaier toe om lêer te wys (inline)
    });

  if (error) {
    console.error("Error creating signed URL for view:", error);
    throw new Error(error.message);
  }
  
  return data.signedUrl;
}

/**
 * Genereer 'n veilige, tydelike skakel om 'n lêer AF TE LAAI
 */
export async function getSecureFileDownloadUrl(storagePath: string): Promise<string> {
  if (!storagePath) {
    throw new Error("No storage path provided.");
  }

  const supabase = await createClient();
  
  try {
    await checkAdminAuth(supabase); // Beveilig die funksie
  } catch (authError) {
     return redirect('/login');
  }

  const { data, error } = await supabase.storage
    .from('application-uploads')
    .createSignedUrl(storagePath, 60, { // Skakel is 60 sekondes geldig
      download: true // Forseer 'n aflaai-dialoog
    });
    
  if (error) {
    console.error("Error creating signed URL for download:", error);
    throw new Error(error.message);
  }
  
  return data.signedUrl;
}