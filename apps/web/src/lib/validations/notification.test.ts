import { describe, expect, it } from "vitest";
import { notificationComposeSchema } from "@/lib/validations/notification";

describe("notificationComposeSchema", () => {
  it("accepts a valid notification request", () => {
    const result = notificationComposeSchema.safeParse({
      recipientMode: "ALL",
      channels: ["EMAIL", "IN_APP"],
      title: "Meeting reminder",
      body: "Please attend the meeting."
    });
    expect(result.success).toBe(true);
  });

  it("requires at least one delivery channel", () => {
    const result = notificationComposeSchema.safeParse({
      recipientMode: "ALL",
      channels: [],
      title: "Meeting reminder",
      body: "Please attend the meeting."
    });
    expect(result.success).toBe(false);
  });
});
