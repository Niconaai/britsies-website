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

export type FacebookPost = {
  id: string;
  message?: string;
  full_picture?: string;
  created_time: string;
  permalink_url?: string;
};

async function getFacebookPosts(): Promise<FacebookPost[]> {
  const pageId = '100064515071738'; // hskoolbrits page ID from the URL
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('Facebook access token not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,full_picture,created_time,permalink_url&limit=3&access_token=${accessToken}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      console.error('Failed to fetch Facebook posts:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return [];
  }
}

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

  // Fetch Facebook posts
  const facebookPosts = await getFacebookPosts();

  return (
    <HomePageClient 
      latestNews={latestNews as NewsPostFeedItem[] || []} 
      facebookPosts={facebookPosts}
    />
  );
}