
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
};

export default nextConfig;
