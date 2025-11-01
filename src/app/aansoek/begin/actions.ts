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

  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  if (signInError) {
    return redirect('/aansoek/begin?error=invalid_credentials')
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/aansoek/begin?error=User not found after sign in');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return redirect('/aansoek/begin?error=Profile not found');
  }

  if (profile.role === 'parent') {
    revalidatePath('/aansoek', 'layout')
    return redirect('/aansoek')
  } else {
    await supabase.auth.signOut(); 
    return redirect('/aansoek/begin?error=access_denied')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

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

  if (password !== passwordConfirm) {
    return redirect('/aansoek/begin?error=Wagwoorde stem nie ooreen nie');
  }
  
  if (!email || !password) {
    return redirect('/aansoek/begin?error=E-pos en wagwoord word vereis');
  }
  
  if (!profileData.full_name || !profileData.cell_phone || !profileData.shipping_address_line1 || !profileData.shipping_city || !profileData.shipping_province || !profileData.shipping_code) {
    return redirect('/aansoek/begin?error=Maak asseblief seker al die vereiste velde is ingevul.');
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
    return redirect(`/aansoek/begin?error=${encodeURIComponent(error.message)}`);
  }

  // E-pos bevestiging word vereis.
  return redirect('/aansoek/begin?message=rekening_geskep');
}

export async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/aansoek/begin')
}