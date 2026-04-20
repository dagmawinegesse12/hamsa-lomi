import { PrismaClient, Role, MemberStatus, PaymentMethod, ClaimStatus, Relationship, MeetingType, AudienceType, NotificationChannel } from "@prisma/client";
import { addMonths, format, subMonths } from "date-fns";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

const firstNames = [
  "Abebe",
  "Almaz",
  "Bekele",
  "Chaltu",
  "Dawit",
  "Eden",
  "Fikru",
  "Genet",
  "Hana",
  "Kebede"
];
const lastNames = ["Tesfaye", "Mekonnen", "Alemu", "Gebre", "Haile"];

async function createUser(email: string, role: Role) {
  return prisma.user.create({
    data: {
      email,
      role,
      hashedPassword: await bcrypt.hash("Password123!", 12)
    }
  });
}

async function main() {
  console.log("Clearing existing seed data...");
  await prisma.auditLog.deleteMany();
  await prisma.notificationRecipient.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.meetingAttendance.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.claimDocument.deleteMany();
  await prisma.deathClaim.deleteMany();
  await prisma.penaltyRecord.deleteMany();
  await prisma.duePayment.deleteMany();
  await prisma.dueSchedule.deleteMany();
  await prisma.dependent.deleteMany();
  await prisma.member.deleteMany();
  await prisma.membershipTier.deleteMany();
  await prisma.expenseRecord.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Creating organization and users...");
  const organization = await prisma.organization.create({
    data: {
      name: "Hamsa Lomi Ethiopian Association",
      bylawsUrl: "https://example.com/bylaws.pdf",
      foundedDate: new Date("2010-01-15"),
      locale: "en"
    }
  });

  const superAdmin = await createUser("superadmin@edir.test", Role.SUPER_ADMIN);
  const admin = await createUser("admin@edir.test", Role.ADMIN);
  const treasurer = await createUser("treasurer@edir.test", Role.TREASURER);
  const secretary = await createUser("secretary@edir.test", Role.SECRETARY);
  const memberUser = await createUser("member@edir.test", Role.MEMBER);
  await createUser("member2@edir.test", Role.MEMBER);

  const tier = await prisma.membershipTier.create({
    data: {
      organizationId: organization.id,
      name: "Standard Family",
      monthlyDue: 500,
      benefitAmounts: { MEMBER: 50000, SPOUSE: 35000, CHILD: 25000, PARENT: 20000, SIBLING: 10000 }
    }
  });

  console.log("Creating members and dependents...");
  const memberInputs = Array.from({ length: 50 }, (_, index) => {
      const firstName = firstNames[index % firstNames.length] ?? "Abebe";
      const lastName = lastNames[index % lastNames.length] ?? "Tesfaye";
      return {
        id: randomUUID(),
        organizationId: organization.id,
        userId: index === 0 ? memberUser.id : null,
        tierId: tier.id,
        firstName,
        lastName,
        phone: `+25191100${String(index).padStart(4, "0")}`,
        address: `${100 + index} Nolensville Pike, Nashville, TN`,
        joinDate: subMonths(new Date(), 24),
        status: index === 7 ? MemberStatus.SUSPENDED : MemberStatus.ACTIVE
      };
    });
  await prisma.member.createMany({ data: memberInputs });
  await prisma.dependent.createMany({
    data: memberInputs.flatMap((member) => [
      { memberId: member.id, name: `${member.firstName} Spouse`, relationship: Relationship.SPOUSE },
      { memberId: member.id, name: `${member.firstName} Child`, relationship: Relationship.CHILD, dateOfBirth: new Date("2015-06-12") }
    ])
  });
  const members = memberInputs;

  console.log("Creating payment schedules and payment history...");
  const periods = Array.from({ length: 12 }, (_, index) => format(subMonths(new Date(), 11 - index), "yyyy-MM"));
  await prisma.dueSchedule.createMany({
    data: members.flatMap((member) =>
      periods.map((period, index) => ({
          memberId: member.id,
          period,
          amount: 500,
          dueDate: addMonths(new Date(`${period}-01T00:00:00.000Z`), 1),
          status: index < 10 ? "PAID" : "PENDING"
        }))
    )
  });
  await prisma.duePayment.createMany({
    data: members.flatMap((member) =>
      periods.slice(0, 10).map((period) => ({
        memberId: member.id,
        period,
        amount: 500,
        paidAt: new Date(`${period}-10T10:00:00.000Z`),
        paymentMethod: PaymentMethod.CASH,
        receiptNumber: `RCT-${member.id.slice(0, 8)}-${period}`,
        recordedById: treasurer.id
      }))
    )
  });

  console.log("Creating claims, meetings, notifications, and reports...");
  for (let index = 0; index < 5; index += 1) {
    await prisma.deathClaim.create({
      data: {
        memberId: members[index]?.id ?? members[0]!.id,
        deceasedName: `${members[index]?.firstName ?? "Abebe"} Relative`,
        relationship: index === 0 ? Relationship.MEMBER : Relationship.PARENT,
        dateOfDeath: subMonths(new Date(), index + 1),
        claimStatus: [ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.REJECTED][index]!,
        benefitAmount: index === 0 ? 50000 : 20000,
        approvedById: index > 1 ? admin.id : undefined
      }
    });
  }

  for (let index = 1; index <= 3; index += 1) {
    await prisma.meeting.create({
      data: {
        organizationId: organization.id,
        date: addMonths(new Date(), index),
        type: index === 1 ? MeetingType.GENERAL : MeetingType.BOARD,
        agenda: "Dues review, claims update, and community support planning.",
        isPublic: index === 1,
        publishedAt: index === 1 ? new Date() : undefined
      }
    });
  }

  await prisma.notification.create({
    data: {
      title: "April dues reminder",
      body: "Please complete your monthly dues by the 25th.",
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      triggeredById: secretary.id,
      sentAt: new Date(),
      audienceType: AudienceType.ALL,
      recipients: {
        create: members.slice(0, 10).map((member) => ({ memberId: member.id, status: "SENT", deliveredAt: new Date() }))
      }
    }
  });

  await prisma.announcement.create({
    data: {
      organizationId: organization.id,
      authorId: secretary.id,
      title: "General assembly next month",
      body: "Members are expected to attend the upcoming general assembly.",
      publishedAt: new Date()
    }
  });

  await prisma.expenseRecord.create({
    data: {
      category: "Funeral support",
      amount: 7000,
      description: "Meal preparation support for a member family.",
      recordedById: treasurer.id,
      date: new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: "SEED_DATABASE",
      entityType: "Organization",
      entityId: organization.id,
      after: { name: organization.name }
    }
  });
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
