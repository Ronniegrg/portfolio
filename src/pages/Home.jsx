import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFileAlt, FaArrowRight, FaCode } from "react-icons/fa";
import developerImage from "../assets/software-developer.png";
import styles from "./Home.module.css";
import useGithubBio from "../hooks/useGithubBio";
import { Helmet } from "react-helmet-async";
import StructuredData from "../components/StructuredData";

const Home = () => {
  const heroRef = useRef(null);
  const { githubBio, bioLoading, bioError, githubInfo } = useGithubBio();

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
    <>
      <Helmet>
        <title>Rouni Gorgees | Software Developer Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Rouni Gorgees, a software developer based in Ontario, Canada. Explore projects, skills, and contact information."
        />
        <meta
          property="og:title"
          content="Rouni Gorgees | Software Developer Portfolio"
        />
        <meta
          property="og:description"
          content="Portfolio of Rouni Gorgees, a software developer based in Ontario, Canada. Explore projects, skills, and contact information."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ronniegrg.github.io/" />
        <meta
          property="og:image"
          content="https://ronniegrg.github.io/rg-logo.svg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rouni Gorgees | Software Developer Portfolio"
        />
        <meta
          name="twitter:description"
          content="Portfolio of Rouni Gorgees, a software developer based in Ontario, Canada. Explore projects, skills, and contact information."
        />
        <meta
          name="twitter:image"
          content="https://ronniegrg.github.io/rg-logo.svg"
        />
      </Helmet>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Rouni Gorgees",
          jobTitle: "Software Developer",
          url: "https://ronniegrg.github.io/",
          sameAs: [
            "https://github.com/Ronniegrg",
            "https://www.linkedin.com/in/rouni-gorgees-207b56167/",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ontario",
            addressCountry: "Canada",
          },
        }}
      />
      <div className={styles.home}>
        <section
          className={styles.hero}
          ref={heroRef}
          aria-label="Hero section"
        >
          <div className={styles.container}>
            <div className={styles.content}>
              <h1
                className={`${styles.title} ${styles.animateItem}`}
                style={{ animationDelay: "0.2s" }}
              >
                <span className={styles.greeting}>Hi, I'm</span>
                <span className={styles.name}>Rouni Gorgees</span>
              </h1>
              <p className={styles.tagline} style={{ animationDelay: "0.3s" }}>
                Turning ideas into interactive web experiences.
              </p>
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
                technologies. Specializing in creating beautiful, responsive,
                and user-friendly applications that solve real-world problems.
              </p>

              <div
                className={`${styles.githubActivity} ${styles.animateItem}`}
                style={{ animationDelay: "0.7s" }}
              >
                <strong>Currently working on:</strong>
                <div className={styles.currentlyWorking}>
                  {bioLoading ? (
                    <span>Loading GitHub activity...</span>
                  ) : bioError ? (
                    <span style={{ color: "#e53e3e" }}>{bioError}</span>
                  ) : githubBio ? (
                    <div>
                      <span>{githubBio}</span>
                      {githubInfo.latestRepo && (
                        <a
                          href={`https://github.com/ronniegrg/${githubInfo.latestRepo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repoLink}
                        >
                          <FaCode className={styles.inlineIcon} />{" "}
                          {githubInfo.latestRepo}
                        </a>
                      )}
                    </div>
                  ) : (
                    <span>No current activity on GitHub.</span>
                  )}
                </div>
              </div>

              <div
                className={`${styles.cta} ${styles.animateItem}`}
                style={{ animationDelay: "0.8s" }}
              >
                <Link
                  to="/projects"
                  className={styles.primaryButton}
                  aria-label="View My Work"
                >
                  View My Work <FaArrowRight className={styles.btnIcon} />
                </Link>
                <a
                  href="/portfolio/Rouni-Gorgees.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryButton}
                  aria-label="Resume"
                >
                  <FaFileAlt className={styles.btnIcon} /> Resume
                </a>
              </div>
              <div
                className={`${styles.socialLinks} ${styles.animateItem}`}
                style={{ animationDelay: "1s" }}
              >
                {/* Social links will go here if needed in the future */}
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
    </>
  );
};

export default Home;
