-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_country_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "country" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_fkey" FOREIGN KEY ("country") REFERENCES "countries"("name") ON DELETE SET NULL ON UPDATE CASCADE;
