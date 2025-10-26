// src/app/aansoek/steps/Step4.tsx
import React from 'react';

type StepProps = {
    onNext: () => void;
    onBack: () => void;
    // Add formData and handleInputChange props later
};

export default function Step4Payer({ onNext, onBack }: StepProps) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Stap 4: Betaler Inligting</h2>
            {/* TODO: Add Payer fields based on FSD */}
            <p className="mb-4">Velde vir persoon/maatskappy verantwoordelik, Debiet Order en Kontrak inligting.</p>
            <div className="flex justify-between">
                <button type="button" onClick={onBack} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Terug</button>
                <button type="button" onClick={onNext} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Volgende</button>
            </div>
        </div>
    );
}