-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "ParentsChildren" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT uuidv7();

-- AlterTable
ALTER TABLE "UserBalance" ALTER COLUMN "id" SET DEFAULT uuidv7();
