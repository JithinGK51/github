'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GitHubUser, GitHubRepo, RepoStats } from '@/types';
import { 
  getUser, 
  getAllUserRepos, 
  calculateRepoStats, 
  GitHubAPIError 
} from '@/lib/github';

interface UseGitHubProfileReturn {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  stats: RepoStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGitHubProfile(username: string | null): UseGitHubProfileReturn {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!username) {
      setUser(null);
      setRepos([]);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userData, reposData] = await Promise.all([
        getUser(username),
        getAllUserRepos(username),
      ]);

      setUser(userData);
      setRepos(reposData);
      setStats(calculateRepoStats(reposData));
    } catch (err) {
      if (err instanceof GitHubAPIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setUser(null);
      setRepos([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    repos,
    stats,
    loading,
    error,
    refetch: fetchData,
  };
}

interface UseGitHubSearchReturn {
  results: { users: GitHubUser[]; repos: GitHubRepo[] };
  loading: boolean;
  error: string | null;
}

export function useGitHubSearch(query: string, debounceMs = 300): UseGitHubSearchReturn {
  const [results, setResults] = useState<{ users: GitHubUser[]; repos: GitHubRepo[] }>({
    users: [],
    repos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ users: [], repos: [] });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const { searchUsers, searchRepos } = await import('@/lib/github');
        const [users, repos] = await Promise.all([
          searchUsers(query),
          searchRepos(query),
        ]);
        setResults({ users, repos });
      } catch (err) {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return { results, loading, error };
}
