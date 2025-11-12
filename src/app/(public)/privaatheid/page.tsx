// src/app/(public)/privaatheid/page.tsx
import React from 'react';
import type { Metadata } from "next";
import PrivaatheidClientPage from "./PrivaatheidClientPage"; // <-- Ons kliënt-lêer

export const metadata: Metadata = {
    title: "Hoërskool Brits | Privaatheidsbeleid",
    description: "Lees Hoërskool Brits se beleid oor die Beskerming van Persoonlike Inligting (POPIA).",
};

export default function PrivaatheidPage() {
  return (
    // Stuur net die Kliënt-komponent
    <PrivaatheidClientPage />
  );
}