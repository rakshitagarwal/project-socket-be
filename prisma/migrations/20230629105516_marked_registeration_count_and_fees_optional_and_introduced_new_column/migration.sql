-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "is_preRegistered" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "registeration_count" DROP NOT NULL,
ALTER COLUMN "registeration_fees" DROP NOT NULL;
