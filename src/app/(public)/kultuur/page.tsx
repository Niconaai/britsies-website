// src/app/(public)/kultuur/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import KultuurClientPage from "./KultuurClientPage";
import type { 
    DbCultureActivity, 
    DbCultureOrganiser, 
    DbStaffMember 
} from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Kultuur",
    description: "Ontdek die ryk kultuur-aanbod, organiseerders, en aktiwiteite by Hoërskool Brits.",
};

// 'n Gekombineerde tipe vir ons organiseerder-navraag
export type OrganiserWithDetails = DbCultureOrganiser & {
  staff_members: Pick<DbStaffMember, 'full_name' | 'image_url' | 'title'> | null;
  culture_activities: Pick<DbCultureActivity, 'name'> | null;
};

export default async function KultuurPage() {
    const supabase = await createClient();

    // 1. Gaan haal al die data gelyktydig
    const activitiesResult = supabase
        .from('culture_activities')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
        
    const organisersResult = supabase
        .from('culture_organisers')
        .select(`
            *,
            staff_members ( full_name, image_url, title ),
            culture_activities ( name )
        `)
        .eq('is_active', true)
        .order('role');

    const [
        { data: activities, error: activitiesError },
        { data: organisers, error: organisersError },
    ] = await Promise.all([activitiesResult, organisersResult]);

    if (activitiesError || organisersError) {
        console.error("Fout met laai van kultuur-bladsy data:", 
            activitiesError || organisersError
        );
    }

    // 2. Stuur die data na die kliënt-komponent
    return (
        <KultuurClientPage 
            activities={activities as DbCultureActivity[] || []}
            organisers={organisers as OrganiserWithDetails[] || []}
        />
    );
}