'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  delay = 0 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -4, 
        transition: { duration: 0.2 } 
      } : undefined}
      className={cn(
        'glass rounded-2xl p-6',
        'border border-border/50',
        'transition-all duration-300',
        hover && 'hover:border-primary/30 hover:shadow-lg',
        glow && 'gold:animate-pulse-gold',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
