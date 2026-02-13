// src/app/admin/kultuur/KultuurManagementClient.tsx
'use client';

import { useState, useTransition, FormEvent } from 'react';
import Image from 'next/image';
import type { 
  DbCultureActivity, 
  DbStaffMember,
  DbCultureOrganiser
} from '@/types/supabase';
import type { OrganiserWithDetails } from './page';
import { 
  createCultureActivity,
  deleteCultureActivity,
  createCultureOrganiser,
  deleteCultureOrganiser
} from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

// Voer al ons nuwe komponente in
import CultureIconUploader from './CultureIconUploader';
import EditCultureActivityModal from './EditCultureActivityModal';
import EditOrganiserModal from './EditOrganiserModal';

// Definisie vir die Tab-knoppie
const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
      active
        ? 'bg-white dark:bg-zinc-800 border-b-0 text-rose-700'
        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700'
    }`}
  >
    {children}
  </button>
);

// Knoppie wat 'n laai-toestand wys
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

export default function KultuurManagementClient({
  initialActivities,
  initialStaffMembers,
  initialOrganisers
}: {
  initialActivities: DbCultureActivity[];
  initialStaffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
  initialOrganisers: OrganiserWithDetails[];
}) {
  const [activeTab, setActiveTab] = useState('activities');
  const [isPending, startTransition] = useTransition();

  // State vir Wysig-Modale
  const [editingActivity, setEditingActivity] = useState<DbCultureActivity | null>(null);
  const [editingOrganiser, setEditingOrganiser] = useState<DbCultureOrganiser | null>(null);
  
  // State vir Aktiwiteit-vorm
  const [activityName, setActivityName] = useState('');
  const [activitySortOrder, setActivitySortOrder] = useState(0);
  const [activityDesc, setActivityDesc] = useState('');
  const [activityIconUrl, setActivityIconUrl] = useState('');

  // State vir Organiseerder-vorm
  const [organiserActivities, setOrganiserActivities] = useState<string[]>([]);
  const [organiserRole, setOrganiserRole] = useState('');
  const [organiserStaffId, setOrganiserStaffId] = useState('');

  const staffOptions = initialStaffMembers.map(s => ({ value: s.id, label: s.full_name }));
  const activityOptions = initialActivities.map(a => ({ value: a.id, label: a.name }));

  // --- Hanteerders vir Vorm-indiening (met 'onSubmit') ---

  const handleCreateActivity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('icon_url', activityIconUrl);
    
    startTransition(async () => {
      await createCultureActivity(formData);
      // Stel vorm terug
      setActivityName('');
      setActivitySortOrder(0);
      setActivityDesc('');
      setActivityIconUrl('');
    });
  };

  const handleCreateOrganiser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await createCultureOrganiser(formData);
      // Stel vorm terug
      setOrganiserActivities([]);
      setOrganiserRole('');
      setOrganiserStaffId('');
    });
  };

  return (
    <>
      {/* Laai die modale as hulle aktief is */}
      {editingActivity && (
        <EditCultureActivityModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
        />
      )}
      {editingOrganiser && (
        <EditOrganiserModal
          organiser={editingOrganiser}
          activities={initialActivities}
          staffMembers={initialStaffMembers}
          allOrganisers={initialOrganisers}
          onClose={() => setEditingOrganiser(null)}
        />
      )}

      <div className="mt-8">
        {/* Tab Knoppies */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          <TabButton active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>
            Aktiwiteite
          </TabButton>
          <TabButton active={activeTab === 'organisers'} onClick={() => setActiveTab('organisers')}>
            Organiseerders
          </TabButton>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-b-lg shadow-inner">
          
          {/* --- Tab 1: Kultuur-aktiwiteite --- */}
          <div className={activeTab === 'activities' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bestuur Aktiwiteite</h3>
            <form onSubmit={handleCreateActivity} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-zinc-700">
              <FloatingLabelInputField
                name="name"
                label="Aktiwiteitnaam (bv. Koor)"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                required
              />
              <FloatingLabelInputField
                name="sort_order"
                label="Rang"
                type="number"
                value={activitySortOrder}
                onChange={(e) => setActivitySortOrder(Number(e.target.value))}
              />
              <FloatingLabelInputField
                name="description"
                label="Beskrywing"
                value={activityDesc}
                onChange={(e) => setActivityDesc(e.target.value)}
                className="md:col-span-3"
              />
              <div>
                <CultureIconUploader currentImageUrl={activityIconUrl} onUploadComplete={setActivityIconUrl} />
              </div>
              <div className="self-end">
                <SubmitButton text="Skep Aktiwiteit" isLoading={isPending} />
              </div>
            </form>
            <ul className="mt-6 divide-y dark:divide-zinc-700">
              {initialActivities.map(activity => (
                <li key={activity.id} className="flex justify-between items-center py-2">
                  <span className="dark:text-zinc-300">{activity.name} (Rang: {activity.sort_order})</span>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingActivity(activity)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteCultureActivity}><input type="hidden" name="id" value={activity.id} /><button type="submit" className="text-xs text-red-500">Skrap</button></form>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Tab 2: Organiseerders --- */}
          <div className={activeTab === 'organisers' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bestuur Organiseerders</h3>
            <form onSubmit={handleCreateOrganiser} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-zinc-700">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Kultuur-aktiwiteite (Kies een of meer)</label>
                <input type="hidden" name="activity_ids" value={organiserActivities.join(',')} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3 border rounded-md dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 max-h-40 overflow-y-auto">
                  {activityOptions.map(opt => (
                    <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={organiserActivities.includes(opt.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOrganiserActivities([...organiserActivities, opt.value]);
                          } else {
                            setOrganiserActivities(organiserActivities.filter(id => id !== opt.value));
                          }
                        }}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm dark:text-zinc-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <FloatingLabelSelectFieldCustom
                name="staff_member_id"
                label="Personeellid"
                value={organiserStaffId}
                onChange={(e) => setOrganiserStaffId(e.target.value)}
                options={staffOptions}
                required
              />
              <FloatingLabelInputField
                name="role"
                label="Rol (bv. Organiseerder)"
                value={organiserRole}
                onChange={(e) => setOrganiserRole(e.target.value)}
                required
              />
              <div className="self-end">
                <SubmitButton text="Skep Organiseerder" isLoading={isPending} />
              </div>
            </form>
            <ul className="mt-6 divide-y dark:divide-zinc-700">
              {initialOrganisers.map(org => (
                <li key={org.id} className="flex justify-between items-center py-2">
                  <span className="dark:text-zinc-300">{org.staff_members?.full_name} ({org.role} - {org.culture_activities?.name})</span>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingOrganiser(org)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteCultureOrganiser}><input type="hidden" name="id" value={org.id} /><button type="submit" className="text-xs text-red-500">Skrap</button></form>
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