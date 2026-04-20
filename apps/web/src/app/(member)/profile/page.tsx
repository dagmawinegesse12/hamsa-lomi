import { MemberShell } from "@/components/member/member-shell";

export default function ProfilePage() {
  return (
    <MemberShell title="My Profile">
      <section className="rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Personal details</h2>
        <p className="mt-3 text-sm text-gray-600">Profile photo, address, phone, dependents, and benefit schedule.</p>
      </section>
    </MemberShell>
  );
}
