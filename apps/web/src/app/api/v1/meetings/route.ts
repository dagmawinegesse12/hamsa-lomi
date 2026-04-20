import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseJson, withRole } from "@/lib/api";

export const dynamic = "force-dynamic";

const meetingSchema = z.object({
  organizationId: z.string().uuid(),
  date: z.string().datetime(),
  type: z.enum(["GENERAL", "BOARD", "EMERGENCY"]),
  agenda: z.string().min(3),
  isPublic: z.boolean().optional(),
  publishedAt: z.string().datetime().optional()
});

export const GET = withRole(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY", "MEMBER"], async () => {
  return prisma.meeting.findMany({ orderBy: { date: "asc" }, take: 50 });
});

export const POST = withRole(["SUPER_ADMIN", "ADMIN", "SECRETARY"], async (request) => {
  const body = await parseJson(request, meetingSchema);
  return prisma.meeting.create({
    data: {
      ...body,
      date: new Date(body.date),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined
    }
  });
});
