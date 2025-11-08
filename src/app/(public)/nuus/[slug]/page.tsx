// src/app/(public)/nuus/[slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewsPostClient from "./NewsPostClient";
import type { Metadata } from "next";

// === BEGIN VERANDERING 1: Tipe-opdatering ===
// Tipe vir 'n enkele berig
export type SingleNewsPost = {
  id: string;
  title: string | null;
  slug: string | null;
  image_urls: string[] | null; // <-- REGSTELLING (was image_url)
  content: string | null; 
  published_at: string | null;
  created_at: string;
};
// === EINDE VERANDERING 1 ===

// --- GENEREER METADATA ---
// (Hierdie funksie is reg, want dit het nie die prent-kolom gekies nie)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("news_posts")
    .select("title, content")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    return {
      title: "Berig Nie Gevind Nie",
      description: "Hierdie nuusberig kon nie gevind word nie.",
    };
  }

  const excerpt =
    post.content?.replace(/<[^>]+>/g, " ").substring(0, 155) + "..." ||
    "Lees die volle berig by Hoërskool Brits.";

  return {
    title: `Nuus | ${post.title || "Berig"}`,
    description: excerpt,
  };
}

// --- BLADSY-KOMPONENT ---
export default async function SingleNewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // === BEGIN VERANDERING 2: Databasis-navraag ===
  const { data: post, error } = await supabase
    .from("news_posts")
    // Kies die nuwe 'image_urls' (meervoud) kolom
    .select("id, title, slug, image_urls, content, published_at, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  // === EINDE VERANDERING 2 ===

  if (error || !post) {
    // Hierdie word nou (korrek) geroep as die berig nie bestaan nie,
    // in plaas van te misluk as gevolg van 'n slegte kolomnaam.
    notFound();
  }

  return <NewsPostClient post={post as SingleNewsPost} />;
}