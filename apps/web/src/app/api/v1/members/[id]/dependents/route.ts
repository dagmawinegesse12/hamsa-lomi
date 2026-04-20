import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";
import { dependentCreateSchema } from "@/lib/validations/member";

export const dynamic = "force-dynamic";

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY", "MEMBER"], async (_request, context) => {
  return prisma.dependent.findMany({ where: { memberId: context.params?.id } });
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY", "MEMBER"], async (request, context) => {
  const body = await parseJson(request, dependentCreateSchema);
  return prisma.dependent.create({
    data: {
      memberId: context.params?.id ?? "",
      ...body,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined
    }
  });
});
