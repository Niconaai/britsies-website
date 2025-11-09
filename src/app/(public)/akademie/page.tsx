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
        name: string;
        sort_order: number | null;
    } | null;
};

export default async function AkademiePage() {
    const supabase = await createClient();

    // 1. Gaan haal alle personeel
    const { data: personeel, error } = await supabase
        .from('staff_members')
        .select(`
            *,
            staff_departments ( name, sort_order )
        `)
        .eq('is_active', true)
        .not('staff_departments', 'is', null);

    if (error) {
        console.error("Fout met laai van personeel vir /akademie:", error);
    }

    const allePersoneel = (personeel as StaffWithDeptSort[]) || [];

    // 2. Filtreer die personeel
    const akademiesePersoneel = allePersoneel.filter(
        p => p.staff_departments?.name !== 'Beheerliggaam'
    );
    
    // 3. Sorteer hulle: Eers volgens departement se 'sort_order', dan personeel se 'sort_order'
    akademiesePersoneel.sort((a, b) => {
        const deptA_Sort = a.staff_departments?.sort_order ?? 99;
        const deptB_Sort = b.staff_departments?.sort_order ?? 99;
        
        if (deptA_Sort !== deptB_Sort) {
            return deptA_Sort - deptB_Sort;
        }
        
        const staffA_Sort = a.sort_order ?? 99;
        const staffB_Sort = b.sort_order ?? 99;
        return staffA_Sort - staffB_Sort;
    });

    // 4. Groepeer die personeel per departement
    const personeelPerDepartement = akademiesePersoneel.reduce((acc, person) => {
        const deptName = person.staff_departments?.name || 'Ander';
        if (!acc[deptName]) {
            acc[deptName] = [];
        }
        acc[deptName].push(person);
        return acc;
    }, {} as Record<string, StaffMemberWithDept[]>);


    // 5. Stuur die gegroepeerde data na die kliënt-komponent
    return (
        <AkademieClientPage 
            personeelPerDepartement={personeelPerDepartement}
        />
    );
}