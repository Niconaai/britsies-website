// src/app/admin/personeel/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StaffManagementClient from "./StaffManagementClient";

// Voer die tipes in wat ons in src/types/supabase.ts bygevoeg het
import type { 
  DbProfile,
  DbStaffDepartment,
  StaffMemberWithDept
} from "@/types/supabase"; 

export default async function StaffPage() {
  const supabase = await createClient();

  // --- 1. Admin & Auth-tjek ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/');
  }
  // --- Einde van Auth-tjek ---

  // --- 2. Gaan Haal Data ---
  const departmentsResult = supabase
    .from('staff_departments')
    .select('*')
    .order('sort_order')
    .order('name');
    
  const staffResult = supabase
    .from('staff_members')
    .select(`
      *,
      staff_departments ( name )
    `)
    .order('sort_order')
    .order('full_name');
    
  const [
    { data: departments, error: deptError }, 
    { data: staff, error: staffError }
  ] = await Promise.all([departmentsResult, staffResult]);

  if (deptError || staffError) {
    console.error("Fout met laai van personeel-data:", deptError || staffError);
    // Hanteer fout hier, wys dalk 'n boodskap
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Personeelbestuur
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bestuur die departemente en personeellede wat op die publieke webwerf vertoon word.
      </p>

      {/* Die Kliënt-komponent ontvang die data wat op die bediener gelaai is */}
      <StaffManagementClient
        initialDepartments={departments as DbStaffDepartment[] || []}
        initialStaff={staff as StaffMemberWithDept[] || []}
      />
    </div>
  );
}