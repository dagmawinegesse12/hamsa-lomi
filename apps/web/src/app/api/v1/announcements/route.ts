import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

const announcementSchema = z.object({
  organizationId: z.string().uuid(),
  title: z.string().min(2),
  body: z.string().min(3),
  publishedAt: z.string().datetime().optional()
});

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY", "MEMBER"], async () => {
  return prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async (request, context) => {
  const body = await parseJson(request, announcementSchema);
  return prisma.announcement.create({
    data: {
      ...body,
      authorId: context.user?.id ?? "",
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined
    }
  });
});
