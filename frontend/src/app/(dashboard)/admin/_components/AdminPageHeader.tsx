/**
 * @fileoverview Reusable Admin Page Header Component
 * @module app/(dashboard)/admin/_components/AdminPageHeader
 * @category Admin - Components
 */

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  actions?: ReactNode;
  status?: {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'info';
    icon?: ReactNode;
  };
}

/**
 * Reusable admin page header component with title, description, count, and actions.
 * Provides consistent styling and layout across admin pages.
 * 
 * @param props - Component props
 * @param props.title - Main page title
 * @param props.description - Optional page description  
 * @param props.count - Optional count to display
 * @param props.countLabel - Label for the count (e.g., "items", "users")
 * @param props.actions - Action buttons or controls
 * @param props.status - Optional status indicator
 * @returns Admin page header component
 */
export function AdminPageHeader({
  title,
  description,
  count,
  countLabel = 'items',
  actions,
  status
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
            {typeof count === 'number' && (
              <p className="text-sm text-gray-500 mt-1">
                {count} {countLabel}
              </p>
            )}
          </div>
          {status && (
            <Badge 
              variant={status.variant}
              className="flex items-center gap-1"
            >
              {status.icon}
              {status.label}
            </Badge>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
