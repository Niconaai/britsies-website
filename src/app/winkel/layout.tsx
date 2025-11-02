// src/app/winkel/layout.tsx
import { PropsWithChildren } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { CartProvider } from '@/context/CartContext';
import CartIconWithBadge from './CartIconWithBadge';
import { createClient } from "@/utils/supabase/server";
import { signOutFromWinkel } from './actions'; // Ons sal hierdie lêer moet skep

export default async function WinkelLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profileName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    profileName = profile?.full_name || user.email || null;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
        <header className="sticky top-0 z-10 bg-white dark:bg-zinc-800 shadow-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
            
            <Link href="/winkel" className="flex items-center gap-3">
              <Image
                src="/wapen.png"
                alt="Hoërskool Brits Logo"
                width={40}
                height={40}
                className="h-auto"
              />
              <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
                Aanlyn Winkel
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              <CartIconWithBadge />
              <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-600"></div>

              {user && profileName ? (
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                    Hallo, {profileName.split(' ')[0]}
                  </span>
                  <form action={signOutFromWinkel}>
                    <button
                      type="submit"
                      className="rounded-md px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:text-zinc-200 dark:ring-zinc-600 dark:hover:bg-zinc-700"
                    >
                      Teken Uit
                    </button>
                  </form>
                </div>
              ) : (
                // ***** REGSTELLING HIER *****
                <Link
                  href="/aansoek/begin?redirect_to=/winkel/katalogus" // <-- VOEG PARAMETER BY
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Teken In
                </Link>
                // ***** EINDE VAN REGSTELLING *****
              )}
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-7xl p-4 md:p-6">
          {children}
        </main>

        <footer className="mt-12 border-t border-zinc-200 py-6 dark:border-zinc-700">
           <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Hoërskool Brits. Alle regte voorbehou.
          </p>
        </footer>
      </div>
    </CartProvider>
  );
}