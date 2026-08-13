import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7's `prisma-client` generator ships the WASM client engine, which
// requires a driver adapter. For PostgreSQL we use the pg adapter.
function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  // Hosted Postgres providers require TLS. Enable it unless the URL explicitly
  // opts out (e.g. ?sslmode=disable for a local server).
  const sslParam = url.searchParams.get("sslmode") ?? url.searchParams.get("ssl");
  const useSsl =
    sslParam !== "disable" && sslParam !== "false" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1";
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 15_000,
    // Managed Postgres providers terminate TLS with a self-signed cert, so we
    // encrypt the connection but do not verify the chain.
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
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
