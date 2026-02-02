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
  revalidatePath('/admin/grade-classes');
  revalidatePath('/admin/personeel');
  revalidatePath('/akademie');
};

// --- Grade Class Actions ---

export async function createGradeClass(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const name = formData.get('name') as string;
  const grade_level = parseInt(formData.get('grade_level') as string, 10);
  const class_section = parseInt(formData.get('class_section') as string, 10);
  const grade_head_id = formData.get('grade_head_id') as string;

  if (!name || !grade_level || !class_section) {
    return redirect('/admin/grade-classes?error=Klas naam, graad vlak en klas afdeling word vereis');
  }

  const { error } = await supabase.from('grade_classes').insert({ 
    name,
    grade_level,
    class_section,
    grade_head_id: grade_head_id || null,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
  });

  if (error) {
    return redirect(`/admin/grade-classes?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateGradeClass(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const grade_level = parseInt(formData.get('grade_level') as string, 10);
  const class_section = parseInt(formData.get('class_section') as string, 10);
  const grade_head_id = formData.get('grade_head_id') as string;

  if (!id || !name || !grade_level || !class_section) {
    return redirect('/admin/grade-classes?error=ID, klas naam, graad vlak en klas afdeling word vereis');
  }

  const { error } = await supabase
    .from('grade_classes')
    .update({
      name,
      grade_level,
      class_section,
      grade_head_id: grade_head_id || null,
      sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/grade-classes?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteGradeClass(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  
  if (!id) {
    return redirect('/admin/grade-classes?error=ID word vereis vir skrapping');
  }

  const { error } = await supabase.from('grade_classes').delete().eq('id', id);
  
  if (error) {
    return redirect(`/admin/grade-classes?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}
