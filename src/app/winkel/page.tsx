// src/app/winkel/page.tsx
import { createClient } from "@/utils/supabase/server";
import ProductCard from "./ProductCard";
import type { DbShopProduct } from "@/types/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Winkel",
  description: "Aanlyn Winkel van Hoërskool Brits",
};

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
      
      <p className="text-zinc-600 dark:text-zinc-400 text-center">
          Welkom by die Britsie-winkel. Hier kan jy al jou gunsteling Britsie klere en items koop. Die items kan by die skool afgehaal word.
        </p>

        <hr className="my-8  border-zinc-300 dark:border-zinc-600" />
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