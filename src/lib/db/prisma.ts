import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import os from "os";

function getResolvedDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // Remote databases (PostgreSQL, MySQL, PlanetScale, Supabase, Neon)
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  // Serverless / Vercel: write to /tmp since root filesystem is read-only
  if (isServerless && typeof window === "undefined") {
    try {
      const tmpDir = process.env.VERCEL ? "/tmp" : os.tmpdir();
      const targetDb = path.join(tmpDir, "novadeck-prod.db");

      if (!fs.existsSync(targetDb)) {
        const candidates = [
          path.resolve(process.cwd(), "prisma", "starter.db"),
          path.resolve(process.cwd(), "prisma", "dev.db"),
          path.resolve(process.cwd(), "dev.db"),
          path.join(__dirname, "..", "..", "..", "prisma", "starter.db"),
          path.join(__dirname, "..", "..", "..", "prisma", "dev.db"),
        ];

        let copied = false;
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, targetDb);
            copied = true;
            break;
          }
        }

        if (!copied) {
          console.warn(
            "[NovaDeck Prisma] No template SQLite database found to seed /tmp. Continuing."
          );
        }
      }

      return `file:${targetDb}`;
    } catch (err) {
      console.error("[NovaDeck Prisma] Error copying SQLite to /tmp:", err);
    }
  }

  // Local development / testing:
  const localPrismaDb = path.resolve(process.cwd(), "prisma", "dev.db");
  const localStarterDb = path.resolve(process.cwd(), "prisma", "starter.db");

  if (!fs.existsSync(localPrismaDb) && fs.existsSync(localStarterDb)) {
    try {
      fs.copyFileSync(localStarterDb, localPrismaDb);
    } catch (e) {
      console.warn("[NovaDeck Prisma] Could not copy starter.db to dev.db:", e);
    }
  }

  if (fs.existsSync(localPrismaDb)) {
    return `file:${localPrismaDb}`;
  }

  // Fallback
  return envUrl || "file:./prisma/dev.db";
}

const resolvedUrl = getResolvedDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  globalPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.globalPrisma ||
  new PrismaClient({
    datasources: resolvedUrl
      ? {
          db: {
            url: resolvedUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.globalPrisma = prisma;
}
