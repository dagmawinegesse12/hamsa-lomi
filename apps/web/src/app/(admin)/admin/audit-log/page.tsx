import { AdminShell } from "@/components/admin/admin-shell";

export default function AuditLogPage() {
  return (
    <AdminShell title="Audit Log">
      <section className="rounded-md border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">Immutable activity trail</h2>
        <p className="mt-3 text-sm text-gray-600">Filter by actor, action, entity, and date range.</p>
      </section>
    </AdminShell>
  );
}
