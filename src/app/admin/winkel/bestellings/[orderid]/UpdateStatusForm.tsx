// src/app/admin/winkel/bestellings/[orderid]/UpdateStatusForm.tsx
'use client';

import { useState } from 'react';
// --- 1. VOEG useFormStatus EN Image BY ---
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateOrderStatus } from './action';
import type { DbShopOrderWithItems } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectField from '@/components/ui/FloatingLabelSelectField';

type UpdateStatusFormProps = {
  order: DbShopOrderWithItems;
  statusOptions: string[];
};

// --- 2. SKEP 'N SUB-KOMPONENT VIR DIE KNOPPIE-TEKS ---
function StatusButtonContent() {
  const { pending } = useFormStatus();
  
  return (
    <>
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
        "Dateer Status Op"
      )}
    </>
  );
}

// --- 3. SKEP DIE VOLSKERM-OORLEG KOMPONENT ---
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
          Besig om status op te dateer...
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">E-pos word ook gestuur. Moet asb. nie herlaai nie.</p>
      </div>
    </div>
  );
}


export default function UpdateStatusForm({ order, statusOptions }: UpdateStatusFormProps) {
  const isPermanentlyCompleted = order.status === 'completed';
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  
  const [collectorName, setCollectorName] = useState(
    order.status === 'completed' ? (order.shipping_address_line2 || '').replace('Afgehaal deur: ', '') : ''
  );
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    if (e.target.value !== 'completed') {
      setCollectorName('');
    }
  };

  const handleCollectorNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCollectorName(e.target.value);
  };
  
  const isFormValid = () => {
    if (selectedStatus === 'completed') {
      if (isPermanentlyCompleted) return false;
      return collectorName.trim() !== '';
    }
    return true; 
  };

  return (
    <form action={updateOrderStatus} className="mt-4 space-y-4">
      {/* --- 4. PLAAS DIE OORLEG BINNE-IN DIE VORM --- */}
      <LoadingOverlay />

      <input type="hidden" name="orderId" value={order.id} />
      
      {isPermanentlyCompleted && (
        <div className="rounded-md border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/30">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Hierdie bestelling is reeds as voltooi gemerk en kan nie meer gewysig word nie.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-end gap-4">
        
        <FloatingLabelSelectField
          label="Bestelling Status"
          name="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          options={statusOptions}
          disabled={isPermanentlyCompleted} 
          className="flex-1 w-full"
        />
        
        {/* --- 5. VERVANG DIE OU KNOPPIE MET 'N GEWONE BUTTON --- */}
        <button
          type="submit"
          disabled={!isFormValid() || isPermanentlyCompleted}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[150px] min-h-[42px]" // Maak knoppie bietjie hoër
        >
          <StatusButtonContent />
        </button>
      </div>

      {selectedStatus === 'completed' && (
        <div className="rounded-md border border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/30">
          <FloatingLabelInputField
            label="Naam van Persoon wat Afhaal"
            name="collector_name" 
            value={collectorName}
            onChange={handleCollectorNameChange}
            required={true}
            disabled={isPermanentlyCompleted}
          />
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
            Hierdie naam sal op die "Bestelling Voltooi" e-pos verskyn as bewys van afhaal.
          </p>
        </div>
      )}
      
    </form>
  );
}