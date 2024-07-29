-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('Routine', 'CommonSickness', 'RoutineSickness', 'EmergencySickness', 'Emergency');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "type" "AppointmentType";

-- AlterTable
ALTER TABLE "Condition" ADD COLUMN     "appointment_id" BIGINT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "appointment_id" BIGINT;

-- AlterTable
ALTER TABLE "VisitNote" ADD COLUMN     "appointment_id" BIGINT;

-- AddForeignKey
ALTER TABLE "VisitNote" ADD CONSTRAINT "VisitNote_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
