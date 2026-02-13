// src/app/(public)/nuus/[slug]/NewsPostClient.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { DbNewsPost } from "@/types/supabase";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function NewsPostClient({ post }: { post: DbNewsPost }) {
  const publicationDate = new Date(post.published_at || post.created_at).toLocaleDateString('af-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageUrls = post.image_urls || [];
  const featuredImage = imageUrls[0] || null;
  const galleryImages = imageUrls.slice(1);

  return (
    <article>
      <motion.div 
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-8 border-b border-zinc-200 pb-6">
          <p className="text-sm font-semibold text-rose-800">
            Gepubliseer op {publicationDate}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-rose-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
        </div>

        {featuredImage && (
          <div className="relative mb-8 w-full aspect-video overflow-hidden rounded-lg shadow-lg">
            <Image
              src={featuredImage}
              alt={post.title || 'Nuusberig Hoofbeeld'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none 
                     text-zinc-900 
                     prose-h2:text-rose-900 
                     prose-a:text-rose-800 hover:prose-a:text-rose-600
                     prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        {galleryImages.length > 0 && (
          <div className="mt-12 border-t border-zinc-200 pt-8">
            <h3 className="text-2xl font-bold text-rose-900">
              Galery
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleryImages.map((url, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={url}
                    alt={`Galery-prent ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 border-t border-zinc-200 pt-8">
          <Link 
            href="/nuus" 
            className="text-sm font-semibold text-rose-800 hover:text-rose-600"
          >
            &larr; Terug na alle nuus
          </Link>
        </div>
      </motion.div>
    </article>
  );
}