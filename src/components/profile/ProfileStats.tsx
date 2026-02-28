'use client';

import { motion } from 'framer-motion';
import { GitBranch, Users, Star, Eye } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubUser } from '@/types';

interface ProfileStatsProps {
  user: GitHubUser;
}

const stats = [
  { key: 'public_repos', label: 'Repositories', icon: GitBranch },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'following', label: 'Following', icon: Users },
  { key: 'public_gists', label: 'Gists', icon: Eye },
] as const;

export function ProfileStats({ user }: ProfileStatsProps) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const value = user[stat.key as keyof GitHubUser] as number;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard
              className={cn(
                'p-4 md:p-6 text-center',
                theme === 'gold' && 'gold:shine-effect'
              )}
              delay={index * 0.1}
            >
              <div className={cn(
                'w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center',
                'bg-secondary',
                theme === 'gold' && 'bg-yellow-500/10'
              )}>
                <Icon className={cn(
                  'w-5 h-5',
                  theme === 'gold' ? 'text-yellow-400' : 'text-primary'
                )} />
              </div>
              <AnimatedCounter
                value={value}
                className={cn(
                  'text-2xl md:text-3xl font-bold',
                  theme === 'gold' && 'gold:glow-text'
                )}
              />
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
