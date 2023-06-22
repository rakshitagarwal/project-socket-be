/*
  Warnings:

  - You are about to drop the column `product_sku` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auctions" ADD COLUMN     "description" TEXT,
ALTER COLUMN "new_participants_limit" DROP NOT NULL,
ALTER COLUMN "terms_and_conditions" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_sku",
ALTER COLUMN "description" DROP NOT NULL;
