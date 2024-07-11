-- DropIndex
DROP INDEX "Patient_id_key";

-- AlterTable
CREATE SEQUENCE patient_id_seq;
ALTER TABLE "Patient" ALTER COLUMN "id" SET DEFAULT nextval('patient_id_seq');
ALTER SEQUENCE patient_id_seq OWNED BY "Patient"."id";
