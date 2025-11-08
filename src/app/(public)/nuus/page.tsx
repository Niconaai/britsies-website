// src/app/(public)/nuus/page.tsx
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import NewsPageClient from "./NewsPageClient"; // Voer die Kliënt-komponent in

export const metadata: Metadata = {
  title: "Hoërskool Brits | Nuus",
  description: "Die nuutste nuus, prestasies en aankondigings van Hoërskool Brits.",
};

// === BEGIN VERANDERING ===
// Tipe vir ons nuusberig (sluit 'content' en die nuwe 'image_urls' in)
export type NewsPostListItem = {
  id: string;
  slug: string | null;
  title: string | null;
  image_urls: string[] | null; // <-- REGSTELLING
  content: string | null; 
  published_at: string | null;
  created_at: string;
};
// === EINDE VERANDERING ===

// Die 'Page' bly 'n 'async' Server Component
export default async function NewsPage() {
  const supabase = await createClient();

  // === BEGIN VERANDERING ===
  // Haal *alle* gepubliseerde nuusberigte
  const { data: newsPosts, error: newsError } = await supabase
    .from('news_posts')
    // Kies die nuwe 'image_urls' kolom
    .select('id, title, slug, image_urls, content, published_at, created_at') 
    .eq('is_published', true)
    .order('published_at', { ascending: false }); // Nuutste eerste
  // === EINDE VERANDERING ===

  if (newsError) {
    console.error("Kon nie nuus laai nie:", newsError);
    // Ons kan 'n 'error.tsx' bladsy implementeer, maar vir nou stuur ons net 'n leë lys
  }

  // Stuur die data as 'n prop na die Kliënt-komponent
  return (
    <NewsPageClient newsPosts={newsPosts as NewsPostListItem[] || []} />
  );
}