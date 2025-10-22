/**
 * WF-DASH-003 | StatsWidget.tsx - Statistics Widget Component
 * Purpose: Reusable widget for displaying individual statistics with icons and trends
 * Upstream: Dashboard components | Dependencies: React, Tailwind CSS
 * Downstream: Dashboard stats display | Called by: DashboardStats, other dashboard components
 * Related: Dashboard metrics, data visualization
 * Exports: StatsWidget component | Key Features: Icon display, trend indicators, color variants
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Data input → Visual formatting → User comprehension
 * LLM Context: Reusable stats widget for White Cross healthcare dashboard
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// ============================================================================
// TYPES
// ============================================================================

interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
  description?: string;
  trend?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  description,
  trend,
  onClick,
  loading = false,
  className = ''
}) => {
  // ============================================================================
  // STYLES
  // ============================================================================

  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-100'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      border: 'border-orange-100'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      border: 'border-red-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      border: 'border-gray-100'
    }
  };

  const variant = colorVariants[color];

  // ============================================================================
  // RENDER
  // ============================================================================

  const content = (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm p-6 transition-all duration-200',
      onClick && 'cursor-pointer hover:shadow-md hover:border-gray-300',
      loading && 'opacity-50 pointer-events-none',
      className
    )}>
      {/* Header with Icon and Trend */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg',
          variant.bg,
          variant.border,
          'border'
        )}>
          <div className={variant.icon}>
            {loading ? (
              <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              icon
            )}
          </div>
        </div>
        {trend && (
          <div className="text-right">
            {trend}
          </div>
        )}
      </div>

      {/* Value and Title */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {loading ? '--' : value}
          </h3>
        </div>
        
        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>
        
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        disabled={loading}
      >
        {content}
      </button>
    );
  }

  return content;
};

export default StatsWidget;
