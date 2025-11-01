// src/app/admin/AdminSidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- OPGEDATEERDE SKAKEL STRUKTUUR ---
const mainLink = [
  { name: 'Paneelblad', href: '/admin' } // Die nuwe hoofblad
];

const applicationLinks = [
  { name: 'Hangende Aansoeke', href: '/admin/aansoeke/hangende' }, // <-- NUWE PAD
  { name: 'Goedgekeur', href: '/admin/aansoeke/goedgekeur' },
  { name: 'Afgekeur', href: '/admin/aansoeke/afgekeur' },
  { name: 'Waglys', href: '/admin/aansoeke/waglys' },
];

const contentLinks = [
  { name: 'Nuus Bestuur (CMS)', href: '/admin/news' },
];
// --- EINDE VAN OPdatering ---

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    // Aangepas om 'startsWith' vir alles behalwe die hoof-paneelblad te gebruik
    const isActive = href === '/admin' 
      ? pathname === '/admin' // Pas net die hoofblad presies
      : pathname.startsWith(href); // Pas sub-bladsye soos /admin/news/create

    const baseClasses = 'block rounded-md px-3 py-2 text-sm font-medium';
    const activeClasses = 'bg-zinc-900 text-white'; // Aktiewe styl
    const inactiveClasses = 'text-zinc-300 hover:bg-zinc-700 hover:text-white'; 

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            
            {/* --- HOOF PANEELBLAD SKAKEL --- */}
            {mainLink.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className={getLinkClass(item.href)}>
                  {item.name}
                </Link>
              </li>
            ))}

            {/* --- AANSOEKE AFDELING --- */}
            <li className="mt-6">
              <div className="text-xs font-semibold leading-6 text-zinc-400">
                AANSOEKE
              </div>
              <ul role="list" className="mt-2 space-y-1">
                {applicationLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            
            {/* --- INHOUD AFDELING --- */}
            <li className="mt-6">
              <div className="text-xs font-semibold leading-6 text-zinc-400">
                WEBWERF INHOUD
              </div>
              <ul role="list" className="mt-2 space-y-1">
                {contentLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}