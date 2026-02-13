// src/app/admin/sport/actions.ts
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
  revalidatePath('/admin/sport');
  revalidatePath('/sport');
  revalidatePath('/akademie'); // Herlaai ook akademie, aangesien afrigters daar mag verskyn
}

// --- Sport Type Aksies ---

export async function createSportType(formData: FormData) {
  const supabase = await checkAdminAuth(); // Auth-tjek
  const name = formData.get('name') as string;
  if (!name) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect('/admin/sport?error=Naam word vereis');
  }

  const { error } = await supabase.from('sport_types').insert({ 
    name,
    season: formData.get('season') as string,
    description: formData.get('description') as string,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    icon_url: formData.get('icon_url') as string || null,
  });

  if (error) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteSportType(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const { error } = await supabase.from('sport_types').delete().eq('id', id);
  if (error) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// --- Sport Coach Aksies ---

export async function createSportCoach(formData: FormData) {
  const supabase = await checkAdminAuth();
  
  const staff_member_id = formData.get('staff_member_id') as string;
  const sport_type_ids = formData.get('sport_type_ids') as string;

  if (!sport_type_ids) {
    return redirect('/admin/sport?error=Ten minste een sportsoort word vereis');
  }
  
  // Split comma-separated IDs into array
  const sportTypeIdArray = sport_type_ids.split(',').filter(id => id.trim());
  
  if (sportTypeIdArray.length === 0) {
    return redirect('/admin/sport?error=Ten minste een sportsoort word vereis');
  }
  
  // Create one record for each sport type
  const coachRecords = sportTypeIdArray.map(sport_type_id => ({
    sport_type_id: sport_type_id.trim(),
    staff_member_id: staff_member_id === "" ? null : staff_member_id,
    external_coach_name: formData.get('external_coach_name') as string || null,
    role: formData.get('role') as string,
  }));
  
  const { error } = await supabase.from('sport_coaches').insert(coachRecords);

  if (error) {
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteSportCoach(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const { error } = await supabase.from('sport_coaches').delete().eq('id', id);
  if (error) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// --- Sport Achievement Aksies ---
export async function createSportAchievement(formData: FormData) {
  const supabase = await checkAdminAuth();
  const title = formData.get('title') as string;
  const image_url = formData.get('image_url') as string;

  if (!title || !image_url) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect('/admin/sport?error=Titel en Prent URL word vereis');
  }

  const { error } = await supabase.from('sport_achievements').insert({
    title,
    image_url,
    description: formData.get('description') as string,
    achievement_date: formData.get('achievement_date') as string || null,
  });

  if (error) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function deleteSportAchievement(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  const { error } = await supabase.from('sport_achievements').delete().eq('id', id);
  if (error) {
    // --- REGSTELLING: Gebruik redirect ---
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

export async function updateSportType(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  if (!id || !name) {
    return redirect('/admin/sport?error=ID en Naam word vereis vir opdatering.');
  }

  const { error } = await supabase
    .from('sport_types')
    .update({
      name,
      season: formData.get('season') as string,
      description: formData.get('description') as string,
      sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
      icon_url: formData.get('icon_url') as string || null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// Voeg hierdie funksie by binne src/app/admin/sport/actions.ts

export async function updateSportCoach(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  const staff_member_id = formData.get('staff_member_id') as string;
  const sport_type_id = formData.get('sport_type_id') as string;
  
  if (!id || !sport_type_id) {
    return redirect('/admin/sport?error=ID en Sportsoort word vereis vir opdatering.');
  }

  const { error } = await supabase
    .from('sport_coaches')
    .update({
      sport_type_id: sport_type_id,
      staff_member_id: staff_member_id === "" ? null : staff_member_id,
      external_coach_name: formData.get('external_coach_name') as string || null,
      role: formData.get('role') as string,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// New action to update coach with multiple sports
export async function updateSportCoachMultiple(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const staff_member_id = formData.get('staff_member_id') as string;
  const external_coach_name = formData.get('external_coach_name') as string;
  const sport_type_ids = formData.get('sport_type_ids') as string;
  const role = formData.get('role') as string;
  const is_active = formData.get('is_active') === 'on';
  
  if (!sport_type_ids) {
    return redirect('/admin/sport?error=Ten minste een sportsoort word vereis vir opdatering.');
  }

  // Determine which identifier to use
  const identifier = staff_member_id || external_coach_name;
  if (!identifier) {
    return redirect('/admin/sport?error=Personeellid of eksterne naam word vereis.');
  }

  // Delete existing records for this coach
  let deleteQuery;
  if (staff_member_id) {
    deleteQuery = supabase.from('sport_coaches').delete().eq('staff_member_id', staff_member_id);
  } else {
    deleteQuery = supabase.from('sport_coaches').delete().eq('external_coach_name', external_coach_name);
  }
  
  const { error: deleteError } = await deleteQuery;
  if (deleteError) {
    return redirect(`/admin/sport?error=${encodeURIComponent(deleteError.message)}`);
  }

  // Create new records for each selected sport
  const sportTypeIdArray = sport_type_ids.split(',').filter(id => id.trim());
  const coachRecords = sportTypeIdArray.map(sport_type_id => ({
    sport_type_id: sport_type_id.trim(),
    staff_member_id: staff_member_id || null,
    external_coach_name: external_coach_name || null,
    role,
    is_active,
  }));
  
  const { error: insertError } = await supabase.from('sport_coaches').insert(coachRecords);
  if (insertError) {
    return redirect(`/admin/sport?error=${encodeURIComponent(insertError.message)}`);
  }

  revalidate();
}

// Voeg hierdie funksie by binne src/app/admin/sport/actions.ts

export async function updateSportAchievement(formData: FormData) {
  let supabase;
  try {
    supabase = await checkAdminAuth();
  } catch (error) {
    return redirect('/login');
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const image_url = formData.get('image_url') as string;

  if (!id || !title || !image_url) {
    return redirect('/admin/sport?error=ID, Titel en Prent URL word vereis vir opdatering.');
  }

  const { error } = await supabase
    .from('sport_achievements')
    .update({
      title,
      image_url,
      description: formData.get('description') as string,
      achievement_date: formData.get('achievement_date') as string || null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id);

  if (error) {
    return redirect(`/admin/sport?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}