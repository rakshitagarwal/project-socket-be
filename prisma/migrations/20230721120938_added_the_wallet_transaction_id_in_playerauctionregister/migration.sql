/*
  Warnings:

  - You are about to drop the column `payment_id` on the `player_auction_register` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player_auction_register" DROP COLUMN "payment_id",
ADD COLUMN     "player_wallet_transaction_id" TEXT;

-- AddForeignKey
ALTER TABLE "player_auction_register" ADD CONSTRAINT "player_auction_register_player_wallet_transaction_id_fkey" FOREIGN KEY ("player_wallet_transaction_id") REFERENCES "player_wallet_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
