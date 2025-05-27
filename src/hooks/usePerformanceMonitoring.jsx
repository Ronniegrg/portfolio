import { useEffect, useState } from "react";

/**
 * Custom hook for monitoring and reporting performance metrics
 * Uses the Web Vitals API to capture key performance indicators
 */
const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fcp: null, // First Contentful Paint
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    ttfb: null, // Time to First Byte
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Check if PerformanceObserver is supported
    if (!("PerformanceObserver" in window)) return;

    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcpEntry = entries[entries.length - 1];
        setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }));
        // FCP metrics captured for monitoring
      }
    });

    try {
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {
      console.warn("FCP monitoring not supported");
    }

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lcpEntry = entries[entries.length - 1];
        setMetrics((prev) => ({ ...prev, lcp: lcpEntry.startTime }));

        // LCP metrics captured for monitoring
      }
    });

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      console.warn("LCP monitoring not supported");
    }

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fidEntry = entries[0];
        setMetrics((prev) => ({
          ...prev,
          fid: fidEntry.processingStart - fidEntry.startTime,
        }));

        // FID metrics captured for monitoring
      }
    });

    try {
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch {
      console.warn("FID monitoring not supported");
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    let clsEntries = [];

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
          setMetrics((prev) => ({ ...prev, cls: clsValue }));

          // CLS metrics captured for monitoring
        }
      }
    });

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      console.warn("CLS monitoring not supported");
    }

    // Track Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0];
      setMetrics((prev) => ({ ...prev, ttfb: navEntry.responseStart }));

      // TTFB metrics captured for monitoring
    }

    // Cleanup observers on unmount
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics;
};

export default usePerformanceMonitoring;
