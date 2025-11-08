// src/app/(public)/kalender/page.tsx
import type { Metadata } from "next";
import * as ical from 'node-ical';
import type { VEvent, CalendarComponent } from 'node-ical';
import KalenderBladsyClient from "./KalenderBladsyClient"; // <-- Voer nuwe Kliënt-komponent in
import { div } from "framer-motion/client";

export const metadata: Metadata = {
    title: "Hoërskool Brits | Kalender",
    description: "Die skool se amptelike kalender vir gebeure, sport en akademiese datums.",
};

export const revalidate = 900; // 15 minute

const ICAL_URL = process.env.GOOGLE_CALENDAR_ICAL_URL;

// Tipe vir 'n verwerkte gebeurtenis
export type VerwerkteGebeurtenis = {
    id: string | undefined;
    summary: string;
    description: string | null;
    location: string | null;
    start: Date;
    end: Date;
};

// "Type Guard" funksie
function isVEvent(event: CalendarComponent): event is VEvent {
    return event.type === 'VEVENT';
}

// Data-laai funksie
async function getCalendarEvents(): Promise<{ events: VerwerkteGebeurtenis[], error: string | null }> {
    if (!ICAL_URL) {
        return { events: [], error: "Kalender URL is nie opgestel nie." };
    }

    try {
        const response = await fetch(ICAL_URL, {
            next: { revalidate: 900 }
        });
        if (!response.ok) {
            throw new Error(`Kon nie kalenderlêer kry nie: ${response.statusText}`);
        }
        const icalRaw = await response.text();
        const cal = ical.parseICS(icalRaw);
        const now = new Date();

        const events: VerwerkteGebeurtenis[] = Object.values(cal)
            .filter(isVEvent)
            .filter(event => event.start && event.end && new Date(event.end) > now)
            .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime())
            .map(event => ({
                id: event.uid,
                summary: event.summary,
                description: event.description || null,
                location: event.location || null,
                start: new Date(event.start!),
                end: new Date(event.end!),
            }));

        return { events, error: null };

    } catch (error) {
        console.error("Fout met laai van iCal:", error);
        return { events: [], error: "Daar was 'n fout met die laai van die Google Kalender." };
    }
}

export default async function KalenderPage() {
    const { events, error } = await getCalendarEvents();

    return (
        <div className=" pt-8 pb-4">
            <KalenderBladsyClient alleGebeure={events} aanvanklikeFout={error} />
        </div>
    );
}