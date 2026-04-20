import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "TREASURER", "SECRETARY"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !adminRoles.has(role)) {
    redirect("/sign-in");
  }

  return children;
}
