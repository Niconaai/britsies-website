// src/app/winkel/CartIconWithBadge.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Die SVG-ikoon
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

export default function CartIconWithBadge() {
  const { itemCount } = useCart(); //

  return (
    <Link href="/winkel/mandjie" className="relative text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400">
      <CartIcon />
      
      {/* --- DIE NUWE "BADGE" --- */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
      {/* --- EINDE VAN "BADGE" --- */}

      <span className="sr-only">Winkelmandjie</span>
    </Link>
  );
}