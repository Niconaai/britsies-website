// src/app/admin/personeel/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StaffManagementClient from "./StaffManagementClient";
import GradeHeadAssignment from "./GradeHeadAssignment";

// Voer die tipes in wat ons in src/types/supabase.ts bygevoeg het
import type { 
  DbProfile,
  DbStaffDepartment,
  StaffMemberWithDept,
  DbSubject,
  DbGradeClass
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
      staff_departments ( id, name, sort_order ),
      staff_subjects ( subject_id ),
      class_guardians ( grade_class_id )
    `)
    .order('sort_order')
    .order('full_name');

  const subjectsResult = supabase
    .from('subjects')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('name');

  const gradeClassesResult = supabase
    .from('grade_classes')
    .select(`
      *,
      staff_members:grade_head_id ( full_name )
    `)
    .eq('is_active', true)
    .order('sort_order');
    
  const [
    { data: departments, error: deptError }, 
    { data: staff, error: staffError },
    { data: subjects, error: subjectsError },
    { data: gradeClasses, error: gradeClassesError }
  ] = await Promise.all([
    departmentsResult, 
    staffResult,
    subjectsResult,
    gradeClassesResult
  ]);

  if (deptError || staffError || subjectsError || gradeClassesError) {
    console.error("Fout met laai van personeel-data:", 
      deptError || staffError || subjectsError || gradeClassesError);
    // Hanteer fout hier, wys dalk 'n boodskap
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Personeelbestuur
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Bestuur die departemente en personeellede wat op die publieke webwerf vertoon word.
        </p>

        {/* Graadhoof Toekenning Section */}
        <div className="mt-6">
          <GradeHeadAssignment
            gradeClasses={gradeClasses || []}
            staffMembers={staff?.map(s => ({ id: s.id, full_name: s.full_name })) || []}
          />
        </div>

        {/* Die Kliënt-komponent ontvang die data wat op die bediener gelaai is */}
        <div className="mt-6">
          <StaffManagementClient
            initialDepartments={departments as DbStaffDepartment[] || []}
            initialStaff={staff as StaffMemberWithDept[] || []}
            initialSubjects={subjects as DbSubject[] || []}
            initialGradeClasses={gradeClasses as DbGradeClass[] || []}
          />
        </div>
      </div>
    </div>
  );
}