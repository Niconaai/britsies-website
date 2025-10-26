'use server';

import { createClient } from '@/utils/supabase/server'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePost(formData: FormData) {
  const supabase = await createClient();

  // Get the post ID from the hidden input
  const postId = formData.get('postId') as string;

  // Basic validation (can be expanded)
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string; 
  const imageUrl = formData.get('image_url') as string | null;
  const isPublished = formData.get('is_published') === 'on'; 

  // --- Validation ---
  if (!postId) {
    console.error('Update error: Missing postId');
    return redirect('/admin/news?error=Missing post ID for update.');
  }
  if (!title || !slug || !content) {
    console.error(`Update error for ${postId}: Missing required fields.`);
    return redirect(`/admin/news/edit/${postId}?error=Title, Slug, and Content are required.`);
  }
  // --- End Validation ---

  // Prepare data for Supabase update, matching FSD schema
  const updatedData = {
    title: title,
    slug: slug,
    content: content,
    image_url: imageUrl || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  console.log(`Attempting to update post ${postId} with:`, updatedData);

  // Update the 'news_posts' table record
  const { error } = await supabase
    .from('news_posts') 
    .update(updatedData)
    .eq('id', postId);

  if (error) {
    console.error(`Supabase update error for ${postId}:`, error);
    return redirect(`/admin/news/edit/${postId}?error=${encodeURIComponent(error.message)}`);
  }

  console.log(`Post ${postId} updated successfully.`);

  revalidatePath('/admin/news'); // Revalidate the list page
  revalidatePath(`/admin/news/edit/${postId}`); // Revalidate the edit page itself
  // Optional: Revalidate public news page if needed
  // revalidatePath('/nuus');
  // revalidatePath(`/nuus/${slug}`); // If you have individual post pages

  // Redirect back to the news list page on success
  redirect('/admin/news');
}