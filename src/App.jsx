import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import Layout from "./components/Layout";
import usePerformanceMonitoring from "./hooks/usePerformanceMonitoring";
import SimpleAnalytics from "./components/SimpleAnalytics";
import "./styles/global.css";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

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
        console.log("Performance metrics:", metrics);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [metrics.fcp, metrics.lcp, metrics.fid, metrics.ttfb]); // Only log when key metrics change

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
      }
    >
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
    </Suspense>
  );
}

export default App;
