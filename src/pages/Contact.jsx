import { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import styles from "./Contact.module.css";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isFocused, setIsFocused] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);
  const contactRef = useRef(null);

  // Add animation when component mounts
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

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (name) => {
    setIsFocused((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleBlur = (name) => {
    setIsFocused((prev) => ({
      ...prev,
      [name]: false,
    }));

    // Validate on blur
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "subject":
        if (!value.trim()) {
          error = "Subject is required";
        } else if (value.trim().length < 3) {
          error = "Subject must be at least 3 characters";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        }
        break;

      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const validateForm = () => {
    const fields = ["name", "email", "subject", "message"];
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector(`.${styles.errorMsg}`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Check if EmailJS is configured
      if (
        !import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY ===
          "your_emailjs_public_key_here"
      ) {
        throw new Error(
          "EmailJS is not configured yet. Please set up your EmailJS credentials in the .env file to enable the contact form."
        );
      }

      // Send email using EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      // Using your service ID and template ID
      await emailjs.send(
        "service_2uujxo8", // Service ID
        "template_j9bqd5m", // Template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Public Key
      );

      setSubmitStatus({
        success: true,
        message:
          "Your message has been sent successfully! I will get back to you soon.",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Scroll to success message
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      content: "rounigorgees@gmail.com",
      link: "mailto:rounigorgees@gmail.com",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      content: "linkedin.com/in/rouni-gorgees",
      link: "https://www.linkedin.com/in/rouni-gorgees-207b56167/",
    },
    {
      icon: <FaGithub />,
      title: "GitHub",
      content: "github.com/Ronniegrg",
      link: "https://github.com/Ronniegrg",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      content: "Ontario, Canada",
      link: null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact | Rouni Gorgees</title>
        <meta
          name="description"
          content="Contact Rouni Gorgees, software developer, for collaboration, project inquiries, or professional networking."
        />
        <meta property="og:title" content="Contact | Rouni Gorgees" />
        <meta
          property="og:description"
          content="Contact Rouni Gorgees, software developer, for collaboration, project inquiries, or professional networking."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ronniegrg.github.io/contact" />
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
            "url": "https://ronniegrg.github.io/contact",
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
      <div className={styles.contact} ref={contactRef}>
        <section className={`${styles.hero} ${styles.animatedSection}`}>
          <div className={styles.container}>
            <h1 className={styles.title}>Get In Touch</h1>
            <p className={styles.intro}>
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision. Feel free to reach out!
            </p>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.formContainer}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>
                    <FaPaperPlane />
                  </span>
                  Send me a message
                </h2>

                {submitStatus && (
                  <div
                    className={`${styles.submitMessage} ${
                      submitStatus.success ? styles.success : styles.error
                    }`}
                  >
                    <span className={styles.statusIcon}>
                      {submitStatus.success ? (
                        <FaCheckCircle />
                      ) : (
                        <FaExclamationCircle />
                      )}
                    </span>
                    <p>{submitStatus.message}</p>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className={styles.form}
                  ref={formRef}
                  noValidate
                >
                  <div className={styles.formRow}>
                    <div
                      className={`${styles.formGroup} ${
                        isFocused.name ? styles.focused : ""
                      } ${formErrors.name ? styles.hasError : ""}`}
                    >
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus("name")}
                        onBlur={() => handleBlur("name")}
                        placeholder="Your name"
                      />
                      {formErrors.name && (
                        <span className={styles.errorMsg}>
                          {formErrors.name}
                        </span>
                      )}
                    </div>

                    <div
                      className={`${styles.formGroup} ${
                        isFocused.email ? styles.focused : ""
                      } ${formErrors.email ? styles.hasError : ""}`}
                    >
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={() => handleBlur("email")}
                        placeholder="Your email address"
                      />
                      {formErrors.email && (
                        <span className={styles.errorMsg}>
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className={`${styles.formGroup} ${
                      isFocused.subject ? styles.focused : ""
                    } ${formErrors.subject ? styles.hasError : ""}`}
                  >
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus("subject")}
                      onBlur={() => handleBlur("subject")}
                      placeholder="What is this regarding?"
                    />
                    {formErrors.subject && (
                      <span className={styles.errorMsg}>
                        {formErrors.subject}
                      </span>
                    )}
                  </div>

                  <div
                    className={`${styles.formGroup} ${
                      isFocused.message ? styles.focused : ""
                    } ${formErrors.message ? styles.hasError : ""}`}
                  >
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus("message")}
                      onBlur={() => handleBlur("message")}
                      rows="6"
                      placeholder="How can I help you?"
                    />
                    {formErrors.message && (
                      <span className={styles.errorMsg}>
                        {formErrors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinnerIcon}></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className={styles.infoContainer}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>
                    <FaEnvelope />
                  </span>
                  Contact Information
                </h2>

                <div className={styles.contactInfo}>
                  {contactInfo.map((info, index) => (
                    <div key={index} className={styles.infoItem}>
                      <div className={styles.infoIcon}>{info.icon}</div>
                      <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={
                              info.link.startsWith("mailto")
                                ? "_self"
                                : "_blank"
                            }
                            rel="noopener noreferrer"
                            className={styles.infoLink}
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className={styles.infoText}>{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.availability}>
                  <h3 className={styles.availabilityTitle}>
                    Current Availability
                  </h3>
                  <div className={styles.availabilityStatus}>
                    <span className={styles.statusDot}></span>
                    <span>Available for new projects</span>
                  </div>
                  <p className={styles.availabilityText}>
                    I'm currently available for freelance work and open to
                    discussing new opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.mapSection}>
          <div className={styles.container}>
            <div className={styles.mapContainer}>
              <h2 className={styles.mapTitle}>Find Me</h2>
              <div className={styles.map}>
                <iframe
                  src="https://maps.google.com/maps?q=Windsor,ON,Canada&t=&z=10&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin"
                  title="Map of Windsor, Ontario, Canada"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
