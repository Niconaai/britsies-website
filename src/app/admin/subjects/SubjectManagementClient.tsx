// src/app/admin/subjects/SubjectManagementClient.tsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { DbSubject } from '@/types/supabase';
import { createSubject, deleteSubject } from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import EditSubjectModal from './EditSubjectModal';

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

export default function SubjectManagementClient({
  initialSubjects
}: {
  initialSubjects: DbSubject[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingSubject, setEditingSubject] = useState<DbSubject | null>(null);

  // Form state
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const handleCreateSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await createSubject(new FormData(e.currentTarget));
      setSubjectName('');
      setDescription('');
      setSortOrder(0);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Is jy seker jy wil hierdie vak verwyder? Dit sal ook alle koppelings met onderwysers verwyder.')) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', id);
      await deleteSubject(formData);
    });
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Create Form */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Voeg Nuwe Vak By
        </h2>
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FloatingLabelInputField
              label="Vak Naam (bv. Wiskunde)"
              name="name"
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
            <FloatingLabelInputField
              label="Beskrywing (opsioneel)"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FloatingLabelInputField
              label="Sorteervolgorde"
              name="sort_order"
              type="number"
              value={sortOrder.toString()}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
            />
          </div>
          <SubmitButton text="Voeg Vak By" isLoading={isPending} />
        </form>
      </div>

      {/* Subjects List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Bestaande Vakke
        </h2>
        {initialSubjects.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Geen vakke gevind nie.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Vak Naam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                    Beskrywing
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
                {initialSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {subject.description || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        subject.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {subject.is_active ? 'Aktief' : 'Onaktief'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingSubject(subject)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Wysig
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
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
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
        />
      )}
    </div>
  );
}
