// src/types/supabase.ts
// Gebaseer op ons FSD.md skema en api/apply/route.ts

export type DbApplication = {
  id: string;
  created_at: string;
  status: string | null;
  human_readable_id: string | null;
  application_number: number | null;
  user_id: string;
};

// Vanaf Stap 5 (Stokperdjies)
export type Extracurriculars = {
  culture?: string[];
  summer_sport?: string[];
  winter_sport?: string[];
  achievements?: string;
};

export type DbLearner = {
  id: string;
  application_id: string;
  // Stap 1
  surname: string | null;
  first_names: string | null;
  nickname: string | null;
  id_number: string | null;
  dob: string | null;
  home_language: string | null;
  race: string | null;
  cell_phone: string | null;
  email: string | null;
  religion: string | null;
  next_of_kin_name: string | null;
  next_of_kin_relationship: string | null;
  next_of_kin_contact: string | null;
  next_of_kin_contact_alt: string | null;
  lives_with: string | null;
  lives_with_other: string | null;
  nationality: string | null;
  gender: string | null;
  last_grade_passed: string | null;
  years_in_grade: number | null;
  preschool: string | null;
  preschool_other: string | null;
  family_status: string | null;
  family_status_other: string | null;
  parents_deceased: string | null;
  admission_date: string | null;
  // Stap 5
  health_allergies: string | null;
  health_illnesses: string | null;
  health_disabilities: string | null;
  health_operations: string | null;
  health_medication: string | null;
  health_additional_info: string | null;
  med_aid_scheme: string | null;
  med_aid_number: string | null;
  med_aid_main_member: string | null;
  med_aid_member_id: string | null;
  doctor_name: string | null;
  doctor_number: string | null;
  prev_school_name: string | null;
  prev_school_town: string | null;
  prev_school_province: string | null;
  prev_school_tel: string | null;
  prev_school_reason_leaving: string | null;
  extracurriculars: Extracurriculars | null;
  // Stap 6
  agree_rules: boolean | null;
  agree_photos: boolean | null;
  agree_indemnity: boolean | null;
  agree_financial: boolean | null;
  signature: string | null;
};

export type DbGuardian = {
  id: string;
  application_id: string;
  guardian_type: string | null; // 'Ouer 1' of 'Ouer 2'
  // Stap 2/3
  relationship: string | null;
  title: string | null;
  initials: string | null;
  first_name: string | null;
  nickname: string | null;
  surname: string | null;
  id_number: string | null;
  marital_status: string | null;
  cell_phone: string | null;
  work_phone: string | null;
  email: string | null;
  res_address_line1: string | null;
  res_address_line2: string | null;
  res_address_city: string | null;
  res_address_code: string | null;
  postal_same_as_res: boolean | null;
  postal_address_line1: string | null;
  postal_address_line2: string | null;
  postal_address_city: string | null;
  postal_address_code: string | null;
  employer: string | null;
  occupation: string | null;
  work_address: string | null;
  home_language: string | null;
  communication_preference: string[] | null;
  occupation_status: string | null;
  work_email: string | null;
};

export type DbPayer = {
  id: string;
  application_id: string;
  // Stap 4
  payer_type: string | null;
  full_name: string | null;
  id_number: string | null;
  company_reg_no: string | null;
  vat_no: string | null;
  tel_work: string | null;
  tel_cell: string | null;
  email: string | null;
  postal_address_line1: string | null;
  postal_address_line2: string | null;
  postal_address_city: string | null;
  postal_address_code: string | null;
  debit_bank_name: string | null;
  debit_branch_code: string | null;
  debit_account_number: string | null;
  debit_account_type: string | null;
  debit_account_holder: string | null;
  debit_date: string | null;
  debit_agree_terms: boolean | null;
  contract_signatory_name: string | null;
  contract_signatory_id: string | null;
  contract_signatory_capacity: string | null;
  contract_agree_terms: boolean | null;
};

export type DbUploadedFile = {
  id: string;
  application_id: string;
  file_type: string | null; // bv. 'docBirthCert'
  storage_path: string | null;
  original_filename: string | null;
  created_at: string;
};

// Die finale saamgestelde tipe wat ons van die 'join'-navraag kry
export type FullApplicationData = DbApplication & {
  learners: DbLearner[];
  guardians: DbGuardian[];
  payers: DbPayer[];
  uploaded_files: DbUploadedFile[];
};

export type RawApplicationData = DbApplication & {
  learners: DbLearner[];     // <-- Kry as 'n skikking
  guardians: DbGuardian[];   // <-- Kry as 'n skikking
  payers: DbPayer[];         // <-- Kry as 'n skikking
  uploaded_files: DbUploadedFile[];
};

export type CleanApplicationData = DbApplication & {
  learner: DbLearner | null;      // <-- Verander na enkel item
  guardians: DbGuardian[];   // (bly skikking, want ons verwag Ouer 1 & 2)
  payer: DbPayer | null;        // <-- Verander na enkel item
  uploaded_files: DbUploadedFile[]; // (bly skikking)
};