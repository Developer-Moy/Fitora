import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      {
        hostname: "i.ibb.co.com",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;