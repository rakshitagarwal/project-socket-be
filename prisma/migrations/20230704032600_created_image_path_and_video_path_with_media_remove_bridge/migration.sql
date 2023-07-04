/*
  Warnings:

  - You are about to drop the `auction_media` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_path` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_path` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "auction_media" DROP CONSTRAINT "auction_media_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "auction_media" DROP CONSTRAINT "auction_media_media_id_fkey";

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "image_path" TEXT NOT NULL,
ADD COLUMN     "video_path" TEXT NOT NULL;

-- DropTable
DROP TABLE "auction_media";

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_image_path_fkey" FOREIGN KEY ("image_path") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_video_path_fkey" FOREIGN KEY ("video_path") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
