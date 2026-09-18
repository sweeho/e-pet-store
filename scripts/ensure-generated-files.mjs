// `tsc` (unlike Vite/Vitest, which load vite.config.ts and its plugins
// directly) never triggers unplugin-auto-import's dts generation, so on a
// fresh clone `npm run typecheck` fails on the first `useState` it finds
// with no import. Briefly starting and closing a Vite dev server runs the
// same plugin hook that `vite dev`/`vitest` do, which writes
// auto-imports.d.ts, without doing a full bundle.
import { existsSync } from "node:fs";

if (!existsSync(new URL("../auto-imports.d.ts", import.meta.url))) {
  const { createServer } = await import("vite");
  const server = await createServer({ configFile: new URL("../vite.config.ts", import.meta.url).pathname });
  await server.close();
  // Vite's dev server leaves file watchers open even after close(); this
  // script only needs to run the plugin hook that writes the dts file, so
  // exit explicitly instead of hanging.
  process.exit(0);
}
