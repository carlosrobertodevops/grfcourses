import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "drive.google.com",
      pathname: "/uc",
    },
  ],
};

export default nextConfig;
