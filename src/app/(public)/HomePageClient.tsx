// src/app/(public)/HomePageClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsPostFeedItem } from "./page";
import { useState, useEffect } from "react";

// --- REGSTELLING 1: Voer die nuwe komponent in ---
import KoshuisPakketAd from "./KoshuisPakketAd";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const HERO_VIDEO_URL = `${SUPABASE_URL}/storage/v1/object/public/public-assets/hero-video.mp4`;
const HERO_FALLBACK_IMAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/public-assets/hero-fallback.png`;

// ... (ArrowIcon, QuickLinkCard, NewsCard bly presies dieselfde) ...
const ArrowIcon = () => (
  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);
const QuickLinkCard = ({ href, title, description }: { href: string; title: string; description: string }) => (
  <Link href={href} className="group block rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg hover:border-amber-500 border border-transparent">
    <h3 className="text-xl font-bold text-rose-900">{title}</h3>
    <p className="mt-2 text-sm text-zinc-600">{description}</p>
    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-rose-800">
      Gaan na {title.toLowerCase()} <ArrowIcon />
    </div>
  </Link>
);
const NewsCard = ({ post }: { post: NewsPostFeedItem }) => {
  const featuredImage = (post.image_urls && post.image_urls.length > 0)
    ? post.image_urls[0]
    : '/wapen.png'; 

  return (
    <Link href={`/nuus/${post.slug}`} className="group block overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={featuredImage}
          alt={post.title || 'Nuusberig'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-amber-500/10"></div>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
          {new Date(post.published_at || post.created_at).toLocaleDateString('af-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h3 className="mt-2 text-lg font-bold text-rose-900 group-hover:text-rose-700">
          {post.title}
        </h3>
      </div>
    </Link>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
// --- EINDE VAN SUB-KOMPONENTE ---

// --- REGSTELLING 2: Verwyder die KoshuisPakketAd en CheckIcon definisies van hier ---
// (Hulle is nou in hul eie lêer)

// --- HOOF TUISBLAD KOMPONENT ---
export default function HomePageClient({ latestNews }: { latestNews: NewsPostFeedItem[] }) {

  const [showVideo, setShowVideo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);

  useEffect(() => {
    const isDesktopQuery = window.matchMedia("(min-width: 640px)");
    setIsDesktop(isDesktopQuery.matches);
    const hasVideoPlayed = sessionStorage.getItem('heroVideoPlayed');

    if (isDesktopQuery.matches && !hasVideoPlayed) {
      setShowVideo(true);
      setIsIntroActive(true);
    } else {
      setShowVideo(false);
      setIsIntroActive(false); 
    }

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    isDesktopQuery.addEventListener('change', handler);
    return () => isDesktopQuery.removeEventListener('change', handler);
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem('heroVideoPlayed', 'true');
    setShowVideo(false);
    setIsIntroActive(false);
  };

  return (
    <div className="flex flex-col">
      {/* --- 1. HERO SEKSIE --- */}
      <section className="relative flex h-[70vh] min-h-[400px] w-full items-center justify-center bg-zinc-800 text-white overflow-hidden px-4">
        <Image
          src={HERO_FALLBACK_IMAGE_URL}
          alt="Hoërskool Brits Kampus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-amber-600/20 z-5"></div>

        {showVideo && isDesktop && (
          <video
            key="hero-video"
            playsInline
            autoPlay
            muted
            onEnded={handleVideoEnd}
            className="absolute z-10 w-full h-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
            Jammer, jou blaaier ondersteun nie hierdie video nie.
          </video>
        )}

        <motion.div
          className="relative z-20 mx-auto max-w-4xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isIntroActive ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/wapen.png"
            alt="Hoërskool Brits Wapen"
            width={96}
            height={96}
            priority
            className="mx-auto h-24 w-auto"
            style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}
          />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            Hoërskool Brits
          </h1>
          <p className="mt-6 text-xl text-zinc-100"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Koersvas na die Kruin
          </p>
          <div className="mt-10 flex w-full max-w-sm mx-auto flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <Link
              href="/raak-betrokke"
              className="w-full rounded-md border border-transparent bg-rose-900 px-8 py-3 text-base font-medium text-white shadow-lg transition hover:bg-rose-800 hover:scale-105 sm:w-auto text-center"
            >
              Raak Betrokke
            </Link>
            <Link
              href="/oor-ons"
              className="w-full rounded-md border border-white bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto text-center"
            >
              Meer Oor Ons
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- 2. WELKOM SEKSIE --- */}
      <motion.section
        className="bg-white py-16 sm:py-24"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
              Welkom by die Britsies
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-700">
              Hoërskool Brits is 'n baken van uitnemendheid in die Noordwes-provinsie, toegewy aan die akademiese, sportiewe en kulturele ontwikkeling van elke leerder. Ons streef daarna om 'n omgewing te skep waar jongmense kan floreer en hul volle potensiaal kan bereik, gewortel in ons trotse tradisies en Christelike waardes.
            </p>
          </div>
        </div>
      </motion.section>

      {/* --- REGSTELLING 3: Roep die ingevoerde komponent --- */}
      <section
        className="bg-zinc-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <KoshuisPakketAd />
        </div>
      </section>
      {/* --- EINDE REGSTELLING 3 --- */}

      {/* --- 3. VINNIGE SKAKELS SEKSIE --- 
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.0 }}>
              <QuickLinkCard
                href="/aansoek"
                title="Aansoeke 2026"
                description="Doen nou aanlyn aansoek vir 2026. Sien ons proses en vereistes."
              />
            </motion.div>
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <QuickLinkCard
                href="/nuus"
                title="Nuutste Nuus"
                description="Bly op hoogte van al die nuutste prestasies, aankondigings en gebeure."
              />
            </motion.div>
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <QuickLinkCard
                href="/winkel"
                title="Aanlyn Winkel"
                description="Koop skoolklere, sporttoerusting en ondersteuners-items aanlyn."
              />
            </motion.div>
          </div>
        </div>
      </section>*/}

      {/* --- 4. NUUTSTE NUUS SEKSIE --- */}
      {latestNews && latestNews.length > 0 && (
        <section className="bg-zinc-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                  Nuutste Nuus
                </h2>
                <Link href="/nuus" className="text-sm font-semibold text-rose-800 hover:text-rose-600">
                  Sien alle nuus &rarr;
                </Link>
              </div>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {latestNews.map((post, i) => (
                <motion.div
                  key={post.slug}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <NewsCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}