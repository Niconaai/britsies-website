// src/app/admin/kultuur/EditOrganiserModal.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateCultureOrganiser } from './actions';
import type { DbCultureOrganiser, DbCultureActivity, DbStaffMember } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

type EditModalProps = {
  organiser: DbCultureOrganiser;
  activities: DbCultureActivity[];
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

export default function EditOrganiserModal({ organiser, activities, staffMembers, onClose }: EditModalProps) {
  
  const [formData, setFormData] = useState({
    activity_id: organiser.activity_id || '',
    staff_member_id: organiser.staff_member_id || '',
    role: organiser.role || '',
    is_active: organiser.is_active ?? true,
  });

  const updateAction = async (payload: FormData) => {
    await updateCultureOrganiser(payload);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const staffOptions = staffMembers.map(s => ({ value: s.id, label: s.full_name }));
  const activityOptions = activities.map(a => ({ value: a.id, label: a.name }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold dark:text-white">Wysig Organiseerder</h3>
        
        <form action={updateAction} className="relative mt-4 space-y-4">
          <LoadingOverlay />
          <input type="hidden" name="id" value={organiser.id} />

          <FloatingLabelSelectFieldCustom
            label="Kultuur-aktiwiteit"
            name="activity_id"
            value={formData.activity_id}
            onChange={handleChange}
            options={activityOptions}
            required
          />
          <FloatingLabelSelectFieldCustom
            label="Personeellid"
            name="staff_member_id"
            value={formData.staff_member_id}
            onChange={handleChange}
            options={staffOptions}
            required
          />
          <FloatingLabelInputField
            label="Rol (bv. Organiseerder)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <div className="flex items-center">
            <input
              id="is_active_organiser_edit"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active_organiser_edit" className="ml-2 block text-sm dark:text-zinc-300">Aktief?</label>
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