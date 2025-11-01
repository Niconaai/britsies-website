import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';

// --- GEBRUIK ONS NUWE TIPES ---
import ApplicationDetailView from "./ApplicationDetailView";
import type { RawApplicationData, CleanApplicationData } from "@/types/supabase";


type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>
};

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const supabase = await createClient();
  const { id: applicationId } = await params;

  // --- 1. Admin & Auth-tjek ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/');
  }
  // --- Einde van Auth-tjek ---

  // --- 2. Gaan Haal Rou Data ---
  const { data: rawData, error: fetchError } = await supabase
    .from('applications')
    .select(`
      *,
      learners(*),
      guardians(*),
      payers(*),
      uploaded_files(*)
    `)
    .eq('id', applicationId)
    .single(); 

  // --- 3. Hanteer Foute ---
  if (fetchError || !rawData) {
    console.error(`Error fetching application ${applicationId}:`, fetchError);
    return notFound(); 
  }

  // --- 4. DATA TRANSFORMASIE (Soos jy voorgestel het) ---
  const rawApplication = rawData as RawApplicationData;
  
  // Skep die skoon data-objek wat by ons besigheidslogika pas
  const cleanData: CleanApplicationData = {
    ...rawApplication, // Smeer al die 'application' velde (id, status, ens.)
    learner: rawApplication.learners?.[0] || null, // Vat die eerste (en enigste) leerder
    payer: rawApplication.payers?.[0] || null,     // Vat die eerste (en enigste) betaler
    guardians: rawApplication.guardians || [],   // Maak seker dis 'n skikking
    uploaded_files: rawApplication.uploaded_files || [] // Maak seker dis 'n skikking
  };
  // --- EINDE VAN TRANSFORMASIE ---

  // --- 5. VERTOON DIE NUWE UI ---
  return (
    <div className="p-6"> 
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Hersien Aansoek
        </h1>
        <Link
          href="/admin"
          className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Terug na Lys
        </Link>
      </div>

      {/* Stuur die "skoon" data na die UI komponent */}
      <ApplicationDetailView application={cleanData} />
      
    </div>
  );
}