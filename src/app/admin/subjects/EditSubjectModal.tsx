// src/app/admin/subjects/EditSubjectModal.tsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateSubject } from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import type { DbSubject } from '@/types/supabase';

export default function EditSubjectModal({
  subject,
  onClose
}: {
  subject: DbSubject;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(subject.name);
  const [description, setDescription] = useState(subject.description || '');
  const [sortOrder, setSortOrder] = useState(subject.sort_order || 0);
  const [isActive, setIsActive] = useState(subject.is_active !== false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await updateSubject(new FormData(e.currentTarget));
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Wysig Vak
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={subject.id} />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatingLabelInputField
              label="Vak Naam"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FloatingLabelInputField
              label="Sorteervolgorde"
              name="sort_order"
              type="number"
              value={sortOrder.toString()}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
            />
          </div>

          <FloatingLabelInputField
            label="Beskrywing (opsioneel)"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-zinc-900 dark:text-white">
              Aktief
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Kanselleer
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[120px] items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? (
                <Image
                  src="/CircleLoader.gif"
                  alt="Besig..."
                  width={20}
                  height={20}
                  unoptimized={true}
                />
              ) : (
                'Stoor Veranderinge'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
