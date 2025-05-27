import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import usePerformanceMonitoring from "./hooks/usePerformanceMonitoring";
import SimpleAnalytics from "./components/SimpleAnalytics";
import "./styles/global.css";

// Create lazy imports with enhanced retry logic for better error handling
const createLazyComponent = (importFunc, componentName) => {
  return lazy(async () => {
    let retries = 3;
    let delay = 1000;

    const attemptLoad = async (attempt) => {
      try {
        return await importFunc();
      } catch (error) {
        console.error(
          `Error loading ${componentName} (attempt ${attempt}):`,
          error
        );

        // If it's a 404 error on a chunk, it might be a stale cache issue
        if (
          error.message.includes(
            "Failed to fetch dynamically imported module"
          ) ||
          error.message.includes("ChunkLoadError") ||
          error.message.includes("Loading chunk")
        ) {
          console.warn(
            `Chunk loading failed for ${componentName}. This might be due to a deployment update.`
          );

          // Clear service worker cache
          if ("caches" in window) {
            try {
              const cacheNames = await caches.keys();
              await Promise.all(cacheNames.map((name) => caches.delete(name)));
            } catch (cacheError) {
              console.warn("Failed to clear cache:", cacheError);
            }
          }

          // For the last attempt, try to reload the page to get fresh chunks
          if (attempt === retries) {
            const currentUrl = window.location.href;
            const separator = currentUrl.includes("?") ? "&" : "?";
            window.location.href =
              currentUrl + separator + "_reload=" + Date.now();
            return;
          }
        }

        if (attempt < retries) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              attemptLoad(attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay * attempt); // Exponential backoff
          });
        } else {
          // Return a fallback component on final failure
          console.error(
            `Failed to load ${componentName} after ${retries} attempts`
          );
          return {
            default: () => (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  backgroundColor: "var(--color-error-bg, #fee)",
                  border: "1px solid var(--color-error, #d00)",
                  borderRadius: "8px",
                  margin: "1rem",
                }}
              >
                <h2>Failed to Load Component</h2>
                <p>There was an error loading the {componentName} component.</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "var(--color-primary, #007bff)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reload Page
                </button>
              </div>
            ),
          };
        }
      }
    };

    return attemptLoad(1);
  });
};

const Home = createLazyComponent(() => import("./pages/Home"), "Home");
const About = createLazyComponent(() => import("./pages/About"), "About");
const Projects = createLazyComponent(
  () => import("./pages/Projects"),
  "Projects"
);
const Contact = createLazyComponent(() => import("./pages/Contact"), "Contact");
const NotFound = createLazyComponent(
  () => import("./pages/NotFound"),
  "NotFound"
);
const AdminPanel = createLazyComponent(
  () => import("./pages/AdminPanel"),
  "AdminPanel"
);

function App() {
  // Monitor performance metrics
  const metrics = usePerformanceMonitoring();

  // Log metrics when they change (in development only) - throttled to avoid spam
  useEffect(() => {
    // Check if we're in development mode and metrics have meaningful data
    if (
      import.meta.env.DEV &&
      (metrics.fcp || metrics.lcp || metrics.fid || metrics.ttfb)
    ) {
      // Only log every few seconds to avoid spam
      const timeoutId = setTimeout(() => {
        // Performance metrics would be logged here in development
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [metrics]); // Include the full metrics object

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading...</p>
          <style jsx="true">{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      }
    >
      <ErrorBoundary>
        {/* Add analytics tracking */}
        <SimpleAnalytics />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/projects"
            element={
              <Layout>
                <Projects />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminPanel />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
