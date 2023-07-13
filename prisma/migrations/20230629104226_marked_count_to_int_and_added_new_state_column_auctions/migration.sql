/*
  Warnings:

  - You are about to alter the column `registeration_count` on the `auctions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Added the required column `state` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "registeration_count" SET DATA TYPE INTEGER;
