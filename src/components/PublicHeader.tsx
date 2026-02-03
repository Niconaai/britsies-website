// src/components/PublicHeader.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Jou voorgestelde navigasie, wat perfek is:
const navLinks = [
  { name: 'Tuis', href: '/' },
  { name: 'Oor Ons', href: '/oor-ons' },
  { 
    name: 'Akademie', 
    href: '/akademie',
    subLinks: [
      { name: 'Vakke en Inligting', href: '/akademie#vakke-en-inligting' },
      { name: 'Vorige Uitslae', href: '/akademie#vorige-uitslae' },
      { name: 'Personeel', href: '/akademie#personeel' },
    ]
  },
  { name: 'Sport', href: '/sport' },
  { name: 'Kultuur', href: '/kultuur' },
  { name: 'Koshuis', href: '/koshuis' },
  { name: 'Nuus', href: '/nuus' },
  { name: 'Kalender', href: '/kalender' },
  //{ name: 'Aansoeke', href: '/aansoek' },
];

// Sekondêre skakels
//const secondaryLinks = [
    //{ name: 'Winkel', href: '/winkel' },
    //{ name: 'Raak Betrokke', href: '/raak-betrokke' },
//];

// --- REGSTELLING DEEL 1: NavLink ROEP NIE MEER 'usePathname' NIE ---
// Dit ontvang 'pathname' nou as 'n prop.
const NavLink = ({ 
  href, 
  children, 
  pathname, // <-- Prop word hier ontvang
  isSecondary = false,
  subLinks = []
}: { 
  href: string; 
  children: React.ReactNode, 
  pathname: string, // <-- Prop word hier ontvang
  isSecondary?: boolean;
  subLinks?: { name: string; href: string }[];
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isActive = pathname === href;

  if (isSecondary) {
      return (
        <Link
            href={href}
            className={`rounded-md px-3 py-2 text-xs font-medium ${
            isActive
                ? 'bg-amber-500 text-black' // Goue agtergrond vir aktief
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
        >
            {children}
        </Link>
      );
  }

  // If has sublinks, render dropdown
  if (subLinks.length > 0) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <Link
          href={href}
          className={`relative px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 transform border-b-2
            ${
              isActive
                ? 'border-rose-900 -translate-y-0.5' // Aktiewe status: Maroen-border + skuif op
                : 'border-transparent hover:border-rose-900 hover:-translate-y-0.5' // Nie-aktief: Skuif op en wys border op hover
            }
          `}
        >
          {children}
        </Link>
        
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {subLinks.map((subLink) => (
                <Link
                  key={subLink.name}
                  href={subLink.href}
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                >
                  {subLink.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 transform border-b-2
        ${
          isActive
            ? 'border-rose-900 -translate-y-0.5' // Aktiewe status: Maroen-border + skuif op
            : 'border-transparent hover:border-rose-900 hover:-translate-y-0.5' // Nie-aktief: Skuif op en wys border op hover
        }
      `}
    >
      {children}
    </Link>
  );
};
// --- EINDE REGSTELLING DEEL 1 ---

export default function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  
  // --- REGSTELLING DEEL 2: Roep 'usePathname' onvoorwaardelik aan die bokant ---
  const pathname = usePathname();
  // --- EINDE REGSTELLING DEEL 2 ---

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-md">
      {/* Topbalk vir sekondêre skakels */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-10 items-center justify-end gap-4">
                {/* {secondaryLinks.map((link) => (
                    <NavLink 
                      key={link.name} 
                      href={link.href} 
                      pathname={pathname} // <-- Stuur 'pathname' as 'n prop
                      isSecondary={true}
                    >
                        {link.name}
                    </NavLink>
                ))}*/}
                <Link
                    href="/login"
                    className="text-xs font-medium text-zinc-500 hover:text-rose-900"
                >
                    Admin
                </Link>
            </div>
        </div>
      </div>

      {/* Hoof Navigasiebalk */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/wapen.png" // Ons skoolwapen
                alt="Hoërskool Brits Logo"
                width={48}
                height={48}
                priority
              />
              <span className="hidden font-bold text-zinc-900 sm:block text-lg">
                Hoërskool Brits
              </span>
            </Link>
          </div>
          {/* Die 'py-2' op die NavLink gee genoeg spasie vir die 'translate-y' skuif */}
          <div className="hidden items-center gap-2 sm:flex">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                href={link.href}
                pathname={pathname} // <-- Stuur 'pathname' as 'n prop
                subLinks={link.subLinks || []}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-800"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Maak hoofkieslys oop</span>
              {/* Hamburger-ikoon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* X-ikoon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu, wys/versteek gebaseer op state */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navLinks.map((link) => (
              <div key={link.name}>
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    // --- REGSTELLING DEEL 3: Gebruik die 'pathname' veranderlike hier ---
                    className={`flex-1 block rounded-md px-3 py-2 text-base font-medium text-center ${
                        pathname === link.href // <-- Gebruik die 'pathname' veranderlike
                        ? 'bg-rose-900 text-white' 
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                  
                  {/* Toggle button for sublinks */}
                  {link.subLinks && link.subLinks.length > 0 && (
                    <button
                      onClick={() => setExpandedMobileMenu(expandedMobileMenu === link.name ? null : link.name)}
                      className="px-3 py-2 text-zinc-700"
                    >
                      <svg
                        className={`h-5 w-5 transition-transform ${expandedMobileMenu === link.name ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Show sublinks if expanded */}
                {link.subLinks && link.subLinks.length > 0 && expandedMobileMenu === link.name && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}