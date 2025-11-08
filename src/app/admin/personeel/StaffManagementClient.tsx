// src/app/admin/personeel/StaffManagementClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  createDepartment, 
  deleteDepartment, 
  createStaffMember, 
  deleteStaffMember 
} from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

// --- REGSTELLING 1: Voer die korrekte oplaaier in ---
import StaffImageUploader from './StaffImageUploader'; 
import EditStaffModal from './EditStaffModal';
import type { 
  DbStaffDepartment,
  StaffMemberWithDept,
  DbStaffMember 
} from '@/types/supabase';

// 'n Eenvoudige 'Submit' knoppie
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

  const [editingStaff, setEditingStaff] = useState<DbStaffMember | null>(null);

  // --- REGSTELLING 2: State vir laai-status ---
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  // --- Departement Vorm State ---
  const [deptName, setDeptName] = useState('');
  const [deptSort, setDeptSort] = useState(0);

  // --- Personeel Vorm State ---
  const [staffName, setStaffName] = useState('');
  const [staffTitle, setStaffTitle] = useState('');
  const [staffDept, setStaffDept] = useState('');
  const [staffSort, setStaffSort] = useState(0);
  const [staffImage, setStaffImage] = useState('');
  const [staffActive, setStaffActive] = useState(true);
  
  const departmentOptions = initialDepartments.map(d => ({ value: d.id, label: d.name }));
  
  const departmentSelectOptions = [
    { value: "", label: "Geen Departement" },
    ...departmentOptions
  ];

  // --- REGSTELLING 3: Vorm-hantering en terugstel ---
  const handleCreateDept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingDept(true);
    
    const formData = new FormData(e.currentTarget);
    await createDepartment(formData);
    
    // Stel vorm terug
    setDeptName('');
    setDeptSort(0);
    setIsCreatingDept(false);
  };

  const handleCreateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingStaff(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('image_url', staffImage); // Voeg die prent-URL by
    
    await createStaffMember(formData);
    
    // Stel vorm terug
    setStaffName('');
    setStaffTitle('');
    setStaffDept('');
    setStaffSort(0);
    setStaffImage('');
    setStaffActive(true);
    setIsCreatingStaff(false);
  };
  // --- EINDE VAN REGSTELLING 3 ---

  return (
    <>
      {editingStaff && (
        <EditStaffModal
          staffMember={editingStaff}
          departments={initialDepartments}
          onClose={() => setEditingStaff(null)}
        />
      )}
      
      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* --- KOLOM 1: Bestuur Personeel --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Nuwe Personeellid Vorm */}
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold dark:text-white">Skep Nuwe Personeellid</h3>
            {/* --- REGSTELLING 4: Gebruik onSubmit --- */}
            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
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
              <FloatingLabelSelectFieldCustom
                label="Departement"
                name="department_id"
                value={staffDept}
                onChange={(e) => setStaffDept(e.target.value)}
                options={departmentSelectOptions}
              />
              <FloatingLabelInputField
                label="Rang (Sort Order)"
                name="sort_order"
                type="number"
                value={staffSort}
                onChange={(e) => setStaffSort(Number(e.target.value))}
              />
              
              {/* --- REGSTELLING 5: Gebruik die nuwe oplaaier --- */}
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
                        {staff.title} ({staff.staff_departments?.name || 'Geen Dept.'})
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setEditingStaff(staff as DbStaffMember)}
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

        {/* --- KOLOM 2: Bestuur Departemente --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Nuwe Departement Vorm */}
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold dark:text-white">Skep Nuwe Departement</h3>
            {/* --- REGSTELLING 6: Gebruik onSubmit --- */}
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
          
          {/* Lys van Bestaande Departemente */}
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Bestaande Departemente</h3>
            <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
              {initialDepartments.map(dept => (
                <li key={dept.id} className="flex items-center justify-between py-2">
                  <span className="font-medium dark:text-zinc-300">{dept.name} (Rang: {dept.sort_order})</span>
                  <div className="flex gap-2">
                    {/* TODO: Wysig-knoppie vir departemente */}
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