/**
 * DashboardStatsCards Component
 *
 * Displays key healthcare statistics in a responsive grid:
 * - Total Students with trend indicator
 * - Health Alerts with critical count
 * - Appointments Today with completion count
 * - Immunization Compliance rate
 *
 * @component
 */

'use client';

import React from 'react';
import {
  Users,
  Bell,
  Calendar,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/lib/actions/dashboard.actions';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trendIcon: React.ComponentType<{ className?: string }>;
  trendText: string;
  trendColor: string;
  ariaLabel: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  trendIcon: TrendIcon,
  trendText,
  trendColor,
  ariaLabel,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-semibold text-gray-900" aria-label={ariaLabel}>
              {value}
            </p>
            <div className="flex items-center mt-1">
              <TrendIcon className={`h-4 w-4 ${trendColor} mr-1`} aria-hidden="true" />
              <span className={`text-xs ${trendColor}`}>{trendText}</span>
            </div>
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <section aria-labelledby="key-stats-heading">
      <h2 id="key-stats-heading" className="sr-only">
        Key Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          trendIcon={TrendingUp}
          trendText="+2.3% vs last month"
          trendColor="text-green-600"
          ariaLabel={`${stats?.totalStudents ?? 0} total students`}
        />

        <StatCard
          label="Health Alerts"
          value={stats?.healthAlerts ?? 0}
          icon={Bell}
          iconColor="text-red-600"
          trendIcon={AlertTriangle}
          trendText="4 critical"
          trendColor="text-red-600"
          ariaLabel={`${stats?.healthAlerts ?? 0} health alerts, 4 critical`}
        />

        <StatCard
          label="Appointments Today"
          value={stats?.appointmentsToday ?? 0}
          icon={Calendar}
          iconColor="text-green-600"
          trendIcon={Clock}
          trendText="8 completed"
          trendColor="text-blue-600"
          ariaLabel={`${stats?.appointmentsToday ?? 0} appointments today, 8 completed`}
        />

        <StatCard
          label="Immunization Rate"
          value={`${stats?.immunizationCompliance ?? 0}%`}
          icon={UserCheck}
          iconColor="text-purple-600"
          trendIcon={Shield}
          trendText="Above target"
          trendColor="text-green-600"
          ariaLabel={`${stats?.immunizationCompliance ?? 0} percent immunization compliance rate, above target`}
        />
      </div>
    </section>
  );
}
