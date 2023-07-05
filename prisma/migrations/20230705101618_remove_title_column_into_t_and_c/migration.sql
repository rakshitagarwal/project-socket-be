/*
  Warnings:

  - You are about to drop the column `title` on the `terms_conditions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "terms_conditions_title_content_idx";

-- AlterTable
ALTER TABLE "terms_conditions" DROP COLUMN "title";

-- CreateIndex
CREATE INDEX "terms_conditions_content_idx" ON "terms_conditions"("content");
