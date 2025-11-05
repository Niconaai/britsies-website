// src/app/winkel/bestelling/sukses/PaymentVerifier.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { DbShopOrder } from '@/types/supabase';

// Hierdie komponent word slegs gewys as die status 'pending_payment' is
export default function PaymentVerifier({ order }: { order: DbShopOrder }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hanteer 'strict mode' (wat veroorsaak dat useEffect twee keer loop in dev)
    let isRequestSent = false;

    const verifyPayment = async () => {
      if (isRequestSent || !order.yoco_charge_id) return;
      isRequestSent = true;
      setIsVerifying(true);
      setError(null);

      console.log(`PaymentVerifier: Begin verifikasie vir Yoco checkoutId: ${order.yoco_charge_id}`);

      try {
        const response = await fetch('/api/yoco/verify-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkoutId: order.yoco_charge_id // Stuur die Yoco ID
          }),
        });

        const result = await response.json();

        if (result.success && (result.status === 'paid' || result.status === 'paid_db_error')) {
          // Sukses! Die DB is opgedateer (of was reeds). Herlaai die bladsy.
          console.log(`PaymentVerifier: Verifikasie suksesvol. Herlaai bladsy.`);
          router.refresh();
        } else {
          // Yoco sê dit is nog nie betaal nie, of 'n fout het gebeur
          console.error("PaymentVerifier Fout:", result.error || result.status);
          setError(result.error || 'Kon nie betaling bevestig nie. Probeer asb. die bladsy herlaai of kontak ons.');
          setIsVerifying(false);
        }
      } catch (err) {
        console.error("PaymentVerifier Fetch Fout:", err);
        setError(err instanceof Error ? err.message : 'Kon nie met bediener koppel nie.');
        setIsVerifying(false);
      }
    };

    // Begin die verifikasie-proses sodra die komponent laai
    // Ons gee dit 'n 2-sekonde vertraging om die webhook 'n kans te gee
    const timer = setTimeout(() => {
        verifyPayment();
    }, 2000); // 2 sekonde vertraging

    return () => clearTimeout(timer);

  }, [order.yoco_charge_id, order.id, router]);

  const getMessage = () => {
    if (error) {
      return (
        <>
          <h1 className="mt-6 text-2xl font-bold text-red-700 dark:text-red-400">
            Verifikasie Fout
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
        </>
      );
    }
    return (
      <>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
          Besig om betaling te bevestig...
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          'n E-pos sal gestuur word sodra dit bevestig is.
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      {isVerifying && (
        <Image src="/CircleLoader.gif" alt="Laai..." width={60} height={60} unoptimized />
      )}
      {getMessage()}
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Jou bestellingnommer is: <strong>#{order.human_readable_id || order.id.substring(0, 8)}</strong>
      </p>
    </div>
  );
}