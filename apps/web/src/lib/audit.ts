import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function writeAuditLog(input: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      before: input.before,
      after: input.after,
      ipAddress: input.ipAddress
    }
  });
}
