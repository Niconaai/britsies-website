// src/app/admin/winkel/bestellings/[orderid]/UpdateStatusForm.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateOrderStatus } from './action';
import type { DbShopOrderWithItems } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
// REGSTELLING: Voer die korrekte dropdown-komponent in
import FloatingLabelSelectField from '@/components/ui/FloatingLabelSelectField';

// Tipe wat hierdie komponent verwag
type UpdateStatusFormProps = {
  order: DbShopOrderWithItems;
  statusOptions: string[];
};

/**
 * 'n Interne knoppie-komponent wat 'useFormStatus' gebruik
 */
function FormSubmitButton({ isDisabled }: { isDisabled: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={isDisabled || pending} // Disable as die vorm ongeldig IS of hangende IS
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
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
        "Dateer Status Op"
      )}
    </button>
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
  
  // REGSTELLING: Ons het nie meer formattering nodig nie

  return (
    <form action={updateOrderStatus} className="mt-4 space-y-4">
      <input type="hidden" name="orderId" value={order.id} />
      
      {isPermanentlyCompleted && (
        <div className="rounded-md border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/30">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Hierdie bestelling is reeds as voltooi gemerk en kan nie meer gewysig word nie.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-end gap-4">
        
        {/* REGSTELLING: Gebruik die 'FloatingLabelSelectField' */}
        <FloatingLabelSelectField
          label="Bestelling Status"
          name="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          options={statusOptions} // <-- Gebruik die string[] direk
          disabled={isPermanentlyCompleted} 
          className="flex-1 w-full"
        />
        
        <FormSubmitButton isDisabled={!isFormValid() || isPermanentlyCompleted} />
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