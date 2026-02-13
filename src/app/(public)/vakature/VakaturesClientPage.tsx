// src/app/(public)/vakature/VakaturesClientPage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Vacancy } from './page';
import VacancyApplicationModal from './VacancyApplicationModal';

interface VakaturesClientPageProps {
    vacancies: Vacancy[];
}

export default function VakaturesClientPage({ vacancies }: VakaturesClientPageProps) {
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openApplicationModal = (vacancy: Vacancy) => {
        setSelectedVacancy(vacancy);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVacancy(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('af-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header Section */}
            <div className="bg-rose-900 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-center text-4xl font-bold text-white">Vakature</h1>
                    <p className="mt-4 text-center text-lg text-zinc-200">
                        Sluit aan by ons span by Hoërskool Brits
                    </p>
                </div>
            </div>

            {/* Vacancies List */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {vacancies.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-lg text-zinc-600">
                            Daar is tans geen oop vakatures nie. Kyk asseblief later weer.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {vacancies.map((vacancy) => (
                            <div
                                key={vacancy.id}
                                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl"
                            >
                                {/* Card Header with School Colors */}
                                <div className="bg-amber-500 px-6 py-8 relative">
                                    {/* School Logo */}
                                    <div className="absolute top-4 right-4">
                                        <Image
                                            src="/wapen.png"
                                            alt="Hoërskool Brits"
                                            width={60}
                                            height={60}
                                            className="rounded-full bg-white p-1"
                                        />
                                    </div>
                                    <div className="pr-20">
                                        <p className="text-sm font-semibold uppercase tracking-wide text-rose-900">
                                            Die volgende beheerliggaampos is beskikbaar:
                                        </p>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="bg-rose-900 px-6 py-6">
                                    <h2 className="text-center text-3xl font-bold text-white">
                                        {vacancy.title}
                                    </h2>
                                </div>

                                <div className="flex-1 bg-zinc-100 px-6 py-6">
                                    <div className="space-y-4 text-sm text-zinc-800">
                                        <div
                                            className="whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: vacancy.description }}
                                        />

                                        {vacancy.requirements && (
                                            <>
                                                <h3 className="mt-4 font-bold text-rose-900">Vereistes:</h3>
                                                <div
                                                    className="whitespace-pre-line"
                                                    dangerouslySetInnerHTML={{ __html: vacancy.requirements }}
                                                />
                                            </>
                                        )}

                                        <div className="mt-6 border-t border-zinc-300 pt-4">
                                            <p className="text-center font-semibold text-rose-900">
                                                Sluitingsdatum: {formatDate(vacancy.closing_date)}
                                            </p>
                                            {vacancy.start_date && (
                                                <p className="mt-2 text-center text-zinc-700">
                                                    Aanvangsdatum: {formatDate(vacancy.start_date)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer with Apply Button */}
                                <div className="bg-white px-6 py-4">
                                    <button
                                        onClick={() => openApplicationModal(vacancy)}
                                        className="w-full rounded-md bg-rose-900 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Doen Aansoek
                                    </button>
                                </div>

                                {/* Social Media Footer */}
                                <div className="bg-rose-900 px-6 py-3 flex items-center justify-between text-white text-xs text-center">
                                    
                                    <span className="italic text-amber-500 text-center">#beslisBrits</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {selectedVacancy && (
                <VacancyApplicationModal
                    vacancy={selectedVacancy}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
