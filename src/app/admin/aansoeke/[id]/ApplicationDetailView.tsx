// src/app/admin/aansoeke/[id]/ApplicationDetailView.tsx
'use client';
import FloatingLabelSelectField from "@/components/ui/FloatingLabelSelectField";

// --- GEBRUIK ONS NUWE "SKOON" TIPE ---
import type { 
  CleanApplicationData, 
  DbGuardian, 
  DbPayer, 
  DbLearner 
} from '@/types/supabase';
import { updateApplicationStatus } from './action';
import FileListItem from './FileListItem'; 

const voorskoolOptions = ["Hangende (Pending)", "Goedgekeur (Approved)", "Verwerp (Rejected)", "Waglys (Waitlisted)"];

const InfoField = ({ label, value, colSpan = 1 }: { 
  label: string; 
  value: string | number | boolean | null | undefined | string[];
  colSpan?: number;
}) => {
  let displayValue: React.ReactNode;

  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    displayValue = <span className="italic text-zinc-400">N/A</span>;
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Ja' : 'Nee';
  } else if (Array.isArray(value)) {
    displayValue = value.join(', ');
  } else {
    displayValue = String(value);
  }

  return (
    <div className={colSpan === 2 ? "sm:col-span-2" : ""}>
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-white">{displayValue}</dd>
    </div>
  );
};

// Kaart vir Leerder-data
const LearnerCard = ({ learner }: { learner: DbLearner | null }) => {
  if (!learner) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Leerder Inligting</h2>
        <p className="mt-4 text-red-500">Geen leerder-inligting gevind vir hierdie aansoek nie.</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Leerder Inligting</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoField label="Volle Naam" value={`${learner.first_names || ''} ${learner.surname || ''}`} colSpan={2} />
        <InfoField label="Noemnaam" value={learner.nickname} />
        <InfoField label="ID Nommer" value={learner.id_number} />
        <InfoField label="Geboortedatum" value={learner.dob} />
        <InfoField label="Geslag" value={learner.gender} />
        <InfoField label="Nasionaliteit" value={learner.nationality} />
        <InfoField label="Ras" value={learner.race} />
        <InfoField label="Kerkverband" value={learner.religion} />
        <InfoField label="Huistaal" value={learner.home_language} />
        <InfoField label="Selfoon" value={learner.cell_phone} />
        <InfoField label="E-pos" value={learner.email} colSpan={2} />
        <InfoField label="Laaste Graad Behaal" value={`Graad ${learner.last_grade_passed || 'N/A'}`} />
        <InfoField label="Jare in daardie graad" value={learner.years_in_grade} />
        <InfoField label="Toelatingsdatum" value={learner.admission_date} />
        <InfoField label="Gesinstatus" value={`${learner.family_status || ''} ${learner.family_status_other ? `(${learner.family_status_other})` : ''}`} />
        <InfoField label="Ouers Oorlede" value={learner.parents_deceased} />
        <InfoField label="Woon Saam Met" value={`${learner.lives_with || ''} ${learner.lives_with_other ? `(${learner.lives_with_other})` : ''}`} />
        <InfoField label="Voorskool" value={`${learner.preschool || ''} ${learner.preschool_other ? `(${learner.preschool_other})` : ''}`} />
      </dl>
    </div>
  );
};

// Kaart vir Noodkontak
const NextOfKinCard = ({ learner }: { learner: DbLearner | null }) => {
  if (!learner) return null;
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Naasbestaande (Noodkontak)</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoField label="Volle Naam" value={learner.next_of_kin_name} />
        <InfoField label="Verwantskap" value={learner.next_of_kin_relationship} />
        <InfoField label="Kontaknommer" value={learner.next_of_kin_contact} />
        <InfoField label="Alternatiewe Kontak" value={learner.next_of_kin_contact_alt} />
      </dl>
    </div>
  );
};

// Kaart vir Voog
const GuardianCard = ({ guardian }: { guardian: DbGuardian }) => (
  <div className="rounded-lg border border-zinc-200 p-6 shadow-md dark:border-zinc-700">
    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{guardian.guardian_type}</h3>
    <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <InfoField label="Volle Naam" value={`${guardian.first_name || ''} ${guardian.surname || ''}`} colSpan={2} />
      <InfoField label="Titel" value={guardian.title} />
      <InfoField label="ID Nommer" value={guardian.id_number} />
      <InfoField label="Verwantskap" value={guardian.relationship} />
      <InfoField label="Huwelikstatus" value={guardian.marital_status} />
      <InfoField label="Selfoon" value={guardian.cell_phone} />
      <InfoField label="E-pos" value={guardian.email} colSpan={2} />
      <InfoField label="Huistaal" value={guardian.home_language} />
      <InfoField label="Kommunikasie" value={guardian.communication_preference} />
      <InfoField label="Woonadres" value={`${guardian.res_address_line1 || ''}, ${guardian.res_address_city || ''}, ${guardian.res_address_code || ''}`} colSpan={3} />
      <InfoField label="Posadres" value={guardian.postal_same_as_res ? 'Dieselfde as woonadres' : `${guardian.postal_address_line1 || ''}, ${guardian.postal_address_city || ''}, ${guardian.postal_address_code || ''}`} colSpan={3} />
      <InfoField label="Beroepstatus" value={guardian.occupation_status} />
      <InfoField label="Beroep" value={guardian.occupation} />
      <InfoField label="Werkgewer" value={guardian.employer} />
      <InfoField label="Werks E-pos" value={guardian.work_email} />
      <InfoField label="Werks Telefoon" value={guardian.work_phone} />
      <InfoField label="Werksadres" value={guardian.work_address} colSpan={3} />
    </dl>
  </div>
);

// Kaart vir Betaler
const PayerCard = ({ payer }: { payer: DbPayer | null }) => {
  if (!payer) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Betaler Inligting</h2>
        <p className="mt-4 text-zinc-500">Geen betaler-inligting gevind nie.</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Betaler Inligting</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoField label="Tipe Betaler" value={payer.payer_type} />
        <InfoField label="Volle Naam" value={payer.full_name} colSpan={2} />
        <InfoField label="ID / Reg Nr." value={payer.id_number || payer.company_reg_no} />
        <InfoField label="BTW Nr." value={payer.vat_no} />
        <InfoField label="Selfoon" value={payer.tel_cell} />
        <InfoField label="Werks Telefoon" value={payer.tel_work} />
        <InfoField label="E-pos" value={payer.email} colSpan={2} />
        <InfoField label="Posadres" value={`${payer.postal_address_line1 || ''}, ${payer.postal_address_city || ''}, ${payer.postal_address_code || ''}`} colSpan={3} />
        <InfoField label="Bank" value={payer.debit_bank_name} />
        <InfoField label="Takkode" value={payer.debit_branch_code} />
        <InfoField label="Rekening Nr" value={payer.debit_account_number} />
        <InfoField label="Tipe Rekening" value={payer.debit_account_type} />
        <InfoField label="Rekeninghouer" value={payer.debit_account_holder} />
        <InfoField label="Debiet Datum" value={payer.debit_date} />
        <InfoField label="Geteken (Debiet)" value={payer.debit_agree_terms} />
        <InfoField label="Geteken (Kontrak)" value={payer.contract_agree_terms} />
        <InfoField label="Ondertekenaar Naam" value={payer.contract_signatory_name} />
        <InfoField label="Ondertekenaar ID" value={payer.contract_signatory_id} />
        <InfoField label="Hoedanigheid" value={payer.contract_signatory_capacity} />
      </dl>
    </div>
  );
};

// Kaart vir Gesondheid
const HealthCard = ({ learner }: { learner: DbLearner | null }) => {
  if (!learner) return null;
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Gesondheid & Medies</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoField label="Mediese Fonds" value={learner.med_aid_scheme} />
        <InfoField label="Fonds Nommer" value={learner.med_aid_number} />
        <InfoField label="Hooflid" value={learner.med_aid_main_member} />
        <InfoField label="Hooflid ID" value={learner.med_aid_member_id} />
        <InfoField label="Huisdokter" value={learner.doctor_name} />
        <InfoField label="Dokter Nommer" value={learner.doctor_number} />
      </dl>
      <dl className="mt-4 grid grid-cols-1 gap-4">
        <InfoField label="Allergieë" value={learner.health_allergies} />
        <InfoField label="Siektetoestande" value={learner.health_illnesses} />
        <InfoField label="Gestremdhede" value={learner.health_disabilities} />
        <InfoField label="Operasies" value={learner.health_operations} />
        <InfoField label="Medikasie" value={learner.health_medication} />
        <InfoField label="Addisionele Inligting" value={learner.health_additional_info} />
      </dl>
    </div>
  );
};

// Kaart vir Vorige Skool & Stokperdjies
const ExtraCard = ({ learner }: { learner: DbLearner | null }) => {
  if (!learner) return null;
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Vorige Skool & Aktiwiteite</h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoField label="Vorige Skool" value={learner.prev_school_name} />
        <InfoField label="Dorp" value={learner.prev_school_town} />
        <InfoField label="Telefoon" value={learner.prev_school_tel} />
        <InfoField label="Rede vir verlaat" value={learner.prev_school_reason_leaving} colSpan={3} />
        <InfoField label="Kultuur" value={learner.extracurriculars?.culture} />
        <InfoField label="Somersport" value={learner.extracurriculars?.summer_sport} />
        <InfoField label="Wintersport" value={learner.extracurriculars?.winter_sport} />
        <InfoField label="Ander Prestasies" value={learner.extracurriculars?.achievements} colSpan={3} />
      </dl>
    </div>
  );
};

// HOOF KOMPONENT
export default function ApplicationDetailView({ application }: { application: CleanApplicationData }) {
  
  // --- DATA IS NOU BAIE SKONER ---
  const { learner, payer, guardians, uploaded_files: files } = application;

  // Sorteer voogde om Ouer 1 eerste te wys
  const sortedGuardians = [...guardians].sort((a, b) => 
    (a.guardian_type || '').localeCompare(b.guardian_type || '')
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* --- BLOK 1: Status Bestuur --- */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Aansoek: {application.human_readable_id || application.id.substring(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Huidige status: 
              <span className={`ml-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                application.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                application.status === 'waitlisted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {application.status || 'pending'}
              </span>
            </p>
          </div>
          <form action={updateApplicationStatus} className="flex items-center gap-2">
            <input type="hidden" name="applicationId" value={application.id} />
            <select 
              name="status"
              defaultValue={application.status || 'pending'}
              className="rounded-md border-zinc-300 shadow-sm hover:bg-zinc-600 px-2 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option value="pending">Hangende (Pending)</option>
              <option value="approved">Goedgekeur (Approved)</option>
              <option value="rejected">Verwerp (Rejected)</option>
              <option value="waitlisted">Waglys (Waitlisted)</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Dateer Status Op
            </button>
          </form>
        </div>
      </div>

      {/* --- BLOK 5: Opgelaaide Lêers --- */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Opgelaaide Dokumente
        </h2>
        {files.length > 0 ? (
          <ul className="mt-4 divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-700 dark:border-zinc-700">
            {files.map(file => (
              <FileListItem key={file.id} file={file} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-zinc-500">Geen lêers is opgelaai nie.</p>
        )}
      </div>

      {/* --- BLOK 2: Leerder Inligting --- */}
      <LearnerCard learner={learner} />

      {/* --- BLOK (ekstra): Noodkontak --- */}
      <NextOfKinCard learner={learner} />

      {/* --- BLOK 3: Voog Inligting --- */}
      <div className="space-y-4">
        {sortedGuardians.length > 0 ? (
          sortedGuardians.map(g => <GuardianCard key={g.id} guardian={g} />)
        ) : (
          <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <p className="text-zinc-500">Geen voog-inligting gevind nie.</p>
          </div>
        )}
      </div>

      {/* --- BLOK 4: Betaler Inligting --- */}
      <PayerCard payer={payer} />

      {/* --- BLOK 6: Gesondheid & Ekstra --- */}
      <HealthCard learner={learner} />
      <ExtraCard learner={learner} />

    </div>
  );
}