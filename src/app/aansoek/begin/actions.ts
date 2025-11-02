// src/app/aansoek/begin/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  // --- 1. LEES DIE NUWE VERBORGE VELD ---
  const redirectTo = formData.get('redirect_to') as string;

  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  if (signInError) {
    const errorParams = new URLSearchParams({ error: 'invalid_credentials' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    return redirect(`/aansoek/begin?${errorParams.toString()}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const errorParams = new URLSearchParams({ error: 'User not found after sign in' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    return redirect(`/aansoek/begin?${errorParams.toString()}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    const errorParams = new URLSearchParams({ error: 'Profile not found' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    return redirect(`/aansoek/begin?${errorParams.toString()}`);
  }

  if (profile.role === 'parent') {
    // --- 2. GEBRUIK DIE 'redirectTo' WAARDE ---
    // As 'redirectTo' bestaan en 'n geldige pad is, gebruik dit.
    // Anders, val terug na die verstek '/aansoek'.
    const finalRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/aansoek';
    revalidatePath(finalRedirect, 'layout')
    return redirect(finalRedirect)
    // --- EINDE VAN REGSTELLING ---
  } else {
    await supabase.auth.signOut(); 
    const errorParams = new URLSearchParams({ error: 'access_denied' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    return redirect(`/aansoek/begin?${errorParams.toString()}`);
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // --- 1. LEES DIE NUWE VERBORGE VELD ---
  const redirectTo = formData.get('redirect_to') as string | null;
  const redirectParams = new URLSearchParams();
  if (redirectTo) redirectParams.set('redirect_to', redirectTo);

  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('password-confirm') as string;
  const email = formData.get('email') as string;

  const profileData = {
    full_name: formData.get('full_name') as string,
    cell_phone: formData.get('cell_phone') as string,
    shipping_address_line1: formData.get('shipping_address_line1') as string,
    shipping_address_line2: formData.get('shipping_address_line2') as string,
    shipping_city: formData.get('shipping_city') as string,
    shipping_province: formData.get('shipping_province') as string,
    shipping_code: formData.get('shipping_code') as string,
  };

  // --- 2. DATEER ALLE 'redirect' OPROEPE OP ---
  if (password !== passwordConfirm) {
    redirectParams.set('error', 'Wagwoorde stem nie ooreen nie');
    return redirect(`/aansoek/begin?${redirectParams.toString()}`);
  }
  
  if (!email || !password) {
    redirectParams.set('error', 'E-pos en wagwoord word vereis');
    return redirect(`/aansoek/begin?${redirectParams.toString()}`);
  }
  
  if (!profileData.full_name || !profileData.cell_phone || !profileData.shipping_address_line1 || !profileData.shipping_city || !profileData.shipping_province || !profileData.shipping_code) {
    redirectParams.set('error', 'Maak asseblief seker al die vereiste velde is ingevul.');
    return redirect(`/aansoek/begin?${redirectParams.toString()}`);
  }

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        ...profileData,
        role: 'parent'
      }
    }
  });

  if (error) {
    console.error('Signup Error:', error);
    redirectParams.set('error', encodeURIComponent(error.message));
    return redirect(`/aansoek/begin?${redirectParams.toString()}`);
  }

  // --- 3. STUUR 'redirectTo' SAAM MET SUKSES-BOODSKAP ---
  redirectParams.set('message', 'rekening_geskep');
  return redirect(`/aansoek/begin?${redirectParams.toString()}`);
}

export async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/aansoek/begin')
}