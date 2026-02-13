// src/app/admin/news/newsletter/[id]/sections/create/page.tsx
'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import RichTextEditor from '@/app/admin/news/create/RichTextEditor';
import NewsImageUploader from '@/app/admin/news/NewsImageUploader';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

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
          Besig om seksie te stoor...
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
      className="rounded-md bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
    >
      {pending ? 'Stoor...' : 'Stoor Seksie'}
    </button>
  );
}

export default function CreateSectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const newsletterId = params.id as string;
  const templateTitle = searchParams.get('template');

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [sectionTitle, setSectionTitle] = useState(templateTitle || '');
  const [title, setTitle] = useState('');
  const [sectionOrder, setSectionOrder] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getNextOrder() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('news_posts')
        .select('section_order')
        .eq('parent_newsletter_id', newsletterId)
        .eq('publication_type', 'newsletter_section')
        .order('section_order', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setSectionOrder((data[0].section_order || 0) + 1);
      }
    }
    getNextOrder();
  }, [newsletterId]);

  const handleUploadComplete = (urls: string[]) => {
    setImageUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const content = formData.get('content') as string;
    const is_published = formData.get('is_published') === 'on';
    const slug = `${newsletterId}-${sectionTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const { error } = await supabase
      .from('news_posts')
      .insert([
        {
          title,
          slug,
          content,
          image_urls: imageUrls,
          is_published,
          publication_type: 'newsletter_section',
          parent_newsletter_id: newsletterId,
          section_title: sectionTitle,
          section_order: sectionOrder,
          published_at: is_published ? new Date().toISOString() : null,
        },
      ]);

    setIsLoading(false);

    if (error) {
      alert(`Fout: ${error.message}`);
    } else {
      router.push(`/admin/news/newsletter/${newsletterId}/sections`);
      router.refresh();
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Voeg Nuusbrief Seksie By
        </h1>
        <Link
          href={`/admin/news/newsletter/${newsletterId}/sections`}
          className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Kanselleer
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isLoading && <LoadingOverlay />}

        {/* Section Type */}
        <div>
          <label htmlFor="section_title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Seksie Tipe *
          </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            id="section_title" 
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            required 
            placeholder="bv. Van die Hoof, Sport, Kultuur"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Die kategorie van hierdie seksie (word bo-aan die seksie gewys)
          </p>
        </div>

        {/* Section Order */}
        <div>
          <label htmlFor="section_order" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Volgorde *
          </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="number" 
            id="section_order" 
            value={sectionOrder}
            onChange={(e) => setSectionOrder(parseInt(e.target.value))}
            min="1"
            required 
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Die volgorde waarin hierdie seksie in die nuusbrief verskyn
          </p>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Opskrif *
          </label>
          <input 
            className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-zinc-700 dark:text-white dark:border-zinc-600" 
            type="text" 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
            placeholder="bv. Welkom terug vir 2026!"
          />
        </div>

        {/* Images */}
        <div>
          <NewsImageUploader
            onUploadComplete={handleUploadComplete}
            maxImages={10}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Inhoud *
          </label>
          <div className="mt-1">
            <RichTextEditor />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Die inhoud van hierdie seksie
            </p>
          </div>
        </div>

        {/* Publish Status */}
        <div className="flex items-center">
          <input 
            id="is_published" 
            name="is_published" 
            type="checkbox" 
            defaultChecked
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_published" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
            Gepubliseer?
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/news/newsletter/${newsletterId}/sections`}
            className="rounded-md border border-zinc-300 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            Kanselleer
          </Link>
          <FormSubmitButton />
        </div>
      </form>
    </div>
  );
}
