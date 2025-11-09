// src/app/admin/sport/EditCoachModal.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateSportCoach } from './actions';
import type { DbSportCoach, DbSportType, DbStaffMember } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

type EditModalProps = {
  coach: DbSportCoach;
  sportTypes: DbSportType[];
  staffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
  onClose: () => void;
};

// Sub-komponente vir laai-status
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-zinc-800/70">
      <Image src="/CircleLoader.gif" alt="Besig..." width={60} height={60} unoptimized={true} />
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
    >
      {pending ? 'Stoor tans...' : 'Stoor Veranderinge'}
    </button>
  );
}
// Einde van sub-komponente

export default function EditCoachModal({ coach, sportTypes, staffMembers, onClose }: EditModalProps) {
  
  const [formData, setFormData] = useState({
    sport_type_id: coach.sport_type_id || '',
    staff_member_id: coach.staff_member_id || '',
    external_coach_name: coach.external_coach_name || '',
    role: coach.role || '',
    is_active: coach.is_active ?? true,
  });

  const updateAction = async (payload: FormData) => {
    await updateSportCoach(payload);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const staffOptions = [{ value: "", label: "N.v.t. (Buite-afrigter)" }, ...staffMembers.map(s => ({ value: s.id, label: s.full_name }))];
  const sportTypeOptions = sportTypes.map(s => ({ value: s.id, label: s.name }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold dark:text-white">Wysig Afrigter</h3>
        
        <form action={updateAction} className="relative mt-4 space-y-4">
          <LoadingOverlay />
          <input type="hidden" name="id" value={coach.id} />

          <FloatingLabelSelectFieldCustom
            label="Sportsoort"
            name="sport_type_id"
            value={formData.sport_type_id}
            onChange={handleChange}
            options={sportTypeOptions}
            required
          />
          <FloatingLabelInputField
            label="Rol (bv. Hoofafrigter)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <FloatingLabelSelectFieldCustom
            label="Personeellid (Indien onderwyser)"
            name="staff_member_id"
            value={formData.staff_member_id}
            onChange={handleChange}
            options={staffOptions}
          />
          <FloatingLabelInputField
            label="Of, naam van buite-afrigter"
            name="external_coach_name"
            value={formData.external_coach_name}
            onChange={handleChange}
          />
          <div className="flex items-center">
            <input
              id="is_active_coach_edit"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active_coach_edit" className="ml-2 block text-sm dark:text-zinc-300">Aktief?</label>
          </div>
          
          <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              Kanselleer
            </button>
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
}