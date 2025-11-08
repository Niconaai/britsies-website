// src/app/(public)/aansoek/page.tsx
import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: "Hoërskool Brits | Aanlyn Aansoeke",
    description: "Begin jou aanlyn aansoekproses by Hoërskool Brits.",
};

// 'n Sub-komponent vir die "check mark" ikoon
const CheckIcon = () => (
    <svg className="h-6 w-6 shrink-0 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function AansoekLandingPage() {
    return (
        <div className="bg-white mt-5 mb-8 shadow-xl rounded-lg max-w-4xl mx-auto p-6 md:p-12">

            {/* Opskrif-seksie */}
            <div className="text-center">
                <Image
                    src="/wapen.png"
                    alt="Hoërskool Brits Wapen"
                    width={90}
                    height={90}
                    className="mx-auto"
                />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-rose-900 sm:text-4xl">
                    Aanlyn Aansoeke
                </h1>
                <p className="mt-6 text-lg leading-8 text-zinc-700">
                    Welkom by die aanlyn aansoekportaal van Hoërskool Brits. Volg asseblief die stappe noukeurig om u aansoek te voltooi.
                </p>
            </div>

            <hr className="my-8 border-t border-zinc-200" />

            {/* Vereistes-seksie */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-rose-800">Voordat Jy Begin</h2>
                <p className="mt-2 text-zinc-600">
                    Maak asseblief seker dat al die volgende dokumente byderhand is. Jy sal dit moet oplaai tydens die proses (PDF, JPG, of PNG formaat). As jy die proses op &apos;n foon doen kan u die kamera gebruik om dokumente af te neem.
                </p>

                <ul role="list" className="mt-6 space-y-4">
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van leerder se <strong>Geboortesertifikaat</strong> of <strong>ID-dokument</strong>.</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van <strong>Ouer / Voog 1</strong> se ID-dokument.</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van <strong>Ouer / Voog 2</strong> se ID-dokument (indien van toepassing).</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van <strong>Bewys van Woonadres</strong> (Munisipale rekening, nie ouer as 3 maande nie).</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van <strong>Mediese Fondskaart</strong> (voor en agter).</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van leerder se <strong>laaste skoolrapport</strong>.</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Afskrif van leerder se <strong>nuutste Gedragsverslag</strong>.</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <p className="text-zinc-700">Indien u <em>nie</em> vir Graad 8 aansoek doen nie: 'n <strong>Oorplasingsertifikaat</strong> en <strong>Portefeulje</strong> van die vorige skool.</p>
                    </li>
                    <li className="flex gap-x-3">
                        <CheckIcon />
                        <span className="text-zinc-700"><strong>Oorplasingsertifikaat</strong> of <strong>Portefeulje</strong> van die vorige skool. <em>(Indien nie Januarie Graad 8 aansoek)</em>.</span>
                    </li>
                </ul>
            </div>

            <hr className="my-8 border-t border-zinc-200" />

            <div>
                <h2 className="text-xl font-semibold text-rose-800">Die Proses</h2>
                <p className="mt-2 text-zinc-600">
                    Om jou vordering te stoor en &apos;n aansoek se status later te kan nagaan, sal jy 'n "Britsie-Aanlyn" rekening benodig.
                </p>

                <ol className="mt-6 space-y-4 list-decimal list-inside text-zinc-700">
                    <li>
                        <strong>Skep 'n Rekening:</strong> As jy 'n nuwe ouer is, sal jy gevra word om 'n veilige rekening te skep met u e-posadres en 'n wagwoord. Voor jy kan inteken sal die rekening eers geverifieër moet word deur e-pos.
                    </li>
                    <li>
                        <strong>Teken In:</strong> As jy reeds 'n rekening het (dalk van die aanlyn winkel of 'n vorige aansoek), kan jy eenvoudig met daardie selfde besonderhede aanteken.
                    </li>
                    <li>
                        <strong>Voltooi & Stoor:</strong> Jy kan die 6-stap aansoekvorm in jou eie tyd voltooi (op dieselfde web-blaaier). Die vordering word gestoor.
                    </li>
                    <li>
                        <strong>Bestuur:</strong> Nadat die aansoek ingedien is, kan daar weer by hierdie portaal ingeteken word om die aansoek se status (Hangende, Goedgekeur, Afgekeur) na te gaan.
                    </li>
                </ol>
            </div>

            <hr className="my-8 border-t border-zinc-200" />

            {/* Knoppie-seksie */}
            <div className="mt-12 text-center">
                <Link
                    href="/portaal/begin"
                    className="rounded-md bg-rose-900 px-10 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-rose-800  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-900"
                >
                    Begin Aansoek / Teken In
                </Link>
                <p className="mt-6 text-sm text-zinc-500">
                    U sal 'n rekening moet skep of aanteken om u aansoek te begin en te bestuur.
                </p>
            </div>

        </div>
    );
}