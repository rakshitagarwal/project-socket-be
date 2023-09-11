-- DropIndex
DROP INDEX "player_auction_register_player_id_auction_id_key";

-- AlterTable
ALTER TABLE "referral" ALTER COLUMN "status" SET DEFAULT true,
ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "user_referral" ALTER COLUMN "status" SET DEFAULT true,
ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT false;
