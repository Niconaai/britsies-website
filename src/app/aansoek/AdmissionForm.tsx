// src/app/aansoek/AdmissionForm.tsx
'use client';

import { useState } from 'react';
// --- Import the step components ---
import Step1LearnerInfo from './stappe/Stap1';
import Step2Guardian1 from './stappe/Stap2';
import Step3Guardian2 from './stappe/Stap3';
import Step4Payer from './stappe/Stap4';
import Step5AdditionalInfo from './stappe/Stap5';
import Step6Documents from './stappe/Stap6';
// --- End Imports ---

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
    agreeRules?: boolean;
    agreePhotos?: boolean;
    agreeIndemnity?: boolean;
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

    // Add more fields for subsequent steps here later
};

export default function AdmissionForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({});

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Final Form Data:", formData); // Log final data
        alert('Finale indiening nog nie geïmplementeer nie.');
        // Call API route here later
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
            {/* Render the imported step components */}
            {currentStep === 1 && <Step1LearnerInfo onNext={nextStep} formData={formData} handleInputChange={handleInputChange} />}
            {currentStep === 2 && <Step2Guardian1 onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
            {currentStep === 3 && <Step3Guardian2 onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
            {/*{currentStep === 4 && <Step4Payer onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />} */}
            {currentStep === 4 && <Step4Payer onNext={nextStep} onBack={prevStep} />}
            {/*{currentStep === 5 && <Step5AdditionalInfo onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />} */}
            {currentStep === 5 && <Step5AdditionalInfo onNext={nextStep} onBack={prevStep} />}
            {/*{currentStep === 6 && <Step6Documents onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />} {/* Also pass to Step 6 */}
            {currentStep === 6 && <Step6Documents onBack={prevStep} />} 
            
             {/* Progress indicator */}
             <div className="mt-6 text-center text-sm text-gray-500">
                Stap {currentStep} van 6
             </div>
        </form>
    );
}