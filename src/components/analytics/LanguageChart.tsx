'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import { getTopLanguages } from '@/lib/github';
import type { LanguageStats } from '@/types';

interface LanguageChartProps {
  languages: LanguageStats;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1'
];

const GOLD_COLORS = [
  '#FFD700', '#DAA520', '#B8860B', '#F4E4BC', '#CFB53B',
  '#C5B358', '#D4AF37', '#E6C200', '#F0E68C', '#BDB76B'
];

export function LanguageChart({ languages }: LanguageChartProps) {
  const { theme } = useTheme();
  
  const data = getTopLanguages(languages, 8);
  const chartColors = theme === 'gold' ? GOLD_COLORS : COLORS;

  if (data.length === 0) {
    return (
      <GlassCard className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No language data available</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={cn(theme === 'gold' && 'gold:shine-effect')}>
      <h3 className={cn(
        'text-lg font-semibold mb-4',
        theme === 'gold' && 'gold:glow-text'
      )}>
        Language Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className={cn(
                      'p-3 rounded-lg border shadow-lg',
                      'bg-card border-border',
                      theme === 'gold' && 'gold:glass-card border-yellow-500/30'
                    )}>
                      <p className={cn(
                        'font-medium',
                        theme === 'gold' && 'text-yellow-100'
                      )}>
                        {data.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.count} repos ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className={theme === 'gold' ? 'text-yellow-100' : ''}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
