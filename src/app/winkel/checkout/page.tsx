// src/app/winkel/checkout/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react'; // <-- Voeg 'ChangeEvent' by
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProfile, createOrderAndInitiatePayment } from './actions';
import type { DbProfile } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectField from '@/components/ui/FloatingLabelSelectField';
import SubmitButton from '@/components/ui/SubmitButton';

// (formatCurrency bly dieselfde)
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
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<DbProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useOtherAddress, setUseOtherAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    ...emptyAddress,
  });

  // useEffect (bly dieselfde)
  useEffect(() => {
    async function fetchProfile() {
      if (cartItems.length === 0) {
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
  }, [cartItems.length, router]);

  // --- REGSTELLING 3 (Fout 3): Maak 'handleChange' tipe breër ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // --- EINDE VAN REGSTELLING 3 ---

  // handleAddressToggle (bly dieselfde)
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


  const handleFormSubmit = async (formData: FormData) => {
    setErrorMessage(null);
    
    formData.append('cartItems', JSON.stringify(cartItems));
    formData.append('cartTotal', String(cartTotal));
    if (userProfile) {
      formData.append('user_id', userProfile.id);
    }

    const result = await createOrderAndInitiatePayment(formData);

    if (result.success === true) {
      clearCart(); 
      window.location.href = result.url; 
    } else {
      setErrorMessage(result.error);
    }

  };
  
  if (isLoading) {
     return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Image src="/CircleLoader.gif" alt="Laai..." width={60} height={60} unoptimized />
        <p className="mt-4 text-zinc-700 dark:text-zinc-300">Besig om checkout te laai...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      
      {/* --- Linker-kolom: Vorms --- */}
      <div className="lg:col-span-2">
        <Link
          href="/winkel/mandjie"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
        >
          &larr; Terug na mandjie
        </Link>
        <form action={handleFormSubmit} className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
            {/* ... (Banier-logika bly dieselfde) ... */}
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

            {/* --- Persoonlike Besonderhede --- */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FloatingLabelInputField
                label="Volle Naam" name="guest_name" required
                value={formData.guest_name}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile}
              />
              <FloatingLabelInputField
                label="E-pos" name="guest_email" type="email" required
                value={formData.guest_email}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile}
              />
              <FloatingLabelInputField
                label="Selfoonnommer" name="guest_phone" type="tel" required
                value={formData.guest_phone}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile}
              />
            </div>
          </div>

          {/* --- Adres Besonderhede --- */}
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
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile && !useOtherAddress}
                className="sm:col-span-2"
              />
              <FloatingLabelInputField
                label="Adres Lyn 2 (Opsioneel)" name="shipping_address_line2"
                value={formData.shipping_address_line2}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile && !useOtherAddress}
                className="sm:col-span-2"
              />
              <FloatingLabelInputField
                label="Stad / Dorp" name="shipping_city" required
                value={formData.shipping_city}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile && !useOtherAddress}
              />
              <FloatingLabelSelectField
                label="Provinsie" name="shipping_province" required
                value={formData.shipping_province}
                onChange={handleChange} 
                options={["Gauteng", "Noordwes", "Limpopo", "Mpumalanga", "Vrystaat", "KwaZulu-Natal", "Oos-Kaap", "Wes-Kaap", "Noord-Kaap"]}
                disabled={(!!userProfile && !useOtherAddress)}
              />
              <FloatingLabelInputField
                label="Poskode" name="shipping_code" required
                value={formData.shipping_code}
                onChange={handleChange} // <-- Hierdie sal nou werk (Fout 3)
                disabled={!!userProfile && !useOtherAddress}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-100 p-4 text-center text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          
          {/* Verborge velde bly dieselfde */}
          <input type="hidden" name="user_id" value={userProfile?.id || ''} />
          <input type="hidden" name="shipping_address_line1" value={formData.shipping_address_line1} />
          <input type="hidden" name="shipping_address_line2" value={formData.shipping_address_line2} />
          <input type="hidden" name="shipping_city" value={formData.shipping_city} />
          <input type="hidden" name="shipping_province" value={formData.shipping_province} />
          <input type="hidden" name="shipping_code" value={formData.shipping_code} />
          
        </form>
      </div>

      {/* --- Regter-kolom: Opsomming --- */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Opsomming van Bestelling</h2>
          
          {/* Item lys bly dieselfde */}
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
          
          {/* Totaal bly dieselfde */}
          <dl className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-700">
            <div className="flex items-center justify-between text-base font-medium text-zinc-900 dark:text-white">
              <dt>Totaal</dt>
              <dd>{formatCurrency(cartTotal)}</dd>
            </div>
          </dl>

          {/* Submit Knoppie bly dieselfde */}
          <div className="mt-6">
            <SubmitButton
              formAction={handleFormSubmit}
              defaultText="Betaal Nou met Yoco"
              loadingText="Skep bestelling..."
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
            />
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Jy sal na Yoco se veilige betaalblad geneem word.
          </p>
        </div>
      </div>
    </div>
  );
}