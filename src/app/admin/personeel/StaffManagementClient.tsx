// src/app/admin/personeel/StaffManagementClient.tsx
'use client';

import { useState, useTransition, FormEvent } from 'react';
import Image from 'next/image';
import { 
  createDepartment, 
  deleteDepartment, 
  createStaffMember, 
  deleteStaffMember 
} from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import StaffImageUploader from './StaffImageUploader';
import EditStaffModal from './EditStaffModal';
import type { 
  DbStaffDepartment,
  StaffMemberWithDept, // <-- Die korrekte, volledige tipe
  DbStaffMember 
} from '@/types/supabase';

// ... (CheckboxGroup en SubmitButton bly dieselfde) ...
const CheckboxGroup = ({
  label,
  options,
  selectedValues,
  onChange,
}: {
  label: string;
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
            name="department_ids"
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

export default function StaffManagementClient({
  initialDepartments,
  initialStaff,
}: {
  initialDepartments: DbStaffDepartment[];
  initialStaff: StaffMemberWithDept[];
}) {

  // --- REGSTELLING 1: Gebruik die korrekte, volledige tipe ---
  const [editingStaff, setEditingStaff] = useState<StaffMemberWithDept | null>(null);
  
  const [isCreatingDept, setIsCreatingDept] = useTransition();
  const [isCreatingStaff, setIsCreatingStaff] = useTransition();

  // ... (Al die 'useState' hake vir vorms bly dieselfde) ...
  const [deptName, setDeptName] = useState('');
  const [deptSort, setDeptSort] = useState(0);
  const [staffName, setStaffName] = useState('');
  const [staffTitle, setStaffTitle] = useState('');
  const [staffSort, setStaffSort] = useState(0);
  const [staffImage, setStaffImage] = useState('');
  const [staffActive, setStaffActive] = useState(true);
  const [staffDepts, setStaffDepts] = useState<string[]>([]);
  
  const departmentOptions = initialDepartments.map(d => ({ value: d.id, label: d.name }));
  
  const handleDeptChange = (value: string, isChecked: boolean) => {
    setStaffDepts(prev => {
      if (isChecked) {
        return [...prev, value];
      } else {
        return prev.filter(id => id !== value);
      }
    });
  };
  
  const handleCreateDept = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsCreatingDept(async () => {
      await createDepartment(formData);
      setDeptName('');
      setDeptSort(0);
    });
  };

  const handleCreateStaff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('image_url', staffImage);
    
    setIsCreatingStaff(async () => {
      await createStaffMember(formData);
      setStaffName('');
      setStaffTitle('');
      setStaffDepts([]);
      setStaffSort(0);
      setStaffImage('');
      setStaffActive(true);
    });
  };

  return (
    <>
      {editingStaff && (
        <EditStaffModal
          staffMember={editingStaff} // <-- REGSTELLING 2: Stuur die volle 'StaffMemberWithDept' objek
          departments={initialDepartments}
          // staffDepartmentIds={...} // <-- REGSTELLING 3: Hierdie prop is nou oorbodig en verwyder
          onClose={() => setEditingStaff(null)}
        />
      )}
      
      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* --- KOLOM 1: Bestuur Personeel --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Nuwe Personeellid Vorm */}
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold dark:text-white">Skep Nuwe Personeellid</h3>
            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
              <input type="hidden" name="image_url" value={staffImage} />
              <FloatingLabelInputField
                label="Volle Naam"
                name="full_name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                required
              />
              <FloatingLabelInputField
                label="Titel (bv. Skoolhoof)"
                name="title"
                value={staffTitle}
                onChange={(e) => setStaffTitle(e.target.value)}
                required
              />
              
              <CheckboxGroup
                label="Departemente"
                options={departmentOptions}
                selectedValues={staffDepts}
                onChange={handleDeptChange}
              />
              
              <FloatingLabelInputField
                label="Rang (Sort Order)"
                name="sort_order"
                type="number"
                value={staffSort}
                onChange={(e) => setStaffSort(Number(e.target.value))}
              />
              
              <StaffImageUploader 
                currentImageUrl={staffImage} 
                onUploadComplete={setStaffImage} 
              />
              
              <div className="flex items-center">
                <input
                  id="is_active" name="is_active" type="checkbox"
                  checked={staffActive}
                  onChange={(e) => setStaffActive(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm dark:text-zinc-300">Aktief?</label>
              </div>
              <SubmitButton text="Skep Personeellid" isLoading={isCreatingStaff} />
            </form>
          </div>

          {/* Lys van Bestaande Personeel */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Bestaande Personeel</h3>
            <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
              {initialStaff.map(staff => (
                <li key={staff.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={staff.image_url || '/wapen.png'} 
                      alt={staff.full_name} 
                      width={40} height={40} 
                      className="rounded-full h-10 w-10 object-cover"
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{staff.full_name}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {staff.title} 
                        ({staff.staff_departments && staff.staff_departments.length > 0 
                          ? staff.staff_departments.map(d => d.name).join(', ') 
                          : 'Geen Dept.'})
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      // --- REGSTELLING 4: Verwyder die slegte tipe-omskakeling ---
                      onClick={() => setEditingStaff(staff)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteStaffMember}>
                      <input type="hidden" name="id" value={staff.id} />
                      <button type="submit" className="text-xs text-red-600 hover:text-red-800">Skrap</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- KOLOM 2: Bestuur Departemente (Onveranderd) --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold dark:text-white">Skep Nuwe Departement</h3>
            <form onSubmit={handleCreateDept} className="mt-4 space-y-4">
              <FloatingLabelInputField
                label="Departement Naam"
                name="name"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
              <FloatingLabelInputField
                label="Rang (Sort Order)"
                name="sort_order"
                type="number"
                value={deptSort}
                onChange={(e) => setDeptSort(Number(e.target.value))}
              />
              <SubmitButton text="Skep Departement" isLoading={isCreatingDept} />
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Bestaande Departemente</h3>
            <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
              {initialDepartments.map(dept => (
                <li key={dept.id} className="flex items-center justify-between py-2">
                  <span className="font-medium dark:text-zinc-300">{dept.name} (Rang: {dept.sort_order})</span>
                  <div className="flex gap-2">
                    <form action={deleteDepartment}>
                      <input type="hidden" name="id" value={dept.id} />
                      <button type="submit" className="text-xs text-red-600 hover:text-red-800">Skrap</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}