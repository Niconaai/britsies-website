// src/app/admin/news/create/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // 1. Kry die data vanaf die vorm
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


  // 2. Gaan die 'slug' na vir uniekheid
  if (slug) {
    const { data: existingPost, error: slugError } = await supabase
      .from('news_posts')
      .select('slug')
      .eq('slug', slug)
      .limit(1);

    if (slugError) {
      console.error('Slug check error:', slugError);
      return redirect('/admin/news/create?error=Kon nie slug nagaan nie');
    }
    if (existingPost && existingPost.length > 0) {
      return redirect(`/admin/news/create?error=Hierdie "slug" (${slug}) word reeds gebruik.`);
    }
  } else {
    return redirect('/admin/news/create?error=Slug word vereis');
  }
  
  // 3. Voeg die nuwe berig in die databasis in
  const { data, error } = await supabase
    .from('news_posts')
    .insert([
      {
        title,
        slug,
        content,
        is_published,
        // === BEGIN VERANDERING ===
        image_urls: image_urls, // Stoor die array
        // 'image_url' word nie meer gebruik nie
        // === EINDE VERANDERING ===
        published_at: is_published ? new Date().toISOString() : null,
      },
    ])
    .select();

  if (error) {
    console.error('Insert error:', error);
    return redirect(`/admin/news/create?error=${encodeURIComponent(error.message)}`);
  }

  // 4. Herlaai die paaie en stuur terug
  revalidatePath('/admin/news');
  revalidatePath('/nuus');
  revalidatePath(`/nuus/${slug}`);
  redirect('/admin/news');
}