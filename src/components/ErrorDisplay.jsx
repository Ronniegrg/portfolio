import { FaGithub, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import styles from "./ErrorDisplay.module.css";

/**
 * Component for displaying API errors with retry functionality
 */
const ErrorDisplay = ({ error, retry, isGithub = false }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        {isGithub ? (
          <FaGithub size={24} />
        ) : (
          <FaExclamationTriangle size={24} />
        )}
      </div>
      <div className={styles.errorContent}>
        <h3>Oops! Something went wrong</h3>
        <p>{error?.message || "Failed to load data. Please try again."}</p>
        {retry && (
          <button
            className={styles.retryButton}
            onClick={retry}
            aria-label="Retry loading data"
          >
            <FaRedo /> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
