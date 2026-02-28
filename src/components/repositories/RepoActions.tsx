'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Share2, 
  ExternalLink, 
  FolderTree,
  Copy,
  Check,
  X,
  Folder,
  FileCode,
  GitBranch,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { GitHubRepo } from '@/types';

// GitHub Token for API requests from environment variables
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

interface RepoActionsProps {
  repo: GitHubRepo;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileNode[];
}

interface Branch {
  name: string;
}

export function RepoActions({ repo }: RepoActionsProps) {
  const { theme } = useTheme();
  const [showFiles, setShowFiles] = useState(false);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState(repo.default_branch);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }
      
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/branches?per_page=100`,
        { headers }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setBranches(data.map((b: any) => ({ name: b.name })));
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setBranchesLoading(false);
    }
  };

  const fetchRepoFiles = async (branch?: string) => {
    setLoading(true);
    try {
      const branchToUse = branch || selectedBranch;
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
      }
      
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/git/trees/${branchToUse}?recursive=1`,
        { headers }
      );
      const data = await response.json();
      
      if (data.tree) {
        // Build file tree
        const root: FileNode[] = [];
        const pathMap = new Map<string, FileNode>();
        
        data.tree.forEach((item: any) => {
          const node: FileNode = {
            name: item.path.split('/').pop() || item.path,
            path: item.path,
            type: item.type === 'tree' ? 'dir' : 'file',
            children: item.type === 'tree' ? [] : undefined,
          };
          
          pathMap.set(item.path, node);
          
          const parentPath = item.path.split('/').slice(0, -1).join('/');
          if (parentPath) {
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          } else {
            root.push(node);
          }
        });
        
        setFiles(root);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [repo.full_name]);

  const handleShowFiles = () => {
    if (files.length === 0) {
      fetchRepoFiles();
    }
    setShowFiles(true);
  };

  const handleShare = async () => {
    const shareUrl = `${repo.html_url}/tree/${selectedBranch}`;
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareUrl);
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
      textArea.value = shareUrl;
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
        window.prompt('Copy this repository URL:', shareUrl);
      }
    } catch (err) {
      // Final fallback: Show the URL in a prompt for manual copying
      window.prompt('Copy this repository URL:', shareUrl);
    }
  };

  const handleDownload = () => {
    const url = `${repo.html_url}/archive/refs/heads/${selectedBranch}.zip`;
    // Force download using anchor element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${repo.name}-${selectedBranch}.zip`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // Small delay before removing to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName);
    // Refetch files if dialog is open
    if (showFiles) {
      fetchRepoFiles(branchName);
    }
  };

  return (
    <>
      {/* Branch Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'flex items-center gap-2',
                theme === 'gold' && 'border-yellow-500/30 hover:bg-yellow-500/10'
              )}
            >
              <GitBranch className="w-4 h-4" />
              <span className="max-w-[120px] truncate">{selectedBranch}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start"
            className={cn(
              'max-h-64 overflow-y-auto',
              theme === 'gold' && 'gold:glass-card border-yellow-500/30'
            )}
          >
            {branchesLoading ? (
              <DropdownMenuItem disabled>
                Loading branches...
              </DropdownMenuItem>
            ) : (
              branches.map((branch) => (
                <DropdownMenuItem
                  key={branch.name}
                  onClick={() => handleBranchChange(branch.name)}
                  className={cn(
                    'cursor-pointer',
                    selectedBranch === branch.name && 'bg-primary/10'
                  )}
                >
                  <GitBranch className="w-3 h-3 mr-2" />
                  {branch.name}
                  {selectedBranch === branch.name && (
                    <Check className="w-3 h-3 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <span className="text-xs text-muted-foreground">
          {branches.length > 0 && `${branches.length} branches`}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className={cn(
            theme === 'gold' && 'border-yellow-500/30 hover:bg-yellow-500/10'
          )}
        >
          <Download className="w-4 h-4 mr-2" />
          Download ZIP
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className={cn(
            theme === 'gold' && 'border-yellow-500/30 hover:bg-yellow-500/10'
          )}
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Share2 className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Share'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowFiles}
          className={cn(
            theme === 'gold' && 'border-yellow-500/30 hover:bg-yellow-500/10'
          )}
        >
          <FolderTree className="w-4 h-4 mr-2" />
          Files
        </Button>
        
        {(repo.homepage || repo.has_pages) && (
          <Button
            size="sm"
            className={cn(
              theme === 'gold'
                ? 'gold-gradient text-black hover:shadow-lg hover:shadow-yellow-500/30'
                : 'bg-primary text-primary-foreground'
            )}
            onClick={() => {
              const url = repo.homepage || (repo.owner ? `https://${repo.owner.login}.github.io/${repo.name}` : repo.html_url);
              window.location.href = url;
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </Button>
        )}
      </div>

      {/* File Explorer Dialog */}
      <Dialog open={showFiles} onOpenChange={setShowFiles}>
        <DialogContent className={cn(
          'max-w-2xl max-h-[80vh]',
          theme === 'gold' && 'gold:glass-card'
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              'flex items-center gap-2',
              theme === 'gold' && 'gold:glow-text'
            )}>
              <Folder className="w-5 h-5" />
              <div className="flex flex-col">
                <span>{repo.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Branch: {selectedBranch}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <FileTreeView files={files} theme={theme} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FileTreeView({ files, theme, level = 0 }: { files: FileNode[]; theme: string; level?: number }) {
  return (
    <div className={cn('space-y-1', level > 0 && 'ml-4 border-l border-border pl-2')}>
      {files.map((file) => (
        <motion.div
          key={file.path}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'flex items-center gap-2 p-2 rounded-lg',
            'hover:bg-secondary/50 transition-colors',
            theme === 'gold' && 'hover:bg-yellow-500/5'
          )}
        >
          {file.type === 'dir' ? (
            <Folder className={cn(
              'w-4 h-4',
              theme === 'gold' ? 'text-yellow-400' : 'text-blue-400'
            )} />
          ) : (
            <FileCode className={cn(
              'w-4 h-4',
              theme === 'gold' ? 'text-yellow-200' : 'text-muted-foreground'
            )} />
          )}
          <span className={cn(
            'text-sm',
            file.type === 'dir' && 'font-medium',
            theme === 'gold' && file.type === 'dir' && 'text-yellow-100'
          )}>
            {file.name}
          </span>
        </motion.div>
      ))}
      {files.length === 0 && (
        <p className="text-muted-foreground text-sm">No files found</p>
      )}
    </div>
  );
}
