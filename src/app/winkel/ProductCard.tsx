// src/app/winkel/ProductCard.tsx
'use client'; // Ons sal dit 'client' maak vir 'Voeg by Mandjie'-interaksies later

import Image from 'next/image';
import Link from 'next/link';
import type { DbShopProduct } from '@/types/supabase';

// Hulpfunksie om prys te formateer
const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export default function ProductCard({ product }: { product: DbShopProduct }) {
  
  // TODO: Implementeer 'addToCart' funksie
  const handleAddToCart = () => {
    console.log(`Voeg ${product.name} by mandjie...`);
    // Hier sal ons 'use-shopping-cart' of ons eie context-logika roep
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <Link href={`/winkel/${product.id}`}>
        <div className="aspect-h-1 aspect-w-1 bg-zinc-50 sm:aspect-none sm:h-60">
          <Image
            src={product.image_url || '/placeholder.png'} // 'n Plekhouer-prent sal goed wees
            alt={product.name}
            width={300}
            height={240}
            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
          <Link href={`/winkel/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {product.description?.substring(0, 50) || 'Beskrywing nie beskikbaar nie'}...
        </p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-medium text-zinc-900 dark:text-white">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <button
            onClick={handleAddToCart}
            disabled={product.stock_level <= 0}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400 dark:disabled:bg-zinc-600"
        >
            {product.stock_level > 0 ? 'Voeg by Mandjie' : 'Uil voorraad'}
        </button>
      </div>
    </div>
  );
}