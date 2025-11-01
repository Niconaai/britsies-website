// src/app/aansoek/layout.tsx
import { createClient } from '@/utils/supabase/server';
import { signOut } from './begin/actions';
import { PropsWithChildren } from 'react';
import Image from 'next/image';

export default async function AansoekLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user?.id)
      .single();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">

      {user && (
        <header className="bg-white dark:bg-zinc-800 shadow-md">
          <nav className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <div className="flex items-center gap-3"> 
              <Image
                src="/wapen.png" 
                alt="Hoërskool Brits Logo"
                width={40}
                height={40}
                className="h-auto"
              />
              <h1 className="text-md flex text-center md:text-lg font-bold text-zinc-900 dark:text-white">
                Aanlyn Aansoek Portaal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Hallo, {profile?.full_name || user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md bg-red-900 md:px-3 px-2 md:py-1.5 py-0.5 md:text-sm text-xs font-semibold text-white shadow-sm hover:bg-gray-600"
                >
                  Teken Uit
                </button>
              </form>
            </div>
          </nav>
        </header>
      )}

      <main>
        {children}
      </main>

    </div>
  );
}