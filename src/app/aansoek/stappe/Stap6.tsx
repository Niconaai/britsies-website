// src/app/aansoek/steps/Step6.tsx
import React from 'react';
import { FormData, FileState } from '../AdmissionForm';
import FileInput from './FileInput';
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField";

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

type StepProps = {
    onBack: () => void;
    formData: FormData;
    fileData: FileState;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step6Documents({ onBack, formData, fileData, handleInputChange, handleFileChange }: StepProps) {

    // --- Validation logic for Step 6 ---
    const requiredAgreementsMade = !!(
        formData.agreeRules &&
        formData.agreePhotos &&
        formData.agreeIndemnity &&
        formData.agreeFinancial &&
        formData.acceptHandtekening
        // Add checks for required files later
    );

    const now = new Date();
    const monthIndex = now.getMonth();
    const monthNumber = monthIndex + 1;

    const isGrade8Jan = (formData.learnerLastGradePassed === '7' && monthNumber === 1);
    const oorplasingRequired = !isGrade8Jan;
    const portefeuljeRequired = !isGrade8Jan;

    // G2 ID only required if G2 is applicable
    const g2IdRequired = !formData.g2NotApplicable;

    const requiredFilesUploaded = !!(
        (oorplasingRequired ? fileData.docOorplasingSert : true) &&
        fileData.docBirthCert &&
        fileData.docG1Id &&
        (g2IdRequired ? fileData.docG2Id : true) &&
        fileData.docProofOfAddress &&
        fileData.docMedicalAid &&
        fileData.docPrevReport &&
        (portefeuljeRequired ? fileData.docPortefeulje : true) &&
        fileData.docGedragsverslag
    );
    // --- End File Validation ---

    const canProceed = requiredAgreementsMade && requiredFilesUploaded;

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 6: DOKUMENTE & OOREENKOMSTE</h2>

            {/* --- File Uploads (From FSD) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">VEREISTE DOKUMENTE</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Laai asseblief geskandeerde afskrifte of duidelike foto's van die volgende dokumente op (PDF, JPG, PNG).
            </p>
            <div className="grid grid-cols-1 gap-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                {oorplasingRequired && (
                    <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                        <FileInput label="Oorplasing Sertifikaat van vorige skool" name="docOorplasingSert" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                    </div>
                )}

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Leerder ID / Geboortesertifikaat" name="docBirthCert" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Ouer / Voog 1 ID" name="docG1Id" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>

                {g2IdRequired && (
                    <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                        <FileInput label="Ouer / Voog 2 ID" name="docG2Id" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                    </div>
                )}

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Bewys van Woonadres (Munisipale Rekening)" name="docProofOfAddress" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Mediese Fonds Kaart (Voor & Agter)" name="docMedicalAid" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Laaste Skoolrapport" name="docPrevReport" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>

                {portefeuljeRequired && (
                    <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                        <FileInput label="Volledige Portefeulje: Punte van elke assessering van elke vak." name="docPortefeulje" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                    </div>
                )}

                <div className="rounded border border-dashed border-zinc-400 p-4 text-center dark:border-zinc-600">
                    <FileInput label="Nuutste Gedragsverslag" name="docGedragsverslag" onChange={handleFileChange} required={true} accept="image/*,application/pdf" />
                </div>
                
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
                <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                <FloatingLabelInputField
                    label="Skryf jou volle naam en van hier in as handtekening"
                    name="acceptHandtekening"
                    value={formData.acceptHandtekening}
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