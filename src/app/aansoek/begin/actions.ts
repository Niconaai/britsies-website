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

  // 1. Sign in the user
  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  if (signInError) {
    return redirect('/aansoek/begin?error=invalid_credentials')
  }

  // 2. Get the user we just signed in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/aansoek/begin?error=User not found after sign in');
  }

  // 3. Check their role from our 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut(); // Log them out
    return redirect('/aansoek/begin?error=Profile not found');
  }

  // 4. THE CHECK: Are they a parent?
  if (profile.role === 'parent') {
    // SUCCESS: They are a parent, proceed to application dashboard
    revalidatePath('/aansoek', 'layout')
    return redirect('/aansoek')
  } else {
    // FAILURE: They are an admin or have no role
    await supabase.auth.signOut(); // Log them out immediately
    return redirect('/aansoek/begin?error=access_denied') // Send "Access Denied" error
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/aansoek/begin?error=Could not sign up user')
  }

  // Email confirmation is required.
  // We should add a "check your email" message.
  // For now, we redirect back with a success message.
  return redirect('/aansoek/begin?message=Check your email to confirm your account')
}

export async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/aansoek/begin')
}