import React, { useState, useEffect } from "react";
import styles from "./ServiceWorkerStatus.module.css";

const ServiceWorkerStatus = () => {
  const [swStatus, setSwStatus] = useState({
    registered: false,
    storageAvailable: null,
    showStatus: false,
  });

  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.ready.then(async (registration) => {
        setSwStatus((prev) => ({ ...prev, registered: true }));

        // Check storage availability by messaging the service worker
        try {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            setSwStatus((prev) => ({
              ...prev,
              storageAvailable: event.data.storageAvailable,
              showStatus: !event.data.storageAvailable, // Only show if storage is not available
            }));
          };

          registration.active?.postMessage({ type: "CHECK_STORAGE" }, [
            messageChannel.port2,
          ]);
        } catch (error) {
          console.warn("Could not check service worker storage status:", error);
        }
      });
    }
  }, []);

  if (!swStatus.showStatus || !swStatus.registered) {
    return null;
  }

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusContent}>
        <span className={styles.statusIcon}>⚠️</span>
        <span className={styles.statusText}>
          Running in offline mode with limited caching due to browser tracking
          prevention
        </span>
        <button
          className={styles.dismissButton}
          onClick={() =>
            setSwStatus((prev) => ({ ...prev, showStatus: false }))
          }
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ServiceWorkerStatus;
