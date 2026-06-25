/*
  Warnings:

  - A unique constraint covering the columns `[type,amountType]` on the table `AdsPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdsPayment_type_amountType_key" ON "AdsPayment"("type", "amountType");
