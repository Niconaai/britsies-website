// src/app/(public)/nuus/uitgawes/NewsletterListClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsletterEdition } from "@/types/supabase";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const NewsletterCard = ({ newsletter }: { newsletter: NewsletterEdition }) => {
  const coverImage = (newsletter.image_urls && newsletter.image_urls.length > 0) 
    ? newsletter.image_urls[0] 
    : '/wapen-copy-sonder-boom.png';

  return (
    <Link 
      href={`/nuus/uitgawes/${newsletter.slug || newsletter.edition_number}`} 
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-64 w-full">
        <Image
          src={coverImage}
          alt={newsletter.title || `Nuusbrief ${newsletter.edition_number}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-rose-900/80 via-rose-900/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Nuusbrief {newsletter.edition_number}
          </div>
          {newsletter.date_range && (
            <div className="mt-1 text-xs font-semibold text-white/90">
              {newsletter.date_range}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-rose-900 group-hover:text-rose-700">
          {newsletter.title || `Nuusbrief ${newsletter.edition_number}`}
        </h3>
        <p className="mt-2 text-xs text-zinc-500">
          Gepubliseer: {new Date(newsletter.published_at || newsletter.created_at).toLocaleDateString('af-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="mt-4 text-sm font-semibold text-rose-800 transition-transform group-hover:translate-x-1">
          Lees Nuusbrief &rarr;
        </div>
      </div>
    </Link>
  );
};

export default function NewsletterListClient({ newsletters }: { newsletters: NewsletterEdition[] }) {
  return (
    <div className="bg-zinc-50 min-h-screen">
      
      {/* Hero Section */}
      <motion.section 
        className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/Hero-Nuus.jpeg" 
          alt="Hoërskool Brits Nuusbriewe"
          fill
          className="object-cover opacity-100"
          priority
        />
        <div className="absolute inset-0 bg-rose-900/0 z-5"></div>
        <motion.div
          className="relative z-20 mx-auto max-w-4xl text-center"
          variants={fadeInUp}
          animate="animate"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            Nuusbriewe
          </h1>
          <p className="mt-6 text-xl text-zinc-100" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Ons weeklikse uitgawes vol skool nuus
          </p>
        </motion.div>
      </motion.section>
      
      {/* Header Section */}
      <motion.div 
        className="bg-white py-12 text-center shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
          Nuusbrief Argief
        </h2>
        <p className="mt-4 text-lg text-zinc-600">
          Blaai deur ons nuusbrief-uitgawes
        </p>
        <div className="mt-6">
          <Link 
            href="/nuus" 
            className="text-sm font-semibold text-rose-800 hover:text-rose-600"
          >
            &larr; Terug na Nuus
          </Link>
        </div>
      </motion.div>

      {/* Newsletter Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {newsletters.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsletters.map((newsletter, i) => (
              <motion.div
                key={newsletter.id}
                variants={fadeInUp}
                animate="animate"
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <NewsletterCard newsletter={newsletter} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center"
            variants={fadeInUp}
            animate="animate"
          >
            <h3 className="text-2xl font-semibold text-zinc-700">Geen Nuusbriewe Gepubliseer</h3>
            <p className="mt-4 text-zinc-500">
              Daar is tans geen nuusbriewe nie. Kom loer asseblief binnekort weer in.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
