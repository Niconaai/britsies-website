// src/app/aansoek/stappe/Stap3.tsx
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

// --- Update Component Name ---
export default function Step2Guardian1({ onNext, onBack, formData, handleInputChange }: StepProps) {
    const isApplicable = !formData.g2NotApplicable;
    const requiredFieldsFilled = true;
    //formData.g2NotApplicable || (
    // formData.g2Relationship &&
    // formData.g2FirstName &&
    // formData.g2Surname &&
    // formData.g2IdNumber &&
    // formData.g2CellPhone &&
    // formData.g2Email &&
    // formData.g2ResAddressLine1 &&
    // formData.g2ResAddressCity &&
    // formData.g2ResAddressCode &&
    // formData.g2PostalAddressLine1 &&
    // formData.g2PostalAddressCity &&
    // formData.g2PostalAddressCode &&
    // formData.g2Nickname &&
    // formData.g2Huistaal &&
    // formData.g2KommunikasieVoorkeur &&
    // formData.g2Beroepstatus )
    ;
    const canProceed = formData.g2NotApplicable || (isApplicable && requiredFieldsFilled);

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
        const currentSelection = formData.g2KommunikasieVoorkeur || [];
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
            target: { name: 'g2KommunikasieVoorkeur', value: newSelection }
        } as unknown as React.ChangeEvent<HTMLInputElement>); // Type assertion needed
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
                        <div>
                            <label htmlFor="g2MaritalStatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Huwelikstatus
                            </label>
                            <select id="g2MaritalStatus" name="g2MaritalStatus" value={formData.g2MaritalStatus || ''} onChange={handleInputChange}
                                className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                                <option value="" >Kies Opsie</option>
                                {maritalStatusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="g2Relationship" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Verwantskap met Leerder <span className="text-red-800">*</span>
                            </label>
                            <select id="g2Relationship" name="g2Relationship" value={formData.g2Relationship || ''} onChange={handleInputChange} required
                                className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                                <option value="" disabled>Kies Opsie</option>
                                {relationshipOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="g2Title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Titel
                            </label>
                            <select
                                id="g2Title"
                                name="g2Title"
                                value={formData.g2Title || ''}
                                onChange={handleInputChange}
                                required
                                className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"

                            >
                                <option value="" >Kies Opsie</option>
                                {titelOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <InputField label="Volle name" name="g2FirstName" value={formData.g2FirstName} onChange={handleInputChange} required className="" />
                        <InputField label="Van" name="g2Surname" value={formData.g2Surname} onChange={handleInputChange} required className="" />
                        <InputField label="Noemnaam" name="g2Nickname" value={formData.g2Nickname} onChange={handleInputChange} required className="" />
                        <InputField label="Voorletters" name="g2Initials" value={formData.g2Initials} onChange={handleInputChange} />
                        <InputField label="ID Nommer" name="g2IdNumber" value={formData.g2IdNumber} onChange={handleInputChange} required className="md:col-span-2" />
                        <div>
                            <label htmlFor="g2Huistaal" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Huistaal
                            </label>
                            <select
                                id="g2Huistaal"
                                name="g2Huistaal"
                                value={formData.g2Huistaal || ''}
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
                        <InputField label="Selfoonnommer" name="g2CellPhone" value={formData.g2CellPhone} onChange={handleInputChange} type="tel" required />
                        <InputField label="E-pos" name="g2Email" value={formData.g2Email} onChange={handleInputChange} type="email" required />
                    </div>

                    {/* --- Residential Address --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">WOONADRES</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField label="Adres Lyn 1" name="g2ResAddressLine1" value={formData.g2ResAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                        <InputField label="Adres Lyn 2" name="g2ResAddressLine2" value={formData.g2ResAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                        <InputField label="Stad / Dorp" name="g2ResAddressCity" value={formData.g2ResAddressCity} onChange={handleInputChange} required />
                        <InputField label="Poskode" name="g2ResAddressCode" value={formData.g2ResAddressCode} onChange={handleInputChange} required />
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
                            <InputField label="Adres Lyn 1" name="g2PostalAddressLine1" value={formData.g2PostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                            <InputField label="Adres Lyn 2" name="g2PostalAddressLine2" value={formData.g2PostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                            <InputField label="Stad / Dorp" name="g2PostalAddressCity" value={formData.g2PostalAddressCity} onChange={handleInputChange} required />
                            <InputField label="Poskode" name="g2PostalAddressCode" value={formData.g2PostalAddressCode} onChange={handleInputChange} required />
                        </div>
                    )}

                    {/* --- Occupation --- */}
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">BEROEPSTATUS</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="">
                            <label htmlFor="g2Beroepstatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Beroepstatus <span className="text-red-800">*</span>
                            </label>
                            <select id="g2Beroepstatus" name="g2Beroepstatus" value={formData.g2Beroepstatus || ''} onChange={handleInputChange} required
                                className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                                <option value="" disabled>Kies Opsie</option>
                                {beroepOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <InputField label="Beroep" name="g2Occupation" value={formData.g2Occupation} onChange={handleInputChange} className="" />
                        <InputField label="Werkgewer" name="g2Employer" value={formData.g2Employer} onChange={handleInputChange} className="md:col-span-2" />
                        <InputField label="Werk Telefoon" name="g2WorkPhone" value={formData.g2WorkPhone} onChange={handleInputChange} type="tel" className="" />
                        <InputField label="Werk Epos" name="g2WorkEmail" value={formData.g2WorkEmail} onChange={handleInputChange} type="email" className="" />
                        <InputField label="Werkadres" name="g2WorkAddress" value={formData.g2WorkAddress} onChange={handleInputChange} isTextArea={true} className="md:col-span-2" />
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