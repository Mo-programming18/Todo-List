import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MySQL driver used by the Prisma adapter must run in Node (not bundled).
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
};

export default nextConfig;
