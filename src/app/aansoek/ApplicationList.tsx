// src/app/aansoek/ApplicationList.tsx
'use client'; 

import { useState } from 'react';
import type { ApplicationWithLearner } from './page'; // <-- Import the type

// Helper function to get status badge styles
const getStatusStyles = (status: string | null) => {
    switch (status) {
        case 'approved':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        default:
            return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200';
    }
};

// Helper function to format the learner name
const getLearnerName = (app: ApplicationWithLearner) => {
    const learner = app.learners?.[0];
    if (learner && learner.first_names && learner.surname) {
        return `${learner.first_names} ${learner.surname}`;
    }
    return `Aansoek (ID: ...${app.id.substring(24)})`;
};

export default function ApplicationList({ applications }: { applications: ApplicationWithLearner[] }) {
    // State to track which item is expanded
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="rounded-lg bg-white shadow-md dark:bg-zinc-800">
            {/* --- 1. MOBILE LIST (block md:hidden) --- */}
            {/* This list is hidden on medium screens and up */}
            <div className="block divide-y divide-zinc-200 dark:divide-zinc-700 md:hidden">
                {applications.map((app) => (
                    <div key={app.id}>
                        {/* --- Clickable Row --- */}
                        <button
                            onClick={() => handleToggle(app.id)}
                            className="flex w-full items-center justify-between p-4 text-left"
                        >
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">
                                {getLearnerName(app)}
                            </span>
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyles(app.status)}`}>
                                {app.status || 'pending'}
                            </span>
                        </button>

                        {/* --- Expanded Content --- */}
                        {expandedId === app.id && (
                            <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <dt className="text-sm font-medium text-zinc-500">Leerder:</dt>
                                    <dd className="text-sm text-zinc-900 dark:text-white">{getLearnerName(app)}</dd>
                                    
                                    <dt className="text-sm font-medium text-zinc-500">Ingehandig:</dt>
                                    <dd className="text-sm text-zinc-900 dark:text-white">{new Date(app.created_at).toLocaleDateString()}</dd>
                                    
                                    <dt className="text-sm font-medium text-zinc-500">Status:</dt>
                                    <dd className="text-sm text-zinc-900 dark:text-white">
                                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyles(app.status)}`}>
                                            {app.status || 'pending'}
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- 2. DESKTOP TABLE (hidden md:block) --- */}
            {/* This is your existing table, hidden by default, shown on medium screens and up */}
            <div className="hidden overflow-x-auto md:block ">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                    <thead className="bg-zinc-50 dark:bg-zinc-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Leerder</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Ingehandig</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-900 dark:bg-zinc-600">
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                    {getLearnerName(app)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyles(app.status)}`}>
                                        {app.status || 'pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}