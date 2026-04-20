"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadGalleryPhoto } from "@/lib/supabase/admin";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "SECRETARY"]);

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;
  if (!role || !userId || !adminRoles.has(role)) redirect("/sign-in");
  return userId;
}

async function getOrg() {
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" } });
  if (!org) throw new Error("Organization not found.");
  return org;
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

const eventSchema = z.object({
  title: z.string().min(2),
  titleAm: z.string().optional(),
  date: z.string().min(1),
  location: z.string().optional(),
  isPublic: z.boolean(),
});

export async function createGalleryEvent(formData: FormData) {
  await requireAdmin();
  const org = await getOrg();

  const data = eventSchema.parse({
    title: str(formData, "title"),
    titleAm: str(formData, "titleAm") || undefined,
    date: str(formData, "date"),
    location: str(formData, "location") || undefined,
    isPublic: formData.get("isPublic") === "on",
  });

  const event = await prisma.galleryEvent.create({
    data: {
      organizationId: org.id,
      title: data.title,
      titleAm: data.titleAm,
      date: new Date(data.date),
      location: data.location,
      isPublic: data.isPublic,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  redirect(`/admin/gallery/${event.id}`);
}

export async function updateGalleryEvent(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");

  const data = eventSchema.parse({
    title: str(formData, "title"),
    titleAm: str(formData, "titleAm") || undefined,
    date: str(formData, "date"),
    location: str(formData, "location") || undefined,
    isPublic: formData.get("isPublic") === "on",
  });

  await prisma.galleryEvent.update({
    where: { id },
    data: {
      title: data.title,
      titleAm: data.titleAm,
      date: new Date(data.date),
      location: data.location,
      isPublic: data.isPublic,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}`);
}

export async function deleteGalleryEvent(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await prisma.galleryEvent.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function uploadPhotos(formData: FormData) {
  await requireAdmin();
  const eventId = str(formData, "eventId");

  const existing = await prisma.galleryPhoto.count({ where: { eventId } });

  const files = (formData.getAll("photos") as unknown[]).filter(
    (f): f is Blob => f instanceof Blob && f.size > 0
  );
  const uploads = await Promise.all(
    files.map(async (file, i) => {
      const url = await uploadGalleryPhoto(file);
      return { eventId, url, sortOrder: existing + i };
    })
  );

  if (uploads.length > 0) {
    await prisma.galleryPhoto.createMany({ data: uploads });
  }

  revalidatePath("/gallery");
  revalidatePath(`/admin/gallery/${eventId}`);
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const photo = await prisma.galleryPhoto.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath(`/admin/gallery/${photo.eventId}`);
}

export async function reorderPhoto(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const sortOrder = parseInt(str(formData, "sortOrder"), 10);
  await prisma.galleryPhoto.update({ where: { id }, data: { sortOrder } });
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (photo) {
    revalidatePath("/gallery");
    revalidatePath(`/admin/gallery/${photo.eventId}`);
  }
}
