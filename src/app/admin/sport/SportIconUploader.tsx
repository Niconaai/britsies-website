// src/app/admin/sport/SportIconUploader.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImageUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export default function SportIconUploader({ currentImageUrl, onUploadComplete }: ImageUploaderProps) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);

  // Verseker dat die voorskou opdateer as die prop van buite verander
  useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; 
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sport-icons') // <-- KORREKTE EMMER
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('sport-icons') // <-- KORREKTE EMMER
        .getPublicUrl(uploadData.path);

      if (!urlData.publicUrl) {
        throw new Error("Kon nie publieke URL kry nie.");
      }

      setPreviewUrl(urlData.publicUrl);
      onUploadComplete(urlData.publicUrl);

    } catch (err: any) {
      console.error("Fout met oplaai:", err);
      setError(err.message || "Kon nie die lêer oplaai nie.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Sport Ikoon
      </label>
      
      {/* Vierkantige aspek-verhouding vir ikone */}
      <div className="w-48 h-48 relative rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 flex items-center justify-center">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Sport ikoon voorskou"
            layout="fill"
            objectFit="contain" // 'contain' is beter vir ikone
            className="rounded-md p-2"
          />
        ) : (
          <span className="text-sm text-zinc-500">Geen ikoon</span>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
            <Image
              src="/CircleLoader.gif"
              alt="Besig..."
              width={40}
              height={40}
              unoptimized={true}
            />
          </div>
        )}
      </div>

      <div>
        <input
          id="sport-icon-upload"
          name="sport-icon-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}