import React from "react";
import GitHubCalendar from "react-github-calendar";
import styles from "./GitHubContributions.module.css";

const GitHubContributions = ({ username = "Ronniegrg" }) => {
  return (
    <div className={styles.ghchartWrapper}>
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>
        GitHub Contribution Activity
      </h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GitHubCalendar username={username} />
      </div>
      <p style={{ textAlign: "center", marginTop: 12, color: "#aaa" }}>
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
