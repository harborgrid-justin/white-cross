/**
 * DashboardCard Component - Container for Dashboard Widgets
 *
 * A reusable card container for dashboard widgets with header, actions, and error boundary.
 *
 * @module components/features/dashboard/DashboardCard
 */

import React, { useState, useCallback, useMemo } from 'react';
import { MoreVertical, RefreshCw, X, Maximize2, Minimize2 } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void | Promise<void>;
  removable?: boolean;
  onRemove?: () => void;
  expandable?: boolean;
  actions?: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DashboardCard Component
 *
 * Features:
 * - Header with title and actions
 * - Collapsible content
 * - Refresh capability
 * - Remove option
 * - Expand/minimize
 * - Loading state
 * - Error boundary
 * - Dark mode support
 */
export const DashboardCard = React.memo<DashboardCardProps>(({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  darkMode = false,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
  refreshable = false,
  onRefresh,
  removable = false,
  onRemove,
  expandable = false,
  actions
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing && !loading) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [onRefresh, isRefreshing, loading]);

  // Theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600',
    button: darkMode
      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    menuBg: darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
  }), [darkMode]);

  return (
    <div
      className={`rounded-lg border shadow-sm transition-all duration-200 ${
        isExpanded ? 'fixed inset-4 z-50' : ''
      } ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            {subtitle && (
              <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Custom Actions */}
            {actions}

            {/* Refresh Button */}
            {refreshable && onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className={`p-2 rounded-md transition-colors ${themeClasses.button} disabled:opacity-50`}
                aria-label="Refresh"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`}
                />
              </button>
            )}

            {/* Expand/Minimize Button */}
            {expandable && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 rounded-md transition-colors ${themeClasses.button}`}
                aria-label={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* More Actions Menu */}
            {(collapsible || removable) && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className={`p-2 rounded-md transition-colors ${themeClasses.button}`}
                  aria-label="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <div
                      className={`absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg border z-20 ${themeClasses.menuBg}`}
                    >
                      <div className="py-1">
                        {collapsible && (
                          <button
                            onClick={() => {
                              setIsCollapsed(!isCollapsed);
                              setShowActions(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors ${themeClasses.button}`}
                          >
                            {isCollapsed ? 'Expand' : 'Collapse'}
                          </button>
                        )}
                        {removable && onRemove && (
                          <button
                            onClick={() => {
                              onRemove();
                              setShowActions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className={`${isExpanded ? 'overflow-auto' : ''}`}>
          {/* Loading State */}
          {loading && (
            <div className="p-6 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className={`text-sm ${themeClasses.subtitle}`}>Loading...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                Error loading content
              </p>
              <p className={`text-sm ${themeClasses.subtitle}`}>{error}</p>
            </div>
          )}

          {/* Card Content */}
          {!loading && !error && children}
        </div>
      )}
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
