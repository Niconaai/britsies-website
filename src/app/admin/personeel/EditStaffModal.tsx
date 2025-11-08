// src/app/admin/personeel/EditStaffModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateStaffMember } from './actions';
import type { DbStaffMember, DbStaffDepartment } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';
import ImageUploader from '@/app/admin/winkel/produkte/ImageUploader';

type EditStaffModalProps = {
  staffMember: DbStaffMember;
  departments: DbStaffDepartment[];
  onClose: () => void;
};

// Knoppie- en Oorleg-komponente
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-zinc-800/70">
      <Image
        src="/CircleLoader.gif"
        alt="Besig..."
        width={60}
        height={60}
        unoptimized={true}
      />
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

export default function EditStaffModal({ staffMember, departments, onClose }: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    full_name: staffMember.full_name || '',
    title: staffMember.title || '',
    department_id: staffMember.department_id || '',
    image_url: staffMember.image_url || '',
    sort_order: staffMember.sort_order || 0,
    is_active: staffMember.is_active ?? true,
  });

  // Maak seker die formAction sluit die modaal wanneer dit klaar is
  const updateAction = async (payload: FormData) => {
    await updateStaffMember(payload);
    onClose();
  };

  // --- HIER IS DIE REGSTELLING ---
  // Voeg 'HTMLTextAreaElement' by die tipe
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  // --- EINDE VAN REGSTELLING ---
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const departmentOptions = [
    { value: "", label: "Geen Departement" },
    ...departments.map(d => ({ value: d.id, label: d.name }))
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold dark:text-white">Wysig Personeellid</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{staffMember.full_name}</p>
        
        <form action={updateAction} className="relative mt-4 space-y-4">
          <LoadingOverlay />
          <input type="hidden" name="id" value={staffMember.id} />
          <input type="hidden" name="image_url" value={formData.image_url} />

          <FloatingLabelInputField
            label="Volle Naam"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange} // Sal nou werk
            required
          />
          <FloatingLabelInputField
            label="Titel (bv. Skoolhoof)"
            name="title"
            value={formData.title}
            onChange={handleChange} // Sal nou werk
            required
          />
          <FloatingLabelSelectFieldCustom
            label="Departement"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange} // Hierdie het reeds gewerk
            options={departmentOptions}
          />
          <FloatingLabelInputField
            label="Rang (Sort Order)"
            name="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={handleChange} // Sal nou werk
          />
          <ImageUploader
            currentImageUrl={formData.image_url}
            onUploadComplete={handleImageUpload}
          />
          <div className="flex items-center">
            <input
              id="is_active_edit"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active_edit" className="ml-2 block text-sm dark:text-zinc-300">Aktief?</label>
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