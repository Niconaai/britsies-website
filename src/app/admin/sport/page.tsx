// src/app/admin/sport/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { 
  DbProfile,
  DbStaffMember,
  DbSportType,
  DbSportCoach,
  DbSportTeam,
  DbSportAchievement
} from "@/types/supabase";
import SportManagementClient from './SportManagementClient';

// Tipe vir afrigters met personeel- en sport-inligting
export type CoachWithDetails = DbSportCoach & {
  staff_members: Pick<DbStaffMember, 'full_name'> | null;
  sport_types: Pick<DbSportType, 'name'> | null;
};

export default async function SportAdminPage() {
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
  const sportTypesResult = supabase.from('sport_types').select('*').order('sort_order');
  const staffMembersResult = supabase.from('staff_members').select('id, full_name').eq('is_active', true).order('full_name');
  const coachesResult = supabase
    .from('sport_coaches')
    .select(`
      *,
      staff_members ( full_name ),
      sport_types ( name )
    `)
    .order('created_at');
  
  const achievementsResult = supabase.from('sport_achievements').select('*').order('achievement_date', { ascending: false });

  // Wag vir al die navrae
  const [
    { data: sportTypes, error: sportTypesError },
    { data: staffMembers, error: staffMembersError },
    { data: coaches, error: coachesError },
    { data: achievements, error: achievementsError },
  ] = await Promise.all([
    sportTypesResult,
    staffMembersResult,
    coachesResult,
    achievementsResult
  ]);

  // --- BEGIN REGSTELLING: Beter Foutopsporing ---
  let hasError = false;
  if (sportTypesError) {
    console.error("Fout met laai van sport_types:", sportTypesError);
    hasError = true;
  }
  if (staffMembersError) {
    console.error("Fout met laai van staff_members:", staffMembersError);
    hasError = true;
  }
  if (coachesError) {
    console.error("Fout met laai van sport_coaches:", coachesError);
    hasError = true;
  }
  if (achievementsError) {
    console.error("Fout met laai van sport_achievements:", achievementsError);
    hasError = true;
  }
  // --- EINDE REGSTELLING ---

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Sportbestuur
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bestuur sportsoorte, afrigters, en prestasies vir die publieke webwerf.
      </p>

      {/* Wys 'n foutboodskap as enige navraag misluk het */}
      {hasError && (
        <div className="my-4 rounded-md bg-red-100 p-4 text-red-800">
          <p className="font-bold">Kon nie al die data laai nie.</p>
          <p className="text-sm">Gaan asseblief die bediener-console (terminal) na vir die spesifieke foutboodskap.</p>
        </div>
      )}

      <SportManagementClient
        initialSportTypes={sportTypes as DbSportType[] || []}
        initialStaffMembers={staffMembers as Pick<DbStaffMember, 'id' | 'full_name'>[] || []}
        initialCoaches={coaches as CoachWithDetails[] || []}
        initialAchievements={achievements as DbSportAchievement[] || []}
      />
    </div>
  );
}