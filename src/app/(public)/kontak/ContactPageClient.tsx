// src/app/(public)/kontak/ContactPageClient.tsx
'use client';

import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import ContactFormClient from './ContactFormClient';

// Animasie-variant
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Ikoon-komponente vir die kontakbesonderhede
const PhoneIcon = () => (
  <svg className="h-6 w-6 shrink-0 text-rose-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const EmailIcon = () => (
  <svg className="h-6 w-6 shrink-0 text-rose-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const MapIcon = () => (
  <svg className="h-6 w-6 shrink-0 text-rose-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export default function ContactPageClient() {
  return (
    <div className="bg-white">
      {/* 1. Hero-banier */}
      <motion.section 
          className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
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
          />
          <div className="absolute inset-0 bg-rose-900/40 z-5"></div>
          <motion.div
              className="relative z-20 mx-auto max-w-4xl text-center"
              variants={fadeInUp}
              animate="animate"
              initial="initial"
          >
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                  Kontak Ons
              </h1>
              <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                  Ons is hier om te help. Kontak ons gerus met enige navrae.
              </p>
          </motion.div>
      </motion.section>

      {/* 2. Inhoud-afdeling */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* Kolom 1: Kontakvorm */}
          <div className="rounded-lg bg-zinc-50 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-rose-900">Stuur 'n Boodskap</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Vul die vorm hieronder in en ons sal so spoedig moontlik terugkom na u.
            </p>
            <div className="mt-8">
              <ContactFormClient />
            </div>
          </div>

          {/* Kolom 2: Besonderhede & Kaart */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-rose-900">Kontakbesonderhede</h2>
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <MapIcon />
                  <div>
                    <h3 className="font-semibold text-zinc-900">Adres</h3>
                    <p className="text-zinc-600">2 Johan Straat, Brits, 0250</p>
                    <p className="text-zinc-600">Posbus 446, Brits, 0250</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <PhoneIcon />
                  <div>
                    <h3 className="font-semibold text-zinc-900">Telefoon</h3>
                    <a href="tel:0122523228" className="text-zinc-600 hover:text-rose-700">
                      (012) 252-3228
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <EmailIcon />
                  <div>
                    <h3 className="font-semibold text-zinc-900">E-pos</h3>
                    <a href="mailto:hsbrits@hsbrits.co.za" className="text-zinc-600 hover:text-rose-700">
                      hsbrits@hsbrits.co.za
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- REGSTELLING BEGIN --- */}
            <div>
              <h2 className="text-2xl font-bold text-rose-900">Vind Ons Hier</h2>
              <div className="mt-6 h-80 w-full overflow-hidden rounded-lg shadow-lg">
                <iframe
                  src="http://googleusercontent.com/maps/google.com/1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            {/* --- REGSTELLING EINDE --- */}

          </div>
        </div>
      </div>
    </div>
  );
}