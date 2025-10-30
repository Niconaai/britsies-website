// src/app/aansoek/steps/Step4.tsx
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

// // --- MultiCheckboxGroup Component ---
// const MultiCheckboxGroup = ({ label, namePrefix, options, selectedValues, onChange, required = false }: {
//     label: string;
//     namePrefix: string;
//     options: { value: string; label: string }[];
//     selectedValues: string[] | undefined; // Array of selected values
//     onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Use standard handler, logic is in parent
//     required?: boolean; // Can add validation logic if needed
// }) => (
//     <div className="border-2 dark:border-zinc-500 border-zinc-200 rounded-sm px-3 py-2">
//         <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
//             {label} {required && <span className="text-red-800">*</span>}
//         </span>
//         <div className="mt-2 space-y-2">
//             {options.map(option => (
//                 <label key={option.value} className="flex items-center">
//                     <input
//                         type="checkbox"
//                         // Use a unique name for each checkbox based on prefix and value
//                         name={`${namePrefix}_${option.value}`}
//                         value={option.value} // Value attribute can be useful
//                         // Check if the option's value is in the selectedValues array
//                         checked={selectedValues?.includes(option.value) ?? false}
//                         onChange={onChange} // Parent component needs logic to update the array
//                         // Required validation on group level might need custom logic
//                         className="form-checkbox h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
//                     />
//                     <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-100">{option.label}</span>
//                 </label>
//             ))}
//         </div>
//     </div>
// );
// // --- End MultiCheckboxGroup ---

type StepProps = {
    onNext: () => void;
    onBack: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};

export default function Step4Payer({ onNext, onBack, formData, handleInputChange }: StepProps) {

    // --- Validation logic for Step 4 ---
    const isPayerG1 = formData.payerType === 'g1';
    const isPayerG2 = formData.payerType === 'g2';
    const isPayerOtherIndividual = formData.payerType === 'individual';
    const isPayerCompany = formData.payerType === 'company';
    const isPayerClosedCorp = formData.payerType === 'closed_corporation';
    const isPayerTrust = formData.payerType === 'trust';
    let besonderhede = '';

    if (isPayerOtherIndividual) {
        besonderhede = 'Individu';
    } else if (isPayerCompany) {
        besonderhede = 'Maatskappy';
    } else if (isPayerClosedCorp) {
        besonderhede = 'Beslote Korporasie';
    } else if (isPayerTrust) {
        besonderhede = 'Trust';
    }

    let requiredPayerDetailsFilled = false;
    if (isPayerG1 || isPayerG2) {
        requiredPayerDetailsFilled = true; // Assume G1/G2 details are captured elsewhere
    } else if (isPayerOtherIndividual) {
        requiredPayerDetailsFilled = !!(formData.payerFullName && formData.payerIdNumber && formData.payerTelCell && formData.payerEmail && formData.payerPostalAddressLine1 && formData.payerPostalAddressCity && formData.payerPostalAddressCode);
    } else if (isPayerCompany || isPayerClosedCorp || isPayerTrust) {
        requiredPayerDetailsFilled = !!(formData.payerFullName && formData.payerCompanyRegNo && formData.payerTelCell && formData.payerEmail && formData.payerPostalAddressLine1 && formData.payerPostalAddressCity && formData.payerPostalAddressCode);
    }

    const requiredDebitDetailsFilled = !!(
        formData.debitBankName && formData.debitBranchCode && formData.debitAccountNumber &&
        formData.debitAccountType && formData.debitAccountHolder && formData.debitDate && formData.debitAgreeTerms
    );

    const requiredContractDetailsFilled = !!(
        formData.contractSignatoryName && formData.contractSignatoryId && formData.contractSignatoryCapacity && formData.contractAgreeTerms
    );

    const canProceed =
        formData.payerType &&
        requiredPayerDetailsFilled &&
        requiredDebitDetailsFilled &&
        requiredContractDetailsFilled;
    // --- End Validation ---

    // const payerTypeOptions = [
    //     { value: 'g1', label: 'Ouer / Voog 1' },
    //     { value: 'g2', label: 'Ouer / Voog 2' },
    //     { value: 'individual', label: 'Ander Individu' },
    //     { value: 'company', label: 'Maatskappy' },
    //     { value: 'closed_corporation', label: 'Beslote Korporasie' },
    //     { value: 'trust', label: 'Trust' },
    // ];

    let payerTypeOptions;
    if (!formData.g2NotApplicable) {
        payerTypeOptions = [
            { value: 'g1', label: 'Ouer / Voog 1' },
            { value: 'g2', label: 'Ouer / Voog 2' },
            { value: 'individual', label: 'Ander Individu' },
            { value: 'company', label: 'Maatskappy' },
            { value: 'closed_corporation', label: 'Beslote Korporasie' },
            { value: 'trust', label: 'Trust' },
        ];
    }else{
        payerTypeOptions = [
            { value: 'g1', label: 'Ouer / Voog 1' },
            { value: 'individual', label: 'Ander Individu' },
            { value: 'company', label: 'Maatskappy' },
            { value: 'closed_corporation', label: 'Beslote Korporasie' },
            { value: 'trust', label: 'Trust' },
        ];
    }

    const accountTypeOptions = ["Tjek", "Spaar", "Transmissie"]; // Check PDF for exact terms
    const debitDateOptions = ["1", "15", "25", "Laaste"]; // Or other specific days

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 4: BETALER INLIGTING EN KONTRAK</h2>
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />

            {/* --- Payer Selection --- */}
            <h3 className="text-lg font-medium dark:text-white">VERANTWOORDELIK VIR BETALING</h3>
            <div>
                <label htmlFor="payerType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Wie is verantwoordelik vir die betaling van skoolfooi? <span className="text-red-800">*</span>
                </label>
                <select
                    id="payerType"
                    name="payerType"
                    value={formData.payerType || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"

                >
                    <option value="" >Kies Opsie</option>
                    {payerTypeOptions.map(option => <option key={option.label} value={option.value}>{option.label}</option>)}
                </select>
            </div>

            {/* --- Conditional Payer Details (If not G1 or G2) --- */}
            {(isPayerOtherIndividual || isPayerCompany || isPayerClosedCorp || isPayerTrust) && (
                <div className="mt-4 space-y-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                    <h4 className="font-semibold">{besonderhede.toUpperCase()} BESONDERHEDE</h4>
                    <InputField label={!isPayerOtherIndividual ? `Kontakpersoon Naam en Van` : `Volle Naam en Van`} name="payerFullName" value={formData.payerFullName} onChange={handleInputChange} required />
                    {isPayerOtherIndividual && <InputField label="ID Nommer" name="payerIdNumber" value={formData.payerIdNumber} onChange={handleInputChange} required />}
                    {(isPayerCompany || isPayerClosedCorp || isPayerTrust) && <InputField label={`${besonderhede} Registrasienommer`} name="payerCompanyRegNo" value={formData.payerCompanyRegNo} onChange={handleInputChange} required />}
                    {(isPayerCompany || isPayerClosedCorp || isPayerTrust) && <InputField label="BTW Nommer (Indien van toepassing)" name="payerVatNo" value={formData.payerVatNo} onChange={handleInputChange} />}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InputField label="Tel (Werk)" name="payerTelWork" value={formData.payerTelWork} onChange={handleInputChange} type="tel" />
                        <InputField label="Tel (Sel)" name="payerTelCell" value={formData.payerTelCell} onChange={handleInputChange} type="tel" required />
                        <InputField label="E-posadres" name="payerEmail" value={formData.payerEmail} onChange={handleInputChange} type="email" required />
                    </div>
                    <h5 className="pt-2 font-medium">POSADRES</h5>
                    <InputField label="Adres Lyn 1" name="payerPostalAddressLine1" value={formData.payerPostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                    <InputField label="Adres Lyn 2" name="payerPostalAddressLine2" value={formData.payerPostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField label="Stad / Dorp" name="payerPostalAddressCity" value={formData.payerPostalAddressCity} onChange={handleInputChange} required />
                        <InputField label="Poskode" name="payerPostalAddressCode" value={formData.payerPostalAddressCode} onChange={handleInputChange} required />
                    </div>
                </div>
            )}

            {/* --- Debit Order Details (PDF Page 6) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">DEBIETORDERMAGTIGING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Bank Naam" name="debitBankName" value={formData.debitBankName} onChange={handleInputChange} required />
                <InputField label="Takkode" name="debitBranchCode" value={formData.debitBranchCode} onChange={handleInputChange} required />
                <InputField label="Rekeningnommer" name="debitAccountNumber" value={formData.debitAccountNumber} onChange={handleInputChange} required />
                <div>
                    <label htmlFor="debitAccountType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Tipe Rekening <span className="text-red-800">*</span>
                    </label>
                    <select id="debitAccountType" name="debitAccountType" value={formData.debitAccountType || ''} onChange={handleInputChange} required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                        <option value="" disabled>Kies Tipe</option>
                        {accountTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
                <InputField label="Naam van Rekeninghouer" name="debitAccountHolder" value={formData.debitAccountHolder} onChange={handleInputChange} required className="md:col-span-2" />
                <div>
                    <label htmlFor="debitDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Debietorder Datum <span className="text-red-800">*</span> (Dag van maand)
                    </label>
                    <select id="debitDate" name="debitDate" value={formData.debitDate || ''} onChange={handleInputChange} required
                        className="mt-2 px-1 py-1.5 block w-full rounded-sm border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white">
                        <option value="" disabled>Kies Opsie</option>
                        {debitDateOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>
            </div>

            <CheckboxField
                label={<span>Hiermee gee ek volmag dat die bankiers van Hoërskool Brits, Nedbank Beperk Brits, die betalings mag verhaal vanaf bogenoemde rekening. Ek aanvaar ook die voorwaardes soos uiteengesit in die <a href="/finansiele-beleid" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">Finansiële Beleid</a></span>}
                name="debitAgreeTerms"
                checked={formData.debitAgreeTerms}
                onChange={handleInputChange}
                required={true}
            />

            {/* --- Contract Info (PDF Page 6) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">FINANSIËLE KONTRAK OOREENKOMS</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Naam van Ondertekenaar" name="contractSignatoryName" value={formData.contractSignatoryName} onChange={handleInputChange} required />
                <InputField label="ID Nommer van Ondertekenaar" name="contractSignatoryId" value={formData.contractSignatoryId} onChange={handleInputChange} required />
                <InputField label="Hoedanigheid (bv. Ouer, Voog)" name="contractSignatoryCapacity" value={formData.contractSignatoryCapacity} onChange={handleInputChange} required />
            </div>
            <CheckboxField
                label={<span>Ek/Ons verklaar dat ek/ons die finansiële verpligtinge soos uiteengesit verstaan en onderneem om dit na te kom. (Verwys na <a href="/finansiele-beleid" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">Finansiële Beleid</a>)</span>} // Example link
                name="contractAgreeTerms"
                checked={formData.contractAgreeTerms}
                onChange={handleInputChange}
                required={true}
            />


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