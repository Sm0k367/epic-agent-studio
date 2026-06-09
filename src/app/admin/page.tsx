import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { isAdminRole } from "@/lib/admin";
import { Role } from "@prisma/client";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || !isAdminRole(session.user.role)) redirect("/studio");

  return (
    <AdminPanel isPlatformAdmin={session.user.role === Role.PLATFORM_ADMIN} />
  );
}