// src/app/admin/news/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'; // Use path alias or relative path
import { redirect } from 'next/navigation'; // Needed for auth check
import { deletePost } from './actions'; // We'll create this next

// Define a type for your news post data
type NewsPost = {
    id: string;
    title: string | null;
    is_published: boolean | null;
    published_at: string | null;
    created_at: string;
};

export default async function NewsAdminPage() {
    const supabase = await createClient();

    // --- Auth Check (Similar to admin dashboard page) ---
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        console.log('NewsAdminPage: No user found, redirecting to /login');
        return redirect('/login');
    }
    // --- End Auth Check ---

    console.log('NewsAdminPage: Fetching news posts.');

    // --- Fetch News Posts from Supabase ---
    const { data: newsPosts, error: fetchError } = await supabase
        .from('news_posts')
        .select('id, title, is_published, published_at, created_at')
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error("Error fetching news posts:", fetchError);
        // Handle error - newsPosts might be null
    }
    // --- End Fetch ---

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Nuus Bestuur (CMS)
                </h1>
                {/* --- Correct Link for Create Button --- */}
                <Link
                    href="/admin/news/create" // Link to the create page
                    className="rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Skep Nuwe Pos +
                </Link>
                {/* --- End Correct Link --- */}
            </div>

            {/* --- Start News Posts Table --- */}
            {fetchError && (
                <p className="text-red-600 dark:text-red-400">
                    Kon nie nuusberigte laai nie: {fetchError.message}
                </p>
            )}
            {newsPosts && newsPosts.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th /* ... Titel ... */ > Titel </th>
                                <th /* ... Status ... */ > Status </th>
                                <th /* ... Gepubliseer Op ... */ > Gepubliseer Op </th>
                                {/* --- Add Actions Header --- */}
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                                    Aksies
                                </th>
                                {/* --- End Actions Header --- */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {newsPosts.map((post: NewsPost) => {
                                // console.log(`Generating link for post ID: ${post.id}`);
                                return (
                                    <tr key={post.id}>
                                        <td className="text-center"> { post.title ?? 'Geen titel'} </td>
                                        <td className="text-center"> { post.is_published ? 'Gepubliseer' : 'Nie gepubliseer' } </td>
                                        <td className="text-center"> { post.is_published ? post.published_at : 'Nie gepubliseer' } </td>
                                        {/* --- Add Actions Cell --- */}
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                                            {/* Edit Link */}
                                            <Link
                                                href={`/admin/news/edit/${post.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Wysig
                                            </Link>
                                            {/* Delete Form */}
                                            <form action={deletePost} className="inline">
                                                <input type="hidden" name="postId" value={post.id} />
                                                <button
                                                    type="submit"
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                // Optional: Add confirmation dialog via client-side JS later
                                                // onClick={(e) => !confirm('Are you sure you want to delete this post?') && e.preventDefault()}
                                                >
                                                    Verwyder
                                                </button>
                                            </form>
                                        </td>
                                        {/* --- End Actions Cell --- */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                !fetchError && <p className="mt-4 text-zinc-500 dark:text-zinc-400">Geen nuusberigte gevind nie.</p>
            )}
            {/* --- End News Posts Table --- */}
        </div>
    );
}