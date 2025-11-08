// src/app/(public)/raak-betrokke/page.tsx
import type { Metadata } from "next";
import RaakBetrokkeClientPage from "./RaakBetrokkeClientPage";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Raak Betrokke",
    description: "Ondersteun die toekoms van die Britsies en word deel van ons visie.",
};

export default function RaakBetrokkePage() {
    // Ons kan later inhoud van die CMS hier inlaai as dit nodig sou wees.
    // Vir nou is al die inhoud staties in die kliënt-komponent.
    return (
        <RaakBetrokkeClientPage />
    );
}