// src/app/admin/AdminSidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainLink = [
  { name: 'Paneelblad', href: '/admin' } 
];

const applicationLinks = [
  { name: 'Hangende Aansoeke', href: '/admin/aansoeke/hangende' },
  { name: 'Goedgekeur', href: '/admin/aansoeke/goedgekeur' },
  { name: 'Afgekeur', href: '/admin/aansoeke/afgekeur' },
  { name: 'Waglys', href: '/admin/aansoeke/waglys' },
];

// --- OPGEDATEER ---
const contentLinks = [
  { name: 'Nuus Bestuur (CMS)', href: '/admin/news' },
  { name: 'Personeelbestuur', href: '/admin/personeel' },
  { name: 'Graadklasse', href: '/admin/grade-classes' },
  { name: 'Vakke', href: '/admin/subjects' },
  { name: 'Sportbestuur', href: '/admin/sport' },
  { name: 'Kultuurbestuur', href: '/admin/kultuur' },
  { name: 'Vakature', href: '/admin/vakature' },
];
// --- EINDE VAN OPDATERING ---

const shopLinks = [
  { name: 'Bestellings', href: '/admin/winkel/bestellings' }, 
  { name: 'Produkte', href: '/admin/winkel/produkte' },
];

const settingsLinks = [
  { name: 'Stelsel Instellings', href: '/admin/instellings' },
];

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = href === '/admin' 
      ? pathname === '/admin' 
      : pathname.startsWith(href); 

    const baseClasses = 'block rounded-md px-3 py-2 text-sm font-medium';
    const activeClasses = 'bg-zinc-900 text-white';
    const inactiveClasses = 'text-zinc-300 hover:bg-zinc-700 hover:text-white'; 

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            
            {mainLink.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className={getLinkClass(item.href)}>
                  {item.name}
                </Link>
              </li>
            ))}

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

            <li className="mt-6">
              <div className="text-xs font-semibold leading-6 text-zinc-400">
                WINKEL
              </div>
              <ul role="list" className="mt-2 space-y-1">
                {shopLinks.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={getLinkClass(item.href)}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="mt-6">
              <div className="text-xs font-semibold leading-6 text-zinc-400">
                ADMIN
              </div>
              <ul role="list" className="mt-2 space-y-1">
                {settingsLinks.map((item) => (
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