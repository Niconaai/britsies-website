// src/app/api/apply/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { type FileState } from "@/app/aansoek/AdmissionForm"; // Import types from form

// Define a type for our flat text data
type TextData = {
    [key: string]: string | undefined;
};

// Define a type for our file data
type FileData = {
    [key in keyof FileState]: File | undefined;
};

// List of all file input names from our form
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

/**
 * Helper to parse FormData into separate text and file objects
 */
function processFormData(formData: FormData): { textData: TextData, fileData: FileData } {
    const textData: TextData = {};
    const fileData: Partial<FileData> = {}; // Use Partial for building

    for (const key of fileKeys) {
        const file = formData.get(key) as File | null;
        if (file && file.size > 0) {
            fileData[key] = file;
        }
    }

    // Iterate over all entries to get text data
    // This is safer than accessing keys one by one
    formData.forEach((value, key) => {
        // If it's not a file key, add it as text
        if (!fileKeys.includes(key as keyof FileState)) {
            // Handle boolean 'on'/'off' from checkboxes
            if (value === 'on') {
                textData[key] = 'true';
            } else if (typeof value === 'string') {
                textData[key] = value;
            }
        }
    });

    return { textData, fileData: fileData as FileData };
}

/**
 * Helper to map flat textData to our normalized DB schema
 */
function mapDataToSchema(textData: TextData, applicationId: string) {
    const parseJsonArray = (field: string | undefined): any[] => {
        try {
            return field ? JSON.parse(field) : [];
        } catch {
            return [];
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
        extra_culture: parseJsonArray(textData.extraCulture),
        extra_summer_sport: parseJsonArray(textData.extraSummerSport),
        extra_winter_sport: parseJsonArray(textData.extraWinterSport),
        extra_achievements: textData.extraAchievements,
        // Agreements (Stap 6)
        agree_rules: toBool(textData.agreeRules),
        agree_photos: toBool(textData.agreePhotos),
        agree_indemnity: toBool(textData.agreeIndemnity),
        agree_financial: toBool(textData.agreeFinancial),
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

// --- Main POST Handler ---
export async function POST(request: Request) {
    console.log("POST /api/apply received");
    const supabase = await createClient();
    let applicationId: string | null = null;

    try {
        const formData = await request.formData();
        const { textData, fileData } = processFormData(formData);
        
        // --- Basic Validation (Example) ---
        if (!textData.learnerSurname || !textData.learnerIdNumber) {
            throw new Error("Missing required learner information.");
        }
        if (!fileData.docBirthCert || !fileData.docG1Id) {
            throw new Error("Missing required documents (Birth Cert or G1 ID).");
        }
        // --- End Validation ---

        // 1. Create the Application record to get an ID
        console.log("Creating application record...");
        const { data: appData, error: appError } = await supabase
            .from('applications')
            .insert({ status: 'pending' }) // Set default status
            .select()
            .single();

        if (appError) throw appError;
        
        applicationId = appData.id;
        console.log(`Application record created: ${applicationId}`);
        
        if (!applicationId) {
            throw new Error("Application ID was not created. Cannot map data.");
        }

        // 2. Upload Files to Storage
        console.log("Uploading files...");
        const uploadedFilesList = [];

        for (const [key, file] of Object.entries(fileData)) {
            if (file) {
                // Use a clean file name or add a hash if needed
                const fileExt = file.name.split('.').pop();
                const cleanFileName = `${key}.${fileExt}`;
                const path = `applications/${applicationId}/${cleanFileName}`;

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
                    application_id: applicationId,
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
        const { learnerData, guardiansData, payerData } = mapDataToSchema(textData, applicationId);

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


        // 5. TODO: Send confirmation emails (Resend)
        console.log("TODO: Implement Resend email confirmation.");


        // 6. Return Success
        console.log(`Successfully processed application ${applicationId}`);
        return NextResponse.json({ 
            success: true, 
            message: "Application received!",
            applicationId: applicationId 
        });

    } catch (error) {
        console.error("Error in /api/apply:", error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        // --- Optional Rollback Logic (Advanced) ---
        // If an error happened *after* the application record was created,
        // we could try to delete it to prevent orphaned data.
        if (applicationId) {
            console.warn(`Attempting to clean up orphaned application record: ${applicationId}`);
            // Note: This does not roll back storage uploads.
            // A more robust solution would use database transactions or a cleanup queue.
            await supabase.from('applications').delete().eq('id', applicationId);
        }
        // --- End Rollback ---

        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}