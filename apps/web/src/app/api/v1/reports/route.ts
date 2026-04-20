import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER"], async () => {
  const monthStart = startOfMonth(new Date());
  const [dues, claims, expenses] = await Promise.all([
    prisma.duePayment.aggregate({ where: { paidAt: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.deathClaim.aggregate({ where: { paidAt: { gte: monthStart } }, _sum: { benefitAmount: true } }),
    prisma.expenseRecord.aggregate({ where: { date: { gte: monthStart } }, _sum: { amount: true } })
  ]);
  return {
    duesCollected: dues._sum.amount ?? 0,
    claimsPaid: claims._sum.benefitAmount ?? 0,
    expenses: expenses._sum.amount ?? 0
  };
});
