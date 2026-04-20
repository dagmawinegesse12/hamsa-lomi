import { addMonths, format, startOfMonth } from "date-fns";
import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";

export const inngest = new Inngest({ id: "edir-jobs" });
const prisma = new PrismaClient();

async function loadActiveMembers() {
  const members = await prisma.member.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, tier: { select: { monthlyDue: true } } }
  });
  return members
    .filter((member) => member.tier)
    .map((member) => ({
      id: member.id,
      monthlyDue: member.tier?.monthlyDue.toString() ?? "0"
    }));
}

export const monthlyDueGenerator = inngest.createFunction(
  { id: "monthly-due-generator" },
  { cron: "0 6 1 * *" },
  async ({ step }) => {
    const period = format(new Date(), "yyyy-MM");
    const dueDate = addMonths(startOfMonth(new Date()), 1);
    const members = (await step.run("load-active-members", loadActiveMembers)) as Awaited<
      ReturnType<typeof loadActiveMembers>
    >;

    await step.run("create-due-schedules", () =>
      prisma.dueSchedule.createMany({
        data: members.map((member) => ({
          memberId: member.id,
          period,
          amount: member.monthlyDue,
          dueDate
        })),
        skipDuplicates: true
      })
    );

    return { createdFor: members.length, period };
  }
);
