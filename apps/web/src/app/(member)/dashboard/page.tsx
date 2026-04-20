import { Card } from "@/components/ui/card";
import { MemberShell } from "@/components/member/member-shell";

export default function MemberDashboardPage() {
  return (
    <MemberShell title="Member Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Current month due</p>
          <p className="mt-2 text-2xl font-bold text-teal-800">Paid</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Outstanding balance</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">ETB 0.00</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Benefit eligibility</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">Eligible</p>
        </Card>
      </div>
      <section className="mt-8 rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Recent activity</h2>
        <p className="mt-3 text-sm text-gray-600">Six months of payment history and unread notices appear here.</p>
      </section>
    </MemberShell>
  );
}
