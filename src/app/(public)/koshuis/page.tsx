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

    // --- REGSTELLING: Opgedateerde "Baie-tot-Baie" Navraag ---
    // 1. Gaan haal slegs personeel wat 'n 'inner' join het op die departement-tabel
    //    waar daardie departement se naam 'Koshuispersoneel' is.
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments!inner ( id, name )
        `)
        .eq('is_active', true)
        .eq('staff_departments.name', 'Koshuispersoneel') // Hierdie filter werk nou korrek saam met '!inner'
        .order('sort_order');
    // --- EINDE VAN REGSTELLING ---

    if (error) {
        console.error("Fout met laai van koshuispersoneel:", error);
    }

    // Ons hoef nie meer hier te filtreer nie, die databasis het dit reeds gedoen.
    const koshuisPersoneel = (personeel as StaffMemberWithDept[]) || [];

    return (
        <KoshuisClientPage 
            koshuisPersoneel={koshuisPersoneel}
        />
    );
}