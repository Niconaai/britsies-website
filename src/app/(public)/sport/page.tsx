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
export type OrganiserWithDetails = {
  id: string;
  staff_member_id: string | null;
  external_coach_name: string | null;
  role: string | null;
  staff_members: Pick<DbStaffMember, 'full_name' | 'image_url' | 'title'> | null;
  sports: { name: string }[];
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

    // Group organisers by staff member and aggregate their sports
    const groupedOrganisers: OrganiserWithDetails[] = [];
    const organiserMap = new Map<string, OrganiserWithDetails>();

    (organisers || []).forEach((org: any) => {
        // Create a unique key - use staff_member_id if available, otherwise external_coach_name
        const key = org.staff_member_id || `external_${org.external_coach_name}`;
        
        if (organiserMap.has(key)) {
            // Add sport to existing organiser
            const existing = organiserMap.get(key)!;
            if (org.sport_types?.name) {
                existing.sports.push({ name: org.sport_types.name });
            }
        } else {
            // Create new grouped organiser
            organiserMap.set(key, {
                id: org.id,
                staff_member_id: org.staff_member_id,
                external_coach_name: org.external_coach_name,
                role: org.role,
                staff_members: org.staff_members,
                sports: org.sport_types?.name ? [{ name: org.sport_types.name }] : []
            });
        }
    });

    groupedOrganisers.push(...organiserMap.values());

    // 2. Stuur die data na die kliënt-komponent
    return (
        <SportClientPage 
            sportTypes={sportTypes as DbSportType[] || []}
            organisers={groupedOrganisers} // Stuur nou gegroepeerde 'organisers'
            achievements={achievements as DbSportAchievement[] || []}
        />
    );
}