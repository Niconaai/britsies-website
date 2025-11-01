// src/app/winkel/[produkid]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from 'next/image';
import type { DbShopProduct } from "@/types/supabase";

// Hulpfunksie om prys te formateer
const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

type ProductDetailPageProps = {
  params: { produkid: string }; // <-- Gebruik jou gidsnaam
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const supabase = await createClient();
  const { produkid } = params;

  const { data: product, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', produkid)
    .eq('is_active', true) // Slegs aktiewe produkte kan gesien word
    .single();

  if (error || !product) {
    notFound();
  }
  
  const productTyped = product as DbShopProduct;

  return (
    <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        
        {/* Produk Prent */}
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={productTyped.image_url || '/placeholder.png'}
            alt={productTyped.name}
            width={600}
            height={600}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Produk Inligting */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {productTyped.name}
          </h1>

          <div className="mt-3">
            <p className="text-3xl tracking-tight text-zinc-900 dark:text-white">
              {formatCurrency(productTyped.price)}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Beskrywing</h3>
            <div 
              className="space-y-6 text-base text-zinc-700 dark:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: productTyped.description || 'Geen beskrywing.' }}
            />
          </div>

          <div className="mt-10">
            {/* TODO: Opsies (kleur, grootte) sal hier gelaai word vanaf product.options (JSONB) */}
            
            <button
              type="submit"
              disabled={productTyped.stock_level <= 0}
              className="flex w-full max-w-xs items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:disabled:bg-zinc-600"
            >
              {productTyped.stock_level > 0 ? 'Voeg by Mandjie' : 'Uil voorraad'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              {productTyped.stock_level > 0 
                ? `${productTyped.stock_level} in voorraad` 
                : 'Tans uit voorraad'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}