import { AdminShell } from "@/components/admin/admin-shell";

export default function ExpensesPage() {
  return (
    <AdminShell title="Expenses">
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">Expense ledger</h2>
        <p className="mt-3 text-sm text-gray-600">Funeral support, operations, receipts, and treasurer review.</p>
      </section>
    </AdminShell>
  );
}
