// src/app/(public)/nuus/uitgawes/[edition]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewsletterDetailClient from "./NewsletterDetailClient";
import type { Metadata } from "next";
import type { NewsletterEdition, NewsletterSection } from "@/types/supabase";

type NewsletterWithSections = NewsletterEdition & {
  sections: NewsletterSection[];
};

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ edition: string }>;
}): Promise<Metadata> {
  const { edition } = await params;
  const supabase = await createClient();

  // Try to find by slug first, then by edition number
  let query = supabase
    .from("news_posts")
    .select("title, edition_number, date_range")
    .eq("publication_type", "newsletter")
    .eq("is_published", true);

  // Check if edition is a number or slug
  if (isNaN(Number(edition))) {
    query = query.eq("slug", edition);
  } else {
    query = query.eq("edition_number", Number(edition));
  }

  const { data: newsletter } = await query.single();

  if (!newsletter) {
    return {
      title: "Nuusbrief Nie Gevind Nie",
      description: "Hierdie nuusbrief kon nie gevind word nie.",
    };
  }

  return {
    title: `Nuusbrief ${newsletter.edition_number} | Hoërskool Brits`,
    description: `${newsletter.title || `Nuusbrief ${newsletter.edition_number}`} - ${newsletter.date_range || ''}`,
  };
}

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition } = await params;
  const supabase = await createClient();

  // Try to find by slug first, then by edition number
  let query = supabase
    .from("news_posts")
    .select("id, title, slug, edition_number, date_range, image_urls, published_at, created_at, is_published")
    .eq("publication_type", "newsletter")
    .eq("is_published", true);

  // Check if edition is a number or slug
  if (isNaN(Number(edition))) {
    query = query.eq("slug", edition);
  } else {
    query = query.eq("edition_number", Number(edition));
  }

  const { data: newsletter, error } = await query.single();

  if (error || !newsletter) {
    notFound();
  }

  // Fetch sections for this newsletter
  const { data: sections, error: sectionsError } = await supabase
    .from("news_posts")
    .select("id, title, section_title, slug, content, image_urls, section_order")
    .eq("publication_type", "newsletter_section")
    .eq("parent_newsletter_id", newsletter.id)
    .eq("is_published", true)
    .order("section_order", { ascending: true });

  if (sectionsError) {
    console.error("Kon nie nuusbrief seksies laai nie:", sectionsError);
  }

  const newsletterWithSections: NewsletterWithSections = {
    ...newsletter,
    sections: sections || [],
  };

  return <NewsletterDetailClient newsletter={newsletterWithSections} />;
}
