import { expect, test } from "@playwright/test";

test("admin can preview a notification", async ({ page }) => {
  await page.goto("/admin/notifications/compose");
  await expect(page.getByRole("heading", { name: "Notification Center" })).toBeVisible();
  await page.getByLabel("Message Body").fill("Dear [Name], please attend the meeting.");
  await expect(page.getByText("Dear [Name], please attend the meeting.")).toBeVisible();
});
