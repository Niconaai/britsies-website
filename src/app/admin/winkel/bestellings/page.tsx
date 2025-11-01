// src/app/admin/winkel/bestellings/page.tsx
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { DbShopOrder } from '@/types/supabase'; 

// Tipe vir ons data-navraag
type OrderWithDetails = DbShopOrder & {
  // Ons kan later 'n customer name join as ons wil
};

// Hulp-funksie vir prys-formattering
const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

// Hulp-funksie vir status-kleure
const getStatusStyles = (status: string | null) => {
  switch (status) {
    case 'completed':
    case 'ready_for_collection':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'pending_payment':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  }
};

export default async function ShopOrdersPage() {
    const supabase = await createClient();

    // --- Admin Auth Check ---
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') return redirect('/');
    // --- Einde Auth Check ---

    const { data: orders, error: fetchError } = await supabase
        .from('shop_orders')
        .select(`*`) // Haal alles vir eers
        .order('created_at', { ascending: false }); // Nuutste bo

    const orderList = orders as OrderWithDetails[] | null;

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Winkel Bestellings
                </h1>
            </div>

            {/* --- Begin Bestellings Tabel --- */}
            {fetchError && (
                <p className="text-red-600 dark:text-red-400">
                    Kon nie bestellings laai nie: {fetchError.message}
                </p>
            )}
            {orderList && orderList.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                        <thead className="bg-zinc-50 dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Bestel Nr.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Kliënt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Datum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Totaal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Aksies</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {orderList.map((order) => {
                                const customerName = order.user_id ? 'Geregistreerde Gebruiker' : (order.guest_name || 'Gas');
                                return (
                                    <tr key={order.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                            {order.human_readable_id || `#${order.order_number}`}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            {customerName} <br />
                                            <span className="text-xs text-zinc-400">{order.guest_email || ''}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            {new Date(order.created_at).toLocaleDateString('af-ZA')}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                                getStatusStyles(order.status)
                                            }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                                            <Link
                                                href={`/admin/winkel/bestellings/${order.id}`} // <-- OPGEDATEERDE PAD
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Bestuur
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                !fetchError && <p className="mt-4 text-zinc-500 dark:text-zinc-400">Geen bestellings gevind nie.</p>
            )}
        </div>
    );
}