import { useState, useEffect } from "react";
import styles from "./OptimizedImage.module.css";

/**
 * OptimizedImage component for better image loading performance
 * - Lazy loads images
 * - Shows a placeholder while loading
 * - Handles loading errors gracefully
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  blur = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset states when source changes
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  // Loading attribute to use browser's native lazy loading
  const loadingAttr = priority ? "eager" : "lazy";

  return (
    <div
      className={`${styles.imageContainer} ${className || ""}`}
      style={{ width, height }}
    >
      {!isLoaded && !isError && (
        <div className={`${styles.placeholder} ${blur ? styles.blur : ""}`} />
      )}

      {isError && (
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>Image failed to load</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loadingAttr}
        className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
