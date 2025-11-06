// app/admin/login/clientLogin.tsx
'use client'
import { login } from './actions'
import Image from 'next/image';
// 1. VOEG useFormStatus BY en VERWYDER SubmitButton
import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
// import SubmitButton from '../../components/ui/SubmitButton'; // VERWYDER
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";

const AuthMessage = ({ message }: { message: string }) => {
  return (
    <div className="w-full p-4 rounded-md mb-6 text-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      <p className="text-sm">{message}</p>
    </div>
  );
};

// 2. SKEP DIE VOLSKERM-OORLEG KOMPONENT
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-800">
        <Image
          src="/CircleLoader.gif"
          alt="Besig..."
          width={80}
          height={80}
          unoptimized={true}
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Teken in...
        </p>
      </div>
    </div>
  );
}

// 3. SKEP 'N NUWE KNOPPIE-KOMPONENT
function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="mb-10 w-full rounded bg-gray-500 py-2 font-medium text-white transition hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center min-h-[38px]"
    >
      {pending ? (
        <>
          <Image
            src="/CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
            className="mr-2"
          />
          Teken in...
        </>
      ) : (
        'Teken In'
      )}
    </button>
  );
}


export default function ClientPage({ errorMessage }: { errorMessage: string | null }) {

  const [isVisible, setIsVisible] = useState(!!errorMessage);
  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        window.history.replaceState(null, '', '/login');
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-neutral-700">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
        <div className="flex mb-8 justify-center">
          <Image
            src="/wapen.png"
            alt="Hoërskool Brits Logo"
            width={150}
            height={50}
            priority
            className="h-auto"
          />
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800  dark:text-zinc-300">
          Admin Aanteken
        </h1>
        <p className="mb-8 text-center text-lg font text-gray-800 dark:text-zinc-300">
          Webblad bestuur
        </p>

        {isVisible && errorMessage && <AuthMessage message={errorMessage} />}

        <form action={login} className="space-y-4">
          {/* 4. VOEG OORLEG BY BINNE VORM */}
          <LoadingOverlay />

          <FloatingLabelInput
            id="email"
            name="email"
            label="E-pos"
            type="email"
            required
          />
          <FloatingLabelInput
            id="password"
            name="password"
            label="Wagwoord"
            type="password"
            required
          />

          {/* 5. VERVANG OU KNOPPIE MET NUWE KNOPPIE */}
          <LoginButton />

          <p className="mb-0 text-center text-xs font text-gray-800  dark:text-zinc-300">
            Nick van der Merwe
          </p>
          <p className="mb-0 text-center text-xs font text-gray-800  dark:text-zinc-300">
            Nicolabs Digital © 2025
          </p>
        </form>
      </div>
    </div>
  )
}