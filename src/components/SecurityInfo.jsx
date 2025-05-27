import { FaShieldAlt, FaLock, FaUserShield, FaEye } from "react-icons/fa";
import styles from "./SecurityInfo.module.css";

const SecurityInfo = ({ compact = false }) => {
  const securityFeatures = [
    {
      icon: <FaShieldAlt />,
      title: "Spam Protection",
      description:
        "Advanced honeypot and rate limiting prevent automated spam.",
    },
    {
      icon: <FaLock />,
      title: "Input Sanitization",
      description:
        "All form inputs are sanitized to prevent malicious content.",
    },
    {
      icon: <FaUserShield />,
      title: "Content Security Policy",
      description:
        "CSP headers protect against XSS and code injection attacks.",
    },
    {
      icon: <FaEye />,
      title: "Privacy Focused",
      description: "No tracking cookies, minimal data collection.",
    },
  ];

  if (compact) {
    return (
      <div className={styles.securityBadge}>
        <FaShieldAlt />
        <span>Secured with spam protection & CSP</span>
      </div>
    );
  }

  return (
    <div className={styles.securityInfo}>
      <h3 className={styles.title}>
        <FaShieldAlt className={styles.titleIcon} />
        Security & Privacy
      </h3>
      <div className={styles.features}>
        {securityFeatures.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <div className={styles.featureContent}>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityInfo;
