-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('GENERAL', 'DEATH_NOTICE', 'EVENT', 'URGENT');

-- AlterTable
ALTER TABLE "Announcement"
  ADD COLUMN "announcementType" "AnnouncementType" NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Announcement_organizationId_announcementType_idx" ON "Announcement"("organizationId", "announcementType");
