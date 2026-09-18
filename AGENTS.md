# Agent Guide

`CLAUDE.md` and `GEMINI.md` are symlinks to this file — one authored manual, whatever
harness is reading it.

**Vortex composes four of the sections below straight into every agent's prompt**:
`## Build & run`, `## Test & validate`, `## Conventions` and `## Gotchas`. Everything
else is named in the prompt and read from the file on demand. Put an instruction an
agent must obey in one of those four; put reference material anywhere else.

Commands are NOT listed here. They are declared once, machine-readably, in
`.vortex/config.yaml` under `commands:`, and reach every agent as a resolved table
under `## Project commands`. This file explains the ones whose behaviour is not
obvious; it does not restate them.

## Docs

- [README.md](./README.md) — routing, API handlers, database, the full feature tour
- [ARCHITECTURE.md](./ARCHITECTURE.md) — stack, data flow, deployment
- [DESIGN.md](./DESIGN.md) — tokens, theming, component pattern
- [PRODUCT.md](./PRODUCT.md) — what this is; replace for a real product

## Build & run

`install` then `start` — the dev server runs frontend and backend together on **:5000**.
Playwright drives its own server on **:5178** with `--strictPort`, so a running dev
server never collides with a test run and never silently absorbs one.

Everything runs under **bun**, including the test runners. `db/client.ts` imports the
`bun:sqlite` builtin, so a script that reaches it under plain Node fails at import —
which is why `test` is `bun --bun vitest run` and not `vitest`.

`auto-imports.d.ts` does not exist on a fresh clone. The `prebuild` and `pretypecheck`
hooks generate it. Give any new tsc-only script the same hook or it fails on a clean
checkout and nowhere else.

## Test & validate

Run the `verify-full` slot before finishing a change. It is `verify` plus the browser
tier, and every environment this template targets — Vortex agent workspace containers,
CI, local dev — ships a Chromium.

`verify` alone is the browser-free core gate. It is the right fallback **only** when the
E2E preflight tells you the browser is genuinely missing: say so in your summary and move
on. Do not retry E2E, and do not try to install a browser.

| You changed...                            | Add...                                      | Copy from                           |
| ----------------------------------------- | ------------------------------------------- | ----------------------------------- |
| A util (`src/utils`)                      | Unit test, `<name>.test.ts`                 | `src/utils/cn.test.ts`              |
| A component                               | UI test, `<name>.test.tsx`                  | `src/components/ui/button.test.tsx` |
| A page                                    | UI test, `<name>.test.tsx`                  | `src/pages/index.test.tsx`          |
| An API route/middleware                   | Integration test, real `H3Event`, no server | `routes/api/hello.test.ts`          |
| A cross-page/responsive/browser-only flow | Playwright spec in `e2e/`                   | `e2e/home.spec.ts`                  |

Vitest runs as **two projects**, and which one a test lands in is decided by its path:
`routes/**/*.test.ts` runs in the `server` project (`environment: "node"`), everything
else in the `client` project (jsdom). A route test placed outside `routes/` runs in jsdom,
where `bun:sqlite` cannot resolve at all.

A spec you have not executed is not a test. Never commit a `*.spec.ts` you have not run
at least once.

## Conventions

- **Routing is file-based, both sides.** A page is a file under `src/pages/`; an API
  handler is a file under `routes/api/`. Neither is registered anywhere — creating the
  file is the whole change. See README for dynamic, catch-all and method-specific shapes.
- **Imports are auto-generated for React and router APIs** via `unplugin-auto-import`.
  Do not add an explicit import for something already in `auto-imports.d.ts`; do not
  hand-edit that file.
- **Tailwind is CSS-first.** There is no `tailwind.config.js` and adding one is a defect.
  Tokens and theming live in CSS — see DESIGN.md.
- **Database access goes through drizzle**, never raw SQL strings. A schema change is not
  done until `db-generate` has produced the migration in `drizzle/` and you have committed it.
- **TypeScript is strict.** Complete annotations on exported functions; no `any` without a
  justification comment on the line above it.
- **Mirror the nearest existing file.** Before writing a page, a route, a component or a
  test, open the closest existing one and copy its shape. The examples in the README show
  the pattern; the real files are the contract.

## Gotchas

- Nitro's `serverDir` defaults to `false` — must be `"./"` in `vite.config.ts` or `routes/`/`middleware/` never load
- `Pages()` needs `exclude: ["**/*.test.tsx"]` or the build breaks on the first page test
- `nitro()` needs `ignore: ["**/*.test.ts"]` or route tests get bundled into the prod server
- `auto-imports.d.ts` doesn't exist on a fresh clone — `pretypecheck`/`prebuild` generate it; give any new `tsc`-only script the same hook
- Playwright runs on port 5178, not 5000, so it never collides with a dev server
- `tsconfig.node.json` is `composite: true` — can't set `noEmit`, so it has its own `outDir` to avoid scattering compiled files
- `db/client.ts` resolves `sqlite.db` and the `drizzle/` migrations folder from `process.cwd()`, not `import.meta.url` — Vite/Nitro/Vitest all transform this module, so its `import.meta.url` isn't a real `file://` URL
- Under Vitest (`VITEST=true`), `db/client.ts` uses an in-memory db instead of `sqlite.db`, so route tests never touch or share the dev database
- `db/client.ts` imports `bun:sqlite` (a Bun builtin), so anything that loads it must run under Bun. Two consequences: (1) `vitest.config.ts` splits into a `client` project (jsdom, everything except `routes/**`) and a `server` project (`environment: "node"`, `routes/**/*.test.ts`) — Vite's jsdom/"client" environment can't externalize a runtime builtin at all (browsers have no such module to resolve against), only a server-like environment can; (2) `test`/`test:watch` run `bun --bun vitest` (not plain `vitest`) — Vitest's worker pool otherwise spawns real Node child processes even when the parent script itself ran under `bun run`, and Node has no `bun:sqlite` either. `.output/server/index.mjs` (PM2/systemd, see ARCHITECTURE.md#deployment) needs the same Bun requirement in production
