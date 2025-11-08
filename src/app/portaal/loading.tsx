// src/app/aansoek/loading.tsx
import Image from 'next/image';

export default function AansoekLoading() {
  // Hierdie sal wys binne die /aansoek/layout.tsx
  // terwyl /aansoek/page.tsx of /aansoek/nuwe/page.tsx laai.
  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center p-12">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/CircleLoader.gif"
          alt="Besig om te laai..."
          width={100}
          height={100}
          unoptimized={true}
          priority
        />
        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Besig om jou portaal te laai...
        </p>
      </div>
    </div>
  );
}