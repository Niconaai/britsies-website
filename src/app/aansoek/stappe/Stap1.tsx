// src/app/aansoek/stappe/Stap1LeerderInfo.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';

type StepProps = {
    onNext: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
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

export default function Step1LearnerInfo({ onNext, formData, handleInputChange }: StepProps) {
    // Expand validation check for required fields in this step
    const canProceed =
        formData.learnerSurname &&
        formData.learnerFirstNames &&
        formData.learnerIdNumber &&
        formData.learnerSchoolGrade &&
        formData.learnerSchoolYear &&
        formData.learnerLivesWith &&
        formData.learnerHomeLanguage &&
        formData.learnerRace &&
        formData.learnerNationality &&
        formData.learnerGender &&
        formData.learnerLastGradePassed &&
        formData.learnerYearsInGrade &&
        formData.learnerPreschool &&
        formData.familyStatus &&
        formData.parentsDeceased &&
        formData.prevSchoolName &&
        formData.agreeRules &&
        formData.agreePhotos &&
        formData.agreeIndemnity;

    // --- Define options for dropdowns ---
    const saLanguages = ["Afrikaans", "English", "Ander"];
    const raceOptions = ["Blank", "Swart", "Kleurling", "Indiër", "Asieër", "Ander"];

    return (
        <div className="space-y-4">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 1: LEERDERINLIGTING</h2>

            {/* TODO: Add Photo Upload Field */}
            <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">TODO: Foto Oplaai Komponent hier</span>
            </div>

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
                        <option value="" disabled>Kies Bevolkingsgroep</option>
                        {raceOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                {/* --- End Race Dropdown --- */}

                <InputField label="Nasionaliteit" name="learnerNationality" value={formData.learnerNationality} onChange={handleInputChange} required />

                {/* --- Add Gender --- */}
                <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
                <RadioGroup
                    label="Geslag" name="learnerGender" required={true}
                    options={[{ value: 'Male', label: 'Manlik' }, { value: 'Female', label: 'Vroulik' }]} // Add 'Other' if needed
                    selectedValue={formData.learnerGender} onChange={handleInputChange}
                />
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
                        <option value="" disabled>Kies Taal</option>
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
                        <option value="" disabled>Kies Graad</option>
                        {[8, 9, 10, 11, 12].map(grade => <option key={grade} value={grade}>Graad {grade}</option>)}
                    </select>
                </div>

                <InputField label="Jare in bogenoemde graad" name="learnerYearsInGrade" value={formData.learnerYearsInGrade} onChange={handleInputChange} type="number" required />

                {/* --- Preschool --- */}
                <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
                    <RadioGroup
                        label="Voorskoolse opvoeding bygewoon" name="learnerPreschool" required={true}
                        options={[{ value: 'Formal', label: 'Formeel' }, { value: 'Informal', label: 'Informeel' }, { value: 'Other', label: 'Ander' }]}
                        selectedValue={formData.learnerPreschool} onChange={handleInputChange}
                    />
                    {formData.learnerPreschool === 'Other' && (
                        <InputField label="Spesifiseer Ander" name="learnerPreschoolOther" value={formData.learnerPreschoolOther} onChange={handleInputChange} required className="mt-2" />
                    )}
                </div>
                {/* --- End Preschool --- */}


            </div>

            {/* --- Next of Kin --- */}
            <h3 className="pt-4 text-lg font-medium dark:text-white">NAASBESTAANDE-INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Naam en Van" name="nextOfKinFullName" value={formData.nextOfKinFullName} onChange={handleInputChange} className="md:col-span-2" required />
                <InputField label="Kontaknommer" name="nextOfKinContact" value={formData.nextOfKinContact} onChange={handleInputChange} type="tel" required />
                <InputField label="Alternatiewe Kontaknommer" name="nextOfKinContactAlt" value={formData.nextOfKinContactAlt} onChange={handleInputChange} type="tel" required />
                <InputField label="Verwantskap" name="nextOfKinRelationship" value={formData.nextOfKinRelationship} onChange={handleInputChange} required />
            </div>

            {/* --- Family Info --- */}
            <h3 className="pt-4 text-lg font-medium dark:text-white">FAMILIE-INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                {/* --- Add Family Status --- */}
                <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
                    <RadioGroup
                        label="Gesinstatus" name="familyStatus" required={true}
                        options={[
                            { value: 'both_parents', label: 'Beide ouers' },
                            { value: 'single_never_married', label: 'Enkelouer - nooit getroud' },
                            { value: 'single_divorced', label: 'Enkelouer - Geskei' },
                            { value: 'reconstituted', label: 'Hersaamgestel' },
                            { value: 'widow_widower', label: 'Weduwee / Wewenaar' },
                            { value: 'foster_care', label: 'Pleegsorg' },
                            { value: 'childrens_home', label: 'Kinderhuis' },
                            { value: 'other', label: 'Ander' },
                        ]}
                        selectedValue={formData.familyStatus} onChange={handleInputChange}
                    />
                    {/* Consider conditional input if formData.learnerLivesWith === 'other' */}
                    {formData.familyStatus === 'other' && (
                        <InputField label="Spesifiseer Ander" name="familyStatusOther" value={formData.familyStatusOther} onChange={handleInputChange} required className="mt-2" />
                    )}
                </div>
                {/* --- End Family Status --- */}

                {/* --- Add Parents Deceased --- */}
                <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
                    <RadioGroup
                        label="Ouers Oorlede" name="parentsDeceased" required={true}
                        options={[
                            { value: 'mother', label: 'Moeder' },
                            { value: 'father', label: 'Vader' },
                            { value: 'both', label: 'Beide' },
                            { value: 'none', label: 'Geen' },
                        ]}
                        selectedValue={formData.parentsDeceased} onChange={handleInputChange}
                    />
                </div>
                {/* --- End Parents Deceased --- */}

                <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
                    <RadioGroup
                        label="Leerder woon saam met:"
                        name="learnerLivesWith"
                        options={[
                            { value: 'both_parents', label: 'Albei Ouers' },
                            { value: 'guardian1', label: 'Ouer/Voog 1' },
                            { value: 'guardian2', label: 'Ouer/Voog 2' },
                            { value: 'other', label: 'Ander' }
                        ]}
                        selectedValue={formData.learnerLivesWith}
                        onChange={handleInputChange}
                        required={true}
                    />
                    {/* Consider conditional input if formData.learnerLivesWith === 'other' */}
                    {formData.learnerLivesWith === 'other' && (
                        <InputField label="Spesifiseer Ander" name="learnerLivesWithOther" value={formData.learnerLivesWithOther} onChange={handleInputChange} required className="mt-2" />
                    )}
                </div>

            </div>

            {/* Navigation Button */}
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