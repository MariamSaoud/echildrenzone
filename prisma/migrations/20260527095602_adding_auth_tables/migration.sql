-- CreateEnum
CREATE TYPE "ROLE_ENUM" AS ENUM ('CHILD', 'PARENT', 'CREATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "GENDER_ENUM" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "CURRENCY_ENUM" AS ENUM ('SYP', 'USD');

-- CreateEnum
CREATE TYPE "ACCOUNT_ROLE_ENUM" AS ENUM ('BUSINESS', 'PERSONAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "ROLE_ENUM" NOT NULL DEFAULT 'CHILD',
    "birthdayDate" TIMESTAMP(3) NOT NULL,
    "gender" "GENDER_ENUM" NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "accountId" INTEGER NOT NULL,
    "pin" VARCHAR(4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "accountRole" "ACCOUNT_ROLE_ENUM" NOT NULL DEFAULT 'PERSONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "creatorId" INTEGER NOT NULL,
    "currency" "CURRENCY_ENUM" NOT NULL DEFAULT 'SYP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentsChildren" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentsChildren_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pin" ON "User"("pin");

-- CreateIndex
CREATE INDEX "User_accountId_idx" ON "User"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "creatorId" ON "UserBalance"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_creatorId_currency_key" ON "UserBalance"("creatorId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "ParentsChildren_parentId_childId_key" ON "ParentsChildren"("parentId", "childId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentsChildren" ADD CONSTRAINT "ParentsChildren_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentsChildren" ADD CONSTRAINT "ParentsChildren_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
