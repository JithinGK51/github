'use client';

import { motion } from 'framer-motion';
import { Sparkles, Code2, GitBranch, Star, Zap } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { getTopLanguages } from '@/lib/github';
import type { GitHubUser, RepoStats, GitHubRepo } from '@/types';

interface AISummaryProps {
  user: GitHubUser;
  stats: RepoStats;
  repos: GitHubRepo[];
}

export function AISummary({ user, stats, repos }: AISummaryProps) {
  const { theme } = useTheme();

  // Generate insights
  const topLanguages = getTopLanguages(stats.languages, 3);
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const mostStarredRepo = repos.reduce((max, repo) => 
    repo.stargazers_count > max.stargazers_count ? repo : max, repos[0]
  );
  const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365));

  const insights = [
    {
      icon: Code2,
      title: 'Primary Languages',
      description: topLanguages.length > 0 
        ? `Specializes in ${topLanguages.map(l => l.name).join(', ')}`
        : 'No language data available',
    },
    {
      icon: GitBranch,
      title: 'Development Style',
      description: stats.forked > stats.original 
        ? 'Active contributor to open source projects'
        : 'Focuses on original project development',
    },
    {
      icon: Star,
      title: 'Community Impact',
      description: totalStars > 100 
        ? `Highly recognized with ${totalStars.toLocaleString()} total stars`
        : `Growing portfolio with ${totalStars} stars`,
    },
    {
      icon: Zap,
      title: 'Experience Level',
      description: accountAge > 5 
        ? `Veteran developer with ${accountAge} years on GitHub`
        : `Active developer for ${accountAge} years`,
    },
  ];

  return (
    <GlassCard className={cn(
      'relative overflow-hidden',
      theme === 'gold' && 'gold:glass-card gold:shine-effect'
    )}>
      {/* Background decoration */}
      {theme === 'gold' && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            'p-2 rounded-lg',
            theme === 'gold' ? 'bg-yellow-500/20' : 'bg-primary/10'
          )}>
            <Sparkles className={cn(
              'w-5 h-5',
              theme === 'gold' ? 'text-yellow-400' : 'text-primary'
            )} />
          </div>
          <h3 className={cn(
            'text-lg font-semibold',
            theme === 'gold' && 'gold:glow-text'
          )}>
            AI Profile Analysis
          </h3>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl',
                  'bg-secondary/30',
                  theme === 'gold' && 'bg-yellow-500/5'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  theme === 'gold' ? 'bg-yellow-500/10' : 'bg-secondary'
                )}>
                  <Icon className={cn(
                    'w-4 h-4',
                    theme === 'gold' ? 'text-yellow-400' : 'text-primary'
                  )} />
                </div>
                <div>
                  <h4 className={cn(
                    'font-medium text-sm',
                    theme === 'gold' && 'text-yellow-100'
                  )}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {mostStarredRepo && mostStarredRepo.stargazers_count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              'mt-4 p-4 rounded-xl',
              'bg-gradient-to-r from-primary/5 to-primary/10',
              theme === 'gold' && 'from-yellow-500/10 to-yellow-500/5'
            )}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Most Popular Repository
            </p>
            <a
              href={mostStarredRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'font-semibold hover:underline',
                theme === 'gold' && 'text-yellow-100'
              )}
            >
              {mostStarredRepo.name}
            </a>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Star className="w-3 h-3" />
              <span>{mostStarredRepo.stargazers_count.toLocaleString()} stars</span>
            </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}
