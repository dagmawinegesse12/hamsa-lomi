import { AdminShell } from "@/components/admin/admin-shell";
import { NotificationComposer } from "@/components/notifications/notification-composer";

export default function NotificationComposePage() {
  return (
    <AdminShell title="Notification Center">
      <NotificationComposer />
    </AdminShell>
  );
}
