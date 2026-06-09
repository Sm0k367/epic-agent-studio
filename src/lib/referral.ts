import { PUBLIC_URL } from "@/lib/company";

export const REFERRAL_COOKIE = "epic_os_ref";
const REFERRAL_STORAGE = "epic_os_ref";
const SHARE_CODE_STORAGE = "epic_os_share_code";

export function getOrCreateShareCode(): string {
  if (typeof window === "undefined") return "";
  try {
    let code = localStorage.getItem(SHARE_CODE_STORAGE);
    if (!code) {
      code = Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SHARE_CODE_STORAGE, code);
    }
    return code;
  } catch {
    return "";
  }
}

export function captureReferralFromSearch(params: URLSearchParams) {
  const ref = params.get("ref")?.trim();
  if (!ref || ref.length > 64) return;
  const safe = ref.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
  if (!safe) return;
  try {
    localStorage.setItem(REFERRAL_STORAGE, safe);
    document.cookie = `${REFERRAL_COOKIE}=${safe}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function getStoredReferral(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFERRAL_STORAGE);
  } catch {
    return null;
  }
}

export function referralShareUrl(code?: string) {
  const base = PUBLIC_URL.replace(/\/$/, "");
  const ref = code ?? getOrCreateShareCode();
  if (!ref) return base;
  return `${base}?ref=${encodeURIComponent(ref)}`;
}

export function referralCodeFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`${REFERRAL_COOKIE}=([^;]+)`));
  if (!match?.[1]) return undefined;
  const val = decodeURIComponent(match[1]).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
  return val || undefined;
}