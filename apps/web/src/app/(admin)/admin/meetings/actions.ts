"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "SECRETARY"]);

const meetingSchema = z.object({
  agenda: z.string().min(3),
  date: z.string().min(1),
  isPublic: z.boolean(),
  publishedAt: z.string().optional(),
  type: z.enum(["GENERAL", "BOARD", "EMERGENCY"])
});

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getPublishDate(isPublic: boolean, value?: string) {
  if (!isPublic) return null;
  return value ? new Date(value) : new Date();
}

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || !adminRoles.has(role)) redirect("/sign-in");
}

export async function createMeeting(formData: FormData) {
  await requireAdmin();

  const body = meetingSchema.parse({
    agenda: readString(formData, "agenda"),
    date: readString(formData, "date"),
    isPublic: formData.get("isPublic") === "on",
    publishedAt: readString(formData, "publishedAt") || undefined,
    type: readString(formData, "type")
  });

  const organization = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" } });
  if (!organization) throw new Error("Organization is required before creating meetings.");

  await prisma.meeting.create({
    data: {
      agenda: body.agenda,
      date: new Date(body.date),
      isPublic: body.isPublic,
      organizationId: organization.id,
      publishedAt: getPublishDate(body.isPublic, body.publishedAt),
      type: body.type
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/meetings");
  redirect("/admin/meetings");
}

export async function updateMeeting(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) throw new Error("Meeting ID is required.");

  const body = meetingSchema.parse({
    agenda: readString(formData, "agenda"),
    date: readString(formData, "date"),
    isPublic: formData.get("isPublic") === "on",
    publishedAt: readString(formData, "publishedAt") || undefined,
    type: readString(formData, "type")
  });

  await prisma.meeting.update({
    where: { id },
    data: {
      agenda: body.agenda,
      date: new Date(body.date),
      isPublic: body.isPublic,
      publishedAt: getPublishDate(body.isPublic, body.publishedAt),
      type: body.type
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/meetings");
}

export async function deleteMeeting(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) throw new Error("Meeting ID is required.");

  await prisma.meeting.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/meetings");
}
