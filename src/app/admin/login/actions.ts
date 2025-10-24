// app/admin/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/server'

export async function login(formData: FormData) {
  // *** MUST AWAIT the async function call ***
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    redirect('/admin/login?error=Invalid credentials')
    return
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}