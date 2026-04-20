import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { notificationComposeSchema } from "@/lib/validations/notification";
import { enqueueNotification } from "@/lib/notifications/queue";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async () => {
  return prisma.notification.findMany({
    include: { recipients: true, triggeredBy: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async (request, context) => {
  const body = await parseJson(request, notificationComposeSchema);
  const recipientIds = await resolveRecipients(body.recipientMode, body.memberIds ?? []);
  const notification = await prisma.notification.create({
    data: {
      title: body.title,
      body: body.body,
      channels: body.channels,
      audienceType: body.recipientMode === "SPECIFIC" ? "INDIVIDUAL" : body.recipientMode === "ALL" ? "ALL" : "GROUP",
      scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
      sentAt: body.scheduledFor ? undefined : new Date(),
      templateKey: body.templateKey,
      triggeredById: context.user?.id ?? "",
      recipients: {
        create: recipientIds.map((memberId) => ({ memberId }))
      }
    }
  });
  await enqueueNotification(notification.id);
  return notification;
});

async function resolveRecipients(mode: "ALL" | "OVERDUE" | "SPECIFIC", memberIds: string[]) {
  if (mode === "SPECIFIC") {
    return memberIds;
  }
  const members = await prisma.member.findMany({
    where:
      mode === "OVERDUE"
        ? {
            schedules: {
              some: { status: "OVERDUE" }
            }
          }
        : { status: "ACTIVE" },
    select: { id: true }
  });
  return members.map((member) => member.id);
}
