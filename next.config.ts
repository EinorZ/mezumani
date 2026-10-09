import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Next.js treating a parent lockfile as this application's workspace.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
