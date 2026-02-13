// src/app/(public)/page.tsx
import { createClient } from "@/utils/supabase/server";
import HomePageClient from "./HomePageClient"; 

export type NewsPostFeedItem = {
  title: string | null;
  slug: string | null;
  image_urls: string[] | null;
  published_at: string | null;
  created_at: string;
  publication_type: string | null;
  edition_number: number | null;
};

export default async function Home() {
  const supabase = await createClient();

  const { data: latestNews, error: newsError } = await supabase
    .from('news_posts')
    .select('title, slug, image_urls, published_at, created_at, publication_type, edition_number') 
    .eq('is_published', true)
    .in('publication_type', ['news', 'newsletter'])
    .order('published_at', { ascending: false })
    .limit(3);

  if (newsError) {
    console.error("Kon nie nuus laai nie:", newsError);
  }

  return (
    <HomePageClient latestNews={latestNews as NewsPostFeedItem[] || []} />
  );
}