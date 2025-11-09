// src/app/(public)/kontak/page.tsx
import React from 'react';
import type { Metadata } from "next";
import ContactPageClient from './ContactPageClient'; // <-- Ons voer die nuwe kliënt-lêer in

export const metadata: Metadata = {
    title: "Hoërskool Brits | Kontak Ons",
    description: "Kontak Hoërskool Brits vir enige navrae. Vind ons adres, telefoonnommer, e-pos, en 'n aanlyn kontakvorm.",
};

export default function KontakPage() {
  return (
    // Stuur net die Kliënt-komponent
    <ContactPageClient />
  );
}