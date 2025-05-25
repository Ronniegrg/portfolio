import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/global.css";
import "./styles/pdf.css";
import { HelmetProvider } from "react-helmet-async";
import AccessibilityManager from "./components/AccessibilityManager";

// Register service worker for PWA capabilities
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Get the correct path based on the deployment environment
    const swPath = window.location.hostname === 'localhost' 
      ? '/service-worker.js'
      : '/portfolio/service-worker.js';
      
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log("Service worker registered: ", registration);
      })
      .catch((error) => {
        console.log("Service worker registration failed: ", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

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
