// app/admin/login/page.tsx
import ClientPage from "./clientLogin"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Login",
  description: "Login Bladsy van Hoërskool Brits",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {

  const resolvedSearchParams = await searchParams;

  let errorMessage = null;
  if (resolvedSearchParams.error) {
    if (resolvedSearchParams.error === 'Invalid credentials' || resolvedSearchParams.error === 'Email and password are required') {
      errorMessage = "E-pos of wagwoord is verkeerd.";
    } else if (resolvedSearchParams.error === 'access_denied') {
      errorMessage = "Toegang geweier. Hierdie portaal is slegs vir admins.";
    } else if (resolvedSearchParams.error === 'Profile not found') {
      errorMessage = "Kon nie 'n ooreenstemmende profiel vir hierdie gebruiker vind nie.";
    } else {
      errorMessage = "Daar was 'n onbekende fout. Probeer asseblief weer.";
    }
  }

  return( <ClientPage errorMessage={errorMessage} />);
}