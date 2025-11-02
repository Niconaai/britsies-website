// src/app/admin/winkel/produkte/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // <-- ONS GEBRUIK DIE KLIËNT-WEERGAWE
import Image from 'next/image';

interface ImageUploaderProps {
  currentImageUrl: string | null;
  onUploadComplete: (url: string) => void; // Stuur die nuwe URL terug na die ouer
}

export default function ImageUploader({ currentImageUrl, onUploadComplete }: ImageUploaderProps) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gebruik 'n plaaslike state om die prent onmiddellik te wys
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Genereer 'n unieke lêernaam
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // Plaas in die "root" van die emmer

      // 1. Laai die lêer op
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images') // Ons nuwe publieke emmer
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Kry die publieke URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);

      if (!urlData.publicUrl) {
        throw new Error("Kon nie publieke URL kry nie.");
      }

      // 3. Dateer die state op en stuur terug na die ouer
      setPreviewUrl(urlData.publicUrl); // Wys die nuwe prent
      onUploadComplete(urlData.publicUrl); // Stoor in die hoofvorm se state

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
        Produkprent
      </label>
      
      {/* Prent Voorskou */}
      <div className="w-full max-w-xs h-48 relative rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 flex items-center justify-center">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Produk voorskou"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        ) : (
          <span className="text-sm text-zinc-500">Geen prent</span>
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

      {/* Lêer Invoer */}
      <div>
        <input
          id="product-image-upload"
          name="product-image-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}