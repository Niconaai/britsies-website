// src/app/(public)/page.tsx
import { createClient } from "@/utils/supabase/server";
import HomePageClient from "./HomePageClient"; // <-- Voer die Kliënt-komponent in

// Tipe vir ons nuusberig
export type NewsPostFeedItem = {
  title: string | null;
  slug: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

// Die 'Page' bly 'n 'async' Server Component
export default async function Home() {
  const supabase = await createClient();

  // Haal die top 3 mees onlangse *gepubliseerde* nuusberigte
  const { data: latestNews, error: newsError } = await supabase
    .from('news_posts')
    .select('title, slug, image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  if (newsError) {
    console.error("Kon nie nuus laai nie:", newsError);
  }

  // Stuur die data as 'n prop na die Kliënt-komponent
  return (
    <HomePageClient latestNews={latestNews as NewsPostFeedItem[] || []} />
  );
}