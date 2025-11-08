// src/app/admin/personeel/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Hulpfunksie om admin-status te kontroleer
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

const revalidate = () => {
  revalidatePath('/admin/personeel');
  revalidatePath('/oor-ons');
  revalidatePath('/akademie');
}

// --- Departement Aksies ---

export async function createDepartment(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const name = formData.get('name') as string;
  const sort_order = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!name) {
    return redirect('/admin/personeel?error=Departement naam word vereis.');
  }

  const { error } = await supabase
    .from('staff_departments')
    .insert({ name, sort_order });

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateDepartment(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const sort_order = parseInt(formData.get('sort_order') as string, 10) || 0;

  if (!id || !name) {
    return redirect('/admin/personeel?error=ID en Naam word vereis vir opdatering.');
  }

  const { error } = await supabase
    .from('staff_departments')
    .update({ name, sort_order })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteDepartment(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  if (!id) {
    return redirect('/admin/personeel?error=ID word vereis vir skrapping.');
  }

  // Oordink: Wat gebeur met personeel in 'n departement wat geskrap word?
  // Ons DB-skema (ON DELETE SET NULL) sal hul 'department_id' na 'null' stel.
  // Dit is die korrekte gedrag.

  const { error } = await supabase
    .from('staff_departments')
    .delete()
    .eq('id', id);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// --- Personeellid Aksies ---

export async function createStaffMember(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const department_id = formData.get('department_id') as string;
  
  const staffData = {
    full_name: formData.get('full_name') as string,
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string || null,
    department_id: department_id === "" ? null : department_id,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  if (!staffData.full_name || !staffData.title) {
    return redirect('/admin/personeel?error=Volle Naam en Titel word vereis.');
  }

  const { error } = await supabase.from('staff_members').insert(staffData);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateStaffMember(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }
  
  const id = formData.get('id') as string;
  const department_id = formData.get('department_id') as string;

  if (!id) {
    return redirect('/admin/personeel?error=Personeel ID word vermis.');
  }
  
  const staffData = {
    full_name: formData.get('full_name') as string,
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string || null,
    department_id: department_id === "" ? null : department_id,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  if (!staffData.full_name || !staffData.title) {
    return redirect('/admin/personeel?error=Volle Naam en Titel word vereis.');
  }

  const { error } = await supabase
    .from('staff_members')
    .update(staffData)
    .eq('id', id);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteStaffMember(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  if (!id) {
    return redirect('/admin/personeel?error=ID word vereis vir skrapping.');
  }
  
  // TODO: Ons moet dalk ook die prent uit Supabase Storage skrap.
  // Vir nou, skrap ons net die databasis-inskrywing.

  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}