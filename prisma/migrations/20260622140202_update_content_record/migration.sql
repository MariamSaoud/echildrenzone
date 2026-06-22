/*
  Warnings:

  - The `contentRecord` column on the `Stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Stories" DROP COLUMN "contentRecord",
ADD COLUMN     "contentRecord" UUID;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_contentRecord_fkey" FOREIGN KEY ("contentRecord") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
