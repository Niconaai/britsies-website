// src/app/aansoek/begin/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ClientAuthPage from './clientAuthPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hoërskool Brits | Aanteken",
  description: "Bestuur jou aansoeke by Hoërskool Brits",
};

type AuthMessageProps = {
  message: string;
  type: 'success' | 'error';
} | null;

export default async function ApplicationAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    message?: string; 
    error?: string;
    redirect_to?: string; 
  }>;
}) {
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/aansoek');
  }

  const resolvedSearchParams = await searchParams;

  let authMessage: AuthMessageProps = null;
  let message = '';
  if (resolvedSearchParams.error) {
    message = "Daar was 'n onbekende fout. Probeer asseblief weer.";
    if (resolvedSearchParams.error === 'invalid_credentials') {
      message = "E-pos of wagwoord is verkeerd. As jy nog nie 'n rekening het nie, vul jou besonderhede in in die blokkies hieronder en klik 'Skep Rekening'.";
    }
    if (resolvedSearchParams.error === 'access_denied') {
      message = "Toegang geweier. Hierdie portaal is slegs vir ouers. Admins moet die admin-portaal gebruik.";
    }
    authMessage = { message, type: 'error' };
  } else if (resolvedSearchParams.message) {
    if (resolvedSearchParams.message === 'rekening_geskep') {
      message = "Sukses! Gaan asseblief jou e-posse na om jou rekening te bevestig voordat jy inteken.";
    }
    authMessage = { message, type: 'success' };
  }

  const redirectUrl = resolvedSearchParams.redirect_to || null;

  return <ClientAuthPage 
    initialMessage={authMessage} 
    redirectUrl={redirectUrl} 
  />;
}