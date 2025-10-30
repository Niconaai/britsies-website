// src/app/aansoek/nuwe/page.tsx
import type { Metadata } from "next";
import AdmissionForm from '../AdmissionForm'; // Go up one level
import Image from 'next/image';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Nuwe Aansoek",
  description: "Begin 'n nuwe aansoek vir Hoërskool Brits",
};

export default async function NewApplicationPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Not logged in, send back to the start
        redirect('/aansoek/begin');
    }

    // User is authenticated, show them the blank form
    return (
        <div className="min-h-screen bg-zinc-100 p-4 pt-10 dark:bg-zinc-900 md:p-10">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
                    Nuwe Aansoekvorm
                </h1>
                {/* Render the multi-step form */}
                <AdmissionForm /> 
            </div>
        </div>
    );
}