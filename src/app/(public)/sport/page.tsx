// src/app/(public)/sport/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import SportClientPage from "./SportClientPage";
import type { 
    DbSportType, 
    DbSportCoach, 
    DbStaffMember, 
    DbSportAchievement 
} from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Sport",
    description: "Ontdek die sport-aanbod, organiseerders, en prestasies by Hoërskool Brits.",
};

// Hierdie tipe is nou meer spesifiek vir 'Organiseerders'
export type OrganiserWithDetails = DbSportCoach & {
  staff_members: Pick<DbStaffMember, 'full_name' | 'image_url' | 'title'> | null; // Vra ook 'title'
  sport_types: Pick<DbSportType, 'name'> | null;
};

export default async function SportPage() {
    const supabase = await createClient();

    // 1. Gaan haal die data gelyktydig
    const sportTypesResult = supabase
        .from('sport_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
        
    // --- REGSTELLING: Filter slegs vir "Organiseerder" ---
    const organisersResult = supabase
        .from('sport_coaches')
        .select(`
            *,
            staff_members ( full_name, image_url, title ),
            sport_types ( name )
        `)
        .eq('is_active', true)
        .ilike('role', '%Organiseerder%'); // Filter vir rol
        // --- EINDE VAN REGSTELLING ---

    const achievementsResult = supabase
        .from('sport_achievements')
        .select('*')
        .eq('is_active', true)
        .order('achievement_date', { ascending: false });

    const [
        { data: sportTypes, error: sportTypesError },
        { data: organisers, error: coachesError }, // Hernoem vir duidelikheid
        { data: achievements, error: achievementsError }
    ] = await Promise.all([sportTypesResult, organisersResult, achievementsResult]);

    if (sportTypesError || coachesError || achievementsError) {
        console.error("Fout met laai van sport-bladsy data:", 
            sportTypesError || coachesError || achievementsError
        );
    }

    // 2. Stuur die data na die kliënt-komponent
    return (
        <SportClientPage 
            sportTypes={sportTypes as DbSportType[] || []}
            organisers={organisers as OrganiserWithDetails[] || []} // Stuur nou 'organisers'
            achievements={achievements as DbSportAchievement[] || []}
        />
    );
}