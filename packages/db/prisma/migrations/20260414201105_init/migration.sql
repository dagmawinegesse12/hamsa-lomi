-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TREASURER', 'SECRETARY', 'MEMBER');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPELLED', 'DECEASED');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('MEMBER', 'SPOUSE', 'CHILD', 'PARENT', 'SIBLING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'MOBILE_MONEY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "PenaltyStatus" AS ENUM ('PENDING', 'WAIVED', 'PAID');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DEATH_CERTIFICATE', 'ID', 'PHOTO');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('GENERAL', 'BOARD', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('ALL', 'INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "bylawsUrl" TEXT,
    "foundedDate" TIMESTAMP(3),
    "locale" TEXT NOT NULL DEFAULT 'en',
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "tierId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipTier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyDue" DECIMAL(12,2) NOT NULL,
    "benefitAmounts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuePayment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "period" VARCHAR(7) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "recordedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DueSchedule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "period" VARCHAR(7) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DueSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenaltyRecord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "period" VARCHAR(7) NOT NULL,
    "penaltyAmount" DECIMAL(12,2) NOT NULL,
    "status" "PenaltyStatus" NOT NULL DEFAULT 'PENDING',
    "waiverReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenaltyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeathClaim" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "memberId" UUID NOT NULL,
    "deceasedName" TEXT NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "dateOfDeath" TIMESTAMP(3) NOT NULL,
    "claimStatus" "ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "benefitAmount" DECIMAL(12,2) NOT NULL,
    "approvedById" UUID,
    "paidAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeathClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimDocument" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "claimId" UUID NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "MeetingType" NOT NULL,
    "agenda" TEXT NOT NULL,
    "minutesUrl" TEXT,
    "attendanceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "meetingId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channels" "NotificationChannel"[],
    "triggeredById" UUID NOT NULL,
    "sentAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "audienceType" "AudienceType" NOT NULL,
    "templateKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRecipient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "notificationId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseRecord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "recordedById" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Member_organizationId_status_idx" ON "Member"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Member_tierId_idx" ON "Member"("tierId");

-- CreateIndex
CREATE INDEX "Member_lastName_firstName_idx" ON "Member"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Dependent_memberId_idx" ON "Dependent"("memberId");

-- CreateIndex
CREATE INDEX "MembershipTier_organizationId_idx" ON "MembershipTier"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipTier_organizationId_name_key" ON "MembershipTier"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DuePayment_receiptNumber_key" ON "DuePayment"("receiptNumber");

-- CreateIndex
CREATE INDEX "DuePayment_memberId_period_idx" ON "DuePayment"("memberId", "period");

-- CreateIndex
CREATE INDEX "DuePayment_paidAt_idx" ON "DuePayment"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "DuePayment_memberId_period_key" ON "DuePayment"("memberId", "period");

-- CreateIndex
CREATE INDEX "DueSchedule_memberId_period_status_idx" ON "DueSchedule"("memberId", "period", "status");

-- CreateIndex
CREATE INDEX "DueSchedule_dueDate_idx" ON "DueSchedule"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "DueSchedule_memberId_period_key" ON "DueSchedule"("memberId", "period");

-- CreateIndex
CREATE INDEX "PenaltyRecord_memberId_status_idx" ON "PenaltyRecord"("memberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PenaltyRecord_memberId_period_key" ON "PenaltyRecord"("memberId", "period");

-- CreateIndex
CREATE INDEX "DeathClaim_memberId_claimStatus_idx" ON "DeathClaim"("memberId", "claimStatus");

-- CreateIndex
CREATE INDEX "DeathClaim_claimStatus_idx" ON "DeathClaim"("claimStatus");

-- CreateIndex
CREATE INDEX "DeathClaim_dateOfDeath_idx" ON "DeathClaim"("dateOfDeath");

-- CreateIndex
CREATE INDEX "ClaimDocument_claimId_idx" ON "ClaimDocument"("claimId");

-- CreateIndex
CREATE INDEX "Meeting_organizationId_date_idx" ON "Meeting"("organizationId", "date");

-- CreateIndex
CREATE INDEX "Meeting_type_idx" ON "Meeting"("type");

-- CreateIndex
CREATE INDEX "MeetingAttendance_memberId_idx" ON "MeetingAttendance"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingAttendance_meetingId_memberId_key" ON "MeetingAttendance"("meetingId", "memberId");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "Notification"("sentAt");

-- CreateIndex
CREATE INDEX "Notification_audienceType_idx" ON "Notification"("audienceType");

-- CreateIndex
CREATE INDEX "Notification_triggeredById_idx" ON "Notification"("triggeredById");

-- CreateIndex
CREATE INDEX "NotificationRecipient_memberId_status_idx" ON "NotificationRecipient"("memberId", "status");

-- CreateIndex
CREATE INDEX "NotificationRecipient_status_idx" ON "NotificationRecipient"("status");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRecipient_notificationId_memberId_key" ON "NotificationRecipient"("notificationId", "memberId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Announcement_organizationId_publishedAt_idx" ON "Announcement"("organizationId", "publishedAt");

-- CreateIndex
CREATE INDEX "Announcement_authorId_idx" ON "Announcement"("authorId");

-- CreateIndex
CREATE INDEX "ExpenseRecord_category_idx" ON "ExpenseRecord"("category");

-- CreateIndex
CREATE INDEX "ExpenseRecord_date_idx" ON "ExpenseRecord"("date");

-- CreateIndex
CREATE INDEX "ExpenseRecord_recordedById_idx" ON "ExpenseRecord"("recordedById");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "MembershipTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipTier" ADD CONSTRAINT "MembershipTier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuePayment" ADD CONSTRAINT "DuePayment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuePayment" ADD CONSTRAINT "DuePayment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DueSchedule" ADD CONSTRAINT "DueSchedule_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyRecord" ADD CONSTRAINT "PenaltyRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeathClaim" ADD CONSTRAINT "DeathClaim_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeathClaim" ADD CONSTRAINT "DeathClaim_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimDocument" ADD CONSTRAINT "ClaimDocument_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "DeathClaim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_triggeredById_fkey" FOREIGN KEY ("triggeredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseRecord" ADD CONSTRAINT "ExpenseRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
