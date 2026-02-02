'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper function to check admin auth
async function checkAdminAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    throw new Error("Not authorized");
  }
  return supabase;
}

// Helper function to revalidate paths
const revalidate = () => {
  revalidatePath('/admin/personeel');
  revalidatePath('/admin/grade-classes');
  revalidatePath('/akademie');
};

// Update grade head for an entire grade level (e.g., all of Grade 8)
export async function updateGradeHead(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const gradeLevel = formData.get('grade_level') as string;
  const gradeHeadId = formData.get('grade_head_id') as string;

  if (!gradeLevel) {
    return redirect('/admin/personeel?error=Graadvlak word vereis');
  }

  // Update ALL classes for this grade level to have the same grade head
  const { error } = await supabase
    .from('grade_classes')
    .update({
      grade_head_id: gradeHeadId || null,
    })
    .eq('grade_level', parseInt(gradeLevel));

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}
