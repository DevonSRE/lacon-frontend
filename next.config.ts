
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      // One 10 MB document plus multipart/Server Action overhead.
      bodySizeLimit: "11mb",
    },
  },

  // Old misspelt pro bono URLs, kept working for shared links and bookmarks.
  async redirects() {
    return [
      { source: "/probuno/registeration", destination: "/probono/registration", permanent: true },
      { source: "/probuno/:path*", destination: "/probono/:path*", permanent: true },
    ];
  },

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
