// src/app/aansoek/page.tsx
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link"; 
import ApplicationList from "./ApplicationList"; 

export const metadata: Metadata = {
  title: "Hoërskool Brits | Aansoek Portaal",
  description: "Bestuur jou aansoeke by Hoërskool Brits",
};

export type ApplicationWithLearner = {
    id: string;
    created_at: string;
    status: string | null;
    learners: {
        first_names: string | null;
        surname: string | null;
    }[] | null; 
};

export default async function ApplicationPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/aansoek/begin');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'parent' && profile?.role === 'admin') {
      return redirect('/admin');
    }

    const { data: applications, error: appError } = await supabase
        .from('applications')
        .select(`
            id,
            created_at,
            status,
            learners ( first_names, surname )
        `)
        .eq('user_id', user.id) 
        .order('created_at', { ascending: false });
    
    const appList = (applications as ApplicationWithLearner[] | null) || [];

    return (
        <div className="min-h-screen bg-zinc-100 p-4 pt-10 dark:bg-zinc-900 md:p-10">
            <div className="mx-auto max-w-4xl">
                {/* --- Dashboard Header --- */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-lg md:text-3xl font-bold text-zinc-900 dark:text-white">
                        My Aansoeke
                    </h1>
                    <Link 
                        href="/aansoek/nuwe"
                        className="text-xs md:text-xl rounded-md bg-green-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-green-700"
                    >
                        + Begin Nuwe Aansoek
                    </Link>
                </div>

                {/* --- Start Applications List --- */}
                <div>
                    {appError && (
                        <p className="text-red-600">Fout met die laai van aansoeke: {appError.message}</p>
                    )}
                    
                    {appList.length === 0 && !appError && (
                        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
                            <p className="text-center text-zinc-600 dark:text-zinc-400">
                                Jy het nog geen aansoeke ingedien nie.
                                <br />
                                Klik op "Begin Nuwe Aansoek" om te begin.
                            </p>
                        </div>
                    )}

                    {/* Render the new client component ONLY if there are applications */}
                    {appList.length > 0 && (
                        <ApplicationList applications={appList} />
                    )}
                </div>
                {/* --- End Applications List --- */}
            </div>
        </div>
    );
}