import { prisma } from "@/lib/db";
import { withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY", "MEMBER"], async (_request, context) => {
  return prisma.duePayment.findMany({
    where: { memberId: context.params?.id },
    orderBy: { paidAt: "desc" },
    take: 100
  });
});
