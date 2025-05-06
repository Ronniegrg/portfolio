import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaFileAlt, FaArrowRight } from "react-icons/fa";
import developerImage from "../assets/software-developer.png";
import styles from "./Home.module.css";

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.home}>
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1
              className={`${styles.title} ${styles.animateItem}`}
              style={{ animationDelay: "0.2s" }}
            >
              <span className={styles.greeting}>Hi, I'm</span>
              <span className={styles.name}>Rouni Gorgees</span>
            </h1>

            <h2
              className={`${styles.subtitle} ${styles.animateItem}`}
              style={{ animationDelay: "0.4s" }}
            >
              <span className={styles.role}>Software Developer</span>
              <span className={styles.based}>Based in Ontario, Canada</span>
            </h2>

            <p
              className={`${styles.description} ${styles.animateItem}`}
              style={{ animationDelay: "0.6s" }}
            >
              I build exceptional digital experiences with modern web
              technologies. Specializing in creating beautiful, responsive, and
              user-friendly applications that solve real-world problems.
            </p>

            <div
              className={`${styles.cta} ${styles.animateItem}`}
              style={{ animationDelay: "0.8s" }}
            >
              <Link to="/projects" className={styles.primaryButton}>
                View My Work <FaArrowRight className={styles.btnIcon} />
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                <FaFileAlt className={styles.btnIcon} /> Resume
              </a>
            </div>

            <div
              className={`${styles.socialLinks} ${styles.animateItem}`}
              style={{ animationDelay: "1s" }}
            >
              {/* Removed GitHub and LinkedIn social links as requested */}
            </div>
          </div>

          <div
            className={`${styles.heroImage} ${styles.animateItem}`}
            style={{ animationDelay: "0.4s" }}
          >
            <img
              src={developerImage}
              alt="Rouni Gorgees - Software Developer"
              className={styles.developerImage}
            />

            <div className={styles.blob}></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
