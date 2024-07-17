/*
  Warnings:

  - You are about to drop the column `advanceNotification` on the `NotificationSettings` table. All the data in the column will be lost.
  - Added the required column `Number` to the `NotificationSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "advanceNotification",
ADD COLUMN     "Number" INTEGER NOT NULL;
