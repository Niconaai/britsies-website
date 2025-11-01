// src/app/winkel/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProductCard from "./ProductCard";
import type { DbShopProduct } from "@/types/supabase";

export default async function WinkelPage() {
  const supabase = await createClient();

  // Haal slegs aktiewe produkte
  const { data: products, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    return <p className="text-red-600">Kon nie produkte laai nie: {error.message}</p>
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Winkel Katalogus
      </h1>
      
      {products.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          Daar is tans geen produkte beskikbaar nie. Kom loer binnekort weer in!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as DbShopProduct} />
          ))}
        </div>
      )}
    </div>
  );
}