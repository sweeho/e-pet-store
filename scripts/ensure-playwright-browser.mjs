// Fail fast — with an actionable message — when Playwright's Chromium isn't
// installed, instead of letting `playwright test` stall silently. In a
// browserless environment (e.g. an agent workspace container) the runner can
// hang indefinitely with no output after "$ playwright test": the webServer
// starts, then globalSetup's chromium.launch() never surfaces its error. That
// silent stall was measured costing an agent ~15 minutes of retries; this
// preflight turns it into a 1-second explicit failure.
//
// Wired as `pretest:e2e`, so every `bun run test:e2e` (and `verify:full`)
// gets the guard automatically.
import { existsSync } from "node:fs";

import { chromium } from "@playwright/test";

const executable = chromium.executablePath();
if (!existsSync(executable)) {
  console.error(
    [
      `[test:e2e] Playwright's Chromium browser is not installed (expected at: ${executable}).`,
      "",
      "E2E tests need a real browser. Either:",
      "  - install it:  bun x playwright install chromium",
      "  - or skip E2E here — in the agent workflow, E2E runs in the QA phase",
      "    (browser-equipped container) and in CI, not in engineer containers.",
      "    Use `bun run verify` (lint + typecheck + test) instead.",
    ].join("\n"),
  );
  process.exit(1);
}
