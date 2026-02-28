'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Clock, Rocket, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme/ThemeProvider';
import { RepoActions } from './RepoActions';
import { cn } from '@/lib/utils';
import { isDeployed, getDeploymentUrl, getRelativeTime } from '@/lib/github';
import type { GitHubRepo } from '@/types';

interface RepoCardProps {
  repo: GitHubRepo;
  index?: number;
}

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
};

export function RepoCard({ repo, index = 0 }: RepoCardProps) {
  const { theme } = useTheme();
  const deployed = isDeployed(repo);
  const deploymentUrl = getDeploymentUrl(repo);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={cn(
        'group glass rounded-2xl p-5',
        'border border-border/50',
        'hover:border-primary/30 transition-all duration-300',
        'select-none',
        theme === 'gold' && [
          'gold:glass-card hover:border-yellow-500/30',
          'gold:shine-effect'
        ]
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold text-lg truncate',
            theme === 'gold' && 'gold:glow-text'
          )}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repo.name}
            </a>
          </h3>
          {repo.fork && (
            <Badge variant="secondary" className="text-xs mt-1">
              Fork
            </Badge>
          )}
        </div>
        
        {deployed && deploymentUrl && (
          <Badge 
            className={cn(
              'bg-green-500/10 text-green-500 border-green-500/20 cursor-pointer hover:bg-green-500/20',
              theme === 'gold' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
            )}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = deploymentUrl;
            }}
          >
            <Rocket className="w-3 h-3 mr-1" />
            Published
          </Badge>
        )}
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {repo.description}
        </p>
      )}

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className={cn(
                'text-xs',
                theme === 'gold' && 'border-yellow-500/30 text-yellow-200'
              )}
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColors[repo.language] || '#888' }}
            />
            <span>{repo.language}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          <span>{repo.forks_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{getRelativeTime(repo.updated_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <RepoActions repo={repo} />
    </motion.div>
  );
}
