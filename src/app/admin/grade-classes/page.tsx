// src/app/admin/grade-classes/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GradeClassManagementClient from "./GradeClassManagementClient";
import type { DbGradeClass, DbStaffMember } from "@/types/supabase";

export type GradeClassWithGradeHead = DbGradeClass & {
  staff_members: Pick<DbStaffMember, 'full_name'> | null;
};

export default async function GradeClassesAdminPage() {
  const supabase = await createClient();

  // --- Auth Check ---
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
  // --- End Auth Check ---

  // --- Fetch Data ---
  const gradeClassesResult = supabase
    .from('grade_classes')
    .select(`
      *,
      staff_members ( full_name )
    `)
    .order('sort_order')
    .order('grade_level')
    .order('class_section');
    
  const staffMembersResult = supabase
    .from('staff_members')
    .select('id, full_name')
    .eq('is_active', true)
    .order('full_name');

  const [
    { data: gradeClasses, error: gradeClassesError },
    { data: staffMembers, error: staffMembersError },
  ] = await Promise.all([gradeClassesResult, staffMembersResult]);

  if (gradeClassesError || staffMembersError) {
    console.error("Error loading grade classes data:", gradeClassesError || staffMembersError);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Graadklas Bestuur
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bestuur graadklasse en wys graadhoofde toe.
      </p>

      <GradeClassManagementClient
        initialGradeClasses={gradeClasses as GradeClassWithGradeHead[] || []}
        initialStaffMembers={staffMembers as Pick<DbStaffMember, 'id' | 'full_name'>[] || []}
      />
    </div>
  );
}
