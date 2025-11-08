// src/app/admin/news/NewsImageUploader.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface NewsImageUploaderProps {
  initialImageUrls?: string[] | null;
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
}

export default function NewsImageUploader({
  initialImageUrls = [],
  onUploadComplete,
  maxImages = 5,
}: NewsImageUploaderProps) {
  const supabase = createClient();
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls || []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    if (imageUrls.length + event.target.files.length > maxImages) {
      setError(`Jy kan slegs 'n maksimum van ${maxImages} prente oplaai.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    const files = Array.from(event.target.files);
    const uploadedUrls: string[] = [...imageUrls];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news-uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('public-assets') // Ons gebruik dieselfde 'public-assets' emmer
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        setError(`Kon nie lêer oplaai nie: ${uploadError.message}`);
        setIsUploading(false); // Stop op fout
        return;
      }

      // Kry die publieke URL
      const { data: publicUrlData } = supabase.storage
        .from('public-assets')
        .getPublicUrl(data.path);
      
      if (publicUrlData) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }
    
    setImageUrls(uploadedUrls);
    onUploadComplete(uploadedUrls); // Stuur die volle lys terug
    setIsUploading(false);
  };

  const removeImage = (urlToRemove: string) => {
    const newImageUrls = imageUrls.filter(url => url !== urlToRemove);
    setImageUrls(newImageUrls);
    onUploadComplete(newImageUrls);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Nuusberig Prente (Tot {maxImages})
      </label>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Die eerste prent sal as die hoof- ("featured") prent gebruik word. Sleep prente om te herrangskik (nog nie geïmplementeer nie - kom ons hou dit eenvoudig vir eers).
      </p>
      
      {/* Prent Voorskou Rooster */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <Image
              src={url}
              alt={`Opgelaaide prent ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold transition hover:bg-red-700"
              aria-label="Verwyder prent"
            >
              X
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 w-full bg-black/60 px-2 py-1 text-center text-xs font-semibold text-white">
                Hoofprent
              </div>
            )}
          </div>
        ))}

        {/* Oplaai Knoppie */}
        {imageUrls.length < maxImages && (
          <label className="relative aspect-square flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700">
            {isUploading ? (
              <Image
                src="/CircleLoader.gif"
                alt="Laai op..."
                width={40}
                height={40}
                unoptimized
              />
            ) : (
              <svg className="h-10 w-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )}
            <span className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              {isUploading ? 'Laai op...' : 'Klik om op te laai'}
            </span>
            <input
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              multiple
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading || imageUrls.length >= maxImages}
            />
          </label>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}