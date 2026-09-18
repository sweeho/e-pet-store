import { nitro } from "nitro/vite";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import Fonts from "unplugin-fonts/vite";
import Inspect from "vite-plugin-inspect";
import Pages from "vite-plugin-pages";
import svgr from "vite-plugin-svgr";

import { fonts } from "./configs/fonts.config";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
  },

  plugins: [
    // serverDir: "./" makes Nitro scan routes/, api/, and middleware/ at the
    // project root (its default is `false`, i.e. no directory scanning at
    // all, which otherwise silently drops every file in routes/ and
    // middleware/ from the server build). `ignore` keeps *.test.ts files
    // (see routes/api/hello.test.ts) out of the scan, or they'd get bundled
    // into the production server as if they were route handlers.
    nitro({ serverDir: "./", ignore: ["**/*.test.ts"] }),
    react(),
    Pages({
      dirs: "src/pages",
      extensions: ["tsx", "jsx"],
      exclude: ["**/*.test.tsx", "**/*.test.ts"],
      importMode: "sync",
    }),
    svgr(),

    Inspect(),
    // ViteImagemin() - commented out due to type issues, uncomment if needed
    tailwindcss(),
    Fonts({ google: { families: fonts } }),
    AutoImport({
      imports: ["react", "react-router"],
      dts: "./auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        // filepath: "./eslint.config.js",
      },
      viteOptimizeDeps: true,

      // uncomment if you want to auto import ui components
      // dirs: ['./src/components/ui'],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
