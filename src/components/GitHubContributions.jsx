import React, { useState } from "react";
import GitHubCalendar from "react-github-calendar";
import styles from "./GitHubContributions.module.css";

const GitHubContributions = ({ username = "Ronniegrg" }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    console.warn("GitHub Contributions: API error, hiding calendar");
  };

  return (
    <div className={styles.ghchartWrapper}>
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>
        GitHub Contribution Activity
      </h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {!hasError ? (
          <GitHubCalendar
            username={username}
            errorMessage=""
            onError={handleError}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          >
            <p>GitHub contribution data temporarily unavailable</p>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Visit my GitHub profile to see full activity
            </p>
          </div>
        )}
      </div>
      <p style={{ textAlign: "center", marginTop: 12, color: "#fff" }}>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View full contribution history on GitHub
        </a>
      </p>
    </div>
  );
};

export default GitHubContributions;
