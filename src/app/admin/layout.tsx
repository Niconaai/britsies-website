// src/app/admin/layout.tsx
import { PropsWithChildren } from "react";
import Image from 'next/image';
import Link from 'next/link';
import AdminSidebarNav from './AdminSidebarNav';
import { createClient } from "@/utils/supabase/server";
import { signOutAdmin } from "./actions"; // <-- Voer die nuwe aksie in

export default async function AdminLayout({ children }: PropsWithChildren) {
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Gaan haal profielnaam (opsioneel, wys e-pos as 'n fallback)
  let adminName = user?.email; // Verstek na e-pos
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    if (profile?.full_name) {
      adminName = profile.full_name;
    }
  }

  return (
    // REGSTELLING: Beperk die hele uitleg tot die skermhoogte en versteek hoof-scroll
    <div className="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      
      {/* --- SY-SPYSKAART (Scroll onafhanklik) --- */}
      <aside className="flex w-64 flex-col bg-zinc-800 p-4 text-white overflow-y-auto">
        <Link href="/admin" className="mb-6 flex justify-center">
          <Image
            src="/wapen.png" 
            alt="Hoërskool Brits Logo"
            width={100}
            height={100}
            className="h-auto"
          />
        </Link>
        <AdminSidebarNav />
      </aside>

      {/* --- HOOF INHOUD-AREA --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* NUUT: TOP-BAR */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-700 dark:bg-zinc-800">
          <div>
            {/* Kan 'n soekbalk of 'n "breadcrumbs"-navigasie hier byvoeg later */}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {adminName}
            </span>
            <form action={signOutAdmin}>
              <button
                type="submit"
                className="rounded-md bg-red-600 py-1.5 px-3 text-xs font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Teken Uit
              </button>
            </form>
          </div>
        </header>

        {/* REGSTELLING: Hoof-inhoud (Scroll onafhanklik) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

    </div>
  );
}