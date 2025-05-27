import { useState } from "react";
import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";
import styles from "./PrivacyMap.module.css";

/**
 * Privacy-focused map component that doesn't embed external maps
 * Provides links to external map services instead of embedding them
 */
const PrivacyMap = ({
  location = "Windsor, Ontario, Canada",
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Encode location for URLs
  const encodedLocation = encodeURIComponent(location);

  const mapServices = [
    {
      name: "OpenStreetMap",
      url: `https://www.openstreetmap.org/search?query=${encodedLocation}`,
      description: "Open source mapping platform",
      icon: "🗺️",
    },
    {
      name: "Google Maps",
      url: `https://maps.google.com/maps?q=${encodedLocation}`,
      description: "Popular mapping service",
      icon: "📍",
    },
    {
      name: "Apple Maps",
      url: `https://maps.apple.com/?q=${encodedLocation}`,
      description: "Apple's mapping service",
      icon: "🍎",
    },
  ];

  return (
    <div
      className={`${styles.privacyMap} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.mapHeader}>
        <div className={styles.locationIcon}>
          <FaMapMarkerAlt />
        </div>
        <div className={styles.locationInfo}>
          <h3 className={styles.locationTitle}>{location}</h3>
          <p className={styles.locationSubtitle}>
            View on external mapping service
          </p>
        </div>
      </div>

      <div className={styles.mapServices}>
        {mapServices.map((service, index) => (
          <a
            key={index}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.mapService} ${
              isHovered ? styles.animated : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.serviceIcon}>{service.icon}</div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceName}>{service.name}</span>
              <span className={styles.serviceDescription}>
                {service.description}
              </span>
            </div>
            <FaExternalLinkAlt className={styles.externalIcon} />
          </a>
        ))}
      </div>

      <div className={styles.privacyNote}>
        <p>
          🔒 Privacy-friendly: No external maps are embedded to protect your
          data. Click above to open your preferred mapping service.
        </p>
      </div>
    </div>
  );
};

export default PrivacyMap;
