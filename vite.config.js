import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  // Fix source map error
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  server: {
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith(".webmanifest")) {
          res.setHeader("Content-Type", "application/manifest+json");
        }
        next();
      });
    },
  },
});
