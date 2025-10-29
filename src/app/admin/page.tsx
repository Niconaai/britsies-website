import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata = {
  title: "Hoërskool Brits | Admin",
  description: "Admin Bladsy van Hoërskool Brits",
};

type Application = {
  id: string;
  created_at: string; 
  status: string | null;
  // We'll add learner name later when we join tables
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('AdminDashboard Page: No user found, redirecting to /login');
    return redirect('/login');
  }

  console.log('AdminDashboard Page: User found, fetching applications.');

  // --- Fetch Applications from Supabase ---
  const { data: applications, error: fetchError } = await supabase
    .from('applications') 
    .select('id, created_at, status') 
    .order('created_at', { ascending: false }) 
    .limit(10); 

  if (fetchError) {
    console.error("Error fetching applications:", fetchError);
  }
  // --- End Fetch ---

  const logout = async (formData: FormData) => {
    "use server";
    const supabaseLogout = await createClient();
    await supabaseLogout.auth.signOut();
    return redirect("/login");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Admin Paneelblad
        </h1>
        <form>
          <button
            formAction={logout}
            className="rounded-md bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Teken Uit
          </button>
        </form>
      </div>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">
        Welkom, {user?.email}!
      </p>

      {/* --- Start Admissions Table --- */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Onlangse Aansoeke
        </h2>
        {/* Display error message if fetching failed */}
        {fetchError && (
          <p className="text-red-600 dark:text-red-400">
            Kon nie aansoeke laai nie: {fetchError.message}
          </p>
        )}
        {/* Display table only if data exists */}
        {applications && applications.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Leerder Naam {/* We'll add this when joining Learners table }
                  </th> */}
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    ID {/* Displaying ID for now */}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Ontvang {/* created_at */}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Status {/* status */}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Bekyk</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                {/* Map over the fetched applications data */}
                {applications.map((app: Application) => (
                  <tr key={app.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                      {/* Displaying first part of UUID for brevity */}
                      {app.id.substring(0, 8)}...
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                      }`}>
                         {/* Handle null status */}
                        {app.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      {/* TODO: Link to detail view: e.g., /admin/applications/${app.id} */}
                      <a href="#" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Bekyk
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Show message if no applications or data is null (and no error)
          !fetchError && <p className="mt-4 text-zinc-500 dark:text-zinc-400">Geen aansoeke gevind nie.</p>
        )}
      </div>
      {/* --- End Admissions Table --- */}
    </div>
  );
}