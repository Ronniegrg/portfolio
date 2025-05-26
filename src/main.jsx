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
  window.addEventListener("load", () => {
    const swPath = "/portfolio/service-worker.js";

    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log("Service worker registered: ", registration);
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
