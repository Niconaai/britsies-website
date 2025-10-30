// src/app/aansoek/AdmissionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
// --- Import the step components ---
import Step1LearnerInfo from './stappe/Stap1';
import Step2Guardian1 from './stappe/Stap2';
import Step3Guardian2 from './stappe/Stap3';
import Step4Payer from './stappe/Stap4';
import Step5AdditionalInfo from './stappe/Stap5';
import Step6Documents from './stappe/Stap6';
// --- End Imports ---

// --- Define type for file state ---
export type FileState = {
    learnerPhoto?: File | null;
    docBirthCert?: File | null;
    docG1Id?: File | null;
    docG2Id?: File | null;
    docProofOfAddress?: File | null;
    docMedicalAid?: File | null;
    docPrevReport?: File | null;
    docOorplasingSert?: File | null;
    docPortefeulje?: File | null; // Renamed from Stap6 'docPrevReport'
    docGedragsverslag?: File | null;
};
// --- End File State type ---

//form data for all the information captured
export type FormData = {
    // Step 1 fields:
    learnerSurname?: string;
    learnerFirstNames?: string;
    learnerNickName?: string;
    learnerIdNumber?: string;
    learnerDob?: string;
    learnerHomeLanguage?: string;
    learnerRace?: string;
    learnerSchoolGrade?: string;
    learnerSchoolYear?: string;
    learnerCellPhone?: string;
    learnerEmail?: string;
    learnerReligion?: string;
    familyNumChildren?: string;
    familyLearnerPosition?: string;
    nextOfKinFullName?: string;
    nextOfKinRelationship?: string;
    nextOfKinContact?: string;
    nextOfKinContactAlt?: string;
    learnerLivesWith?: string;
    learnerLivesWithOther?: string;
    learnerNationality?: string;
    learnerGender?: 'Manlik' | 'Vroulik' | string;
    learnerLastGradePassed?: string;
    learnerYearsInGrade?: string;
    learnerPreschool?: 'Formal' | 'Informal' | 'Other' | string;
    learnerPreschoolOther?: string;
    familyStatus?: string;
    familyStatusOther?: string;
    parentsDeceased?: string;
    prevSchoolName?: string;
    // agreeRules?: boolean;
    // agreePhotos?: boolean;
    // agreeIndemnity?: boolean;
    toelatingsDatum?: string;

    //Step2 Fields:
    g1Relationship?: string; // Relationship to learner 
    g1Title?: string; // e.g., Mr, Mrs, Dr
    g1Initials?: string;
    g1FirstName?: string;
    g1Nickname?: string;
    g1Surname?: string;
    g1IdNumber?: string;
    g1MaritalStatus?: string; // Dropdown or Radio?
    g1CellPhone?: string;
    g1WorkPhone?: string;
    g1Email?: string;
    g1ResAddressLine1?: string;
    g1ResAddressLine2?: string;
    g1ResAddressCity?: string;
    g1ResAddressCode?: string;
    g1PostalSameAsRes?: boolean; // Checkbox
    g1PostalAddressLine1?: string;
    g1PostalAddressLine2?: string;
    g1PostalAddressCity?: string;
    g1PostalAddressCode?: string;
    g1Employer?: string;
    g1Occupation?: string;
    g1WorkAddress?: string;
    g1Huistaal?: string;
    g1KommunikasieVoorkeur?: string[];
    g1Beroepstatus?: string;
    g1WorkEmail?: string;

    //Step 3 fields:
    g2NotApplicable?: boolean;
    g2Relationship?: string;
    g2Title?: string;
    g2Initials?: string;
    g2FirstName?: string;
    g2Nickname?: string; // Added from Stap2 code
    g2Surname?: string;
    g2IdNumber?: string;
    g2MaritalStatus?: string;
    g2Huistaal?: string; // Added from Stap2 code
    g2KommunikasieVoorkeur?: string[];
    g2CellPhone?: string;
    g2WorkPhone?: string;
    g2Email?: string;
    g2ResAddressLine1?: string;
    g2ResAddressLine2?: string;
    g2ResAddressCity?: string;
    g2ResAddressCode?: string;
    g2PostalSameAsRes?: boolean;
    g2PostalAddressLine1?: string;
    g2PostalAddressLine2?: string;
    g2PostalAddressCity?: string;
    g2PostalAddressCode?: string;
    g2Beroepstatus?: string; // Added from Stap2 code
    g2Employer?: string;
    g2Occupation?: string;
    g2WorkAddress?: string;
    g2WorkEmail?: string;

    // --- Add Fields for Step 4 (Payer - PDF Page 5 & 6) ---
    payerType?: string; // 
    // Payer Individual/Company Details (Conditional based on payerType)
    payerFullName?: string; // If 'individual' or 'company' representative
    payerIdNumber?: string; // If 'individual'
    payerCompanyRegNo?: string; // If 'company'
    payerVatNo?: string; // If 'company'
    payerTelWork?: string;
    payerTelCell?: string;
    payerEmail?: string;
    payerPostalAddressLine1?: string; // Potentially copy from G1/G2 if selected
    payerPostalAddressLine2?: string;
    payerPostalAddressCity?: string;
    payerPostalAddressCode?: string;
    // Debit Order Details (PDF Page 6)
    debitBankName?: string;
    debitBranchCode?: string;
    debitAccountNumber?: string;
    debitAccountType?: string;
    debitAccountHolder?: string;
    debitDate?: string; // Select for day of month
    debitAgreeTerms?: boolean; // Checkbox for debit order terms
    // Contract Info (PDF Page 6)
    contractSignatoryName?: string; // Name of person signing
    contractSignatoryId?: string; // ID of person signing
    contractSignatoryCapacity?: string; // e.g., Parent, Guardian
    contractAgreeTerms?: boolean; // Checkbox for general contract terms
    // --- End Fields for Step 4 ---

    // --- Add Fields for Step 5 (PDF Page 3 & 8) ---
    // Health (Page 3)
    healthAllergies?: string;
    healthIllnesses?: string;
    healthDisabilities?: string;
    healthOperations?: string;
    healthMedication?: string; // Added from PDF review
    healthAdditionalInfo?: string; // Added from PDF review
    // Medical Aid (Page 3)
    medAidScheme?: string;
    medAidNumber?: string;
    medAidMainMember?: string;
    medAidMemberId?: string;
    // Doctor (Page 3)
    doctorName?: string;
    doctorNumber?: string;
    // Previous School (Page 3)
    //prevSchoolName?: string;
    prevSchoolTown?: string;
    prevSchoolProvince?: string;
    prevSchoolTel?: string;
    prevSchoolReasonForLeaving?: string;
    // prevSchoolLastGrade? - Captured in Step 1
    // prevSchoolYearsAttended? - Captured in Step 1
    // Extracurricular (Page 8)
    extraCulture?: string[]; // Textarea might be best
    extraSummerSport?: string[]; // Textarea might be best
    extraWinterSport?: string[]; // Textarea might be best
    extraAchievements?: string; // Textarea might be best
    // --- End Fields for Step 5 ---

    // --- Add Fields for Step 6 (Agreements) ---
    agreeRules?: boolean;
    agreePhotos?: boolean;
    agreeIndemnity?: boolean;
    agreeFinancial?: boolean; // General financial agreement
    acceptHandtekening?: string;
    // --- End Fields for Step 6 ---
};

export default function AdmissionForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({});
    // --- Add State for Files ---
    const [fileData, setFileData] = useState<FileState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const router = useRouter();
    // --- End File State ---

    useEffect(() => {
        // Scroll to the top of the page whenever the step changes
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, [currentStep]); // Dependency array: only runs when currentStep changes
    // --- END ADDITION ---

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6)); // Ensure step doesn't exceed 6
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1)); // Ensure step doesn't go below 1

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const checked = (event.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        console.log('Updated formData:', { ...formData, [name]: value }); // For debugging
    };

    // --- Update Submit Handler ---
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        console.log("Starting submission...");

        // 1. Create FormData object
        const apiFormData = new FormData();

        // 2. Append all text/checkbox/select data
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    apiFormData.append(key, JSON.stringify(value));
                } else {
                    apiFormData.append(key, String(value));
                }
            }
        });

        // 3. Append all file data
        Object.entries(fileData).forEach(([key, file]) => {
            if (file) {
                apiFormData.append(key, file, file.name);
            }
        });

        // 4. Send to the API route
        try {
            const response = await fetch('/api/apply', {
                method: 'POST',
                body: apiFormData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit application.');
            }

            console.log("Submission successful:", result);

            // --- REDIRECT ON SUCCESS ---
            // This sends the user to the /aansoek page, which will now
            // act as their portal (as we discussed).
            window.location.href = '/aansoek';

        } catch (error) {
            console.error("Submission error:", error);
            setSubmitError(error instanceof Error ? error.message : "An unknown error occurred.");
            setIsSubmitting(false); // <-- Stop loading on error
        }
    };
    // --- End Submit Handler ---

    // --- Add Handler for File Inputs ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            setFileData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFileData(prev => ({ ...prev, [name]: null }));
        }
    };
    // --- End File Handler ---

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
            
            {/* --- 1. ERROR STATE --- */}
            {submitError && (
                <div className="rounded-md bg-red-100 p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800">Fout met Aansoek</h3>
                    <p className="mt-2 text-red-700">{submitError}</p>
                    <button 
                        type="button" 
                        onClick={() => {
                            setSubmitError(null); 
                            // Optional: send them back to the last step
                            // setCurrentStep(6); 
                        }} 
                        className="mt-6 rounded bg-red-600 px-6 py-2 font-semibold text-white shadow-sm hover:bg-red-700"
                    >
                        Probeer Weer
                    </button>
                </div>
            )}

            {/* --- 2. LOADING STATE --- */}
            {/* Assumes you have a file at /public/loading.gif */}
            {isSubmitting && (
                <div className="flex flex-col items-center justify-center p-12">
                    <Image
                        src="/CircleLoader.gif" // <-- MAKE SURE THIS FILE EXISTS IN /public
                        alt="Besig om te laai..."
                        width={100} // Adjust size as needed
                        height={100}
                        unoptimized={true} // Important for GIFs
                    /> 
                    <p className="mt-4 text-lg font-semibold dark:text-white">
                        Besig om jou aansoek te verwerk...
                    </p>
                    <p className="dark:text-zinc-400">Moet asseblief nie hierdie bladsy toemaak nie.</p>
                </div>
            )}

            {/* --- 3. FORM STATE --- */}
            {/* Show the form steps only if NOT submitting and NO error */}
            {!isSubmitting && !submitError && (
                <>
                    {currentStep === 1 && <Step1LearnerInfo onNext={nextStep} formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />}
                    {currentStep === 2 && <Step2Guardian1 onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 3 && <Step3Guardian2 onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 4 && <Step4Payer onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 5 && <Step5AdditionalInfo onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 6 && <Step6Documents onBack={prevStep} formData={formData} fileData={fileData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />} 
                    
                    {/* Progress indicator */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Stap {currentStep} van 6
                    </div>
                </>
            )}
        </form>
    );
}