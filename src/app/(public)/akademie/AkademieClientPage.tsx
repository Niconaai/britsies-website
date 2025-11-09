// src/app/(public)/akademie/AkademieClientPage.tsx
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { StaffMemberWithDept } from "@/types/supabase";

// --- Data vir die nuwe komponente ---
// Gebaseer op die inligting vanaf die ou webwerf
const vakkeGraad8en9 = [
    "Afrikaans Huistaal", "Engels Eerste Addisionele Taal", "Wiskunde",
    "Natuurwetenskap", "Sosiale Wetenskap (Geskiedenis & Geografie)", "Tegnologie",
    "Kuns en Kultuur (Kuns & Musiek)", "Lewensoriëntering", "Ekonomiese- en Bestuurswetenskappe"
];

const vakkeGraad10tot12 = [
    "Besigheidstudies", "Rekeningkunde", "Fisiese Wetenskappe", "Lewenswetenskappe",
    "Ingenieursgrafika en -ontwerp (IGO)", "Verbruikerstudies", "Gasvryheidstudies", 
    "Inligtingstegnologie (IT)", "Rekenaartoepassingstegnologie (RTT)", "Geografie", "Geskiedenis", "Musiek", "Drama",
    "Tegniese Wetenskap", "Tegniese Wiskunde", "Elektriese Tegnologie (Swaarstroom)", "Siviele Tegnologie",
    "Alpha Wiskunde (Naskool)"
];

const vakVereistes = [
    "Leerder MOET Wiskunde neem om Fisiese Wetenskappe, IT, of Rekeningkunde te kies.",
    "Leerder MOET Tegniese Wiskunde neem om Tegniese Wetenskap, Elektries, of Siviel te kies.",
    "Slegs EEN van die volgende mag geneem word: Wiskunde of Wiskundige Geletterdheid.",// Tegniese Wiskunde.",
    "Slegs EEN van die volgende mag geneem word: Fisiese Wetenskappe of Tegniese Wetenskap."
];

// Placeholder vir Matriekuitslae
const uitslaeData = [
    { year: 2024, imageUrl: "/matriek-uitslae-24.webp", alt: "Matriekuitslae 2024" },
    { year: 2023, imageUrl: "/wapen.png", alt: "Matriekuitslae 2023" },
    { year: 2022, imageUrl: "/matriek-uitslae-22.jpg", alt: "Matriekuitslae 2022" },
];
// --- Einde van Data ---

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

// --- NUUT: Komponent vir die Vakkeuse-lys ---
const SubjectList = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-12">
                Vakkeuses
            </h2>
            
            {/* Rooster vir vakke */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Kolom 1: Graad 8-9 */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
                    <h3 className="text-2xl font-semibold text-rose-800">Graad 8 & 9 (Verpligtend)</h3>
                    <ul className="mt-6 space-y-3 list-disc list-inside text-zinc-700">
                        {vakkeGraad8en9.map((vak, index) => (
                            <li key={index}>{vak}</li>
                        ))}
                    </ul>
                </div>

                {/* Kolom 2: Graad 10-12 */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
                    <h3 className="text-2xl font-semibold text-rose-800">Graad 10 - 12 (Keusevakke)</h3>
                    <ul className="mt-6 space-y-3 list-disc list-inside text-zinc-700">
                        {vakkeGraad10tot12.map((vak, index) => (
                            <li key={index}>{vak}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Vereistes-boks */}
            <aside className="mt-12 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-6 shadow-md">
                <h4 className="text-xl font-bold text-amber-900">Belangrike Vakkeuse-vereistes</h4>
                <ul className="mt-4 space-y-2 list-disc list-inside text-amber-800">
                    {vakVereistes.map((vereiste, index) => (
                        <li key={index}>{vereiste}</li>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

// --- NUUT: Komponent vir die Matriekuitslae-modal ---
const MatricResults = () => {
    const [modalImage, setModalImage] = useState<string | null>(null);

    return (
        <>
            {/* Rooster van Uitslae */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {uitslaeData.map((item) => (
                    <motion.div
                        key={item.year}
                        variants={fadeInUp}
                        onClick={() => setModalImage(item.imageUrl)}
                        className="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        <div className="relative aspect-3/4 bg-zinc-100">
                            <Image
                                src={item.imageUrl}
                                alt={item.alt}
                                fill
                                className="object-contain p-2" 
                            />
                        </div>
                        <div className="bg-white p-4 text-center dark:bg-zinc-800">
                            <p className="font-semibold text-rose-900 dark:text-white">Matriekuitslae {item.year}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Die Modaal self */}
            <AnimatePresence>
                {modalImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setModalImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative h-full w-full max-w-3xl"
                        >
                            <Image
                                src={modalImage}
                                alt="Volskerm uitslae"
                                layout="fill"
                                objectFit="contain"
                            />
                        </motion.div>
                        <button
                            className="absolute top-6 right-6 text-white text-4xl font-bold"
                            onClick={() => setModalImage(null)}
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};


// --- Die hoof Kliënt-komponent ---
export default function AkademieClientPage({
    personeelPerDepartement
}: {
    personeelPerDepartement: Record<string, StaffMemberWithDept[]>;
}) {

    // Kry die departement-name in die regte volgorde (reeds gesorteer deur die bediener)
    const departemente = Object.keys(personeelPerDepartement);

    return (
        <div className="flex flex-col">
            
            {/* --- 1. HERO SEKSIE --- */}
            <motion.section 
                className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    src="/wapen.jpg" // Placeholder
                    alt="Hoërskool Brits Akademie"
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
                        Akademie
                    </h1>
                    <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        Die Boustene van Uitnemendheid
                    </p>
                </motion.div>
            </motion.section>

            {/* --- 2. AKADEMIESE VISIE --- */}
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
                            Ons Akademiese Toewyding
                        </h2>
                        <p className="mt-6 leading-8 text-zinc-700">
                            By Hoërskool Brits glo ons dat 'n robuuste akademiese program die kern vorm van elke leerder se toekoms. Ons streef daarna om nie net kennis oor te dra nie, maar om kritiese denke, probleemoplossing en 'n lewenslange liefde vir leer te kweek.
                            Hoërskool Brits spog elke jaar met top Akademiese-uitslae.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* --- 3. VAKKEUSES (NUWE KOMPONENT) --- */}
            <motion.section
                className="bg-zinc-50 py-16 sm:py-24"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <SubjectList />
            </motion.section>

            {/* --- 4. MATRIEKUITSLAE (NUWE KOMPONENT) --- */}
            <motion.section
                className="bg-white py-16 sm:py-24"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                        Vorige Matriekuitslae
                    </h2>
                    <MatricResults />
                </div>
            </motion.section>
            
            {/* --- 5. PERSONEEL SEKSIE --- */}
            <section className="bg-zinc-50 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-16">
                        Ontmoet Ons Akademiese Personeel
                    </h2>
                    
                    <div className="space-y-16">
                        {departemente.map((deptNaam) => (
                            <motion.div
                                key={deptNaam}
                                variants={fadeInUp}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <h3 className="text-2xl font-semibold text-rose-800 border-b-2 border-amber-400 pb-2 mb-10">
                                    {deptNaam}
                                </h3>
                                <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
                                    {personeelPerDepartement[deptNaam].map((person) => (
                                        <StaffProfileCard key={person.id} person={person} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 6. OPROEP TOT AKSIE (CTA) --- */}
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