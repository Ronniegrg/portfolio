import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import Layout from "./components/Layout";
import usePerformanceMonitoring from "./hooks/usePerformanceMonitoring";
import "./styles/global.css";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  // Monitor performance metrics
  const metrics = usePerformanceMonitoring();

  // Log metrics when they change (in development only)
  useEffect(() => {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log("Performance metrics:", metrics);
    }
  }, [metrics]);

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
      }
    >
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
