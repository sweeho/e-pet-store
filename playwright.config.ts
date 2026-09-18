import { defineConfig, devices } from "@playwright/test";

// Fixed, dedicated port (distinct from the normal dev port 5000) so
// baseURL always matches what the server actually bound to — `--strictPort`
// makes Vite fail fast instead of silently picking a different port.
const PORT = 5178;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // bun, not npx — the agent containers are npm/npx-free (bun-only runner).
    //
    // Run the bin FILE under `bun --bun` rather than going through `bun x`. Two
    // reasons: Vite's bin carries a `#!/usr/bin/env node` shebang, so anything
    // that honours it starts the dev server under node — where db/client.ts's
    // `bun:sqlite` import dies with ERR_UNSUPPORTED_ESM_URL_SCHEME and every
    // database-backed route 500s, while routes that never touch the database
    // keep working. And naming the file skips bunx's resolution/auto-install
    // step, which can silently eat the whole startup budget on a cold runner.
    command: `bun --bun ./node_modules/vite/bin/vite.js --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // Cold runners pay for Vite's first-run dependency optimization here. 30s sat
    // below the real cold cost, so the same commit could pass on one machine and
    // time out on another. This is a ceiling, not a wait — warm starts still
    // return in about a second.
    timeout: 120_000,
    stdout: "pipe",
  },
});
