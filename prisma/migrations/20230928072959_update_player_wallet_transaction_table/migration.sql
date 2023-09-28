
-- AlterEnum
BEGIN;
CREATE TYPE "PlaySpend_new" AS ENUM ('LAST_PLAYS','BUY_PLAYS', 'REFUND_PLAYS', 'BID_PLAYS', 'REFERRAL_PLAYS', 'AUCTION_REGISTER_PLAYS', 'EXTRA_BIGPLAYS', 'JOINING_BONUS', 'TRANSFER_PLAYS', 'RECEIVED_PLAYS');
ALTER TABLE "player_wallet_transaction" ALTER COLUMN "spend_on" TYPE "PlaySpend_new" USING ("spend_on"::text::"PlaySpend_new");
ALTER TYPE "PlaySpend" RENAME TO "PlaySpend_old";
ALTER TYPE "PlaySpend_new" RENAME TO "PlaySpend";
DROP TYPE "PlaySpend_old";
COMMIT;

-- AlterTable
ALTER TABLE "player_wallet_transaction" ADD COLUMN     "transferred_from" TEXT,
ADD COLUMN     "transferred_to" TEXT;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_transferred_to_fkey" FOREIGN KEY ("transferred_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_transferred_from_fkey" FOREIGN KEY ("transferred_from") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
