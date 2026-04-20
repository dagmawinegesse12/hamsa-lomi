ALTER TABLE "Meeting"
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "publishedAt" TIMESTAMP(3);

CREATE INDEX "Meeting_organizationId_isPublic_publishedAt_idx" ON "Meeting"("organizationId", "isPublic", "publishedAt");
