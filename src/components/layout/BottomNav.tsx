'use client';

import { motion } from 'framer-motion';
import { Home, Search, Bookmark, Trophy, User } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'compare', icon: Trophy, label: 'Compare' },
  { id: 'bookmarks', icon: Bookmark, label: 'Saved' },
];

export function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const { theme } = useTheme();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'glass border-t border-border/50',
        'md:hidden',
        theme === 'gold' && 'border-yellow-500/20'
      )}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl',
                'transition-all duration-300',
                isActive 
                  ? theme === 'gold'
                    ? 'text-yellow-400'
                    : 'text-primary'
                  : 'text-muted-foreground'
              )}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className={cn(
                      'absolute -bottom-1 left-1/2 -translate-x-1/2',
                      'w-1 h-1 rounded-full',
                      theme === 'gold' ? 'bg-yellow-400' : 'bg-primary'
                    )}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
