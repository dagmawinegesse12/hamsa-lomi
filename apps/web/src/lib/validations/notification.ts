import { z } from "zod";

export const notificationComposeSchema = z.object({
  recipientMode: z.enum(["ALL", "OVERDUE", "SPECIFIC"]),
  memberIds: z.array(z.string().uuid()).default([]),
  channels: z.array(z.enum(["EMAIL", "SMS", "PUSH", "IN_APP"])).min(1),
  title: z.string().min(2).max(160),
  body: z.string().min(3).max(5000),
  scheduledFor: z.string().datetime().optional(),
  templateKey: z
    .enum(["MISSED_PAYMENT", "CLAIM_STATUS", "MEETING_REMINDER", "SUSPENSION_WARNING", "WELCOME", "CUSTOM"])
    .default("CUSTOM")
});
