// src/app/winkel/bestelling/sukses/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';
import { Resend } from 'resend';
// Voer die korrekte e-pos sjablone in
import { getOrderConfirmationHtml, getShopAdminNotificationHtml } from '@/utils/emailTemplates'; 
// Ons het 'n skoner tipe nodig
import type { DbShopOrder, DbShopOrderItem, DbProfile } from "@/types/supabase";

// Tipe vir ons data *binne* hierdie bladsy
type OrderWithItems = DbShopOrder & {
  shop_order_items: DbShopOrderItem[];
};

// (CheckCircleIcon en formatCurrency bly dieselfde)
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


// --- E-POS STUUR FUNKSIE ---
async function sendOrderEmails(
  order: OrderWithItems, 
  customerName: string, 
  customerEmail: string
) {
  const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
  if (!resend) {
    console.error("E-pos-fout: Resend API-sleutel is nie opgestel nie.");
    return;
  }
  
  const orderRef = order.human_readable_id || order.id.substring(0, 8);
  const orderTotal = formatCurrency(order.total_amount);

  // --- 1. Stuur KLIËNT-epos ---
  try {
    const emailHtml = getOrderConfirmationHtml({
        customerName: customerName || 'Kliënt',
        orderRef: orderRef,
        orderTotal: orderTotal,
    });
    await resend.emails.send({
      from: 'Hoërskool Brits Winkel <info@nicolabsdigital.co.za>',
      to: [customerEmail],
      subject: `Bestelling Bevestig: #${orderRef}`,
      html: emailHtml,
    });
    console.log(`Sukses-bladsy: Kliënt-bevestiging gestuur na ${customerEmail}`);
  } catch (error) {
    console.error(`Sukses-bladsy: Kon nie KLIËNT e-pos stuur nie:`, error);
  }

  // --- 2. Stuur ADMIN-epos ---
  try {
    // Haal die admin-epos dinamies
    const supabase = await createClient(); //
    const { data: settingData, error: settingError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'shop_manager_email')
        .single();
        
    if (settingError || !settingData?.value) {
      throw new Error(`Kon nie 'shop_manager_email' van DB kry nie: ${settingError?.message}`);
    }
    
    const adminEmail = settingData.value;
    
    const adminEmailHtml = getShopAdminNotificationHtml({
      customerName: customerName || 'Gas Kliënt',
      orderRef: orderRef,
      orderTotal: orderTotal,
      orderId: order.id,
      items: order.shop_order_items.map(item => ({
        product_name: item.product_name,
        quantity: item.quantity
      }))
    });

    await resend.emails.send({
      from: 'Nuwe Britsie Winkelbestelling <info@nicolabsdigital.co.za>',
      to: [adminEmail],
      subject: `NUWE BESTELLING ONTVANG: #${orderRef} (${customerName})`,
      html: adminEmailHtml,
    });
    console.log(`Sukses-bladsy: Admin-kennisgewing gestuur na ${adminEmail}`);

  } catch (error) {
    console.error(`Sukses-bladsy: Kon nie ADMIN e-pos stuur nie:`, error);
  }
}
// --- EINDE VAN E-POS STUUR FUNKSIE ---


export default async function OrderSuccessPage({
  searchParams,
}: {
  // Die 'prop' is 'n Promise
  searchParams: Promise<{ order_id?: string }>;
}) {
  
  // --- REGSTELLING 1: 'await' die Promise hier ---
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.order_id;
  // --- EINDE VAN REGSTELLING 1 ---
  
  const supabase = await createClient();
  
  if (!orderId) {
    return notFound();
  }

  // --- REGSTELLING 2: Vereenvoudig die navraag ---
  // Haal *slegs* die bestelling en sy items.
  const { data: order, error } = await supabase
    .from('shop_orders')
    .select(`
      *,
      shop_order_items(*)
    `)
    .eq('id', orderId)
    .single<OrderWithItems>(); 

  if (error || !order) {
    // Hierdie is die fout wat jy gesien het. Dit was as gevolg van my slegte navraag.
    console.error(`Sukses-bladsy: Kon nie bestelling ${orderId} kry nie.`, error);
    return notFound();
  }
  // --- EINDE VAN REGSTELLING 2 ---


  // --- 3. VERIFIEER STATUS ---
  const isPaid = order.status === 'processing' || order.status === 'ready_for_collection' || order.status === 'completed';

  if (!isPaid) {
    // Die webhook was dalk stadig.
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Betaling word verwerk...</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Dankie vir jou bestelling! Ons wag tans vir finale bevestiging vanaf Yoco.
        </p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Jou bestellingnommer is: <strong>#{order.human_readable_id || orderId.substring(0, 8)}</strong>
        </p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Hierdie bladsy sal outomaties herlaai, of jy kan die status in jou profiel gaan nagaan.
        </p>
      </div>
    );
  }

  // --- 4. KRY KLIËNT-INLIGTING APART ---
  let customerEmail: string | null = null;
  let customerName: string | null = null;

  if (order.user_id) {
    // Ingeteken: Haal vanaf 'profiles'
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', order.user_id)
      .single<Pick<DbProfile, 'full_name' | 'email'>>();
    
    // Ons het die e-pos van die 'auth' tabel nodig
    const { data: { user } } = await supabase.auth.getUser();

    customerName = profile?.full_name || 'Britsie Kliënt';
    customerEmail = user?.email || profile?.email || null;
  } else {
    // Gas: Haal direk vanaf die bestelling
    customerName = order.guest_name;
    customerEmail = order.guest_email;
  }
  // --- EINDE VAN STAP 4 ---

  // --- 5. STUUR E-POSSE ---
  if (customerEmail) {
    sendOrderEmails(order, customerName || 'Kliënt', customerEmail);
  }

  // --- 6. WYS DIE BLADSY ---
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
          'n Bevestigings-e-pos is gestuur na <strong>{customerEmail || 'jou e-posadres'}</strong>.
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
          href="/winkel/katalogus" //
          className="mt-10 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Terug na Katalogus
        </Link>
      </div>
    </div>
  );
}