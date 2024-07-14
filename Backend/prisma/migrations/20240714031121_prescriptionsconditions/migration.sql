/*
  Warnings:

  - You are about to drop the column `date` on the `Condition` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Prescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Condition" DROP COLUMN "date",
ADD COLUMN     "dateEnd" TIMESTAMP(3),
ADD COLUMN     "dateStart" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "date",
ADD COLUMN     "dateEnd" TIMESTAMP(3),
ADD COLUMN     "dateStart" TIMESTAMP(3);
