// src/app/admin/winkel/bestellings/[orderid]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';
import type { DbShopOrderWithItems } from "@/types/supabase";
import UpdateStatusForm from "./UpdateStatusForm"; 
// REGSTELLING: Voer die admin-kliënt in
import { createClient as createAdminClient } from '@supabase/supabase-js';

type OrderDetailPageProps = {
  params: Promise<{ orderid: string }>
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

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

  // --- REGSTELLING: Skep 'n admin-kliënt om die auth-tabel te kan lees ---
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  // --- Einde van Auth-tjek ---

  // --- 2. Gaan Haal Rou Data ---
  // (Hierdie navraag is nou korrek, dit haal nie 'email' uit 'profiles' nie)
  const { data: rawData, error: fetchError } = await supabase
    .from('shop_orders')
    .select(`
      *,
      shop_order_items(*),
      profiles ( full_name, cell_phone )
    `)
    .eq('id', orderid)
    .single(); 

  if (fetchError || !rawData) {
    console.error(`Error fetching order ${orderid}:`, fetchError);
    return notFound(); 
  }

  const order = rawData as DbShopOrderWithItems;
  const items = order.shop_order_items || [];

  // --- REGSTELLING: Logika om kliënt-inligting te kry ---
  let customerEmail: string | null = null;
  let customerPhone: string | null = null;
  let customerName: string | null = null;
  
  if (order.user_id) {
    // Ingetekende gebruiker
    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
    customerName = profile?.full_name || 'Britsie Kliënt';
    customerPhone = profile?.cell_phone || null;
    
    // Gaan haal e-pos apart deur die admin-kliënt te gebruik
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (userData && userData.user) {
        customerEmail = userData.user.email || null;
    }
  } else {
    // Gas
    customerName = order.guest_name;
    customerEmail = order.guest_email;
    customerPhone = order.guest_phone;
  }

  const customer = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      type: order.user_id ? 'Geregistreer' : 'Gas'
  };
  // --- EINDE VAN REGSTELLING ---
  
  const statusOptions = [
    'pending_payment',
    'processing',
    'ready_for_collection',
    'completed',
    'cancelled'
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
    
      {/* ... (Blok 1: Opskrif) ... */}
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

      {/* ... (Blok 2: Status Bestuur) ... */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Bestuur Status</h2>
        <UpdateStatusForm order={order} statusOptions={statusOptions} />
      </div>

      {/* ... (Blok 3: Kliënt & Versending) ... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Kliënt Inligting</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4">
            <InfoField label="Naam" value={customer.name} />
            {/* HIERDIE SAL NOU KORREK WYS: */}
            <InfoField label="E-pos" value={customer.email} /> 
            <InfoField label="Telefoon" value={customer.phone} />
            <InfoField label="Rekening Tipe" value={customer.type} />
          </dl>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Adres vir Rekords</h2>
           <dl className="mt-4 grid grid-cols-1 gap-4">
            <InfoField label="Adres 1" value={order.shipping_address_line1} />
            <InfoField label="Stad" value={order.shipping_city} />
            <InfoField label="Provinsie" value={order.shipping_province} />
            <InfoField label="Poskode" value={order.shipping_code} />
          </dl>
        </div>
      </div>

      {/* ... (Blok 4: Lyn-items) ... */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Items in Bestelling</h2>
        <div className="mt-4 flow-root">
          <ul role="list" className="-my-6 divide-y divide-zinc-200 dark:divide-zinc-700">
            {items.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-white">
                      <h3>{item.product_name}</h3>
                      <p className="ml-4">{formatCurrency(item.price_at_purchase * item.quantity)}</p>
                    </div>
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
           <div className="flex justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <p>Notas (Afgehaal deur):</p>
            <p className="italic">{order.shipping_address_line2 || 'N/A'}</p>
          </div>
          <div className="mt-2 flex justify-between text-base font-medium text-zinc-900 dark:text-white">
            <p>Totaal</p>
            <p>{formatCurrency(order.total_amount)}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}