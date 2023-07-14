-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "auction_pre_registeration_startDate" DATE,
ADD COLUMN     "registeration_endDate" DATE,
ALTER COLUMN "bid_increment_price" SET DEFAULT 0.01,
ALTER COLUMN "opening_price" SET DEFAULT 1.00;
