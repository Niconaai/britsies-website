// src/app/admin/subjects/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SubjectManagementClient from "./SubjectManagementClient";
import type { DbSubject } from "@/types/supabase";

export default async function SubjectsAdminPage() {
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
  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('*')
    .order('sort_order')
    .order('name');

  if (subjectsError) {
    console.error("Error loading subjects:", subjectsError);
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Vakke Bestuur
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bestuur die vakke wat deur personeel onderrig word.
      </p>

      <SubjectManagementClient
        initialSubjects={subjects as DbSubject[] || []}
      />
    </div>
  );
}
