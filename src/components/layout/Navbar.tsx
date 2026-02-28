'use client';

import { motion } from 'framer-motion';
import { Search, Command, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onSearchClick?: () => void;
  onBookmarksClick?: () => void;
}

export function Navbar({ onSearchClick, onBookmarksClick }: NavbarProps) {
  const { theme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        'glass border-b border-border/50',
        theme === 'gold' && 'gold:shine-effect'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={cn(
              'relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300',
              theme === 'gold' 
                ? 'ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                : 'ring-2 ring-primary/20'
            )}>
              <Image
                src="/logo.jpg"
                alt="GitHub Explorer Logo"
                fill
                className="object-cover"
                priority
              />
              {theme === 'gold' && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(255, 215, 0, 0)',
                      '0 0 20px rgba(255, 215, 0, 0.5)',
                      '0 0 0px rgba(255, 215, 0, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="hidden sm:block">
              <span className={cn(
                'font-bold text-lg tracking-tight',
                theme === 'gold' && 'gold:glow-text gold-gradient bg-clip-text text-transparent'
              )}>
                GitHub Explorer
              </span>
              <span className="text-xs text-muted-foreground ml-1">Pro</span>
            </div>
          </motion.a>

          {/* Center Actions */}
          <div className="flex items-center gap-2">
            <MagneticButton
              onClick={onSearchClick}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-secondary/50 hover:bg-secondary',
                'border border-border/50',
                'transition-all duration-300',
                theme === 'gold' && 'gold:shine-effect border-yellow-500/30'
              )}
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="hidden md:block text-sm text-muted-foreground">Search...</span>
              <kbd className={cn(
                'hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-xs',
                'bg-background border border-border',
                theme === 'gold' && 'border-yellow-500/30'
              )}>
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </MagneticButton>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <MagneticButton
              onClick={onBookmarksClick}
              className={cn(
                'p-2 rounded-full',
                'hover:bg-secondary transition-colors',
                theme === 'gold' && 'hover:bg-yellow-500/10'
              )}
            >
              <Bookmark className="w-5 h-5" />
            </MagneticButton>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
