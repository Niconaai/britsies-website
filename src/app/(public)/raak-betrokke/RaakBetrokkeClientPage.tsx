// src/app/(public)/raak-betrokke/RaakBetrokkeClientPage.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// Ikoon vir die skakel-knoppie
const ArrowIcon = () => (
    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
);

const KruinLegendesCard = () => (
    <Link
        href="https://kruinlegendes.co.za/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-amber-500"
    >
        <div className="flex flex-col items-center text-center">
            <Image
                src="/kruin-legendes.png"
                alt="Kruin Legendes Logo"
                width={800}
                height={800}
                className="h-40 md:h-80 w-auto shadow-md"
            />
            <h3 className="mt-6 text-3xl font-bold text-rose-900">
                Word 'n Legende
            </h3>
            <p className="mt-2 text-zinc-700">
                Die "Kruin Legendes" is die amptelike alumni- en ondersteunersvereniging van Hoërskool Brits. Deur by hulle aan te sluit, belê jy direk in die toekoms van ons skool en die volgende generasie Britsies.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-rose-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all group-hover:bg-rose-800">
                Besoek Kruin Legendes Webwerf
                <ArrowIcon />
            </div>
        </div>
    </Link>
);

export default function RaakBetrokkeClientPage() {

    // Ons sal hierdie inhoud van die bemarker moet kry
    const momentumItems = [
        { title: "Digitale Transformasie", description: "Ons het 'n nuwe webwerf, aanlyn aansoekportaal en winkel geloods.", image: "/wapen.png" },
        { title: "Sport Opgraderings", description: "Tennisbaan opgraderings met pickle- en paddle-baan byvoegings.", image: "/tennisbane.jpeg" },
        { title: "Akademiese Vooruitgang", description: "Hoërskool Brits bied robotika aan as vak wat die nuwe generasie vroeg al blootstel aan die nuwe tegnologie.", image: "/wapen.png" },
        { title: "Fasiliteit Opgraderings", description: "Hoërskool Brits se kleedkamers op die sportterrein is wêreld-klas.", image: "/wapen.png" },
        //{ title: "Akademiese Prestasies", description: "Ons koor het nasionale erkenning by die ATKV-Applous finaal ontvang.", image: "/wapen.png" },
    ];

    const nextProject = {
        title: "Ons Volgende Doelwit",
        description: "Hoërskool Brits wil die vooruitstrewende gehalte handhaaf waaraan ons gewoond is. Kontak gerus die Kruin-Legendes oor hoe om betrokke te raak en te help hoe om die volgende doelwit van 'n droom na 'n realiteit te omskep.",
        image: "/wapen.png"
    };

    return (
        <div className="flex flex-col bg-zinc-50">
            {/* --- 1. HERO SEKSIE --- */}
            <section className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4">
                <Image
                    src="/matrieks25.jpeg"
                    alt="Hoërskool Brits Kampus"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 y-5 bg-rose-900/10 z-5"></div>

                <motion.div
                    className="relative z-20 mx-auto max-w-4xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                        style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                        Raak Betrokke
                    </h1>
                    <p className="mt-6 text-xl text-zinc-100"
                        style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        Ons bou reeds die toekoms. Help ons om die volgende mylpaal te bereik.
                    </p>
                </motion.div>
            </section>

            {/* --- 2. ONS MOMENTUM SEKSIE --- */}
            <motion.section
                className="bg-white py-16 sm:py-24"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                            Ons Momentum
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-zinc-700 max-w-3xl mx-auto">
                            Hoërskool Brits is 'n skool wat vorentoe beweeg. Ons is trots op ons onlangse vordering en die tasbare verbeterings wat ons reeds vir ons leerders kon skep.
                        </p>
                    </motion.div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {momentumItems.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                transition={{ delay: 0.1 * (i + 1) }}
                                className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-lg shadow-md  hover:scale-105"
                            >
                                <Image src={item.image} alt={item.title} height={400} width={600} className="h-40 md:h-80 w-auto rounded-2xl " />
                                <h3 className="mt-4 text-xl font-semibold text-rose-800">{item.title}</h3>
                                <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* --- 3. ONS VOLGENDE DOELWIT SEKSIE --- */}
            <motion.section
                className="bg-zinc-50 py-16 sm:py-24"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
                        <motion.div variants={fadeInUp}>
                            <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                                {nextProject.title}
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-zinc-700">
                                {nextProject.description}
                            </p>
                        </motion.div>
                        <motion.div variants={fadeInUp} transition={{ delay: 0.2 }} className="relative h-64 w-full overflow-hidden rounded-lg shadow-xl md:h-80">
                            <Image
                                src={nextProject.image}
                                alt={nextProject.title}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* --- 4. RAAK BETROKKE (KRUIN LEGENDES) SEKSIE --- */}
            <motion.section
                className="bg-white py-16 sm:py-24"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <motion.div variants={fadeInUp}>
                        <KruinLegendesCard />
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}