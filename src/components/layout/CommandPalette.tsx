'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Github, User, GitBranch, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGitHubSearch } from '@/hooks/useGitHub';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubUser, GitHubRepo } from '@/types';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (username: string) => void;
}

export function CommandPalette({ open, onOpenChange, onSelectUser }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const { results, loading } = useGitHubSearch(query);

  const handleSelect = useCallback((type: 'user' | 'repo', item: GitHubUser | GitHubRepo) => {
    if (type === 'user') {
      onSelectUser((item as GitHubUser).login);
    } else {
      const repo = item as GitHubRepo;
      window.open(repo.html_url, '_blank');
    }
    onOpenChange(false);
    setQuery('');
  }, [onSelectUser, onOpenChange]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          'max-w-2xl p-0 gap-0 overflow-hidden',
          'bg-card border-border',
          theme === 'gold' && 'gold:glass-card'
        )}
      >
        {/* Search Input */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-4 border-b border-border',
          theme === 'gold' && 'border-yellow-500/20'
        )}>
          <Search className={cn(
            'w-5 h-5',
            theme === 'gold' ? 'text-yellow-400' : 'text-muted-foreground'
          )} />
          <Input
            placeholder="Search users or repositories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              'border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground',
              theme === 'gold' && 'placeholder:text-yellow-600/50'
            )}
            autoFocus
          />
          <kbd className={cn(
            'hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs',
            'bg-secondary border border-border',
            theme === 'gold' && 'border-yellow-500/30 bg-yellow-500/10'
          )}>
            <span>ESC</span>
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {query.length < 2 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center text-muted-foreground"
              >
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search GitHub users and repositories</p>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-4 h-4" /> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-mono bg-secondary px-1 rounded">ESC</span> Close
                  </span>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Users Section */}
                {results.users.length > 0 && (
                  <div className="p-2">
                    <h3 className={cn(
                      'px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                      theme === 'gold' && 'text-yellow-600'
                    )}>
                      Users
                    </h3>
                    {results.users.map((user) => (
                      <motion.button
                        key={user.id}
                        onClick={() => handleSelect('user', user)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg',
                          'hover:bg-secondary/50 transition-colors text-left',
                          theme === 'gold' && 'hover:bg-yellow-500/10'
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'font-medium truncate',
                            theme === 'gold' && 'text-yellow-100'
                          )}>
                            {user.login}
                          </p>
                          {user.name && (
                            <p className="text-sm text-muted-foreground truncate">
                              {user.name}
                            </p>
                          )}
                        </div>
                        <User className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Repos Section */}
                {results.repos.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <h3 className={cn(
                      'px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                      theme === 'gold' && 'text-yellow-600'
                    )}>
                      Repositories
                    </h3>
                    {results.repos.map((repo) => (
                      <motion.button
                        key={repo.id}
                        onClick={() => handleSelect('repo', repo)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg',
                          'hover:bg-secondary/50 transition-colors text-left',
                          theme === 'gold' && 'hover:bg-yellow-500/10'
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          'bg-secondary',
                          theme === 'gold' && 'bg-yellow-500/10'
                        )}>
                          <GitBranch className={cn(
                            'w-5 h-5',
                            theme === 'gold' ? 'text-yellow-400' : 'text-primary'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'font-medium truncate',
                            theme === 'gold' && 'text-yellow-100'
                          )}>
                            {repo.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {repo.owner?.login || repo.full_name.split('/')[0]}
                          </p>
                        </div>
                        <Github className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {results.users.length === 0 && results.repos.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <X className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No results found for &quot;{query}&quot;</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
