import webPush from "web-push";
import { env } from "@/lib/env";

export async function sendPush(input: { subscription: webPush.PushSubscription; payload: unknown }) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
    throw new Error("VAPID keys are required to send push notifications.");
  }

  webPush.setVapidDetails("mailto:admin@example.com", env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  return webPush.sendNotification(input.subscription, JSON.stringify(input.payload));
}
