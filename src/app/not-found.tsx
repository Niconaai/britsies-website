// src/app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
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
                    <h1 className="text-6xl font-bold text-white">404</h1>
                    <p className="mt-2 text-xl text-amber-400 italic">Koersvas na die verkeerde pad...</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold text-zinc-900">
                        Bladsy Nie Gevind Nie
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600">
                        Jammer, ons kon nie die bladsy vind wat jy soek nie. Dit lyk of jy verdwaal het op ons webwerf.
                    </p>

                    {/* Helpful Links */}
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/"
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Terug na Tuisblad
                        </Link>

                        <Link
                            href="/kontak"
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Kontak Ons
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                            Nuttige Skakels
                        </h3>
                        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                            <Link href="/oor-ons" className="text-rose-900 hover:underline">
                                Oor Ons
                            </Link>
                            <span className="text-zinc-300">•</span>
                            <Link href="/akademie" className="text-rose-900 hover:underline">
                                Akademie
                            </Link>
                            <span className="text-zinc-300">•</span>
                            <Link href="/sport" className="text-rose-900 hover:underline">
                                Sport
                            </Link>
                            <span className="text-zinc-300">•</span>
                            <Link href="/kultuur" className="text-rose-900 hover:underline">
                                Kultuur
                            </Link>
                            <span className="text-zinc-300">•</span>
                            <Link href="/nuus" className="text-rose-900 hover:underline">
                                Nuus
                            </Link>
                            <span className="text-zinc-300">•</span>
                            <Link href="/kalender" className="text-rose-900 hover:underline">
                                Kalender
                            </Link>
                        </div>
                    </div>

                    {/* Fun Message */}
                    <div className="mt-12 rounded-lg bg-amber-50 border border-amber-200 p-6">
                        <p className="text-sm text-zinc-700">
                            <strong>Wenk:</strong> As jy dink hierdie bladsy behoort te bestaan, kontak ons asseblief sodat ons kan help.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
