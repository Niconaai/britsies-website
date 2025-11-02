// src/app/winkel/[produkid]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import type { DbShopProduct } from "@/types/supabase";
import AddToCartButton from "./AddToCartButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Winkel",
    description: "Aanlyn Winkel van Hoërskool Brits",
};

const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('af-ZA', {
        style: 'currency',
        currency: 'ZAR',
    }).format(amount);
};

type ProductDetailPageProps = {
    params: { produkid: string };
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const supabase = await createClient();
    const { produkid } = await params;

    const { data: product, error } = await supabase
        .from('shop_products')
        .select('*')
        .eq('id', produkid)
        .eq('is_active', true)
        .single();

    if (error || !product) {
        notFound();
    }

    const productTyped = product as DbShopProduct;

    return (
        <div>
            <Link
                href="/winkel"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
            >
                &larr; Terug na alle produkte
            </Link>

            <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    {/* Produk Prent */}
                    <div className="w-full overflow-hidden flex justify-center items-center rounded-lg">
                        <Image
                            src={productTyped.image_url || '/wapen-copy.png'}
                            alt={productTyped.name}
                            width={800}  // Gee 'n groot basis-grootte vir kwaliteit
                            height={800} // Die 'height' en 'width' definieer die aspek-verhouding (1:1)
                            priority // Laai die hoof-produk prent vinnig
                            className="w-full h-auto object-contain max-h-[500px] rounded-lg"
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

                            <AddToCartButton product={productTyped} />
                        </div>

                        {/* <div className="mt-6 text-center">
                            <p className="text-sm text-zinc-500">
                                {productTyped.stock_level > 0
                                    ? `${productTyped.stock_level} in voorraad`
                                    : 'Tans uit voorraad'}
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}