// src/app/admin/shop/products/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { deleteProduct } from './actions';
import type { ProductWithCategory } from '@/types/supabase';

// Hulpfunksie om prys te formateer
const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export default async function ShopProductsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/login');
    }
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return redirect('/');
    }

    const { data: products, error: fetchError } = await supabase
        .from('shop_products')
        .select(`
            id, 
            name, 
            price, 
            stock_level, 
            is_active,
            shop_categories ( name )
        `)
        .order('name', { ascending: true });
        
    const productList = products as ProductWithCategory[] | null;

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Produkbestuur
                </h1>
                <Link
                    href="/admin/winkel/produkte/create"
                    className="rounded-md bg-blue-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Skep Nuwe Produk +
                </Link>
            </div>

            {/* --- Begin Produk Tabel --- */}
            {fetchError && (
                <p className="text-red-600 dark:text-red-400">
                    Kon nie produkte laai nie: {fetchError.message}
                </p>
            )}
            {productList && productList.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Produknaam</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Kategorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Prys</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Voorraad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksies</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {productList.map((product) => (
                                <tr key={product.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{product.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{product.shop_categories?.name ?? 'N/A'}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{formatCurrency(product.price)}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{product.stock_level}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                            product.is_active 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                                        }`}>
                                            {product.is_active ? 'Aktief' : 'Onaktief'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                                        <Link
                                            href={`/admin/winkel/produkte/wysig/${product.id}`}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Wysig
                                        </Link>
                                        <form action={deleteProduct} className="inline">
                                            <input type="hidden" name="productId" value={product.id} />
                                            <button
                                                type="submit"
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={(e) => !confirm('Is jy seker jy wil hierdie produk skrap?') && e.preventDefault()}
                                            >
                                                Skrap
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !fetchError && <p className="mt-4 text-zinc-500 dark:text-zinc-400">Geen produkte gevind nie. Klik "Skep Nuwe Produk" om te begin.</p>
            )}
        </div>
    );
}