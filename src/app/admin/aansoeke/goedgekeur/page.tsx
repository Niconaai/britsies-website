import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from 'next/link'; 

export const metadata = {
  title: "Hoërskool Brits | Goedgekeurde Aansoeke", // <-- METADATA OPGEDATEER
  description: "Admin Paneelblad van Hoërskool Brits",
};

// Tipe vir ons data-navraag
type ApplicationWithLearner = {
  id: string;
  created_at: string; 
  status: string | null;
  human_readable_id: string | null;
  learners: { 
    first_names: string | null;
    surname: string | null;
    last_grade_passed: string | null; 
  }[] | null; 
};

// Hulp-funksie vir status-kleure
const getStatusStyles = (status: string | null) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'waitlisted':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  }
};


export default async function ApprovedApplicationsPage() { // <-- BLADSYNAAM OPGEDATEER
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return redirect('/');
  }

  // --- OPGEDATEERDE DATA-NAVRAAG MET FILTER ---
  const { data: applications, error: fetchError } = await supabase
    .from('applications') 
    .select(`
      id, 
      created_at, 
      status, 
      human_readable_id,
      learners ( first_names, surname, last_grade_passed )
    `) 
    // ******** VERANDERING HIER ********
    // Wys slegs waar status 'approved' IS
    .eq('status', 'approved')
    // ******** EINDE VAN VERANDERING ********
    .order('created_at', { ascending: false }); 

  if (fetchError) {
    console.error("Error fetching APPROVED applications:", fetchError);
  }
  // --- EINDE VAN NAVRAAG ---

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
          Goedgekeurde Aansoeke {/* <-- TITEL OPGEDATEER */}
        </h1>
        <form>
          {/* <button
            formAction={logout}
            className="rounded-md bg-red-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Teken Uit
          </button> */}
        </form>
      </div>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">
        Hier is die lys van aansoeke wat reeds goedgekeur is.
      </p>

      {/* --- AANSOEK-TABEL --- */}
      <div className="mt-8">
        {fetchError && (
          <p className="text-red-600 dark:text-red-400">
            Kon nie aansoeke laai nie: {fetchError.message}
          </p>
        )}
        {applications && applications.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Leerder Naam
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Graad Aansoek
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Verwysing ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Ontvang
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Bekyk</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                {(applications as ApplicationWithLearner[]).map((app) => {
                  const learner = app.learners && app.learners.length > 0 ? app.learners[0] : null;
                  const learnerName = learner ? `${learner.first_names || ''} ${learner.surname || ''}`.trim() : 'N/A';
                  const grade = learner ? `Graad ${learner.last_grade_passed || 'N/A'}` : 'N/A';
                  const friendlyId = app.human_readable_id || `${app.id.substring(0, 8)}...`;

                  return (
                    <tr key={app.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                        {learnerName}
                      </td>
                      <td className="whitespace-nowwraphitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {grade}
                      </td>
                       <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-zinc-500 dark:text-zinc-400">
                        {friendlyId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(app.created_at).toLocaleDateString('af-ZA')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          getStatusStyles(app.status)
                        }`}>
                          {app.status ?? 'pending'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link 
                          href={`/admin/aansoeke/${app.id}`} 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Bekyk
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          !fetchError && <p className="mt-4 text-zinc-500 dark:text-zinc-400">Geen goedgekeurde aansoeke gevind nie.</p>
        )}
      </div>
    </div>
  );
}