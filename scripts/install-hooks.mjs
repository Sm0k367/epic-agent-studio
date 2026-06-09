#!/usr/bin/env node
/**
 * Install repo git hooks (pre-push secret scan).
 * Run: npm run install:hooks
 */
import { chmodSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOOKS_SRC = join(ROOT, ".githooks");
const HOOKS_DST = join(ROOT, ".git", "hooks");

if (!existsSync(join(ROOT, ".git"))) {
  console.error("Not a git repository — hooks not installed.");
  process.exit(1);
}

mkdirSync(HOOKS_DST, { recursive: true });

for (const name of ["pre-push"]) {
  const src = join(HOOKS_SRC, name);
  const dst = join(HOOKS_DST, name);
  copyFileSync(src, dst);
  try {
    chmodSync(dst, 0o755);
  } catch {
    /* Windows may not support chmod */
  }
  console.log(`Installed hook: ${name}`);
}

try {
  execSync("git config core.hooksPath .githooks", { cwd: ROOT, stdio: "inherit" });
  console.log("Git hooksPath set to .githooks");
} catch (e) {
  console.warn("Could not set core.hooksPath:", e.message);
}

console.log("Done — pushes will run npm run check:secrets automatically.");