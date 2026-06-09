import { requireActiveSubscription } from "@/lib/require-subscription";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  await requireActiveSubscription();
  return <>{children}</>;
}