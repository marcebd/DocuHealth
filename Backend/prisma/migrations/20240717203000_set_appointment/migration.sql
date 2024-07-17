/*
  Warnings:

  - Changed the type of `advanceNotification` on the `NotificationSettings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "advanceNotification",
ADD COLUMN     "advanceNotification" INTEGER NOT NULL;
