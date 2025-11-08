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

    // 1. Gaan haal alle personeel wat 'n departement het
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments ( name )
        `)
        .eq('is_active', true)
        .not('staff_departments', 'is', null) // Verseker ons het departement-inligting
        .order('sort_order');

    if (error) {
        console.error("Fout met laai van personeel vir /oor-ons:", error);
    }

    const allePersoneel = (personeel as StaffMemberWithDept[]) || [];

    // 2. Filtreer die personeel in hul groepe in
    const bestuurPersoneel = allePersoneel.filter(
        p => p.staff_departments?.name === 'Bestuur'
    );
    
    const beheerliggaamPersoneel = allePersoneel.filter(
        p => p.staff_departments?.name === 'Beheerliggaam'
    );

    // 3. Stuur die gefiltreerde lyste na die kliënt-komponent
    return (
        <OorOnsClientPage 
            bestuurPersoneel={bestuurPersoneel}
            beheerliggaamPersoneel={beheerliggaamPersoneel}
        />
    );
}