/*
  Warnings:

  - Added the required column `name` to the `TutorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "name" TEXT NOT NULL;
