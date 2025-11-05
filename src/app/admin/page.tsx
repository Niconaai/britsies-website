// src/app/admin/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata = {
  title: "Hoërskool Brits | Admin Paneelblad",
  description: "Admin Paneelblad van Hoërskool Brits",
};

export default async function AdminDashboard() {
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

  // ONS VERWYDER DIE 'logout' AKSIE HIER -- DIS NOU IN DIE UITLEG

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Admin Paneelblad
        </h1>
        {/* DIE OU UITTEKEN-KNOPPIE IS NOU VERWYDER HIERVANAF */}
      </div>
      <p className="mt-4 text-zinc-700 dark:text-zinc-300">
        Welkom!
      </p>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Gebruik asseblief die spyskaart aan die linkerkant om aansoeke, die winkel, of webwerf-inhoud te bestuur.
      </p>
      
      {/* Vinnige Skakels */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link 
          href="/admin/aansoeke/hangende" 
          className="rounded-lg bg-yellow-100 p-6 shadow transition hover:shadow-md dark:bg-yellow-900/50 dark:hover:bg-yellow-900"
        >
           <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Hangende Aansoeke</h3>
           <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">Bekyk aansoeke wat wag vir hersiening.</p>
        </Link>
        <Link 
          href="/admin/winkel/bestellings" 
          className="rounded-lg bg-green-100 p-6 shadow transition hover:shadow-md dark:bg-green-900/50 dark:hover:bg-green-900"
        >
           <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Winkel Bestellings</h3>
           <p className="mt-2 text-sm text-green-700 dark:text-green-300">Bestuur nuwe en bestaande bestellings.</p>
        </Link>
        <Link 
          href="/admin/news" 
          className="rounded-lg bg-blue-100 p-6 shadow transition hover:shadow-md dark:bg-blue-900/50 dark:hover:bg-blue-900"
        >
           <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Nuus Bestuur</h3>
           <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">Skep of wysig nuusberigte vir die webwerf.</p>
        </Link>
      </div>
    </div>
  );
}