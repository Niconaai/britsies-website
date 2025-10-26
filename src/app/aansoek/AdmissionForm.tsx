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
            {currentStep === 4 && <Step4Payer onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
            {currentStep === 5 && <Step5AdditionalInfo onNext={nextStep} onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />}
            {currentStep === 6 && <Step6Documents onBack={prevStep} formData={formData} handleInputChange={handleInputChange} />} {/* Also pass to Step 6 */}

             {/* Progress indicator */}
             <div className="mt-6 text-center text-sm text-gray-500">
                Stap {currentStep} van 6
             </div>
        </form>
    );
}