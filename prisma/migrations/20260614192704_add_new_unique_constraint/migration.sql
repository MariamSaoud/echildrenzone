/*
  Warnings:

  - A unique constraint covering the columns `[childId,contentId]` on the table `AddToFav` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AddToFav_childId_contentId_key" ON "AddToFav"("childId", "contentId");
