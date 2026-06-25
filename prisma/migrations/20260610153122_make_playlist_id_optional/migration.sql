-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_playlistId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "playlistId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
