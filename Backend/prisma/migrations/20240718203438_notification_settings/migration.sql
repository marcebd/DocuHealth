/*
  Warnings:

  - You are about to drop the column `patientId` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentTime` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentID]` on the table `NotificationSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "NotificationSettings" DROP CONSTRAINT "NotificationSettings_patientId_fkey";

-- DropIndex
DROP INDEX "NotificationSettings_patientId_key";

-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "patientId",
ADD COLUMN     "appointmentID" BIGINT;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "appointmentTime",
DROP COLUMN "timeZone";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" BIGSERIAL NOT NULL,
    "appointmentTime" TIMESTAMP(3),
    "timeZone" TEXT,
    "patientId" BIGINT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_appointmentID_key" ON "NotificationSettings"("appointmentID");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_appointmentID_fkey" FOREIGN KEY ("appointmentID") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
