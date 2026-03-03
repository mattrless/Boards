import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.API_URL ?? "http://localhost:3000";

    return [
      {
        source: "/auth/:path*",
        destination: `${apiBaseUrl}/auth/:path*`,
      },
      {
        source: "/users/:path*",
        destination: `${apiBaseUrl}/users/:path*`,
      },
      {
        source: "/boards/:path*",
        destination: `${apiBaseUrl}/boards/:path*`,
      },
      {
        source: "/lists/:path*",
        destination: `${apiBaseUrl}/lists/:path*`,
      },
      {
        source: "/cards/:path*",
        destination: `${apiBaseUrl}/cards/:path*`,
      },
      {
        source: "/card-members/:path*",
        destination: `${apiBaseUrl}/card-members/:path*`,
      },
      {
        source: "/board-members/:path*",
        destination: `${apiBaseUrl}/board-members/:path*`,
      },
      {
        source: "/administrator/:path*",
        destination: `${apiBaseUrl}/administrator/:path*`,
      },
      {
        source: "/ai/:path*",
        destination: `${apiBaseUrl}/ai/:path*`,
      },
    ];
  },
};

export default nextConfig;
