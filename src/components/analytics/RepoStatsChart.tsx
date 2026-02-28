'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts';
import { GlassCard } from '@/components/shared/GlassCard';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';
import type { RepoStats } from '@/types';

interface RepoStatsChartProps {
  stats: RepoStats;
}

export function RepoStatsChart({ stats }: RepoStatsChartProps) {
  const { theme } = useTheme();

  const data = [
    { name: 'Total', value: stats.total, color: theme === 'gold' ? '#FFD700' : '#3b82f6' },
    { name: 'Published', value: stats.deployed, color: theme === 'gold' ? '#22c55e' : '#22c55e' },
    { name: 'Forked', value: stats.forked, color: theme === 'gold' ? '#B8860B' : '#f59e0b' },
    { name: 'Original', value: stats.original, color: theme === 'gold' ? '#F4E4BC' : '#8b5cf6' },
  ];

  return (
    <GlassCard className={cn(theme === 'gold' && 'gold:shine-effect')}>
      <h3 className={cn(
        'text-lg font-semibold mb-4',
        theme === 'gold' && 'gold:glow-text'
      )}>
        Repository Overview
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme === 'gold' ? '#F4E4BC' : '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme === 'gold' ? '#F4E4BC' : '#64748b', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: theme === 'gold' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
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
                        {payload[0].payload.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payload[0].value} repositories
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              <LabelList 
                dataKey="value" 
                position="top" 
                fill={theme === 'gold' ? '#F4E4BC' : '#64748b'}
                fontSize={14}
                fontWeight={600}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
