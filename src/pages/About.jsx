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
import { useState } from "react";
import mohawkLogo from "../assets/mohawk-college.png";
const About = () => {
  const [activeSkillTab, setActiveSkillTab] = useState("frontend");
  const [expandedEducation, setExpandedEducation] = useState(null);

  // Education data
  const education = [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "University Name",
      location: "City, Country",
      duration: "2018 - 2022",
      description:
        "Graduated with honors. Focused on software development, database management, and web technologies.",
      achievements: ["Dean's List: 2020-2022", "Best Senior Project Award"],
      courses: [
        "Data Structures and Algorithms",
        "Web Development",
        "Database Systems",
        "Software Engineering",
        "Computer Networks",
        "Operating Systems",
        "Machine Learning Fundamentals",
      ],
      logo: mohawkLogo, // Add a placeholder or actual logo path
    },
    {
      id: 2,
      degree: "Full Stack Web Development Bootcamp",
      institution: "Coding Academy",
      location: "Online",
      duration: "2022",
      description:
        "Intensive 12-week program covering modern web development technologies and best practices.",
      achievements: ["Capstone Project: E-commerce Platform"],
      courses: [
        "JavaScript/ES6+",
        "React.js",
        "Node.js & Express",
        "MongoDB",
        "RESTful API Design",
        "Authentication & Security",
      ],
      logo: "/academy-logo.png", // Add a placeholder or actual logo path
    },
    {
      id: 3,
      degree: "Cloud Computing Certification",
      institution: "Tech Certification Program",
      location: "Online",
      duration: "2023",
      description:
        "Professional certification in cloud services and deployment.",
      achievements: ["Completed with 95% score"],
      courses: [
        "Cloud Architecture",
        "Containerization",
        "Serverless Computing",
        "Cloud Security",
      ],
      logo: "/cert-logo.png", // Add a placeholder or actual logo path
    },
  ];

  const experiences = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      logo: "/company-logo1.png",
      location: "Stockholm, Sweden",
      duration: "2021 - Present",
      type: "Full-time",
      responsibilities: [
        "Led the development of a high-traffic e-commerce platform using React and Redux",
        "Implemented responsive design principles resulting in 40% improved mobile user engagement",
        "Mentored junior developers and conducted code reviews to maintain high code quality",
        "Optimized application performance achieving 30% faster load times",
      ],
      technologies: ["React", "Redux", "TypeScript", "SCSS", "Jest", "Webpack"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Innovations AB",
      logo: "/company-logo2.png",
      location: "Stockholm, Sweden",
      duration: "2019 - 2021",
      type: "Full-time",
      responsibilities: [
        "Developed and maintained multiple client projects using MERN stack",
        "Created RESTful APIs and implemented authentication systems",
        "Collaborated with UX designers to implement pixel-perfect designs",
        "Reduced server response time by 50% through database optimization",
      ],
      technologies: ["Node.js", "Express", "MongoDB", "React", "AWS", "Docker"],
    },
  ];

  // Toggle education item expansion
  const toggleEducation = (id) => {
    setExpandedEducation(expandedEducation === id ? null : id);
  };

  // Define skill categories with proficiency levels
  const skillCategories = {
    frontend: {
      icon: <FaLaptopCode />,
      title: "Frontend",
      skills: [
        { name: "React.js", level: 90 },
        { name: "JavaScript (ES6+)", level: 85 },
        { name: "HTML5", level: 95 },
        { name: "CSS3/SCSS", level: 90 },
        { name: "Tailwind CSS", level: 85 },
        { name: "Redux", level: 75 },
        { name: "TypeScript", level: 70 },
      ],
    },
    backend: {
      icon: <FaServer />,
      title: "Backend",
      skills: [
        { name: "Node.js", level: 80 },
        { name: "Express", level: 85 },
        { name: "C#/.NET", level: 75 },
        { name: "REST API Design", level: 80 },
        { name: "GraphQL", level: 65 },
      ],
    },
    database: {
      icon: <FaDatabase />,
      title: "Database",
      skills: [
        { name: "MongoDB", level: 80 },
        { name: "SQL", level: 75 },
        { name: "PostgreSQL", level: 70 },
        { name: "Firebase", level: 65 },
      ],
    },
    tools: {
      icon: <FaTools />,
      title: "Tools & Others",
      skills: [
        { name: "Git/GitHub", level: 90 },
        { name: "VS Code", level: 95 },
        { name: "Figma", level: 70 },
        { name: "Docker", level: 60 },
        { name: "CI/CD", level: 65 },
        { name: "Jest/Testing", level: 70 },
      ],
    },
    mobile: {
      icon: <FaMobileAlt />,
      title: "Mobile",
      skills: [
        { name: "React Native", level: 65 },
        { name: "Flutter", level: 50 },
        { name: "Responsive Design", level: 85 },
      ],
    },
  };

  return (
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
                  I am a passionate software developer with a strong foundation
                  in web development and a keen interest in creating efficient,
                  user-friendly applications. My journey in technology began
                  with a curiosity about how things work, which led me to
                  explore programming and development.
                </p>
                <p>
                  I specialize in building responsive and scalable web
                  applications using modern technologies and best practices. My
                  approach to development combines technical expertise with
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
                                {edu.achievements.map((achievement, index) => (
                                  <li
                                    key={index}
                                    className={styles.achievementItem}
                                  >
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className={styles.coursesSection}>
                            <h4 className={styles.detailsTitle}>Key Courses</h4>
                            <div className={styles.coursesTags}>
                              {edu.courses.map((course, index) => (
                                <span key={index} className={styles.courseTag}>
                                  {course}
                                </span>
                              ))}
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
                    className={`${styles.skillTab} ${activeSkillTab === key ? styles.activeTab : ""
                      }`}
                    onClick={() => setActiveSkillTab(key)}
                  >
                    <span className={styles.tabIcon}>{category.icon}</span>
                    <span className={styles.tabLabel}>{category.title}</span>
                  </button>
                ))}
              </div>

              <div className={styles.skillContent}>
                <h3 className={styles.skillCategoryTitle}>
                  {skillCategories[activeSkillTab].icon}
                  {skillCategories[activeSkillTab].title} Skills
                </h3>

                <div className={styles.skillsList}>
                  {skillCategories[activeSkillTab].skills.map(
                    (skill, index) => (
                      <div key={index} className={styles.skillItem}>
                        <div className={styles.skillInfo}>
                          <span className={styles.skillName}>{skill.name}</span>
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
                                                            ${i <
                                  Math.round(
                                    skill.level / 20
                                  )
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
                          <FaBuilding size={30} color="var(--primary-color)" />
                        )}
                      </div>

                      <div className={styles.experienceInfo}>
                        <h3 className={styles.jobTitle}>{exp.title}</h3>
                        <p className={styles.companyName}>{exp.company}</p>
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
    </div>
  );
};

export default About;
