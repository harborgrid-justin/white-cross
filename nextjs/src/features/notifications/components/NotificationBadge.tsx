'use client';

import React from 'react';

export interface NotificationBadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
  className?: string;
}

/**
 * NotificationBadge Component
 *
 * Displays unread notification count badge
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  variant = 'danger',
  size = 'md',
  showZero = false,
  className = '',
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  const variantClasses = {
    default: 'bg-blue-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const sizeClasses = {
    sm: 'h-4 min-w-[1rem] text-[10px] px-1',
    md: 'h-5 min-w-[1.25rem] text-xs px-1.5',
    lg: 'h-6 min-w-[1.5rem] text-sm px-2',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-semibold
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  );
};
