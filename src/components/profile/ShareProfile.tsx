'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Link, 
  Check,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubUser, GitHubRepo, RepoStats } from '@/types';

interface ShareProfileProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  stats: RepoStats;
}

export function ShareProfile({ user, repos, stats }: ShareProfileProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://github.com/${user.login}`;
  const shareText = `Check out ${user.name || user.login}'s GitHub profile with ${user.public_repos} repositories and ${user.followers} followers!`;

  const handleCopyLink = async () => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (error) {
        console.log('Clipboard API failed, trying fallback');
      }
    }
    
    // Fallback: Create temporary textarea and copy
    try {
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Final fallback: Show the URL in a prompt for manual copying
        window.prompt('Copy this profile URL:', profileUrl);
      }
    } catch (err) {
      // Final fallback: Show the URL in a prompt for manual copying
      window.prompt('Copy this profile URL:', profileUrl);
    }
  };

  const handleExportJSON = () => {
    const data = {
      user,
      repos: repos.slice(0, 10),
      stats,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}-github-profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            theme === 'gold' && 'border-yellow-500/30 hover:bg-yellow-500/10'
          )}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          'w-56',
          theme === 'gold' && 'gold:glass-card border-yellow-500/30'
        )}
      >
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Link className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleExportJSON} 
          className="cursor-pointer border-t border-border mt-1 pt-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
