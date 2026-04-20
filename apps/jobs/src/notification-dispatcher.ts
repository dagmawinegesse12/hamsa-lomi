import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";

export const inngest = new Inngest({ id: "edir-notification-dispatcher" });
const prisma = new PrismaClient();

async function loadNotification(notificationId: string) {
  const notification = await prisma.notification.findUniqueOrThrow({
    where: { id: notificationId },
    select: { id: true, _count: { select: { recipients: true } } }
  });
  return {
    id: notification.id,
    recipientCount: notification._count.recipients
  };
}

export const notificationDispatcher = inngest.createFunction(
  {
    id: "notification-dispatcher",
    retries: 3
  },
  { event: "notification/dispatch.requested" },
  async ({ event, step }) => {
    const notification = (await step.run("load-notification", () =>
      loadNotification(event.data.notificationId as string)
    )) as Awaited<ReturnType<typeof loadNotification>>;

    await step.run("mark-recipients-sent", () =>
      prisma.notificationRecipient.updateMany({
        where: { notificationId: notification.id },
        data: { status: "SENT", deliveredAt: new Date() }
      })
    );

    return { notificationId: notification.id, recipients: notification.recipientCount };
  }
);
