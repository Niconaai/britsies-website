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
export type OrganiserWithDetails = {
  id: string;
  staff_member_id: string;
  role: string | null;
  staff_members: Pick<DbStaffMember, 'full_name' | 'image_url' | 'title'> | null;
  activities: { name: string }[];
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

    // Group organisers by staff member and aggregate their activities
    const groupedOrganisers: OrganiserWithDetails[] = [];
    const organiserMap = new Map<string, OrganiserWithDetails>();

    (organisers || []).forEach((org: any) => {
        const key = org.staff_member_id;
        
        if (organiserMap.has(key)) {
            // Add activity to existing organiser
            const existing = organiserMap.get(key)!;
            if (org.culture_activities?.name) {
                existing.activities.push({ name: org.culture_activities.name });
            }
        } else {
            // Create new grouped organiser
            organiserMap.set(key, {
                id: org.id,
                staff_member_id: org.staff_member_id,
                role: org.role,
                staff_members: org.staff_members,
                activities: org.culture_activities?.name ? [{ name: org.culture_activities.name }] : []
            });
        }
    });

    groupedOrganisers.push(...organiserMap.values());

    // 2. Stuur die data na die kliënt-komponent
    return (
        <KultuurClientPage 
            activities={activities as DbCultureActivity[] || []}
            organisers={groupedOrganisers}
        />
    );
}