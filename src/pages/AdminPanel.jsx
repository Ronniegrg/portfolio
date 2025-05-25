import { useState, useEffect } from "react";
import SimpleAnalytics from "../components/SimpleAnalytics";
import PerformanceChart from "../components/PerformanceChart";
import CLSChart from "../components/CLSChart";
import usePerformanceMonitoring from "../hooks/usePerformanceMonitoring";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState("pageViews");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  // Get performance metrics using our custom hook
  const performanceMetrics = usePerformanceMonitoring();

  // Get analytics data when component mounts
  useEffect(() => {
    if (isAuthorized) {
      const data = SimpleAnalytics.getData();
      setAnalyticsData(data);
    }
  }, [isAuthorized]);

  // Simple authorization method (this would be much more secure in a real app)
  const handleAuth = (e) => {
    e.preventDefault();
    // Replace with your chosen password
    if (password === "portfolio-admin") {
      setIsAuthorized(true);
    } else {
      alert("Invalid password");
    }
  };

  // Login form if not authorized
  if (!isAuthorized) {
    return (
      <div className={styles.authContainer}>
        <form onSubmit={handleAuth} className={styles.authForm}>
          <h2>Analytics Dashboard</h2>
          <p>Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  // Display loading state
  if (!analyticsData) {
    return <div className={styles.container}>Loading analytics data...</div>;
  }

  const { pageViews, interactions, summary } = analyticsData;

  // Get unique pages and count views
  const pageViewCounts = pageViews.reduce((acc, view) => {
    const path = view.path;
    if (!acc[path]) {
      acc[path] = 0;
    }
    acc[path]++;
    return acc;
  }, {});

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Analytics Dashboard</h1>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <h3>Page Views</h3>
          <p className={styles.summaryValue}>{summary.totalPageViews}</p>
        </div>
        <div className={styles.summaryItem}>
          <h3>Interactions</h3>
          <p className={styles.summaryValue}>{summary.totalInteractions}</p>
        </div>
        <div className={styles.summaryItem}>
          <h3>Unique Pages</h3>
          <p className={styles.summaryValue}>{summary.uniquePaths}</p>
        </div>
      </div>{" "}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "pageViews" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("pageViews")}
        >
          Page Views
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "interactions" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("interactions")}
        >
          Interactions
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "pageCounts" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("pageCounts")}
        >
          Page Counts
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "performance" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
      </div>{" "}
      <div className={styles.dataContainer}>
        {activeTab === "pageViews" && (
          <>
            <h2>Recent Page Views</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Timestamp</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {pageViews
                  .slice()
                  .reverse()
                  .map((view, i) => (
                    <tr key={i}>
                      <td>{view.path}</td>
                      <td>{formatDate(view.timestamp)}</td>
                      <td>{view.referrer}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "interactions" && (
          <>
            <h2>Recent Interactions</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Text</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {interactions
                  .slice()
                  .reverse()
                  .map((interaction, i) => (
                    <tr key={i}>
                      <td>{interaction.type}</td>
                      <td>{interaction.href}</td>
                      <td>{interaction.text}</td>
                      <td>{formatDate(interaction.timestamp)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "pageCounts" && (
          <>
            <h2>Page View Counts</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>View Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pageViewCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([path, count], i) => (
                    <tr key={i}>
                      <td>{path}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "performance" && (
          <>
            <h2>Performance Metrics</h2>
            <div className={styles.chartsContainer}>
              <div className={styles.mainChart}>
                <PerformanceChart metrics={performanceMetrics} />
              </div>
              <div className={styles.clsChart}>
                <CLSChart cls={performanceMetrics.cls} />
              </div>
              <div className={styles.metricsTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>FCP</td>
                      <td>
                        {performanceMetrics.fcp
                          ? `${performanceMetrics.fcp.toFixed(2)} ms`
                          : "N/A"}
                      </td>
                      <td>
                        First Contentful Paint - Time to first content render
                      </td>
                    </tr>
                    <tr>
                      <td>LCP</td>
                      <td>
                        {performanceMetrics.lcp
                          ? `${performanceMetrics.lcp.toFixed(2)} ms`
                          : "N/A"}
                      </td>
                      <td>
                        Largest Contentful Paint - Largest content render time
                      </td>
                    </tr>
                    <tr>
                      <td>TTFB</td>
                      <td>
                        {performanceMetrics.ttfb
                          ? `${performanceMetrics.ttfb.toFixed(2)} ms`
                          : "N/A"}
                      </td>
                      <td>Time to First Byte - Initial server response time</td>
                    </tr>
                    <tr>
                      <td>FID</td>
                      <td>
                        {performanceMetrics.fid
                          ? `${performanceMetrics.fid.toFixed(2)} ms`
                          : "N/A"}
                      </td>
                      <td>
                        First Input Delay - Responsiveness to first interaction
                      </td>
                    </tr>
                    <tr>
                      <td>CLS</td>
                      <td>
                        {performanceMetrics.cls
                          ? performanceMetrics.cls.toFixed(3)
                          : "N/A"}
                      </td>
                      <td>Cumulative Layout Shift - Visual stability score</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.clearButton}
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear all analytics data?"
              )
            ) {
              localStorage.removeItem("rg_analytics");
              localStorage.removeItem("rg_interactions");
              setAnalyticsData({
                pageViews: [],
                interactions: [],
                summary: {
                  totalPageViews: 0,
                  totalInteractions: 0,
                  uniquePaths: 0,
                },
              });
            }
          }}
        >
          Clear Analytics Data
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
