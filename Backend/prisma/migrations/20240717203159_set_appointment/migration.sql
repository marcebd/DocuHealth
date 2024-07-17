/*
  Warnings:

  - You are about to drop the column `Number` on the `NotificationSettings` table. All the data in the column will be lost.
  - Added the required column `number` to the `NotificationSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "Number",
ADD COLUMN     "number" INTEGER NOT NULL;
