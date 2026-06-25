/*
  Warnings:

  - A unique constraint covering the columns `[childId,contentId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reaction_childId_contentId_key" ON "Reaction"("childId", "contentId");
