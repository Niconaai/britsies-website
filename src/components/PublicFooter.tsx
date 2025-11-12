// src/components/PublicFooter.tsx
import Link from 'next/link';
import Image from 'next/image';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link href={href} className="text-zinc-300 hover:text-white hover:underline">
            {children}
        </Link>
    </li>
);

export default function PublicFooter() {
    return (
        <footer className="bg-rose-900 text-zinc-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Hoof 4-kolom rooster */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">

                    {/* Kolom 1: Wapen en Kontak */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <Image
                            src="/wapen.png"
                            alt="Hoërskool Brits Wapen"
                            width={80}
                            height={80}
                            className="h-20 w-auto"
                        />
                        <h3 className="mt-4 text-lg font-semibold text-white">Hoërskool Brits</h3>
                        <p className="mt-1 text-sm italic text-zinc-400">Koersvas na die Kruin</p>
                        <div className="mt-6 space-y-2 text-sm">
                            <p>2 Johan Straat, Brits, 0250</p>
                            <p>Posbus 446, Brits, 0250</p>
                            <p>
                                <a href="tel:0122520154" className="hover:text-white hover:underline">Tel: (012) 252-3228</a>
                            </p>
                            <p>
                                <a href="mailto:hsbrits@hsbrits.co.za" className="hover:text-white hover:underline">E-pos: hsbrits@hsbrits.co.za</a>
                            </p>
                        </div>
                    </div>

                    {/* Kolom 2: Die Skool */}
                    <div className="mt-8 lg:mt-0">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Die Skool</h4>
                        <ul role="list" className="mt-4 space-y-3">
                            <FooterLink href="/">Tuis</FooterLink>
                            <FooterLink href="/oor-ons">Oor Ons</FooterLink>
                            <FooterLink href="/akademie">Akademie</FooterLink>
                            <FooterLink href="/sport">Sport</FooterLink>
                            <FooterLink href="/kultuur">Kultuur</FooterLink>
                        </ul>
                    </div>

                    {/* Kolom 3: Hulpbronne */}
                    <div className="mt-8 lg:mt-0">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Hulpbronne</h4>
                        <ul role="list" className="mt-4 space-y-3">
                            <FooterLink href="/nuus">Nuus</FooterLink>
                            <FooterLink href="/kalender">Kalender</FooterLink>
                            <FooterLink href="/raak-betrokke">Raak Betrokke</FooterLink>
                            <FooterLink href="/kontak">Kontak Ons</FooterLink>
                            <FooterLink href="/privaatheid">Privaatheidsbeleid</FooterLink>
                        </ul>
                    </div>

                    {/* Kolom 4: Portale */}
                    <div className="mt-8 lg:mt-0">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Skakels</h4>
                        <ul role="list" className="mt-4 space-y-3">
                            <FooterLink href="/aansoek">Aanlyn Aansoek</FooterLink>
                            <FooterLink href="/winkel">Britsie Winkel</FooterLink>
                            <FooterLink href="/login">Admin</FooterLink>
                            <FooterLink href="https://kruinlegendes.co.za/">Die Kruin Legendes</FooterLink>
                            <FooterLink href="#">Vakature</FooterLink>
                        </ul>
                    </div>

                </div>

                {/* Onderste balk: Copyright en Sosiale media */}
                <div className="mt-12 border-t border-rose-800 pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href="#" className="text-zinc-300 hover:text-white">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/hsbrits/?hl=en" className="text-zinc-300 hover:text-white">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 0 1 1.79 1.04 4.92 4.92 0 0 1 1.04 1.79c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.04 1.79 4.92 4.92 0 0 1-1.79 1.04c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.79-1.04 4.92 4.92 0 0 1-1.04-1.79c-.163-.457-.347-1.257-.403-2.427C2.175 15.784 2.163 15.404 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.04-1.79 4.92 4.92 0 0 1 1.79-1.04c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.622c-3.17 0-3.548.012-4.795.069-.999.046-1.54.213-1.897.355-.478.186-.82.407-1.178.765-.358.358-.579.7-.765 1.178-.142.357-.309.898-.355 1.897-.057 1.247-.069 1.625-.069 4.795s.012 3.548.069 4.795c.046.999.213 1.54.355 1.897.186.478.407.82.765 1.178.358.358.7.579 1.178.765.357.142.898.309 1.897.355 1.247.057 1.625.069 4.795.069s3.548-.012 4.795-.069c.999-.046 1.54-.213 1.897-.355a3.297 3.297 0 0 0 1.943-1.943c.142-.357.309-.898.355-1.897.057-1.247.069-1.625.069-4.795s-.012-3.548-.069-4.795c-.046-.999-.213-1.54-.355-1.897a3.297 3.297 0 0 0-1.943-1.943c-.357-.142-.898-.309-1.897-.355-1.247-.057-1.625-.069-4.795-.069zm0 3.905a5.933 5.933 0 1 1 0 11.866 5.933 5.933 0 0 1 0-11.866zm0 9.8a3.867 3.867 0 1 0 0-7.734 3.867 3.867 0 0 0 0 7.734zm6.406-10.845a1.386 1.386 0 1 1-2.772 0 1.386 1.386 0 0 1 2.772 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                        {/* Voeg nog ikone hier by... */}
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-base text-zinc-300">
                            &copy; {new Date().getFullYear()} Hoërskool Brits. Alle regte voorbehou.
                        </p>
                        <p className="text-center text-xs text-zinc-400 mt-2">
                            Webwerf en Britsie-Aanlyn platform onderhou deur{' '}
                            <a
                                href="https.nicolabsdigital.co.za"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline hover:text-white"
                            >
                                Nicolabs Digital
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}