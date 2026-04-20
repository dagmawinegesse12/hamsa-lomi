import { MemberShell } from "@/components/member/member-shell";

export default function PaymentsPage() {
  return (
    <MemberShell title="Payments">
      <section className="rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Payment history</h2>
        <p className="mt-3 text-sm text-gray-600">Receipts, penalties, and monthly status badges are listed here.</p>
      </section>
    </MemberShell>
  );
}
