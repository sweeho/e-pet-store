# React + TypeScript + Nitro Full-Stack Template

A **template repository** for bootstrapping new full-stack TypeScript web apps: React 19 on the frontend, Nitro for the backend API, Tailwind CSS 4 + shadcn/ui for styling, and a working test setup on both sides — so your first commit on a new project is product code, not scaffolding.

This isn't a finished product. The homepage hero, mock API data, and a few other files are placeholder content meant to be replaced — see [Using This Template](#using-this-template) below.

---

## Using This Template

### 1. Create your new repo

**Option A — GitHub "Use this template" button (recommended)**

On the [repo page](https://github.com/cognizhi/vortex-boilerplate-ts-reactjs-vite-tailwindcss), click **Use this template → Create a new repository**. This gives you a new repo with a clean git history (no commits from this template) that you can clone and start working in immediately.

**Option B — Clone and re-point manually**

```bash
git clone https://github.com/cognizhi/vortex-boilerplate-ts-reactjs-vite-tailwindcss.git my-new-app
cd my-new-app

# Drop this template's history and start your own
rm -rf .git
git init
git add .
git commit -m "Initial commit from vortex template"

# Point at your own remote
git remote add origin <your-new-repo-url>
git push -u origin main
```

### 2. Install and confirm it boots

```bash
bun install
bun run dev
```

Visit http://localhost:5000 — you should see the template's placeholder homepage.

### 3. Make it yours

| File / path                                          | What to do                                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `package.json` (`name`, `description`, `repository`) | Rename from `react-ts-starter` to your project.                                                                           |
| `src/pages/index.tsx`                                | Replace the placeholder hero copy and links with your real homepage.                                                      |
| `routes/api/users/*`                                 | Already backed by a real SQLite db via Drizzle (see [Database](#database)) — replace `db/schema.ts` with your own tables. |
| `middleware/auth.ts`                                 | This is a **stub** that attaches a hardcoded user to every request — swap in real auth before shipping.                   |
| `src/helpers/demo.ts`                                | Example-only helper (also uses a Next.js-style env var, not Vite's `import.meta.env.VITE_*`) — delete or rewrite.         |
| `src/App.md`                                         | Leftover scaffolding notes, not used by the app — delete.                                                                 |
| `PRODUCT.md`                                         | Replace with your actual product brief (problem, users, scope) — see the template inside the file.                        |
| `README.md` / `ARCHITECTURE.md` / `DESIGN.md`        | Update once your app diverges from the template's defaults.                                                               |

Then run `bun run verify` (see [Testing](#testing)) to confirm everything still passes before you start changing code.

---

## Features

### Frontend

- ⚡ **React 19** with TypeScript and Vite
- 🎨 **Tailwind CSS 4** + **shadcn/ui** components
- 🗂️ **File-based routing** with `vite-plugin-pages`
- 🔄 **Auto-imports** for React hooks and components
- 🖼️ **SVG as React components** with `vite-plugin-svgr`
- 🔤 **Google Fonts** integration
- 📦 **Path aliases** (`@/components`, etc.)

### Backend

- 🚀 **Nitro 3** server with H3 handler
- 🛣️ **File-based API routing** in `/routes`
- 🗄️ **SQLite + Drizzle ORM** — schema/client in `/db`, migrations in `/drizzle`
- ⚡ **Fast development** with hot module replacement
- 🔧 **TypeScript** support out of the box

### Developer Experience

- ✅ **ESLint** + **Prettier** configured
- 🧪 **Vitest** + **Testing Library** (unit/integration/UI) and **Playwright** (E2E/smoke) — see [Testing](#testing)
- 🪝 **Husky** pre-commit hooks
- 🐳 **Docker** setup included
- 🤖 **Dependabot** for dependency updates
- 📝 **Workspace settings** for team collaboration

---

## Quick Start

```bash
# Install dependencies
bun install

# Start development server (frontend + backend)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint

# Type-check without emitting
bun run typecheck

# Run unit/integration/UI tests (Vitest)
bun run test

# Run browser E2E + smoke tests (Playwright)
bun run test:e2e

# Run the core gate: lint, typecheck, test (browser-free — works everywhere)
bun run verify

# Run everything incl. Playwright E2E (needs an installed browser)
bun run verify:full
```

The dev server runs on:

- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api/\*

---

## Client-Side Routing (Frontend)

### File-Based Routing with vite-plugin-pages

Routes are automatically generated from files in `src/pages/`. Each `.tsx` file becomes a route.

**Documentation**: [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)

### Route Structure

```
src/pages/
├── index.tsx           → /
├── about.tsx           → /about
├── users/
│   ├── index.tsx       → /users
│   ├── [id].tsx        → /users/:id (dynamic route)
│   └── profile.tsx     → /users/profile
└── [...all].tsx        → /* (catch-all/404)
```

### Creating Pages

All page components must use **default exports**:

```tsx
// src/pages/about.tsx
const About = () => {
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
};

export default About;
```

### Dynamic Routes

Use square brackets for dynamic segments:

```tsx
// src/pages/users/[id].tsx
const UserDetail = () => {
  const { id } = useParams(); // auto-imported from react-router

  return (
    <div>
      <h1>User ID: {id}</h1>
    </div>
  );
};

export default UserDetail;
```

### Catch-All Routes

Use `[...all].tsx` for 404 pages or catch-all routes:

```tsx
// src/pages/[...all].tsx or NotFound.tsx
const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  );
};

export default NotFound;
```

### Navigation

Use React Router hooks (auto-imported):

```tsx
const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return <button onClick={() => navigate("/about")}>Go to About</button>;
};
```

---

## Server-Side Routing (Backend API)

### File-Based API Routing with Nitro

API routes are automatically generated from files in `routes/`. Powered by [Nitro](https://nitro.unjs.io/) and [H3](https://h3.unjs.io/).

**Documentation**:

- [Nitro Routing](https://nitro.unjs.io/guide/routing)
- [H3 Handlers](https://h3.unjs.io/guide)

### Route Structure

```
routes/
├── api/
│   ├── hello.ts        → GET/POST /api/hello
│   ├── users/
│   │   ├── index.ts    → GET/POST /api/users
│   │   └── [id].ts     → GET/POST /api/users/:id
│   └── auth/
│       ├── login.ts    → POST /api/auth/login
│       └── logout.ts   → POST /api/auth/logout
└── health.ts           → GET /health
```

### Creating API Handlers

Use `defineEventHandler` from H3:

```typescript
// routes/api/hello.ts
export default defineEventHandler((event) => {
  return {
    message: "Hello from API!",
    timestamp: new Date().toISOString(),
  };
});
```

### HTTP Methods

Handle different HTTP methods:

```typescript
// routes/api/users/index.ts
export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    return { users: [] };
  }

  if (method === "POST") {
    const body = await readBody(event);
    return { created: true, user: body };
  }

  return { error: "Method not allowed" };
});
```

Or use method-specific handlers:

```typescript
// routes/api/users/index.get.ts
export default defineEventHandler(() => {
  return { users: [] };
});

// routes/api/users/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return { created: true, user: body };
});
```

### Dynamic Routes

Use square brackets for dynamic parameters:

```typescript
// routes/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  return {
    user: {
      id,
      name: "John Doe",
    },
  };
});
```

### Request Handling

Common H3 utilities:

```typescript
import {
  readBody, // Parse request body
  getQuery, // Get query parameters
  getRouterParam, // Get route parameters
  getCookie, // Get cookies
  setCookie, // Set cookies
  getHeader, // Get headers
  setResponseStatus, // Set response status
  sendRedirect, // Send redirect
} from "h3";

export default defineEventHandler(async (event) => {
  // Get query params: /api/search?q=test
  const query = getQuery(event);
  console.log(query.q); // 'test'

  // Get route params: /api/users/123
  const id = getRouterParam(event, "id");

  // Parse JSON body
  const body = await readBody(event);

  // Get headers
  const auth = getHeader(event, "authorization");

  // Set response status
  setResponseStatus(event, 201);

  return { success: true };
});
```

### Error Handling

```typescript
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  // Your logic here
  return { id };
});
```

### Middleware

Create middleware in `routes/` with `.ts` extension:

```typescript
// routes/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getHeader(event, "authorization");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Add user to context
  event.context.user = { name: "John" };
});
```

---

## Database

SQLite via Bun's built-in [`bun:sqlite`](https://bun.sh/docs/api/sqlite) + [Drizzle ORM](https://orm.drizzle.team/). Requires the Bun runtime — no native module compilation needed.

```
db/
├── schema.ts   # Table definitions
└── client.ts   # Opens the sqlite connection, runs migrations, seeds demo data
drizzle/        # Generated SQL migrations (committed to git)
drizzle.config.ts
```

### Defining tables

```typescript
// db/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});
```

### Querying from a route

```typescript
// routes/api/users/index.get.ts
import { defineHandler } from "nitro/h3";

import { db } from "../../../db/client";
import { users } from "../../../db/schema";

export default defineHandler(() => {
  return { users: db.select().from(users).all() };
});
```

See `routes/api/users/index.get.ts` and `routes/api/users/[id].ts` for the full read examples (list + lookup-by-id with a 404).

### Migrations

After changing `db/schema.ts`, generate a migration and commit the result:

```bash
bun run db:generate   # writes SQL to drizzle/
```

Migrations run automatically — `db/client.ts` applies any pending ones from `drizzle/` the first time it's imported, so there's no separate "run migrations" step for dev or prod.

```bash
bun run db:studio     # browse the db in Drizzle Studio
```

The db file (`sqlite.db`, project root) is gitignored and created on first run; `drizzle/` migrations are committed. Under Vitest, `db/client.ts` uses an in-memory db instead, so tests never touch or share the dev database.

---

## Testing

The project ships with one worked example of each test tier, meant as a
starting point to copy for new code rather than an exhaustive suite.
[AGENTS.md](./AGENTS.md) has the fuller guide for AI coding agents on when to
add each kind and what to run after a change; this section is the quick
reference.

| Tier           | Tool                     | Example file                        | What it's for                                                        |
| -------------- | ------------------------ | ----------------------------------- | -------------------------------------------------------------------- |
| Unit           | Vitest                   | `src/utils/cn.test.ts`              | A pure function in isolation, no DOM/network.                        |
| Integration    | Vitest                   | `routes/api/hello.test.ts`          | Multiple backend units composed (middleware + route handler).        |
| UI / component | Vitest + Testing Library | `src/components/ui/button.test.tsx` | A component rendered in jsdom, interacted with via user-event.       |
| UI / page      | Vitest + Testing Library | `src/pages/index.test.tsx`          | A full page, same tools, exercising a real feature (the mobile nav). |
| E2E / smoke    | Playwright               | `e2e/smoke.spec.ts`                 | Fastest, coarsest check: does the app boot, no console errors?       |
| E2E / UI       | Playwright               | `e2e/home.spec.ts`                  | Real browser: responsive layout, multi-element interaction flows.    |

### Current test inventory

Every test file that exists right now, and what it actually checks. This
list will drift as the app grows — treat the tier table above as the
stable pattern to follow, and this as a snapshot to update when you add or
remove a test file.

**Vitest — `bun run test`** (6 files, 19 tests)

| File                                 | Tier           | Covers                                                                                                                                                  |
| ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/cn.test.ts`               | Unit           | `cn()` classname merging: plain strings, falsy values, object/array syntax, conflicting Tailwind utilities, variant-override pattern.                   |
| `routes/api/hello.test.ts`           | Integration    | `middleware/auth.ts` + `GET /api/hello` composed on one event; and that the route throws if the middleware didn't run first.                            |
| `routes/api/users/index.get.test.ts` | Integration    | `GET /api/users` returns the mock user list.                                                                                                            |
| `routes/api/users/[id].test.ts`      | Integration    | `GET /api/users/:id` returns a matching user; throws a real 404 (`createError`) for an unknown id.                                                      |
| `src/components/ui/button.test.tsx`  | UI / component | `Button`: default/variant/size classes, `onClick` fires, disabled suppresses `onClick`, `asChild` renders as the child element instead of a `<button>`. |
| `src/pages/index.test.tsx`           | UI / page      | Home hero heading + CTA render, tech-stack list renders, mobile nav dialog opens and lists links, dialog closes.                                        |

**Playwright — `bun run test:e2e`** (2 files, 5 tests, + 1 setup file)

| File                  | Tier                | Covers                                                                                                                                                        |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/smoke.spec.ts`   | E2E / smoke         | Home page returns 200, renders an `<h1>`, no console errors; `/api/hello` responds.                                                                           |
| `e2e/home.spec.ts`    | E2E / UI            | Hero content + desktop nav visible; no vertical scrollbar at mobile/tablet/desktop/large sizes; mobile nav dialog opens and closes from the hamburger button. |
| `e2e/global-setup.ts` | (infra, not a test) | Runs once before the suite: warms up Vite's dependency cache with a throwaway navigation so the first real test doesn't race a cold-cache reload.             |

### Running tests

```bash
bun run test          # Vitest: unit + integration + component/page tests, single run
bun run test:watch    # Vitest in watch mode
bun run test:e2e      # Playwright: the full e2e/ suite against a real browser
bun run test:smoke    # Playwright: just e2e/smoke.spec.ts
bun run typecheck     # tsc --build, no emit
bun run verify        # lint + typecheck + test — no browser needed
bun run verify:full   # verify + test:e2e (requires Playwright's Chromium)
```

Playwright's dev server runs on a fixed port (`5178`, see
`playwright.config.ts`) that's deliberately different from the normal dev
port (`5000`), so E2E runs never collide with a dev server you already have
open.

### Adding a new test

- **New utility function** (`src/utils`, `src/helpers`) → unit test,
  colocated as `<name>.test.ts`.
- **New component** (`src/components`) → UI test, colocated as
  `<name>.test.tsx`, using `@testing-library/react` + `@testing-library/user-event`.
- **New API route or middleware** (`routes/`, `middleware/`) → integration
  test, colocated as `<name>.test.ts`. Build a real event with
  `new H3Event(new Request(url), context)` from `nitro/h3` and call the
  handler directly — no server needed. See `routes/api/hello.test.ts`.
- **New page** (`src/pages`) → a page-level UI test following
  `src/pages/index.test.tsx`, plus a Playwright scenario in `e2e/` if the
  behavior specifically needs a real browser (responsive layout, multi-tab,
  etc.) rather than jsdom.
- Keep `e2e/smoke.spec.ts` minimal — it should only ever check that the
  critical path still boots. Put real interaction coverage in
  `e2e/home.spec.ts` or a new `e2e/<page>.spec.ts` file.

Two config details worth knowing if something looks broken:

- `vite.config.ts`'s `Pages()` plugin excludes `**/*.test.tsx` — without
  that, `vite-plugin-pages` treats every `.tsx` under `src/pages/` as a
  route and the build fails on the first test file with no default export.
- `vite.config.ts`'s `nitro()` plugin sets `ignore: ["**/*.test.ts"]` for
  the same reason on the backend: without it, Nitro bundles route test
  files (and Vitest itself) into the production server.

---

## Vite Plugins Guide

### vite-plugin-svgr

Import SVGs as React components by adding `?react` query:

```tsx
import Logo from "@/assets/react.svg?react";

export const App = () => {
  return (
    <div>
      <Logo />
    </div>
  );
};
```

### unplugin-fonts

Configure Google Fonts in `configs/fonts.config.ts`:

```typescript
export const fonts = [
  {
    name: "Inter",
    styles: "wght@300;400;500;600;700",
  },
  {
    name: "Space Grotesk",
    styles: "wght@300;400;500;700",
  },
];
```

[Documentation](https://github.com/cssninjaStudio/unplugin-fonts)

### unplugin-auto-import

Automatically imports React hooks and React Router hooks. No need to import `useState`, `useEffect`, `useNavigate`, etc.

```tsx
// No imports needed!
export function Counter() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
    </div>
  );
}
```

To enable auto-import for shadcn/ui components, uncomment in `vite.config.ts`:

```typescript
AutoImport({
  imports: ["react", "react-router"],
  dirs: ["./src/components/ui"], // Uncomment this line
});
```

---

## Project Structure

```
.
├── src/
│   ├── assets/          # Static assets (images, SVGs)
│   ├── components/      # React components
│   │   └── ui/         # shadcn/ui components (+ *.test.tsx)
│   ├── pages/          # Frontend routes (file-based, + *.test.tsx)
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions (+ *.test.ts)
│   ├── types/          # TypeScript types
│   ├── constants/      # App constants
│   ├── data/           # Static data
│   ├── store/          # State management
│   ├── test/           # Vitest setup (jest-dom matchers, cleanup)
│   └── main.tsx        # App entry point
├── routes/             # Backend API routes (file-based, + *.test.ts)
│   └── api/           # API endpoints
├── middleware/          # Nitro middleware (runs before route handlers)
├── e2e/                 # Playwright specs (smoke.spec.ts, home.spec.ts)
├── configs/            # Configuration files
│   └── fonts.config.ts
├── scripts/             # One-off dev scripts (e.g. ensure-generated-files.mjs)
├── vite.config.ts       # Vite configuration
├── vitest.config.ts     # Vitest configuration
├── playwright.config.ts # Playwright configuration
├── tsconfig.json         # TypeScript config (src)
├── tsconfig.node.json    # TypeScript config (server/config/test files)
├── AGENTS.md             # The operating manual (CLAUDE.md and GEMINI.md symlink to it)
├── ARCHITECTURE.md        # How this is built: stack, routing, data flow, deployment
├── DESIGN.md               # Visual design system: tokens, theming, component pattern
├── PRODUCT.md                # What this boilerplate is, plus a product-brief template
└── package.json
```

---

## Path Aliases

Use `@/` to import from `src/`:

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { User } from "@/types";
```

---

## Deployment

### Docker

```bash
# Build and run with Docker
docker build -t react-ts-starter .
docker run -p 5000:5000 react-ts-starter
```

### VPS Deployment with nginx

For production deployment on a VPS with nginx, PM2, and SSL configuration, see the complete guide:

📖 **[Deployment](./ARCHITECTURE.md#deployment)**

The guide includes:

- nginx configuration for serving static files and proxying API requests
- PM2 or systemd setup for running the Nitro server
- SSL certificate setup with Let's Encrypt
- Monitoring and troubleshooting tips
- Update and maintenance procedures

---

## Notes

- This is a **client-side rendered (CSR)** application
- For SEO or Server-Side Rendering, consider Next.js, Remix, or Astro
- The Nitro backend is perfect for APIs, serverless functions, and edge deployments

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

MIT
