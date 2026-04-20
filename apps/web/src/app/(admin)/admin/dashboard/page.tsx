import { AdminShell } from "@/components/admin/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [organization, activeMembers, suspendedMembers, dues, pendingClaims, overdueMembers, upcomingMeetings, recentPayments] =
    await Promise.all([
      prisma.organization.findFirst({ orderBy: { createdAt: "asc" } }),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.member.count({ where: { status: "SUSPENDED" } }),
      prisma.duePayment.aggregate({ _sum: { amount: true } }),
      prisma.deathClaim.count({ where: { claimStatus: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.member.count({ where: { schedules: { some: { status: "OVERDUE" } } } }),
      prisma.meeting.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 3 }),
      prisma.duePayment.findMany({ include: { member: true }, orderBy: { paidAt: "desc" }, take: 5 })
    ]);

  return { activeMembers, dues, organization, overdueMembers, pendingClaims, recentPayments, suspendedMembers, upcomingMeetings };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const organizationName = data.organization?.name ?? "Hamsa Lomi Ethiopian Association";

  return (
    <AdminShell organizationName={organizationName} title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard helper="Live count once real members are added" label="Active members" value="Coming soon" accent="neutral" />
        <KpiCard helper="Live total once real payments are recorded" label="Total dues collected" value="Coming soon" accent="neutral" />
        <KpiCard helper="Live count once real claims are submitted" label="Pending claims" value="Coming soon" accent="neutral" />
        <KpiCard helper="Members with overdue schedules" label="Overdue members" value={String(data.overdueMembers)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-md border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-lg font-bold text-gray-950">Recent payments</h3>
            <p className="mt-1 text-sm text-gray-500">Latest dues recorded by the treasurer.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recentPayments.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">No payments recorded yet.</p>
            ) : data.recentPayments.map((payment: (typeof data.recentPayments)[number]) => (
              <div className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[1fr_140px_120px]" key={payment.id}>
                <span className="font-medium text-gray-950">{payment.member.firstName} {payment.member.lastName}</span>
                <span className="text-gray-600">{payment.period}</span>
                <span className="font-semibold text-green-700">{formatCurrency(Number(payment.amount))}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-md border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-bold text-gray-950">Upcoming meetings</h3>
          <div className="mt-4 space-y-4">
            {data.upcomingMeetings.map((meeting: (typeof data.upcomingMeetings)[number]) => (
              <div className="rounded-md border border-gray-200 p-4" key={meeting.id}>
                <p className="text-sm font-semibold text-gray-950">{meeting.type} meeting</p>
                <p className="mt-1 text-sm text-gray-600">{formatDate(meeting.date)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
