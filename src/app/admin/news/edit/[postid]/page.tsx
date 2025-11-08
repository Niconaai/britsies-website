// src/app/admin/news/edit/[postid]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EditNewsForm from './EditNewsForm';

type EditNewsPostPageProps = {
    params: Promise<{ postid: string }>;
};

// === BEGIN REGSTELLING 1: Dateer die tipe op ===
type NewsPost = {
    id: string;
    title: string | null;
    slug: string | null;
    content: string | null;
    image_urls: string[] | null; // <-- REGSTELLING (was image_url)
    is_published: boolean | null;
    published_at: string | null;
    created_at: string;
};
// === EINDE REGSTELLING 1 ===

export default async function EditNewsPostPage({ params }: EditNewsPostPageProps) {
    console.log("--- EditNewsPostPage START ---");

    const { postid } = await params;
    console.log(`Attempting to use postid: ${postid}`);

    if (!postid || typeof postid !== 'string') {
        console.error("CRITICAL: postid is invalid or missing after direct access!", params);
        return notFound();
    }

    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    console.log(`EditNewsPostPage: Fetching post with valid ID: ${postid}`);

    // === BEGIN REGSTELLING 2: Dateer die 'select'-stelling op ===
    // Haal die nuwe 'image_urls' kolom, nie die oue nie
    const { data: post, error: fetchError } = await supabase
        .from('news_posts')
        .select('id, title, slug, content, image_urls, is_published, published_at, created_at') // <-- REGSTELLING
        .eq('id', postid)
        .single<NewsPost>(); // Gebruik ons opgedateerde tipe
    // === EINDE REGSTELLING 2 ===

    if (fetchError || !post) {
        console.error(`Error fetching post ${postid} or post not found:`, fetchError);
        return notFound();
    }

    console.log(`EditNewsPostPage: Post ${postid} found, rendering edit form container.`);

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Wysig Nuuspos</h1>
                <Link
                    href="/admin/news"
                    className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                    Kanselleer
                </Link>
            </div>
            <EditNewsForm post={post} />
        </div>
    );
}