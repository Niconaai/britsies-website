// src/app/(public)/privaatheid/PrivaatheidClientPage.tsx
'use client';

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PrivaatheidClientPage() {
  return (
    <div className="bg-white">
      {/* 1. Hero-banier */}
      <motion.section 
          className="relative flex h-[40vh] min-h-[250px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
      >
          <Image
              src="/wapen.jpg" 
              alt="Hoërskool Brits"
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
          />
          <div className="absolute inset-0 bg-rose-900/40 z-5"></div>
          <motion.div
              className="relative z-20 mx-auto max-w-4xl text-center"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
          >
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                  Privaatheidsbeleid
              </h1>
              <p className="mt-4 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                  Beskerming van Persoonlike Inligting (POPIA)
              </p>
          </motion.div>
      </motion.section>

      {/* 2. Inhoud-afdeling */}
      <motion.section
        className="bg-white py-16 sm:py-24"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* --- REGSTELLING: 'prose' klasse verwyder --- */}
            <article className="mx-auto max-w-3xl">
                
                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    Inleiding
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    {/* <strong className="font-semibold text-zinc-900">[PLEKHOUER: Skool moet Amptelike Teks Verskaf]</strong> */}
                    <br />
                    Hoërskool Brits ("ons", "ons s'n", of "die Skool") is verbind tot die beskerming
                    van jou persoonlike inligting in ooreenstemming met die Wet op die Beskerming
                    van Persoonlike Inligting (POPIA) van Suid-Afrika. Hierdie beleid sit uiteen
                    hoe ons persoonlike inligting insamel, gebruik, berg, en beskerm.
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    1. Watter Inligting Samel Ons In?
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    Ons samel inligting in wat nodig is vir die funksionering van die skool, insluitend:
                </p>
                <ul className="list-disc list-inside space-y-2 text-lg leading-8 text-zinc-700 mb-4 pl-4">
                    {/* <li>
                        <strong className="font-semibold text-zinc-900">Aansoeke:</strong> Inligting oor leerders, ouers, en voogde soos
                        uiteengesit in die aanlyn aansoekvorm (name, ID-nommers, kontakbesonderhede,
                        akademiese geskiedenis, mediese inligting).
                    </li>
                    <li>
                        <strong className="font-semibold text-zinc-900">Aanlyn Winkel:</strong> Inligting benodig om bestellings te verwerk
                        (naam, e-posadres, telefoonnommer, adres vir rekords). Let wel: Ons stoor
                        geen kredietkaartbesonderhede nie; dit word veilig deur ons
                        betalingspoort (Yoco) hanteer.
                    </li> */}
                    <li>
                        <strong className="font-semibold text-zinc-900">Kontakvorms:</strong> Naam, e-posadres, en boodskap wat jy aan ons stuur.
                    </li>
                </ul>

                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    2. Hoe Gebruik Ons Jou Inligting?
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    {/* <strong className="font-semibold text-zinc-900">[PLEKHOUER: Skool moet Amptelike Teks Verskaf]</strong> */}
                    <br />
                    Jou inligting word slegs gebruik vir die doel waarvoor dit ingesamel is:
                </p>
                <ul className="list-disc list-inside space-y-2 text-lg leading-8 text-zinc-700 mb-4 pl-4">
                    {/* <li>Om aansoeke vir toelating te verwerk en te assesseer.</li>
                    <li>Om aanlyn winkelbestellings te administreer en te vervul.</li> */}
                    <li>Om op jou navrae te reageer.</li>
                    <li>Vir interne rekordhouding en skooladministrasie.</li>
                </ul>

                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    3. Deel van Inligting
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    Ons sal nie jou persoonlike inligting aan enige derde party verkoop, verhuur,
                    of versprei nie, behalwe soos vereis deur die wet of met jou uitdruklike
                    toestemming. Inligting word slegs gedeel met diensverskaffers onder streng
                    privaatheidsvoorwaardes.
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    4. Sekuriteit
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    Alle data word geïnkripteer (encrypted) tydens oordrag (HTTPS) en gestoor
                    in 'n veilige, wagwoord-beskermde databasis. Toegang tot
                    persoonlike inligting word streng beperk tot gemagtigde skoolpersoneel.
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl mb-6 mt-10">
                    5. Jou Regte
                </h2>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    {/* <strong className="font-semibold text-zinc-900">[PLEKHOUER: Skool moet Amptelike Teks Verskaf]</strong> */}
                    <br />
                    Jy het die reg om:
                </p>
                <ul className="list-disc list-inside space-y-2 text-lg leading-8 text-zinc-700 mb-4 pl-4">
                    <li>Toegang te versoek tot die persoonlike inligting wat ons van jou hou.</li>
                    <li>Te versoek dat ons verkeerde inligting regstel.</li>
                    <li>Te versoek dat ons jou inligting skrap (onderhewig aan wetlike en
                        operasionele vereistes).
                    </li>
                </ul>
                <p className="text-lg leading-8 text-zinc-700 mb-4">
                    Vir enige navrae oor hierdie beleid of jou persoonlike inligting, kontak
                    asseblief die skool se Inligtingsbeampte by 
                    <a href="mailto:hsbrits@hsbrits.co.za" className="text-rose-800 hover:underline"> hsbrits@hsbrits.co.za</a>.
                </p>

            </article>
        </div>
      </motion.section>
    </div>
  );
}