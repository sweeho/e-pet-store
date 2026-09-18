import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

// Mirrors the subset of vite.config.ts needed to run app code under test:
// the React plugin for JSX, the `@` alias, and AutoImport so files that rely
// on it (e.g. `useState` with no import in src/pages) behave the same as in
// dev/build. Nitro, file-based routing, and asset plugins are intentionally
// left out — unit/integration/UI tests don't need a server or a router.
// Uses @vitejs/plugin-react (Babel-based), not the -swc variant, so the
// JSX transform has no platform-specific native binary to resolve.
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: ["react", "react-router"],
      dts: "./auto-imports.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // routes/**/*.test.ts (e.g. routes/api/users/*) import db/client.ts,
    // which imports the Bun builtin bun:sqlite. Vite's jsdom/"client"
    // environment can't externalize a builtin (browsers have no runtime to
    // resolve it against) — only a server-like environment can, so those
    // route tests run as a separate "server" project with environment:
    // "node" instead of the default jsdom.
    projects: [
      {
        extends: true,
        test: {
          name: "client",
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          css: false,
          exclude: ["node_modules", "dist", ".output", "e2e", "routes/**"],
        },
      },
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["routes/**/*.test.ts"],
        },
      },
    ],
  },
});
