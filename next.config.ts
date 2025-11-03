// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
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
 
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  }
};

export default nextConfig;