import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming to help with cache invalidation
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          pdf: ["react-pdf", "pdfjs-dist"],
          icons: ["react-icons"],
        },
        // Add cache busting for chunks with more predictable naming
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      // Add error handling for chunk loading
      onwarn(warning, warn) {
        // Suppress certain warnings that don't affect functionality
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
    // Add chunk size warnings
    chunkSizeWarningLimit: 1000,
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
