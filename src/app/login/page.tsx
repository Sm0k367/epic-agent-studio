import Link from "next/link";
import { auth, signIn } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/auth-routing";
import { googleAuthReady, googleOAuthRedirectUri } from "@/lib/google-auth";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

  const session = await auth();
  if (session?.user) await redirectAuthenticatedUser();

  const googleReady = googleAuthReady();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07070f] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a45] bg-[#111122] p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[#eeeef8]">Sign in to Epic OS</h1>
        <p className="mb-8 text-sm text-[#7a7a9a]">
          Sign in with Google, then choose weekly, monthly, or yearly billing to unlock your OS.
        </p>
        {params.error && (
          <p className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Sign-in was interrupted. Clear cookies for this site if it keeps looping, then try again.
          </p>
        )}
        {googleReady ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/auth/continue" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-[#111122] transition hover:bg-gray-100"
            >
              Continue with Google
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-100">
            <p className="font-semibold">Google sign-in is not configured yet</p>
            <p className="mt-2 text-amber-100/90">
              Add <code className="text-xs">GOOGLE_CLIENT_ID</code> and{" "}
              <code className="text-xs">GOOGLE_CLIENT_SECRET</code> on Railway, then register this redirect URI
              in Google Cloud Console:
            </p>
            <p className="mt-2 break-all font-mono text-xs text-[#22d3ee]">{googleOAuthRedirectUri()}</p>
          </div>
        )}
        <p className="mt-6 text-xs text-[#7a7a9a]">
          By continuing you agree to our{" "}
          <Link href="/terms" className="text-[#22d3ee] hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#22d3ee] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-[#7a7a9a] hover:text-[#22d3ee]">
          ← Back
        </Link>
      </div>
      <SiteFooter compact />
    </main>
  );
}