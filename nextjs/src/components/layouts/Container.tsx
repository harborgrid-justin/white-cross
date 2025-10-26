/**
 * Container Component - Content container with consistent padding
 *
 * Features:
 * - Responsive max-width
 * - Consistent padding across breakpoints
 * - Optional full-width mode
 * - Dark mode support
 */

import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  noPadding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export function Container({
  children,
  className = '',
  maxWidth = '2xl',
  noPadding = false,
}: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full
        ${maxWidthClasses[maxWidth]}
        ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
