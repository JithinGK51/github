'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  totalCommits?: number;
}

export function StreakTracker({ totalCommits = 0 }: StreakTrackerProps) {
  const { theme } = useTheme();

  // Simulated streak data (in a real app, this would come from GitHub's contribution API)
  const currentStreak = Math.min(Math.floor(totalCommits / 10), 365);
  const longestStreak = Math.max(currentStreak, Math.floor(totalCommits / 8));
  const weeklyCommits = Math.floor(totalCommits / 52);

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: currentStreak,
      suffix: ' days',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: longestStreak,
      suffix: ' days',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Calendar,
      label: 'Total Commits',
      value: totalCommits,
      suffix: '',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Weekly Average',
      value: weeklyCommits,
      suffix: '',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <GlassCard className={cn(
      theme === 'gold' && 'gold:glass-card gold:shine-effect'
    )}>
      <div className="flex items-center gap-2 mb-6">
        <div className={cn(
          'p-2 rounded-lg',
          theme === 'gold' ? 'bg-yellow-500/20' : 'bg-orange-500/10'
        )}>
          <Flame className={cn(
            'w-5 h-5',
            theme === 'gold' ? 'text-yellow-400' : 'text-orange-500'
          )} />
        </div>
        <h3 className={cn(
          'text-lg font-semibold',
          theme === 'gold' && 'gold:glow-text'
        )}>
          Contribution Streak
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-4 rounded-xl text-center',
                'bg-secondary/30',
                theme === 'gold' && 'bg-yellow-500/5'
              )}
            >
              <div className={cn(
                'w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center',
                stat.bgColor,
                theme === 'gold' && 'bg-yellow-500/10'
              )}>
                <Icon className={cn(
                  'w-5 h-5',
                  theme === 'gold' ? 'text-yellow-400' : stat.color
                )} />
              </div>
              <AnimatedCounter
                value={stat.value}
                className={cn(
                  'text-2xl font-bold',
                  theme === 'gold' && 'gold:glow-text'
                )}
                suffix={stat.suffix}
              />
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={cn(
          'mt-4 p-3 rounded-xl text-center text-sm',
          'bg-gradient-to-r from-orange-500/10 to-yellow-500/10',
          theme === 'gold' && 'from-yellow-500/10 to-yellow-600/10'
        )}
      >
        {currentStreak > 30 ? (
          <span className={theme === 'gold' ? 'text-yellow-200' : 'text-orange-600'}>
            Incredible dedication! You&apos;re on fire!
          </span>
        ) : currentStreak > 7 ? (
          <span className={theme === 'gold' ? 'text-yellow-200' : 'text-orange-600'}>
            Great consistency! Keep the momentum going!
          </span>
        ) : (
          <span className="text-muted-foreground">
            Every commit counts. Start your streak today!
          </span>
        )}
      </motion.div>
    </GlassCard>
  );
}
