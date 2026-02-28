import type { GitHubUser, GitHubRepo, LanguageStats, RepoStats } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

// GitHub Personal Access Token from environment variables
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

class GitHubAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Profile-Explorer-Pro',
  };

  // Add authorization header if token is available
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubAPIError(404, 'User not found');
    }
    if (response.status === 403) {
      throw new GitHubAPIError(403, 'API rate limit exceeded. Please try again later.');
    }
    if (response.status === 401) {
      throw new GitHubAPIError(401, 'Invalid authentication token');
    }
    throw new GitHubAPIError(response.status, `GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`);
}

export async function getUserRepos(username: string, page = 1, perPage = 100): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(`/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`);
}

export async function getAllUserRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  
  while (true) {
    const pageRepos = await getUserRepos(username, page, perPage);
    repos.push(...pageRepos);
    
    if (pageRepos.length < perPage) {
      break;
    }
    page++;
  }
  
  return repos;
}

export async function searchUsers(query: string): Promise<GitHubUser[]> {
  const data = await fetchGitHub<{ items: GitHubUser[] }>(`/search/users?q=${encodeURIComponent(query)}&per_page=5`);
  return data.items;
}

export async function searchRepos(query: string): Promise<GitHubRepo[]> {
  const data = await fetchGitHub<{ items: GitHubRepo[] }>(`/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
  return data.items;
}

export function calculateRepoStats(repos: GitHubRepo[]): RepoStats {
  const stats: RepoStats = {
    total: repos.length,
    deployed: 0,
    forked: 0,
    original: 0,
    languages: {},
  };

  const deploymentKeywords = ['demo', 'live', 'vercel', 'netlify', 'github-pages'];

  repos.forEach((repo) => {
    // Count forked vs original
    if (repo.fork) {
      stats.forked++;
    } else {
      stats.original++;
    }

    // Check if deployed/published
    const hasHomepage = repo.homepage && repo.homepage.length > 0;
    const hasDeploymentTopic = repo.topics?.some(topic => 
      deploymentKeywords.some(keyword => topic.toLowerCase().includes(keyword))
    );
    const hasGitHubPages = repo.has_pages;
    
    if (hasHomepage || hasDeploymentTopic || hasGitHubPages) {
      stats.deployed++;
    }

    // Count languages
    if (repo.language) {
      stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
    }
  });

  return stats;
}

export function isDeployed(repo: GitHubRepo): boolean {
  const deploymentKeywords = ['demo', 'live', 'vercel', 'netlify', 'github-pages'];
  const hasHomepage = repo.homepage && repo.homepage.length > 0;
  const hasDeploymentTopic = repo.topics?.some(topic => 
    deploymentKeywords.some(keyword => topic.toLowerCase().includes(keyword))
  );
  return hasHomepage || hasDeploymentTopic || repo.has_pages;
}

export function getDeploymentUrl(repo: GitHubRepo): string | null {
  if (repo.homepage && repo.homepage.length > 0) {
    return repo.homepage;
  }
  if (repo.has_pages && repo.owner) {
    return `https://${repo.owner.login}.github.io/${repo.name}`;
  }
  return null;
}

export function getTopLanguages(languages: LanguageStats, limit = 6): { name: string; count: number; percentage: number }[] {
  const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(languages)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

export { GitHubAPIError };
