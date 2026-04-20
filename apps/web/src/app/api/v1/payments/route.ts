import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { paymentCreateSchema } from "@/lib/validations/payment";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER"], async (request) => {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? 50)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.duePayment.findMany({
      skip,
      take: limit,
      orderBy: { paidAt: "desc" },
      include: { member: true }
    }),
    prisma.duePayment.count()
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER"], async (request, context) => {
  const body = await parseJson(request, paymentCreateSchema);
  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.duePayment.create({
      data: {
        ...body,
        paidAt: new Date(),
        recordedById: context.user?.id ?? ""
      }
    });
    await tx.dueSchedule.updateMany({
      where: { memberId: body.memberId, period: body.period },
      data: { status: "PAID" }
    });
    await tx.auditLog.create({
      data: {
        actorId: context.user?.id,
        action: "RECORD_PAYMENT",
        entityType: "DuePayment",
        entityId: created.id,
        after: { id: created.id, memberId: created.memberId, period: created.period, receiptNumber: created.receiptNumber }
      }
    });
    return created;
  });
  return payment;
});
