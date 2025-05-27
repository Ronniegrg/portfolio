import { useState, useEffect } from "react";

// Fallback data in case GitHub API fails
const FALLBACK_DATA = {
  bio: "Software Developer passionate about creating efficient, user-friendly applications.",
  repoCount: 10,
  location: "Ontario, Canada",
  latestRepo: "portfolio",
  recentActivity: "Working on portfolio and various coding projects",
};

/**
 * Custom hook for fetching GitHub user information and latest activity
 * @param {string} username - GitHub username (default: 'ronniegrg')
 * @returns {Object} - Contains githubInfo, loading and error states
 */
const useGithubBio = (username = "ronniegrg") => {
  const [githubInfo, setGithubInfo] = useState({
    bio: "",
    recentActivity: "",
    repoCount: 0,
    location: "",
    latestRepo: "",
  });
  const [bioLoading, setBioLoading] = useState(true);
  const [bioError, setBioError] = useState(null);

  useEffect(() => {
    const fetchGithubInfo = async () => {
      try {
        setBioLoading(true);
        setBioError(null);

        // Fetch user profile information with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const userResponse = await fetch(
          `https://api.github.com/users/${username}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!userResponse.ok) {
          console.warn(
            `GitHub API error: ${userResponse.status}. Using fallback data.`
          );
          setGithubInfo(FALLBACK_DATA);
          setBioLoading(false);
          return;
        }

        const userData = await userResponse.json();

        // Fetch user repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        );

        if (!reposResponse.ok) {
          console.warn(
            `GitHub repos API error: ${reposResponse.status}. Using partial fallback data.`
          );
          setGithubInfo({
            bio: userData.bio || FALLBACK_DATA.bio,
            repoCount: userData.public_repos || FALLBACK_DATA.repoCount,
            location: userData.location || FALLBACK_DATA.location,
            latestRepo: FALLBACK_DATA.latestRepo,
            recentActivity: FALLBACK_DATA.recentActivity,
          });
          setBioLoading(false);
          return;
        }

        const reposData = await reposResponse.json();

        let latestRepo = "";
        if (reposData && reposData.length > 0) {
          latestRepo = reposData[0].name;
        }

        setGithubInfo({
          bio: userData.bio || FALLBACK_DATA.bio,
          repoCount: userData.public_repos || FALLBACK_DATA.repoCount,
          location: userData.location || FALLBACK_DATA.location,
          latestRepo: latestRepo || FALLBACK_DATA.latestRepo,
          recentActivity: `Working on ${latestRepo || "projects"}`,
        });
      } catch (error) {
        console.error("Error fetching GitHub information:", error);
        console.warn("Using fallback GitHub data");
        setGithubInfo(FALLBACK_DATA);
        setBioError(null); // Don't show error since we have fallback data
      } finally {
        setBioLoading(false);
      }
    };

    fetchGithubInfo();
  }, [username]);

  // For backward compatibility with existing code
  const githubBio = githubInfo.recentActivity || githubInfo.bio || "";

  return {
    githubBio,
    bioLoading,
    bioError,
    githubInfo,
  };
};

export default useGithubBio;
