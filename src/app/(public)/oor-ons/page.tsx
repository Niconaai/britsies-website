// src/app/(public)/oor-ons/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import OorOnsClientPage from "./OorOnsClientPage";
import type { StaffMemberWithDept } from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Oor Ons",
    description: "Leer meer oor die visie, missie, leierskap en geskiedenis van Hoërskool Brits.",
};

export default async function OorOnsPage() {
    const supabase = await createClient();

    // Fetch all active staff with ALL their departments
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments ( id, name )
        `)
        .eq('is_active', true);

    if (error) {
        console.error("Fout met laai van personeel vir /oor-ons:", error);
    }

    const allePersoneel = (personeel as StaffMemberWithDept[]) || [];

    // Filter to only include people who have Bestuur or Beheerliggaam
    const relevantPersoneel = allePersoneel.filter(p => 
        p.staff_departments?.some(dept => dept.name === 'Bestuur' || dept.name === 'Beheerliggaam')
    );

    // Further filter into groups
    const bestuurPersoneel = relevantPersoneel.filter(
        p => p.staff_departments?.some(dept => dept.name === 'Bestuur')
    );
    
    const beheerliggaamPersoneel = relevantPersoneel.filter(
        p => p.staff_departments?.some(dept => dept.name === 'Beheerliggaam')
    );

    // 3. Stuur die gefiltreerde lyste na die kliënt-komponent
    return (
        <OorOnsClientPage 
            bestuurPersoneel={bestuurPersoneel}
            beheerliggaamPersoneel={beheerliggaamPersoneel}
        />
    );
}