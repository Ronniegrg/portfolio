import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SimpleAnalytics - A lightweight analytics component that tracks page views
 * without requiring external services or complex setup
 */
const SimpleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    const trackPageView = () => {
      try {
        const pageData = {
          path: location.pathname,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || "direct",
        };

        // Store analytics in localStorage with error handling for tracking prevention
        const analytics = JSON.parse(
          localStorage.getItem("rg_analytics") || "[]"
        );
        analytics.push(pageData);

        // Keep only the last 50 page views to avoid localStorage size issues
        if (analytics.length > 50) {
          analytics.shift();
        }

        localStorage.setItem("rg_analytics", JSON.stringify(analytics));

        // Page view tracked successfully
      } catch {
        // Silent fail if localStorage is blocked by tracking prevention
        // Analytics tracking disabled due to privacy settings
      }
    };

    trackPageView();

    // Additional behavior tracking could be added here
    const trackInteraction = (event) => {
      if (event.target.tagName === "A" && event.target.href) {
        try {
          const clickData = {
            type: "link_click",
            href: event.target.href,
            text: event.target.innerText || "image link",
            timestamp: new Date().toISOString(),
          };

          // Store click data
          const clicks = JSON.parse(
            localStorage.getItem("rg_interactions") || "[]"
          );
          clicks.push(clickData);

          // Keep only recent interactions
          if (clicks.length > 30) {
            clicks.shift();
          }

          localStorage.setItem("rg_interactions", JSON.stringify(clicks));
        } catch {
          // Silent fail if localStorage is blocked by tracking prevention
        }
      }
    };

    // Optional: Add click tracking
    document.addEventListener("click", trackInteraction);

    return () => {
      document.removeEventListener("click", trackInteraction);
    };
  }, [location]);

  return null; // This component doesn't render anything
};

// Add a static method to get analytics data
SimpleAnalytics.getData = () => {
  try {
    const pageViews = JSON.parse(localStorage.getItem("rg_analytics") || "[]");
    const interactions = JSON.parse(
      localStorage.getItem("rg_interactions") || "[]"
    );

    return {
      pageViews,
      interactions,
      summary: {
        totalPageViews: pageViews.length,
        totalInteractions: interactions.length,
        uniquePaths: [...new Set(pageViews.map((view) => view.path))].length,
      },
    };
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return {
      pageViews: [],
      interactions: [],
      summary: { totalPageViews: 0, totalInteractions: 0, uniquePaths: 0 },
    };
  }
};

export default SimpleAnalytics;
