/*
  Warnings:

  - You are about to drop the `auction_winner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_buy_now` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auction_winner" DROP CONSTRAINT "auction_winner_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "auction_winner" DROP CONSTRAINT "auction_winner_player_id_fkey";

-- DropForeignKey
ALTER TABLE "auction_winner" DROP CONSTRAINT "auction_winner_player_register_id_fkey";

-- DropForeignKey
ALTER TABLE "player_buy_now" DROP CONSTRAINT "player_buy_now_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "player_buy_now" DROP CONSTRAINT "player_buy_now_currency_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "player_buy_now" DROP CONSTRAINT "player_buy_now_player_result_id_fkey";

-- DropForeignKey
ALTER TABLE "player_buy_now" DROP CONSTRAINT "player_buy_now_product_id_fkey";

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "decimal_count" INTEGER,
ADD COLUMN     "total_bids" INTEGER,
ALTER COLUMN "bid_increment_price" DROP NOT NULL;

-- DropTable
DROP TABLE "auction_winner";

-- DropTable
DROP TABLE "player_buy_now";
