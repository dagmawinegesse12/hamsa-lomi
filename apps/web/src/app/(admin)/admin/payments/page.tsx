import { AdminShell } from "@/components/admin/admin-shell";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function AdminPaymentsPage() {
  return (
    <AdminShell title="Dues & Payments">
      <section className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <div className="grid min-w-[760px] grid-cols-[180px_repeat(6,1fr)] border-b border-gray-200 px-4 py-3 text-sm font-semibold">
          <span>Member</span>
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        {["Abebe Tesfaye", "Almaz Mekonnen", "Dawit Alemu"].map((name) => (
          <div className="grid min-w-[760px] grid-cols-[180px_repeat(6,1fr)] px-4 py-3 text-sm" key={name}>
            <span>{name}</span>
            {months.map((month, index) => (
              <span className={index < 4 ? "text-teal-700" : index === 4 ? "text-amber-700" : "text-red-700"} key={month}>
                {index < 4 ? "Paid" : index === 4 ? "Pending" : "Overdue"}
              </span>
            ))}
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
