import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

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
    bidBot: prismaClient.bidBot,
    auction: prismaClient.auctions,
    countries: prismaClient.countries,
    currencyTx: prismaClient.currencyTransaction,
    playerWalletTx: prismaClient.playerWalletTransaction,
    playerAuctionRegsiter: prismaClient.playerAuctionRegister,
    playerBidLogs: prismaClient.playerBidLogs,
    playerAuctionRefund: prismaClient.playerAuctionRefund,
    userBidBot: prismaClient.bidBot,
    userReferral: prismaClient.userReferral,
    referral: prismaClient.referral,
    currency: prismaClient.masterCurrency,
};
