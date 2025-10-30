// src/app/aansoek/stappe/Stap1LeerderInfo.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';
import FileInput from './FileInput';

type StepProps = {
    onNext: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({ label, name, value, onChange, required = false, type = 'text', placeholder = '', className = '' }: {
    label: string;
    name: string;
    value: string | number | undefined | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    type?: string;
    placeholder?: string;
    className?: string;
}) => (
    <div className={className}>
        <label htmlFor={name} className="block  text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label} {required && <span className="text-red-800">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="mt-2 mb-1 px-2 py-1 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
        />
    </div>
);

const RadioGroup = ({ label, name, options, selectedValue, onChange, required = false }: {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    selectedValue: string | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) => (
    <div className="">
        <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label} {required && <span className="text-red-800">*</span>}
        </span>
        <div className="mt-2 space-y-2">
            {options.map(option => (
                <label key={option.value} className="flex items-center">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={onChange}
                        required={required}
                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-100">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);

// const CheckboxField = ({ label, name, checked, onChange, required = false }: {
//     label: string | React.ReactNode;
//     name: string;
//     checked: boolean | undefined;
//     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//     required?: boolean;
// }) => (
//     <label className="flex items-start space-x-2">
//         <input
//             type="checkbox"
//             name={name}
//             checked={!!checked} // Ensure it's a boolean
//             onChange={onChange}
//             required={required}
//             className="form-checkbox mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
//         />
//         <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
//     </label>
// );

export default function Step1LearnerInfo({ onNext, formData, handleInputChange, handleFileChange }: StepProps) {
    // Expand validation check for required fields in this step
    const canProceed = true;
    // formData.learnerSurname &&
    // formData.learnerFirstNames &&
    // formData.learnerIdNumber &&
    // formData.learnerSchoolGrade &&
    // formData.learnerSchoolYear &&
    // formData.learnerLivesWith &&
    // formData.learnerHomeLanguage &&
    // formData.learnerRace &&
    // formData.learnerNationality &&
    // formData.learnerGender &&
    // formData.learnerLastGradePassed &&
    // formData.learnerYearsInGrade &&
    // formData.learnerPreschool &&
    // formData.familyStatus &&
    // formData.parentsDeceased &&
    // formData.prevSchoolName 

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

    return (
        <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 1: LEERDERINLIGTING</h2>

            {/* TODO: Add Photo Upload Field */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                <FileInput
                    label="Leerder Foto (Paskop-grootte)"
                    name="learnerPhoto"
                    onChange={handleFileChange}
                    required // Make photo required
                    accept="image/png, image/jpeg"
                    description="Laai asseblief 'n duidelike, onlangse paskop-grootte foto op."
                />
            </div>

            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">LEERDER</h3>
            {/* --- Learner Details Grid --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <InputField label="Volle Voorname" name="learnerFirstNames" value={formData.learnerFirstNames} onChange={handleInputChange} required />
                <InputField label="Noemnaam" name="learnerNickName" value={formData.learnerNickName} onChange={handleInputChange} required />
                <InputField label="Van" name="learnerSurname" value={formData.learnerSurname} onChange={handleInputChange} required />
                <InputField label="Geboortedatum (YYYY-MM-DD)" name="learnerDob" value={formData.learnerDob} onChange={handleInputChange} type="date" />
                <InputField label="ID Nommer" name="learnerIdNumber" value={formData.learnerIdNumber} onChange={handleInputChange} required />
                <InputField label="Kerkverband" name="learnerReligion" value={formData.learnerReligion} onChange={handleInputChange} />
                {/* --- Race Dropdown --- */}
                <div>
                    <label htmlFor="learnerRace" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Bevolkingsgroep <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="learnerRace"
                        name="learnerRace"
                        value={formData.learnerRace || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {raceOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                {/* --- End Race Dropdown --- */}

                <InputField label="Nasionaliteit" name="learnerNationality" value={formData.learnerNationality} onChange={handleInputChange} required />

                {/* --- Add Gender --- */}
                <div>
                    <label htmlFor="learnerGender" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Geslag <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="learnerGender"
                        name="learnerGender"
                        value={formData.learnerGender || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {genderOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                {/* --- End Gender --- */}

                {/* --- Home Language Dropdown --- */}
                <div>
                    <label htmlFor="learnerHomeLanguage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Huistaal <span className="text-red-800">*</span> {/* Made required */}
                    </label>
                    <select
                        id="learnerHomeLanguage"
                        name="learnerHomeLanguage"
                        value={formData.learnerHomeLanguage || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {saLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                {/* --- End Home Language Dropdown --- */}

                <InputField label="Leerder Selfoonnommer" name="learnerCellPhone" value={formData.learnerCellPhone} onChange={handleInputChange} type="tel" />
                <InputField label="Leerder e-posadres" name="learnerEmail" value={formData.learnerEmail} onChange={handleInputChange} type="email" />
                <InputField label="Tolatingsdatum" name="toelatingsDatum" value={formData.toelatingsDatum} onChange={handleInputChange} type="date" />

                {/* Grade and Year Selection */}

                <div>
                    <label htmlFor="learnerLastGradePassed" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Laaste Graad Behaal <span className="text-red-800">*</span>
                    </label>
                    <select id="learnerLastGradePassed" name="learnerLastGradePassed" value={formData.learnerLastGradePassed || ''} onChange={handleInputChange} required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                        <option value="" disabled>Kies Opsie</option>
                        {[7, 8, 9, 10, 11].map(grade => <option key={grade} value={grade}>Graad {grade}</option>)}
                    </select>
                </div>

                <InputField label="Jare in bogenoemde graad" name="learnerYearsInGrade" value={formData.learnerYearsInGrade} onChange={handleInputChange} type="number" required />

                {/* --- Preschool --- */}
                <div>
                    <label htmlFor="learnerPreschool" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Voorskoolse opvoeding bygewoon <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="learnerPreschool"
                        name="learnerPreschool"
                        value={formData.learnerPreschool || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {voorskoolOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {formData.learnerPreschool === 'Ander' && (
                        <InputField
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
                <InputField label="Naam en Van" name="nextOfKinFullName" value={formData.nextOfKinFullName} onChange={handleInputChange} className="" required />
                <InputField label="Verwantskap" name="nextOfKinRelationship" value={formData.nextOfKinRelationship} onChange={handleInputChange} required />
                <InputField label="Kontaknommer" name="nextOfKinContact" value={formData.nextOfKinContact} onChange={handleInputChange} type="tel" required />
                <InputField label="Alternatiewe Kontaknommer" name="nextOfKinContactAlt" value={formData.nextOfKinContactAlt} onChange={handleInputChange} type="tel" required />
            </div>

            {/* --- Family Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">FAMILIE-INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
                {/* --- Add Family Status --- */}
                <div>
                    <label htmlFor="familyStatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Gesinstatus <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="familyStatus"
                        name="familyStatus"
                        value={formData.familyStatus || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {gesinstatusOptions.map(option => <option key={option.value} value={option.label}>{option.label}</option>)}
                    </select>
                    {formData.familyStatus === 'Ander' && (
                        <InputField
                            label="Spesifiseer Ander (Gesinstatus)"
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
                    <label htmlFor="parentsDeceased" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Ouers Oorlede <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="parentsDeceased"
                        name="parentsDeceased"
                        value={formData.parentsDeceased || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {ouersOorledeOptions.map(option => <option key={option.value} value={option.label}>{option.label}</option>)}
                    </select>
                </div>
                {/* --- End Parents Deceased --- */}

                <div>
                    <label htmlFor="learnerLivesWith" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Leerder woon saam <span className="text-red-800">*</span>
                    </label>
                    <select
                        id="learnerLivesWith"
                        name="learnerLivesWith"
                        value={formData.learnerLivesWith || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                    >
                        <option value="" disabled>Kies Opsie</option>
                        {leerderWoonSaamOptions.map(option => <option key={option.value} value={option.label}>{option.label}</option>)}
                    </select>
                    {formData.learnerLivesWith === 'Ander' && (
                        <InputField
                            label="Spesifiseer Ander (Woon saam opsie)"
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