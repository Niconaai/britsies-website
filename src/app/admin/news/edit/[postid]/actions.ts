// src/app/admin/news/edit/[postid]/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePost(formData: FormData) {
  const supabase = await createClient();

  // 1. Kry die data vanaf die vorm
  const postId = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'on';

  // === BEGIN VERANDERING ===
  // Kry die JSON-string van die versteekte veld
  const imageUrlsString = formData.get('image_urls') as string;
  
  let image_urls: string[] = [];
  try {
    // "Parse" die string terug na 'n array
    if (imageUrlsString) {
      image_urls = JSON.parse(imageUrlsString);
    }
  } catch (e) {
    console.error("Kon nie image_urls parse nie:", e);
    // Gaan voort sonder prente as dit misluk
  }
  // === EINDE VERANDERING ===

  if (!postId) {
    return redirect(`/admin/news?error=Berig ID word vermis`);
  }

  // 2. Gaan die 'slug' na vir uniekheid (maar ignoreer die huidige berig)
  if (slug) {
    const { data: existingPost, error: slugError } = await supabase
      .from('news_posts')
      .select('id')
      .eq('slug', slug)
      .not('id', 'eq', postId) // Belangrik: Ignoreer hierdie berig self
      .limit(1);

    if (slugError) {
      console.error('Slug check error:', slugError);
      return redirect(`/admin/news/edit/${postId}?error=Kon nie slug nagaan nie`);
    }
    if (existingPost && existingPost.length > 0) {
      return redirect(`/admin/news/edit/${postId}?error=Hierdie "slug" (${slug}) word reeds gebruik.`);
    }
  } else {
    return redirect(`/admin/news/edit/${postId}?error=Slug word vereis`);
  }

  // 3. Dateer die berig op in die databasis
  const { error } = await supabase
    .from('news_posts')
    .update({
      title,
      slug,
      content,
      is_published,
      // === BEGIN VERANDERING ===
      image_urls: image_urls, // Stoor die nuwe array
      // === EINDE VERANDERING ===
      published_at: is_published ? new Date().toISOString() : null,
    })
    .eq('id', postId); // Maak seker ons dateer die korrekte berig op

  if (error) {
    console.error('Update error:', error);
    return redirect(`/admin/news/edit/${postId}?error=${encodeURIComponent(error.message)}`);
  }

  // 4. Herlaai die paaie en stuur terug
  revalidatePath('/admin/news');
  revalidatePath('/nuus');
  revalidatePath(`/nuus/${slug}`); // Herlaai die publieke berig-bladsy
  redirect('/admin/news'); // Stuur terug na die hooflys
}