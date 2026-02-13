// src/app/admin/vakature/VacanciesTable.tsx
'use client';

import Link from 'next/link';
import { deleteVacancy } from './actions';

type Vacancy = {
    id: string;
    title: string;
    closing_date: string;
    start_date: string | null;
    is_active: boolean;
    is_published: boolean;
    created_at: string;
};

interface VacanciesTableProps {
    vacancies: Vacancy[];
}

export default function VacanciesTable({ vacancies }: VacanciesTableProps) {
    const handleDelete = async (formData: FormData) => {
        if (!confirm('Is jy seker jy wil hierdie vakature verwyder?')) {
            return;
        }
        await deleteVacancy(formData);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                            Titel
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                            Sluitingsdatum
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                            Aksies
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                    {vacancies.map((vacancy) => (
                        <tr key={vacancy.id}>
                            <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                {vacancy.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                {new Date(vacancy.closing_date).toLocaleDateString('af-ZA')}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <div className="flex flex-col space-y-1">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        vacancy.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
                                    }`}>
                                        {vacancy.is_published ? 'Gepubliseer' : 'Nie Gepubliseer'}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        vacancy.is_active
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                        {vacancy.is_active ? 'Aktief' : 'Inaktief'}
                                    </span>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                                <Link
                                    href={`/admin/vakature/edit/${vacancy.id}`}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Wysig
                                </Link>
                                <form action={handleDelete} className="inline">
                                    <input type="hidden" name="vacancyId" value={vacancy.id} />
                                    <button
                                        type="submit"
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Verwyder
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
