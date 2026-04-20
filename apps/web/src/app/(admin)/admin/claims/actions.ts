"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AuthorizationError } from "@/lib/errors";
import { assertRole } from "@/lib/rbac";
import type { Role } from "@edir/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) throw new AuthorizationError();
  assertRole(session.user.role as Role, ["SUPER_ADMIN", "ADMIN"]);
  return session.user;
}

export type ClaimActionResult = { success: true } | { success: false; error: string };

export async function reviewClaim(_prev: ClaimActionResult, formData: FormData): Promise<ClaimActionResult> {
  const user = await requireAdmin();
  const claimId = formData.get("claimId") as string;
  const action = formData.get("action") as string;
  const reviewNotes = formData.get("reviewNotes") as string | undefined;

  if (!claimId || !action) return { success: false, error: "Missing claim ID or action." };

  const statusMap: Record<string, string> = {
    approve: "APPROVED",
    reject: "REJECTED",
    review: "UNDER_REVIEW",
    pay: "PAID"
  };

  const newStatus = statusMap[action];
  if (!newStatus) return { success: false, error: "Unknown action." };

  await prisma.deathClaim.update({
    where: { id: claimId },
    data: {
      claimStatus: newStatus as "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "PAID" | "REJECTED",
      approvedById: action === "approve" ? user.id : undefined,
      paidAt: action === "pay" ? new Date() : undefined,
      reviewNotes: reviewNotes || undefined
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: `CLAIM_${action.toUpperCase()}`,
      entityType: "DeathClaim",
      entityId: claimId,
      after: { status: newStatus, reviewNotes }
    }
  });

  revalidatePath("/admin/claims");
  return { success: true };
}
