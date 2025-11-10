// src/app/(public)/akademie/page.tsx
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import AkademieClientPage from "./AkademieClientPage";
import type { StaffMemberWithDept } from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Akademie",
    description: "Verken die akademiese aanbod, vakkeuses en personeel van Hoërskool Brits.",
};

// 'n Tipe-uitbreiding om seker te maak ons sorteer-data bestaan
type StaffWithDeptSort = StaffMemberWithDept & {
    staff_departments: {
        id: string;
        name: string;
        sort_order: number | null;
    }[] | null;
};

export default async function AkademiePage() {
    const supabase = await createClient();

    // --- REGSTELLING: Opgedateerde "Baie-tot-Baie" Navraag ---
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments!inner ( id, name, sort_order )
        `)
        .eq('is_active', true)
        // Sluit personeel uit wat 'n koppeling aan Beheerliggaam het.
        // Let wel: As 'n personeellid in 'Wiskunde' EN 'Beheerliggaam' is, 
        // sal hierdie navraag hulle steeds wys, maar net met hul Wiskunde-departement.
        // Ons sal die finale filtering in kode doen.
        .not('staff_departments.name', 'eq', 'Beheerliggaam'); 

    if (error) {
        console.error("Fout met laai van personeel vir /akademie:", error);
    }

    const allePersoneel = (personeel as StaffWithDeptSort[]) || [];

    // --- Groepeer die personeel per departement ---
    const personeelPerDepartement: Record<string, StaffMemberWithDept[]> = {};
    const departementVolgorde: Record<string, number> = {};
    const departementName: Record<string, string> = {};

    for (const person of allePersoneel) {
        if (person.staff_departments) {
            for (const dept of person.staff_departments) {
                // Maak seker ons sluit 'Beheerliggaam' finaal uit
                if (dept.name === 'Beheerliggaam') continue;

                if (!personeelPerDepartement[dept.name]) {
                    personeelPerDepartement[dept.name] = [];
                    departementVolgorde[dept.name] = dept.sort_order || 99;
                    departementName[dept.name] = dept.name;
                }
                
                // Voorkom duplikate as 'n persoon op een of ander manier twee keer gelaai word
                if (!personeelPerDepartement[dept.name].find(p => p.id === person.id)) {
                    // Voeg 'n "skoon" weergawe van die persoon by
                    // (ons het nie nodig dat die departement-skikking al die *ander* departemente wys nie)
                    personeelPerDepartement[dept.name].push({
                        ...person,
                        staff_departments: [{ id: dept.id, name: dept.name, sort_order: dept.sort_order }]
                    });
                }
            }
        }
    }

    // Sorteer die departement-name self gebaseer op hul 'sort_order'
    const gesorteerdeDepartementName = Object.keys(departementName).sort((a, b) => {
        return departementVolgorde[a] - departementVolgorde[b];
    });
    
    // Skep 'n nuwe 'Record' (objek) wat die gesorteerde volgorde respekteer
    const gesorteerdePersoneelPerDepartement: Record<string, StaffMemberWithDept[]> = {};
    for (const deptName of gesorteerdeDepartementName) {
        gesorteerdePersoneelPerDepartement[deptName] = personeelPerDepartement[deptName];
        
        // Sorteer ook die personeel *binne* daardie departement
        gesorteerdePersoneelPerDepartement[deptName].sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
    }

    // --- Stuur die gesorteerde en gegroepeerde data na die kliënt ---
    return (
        <AkademieClientPage 
            personeelPerDepartement={gesorteerdePersoneelPerDepartement}
        />
    );
}