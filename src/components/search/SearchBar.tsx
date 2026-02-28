'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [username, setUsername] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={cn(
        'relative flex items-center gap-2 p-2 rounded-2xl',
        'bg-card border-2 border-border/50',
        'focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10',
        'transition-all duration-300',
        theme === 'gold' && [
          'gold:glass-card',
          'focus-within:border-yellow-500/50 focus-within:ring-yellow-500/20',
          'gold:shine-effect'
        ]
      )}>
        <div className={cn(
          'relative w-12 h-12 rounded-xl overflow-hidden',
          'ring-2 ring-primary/20',
          theme === 'gold' && 'ring-yellow-500/50'
        )}>
          <Image
            src="/logo.jpg"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        
        <Input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={cn(
            'flex-1 border-0 bg-transparent text-lg',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-muted-foreground',
            theme === 'gold' && 'placeholder:text-yellow-600/50'
          )}
          disabled={loading}
        />

        <MagneticButton
          onClick={() => handleSubmit}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl font-medium',
            'transition-all duration-300',
            theme === 'gold'
              ? 'gold-gradient text-black hover:shadow-lg hover:shadow-yellow-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </MagneticButton>
      </div>
    </motion.form>
  );
}
