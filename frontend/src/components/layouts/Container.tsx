'use client';

/**
 * WF-COMP-LAY-002 | Container.tsx - Generic Page Container Component
 * Purpose: Responsive container wrapper for consistent layout spacing
 * Dependencies: react
 * Features: Configurable max-width, padding, centering, fluid option
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */

import React, { memo, ReactNode } from 'react';

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

/**
 * Props for Container component
 */
export interface ContainerProps {
  /** Content to be wrapped */
  children: ReactNode;
  /** Maximum width constraint */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  /** Horizontal padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'responsive';
  /** Vertical padding */
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
  /** Center the container */
  centered?: boolean;
  /** Fluid container (no max-width on mobile) */
  fluid?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** HTML element type */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside';
}

/**
 * Container component for consistent page layout.
 *
 * Provides a responsive container with configurable:
 * - Maximum width constraints
 * - Horizontal and vertical padding
 * - Centering options
 * - Fluid vs. constrained layouts
 * - Semantic HTML elements
 *
 * Max Width Options:
 * - xs: 20rem (320px) - Very narrow content
 * - sm: 24rem (384px) - Narrow forms
 * - md: 28rem (448px) - Standard forms
 * - lg: 32rem (512px) - Wide forms
 * - xl: 36rem (576px) - Content articles
 * - 2xl: 42rem (672px) - Wide content
 * - 3xl: 48rem (768px) - Standard pages
 * - 4xl: 56rem (896px) - Wide pages
 * - 5xl: 64rem (1024px) - Very wide pages
 * - 6xl: 72rem (1152px) - Dashboard layouts
 * - 7xl: 80rem (1280px) - Full-width layouts
 * - full: 100% - No constraint
 *
 * Padding Options:
 * - none: No padding
 * - sm: 0.5rem (8px)
 * - md: 1rem (16px)
 * - lg: 1.5rem (24px)
 * - responsive: Scales with breakpoints (default)
 *
 * Features:
 * - Mobile-first responsive design
 * - Dark mode support
 * - Semantic HTML element selection
 * - Flexible padding configuration
 * - Center or full-width alignment
 * - Fluid mobile breakpoint handling
 *
 * @param props - Component props
 * @param props.children - Content to wrap
 * @param props.maxWidth - Maximum width (default: '7xl')
 * @param props.padding - Horizontal padding (default: 'responsive')
 * @param props.paddingY - Vertical padding (default: 'md')
 * @param props.centered - Center align (default: true)
 * @param props.fluid - Fluid on mobile (default: false)
 * @param props.className - Additional CSS classes
 * @param props.as - HTML element (default: 'div')
 * @returns JSX element representing the container
 *
 * @example
 * ```tsx
 * // Standard page container
 * <Container>
 *   <PageHeader />
 *   <PageContent />
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * // Narrow form container
 * <Container maxWidth="md" paddingY="lg">
 *   <LoginForm />
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * // Full-width dashboard
 * <Container maxWidth="full" padding="none" as="main">
 *   <DashboardGrid />
 * </Container>
 * ```
 */
export const Container = memo(({
  children,
  maxWidth = '7xl',
  padding = 'responsive',
  paddingY = 'md',
  centered = true,
  fluid = false,
  className = '',
  as: Element = 'div',
}: ContainerProps) => {
  // Max width classes
  const maxWidthClasses: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  // Horizontal padding classes
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    responsive: 'px-4 sm:px-6 lg:px-8',
  };

  // Vertical padding classes
  const paddingYClasses: Record<string, string> = {
    none: '',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
  };

  // Build class string
  const containerClasses = [
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    paddingYClasses[paddingY],
    centered ? 'mx-auto' : '',
    fluid ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element className={containerClasses}>
      {children}
    </Element>
  );
});

Container.displayName = 'Container';

export default Container;
