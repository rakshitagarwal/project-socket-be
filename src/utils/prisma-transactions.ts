import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import logger from "../config/logger";
import env from "../config/env";

/**
 * @description- this function is use to handle a multiple query runnings in a transaction
 * @param callback - callback function
 * @returns {Promise}
 */

export async function prismaTransaction(callback: any) {
    let result: any | undefined;
    let transaction: any | undefined;
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
