'use client'; 

import Link from 'next/link';
//import { useState } from 'react'; 
import RichTextEditor from './RichTextEditor'; 
import { createPost } from './actions';

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

      <form action={createPost} className="space-y-6"> {/* Use handler for now */}
        {/* Title Field */}
        <div>
          <label htmlFor="title" /* ... */ > Titel: </label>
          <input className="rounded-md border border-zinc-300 py-1 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700" type="text" name="title" id="title" required /* ... */ />
        </div>

        {/* Slug Field */}
        <div>
          <label htmlFor="slug" /* ... */ > Slak (Slug): </label>
          <input className="rounded-md border border-zinc-300 py-1 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700" type="text" name="slug" id="slug" required /* ... */ />
          <p /* ... */ > Unieke identifiseerder... </p>
        </div>

         {/* Image URL Field */}
         <div>
           <label htmlFor="image_url" /* ... */ > Hoofbeeld URL (Opsioneel): </label>
           <input className="rounded-md border border-zinc-300 py-1 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700" type="url" name="image_url" id="image_url" /* ... */ />
         </div>

        {/* --- REPLACE TEXTAREA WITH EDITOR --- */}
        <div>
          <label
            // No 'htmlFor' needed now as label is conceptual for the component
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Inhoud
          </label>
          <div className="mt-1">
             {/* Pass the state setter function to the editor */}
            <RichTextEditor />
             <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Die hoofartikel inhoud. Gebruik die nutsbalk vir formatering.
             </p>
          </div>
        </div>
        {/* --- END EDITOR INTEGRATION --- */}

        {/* Publish Status Toggle */}
        <div className="flex items-center">
          <input id="is_published" name="is_published" type="checkbox" /* ... */ />
          <label htmlFor="is_published" /* ... */ > Gepubliseer? </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700" /* ... */ > Stoor Pos </button>
        </div>
      </form>
    </div>
  );
}