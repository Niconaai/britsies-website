// src/app/admin/grade-classes/EditGradeClassModal.tsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateGradeClass } from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';
import type { DbGradeClass, DbStaffMember } from '@/types/supabase';

export default function EditGradeClassModal({
  gradeClass,
  staffMembers,
  onClose
}: {
  gradeClass: DbGradeClass;
  staffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(gradeClass.name);
  const [gradeLevel, setGradeLevel] = useState(gradeClass.grade_level);
  const [classSection, setClassSection] = useState(gradeClass.class_section);
  const [gradeHeadId, setGradeHeadId] = useState(gradeClass.grade_head_id || '');
  const [sortOrder, setSortOrder] = useState(gradeClass.sort_order || 0);
  const [isActive, setIsActive] = useState(gradeClass.is_active !== false);

  const staffOptions = [
    { value: '', label: '-- Geen Graadhoof --' },
    ...staffMembers.map(s => ({ value: s.id, label: s.full_name }))
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await updateGradeClass(new FormData(e.currentTarget));
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Wysig Graadklas
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={gradeClass.id} />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatingLabelInputField
              label="Klas Naam (bv. 8-1)"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Graad Vlak (8-12)
              </label>
              <input
                name="grade_level"
                type="number"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(parseInt(e.target.value, 10))}
                min="8"
                max="12"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Klas Afdeling (1, 2, 3, ...)
              </label>
              <input
                name="class_section"
                type="number"
                value={classSection}
                onChange={(e) => setClassSection(parseInt(e.target.value, 10))}
                min="1"
                required
                className="w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
            </div>
            <FloatingLabelSelectFieldCustom
              label="Graadhoof"
              name="grade_head_id"
              options={staffOptions}
              value={gradeHeadId}
              onChange={(e) => setGradeHeadId(e.target.value)}
            />
            <FloatingLabelInputField
              label="Sorteervolgorde"
              name="sort_order"
              type="number"
              value={sortOrder.toString()}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
            />
          </div>

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
