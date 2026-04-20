import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { MemberForm } from "../member-form";
import { updateMember } from "../actions";

export const dynamic = "force-dynamic";

async function getMemberData(id: string) {
  const [organization, member, tiers] = await Promise.all([
    prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.member.findUnique({
      where: { id },
      include: {
        tier: true,
        dependents: true,
        payments: { orderBy: { paidAt: "desc" }, take: 10 },
        claims: { orderBy: { createdAt: "desc" }, take: 5 },
        schedules: { where: { status: { in: ["PENDING", "OVERDUE"] } }, take: 12 }
      }
    }),
    prisma.membershipTier.findMany({ orderBy: { name: "asc" } })
  ]);
  return { organization, member, tiers };
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-teal-50 text-teal-800 ring-teal-200",
    SUSPENDED: "bg-amber-50 text-amber-800 ring-amber-200",
    EXPELLED: "bg-red-50 text-red-800 ring-red-200",
    DECEASED: "bg-gray-100 text-gray-600 ring-gray-200"
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`}>
      {status}
    </span>
  );
}

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const { organization, member, tiers } = await getMemberData(params.id);
  if (!member) notFound();

  const openBalance = member.schedules.reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <AdminShell organizationName={organization?.name} title={`${member.firstName} ${member.lastName}`}>
      <div className="mb-5">
        <Link href="/admin/members" className="text-sm font-medium text-teal-700 hover:text-teal-900">
          ← Back to members
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left: details + edit */}
        <div className="space-y-6">
          {/* Summary */}
          <section className="rounded-md border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-950">{member.firstName} {member.lastName}</h2>
                <p className="mt-1 text-sm text-gray-500">{member.phone} · {member.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={member.status} />
                {member.tier && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200">
                    {member.tier.name}
                  </span>
                )}
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-gray-950">{formatDate(member.joinDate)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Open balance</dt>
                <dd className={`mt-1 font-semibold ${openBalance > 0 ? "text-red-600" : "text-teal-700"}`}>
                  {formatCurrency(openBalance)}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Dependents</dt>
                <dd className="mt-1 text-gray-950">{member.dependents.length}</dd>
              </div>
            </dl>
          </section>

          {/* Edit form */}
          <section className="rounded-md border border-gray-200 bg-white p-5">
            <h3 className="mb-5 text-lg font-bold text-gray-950">Edit member</h3>
            <MemberForm
              action={updateMember}
              mode="edit"
              tiers={tiers}
              defaultValues={{
                memberId: member.id,
                firstName: member.firstName,
                lastName: member.lastName,
                phone: member.phone,
                address: member.address,
                status: member.status,
                tierId: member.tierId
              }}
            />
          </section>

          {/* Dependents */}
          {member.dependents.length > 0 && (
            <section className="rounded-md border border-gray-200 bg-white p-5">
              <h3 className="mb-4 text-lg font-bold text-gray-950">Dependents</h3>
              <div className="divide-y divide-gray-100">
                {member.dependents.map((dep: (typeof member.dependents)[number]) => (
                  <div key={dep.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="font-medium text-gray-950">{dep.name}</span>
                    <span className="text-gray-500">{dep.relationship}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: payments + claims */}
        <div className="space-y-6">
          <section className="rounded-md border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-base font-bold text-gray-950">Recent payments</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {member.payments.length === 0 && (
                <p className="px-5 py-4 text-sm text-gray-500">No payments recorded.</p>
              )}
              {member.payments.map((p: (typeof member.payments)[number]) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-gray-700">{p.period}</span>
                  <span className="font-semibold text-teal-700">{formatCurrency(Number(p.amount))}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-base font-bold text-gray-950">Claims</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {member.claims.length === 0 && (
                <p className="px-5 py-4 text-sm text-gray-500">No claims filed.</p>
              )}
              {member.claims.map((c: (typeof member.claims)[number]) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-950">{c.deceasedName}</p>
                    <p className="text-xs text-gray-500">{c.relationship} · {formatDate(c.dateOfDeath)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                    c.claimStatus === "APPROVED" || c.claimStatus === "PAID"
                      ? "bg-teal-50 text-teal-800 ring-teal-200"
                      : c.claimStatus === "REJECTED"
                      ? "bg-red-50 text-red-800 ring-red-200"
                      : "bg-amber-50 text-amber-800 ring-amber-200"
                  }`}>
                    {c.claimStatus.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
