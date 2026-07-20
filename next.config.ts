import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MySQL driver used by the Prisma adapter must run in Node (not bundled).
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
  experimental: {
    // Avatar uploads go through a Server Action; the default body limit is 1 MB.
    // Allow up to our 4 MB image cap plus multipart overhead.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
