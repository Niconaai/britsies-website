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
    // 1. Gaan haal alle personeel wat aktief is
    // 2. "Join" deur 'staff_departments'
    // 3. Filter waar die departement se naam "Bestuur" OF "Beheerliggaam" is.
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments ( id, name )
        `)
        .eq('is_active', true)
        .or('staff_departments.name.eq.Bestuur,staff_departments.name.eq.Beheerliggaam');

    if (error) {
        console.error("Fout met laai van personeel vir /oor-ons:", error);
    }

    const allePersoneel = (personeel as StaffMemberWithDept[]) || [];

    // 2. Filtreer die personeel in hul groepe in
    // 'n Persoon kan in albei groepe wees, so ons filter op die 'staff_departments' skikking
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