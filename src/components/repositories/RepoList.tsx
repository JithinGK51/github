'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Rocket, Star, Filter, Search, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RepoCard } from './RepoCard';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { isDeployed } from '@/lib/github';
import type { GitHubRepo } from '@/types';

interface RepoListProps {
  repos: GitHubRepo[];
}

type TabValue = 'all' | 'deployed' | 'popular';
type SortValue = 'updated' | 'stars' | 'name';

export function RepoList({ repos }: RepoListProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortValue>('updated');

  // Get unique languages
  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repos.forEach(repo => {
      if (repo.language) langSet.add(repo.language);
    });
    return Array.from(langSet).sort();
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    let filtered = repos;

    // Tab filter
    if (activeTab === 'deployed') {
      filtered = filtered.filter(isDeployed);
    } else if (activeTab === 'popular') {
      filtered = filtered.filter(repo => repo.stargazers_count > 0);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.topics?.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Language filter
    if (selectedLanguage) {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return filtered;
  }, [repos, activeTab, searchQuery, selectedLanguage, sortBy]);

  const tabCounts = {
    all: repos.length,
    deployed: repos.filter(isDeployed).length,
    popular: repos.filter(repo => repo.stargazers_count > 0).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'glass rounded-3xl p-6',
        'border border-border/50',
        theme === 'gold' && 'gold:glass-card'
      )}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={cn(
            'text-xl font-bold flex items-center gap-2',
            theme === 'gold' && 'gold:glow-text'
          )}>
            <GitBranch className="w-5 h-5" />
            Repositories
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-muted-foreground">
              {filteredRepos.length} of {repos.length} repositories
            </p>
            <div className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
              'bg-green-500/10 text-green-500 border border-green-500/20',
              theme === 'gold' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            )}>
              <Globe className="w-3 h-3" />
              {tabCounts.deployed} Published
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'pl-9 w-full sm:w-64',
                theme === 'gold' && 'border-yellow-500/30 focus-visible:ring-yellow-500/20'
              )}
            />
          </div>

          {/* Language Filter */}
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={selectedLanguage === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedLanguage(null)}
              >
                All
              </Badge>
              {languages.slice(0, 5).map(lang => (
                <Badge
                  key={lang}
                  variant={selectedLanguage === lang ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer',
                    theme === 'gold' && selectedLanguage === lang && 'bg-yellow-500 text-black'
                  )}
                  onClick={() => setSelectedLanguage(lang === selectedLanguage ? null : lang)}
                >
                  {lang}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className={cn(
          'w-full grid grid-cols-3 mb-6',
          theme === 'gold' && 'bg-yellow-500/10'
        )}>
          <TabsTrigger 
            value="all"
            className={cn(theme === 'gold' && 'data-[state=active]:bg-yellow-500 data-[state=active]:text-black')}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            All
            <span className="ml-2 text-xs opacity-60">({tabCounts.all})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="deployed"
            className={cn(theme === 'gold' && 'data-[state=active]:bg-yellow-500 data-[state=active]:text-black')}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deployed
            <span className="ml-2 text-xs opacity-60">({tabCounts.deployed})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className={cn(theme === 'gold' && 'data-[state=active]:bg-yellow-500 data-[state=active]:text-black')}
          >
            <Star className="w-4 h-4 mr-2" />
            Popular
            <span className="ml-2 text-xs opacity-60">({tabCounts.popular})</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value={activeTab} className="mt-0">
            {filteredRepos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No repositories match your filters</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRepos.map((repo, index) => (
                  <RepoCard key={repo.id} repo={repo} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
