/*
  Warnings:

  - A unique constraint covering the columns `[auction_id,player_id]` on the table `player_auction_register` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "player_auction_register" ADD COLUMN     "status" "auctionResultType" NOT NULL DEFAULT 'registered';

-- CreateIndex
CREATE UNIQUE INDEX "player_auction_register_auction_id_player_id_key" ON "player_auction_register"("auction_id", "player_id");

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_id_auction_id_fkey" FOREIGN KEY ("player_id", "auction_id") REFERENCES "player_auction_register"("player_id", "auction_id") ON DELETE RESTRICT ON UPDATE CASCADE;
