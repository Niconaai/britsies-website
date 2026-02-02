// src/app/admin/personeel/EditStaffModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { updateStaffMember } from './actions';
// --- REGSTELLING 1: Voer die korrekte tipe in ---
import type { DbStaffMember, DbStaffDepartment, StaffMemberWithDept, DbSubject, DbGradeClass } from '@/types/supabase';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import StaffImageUploader from './StaffImageUploader';

// ... (CheckboxGroup bly dieselfde) ...
const CheckboxGroup = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (value: string, isChecked: boolean) => void;
}) => (
  <div className="rounded-md border border-zinc-300 p-4 dark:border-zinc-600">
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
    <div className="mt-2 grid grid-cols-2 gap-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => onChange(option.value, e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-zinc-900 dark:text-white">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

type EditStaffModalProps = {
  // --- REGSTELLING 2: Gebruik die korrekte, volledige tipe ---
  staffMember: StaffMemberWithDept; 
  departments: DbStaffDepartment[];
  subjects: DbSubject[];
  gradeClasses: DbGradeClass[];
  onClose: () => void;
};

// ... (LoadingOverlay en SaveButton bly dieselfde) ...
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

export default function EditStaffModal({ 
  staffMember, 
  departments,
  subjects,
  gradeClasses,
  onClose 
}: EditStaffModalProps) {
  
  const [formData, setFormData] = useState({
    full_name: staffMember.full_name || '',
    title: staffMember.title || '',
    image_url: staffMember.image_url || '',
    sort_order: staffMember.sort_order || 0,
    is_active: staffMember.is_active ?? true,
  });

  // --- REGSTELLING 3: Inisialiseer state direk vanaf die 'staffMember'-prop ---
  const [selectedDepts, setSelectedDepts] = useState<string[]>(
    staffMember.staff_departments?.map(d => d.id) || []
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    staffMember.staff_subjects?.map(s => s.subject_id) || []
  );
  const [selectedGuardianClasses, setSelectedGuardianClasses] = useState<string[]>(
    staffMember.class_guardians?.map(c => c.grade_class_id) || []
  );

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const updateAction = async (payload: FormData) => {
    await updateStaffMember(payload);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleDeptChange = (value: string, isChecked: boolean) => {
    setSelectedDepts(prev => {
      if (isChecked) {
        return [...prev, value];
      } else {
        return prev.filter(id => id !== value);
      }
    });
  };

  const handleSubjectChange = (value: string, isChecked: boolean) => {
    setSelectedSubjects(prev => {
      if (isChecked) {
        return [...prev, value];
      } else {
        return prev.filter(id => id !== value);
      }
    });
  };

  const handleGuardianClassChange = (value: string, isChecked: boolean) => {
    setSelectedGuardianClasses(prev => {
      if (isChecked) {
        return [...prev, value];
      } else {
        return prev.filter(id => id !== value);
      }
    });
  };

  const departmentOptions = departments.map(d => ({ value: d.id, label: d.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: s.name }));
  const gradeClassOptions = gradeClasses.map(gc => ({ value: gc.id, label: gc.name }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800 max-h-[90vh] overflow-y-auto"
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
            onChange={handleChange}
            required
          />
          <FloatingLabelInputField
            label="Titel (bv. Skoolhoof)"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          
          <CheckboxGroup
            label="Departemente"
            name="department_ids"
            options={departmentOptions}
            selectedValues={selectedDepts}
            onChange={handleDeptChange}
          />

          <CheckboxGroup
            label="Vakke (wat onderrig word)"
            name="subject_ids"
            options={subjectOptions}
            selectedValues={selectedSubjects}
            onChange={handleSubjectChange}
          />

          <CheckboxGroup
            label="Voog Klasse"
            name="guardian_class_ids"
            options={gradeClassOptions}
            selectedValues={selectedGuardianClasses}
            onChange={handleGuardianClassChange}
          />
          
          <FloatingLabelInputField
            label="Rang (Sort Order)"
            name="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={handleChange}
          />
          
          <StaffImageUploader
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