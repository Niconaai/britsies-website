// src/app/admin/instellings/SettingsForm.tsx
'use client';

import { useState, ChangeEvent } from 'react';
// --- 1. VOEG useFormStatus EN Image BY ---
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";
// import SubmitButton from "@/components/ui/SubmitButton"; // <-- NIE MEER NODIG NIE

type SettingsFormProps = {
  appEmail: string;
  shopEmail: string;
  formAction: (formData: FormData) => void;
};

// --- 2. SKEP DIE VOLSKERM-OORLEG KOMPONENT ---
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-800">
        <Image
          src="/CircleLoader.gif"
          alt="Besig om te laai..."
          width={80}
          height={80}
          unoptimized={true}
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Besig om instellings te stoor...
        </p>
      </div>
    </div>
  );
}

// --- 3. SKEP 'N SUB-KOMPONENT VIR DIE KNOPPIE ---
function FormSubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50 flex items-center justify-center min-w-[150px] min-h-[38px]"
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
          Stoor...
        </>
      ) : (
        'Stoor Instellings'
      )}
    </button>
  );
}
// --- EINDE VAN NUWE KOMPONENTE ---


export default function SettingsForm({ appEmail, shopEmail, formAction }: SettingsFormProps) {
  const [appEmailState, setAppEmailState] = useState(appEmail);
  const [shopEmailState, setShopEmailState] = useState(shopEmail);

  const handleAppEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAppEmailState(e.target.value);
  };

  const handleShopEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShopEmailState(e.target.value);
  };

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {/* --- 4. VOEG DIE OORLEG BY --- */}
      <LoadingOverlay />

      <div>
        <FloatingLabelInputField
          label="Aansoek Admin E-pos"
          name="application_admin_email"
          type="email"
          value={appEmailState}
          onChange={handleAppEmailChange}
          required
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          E-posadres wat nuwe AANSOEK-kennisgewings ontvang.
        </p>
      </div>

      <div>
        <FloatingLabelInputField
          label="Winkelbestuurder E-pos"
          name="shop_manager_email"
          type="email"
          value={shopEmailState}
          onChange={handleShopEmailChange}
          required
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          E-posadres wat nuwe WINKEL-bestelling kennisgewings ontvang.
        </p>
      </div>

      <div className="flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-700">
        {/* --- 5. VERVANG DIE SubmitButton MET ONS NUWE KNOPPIE --- */}
        <FormSubmitButton />
      </div>
    </form>
  );
}