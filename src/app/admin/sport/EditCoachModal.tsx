// src/app/admin/sport/EditCoachModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateSportCoachMultiple } from './actions';
import type { DbSportCoach, DbSportType, DbStaffMember } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

type EditModalProps = {
  coach: DbSportCoach;
  sportTypes: DbSportType[];
  staffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
  allCoaches: DbSportCoach[]; // All coach records to find related sports
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

export default function EditCoachModal({ coach, sportTypes, staffMembers, allCoaches, onClose }: EditModalProps) {
  
  // Find all coach records for this person (same staff_member_id or external_coach_name)
  const relatedCoaches = allCoaches.filter(c => {
    if (coach.staff_member_id) {
      return c.staff_member_id === coach.staff_member_id;
    } else {
      return c.external_coach_name === coach.external_coach_name && c.external_coach_name !== null;
    }
  });
  
  // Get current sport type IDs
  const currentSportTypeIds = relatedCoaches.map(c => c.sport_type_id);
  
  const [formData, setFormData] = useState({
    sport_type_ids: currentSportTypeIds,
    staff_member_id: coach.staff_member_id || '',
    external_coach_name: coach.external_coach_name || '',
    role: coach.role || '',
    is_active: coach.is_active ?? true,
  });

  const updateAction = async (payload: FormData) => {
    await updateSportCoachMultiple(payload);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleSportToggle = (sportTypeId: string) => {
    setFormData(prev => {
      const currentIds = prev.sport_type_ids;
      if (currentIds.includes(sportTypeId)) {
        return { ...prev, sport_type_ids: currentIds.filter(id => id !== sportTypeId) };
      } else {
        return { ...prev, sport_type_ids: [...currentIds, sportTypeId] };
      }
    });
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
          <input type="hidden" name="staff_member_id" value={formData.staff_member_id} />
          <input type="hidden" name="external_coach_name" value={formData.external_coach_name} />
          <input type="hidden" name="sport_type_ids" value={formData.sport_type_ids.join(',')} />

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Sportsoorte (Kies een of meer)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 max-h-60 overflow-y-auto">
              {sportTypeOptions.map(opt => (
                <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sport_type_ids.includes(opt.value)}
                    onChange={() => handleSportToggle(opt.value)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm dark:text-zinc-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <FloatingLabelInputField
            label="Rol (bv. Hoofafrigter)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <FloatingLabelSelectFieldCustom
            label="Personeellid (Indien onderwyser)"
            name="staff_member_display"
            value={formData.staff_member_id}
            onChange={handleChange}
            options={staffOptions}
            disabled
          />
          <FloatingLabelInputField
            label="Of, naam van buite-afrigter"
            name="external_coach_name_display"
            value={formData.external_coach_name}
            onChange={handleChange}
            disabled
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