// src/app/admin/layout.tsx
// NO auth checks here anymore
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  console.log('AdminLayout: Rendering structure only.'); // Add log

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-zinc-800 p-4 text-white">
          <h2 className="mb-4 text-xl font-bold">Admin Paneel</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <a href="/admin" className="hover:text-blue-300">
                  Dashboard
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