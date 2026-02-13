// src/app/admin/vakature/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import VacanciesTable from './VacanciesTable';

type Vacancy = {
    id: string;
    title: string;
    closing_date: string;
    start_date: string | null;
    is_active: boolean;
    is_published: boolean;
    created_at: string;
};

export default async function VacanciesAdminPage() {
    const supabase = await createClient();

    // Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch all vacancies
    const { data: vacancies, error: fetchError } = await supabase
        .from('vacancies')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error('Error fetching vacancies:', fetchError);
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                        Vakature Bestuur
                    </h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Bestuur oop vakatures en bekg aansoeke
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        href="/admin/vakature/aansoeke"
                        className="rounded-md bg-amber-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        Bekyk Aansoeke
                    </Link>
                    <Link
                        href="/admin/vakature/create"
                        className="rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Skep Nuwe Vakature +
                    </Link>
                </div>
            </div>

            {fetchError && (
                <p className="text-red-600 dark:text-red-400">
                    Kon nie vakatures laai nie: {fetchError.message}
                </p>
            )}

            {vacancies && vacancies.length > 0 ? (
                <VacanciesTable vacancies={vacancies} />
            ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                    <svg
                        className="mx-auto h-12 w-12 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-zinc-900 dark:text-white">
                        Geen vakatures
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Begin deur 'n nuwe vakature te skep.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/admin/vakature/create"
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg
                                className="-ml-0.5 mr-1.5 h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                            Skep Nuwe Vakature
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
