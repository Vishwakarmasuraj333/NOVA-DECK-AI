import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  globalPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.globalPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.globalPrisma = prisma;
}
