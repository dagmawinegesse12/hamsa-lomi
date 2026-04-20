import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { MemberForm } from "../member-form";
import { createMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  const [organization, tiers] = await Promise.all([
    prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.membershipTier.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <AdminShell organizationName={organization?.name} title="Add Member">
      <div className="mb-5">
        <Link href="/admin/members" className="text-sm font-medium text-teal-700 hover:text-teal-900">
          ← Back to members
        </Link>
      </div>
      <section className="mx-auto max-w-2xl rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-950">New member</h2>
        <MemberForm action={createMember} tiers={tiers} mode="create" />
      </section>
    </AdminShell>
  );
}
