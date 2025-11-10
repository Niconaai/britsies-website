// src/app/admin/kultuur/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { 
  DbProfile,
  DbStaffMember,
  DbCultureActivity,
  DbCultureOrganiser
} from "@/types/supabase";
import KultuurManagementClient from './KultuurManagementClient';

// Tipe vir organiseerders met personeel- en aktiwiteit-inligting
export type OrganiserWithDetails = DbCultureOrganiser & {
  staff_members: Pick<DbStaffMember, 'full_name'> | null;
  culture_activities: Pick<DbCultureActivity, 'name'> | null;
};

export default async function KultuurAdminPage() {
  const supabase = await createClient();

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

  // --- 2. Gaan Haal Al die Data ---
  const activitiesResult = supabase.from('culture_activities').select('*').order('sort_order');
  const staffMembersResult = supabase.from('staff_members').select('id, full_name').eq('is_active', true).order('full_name');
  const organisersResult = supabase
    .from('culture_organisers')
    .select(`
      *,
      staff_members ( full_name ),
      culture_activities ( name )
    `)
    .order('created_at');

  // Wag vir al die navrae
  const [
    { data: activities, error: activitiesError },
    { data: staffMembers, error: staffMembersError },
    { data: organisers, error: organisersError },
  ] = await Promise.all([
    activitiesResult,
    staffMembersResult,
    organisersResult,
  ]);

  if (activitiesError || staffMembersError || organisersError) {
    console.error("Fout met laai van kultuurdata:", 
      activitiesError || staffMembersError || organisersError
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Kultuurbestuur
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bestuur kultuur-aktiwiteite en organiseerders vir die publieke webwerf.
      </p>

      {/* Stuur al die gelaaide data na die kliënt-komponent */}
      <KultuurManagementClient
        initialActivities={activities as DbCultureActivity[] || []}
        initialStaffMembers={staffMembers as Pick<DbStaffMember, 'id' | 'full_name'>[] || []}
        initialOrganisers={organisers as OrganiserWithDetails[] || []}
      />
    </div>
  );
}