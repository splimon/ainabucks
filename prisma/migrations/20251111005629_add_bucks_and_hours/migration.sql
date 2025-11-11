/*
  Warnings:

  - You are about to drop the column `points` on the `VolunteerEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VolunteerEvent" DROP COLUMN "points",
ADD COLUMN     "ainaBucksAwarded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "volunteerHours" INTEGER NOT NULL DEFAULT 0;
