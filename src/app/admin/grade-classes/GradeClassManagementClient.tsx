// src/app/admin/grade-classes/GradeClassManagementClient.tsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { DbGradeClass, DbStaffMember } from '@/types/supabase';
import type { GradeClassWithGradeHead } from './page';
import { createGradeClass, deleteGradeClass } from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';
import EditGradeClassModal from './EditGradeClassModal';

const SubmitButton = ({ text, isLoading }: { text: string, isLoading: boolean }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex min-w-[150px] justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? (
        <Image
          src="/CircleLoader.gif"
          alt="Besig..."
          width={20}
          height={20}
          unoptimized={true}
        />
      ) : (
        text
      )}
    </button>
  );
};

export default function GradeClassManagementClient({
  initialGradeClasses,
  initialStaffMembers
}: {
  initialGradeClasses: GradeClassWithGradeHead[];
  initialStaffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingGradeClass, setEditingGradeClass] = useState<DbGradeClass | null>(null);

  // Form state
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState(8);
  const [classSection, setClassSection] = useState(1);
  const [gradeHeadId, setGradeHeadId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const staffOptions = [
    { value: '', label: '-- Geen Graadhoof --' },
    ...initialStaffMembers.map(s => ({ value: s.id, label: s.full_name }))
  ];

  const handleCreateGradeClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await createGradeClass(new FormData(e.currentTarget));
      setClassName('');
      setGradeLevel(8);
      setClassSection(1);
      setGradeHeadId('');
      setSortOrder(0);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Is jy seker jy wil hierdie graadklas verwyder?')) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      await deleteGradeClass(formData);
    });
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Create Form */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Skep Nuwe Graadklas
        </h2>
        <form onSubmit={handleCreateGradeClass} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatingLabelInputField
              label="Klas Naam (bv. 8-1)"
              name="name"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
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
          <SubmitButton text="Skep Graadklas" isLoading={isPending} />
        </form>
      </div>

      {/* Grade Classes List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Bestaande Graadklasse
        </h2>
        {initialGradeClasses.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Geen graadklasse gevind nie.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Klas Naam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Graad Vlak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Graadhoof
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Aksies
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                {initialGradeClasses.map((gradeClass) => (
                  <tr key={gradeClass.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      {gradeClass.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      Graad {gradeClass.grade_level}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      {gradeClass.staff_members?.full_name || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        gradeClass.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {gradeClass.is_active ? 'Aktief' : 'Onaktief'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingGradeClass(gradeClass)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Wysig
                      </button>
                      <button
                        onClick={() => handleDelete(gradeClass.id)}
                        disabled={isPending}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        Verwyder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingGradeClass && (
        <EditGradeClassModal
          gradeClass={editingGradeClass}
          staffMembers={initialStaffMembers}
          onClose={() => setEditingGradeClass(null)}
        />
      )}
    </div>
  );
}
