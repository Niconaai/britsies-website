// src/app/(public)/nuus/uitgawes/page.tsx
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import NewsletterListClient from "./NewsletterListClient";
import type { NewsletterEdition } from "@/types/supabase";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Nuusbriewe",
  description: "Lees ons weeklikse nuusbriewe vol van skool nuus, prestasies, en aankondigings.",
};

export default async function NewslettersPage() {
  const supabase = await createClient();

  // Fetch all published newsletter editions
  const { data: newsletters, error: newsletterError } = await supabase
    .from('news_posts')
    .select('id, title, slug, edition_number, date_range, image_urls, published_at, created_at, is_published')
    .eq('publication_type', 'newsletter')
    .eq('is_published', true)
    .order('edition_number', { ascending: false });

  if (newsletterError) {
    console.error("Kon nie nuusbriewe laai nie:", newsletterError);
  }

  return (
    <NewsletterListClient newsletters={newsletters as NewsletterEdition[] || []} />
  );
}
