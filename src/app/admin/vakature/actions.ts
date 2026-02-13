// src/app/admin/vakature/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createVacancy(formData: FormData) {
    const supabase = await createClient();

    const vacancy = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        requirements: formData.get('requirements') as string,
        closing_date: formData.get('closing_date') as string,
        start_date: formData.get('start_date') as string || null,
        is_active: formData.get('is_active') === 'on',
        is_published: formData.get('is_published') === 'on',
    };

    const { error } = await supabase.from('vacancies').insert(vacancy);

    if (error) {
        console.error('Error creating vacancy:', error);
        throw new Error('Failed to create vacancy');
    }

    revalidatePath('/admin/vakature');
    redirect('/admin/vakature');
}

export async function updateVacancy(vacancyId: string, formData: FormData) {
    const supabase = await createClient();

    const vacancy = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        requirements: formData.get('requirements') as string,
        closing_date: formData.get('closing_date') as string,
        start_date: formData.get('start_date') as string || null,
        is_active: formData.get('is_active') === 'on',
        is_published: formData.get('is_published') === 'on',
    };

    const { error } = await supabase
        .from('vacancies')
        .update(vacancy)
        .eq('id', vacancyId);

    if (error) {
        console.error('Error updating vacancy:', error);
        throw new Error('Failed to update vacancy');
    }

    revalidatePath('/admin/vakature');
    redirect('/admin/vakature');
}

export async function deleteVacancy(formData: FormData) {
    const supabase = await createClient();
    const vacancyId = formData.get('vacancyId') as string;

    const { error } = await supabase.from('vacancies').delete().eq('id', vacancyId);

    if (error) {
        console.error('Error deleting vacancy:', error);
        throw new Error('Failed to delete vacancy');
    }

    revalidatePath('/admin/vakature');
}

export async function updateApplicationStatus(applicationId: string, status: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('vacancy_applications')
        .update({ status })
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating application status:', error);
        throw new Error('Failed to update application status');
    }

    revalidatePath('/admin/vakature/aansoeke');
}

export async function updateApplicationNotes(applicationId: string, notes: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('vacancy_applications')
        .update({ notes })
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating application notes:', error);
        throw new Error('Failed to update application notes');
    }

    revalidatePath('/admin/vakature/aansoeke');
}

export async function deleteApplication(formData: FormData) {
    const supabase = await createClient();
    const applicationId = formData.get('applicationId') as string;

    const { error } = await supabase
        .from('vacancy_applications')
        .delete()
        .eq('id', applicationId);

    if (error) {
        console.error('Error deleting application:', error);
        throw new Error('Failed to delete application');
    }

    revalidatePath('/admin/vakature/aansoeke');
}
