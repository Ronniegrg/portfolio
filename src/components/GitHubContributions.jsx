import React from "react";
import styles from "./GitHubContributions.module.css";

const GitHubContributions = ({ username = "Ronniegrg" }) => {
  return (
    <div className={styles.ghchartWrapper}>
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>
        GitHub Contribution Activity
      </h3>
      <img
        src={`https://ghchart.rshah.org/${username}`}
        alt={`${username}'s GitHub contribution graph`}
        style={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          display: "block",
          background: "#222",
          borderRadius: 8,
          padding: 16,
        }}
      />
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
