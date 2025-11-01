// src/app/admin/winkel/bestellings/[orderid]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';
import type { DbShopOrderWithItems } from "@/types/supabase";
import { updateOrderStatus } from "./action";

type OrderDetailPageProps = {
  params: Promise<{ orderid: string }>
};

// Hulpfunksie om prys te formateer
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

// Hulp-komponent om data netjies te vertoon
const InfoField = ({ label, value }: { 
  label: string; 
  value: string | number | null | undefined;
}) => (
  <div>
    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
    <dd className="mt-1 text-sm text-zinc-900 dark:text-white">{value || <span className="italic text-zinc-400">N/A</span>}</dd>
  </div>
);

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = await createClient();
  const { orderid } = await params;

  // --- 1. Admin & Auth-tjek ---
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return redirect('/');
  // --- Einde van Auth-tjek ---

  // --- 2. Gaan Haal Rou Data ---
  // Ons moet 'profiles' join as user_id bestaan, en 'shop_order_items' join
  const { data: rawData, error: fetchError } = await supabase
    .from('shop_orders')
    .select(`
      *,
      shop_order_items(*),
      profiles ( full_name, email, cell_phone )
    `)
    .eq('id', orderid)
    .single(); 

  if (fetchError || !rawData) {
    console.error(`Error fetching order ${orderid}:`, fetchError);
    return notFound(); 
  }

  const order = rawData as DbShopOrderWithItems;
  const items = order.shop_order_items || [];

  // Bepaal kliënt-inligting
  const customer = {
    name: order.user_id ? order.profiles?.full_name : order.guest_name,
    email: order.user_id ? order.profiles?.email : order.guest_email,
    phone: order.user_id ? order.profiles?.cell_phone : order.guest_phone,
    type: order.user_id ? 'Geregistreer' : 'Gas'
  };
  
  const statusOptions = [
    'pending_payment',
    'processing',
    'ready_for_collection',
    'completed',
    'cancelled'
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
    
      {/* --- BLOK 1: Opskrif en Terug-knoppie --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Bestelling: {order.human_readable_id || `#${order.order_number}`}
        </h1>
        <Link
          href="/admin/winkel/bestellings"
          className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Terug na Lys
        </Link>
      </div>

      {/* --- BLOK 2: Status Bestuur --- */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Bestuur Status</h2>
        <form action={updateOrderStatus} className="mt-4 flex items-center gap-2">
            <input type="hidden" name="orderId" value={order.id} />
            <select 
              name="status"
              defaultValue={order.status}
              className="rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Dateer Status Op
            </button>
          </form>
      </div>

      {/* --- BLOK 3: Kliënt & Versending --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Kliënt Inligting</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4">
            <InfoField label="Naam" value={customer.name} />
            <InfoField label="E-pos" value={customer.email} />
            <InfoField label="Telefoon" value={customer.phone} />
            <InfoField label="Rekening Tipe" value={customer.type} />
          </dl>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Versendingsadres</h2>
           <dl className="mt-4 grid grid-cols-1 gap-4">
            <InfoField label="Adres 1" value={order.shipping_address_line1} />
            <InfoField label="Adres 2" value={order.shipping_address_line2} />
            <InfoField label="Stad" value={order.shipping_city} />
            <InfoField label="Provinsie" value={order.shipping_province} />
            <InfoField label="Poskode" value={order.shipping_code} />
          </dl>
        </div>
      </div>

      {/* --- BLOK 4: Lyn-items --- */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Items in Bestelling</h2>
        <div className="mt-4 flow-root">
          <ul role="list" className="-my-6 divide-y divide-zinc-200 dark:divide-zinc-700">
            {items.map((item) => (
              <li key={item.id} className="flex py-6">
                {/* Ons kan 'n prent hier byvoeg as ons 'product_id' join na 'shop_products' */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
                      <h3>
                        {item.product_name}
                      </h3>
                      <p className="ml-4">{formatCurrency(item.price_at_purchase * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {/* TODO: Wys 'selected_options' hier as dit bestaan */}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Prys: {formatCurrency(item.price_at_purchase)}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">Hoeveelheid: {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
            <p>Totaal</p>
            <p>{formatCurrency(order.total_amount)}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}