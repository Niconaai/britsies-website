// src/app/winkel/layout.tsx
import { PropsWithChildren } from "react";
import Image from 'next/image';
import Link from 'next/link';

// Eenvoudige Winkelmandjie-ikoon
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

export default function WinkelLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      
      {/* Winkel Header */}
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
            <Link href="/winkel/mandjie" className="text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400">
              <CartIcon />
              <span className="sr-only">Winkelmandjie</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hoof Inhoud Area */}
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        {children}
      </main>

      {/* Winkel Footer (kan later bygevoeg word) */}
      <footer className="mt-12 border-t border-zinc-200 py-6 dark:border-zinc-700">
         <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Hoërskool Brits. Alle regte voorbehou.
         </p>
      </footer>
    </div>
  );
}