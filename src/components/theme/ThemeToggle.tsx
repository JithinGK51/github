'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const icons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    gold: <Sparkles className="h-5 w-5" />,
  };

  const labels = {
    light: 'Light',
    dark: 'Dark',
    gold: 'Gold',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full w-10 h-10 transition-all duration-300 hover:scale-110"
      aria-label={`Switch to ${labels[theme]} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {icons[theme]}
      </motion.div>
      
      {theme === 'gold' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 5px rgba(255, 215, 0, 0.5)',
              '0 0 20px rgba(255, 215, 0, 0.8)',
              '0 0 5px rgba(255, 215, 0, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </Button>
  );
}
