// src/app/(public)/oor-ons/OorOnsClientPage.tsx
'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { StaffMemberWithDept } from "@/types/supabase";

// Animasie-variant
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// 'n Sub-komponent om 'n personeellid-profielkaart te vertoon
const StaffProfileCard = ({ person }: { person: StaffMemberWithDept }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative h-48 w-40 overflow-hidden rounded-lg shadow-md">
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
export default function OorOnsClientPage({
  bestuurPersoneel,
  beheerliggaamPersoneel
}: {
  bestuurPersoneel: StaffMemberWithDept[];
  beheerliggaamPersoneel: StaffMemberWithDept[];
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
          alt="Hoërskool Brits Hoofgebou"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-rose-900/40 z-5"></div>
        <motion.div
          className="relative z-20 mx-auto max-w-4xl text-center"
          variants={fadeInUp}
          animate="animate"
          initial="initial"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            Oor Hoërskool Brits
          </h1>
          <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Koersvas na die Kruin
          </p>
        </motion.div>
      </motion.section>

      {/* --- 2. VISIE & MISSIE SEKSIE --- */}
      <motion.section
        className="bg-white py-16 sm:py-24"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-strong:text-rose-900 prose-h2:text-rose-900">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ons Visie & Missie
            </h2>
            <p className="mt-6 leading-8 text-zinc-700">
              <strong>Visie:</strong> Om 'n toonaangewende opvoedkundige instelling te wees wat leerders deur middel van Christelike waardes, uitnemende akademie, sport en kultuur toerus om koersvas hul volle potensiaal te bereik.
            </p>
            <p className="mt-6 leading-8 text-zinc-700">
              <strong>Missie:</strong> Ons skep 'n dinamiese, gedissiplineerde en ondersteunende omgewing waar elke leerder die geleentheid kry om te groei, te lei en 'n positiewe bydrae tot die samelewing te maak.
            </p>
          </div>
        </div>
      </motion.section>

      {/* --- 3. LEIERSKAP SEKSIE --- */}
      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Afdeling 3a: Skoolbestuur */}
          {bestuurPersoneel.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                Ontmoet die Skoolbestuur
              </h2>
              <div className="mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                {bestuurPersoneel.map((person) => (
                  <StaffProfileCard key={person.id} person={person} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Afdeling 3b: Beheerliggaam */}
          {beheerliggaamPersoneel.length > 0 && (
            <motion.div
              className="mt-20"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                Ons Beheerliggaam
              </h2>
              <div className="mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                {beheerliggaamPersoneel.map((person) => (
                  <StaffProfileCard key={person.id} person={person} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- 4. GESKIEDENIS SEKSIE (Opgedateer vir portret-prent) --- */}
      <motion.section
          className="bg-white py-16 sm:py-24"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
      >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="space-y-16 lg:space-y-24">

                  {/* Onderwerp 1: Ons Ryke Geskiedenis */}
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
                      <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-xl md:h-80">
                          <Image
                              src="/wapen.png" // Placeholder
                              alt="Historiese Foto van Skool"
                              fill
                              className="object-contain"
                          />
                      </div>
                      <div className="prose prose-lg prose-zinc prose-h2:text-rose-900">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                              Ons Ryke Geskiedenis
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Sedert 1910 het 'n tweemanskooltjie vir primêre onderwys naby Britsstasie bestaan...
                          </p>
                          <p className="mt-6 leading-8 text-zinc-700">
                              In 1937 is toestemming van die T.O.D verkry om met die eerste matriekklas te begin...
                          </p>
                      </div>
                  </div>

                  {/* Onderwerp 2: Skoolkode & Skoollied */}
                  <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-h2:text-rose-900">
                      <div>
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                              Skoolkode
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Ek dank God dat Hy my lewe en gesondheid gee...
                          </p>
                          {/* ... res van skoolkode paragrawe ... */}
                      </div>
                      <div className="mt-16">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                              Skoollied
                          </h2>
                          <div className="mt-6 font-semibold leading-8 text-zinc-700">
                              <p>Vrolik en hartelik sing ons nou saam...</p>
                              <p className="mt-4">Kom seuns en dogters staan jul man...</p>
                              <p className="mt-4">Almal Koersvas na die Kruin</p>
                          </div>
                      </div>
                  </div>

                  {/* Onderwerp 3: Wapen Geskiedenis (Met Portret-boks) */}
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
                      <div className="relative mx-auto w-64 h-96 overflow-hidden rounded-lg shadow-xl md:h-96">
                          <Image
                              src="/ou_wapen.webp" // Prent moet in /public wees
                              alt="Ou Wapen"
                              fill
                              className="object-contain"
                          />
                      </div>
                      <div className="prose prose-lg prose-zinc prose-h2:text-rose-900">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                              Oorspronklike Wapen
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Daar is dadelik daadwerklike pogings aangewend om 'n gepaste wapen te kry... (1947).
                          </p>
                          <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
                              Oorspronklike Leuse
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              ...hy het gesê: “My doodkry is min!”
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </motion.section>

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