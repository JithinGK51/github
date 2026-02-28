'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className,
  suffix = '',
  prefix = ''
}: AnimatedCounterProps) {
  const [isClient, setIsClient] = useState(false);
  
  const spring = useSpring(0, { 
    duration: duration * 1000,
    bounce: 0
  });
  
  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    setIsClient(true);
    spring.set(value);
  }, [spring, value]);

  if (!isClient) {
    return (
      <span className={className}>
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    );
  }

  return (
    <span className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
