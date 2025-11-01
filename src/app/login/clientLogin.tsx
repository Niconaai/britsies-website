// app/admin/login/clientLogin.tsx
'use client'
import { login } from './actions'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SubmitButton from '../../components/ui/SubmitButton';
import FloatingLabelInput from "@/components/ui/FloatingLabelInput";

const AuthMessage = ({ message }: { message: string }) => {
  return (
    <div className="w-full p-4 rounded-md mb-6 text-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
      <p className="text-sm">{message}</p>
    </div>
  );
};

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

          <SubmitButton
            defaultText="Teken In"
            loadingText="Teken in..."
            className="mb-10 w-full rounded bg-gray-500 py-2 font-medium text-white transition hover:bg-gray-700"
          />

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