// src/app/(public)/oor-ons/OorOnsClientPage.tsx
'use client';

// --- REGSTELLING 1: VOEG 'useRef' EN 'useInView' BY ---
import React, { useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
// 'useInView' word bygevoeg
import { motion, useInView } from "framer-motion";
import type { StaffMemberWithDept } from "@/types/supabase";

// Animasie-variant (Bly dieselfde)
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
        // --- REGSTELLING 2: SIZES PROP VIR PERSONEEL ---
        sizes="(max-width: 767px) 216px, 264px"
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

  // --- REGSTELLING 3: SKEP REFS VIR ELKE ANIMASIE-SEKSIE ---
  const visieRef = useRef(null);
  const bestuurRef = useRef(null);
  const beheerliggaamRef = useRef(null);
  const geskiedenisRef = useRef(null);
  const ctaRef = useRef(null);

  // Skep 'n 'isInView' hook vir elke ref.
  // Ons gebruik 'amount: 0.2' (20%) - dit is baie veiliger vir fone.
  const isVisieInView = useInView(visieRef, { once: true, amount: 0.2 });
  const isBestuurInView = useInView(bestuurRef, { once: true, amount: 0.2 });
  const isBeheerliggaamInView = useInView(beheerliggaamRef, { once: true, amount: 0.2 });
  const isGeskiedenisInView = useInView(geskiedenisRef, { once: true, amount: 0.1 }); // Selfs laer vir hierdie groot seksie
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });
  // --- EINDE REGSTELLING 3 ---


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
          // --- REGSTELLING 2: SIZES PROP VIR HERO ---
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-rose-900/0 z-5"></div>
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
        // --- REGSTELLING 4: VERVANG 'whileInView' MET 'ref' EN 'animate' ---
        ref={visieRef}
        className="bg-white py-16 sm:py-24"
        variants={fadeInUp}
        initial="initial" // <-- initial IS NODIG vir die animasie
        animate={isVisieInView ? "animate" : undefined} // <-- Handmatige beheer
        // 'whileInView' en 'viewport' is verwyder
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-strong:text-rose-900 prose-h2:text-rose-900">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
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
          {bestuurPersoneel.length > 0 && (
            <motion.div
              // --- REGSTELLING 4: VERVANG 'whileInView' ---
              ref={bestuurRef}
              variants={fadeInUp}
              initial="initial"
              animate={isBestuurInView ? "animate" : undefined}
            >
              <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                Skoolbestuur
              </h2>
              <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {bestuurPersoneel.map((person) => (
                  <StaffProfileCard key={person.id} person={person} />
                ))}
              </div>
            </motion.div>
          )}
          {beheerliggaamPersoneel.length > 0 && (
            <motion.div
              // --- REGSTELLING 4: VERVANG 'whileInView' ---
              ref={beheerliggaamRef}
              className="mt-20"
              variants={fadeInUp}
              initial="initial"
              animate={isBeheerliggaamInView ? "animate" : undefined}
            >
              <h2 className="text-center text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                Beheerliggaam
              </h2>
              <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {beheerliggaamPersoneel.map((person) => (
                  <StaffProfileCard key={person.id} person={person} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- 4. GESKIEDENIS SEKSIE --- */}
      <motion.section
          // --- REGSTELLING 4: VERVANG 'whileInView' ---
          ref={geskiedenisRef}
          className="bg-white py-16 sm:py-24"
          variants={fadeInUp}
          initial="initial"
          animate={isGeskiedenisInView ? "animate" : undefined}
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
                              // --- REGSTELLING 2: SIZES PROP ---
                              sizes="(max-width: 767px) 100vw, 50vw"
                          />
                      </div>
                      <div className="prose prose-lg prose-zinc prose-h2:text-rose-900">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                              Ons Ryke Geskiedenis
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Sedert 1910 het 'n tweemanskooltjie vir primêre onderwys naby Britsstasie bestaan wat sodanig uitgebrei het dat daar in 1925 reeds 5 onderwysers en 175 leerders aan die skool verbonde was. In 1928, met die dorpstigting, het die skool 220 leerlinge en 6 onderwysers gehad en bekend gestaan as die Brits Goewermentskool.
                          </p>
                          <p className="mt-6 leading-8 text-zinc-700">
                              In 1937 is toestemming van die T.O.D verkry om met die eerste matriekklas te begin. Die verkryging van amptelike hoërskoolstatus vir die hoërafdeling van die Brits Goewermentskool was onderhewig aan 'n proeftydperk van 5 jaar. Die Hoërskool Brits het eers op 4 Augustus 1942 volwaardige hoërskoolstatus gekry. Mnr. T. le Roux was die hoof oor 17 personeellede en 329 leerlinge.In 1943 aanvaar hy 'n pos as inspekteur van skole. Hy word opgevolg deur Mnr. H. van Dalsen. Die primêre- en sekondêre afdeling sou voortaan as twee aparte skole funksioneer.
                          </p>
                      </div>
                  </div>

                  {/* Onderwerp 2: Skoolkode & Skoollied */}
                  <div className="prose prose-lg prose-zinc mx-auto max-w-3xl text-center prose-h2:text-rose-900">
                      <div>
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                              Skoolkode
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                            Ek dank God dat Hy my lewe en gesondheid gee. Ek sal my ouers, onder wie se beskerming ek verkeer, en wat vir my so baie opoffer, nie teleurstel nie.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal daarna strewe om skoon en edel te lewe, en vir myself sal ek hoë ideale stel.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal die goeie naam van my ouerhuis, en ook dié van my skool in ere hou.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal beleefd wees teenoor my ouers, my onderwysers en alle ander mense.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal daarna strewe om my taal en gedrag te beheer, in die klaskamer, op die sportvelde en veral in die publiek.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal die eiendom van die skool, asook die skoolgebou en tuinery beskerm, en waar ek in die koshuis is, ook dié van die koshuis.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal die voorreg wat ek het om te studeer, nie verwaarloos nie.
                          </p>
                          <p className="mt-1 leading-8 text-zinc-700">
                            Ek sal daarna strewe om my werk, elke dag, na die beste van my vermoë te doen en ek sal sorg, dat my gedrag, selfs wanneer ek alleen is, oral en altyd vlekloos is.
                          </p>
                      </div>
                      <div className="mt-16">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                              Skoollied
                          </h2>
                          <div className="mt-6 font-semibold leading-8 text-zinc-700">
                              <p>
                                  Vrolik en hartelik sing ons nou saam<br />
                                  In hierdie hoërskool bou ons 'n volk van naam<br />
                                  Ons dank ons owerheid kragtig en koor<br />
                                  Vir kanse veel en mooi - die Toekoms wink daarvoor.
                              </p>
                              <p className="mt-4">
                                  Kom seuns en dogters staan jul man op sportveld<br />
                                  Dat ander weet jul sal jul eer laat geld<br />
                                  Doen nou 'n keuse van diens en trou
                              </p>
                              <p className="mt-4">
                                  Almal Koersvas na die Kruin
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Onderwerp 3: Wapen Geskiedenis */}
                  <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
                      <div className="relative mx-auto w-64 h-96 overflow-hidden rounded-lg shadow-xl md:h-96">
                          <Image
                              src="/ou_wapen.webp" // Prent moet in /public wees
                              alt="Ou Wapen"
                              fill
                              className="object-contain"
                              // --- REGSTELLING 2: SIZES PROP ---
                              sizes="256px"
                          />
                      </div>
                      <div className="prose prose-lg prose-zinc prose-h2:text-rose-900">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                              Geskiedenis van die oorspronklike wapen
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Daar is dadelik daadwerklike pogings aangewend om 'n gepaste wapen te kry. In die ontwerp moes besonderhede wat tipies van die omgewing is, ingewerk word - daarbenewens moes die ontwerp ook aansluit by die leuse: “MY DOODKRY IS MIN”.  Dit was die poging van Mej. S.M. Schiel, destydse onderwyseres in Natuurwetenskappe, wat met sukses bekroon is. (1947).
                          </p>
                          <h2 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl text-rose-900">
                              Geskiedenis van die oorspronklike leuse
                          </h2>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Die doringbome wat vandag oral op die terrein rondstaan, was nie altyd daar nie. Mnr. Hubrecht van Dalsen, hoof 1943-1950, het daardie bome uit die klipkoppe, wat agter die skool staan, laat uithaal en oorplant. Terwyl hy eendag in 1947 so deur die venster kyk na 'n klein doringboompie  so swaarkry om sy stammetjie weer regop te buig, het hy gesê: “My doodkry is min!”
                          </p>
                          <p className="mt-6 leading-8 text-zinc-700">
                              Net daar is besluit om dit die leuse van die skool te maak aangesien hierdie hoërskool reeds vanaf 1929 gespartel en gespook het op 'n bestaansreg.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </motion.section>

      {/* --- 5. OPROEP TOT AKSIE (CTA) --- */}
      <section className="bg-rose-900 py-16 sm:py-20">
        <motion.div
          // --- REGSTELLING 4: VERVANG 'whileInView' ---
          ref={ctaRef}
          className="mx-auto max-w-4xl px-4 text-center"
          variants={fadeInUp}
          initial={false}
          animate={isCtaInView ? "animate" : undefined}
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