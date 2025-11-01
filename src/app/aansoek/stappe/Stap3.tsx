// src/app/aansoek/stappe/Stap3.tsx
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

// --- Update Component Name ---
export default function Step2Guardian1({ onNext, onBack, formData, handleInputChange }: StepProps) {
    const isApplicable = !formData.g2NotApplicable;
    const requiredFieldsFilled =
        formData.g2NotApplicable || (
            formData.g2Relationship &&
            formData.g2FirstName &&
            formData.g2Surname &&
            formData.g2Nickname &&
            formData.g2IdNumber &&
            formData.g2KommunikasieVoorkeur &&
            formData.g2CellPhone &&
            formData.g2Email &&
            formData.g2ResAddressLine1 &&
            formData.g2ResAddressCity &&
            formData.g2ResAddressCode &&
            ((formData.g2PostalAddressLine1 &&
                formData.g2PostalAddressCity &&
                formData.g2PostalAddressCode) || formData.g2PostalSameAsRes) &&
            formData.g2Beroepstatus)
        ;
    const canProceed = formData.g2NotApplicable || (isApplicable && requiredFieldsFilled);

    const maritalStatusOptions = ["Getroud", "Ongetroud", "Geskei", "Weduwee/Wewenaar", "Ander"];
    const relationshipOptions = ["Moeder", "Vader", "Voog", "Ander"];
    const titelOptions = ["Mnr", "Mev", "Me", "Dr", "Prof", "Ds", "Ander"]
    const communicationOptions = [
        { value: "email", label: "E-pos" },
        { value: "sms", label: "SMS" },
    ];
    const huistaalOptions = ["Afrikaans", "Engels", "Ander"];
    const beroepOptions = ["Deeltyds", "Eie Werkgewer nie-professioneel", "Eie Werkgewer professioneel", "Huisvrou", "Kontrakwerker", "Pensionaris", "Student", "Tydelik", "Voltyds", "Werkloos"];

    // --- Special handler for MultiCheckboxGroup ---
    const handleCommunicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.g2KommunikasieVoorkeur || [];
        let newSelection;

        if (checked) {
            newSelection = [...currentSelection, value];
        } else {
            newSelection = currentSelection.filter(item => item !== value);
        }
        handleInputChange({
            target: { name: 'g2KommunikasieVoorkeur', value: newSelection }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    // --- End Special Handler ---

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 3: OUER / VOOG 2 INLIGTING</h2>

            <CheckboxField
                label="Ouer / Voog 2 Nie van Toepassing"
                name="g2NotApplicable"
                checked={formData.g2NotApplicable}
                onChange={handleInputChange}
            />

            {!formData.g2NotApplicable && (
                <React.Fragment>
                    {/* --- Personal Info --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="text-lg font-medium dark:text-white">PERSOONLIKE INLIGTING</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FloatingLabelSelectField
                            label="Huwelikstatus"
                            name="g2MaritalStatus"
                            value={formData.g2MaritalStatus || ''}
                            onChange={handleInputChange}
                            options={maritalStatusOptions}
                            required
                        />
                        <FloatingLabelSelectField
                            label="Verwantskap met Leerder"
                            name="g2Relationship"
                            value={formData.g2Relationship || ''}
                            onChange={handleInputChange}
                            options={relationshipOptions}
                            required
                        />
                        <FloatingLabelSelectField
                            label="Titel"
                            name="g2Title"
                            value={formData.g2Title || ''}
                            onChange={handleInputChange}
                            options={titelOptions}
                            required
                        />
                        <FloatingLabelInputField label="Volle name" name="g2FirstName" value={formData.g2FirstName} onChange={handleInputChange} required className="" />
                        <FloatingLabelInputField label="Van" name="g2Surname" value={formData.g2Surname} onChange={handleInputChange} required className="" />
                        <FloatingLabelInputField label="Noemnaam" name="g2Nickname" value={formData.g2Nickname} onChange={handleInputChange} required className="" />
                        <FloatingLabelInputField label="Voorletters" name="g2Initials" value={formData.g2Initials} onChange={handleInputChange} />
                        <FloatingLabelInputField label="ID Nommer" name="g2IdNumber" value={formData.g2IdNumber} onChange={handleInputChange} required className="md:col-span-2" />
                        <FloatingLabelSelectField
                            label="Huistaal"
                            name="g2Huistaal"
                            value={formData.g2Huistaal || ''}
                            onChange={handleInputChange}
                            options={huistaalOptions}
                            required
                        />
                        <MultiCheckboxGroup
                            label="Kommunikasievoorkeur"
                            namePrefix="g2KommunikasieVoorkeur" // Base name for state
                            options={communicationOptions}
                            selectedValues={formData.g2KommunikasieVoorkeur} // Pass the array
                            onChange={handleCommunicationChange} // Use the special handler
                            required={true}
                        />

                    </div>

                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    {/* --- Contact Info --- */}
                    <h3 className="pt-4 text-lg font-medium dark:text-white">KONTAKBESONDERHEDE</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FloatingLabelInputField label="Selfoonnommer" name="g2CellPhone" value={formData.g2CellPhone} onChange={handleInputChange} type="tel" required />
                        <FloatingLabelInputField label="E-pos" name="g2Email" value={formData.g2Email} onChange={handleInputChange} type="email" required />
                    </div>

                    {/* --- Residential Address --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">WOONADRES</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FloatingLabelInputField label="Adres Lyn 1" name="g2ResAddressLine1" value={formData.g2ResAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                        <FloatingLabelInputField label="Adres Lyn 2" name="g2ResAddressLine2" value={formData.g2ResAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                        <FloatingLabelInputField label="Stad / Dorp" name="g2ResAddressCity" value={formData.g2ResAddressCity} onChange={handleInputChange} required />
                        <FloatingLabelInputField label="Poskode" name="g2ResAddressCode" value={formData.g2ResAddressCode} onChange={handleInputChange} required />
                    </div>

                    {/* --- Postal Address --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">POSADRES</h3>
                    <CheckboxField
                        label="Dieselfde as Woonadres"
                        name="g2PostalSameAsRes"
                        checked={formData.g2PostalSameAsRes}
                        onChange={handleInputChange}
                    />
                    {/* Show postal address fields only if checkbox is NOT checked */}
                    {!formData.g2PostalSameAsRes && (
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FloatingLabelInputField label="Adres Lyn 1" name="g2PostalAddressLine1" value={formData.g2PostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                            <FloatingLabelInputField label="Adres Lyn 2" name="g2PostalAddressLine2" value={formData.g2PostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                            <FloatingLabelInputField label="Stad / Dorp" name="g2PostalAddressCity" value={formData.g2PostalAddressCity} onChange={handleInputChange} required />
                            <FloatingLabelInputField label="Poskode" name="g2PostalAddressCode" value={formData.g2PostalAddressCode} onChange={handleInputChange} required />
                        </div>
                    )}

                    {/* --- Occupation --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">BEROEPSTATUS</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FloatingLabelSelectField
                            label="Beroepstatus"
                            name="g2Beroepstatus"
                            value={formData.g2Beroepstatus || ''}
                            onChange={handleInputChange}
                            options={beroepOptions}
                            required
                        />
                        <FloatingLabelInputField label="Beroep" name="g2Occupation" value={formData.g2Occupation} onChange={handleInputChange} className="" />
                        <FloatingLabelInputField label="Werkgewer" name="g2Employer" value={formData.g2Employer} onChange={handleInputChange} className="md:col-span-2" />
                        <FloatingLabelInputField label="Werk Telefoon" name="g2WorkPhone" value={formData.g2WorkPhone} onChange={handleInputChange} type="tel" className="" />
                        <FloatingLabelInputField label="Werk Epos" name="g2WorkEmail" value={formData.g2WorkEmail} onChange={handleInputChange} type="email" className="" />
                        <FloatingLabelInputField label="Werkadres" name="g2WorkAddress" value={formData.g2WorkAddress} onChange={handleInputChange} className="md:col-span-2" />
                    </div>
                </React.Fragment>
            )}

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