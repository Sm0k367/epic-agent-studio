/**
 * Headed live stress test — opens a visible browser on your screen.
 * Run: node scripts/stress-test-live.mjs
 * Optional: MANUAL_LOGIN_SEC=180 to pause for Google sign-in before OS tests.
 */
import { chromium, devices } from "playwright";

const BASE = process.env.STRESS_URL ?? "https://epic-os.up.railway.app";
const SLOW_MO = Number(process.env.SLOW_MO ?? 350);
const MANUAL_LOGIN_SEC = Number(process.env.MANUAL_LOGIN_SEC ?? 90);
const HEADED = process.env.HEADLESS !== "1";

const results = { pass: [], fail: [], warn: [] };

function log(kind, name, detail = "") {
  const line = detail ? `${name}: ${detail}` : name;
  results[kind].push(line);
  const icon = kind === "pass" ? "✓" : kind === "fail" ? "✗" : "⚠";
  console.log(`${icon} [${kind.toUpperCase()}] ${line}`);
}

async function assertNoRedirectLoop(page, url, maxHops = 8) {
  let hops = 0;
  let current = url;
  const seen = new Set();
  while (hops < maxHops) {
    if (seen.has(current)) throw new Error(`redirect loop at ${current}`);
    seen.add(current);
    const res = await page.goto(current, { waitUntil: "domcontentloaded", timeout: 45000 });
    const status = res?.status() ?? 0;
    if (status >= 400) throw new Error(`HTTP ${status}`);
    await page.waitForTimeout(400);
    const final = page.url();
    if (!final.includes("ERR_TOO_MANY_REDIRECTS")) return final;
    throw new Error("browser reported too many redirects");
  }
  return page.url();
}

async function clickAllInternalLinks(page, scope = "a[href^='/']") {
  const hrefs = await page.locator(scope).evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute("href")).filter(Boolean))],
  );
  for (const href of hrefs) {
    try {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(300);
      log("pass", `link ${href}`, `title=${await page.title()}`);
    } catch (e) {
      log("fail", `link ${href}`, String(e.message ?? e));
    }
  }
}

async function apiStress() {
  const endpoints = [
    "/api/os/health",
    "/api/os/status",
    "/api/os/catalog",
    "/api/os/preferences",
    "/api/admin/users",
    "/api/stripe/checkout",
  ];
  for (let i = 0; i < 15; i++) {
    for (const ep of endpoints) {
      try {
        const res = await fetch(`${BASE}${ep}`, {
          method: ep.includes("checkout") ? "POST" : "GET",
          headers: ep.includes("checkout") ? { "Content-Type": "application/json" } : {},
          body: ep.includes("checkout") ? JSON.stringify({ plan: "weekly" }) : undefined,
          redirect: "manual",
        });
        const expected = ep === "/api/os/health" ? res.status === 200 : [401, 402, 403, 405].includes(res.status) || res.status === 200;
        if (expected) log("pass", `API ${ep}`, `status=${res.status} (burst ${i + 1})`);
        else log("fail", `API ${ep}`, `unexpected status=${res.status}`);
      } catch (e) {
        log("fail", `API ${ep}`, String(e.message ?? e));
      }
    }
  }
}

async function stressPublicSite(page) {
  log("pass", "Starting public site stress", BASE);

  const routes = [
    "/",
    "/?ref=stress-test",
    "/pricing",
    "/pricing?required=1",
    "/login",
    "/login?callbackUrl=%2Fos",
    "/contact",
    "/deploy-hub",
    "/api-hub",
    "/legal",
    "/legal/billing",
    "/legal/cookies",
    "/terms",
    "/privacy",
  ];

  for (const route of routes) {
    try {
      const final = await assertNoRedirectLoop(page, `${BASE}${route}`);
      log("pass", `route ${route}`, `landed ${final}`);
    } catch (e) {
      log("fail", `route ${route}`, String(e.message ?? e));
    }
  }

  // Homepage interactions
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 45000 });
  await page.getByRole("link", { name: /sign in with google/i }).first().click();
  await page.waitForTimeout(800);
  log("pass", "homepage CTA", `→ ${page.url()}`);
  await page.goBack({ waitUntil: "domcontentloaded" });

  await page.getByRole("link", { name: /see pricing/i }).click();
  await page.waitForTimeout(800);
  log("pass", "pricing CTA", `→ ${page.url()}`);

  await page.getByRole("button", { name: /copy invite link/i }).click();
  await page.waitForTimeout(500);
  log("pass", "share copy button", "clicked");

  // Pricing — all plan sign-in links
  await page.goto(`${BASE}/pricing`, { waitUntil: "networkidle" });
  const signInLinks = page.getByRole("link", { name: /sign in to subscribe/i });
  const count = await signInLinks.count();
  for (let i = 0; i < count; i++) {
    await signInLinks.nth(i).click();
    await page.waitForTimeout(600);
    log("pass", `pricing plan CTA ${i + 1}`, page.url());
    await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
  }

  // Footer crawl from homepage
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await clickAllInternalLinks(page);

  // Mobile viewport
  await page.setViewportSize(devices["iPhone 13"].viewport);
  await assertNoRedirectLoop(page, BASE);
  await assertNoRedirectLoop(page, `${BASE}/pricing`);
  log("pass", "mobile viewport", "iPhone 13 — no redirect loop");

  await page.setViewportSize({ width: 1440, height: 900 });
}

async function stressLoginFlow(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  const googleBtn = page.getByRole("button", { name: /continue with google/i });
  if (await googleBtn.isVisible()) {
    await googleBtn.click();
    await page.waitForTimeout(2000);
    const url = page.url();
    if (url.includes("accounts.google.com") || url.includes("google.com")) {
      log("pass", "Google OAuth redirect", url.slice(0, 80));
    } else {
      log("warn", "Google OAuth redirect", `unexpected url: ${url}`);
    }
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  } else {
    log("warn", "Google OAuth", "button not visible — credentials may be missing on server");
  }

  // Protected routes should redirect to login (no loop)
  for (const path of ["/os", "/admin", "/os/settings", "/os/billing"]) {
    try {
      const final = await assertNoRedirectLoop(page, `${BASE}${path}`);
      if (final.includes("/login") || final.includes("/pricing")) {
        log("pass", `protected ${path}`, `→ ${final}`);
      } else {
        log("warn", `protected ${path}`, `landed ${final} (maybe already signed in)`);
      }
    } catch (e) {
      log("fail", `protected ${path}`, String(e.message ?? e));
    }
  }
}

async function stressOsIfLoggedIn(page) {
  await page.goto(`${BASE}/os`, { waitUntil: "networkidle", timeout: 45000 });
  const url = page.url();

  if (url.includes("/login")) {
    log("warn", "OS stress skipped", "not signed in — sign in manually during pause window");
    return false;
  }
  if (url.includes("/pricing")) {
    log("warn", "OS stress skipped", "signed in but no active subscription");
    return false;
  }

  log("pass", "OS loaded", url);

  // Wait for catalog
  await page.getByPlaceholder("Search apps…").waitFor({ timeout: 20000 });
  await page.getByPlaceholder("Search apps…").fill("deploy");
  await page.waitForTimeout(500);
  log("pass", "OS search", "query=deploy");

  // Click every category
  const cats = page.locator("aside button");
  const n = await cats.count();
  for (let i = 0; i < n; i++) {
    await cats.nth(i).click();
    await page.waitForTimeout(250);
  }
  log("pass", "OS categories", `clicked ${n} sidebar filters`);

  // Launch first 12 apps (stress)
  const apps = page.locator("main button[type='button']");
  const appCount = Math.min(await apps.count(), 12);
  for (let i = 0; i < appCount; i++) {
    await apps.nth(i).click();
    await page.waitForTimeout(400);
  }
  log("pass", "OS app launches", `clicked ${appCount} apps`);

  // Dock stress
  const dock = page.locator(".pointer-events-auto button");
  const dockN = Math.min(await dock.count(), 8);
  for (let i = 0; i < dockN; i++) {
    await dock.nth(i).click();
    await page.waitForTimeout(350);
  }
  log("pass", "OS dock", `clicked ${dockN} dock apps`);

  // Header links
  for (const name of [/API Hub/i, /Billing/i, /Settings/i, /Contact/i]) {
    const link = page.getByRole("link", { name }).first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForTimeout(700);
      log("pass", "OS nav", `→ ${page.url()}`);
      await page.goto(`${BASE}/os`, { waitUntil: "domcontentloaded" });
    }
  }

  // Onboarding wizard if present
  const wizard = page.getByText(/welcome to epic os/i);
  if (await wizard.isVisible().catch(() => false)) {
    const presets = page.locator("button").filter({ hasText: /builder|creator|minimal/i });
    if (await presets.count()) {
      await presets.first().click();
      await page.waitForTimeout(500);
    }
    const finish = page.getByRole("button", { name: /open my os|finish|get started/i });
    if (await finish.isVisible().catch(() => false)) {
      await finish.click();
      await page.waitForTimeout(800);
      log("pass", "onboarding wizard", "completed flow");
    }
  }

  // Settings page
  await page.goto(`${BASE}/os/settings`, { waitUntil: "networkidle" });
  log("pass", "OS settings", page.url());

  // Billing page
  await page.goto(`${BASE}/os/billing`, { waitUntil: "networkidle" });
  log("pass", "OS billing", page.url());

  // Admin if visible
  const admin = page.getByRole("link", { name: /admin/i });
  if (await admin.isVisible().catch(() => false)) {
    await admin.click();
    await page.waitForTimeout(1000);
    log("pass", "admin panel", page.url());
  }

  return true;
}

async function main() {
  console.log("\n=== Epic OS LIVE STRESS TEST ===");
  console.log(`Target: ${BASE}`);
  console.log(`Headed: ${HEADED} | SlowMo: ${SLOW_MO}ms | Manual login window: ${MANUAL_LOGIN_SEC}s\n`);

  await apiStress();

  const browser = await chromium.launch({
    headless: !HEADED,
    slowMo: SLOW_MO,
    args: HEADED ? ["--start-maximized"] : [],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();

  try {
    await stressPublicSite(page);
    await stressLoginFlow(page);

    if (MANUAL_LOGIN_SEC > 0) {
      console.log(`\n>>> SIGN IN NOW on screen (${MANUAL_LOGIN_SEC}s) — Google OAuth, then wait for OS tests <<<\n`);
      await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
      await page.bringToFront();
      await page.waitForTimeout(MANUAL_LOGIN_SEC * 1000);
    }

    await stressOsIfLoggedIn(page);

    // Final redirect-loop regression
    for (let i = 0; i < 5; i++) {
      await assertNoRedirectLoop(page, BASE);
      await assertNoRedirectLoop(page, `${BASE}/login`);
      await assertNoRedirectLoop(page, `${BASE}/os`);
    }
    log("pass", "redirect regression", "5x homepage/login/os — no loops");
  } finally {
    console.log("\n=== SUMMARY ===");
    console.log(`PASS: ${results.pass.length}  FAIL: ${results.fail.length}  WARN: ${results.warn.length}`);
    if (results.fail.length) {
      console.log("\nFailures:");
      results.fail.forEach((f) => console.log("  -", f));
    }
    if (results.warn.length) {
      console.log("\nWarnings:");
      results.warn.forEach((w) => console.log("  -", w));
    }
    console.log("\nBrowser stays open 15s so you can inspect…");
    await page.waitForTimeout(15000);
    await browser.close();
    process.exit(results.fail.length ? 1 : 0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});