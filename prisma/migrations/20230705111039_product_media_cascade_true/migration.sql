-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_media_id_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_product_id_fkey";

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
