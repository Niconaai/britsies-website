// src/app/admin/personeel/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// REGSTELLING: Ons benodig die admin-kliënt vir transaksie-tipe operasies
import { createClient as createAdminClient } from '@supabase/supabase-js';

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
  // Belangrik: Ons het die Service Role-kliënt nodig vir multi-tabel skryf-aksies
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  return supabaseAdmin;
}

// Hulpfunksie om paaie te herlaai
const revalidate = () => {
  revalidatePath('/admin/personeel');
  revalidatePath('/oor-ons');
  revalidatePath('/akademie');
  revalidatePath('/koshuis'); // Voeg koshuis ook by
}

// --- Departement Aksies (Bly onveranderd) ---

export async function createDepartment(formData: FormData) {
  const supabase = await checkAdminAuth();
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

export async function deleteDepartment(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  if (!id) {
    return redirect('/admin/personeel?error=ID word vereis vir skrapping.');
  }

  const { error } = await supabase
    .from('staff_departments')
    .delete()
    .eq('id', id); // Sal 'on delete cascade' in 'staff_member_departments' aktiveer

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}

// --- Personeellid Aksies (OPGEDATEER) ---

export async function createStaffMember(formData: FormData) {
  const supabase = await checkAdminAuth(); // Gebruik nou die admin-kliënt

  // 1. Kry al die departement-ID's wat gekies is
  const departmentIds = formData.getAll('department_ids') as string[];

  // 2. Skep die personeellid-data
  const staffData = {
    full_name: formData.get('full_name') as string,
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  if (!staffData.full_name || !staffData.title) {
    return redirect('/admin/personeel?error=Volle Naam en Titel word vereis.');
  }

  // 3. Voeg die personeellid by en kry hul nuwe ID terug
  const { data: newStaffMember, error: staffError } = await supabase
    .from('staff_members')
    .insert(staffData)
    .select('id')
    .single();

  if (staffError || !newStaffMember) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(staffError?.message || "Kon nie personeellid skep nie")}`);
  }

  const newStaffId = newStaffMember.id;

  // 4. Skep die koppel-inskrywings
  if (departmentIds.length > 0) {
    const linksToInsert = departmentIds.map(deptId => ({
      staff_member_id: newStaffId,
      department_id: deptId,
    }));

    const { error: linksError } = await supabase
      .from('staff_member_departments')
      .insert(linksToInsert);

    if (linksError) {
      // Probeer om die wees-personeellid te skrap vir opruiming
      await supabase.from('staff_members').delete().eq('id', newStaffId);
      return redirect(`/admin/personeel?error=${encodeURIComponent(linksError.message)}`);
    }
  }

  revalidate();
}

export async function updateStaffMember(formData: FormData) {
  const supabase = await checkAdminAuth(); // Gebruik nou die admin-kliënt
  
  const id = formData.get('id') as string;
  if (!id) {
    return redirect('/admin/personeel?error=Personeel ID word vermis.');
  }

  // 1. Kry al die nuwe departement-ID's
  const departmentIds = formData.getAll('department_ids') as string[];

  // 2. Skep die personeellid-data
  const staffData = {
    full_name: formData.get('full_name') as string,
    title: formData.get('title') as string,
    image_url: formData.get('image_url') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string, 10) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  if (!staffData.full_name || !staffData.title) {
    return redirect(`/admin/personeel?error=Volle Naam en Titel word vereis.`);
  }

  // 3. Dateer die 'staff_members'-tabel op
  const { error: staffError } = await supabase
    .from('staff_members')
    .update(staffData)
    .eq('id', id);

  if (staffError) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(staffError.message)}`);
  }

  // 4. Dateer die koppel-tabel op (Delete all, then Insert all)
  
  // 4a. Skrap alle bestaande koppelings
  const { error: deleteError } = await supabase
    .from('staff_member_departments')
    .delete()
    .eq('staff_member_id', id);

  if (deleteError) {
     return redirect(`/admin/personeel?error=Kon nie ou departemente skrap nie: ${encodeURIComponent(deleteError.message)}`);
  }

  // 4b. Voeg die nuwe koppelings by
  if (departmentIds.length > 0) {
    const linksToInsert = departmentIds.map(deptId => ({
      staff_member_id: id,
      department_id: deptId,
    }));

    const { error: linksError } = await supabase
      .from('staff_member_departments')
      .insert(linksToInsert);

    if (linksError) {
      return redirect(`/admin/personeel?error=Kon nie nuwe departemente koppel nie: ${encodeURIComponent(linksError.message)}`);
    }
  }

  revalidate();
}

export async function deleteStaffMember(formData: FormData) {
  const supabase = await checkAdminAuth();
  const id = formData.get('id') as string;
  if (!id) {
    return redirect('/admin/personeel?error=ID word vereis vir skrapping.');
  }
  
  // Ons hoef net die personeellid te skrap.
  // Die `ON DELETE CASCADE` op die 'staff_member_departments'-tabel
  // sal outomaties al die koppelings skrap.
  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id);

  if (error) {
    return redirect(`/admin/personeel?error=${encodeURIComponent(error.message)}`);
  }
  revalidate();
}