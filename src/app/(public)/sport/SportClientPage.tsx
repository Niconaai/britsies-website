// src/app/(public)/sport/SportClientPage.tsx
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { DbSportType, DbSportAchievement } from "@/types/supabase";
// --- REGSTELLING: Voer ons nuwe tipe in ---
import type { OrganiserWithDetails } from "./page";

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// --- Sub-komponente vir hierdie bladsy ---

// 1. Kaart vir 'n Sportsoort
const SportTypeCard = ({ sport }: { sport: DbSportType }) => (
    <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
        <div className="relative h-108 w-full bg-zinc-100">
            <Image
                src={sport.icon_url || '/wapen.png'}
                alt={sport.name}
                fill
                className="object-contain p-6"
            />
        </div>
        <div className="flex-1 p-6">
            <h3 className="text-xl font-bold text-rose-900">{sport.name}</h3>
            <p className="mt-1 text-sm font-semibold text-amber-600">{sport.season}</p>
            <p className="mt-3 text-sm text-zinc-600">
                {sport.description || 'Meer inligting binnekort beskikbaar.'}
            </p>
        </div>
    </motion.div>
);

// 2. Kaart vir 'n Organiseerder
const OrganiserCard = ({ person }: { person: OrganiserWithDetails }) => {
    // Gebruik personeel-data indien beskikbaar, anders val terug na eksterne naam
    const name = person.staff_members?.full_name || person.external_coach_name;
    const title = '';//person.staff_members?.title || person.role; // Gebruik personeel se titel (Mnr/Mev)
    const imageUrl = person.staff_members?.image_url || '/wapen.png'; 

    return (
        <div className="flex flex-col items-center text-center">
           <div className="relative h-56 w-40 md:h-64 md:w-48 overflow-hidden rounded-lg shadow-md">
                <Image
                    src={imageUrl}
                    alt={name || 'Personeelfoto'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 160px, 192px"
                />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-rose-900">{title} {name}</h3>
            <p className="text-sm text-zinc-600">{person.role} ({person.sport_types?.name})</p>
        </div>
    );
};

// 3. Modaal vir Prestasies
const AchievementModal = ({ imageUrl, alt, onClose }: { imageUrl: string, alt: string, onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative h-full w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
        >
            <Image
                src={imageUrl}
                alt={alt}
                layout="fill"
                objectFit="contain"
            />
        </motion.div>
        <button
            className="absolute top-6 right-6 text-white text-4xl font-bold"
            onClick={onClose}
        >
            &times;
        </button>
    </motion.div>
);

// --- Die hoof Kliënt-komponent ---
export default function SportClientPage({
    sportTypes,
    organisers, // <-- Prop is hernoem
    achievements
}: {
    sportTypes: DbSportType[];
    organisers: OrganiserWithDetails[]; // <-- Prop is hernoem
    achievements: DbSportAchievement[];
}) {

    const [modalImage, setModalImage] = useState<string | null>(null);
    const [modalAlt, setModalAlt] = useState<string>('');

    const openModal = (image: DbSportAchievement) => {
        setModalImage(image.image_url);
        setModalAlt(image.title || 'Prestasie');
    };

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
                    alt="Hoërskool Brits Sport"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-rose-900/0 z-5"></div>
                <motion.div
                    className="relative z-20 mx-auto max-w-4xl text-center"
                    variants={fadeInUp}
                    animate="animate"
                    //initial="initial"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                        Sport
                    </h1>
                    <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        Waar Karakter op die Veld Gebou Word
                    </p>
                </motion.div>
            </motion.section>

            {/* --- 2. SPORT-ETOS --- */}
            <motion.section
                className="bg-white py-16 sm:py-24"
                variants={fadeInUp}
                //initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-strong:text-rose-900 prose-h2:text-rose-900">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                            Ons Sport-etos
                        </h2>
                        <p className="mt-6 leading-8 text-zinc-700">
                            By Hoërskool Brits glo ons sport is 'n verlengstuk van die klaskamer. Ons fokus op massadeelname om elke leerder 'n kans te gee om gesonde gewoontes te kweek, terwyl ons ook 'n platform bied vir uitnemendheid en top-prestasie vir ons mededingende atlete.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* --- 3. ONS SPORTSOORTE --- */}
            <motion.section
                className="bg-zinc-50 py-16 sm:py-24"
                variants={fadeInUp}
                //initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                        Ons Sport-aanbod
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {sportTypes.map((sport) => (
                            <SportTypeCard key={sport.id} sport={sport} />
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* --- 4. PRESTASIE-GALERY --- */}
            {achievements.length > 0 && (
                <motion.section
                    className="bg-white py-16 sm:py-24"
                    variants={fadeInUp}
                    //initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                            Onlangse Prestasies
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                            {achievements.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={fadeInUp}
                                    onClick={() => openModal(item)}
                                    className="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                                >
                                    <div className="relative aspect-3/4 bg-zinc-100">
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="bg-white p-4 text-center">
                                        <p className="font-semibold text-rose-900">{item.title}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* --- 5. SPORTORGANISEERDERS (HERNOEM) --- */}
            {organisers.length > 0 && (
                <section className="bg-zinc-50 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                            Ons Sportorganiseerders
                        </h2>
                        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                            {organisers.map((coach) => (
                                <OrganiserCard key={coach.id} person={coach} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- 6. OPROEP TOT AKSIE (CTA) --- */}
            <section className="bg-rose-900 py-16 sm:py-20">
                <motion.div
                    className="mx-auto max-w-4xl px-4 text-center"
                    variants={fadeInUp}
                    //initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Klaar om 'n Britsie te word?
                    </h2>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/raak-betrokke"
                            className="w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-rose-900 shadow-lg transition hover:bg-zinc-100 sm:w-auto"
                        >
                            Raak Betrokke
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

            {/* --- Modaal-bestuur --- */}
            <AnimatePresence>
                {modalImage && (
                    <AchievementModal
                        imageUrl={modalImage}
                        alt={modalAlt}
                        onClose={() => setModalImage(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}