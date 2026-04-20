import { prisma } from "@/lib/db";
import { withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async (_request, context) => {
  return prisma.notificationRecipient.findMany({
    where: { notificationId: context.params?.id },
    include: { member: true },
    orderBy: { updatedAt: "desc" }
  });
});
