// src/app/aansoek/steps/Step5.tsx
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

// --- MultiCheckboxGroup Component ---
const MultiCheckboxGroup = ({ label, namePrefix, options, selectedValues, onChange, required = false }: {
    label: string | React.ReactNode;
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

export default function Step5AdditionalInfo({ onNext, onBack, formData, handleInputChange }: StepProps) {

    const isGrade8Application = formData.learnerLastGradePassed === "7" ? true : false;

    const requiredFieldsFilled = !!(
        (formData.prevSchoolName || isGrade8Application)
    );
    const canProceed = requiredFieldsFilled;

    let winterSportOpsies;
    let somerSportOpsies;
    if (formData.learnerGender === 'Manlik') {
        winterSportOpsies = [
            { value: "Rugby", label: "Rugby" },
            { value: "Seunshokkie", label: "Seunshokkie" },
            { value: "Landloop", label: "Landloop" },
            { value: "Skaak", label: "Skaak" },
            { value: "Luggeweerskiet", label: "Luggeweerskiet" },
            { value: "Gholf", label: "Gholf" },
            { value: "Swem", label: "Swem" }
        ];

        somerSportOpsies = [
            { value: "Krieket", label: "Krieket" },
            { value: "Atletiek", label: "Atletiek" },
            { value: "Tennis", label: "Tennis" },
            { value: "Skaak", label: "Skaak" },
            { value: "Luggeweerskiet", label: "Luggeweerskiet" },
            { value: "Gholf", label: "Gholf" },
            { value: "Swem", label: "Swem" }
        ];
    } else {
        winterSportOpsies = [
            { value: "Rugby", label: "Rugby" },
            { value: "Netbal", label: "Netbal" },
            { value: "Hokkie", label: "Hokkie" },
            { value: "Landloop", label: "Landloop" },
            { value: "Skaak", label: "Skaak" },
            { value: "Luggeweerskiet", label: "Luggeweerskiet" },
            { value: "Gholf", label: "Gholf" },
            { value: "Swem", label: "Swem" }];

        somerSportOpsies = [
            { value: "Atletiek", label: "Atletiek" },
            { value: "Tennis", label: "Tennis" },
            { value: "Skaak", label: "Skaak" },
            { value: "Luggeweerskiet", label: "Luggeweerskiet" },
            { value: "Gholf", label: "Gholf" },
            { value: "Swem", label: "Swem" },
            { value: "Sagtebal", label: "Sagtebal" }
        ];
    }

    const kultuurOpsies = [
        { value: "Koor", label: "Koor" },
        { value: "Redenaars", label: "Redenaars" },
        { value: "Toneel", label: "Toneel" },
        { value: "Revue", label: "Revue" },
        { value: "Kunswedstryd", label: "Kunswedstryd" },
        { value: "Ekspo", label: "Ekspo" },
        { value: "Sêr", label: "Sêr" },
        { value: "Debat", label: "Debat" },
        { value: "Musiekblyspel", label: "Musiekblyspel" }
    ];

    // --- Special handler for Sport MultiCheckboxGroup ---
    const handleSummerSportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.extraSummerSport || [];
        let newSelection;
        if (checked) { newSelection = [...currentSelection, value]; }
        else { newSelection = currentSelection.filter(item => item !== value); }
        handleInputChange({ target: { name: 'extraSummerSport', value: newSelection } } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    // --- End Special Handler ---

    // --- Special handler for Sport MultiCheckboxGroup ---
    const handleWinterSportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.extraWinterSport || [];
        let newSelection;
        if (checked) { newSelection = [...currentSelection, value]; }
        else { newSelection = currentSelection.filter(item => item !== value); }
        handleInputChange({ target: { name: 'extraWinterSport', value: newSelection } } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    // --- End Special Handler ---

    // --- Special handler for Culture MultiCheckboxGroup ---
    const handleCultureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const currentSelection = formData.extraCulture || [];
        let newSelection;
        if (checked) { newSelection = [...currentSelection, value]; }
        else { newSelection = currentSelection.filter(item => item !== value); }
        handleInputChange({ target: { name: 'extraCulture', value: newSelection } } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    // --- End Special Handler ---

    return (
        <div className="space-y-6">
            <h2 className="mb-6 text-xl font-semibold dark:text-white">Stap 5: ADDISIONELE LEERDER INLIGTING</h2>
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />

            {/* --- Health Info (PDF Page 3) --- */}
            <h3 className="text-lg font-medium dark:text-white">GESONDHEID</h3>
            <div className="space-y-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                <InputField label="Allergieë" name="healthAllergies" value={formData.healthAllergies} onChange={handleInputChange} isTextArea />
                <InputField label="Siektetoestande / Ernstige Siektes / Mediese Toestande" name="healthIllnesses" value={formData.healthIllnesses} onChange={handleInputChange} isTextArea />
                <InputField label="Gebreke / Gestremdhede" name="healthDisabilities" value={formData.healthDisabilities} onChange={handleInputChange} isTextArea />
                <InputField label="Operasies Ondergaan" name="healthOperations" value={formData.healthOperations} onChange={handleInputChange} isTextArea />
                <InputField label="Medikasie wat gereeld gebruik word" name="healthMedication" value={formData.healthMedication} onChange={handleInputChange} isTextArea />
                <InputField label="Enige ander belangrike mediese inligting" name="healthAdditionalInfo" value={formData.healthAdditionalInfo} onChange={handleInputChange} isTextArea />
            </div>

            {/* --- Medical Aid Info (PDF Page 3) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">MEDIESE FONDS</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Naam van Skema" name="medAidScheme" value={formData.medAidScheme} onChange={handleInputChange} />
                <InputField label="Nommer" name="medAidNumber" value={formData.medAidNumber} onChange={handleInputChange} />
                <InputField label="Hooflid Naam & Van" name="medAidMainMember" value={formData.medAidMainMember} onChange={handleInputChange} />
                <InputField label="Hooflid ID Nommer" name="medAidMemberId" value={formData.medAidMemberId} onChange={handleInputChange} />
            </div>

            {/* --- Doctor Info (PDF Page 3) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="pt-4 text-lg font-medium dark:text-white">HUISDOKTER</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField label="Naam" name="doctorName" value={formData.doctorName} onChange={handleInputChange} />
                <InputField label="Telefoonnommer" name="doctorNumber" value={formData.doctorNumber} onChange={handleInputChange} type="tel" />
            </div>

            {/* --- Previous School Info (PDF Page 3) - Conditional --- */}
            {/* Show this section ONLY if it's NOT a Grade 8 Application */}
            {!isGrade8Application && (
                <React.Fragment>
                    <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
                    <h3 className="pt-4 text-lg font-medium dark:text-white">VORIGE SKOOL</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField label="Naam van Skool" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleInputChange} required className="md:col-span-2" />
                        <InputField label="Dorp / Stad" name="prevSchoolTown" value={formData.prevSchoolTown} onChange={handleInputChange} />
                        <InputField label="Provinsie" name="prevSchoolProvince" value={formData.prevSchoolProvince} onChange={handleInputChange} />
                        <InputField label="Telefoon" name="prevSchoolTel" value={formData.prevSchoolTel} onChange={handleInputChange} type="tel" />
                        <InputField label="Rede vir Skoolverlating" name="prevSchoolReasonForLeaving" value={formData.prevSchoolReasonForLeaving} onChange={handleInputChange} isTextArea={true} className="md:col-span-2" />
                    </div>
                </React.Fragment>
            )}
            {/* --- End Conditional Previous School Info --- */}

            {/* --- Extracurricular Activities (PDF Page 8) --- */}
            <hr className="my-6 border-zinc-300 dark:border-zinc-600" />
            <h3 className="text-lg font-medium dark:text-white">ERVARING EN REGISTRASIE BUITEKURRIKULêRE AKTIWITEITE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded border border-zinc-300 p-4 dark:border-zinc-600">
                <div className="col-span-1">
                    <MultiCheckboxGroup
                        label={<span className="font-semibold">Kultuuraktiwiteite</span>}
                        namePrefix="extraCulture"
                        options={kultuurOpsies}
                        selectedValues={formData.extraCulture}
                        onChange={handleCultureChange}
                    />
                </div>

                <div className="col-span-1">
                    <MultiCheckboxGroup
                        label={<span className="font-semibold">Wintersport</span>}
                        namePrefix="winterSports"
                        options={winterSportOpsies}
                        selectedValues={formData.extraWinterSport}
                        onChange={handleWinterSportChange}
                    />
                </div>

                <div className="col-span-1">
                    <MultiCheckboxGroup
                        label={<span className="font-semibold">Somersport</span>}
                        namePrefix="summerSports"
                        options={somerSportOpsies}
                        selectedValues={formData.extraSummerSport}
                        onChange={handleSummerSportChange}
                    />
                </div>

            </div>
            <InputField label="Ander prestasies (bv. Leierskap, Akademies, Provinsiale Span-insluiting van Sport)" name="extraAchievements" value={formData.extraAchievements} onChange={handleInputChange} isTextArea />


            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <button type="button" onClick={onBack} className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700">Terug</button>
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