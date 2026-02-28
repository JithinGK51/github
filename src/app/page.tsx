'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { CuteVideoLogo } from '@/components/shared/CuteVideoLogo';
import { SearchBar } from '@/components/search/SearchBar';
import { RecentSearches, addRecentSearch } from '@/components/search/RecentSearches';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { UserBadges } from '@/components/profile/UserBadges';
import { ShareProfile } from '@/components/profile/ShareProfile';
import { RepoList } from '@/components/repositories/RepoList';
import { LanguageChart } from '@/components/analytics/LanguageChart';
import { RepoStatsChart } from '@/components/analytics/RepoStatsChart';
import { AISummary } from '@/components/premium/AISummary';
import { StreakTracker } from '@/components/premium/StreakTracker';

import { useGitHubProfile } from '@/hooks/useGitHub';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { theme } = useTheme();
  
  const { user, repos, stats, loading, error } = useGitHubProfile(username);

  const handleSearch = useCallback((newUsername: string) => {
    setUsername(newUsername);
    addRecentSearch(newUsername);
  }, []);

  const handleSelectUser = useCallback((selectedUsername: string) => {
    setUsername(selectedUsername);
    addRecentSearch(selectedUsername);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      
      <Navbar 
        onSearchClick={() => setCommandPaletteOpen(true)}
      />
      
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onSelectUser={handleSelectUser}
      />

      <main className="pt-20 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <AnimatePresence mode="wait">
            {!user && !loading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[60vh] flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className={cn(
                    'relative w-20 h-20 rounded-2xl mb-6 overflow-hidden mx-auto',
                    'ring-2 ring-primary/20',
                    theme === 'gold' && 'ring-yellow-500/50 shadow-lg shadow-yellow-500/20'
                  )}>
                    <Image
                      src="/logo.jpg"
                      alt="GitHub Explorer Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <h1 className={cn(
                    'text-4xl md:text-5xl font-bold mb-4',
                    theme === 'gold' && 'gold:glow-text'
                  )}>
                    GitHub Profile Explorer
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Discover developer profiles, analyze repositories, and explore the world of open source
                  </p>
                </motion.div>

                <SearchBar onSearch={handleSearch} loading={loading} />
                <RecentSearches onSelect={handleSearch} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[60vh] flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className={cn(
                  'w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary',
                  theme === 'gold' && 'border-yellow-500/20 border-t-yellow-400'
                )}
              />
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[40vh] flex flex-col items-center justify-center"
            >
              <div className="text-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                  onClick={() => setUsername(null)}
                  className={cn(
                    'px-6 py-2 rounded-lg font-medium',
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                    theme === 'gold' && 'gold-gradient text-black'
                  )}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Profile Content */}
          {user && stats && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Back to Search & Share */}
              <div className="flex items-center justify-between">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setUsername(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to search
                </motion.button>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ShareProfile user={user} repos={repos} stats={stats} />
                </motion.div>
              </div>

              {/* Profile Header */}
              <ProfileHeader user={user} />

              {/* Stats */}
              <ProfileStats user={user} />

              {/* User Badges */}
              <UserBadges user={user} repos={repos} />

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LanguageChart languages={stats.languages} />
                <RepoStatsChart stats={stats} />
              </div>

              {/* Premium Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AISummary user={user} stats={stats} repos={repos} />
                <StreakTracker totalCommits={repos.length * 50} />
              </div>

              {/* Repository List */}
              <RepoList repos={repos} />
            </motion.div>
          )}
        </div>
      </main>

      <BottomNav />
      <CuteVideoLogo />
    </div>
  );
}
