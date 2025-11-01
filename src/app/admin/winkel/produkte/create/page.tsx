// src/app/admin/shop/products/create/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '../ProductForm';
import { createProduct } from '../actions';
import type { DbShopCategory } from '@/types/supabase';

export default async function CreateProductPage() {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') return redirect('/');

    // Haal kategorieë vir die keuselys
    const { data: categories, error } = await supabase
        .from('shop_categories')
        .select('*')
        .order('name');
    
    if (error) {
        console.error("Kon nie kategorieë laai nie:", error);
        // Gaan voort sonder kategorieë, of wys 'n fout
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Skep Nuwe Produk
                </h1>
                <Link
                    href="/admin/winkel/produkte"
                    className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                    Kanselleer
                </Link>
            </div>
            
            <ProductForm
                categories={categories as DbShopCategory[] || []}
                formAction={createProduct}
                submitButtonText="Skep Produk"
            />
        </div>
    );
}