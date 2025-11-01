// src/app/admin/layout.tsx
import { PropsWithChildren } from "react";
import Image from 'next/image';
import AdminSidebarNav from './AdminSidebarNav'; // <-- VOER ONS NUWE KOMPONENT IN

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      
      {/* --- SY-SPYSKAART --- */}
      <aside className="flex w-64 flex-col bg-zinc-800 p-4 text-white">
        <div className="mb-6 flex justify-center">
          <Image
            src="/wapen.png" 
            alt="Hoërskool Brits Logo"
            width={100}
            height={100}
            className="h-auto"
          />
        </div>
        
        {/* --- GEBRUIK DIE NUWE NAVIGASIE KOMPONENT --- */}
        <AdminSidebarNav />

      </aside>

      {/* --- HOOF INHOUD --- */}
      <main className="flex-1 bg-zinc-100 p-6 dark:bg-zinc-900">
        {children}
      </main>
    </div>
  );
}