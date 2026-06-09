import { auth } from "@/auth";
import { redirect } from "next/navigation";

/** All /os/* routes require sign-in; subscription enforced on /os itself. */
export default async function OsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/os");
  }
  return <>{children}</>;
}