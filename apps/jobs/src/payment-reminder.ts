import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";

export const inngest = new Inngest({ id: "edir-payment-reminders" });
const prisma = new PrismaClient();

async function loadOverdueMembers() {
  return prisma.member.findMany({
    where: { schedules: { some: { status: "OVERDUE" } } },
    select: { id: true }
  });
}

export const paymentReminder = inngest.createFunction(
  { id: "payment-reminder" },
  { cron: "0 9 * * 1" },
  async ({ step }) => {
    const overdue = (await step.run("load-overdue-members", loadOverdueMembers)) as Awaited<
      ReturnType<typeof loadOverdueMembers>
    >;

    return { overdueMembers: overdue.length };
  }
);
