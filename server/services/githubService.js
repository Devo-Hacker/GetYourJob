import axios from "axios";

function extractUsername(usernameOrUrl) {
  return usernameOrUrl
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\/+$/, "");
}

export async function fetchGithubStats(usernameOrUrl) {
  const username = extractUsername(usernameOrUrl);

  const [userRes, reposRes] = await Promise.all([
    axios.get(`https://api.github.com/users/${username}`),
    axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);

  const repos = reposRes.data;

  const languageCounts = {};
  repos.forEach((r) => {
    if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
  });

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({ name: r.name, stars: r.stargazers_count, language: r.language }));

  return {
    username,
    publicRepos: userRes.data.public_repos,
    followers: userRes.data.followers,
    languages: Object.keys(languageCounts),
    topRepos,
  };
}
