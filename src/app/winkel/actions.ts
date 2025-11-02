// src/app/winkel/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOutFromWinkel() {
  const supabase = await createClient(); 
  await supabase.auth.signOut();
  return redirect('/winkel'); 
}