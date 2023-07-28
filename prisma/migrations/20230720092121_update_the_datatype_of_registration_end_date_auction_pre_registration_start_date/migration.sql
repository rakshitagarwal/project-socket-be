-- AlterTable
ALTER TABLE "auctions" ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "registeration_endDate" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "auction_pre_registeration_startDate" SET DATA TYPE TIMESTAMPTZ;
