// src/app/admin/kultuur/EditCultureActivityModal.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateCultureActivity } from './actions';
import type { DbCultureActivity } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import CultureIconUploader from './CultureIconUploader';

type EditModalProps = {
  activity: DbCultureActivity;
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

export default function EditCultureActivityModal({ activity, onClose }: EditModalProps) {
  
  const [formData, setFormData] = useState({
    name: activity.name || '',
    description: activity.description || '',
    icon_url: activity.icon_url || '',
    sort_order: activity.sort_order || 0,
    is_active: activity.is_active ?? true,
  });

  const updateAction = async (payload: FormData) => {
    await updateCultureActivity(payload);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, icon_url: url }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold dark:text-white">Wysig Kultuur-aktiwiteit</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{activity.name}</p>
        
        <form action={updateAction} className="relative mt-4 space-y-4">
          <LoadingOverlay />
          <input type="hidden" name="id" value={activity.id} />
          <input type="hidden" name="icon_url" value={formData.icon_url} />

          <FloatingLabelInputField
            label="Aktiwiteitnaam"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FloatingLabelInputField
            label="Rang (Sort Order)"
            name="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={handleChange}
          />
          <FloatingLabelInputField
            label="Beskrywing"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          
          <CultureIconUploader
            currentImageUrl={formData.icon_url}
            onUploadComplete={handleImageUpload}
          />
          
          <div className="flex items-center">
            <input
              id="is_active_edit_culture"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active_edit_culture" className="ml-2 block text-sm dark:text-zinc-300">Aktief?</label>
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