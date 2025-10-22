/**
 * WF-DASH-005 | QuickActionButton.tsx - Quick Action Button Component
 * Purpose: Individual action button for dashboard quick actions
 * Upstream: QuickActions component | Dependencies: React, Tailwind CSS
 * Downstream: Navigation, action execution | Called by: QuickActions
 * Related: Dashboard navigation, user workflows
 * Exports: QuickActionButton component | Key Features: Icon display, badges, hover states
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: User click → Action execution → System response
 * LLM Context: Action button for White Cross healthcare dashboard
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

// ============================================================================
// TYPES
// ============================================================================

interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  badge?: string | number;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  description,
  icon,
  color = 'blue',
  badge,
  disabled = false,
  loading = false,
  onClick,
  className = ''
}) => {
  // ============================================================================
  // STYLES
  // ============================================================================

  const colorVariants = {
    blue: {
      bg: 'bg-blue-50 hover:bg-blue-100',
      icon: 'text-blue-600',
      border: 'border-blue-200 hover:border-blue-300'
    },
    green: {
      bg: 'bg-green-50 hover:bg-green-100',
      icon: 'text-green-600',
      border: 'border-green-200 hover:border-green-300'
    },
    orange: {
      bg: 'bg-orange-50 hover:bg-orange-100',
      icon: 'text-orange-600',
      border: 'border-orange-200 hover:border-orange-300'
    },
    red: {
      bg: 'bg-red-50 hover:bg-red-100',
      icon: 'text-red-600',
      border: 'border-red-200 hover:border-red-300'
    },
    purple: {
      bg: 'bg-purple-50 hover:bg-purple-100',
      icon: 'text-purple-600',
      border: 'border-purple-200 hover:border-purple-300'
    }
  };

  const variant = colorVariants[color];

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'group text-left w-full',
        disabled || loading
          ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
          : cn(variant.bg, variant.border, 'hover:shadow-sm cursor-pointer'),
        className
      )}
    >
      {/* Badge */}
      {badge && !loading && (
        <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 z-10">
          {badge}
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'flex items-center justify-center w-8 h-8 mb-3',
        disabled || loading ? 'text-gray-400' : variant.icon
      )}>
        {loading ? (
          <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          icon
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className={cn(
          'font-medium text-sm leading-tight',
          disabled || loading ? 'text-gray-400' : 'text-gray-900 group-hover:text-gray-800'
        )}>
          {title}
        </h3>
        
        <p className={cn(
          'text-xs leading-tight line-clamp-2',
          disabled || loading ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-500'
        )}>
          {description}
        </p>
      </div>
    </button>
  );
};

export default QuickActionButton;
