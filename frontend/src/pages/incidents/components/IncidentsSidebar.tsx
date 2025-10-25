/**
 * IncidentsSidebar Component
 *
 * Sidebar with quick filters, saved searches, recent incidents, and statistics summary.
 * Collapsible on mobile devices.
 *
 * @module components/incidents/IncidentsSidebar
 */

import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  Star,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Saved search item
 */
export interface SavedSearch {
  id: string;
  name: string;
  count?: number;
}

/**
 * Recent incident item
 */
export interface RecentIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
}

/**
 * Statistics data
 */
export interface IncidentStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  open: number;
  closed: number;
}

/**
 * Props for the IncidentsSidebar component.
 *
 * @property {() => void} [onQuickFilterClick] - Callback when a quick filter is clicked
 * @property {SavedSearch[]} [savedSearches] - List of saved searches
 * @property {RecentIncident[]} [recentIncidents] - List of recent incidents
 * @property {IncidentStats} [statistics] - Incident statistics summary
 * @property {string} [className] - Additional CSS classes
 */
export interface IncidentsSidebarProps {
  onQuickFilterClick?: (filter: string) => void;
  savedSearches?: SavedSearch[];
  recentIncidents?: RecentIncident[];
  statistics?: IncidentStats;
  className?: string;
}

/**
 * Severity badge component
 */
const SeverityBadge = memo(({ severity }: { severity: string }) => {
  const severityConfig = {
    critical: { icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' },
    high: { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    medium: { icon: AlertCircle, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    low: { icon: CheckCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' }
  };

  const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.low;
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', config.bg, config.color)}>
      <Icon className="h-3 w-3 mr-1" />
      {severity}
    </span>
  );
});

SeverityBadge.displayName = 'SeverityBadge';

/**
 * IncidentsSidebar - Sidebar with quick filters and recent activity
 *
 * Provides quick access to:
 * - Quick filter shortcuts (Critical, High Priority, Open, Closed)
 * - Saved searches with counts
 * - Recent incidents list
 * - Statistics summary
 * - Collapsible sections
 *
 * Features:
 * - Collapsible sections to manage sidebar density
 * - Quick filter buttons for common searches
 * - Saved searches with incident counts
 * - Recent incidents with severity badges
 * - Statistics overview
 * - Responsive design (full width on mobile)
 * - Dark mode support
 * - Accessible with ARIA labels
 *
 * @param props - Component props
 * @param props.onQuickFilterClick - Callback for quick filter clicks
 * @param props.savedSearches - Saved searches to display
 * @param props.recentIncidents - Recent incidents to display
 * @param props.statistics - Incident statistics
 * @param props.className - Additional CSS classes
 * @returns JSX element representing the incidents sidebar
 *
 * @example
 * ```tsx
 * <IncidentsSidebar
 *   onQuickFilterClick={(filter) => handleFilter(filter)}
 *   savedSearches={[
 *     { id: '1', name: 'My Incidents', count: 5 },
 *     { id: '2', name: 'Unassigned', count: 12 }
 *   ]}
 *   recentIncidents={[
 *     { id: '1', title: 'Student injury', severity: 'high', timestamp: '2025-10-25T10:00:00Z' }
 *   ]}
 *   statistics={{
 *     total: 150,
 *     critical: 5,
 *     high: 20,
 *     medium: 75,
 *     low: 50,
 *     open: 80,
 *     closed: 70
 *   }}
 * />
 * ```
 */
export const IncidentsSidebar = memo(({
  onQuickFilterClick,
  savedSearches = [],
  recentIncidents = [],
  statistics,
  className
}: IncidentsSidebarProps) => {
  const [quickFiltersExpanded, setQuickFiltersExpanded] = useState(true);
  const [savedSearchesExpanded, setSavedSearchesExpanded] = useState(true);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [statsExpanded, setStatsExpanded] = useState(true);

  const handleQuickFilter = useCallback((filter: string) => {
    onQuickFilterClick?.(filter);
  }, [onQuickFilterClick]);

  const quickFilters = [
    { id: 'critical', label: 'Critical', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
    { id: 'high', label: 'High Priority', icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400' },
    { id: 'open', label: 'Open', icon: XCircle, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-green-600 dark:text-green-400' }
  ];

  return (
    <div className={cn('incidents-sidebar space-y-4', className)}>
      {/* Quick Filters */}
      <section>
        <button
          onClick={() => setQuickFiltersExpanded(!quickFiltersExpanded)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-gray-700 dark:hover:text-gray-300"
          aria-expanded={quickFiltersExpanded}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Quick Filters
          </div>
          {quickFiltersExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {quickFiltersExpanded && (
          <div className="space-y-2">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleQuickFilter(filter.id)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 text-sm rounded-md',
                    'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700',
                    'transition-colors duration-200'
                  )}
                >
                  <Icon className={cn('h-4 w-4 mr-2', filter.color)} />
                  <span className="text-gray-900 dark:text-gray-100">{filter.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <section>
          <button
            onClick={() => setSavedSearchesExpanded(!savedSearchesExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-gray-700 dark:hover:text-gray-300"
            aria-expanded={savedSearchesExpanded}
          >
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Saved Searches
            </div>
            {savedSearchesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {savedSearchesExpanded && (
            <div className="space-y-1">
              {savedSearches.map((search) => (
                <Link
                  key={search.id}
                  to={`/incidents?search=${search.id}`}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">{search.name}</span>
                  {search.count !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      {search.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent Incidents */}
      {recentIncidents.length > 0 && (
        <section>
          <button
            onClick={() => setRecentExpanded(!recentExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-gray-700 dark:hover:text-gray-300"
            aria-expanded={recentExpanded}
          >
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent Incidents
            </div>
            {recentExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {recentExpanded && (
            <div className="space-y-2">
              {recentIncidents.slice(0, 5).map((incident) => (
                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                  className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {incident.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={incident.severity} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(incident.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Statistics Summary */}
      {statistics && (
        <section>
          <button
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-gray-700 dark:hover:text-gray-300"
            aria-expanded={statsExpanded}
          >
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </div>
            {statsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {statsExpanded && (
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Incidents</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{statistics.total}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-red-600 dark:text-red-400">Critical</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.critical}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-orange-600 dark:text-orange-400">High</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.high}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Medium</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.medium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400">Low</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.low}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Open</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.open}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Closed</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{statistics.closed}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
});

IncidentsSidebar.displayName = 'IncidentsSidebar';

export default IncidentsSidebar;
