-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_contentId_fkey";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "storyId" UUID,
ALTER COLUMN "contentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
