/*
  Warnings:

  - Added the required column `landing_image` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_title_idx";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "landing_image" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "products_title_landing_image_idx" ON "products"("title", "landing_image");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_landing_image_fkey" FOREIGN KEY ("landing_image") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
