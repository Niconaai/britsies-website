// src/app/(public)/vakature/VacancyApplicationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { submitVacancyApplication, ApplicationFormState } from './actions';
import { Vacancy } from './page';
import SubmitButton from '@/components/ui/SubmitButton';

interface VacancyApplicationModalProps {
    vacancy: Vacancy;
    isOpen: boolean;
    onClose: () => void;
}

const initialState: ApplicationFormState = {
    success: false,
    message: null,
    errors: null,
};

export default function VacancyApplicationModal({ vacancy, isOpen, onClose }: VacancyApplicationModalProps) {
    const [state, formAction] = useFormState(submitVacancyApplication, initialState);
    const [cvFileName, setCvFileName] = useState<string>('');
    const [additionalFilesNames, setAdditionalFilesNames] = useState<string[]>([]);

    // Close modal on successful submission
    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                onClose();
            }, 3000);
        }
    }, [state.success, onClose]);

    if (!isOpen) return null;

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCvFileName(file.name);
        }
    };

    const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAdditionalFilesNames(files.map(f => f.name));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-rose-900 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Doen Aansoek: {vacancy.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-zinc-200 transition-colors"
                        type="button"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form action={formAction} className="p-6">
                    <input type="hidden" name="vacancyId" value={vacancy.id} />

                    {/* Success Message */}
                    {state.success && (
                        <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
                            <p className="text-sm text-green-800">{state.message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {!state.success && state.message && (
                        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                            <p className="text-sm text-red-800">{state.message}</p>
                        </div>
                    )}

                    {/* Vacancy Info */}
                    <div className="mb-6 rounded-md bg-amber-50 p-4 border border-amber-200">
                        <p className="text-sm text-zinc-700">
                            <strong>Vakature:</strong> {vacancy.title}
                        </p>
                        <p className="text-sm text-zinc-700 mt-1">
                            <strong>Sluitingsdatum:</strong> {new Date(vacancy.closing_date).toLocaleDateString('af-ZA')}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="applicantName" className="block text-sm font-medium text-zinc-700">
                                Volle Naam <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="applicantName"
                                name="applicantName"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                            />
                            {state.errors?.applicantName && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.applicantName[0]}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="applicantEmail" className="block text-sm font-medium text-zinc-700">
                                E-posadres <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="applicantEmail"
                                name="applicantEmail"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                            />
                            {state.errors?.applicantEmail && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.applicantEmail[0]}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="applicantPhone" className="block text-sm font-medium text-zinc-700">
                                Telefoonnommer <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                id="applicantPhone"
                                name="applicantPhone"
                                required
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                            />
                            {state.errors?.applicantPhone && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.applicantPhone[0]}</p>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-zinc-700">
                                Dekbrief / Motivering <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                rows={6}
                                required
                                placeholder="Vertel ons waarom jy die ideale kandidaat vir hierdie pos is..."
                                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500"
                            />
                            {state.errors?.coverLetter && (
                                <p className="mt-1 text-sm text-red-600">{state.errors.coverLetter[0]}</p>
                            )}
                        </div>

                        {/* CV Upload */}
                        <div>
                            <label htmlFor="cv" className="block text-sm font-medium text-zinc-700">
                                CV (Curriculum Vitae) <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="file"
                                id="cv"
                                name="cv"
                                accept=".pdf,.doc,.docx"
                                required
                                onChange={handleCvChange}
                                className="mt-1 block w-full text-sm text-zinc-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-rose-50 file:text-rose-700
                                    hover:file:bg-rose-100"
                            />
                            {cvFileName && (
                                <p className="mt-1 text-sm text-zinc-600">Gekies: {cvFileName}</p>
                            )}
                            <p className="mt-1 text-xs text-zinc-500">PDF, DOC of DOCX (Maksimum 5MB)</p>
                        </div>

                        {/* Additional Documents */}
                        <div>
                            <label htmlFor="additionalDocuments" className="block text-sm font-medium text-zinc-700">
                                Addisionele Dokumente (Opsioneel)
                            </label>
                            <input
                                type="file"
                                id="additionalDocuments"
                                name="additionalDocuments"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleAdditionalFilesChange}
                                className="mt-1 block w-full text-sm text-zinc-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-amber-50 file:text-amber-700
                                    hover:file:bg-amber-100"
                            />
                            {additionalFilesNames.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-zinc-700">Gekies:</p>
                                    <ul className="mt-1 list-disc list-inside text-xs text-zinc-600">
                                        {additionalFilesNames.map((name, idx) => (
                                            <li key={idx}>{name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <p className="mt-1 text-xs text-zinc-500">
                                Bv. sertifikate, getuigskrifte, kwalifikasies (Maksimum 5MB per lêer)
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        >
                            Kanselleer
                        </button>
                        <SubmitButton
                            defaultText="Dien Aansoek In"
                            loadingText="Stuur..."
                            className="rounded-md bg-rose-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
