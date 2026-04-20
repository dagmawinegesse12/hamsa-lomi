import { prisma } from "@/lib/db";
import { withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN"], async () => {
  return prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { timestamp: "desc" },
    take: 100
  });
});
