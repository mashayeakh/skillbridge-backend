/*
  Warnings:

  - Added the required column `name` to the `tutor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor_profiles" ADD COLUMN     "name" VARCHAR(255) NOT NULL;
