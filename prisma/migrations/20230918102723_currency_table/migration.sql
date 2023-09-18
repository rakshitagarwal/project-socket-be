-- AlterTable
ALTER TABLE "auctions" ALTER COLUMN "bid_increment_price" SET DEFAULT 0.20;

-- CreateTable
CREATE TABLE "master_currency" (
    "id" TEXT NOT NULL,
    "currency_type" TEXT NOT NULL,
    "bid_increment" DOUBLE PRECISION NOT NULL,
    "big_token" DOUBLE PRECISION NOT NULL,
    "usdt" DOUBLE PRECISION NOT NULL,
    "usdc" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_currency_pkey" PRIMARY KEY ("id")
);
