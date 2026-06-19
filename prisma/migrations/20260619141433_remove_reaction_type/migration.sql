/*
  Warnings:

  - You are about to drop the column `type` on the `Reaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "type";

-- DropEnum
DROP TYPE "REACTION_TYPE_ENUM";
