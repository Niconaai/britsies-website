// src/app/api/apply/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { type FileState } from "@/app/aansoek/AdmissionForm";
import { Resend } from 'resend';
// import { ApplicationConfirmationEmail } from '../../emails/ApplicationConfirmationEmails';
// import { AdminNotificationEmail } from '../../emails/AdminNotificationEmail';

import { getParentConfirmationHtml, getAdminNotificationHtml } from '@/utils/emailTemplates';

type TextData = {
    [key: string]: string | undefined;
};

type FileData = {
    [key in keyof FileState]: File | undefined;
};

const fileKeys: (keyof FileState)[] = [
    'learnerPhoto',
    'docBirthCert',
    'docG1Id',
    'docG2Id',
    'docProofOfAddress',
    'docMedicalAid',
    'docPrevReport',
    'docOorplasingSert',
    'docPortefeulje',
    'docGedragsverslag'
];

function formatDateYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0'); 
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function processFormData(formData: FormData): { textData: TextData, fileData: FileData } {
    const textData: TextData = {};
    const fileData: Partial<FileData> = {};
    for (const key of fileKeys) {
        const file = formData.get(key) as File | null;
        if (file && file.size > 0) {
            fileData[key] = file;
        }
    }
    formData.forEach((value, key) => {
        if (!fileKeys.includes(key as keyof FileState)) {
            if (value === 'on') {
                textData[key] = 'true';
            } else if (typeof value === 'string') {
                textData[key] = value;
            }
        }
    });
    return { textData, fileData: fileData as FileData };
}

function mapDataToSchema(textData: TextData, applicationId: string) {
    const parseJsonArray = (field: string | undefined): any[] => {
        try {
            if (field && field.startsWith('[') && field.endsWith(']')) {
                 return JSON.parse(field);
            }
            return field ? JSON.parse(field) : [];
        } catch {
            return field ? [field] : [];
        }
    };

    const toBool = (val: string | undefined) => val === 'true';

    // 1. Learners Table Data
    const learnerData = {
        application_id: applicationId,
        surname: textData.learnerSurname,
        first_names: textData.learnerFirstNames,
        nickname: textData.learnerNickName,
        id_number: textData.learnerIdNumber,
        dob: textData.learnerDob,
        home_language: textData.learnerHomeLanguage,
        race: textData.learnerRace,
        cell_phone: textData.learnerCellPhone,
        email: textData.learnerEmail,
        religion: textData.learnerReligion,
        next_of_kin_name: textData.nextOfKinFullName,
        next_of_kin_relationship: textData.nextOfKinRelationship,
        next_of_kin_contact: textData.nextOfKinContact,
        next_of_kin_contact_alt: textData.nextOfKinContactAlt,
        lives_with: textData.learnerLivesWith,
        lives_with_other: textData.learnerLivesWithOther,
        nationality: textData.learnerNationality,
        gender: textData.learnerGender,
        last_grade_passed: textData.learnerLastGradePassed,
        years_in_grade: textData.learnerYearsInGrade ? parseInt(textData.learnerYearsInGrade, 10) : null,
        preschool: textData.learnerPreschool,
        preschool_other: textData.learnerPreschoolOther,
        family_status: textData.familyStatus,
        family_status_other: textData.familyStatusOther,
        parents_deceased: textData.parentsDeceased,
        prev_school_name: textData.prevSchoolName,
        admission_date: textData.toelatingsDatum,
        // Health Info (Stap 5)
        health_allergies: textData.healthAllergies,
        health_illnesses: textData.healthIllnesses,
        health_disabilities: textData.healthDisabilities,
        health_operations: textData.healthOperations,
        health_medication: textData.healthMedication,
        health_additional_info: textData.healthAdditionalInfo,
        med_aid_scheme: textData.medAidScheme,
        med_aid_number: textData.medAidNumber,
        med_aid_main_member: textData.medAidMainMember,
        med_aid_member_id: textData.medAidMemberId,
        doctor_name: textData.doctorName,
        doctor_number: textData.doctorNumber,
        prev_school_town: textData.prevSchoolTown,
        prev_school_province: textData.prevSchoolProvince,
        prev_school_tel: textData.prevSchoolTel,
        prev_school_reason_leaving: textData.prevSchoolReasonForLeaving,
        // Extracurricular (Stap 5 - JSONB)
        // Extracurricular (Stap 5 - JSONB)
        extracurriculars: {
            culture: parseJsonArray(textData.extraCulture),
            summer_sport: parseJsonArray(textData.extraSummerSport),
            winter_sport: parseJsonArray(textData.extraWinterSport),
            achievements: textData.extraAchievements
        },
        // Agreements (Stap 6)
        agree_rules: toBool(textData.agreeRules),
        agree_photos: toBool(textData.agreePhotos),
        agree_indemnity: toBool(textData.agreeIndemnity),
        agree_financial: toBool(textData.agree_financial),
        signature: textData.acceptHandtekening, // The new signature field
    };

    // 2. Guardians Table Data (Array for batch insert)
    const guardiansData = [];
    guardiansData.push({
        application_id: applicationId,
        guardian_type: 'Ouer 1',
        relationship: textData.g1Relationship,
        title: textData.g1Title,
        initials: textData.g1Initials,
        first_name: textData.g1FirstName,
        nickname: textData.g1Nickname,
        surname: textData.g1Surname,
        id_number: textData.g1IdNumber,
        marital_status: textData.g1MaritalStatus,
        cell_phone: textData.g1CellPhone,
        work_phone: textData.g1WorkPhone,
        email: textData.g1Email,
        res_address_line1: textData.g1ResAddressLine1,
        res_address_line2: textData.g1ResAddressLine2,
        res_address_city: textData.g1ResAddressCity,
        res_address_code: textData.g1ResAddressCode,
        postal_same_as_res: toBool(textData.g1PostalSameAsRes),
        postal_address_line1: textData.g1PostalAddressLine1,
        postal_address_line2: textData.g1PostalAddressLine2,
        postal_address_city: textData.g1PostalAddressCity,
        postal_address_code: textData.g1PostalAddressCode,
        employer: textData.g1Employer,
        occupation: textData.g1Occupation,
        work_address: textData.g1WorkAddress,
        home_language: textData.g1Huistaal,
        communication_preference: parseJsonArray(textData.g1KommunikasieVoorkeur),
        occupation_status: textData.g1Beroepstatus,
        work_email: textData.g1WorkEmail,
    });

    if (!toBool(textData.g2NotApplicable)) {
        guardiansData.push({
            application_id: applicationId,
            guardian_type: 'Ouer 2',
            relationship: textData.g2Relationship,
            title: textData.g2Title,
            initials: textData.g2Initials,
            first_name: textData.g2FirstName,
            nickname: textData.g2Nickname,
            surname: textData.g2Surname,
            id_number: textData.g2IdNumber,
            marital_status: textData.g2MaritalStatus,
            cell_phone: textData.g2CellPhone,
            work_phone: textData.g2WorkPhone,
            email: textData.g2Email,
            res_address_line1: textData.g2ResAddressLine1,
            res_address_line2: textData.g2ResAddressLine2,
            res_address_city: textData.g2ResAddressCity,
            res_address_code: textData.g2ResAddressCode,
            postal_same_as_res: toBool(textData.g2PostalSameAsRes),
            postal_address_line1: textData.g2PostalAddressLine1,
            postal_address_line2: textData.g2PostalAddressLine2,
            postal_address_city: textData.g2PostalAddressCity,
            postal_address_code: textData.g2PostalAddressCode,
            employer: textData.g2Employer,
            occupation: textData.g2Occupation,
            work_address: textData.g2WorkAddress,
            home_language: textData.g2Huistaal,
            communication_preference: parseJsonArray(textData.g2KommunikasieVoorkeur),
            occupation_status: textData.g2Beroepstatus,
            work_email: textData.g2WorkEmail,
        });
    }

    // 3. Payers Table Data
    const payerData = {
        application_id: applicationId,
        payer_type: textData.payerType,
        full_name: textData.payerFullName,
        id_number: textData.payerIdNumber,
        company_reg_no: textData.payerCompanyRegNo,
        vat_no: textData.payerVatNo,
        tel_work: textData.payerTelWork,
        tel_cell: textData.payerTelCell,
        email: textData.payerEmail,
        postal_address_line1: textData.payerPostalAddressLine1,
        postal_address_line2: textData.payerPostalAddressLine2,
        postal_address_city: textData.payerPostalAddressCity,
        postal_address_code: textData.payerPostalAddressCode,
        debit_bank_name: textData.debitBankName,
        debit_branch_code: textData.debitBranchCode,
        debit_account_number: textData.debitAccountNumber,
        debit_account_type: textData.debitAccountType,
        debit_account_holder: textData.debitAccountHolder,
        debit_date: textData.debitDate,
        debit_agree_terms: toBool(textData.debitAgreeTerms),
        contract_signatory_name: textData.contractSignatoryName,
        contract_signatory_id: textData.contractSignatoryId,
        contract_signatory_capacity: textData.contractSignatoryCapacity,
        contract_agree_terms: toBool(textData.contractAgreeTerms),
    };

    return { learnerData, guardiansData, payerData };
}

const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);

// --- Main POST Handler ---
export async function POST(request: Request) {
    console.log("POST /api/apply received");
    const supabase = await createClient();
    let db_application_uuid: string | null = null;
    let human_friendly_id: string | null = null; 
    let userEmail: string | null = null;
    let learnerName: string | null = null;
    let learnerGrade: string | null = null;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }
        userEmail = user.email || null;
        console.log(`Processing application for user: ${user.id}`);

        const formData = await request.formData();
        const { textData, fileData } = processFormData(formData);

        if (!textData.learnerSurname || !textData.learnerIdNumber) {
            throw new Error("Missing required learner information.");
        }
        if (!fileData.docBirthCert || !fileData.docG1Id) {
            throw new Error("Missing required documents (Birth Cert or G1 ID).");
        }

        // 1. Create the Application record to get an ID
        console.log("Creating application record...");
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .insert({ status: 'pending', user_id: user.id })
            .select('id, application_number, created_at') // <-- VRA VIR DIE NUWE KOLOMME
            .single();

        if (appError) throw appError;

        db_application_uuid = appData.id; 
        const appNumber = appData.application_number;
        const appDate = new Date(appData.created_at);

        if (!db_application_uuid || typeof appNumber !== 'number') {
            throw new Error("Application ID or Number was not created.");
        }

        const paddedAppNumber = String(appNumber).padStart(6, '0');
        const formattedDate = formatDateYYYYMMDD(appDate);
        human_friendly_id = `BRI-${formattedDate}-${paddedAppNumber}`; // Bv. BRI-20251031-000001
        
        console.log(`Generated Friendly ID: ${human_friendly_id} for UUID: ${db_application_uuid}`);

        // STOOR DIE MENS-LEESBARE ID TERUG IN DIE DB
        // 'n Beter metode is om 'await' te gebruik en die fout te hanteer
        const { error: updateError } = await supabase
          .from('applications')
          .update({ human_readable_id: human_friendly_id })
          .eq('id', db_application_uuid);

        if (updateError) {
          console.warn(`Could not save friendly_id: ${updateError.message}`);
        }

        // 2. Upload Files to Storage
        console.log("Uploading files...");
        const uploadedFilesList = [];

        for (const [key, file] of Object.entries(fileData)) {
            if (file) {
                // Use a clean file name or add a hash if needed
                const fileExt = file.name.split('.').pop();
                const cleanFileName = `${key}.${fileExt}`;
                const path = `applications/${db_application_uuid}/${cleanFileName}`;

                const { error: storageError } = await supabase.storage
                    .from('application-uploads') // Bucket name from FSD
                    .upload(path, file);

                if (storageError) {
                    console.error(`Error uploading ${key}:`, storageError);
                    throw new Error(`Failed to upload file: ${file.name}`);
                }

                console.log(`Uploaded file: ${path}`);
                // Add to list for Step 4
                uploadedFilesList.push({
                    application_id: db_application_uuid,
                    file_type: key,
                    storage_path: path,
                    original_filename: file.name,
                    mime_type: file.type,
                    file_size: file.size,
                });
            }
        }

        // 3. Map Text Data to DB Schema
        console.log("Mapping text data to schema...");
        const { learnerData, guardiansData, payerData } = mapDataToSchema(textData, db_application_uuid);

        learnerName = `${learnerData.first_names || ''} ${learnerData.surname || ''}`.trim();
        learnerGrade = learnerData.last_grade_passed || null;

        // 4. Insert into Relational Tables

        // Insert Learner
        console.log("Inserting learner data...");
        const { error: learnerError } = await supabase.from('learners').insert(learnerData);
        if (learnerError) throw learnerError;

        // Insert Guardian(s)
        console.log(`Inserting ${guardiansData.length} guardian record(s)...`);
        const { error: guardianError } = await supabase.from('guardians').insert(guardiansData);
        if (guardianError) throw guardianError;

        // Insert Payer
        console.log("Inserting payer data...");
        const { error: payerError } = await supabase.from('payers').insert(payerData);
        if (payerError) throw payerError;

        // Insert File Records
        console.log("Inserting file records into 'uploaded_files' table...");
        const { error: fileTableError } = await supabase.from('uploaded_files').insert(uploadedFilesList);
        if (fileTableError) throw fileTableError;


        // 5.1 Send confirmation email to parent
        console.log("Sending confirmation email to applicant via Resend...");
        if (!process.env.BRITSIES_RESEND_API_KEY) {
            console.warn("Skipping parent email.");
        } else if (!userEmail || !learnerName || !human_friendly_id) {
             console.warn("Missing data for email. Skipping parent email.");
        } else {
            try {
                // +++ FINALE KODE +++
                // 1. Bou die HTML-string
                const parentEmailHtml = getParentConfirmationHtml({
                    learnerName: learnerName,
                    humanReadableId: human_friendly_id
                });
                
                // 2. Stuur die HTML string
                await resend.emails.send({
                    from: 'Hoërskool Brits Aansoeke <info@nicolabsdigital.co.za>',
                    to: [userEmail],
                    subject: `Hoërskool Brits: Aansoek Ontvang (${learnerName})`,
                    html: parentEmailHtml 
                });
                console.log(`Successfully sent confirmation email to ${userEmail}`);
            } catch (emailError) {
                console.error("Resend email failed:", emailError);
            }
        }

        // 5.2 Stuur aan ADMIN
        console.log("Sending notification email to admin via Resend...");
        const adminEmail = process.env.ADMIN_EMAIL_RECIPIENT;

        if (!process.env.BRITSIES_RESEND_API_KEY) {
            console.warn("Skipping admin email.");
        } else if (!adminEmail) {
            console.warn("ADMIN_EMAIL_RECIPIENT is not set. Skipping admin email.");
        } else if (!learnerName || !human_friendly_id || !learnerGrade) {
            console.warn("Missing data for admin email. Skipping admin email.");
        } else {
             try {
                // +++ FINALE KODE +++
                // 1. Bou die HTML-string
                const adminEmailHtml = getAdminNotificationHtml({
                    learnerName: learnerName,
                    learnerGrade: learnerGrade,
                    parentEmail: userEmail,
                    humanReadableId: human_friendly_id
                });
                
                // 2. Stuur die HTML string
                await resend.emails.send({
                    from: 'Aanlyn Hoërskool Brits Aansoeke <info@nicolabsdigital.co.za>',
                    to: [adminEmail],
                    subject: `NUWE AANSOEK: ${learnerName} (Graad ${learnerGrade})`,
                    html: adminEmailHtml
                });
                console.log(`Successfully sent admin notification to ${adminEmail}`);
            } catch (emailError) {
                console.error("Resend admin email failed:", emailError);
            }
        }

        // 6. Return Success
        console.log(`Successfully processed application ${db_application_uuid}`);
        return NextResponse.json({
            success: true,
            message: "Application received!",
            applicationId: db_application_uuid
        });

    } catch (error) {
        console.error("Error in /api/apply:", error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        if (db_application_uuid) {
            console.warn(`Attempting to clean up orphaned application record: ${db_application_uuid}`);
            await supabase.from('applications').delete().eq('id', db_application_uuid);
            //have to maybe implement upload rollbacks
        }

        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}