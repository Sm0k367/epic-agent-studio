import { AgentStudio } from "@/components/studio/AgentStudio";
import { requireActiveSubscription } from "@/lib/require-subscription";

export const metadata = {
  title: "Studio",
  description: "Epic Agent Studio — generate text, images, audio, and video.",
};

export default async function StudioPage() {
  await requireActiveSubscription("/pricing?required=1");
  return <AgentStudio />;
}