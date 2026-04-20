import { MemberShell } from "@/components/member/member-shell";

export default function ClaimsPage() {
  return (
    <MemberShell title="Claims">
      <section className="rounded-md border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Death benefit claims</h2>
        <p className="mt-3 text-sm text-gray-600">File a claim, upload documents, and track review status.</p>
      </section>
    </MemberShell>
  );
}
