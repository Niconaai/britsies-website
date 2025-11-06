// src/app/(public)/layout.tsx
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      {/* Die 'main'-element het nie meer 'n 'wrapper' nie - 
          dit laat die 'page.tsx' toe om vol-breedte te gaan.
      */}
      <main className="flex-1 bg-zinc-50">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}