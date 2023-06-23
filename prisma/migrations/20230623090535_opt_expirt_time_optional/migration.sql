/*
  Warnings:

  - You are about to drop the `UserOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOTP" DROP CONSTRAINT "UserOTP_user_id_fkey";

-- DropTable
DROP TABLE "UserOTP";

-- CreateTable
CREATE TABLE "user_otp" (
    "id" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "expiry_seconds" BIGINT,
    "otp_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_otp_otp_idx" ON "user_otp"("otp");

-- AddForeignKey
ALTER TABLE "user_otp" ADD CONSTRAINT "user_otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
