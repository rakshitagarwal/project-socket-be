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

-- CreateTable
CREATE TABLE "player_buy_now" (
    "id" TEXT NOT NULL,
    "buy_price" DOUBLE PRECISION NOT NULL,
    "auction_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "player_result_id" TEXT NOT NULL,
    "currency_payment_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_buy_now_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_currency_payment_id_fkey" FOREIGN KEY ("currency_payment_id") REFERENCES "currency_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
