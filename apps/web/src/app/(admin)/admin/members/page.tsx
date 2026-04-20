import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

async function getMembersPageData() {
  const [organization, members] = await Promise.all([
    prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.member.findMany({
      include: {
        schedules: { where: { status: { in: ["PENDING", "OVERDUE"] } }, select: { amount: true } },
        tier: true
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: 25
    })
  ]);
  return { members, organization };
}

function statusClass(status: string) {
  if (status === "ACTIVE") {
    return "bg-teal-50 text-teal-800 ring-teal-200";
  }
  if (status === "SUSPENDED") {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }
  return "bg-red-50 text-red-800 ring-red-200";
}

export default async function MembersPage() {
  const { members, organization } = await getMembersPageData();
  const organizationName = organization?.name ?? "Hamsa Lomi Ethiopian Association";

  return (
    <AdminShell organizationName={organizationName} title="Member Management">
      <section className="rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-950">Member roster</h3>
            <p className="mt-1 text-sm text-gray-500">Showing {members.length} members from Supabase.</p>
          </div>
          <Link className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800" href="/admin/members/new">
            Add member
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Open balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member: (typeof members)[number]) => {
                const balance = member.schedules.reduce((total, schedule) => total + Number(schedule.amount), 0);
                return (
                  <tr className="hover:bg-gray-50" key={member.id}>
                    <td className="px-5 py-4">
                      <Link className="font-semibold text-gray-950 hover:text-teal-700" href={`/admin/members/${member.id}`}>
                        {member.firstName} {member.lastName}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">{member.address}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{member.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{member.tier?.name ?? "No tier"}</td>
                    <td className="px-5 py-4 text-gray-700">{formatDate(member.joinDate)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-950">{formatCurrency(balance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
