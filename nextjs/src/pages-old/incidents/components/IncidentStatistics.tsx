/**
 * IncidentStatistics Component
 *
 * Production-grade statistics summary widget displaying key incident metrics.
 * Shows total, open, closed, and critical incidents with period-over-period comparison.
 *
 * @example
 * ```tsx
 * <IncidentStatistics
 *   stats={{
 *     total: 156,
 *     open: 23,
 *     closed: 133,
 *     critical: 5,
 *     previousPeriod: { total: 142, open: 18, closed: 124, critical: 3 }
 *   }}
 *   onStatClick={(type) => filterByStatus(type)}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { ArrowUpIcon, ArrowDownIcon, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export interface IncidentStats {
  total: number;
  open: number;
  closed: number;
  critical: number;
  previousPeriod?: {
    total: number;
    open: number;
    closed: number;
    critical: number;
  };
}

interface IncidentStatisticsProps {
  stats: IncidentStats;
  onStatClick?: (type: 'total' | 'open' | 'closed' | 'critical') => void;
  className?: string;
  loading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  change?: number;
  onClick?: () => void;
}

/**
 * Individual stat card component
 */
const StatCard: React.FC<StatCardProps> = React.memo(({
  label,
  value,
  icon,
  iconBgColor,
  iconColor,
  change,
  onClick
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>

          {change !== undefined && (
            <div className="mt-2 flex items-center">
              {isPositive && (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600 ml-1">
                    +{Math.abs(change).toFixed(1)}%
                  </span>
                </>
              )}
              {isNegative && (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600 ml-1">
                    {change.toFixed(1)}%
                  </span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-sm font-medium text-gray-500">
                  No change
                </span>
              )}
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          )}
        </div>

        <div className={`${iconBgColor} rounded-full p-3`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

/**
 * IncidentStatistics component - Displays key incident metrics
 *
 * Features:
 * - Four key metrics cards (total, open, closed, critical)
 * - Period-over-period comparison with percentage change
 * - Color-coded indicators (green for decrease, red for increase in incidents)
 * - Clickable cards to filter incidents
 * - Loading state support
 * - Responsive grid layout
 * - Accessible keyboard navigation
 */
const IncidentStatistics: React.FC<IncidentStatisticsProps> = React.memo(({
  stats,
  onStatClick,
  className = '',
  loading = false
}) => {
  // Calculate percentage changes
  const changes = useMemo(() => {
    if (!stats.previousPeriod) return {};

    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      total: calculateChange(stats.total, stats.previousPeriod.total),
      open: calculateChange(stats.open, stats.previousPeriod.open),
      closed: calculateChange(stats.closed, stats.previousPeriod.closed),
      critical: calculateChange(stats.critical, stats.previousPeriod.critical),
    };
  }, [stats]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`incident-statistics ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`incident-statistics ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Incidents"
          value={stats.total}
          icon={<AlertCircle className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          change={changes.total}
          onClick={onStatClick ? () => onStatClick('total') : undefined}
        />

        <StatCard
          label="Open Incidents"
          value={stats.open}
          icon={<Clock className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          change={changes.open}
          onClick={onStatClick ? () => onStatClick('open') : undefined}
        />

        <StatCard
          label="Closed Incidents"
          value={stats.closed}
          icon={<CheckCircle className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          change={changes.closed}
          onClick={onStatClick ? () => onStatClick('closed') : undefined}
        />

        <StatCard
          label="Critical Incidents"
          value={stats.critical}
          icon={<AlertTriangle className="h-6 w-6" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          change={changes.critical}
          onClick={onStatClick ? () => onStatClick('critical') : undefined}
        />
      </div>
    </div>
  );
});

IncidentStatistics.displayName = 'IncidentStatistics';

export default IncidentStatistics;
