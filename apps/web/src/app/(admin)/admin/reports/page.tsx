import { AdminShell } from "@/components/admin/admin-shell";

export default function ReportsPage() {
  return (
    <AdminShell title="Financial Reports">
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">Income statement</h2>
        <p className="mt-3 text-sm text-gray-600">Dues collected, claims paid, expenses, and export controls.</p>
      </section>
    </AdminShell>
  );
}
