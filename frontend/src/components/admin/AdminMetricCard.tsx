'use client';

/**
 * AdminMetricCard Component
 *
 * Displays key metrics and statistics in the admin dashboard.
 * Now with dark mode support and semantic design tokens.
 *
 * @module components/admin/AdminMetricCard
 * @since 2025-10-26
 * @updated 2025-11-04 - Added dark mode support
 */

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    direction: 'up' | 'down';
    positive?: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  onClick?: () => void;
  className?: string;
}

/**
 * Color classes using semantic tokens for consistent light/dark mode support
 */
const colorClasses = {
  primary: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    text: 'text-primary dark:text-primary',
    border: 'border-primary/20 dark:border-primary/30',
  },
  success: {
    bg: 'bg-success/10 dark:bg-success/20',
    text: 'text-success dark:text-success',
    border: 'border-success/20 dark:border-success/30',
  },
  warning: {
    bg: 'bg-warning/10 dark:bg-warning/20',
    text: 'text-warning dark:text-warning',
    border: 'border-warning/20 dark:border-warning/30',
  },
  error: {
    bg: 'bg-error/10 dark:bg-error/20',
    text: 'text-error dark:text-error',
    border: 'border-error/20 dark:border-error/30',
  },
  info: {
    bg: 'bg-info/10 dark:bg-info/20',
    text: 'text-info dark:text-info',
    border: 'border-info/20 dark:border-info/30',
  },
  secondary: {
    bg: 'bg-secondary/10 dark:bg-secondary/20',
    text: 'text-secondary dark:text-secondary',
    border: 'border-secondary/20 dark:border-secondary/30',
  },
} as const;

export function AdminMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  onClick,
  className = '',
}: AdminMetricCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        // Base card styles with dark mode support
        'bg-card dark:bg-card text-card-foreground rounded-lg shadow-card dark:shadow-none',
        'border border-border dark:border-border/50',
        'p-6 transition-all duration-200',
        // Interactive styles
        onClick && 'cursor-pointer hover:shadow-card-hover dark:hover:border-border',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-secondary dark:text-muted-foreground mb-2">
            {title}
          </p>

          {/* Value */}
          <p className="text-3xl font-bold text-foreground dark:text-foreground">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-tertiary dark:text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-sm font-medium',
                trend.positive !== undefined
                  ? trend.positive
                    ? 'text-success dark:text-success'
                    : 'text-error dark:text-error'
                  : trend.direction === 'up'
                  ? 'text-success dark:text-success'
                  : 'text-error dark:text-error'
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={cn('p-3 rounded-lg', colors.bg)}>
          <Icon className={cn('h-6 w-6', colors.text)} />
        </div>
      </div>
    </div>
  );
}
