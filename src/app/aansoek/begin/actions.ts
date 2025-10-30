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

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/aansoek/begin?error=Invalid credentials')
  }

  revalidatePath('/aansoek', 'layout')
  redirect('/aansoek')
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