/*
  Warnings:

  - You are about to drop the column `tutorId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `TutorProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `TutorProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tutorProfileId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TutorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tutorId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "tutorId",
ADD COLUMN     "tutorProfileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "isVerified",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_userId_key" ON "TutorProfile"("userId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tutorProfileId_fkey" FOREIGN KEY ("tutorProfileId") REFERENCES "TutorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorProfile" ADD CONSTRAINT "TutorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
