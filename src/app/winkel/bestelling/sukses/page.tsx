// src/app/winkel/bestelling/sukses/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image'; // <-- Belangrik
// VERWYDER: Resend en e-pos sjabloon imports
import type { DbShopOrder, DbShopOrderItem, DbProfile } from "@/types/supabase";
import PaymentVerifier from './PaymentVerifier'; // <-- VOER ONS NUWE KOMPONENT IN

// Tipe vir ons data *binne* hierdie bladsy
type OrderWithItems = DbShopOrder & {
  shop_order_items: DbShopOrderItem[];
};

// --- Hulpfunksies ---
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};
// --- Einde van hulpfunksies ---


// --- E-POS STUUR FUNKSIE IS HEELTEMAL VERWYDER ---


export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.order_id;
  const supabase = await createClient();
  
  if (!orderId) {
    return notFound();
  }

  // Haal die bestelling en sy items.
  const { data: order, error } = await supabase
    .from('shop_orders')
    .select(`
      *,
      shop_order_items(*)
    `)
    .eq('id', orderId)
    .single<OrderWithItems>(); 

  if (error || !order) {
    console.error(`Sukses-bladsy: Kon nie bestelling ${orderId} kry nie.`, error);
    return notFound();
  }

  // --- VERIFIEER STATUS ---
  const isPaid = order.status === 'processing' || order.status === 'ready_for_collection' || order.status === 'completed';

  if (!isPaid) {
    // --- ROEP ONS NUWE KLIËNT-KOMPONENT ---
    // Dit sal die 'fetch' hanteer en homself opdateer.
    // Die 'order' prop bevat die 'yoco_charge_id' wat dit nodig het.
    // Dit wys sy eie laai-boodskap.
    return <PaymentVerifier order={order} />;
  }

  // --- As ons hier kom, IS die status "processing" ---
  
  // Kry kliënt-inligting (bly dieselfde)
  let customerEmail: string | null = null;
  let customerName: string | null = null;

  if (order.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', order.user_id)
      .single<Pick<DbProfile, 'full_name' | 'email'>>();
    
    const { data: { user } } = await supabase.auth.getUser();

    customerName = profile?.full_name || 'Britsie Kliënt';
    customerEmail = user?.email || profile?.email || null;
  } else {
    customerName = order.guest_name;
    customerEmail = order.guest_email;
  }
  
  // --- WYS DIE SUKSES-BLADSY ---
  return (
    <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 md:p-12">
      <div className="flex flex-col items-center text-center">
        <CheckCircleIcon />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Bestelling Suksesvol!
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Dankie vir jou aankoop, {customerName}! Jou bestelling (<strong>#{order.human_readable_id}</strong>) is ontvang en word tans verwerk.
        </p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          'n Bevestigings-e-pos is oppad na <strong>{customerEmail || 'jou e-posadres'}</strong>.
        </p>

        {/* Opsomming van bestelling */}
        <div className="w-full max-w-lg text-left mt-8 border-t border-zinc-200 dark:border-zinc-700 pt-8">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Opsomming</h2>
          <ul role="list" className="my-4 divide-y divide-zinc-200 dark:divide-zinc-700">
            {order.shop_order_items.map((item) => (
              <li key={item.id} className="flex py-4">
                <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {item.product_name} <span className="text-zinc-500">x {item.quantity}</span>
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {formatCurrency(item.price_at_purchase * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-4">
            <dt className="text-base font-medium text-zinc-900 dark:text-white">Totaal Betaal</dt>
            <dd className="text-base font-medium text-zinc-900 dark:text-white">{formatCurrency(order.total_amount)}</dd>
          </div>
        </div>

        <Link
          href="/winkel/katalogus"
          className="mt-10 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Terug na Katalogus
        </Link>
      </div>
    </div>
  );
}