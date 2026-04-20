"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AuthorizationError } from "@/lib/errors";
import { assertRole } from "@/lib/rbac";
import type { Role } from "@edir/types";

const memberFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Phone is required"),
  address: z.string().min(3, "Address is required"),
  status: z.enum(["ACTIVE", "SUSPENDED", "EXPELLED", "DECEASED"]).optional(),
  tierId: z.string().uuid().optional().or(z.literal(""))
});

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) throw new AuthorizationError();
  assertRole(session.user.role as Role, ["SUPER_ADMIN", "ADMIN", "SECRETARY"]);
  return session.user;
}

export type MemberFormState =
  | { success: true }
  | { success: false; error: string };

export async function createMember(_prev: MemberFormState, formData: FormData): Promise<MemberFormState> {
  const user = await requireAdminSession();

  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" } });
  if (!org) return { success: false, error: "No organization found." };

  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    tierId: formData.get("tierId") || undefined
  };

  const parsed = memberFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const data = parsed.data;
  const member = await prisma.member.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      organizationId: org.id,
      tierId: data.tierId || null,
      joinDate: new Date()
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "CREATE_MEMBER",
      entityType: "Member",
      entityId: member.id,
      after: { firstName: member.firstName, lastName: member.lastName }
    }
  });

  redirect(`/admin/members/${member.id}`);
}

export async function updateMember(_prev: MemberFormState, formData: FormData): Promise<MemberFormState> {
  const user = await requireAdminSession();

  const memberId = formData.get("memberId") as string;
  if (!memberId) return { success: false, error: "Member ID is missing." };

  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    status: formData.get("status") || undefined,
    tierId: formData.get("tierId") || undefined
  };

  const parsed = memberFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const before = await prisma.member.findUnique({ where: { id: memberId } });
  const data = parsed.data;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      status: data.status ?? before?.status,
      tierId: data.tierId || null
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "UPDATE_MEMBER",
      entityType: "Member",
      entityId: memberId,
      before: before ? { firstName: before.firstName, lastName: before.lastName, status: before.status } : undefined,
      after: { firstName: data.firstName, lastName: data.lastName, status: data.status }
    }
  });

  return { success: true };
}
