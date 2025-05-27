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
  // Fetch all years from repos
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
          GITHUB_TOKEN
            ? { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
            : undefined
        );

        if (!response.ok) {
          console.warn(
            `GitHub API error: ${response.status}. Using fallback data.`
          ); // Use fallback data to get years
          const yearsSet = new Set();
          FALLBACK_PROJECTS.forEach((repo) => {
            yearsSet.add(new Date(repo.created_at).getFullYear());
            yearsSet.add(new Date(repo.updated_at).getFullYear());
          });
          const yearsArr = Array.from(yearsSet).sort((a, b) => b - a);
          setAllYears(yearsArr);
          if (!yearsArr.includes(year)) setYear(yearsArr[0]);
          return;
        }

        const repos = await response.json();
        const yearsSet = new Set();
        repos.forEach((repo) => {
          yearsSet.add(new Date(repo.created_at).getFullYear());
          yearsSet.add(new Date(repo.updated_at).getFullYear());
        });
        const yearsArr = Array.from(yearsSet).sort((a, b) => b - a);
        setAllYears(yearsArr);
        // If current year not in repos, default to most recent year
        if (!yearsArr.includes(year)) setYear(yearsArr[0]);
      } catch (error) {
        console.warn("Error fetching years from GitHub API:", error); // fallback: use fallback data
        const yearsSet = new Set();
        FALLBACK_PROJECTS.forEach((repo) => {
          yearsSet.add(new Date(repo.created_at).getFullYear());
          yearsSet.add(new Date(repo.updated_at).getFullYear());
        });
        const yearsArr = Array.from(yearsSet).sort((a, b) => b - a);
        setAllYears(yearsArr.length > 0 ? yearsArr : [year]);
      }
    };
    fetchYears();
  }, [GITHUB_USERNAME, GITHUB_TOKEN, year]);
  // Fetch GitHub repositories based on year
  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all repositories for the user
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
          GITHUB_TOKEN
            ? { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
            : undefined
        );
        if (!response.ok) {
          console.warn(
            `GitHub API error: ${response.status}. Using fallback data.`
          );
          // Use fallback data when API fails
          const filteredRepos = FALLBACK_PROJECTS.filter((repo) => {
            const createdDate = new Date(repo.created_at);
            const updatedDate = new Date(repo.updated_at);
            return (
              createdDate.getFullYear() === year ||
              updatedDate.getFullYear() === year
            );
          });

          const formattedProjects = filteredRepos.map((repo) => ({
            id: repo.id,
            title: repo.name,
            description:
              repo.description ||
              `A ${repo.languages[0] || "code"} repository.`,
            github: repo.html_url,
            demo: repo.homepage || "#",
            githubPages: repo.homepage,
            tags: repo.languages || ["Code"],
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            created: new Date(repo.created_at),
            updated: new Date(repo.updated_at),
            isForked: false,
          }));

          formattedProjects.sort((a, b) => b.updated - a.updated);
          setProjects(formattedProjects);
          setIsLoading(false);
          return;
        }

        const repos = await response.json();

        // Filter repositories by year (created or updated in the selected year)
        const filteredRepos = repos.filter((repo) => {
          const createdDate = new Date(repo.created_at);
          const updatedDate = new Date(repo.updated_at);
          return (
            createdDate.getFullYear() === year ||
            updatedDate.getFullYear() === year
          );
        }); // Format repositories for display
        const formattedProjects = await Promise.all(
          filteredRepos.map(async (repo) => {
            // Try to fetch languages for the repo
            let languages = [];
            try {
              // Construct the languages URL manually to avoid any potential issues
              const languagesUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`;

              const langResponse = await fetch(
                languagesUrl,
                GITHUB_TOKEN
                  ? { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
                  : undefined
              );
              if (langResponse.ok) {
                const langData = await langResponse.json();
                languages = Object.keys(langData);
              } else if (langResponse.status === 403) {
                // Rate limit hit, skip languages for this repo
                languages = repo.language ? [repo.language] : [];
              } else if (langResponse.status === 404) {
                // Repository doesn't have languages endpoint or not accessible
                languages = repo.language ? [repo.language] : [];
              }
            } catch (error) {
              // Log the error for debugging but continue with fallback
              console.warn(
                `Failed to fetch languages for ${repo.name}:`,
                error
              );
              // fallback: skip languages
              languages = repo.language ? [repo.language] : [];
            }

            // Check for GitHub Pages (skip this since it's causing 403 errors)
            let githubPagesUrl = null;

            // Fallback: check if repo name follows GitHub Pages pattern
            if (repo.name === `${GITHUB_USERNAME}.github.io`) {
              githubPagesUrl = `https://${GITHUB_USERNAME}.github.io`;
            } else if (repo.has_pages) {
              githubPagesUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}`;
            }

            // Additional fallback checks for common GitHub Pages patterns
            if (!githubPagesUrl) {
              // Check if the repo has a GitHub Pages URL pattern in homepage
              if (repo.homepage && repo.homepage.includes(".github.io")) {
                githubPagesUrl = repo.homepage;
              }
              // Check for common project names that might have pages
              else if (
                repo.name.toLowerCase().includes("portfolio") ||
                repo.name.toLowerCase().includes("website") ||
                repo.name.toLowerCase().includes("blog") ||
                repo.name.toLowerCase() === "portfolio" ||
                repo.name === `${GITHUB_USERNAME}.github.io`
              ) {
                // These types of repos commonly have GitHub Pages
                githubPagesUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name}`;
              }
            }

            // Create formatted project object
            return {
              id: repo.id,
              title: repo.name,
              description:
                repo.description || `A ${repo.language || "code"} repository.`,
              github: repo.html_url,
              demo: repo.homepage || "#",
              githubPages: githubPagesUrl,
              tags:
                languages.length > 0
                  ? languages
                  : repo.language
                  ? [repo.language]
                  : ["Code"],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              created: new Date(repo.created_at),
              updated: new Date(repo.updated_at),
              isForked: repo.fork,
            };
          })
        ); // Sort projects by updated date (newest first)
        formattedProjects.sort((a, b) => b.updated - a.updated);

        setProjects(formattedProjects);
      } catch (err) {
        console.error("Error fetching GitHub repositories:", err);
        console.warn("Using fallback data due to API error");

        // Use fallback data when API fails
        const filteredRepos = FALLBACK_PROJECTS.filter((repo) => {
          const createdDate = new Date(repo.created_at);
          const updatedDate = new Date(repo.updated_at);
          return (
            createdDate.getFullYear() === year ||
            updatedDate.getFullYear() === year
          );
        });

        const formattedProjects = filteredRepos.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description:
            repo.description || `A ${repo.languages[0] || "code"} repository.`,
          github: repo.html_url,
          demo: repo.homepage || "#",
          githubPages: repo.homepage,
          tags: repo.languages || ["Code"],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          created: new Date(repo.created_at),
          updated: new Date(repo.updated_at),
          isForked: false,
        }));

        formattedProjects.sort((a, b) => b.updated - a.updated);
        setProjects(formattedProjects);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepositories();
  }, [year, GITHUB_USERNAME, GITHUB_TOKEN]);

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
          content="https://ronniegrg.github.io/projects"
        />
        <meta
          property="og:image"
          content="https://ronniegrg.github.io/rg-logo.svg"
        />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Rouni Gorgees",
            "jobTitle": "Software Developer",
            "url": "https://ronniegrg.github.io/projects",
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
