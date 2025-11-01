// src/app/admin/loading.tsx
import Image from 'next/image';

export default function AdminLoading() {
  // Hierdie komponent sal outomaties deur Next.js gewys word
  // binne die <main> area van src/app/admin/layout.tsx
  // terwyl die page.tsx besig is om data te laai.
  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-white p-12 dark:bg-zinc-800">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/CircleLoader.gif" //
          alt="Besig om te laai..."
          width={100}
          height={100}
          unoptimized={true} // Belangrik vir GIFs
          priority // Laai die GIF dadelik
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Besig om data te laai...
        </p>
      </div>
    </div>
  );
}