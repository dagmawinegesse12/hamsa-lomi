"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadAnnouncementImage } from "@/lib/supabase/admin";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "SECRETARY"]);
const ANNOUNCEMENT_TYPES = ["GENERAL", "DEATH_NOTICE", "EVENT", "URGENT"] as const;

const announcementSchema = z.object({
  announcementType: z.enum(ANNOUNCEMENT_TYPES).default("GENERAL"),
  body: z.string().min(3),
  isPublic: z.boolean(),
  publishedAt: z.string().optional(),
  title: z.string().min(2)
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
  const userId = session?.user?.id;
  if (!role || !userId || !adminRoles.has(role)) redirect("/sign-in");
  return userId;
}

async function resolveImageUrl(formData: FormData, existingUrl?: string | null): Promise<string | null> {
  // If admin explicitly removed the image
  if (formData.get("removeImage") === "true") return null;

  // If a new file was uploaded, use it
  const imageFile = formData.get("image");
  if (imageFile instanceof Blob && imageFile.size > 0) {
    return uploadAnnouncementImage(imageFile as File);
  }

  // Otherwise keep the existing URL (or null if none)
  return existingUrl ?? null;
}

export async function createAnnouncement(formData: FormData) {
  const authorId = await requireAdmin();

  const body = announcementSchema.parse({
    announcementType: readString(formData, "announcementType") || "GENERAL",
    body: readString(formData, "body"),
    isPublic: formData.get("isPublic") === "on",
    publishedAt: readString(formData, "publishedAt") || undefined,
    title: readString(formData, "title")
  });

  const imageUrl = await resolveImageUrl(formData, null);

  const organization = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" } });
  if (!organization) throw new Error("Organization is required before creating announcements.");

  await prisma.announcement.create({
    data: {
      announcementType: body.announcementType,
      authorId,
      body: body.body,
      imageUrl,
      organizationId: organization.id,
      publishedAt: getPublishDate(body.isPublic, body.publishedAt),
      title: body.title
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) throw new Error("Announcement ID is required.");

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) throw new Error("Announcement not found.");

  const body = announcementSchema.parse({
    announcementType: readString(formData, "announcementType") || "GENERAL",
    body: readString(formData, "body"),
    isPublic: formData.get("isPublic") === "on",
    publishedAt: readString(formData, "publishedAt") || undefined,
    title: readString(formData, "title")
  });

  const imageUrl = await resolveImageUrl(formData, existing.imageUrl);

  await prisma.announcement.update({
    where: { id },
    data: {
      announcementType: body.announcementType,
      body: body.body,
      imageUrl,
      publishedAt: getPublishDate(body.isPublic, body.publishedAt),
      title: body.title
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();

  const id = readString(formData, "id");
  if (!id) throw new Error("Announcement ID is required.");

  await prisma.announcement.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/announcements");
}
