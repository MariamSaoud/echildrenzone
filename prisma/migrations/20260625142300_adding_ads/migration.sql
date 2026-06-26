-- CreateTable
CREATE TABLE "AdsPayment" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "type" "CONTENT_TYPE_ENUM" NOT NULL,
    "amountType" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdsPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ads" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "url" TEXT NOT NULL,
    "status" "CONTENT_STATUS_ENUM" NOT NULL DEFAULT 'PENDING',
    "channelId" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "contentAgeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "AdsPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_contentAgeId_fkey" FOREIGN KEY ("contentAgeId") REFERENCES "ContentAge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
