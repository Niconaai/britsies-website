// src/app/admin/sport/SportManagementClient.tsx
'use client';

import { useState, useTransition, FormEvent } from 'react';
import Image from 'next/image';
import type { 
  DbSportType, 
  DbStaffMember,
  DbSportCoach,
  DbSportAchievement 
} from '@/types/supabase';
import type { CoachWithDetails } from './page';
import { 
  createSportType, 
  deleteSportType, 
  createSportCoach, 
  deleteSportCoach, 
  createSportAchievement, 
  deleteSportAchievement 
} from './actions';
import FloatingLabelInputField from '@/components/ui/FloatingLabelInputField';
import FloatingLabelSelectFieldCustom from '@/components/ui/FloatingLabelSelectFieldCustom';

// --- REGSTELLING 1: Voer AL die nuwe komponente in ---
import SportIconUploader from './SportIconUploader';
import AchievementImageUploader from './AchievementImageUploader';
import EditSportTypeModal from './EditSportTypeModal';
import EditCoachModal from './EditCoachModal';
import EditAchievementModal from './EditAchievementModal';
// --- EINDE REGSTELLING 1 ---

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

export default function SportManagementClient({
  initialSportTypes,
  initialStaffMembers,
  initialCoaches,
  initialAchievements
}: {
  initialSportTypes: DbSportType[];
  initialStaffMembers: Pick<DbStaffMember, 'id' | 'full_name'>[];
  initialCoaches: CoachWithDetails[];
  initialAchievements: DbSportAchievement[];
}) {
  const [activeTab, setActiveTab] = useState('sports');
  const [isPending, startTransition] = useTransition();

  // --- REGSTELLING 2: State vir al die wysig-modale ---
  const [editingSportType, setEditingSportType] = useState<DbSportType | null>(null);
  const [editingCoach, setEditingCoach] = useState<DbSportCoach | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<DbSportAchievement | null>(null);
  
  // State vir Sportsoort-vorm
  const [sportName, setSportName] = useState('');
  const [sportSeason, setSportSeason] = useState('');
  const [sportSortOrder, setSportSortOrder] = useState(0);
  const [sportDesc, setSportDesc] = useState('');
  const [sportIconUrl, setSportIconUrl] = useState('');

  // State vir Afrigter-vorm
  const [coachSportType, setCoachSportType] = useState('');
  const [coachRole, setCoachRole] = useState('');
  const [coachStaffId, setCoachStaffId] = useState('');
  const [coachExternalName, setCoachExternalName] = useState('');

  // State vir Prestasie-vorm
  const [achieveTitle, setAchieveTitle] = useState('');
  const [achieveDesc, setAchieveDesc] = useState('');
  const [achieveDate, setAchieveDate] = useState('');
  const [achieveImageUrl, setAchieveImageUrl] = useState('');

  const staffOptions = initialStaffMembers.map(s => ({ value: s.id, label: s.full_name }));
  const sportTypeOptions = initialSportTypes.map(s => ({ value: s.id, label: s.name }));

  // --- Hanteerders vir Vorm-indiening ---

  const handleCreateSport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('icon_url', sportIconUrl);
    
    startTransition(async () => {
      await createSportType(formData);
      setSportName('');
      setSportSeason('');
      setSportSortOrder(0);
      setSportDesc('');
      setSportIconUrl('');
    });
  };

  const handleCreateCoach = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await createSportCoach(formData);
      setCoachSportType('');
      setCoachRole('');
      setCoachStaffId('');
      setCoachExternalName('');
    });
  };
  
  const handleCreateAchievement = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('image_url', achieveImageUrl);
    
    startTransition(async () => {
      await createSportAchievement(formData);
      setAchieveTitle('');
      setAchieveDesc('');
      setAchieveDate('');
      setAchieveImageUrl('');
    });
  };

  return (
    <>
      {/* --- REGSTELLING 3: Laai al die modale as hulle aktief is --- */}
      {editingSportType && (
        <EditSportTypeModal
          sportType={editingSportType}
          onClose={() => setEditingSportType(null)}
        />
      )}
      {editingCoach && (
        <EditCoachModal
          coach={editingCoach}
          sportTypes={initialSportTypes}
          staffMembers={initialStaffMembers}
          onClose={() => setEditingCoach(null)}
        />
      )}
      {editingAchievement && (
        <EditAchievementModal
          achievement={editingAchievement}
          onClose={() => setEditingAchievement(null)}
        />
      )}
      {/* --- EINDE REGSTELLING 3 --- */}

      <div className="mt-8">
        {/* Tab Knoppies */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          <TabButton active={activeTab === 'sports'} onClick={() => setActiveTab('sports')}>
            Sportsoorte
          </TabButton>
          <TabButton active={activeTab === 'coaches'} onClick={() => setActiveTab('coaches')}>
            Afrigters
          </TabButton>
          <TabButton active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>
            Prestasies
          </TabButton>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-b-lg shadow-inner">
          
          {/* --- Tab 1: Sportsoorte --- */}
          <div className={activeTab === 'sports' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bestuur Sportsoorte</h3>
            <form onSubmit={handleCreateSport} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-zinc-700">
              <FloatingLabelInputField
                name="name"
                label="Sportnaam (bv. Rugby)"
                value={sportName}
                onChange={(e) => setSportName(e.target.value)}
                required
              />
              <FloatingLabelInputField
                name="season"
                label="Seisoen (bv. Winter)"
                value={sportSeason}
                onChange={(e) => setSportSeason(e.target.value)}
              />
              <FloatingLabelInputField
                name="sort_order"
                label="Rang"
                type="number"
                value={sportSortOrder}
                onChange={(e) => setSportSortOrder(Number(e.target.value))}
              />
              <FloatingLabelInputField
                name="description"
                label="Beskrywing"
                value={sportDesc}
                onChange={(e) => setSportDesc(e.target.value)}
                className="md:col-span-3"
              />
              <div>
                {/* --- REGSTELLING 4: Gebruik korrekte oplaaier --- */}
                <SportIconUploader currentImageUrl={sportIconUrl} onUploadComplete={setSportIconUrl} />
              </div>
              <div className="self-end">
                <SubmitButton text="Skep Sportsoort" isLoading={isPending} />
              </div>
            </form>
            <ul className="mt-6 divide-y dark:divide-zinc-700">
              {initialSportTypes.map(sport => (
                <li key={sport.id} className="flex justify-between items-center py-2">
                  <span className="dark:text-zinc-300">{sport.name} ({sport.season})</span>
                  <div className="flex gap-4">
                    {/* --- REGSTELLING 5: Aktiveer Wysig-knoppie --- */}
                    <button
                      type="button"
                      onClick={() => setEditingSportType(sport)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteSportType}><input type="hidden" name="id" value={sport.id} /><button type="submit" className="text-xs text-red-500">Skrap</button></form>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Tab 2: Afrigters --- */}
          <div className={activeTab === 'coaches' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bestuur Afrigters</h3>
            <form onSubmit={handleCreateCoach} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-zinc-700">
              <FloatingLabelSelectFieldCustom
                name="sport_type_id"
                label="Sportsoort"
                value={coachSportType}
                onChange={(e) => setCoachSportType(e.target.value)}
                options={sportTypeOptions}
                required
              />
              <FloatingLabelInputField
                name="role"
                label="Rol (bv. Hoofafrigter)"
                value={coachRole}
                onChange={(e) => setCoachRole(e.target.value)}
                required
              />
              <FloatingLabelSelectFieldCustom
                name="staff_member_id"
                label="Personeellid (Indien onderwyser)"
                value={coachStaffId}
                onChange={(e) => setCoachStaffId(e.target.value)}
                options={[{ value: "", label: "N.v.t." }, ...staffOptions]}
              />
              <FloatingLabelInputField
                name="external_coach_name"
                label="Of, naam van buite-afrigter"
                value={coachExternalName}
                onChange={(e) => setCoachExternalName(e.target.value)}
              />
              <div className="self-end">
                <SubmitButton text="Skep Afrigter" isLoading={isPending} />
              </div>
            </form>
            <ul className="mt-6 divide-y dark:divide-zinc-700">
              {initialCoaches.map(coach => (
                <li key={coach.id} className="flex justify-between items-center py-2">
                  <span className="dark:text-zinc-300">{coach.staff_members?.full_name || coach.external_coach_name} ({coach.role} - {coach.sport_types?.name})</span>
                  <div className="flex gap-4">
                    {/* --- REGSTELLING 6: Aktiveer Wysig-knoppie --- */}
                    <button
                      type="button"
                      onClick={() => setEditingCoach(coach)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteSportCoach}><input type="hidden" name="id" value={coach.id} /><button type="submit" className="text-xs text-red-500">Skrap</button></form>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Tab 3: Prestasies --- */}
          <div className={activeTab === 'achievements' ? 'block' : 'hidden'}>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bestuur Prestasies</h3>
            <form onSubmit={handleCreateAchievement} className="space-y-4 p-4 border rounded-lg dark:border-zinc-700">
              <FloatingLabelInputField
                name="title"
                label="Titel (bv. NWU Reeks-wenners 2024)"
                value={achieveTitle}
                onChange={(e) => setAchieveTitle(e.target.value)}
                required
              />
              <FloatingLabelInputField
                name="description"
                label="Kort beskrywing"
                value={achieveDesc}
                onChange={(e) => setAchieveDesc(e.target.value)}
              />
              <FloatingLabelInputField
                name="achievement_date"
                label="Datum van Prestasie"
                type="date"
                value={achieveDate}
                onChange={(e) => setAchieveDate(e.target.value)}
              />
              <div>
                {/* --- REGSTELLING 7: Gebruik korrekte oplaaier --- */}
                <AchievementImageUploader currentImageUrl={achieveImageUrl} onUploadComplete={setAchieveImageUrl} />
              </div>
              <SubmitButton text="Skep Prestasie" isLoading={isPending} />
            </form>
            <ul className="mt-6 divide-y dark:divide-zinc-700">
              {initialAchievements.map(achieve => (
                <li key={achieve.id} className="flex justify-between items-center py-2">
                  <span className="dark:text-zinc-300">{achieve.title} ({achieve.achievement_date})</span>
                  <div className="flex gap-4">
                    {/* --- REGSTELLING 8: Aktiveer Wysig-knoppie --- */}
                    <button
                      type="button"
                      onClick={() => setEditingAchievement(achieve)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Wysig
                    </button>
                    <form action={deleteSportAchievement}><input type="hidden" name="id" value={achieve.id} /><button type="submit" className="text-xs text-red-500">Skrap</button></form>
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