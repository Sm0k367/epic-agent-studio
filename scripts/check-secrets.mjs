#!/usr/bin/env node
/**
 * Fail if likely secrets are committed to the repo.
 * Run: npm run check:secrets
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "out",
  "supabase/.temp",
]);

const SKIP_FILES = new Set(["package-lock.json", "check-secrets.mjs"]);

const PATTERNS = [
  { name: "Stripe secret key", re: /sk_(live|test)_[A-Za-z0-9]{16,}/ },
  { name: "Stripe publishable (live)", re: /pk_live_[A-Za-z0-9]{16,}/ },
  { name: "Stripe restricted key", re: /mk_(live|test)_[A-Za-z0-9]{16,}/ },
  { name: "Stripe webhook secret", re: /whsec_[A-Za-z0-9]{16,}/ },
  { name: "Supabase access token", re: /sbp_[A-Za-z0-9]{20,}/ },
  { name: "Supabase service key", re: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/ },
  { name: "Google OAuth secret", re: /GOCSPX-[A-Za-z0-9_-]{20,}/ },
  { name: "Vercel token", re: /vca_[A-Za-z0-9]{20,}/ },
  { name: "Railway token", re: /s2nYk[A-Za-z0-9_-]{20,}/ },
  { name: "Database URL with password", re: /postgresql:\/\/[^:]+:[^@\s]{8,}@/ },
  { name: "Generic API key assignment", re: /(?:api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_./+-]{24,}['"]/i },
];

const FORBIDDEN_TRACKED = [
  /^\.env$/,
  /^\.env\.local$/,
  /^deploy\.env$/,
  /^bootstrap\/secrets\//,
];

const ALLOW_PLACEHOLDER = [
  /sk_live_\.\.\./,
  /sk_test_\.\.\./,
  /whsec_\.\.\./,
  /YOUR_PASSWORD/,
  /YOUR_REF/,
  /your-generated-secret/,
  /placeholder/,
  /\.\.\./,
];

const SCAN_ROOTS = ["src", "scripts", "prisma", "kernel", "public", "supabase", ".github"];

function walk(dir, files = []) {
  let names;
  try {
    names = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const ent of names) {
    const p = join(dir, ent.name);
    const rel = relative(ROOT, p).replace(/\\/g, "/");
    if (SKIP_DIRS.has(ent.name) || SKIP_DIRS.has(rel)) continue;
    if (ent.isSymbolicLink()) continue;
    if (ent.isDirectory()) walk(p, files);
    else if (ent.isFile()) files.push(p);
  }
  return files;
}

const hits = [];
const files = [
  ...SCAN_ROOTS.flatMap((d) => walk(join(ROOT, d))),
  join(ROOT, "package.json"),
  join(ROOT, "README.md"),
  join(ROOT, ".env.example"),
  join(ROOT, "Dockerfile"),
  join(ROOT, "railway.toml"),
];

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (SKIP_FILES.has(rel)) continue;
  if (!/\.(ts|tsx|js|mjs|json|md|py|ps1|toml|yml|yaml|env\.example)$/i.test(rel)) continue;

  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const { name, re } of PATTERNS) {
    const m = text.match(re);
    if (!m) continue;
    const snippet = m[0];
    if (ALLOW_PLACEHOLDER.some((p) => p.test(snippet) || p.test(text.slice(Math.max(0, m.index - 20), m.index + 40)))) {
      continue;
    }
    if (rel.endsWith(".env.example") && snippet.includes("...")) continue;
    hits.push({ file: rel, type: name, snippet: snippet.slice(0, 24) + "…" });
  }
}

try {
  const tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
  for (const rel of tracked) {
    if (rel === "bootstrap/secrets/.gitkeep") continue;
    if (FORBIDDEN_TRACKED.some((re) => re.test(rel))) {
      hits.push({ file: rel, type: "Tracked env/secret file", snippet: "(gitignored path)" });
    }
  }
} catch {
  /* not a git repo or git unavailable */
}

if (hits.length) {
  console.error("Secret scan failed — remove hardcoded credentials:\n");
  for (const h of hits) console.error(`  ${h.file}: ${h.type} (${h.snippet})`);
  process.exit(1);
}

console.log("Secret scan passed — no hardcoded API keys detected.");