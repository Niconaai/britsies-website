// src/app/aansoek/steps/Step6.tsx
import React from 'react';
import { FormData } from '../AdmissionForm'; // Adjust path if needed

// --- Reusable CheckboxField (Copy or import) ---
const CheckboxField = ({ label, name, checked, onChange, required = false }: {
    label: string | React.ReactNode; name: string; checked: boolean | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) => (
    <label className="flex items-start space-x-2">
        <input type="checkbox" name={name} checked={!!checked} onChange={onChange} required={required}
            className="form-checkbox mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700" />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
    </label>
);
// --- End CheckboxField ---

// --- Reusable FileInputField (Placeholder UI) ---
const FileInputField = ({ label, name, required = false, description = '' }: {
    label: string;
    name: string;
    required?: boolean;
    description?: string;
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label} {required && <span className="text-red-800">*</span>}
        </label>
        {/*
            NOTE: We will replace this with a proper state-managed upload component.
            Using a standard <input type="file"> here won't work correctly with the
            parent 'formData' object without a special handler, which we'll add later
            when we implement the API route submission.
        */}
        <div className="mt-2 flex items-center justify-center rounded-sm border-2 border-dashed border-zinc-300 p-6 dark:border-zinc-600">
            <div className="text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">TODO: Lêer Oplaai Komponent vir {label}</p>
                {description && <p className="text-xs text-zinc-400">{description}</p>}
                {/* <input id={name} name={name} type="file" className="sr-only" /> */}
            </div>
        </div>
    </div>
);
// --- End FileInputField ---

type StepProps = {
    onBack: () => void;
    formData: FormData;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    // We'll need a new handler for files, e.g., handleFileChange
};

export default function Step6Documents({ onBack, formData, handleInputChange }: StepProps) {

    // --- Validation logic for Step 6 ---
    // Check that all required checkboxes are ticked
    const requiredAgreementsMade = !!(
        formData.agreeRules &&
        formData.agreePhotos &&
        formData.agreeIndemnity &&
        formData.agreeFinancial
        // Add checks for required files later
    );
    const canProceed = requiredAgreementsMade; // Update this when file state is added
    // --- End Validation ---

    const now = new Date();
    const monthIndex = now.getMonth();
    const monthNumber = monthIndex + 1;

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 6: DOKUMENTE & OOREENKOMSTE</h2>

            {/* --- File Uploads (From FSD) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">VEREISTE DOKUMENTE</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Laai asseblief geskandeerde afskrifte of duidelike foto's van die volgende dokumente op (PDF, JPG, PNG).
            </p>
            <div className="space-y-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                { !(formData.learnerLastGradePassed === '7' && monthNumber === 1) && (
                    <FileInputField label="Oorplasing Sertifikaat van vorige skool" name="docOorplasingSert" required={true} />
                )}
                <FileInputField label="Leerder ID / Geboortesertifikaat" name="docBirthCert" required={true} />
                <FileInputField label="Ouer / Voog 1 ID" name="docG1Id" required={true} />
                {/* Only require G2 ID if G2 is applicable */}
                {!formData.g2NotApplicable && (
                    <FileInputField label="Ouer / Voog 2 ID" name="docG2Id" required={true} />
                )}
                <FileInputField label="Bewys van Woonadres (Munisipale Rekening)" name="docProofOfAddress" required={true} />
                <FileInputField label="Mediese Fonds Kaart (Voor & Agter)" name="docMedicalAid" required={true} />
                <FileInputField label="Laaste Skoolrapport" name="docPrevReport" required={true} />
                { !(formData.learnerLastGradePassed === '7' && monthNumber === 1) && (
                     <FileInputField label="Volledige Portefeulje: Punte van elke assessering van elke vak." name="docPrevReport" required={true} />
                )}
                <FileInputField label="Nuutste Gedragsverslag" name="docGedragsverslag" required={true} />
                {/* Add other required file fields from PDF if any */}
            </div>

            {/* --- Agreements (From PDF Page 8 / Page 6) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">FINALE OOREENKOMSTE</h3>
            <div className="space-y-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                <CheckboxField
                    label={<span>Ek/Ons onderneem om my/ons te onderwerp aan die skoolreëls en gedragskode van die skool. (Beskikbaar by <a href="/skoolreels" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">skoolreels</a>)</span>}
                    name="agreeRules"
                    checked={formData.agreeRules}
                    onChange={handleInputChange}
                    required={true}
                />
                <CheckboxField
                    label="Ek/Ons gee hiermee toestemming dat foto's van my/ons kind(ers) geneem mag word tydens skoolaktiwiteite vir publikasie."
                    name="agreePhotos"
                    checked={formData.agreePhotos}
                    onChange={handleInputChange}
                    required={true}
                />
                <CheckboxField
                    label="Ek/Ons vrywaar hiermee die skool van enige verantwoordelikheid vir enige besering of skade wat my/ons kind(ers) mag opdoen of veroorsaak tydens skoolaktiwiteite of vervoer."
                    name="agreeIndemnity"
                    checked={formData.agreeIndemnity}
                    onChange={handleInputChange}
                    required={true}
                />
                 <CheckboxField
                    label={<span>Ek/Ons verklaar hiermee dat al die bogenoemde inligting waar en korrek is, en ek/ons aanvaar die finansiële verpligtinge soos uiteengesit in die <a href="/finansiele-beleid" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">Finansiële Beleid</a>.</span>}
                    name="agreeFinancial" // Combines contract and data accuracy
                    checked={formData.agreeFinancial}
                    onChange={handleInputChange}
                    required={true}
                />
            </div>

            {/* Navigation/Submit Buttons */}
            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                    Terug
                </button>
                <button
                    type="submit" // This is the final SUBMIT button
                    disabled={!canProceed}
                    className={`rounded px-6 py-2 text-white ${canProceed ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'}`}
                    title={!canProceed ? "Voltooi asseblief alle vereiste velde (*)" : "Dien Aansoek In"}
                >
                    Dien Aansoek In
                </button>
            </div>
        </div>
    );
}