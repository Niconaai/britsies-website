// app/admin/login/page.tsx
import ClientPage from "./clientLogin"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoërskool Brits | Login",
  description: "Login Bladsy van Hoërskool Brits",
};

export default function LoginPage() {
  return( <ClientPage />);
}