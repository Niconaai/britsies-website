// src/app/winkel/bestelling/misluk/page.tsx
import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export default async function OrderFailurePage({
  searchParams,
}: {
  searchParams: { order_id?: string };
}) {

  const orderId = searchParams.order_id;
  let humanReadableId: string | null = null;

  if (orderId) {
    const supabase = await createClient(); //
    const { data: order } = await supabase
      .from('shop_orders')
      .select('human_readable_id')
      .eq('id', orderId)
      .single();
    if (order) {
      humanReadableId = order.human_readable_id;
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 md:p-12">
      <div className="flex flex-col items-center text-center">
        <XCircleIcon />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Betaling Misluk
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Iets het verkeerd gegaan met die betaling, of die betaling is gekanselleer.
        </p>
        {humanReadableId && (
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Jou bestelling (<strong>#{humanReadableId}</strong>) is gestoor met 'n 'misluk' status.
          </p>
        )}
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Geen geld is van jou rekening verhaal nie.
        </p>

        <Link
          href="/winkel/mandjie"
          className="mt-10 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Probeer Weer van Mandjie
        </Link>
      </div>
    </div>
  );
}