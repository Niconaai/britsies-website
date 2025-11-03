// src/app/admin/instellings/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateSettings } from "./actions";
import FloatingLabelInputField from "@/components/ui/FloatingLabelInputField"; // Ons hergebruik hierdie
import SubmitButton from "@/components/ui/SubmitButton"; //
import SettingsForm from './SettingsForm'; // Ons skuif die vorm na 'n kliënt-komponent

// Tipe vir ons instellings
type SystemSetting = {
    key: string;
    value: string | null;
    description: string | null;
};

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {

    const resolvedSearchParams = await searchParams;
    const supabase = await createClient(); //

    // --- Auth Check ---
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') return redirect('/');
    // --- Einde Auth Check ---

    // --- Haal die instellings ---
    const { data: settings, error } = await supabase
        .from('system_settings')
        .select('*');

    if (error) {
        console.error("Kon nie instellings laai nie:", error);
    }

    // Omskep die skikking na 'n maklik-bruikbare objek
    const settingsMap = (settings as SystemSetting[] || []).reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
    }, {} as { [key: string]: string });

    const appEmail = settingsMap['application_admin_email'] || '';
    const shopEmail = settingsMap['shop_manager_email'] || '';

    return (
        <div className="max-w-2xl mx-auto">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Stelsel Instellings
                </h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Bestuur globale instellings vir e-pos kennisgewings.
                </p>

                {resolvedSearchParams.success && (
                    <div className="mt-4 rounded-md bg-green-100 p-4 text-sm text-green-700 dark:bg-green-900 dark:text-green-200">
                        Instellings suksesvol gestoor!
                    </div>
                )}
                {resolvedSearchParams.error && (
                    <div className="mt-4 rounded-md bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
                        Fout: {resolvedSearchParams.error}
                    </div>
                )}

                {/* Ons moet die vorm in 'n Kliënt-komponent plaas 
          omdat FloatingLabelInputField 'useState' gebruik.
        */}
                <SettingsForm
                    appEmail={appEmail}
                    shopEmail={shopEmail}
                    formAction={updateSettings}
                />
            </div>
        </div>
    );
}