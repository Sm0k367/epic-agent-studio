import { auth } from "@/auth";
import { Shell } from "@/components/os/Shell";
import { requireActiveSubscription } from "@/lib/require-subscription";
import { syncSubscriptionForUser } from "@/lib/stripe-sync";

export default async function OsPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const params = await searchParams;
  if (params.welcome === "1") {
    const session = await auth();
    if (session?.user?.id) {
      await syncSubscriptionForUser(session.user.id);
    }
  }
  await requireActiveSubscription();
  return <Shell />;
}