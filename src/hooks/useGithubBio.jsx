import { useState, useEffect } from "react";

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

        // Fetch user profile information
        const userResponse = await fetch(
          `https://api.github.com/users/${username}`
        );

        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch GitHub info: ${userResponse.statusText}`
          );
        }

        const userData = await userResponse.json();

        // Fetch user repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        );

        if (!reposResponse.ok) {
          throw new Error(`Failed to fetch repos: ${reposResponse.statusText}`);
        }

        const reposData = await reposResponse.json();

        let latestRepo = "";
        if (reposData && reposData.length > 0) {
          latestRepo = reposData[0].name;
        }

        setGithubInfo({
          bio: userData.bio || "",
          repoCount: userData.public_repos || 0,
          location: userData.location || "",
          latestRepo: latestRepo,
          recentActivity: `Working on ${latestRepo || "projects"}`,
        });
      } catch (error) {
        console.error("Error fetching GitHub information:", error);
        setBioError("Could not load GitHub information");
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
