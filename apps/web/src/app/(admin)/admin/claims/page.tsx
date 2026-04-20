import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ClaimActions } from "./claim-actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-800 ring-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-800 ring-amber-200",
  APPROVED: "bg-teal-50 text-teal-800 ring-teal-200",
  PAID: "bg-green-50 text-green-800 ring-green-200",
  REJECTED: "bg-red-50 text-red-800 ring-red-200"
};

async function getClaimsData() {
  const [organization, claims] = await Promise.all([
    prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.deathClaim.findMany({
      include: { member: true },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);
  return { organization, claims };
}

export default async function AdminClaimsPage() {
  const { organization, claims } = await getClaimsData();

  type Claim = (typeof claims)[number];
  const pending: Claim[] = claims.filter((c: Claim) => c.claimStatus === "SUBMITTED" || c.claimStatus === "UNDER_REVIEW");

  return (
    <AdminShell organizationName={organization?.name} title="Death Benefit Claims">
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-950">Requires action ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((claim: Claim) => (
              <article key={claim.id} className="rounded-md border border-amber-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-950">{claim.deceasedName}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[claim.claimStatus]}`}>
                        {claim.claimStatus.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {claim.member.firstName} {claim.member.lastName} · {claim.relationship} · Deceased {formatDate(claim.dateOfDeath)}
                    </p>
                  </div>
                  {claim.benefitAmount && (
                    <span className="text-lg font-bold text-teal-700">{formatCurrency(Number(claim.benefitAmount))}</span>
                  )}
                </div>
                {claim.reviewNotes && (
                  <div className="border-b border-gray-100 px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Review notes</p>
                    <p className="mt-1 text-sm text-gray-700">{claim.reviewNotes}</p>
                  </div>
                )}
                <div className="px-5 py-4">
                  <ClaimActions claimId={claim.id} currentStatus={claim.claimStatus} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-950">All claims</h2>
        <div className="rounded-md border border-gray-200 bg-white">
          {claims.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-500">No claims have been submitted yet.</p>
          )}
          <div className="overflow-x-auto">
            {claims.length > 0 && (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Deceased</th>
                    <th className="px-5 py-3">Relationship</th>
                    <th className="px-5 py-3">Date of death</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claims.map((claim: Claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-950">
                        {claim.member.firstName} {claim.member.lastName}
                      </td>
                      <td className="px-5 py-3 text-gray-700">{claim.deceasedName}</td>
                      <td className="px-5 py-3 text-gray-700">{claim.relationship}</td>
                      <td className="px-5 py-3 text-gray-700">{formatDate(claim.dateOfDeath)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[claim.claimStatus]}`}>
                          {claim.claimStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-950">
                        {claim.benefitAmount ? formatCurrency(Number(claim.benefitAmount)) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
