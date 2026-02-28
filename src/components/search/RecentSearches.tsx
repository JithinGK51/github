'use client';

import { motion } from 'framer-motion';
import { Clock, X, History } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { RecentSearch } from '@/types';

interface RecentSearchesProps {
  onSelect: (username: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('recent-searches', []);
  const { theme } = useTheme();

  const removeSearch = (username: string) => {
    setRecentSearches(prev => prev.filter(s => s.username !== username));
  };

  const clearAll = () => {
    setRecentSearches([]);
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Recent Searches</span>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search, index) => (
          <motion.div
            key={search.username}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'group flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer',
              'bg-secondary/50 hover:bg-secondary',
              'border border-border/50 hover:border-primary/30',
              'transition-all duration-300',
              theme === 'gold' && [
                'hover:bg-yellow-500/10 hover:border-yellow-500/30',
                'gold:shine-effect'
              ]
            )}
          >
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span 
              className="text-sm font-medium"
              onClick={() => onSelect(search.username)}
            >
              {search.username}
            </span>
            <motion.span
              onClick={(e) => {
                e.stopPropagation();
                removeSearch(search.username);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function addRecentSearch(username: string) {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem('recent-searches');
  const searches: RecentSearch[] = existing ? JSON.parse(existing) : [];
  
  const filtered = searches.filter(s => s.username.toLowerCase() !== username.toLowerCase());
  
  const newSearch: RecentSearch = {
    username,
    searchedAt: new Date().toISOString(),
  };
  
  const updated = [newSearch, ...filtered].slice(0, 10);
  localStorage.setItem('recent-searches', JSON.stringify(updated));
}
