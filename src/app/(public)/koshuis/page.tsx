// src/app/(public)/koshuis/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import KoshuisClientPage from "./KoshuisClientPage";
import type { StaffMemberWithDept } from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Koshuis",
    description: "Ontdek die koshuislewe by Hoërskool Brits en ons alles-in-een pakket.",
};

export default async function KoshuisPage() {
    const supabase = await createClient();

    // 1. Gaan haal slegs koshuispersoneel
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments ( name )
        `)
        .eq('is_active', true)
        .eq('staff_departments.name', 'Koshuispersoneel') // Filter op departement
        .order('sort_order');

    if (error) {
        console.error("Fout met laai van koshuispersoneel:", error);
    }

    // 2. Stuur die data na die kliënt-komponent
    return (
        <KoshuisClientPage 
            koshuisPersoneel={(personeel as StaffMemberWithDept[]) || []}
        />
    );
}