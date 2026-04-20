import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { claimCreateSchema } from "@/lib/validations/claim";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY"], async (request) => {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? 50)));
  const skip = (page - 1) * limit;
  const status = params.get("status") ?? undefined;

  const where = status ? { claimStatus: status as any } : {};

  const [items, total] = await Promise.all([
    prisma.deathClaim.findMany({
      where,
      include: { member: true, documents: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.deathClaim.count({ where })
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY", "MEMBER"], async (request, context) => {
  const body = await parseJson(request, claimCreateSchema);
  const claim = await prisma.deathClaim.create({
    data: {
      memberId: body.memberId,
      deceasedName: body.deceasedName,
      relationship: body.relationship,
      dateOfDeath: new Date(body.dateOfDeath),
      benefitAmount: body.benefitAmount,
      documents: { create: body.documents }
    }
  });
  await prisma.auditLog.create({
    data: {
      actorId: context.user?.id,
      action: "CREATE_CLAIM",
      entityType: "DeathClaim",
      entityId: claim.id,
      after: { id: claim.id, memberId: claim.memberId, deceasedName: claim.deceasedName, claimStatus: claim.claimStatus }
    }
  });
  return claim;
});
