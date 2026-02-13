// src/app/admin/news/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NewsAdminClient from './NewsAdminClient';

type NewsPost = {
    id: string;
    title: string | null;
    is_published: boolean | null;
    published_at: string | null;
    created_at: string;
    publication_type: string | null;
    edition_number: number | null;
};

export default async function NewsAdminPage() {
    const supabase = await createClient();

    // Auth Check
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.log('NewsAdminPage: No user found, redirecting to /login');
        return redirect('/login');
    }

    console.log('NewsAdminPage: Fetching all posts.');

    // Fetch all posts (news and newsletters, but not newsletter sections)
    const { data: allPosts, error: fetchError } = await supabase
        .from('news_posts')
        .select('id, title, is_published, published_at, created_at, publication_type, edition_number')
        .in('publication_type', ['news', 'newsletter'])
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error("Error fetching posts:", fetchError);
        return (
            <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <p className="text-red-600 dark:text-red-400">
                    Kon nie nuusberigte laai nie: {fetchError.message}
                </p>
            </div>
        );
    }

    return <NewsAdminClient allPosts={allPosts as NewsPost[] || []} />;
}