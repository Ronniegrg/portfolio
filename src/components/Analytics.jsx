import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Simple component that logs page views in development mode
 * or sends analytics in production mode
 */
const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Current page details
    const page = {
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    };

    // In development just log to console
    if (import.meta.env.DEV) {
      console.log("Page view:", page);
      return;
    }

    // In production you would send to your analytics service
    // Example implementation:
    try {
      // Log to localStorage for demonstration
      const views = JSON.parse(localStorage.getItem("pageViews") || "[]");
      views.push(page);
      localStorage.setItem("pageViews", JSON.stringify(views.slice(-10))); // Keep last 10 views

      // In a real implementation, you would send data to your analytics service:
      // sendToAnalyticsService(page);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
};

export default Analytics;
