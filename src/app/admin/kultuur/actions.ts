// src/app/admin/kultuur/actions.ts
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

// Hulpfunksie om paaie te herlaai
const revalidate = () => {
  revalidatePath('/admin/kultuur');
  revalidatePath('/kultuur');
}

// --- Kultuur Aktiwiteit Aksies ---

export async function createCultureActivity(formData: FormData) {
  const supabase = await checkAdminAuth();
  const name = formData.get('name') as string;
  if (!name) {
    return redirect('/admin/kultuur?error=Naam word vereis');
  }

  const { error } = await supabase.from('culture_activities').insert({ 
    name,
    description: formData.get('description') as string,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    icon_url: formData.get('icon_url') as string || null,
  });

  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateCultureActivity(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  if (!id || !name) {
    return redirect('/admin/kultuur?error=ID en Naam word vereis vir opdatering.');
  }

  const { error } = await supabase
    .from('culture_activities')
    .update({
      name,
      description: formData.get('description') as string,
      sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
      icon_url: formData.get('icon_url') as string || null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteCultureActivity(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const { error } = await supabase.from('culture_activities').delete().eq('id', id);
  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// --- Kultuur Organiseerder Aksies ---

export async function createCultureOrganiser(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const staff_member_id = formData.get('staff_member_id') as string;
  const activity_id = formData.get('activity_id') as string;

  if (!activity_id || !staff_member_id) {
    return redirect('/admin/kultuur?error=Aktiwiteit en Personeellid word vereis');
  }
  
  const { error } = await supabase.from('culture_organisers').insert({
    activity_id: activity_id,
    staff_member_id: staff_member_id,
    role: formData.get('role') as string,
  });

  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateCultureOrganiser(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const id = formData.get('id') as string;
  const staff_member_id = formData.get('staff_member_id') as string;
  const activity_id = formData.get('activity_id') as string;

  if (!id || !activity_id || !staff_member_id) {
    return redirect('/admin/kultuur?error=ID, Aktiwiteit en Personeellid word vereis');
  }
  
  const { error } = await supabase
    .from('culture_organisers')
    .update({
      activity_id: activity_id,
      staff_member_id: staff_member_id,
      role: formData.get('role') as string,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteCultureOrganiser(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const { error } = await supabase.from('culture_organisers').delete().eq('id', id);
  if (error) {
    return redirect(`/admin/kultuur?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}