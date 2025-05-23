
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.lacon.devontech.io/api/:path*", // Proxy to backend
      },
    ];
  },
   eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
