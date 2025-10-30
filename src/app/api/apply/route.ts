// src/app/api/apply/route.ts
import { createClient } from "@/utils/supabase/server"; // We'll use the server client for route handlers
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("POST /api/apply received");
    const supabase = await createClient(); // Use await as your util is async

    // Check if user is authenticated (as a basic security layer, though this is a public route)
    // You might skip this if the application form is fully public
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //     return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    // }

    try {
        const formData = await request.formData();

        // --- Week 6 Logic will go here ---
        // 1. Get all text fields
        const learnerSurname = formData.get('learnerSurname') as string;
        console.log("Received learnerSurname:", learnerSurname);
        
        // 2. Get file fields (e.g., learnerPhoto, docBirthCert)
        // const learnerPhoto = formData.get('learnerPhoto') as File | null;
        // console.log("Received learnerPhoto:", learnerPhoto?.name);

        // 3. TODO: Validate data (e.g., using Zod)

        // 4. TODO: Insert into 'applications' table
        // const { data: appData, error: appError } = await supabase.from('applications').insert({ status: 'pending' }).select().single();
        // if (appError) throw appError;
        // const applicationId = appData.id;

        // 5. TODO: Insert into 'learners', 'guardians', 'payers' tables using applicationId

        // 6. TODO: Upload files to Supabase Storage (e.g., `application-uploads/[applicationId]/...`)
        // if (learnerPhoto) {
        //    const { error: storageError } = await supabase.storage.from('application-uploads').upload(`${applicationId}/learner_photo.jpg`, learnerPhoto);
        //    if (storageError) throw storageError;
        //    // 7. TODO: Insert record into 'uploaded_files' table
        // }

        // 8. TODO: Send confirmation emails (Resend)

        // --- End Week 6 Logic ---


        // If successful (placeholder response):
        return NextResponse.json({ success: true, message: "Application received (processing placeholder)", data: { learnerSurname: learnerSurname } });

    } catch (error) {
        console.error("Error in /api/apply:", error);
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}