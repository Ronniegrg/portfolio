import { useState, useEffect, useRef } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCodeBranch,
  FaStar,
  FaCode,
  FaCalendarAlt,
  FaGlobe,
} from "react-icons/fa";
import GitHubContributions from "../components/GitHubContributions";
import styles from "./Projects.module.css";
import { Helmet } from "react-helmet-async";

// Fallback project data in case GitHub API fails
const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "portfolio",
    description:
      "Personal portfolio website built with React and modern web technologies",
    homepage: "https://ronniegrg.github.io/portfolio",
    html_url: "https://github.com/Ronniegrg/portfolio",
    languages: ["JavaScript", "React", "CSS", "HTML"],
    stargazers_count: 0,
    forks_count: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "ai-typing-assistant",
    description: "AI-powered typing assistant application",
    homepage: null,
    html_url: "https://github.com/Ronniegrg/ai-typing-assistant",
    languages: ["JavaScript", "Node.js"],
    stargazers_count: 0,
    forks_count: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
  },
  {
    id: 3,
    name: "countdown-timer",
    description: "A customizable countdown timer application",
    homepage: null,
    html_url: "https://github.com/Ronniegrg/countdown-timer",
    languages: ["JavaScript", "HTML", "CSS"],
    stargazers_count: 0,
    forks_count: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
  },
  {
    id: 4,
    name: "password-manager",
    description: "Secure password management application",
    homepage: null,
    html_url: "https://github.com/Ronniegrg/password-manager",
    languages: ["JavaScript", "Electron", "Node.js"],
    stargazers_count: 0,
    forks_count: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
  },
];

const Projects = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [allYears, setAllYears] = useState([]);
  const [inView, setInView] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Your GitHub username
  const GITHUB_USERNAME = "Ronniegrg";
  // Get GitHub token from environment variable (set VITE_GITHUB_TOKEN in your .env file)
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  // Repositories stored in state and cached in sessionStorage to prevent 403 rate limiting
  const [allRepos, setAllRepos] = useState([]);

  useEffect(() => {
    const loadRepositories = async () => {
      setIsLoading(true);
      setError(null);

      const CACHE_KEY = `gh_repos_${GITHUB_USERNAME}`;
      const CACHE_TIME_KEY = `gh_repos_time_${GITHUB_USERNAME}`;
      const CACHE_TTL = 15 * 60 * 1000; // 15 mins

      let reposData = null;

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
        if (
          cached &&
          cachedTime &&
          Date.now() - Number(cachedTime) < CACHE_TTL
        ) {
          reposData = JSON.parse(cached);
        }
      } catch {
        // sessionStorage unavailable
      }

      if (!reposData) {
        try {
          const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
            GITHUB_TOKEN
              ? { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
              : undefined
          );

          if (response.ok) {
            reposData = await response.json();
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(reposData));
              sessionStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
            } catch {
              // ignore storage quota error
            }
          } else {
            console.warn(
              `GitHub API error: ${response.status}. Using fallback data.`
            );
            reposData = FALLBACK_PROJECTS;
          }
        } catch (fetchErr) {
          console.warn("GitHub API error, using fallback:", fetchErr);
          reposData = FALLBACK_PROJECTS;
        }
      }

      setAllRepos(reposData);

      // Extract all distinct years
      const yearsSet = new Set();
      reposData.forEach((repo) => {
        if (repo.created_at)
          yearsSet.add(new Date(repo.created_at).getFullYear());
        if (repo.updated_at)
          yearsSet.add(new Date(repo.updated_at).getFullYear());
      });
      const yearsArr = Array.from(yearsSet).sort((a, b) => b - a);
      if (yearsArr.length > 0) {
        setAllYears(yearsArr);
        setYear((current) =>
          yearsArr.includes(current) ? current : yearsArr[0]
        );
      }
      setIsLoading(false);
    };

    loadRepositories();
  }, [GITHUB_USERNAME, GITHUB_TOKEN]);

  // Filter projects by selected year instantly without re-fetching
  useEffect(() => {
    if (!allRepos || allRepos.length === 0) return;

    const filtered = allRepos.filter((repo) => {
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.updated_at);
      return (
        createdDate.getFullYear() === year ||
        updatedDate.getFullYear() === year
      );
    });

    const formatted = filtered.map((repo) => {
      let githubPagesUrl = null;
      if (repo.name === `${GITHUB_USERNAME}.github.io`) {
        githubPagesUrl = `https://${GITHUB_USERNAME}.github.io`;
      } else if (repo.has_pages) {
        githubPagesUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}`;
      } else if (repo.homepage && repo.homepage.includes(".github.io")) {
        githubPagesUrl = repo.homepage;
      }

      return {
        id: repo.id,
        title: repo.name,
        description:
          repo.description || `A ${repo.language || "code"} repository.`,
        github: repo.html_url,
        demo: repo.homepage || "#",
        githubPages: githubPagesUrl,
        tags: repo.languages || (repo.language ? [repo.language] : ["Code"]),
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        created: new Date(repo.created_at),
        updated: new Date(repo.updated_at),
        isForked: Boolean(repo.fork),
      };
    });

    formatted.sort((a, b) => b.updated - a.updated);
    setProjects(formatted);
  }, [allRepos, year, GITHUB_USERNAME]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>Projects | Rouni Gorgees</title>
        <meta
          name="description"
          content="Explore the projects and GitHub repositories of Rouni Gorgees, showcasing technical skills and coding journey."
        />
        <meta property="og:title" content="Projects | Rouni Gorgees" />
        <meta
          property="og:description"
          content="Explore the projects and GitHub repositories of Rouni Gorgees, showcasing technical skills and coding journey."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://ronniegrg.github.io/portfolio/projects"
        />
        <meta
          property="og:image"
          content="https://ronniegrg.github.io/portfolio/rg-logo.svg"
        />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Rouni Gorgees",
            "jobTitle": "Software Developer",
            "url": "https://ronniegrg.github.io/portfolio/projects",
            "sameAs": [
              "https://github.com/Ronniegrg",
              "https://www.linkedin.com/in/rouni-gorgees-207b56167/"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ontario",
              "addressCountry": "Canada"
            }
          }
        `}</script>
      </Helmet>
      <div className={styles.projects}>
        <div className={styles.container}>
          <div className={`${styles.hero} ${styles.fadeIn}`}>
            <h1 className={styles.title}>My Projects</h1>
            <p className={styles.intro}>
              Explore my GitHub repositories and coding journey. These projects
              showcase my technical skills and problem-solving approach across
              various technologies.
            </p>
          </div>

          <div
            className={`${styles.githubSection} ${
              inView ? styles.fadeInUp : ""
            }`}
            ref={sectionRef}
          >
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              GitHub Activity
            </h2>
            <GitHubContributions username={GITHUB_USERNAME} />
          </div>

          <div className={styles.projectsSection}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: 16,
              }}
            >
              <h2
                className={styles.sectionTitle}
                style={{
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                Projects in
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    borderRadius: 6,
                    padding: "2px 8px",
                    marginLeft: 8,
                  }}
                >
                  {allYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className={styles.projectCount} style={{ marginLeft: 8 }}>
                  ({projects.length} repositories)
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className={styles.loadingProjects}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading projects...</p>
              </div>
            ) : error ? (
              <div className={styles.projectsError}>
                <p>{error}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className={styles.noProjects}>
                <p>No repositories found for {year}.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.content}>
                      <div className={styles.cardHeader}>
                        <h3 className={styles.projectTitle}>
                          {project.title}
                          {project.isForked && (
                            <span className={styles.forkedLabel}>
                              <FaCodeBranch /> Forked
                            </span>
                          )}
                        </h3>
                        <div className={styles.projectMeta}>
                          <span className={styles.metaItem}>
                            <FaStar /> {project.stars}
                          </span>
                          <span className={styles.metaItem}>
                            <FaCodeBranch /> {project.forks}
                          </span>
                        </div>
                      </div>
                      <p className={styles.projectDescription}>
                        {project.description}
                      </p>
                      <div className={styles.projectDates}>
                        <span className={styles.dateItem}>
                          <FaCalendarAlt className={styles.dateIcon} /> Created:{" "}
                          {formatDate(project.created)}
                        </span>
                        <span className={styles.dateItem}>
                          <FaCode className={styles.dateIcon} /> Updated:{" "}
                          {formatDate(project.updated)}
                        </span>
                      </div>
                      <div className={styles.technologies}>
                        {project.tags.map((tag, index) => (
                          <span key={index} className={styles.techTag}>
                            {tag}
                          </span>
                        ))}
                      </div>{" "}
                      <div className={styles.links}>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          <FaGithub /> GitHub
                        </a>{" "}
                        {project.githubPages && (
                          <a
                            href={project.githubPages}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.link} ${styles.pagesLink}`}
                          >
                            <FaGlobe /> GitHub Pages
                          </a>
                        )}
                        {project.demo !== "#" &&
                          project.demo !== project.githubPages && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.link} ${styles.demoLink}`}
                            >
                              <FaExternalLinkAlt /> Live Demo
                            </a>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
