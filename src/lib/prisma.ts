import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Prisma 7's `prisma-client` generator ships the WASM client engine, which
// requires a driver adapter. For MySQL we use the MariaDB adapter.
function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  // Hosted MySQL providers require TLS. Enable it unless the URL explicitly
  // opts out (e.g. ?ssl=false for a local server).
  const sslParam = url.searchParams.get("ssl") ?? url.searchParams.get("sslaccept");
  const useSsl = sslParam !== "false" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1";
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
    ...(useSsl ? { ssl: { rejectUnauthorized: true } } : {}),
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
