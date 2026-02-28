export type Theme = 'light' | 'dark' | 'gold';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  default_branch: string;
  visibility: 'public' | 'private';
  has_pages: boolean;
  owner?: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
}

export interface LanguageStats {
  [language: string]: number;
}

export interface RepoStats {
  total: number;
  deployed: number;
  forked: number;
  original: number;
  languages: LanguageStats;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}

export interface SearchResult {
  users: GitHubUser[];
  repos: GitHubRepo[];
}

export interface BookmarkedUser {
  username: string;
  avatar_url: string;
  name: string | null;
  bookmarkedAt: string;
}

export interface RecentSearch {
  username: string;
  searchedAt: string;
}
