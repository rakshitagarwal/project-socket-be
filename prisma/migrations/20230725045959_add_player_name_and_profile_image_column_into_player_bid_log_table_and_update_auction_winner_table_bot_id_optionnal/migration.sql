/*
  Warnings:

  - You are about to drop the column `auctin_id` on the `player_bid_log` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `player_bid_log` table. All the data in the column will be lost.
  - Added the required column `auction_id` to the `player_bid_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `player_bid_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_name` to the `player_bid_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_image` to the `player_bid_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "auction_winner" DROP CONSTRAINT "auction_winner_player_bid_log_id_fkey";

-- DropForeignKey
ALTER TABLE "player_bid_log" DROP CONSTRAINT "player_bid_log_auctin_id_fkey";

-- DropForeignKey
ALTER TABLE "player_bid_log" DROP CONSTRAINT "player_bid_log_created_by_fkey";

-- AlterTable
ALTER TABLE "auction_winner" ALTER COLUMN "player_bid_log_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "player_bid_log" DROP COLUMN "auctin_id",
DROP COLUMN "created_by",
ADD COLUMN     "auction_id" TEXT NOT NULL,
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "player_name" TEXT NOT NULL,
ADD COLUMN     "profile_image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_winner" ADD CONSTRAINT "auction_winner_player_bid_log_id_fkey" FOREIGN KEY ("player_bid_log_id") REFERENCES "player_bid_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;
