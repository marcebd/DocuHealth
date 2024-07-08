-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Female', 'Male', 'Nonbinary', 'DeclineToState', 'Other');

-- CreateTable
CREATE TABLE "user_data" (
    "id" BIGSERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "specialty" TEXT[],
    "id_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "languages" TEXT[],
    "location" TEXT[],
    "biography" TEXT NOT NULL,
    "profile_picture" TEXT,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" BIGSERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "graduation" TIMESTAMP(3) NOT NULL,
    "user_data_id" BIGINT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_user_id_key" ON "user_data"("user_id");

-- AddForeignKey
ALTER TABLE "user_data" ADD CONSTRAINT "user_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_user_data_id_fkey" FOREIGN KEY ("user_data_id") REFERENCES "user_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
