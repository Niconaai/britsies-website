// src/app/aansoek/stappe/Stap1LeerderInfo.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';
import FileInput from './FileInput';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";
import FloatingLabelSelectField from "@/components/ui/FloatingLabelSelectField";
import FloatingLabelSelectFieldCustom from "@/components/ui/FloatingLabelSelectFieldCustom";

type StepProps = {
    onNext: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step1LearnerInfo({ onNext, formData, handleInputChange, handleFileChange }: StepProps) {
    // Expand validation check for required fields in this step
    const canProceed = //true;
        formData.learnerFirstNames &&
        formData.learnerNickName &&
        formData.learnerSurname &&
        formData.learnerDob &&
        formData.learnerIdNumber &&
        formData.learnerRace &&
        formData.learnerNationality &&
        formData.learnerGender &&
        formData.learnerHomeLanguage &&
        formData.learnerLastGradePassed &&
        formData.learnerYearsInGrade &&
        formData.learnerLivesWith &&
        formData.learnerYearsInGrade &&
        formData.learnerPreschool &&
        formData.nextOfKinFullName &&
        formData.nextOfKinRelationship &&
        formData.nextOfKinContact &&
        formData.familyStatus &&
        formData.parentsDeceased &&
        formData.learnerLivesWith;

    // --- Define options for dropdowns ---
    const saLanguages = ["Afrikaans", "English", "Ander"];
    const raceOptions = ["Blank", "Swart", "Kleurling", "Indiër", "Asieër", "Ander"];
    const genderOptions = ["Manlik", "Vroulik"];
    const voorskoolOptions = ["Formeel", "Informeel", "Ander"];
    const gesinstatusOptions = [
        { value: 'both_parents', label: 'Beide ouers' },
        { value: 'single_never_married', label: 'Enkelouer - Nooit Getroud' },
        { value: 'single_divorced', label: 'Enkelouer - Geskei' },
        { value: 'reconstituted', label: 'Hersaamgestel' },
        { value: 'widow_widower', label: 'Weduwee / Wewenaar' },
        { value: 'foster_care', label: 'Pleegsorg' },
        { value: 'childrens_home', label: 'Kinderhuis' },
        { value: 'other', label: 'Ander' },
    ];
    const ouersOorledeOptions = [
        { value: 'mother', label: 'Moeder' },
        { value: 'father', label: 'Vader' },
        { value: 'both', label: 'Beide' },
        { value: 'none', label: 'Geen' },
    ];
    const leerderWoonSaamOptions = [
        { value: 'both_parents', label: 'Albei Ouers' },
        { value: 'guardian1', label: 'Ouer/Voog 1' },
        { value: 'guardian2', label: 'Ouer/Voog 2' },
        { value: 'other', label: 'Ander' }
    ];
    const graadOptions = [
        { value: "7", label: "Graad 7" },
        { value: "8", label: "Graad 8" },
        { value: "9", label: "Graad 9" },
        { value: "10", label: "Graad 10" },
        { value: "11", label: "Graad 11" },
    ];

    return (
        <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 1: LEERDERINLIGTING</h2>

            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                <FileInput
                    label="Leerder Foto (Paskop-grootte)"
                    name="learnerPhoto"
                    onChange={handleFileChange}
                    required 
                    accept="image/png, image/jpeg"
                    description="Laai asseblief 'n duidelike, onlangse paskop-grootte foto op."
                />
            </div>

            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 pb-4 text-lg font-medium dark:text-white">LEERDER</h3>
            {/* --- Learner Details Grid --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <FloatingLabelInputField
                    label="Volle Name"
                    name="learnerFirstNames"
                    value={formData.learnerFirstNames}
                    onChange={handleInputChange}
                    required
                />
                <FloatingLabelInputField label="Van" name="learnerSurname" value={formData.learnerSurname} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Noemnaam" name="learnerNickName" value={formData.learnerNickName} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Geboortedatum" name="learnerDob" value={formData.learnerDob} onChange={handleInputChange} type="date" required />
                <FloatingLabelInputField label="ID Nommer" name="learnerIdNumber" value={formData.learnerIdNumber} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Kerkverband" name="learnerReligion" value={formData.learnerReligion} onChange={handleInputChange} />
                {/* --- Race Dropdown --- */}
                <FloatingLabelSelectField
                    label="Bevolkingsgroep"
                    name="learnerRace"
                    value={formData.learnerRace}
                    onChange={handleInputChange}
                    options={raceOptions}
                    required
                />
                {/* --- End Race Dropdown --- */}

                <FloatingLabelInputField label="Nasionaliteit" name="learnerNationality" value={formData.learnerNationality} onChange={handleInputChange} required />

                {/* --- Add Gender --- */}
                <FloatingLabelSelectField
                    label="Geslag"
                    name="learnerGender"
                    value={formData.learnerGender}
                    onChange={handleInputChange}
                    options={genderOptions}
                    required
                />
                {/* --- End Gender --- */}

                {/* --- Home Language Dropdown --- */}
                <FloatingLabelSelectField
                    label="Huistaal"
                    name="learnerHomeLanguage"
                    value={formData.learnerHomeLanguage || ''}
                    onChange={handleInputChange}
                    options={saLanguages}
                    required
                />
                {/* --- End Home Language Dropdown --- */}

                <FloatingLabelInputField label="Leerder Selfoonnommer" name="learnerCellPhone" value={formData.learnerCellPhone} onChange={handleInputChange} type="tel" />
                <FloatingLabelInputField label="Leerder E-posadres" name="learnerEmail" value={formData.learnerEmail} onChange={handleInputChange} type="email" />
                <FloatingLabelInputField label="Tolatingsdatum" name="toelatingsDatum" value={formData.toelatingsDatum} onChange={handleInputChange} type="date" />

                {/* Grade and Year Selection */}

                <FloatingLabelSelectFieldCustom
                    label="Hoogste Graad Geslaag"
                    name="learnerLastGradePassed"
                    value={formData.learnerLastGradePassed}
                    onChange={handleInputChange}
                    options={graadOptions}
                    required={true}
                />

                <FloatingLabelInputField label="Jare in bogenoemde graad" name="learnerYearsInGrade" value={formData.learnerYearsInGrade} onChange={handleInputChange} type="number" required />

                {/* --- Preschool --- */}
                <div>
                    <FloatingLabelSelectField
                        label="Voorskool"
                        name="learnerPreschool"
                        value={formData.learnerPreschool || ''}
                        onChange={handleInputChange}
                        options={voorskoolOptions}
                        required
                    />
                    {formData.learnerPreschool === 'Ander' && (
                        <FloatingLabelInputField
                            label="Spesifiseer Ander (Voorskool)"
                            name="learnerPreschoolOther"
                            value={formData.learnerPreschoolOther}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                        />
                    )}
                </div>
                {/* --- End Preschool --- */}


            </div>

            {/* --- Next of Kin --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">NAASBESTAANDE-INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInputField label="Naam en Van" name="nextOfKinFullName" value={formData.nextOfKinFullName} onChange={handleInputChange} className="" required />
                <FloatingLabelInputField label="Verwantskap" name="nextOfKinRelationship" value={formData.nextOfKinRelationship} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Kontaknommer" name="nextOfKinContact" value={formData.nextOfKinContact} onChange={handleInputChange} type="tel" required />
                <FloatingLabelInputField label="Alternatiewe Kontaknommer" name="nextOfKinContactAlt" value={formData.nextOfKinContactAlt} onChange={handleInputChange} type="tel" />
            </div>

            {/* --- Family Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">FAMILIE-INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
                {/* --- Add Family Status --- */}
                <div>
                    <FloatingLabelSelectFieldCustom
                        label="Gesin Samestelling"
                        name="familyStatus"
                        value={formData.familyStatus}
                        onChange={handleInputChange}
                        options={gesinstatusOptions}
                        required={true}
                    />
                    {formData.familyStatus === 'other' && (
                        <FloatingLabelInputField
                            label="Spesifiseer Ander"
                            name="familyStatusOther"
                            value={formData.familyStatusOther}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                        />
                    )}
                </div>
                {/* --- End Family Status --- */}

                {/* --- Add Parents Deceased --- */}
                <div>
                    <FloatingLabelSelectFieldCustom
                        label="Ouers Oorlede"
                        name="parentsDeceased"
                        value={formData.parentsDeceased}
                        onChange={handleInputChange}
                        options={ouersOorledeOptions}
                        required={true}
                    />
                </div>
                {/* --- End Parents Deceased --- */}
                <div>
                    <FloatingLabelSelectFieldCustom
                        label="Leerder woon by"
                        name="learnerLivesWith"
                        value={formData.learnerLivesWith}
                        onChange={handleInputChange}
                        options={leerderWoonSaamOptions}
                        required={true}
                    />
                    {formData.learnerLivesWith === 'other' && (
                        <FloatingLabelInputField
                            label="Spesifiseer Ander"
                            name="learnerLivesWithOther"
                            value={formData.learnerLivesWithOther}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                        />
                    )}
                </div>

            </div>

            {/* Navigation Button */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <div className="flex justify-end pt-6">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`rounded px-4 py-2 text-white ${canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'}`}
                    title={!canProceed ? "Voltooi asseblief alle vereiste velde (*)" : ""}
                >
                    Volgende
                </button>
            </div>
        </div>
    );
}