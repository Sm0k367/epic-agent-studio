import { redirectAuthenticatedUser } from "@/lib/auth-routing";

export default async function AuthContinuePage() {
  await redirectAuthenticatedUser();
}