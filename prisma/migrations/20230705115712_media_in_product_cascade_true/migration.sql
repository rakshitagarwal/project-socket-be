-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_landing_image_fkey";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_landing_image_fkey" FOREIGN KEY ("landing_image") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
