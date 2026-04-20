import { describe, expect, it } from "vitest";
import { monthlyDueGenerator } from "./monthly-due-generator";
import { notificationDispatcher } from "./notification-dispatcher";
import { paymentReminder } from "./payment-reminder";

describe("job definitions", () => {
  it("exports scheduled and event-driven jobs", () => {
    expect(monthlyDueGenerator).toBeDefined();
    expect(paymentReminder).toBeDefined();
    expect(notificationDispatcher).toBeDefined();
  });
});
