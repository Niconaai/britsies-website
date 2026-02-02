// src/app/admin/personeel/GradeHeadAssignment.tsx
'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import type { DbGradeClass, DbStaffMember } from '@/types/supabase';
import { updateGradeHead } from './gradeHeadActions';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

type GradeClassWithHead = DbGradeClass & {
  staff_members: Pick<DbStaffMember, 'full_name'> | null;
};

export default function GradeHeadAssignment({
  gradeClasses,
  staffMembers,
}: {
  gradeClasses: GradeClassWithHead[];
  staffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
}) {
  const [isPending, startTransition] = useTransition();

  const staffOptions = [
    { value: '', label: '-- Geen Graadhoof --' },
    ...staffMembers.map(s => ({ value: s.id, label: s.full_name }))
  ];

  const handleGradeHeadChange = async (gradeLevel: number, newGradeHeadId: string) => {
    const formData = new FormData();
    formData.append('grade_level', gradeLevel.toString());
    formData.append('grade_head_id', newGradeHeadId);
    
    startTransition(async () => {
      await updateGradeHead(formData);
    });
  };

  // Group by grade level and get the first class's grade head (they should all be the same)
  const gradesByLevel: Record<number, { gradeHeadId: string | null; gradeHeadName: string | null; classes: GradeClassWithHead[] }> = {};
  
  gradeClasses.forEach(gc => {
    if (!gradesByLevel[gc.grade_level]) {
      gradesByLevel[gc.grade_level] = {
        gradeHeadId: gc.grade_head_id,
        gradeHeadName: gc.staff_members?.full_name || null,
        classes: []
      };
    }
    gradesByLevel[gc.grade_level].classes.push(gc);
  });

  const sortedGradeLevels = Object.keys(gradesByLevel).map(Number).sort();

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <h3 className="text-lg font-semibold dark:text-white mb-4">Graadhoof Toekenning</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Wys 'n graadhoof toe aan elke graad. Elke graad het slegs een graadhoof vir al sy klasse.
      </p>

      {isPending && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <Image
            src="/CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
          />
          <span className="text-sm text-blue-800 dark:text-blue-200">Besig om graadhoof op te dateer...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedGradeLevels.map(gradeLevel => {
          const gradeData = gradesByLevel[gradeLevel];
          const classNames = gradeData.classes.map(c => c.class_section).sort().join(', ');
          
          return (
            <div key={gradeLevel} className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-3">
                <h4 className="text-base font-semibold text-rose-800 dark:text-rose-400">
                  Graad {gradeLevel}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Klasse: {classNames}
                </p>
              </div>
              
              <FloatingLabelSelectFieldCustom
                label="Graadhoof"
                name={`grade_head_${gradeLevel}`}
                options={staffOptions}
                value={gradeData.gradeHeadId || ''}
                onChange={(e) => handleGradeHeadChange(gradeLevel, e.target.value)}
              />
              
              {gradeData.gradeHeadName && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Huidige: {gradeData.gradeHeadName}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
