// src/app/admin/news/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'; // Use path alias or relative path
import { redirect } from 'next/navigation'; // Needed for auth check

// Define a type for your news post data
type NewsPost = {
  id: string;
  title: string | null;
  is_published: boolean | null;
  published_at: string | null; // Supabase returns ISO string
  created_at: string;
};

export default async function NewsAdminPage() {
  const supabase = await createClient(); // Use await as your util is async

  // --- Auth Check (Similar to admin dashboard page) ---
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('NewsAdminPage: No user found, redirecting to /login');
    // Redirect to the correct login path
    return redirect('/login');
  }
  // --- End Auth Check ---

  console.log('NewsAdminPage: Fetching news posts.');

  // --- Fetch News Posts from Supabase ---
  const { data: newsPosts, error: fetchError } = await supabase
    .from('news_posts') // Use lowercase table name
    .select('id, title, is_published, published_at, created_at') // Select columns needed for the list
    .order('created_at', { ascending: false }); // Show newest first

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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Titel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Gepubliseer Op
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Wysig</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                {/* --- Map over fetched data --- */}
                {newsPosts.map((post: NewsPost) => {
                    console.log(`Generating link for post ID: ${post.id}`); // Logging added previously
                    return (
                        <tr key={post.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                            {post.title ?? 'Geen titel'} {/* Handle null title */}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                post.is_published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                            }`}>
                                {/* Handle null status */}
                                {post.is_published === null ? 'Unknown' : post.is_published ? 'Gepubliseer' : 'Draft'}
                            </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : '---'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                {/* --- Corrected Edit Link --- */}
                                <Link
                                    href={`/admin/news/edit/${post.id}`} // Use template literal with actual post.id
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Wysig
                                </Link>
                                {/* --- End Correction --- */}
                            </td>
                        </tr>
                    );
                })}
                {/* --- End Map --- */}
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