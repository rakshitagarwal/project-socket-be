-- CreateTable
CREATE TABLE "auction_media" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auction_media_auction_id_media_id_idx" ON "auction_media"("auction_id", "media_id");

-- AddForeignKey
ALTER TABLE "auction_media" ADD CONSTRAINT "auction_media_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_media" ADD CONSTRAINT "auction_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
