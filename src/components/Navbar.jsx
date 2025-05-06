import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${
        styles.slideDown
      }`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.fadeIn} style={{ animationDelay: "0.2s" }}>
            <span className={styles.logoHighlight}>R</span>G
          </span>
        </Link>

        <div className={`${styles.menu} ${isMenuOpen ? styles.open : ""}`}>
          {navLinks.map((link, index) => (
            <div
              key={link.path}
              className={styles.fadeIn}
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <Link
                to={link.path}
                className={`${styles.navLink} ${
                  location.pathname === link.path ? styles.active : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </div>
          ))}

          <div className={styles.fadeIn} style={{ animationDelay: "0.5s" }}>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>

        <button
          className={`${styles.menuButton} ${isMenuOpen ? styles.open : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
