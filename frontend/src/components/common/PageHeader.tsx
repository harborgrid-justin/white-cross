'use client';

/**
 * PageHeader Component
 *
 * Ensures consistent heading hierarchy across all pages.
 * Each page should have exactly one h1 element for proper document structure.
 *
 * WCAG 2.1 Level A Compliance:
 * - 2.4.6 Headings and Labels (Level AA)
 * - Proper heading hierarchy for screen readers
 *
 * @component
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /**
   * The main page title (renders as h1)
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  description?: string;

  /**
   * Optional actions or buttons to display alongside the header
   */
  actions?: React.ReactNode;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to show a divider below the header
   * @default true
   */
  showDivider?: boolean;
}

/**
 * PageHeader Component
 *
 * Provides a consistent, accessible page header with proper heading hierarchy.
 * Should be used at the top of every page to ensure proper h1 usage.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PageHeader title="Students" />
 *
 * // With description
 * <PageHeader
 *   title="Student Health Records"
 *   description="Manage and view student health information"
 * />
 *
 * // With actions
 * <PageHeader
 *   title="Medications"
 *   description="Track and manage medication administration"
 *   actions={
 *     <Button>Add Medication</Button>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
  showDivider = true,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-base text-gray-600">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3 ml-4">
            {actions}
          </div>
        )}
      </div>
      {showDivider && (
        <div className="mt-4 border-b border-gray-200" />
      )}
    </div>
  );
}

/**
 * Section Header Component (h2)
 *
 * For section headings within a page.
 */
interface SectionHeaderProps {
  /**
   * The section title (renders as h2)
   */
  title: string;

  /**
   * Optional subtitle or description
   */
  description?: string;

  /**
   * Optional actions or buttons
   */
  actions?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Heading level (2-6)
   * @default 2
   */
  level?: 2 | 3 | 4 | 5 | 6;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  level = 2,
}: SectionHeaderProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const headingSizeClasses = {
    2: 'text-2xl font-semibold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
    5: 'text-base font-semibold',
    6: 'text-sm font-semibold',
  };

  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <Tag className={cn(headingSizeClasses[level], 'text-gray-900')}>
            {title}
          </Tag>
          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
