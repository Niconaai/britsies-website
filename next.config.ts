// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // --- VOEG HIERDIE BLOK BY ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zialsjarstarhvesvwdb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Laat alle publieke emmers toe
      },
    ],
  },
  // --- EINDE VAN NUWE BLOK ---
};

export default nextConfig;