import { PrismaClient } from "@prisma/client";
export const prismaClient = new PrismaClient();

prismaClient.$on("beforeExit", async () => {
    prismaClient.$disconnect();
});
