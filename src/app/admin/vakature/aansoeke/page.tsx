// src/app/admin/vakature/aansoeke/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

type Application = {
    id: string;
    vacancy_id: string;
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string | null;
    cover_letter: string;
    cv_url: string | null;
    additional_documents: string[] | null;
    status: string;
    notes: string | null;
    created_at: string;
    vacancies: {
        title: string;
    };
};

export default function VacancyApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('vacancy_applications')
            .select('*, vacancies(title)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    };

    const updateStatus = async (applicationId: string, newStatus: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('vacancy_applications')
            .update({ status: newStatus })
            .eq('id', applicationId);

        if (error) {
            console.error('Error updating status:', error);
            alert('Kon nie status opdateer nie');
        } else {
            fetchApplications();
        }
    };

    const updateNotes = async (applicationId: string, notes: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('vacancy_applications')
            .update({ notes })
            .eq('id', applicationId);

        if (error) {
            console.error('Error updating notes:', error);
            alert('Kon nie notas stoor nie');
        } else {
            fetchApplications();
        }
    };

    const deleteApplication = async (applicationId: string) => {
        if (!confirm('Is jy seker jy wil hierdie aansoek verwyder?')) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('vacancy_applications')
            .delete()
            .eq('id', applicationId);

        if (error) {
            console.error('Error deleting application:', error);
            alert('Kon nie aansoek verwyder nie');
        } else {
            fetchApplications();
            setSelectedApplication(null);
        }
    };

    const filteredApplications = applications.filter(app => 
        filterStatus === 'all' || app.status === filterStatus
    );

    const statusCounts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-lg text-zinc-600">Laai aansoeke...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                            Vakature Aansoeke
                        </h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Bestuur en hersien alle aanlyn aansoeke
                        </p>
                    </div>
                    <Link
                        href="/admin/vakature"
                        className="rounded-md bg-rose-900 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                        ← Terug na Vakatures
                    </Link>
                </div>

                {/* Status Filter Tabs */}
                <div className="mt-6 border-b border-zinc-200 dark:border-zinc-700">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'all', label: 'Alles', count: statusCounts.all },
                            { key: 'pending', label: 'Hangende', count: statusCounts.pending },
                            { key: 'reviewed', label: 'Hersien', count: statusCounts.reviewed },
                            { key: 'shortlisted', label: 'Kortgelys', count: statusCounts.shortlisted },
                            { key: 'rejected', label: 'Afgekeur', count: statusCounts.rejected },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`${
                                    filterStatus === tab.key
                                        ? 'border-rose-900 text-rose-900 dark:border-rose-400 dark:text-rose-400'
                                        : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400'
                                } flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
                            >
                                {tab.label}
                                <span
                                    className={`${
                                        filterStatus === tab.key
                                            ? 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                                            : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300'
                                    } ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Applications Grid */}
            {filteredApplications.length === 0 ? (
                <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-zinc-800">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Geen aansoeke in hierdie kategorie nie.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    {filteredApplications.map((application) => (
                        <div
                            key={application.id}
                            className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow cursor-pointer dark:bg-zinc-800"
                            onClick={() => setSelectedApplication(application)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                        {application.applicant_name}
                                    </h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {application.vacancies.title}
                                    </p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                    application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {application.status === 'pending' ? 'Hangende' :
                                     application.status === 'reviewed' ? 'Hersien' :
                                     application.status === 'shortlisted' ? 'Kortgelys' :
                                     'Afgekeur'}
                                </span>
                            </div>

                            <div className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                                <p>📧 {application.applicant_email}</p>
                                {application.applicant_phone && <p>📱 {application.applicant_phone}</p>}
                                <p>📅 {new Date(application.created_at).toLocaleDateString('af-ZA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>

                            {application.cv_url && (
                                <div className="mt-4">
                                    <a
                                        href={application.cv_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        📄 Sien CV
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Application Detail Modal */}
            {selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-zinc-800">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:bg-zinc-800 dark:border-zinc-700">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                                Aansoek Details
                            </h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Applicant Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                                    Aansoeker Inligting
                                </h3>
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Naam</p>
                                        <p className="mt-1 text-sm text-zinc-900 dark:text-white">{selectedApplication.applicant_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">E-pos</p>
                                        <p className="mt-1 text-sm text-zinc-900 dark:text-white">{selectedApplication.applicant_email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Telefoon</p>
                                        <p className="mt-1 text-sm text-zinc-900 dark:text-white">{selectedApplication.applicant_phone || 'Nie verskaf'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Vakature</p>
                                        <p className="mt-1 text-sm text-zinc-900 dark:text-white">{selectedApplication.vacancies.title}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                                    Dekbrief / Motivering
                                </h3>
                                <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                                    <p className="whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">
                                        {selectedApplication.cover_letter}
                                    </p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                                    Dokumente
                                </h3>
                                <div className="space-y-2">
                                    {selectedApplication.cv_url && (
                                        <a
                                            href={selectedApplication.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
                                        >
                                            📄 Curriculum Vitae (CV)
                                        </a>
                                    )}
                                    {selectedApplication.additional_documents && selectedApplication.additional_documents.length > 0 && (
                                        <>
                                            {selectedApplication.additional_documents.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={doc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
                                                >
                                                    📎 Addisionele Dokument {idx + 1}
                                                </a>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                                    Status
                                </h3>
                                <select
                                    value={selectedApplication.status}
                                    onChange={(e) => {
                                        updateStatus(selectedApplication.id, e.target.value);
                                        setSelectedApplication({ ...selectedApplication, status: e.target.value });
                                    }}
                                    className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                >
                                    <option value="pending">Hangende</option>
                                    <option value="reviewed">Hersien</option>
                                    <option value="shortlisted">Kortgelys</option>
                                    <option value="rejected">Afgekeur</option>
                                </select>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                                    Admin Notas
                                </h3>
                                <textarea
                                    defaultValue={selectedApplication.notes || ''}
                                    onBlur={(e) => updateNotes(selectedApplication.id, e.target.value)}
                                    rows={4}
                                    placeholder="Voeg notas by oor hierdie aansoek..."
                                    className="block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
                                <button
                                    onClick={() => deleteApplication(selectedApplication.id)}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Verwyder Aansoek
                                </button>
                                <button
                                    onClick={() => setSelectedApplication(null)}
                                    className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                                >
                                    Sluit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
