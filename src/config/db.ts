import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

prismaClient.$on("beforeExit", async () => {
    prismaClient.$disconnect();
});

export async function checkHealth() {
    const result = await prismaClient.$queryRaw`SELECT 1`;
    return result;
}

export const db = {
    user: prismaClient.user,
    userPersistent: prismaClient.userPersistent,
    userOTP: prismaClient.userOTP,
    masterRole: prismaClient.masterRole,
    masterProductCategory: prismaClient.masterProductCategory,
    masterAuctionCategory: prismaClient.masterAuctionCategory,
    product: prismaClient.products,
    productMedia: prismaClient.productMedia,
    auction: prismaClient.auctions,
    media: prismaClient.media,
    termsAndConditions: prismaClient.termsAndCondition,
};