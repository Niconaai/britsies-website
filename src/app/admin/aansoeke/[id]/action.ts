// src/app/admin/aansoeke/[id]/action.ts
'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from 'resend';
import { 
  getApplicationApprovedHtml,
  getApplicationWaitlistedHtml,
  getApplicationRejectedHtml 
} from '@/utils/emailTemplates';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Tipe om die e-pos funksie te help
type ApplicationCustomerInfo = {
  customerName: string; // Ouernaam
  customerEmail: string; // Ouer e-pos
  learnerName: string;
  humanReadableId: string;
}

/**
 * 'n Interne hulp-funksie om admin-status te verifieer.
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
 * Hulpfunksie om kliënt-inligting te kry vir e-posse
 */
async function getApplicationCustomerInfo(
  supabaseAdmin: SupabaseClient, 
  applicationId: string
): Promise<ApplicationCustomerInfo> {
  
  const { data: app, error } = await supabaseAdmin
    .from('applications')
    .select(`
      human_readable_id,
      user_id,
      learners ( first_names, surname ),
      guardians ( first_name, surname, email, guardian_type )
    `)
    .eq('id', applicationId)
    .single();

  if (error || !app) {
    console.error(`getApplicationCustomerInfo DB Fout:`, error?.message);
    throw new Error(`Kon nie aansoek ${applicationId} kry nie: ${error?.message}`);
  }

  // Kry die ouer (user) se e-pos
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(app.user_id);
  const customerEmail = userData.user?.email;
  if (!customerEmail) {
    throw new Error('Kan nie kliënt e-posadres bepaal nie.');
  }
  
  // Kry Ouer 1 se naam
  const guardian1 = (app.guardians as any[])?.find(g => g.guardian_type === 'Ouer 1');
  const customerName = guardian1 ? `${guardian1.first_name || ''} ${guardian1.surname || ''}`.trim() : 'Geagte Ouer';
  
  // Kry Leerder se naam
  const learner = (app.learners as any[])?.[0];
  const learnerName = learner ? `${learner.first_names || ''} ${learner.surname || ''}`.trim() : 'u Kind';

  return {
    customerName,
    customerEmail,
    learnerName,
    humanReadableId: app.human_readable_id || applicationId.substring(0, 8),
  };
}


/**
 * Hanteer die opdatering van 'n aansoek se status.
 */
export async function updateApplicationStatus(formData: FormData) {
  const supabase = await createClient();
  
  const applicationId = formData.get('applicationId') as string;
  const newStatus = formData.get('status') as string;

  if (!applicationId || !newStatus) {
    // Kan nie 'n ID kry nie, stuur terug na die hooflys
    return redirect(`/admin/aansoeke/hangende?error=Ongeldige data`);
  }

  // --- 1. Magtiging-tjek ---
  try {
    await checkAdminAuth(supabase);
  } catch (authError) {
    return redirect('/login');
  }

  // Skep die Service Role kliënt
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // --- NUWE REGEL #1: Gaan eers die huidige status na ---
  const { data: currentApp, error: fetchError } = await supabaseAdmin
    .from('applications')
    .select('status')
    .eq('id', applicationId)
    .single();

  if (fetchError || !currentApp) {
    return redirect(`/admin/aansoeke/hangende?error=Kon nie aansoek vind nie.`);
  }

  // BLOKKEER die aksie as die status finaal is
  if (currentApp.status === 'approved' || currentApp.status === 'rejected') {
    return redirect(`/admin/aansoeke/${applicationId}?error=Hierdie aansoek is finaal en kan nie meer gewysig word nie.`);
  }
  // --- EINDE VAN NUWE REGEL #1 ---


  // --- 2. Dateer die status op ---
  const { error } = await supabaseAdmin
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId);

  if (error) {
    console.error("Failed to update status:", error);
    return redirect(`/admin/aansoeke/${applicationId}?error=${encodeURIComponent(error.message)}`);
  }

  console.log(`Application ${applicationId} status updated to ${newStatus}`);

  // --- 3. Stuur Kennisgewing E-pos ---
  if (
    newStatus === 'approved' || 
    newStatus === 'waitlisted' || 
    newStatus === 'rejected'
  ) {
    try {
      const customerInfo = await getApplicationCustomerInfo(supabaseAdmin, applicationId);
      if (!customerInfo.customerEmail) {
        throw new Error(`Geen e-pos gevind vir aansoek ${applicationId} nie.`);
      }

      const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
      let emailHtml: string = '';
      let emailSubject: string = '';

      switch (newStatus) {
        case 'approved':
          emailHtml = getApplicationApprovedHtml(customerInfo);
          emailSubject = `Uitslag: Aansoek vir ${customerInfo.learnerName} was Suksesvol`;
          break;
        case 'waitlisted':
          emailHtml = getApplicationWaitlistedHtml(customerInfo);
          emailSubject = `Uitslag: Aansoek vir ${customerInfo.learnerName} is op die Waglys`;
          break;
        case 'rejected':
          emailHtml = getApplicationRejectedHtml(customerInfo);
          emailSubject = `Uitslag: Aansoek vir ${customerInfo.learnerName} was onsuksesvol`;
          break;
      }

      await resend.emails.send({
        from: 'Hoërskool Brits Aansoeke <info@nicolabsdigital.co.za>',
        to: [customerInfo.customerEmail],
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`Kennisgewing-epos (${newStatus}) gestuur na ${customerInfo.customerEmail}`);

    } catch (emailError) {
      console.error(`Kon nie kennisgewing-epos stuur vir aansoek ${applicationId}:`, emailError);
      // Gaan voort selfs al het e-pos misluk, maar ons sal die 'redirect' hieronder hanteer
    }
  }

  // --- 4. Herlaai die bladsye ---
  revalidatePath(`/admin/aansoeke/${applicationId}`);
  revalidatePath(`/admin/aansoeke/hangende`);
  revalidatePath(`/admin/aansoeke/goedgekeur`);
  revalidatePath(`/admin/aansoeke/afgekeur`);
  revalidatePath(`/admin/aansoeke/waglys`);
  
  // --- NUWE REGEL #2: Stuur terug na die "Hangende" lys ---
  const friendlyName = (applicationId || 'Aansoek').substring(0, 8);
  redirect(`/admin/aansoeke/hangende?success=Status vir #${friendlyName}... opgedateer!`);
}


// +++ FUNKSIES VIR LÊERS (Bly dieselfde) +++
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