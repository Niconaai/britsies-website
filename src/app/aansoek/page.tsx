// src/app/aansoek/page.tsx
import type { Metadata } from "next";
import AdmissionForm from './AdmissionForm';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Hoërskool Brits | Aansoek",
  description: "Word deel van Hoërskool Brits",
};

export default function ApplicationPage() {
    return (
        <div className="min-h-screen bg-zinc-100 p-4 pt-10 dark:bg-zinc-900 md:p-10">
            <div className="mx-auto max-w-4xl">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        src="/wapen.png"
                        alt="Hoërskool Brits Logo"
                        width={100}
                        height={100}
                        className="h-auto mb-4"
                    />
                </div>
                <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
                    Aanlyn Aansoekvorm
                </h1>
                <AdmissionForm /> {/* Render the multi-step form */}
            </div>
        </div>
    );
}