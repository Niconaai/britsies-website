// src/app/(public)/kalender/KalenderBladsyClient.tsx
'use client';

import { useState, useMemo } from 'react';
import type { VerwerkteGebeurtenis } from './page';
import { motion } from 'framer-motion';

type Tydfilter = 'week' | 'volgende_week' | 'maand' | 'volgende_maand' | 'hele_jaar' | 'volgende_jaar';

const CalendarIcon = () => (
    <svg className="h-6 w-6 shrink-0 text-rose-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const DownloadIcon = () => (
    <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


function formatDateRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        month: 'long', day: 'numeric',
    };
    const startTime = start.toLocaleTimeString('af-ZA', { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString('af-ZA', { hour: '2-digit', minute: '2-digit' });
    const isAllDay = (
        (start.getHours() === 0 && start.getMinutes() === 0) &&
        (end.getHours() === 0 && end.getMinutes() === 0) &&
        (end.getTime() - start.getTime()) % 86400000 === 0
    );
    if (start.toDateString() === end.toDateString() || (isAllDay && (end.getTime() - start.getTime()) === 86400000)) {
        if (isAllDay) {
            return `${start.toLocaleDateString('af-ZA', options)} (Hele Dag)`;
        }
        return `${start.toLocaleDateString('af-ZA', options)} | ${startTime} - ${endTime}`;
    }
    if (isAllDay) {
        const adjustedEnd = new Date(end.getTime() - 86400000);
        if (start.toDateString() === adjustedEnd.toDateString()) {
            return `${start.toLocaleDateString('af-ZA', options)} (Hele Dag)`;
        }
        return `${start.toLocaleDateString('af-ZA', options)} - ${adjustedEnd.toLocaleDateString('af-ZA', options)}`;
    }
    return `${start.toLocaleDateString('af-ZA', options)} ${startTime} - ${end.toLocaleDateString('af-ZA', options)} ${endTime}`;
}

const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

export default function KalenderBladsyClient({
    alleGebeure,
    aanvanklikeFout,
}: {
    alleGebeure: VerwerkteGebeurtenis[];
    aanvanklikeFout: string | null;
}) {
    const [aktieweFilter, setAktieweFilter] = useState<Tydfilter>('hele_jaar');

    const gefiltreerdeGebeure = useMemo(() => {
        const nou = new Date();
        const vandagBegin = new Date(nou.getFullYear(), nou.getMonth(), nou.getDate());
        const eindeVanHierdieWeek = new Date(vandagBegin);
        eindeVanHierdieWeek.setDate(vandagBegin.getDate() + (7 - vandagBegin.getDay()));
        const eindeVanVolgendeWeek = new Date(eindeVanHierdieWeek);
        eindeVanVolgendeWeek.setDate(eindeVanHierdieWeek.getDate() + 7);
        const eindeVanHierdieMaand = new Date(vandagBegin.getFullYear(), vandagBegin.getMonth() + 1, 1);
        const eindeVanVolgendeMaand = new Date(vandagBegin.getFullYear(), vandagBegin.getMonth() + 2, 1);
        const beginVanVolgendeJaar = new Date(vandagBegin.getFullYear() + 1, 0, 1);
        const eindeVanVolgendeJaar = new Date(vandagBegin.getFullYear() + 2, 0, 1);

        switch (aktieweFilter) {
            case 'week':
                return alleGebeure.filter(e => e.start >= vandagBegin && e.start < eindeVanHierdieWeek);
            case 'volgende_week':
                return alleGebeure.filter(e => e.start >= eindeVanHierdieWeek && e.start < eindeVanVolgendeWeek);
            case 'maand':
                return alleGebeure.filter(e => e.start >= vandagBegin && e.start < eindeVanHierdieMaand);
            case 'volgende_maand':
                return alleGebeure.filter(e => e.start >= eindeVanHierdieMaand && e.start < eindeVanVolgendeMaand);
            case 'hele_jaar':
                return alleGebeure.filter(e => e.start >= vandagBegin && e.start < beginVanVolgendeJaar);
            case 'volgende_jaar':
                return alleGebeure.filter(e => e.start >= beginVanVolgendeJaar && e.start < eindeVanVolgendeJaar);
            default:
                return alleGebeure.filter(e => e.start >= vandagBegin && e.start < eindeVanHierdieMaand);
        }
    }, [aktieweFilter, alleGebeure]);

    if (aanvanklikeFout) {
        return (
            <div className="bg-white shadow-xl rounded-lg max-w-4xl mx-auto p-6 md:p-12 text-center">
                <h1 className="text-3xl font-bold text-rose-900">Kalender Fout</h1>
                <p className="mt-4 text-zinc-700">{aanvanklikeFout}</p>
            </div>
        );
    }

    const getButtonClass = (filter: Tydfilter) => {
        return `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${aktieweFilter === filter
            ? 'bg-rose-900 text-white'
            : 'text-zinc-600 hover:bg-zinc-100'
            }`;
    };

    const handleSaveToCalendar = async (event: VerwerkteGebeurtenis) => {
        try {
            const icsMod = await import('ics');
            const createEvent = icsMod.createEvent ?? (icsMod as any).default?.createEvent ?? icsMod;

            const isAllDay = (
                event.start.getHours() === 0 &&
                event.start.getMinutes() === 0 &&
                event.end.getHours() === 0 &&
                event.end.getMinutes() === 0
            );

            let startArray: [number, number, number] | [number, number, number, number, number];
            let endArray: [number, number, number] | [number, number, number, number, number];

            if (isAllDay) {
                startArray = [
                    event.start.getFullYear(),
                    event.start.getMonth() + 1,
                    event.start.getDate(),
                ];

                const adjustedEnd = new Date(event.end);
                if (adjustedEnd.getTime() === event.start.getTime()) {
                    adjustedEnd.setDate(adjustedEnd.getDate() + 1);
                }
                endArray = [
                    adjustedEnd.getFullYear(),
                    adjustedEnd.getMonth() + 1,
                    adjustedEnd.getDate(),
                ];
            } else {
                startArray = [
                    event.start.getFullYear(),
                    event.start.getMonth() + 1,
                    event.start.getDate(),
                    event.start.getHours(),
                    event.start.getMinutes(),
                ];
                endArray = [
                    event.end.getFullYear(),
                    event.end.getMonth() + 1,
                    event.end.getDate(),
                    event.end.getHours(),
                    event.end.getMinutes(),
                ];
            }

            const { error, value } = createEvent({
                start: startArray,
                end: endArray,
                title: event.summary,
                description: event.description || '',
                location: event.location || '',
            });

            if (error) {
                console.error('ICS createEvent fout:', error);
                alert('Kon nie die iCal inhoud genereer nie.');
                return;
            }

            const filename = `${event.summary.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event'}.ics`;
            const blob = new Blob([value as any], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            console.error('Kon nie ics genereer of aflaai nie:', e);
            alert('Jammer, kon nie die kalender-lêer skep nie.');
        }
    };


    return (
        <div className="bg-white shadow-xl rounded-lg max-w-4xl mx-auto p-6 md:p-12 ">
            
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                    Skoolkalender
                </h1>
                <p className="mt-4 text-lg text-zinc-700">
                    Alle opkomende akademiese, sport- en kultuurgebeure.
                </p>
            </motion.div>

            {/* Die Tabs */}
            <div className="mt-12 mb-8 flex flex-wrap justify-center gap-2 border-b border-zinc-200 pb-4">
                <button onClick={() => setAktieweFilter('week')} className={getButtonClass('week')}>
                    Hierdie Week
                </button>
                <button onClick={() => setAktieweFilter('volgende_week')} className={getButtonClass('volgende_week')}>
                    Volgende Week
                </button>
                <button onClick={() => setAktieweFilter('maand')} className={getButtonClass('maand')}>
                    Hierdie Maand
                </button>
                <button onClick={() => setAktieweFilter('volgende_maand')} className={getButtonClass('volgende_maand')}>
                    Volgende Maand
                </button>
                <button onClick={() => setAktieweFilter('hele_jaar')} className={getButtonClass('hele_jaar')}>
                    Hele Jaar
                </button>
                <button onClick={() => setAktieweFilter('volgende_jaar')} className={getButtonClass('volgende_jaar')}>
                    Volgende Jaar
                </button>
            </div>

            {/* Gebeurtenis-lys */}
            <div>
                {gefiltreerdeGebeure.length > 0 ? (
                    <motion.ul
                        role="list"
                        className="divide-y divide-zinc-200"
                        layout
                    >
                        {gefiltreerdeGebeure.map((event) => (
                            <motion.li
                                key={event.id}
                                className="flex flex-col sm:flex-row gap-x-4 py-6" // Gebruik nou flex-col op mobiel
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layout
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex flex-1 gap-x-4">
                                    <div className="pt-1">
                                        <CalendarIcon />
                                    </div>
                                    <div className="flex-auto">
                                        <h3 className="text-lg font-semibold leading-6 text-zinc-900">
                                            {event.summary}
                                        </h3>
                                        <p className="mt-2 text-base font-semibold text-zinc-700">
                                            {formatDateRange(event.start, event.end)}
                                        </p>
                                        {event.location && (
                                            <p className="mt-1 text-sm text-zinc-500">
                                                <strong>Plek:</strong> {event.location}
                                            </p>
                                        )}
                                        {event.description && (
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* --- 4. VOEG DIE AFLAAI-KNOPPIE HIER BY --- */}
                                <div className="mt-4 sm:mt-0 sm:ml-4 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveToCalendar(event)}
                                        className="flex items-center justify-center rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-inset ring-zinc-300 transition hover:bg-zinc-200"
                                    >
                                        <DownloadIcon />
                                        Stoor op Kalender
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <motion.p
                        className="text-center text-zinc-600 py-12"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        Daar is geen gebeure vir hierdie tydperk nie.
                    </motion.p>
                )}
            </div>
        </div>
    );
}