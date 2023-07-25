-- DropForeignKey
ALTER TABLE "player_bid_log" DROP CONSTRAINT "player_bid_log_player_bot_id_fkey";

-- AlterTable
ALTER TABLE "player_bid_log" ALTER COLUMN "player_bot_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_bot_id_fkey" FOREIGN KEY ("player_bot_id") REFERENCES "bid_bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
