-- CreateEnum
CREATE TYPE "REACHED_TYPE_ENUM" AS ENUM ('REACTION', 'COMMENT', 'ADDTOFAV', 'SUBSCRIBE', 'VIEW');

-- CreateEnum
CREATE TYPE "CATEGORY_TYPE_ENUM" AS ENUM ('ENTERTAIMENT', 'EDUCATIONAL');

-- CreateEnum
CREATE TYPE "CONTENT_TYPE_ENUM" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "CONTENT_STATUS_ENUM" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "REACTION_TYPE_ENUM" AS ENUM ('LIKE', 'LOVE', 'FUNNY', 'INSIGHTFUL');

-- CreateEnum
CREATE TYPE "VIEW_TYPE_ENUM" AS ENUM ('PHOTO', 'VIDEO', 'PLAYLIST');

-- CreateTable
CREATE TABLE "ReachedToContent" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "paymentAmount" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "type" "REACHED_TYPE_ENUM" NOT NULL,
    "currency" "CURRENCY_ENUM" NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReachedToContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "type" "CATEGORY_TYPE_ENUM" NOT NULL DEFAULT 'ENTERTAIMENT',
    "specificType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAge" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "startAge" INTEGER NOT NULL,
    "endAge" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentAge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "channelId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "contentAgeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "description" TEXT,
    "type" "CONTENT_TYPE_ENUM" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "status" "CONTENT_STATUS_ENUM" NOT NULL DEFAULT 'PENDING',
    "rejectedReason" TEXT,
    "playlistId" UUID NOT NULL,
    "channelId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "contentAgeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content_TF_Questions" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "question" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "contentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_TF_Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stories" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "url" TEXT NOT NULL,
    "status" "CONTENT_STATUS_ENUM" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "rejectedReason" TEXT,
    "channelId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "channelId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedChannel" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "channelId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "childId" UUID NOT NULL,
    "contentId" UUID NOT NULL,
    "type" "REACTION_TYPE_ENUM" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "childId" UUID NOT NULL,
    "contentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddToFav" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "childId" UUID NOT NULL,
    "contentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddToFav_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Views" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "childId" UUID NOT NULL,
    "contentId" UUID NOT NULL,
    "Type" "VIEW_TYPE_ENUM" NOT NULL,
    "WatchTime" TEXT,
    "OriginTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReachedToContent_type_currency_key" ON "ReachedToContent"("type", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Category_type_specificType_key" ON "Category"("type", "specificType");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAge_startAge_endAge_key" ON "ContentAge"("startAge", "endAge");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_childId_channelId_key" ON "Subscription"("childId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedChannel_childId_channelId_key" ON "BlockedChannel"("childId", "channelId");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_contentAgeId_fkey" FOREIGN KEY ("contentAgeId") REFERENCES "ContentAge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentAgeId_fkey" FOREIGN KEY ("contentAgeId") REFERENCES "ContentAge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content_TF_Questions" ADD CONSTRAINT "Content_TF_Questions_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedChannel" ADD CONSTRAINT "BlockedChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedChannel" ADD CONSTRAINT "BlockedChannel_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddToFav" ADD CONSTRAINT "AddToFav_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddToFav" ADD CONSTRAINT "AddToFav_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Views" ADD CONSTRAINT "Views_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
