import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Studio Admin",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-svh bg-background">
      <AdminSidebar email={session.user.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 pb-16 pt-24 sm:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}
