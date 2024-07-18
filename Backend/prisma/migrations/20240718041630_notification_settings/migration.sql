/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `NotificationSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_patientId_key" ON "NotificationSettings"("patientId");
