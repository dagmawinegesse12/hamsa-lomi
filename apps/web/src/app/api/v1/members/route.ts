import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { memberCreateSchema } from "@/lib/validations/member";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY"], async (request) => {
  const params = request.nextUrl.searchParams;
  const search = params.get("search") ?? "";
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? 50)));
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { firstName: { contains: search, mode: "insensitive" as const } },
      { lastName: { contains: search, mode: "insensitive" as const } },
      { phone: { contains: search } }
    ]
  };

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      skip,
      take: limit,
      include: { tier: true }
    }),
    prisma.member.count({ where })
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async (request, context) => {
  const body = await parseJson(request, memberCreateSchema);
  const member = await prisma.member.create({
    data: {
      ...body,
      joinDate: new Date()
    }
  });
  await prisma.auditLog.create({
    data: {
      actorId: context.user?.id,
      action: "CREATE_MEMBER",
      entityType: "Member",
      entityId: member.id,
      after: { id: member.id, firstName: member.firstName, lastName: member.lastName, status: member.status }
    }
  });
  return member;
});
