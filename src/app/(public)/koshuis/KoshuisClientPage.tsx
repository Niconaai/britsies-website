// src/app/(public)/koshuis/KoshuisClientPage.tsx
'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { StaffMemberWithDept } from "@/types/supabase";
import KoshuisPakketAd from "../KoshuisPakketAd";

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// 'n Sub-komponent om 'n personeellid-profielkaart te vertoon
const StaffProfileCard = ({ person }: { person: StaffMemberWithDept }) => (
    <div className="flex flex-col items-center text-center">
        <div className="relative h-76 w-54 md:h-88 md:w-66 overflow-hidden rounded-lg shadow-md">
            <Image
                src={person.image_url || '/wapen.png'}
                alt={person.full_name}
                fill
                className="object-cover"
            />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-rose-900">{person.full_name}</h3>
        <p className="text-sm text-zinc-600">{person.title}</p>
    </div>
);

// Die hoof Kliënt-komponent
export default function KoshuisClientPage({
    koshuisPersoneel
}: {
    koshuisPersoneel: StaffMemberWithDept[];
}) {

    return (
        <div className="flex flex-col bg-white">
            
            {/* --- 1. HERO SEKSIE --- */}
            <motion.section 
                className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    src="/wapen.jpg" // Placeholder
                    alt="Hoërskool Brits Koshuis"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-rose-900/0 z-5"></div>
                <motion.div
                    className="relative z-20 mx-auto max-w-4xl text-center"
                    variants={fadeInUp}
                    animate="animate"
                    initial="initial"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                        WR Joyce Koshuis
                    </h1>
                    <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        'n Tuiste weg van die huis.
                    </p>
                </motion.div>
            </motion.section>

            {/* --- 2. KOSHUIS-INLIGTING SEKSIE --- */}
            <motion.section
                className="bg-white py-16 sm:py-24"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-strong:text-rose-900 prose-h2:text-rose-900">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                            Welkom by WR Joyce Koshuis
                        </h2>
                        <p className="mt-6 leading-8 text-zinc-700">
                            Ons koshuis bied 'n veilige, ondersteunende en gedissiplineerde omgewing waar leerders kan floreer. Met moderne fasiliteite, gebalanseerde etes, en toegewyde personeel, verseker ons dat elke koshuisleerder soos deel van die familie voel.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* --- 3. DIE ALLES-IN-EEN-PAKKET --- */}
            <section
                className="bg-zinc-50 py-16 sm:py-24"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <KoshuisPakketAd />
                </div>
            </section>

            {/* --- 4. KOSHUISPERSONEEL SEKSIE --- */}
            {koshuisPersoneel.length > 0 && (
                <section className="bg-white py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                                Ontmoet die Koshuispersoneel
                            </h2>
                            <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {koshuisPersoneel.map((person) => (
                                    <StaffProfileCard key={person.id} person={person} />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* --- 5. OPROEP TOT AKSIE (CTA) --- */}
            <section className="bg-rose-900 py-16 sm:py-20">
                <motion.div
                    className="mx-auto max-w-4xl px-4 text-center"
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Gereed om 'n Britsie te word?
                    </h2>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/aansoek"
                            className="w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-rose-900 shadow-lg transition hover:bg-zinc-100 sm:w-auto"
                        >
                            Doen Aansoek
                        </Link>
                        <Link
                            href="/kontak"
                            className="w-full rounded-md border border-white bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
                        >
                            Kontak Ons
                        </Link>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}