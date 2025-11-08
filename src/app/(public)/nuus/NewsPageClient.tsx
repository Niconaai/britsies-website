// src/app/(public)/nuus/NewsPageClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsPostListItem } from "./page"; // Hierdie tipe sal ook opgedateer moet word

// Hulpfunksie om 'n uittreksel (excerpt) te skep van die HTML-inhoud
function createExcerpt(htmlContent: string | null): string {
  if (!htmlContent) {
    return "Lees meer om die volle berig te sien...";
  }
  // Verwyder HTML-etikette
  const text = htmlContent.replace(/<[^>]+>/g, ' ');
  // Sny na 150 karakters
  if (text.length <= 150) {
    return text;
  }
  return text.substring(0, 150) + "...";
}

// Animasie-variant
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// === BEGIN VERANDERING HIER ===
// Kaart-komponent vir die nuusberigte
const NewsCard = ({ post }: { post: NewsPostListItem }) => {
  const excerpt = createExcerpt(post.content);
  
  // Kry die hoofprent (die eerste een in die lys)
  const featuredImage = (post.image_urls && post.image_urls.length > 0) 
    ? post.image_urls[0] 
    : '/wapen-copy-sonder-boom.png'; // Fallback prent

  return (
    <Link 
      href={`/nuus/${post.slug}`} 
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-56 w-full">
        <Image
          src={featuredImage} // Gebruik die nuwe 'featuredImage' veranderlike
          alt={post.title || 'Nuusberig'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-amber-500/10"></div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          {new Date(post.published_at || post.created_at).toLocaleDateString('af-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h3 className="mt-2 text-xl font-bold text-rose-900 group-hover:text-rose-700">
          {post.title}
        </h3>
        <p className="mt-3 text-sm text-zinc-600 flex-1">
          {excerpt}
        </p>
        <div className="mt-4 text-sm font-semibold text-rose-800 transition-transform group-hover:translate-x-1">
          Lees Meer &rarr;
        </div>
      </div>
    </Link>
  );
};
// === EINDE VERANDERING ===


// --- Hoof Kliënt-komponent ---
export default function NewsPageClient({ newsPosts }: { newsPosts: NewsPostListItem[] }) {
  
  return (
    <div className="bg-zinc-50 min-h-screen">
      
      {/* 1. Opskrif-seksie */}
      <motion.div 
        className="bg-white py-12 text-center shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-rose-900 sm:text-5xl">
          Nuus & Gebeure
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Die nuutste van die Britsies.
        </p>
      </motion.div>

      {/* 2. Rooster van Berigte */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {newsPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsPosts.map((post, i) => (
              <motion.div
                key={post.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.5, delay: i * 0.1 }} // Stagger die kaarte
              >
                <NewsCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          // Boodskap as daar geen berigte is nie
          <motion.div 
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-2xl font-semibold text-zinc-700">Geen Nuusberigte Gepubliseer</h2>
            <p className="mt-4 text-zinc-500">
              Daar is tans geen nuusberigte nie. Kom loer asseblief binnekort weer in.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}