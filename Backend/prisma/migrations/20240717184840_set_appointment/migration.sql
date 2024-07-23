-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "appointmentTime" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" BIGSERIAL NOT NULL,
    "advanceNotification" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "patientId" BIGINT NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
