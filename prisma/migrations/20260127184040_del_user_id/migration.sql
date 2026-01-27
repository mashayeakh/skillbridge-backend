/*
  Warnings:

  - You are about to drop the column `userId` on the `TutorProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TutorProfile_userId_key";

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "userId";
