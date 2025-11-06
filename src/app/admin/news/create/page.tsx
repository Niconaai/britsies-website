// src/app/admin/news/create/page.tsx
'use client'; 

import Link from 'next/link';
// --- 1. VOEG useFormStatus EN Image BY ---
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import RichTextEditor from './RichTextEditor'; 
import { createPost } from './actions';

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
      className="rounded-md border border-white bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[120px] min-h-[38px] dark:focus:ring-offset-zinc-800"
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
          Stoor...
        </>
      ) : (
        'Stoor Pos'
      )}
    </button>
  );
}
// --- EINDE VAN NUWE KOMPONENTE ---


export default function CreateNewsPostPage() {
  
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Skep Nuwe Nuuspos
        </h1>
        <Link
          href="/admin/news"
          className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Kanselleer
        </Link>
      </div>

      <form action={createPost} className="space-y-6">
        {/* --- 4. VOEG DIE OORLEG BY --- */}
        <LoadingOverlay />

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Titel: </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            name="title" 
            id="title" 
            required 
          />
        </div>

        {/* Slug Field */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Slak (Slug): </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            name="slug" 
            id="slug" 
            required 
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"> Unieke identifiseerder vir die URL (bv., /nuus/unieke-berig...). Gebruik slegs kleinletters, syfers en koppeltekens (-). </p>
        </div>

         {/* Image URL Field */}
         <div>
           <label htmlFor="image_url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"> Hoofbeeld URL (Opsioneel): </label>
           <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="url" 
            name="image_url" 
            id="image_url" 
          />
         </div>

        {/* Content Field (Rich Text Editor) */}
        <div>
          <label
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Inhoud
          </label>
          <div className="mt-1">
            <RichTextEditor />
             <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Die hoofartikel inhoud. Gebruik die nutsbalk vir formatering.
             </p>
          </div>
        </div>

        {/* Publish Status Toggle */}
        <div className="flex items-center">
          <input 
            id="is_published" 
            name="is_published" 
            type="checkbox" 
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:focus:ring-blue-600 dark:ring-offset-zinc-800"
          />
          <label htmlFor="is_published" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300"> Gepubliseer? </label>
        </div>

        {/* --- 5. VERVANG DIE SubmitButton MET ONS NUWE KNOPPIE --- */}
        <div className="flex justify-end">
          <FormSubmitButton />
        </div>
      </form>
    </div>
  );
}