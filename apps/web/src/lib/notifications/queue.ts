import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "edir-platform"
});

export async function enqueueNotification(notificationId: string) {
  await inngest.send({
    name: "notification/dispatch.requested",
    data: { notificationId }
  });
}
