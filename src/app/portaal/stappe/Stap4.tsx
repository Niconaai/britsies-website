// src/app/aansoek/steps/Step4.tsx
import React from 'react';
import { FormData } from '../AdmissionForm';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";
import FloatingLabelSelectField from "@/components/ui/FloatingLabelSelectField";
import FloatingLabelSelectFieldCustom from "@/components/ui/FloatingLabelSelectFieldCustom";

// --- Reusable CheckboxField (Copy from Stap1 or import) ---
const CheckboxField = ({ label, name, checked, onChange, required = false }: {
    label: string | React.ReactNode; name: string; checked: boolean | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) => (
    <label className="flex items-start space-x-2">
        <input
            type="checkbox"
            name={name}
            checked={!!checked}
            onChange={onChange}
            required={required}
            className="form-checkbox mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 shrink-0"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
    </label>
);
// --- End CheckboxField ---

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
    } else {
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
            <FloatingLabelSelectFieldCustom
                label="Wie is verantwoordelik vir die betaling van skoolfooi?"
                name="payerType"
                value={formData.payerType}
                onChange={handleInputChange}
                options={payerTypeOptions}
                required={true}
            />

            {/* --- Conditional Payer Details (If not G1 or G2) --- */}
            {(isPayerOtherIndividual || isPayerCompany || isPayerClosedCorp || isPayerTrust) && (
                <div className="mt-4 space-y-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                    <h4 className="font-semibold">{besonderhede.toUpperCase()} BESONDERHEDE</h4>
                    <FloatingLabelInputField label={!isPayerOtherIndividual ? `Kontakpersoon Naam en Van` : `Volle Naam en Van`} name="payerFullName" value={formData.payerFullName} onChange={handleInputChange} required />
                    {isPayerOtherIndividual && <FloatingLabelInputField label="ID Nommer" name="payerIdNumber" value={formData.payerIdNumber} onChange={handleInputChange} required />}
                    {(isPayerCompany || isPayerClosedCorp || isPayerTrust) && <FloatingLabelInputField label={`${besonderhede} Registrasienommer`} name="payerCompanyRegNo" value={formData.payerCompanyRegNo} onChange={handleInputChange} required />}
                    {(isPayerCompany || isPayerClosedCorp || isPayerTrust) && <FloatingLabelInputField label="BTW Nommer (Indien van toepassing)" name="payerVatNo" value={formData.payerVatNo} onChange={handleInputChange} />}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FloatingLabelInputField label="Tel (Werk)" name="payerTelWork" value={formData.payerTelWork} onChange={handleInputChange} type="tel" />
                        <FloatingLabelInputField label="Tel (Sel)" name="payerTelCell" value={formData.payerTelCell} onChange={handleInputChange} type="tel" required />
                        <FloatingLabelInputField label="E-posadres" name="payerEmail" value={formData.payerEmail} onChange={handleInputChange} type="email" required />
                    </div>
                    <h5 className="pt-2 font-medium">POSADRES</h5>
                    <FloatingLabelInputField label="Adres Lyn 1" name="payerPostalAddressLine1" value={formData.payerPostalAddressLine1} onChange={handleInputChange} required className="md:col-span-2" />
                    <FloatingLabelInputField label="Adres Lyn 2" name="payerPostalAddressLine2" value={formData.payerPostalAddressLine2} onChange={handleInputChange} className="md:col-span-2" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FloatingLabelInputField label="Stad / Dorp" name="payerPostalAddressCity" value={formData.payerPostalAddressCity} onChange={handleInputChange} required />
                        <FloatingLabelInputField label="Poskode" name="payerPostalAddressCode" value={formData.payerPostalAddressCode} onChange={handleInputChange} required />
                    </div>
                </div>
            )}

            {/* --- Debit Order Details (PDF Page 6) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">DEBIETORDERMAGTIGING</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInputField label="Bank Naam" name="debitBankName" value={formData.debitBankName} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Takkode" name="debitBranchCode" value={formData.debitBranchCode} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Rekeningnommer" name="debitAccountNumber" value={formData.debitAccountNumber} onChange={handleInputChange} required />
                <FloatingLabelSelectField
                    label="Tipe Rekening"
                    name="debitAccountType"
                    value={formData.debitAccountType}
                    onChange={handleInputChange}
                    options={accountTypeOptions}
                    required={true}
                />
                <FloatingLabelInputField label="Naam van Rekeninghouer" name="debitAccountHolder" value={formData.debitAccountHolder} onChange={handleInputChange} required className="md:col-span-2" />
                <FloatingLabelSelectField
                    label="Debietorder Datum (dag van maand)"
                    name="debitDate"
                    value={formData.debitDate}
                    onChange={handleInputChange}
                    options={debitDateOptions}
                    required={true}
                />
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
                <FloatingLabelInputField label="Naam van Ondertekenaar" name="contractSignatoryName" value={formData.contractSignatoryName} onChange={handleInputChange} required />
                <FloatingLabelInputField label="ID Nommer van Ondertekenaar" name="contractSignatoryId" value={formData.contractSignatoryId} onChange={handleInputChange} required />
                <FloatingLabelInputField label="Hoedanigheid (bv. Ouer, Voog)" name="contractSignatoryCapacity" value={formData.contractSignatoryCapacity} onChange={handleInputChange} required />
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