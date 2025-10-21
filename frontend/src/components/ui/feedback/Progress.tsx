import React from 'react';
import { cn } from '../../../utils/cn';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    animate = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    const variantClasses = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    };

    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{displayLabel}</span>
          </div>
        )}
        <div
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantClasses[variant],
              animate && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

const CircularProgress = React.forwardRef<SVGSVGElement, Omit<ProgressProps, 'size'> & {
  size?: number;
  strokeWidth?: number;
}>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size = 48,
    strokeWidth = 4,
    variant = 'default',
    showLabel = false,
    label,
    animate = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantColors = {
      default: 'stroke-blue-600',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-600',
      error: 'stroke-red-600'
    };

    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)} {...props}>
        <svg
          ref={ref}
          className="transform -rotate-90"
          width={size}
          height={size}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-300 ease-out',
              variantColors[variant],
              animate && 'animate-pulse'
            )}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {displayLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animate?: boolean;
}>(
  ({ 
    className, 
    variant = 'rectangular',
    width,
    height,
    animate = true,
    ...props 
  }, ref) => {
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;
    
    // Default dimensions based on variant
    if (variant === 'text' && !height) style.height = '1em';
    if (variant === 'circular' && !width && !height) {
      style.width = '2.5rem';
      style.height = '2.5rem';
    }
    if (variant === 'rectangular' && !height) style.height = '1.25rem';

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200',
          variantClasses[variant],
          animate && 'animate-pulse',
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);

Progress.displayName = 'Progress';
CircularProgress.displayName = 'CircularProgress';
Skeleton.displayName = 'Skeleton';

export { 
  Progress, 
  CircularProgress, 
  Skeleton,
  type ProgressProps
};
