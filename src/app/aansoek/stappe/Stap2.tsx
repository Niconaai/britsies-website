// src/app/aansoek/steps/Step2.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";
import FloatingLabelSelectField from "@/components/ui/FloatingLabelSelectField";

// --- Reusable CheckboxField (Copy from Stap1 or import) ---
const CheckboxField = ({ label, name, checked, onChange, required = false }: {
    label: string | React.ReactNode; name: string; checked: boolean | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) => (
    <label className="flex items-center space-x-2">
        <input type="checkbox" name={name} checked={!!checked} onChange={onChange} required={required}
            className="form-checkbox h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700" />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
    </label>
);
// --- End CheckboxField ---

// --- MultiCheckboxGroup Component ---
const MultiCheckboxGroup = ({ label, namePrefix, options, selectedValues, onChange, required = false }: {
    label: string;
    namePrefix: string;
    options: { value: string; label: string }[];
    selectedValues: string[] | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) => (
    <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
        <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label} {required && <span className="text-red-800">*</span>}
        </span>
        <div className="mt-2 space-y-2">
            {options.map(option => (
                <label key={option.value} className="flex items-center">
                    <input
                        type="checkbox"
                        name={`${namePrefix}_${option.value}`}
                        value={option.value}
                        checked={selectedValues?.includes(option.value) ?? false}
                        onChange={onChange}
                        className="form-checkbox h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                    />
                    <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-100">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);
// --- End MultiCheckboxGroup ---

type StepProps = {
    onNext: () => void;
    onBack: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};

export default function Step2Guardian1({ onNext, onBack, formData, handleInputChange }: StepProps) {
    const canProceed = //true;
        formData.g1MaritalStatus &&
        formData.g1Relationship &&
        formData.g1FirstName &&
        formData.g1Surname &&
        formData.g1Nickname &&
        formData.g1IdNumber &&
        formData.g1KommunikasieVoorkeur &&
        formData.g1CellPhone &&
        formData.g1Email &&
        formData.g1ResAddressLine1 &&
        formData.g1ResAddressCity &&
        formData.g1ResAddressCode &&
        ((formData.g1PostalAddressLine1 &&
            formData.g1PostalAddressCity &&
            formData.g1PostalAddressCode) || formData.g1PostalSameAsRes) &&
        formData.g1Beroepstatus;

    const maritalStatusOptions = ["Getroud", "Ongetroud", "Geskei", "Weduwee/Wewenaar", "Ander"];
    const relationshipOptions = ["Moeder", "Vader", "Voog", "Ander"];
    const titelOptions = ["Mnr", "Mev", "Me", "Dr", "Prof", "Ds", "Ander"]
    const communicationOptions = [
        { value: "email", label: "E-pos" },
        { value: "sms", label: "SMS" },
    ];
    const huistaalOptions = ["Afrikaans", "Engels", "Ander"];
    const beroepOptions = ["Deeltyds", "Eie Werkgewer nie-professioneel", "Eie Werkgewer professioneel", "Huisvrou", "Kontrakwerker", "Pensionaris", "Student", "Tydelik", "Voltyds", "Werkloos"];

    const handleCommunicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.g1KommunikasieVoorkeur || [];
        let newSelection;

        if (checked) {
            newSelection = [...currentSelection, value];
        } else {
            newSelection = currentSelection.filter(item => item !== value);
        }
        handleInputChange({
            target: { name: 'g1KommunikasieVoorkeur', value: newSelection }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 2: OUER / VOOG 1 INLIGTING</h2>

            {/* --- Personal Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">PERSOONLIKE INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FloatingLabelSelectField
                    label="Huwelikstatus"
                    name="g1MaritalStatus"
                    value={formData.g1MaritalStatus || ''}
                    onChange={handleInputChange}
                    options={maritalStatusOptions}
                    required
                />
                <FloatingLabelSelectField
                    label="Verwantskap met Leerder"
                    name="g1Relationship"
                    value={formData.g1Relationship || ''}
                    onChange={handleInputChange}
                    options={relationshipOptions}
                    required
                />
                <FloatingLabelSelectField
                    label="Titel"
                    name="g1Title"
                    value={formData.g1Title || ''}
                    onChange={handleInputChange}
                    options={titelOptions}
                    required
                />
                <FloatingLabelInputField label="Volle name" name="g1FirstName" value={formData.g1FirstName} onChange={handleInputChange} required className="" />
                <FloatingLabelInputField label="Van" name="g1Surname" value={formData.g1Surname} onChange={handleInputChange} required className="" />
                <FloatingLabelInputField label="Noemnaam" name="g1Nickname" value={formData.g1Nickname} onChange={handleInputChange} required className="" />
                <FloatingLabelInputField label="Voorletters" name="g1Initials" value={formData.g1Initials} onChange={handleInputChange} />
                <FloatingLabelInputField label="ID Nommer" name="g1IdNumber" value={formData.g1IdNumber} onChange={handleInputChange} required className="md:col-span-2" />
                <FloatingLabelSelectField
                    label="Huistaal"
                    name="g1Huistaal"
                    value={formData.g1Huistaal || ''}
                    onChange={handleInputChange}
                    options={huistaalOptions}
                    required
                />
                <MultiCheckboxGroup
                    label="Kommunikasievoorkeur"
                    namePrefix="g1KommunikasieVoorkeur"
                    options={communicationOptions}
                    selectedValues={formData.g1KommunikasieVoorkeur} 
                    onChange={handleCommunicationChange}
                    required={true}
                />

            </div>

            {/* --- Contact Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">KONTAKBESONDERHEDE</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInputField label="Selfoonnommer" name="g1CellPhone" value={formData.g1CellPhone} onChange={handleInputChange} type="tel" required />
                <FloatingLabelInputField label="E-pos" name="g1Email" value={formData.g1Email} onChange={handleInputChange} type="email" required />
            </div>

            {/* --- Residential Address --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">WOONADRES</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInputField label="Adres Lyn 1" name="g1ResAddressLine1" value={formData.g1ResAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                <FloatingLabelInputField label="Adres Lyn 2" name="g1ResAddressLine2" value={formData.g1ResAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                <FloatingLabelInputField label="Stad / Dorp" name="g1ResAddressCity" value={formData.g1ResAddressCity} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Poskode" name="g1ResAddressCode" value={formData.g1ResAddressCode} onChange={handleInputChange} required />
            </div>

            {/* --- Postal Address --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">POSADRES</h3>
            <CheckboxField
                label="Dieselfde as Woonadres"
                name="g1PostalSameAsRes"
                checked={formData.g1PostalSameAsRes}
                onChange={handleInputChange}
            />
            {/* Show postal address fields only if checkbox is NOT checked */}
            {!formData.g1PostalSameAsRes && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FloatingLabelInputField label="Adres Lyn 1" name="g1PostalAddressLine1" value={formData.g1PostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                    <FloatingLabelInputField label="Adres Lyn 2" name="g1PostalAddressLine2" value={formData.g1PostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                    <FloatingLabelInputField label="Stad / Dorp" name="g1PostalAddressCity" value={formData.g1PostalAddressCity} onChange={handleInputChange} required />
                    <FloatingLabelInputField label="Poskode" name="g1PostalAddressCode" value={formData.g1PostalAddressCode} onChange={handleInputChange} required />
                </div>
            )}

            {/* --- Occupation --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">BEROEPSTATUS</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelSelectField
                    label="Beroepstatus"
                    name="g1Beroepstatus"
                    value={formData.g1Beroepstatus || ''}
                    onChange={handleInputChange}
                    options={beroepOptions}
                    required
                />
                <FloatingLabelInputField label="Beroep" name="g1Occupation" value={formData.g1Occupation} onChange={handleInputChange} className="" />
                <FloatingLabelInputField label="Werkgewer" name="g1Employer" value={formData.g1Employer} onChange={handleInputChange} className="md:col-span-2" />
                <FloatingLabelInputField label="Werk Telefoon" name="g1WorkPhone" value={formData.g1WorkPhone} onChange={handleInputChange} type="tel" className="" />
                <FloatingLabelInputField label="Werk Epos" name="g1WorkEmail" value={formData.g1WorkEmail} onChange={handleInputChange} type="email" className="" />
                <FloatingLabelInputField label="Werkadres" name="g1WorkAddress" value={formData.g1WorkAddress} onChange={handleInputChange} className="md:col-span-2" />
            </div>

            {/* Navigation Buttons */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                    Terug
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`rounded px-6 py-2 text-white ${canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'}`}
                    title={!canProceed ? "Voltooi asseblief alle vereiste velde (*)" : ""}
                >
                    Volgende
                </button>
            </div>
        </div>
    );
}