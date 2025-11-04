/**
 * @fileoverview System Health Metrics Component - Displays key system health indicators
 * @module app/(dashboard)/admin/_components/SystemHealthMetrics
 * @category Admin - Components
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  Users,
  Database,
  Activity
} from 'lucide-react';
import type { SystemStats } from './admin-types';
import { formatNumber, formatBytes } from './admin-utils';

/**
 * Props for SystemHealthMetrics component
 */
interface SystemHealthMetricsProps {
  /** System statistics data */
  systemStats: SystemStats;
}

/**
 * Props for individual metric card
 */
interface MetricCardProps {
  /** Icon component to display */
  icon: React.ElementType;
  /** Background color class for icon container */
  iconBgColor: string;
  /** Icon color class */
  iconColor: string;
  /** Metric label */
  label: string;
  /** Primary metric value */
  value: string | number;
  /** Secondary metric description */
  subtitle: string;
}

/**
 * Individual metric card component
 * Displays a single system health metric with icon and values
 */
const MetricCard = React.memo<MetricCardProps>(({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  subtitle
}) => (
  <Card>
    <div className="p-6">
      <div className="flex items-center">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  </Card>
));

MetricCard.displayName = 'MetricCard';

/**
 * SystemHealthMetrics component
 *
 * Displays a grid of system health metrics including:
 * - System health percentage and uptime
 * - Active users count
 * - Storage usage percentage
 * - Response time and error rate
 *
 * @example
 * ```tsx
 * <SystemHealthMetrics systemStats={systemStats} />
 * ```
 */
export const SystemHealthMetrics = React.memo<SystemHealthMetricsProps>(({ systemStats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        label="System Health"
        value={`${systemStats.systemHealth}%`}
        subtitle={`Uptime: ${systemStats.uptime}`}
      />

      <MetricCard
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        label="Active Users"
        value={formatNumber(systemStats.activeUsers)}
        subtitle={`of ${formatNumber(systemStats.totalUsers)} total`}
      />

      <MetricCard
        icon={Database}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        label="Storage Usage"
        value={`${Math.round((systemStats.storageUsed / systemStats.storageTotal) * 100)}%`}
        subtitle={`${formatBytes(systemStats.storageUsed * 1024 * 1024 * 1024)} used`}
      />

      <MetricCard
        icon={Activity}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        label="Response Time"
        value={`${systemStats.responseTime}ms`}
        subtitle={`Error rate: ${systemStats.errorRate}%`}
      />
    </div>
  );
});

SystemHealthMetrics.displayName = 'SystemHealthMetrics';
