-- AlterTable
ALTER TABLE "player_bid_log" ADD COLUMN     "is_highest" BOOLEAN DEFAULT false,
ADD COLUMN     "is_lowest" BOOLEAN DEFAULT false,
ADD COLUMN     "is_unique" BOOLEAN DEFAULT false;
