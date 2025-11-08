// src/app/portaal/begin/actions.ts
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
  
  const redirectTo = formData.get('redirect_to') as string;

  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  if (signInError) {
    const errorParams = new URLSearchParams({ error: 'invalid_credentials' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    // REGSTELLING: Wys na /portaal/begin
    return redirect(`/portaal/begin?${errorParams.toString()}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const errorParams = new URLSearchParams({ error: 'User not found after sign in' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    // REGSTELLING: Wys na /portaal/begin
    return redirect(`/portaal/begin?${errorParams.toString()}`);
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
    // REGSTELLING: Wys na /portaal/begin
    return redirect(`/portaal/begin?${errorParams.toString()}`);
  }

  if (profile.role === 'parent') {
    // REGSTELLING: Val terug na /portaal (die dashboard)
    const finalRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/portaal';
    revalidatePath(finalRedirect, 'layout')
    return redirect(finalRedirect)
  } else {
    await supabase.auth.signOut(); 
    const errorParams = new URLSearchParams({ error: 'access_denied' });
    if (redirectTo) errorParams.set('redirect_to', redirectTo);
    // REGSTELLING: Wys na /portaal/begin
    return redirect(`/portaal/begin?${errorParams.toString()}`);
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

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

  // REGSTELLING: Wys alle redirects na /portaal/begin
  if (password !== passwordConfirm) {
    redirectParams.set('error', 'Wagwoorde stem nie ooreen nie');
    return redirect(`/portaal/begin?${redirectParams.toString()}`);
  }
  
  if (!email || !password) {
    redirectParams.set('error', 'E-pos en wagwoord word vereis');
    return redirect(`/portaal/begin?${redirectParams.toString()}`);
  }
  
  if (!profileData.full_name || !profileData.cell_phone || !profileData.shipping_address_line1 || !profileData.shipping_city || !profileData.shipping_province || !profileData.shipping_code) {
    redirectParams.set('error', 'Maak asseblief seker al die vereiste velde is ingevul.');
    return redirect(`/portaal/begin?${redirectParams.toString()}`);
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
    return redirect(`/portaal/begin?${redirectParams.toString()}`);
  }

  redirectParams.set('message', 'rekening_geskep');
  return redirect(`/portaal/begin?${redirectParams.toString()}`);
}

export async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  // REGSTELLING: Stuur terug na die nuwe aanteken-bladsy
  return redirect('/portaal/begin')
}