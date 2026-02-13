// src/app/admin/news/create/page.tsx
'use client'; 

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import RichTextEditor from './RichTextEditor'; 
import { createPost } from './actions';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsImageUploader from '../NewsImageUploader';

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
          Besig om te stoor...
        </p>
      </div>
    </div>
  );
}

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
        'Stoor'
      )}
    </button>
  );
}

export default function CreateNewsPostPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [publicationType, setPublicationType] = useState<'news' | 'newsletter'>(
    typeParam === 'newsletter' ? 'newsletter' : 'news'
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadComplete = (urls: string[]) => {
    setImageUrls(urls);
  };
  
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {publicationType === 'newsletter' ? 'Skep Nuwe Nuusbrief' : 'Skep Nuwe Nuuspos'}
        </h1>
        <Link
          href="/admin/news"
          className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Kanselleer
        </Link>
      </div>

      <form action={createPost} className="space-y-6">
        <LoadingOverlay />

        {/* Hidden fields */}
        <input type="hidden" name="image_urls" value={JSON.stringify(imageUrls)} />
        <input type="hidden" name="publication_type" value={publicationType} />

        {/* Publication Type Toggle */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Publikasie Tipe
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPublicationType('news')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                publicationType === 'news'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              📰 Individuele Nuus
            </button>
            <button
              type="button"
              onClick={() => setPublicationType('newsletter')}
              className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                publicationType === 'newsletter'
                  ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              📄 Nuusbrief Uitgawe
            </button>
          </div>
        </div>

        {/* Newsletter-specific fields */}
        {publicationType === 'newsletter' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edition_number" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Uitgawe Nommer *
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
                  type="number" 
                  name="edition_number" 
                  id="edition_number" 
                  min="1"
                  required={publicationType === 'newsletter'}
                  placeholder="bv. 1, 2, 3..."
                />
              </div>
              <div>
                <label htmlFor="date_range" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Datum Reeks *
                </label>
                <input 
                  className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
                  type="text" 
                  name="date_range" 
                  id="date_range" 
                  required={publicationType === 'newsletter'}
                  placeholder="bv. 6-12 Februarie 2026"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              💡 Tip: Nadat jy die nuusbrief geskep het, kan jy seksies ("Van die Hoof", "Sport", ens.) daaraan toevoeg.
            </p>
          </div>
        )}

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Titel *
          </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            name="title" 
            id="title" 
            required 
            placeholder={publicationType === 'newsletter' ? 'bv. Nuusbrief 1 - Februarie 2026' : 'bv. Sport Prestasies'}
          />
        </div>

        {/* Slug Field */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Slak (Slug) *
          </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            name="slug" 
            id="slug" 
            required 
            placeholder={publicationType === 'newsletter' ? 'bv. nuusbrief-1-februarie-2026' : 'bv. sport-prestasies-14-feb'}
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Unieke identifiseerder vir die URL. Gebruik slegs kleinletters, syfers en koppeltekens (-).
          </p>
        </div>

        {/* Image Uploader */}
        <div>
          <NewsImageUploader
            onUploadComplete={handleUploadComplete}
            maxImages={5}
          />
        </div>

        {/* Content Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Inhoud {publicationType === 'newsletter' ? '(Opsioneel vir uitgawe)' : '*'}
          </label>
          <div className="mt-1">
            <RichTextEditor />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {publicationType === 'newsletter' 
                ? 'Jy kan dit leeg laat en seksies later byvoeg, of gebruik dit vir \'n inleidende boodskap.'
                : 'Die hoofartikel inhoud.'
              }
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
          <label htmlFor="is_published" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
            Gepubliseer?
          </label>
        </div>

        <div className="flex justify-end">
          <FormSubmitButton />
        </div>
      </form>
    </div>
  );
}