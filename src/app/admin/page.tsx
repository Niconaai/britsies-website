// src/app/admin/page.tsx
import { createClient } from "../../../utils/supabase/server"; // Use your existing utils
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // *** Add Auth Check HERE ***
  const supabase = await createClient(); // Use await as your util is async
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('AdminDashboard Page: No user found, redirecting to /login'); // Add log
    return redirect('/login');
  }
  // *** End Auth Check ***

  console.log('AdminDashboard Page: User found, rendering page.'); // Add log

  // Logout action remains the same
  const logout = async (formData: FormData) => {
    "use server";
    const supabaseLogout = await createClient();
    await supabaseLogout.auth.signOut();
    return redirect("/admin/login");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Admin Dashboard
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
      <p className="mt-2 text-zinc-700 dark:text-zinc-300">
        Hier sal die opsomming van aansoeke en CMS-plasings verskyn. (Week 3)
      </p>
    </div>
  );
}