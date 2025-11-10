// src/app/(public)/aansoek/page.tsx
import type { Metadata } from "next";
import AansoekLandingClient from "./AansoekLandingClient"; // <-- Voer die nuwe kliënt-lêer in

export const metadata: Metadata = {
    title: "Hoërskool Brits | Aanlyn Aansoeke",
    description: "Begin jou aanlyn aansoekproses by Hoërskool Brits.",
};

export default function AansoekLandingPage() {
    return (
        <AansoekLandingClient />
    );
}