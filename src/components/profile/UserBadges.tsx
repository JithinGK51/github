'use client';

import { motion } from 'framer-motion';
import { 
  Star, 
  GitBranch, 
  Trophy, 
  Flame, 
  Zap, 
  Award,
  Crown,
  Target,
  Rocket,
  Code2,
  Heart,
  Globe
} from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubUser, GitHubRepo } from '@/types';

interface UserBadgesProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  condition: (user: GitHubUser, repos: GitHubRepo[]) => boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const badges: Badge[] = [
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Has repositories with 100+ stars',
    icon: Star,
    condition: (user, repos) => repos.some(r => r.stargazers_count >= 100),
    tier: 'gold',
  },
  {
    id: 'repo-master',
    name: 'Repo Master',
    description: 'Has 50+ public repositories',
    icon: GitBranch,
    condition: (user) => user.public_repos >= 50,
    tier: 'platinum',
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Has 1000+ followers',
    icon: Trophy,
    condition: (user) => user.followers >= 1000,
    tier: 'gold',
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Has 5000+ followers',
    icon: Crown,
    condition: (user) => user.followers >= 5000,
    tier: 'platinum',
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Uses 5+ different languages',
    icon: Code2,
    condition: (user, repos) => {
      const langs = new Set(repos.map(r => r.language).filter(Boolean));
      return langs.size >= 5;
    },
    tier: 'silver',
  },
  {
    id: 'open-source',
    name: 'Open Source Hero',
    description: 'Has 10+ original repositories',
    icon: Heart,
    condition: (user, repos) => repos.filter(r => !r.fork).length >= 10,
    tier: 'silver',
  },
  {
    id: 'deployer',
    name: 'Deployer',
    description: 'Has 5+ deployed projects',
    icon: Rocket,
    condition: (user, repos) => repos.filter(r => r.homepage).length >= 5,
    tier: 'bronze',
  },
  {
    id: 'veteran',
    name: 'GitHub Veteran',
    description: 'Member for 5+ years',
    icon: Award,
    condition: (user) => {
      const years = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
      return years >= 5;
    },
    tier: 'gold',
  },
  {
    id: 'active',
    name: 'Active Contributor',
    description: 'Updated repos in the last month',
    icon: Flame,
    condition: (user, repos) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return repos.some(r => new Date(r.updated_at) > monthAgo);
    },
    tier: 'bronze',
  },
  {
    id: 'global',
    name: 'Global Developer',
    description: 'Has location and company info',
    icon: Globe,
    condition: (user) => !!(user.location && user.company),
    tier: 'bronze',
  },
];

const tierColors = {
  bronze: 'from-orange-600 to-amber-700',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-amber-600',
  platinum: 'from-cyan-400 to-blue-600',
};

const tierGlow = {
  bronze: 'shadow-orange-500/30',
  silver: 'shadow-slate-400/30',
  gold: 'shadow-yellow-400/30',
  platinum: 'shadow-cyan-400/30',
};

export function UserBadges({ user, repos }: UserBadgesProps) {
  const { theme } = useTheme();
  
  const earnedBadges = badges.filter(badge => badge.condition(user, repos));
  const lockedBadges = badges.filter(badge => !badge.condition(user, repos));

  return (
    <GlassCard className={cn(theme === 'gold' && 'gold:shine-effect')}>
      <div className="flex items-center gap-2 mb-4">
        <div className={cn(
          'p-2 rounded-lg',
          theme === 'gold' ? 'bg-yellow-500/20' : 'bg-primary/10'
        )}>
          <Award className={cn(
            'w-5 h-5',
            theme === 'gold' ? 'text-yellow-400' : 'text-primary'
          )} />
        </div>
        <h3 className={cn(
          'text-lg font-semibold',
          theme === 'gold' && 'gold:glow-text'
        )}>
          Achievements
        </h3>
        <span className="ml-auto text-sm text-muted-foreground">
          {earnedBadges.length} / {badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* Earned Badges */}
        {earnedBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group relative"
            >
              <div className={cn(
                'flex flex-col items-center p-3 rounded-xl',
                'bg-gradient-to-br',
                tierColors[badge.tier],
                'text-white shadow-lg',
                tierGlow[badge.tier],
                theme === 'gold' && 'ring-1 ring-yellow-400/50'
              )}>
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium text-center leading-tight">
                  {badge.name}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-3 py-2 rounded-lg text-xs',
                'bg-popover text-popover-foreground',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'pointer-events-none whitespace-nowrap z-10',
                'shadow-lg border border-border',
                theme === 'gold' && 'gold:glass-card border-yellow-500/30'
              )}>
                {badge.description}
                <div className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2',
                  'border-4 border-transparent border-t-popover'
                )} />
              </div>
            </motion.div>
          );
        })}
        
        {/* Locked Badges */}
        {lockedBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (earnedBadges.length + index) * 0.05 }}
              className="group relative"
            >
              <div className={cn(
                'flex flex-col items-center p-3 rounded-xl',
                'bg-muted/50 border border-border/50',
                'text-muted-foreground',
                'grayscale opacity-60'
              )}>
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium text-center leading-tight">
                  {badge.name}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className={cn(
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
                'px-3 py-2 rounded-lg text-xs',
                'bg-popover text-popover-foreground',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'pointer-events-none whitespace-nowrap z-10',
                'shadow-lg border border-border',
                theme === 'gold' && 'gold:glass-card border-yellow-500/30'
              )}>
                🔒 {badge.description}
                <div className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2',
                  'border-4 border-transparent border-t-popover'
                )} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
