// src/app/admin/news/edit/[postId]/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server'; // Use path alias or relative path
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePost(formData: FormData) {
  const supabase = await createClient(); // Use await as your util is async

  // Get the post ID from the hidden input
  const postId = formData.get('postId') as string;

  // Basic validation (can be expanded)
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string; // Comes from hidden input
  const imageUrl = formData.get('image_url') as string | null;
  const isPublished = formData.get('is_published') === 'on'; // Checkbox value

  // --- Validation ---
  if (!postId) {
    console.error('Update error: Missing postId');
    // Redirect back to the news list with an error, as we don't know which post to edit
    return redirect('/admin/news?error=Missing post ID for update.');
  }
  if (!title || !slug || !content) {
    console.error(`Update error for ${postId}: Missing required fields.`);
    // Redirect back to the specific edit page with an error
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
    // Update published_at only if it's being published *now* and wasn't before,
    // or set to null if unpublished. This logic might need refinement based on exact needs.
    // For simplicity now, we'll just set it if published.
    published_at: isPublished ? new Date().toISOString() : null,
    // We don't update created_at
  };

  console.log(`Attempting to update post ${postId} with:`, updatedData);

  // Update the 'news_posts' table record
  const { error } = await supabase
    .from('news_posts') // lowercase table name
    .update(updatedData)
    .eq('id', postId); // Specify which row to update

  if (error) {
    console.error(`Supabase update error for ${postId}:`, error);
    // Redirect back to the edit page with error
    return redirect(`/admin/news/edit/${postId}?error=${encodeURIComponent(error.message)}`);
  }

  console.log(`Post ${postId} updated successfully.`);

  // Revalidate paths to clear cache and show updated data
  revalidatePath('/admin/news'); // Revalidate the list page
  revalidatePath(`/admin/news/edit/${postId}`); // Revalidate the edit page itself
  // Optional: Revalidate public news page if needed
  // revalidatePath('/nuus');
  // revalidatePath(`/nuus/${slug}`); // If you have individual post pages

  // Redirect back to the news list page on success
  redirect('/admin/news');
}