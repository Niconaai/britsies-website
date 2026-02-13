// src/app/admin/vakature/edit/[id]/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateVacancy } from '../../actions';
import SubmitButton from '@/components/ui/SubmitButton';

type Vacancy = {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    closing_date: string;
    start_date: string | null;
    is_active: boolean;
    is_published: boolean;
};

export default async function EditVacancyPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    // Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch vacancy
    const { data: vacancy, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !vacancy) {
        console.error('Error fetching vacancy:', error);
        return redirect('/admin/vakature');
    }

    const updateVacancyWithId = updateVacancy.bind(null, params.id);

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                        Wysig Vakature
                    </h1>
                    <Link
                        href="/admin/vakature"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                        ← Terug na Vakatures
                    </Link>
                </div>
            </div>

            <form action={updateVacancyWithId} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Titel <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        defaultValue={vacancy.title}
                        className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Beskrywing <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={6}
                        required
                        defaultValue={vacancy.description}
                        className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                </div>

                {/* Requirements */}
                <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Vereistes
                    </label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        rows={6}
                        defaultValue={vacancy.requirements || ''}
                        className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="closing_date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Sluitingsdatum <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="date"
                            id="closing_date"
                            name="closing_date"
                            required
                            defaultValue={vacancy.closing_date}
                            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Aanvangsdatum
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            defaultValue={vacancy.start_date || ''}
                            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                    </div>
                </div>

                {/* Status Checkboxes */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            defaultChecked={vacancy.is_active}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                            Aktief (Vakature is oop vir aansoeke)
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            defaultChecked={vacancy.is_published}
                            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_published" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                            Gepubliseer (Vakature is sigbaar op die webwerf)
                        </label>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
                    <Link
                        href="/admin/vakature"
                        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                    >
                        Kanselleer
                    </Link>
                    <SubmitButton
                        defaultText="Stoor Veranderinge"
                        loadingText="Stoor..."
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    />
                </div>
            </form>
        </div>
    );
}
