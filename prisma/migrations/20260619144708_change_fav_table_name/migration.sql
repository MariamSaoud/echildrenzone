/*
  Warnings:

  - You are about to drop the `AddToFav` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddToFav" DROP CONSTRAINT "AddToFav_childId_fkey";

-- DropForeignKey
ALTER TABLE "AddToFav" DROP CONSTRAINT "AddToFav_contentId_fkey";

-- DropTable
DROP TABLE "AddToFav";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "childId" UUID NOT NULL,
    "contentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_childId_contentId_key" ON "Favorites"("childId", "contentId");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
