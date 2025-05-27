import { useState, useEffect, useMemo } from "react";
import SimpleAnalytics from "../components/SimpleAnalytics";
import PerformanceChart from "../components/PerformanceChart";
import CLSChart from "../components/CLSChart";
import usePerformanceMonitoring from "../hooks/usePerformanceMonitoring";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get performance metrics using our custom hook
  const performanceMetrics = usePerformanceMonitoring();

  // Get analytics data when component mounts
  useEffect(() => {
    if (isAuthorized) {
      setIsLoading(true);
      const data = SimpleAnalytics.getData();
      setAnalyticsData(data);
      setIsLoading(false);
    }
  }, [isAuthorized]);

  // Auto-refresh data every 30 seconds (only if autoRefresh is enabled)
  useEffect(() => {
    if (!isAuthorized || !autoRefresh) return;

    const interval = setInterval(() => {
      const data = SimpleAnalytics.getData();
      setAnalyticsData(data);
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthorized, autoRefresh]);

  // Filtered and sorted data based on date, search, and sort preferences
  const filteredData = useMemo(() => {
    if (!analyticsData) return null;

    const now = new Date();
    const filterDate = (items) => {
      if (dateFilter === "all") return items;

      const cutoffDate = new Date();
      switch (dateFilter) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          return items;
      }

      return items.filter((item) => new Date(item.timestamp) >= cutoffDate);
    };

    const filterSearch = (items, searchField) => {
      if (!searchTerm) return items;
      return items.filter((item) =>
        item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    const sortItems = (items) => {
      return items.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "timestamp") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    };

    const filteredPageViews = sortItems(
      filterSearch(filterDate(analyticsData.pageViews), "path")
    );
    const filteredInteractions = sortItems(
      filterSearch(filterDate(analyticsData.interactions), "type")
    );

    return {
      ...analyticsData,
      pageViews: filteredPageViews,
      interactions: filteredInteractions,
    };
  }, [analyticsData, dateFilter, searchTerm, sortBy, sortOrder]);

  // Enhanced analytics calculations
  const enhancedSummary = useMemo(() => {
    if (!filteredData) return null;

    const { pageViews, interactions } = filteredData;

    // Calculate page view counts
    const pageViewCounts = pageViews.reduce((acc, view) => {
      acc[view.path] = (acc[view.path] || 0) + 1;
      return acc;
    }, {});

    // Calculate bounce rate (single page sessions)
    const sessions = new Map();
    pageViews.forEach((view) => {
      const sessionKey = view.sessionId || view.timestamp; // fallback if no sessionId
      if (!sessions.has(sessionKey)) {
        sessions.set(sessionKey, []);
      }
      sessions.get(sessionKey).push(view);
    });

    const bounceRate =
      (Array.from(sessions.values()).filter((session) => session.length === 1)
        .length /
        sessions.size) *
      100;

    // Top pages
    const topPages = Object.entries(pageViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Interaction types
    const interactionTypes = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});

    // Traffic sources
    const trafficSources = pageViews.reduce((acc, view) => {
      const source = view.referrer || "Direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPageViews: pageViews.length,
      totalInteractions: interactions.length,
      uniquePaths: Object.keys(pageViewCounts).length,
      bounceRate: isNaN(bounceRate) ? 0 : bounceRate,
      topPages,
      interactionTypes,
      trafficSources,
      sessionsCount: sessions.size,
    };
  }, [filteredData]);

  // Export data functionality
  const exportData = (format = "json") => {
    if (!analyticsData) return;

    const dataToExport = {
      ...analyticsData,
      exportDate: new Date().toISOString(),
      summary: enhancedSummary,
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv") {
      const csvData = [
        ["Path", "Timestamp", "Referrer"],
        ...analyticsData.pageViews.map((view) => [
          view.path,
          view.timestamp,
          view.referrer || "",
        ]),
      ];

      const csvContent = csvData
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Login form if not authorized
  if (!isAuthorized) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <div className={styles.authHeader}>
            <div className={styles.authIcon}>📊</div>
            <h2>Analytics Dashboard</h2>
            <p>Enter admin password to access the dashboard</p>
          </div>
          <form onSubmit={handleAuth}>
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
      </div>
    );
  }

  // Display loading state
  if (isLoading || !analyticsData || !enhancedSummary) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.heading}>
            <span className={styles.headingIcon}>📊</span>
            Analytics Dashboard
          </h1>
          <div className={styles.headerActions}>
            <div className={styles.autoRefreshToggle}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className={styles.checkbox}
                />
                Auto-refresh
              </label>
            </div>
            <button
              className={styles.refreshButton}
              onClick={() => {
                const data = SimpleAnalytics.getData();
                setAnalyticsData(data);
                setLastRefresh(new Date());
              }}
            >
              🔄 Refresh
            </button>
            <div className={styles.exportDropdown}>
              <button className={styles.exportButton}>📥 Export</button>
              <div className={styles.exportMenu}>
                <button onClick={() => exportData("json")}>JSON</button>
                <button onClick={() => exportData("csv")}>CSV</button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Time Period:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="timestamp">Time</option>
              <option value="path">Path</option>
              <option value="type">Type</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.select}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search pages, interactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>👁️</div>
          <div className={styles.cardContent}>
            <h3>Page Views</h3>
            <p className={styles.cardValue}>
              {enhancedSummary.totalPageViews.toLocaleString()}
            </p>
            <span className={styles.cardSubtext}>Total visits</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🎯</div>
          <div className={styles.cardContent}>
            <h3>Interactions</h3>
            <p className={styles.cardValue}>
              {enhancedSummary.totalInteractions.toLocaleString()}
            </p>
            <span className={styles.cardSubtext}>User actions</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>📄</div>
          <div className={styles.cardContent}>
            <h3>Unique Pages</h3>
            <p className={styles.cardValue}>{enhancedSummary.uniquePaths}</p>
            <span className={styles.cardSubtext}>Different paths</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>⚡</div>
          <div className={styles.cardContent}>
            <h3>Bounce Rate</h3>
            <p className={styles.cardValue}>
              {enhancedSummary.bounceRate.toFixed(1)}%
            </p>
            <span className={styles.cardSubtext}>Single page visits</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {[
            { key: "overview", label: "Overview", icon: "📈" },
            { key: "pageViews", label: "Page Views", icon: "👁️" },
            { key: "interactions", label: "Interactions", icon: "🎯" },
            { key: "performance", label: "Performance", icon: "⚡" },
            { key: "traffic", label: "Traffic Sources", icon: "🌐" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${
                activeTab === tab.key ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === "overview" && (
          <div className={styles.overviewGrid}>
            {/* Real-time Stats */}
            <div className={styles.overviewCard}>
              <h3>📊 Real-time Statistics</h3>
              <div className={styles.realtimeStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Active Sessions</span>
                  <span className={styles.statValue}>
                    {enhancedSummary.sessionsCount}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Avg. Pages/Session</span>
                  <span className={styles.statValue}>
                    {enhancedSummary.sessionsCount > 0
                      ? (
                          enhancedSummary.totalPageViews /
                          enhancedSummary.sessionsCount
                        ).toFixed(1)
                      : "0"}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Auto-refresh</span>
                  <span
                    className={`${styles.statValue} ${
                      autoRefresh ? styles.active : styles.inactive
                    }`}
                  >
                    {autoRefresh ? "🟢 On" : "🔴 Off"}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className={styles.overviewCard}>
              <h3>🏆 Top Pages</h3>
              <div className={styles.topPagesList}>
                {enhancedSummary.topPages.length > 0 ? (
                  enhancedSummary.topPages.map(([path, count], index) => (
                    <div key={path} className={styles.topPageItem}>
                      <span className={styles.pageRank}>#{index + 1}</span>
                      <span className={styles.pagePath}>{path}</span>
                      <span className={styles.pageCount}>{count} views</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>
                    No page views recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Types */}
            <div className={styles.overviewCard}>
              <h3>🎯 Interaction Types</h3>
              <div className={styles.interactionTypes}>
                {Object.entries(enhancedSummary.interactionTypes).length > 0 ? (
                  Object.entries(enhancedSummary.interactionTypes).map(
                    ([type, count]) => (
                      <div key={type} className={styles.interactionItem}>
                        <span className={styles.interactionType}>{type}</span>
                        <span className={styles.interactionCount}>{count}</span>
                      </div>
                    )
                  )
                ) : (
                  <div className={styles.noData}>
                    No interactions recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Performance Overview */}
            <div className={styles.overviewCard}>
              <h3>⚡ Performance Overview</h3>
              <div className={styles.performanceOverview}>
                <div className={styles.metricItem}>
                  <span>LCP</span>
                  <span>
                    {performanceMetrics.lcp
                      ? `${performanceMetrics.lcp.toFixed(0)}ms`
                      : "N/A"}
                  </span>
                </div>
                <div className={styles.metricItem}>
                  <span>FCP</span>
                  <span>
                    {performanceMetrics.fcp
                      ? `${performanceMetrics.fcp.toFixed(0)}ms`
                      : "N/A"}
                  </span>
                </div>
                <div className={styles.metricItem}>
                  <span>CLS</span>
                  <span>
                    {performanceMetrics.cls
                      ? performanceMetrics.cls.toFixed(3)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className={styles.overviewCard}>
              <h3>🌐 Traffic Sources Overview</h3>
              <div className={styles.trafficSourcesPreview}>
                {Object.entries(enhancedSummary.trafficSources).length > 0 ? (
                  Object.entries(enhancedSummary.trafficSources)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([source, count]) => (
                      <div key={source} className={styles.sourcePreviewItem}>
                        <span className={styles.sourceName}>{source}</span>
                        <span className={styles.sourceCount}>{count}</span>
                      </div>
                    ))
                ) : (
                  <div className={styles.noData}>
                    No traffic sources recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.overviewCard}>
              <h3>🕐 Recent Activity</h3>
              <div className={styles.recentActivity}>
                {filteredData.pageViews.length > 0 ? (
                  filteredData.pageViews
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((view, index) => (
                      <div key={index} className={styles.activityItem}>
                        <span className={styles.activityPath}>{view.path}</span>
                        <span className={styles.activityTime}>
                          {formatRelativeTime(view.timestamp)}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className={styles.noData}>No recent activity</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pageViews" && (
          <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <h2>📄 Recent Page Views</h2>
              <span className={styles.resultCount}>
                {filteredData.pageViews.length} results
              </span>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Path</th>
                    <th>Time</th>
                    <th>Referrer</th>
                    <th>Relative</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.pageViews
                    .slice()
                    .reverse()
                    .slice(0, 100) // Limit to 100 recent entries
                    .map((view, i) => (
                      <tr key={i}>
                        <td className={styles.pathCell}>{view.path}</td>
                        <td className={styles.timeCell}>
                          {formatDate(view.timestamp)}
                        </td>
                        <td className={styles.referrerCell}>
                          {view.referrer || "Direct"}
                        </td>
                        <td className={styles.relativeTimeCell}>
                          {formatRelativeTime(view.timestamp)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "interactions" && (
          <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <h2>🎯 Recent Interactions</h2>
              <span className={styles.resultCount}>
                {filteredData.interactions.length} results
              </span>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Target</th>
                    <th>Text</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.interactions
                    .slice()
                    .reverse()
                    .slice(0, 100) // Limit to 100 recent entries
                    .map((interaction, i) => (
                      <tr key={i}>
                        <td className={styles.typeCell}>
                          <span className={styles.interactionBadge}>
                            {interaction.type}
                          </span>
                        </td>
                        <td className={styles.targetCell}>
                          {interaction.href}
                        </td>
                        <td className={styles.textCell}>{interaction.text}</td>
                        <td className={styles.timeCell}>
                          {formatRelativeTime(interaction.timestamp)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className={styles.performanceSection}>
            <h2>⚡ Performance Metrics</h2>
            <div className={styles.chartsContainer}>
              <div className={styles.mainChart}>
                <PerformanceChart metrics={performanceMetrics} />
              </div>
              <div className={styles.clsChart}>
                <CLSChart cls={performanceMetrics.cls} />
              </div>
              <div className={styles.performanceTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "FCP",
                        value: performanceMetrics.fcp,
                        unit: "ms",
                        description: "First Contentful Paint",
                        thresholds: { good: 1800, needs: 3000 },
                      },
                      {
                        name: "LCP",
                        value: performanceMetrics.lcp,
                        unit: "ms",
                        description: "Largest Contentful Paint",
                        thresholds: { good: 2500, needs: 4000 },
                      },
                      {
                        name: "TTFB",
                        value: performanceMetrics.ttfb,
                        unit: "ms",
                        description: "Time to First Byte",
                        thresholds: { good: 800, needs: 1800 },
                      },
                      {
                        name: "FID",
                        value: performanceMetrics.fid,
                        unit: "ms",
                        description: "First Input Delay",
                        thresholds: { good: 100, needs: 300 },
                      },
                      {
                        name: "CLS",
                        value: performanceMetrics.cls,
                        unit: "",
                        description: "Cumulative Layout Shift",
                        thresholds: { good: 0.1, needs: 0.25 },
                      },
                    ].map((metric) => {
                      const value = metric.value;
                      let status = "unknown";
                      if (value !== null && value !== undefined) {
                        if (value <= metric.thresholds.good) status = "good";
                        else if (value <= metric.thresholds.needs)
                          status = "needs-improvement";
                        else status = "poor";
                      }

                      return (
                        <tr key={metric.name}>
                          <td className={styles.metricName}>{metric.name}</td>
                          <td className={styles.metricValue}>
                            {value
                              ? `${value.toFixed(
                                  metric.name === "CLS" ? 3 : 2
                                )}${metric.unit}`
                              : "N/A"}
                          </td>
                          <td className={styles.metricStatus}>
                            <span
                              className={`${styles.statusBadge} ${styles[status]}`}
                            >
                              {status === "good"
                                ? "✅ Good"
                                : status === "needs-improvement"
                                ? "⚠️ Needs Work"
                                : status === "poor"
                                ? "❌ Poor"
                                : "❓ Unknown"}
                            </span>
                          </td>
                          <td className={styles.metricDescription}>
                            {metric.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "traffic" && (
          <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <h2>🌐 Traffic Sources</h2>
            </div>
            <div className={styles.trafficSources}>
              {Object.entries(enhancedSummary.trafficSources)
                .sort((a, b) => b[1] - a[1])
                .map(([source, count]) => (
                  <div key={source} className={styles.trafficSourceItem}>
                    <div className={styles.sourceInfo}>
                      <span className={styles.sourceName}>{source}</span>
                      <span className={styles.sourceCount}>{count} visits</span>
                    </div>
                    <div className={styles.sourceBar}>
                      <div
                        className={styles.sourceBarFill}
                        style={{
                          width: `${
                            (count /
                              Math.max(
                                ...Object.values(enhancedSummary.trafficSources)
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className={styles.footerActions}>
        <div className={styles.footerInfo}>
          <div className={styles.lastUpdated}>
            Last updated: {lastRefresh.toLocaleString()}
          </div>
          <div className={styles.dataStats}>
            Showing {filteredData.pageViews.length} page views •{" "}
            {filteredData.interactions.length} interactions
          </div>
        </div>
        <div className={styles.footerButtons}>
          <button
            className={styles.clearButton}
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear all analytics data? This action cannot be undone."
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
                setLastRefresh(new Date());
              }
            }}
          >
            🗑️ Clear All Data
          </button>
          <button
            className={styles.logoutButton}
            onClick={() => {
              setIsAuthorized(false);
              setPassword("");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
