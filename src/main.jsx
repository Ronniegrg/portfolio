import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/global.css";
import "./styles/pdf.css";
import { HelmetProvider } from "react-helmet-async";
import AccessibilityManager from "./components/AccessibilityManager";

// Register service worker for PWA capabilities (only in production)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    let storageAccessGranted = false;

    // Try to request storage access before registering service worker
    try {
      if ("storage" in navigator && "requestStorageAccess" in document) {
        await document.requestStorageAccess();
        storageAccessGranted = true;
        console.log("Storage access granted for service worker");
      }
    } catch (error) {
      console.warn(
        "Storage access request failed (tracking prevention may be active):",
        error.message
      );
      // Continue with service worker registration even if storage access fails
    }

    const swPath = "/portfolio/service-worker.js";

    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log("Service worker registered successfully");

        if (!storageAccessGranted) {
          console.log(
            "Service worker running in fallback mode (no caching) due to tracking prevention"
          );
        }

        if (import.meta.env.DEV) {
          console.log("Service worker registration: ", registration);
        }
      })
      .catch((error) => {
        console.error("Service worker registration failed: ", error);
      });
  });
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <HelmetProvider>
        <ThemeProvider>
          <AccessibilityManager />
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </HashRouter>
  </React.StrictMode>
);
