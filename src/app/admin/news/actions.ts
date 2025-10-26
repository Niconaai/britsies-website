// src/app/admin/news/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deletePost(formData: FormData) {
    const supabase = await createClient();
    const postId = formData.get('postId') as string;

    // Basic validation
    if (!postId) {
        console.error('Delete error: Missing postId');
        return redirect('/admin/news?error=Missing post ID for deletion.');
    }

    console.log(`Attempting to delete post ${postId}`);

    // --- Auth Check (Ensure user is logged in before deleting) ---
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
        console.error(`Delete error for ${postId}: User not authenticated.`);
        return redirect('/login'); // Or redirect to news list with error
     }
    // --- End Auth Check ---

    // Delete from the 'news_posts' table
    const { error } = await supabase
        .from('news_posts') // lowercase table name
        .delete()
        .eq('id', postId);

    if (error) {
        console.error(`Supabase delete error for ${postId}:`, error);
        // Redirect back to the list page with error
        return redirect(`/admin/news?error=${encodeURIComponent('Failed to delete post: ' + error.message)}`);
    }

    console.log(`Post ${postId} deleted successfully.`);

    // Revalidate the news list path to show the updated list
    revalidatePath('/admin/news');

    // Redirect back to the news list page on success (optional, revalidate might be enough)
    // redirect('/admin/news');

    // Return a success status or message if needed, or simply let it complete.
    // For now, revalidatePath handles the UI update.
}