// src/app/aansoek/steps/Step6.tsx
import React from 'react';

type StepProps = {
    onBack: () => void;
    // Add formData and handleInputChange/FileChange props later
};

export default function Step6Documents({ onBack }: StepProps) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Stap 6: Dokumente & Ooreenkomste</h2>
            {/* TODO: Add File Upload components and Checkboxes based on FSD */}
            <p className="mb-4">Oplaaie vir ID, geboortesertifikaat, bewys van adres, ens. Ook die "Ek stem saam" blokkies.</p>
            <div className="flex justify-between">
                <button type="button" onClick={onBack} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Terug</button>
                <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">Dien Aansoek In</button> {/* Final Submit */}
            </div>
        </div>
    );
}