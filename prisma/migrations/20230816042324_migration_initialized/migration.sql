/*
  Warnings:

  - You are about to drop the column `wallet_id` on the `player_wallet_transaction` table. All the data in the column will be lost.
  - You are about to drop the `PlayerWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlayerWallet" DROP CONSTRAINT "PlayerWallet_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_wallet_transaction" DROP CONSTRAINT "player_wallet_transaction_wallet_id_fkey";

-- AlterTable
ALTER TABLE "player_wallet_transaction" DROP COLUMN "wallet_id";

-- DropTable
DROP TABLE "PlayerWallet";
