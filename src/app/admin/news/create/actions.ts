// src/app/admin/news/create/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // Get basic form data
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'on';
  const publication_type = (formData.get('publication_type') as string) || 'news';
  
  // Get image URLs
  const imageUrlsString = formData.get('image_urls') as string;
  let image_urls: string[] = [];
  try {
    if (imageUrlsString) {
      image_urls = JSON.parse(imageUrlsString);
    }
  } catch (e) {
    console.error("Kon nie image_urls parse nie:", e);
  }

  // Get newsletter-specific fields
  let edition_number = null;
  let date_range = null;
  
  if (publication_type === 'newsletter') {
    const editionNumberStr = formData.get('edition_number') as string;
    edition_number = editionNumberStr ? parseInt(editionNumberStr, 10) : null;
    date_range = formData.get('date_range') as string;
  }

  // Check slug uniqueness
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
  
  // Insert the new post
  const { data, error } = await supabase
    .from('news_posts')
    .insert([
      {
        title,
        slug,
        content,
        is_published,
        image_urls,
        publication_type,
        edition_number,
        date_range,
        published_at: is_published ? new Date().toISOString() : null,
      },
    ])
    .select();

  if (error) {
    console.error('Insert error:', error);
    return redirect(`/admin/news/create?error=${encodeURIComponent(error.message)}`);
  }

  // Revalidate paths
  revalidatePath('/admin/news');
  revalidatePath('/nuus');
  
  if (publication_type === 'newsletter') {
    revalidatePath('/nuus/uitgawes');
    revalidatePath(`/nuus/uitgawes/${slug}`);
  } else {
    revalidatePath(`/nuus/${slug}`);
  }
  
  redirect('/admin/news');
}