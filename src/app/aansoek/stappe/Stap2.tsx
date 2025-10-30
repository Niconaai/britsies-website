// src/app/aansoek/steps/Step2.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';

// --- Reusable InputField Component
const InputField = ({ label, name, value, onChange, required = false, type = 'text', placeholder = '', className = '', isTextArea = false }: {
    label: string; name: string; value: string | number | undefined | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean; type?: string; placeholder?: string; className?: string; isTextArea?: boolean;
}) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label} {required && <span className="text-red-800">*</span>}
        </label>
        {isTextArea ? (
            <textarea id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} rows={3}
                className="mt-2 mb-1 px-2 py-1 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white" />
        ) : (
            <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder}
                className="mt-2 mb-1 px-2 py-1 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white" />
        )}
    </div>
);
// --- End InputField ---

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
    selectedValues: string[] | undefined; // Array of selected values
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Use standard handler, logic is in parent
    required?: boolean; // Can add validation logic if needed
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
                        // Use a unique name for each checkbox based on prefix and value
                        name={`${namePrefix}_${option.value}`}
                        value={option.value} // Value attribute can be useful
                        // Check if the option's value is in the selectedValues array
                        checked={selectedValues?.includes(option.value) ?? false}
                        onChange={onChange} // Parent component needs logic to update the array
                        // Required validation on group level might need custom logic
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
        //{ value: "whatsapp", label: "WhatsApp" },
    ];
    const huistaalOptions = ["Afrikaans", "Engels", "Ander"];
    const beroepOptions = ["Deeltyds", "Eie Werkgewer nie-professioneel", "Eie Werkgewer professioneel", "Huisvrou", "Kontrakwerker", "Pensionaris", "Student", "Tydelik", "Voltyds", "Werkloos"];

    // --- Special handler for MultiCheckboxGroup ---
    const handleCommunicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.g1KommunikasieVoorkeur || [];
        let newSelection;

        if (checked) {
            // Add value to the array if not already present
            newSelection = [...currentSelection, value];
        } else {
            // Remove value from the array
            newSelection = currentSelection.filter(item => item !== value);
        }
        // Update the main form data state (simulate event for handleInputChange)
        handleInputChange({
            target: { name: 'g1KommunikasieVoorkeur', value: newSelection }
        } as unknown as React.ChangeEvent<HTMLInputElement>); // Type assertion needed
    };
    // --- End Special Handler ---

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 2: OUER / VOOG 1 INLIGTING</h2>

            {/* --- Personal Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">PERSOONLIKE INLIGTING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label htmlFor="g1MaritalStatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Huwelikstatus <span className="text-red-800">*</span>
                    </label>
                    <select id="g1MaritalStatus" name="g1MaritalStatus" value={formData.g1MaritalStatus || ''} onChange={handleInputChange}
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white" required>
                        <option value="" >Kies Opsie</option>
                        {maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div className="">
                    <label htmlFor="g1Relationship" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Verwantskap met Leerder <span className="text-red-800">*</span>
                    </label>
                    <select id="g1Relationship" name="g1Relationship" value={formData.g1Relationship || ''} onChange={handleInputChange} required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                        <option value="" disabled>Kies Opsie</option>
                        {relationshipOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="g1Title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Titel
                    </label>
                    <select
                        id="g1Title"
                        name="g1Title"
                        value={formData.g1Title || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"

                    >
                        <option value="" >Kies Opsie</option>
                        {titelOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <InputField label="Volle name" name="g1FirstName" value={formData.g1FirstName} onChange={handleInputChange} required className="" />
                <InputField label="Van" name="g1Surname" value={formData.g1Surname} onChange={handleInputChange} required className="" />
                <InputField label="Noemnaam" name="g1Nickname" value={formData.g1Nickname} onChange={handleInputChange} required className="" />
                <InputField label="Voorletters" name="g1Initials" value={formData.g1Initials} onChange={handleInputChange} />
                <InputField label="ID Nommer" name="g1IdNumber" value={formData.g1IdNumber} onChange={handleInputChange} required className="md:col-span-2" />
                <div>
                    <label htmlFor="g1Huistaal" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Huistaal
                    </label>
                    <select
                        id="g1Huistaal"
                        name="g1Huistaal"
                        value={formData.g1Huistaal || ''}
                        onChange={handleInputChange}
                        required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"

                    >
                        <option value="" >Kies Opsie</option>
                        {huistaalOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <MultiCheckboxGroup
                    label="Kommunikasievoorkeur"
                    namePrefix="g1KommunikasieVoorkeur" // Base name for state
                    options={communicationOptions}
                    selectedValues={formData.g1KommunikasieVoorkeur} // Pass the array
                    onChange={handleCommunicationChange} // Use the special handler
                    required={true}
                />

            </div>

            {/* --- Contact Info --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">KONTAKBESONDERHEDE</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Selfoonnommer" name="g1CellPhone" value={formData.g1CellPhone} onChange={handleInputChange} type="tel" required />
                <InputField label="E-pos" name="g1Email" value={formData.g1Email} onChange={handleInputChange} type="email" required />
            </div>

            {/* --- Residential Address --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">WOONADRES</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Adres Lyn 1" name="g1ResAddressLine1" value={formData.g1ResAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                <InputField label="Adres Lyn 2" name="g1ResAddressLine2" value={formData.g1ResAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                <InputField label="Stad / Dorp" name="g1ResAddressCity" value={formData.g1ResAddressCity} onChange={handleInputChange} required />
                <InputField label="Poskode" name="g1ResAddressCode" value={formData.g1ResAddressCode} onChange={handleInputChange} required />
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
                    <InputField label="Adres Lyn 1" name="g1PostalAddressLine1" value={formData.g1PostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                    <InputField label="Adres Lyn 2" name="g1PostalAddressLine2" value={formData.g1PostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                    <InputField label="Stad / Dorp" name="g1PostalAddressCity" value={formData.g1PostalAddressCity} onChange={handleInputChange} required />
                    <InputField label="Poskode" name="g1PostalAddressCode" value={formData.g1PostalAddressCode} onChange={handleInputChange} required />
                </div>
            )}

            {/* --- Occupation --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">BEROEPSTATUS</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="">
                    <label htmlFor="g1Beroepstatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Beroepstatus <span className="text-red-800">*</span>
                    </label>
                    <select id="g1Beroepstatus" name="g1Beroepstatus" value={formData.g1Beroepstatus || ''} onChange={handleInputChange} required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                        <option value="" disabled>Kies Opsie</option>
                        {beroepOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <InputField label="Beroep" name="g1Occupation" value={formData.g1Occupation} onChange={handleInputChange} className="" />
                <InputField label="Werkgewer" name="g1Employer" value={formData.g1Employer} onChange={handleInputChange} className="md:col-span-2" />
                <InputField label="Werk Telefoon" name="g1WorkPhone" value={formData.g1WorkPhone} onChange={handleInputChange} type="tel" className="" />
                <InputField label="Werk Epos" name="g1WorkEmail" value={formData.g1WorkEmail} onChange={handleInputChange} type="email" className="" />
                <InputField label="Werkadres" name="g1WorkAddress" value={formData.g1WorkAddress} onChange={handleInputChange} isTextArea={true} className="md:col-span-2" />
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