import { useState, useEffect, useRef } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCodeBranch,
  FaStar,
  FaCode,
  FaCalendarAlt,
} from "react-icons/fa";
import GitHubContributions from "../components/GitHubContributions";
import styles from "./Projects.module.css";

const Projects = () => {
  const [year] = useState(new Date().getFullYear());
  const [inView, setInView] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Your GitHub username
  const GITHUB_USERNAME = "Ronniegrg";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fetch GitHub repositories based on year
  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all repositories for the user
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
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
        });

        // Format repositories for display
        const formattedProjects = await Promise.all(
          filteredRepos.map(async (repo) => {
            // Try to fetch languages for the repo
            let languages = [];
            try {
              const langResponse = await fetch(repo.languages_url);
              if (langResponse.ok) {
                const langData = await langResponse.json();
                languages = Object.keys(langData);
              }
            } catch (err) {
              console.error(
                "Error fetching languages for repo:",
                repo.name,
                err
              );
            }

            // Create formatted project object
            return {
              id: repo.id,
              title: repo.name,
              description:
                repo.description || `A ${repo.language || "code"} repository.`,
              github: repo.html_url,
              demo: repo.homepage || "#",
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
        );

        // Sort projects by updated date (newest first)
        formattedProjects.sort((a, b) => b.updated - a.updated);

        setProjects(formattedProjects);
      } catch (err) {
        console.error("Error fetching GitHub repositories:", err);
        setError(
          "Failed to load projects from GitHub. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, [year, GITHUB_USERNAME]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
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
          className={`${styles.githubSection} ${inView ? styles.fadeInUp : ""}`}
          ref={sectionRef}
        >
          <h2 className={styles.sectionTitle}>GitHub Activity</h2>
          <GitHubContributions username={GITHUB_USERNAME} />
        </div>

        <div className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>
            Projects in {year}
            <span className={styles.projectCount}>
              ({projects.length} repositories)
            </span>
          </h2>

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
                    </div>

                    <div className={styles.links}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        <FaGithub /> GitHub
                      </a>
                      {project.demo !== "#" && (
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
  );
};

export default Projects;
