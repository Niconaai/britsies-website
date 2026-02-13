// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            {/* Header Background */}
            <div className="bg-linear-to-b from-rose-900 to-rose-800 py-16">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <Image
                        src="/wapen.png"
                        alt="Hoërskool Brits"
                        width={120}
                        height={120}
                        className="mx-auto mb-6"
                    />
                    <h1 className="text-6xl font-bold text-white">Oeps!</h1>
                    <p className="mt-2 text-xl text-amber-400 italic">Iets het verkeerd geloop</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold text-zinc-900">
                        Daar was 'n Probleem
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600">
                        Jammer, daar het 'n onverwagte fout plaasgevind. Ons span is outomaties ingelig en sal dit so gou as moontlik regstel.
                    </p>

                    {/* Error Details (only in development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-left">
                            <p className="text-sm font-mono text-red-800 wrap-break-word">
                                {error.message || 'Unknown error'}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center rounded-lg bg-rose-900 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                        >
                            <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Probeer Weer
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center rounded-lg border-2 border-rose-900 bg-white px-6 py-4 text-base font-semibold text-rose-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
                        >
                            <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Terug na Tuisblad
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-12 rounded-lg bg-amber-50 border border-amber-200 p-6">
                        <p className="text-sm text-zinc-700">
                            ℹ️ <strong>Het jy hulp nodig?</strong> Kontak ons by{' '}
                            <a href="mailto:hsbrits@hsbrits.co.za" className="text-rose-900 hover:underline font-semibold">
                                hsbrits@hsbrits.co.za
                            </a>
                            {' '}of bel{' '}
                            <a href="tel:0122523228" className="text-rose-900 hover:underline font-semibold">
                                (012) 252-3228
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
