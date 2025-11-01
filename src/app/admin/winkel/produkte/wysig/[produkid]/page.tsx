// src/app/admin/winkel/produkte/wysig/[produkid]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '../../ProductForm'; 
import { updateProduct } from '../../actions'; 
import type { DbShopCategory, DbShopProduct } from '@/types/supabase';

type EditProductPageProps = {
  params: Promise<{ produkid: string }>; 
};

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { produkid } = await params; 
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') return redirect('/');

    const [productResult, categoriesResult] = await Promise.all([
        supabase.from('shop_products').select('*').eq('id', produkid).single(), 
        supabase.from('shop_categories').select('*').order('name')
    ]);

    const { data: product, error: productError } = productResult;
    const { data: categories, error: categoriesError } = categoriesResult;

    if (productError || !product) {
        console.error(`Produk ${produkid} nie gevind nie:`, productError); 
        return notFound();
    }
    
    if (categoriesError) {
        console.error("Kon nie kategorieë laai nie:", categoriesError);
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Wysig Produk: {product.name}
                </h1>
                <Link
                    href="/admin/winkel/produkte"
                    className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                    Terug na Lys
                </Link>
            </div>
            
            <ProductForm
                product={product as DbShopProduct}
                categories={categories as DbShopCategory[] || []}
                formAction={updateProduct}
                submitButtonText="Stoor Veranderinge"
            />
        </div>
    );
}