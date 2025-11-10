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

    // --- REGSTELLING: Opgedateerde "Baie-tot-Baie" Navraag ---
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments!inner ( id, name )
        `)
        .eq('is_active', true)
        // Haal enigiemand wat in EEN van hierdie twee departemente is
        .in('staff_departments.name', ['Bestuur', 'Beheerliggaam']);

    if (error) {
        console.error("Fout met laai van personeel vir /oor-ons:", error);
    }

    const allePersoneel = (personeel as StaffMemberWithDept[]) || [];

    // 2. Filtreer die personeel in hul groepe in
    const bestuurPersoneel = allePersoneel.filter(
        p => p.staff_departments?.some(dept => dept.name === 'Bestuur')
    );
    
    const beheerliggaamPersoneel = allePersoneel.filter(
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