import { useState, useCallback, useEffect } from "react";
import { RateLimitStorage } from "../utils/security";

/**
 * Rate limiting hook to prevent spam submissions
 * @param {number} maxAttempts - Maximum number of attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - Rate limit state and functions
 */
const useRateLimit = (maxAttempts = 3, windowMs = 15 * 60 * 1000) => {
  // 15 minutes default
  const [attempts, setAttempts] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Load persisted data on mount
  useEffect(() => {
    const data = RateLimitStorage.get();
    const now = Date.now();

    // Filter out expired attempts
    const validAttempts = data.attempts.filter(
      (timestamp) => now - timestamp < windowMs
    );

    setAttempts(validAttempts);

    // Check if still blocked
    if (validAttempts.length >= maxAttempts) {
      const oldestAttempt = Math.min(...validAttempts);
      const timeUntilReset = windowMs - (now - oldestAttempt);

      if (timeUntilReset > 0) {
        setIsBlocked(true);
        setRemainingTime(Math.ceil(timeUntilReset / 1000 / 60));

        setTimeout(() => {
          setIsBlocked(false);
          setRemainingTime(0);
        }, timeUntilReset);
      }
    }
  }, [maxAttempts, windowMs]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();

    // Remove attempts that are outside the time window
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < windowMs
    );
    setAttempts(recentAttempts);

    // Check if we've exceeded the rate limit
    if (recentAttempts.length >= maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts);
      const timeUntilReset = windowMs - (now - oldestAttempt);

      setIsBlocked(true);
      setRemainingTime(Math.ceil(timeUntilReset / 1000 / 60)); // Convert to minutes

      // Persist the blocked state
      RateLimitStorage.set({
        attempts: recentAttempts,
        blocked: true,
        blockedUntil: now + timeUntilReset,
      });

      // Set timeout to unblock when window expires
      setTimeout(() => {
        setIsBlocked(false);
        setRemainingTime(0);
        RateLimitStorage.set({
          attempts: [],
          blocked: false,
        });
      }, timeUntilReset);

      return false;
    }

    return true;
  }, [attempts, maxAttempts, windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newAttempts = [...attempts, now];
    setAttempts(newAttempts);

    // Persist attempts
    RateLimitStorage.set({
      attempts: newAttempts,
      blocked: isBlocked,
    });
  }, [attempts, isBlocked]);

  const reset = useCallback(() => {
    setAttempts([]);
    setIsBlocked(false);
    setRemainingTime(0);
    RateLimitStorage.clear();
  }, []);

  return {
    isBlocked,
    remainingTime,
    checkRateLimit,
    recordAttempt,
    reset,
    attemptsCount: attempts.length,
  };
};

export default useRateLimit;
