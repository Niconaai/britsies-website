// src/app/admin/aansoeke/[id]/FileListItem.tsx
'use client';

import { useState } from 'react';
import type { DbUploadedFile } from '@/types/supabase';
import { getSecureFileViewUrl, getSecureFileDownloadUrl } from './action';
import Image from 'next/image'; // <-- 1. VOER IN

export default function FileListItem({ file }: { file: DbUploadedFile }) {
  // Ons gaan 'isLoading' opdeel vir elke knoppie
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleView = async () => {
    if (!file.storage_path) return;
    setIsViewLoading(true); // <-- Stel net hierdie een
    setError(null);
    try {
      const url = await getSecureFileViewUrl(file.storage_path);
      window.open(url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon nie skakel kry nie.");
    }
    setIsViewLoading(false); // <-- Stel net hierdie een terug
  };

  const handleDownload = async () => {
    if (!file.storage_path) return;
    setIsDownloadLoading(true); // <-- Stel net hierdie een
    setError(null);
    try {
      const url = await getSecureFileDownloadUrl(file.storage_path);
      window.open(url); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon nie skakel kry nie.");
    }
    setIsDownloadLoading(false); // <-- Stel net hierdie een terug
  };

  const getFileIcon = (path: string | null) => {
    if (!path) return '📄';
    if (path.endsWith('.pdf')) return '📕';
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) return '🖼️';
    return '📄';
  };
  
  // 'n Klein laaier komponent
  const MiniLoader = () => (
    <Image
      src="/CircleLoader.gif" //
      alt="Besig..."
      width={16} // Kleiner vir hierdie knoppies
      height={16}
      unoptimized={true}
    />
  );

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-xl">{getFileIcon(file.storage_path)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-blue-600 dark:text-blue-400">
            {file.file_type}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {file.original_filename}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={handleView}
          disabled={isViewLoading || isDownloadLoading}
          className="flex min-w-[70px] items-center justify-center gap-2 rounded bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
        >
          {isViewLoading ? <MiniLoader /> : 'Bekyk'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isViewLoading || isDownloadLoading}
          className="flex min-w-20 items-center justify-center gap-2 rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
        >
          {isDownloadLoading ? <MiniLoader /> : 'Laai Af'}
        </button>
      </div>
      {error && <p className="mt-2 w-full text-xs text-red-600">{error}</p>}
    </li>
  );
}