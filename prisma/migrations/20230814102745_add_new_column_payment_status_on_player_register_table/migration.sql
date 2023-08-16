-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('pending', 'success');

-- AlterTable
ALTER TABLE "player_auction_register" ADD COLUMN     "payment_status" "paymentStatus" NOT NULL DEFAULT 'pending';
