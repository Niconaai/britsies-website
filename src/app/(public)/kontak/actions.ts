// src/app/(public)/kontak/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Skema vir validering
const contactSchema = z.object({
  fullName: z.string().min(3, "Naam is te kort"),
  email: z.string().email("Ongeldige e-posadres"),
  message: z.string().min(10, "Boodskap is te kort"),
});

// Tipe vir die 'state' wat ons terugstuur
export type ContactFormState = {
  success: boolean;
  message: string | null;
  errors?: {
    fullName?: string[];
    email?: string[];
    message?: string[];
  } | null;
}

export async function sendContactEmail(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  
  const validatedFields = contactSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  // As validering misluk, stuur foute terug
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Kon nie die vorm stuur nie. Gaan asseblief foute na.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, message } = validatedFields.data;
  const supabase = await createClient();
  const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);

  try {
    // 1. Gaan haal die admin e-posadres
    const { data: settingData, error: settingError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'application_admin_email') // Ons hergebruik die aansoek-admin e-pos
        .single();
        
    if (settingError || !settingData?.value) {
      throw new Error(`Kon nie 'application_admin_email' van DB kry nie: ${settingError?.message}`);
    }
    
    const adminEmail = settingData.value;

    // 2. Stuur die e-pos
    await resend.emails.send({
      from: 'Hoërskool Brits Kontakvorm <info@nicolabsdigital.co.za>',
      to: [adminEmail],
      subject: `Nuwe Kontakvorm-boodskap van ${fullName}`,
      replyTo: email, // Belangrik: 'Reply' gaan na die gebruiker se e-pos
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nuwe Boodskap vanaf Hoërskool Brits Webwerf</h2>
          <p><strong>Van:</strong> ${fullName}</p>
          <p><strong>E-pos:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Boodskap:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    return { success: true, message: "Dankie! Jou boodskap is gestuur." };

  } catch (error) {
    console.error("Fout met stuur van kontak-epos:", error);
    return { 
      success: false, 
      message: "Daar was 'n onbekende fout. Probeer asseblief weer later.",
      errors: null 
    };
  }
}