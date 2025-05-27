import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "var(--background-color, #f8f9fa)",
            color: "var(--text-color, #333)",
            borderRadius: "8px",
            margin: "1rem",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#dc3545" }}>
            Something went wrong
          </h2>
          <p style={{ marginBottom: "1.5rem", maxWidth: "500px" }}>
            We're sorry, but there was an error loading this page. This might be
            due to a network issue or an outdated cached version.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                // Clear cache and reload
                if ("caches" in window) {
                  caches
                    .keys()
                    .then((names) => {
                      names.forEach((name) => caches.delete(name));
                    })
                    .then(() => window.location.reload());
                } else {
                  window.location.reload();
                }
              }}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Clear Cache & Reload
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: "2rem", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", marginBottom: "1rem" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  overflow: "auto",
                  maxWidth: "100%",
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
