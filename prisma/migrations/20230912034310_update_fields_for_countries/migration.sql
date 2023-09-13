/*
  Warnings:

  - You are about to drop the column `isd_code` on the `countries` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `code` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `image` to the `countries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countries" DROP COLUMN "isd_code",
ADD COLUMN     "image" VARCHAR(100) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(100);
