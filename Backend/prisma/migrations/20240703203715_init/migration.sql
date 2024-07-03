/*
  Warnings:

  - The `profile_picture` column on the `user_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `graduation` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "graduation",
ADD COLUMN     "graduation" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_data" DROP COLUMN "profile_picture",
ADD COLUMN     "profile_picture" BYTEA;
