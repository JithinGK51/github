'use client';

import { motion } from 'framer-motion';
import { MapPin, Building, Link as LinkIcon, Calendar, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubUser } from '@/types';

interface ProfileHeaderProps {
  user: GitHubUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'glass rounded-3xl p-6 md:p-8',
        'border border-border/50',
        theme === 'gold' && 'gold:glass-card gold:shine-effect'
      )}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-shrink-0"
        >
          <div className={cn(
            'relative',
            theme === 'gold' && 'animate-pulse-gold rounded-full p-1'
          )}>
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback className={cn(
                'text-2xl font-bold',
                theme === 'gold' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary/10'
              )}>
                {user.login.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {theme === 'gold' && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.3)',
                    '0 0 40px rgba(255, 215, 0, 0.6)',
                    '0 0 20px rgba(255, 215, 0, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className={cn(
              'text-2xl md:text-3xl font-bold truncate',
              theme === 'gold' && 'gold:glow-text'
            )}>
              {user.name || user.login}
            </h1>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'text-lg text-muted-foreground hover:text-primary transition-colors',
                theme === 'gold' && 'hover:text-yellow-400'
              )}
            >
              @{user.login}
            </a>
          </motion.div>

          {user.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-3 text-foreground/80 max-w-xl"
            >
              {user.bio}
            </motion.p>
          )}

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            {user.location && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{user.company}</span>
              </div>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors',
                  theme === 'gold' && 'hover:text-yellow-400'
                )}
              >
                <LinkIcon className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{user.blog}</span>
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors',
                  theme === 'gold' && 'hover:text-yellow-400'
                )}
              >
                <Twitter className="w-4 h-4" />
                <span>@{user.twitter_username}</span>
              </a>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
