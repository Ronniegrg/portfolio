import styles from "./About.module.css";
import {
  FaGraduationCap,
  FaCode,
  FaTools,
  FaBriefcase,
  FaStar,
  FaServer,
  FaMobileAlt,
  FaDatabase,
  FaLaptopCode,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaClock,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import omnistudioDeveloper from "../assets/omnistudioDeveloper.png";
import platformDeveloper from "../assets/platformDeveloper.png";
import salesforceAdmin from "../assets/salesforcecertifiedadministrator.png";
import mcmaster from "../assets/mcmaster.jpg";
import mohawk from "../assets/mohawk-college.png";
import Modal from "../components/Modal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../styles/pdf.css"; // Additional custom PDF styles
import { Helmet } from "react-helmet-async";
import educationData from "../data/education.json";
import experiencesData from "../data/experiences.json";
import skillsData from "../data/skills.json";

// Configure PDF.js worker for both development and production
pdfjs.GlobalWorkerOptions.workerSrc = "/portfolio/pdf.worker.min.js";

const logoMap = {
  omnistudioDeveloper,
  platformDeveloper,
  salesforceAdmin,
  mcmaster,
  mohawk,
};

const iconMap = {
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaTools,
  FaMobileAlt,
};

const About = () => {
  const [activeSkillTab, setActiveSkillTab] = useState("frontend");
  const [expandedEducation, setExpandedEducation] = useState(null);
  const [pdfModal, setPdfModal] = useState({ open: false, src: null });
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skillCategories, setSkillCategories] = useState({});

  useEffect(() => {
    // Use imported data instead of fetching
    const mappedEducation = educationData.map((item) => ({
      ...item,
      logo: logoMap[item.logo] || item.logo,
    }));
    setEducation(mappedEducation);

    setExperiences(experiencesData);

    // Map icon string to imported icon component
    const mappedSkills = {};
    for (const key in skillsData) {
      mappedSkills[key] = {
        ...skillsData[key],
        icon: iconMap[skillsData[key].icon] || null,
      };
    }
    setSkillCategories(mappedSkills);
  }, []);

  // Toggle education item expansion
  const toggleEducation = (id) => {
    setExpandedEducation(expandedEducation === id ? null : id);
  };
  // Map education id to PDF file names in public folder
  const pdfFiles = {
    1: "Cert2863203_OmniStudioDeveloper_20230109.pdf",
    2: "Cert2595678_PlatformDeveloperI_20220926.pdf",
    3: "Cert2499846_Administrator_20220817.pdf",
    4: "Web-Design.pdf",
    5: "Computer-System-Technology-Software-Development.pdf",
  };

  return (
    <>
      <Helmet>
        <title>About | Rouni Gorgees</title>
        <meta
          name="description"
          content="Learn more about Rouni Gorgees, a passionate software developer with a strong foundation in web development, education, and certifications."
        />
        <meta property="og:title" content="About | Rouni Gorgees" />
        <meta
          property="og:description"
          content="Learn more about Rouni Gorgees, a passionate software developer with a strong foundation in web development, education, and certifications."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://ronniegrg.github.io/about" />
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
            "url": "https://ronniegrg.github.io/about",
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
      <div className={styles.about}>
        <div className={styles.container}>
          <h1 className={styles.title}>About Me</h1>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>
                  <FaCode className={styles.icon} />
                  Introduction
                </h2>
                <div className={styles.text}>
                  <p>
                    I am a passionate software developer with a strong
                    foundation in web development and a keen interest in
                    creating efficient, user-friendly applications. My journey
                    in technology began with a curiosity about how things work,
                    which led me to explore programming and development.
                  </p>
                  <p>
                    I specialize in building responsive and scalable web
                    applications using modern technologies and best practices.
                    My approach to development combines technical expertise with
                    creative problem-solving to deliver high-quality solutions.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>
                  <FaGraduationCap className={styles.icon} />
                  Education & Certifications
                </h2>

                <div className={styles.educationTimeline}>
                  {education.map((edu) => (
                    <div key={edu.id} className={styles.educationItem}>
                      <div className={styles.timelineConnector}>
                        <div className={styles.timelineDot}></div>
                      </div>

                      <div className={styles.educationCard}>
                        <div
                          className={styles.educationHeader}
                          onClick={() => toggleEducation(edu.id)}
                        >
                          <div className={styles.educationLogo}>
                            {edu.logo ? (
                              <img src={edu.logo} alt={edu.institution} />
                            ) : (
                              <FaCertificate />
                            )}
                          </div>

                          <div className={styles.educationMain}>
                            <h3 className={styles.educationDegree}>
                              {edu.degree}
                            </h3>
                            <p className={styles.institution}>
                              {edu.institution}
                            </p>

                            <div className={styles.educationMeta}>
                              <span className={styles.duration}>
                                <FaCalendarAlt /> {edu.duration}
                              </span>
                              <span className={styles.location}>
                                <FaMapMarkerAlt /> {edu.location}
                              </span>
                            </div>
                          </div>

                          <button
                            className={styles.expandButton}
                            aria-label={
                              expandedEducation === edu.id
                                ? "Collapse details"
                                : "Expand details"
                            }
                          >
                            {expandedEducation === edu.id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </div>

                        {expandedEducation === edu.id && (
                          <div className={styles.educationDetails}>
                            <p className={styles.educationDescription}>
                              {edu.description}
                            </p>
                            {edu.achievements.length > 0 && (
                              <div className={styles.achievementsSection}>
                                <h4 className={styles.detailsTitle}>
                                  Achievements
                                </h4>
                                <ul className={styles.achievementsList}>
                                  {edu.achievements.map(
                                    (achievement, index) => (
                                      <li
                                        key={index}
                                        className={styles.achievementItem}
                                      >
                                        {achievement}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            <div className={styles.coursesSection}>
                              <h4 className={styles.detailsTitle}>
                                Key Courses
                              </h4>
                              <div className={styles.coursesTags}>
                                {edu.courses.map((course, index) => (
                                  <span
                                    key={index}
                                    className={styles.courseTag}
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>{" "}
                            <div style={{ marginTop: "1rem" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  className={styles.viewPdfButton}
                                  onClick={() =>
                                    setPdfModal({
                                      open: true,
                                      src: pdfFiles[edu.id],
                                    })
                                  }
                                  style={{
                                    background: "var(--primary-color)",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "0.5rem 1.2rem",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                  }}
                                >
                                  View Certificate
                                </button>
                                <a
                                  href={`https://ronniegrg.github.io/portfolio/${
                                    pdfFiles[edu.id]
                                  }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background: "transparent",
                                    color: "var(--primary-color)",
                                    borderRadius: "6px",
                                    padding: "0.5rem 1.2rem",
                                    border: "2px solid var(--primary-color)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    textDecoration: "none",
                                    display: "inline-block",
                                  }}
                                >
                                  Open in New Tab
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>
                  <FaCode className={styles.icon} />
                  Skills & Technologies
                </h2>

                <div className={styles.skillTabs}>
                  {Object.entries(skillCategories).map(([key, category]) => (
                    <button
                      key={key}
                      className={`${styles.skillTab} ${
                        activeSkillTab === key ? styles.activeTab : ""
                      }`}
                      onClick={() => setActiveSkillTab(key)}
                    >
                      <span className={styles.tabIcon}>
                        {category.icon && <category.icon />}
                      </span>
                      <span className={styles.tabLabel}>{category.title}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.skillContent}>
                  {skillCategories[activeSkillTab] && (
                    <>
                      <h3 className={styles.skillCategoryTitle}>
                        {skillCategories[activeSkillTab].icon &&
                          React.createElement(
                            skillCategories[activeSkillTab].icon
                          )}
                        {skillCategories[activeSkillTab].title} Skills
                      </h3>
                      <div className={styles.skillsList}>
                        {skillCategories[activeSkillTab].skills.map(
                          (skill, index) => (
                            <div key={index} className={styles.skillItem}>
                              <div className={styles.skillInfo}>
                                <span className={styles.skillName}>
                                  {skill.name}
                                </span>
                                <span className={styles.skillLevel}>
                                  {skill.level >= 90
                                    ? "Expert"
                                    : skill.level >= 70
                                    ? "Advanced"
                                    : skill.level >= 50
                                    ? "Intermediate"
                                    : "Beginner"}
                                </span>
                              </div>
                              <div className={styles.skillBar}>
                                <div
                                  className={styles.skillProgress}
                                  style={{
                                    width: `${skill.level}%`,
                                    animationDelay: `${index * 0.1}s`,
                                  }}
                                ></div>
                              </div>
                              <div className={styles.skillStars}>
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`
                                    ${styles.star}
                                    ${
                                      i < Math.round(skill.level / 20)
                                        ? styles.filledStar
                                        : ""
                                    }
                                  `}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardContent}>
                <h2 className={styles.sectionTitle}>
                  <FaBriefcase className={styles.icon} />
                  Experience
                </h2>

                <div className={styles.experienceSection}>
                  {experiences.map((exp) => (
                    <div key={exp.id} className={styles.experienceCard}>
                      <div className={styles.experienceHeader}>
                        <div className={styles.companyLogo}>
                          {exp.logo ? (
                            <img src={exp.logo} alt={exp.company} />
                          ) : (
                            <FaBuilding
                              size={30}
                              color="var(--primary-color)"
                            />
                          )}
                        </div>

                        <div className={styles.experienceInfo}>
                          <h3 className={styles.jobTitle}>{exp.title}</h3>
                          {exp.companyLink ? (
                            <a
                              href={exp.companyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.companyName}
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <p className={styles.companyName}>{exp.company}</p>
                          )}
                          <div className={styles.experienceMeta}>
                            <span className={styles.metaItem}>
                              <FaMapMarkerAlt className={styles.metaIcon} />
                              {exp.location}
                            </span>
                            <span className={styles.metaItem}>
                              <FaCalendarAlt className={styles.metaIcon} />
                              {exp.duration}
                            </span>
                            <span className={styles.metaItem}>
                              <FaClock className={styles.metaIcon} />
                              {exp.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ul className={styles.responsibilities}>
                        {exp.responsibilities.map((resp, index) => (
                          <li key={index} className={styles.responsibilityItem}>
                            {resp}
                          </li>
                        ))}
                      </ul>

                      <div className={styles.techStack}>
                        {exp.technologies.map((tech, index) => (
                          <span key={index} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={pdfModal.open}
          onClose={() => {
            setPdfModal({ open: false, src: null });
            setPageNumber(1);
          }}
        >
          {" "}
          {pdfModal.src && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Document
                file={pdfModal.src}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                  console.error("Error loading PDF:", error);
                  // Try alternative URL if first attempt fails
                  if (!pdfModal.src.startsWith("http")) {
                    const fallbackUrl = `https://ronniegrg.github.io/portfolio/${pdfModal.src}`;
                    setPdfModal({ open: true, src: fallbackUrl });
                  }
                }}
                loading={<div>Loading PDF...</div>}
                error={
                  <div style={{ padding: "2rem", color: "var(--text-color)" }}>
                    <p>Failed to load PDF. You can try:</p>
                    <a
                      href={
                        pdfModal.src.startsWith("http")
                          ? pdfModal.src
                          : `https://ronniegrg.github.io/portfolio/${pdfModal.src}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--primary-color)",
                        textDecoration: "underline",
                      }}
                    >
                      Open PDF in new tab
                    </a>
                  </div>
                }
                className="no-print"
              >
                <Page pageNumber={pageNumber} width={600} />
              </Document>
              {numPages && numPages > 1 && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                  }}
                >
                  <button
                    onClick={() =>
                      setPageNumber((page) => Math.max(page - 1, 1))
                    }
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() =>
                      setPageNumber((page) => Math.min(page + 1, numPages))
                    }
                    disabled={pageNumber >= numPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          <style>{`
            @media print {
              .no-print, .no-print * {
                display: none !important;
              }
            }
          `}</style>
        </Modal>
      </div>
    </>
  );
};

export default About;
