'use server';

import { createClient } from '@/utils/supabase/server'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const supabase = await createClient(); 

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('image_url') as string | null;
  const isPublished = formData.get('is_published') === 'on'; 

  if (!title || !slug || !content) {
    console.error('Missing required fields:', { title, slug, content });
    return redirect('/admin/news/create?error=Title, Slug, and Content are required.');
  }

  const postData = {
    title: title,
    slug: slug,
    content: content,
    image_url: imageUrl || null, 
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  console.log('Attempting to insert post:', postData);

  const { error } = await supabase.from('news_posts').insert(postData);

  if (error) {
    console.error('Supabase insert error:', error);
    return redirect(`/admin/news/create?error=${encodeURIComponent(error.message)}`);
  }

  console.log('Post inserted successfully.');


  revalidatePath('/admin/news');

  redirect('/admin/news');
}