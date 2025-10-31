// src/app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server' 

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return redirect('/login?error=Email and password are required')
  }

  // 1. Sign in the user
  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  if (signInError) {
    return redirect('/login?error=Invalid credentials')
  }

  // 2. Get the user we just signed in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login?error=User not found after sign in');
  }

  // 3. Check their role from our 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut(); // Log them out
    return redirect('/login?error=Profile not found');
  }

  // 4. THE CRITICAL CHECK: Are they an admin?
  if (profile.role === 'admin') {
    // SUCCESS: They are an admin, proceed to admin dashboard
    revalidatePath('/admin', 'layout')
    return redirect('/admin')
  } else {
    // FAILURE: They are a parent or have no role
    await supabase.auth.signOut(); // Log them out immediately
    return redirect('/login?error=access_denied') // Send "Access Denied" error
  }
}