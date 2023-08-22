-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('FIAT', 'CRYPTO');

-- CreateEnum
CREATE TYPE "currencyType" AS ENUM ('USDTERC20', 'USDTRC20', 'BIGTOKEN');

-- CreateEnum
CREATE TYPE "PlaySpend" AS ENUM ('BUY_PLAYS', 'REFUND_PLAYS', 'BID_PLAYS', 'REFERRAL_PLAYS');

-- CreateEnum
CREATE TYPE "auctionState" AS ENUM ('upcoming', 'live', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "auctionResultType" AS ENUM ('won', 'lost', 'live', 'registered', 'cancelled');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('pending', 'success');

-- CreateTable
CREATE TABLE "master_roles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "mobile_no" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "referral_code" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "role_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_otp" (
    "id" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "expiry_seconds" BIGINT,
    "otp_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_persistent" (
    "id" TEXT NOT NULL,
    "public_key" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_persistent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_conditions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "terms_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "local_path" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_product_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "landing_image" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_category_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_auction_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "master_auction_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bid_increment_price" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "plays_consumed_on_bid" INTEGER NOT NULL,
    "opening_price" DOUBLE PRECISION NOT NULL DEFAULT 1.00,
    "new_participants_limit" INTEGER,
    "start_date" TIMESTAMPTZ,
    "is_preRegistered" BOOLEAN NOT NULL DEFAULT true,
    "registeration_count" INTEGER,
    "registeration_fees" INTEGER,
    "terms_and_conditions" TEXT,
    "state" "auctionState" NOT NULL DEFAULT 'upcoming',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auction_category_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_referral" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "player_referral_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral" (
    "id" TEXT NOT NULL,
    "reward_plays" INTEGER NOT NULL,
    "credit_plays" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isd_code" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_transaction" (
    "id" TEXT NOT NULL,
    "credit_amount" DOUBLE PRECISION,
    "currency" "Currency",
    "currency_type" "currencyType" NOT NULL,
    "crypto_transacation_hash" TEXT,
    "wallet_address" TEXT,
    "payment_gateway_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "currency_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_wallet_transaction" (
    "id" TEXT NOT NULL,
    "play_debit" INTEGER,
    "play_credit" INTEGER,
    "spend_on" "PlaySpend" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency_transaction_id" TEXT,
    "plays_refund_id" TEXT,
    "created_by" TEXT NOT NULL,
    "auction_id" TEXT,

    CONSTRAINT "player_wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_auction_register" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "player_wallet_transaction_id" TEXT,
    "player_id" TEXT NOT NULL,
    "status" "auctionResultType" NOT NULL DEFAULT 'registered',
    "buy_now_expiration" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_status" "paymentStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "player_auction_register_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_bid_log" (
    "id" TEXT NOT NULL,
    "bid_price" DOUBLE PRECISION NOT NULL,
    "bid_number" INTEGER NOT NULL,
    "remaining_seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "player_id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "player_bot_id" TEXT,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "player_bid_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_auction_refund" (
    "id" TEXT NOT NULL,
    "refund_amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auction_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "player_auction_refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_winner" (
    "id" TEXT NOT NULL,
    "player_register_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "total_bids_price" DOUBLE PRECISION NOT NULL,
    "total_bids" INTEGER NOT NULL,
    "total_plays_consumed" INTEGER NOT NULL,
    "auction_end_date" TIMESTAMPTZ NOT NULL,
    "buy_now_expiration" TIMESTAMPTZ NOT NULL,
    "result_status" "auctionResultType" NOT NULL DEFAULT 'registered',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_bot" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "plays_limit" INTEGER NOT NULL,
    "price_limit" DOUBLE PRECISION DEFAULT 0.00,
    "total_bot_bid" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_bot_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_otp_otp_idx" ON "user_otp"("otp");

-- CreateIndex
CREATE INDEX "user_persistent_public_key_access_token_idx" ON "user_persistent"("public_key", "access_token");

-- CreateIndex
CREATE INDEX "terms_conditions_content_idx" ON "terms_conditions"("content");

-- CreateIndex
CREATE INDEX "media_filename_type_idx" ON "media"("filename", "type");

-- CreateIndex
CREATE INDEX "master_product_categories_title_idx" ON "master_product_categories"("title");

-- CreateIndex
CREATE INDEX "products_title_landing_image_idx" ON "products"("title", "landing_image");

-- CreateIndex
CREATE INDEX "master_auction_categories_title_idx" ON "master_auction_categories"("title");

-- CreateIndex
CREATE INDEX "auctions_title_idx" ON "auctions"("title");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "player_auction_register_auction_id_player_id_key" ON "player_auction_register"("auction_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_auction_register_player_id_auction_id_key" ON "player_auction_register"("player_id", "auction_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "master_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_otp" ADD CONSTRAINT "user_otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_persistent" ADD CONSTRAINT "user_persistent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_conditions" ADD CONSTRAINT "terms_conditions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "master_product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_landing_image_fkey" FOREIGN KEY ("landing_image") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_auction_category_id_fkey" FOREIGN KEY ("auction_category_id") REFERENCES "master_auction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referral" ADD CONSTRAINT "user_referral_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_referral" ADD CONSTRAINT "user_referral_player_referral_id_fkey" FOREIGN KEY ("player_referral_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_transaction" ADD CONSTRAINT "currency_transaction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_plays_refund_id_fkey" FOREIGN KEY ("plays_refund_id") REFERENCES "player_auction_refund"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_wallet_transaction" ADD CONSTRAINT "player_wallet_transaction_currency_transaction_id_fkey" FOREIGN KEY ("currency_transaction_id") REFERENCES "currency_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_auction_register" ADD CONSTRAINT "player_auction_register_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_auction_register" ADD CONSTRAINT "player_auction_register_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_auction_register" ADD CONSTRAINT "player_auction_register_player_wallet_transaction_id_fkey" FOREIGN KEY ("player_wallet_transaction_id") REFERENCES "player_wallet_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_id_auction_id_fkey" FOREIGN KEY ("player_id", "auction_id") REFERENCES "player_auction_register"("player_id", "auction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_bot_id_fkey" FOREIGN KEY ("player_bot_id") REFERENCES "bid_bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_bid_log" ADD CONSTRAINT "player_bid_log_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_auction_refund" ADD CONSTRAINT "player_auction_refund_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_auction_refund" ADD CONSTRAINT "player_auction_refund_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_winner" ADD CONSTRAINT "auction_winner_player_register_id_fkey" FOREIGN KEY ("player_register_id") REFERENCES "player_auction_register"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_winner" ADD CONSTRAINT "auction_winner_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_winner" ADD CONSTRAINT "auction_winner_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_bot" ADD CONSTRAINT "bid_bot_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_bot" ADD CONSTRAINT "bid_bot_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_player_result_id_fkey" FOREIGN KEY ("player_result_id") REFERENCES "auction_winner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_buy_now" ADD CONSTRAINT "player_buy_now_currency_payment_id_fkey" FOREIGN KEY ("currency_payment_id") REFERENCES "currency_transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
