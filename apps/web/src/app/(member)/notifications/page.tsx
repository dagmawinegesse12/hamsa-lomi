import { MemberShell } from "@/components/member/member-shell";

export default function NotificationsPage() {
  return (
    <MemberShell title="Notifications">
      <section className="rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Inbox</h2>
        <p className="mt-3 text-sm text-gray-600">Unread notices, delivery history, archive, and filters.</p>
      </section>
    </MemberShell>
  );
}
