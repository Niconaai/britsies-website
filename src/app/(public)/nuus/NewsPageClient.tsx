// src/app/(public)/nuus/NewsPageClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsPostListItem, NewsletterEdition } from "@/types/supabase";

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const NewsCard = ({ post }: { post: NewsPostListItem }) => {
  const excerpt = createExcerpt(post.content);
  const featuredImage = (post.image_urls && post.image_urls.length > 0) 
    ? post.image_urls[0] 
    : '/wapen.png';

  return (
    <Link 
      href={`/nuus/${post.slug}`} 
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-56 w-full">
        <Image
          src={featuredImage}
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

const NewsletterCard = ({ newsletter }: { newsletter: NewsletterEdition }) => {
  const coverImage = (newsletter.image_urls && newsletter.image_urls.length > 0) 
    ? newsletter.image_urls[0] 
    : '/wapen-copy-sonder-boom.png';

  return (
    <Link 
      href={`/nuus/uitgawes/${newsletter.slug || newsletter.edition_number}`} 
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-56 w-full">
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

export default function NewsPageClient({ newsPosts, newsletters }: { newsPosts: NewsPostListItem[]; newsletters: NewsletterEdition[] }) {
  
  return (
    <div className="bg-zinc-50 min-h-screen">
      <motion.section 
                      className="relative flex h-[50vh] min-h-[300px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                  >
                      <Image
                          src="/Hero-Nuus.jpeg" 
                          alt="Hoërskool Brits Nuus"
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
                      </motion.div>
                  </motion.section>

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

      {newsletters.length > 0 && (
        <div className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                  Nuusbriewe
                </h2>
                <p className="mt-2 text-lg text-zinc-600">
                  Ons weeklikse uitgawes vol skool nuus
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsletters.map((newsletter, i) => (
                <motion.div
                  key={newsletter.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <NewsletterCard newsletter={newsletter} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                Vinnige Nuus
              </h2>
              <p className="mt-2 text-lg text-zinc-600">
                Aankondigings, prestasies en gebeure
              </p>
            </div>
          </motion.div>
          {newsPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <NewsCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-zinc-700">Geen Vinnige Nuus Gepubliseer</h3>
              <p className="mt-4 text-zinc-500">
                Daar is tans geen vinnige nuus nie. Kom loer asseblief binnekort weer in.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}