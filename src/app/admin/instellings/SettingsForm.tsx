// src/app/admin/instellings/SettingsForm.tsx
'use client';

import { useState, ChangeEvent } from 'react';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";
import SubmitButton from "@/components/ui/SubmitButton";

type SettingsFormProps = {
  appEmail: string;
  shopEmail: string;
  formAction: (formData: FormData) => void;
};

export default function SettingsForm({ appEmail, shopEmail, formAction }: SettingsFormProps) {
  const [appEmailState, setAppEmailState] = useState(appEmail);
  const [shopEmailState, setShopEmailState] = useState(shopEmail);

  // Maak die 'event' tipe breed om ooreen te stem met die komponent se props
  const handleAppEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAppEmailState(e.target.value);
  };

  const handleShopEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShopEmailState(e.target.value);
  };

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div>
        <FloatingLabelInputField
          label="Aansoek Admin E-pos"
          name="application_admin_email"
          type="email"
          value={appEmailState}
          onChange={handleAppEmailChange} // <-- Gebruik die nuwe hanteerder
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
          onChange={handleShopEmailChange} // <-- Gebruik die nuwe hanteerder
          required
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          E-posadres wat nuwe WINKEL-bestelling kennisgewings ontvang.
        </p>
      </div>

      <div className="flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-700">
        <SubmitButton
          formAction={formAction}
          defaultText="Stoor Instellings"
          loadingText="Stoor..."
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
        />
      </div>
    </form>
  );
}