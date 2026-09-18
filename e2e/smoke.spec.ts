import { expect, test } from "@playwright/test";

/**
 * SMOKE TEST
 *
 * The fastest, coarsest check in the suite: does the app boot at all? A
 * real browser hits a real dev server (see playwright.config.ts) and we
 * assert only on the critical path — the page loads, the most important
 * content is visible, and nothing errored. No edge cases, no interaction
 * flows; that's what e2e/home.spec.ts is for. Run this first/most often —
 * it's meant to fail fast on a broken build before anything deeper runs.
 */
test("home page loads with no console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("the API responds", async ({ request }) => {
  const response = await request.get("/api/hello");
  expect(response.ok()).toBe(true);
});

/**
 * Deliberately hits a DATABASE-backed route, not just /api/hello.
 *
 * db/client.ts imports the Bun builtin `bun:sqlite`, which only resolves when
 * the dev server is running under the Bun runtime. If playwright.config.ts's
 * webServer command ever loses its `--bun` (Vite's bin has a
 * `#!/usr/bin/env node` shebang, so it is one edit away), node's ESM loader
 * rejects that import and every database-backed route starts returning 500
 * — while /api/hello and the static pages keep passing, so a suite that only
 * probed those would stay green through a completely broken data layer.
 * That is exactly how this regression shipped undetected once already.
 */
test("a database-backed route responds", async ({ request }) => {
  const response = await request.get("/api/users");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toHaveProperty("users");
});
