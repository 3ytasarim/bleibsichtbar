import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const rawPort = process.env.PORT;
if (isDev && !rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}
const port = rawPort ? Number(rawPort) : 3000;
if (isDev && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;
if (isDev && !basePath) {
  throw new Error("BASE_PATH environment variable is required but was not provided.");
}

const useDevTools = isDev && process.env.REPL_ID !== undefined;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...(useDevTools
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
            m.default()
          ),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "assets/app-core-[hash].js",
        chunkFileNames: (chunk) => {
          const name = chunk.name;
          if (name === "vendor") return "assets/vendor-libs-[hash].js";
          if (name === "motion") return "assets/ui-motion-[hash].js";
          if (name === "admin") return "assets/admin-panel-[hash].js";
          return `assets/${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-[hash].js`;
        },
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? asset.name ?? "";
          if (name.endsWith(".css")) return "assets/global-theme-[hash].css";
          if (/\.(png|jpe?g|webp|svg|gif|ico)$/i.test(name)) return "assets/media/[name][extname]";
          if (/\.(woff2?|ttf|eot|otf)$/i.test(name)) return "assets/fonts/[name][extname]";
          return "assets/[name][extname]";
        },
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) return "vendor";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("/pages/admin/")) return "admin";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (id.includes("node_modules/@radix-ui")) return "radix";
        },
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
