// src/app/(public)/kultuur/KultuurClientPage.tsx
'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DbCultureActivity } from "@/types/supabase";
import type { OrganiserWithDetails } from "./page"; // Voer in vanaf ons page.tsx

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// --- Sub-komponente vir hierdie bladsy ---

// 1. Kaart vir 'n Kultuur-aktiwiteit
const CultureActivityCard = ({ activity }: { activity: DbCultureActivity }) => (
    <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
        <div className="relative h-48 w-full bg-zinc-100">
            <Image
                src={activity.icon_url || '/wapen.png'}
                alt={activity.name}
                fill
                className="object-contain p-6" // 'contain' vir ikone
            />
        </div>
        <div className="flex-1 p-6">
            <h3 className="text-xl font-bold text-rose-900">{activity.name}</h3>
            <p className="mt-3 text-sm text-zinc-600">
                {activity.description || 'Meer inligting binnekort beskikbaar.'}
            </p>
        </div>
    </motion.div>
);

// 2. Kaart vir 'n Organiseerder
const OrganiserCard = ({ person }: { person: OrganiserWithDetails }) => {
    const name = person.staff_members?.full_name;
    const title = '';//person.staff_members?.title;
    const imageUrl = person.staff_members?.image_url || '/wapen.png'; 

    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative h-48 w-40 overflow-hidden rounded-lg shadow-md">
                <Image
                    src={imageUrl}
                    alt={name || 'Personeelfoto'}
                    fill
                    className="object-cover"
                />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-rose-900">{title} {name}</h3>
            <p className="text-sm text-zinc-600">{person.role} ({person.culture_activities?.name})</p>
        </div>
    );
};

// --- Die hoof Kliënt-komponent ---
export default function KultuurClientPage({
    activities,
    organisers
}: {
    activities: DbCultureActivity[];
    organisers: OrganiserWithDetails[];
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
                    src="/wapen.jpg" // Placeholder: Ons kort 'n goeie kultuur-foto
                    alt="Hoërskool Brits Kultuur"
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
                        Kultuur
                    </h1>
                    <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        Ons Hartklop en Siel
                    </p>
                </motion.div>
            </motion.section>

            {/* --- 2. KULTUUR-ETOS --- */}
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
                            Ons Kulturele Doelwit
                        </h2>
                        <p className="mt-6 leading-8 text-zinc-700">
                            By Hoërskool Brits is kultuur die platform waar elke leerder 'n stem vind. Ons moedig kreatiwiteit, selfvertroue en spanwerk aan deur 'n wye verskeidenheid aktiwiteite wat beide die individu en die groep laat groei.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* --- 3. ONS KULTUUR-AKTIWITEITE --- */}
            <motion.section
                className="bg-zinc-50 py-16 sm:py-24"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                        Ons Kultuur-aanbod
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {activities.map((activity) => (
                            <CultureActivityCard key={activity.id} activity={activity} />
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* --- 4. ORGANISEERDERS --- */}
            {organisers.length > 0 && (
                <section className="bg-white py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                            Ons Kultuur-organiseerders
                        </h2>
                        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {organisers.map((person) => (
                                <OrganiserCard key={person.id} person={person} />
                            ))}
                        </div>
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