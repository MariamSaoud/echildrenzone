/*
  Warnings:

  - Added the required column `authKey` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "authKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authKey" TEXT NOT NULL;
