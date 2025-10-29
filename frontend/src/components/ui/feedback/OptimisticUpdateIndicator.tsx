'use client';

/**
 * WF-COMP-085 | OptimisticUpdateIndicator.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @/utils/optimisticUpdates
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: useState, useEffect, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Optimistic Update Indicator Component
 *
 * Visual indicator showing pending optimistic updates with status.
 * Displays a subtle badge/tag when updates are in progress.
 *
 * @module OptimisticUpdateIndicator
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { optimisticUpdateManager, UpdateStatus, OptimisticUpdate } from '@/utils/optimisticUpdates';

// =====================
// TYPES
// =====================

export interface OptimisticUpdateIndicatorProps {
  /** Query key to filter updates (optional) */
  queryKey?: string[];

  /** Position of the indicator */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Show details on hover */
  showDetails?: boolean;

  /** Custom className */
  className?: string;

  /** Show count of pending updates */
  showCount?: boolean;
}

// =====================
// COMPONENT
// =====================

/**
 * OptimisticUpdateIndicator - Shows pending optimistic updates
 *
 * @example
 * ```tsx
 * <OptimisticUpdateIndicator
 *   position="top-right"
 *   showDetails={true}
 *   showCount={true}
 * />
 * ```
 */
export const OptimisticUpdateIndicator: React.FC<OptimisticUpdateIndicatorProps> = ({
  queryKey,
  position = 'top-right',
  showDetails = true,
  className = '',
  showCount = true,
}) => {
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Update pending updates when they change
    const updatePending = () => {
      let updates = optimisticUpdateManager.getPendingUpdates();

      // Filter by query key if provided
      if (queryKey) {
        updates = updates.filter(update =>
          JSON.stringify(update.queryKey).includes(JSON.stringify(queryKey))
        );
      }

      setPendingUpdates(updates);
    };

    // Initial update
    updatePending();

    // Subscribe to changes
    const unsubscribe = optimisticUpdateManager.subscribe(() => {
      updatePending();
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [queryKey]);

  // Don't render if no pending updates
  if (pendingUpdates.length === 0) {
    return null;
  }

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Indicator Badge */}
      <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg">
        {/* Spinner */}
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        {/* Text */}
        <span className="text-sm font-medium">
          {showCount
            ? `${pendingUpdates.length} update${pendingUpdates.length !== 1 ? 's' : ''} pending`
            : 'Updating...'}
        </span>
      </div>

      {/* Tooltip with Details */}
      {showDetails && showTooltip && (
        <div className="absolute mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
          <div className="text-sm font-semibold text-gray-700 mb-2">Pending Updates</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pendingUpdates.map(update => (
              <div
                key={update.id}
                className="text-xs p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">
                    {update.operationType}
                  </span>
                  <StatusBadge status={update.status} />
                </div>
                <div className="text-gray-500 truncate">
                  {update.queryKey.join(' > ')}
                </div>
                <div className="text-gray-400 mt-1">
                  {getTimeAgo(update.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================
// HELPER COMPONENTS
// =====================

const StatusBadge: React.FC<{ status: UpdateStatus }> = ({ status }) => {
  const colors: Record<UpdateStatus, string> = {
    [UpdateStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [UpdateStatus.APPLIED]: 'bg-blue-100 text-blue-800',
    [UpdateStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [UpdateStatus.FAILED]: 'bg-red-100 text-red-800',
    [UpdateStatus.ROLLED_BACK]: 'bg-orange-100 text-orange-800',
    [UpdateStatus.CONFLICTED]: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

// =====================
// UTILITY FUNCTIONS
// =====================

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

