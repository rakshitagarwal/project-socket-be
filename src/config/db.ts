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
    media: prismaClient.media,
    termsAndConditions: prismaClient.termsAndCondition,
    auction: prismaClient.auctions,
    countries: prismaClient.countries,
    currencyTx: prismaClient.currencyTransaction,
    playerWallet: prismaClient.playerWallet,
    playerWalletTx: prismaClient.playerWalletTransaction,
    playerAuctionRegsiter: prismaClient.playerAuctionRegister,
    playerBidLogs: prismaClient.playerBidLogs,
    playerAuctionRefund: prismaClient.playerAuctionRefund,
    auctionResult: prismaClient.auctionResult,
    userBidBot: prismaClient.bidBot,
    buyNow: prismaClient.playerBuyNow,
};
