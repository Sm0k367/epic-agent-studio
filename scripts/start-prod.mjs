import { execSync, spawn } from "node:child_process";
import { assertPrivateDatabaseUrl } from "./assert-private-db.mjs";

assertPrivateDatabaseUrl();

const port = process.env.PORT || "3000";

function bootstrapDb() {
  try {
    console.log("> DB bootstrap (background)");
    execSync("node node_modules/prisma/build/index.js db push --skip-generate", {
      stdio: "inherit",
      env: process.env,
    });
    execSync("node node_modules/tsx/dist/cli.mjs scripts/seed.ts", {
      stdio: "inherit",
      env: process.env,
    });
  } catch (e) {
    console.warn("DB bootstrap warning (may be ok on first deploy):", e.message);
  }
}

// Start Next immediately so Railway health checks and F5 refreshes get a response.
console.log(`> next start -p ${port}`);
const next = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", port], {
  stdio: "inherit",
  env: process.env,
});

next.on("exit", (code) => process.exit(code ?? 1));

// Idempotent schema + catalog seed runs after the server is listening.
setImmediate(bootstrapDb);