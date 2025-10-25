// src/app/admin/layout.tsx
// NO auth checks here anymore
import { PropsWithChildren } from "react";
import Image from 'next/image';

export default function AdminLayout({ children }: PropsWithChildren) {
  console.log('AdminLayout: Rendering structure only.'); // Add log

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-zinc-800 p-4 text-white">
        <div className="mb-6 flex justify-center"> {/* Container for margin + centering */}
          <Image
            src="/wapen.png" // Replace with your logo path in /public
            alt="Hoërskool Brits Logo"
            width={100} // Adjust width for sidebar
            height={100} // Adjust height for sidebar
            className="h-auto" // Maintain aspect ratio
          />
        </div>
          <h2 className="mb-4 text-xl font-bold">Admin Paneel</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <a href="/admin" className="hover:text-blue-300">
                  Paneelblad
                </a>
              </li>
              <li className="mb-2">
                <a href="/admin/news" className="hover:text-blue-300">
                  Nuus Bestuur (CMS)
                </a>
              </li>
              {/* Add more admin links here */}
            </ul>
          </nav>
      </aside>
      <main className="flex-1 bg-zinc-100 p-6 dark:bg-zinc-900">
        {children}
      </main>
    </div>
  );
}