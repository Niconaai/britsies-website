// src/app/(public)/vakature/page.tsx
import { createClient } from '@/utils/supabase/server';
import VakaturesClientPage from './VakaturesClientPage';

// Define the vacancy type
export type Vacancy = {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    closing_date: string;
    start_date: string | null;
    created_at: string;
};

export default async function VakaturePage() {
    const supabase = await createClient();

    // Fetch active and published vacancies
    const { data: vacancies, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('is_published', true)
        .eq('is_active', true)
        .gte('closing_date', new Date().toISOString().split('T')[0]) // Only show vacancies that haven't closed yet
        .order('closing_date', { ascending: true });

    if (error) {
        console.error('Error fetching vacancies:', error);
    }

    return <VakaturesClientPage vacancies={vacancies || []} />;
}
