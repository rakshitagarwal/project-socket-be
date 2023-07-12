/*
  Warnings:

  - You are about to drop the column `image_path` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `video_path` on the `auctions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "image_path",
DROP COLUMN "video_path";
