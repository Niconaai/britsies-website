// src/app/admin/news/edit/[postId]/EditNewsForm.tsx
'use client';

// --- 1. VOEG useFormStatus EN Image BY ---
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import RichTextEditor from '../../create/RichTextEditor';
import { updatePost } from './actions';

// Define the type for the post prop
type NewsPost = {
    id: string;
    title: string | null;
    slug: string | null;
    content: string | null;
    image_url: string | null;
    is_published: boolean | null;
    published_at: string | null;
    created_at: string;
};

// --- 2. SKEP DIE VOLSKERM-OORLEG KOMPONENT ---
function LoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-800">
        <Image
          src="/CircleLoader.gif"
          alt="Besig om te laai..."
          width={80}
          height={80}
          unoptimized={true}
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Besig om nuuspos te stoor...
        </p>
      </div>
    </div>
  );
}

// --- 3. SKEP 'N SUB-KOMPONENT VIR DIE KNOPPIE ---
function FormSubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-white bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[170px] min-h-[38px] dark:focus:ring-offset-zinc-800"
    >
      {pending ? (
        <>
          <Image
            src="/CircleLoader.gif"
            alt="Besig..."
            width={20}
            height={20}
            unoptimized={true}
            className="mr-2"
          />
          Stoor tans...
        </>
      ) : (
        'Stoor Veranderinge'
      )}
    </button>
  );
}
// --- EINDE VAN NUWE KOMPONENTE ---


// Client Component for the Form
export default function EditNewsForm({ post }: { post: NewsPost }) {

    return (
        // Use the updatePost server action
        <form action={updatePost} className="space-y-6">
            {/* --- 4. VOEG DIE OORLEG BY --- */}
            <LoadingOverlay />
            
            <input type="hidden" name="postId" value={post.id} />

            {/* Title Field */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Titel </label>
                <input
                    type="text" name="title" id="title" required defaultValue={post.title ?? ''}
                    className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                />
            </div>

            {/* Slug Field */}
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Slak (Slug) </label>
                <input
                    type="text" name="slug" id="slug" required defaultValue={post.slug ?? ''}
                    className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"> Unieke identifiseerder vir die URL (bv., /nuus/unieke-berig...). Gebruik slegs kleinletters, syfers en koppeltekens (-). </p>
            </div>

            {/* Image URL Field */}
            <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Hoofbeeld URL (Opsioneel) </label>
                <input
                    type="url" name="image_url" id="image_url" defaultValue={post.image_url ?? ''}
                    className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
                />
            </div>

            {/* Content Field (Rich Text Editor) */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Inhoud </label>
                <div className="mt-1">
                    <RichTextEditor initialContent={post.content ?? ''} />
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"> Die hoofartikel inhoud. Gebruik die nutsbalk vir formatering. </p>
                </div>
            </div>

            {/* Publish Status Toggle */}
            <div className="flex items-center">
                <input
                    id="is_published" name="is_published" type="checkbox" defaultChecked={post.is_published ?? false}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:focus:ring-blue-600 dark:ring-offset-zinc-800"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300"> Gepubliseer? (Merk om die pos sigbaar te maak op die webwerf) </label>
            </div>

            {/* --- 5. VERVANG DIE SubmitButton MET ONS NUWE KNOPPIE --- */}
            <div className="flex justify-end">
                <FormSubmitButton />
            </div>
        </form>
    );
}