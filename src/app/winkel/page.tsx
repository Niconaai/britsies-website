// src/app/winkel/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Winkel Welkom",
  description: "Welkom by die Aanlyn Winkel van Hoërskool Brits",
};

export default function WinkelWelkomPage() {
  return (
    <div>
      <Link
        href="/#"
        className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
      >
        &larr; Terug na hoof bladsy
      </Link>

      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-lg p-6 md:p-8">
        <div className="flex flex-col items-center text-center">

          {/* Die kliënt kan hierdie prent-bron later vervang */}
          <Image
            src="/wapen.png" // Gebruik een van die nuwe prente as 'n plekhouer
            alt="Britsie Winkel Welkom"
            width={600}
            height={400}
            priority
            className="rounded-lg object-cover mb-8 max-h-[400px] w-auto"
          />

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welkom by die Britsie-Winkel
          </h1>

          <p className="mt-4 max-w-2xl text-md md:text-lg text-zinc-600 dark:text-zinc-400">
            Dankie dat jy ons aanlyn winkel besoek. Hier kan jy al jou gunsteling Britsie klere, ondersteuners-items, en meer koop. Alle items is slegs vir afhaal by die skool.
          </p>

          <hr className="my-8 w-full max-w-md border-zinc-300 dark:border-zinc-600" />

          <Link
            href="/winkel/katalogus"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-10 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sien Katalogus
          </Link>

        </div>
      </div>
    </div>
  );
}