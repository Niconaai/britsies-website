// src/app/(public)/nuus/[slug]/page.tsx

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewsPostClient from "./NewsPostClient";
import type { Metadata } from "next";
import type { DbNewsPost } from "@/types/supabase";

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

export default async function SingleNewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("news_posts")
    .select("id, title, slug, image_urls, content, published_at, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("publication_type", "news")
    .single();

  if (error || !post) {
    notFound();
  }

  return <NewsPostClient post={post as DbNewsPost} />;
}