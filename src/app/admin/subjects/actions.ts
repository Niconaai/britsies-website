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
  revalidatePath('/admin/subjects');
  revalidatePath('/admin/personeel');
  revalidatePath('/akademie');
};

// --- Subject Actions ---

export async function createSubject(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    return redirect('/admin/subjects?error=Vak naam word vereis');
  }

  const { error } = await supabase.from('subjects').insert({ 
    name,
    description: description || null,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
  });

  if (error) {
    return redirect(`/admin/subjects?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateSubject(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!id || !name) {
    return redirect('/admin/subjects?error=ID en Vak naam word vereis');
  }

  const { error } = await supabase
    .from('subjects')
    .update({
      name,
      description: description || null,
      sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/subjects?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteSubject(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  
  if (!id) {
    return redirect('/admin/subjects?error=ID word vereis vir skrapping');
  }

  const { error } = await supabase.from('subjects').delete().eq('id', id);
  
  if (error) {
    return redirect(`/admin/subjects?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}
