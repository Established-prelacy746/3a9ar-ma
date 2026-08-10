import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[240px_1fr]">
      <DashboardSidebar role={session.user.role} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
