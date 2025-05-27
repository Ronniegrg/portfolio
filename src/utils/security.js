/**
 * Security utilities for the portfolio application
 */

/**
 * Input sanitization to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return (
    input
      .trim()
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove event handlers
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "")
      // Remove javascript: URLs
      .replace(/javascript\s*:/gi, "")
      // Remove data: URLs with scripts
      .replace(/data\s*:\s*text\/html/gi, "")
      // Remove iframe tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      // Remove object and embed tags
      .replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")
  );
};

/**
 * Email validation with security considerations
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  // Basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  // Additional security checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes("..")) return false; // Consecutive dots
  if (email.startsWith(".") || email.endsWith(".")) return false;

  return true;
};

/**
 * Check if text contains suspicious patterns
 * @param {string} text - Text to check
 * @returns {boolean} - Whether text contains suspicious patterns
 */
export const containsSuspiciousContent = (text) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /data:\s*text\/html/i,
    /onclick/i,
    /onerror/i,
    /onload/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\s*\(/i,
    /document\.cookie/i,
    /document\.write/i,
    /window\.location/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(text));
};

/**
 * Rate limiting storage using localStorage
 */
export const RateLimitStorage = {
  KEY: "portfolio_rate_limit",

  get: () => {
    try {
      const data = localStorage.getItem(RateLimitStorage.KEY);
      return data ? JSON.parse(data) : { attempts: [], blocked: false };
    } catch {
      return { attempts: [], blocked: false };
    }
  },

  set: (data) => {
    try {
      localStorage.setItem(RateLimitStorage.KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(RateLimitStorage.KEY);
    } catch {
      // Ignore storage errors
    }
  },
};

/**
 * Generate a simple hash for tracking purposes (not cryptographic)
 * @param {string} str - String to hash
 * @returns {string} - Simple hash
 */
export const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * CSRF token generation (simple implementation)
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return simpleHash(timestamp + random);
};

/**
 * Security headers for fetch requests
 */
export const getSecurityHeaders = () => {
  return {
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
};
