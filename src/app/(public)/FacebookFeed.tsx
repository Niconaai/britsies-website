// src/app/(public)/FacebookFeed.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

interface FacebookPost {
  id: string;
  message?: string;
  full_picture?: string;
  created_time: string;
  permalink_url?: string;
}

interface FacebookFeedProps {
  posts: FacebookPost[];
}

export default function FacebookFeed({ posts }: FacebookFeedProps) {
  return (
    <motion.div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
            Jongste van Facebook
          </h2>
          <p className="mt-2 text-lg text-zinc-700">
            Bly op hoogte met ons nuutste plasings
          </p>
        </div>
        <Link
          href="https://www.facebook.com/hskoolbrits"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 rounded-md bg-rose-900 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-rose-800 hover:scale-105"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Volg Ons
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={post.permalink_url || `https://www.facebook.com/hskoolbrits`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg border border-zinc-200 hover:border-amber-500"
            >
              {post.full_picture && (
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={post.full_picture}
                    alt="Facebook post"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {new Date(post.created_time).toLocaleDateString('af-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {post.message && (
                  <p className="text-zinc-700 line-clamp-4 group-hover:text-rose-900 transition-colors">
                    {post.message}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-zinc-600">Geen plasings beskikbaar nie.</p>
          <Link
            href="https://www.facebook.com/hskoolbrits"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-rose-900 font-semibold hover:text-rose-700"
          >
            Besoek ons Facebook-bladsy
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
