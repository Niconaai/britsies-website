// src/app/(public)/nuus/uitgawes/[edition]/NewsletterDetailClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import type { NewsletterEdition, NewsletterSection } from "@/types/supabase";

type NewsletterWithSections = NewsletterEdition & {
  sections: NewsletterSection[];
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Section component
const SectionComponent = ({ section, index }: { section: NewsletterSection; index: number }) => {
  const sectionImage = (section.image_urls && section.image_urls.length > 0) 
    ? section.image_urls[0] 
    : null;
  
  const galleryImages = section.image_urls?.slice(1) || [];

  return (
    <motion.section
      id={`section-${index + 1}`}
      className="scroll-mt-8 border-b border-zinc-200 pb-12 mb-12 last:border-b-0"
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="mb-6">
        {section.section_title && (
          <div className="inline-block rounded-full bg-rose-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-rose-800 mb-3">
            {section.section_title}
          </div>
        )}
        <h2 className="text-3xl font-bold text-rose-900">
          {section.title}
        </h2>
      </div>

      {/* Section Image */}
      {sectionImage && (
        <div className="relative mb-6 w-full aspect-video overflow-hidden rounded-lg shadow-lg">
          <Image
            src={sectionImage}
            alt={section.title || 'Seksie beeld'}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Section Content */}
      <div
        className="prose prose-lg max-w-none 
                   text-zinc-900 
                   prose-h2:text-rose-900 
                   prose-h3:text-rose-800
                   prose-a:text-rose-800 hover:prose-a:text-rose-600
                   prose-strong:text-black"
        dangerouslySetInnerHTML={{ __html: section.content || "" }}
      />

      {/* Section Gallery */}
      {galleryImages.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-rose-900 mb-4">Prente</h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={url}
                  alt={`Prent ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default function NewsletterDetailClient({ newsletter }: { newsletter: NewsletterWithSections }) {
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  
  const publicationDate = new Date(newsletter.published_at || newsletter.created_at).toLocaleDateString('af-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const coverImage = (newsletter.image_urls && newsletter.image_urls.length > 0) 
    ? newsletter.image_urls[0] 
    : '/wapen-copy-sonder-boom.png';

  return (
    <article className="bg-zinc-50 min-h-screen">
      {/* Newsletter Header */}
      <div className="bg-linear-to-br from-rose-900 to-rose-800 text-white py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-2">
              Nuusbrief {newsletter.edition_number}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
              {newsletter.title || `Nuusbrief ${newsletter.edition_number}`}
            </h1>
            {newsletter.date_range && (
              <p className="text-xl text-white/90 mb-2">
                {newsletter.date_range}
              </p>
            )}
            <p className="text-sm text-white/80">
              Gepubliseer op {publicationDate}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cover Image (Optional) */}
      {coverImage !== '/wapen-copy-sonder-boom.png' && (
        <div className="relative w-full h-64 md:h-96 border-b-4 border-amber-500">
          <Image
            src={coverImage}
            alt="Nuusbrief voorblad"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Table of Contents */}
        {newsletter.sections.length > 0 && (
          <motion.div 
            className="mb-12 rounded-lg bg-white p-6 shadow-md"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-rose-900">Inhoud</h2>
              <button
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className="text-sm font-semibold text-rose-800 md:hidden"
              >
                {showTableOfContents ? 'Versteek' : 'Wys'}
              </button>
            </div>
            <div className={`mt-4 space-y-2 ${showTableOfContents ? 'block' : 'hidden md:block'}`}>
              {newsletter.sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#section-${index + 1}`}
                  className="block rounded-md px-4 py-2 text-zinc-700 transition-colors hover:bg-rose-50 hover:text-rose-900"
                >
                  <span className="font-semibold text-rose-800 mr-2">
                    {index + 1}.
                  </span>
                  {section.section_title && (
                    <span className="text-xs uppercase tracking-wider text-zinc-500 mr-2">
                      {section.section_title}
                    </span>
                  )}
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Newsletter Sections */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {newsletter.sections.length > 0 ? (
            newsletter.sections.map((section, index) => (
              <SectionComponent key={section.id} section={section} index={index} />
            ))
          ) : (
            <p className="text-center text-zinc-500">
              Hierdie nuusbrief het geen seksies nie.
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-between items-center border-t border-zinc-200 pt-8">
          <Link 
            href="/nuus/uitgawes" 
            className="text-sm font-semibold text-rose-800 hover:text-rose-600"
          >
            &larr; Terug na Nuusbriewe
          </Link>
          <Link 
            href="/nuus" 
            className="text-sm font-semibold text-rose-800 hover:text-rose-600"
          >
            Gaan na Nuus &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
