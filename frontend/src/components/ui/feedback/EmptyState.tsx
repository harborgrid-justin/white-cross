/**
 * EmptyState Component
 *
 * Reusable empty state component for inventory pages.
 * Displays helpful messaging and optional action button when no data is available.
 *
 * @module EmptyState
 */

import React from 'react';

export interface EmptyStateProps {
  /** Icon to display (emoji or SVG element) */
  icon?: React.ReactNode;
  /** Main title text */
  title: string;
  /** Description or helpful message */
  description?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyState component for displaying when no data is available
 *
 * @param props - EmptyState component props
 * @returns Rendered empty state UI
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="📦"
 *   title="No inventory items"
 *   description="Get started by adding your first inventory item"
 *   action={{
 *     label: "Add Item",
 *     onClick: () => navigate('/inventory/new')
 *   }}
 * />
 * ```
 */
export default function EmptyState({
  icon = '📦',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 text-6xl opacity-50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
