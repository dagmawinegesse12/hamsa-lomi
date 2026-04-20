import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = performance.now();
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({
    status: "ok",
    db: "connected",
    durationMs: Math.round(performance.now() - startedAt)
  });
}
