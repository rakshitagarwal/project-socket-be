import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import logger from "../config/logger";
import env from "../config/env";

export async function prismaTransaction(callback: any) {
    let result: any | undefined;
    let transaction: any | undefined
    try {
        transaction = await prisma.$transaction(callback);
        result = transaction;
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`${env.NODE_ENV}-${err.message}-${err.stack}`);
        }
    } finally {
        if (transaction) {
            await prisma.$queryRaw`ROLLBACK`;
        }
    }
    return result!;
}