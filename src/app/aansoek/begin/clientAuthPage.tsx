// src/app/aansoek/begin/clientAuthPage.tsx
'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { login, signup } from './actions';
import SubmitButton from '@/components/ui/SubmitButton';
import FloatingLabelInput from '@/components/ui/FloatingLabelInput';
import EyeIcon from '@/components/ui/EyeIcon'; 
import FloatingLabelSelectField from '@/components/ui/FloatingLabelSelectField';

// Boodskap-komponent
const AuthMessage = ({ message, type }: { message: string, type: 'success' | 'error' }) => {
  const baseClasses = "w-full p-4 rounded-md mb-6 text-center";
  const styles = {
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };
  return (
      <div className={`${baseClasses} ${styles[type]}`}>
          <p>{message}</p>
      </div>
  );
};

type AuthMessageProps = {
  message: string;
  type: 'success' | 'error';
} | null;

const provinsieOptions = [
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Noord-Kaap",
  "Noordwes",
  "Oos-Kaap",
  "Vrystaat",
  "Wes-Kaap"
];

export default function ClientAuthPage({ initialMessage }: { initialMessage: AuthMessageProps }) {

  const [message, setMessage] = useState(initialMessage);
  const [isVisible, setIsVisible] = useState(!!initialMessage);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // --- STATE VIR WAGWOORD-SIGBAARHEID ---
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [province, setProvince] = useState('');

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value);
  };

  useEffect(() => {
    setMessage(initialMessage);
    setIsVisible(!!initialMessage);

    if (initialMessage) {
        if (initialMessage.message.includes('rekening_geskep')) {
          setIsSigningUp(false);
        }
        if (initialMessage.message.includes('Wagwoorde stem nie ooreen nie')) {
          setIsSigningUp(true);
        }
        const timer = setTimeout(() => {
            setIsVisible(false); 
            window.history.replaceState(null, '', '/aansoek/begin');
        }, 8000); 
        return () => clearTimeout(timer); 
    }
  }, [initialMessage]); 

  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
              <div className="flex mb-8 justify-center">
                  <Image src="/wapen.png" alt="Hoërskool Brits Logo" width={150} height={50} priority className="h-auto" />
              </div>
              <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-zinc-300">
                {isSigningUp ? 'Skep Jou Britsie-aanlyn Rekening' : 'Britsie-aanlyn Portaal Aanteken'}
              </h1>
              <p className="mb-8 text-center text-lg font text-gray-800 dark:text-zinc-300 custom_sort_0.5_p-4">
                {isSigningUp ? 'Voltooi jou besonderhede hieronder.' : "Teken in om jou aansoeke te bestuur."}
              </p>

              {isVisible && message && (
                  <AuthMessage message={message.message} type={message.type} />
              )}

              {/* --- VORM 1: TEKEN IN --- */}
              <form action={login} className={`space-y-6 ${isSigningUp ? 'hidden' : 'block'}`}>
                  
                  <FloatingLabelInput
                    name="email"
                    id="email-login"
                    label="E-posadres"
                    type="email"
                    required
                  />
                  
                  <FloatingLabelInput
                    name="password"
                    id="password-login"
                    label="Wagwoord"
                    type={showLoginPass ? 'text' : 'password'}
                    required
                  >
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPass(!showLoginPass)} 
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <EyeIcon isVisible={showLoginPass} className="h-5 w-5" />
                    </button>
                  </FloatingLabelInput>
                  
                  <div className="text-right text-xs">
                      <button type="button" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Wagwoord Vergeet?
                      </button>
                  </div>

                  <SubmitButton
                    formAction={login}
                    defaultText="Teken In"
                    loadingText="Teken in..."
                    className="w-full rounded bg-rose-950 py-3 font-medium text-white transition hover:bg-rose-900"
                  />

                  <hr className="my-8  border-zinc-300 dark:border-zinc-600" />

                  <div className="text-center">
                      <p className="text-sm text-gray-800 dark:text-zinc-300">
                          Nog nie 'n rekening?
                      </p>
                      <button
                        type="button" 
                        onClick={() => setIsSigningUp(true)}
                        className="mt-2 w-full rounded bg-yellow-600 py-3 text-sm font-medium text-white transition hover:bg-yellow-700"
                      >
                          Skep Rekening
                      </button>
                  </div>
              </form>

              {/* --- VORM 2: SKREEP REKENING --- */}
              <form action={signup} className={`space-y-6 ${isSigningUp ? 'block' : 'hidden'}`}>
                  <FloatingLabelInput name="full_name" id="full_name" label="Volle Naam & Van" required />
                  <FloatingLabelInput name="cell_phone" id="cell_phone" label="Selfoonnommer" type="tel" required />
                  
                  <hr className="my-4 border-zinc-300 dark:border-zinc-600" />
                  <h3 className="pt-2 text-sm font-medium text-gray-700 dark:text-zinc-300">Fisiese Adres</h3>
                  <FloatingLabelInput name="shipping_address_line1" id="shipping_address_line1" label="Adres Lyn 1" required />
                  <FloatingLabelInput name="shipping_address_line2" id="shipping_address_line2" label="Adres Lyn 2 (Opsioneel)" />
                  <FloatingLabelInput name="shipping_city" id="shipping_city" label="Stad / Dorp" required />
                  {/* <FloatingLabelInput name="shipping_province" id="shipping_province" label="Provinsie" required /> */}
                  <FloatingLabelSelectField
                    label="Provinsie"
                    name="shipping_province"
                    value={province} 
                    onChange={handleProvinceChange}
                    options={provinsieOptions}
                    required
                  />
                  <FloatingLabelInput name="shipping_code" id="shipping_code" label="Poskode" required />

                  <hr className="my-4 border-zinc-300 dark:border-zinc-600" />
                  <h3 className="pt-2 text-sm font-medium text-gray-700 dark:text-zinc-300">Aanteken besonderhede</h3>

                  <FloatingLabelInput name="email" id="email-signup" label="E-posadres" type="email" required />
                  
                  <FloatingLabelInput
                    name="password"
                    id="password-signup"
                    label="Kies 'n Wagwoord"
                    type={showSignupPass ? 'text' : 'password'}
                    required
                  >
                    <button 
                      type="button" 
                      onClick={() => setShowSignupPass(!showSignupPass)} 
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <EyeIcon isVisible={showSignupPass} className="h-5 w-5" />
                    </button>
                  </FloatingLabelInput>
                  
                  <FloatingLabelInput
                    name="password-confirm"
                    id="password-confirm"
                    label="Bevestig Wagwoord"
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                  >
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)} 
                      className="text-gray-500 dark:text-gray-400"
                    >
                      <EyeIcon isVisible={showConfirmPass} className="h-5 w-5" />
                    </button>
                  </FloatingLabelInput>

                  <hr className="my-8  border-zinc-300 dark:border-zinc-600" />

                  <SubmitButton
                    formAction={signup}
                    defaultText="Skep Rekening"
                    loadingText="Skep rekening..."
                    className="w-full rounded bg-yellow-600 py-3 font-medium text-white transition hover:bg-yellow-700"
                  />

                  <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsSigningUp(false)}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        &larr; Het jy reeds 'n rekening? Teken In
                      </button>
                  </div>
              </form>

              <p className="mb-0 mt-8 text-center text-xs font text-gray-800  dark:text-zinc-300">
                  Nick van der Merwe
              </p>
              <p className="mb-0 text-center text-xs font text-gray-800  dark:text-zinc-300">
                  Nicolabs Digital © 2025
              </p>
          </div>
      </div>
  );
}