// src/app/(public)/KoshuisPakketAd.tsx
'use client'; // <-- Belangrik, want dit gebruik 'motion'

import Image from "next/image";
import { motion } from "framer-motion";

// Ikoon vir die lys
const CheckIcon = () => (
  <svg className="h-6 w-6 shrink-0 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Animasie-variant (vir die hoof-komponent)
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Die selfstandige komponent
export default function KoshuisPakketAd() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-rose-900 shadow-xl"
      // Animasie word nou hier binne hanteer
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 opacity-10">
        <Image 
          src="/wapen.png" 
          alt="Hoërskool Brits Wapen" 
          fill 
          className="object-contain scale-150"
        />
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3">
        {/* Inhoud-kolom */}
        <div className="md:col-span-2 p-8 md:p-12">
          <p className="text-xl font-bold uppercase tracking-wide text-amber-400">Groot Nuus!</p>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Hoërskool Brits Bied Aan: <br />Die Alles-in-Een-Pakket!
          </h2>
          <p className="mt-6 text-lg font-semibold text-white">Wat behels die pakket?</p>
          <ul role="list" className="mt-4 space-y-3">
            <li className="flex gap-x-3"><CheckIcon /> <span className="text-rose-100">Om 100% 'n volwaardige Britsie te wees!</span></li>
            <li className="flex gap-x-3"><CheckIcon /> <span className="text-rose-100">Skoolfonds</span></li>
            <li className="flex gap-x-3"><CheckIcon /> <span className="text-rose-100">Koshuisinwoning (Jou eie kamer & gesonde etes)</span></li>
            <li className="flex gap-x-3"><CheckIcon /> <span className="text-rose-100">Toegang tot alle sport-, kultuur-, en ander aktiwiteite.</span></li>
          </ul>
        </div>
        
        {/* Prys-kolom */}
        <div className="flex flex-col items-center justify-center bg-amber-400 p-8 md:p-12 text-center">
          <p className="text-2xl font-bold text-rose-900">Vir slegs</p>
          <p className="my-2 text-5xl font-extrabold text-rose-900 sm:text-6xl">R3950-00</p>
          <p className="text-2xl font-bold text-rose-900">per maand</p>
          <hr className="my-6 w-full border-t border-rose-800/20" />
          <p className="text-sm font-semibold text-rose-900">Vir navrae kontak:</p>
          <p className="mt-1 text-lg font-bold text-rose-900">Mnr. Jakkie Louw</p>
          <a 
            href="tel:0829227456" 
            className="mt-1 text-xl font-bold text-rose-900 transition-transform hover:scale-105"
          >
            082 922 7456
          </a>
        </div>
      </div>
    </motion.div>
  );
}