import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/portfolio/",
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
          dest: "",
          rename: "pdf.worker.min.js",
        },
      ],
    }),
  ],
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
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
    // Add chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Force fresh builds and prevent cache issues
    emptyOutDir: true,
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
        // Security Headers
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
          "Permissions-Policy",
          "geolocation=(), microphone=(), camera=()"
        );

        // Content Security Policy
        const csp = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emailjs.com https://www.gstatic.com https://www.google.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://api.emailjs.com https://api.github.com",
          "frame-src 'self' https://www.google.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ");

        res.setHeader("Content-Security-Policy", csp);

        if (req.url && req.url.endsWith(".webmanifest")) {
          res.setHeader("Content-Type", "application/manifest+json");
        }
        next();
      });
    },
  },
});
