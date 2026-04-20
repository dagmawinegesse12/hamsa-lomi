import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { moneySchema } from "@/lib/validations/common";

export const dynamic = "force-dynamic";

const expenseSchema = z.object({
  category: z.string().min(2),
  amount: moneySchema,
  description: z.string().min(3),
  receiptUrl: z.string().url().optional(),
  date: z.string().datetime()
});

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER"], async () => {
  return prisma.expenseRecord.findMany({ orderBy: { date: "desc" }, take: 100 });
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER"], async (request, context) => {
  const body = await parseJson(request, expenseSchema);
  return prisma.expenseRecord.create({
    data: {
      ...body,
      date: new Date(body.date),
      recordedById: context.user?.id ?? ""
    }
  });
});
