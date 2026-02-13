// src/app/(public)/vakature/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Schema for validation
const applicationSchema = z.object({
    vacancyId: z.string().uuid(),
    applicantName: z.string().min(3, "Naam is te kort"),
    applicantEmail: z.string().email("Ongeldige e-posadres"),
    applicantPhone: z.string().min(10, "Telefoonnommer is te kort"),
    coverLetter: z.string().min(50, "Dekbrief is te kort"),
});

export type ApplicationFormState = {
    success: boolean;
    message: string | null;
    errors?: {
        applicantName?: string[];
        applicantEmail?: string[];
        applicantPhone?: string[];
        coverLetter?: string[];
    } | null;
};

export async function submitVacancyApplication(
    prevState: ApplicationFormState,
    formData: FormData
): Promise<ApplicationFormState> {
    
    const validatedFields = applicationSchema.safeParse({
        vacancyId: formData.get('vacancyId'),
        applicantName: formData.get('applicantName'),
        applicantEmail: formData.get('applicantEmail'),
        applicantPhone: formData.get('applicantPhone'),
        coverLetter: formData.get('coverLetter'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Kon nie die aansoek stuur nie. Gaan asseblief foute na.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { vacancyId, applicantName, applicantEmail, applicantPhone, coverLetter } = validatedFields.data;
    const supabase = await createClient();

    // Handle file uploads
    const cvFile = formData.get('cv') as File | null;
    let cvUrl: string | null = null;

    if (cvFile && cvFile.size > 0) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}_${applicantName.replace(/\s+/g, '_')}_CV.${fileExt}`;
        const filePath = `${vacancyId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vacancy-applications')
            .upload(filePath, cvFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading CV:', uploadError);
            return {
                success: false,
                message: "Kon nie CV oplaai nie. Probeer asseblief weer.",
                errors: null,
            };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('vacancy-applications')
            .getPublicUrl(filePath);
        
        cvUrl = publicUrl;
    }

    // Handle additional documents
    const additionalDocs: string[] = [];
    const additionalFiles = formData.getAll('additionalDocuments') as File[];
    
    for (const file of additionalFiles) {
        if (file && file.size > 0) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${applicantName.replace(/\s+/g, '_')}_${file.name}`;
            const filePath = `${vacancyId}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('vacancy-applications')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('vacancy-applications')
                    .getPublicUrl(filePath);
                additionalDocs.push(publicUrl);
            }
        }
    }

    // Insert application into database
    const { error: insertError } = await supabase
        .from('vacancy_applications')
        .insert({
            vacancy_id: vacancyId,
            applicant_name: applicantName,
            applicant_email: applicantEmail,
            applicant_phone: applicantPhone,
            cover_letter: coverLetter,
            cv_url: cvUrl,
            additional_documents: additionalDocs.length > 0 ? additionalDocs : null,
            status: 'pending',
        });

    if (insertError) {
        console.error('Error inserting application:', insertError);
        return {
            success: false,
            message: "Kon nie aansoek stoor nie. Probeer asseblief weer.",
            errors: null,
        };
    }

    // Send confirmation email to applicant
    // Send notification email to admin
    try {
        const resend = new Resend(process.env.BRITSIES_RESEND_API_KEY);
        
        // Get vacancy details
        const { data: vacancy } = await supabase
            .from('vacancies')
            .select('title')
            .eq('id', vacancyId)
            .single();

        // Send to applicant
        await resend.emails.send({
            from: 'Hoërskool Brits <noreply@hsbrits.co.za>',
            to: applicantEmail,
            subject: `Aansoek Ontvang: ${vacancy?.title || 'Vakature'}`,
            html: `
                <h2>Dankie vir jou aansoek!</h2>
                <p>Beste ${applicantName},</p>
                <p>Ons het jou aansoek vir die pos van <strong>${vacancy?.title || 'Vakature'}</strong> ontvang.</p>
                <p>Ons sal jou kontak sodra ons besluit geneem het.</p>
                <br>
                <p>Vriendelike groete,</p>
                <p>Hoërskool Brits</p>
            `,
        });

        // Send to admin
        await resend.emails.send({
            from: 'Hoërskool Brits <noreply@hsbrits.co.za>',
            to: 'hoof@hsbrits.co.za',
            subject: `Nuwe Vakature Aansoek: ${vacancy?.title || 'Vakature'}`,
            html: `
                <h2>Nuwe Vakature Aansoek</h2>
                <p><strong>Vakature:</strong> ${vacancy?.title || 'Unknown'}</p>
                <p><strong>Aansoeker:</strong> ${applicantName}</p>
                <p><strong>E-pos:</strong> ${applicantEmail}</p>
                <p><strong>Telefoon:</strong> ${applicantPhone}</p>
                <p><strong>Dekbrief:</strong></p>
                <p>${coverLetter}</p>
                ${cvUrl ? `<p><a href="${cvUrl}">Sien CV</a></p>` : ''}
                <p><a href="https://hsbrits.co.za/admin/vakature/aansoeke">Sien alle aansoeke in die admin paneel</a></p>
            `,
        });
    } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the whole operation if email fails
    }

    return {
        success: true,
        message: "Jou aansoek is suksesvol ingedien! Ons sal jou binnekort kontak.",
        errors: null,
    };
}
