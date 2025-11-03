// src/app/winkel/checkout/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation'; 
import { useState, useEffect, ChangeEvent } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfile } from './actions'; // Ons gebruik steeds hierdie aksie!
import type { DbProfile } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectField from '@/components/ui/FloatingLabelSelectField';
// SubmitButton is nie meer nodig nie

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('af-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

const emptyAddress = {
  shipping_address_line1: '',
  shipping_address_line2: '',
  shipping_city: '',
  shipping_province: '',
  shipping_code: '',
};

export default function CheckoutPage() {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart(); // Ons sal 'clearCart' hier gebruik

  const urlError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError ? decodeURIComponent(urlError) : null);
  
  const [userProfile, setUserProfile] = useState<DbProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Vir die laai-knoppie
  const [useOtherAddress, setUseOtherAddress] = useState(false);

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    ...emptyAddress,
  });

  useEffect(() => {
    async function fetchProfile() {
      if (cartItems.length === 0 && !urlError) {
        router.push('/winkel/mandjie'); 
        return;
      }
      setIsLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile(profile);
        setFormData({
          guest_name: profile.full_name || '',
          guest_email: profile.email || '',
          guest_phone: profile.cell_phone || '',
          shipping_address_line1: profile.shipping_address_line1 || '',
          shipping_address_line2: profile.shipping_address_line2 || '',
          shipping_city: profile.shipping_city || '',
          shipping_province: profile.shipping_province || '',
          shipping_code: profile.shipping_code || '',
        });
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [cartItems.length, router, urlError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUseOtherAddress(isChecked);
    if (isChecked) {
      setFormData(prev => ({ ...prev, ...emptyAddress }));
    } else if (userProfile) {
      setFormData(prev => ({
        ...prev,
        shipping_address_line1: userProfile.shipping_address_line1 || '',
        shipping_address_line2: userProfile.shipping_address_line2 || '',
        shipping_city: userProfile.shipping_city || '',
        shipping_province: userProfile.shipping_province || '',
        shipping_code: userProfile.shipping_code || '',
      }));
    }
  };
  
  // --- HIER IS DIE NUWE 'onClick' HANTEERDER ---
  const handlePay = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Bou die 'payload' om na ons API-roete te stuur
    const payload = {
      cartItems: cartItems,
      cartTotal: cartTotal,
      userId: userProfile ? userProfile.id : null,
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      guest_phone: formData.guest_phone,
      shipping_address_line1: formData.shipping_address_line1,
      shipping_address_line2: formData.shipping_address_line2,
      shipping_city: formData.shipping_city,
      shipping_province: formData.shipping_province,
      shipping_code: formData.shipping_code,
    };

    try {
      // Roep ons nuwe API roete
      const response = await fetch('/api/yoco/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Kon nie betaling skep nie');
      }

      if (result.redirectUrl) {
        clearCart(); // Maak mandjie skoon
        window.location.href = result.redirectUrl; // Stuur na Yoco
      } else {
        throw new Error("Geen 'redirectUrl' van bediener ontvang nie.");
      }

    } catch (err: any) {
      console.error("Checkout Fout:", err);
      setErrorMessage(err.message);
      setIsSubmitting(false); // Stop laai-animasie sodat gebruiker weer kan probeer
    }
  };
  
  if (isLoading) {
    // ... (laai-skerm)
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Image src="/CircleLoader.gif" alt="Laai..." width={60} height={60} unoptimized />
        <p className="mt-4 text-zinc-700 dark:text-zinc-300">Besig om checkout te laai...</p>
      </div>
    );
  }

  if (cartItems.length === 0 && errorMessage) {
     // ... (fout-skerm)
     return (
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800 text-center">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Bestelling Fout</h2>
            <p className="mt-4 text-zinc-700 dark:text-zinc-300">{errorMessage}</p>
            <Link
              href="/winkel/mandjie"
              className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Terug na Mandjie
            </Link>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      
      {/* --- Linker-kolom: Vorms (GEEN <form> etiket) --- */}
      <div className="lg:col-span-2 space-y-6">
        <Link
          href="/winkel/mandjie"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Terug na mandjie
        </Link>
        
        {/* Persoonlike Besonderhede */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
           {userProfile ? (
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Welkom, {userProfile.full_name}
            </h2>
          ) : (
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Checkout as Gas
            </h2>
          )}
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {userProfile 
              ? "Jou besonderhede is hieronder ingevul. Bevestig asb." 
              : "Vul asb. jou besonderhede in vir die bestelling."}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingLabelInputField
              label="Volle Naam" name="guest_name" required
              value={formData.guest_name}
              onChange={handleChange}
              disabled={!!userProfile}
            />
            <FloatingLabelInputField
              label="E-pos" name="guest_email" type="email" required
              value={formData.guest_email}
              onChange={handleChange}
              disabled={!!userProfile}
            />
            <FloatingLabelInputField
              label="Selfoonnommer" name="guest_phone" type="tel" required
              value={formData.guest_phone}
              onChange={handleChange}
              disabled={!!userProfile}
            />
          </div>
        </div>

        {/* Adres Besonderhede */}
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Besonderhede vir Afhaal/Invordering
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Alle bestellings is slegs vir afhaal by die skool. Vul asb. 'n adres in vir ons rekords.
          </p>
          {userProfile && (
            <div className="my-4 flex items-center">
              <input
                id="useOtherAddress"
                type="checkbox"
                checked={useOtherAddress}
                onChange={handleAddressToggle}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="useOtherAddress" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
                Gebruik 'n ander adres as my profiel-adres
              </label>
            </div>
          )}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FloatingLabelInputField
              label="Adres Lyn 1" name="shipping_address_line1" required
              value={formData.shipping_address_line1}
              onChange={handleChange}
              disabled={!!userProfile && !useOtherAddress}
              className="sm:col-span-2"
            />
            <FloatingLabelInputField
              label="Adres Lyn 2 (Opsioneel)" name="shipping_address_line2"
              value={formData.shipping_address_line2}
              onChange={handleChange}
              disabled={!!userProfile && !useOtherAddress}
              className="sm:col-span-2"
            />
            <FloatingLabelInputField
              label="Stad / Dorp" name="shipping_city" required
              value={formData.shipping_city}
              onChange={handleChange}
              disabled={!!userProfile && !useOtherAddress}
            />
            <FloatingLabelSelectField
              label="Provinsie" name="shipping_province" required
              value={formData.shipping_province}
              onChange={handleChange}
              options={["Gauteng", "Noordwes", "Limpopo", "Mpumalanga", "Vrystaat", "KwaZulu-Natal", "Oos-Kaap", "Wes-Kaap", "Noord-Kaap"]}
              disabled={!!userProfile && !useOtherAddress}
            />
            <FloatingLabelInputField
              label="Poskode" name="shipping_code" required
              value={formData.shipping_code}
              onChange={handleChange}
              disabled={!!userProfile && !useOtherAddress}
            />
          </div>
        </div>

        {/* Foutboodskap-vertoning */}
        {errorMessage && (
          <div className="rounded-md bg-red-100 p-4 text-center text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </div>
      {/* --- EINDE VAN VORM-AREA --- */}


      {/* --- Regter-kolom: Opsomming --- */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Opsomming van Bestelling</h2>
          
          <ul role="list" className="my-6 divide-y divide-zinc-200 dark:divide-zinc-700">
            {cartItems.map((item) => (
              <li key={item.product.id} className="flex py-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={item.product.image_url || '/wapen-copy.png'}
                    alt={item.product.name}
                    width={64} height={64}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-center">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{item.product.name}</h3>
                  <p className="text-xs text-zinc-500">Hvl: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <div className="flex items-center justify-between text-base font-medium text-zinc-900 dark:text-white">
              <dt>Totaal</dt>
              <dd>{formatCurrency(cartTotal)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            {/* --- GEWONE KNOPPIE WAT 'handlePay' ROEP --- */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isSubmitting || isLoading || cartItems.length === 0}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Image
                    src="/CircleLoader.gif"
                    alt="Besig..."
                    width={20}
                    height={20}
                    unoptimized={true}
                    className="mr-2"
                  />
                  Skep bestelling...
                </>
              ) : (
                "Betaal Nou met Yoco"
              )}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Jy sal na Yoco se veilige betaalblad geneem word.
          </p>
        </div>
      </div>
    </div>
  );
}