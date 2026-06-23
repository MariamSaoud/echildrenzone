/*
  Warnings:

  - You are about to drop the `ReachedToContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ReachedToContent";

-- CreateTable
CREATE TABLE "userActionsPricing" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "paymentAmount" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "type" "REACHED_TYPE_ENUM" NOT NULL,
    "currency" "CURRENCY_ENUM" NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userActionsPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userActionsPricing_type_currency_key" ON "userActionsPricing"("type", "currency");
