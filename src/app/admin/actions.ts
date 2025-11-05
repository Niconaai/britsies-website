// src/app/admin/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Stuur hulle terug na die admin-aantekenbladsy
  return redirect('/login'); 
}