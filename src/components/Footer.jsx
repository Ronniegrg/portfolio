import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, url: "https://github.com/Ronniegrg", label: "GitHub" },
    {
      icon: FaLinkedin,
      url: "https://www.linkedin.com/in/rouni-gorgees-207b56167/",
      label: "LinkedIn",
    },
    { icon: FaEnvelope, url: "mailto:rounigorgees@gmail.com", label: "Email" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <h2 className={styles.brandName}>
              <span className={styles.highlight}>R</span>G
            </h2>
            <p className={styles.tagline}>
              Building digital experiences that matter
            </p>
          </div>

          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.label}
              >
                <link.icon />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} Rouni Gorgees. All rights reserved.
          </p>
          <p className={styles.credit}>
            Designed & Built with <span className={styles.heart}>❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
