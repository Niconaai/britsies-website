// src/app/(public)/nuus/page.tsx
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import NewsPageClient from "./NewsPageClient";
import type { NewsPostListItem, NewsletterEdition } from "@/types/supabase";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Nuus",
  description: "Die nuutste nuus, prestasies en aankondigings van Hoërskool Brits.",
};

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: newsPosts, error: newsError } = await supabase
    .from('news_posts')
    .select('id, title, slug, image_urls, content, published_at, created_at, publication_type') 
    .eq('is_published', true)
    .eq('publication_type', 'news')
    .order('published_at', { ascending: false });

  const { data: newsletters, error: newslettersError } = await supabase
    .from('news_posts')
    .select('id, title, slug, edition_number, date_range, image_urls, published_at, created_at, is_published')
    .eq('publication_type', 'newsletter')
    .eq('is_published', true)
    .order('edition_number', { ascending: false });

  if (newsError) {
    console.error("Kon nie nuus laai nie:", newsError);
  }
  if (newslettersError) {
    console.error("Kon nie nuusbriewe laai nie:", newslettersError);
  }

  return (
    <NewsPageClient 
      newsPosts={newsPosts as NewsPostListItem[] || []} 
      newsletters={newsletters as NewsletterEdition[] || []}
    />
  );
}