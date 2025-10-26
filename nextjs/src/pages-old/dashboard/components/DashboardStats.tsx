/**
 * WF-DASH-002 | DashboardStats.tsx - Dashboard Statistics Component
 * Purpose: Displays key healthcare metrics and statistics in card format
 * Upstream: Dashboard store, analytics API | Dependencies: React, Redux, UI components
 * Downstream: Dashboard overview | Called by: DashboardOverview
 * Related: StatsWidget, dashboard data
 * Exports: DashboardStats component | Key Features: Real-time stats, trend indicators
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Data fetch → Metric calculation → Visual display → User insights
 * LLM Context: Stats overview component for White Cross healthcare dashboard
 */

import React from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Heart,
  ClipboardList,
  UserCheck
} from 'lucide-react';

// Components
import { StatsWidget } from './StatsWidget';

// ============================================================================
// TYPES
// ============================================================================

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  description?: string;
}

interface DashboardStatsProps {
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  className = ''
}) => {
  // Mock data - in real app, this would come from Redux store
  const stats: StatItem[] = [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: '2,847',
      change: 12,
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      description: 'Active patients in the system'
    },
    {
      id: 'appointments-today',
      title: 'Today\'s Appointments',
      value: '24',
      change: -3,
      changeType: 'decrease',
      icon: <Calendar className="w-6 h-6" />,
      color: 'green',
      description: 'Scheduled for today'
    },
    {
      id: 'pending-tasks',
      title: 'Pending Tasks',
      value: '18',
      change: 5,
      changeType: 'increase',
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'orange',
      description: 'Requiring attention'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: '94%',
      change: 2,
      changeType: 'increase',
      icon: <UserCheck className="w-6 h-6" />,
      color: 'purple',
      description: 'Appointments completed'
    },
    {
      id: 'critical-alerts',
      title: 'Critical Alerts',
      value: '3',
      change: -2,
      changeType: 'decrease',
      icon: <Heart className="w-6 h-6" />,
      color: 'red',
      description: 'Requiring immediate attention'
    },
    {
      id: 'system-activity',
      title: 'System Activity',
      value: '87%',
      change: 0,
      changeType: 'neutral',
      icon: <Activity className="w-6 h-6" />,
      color: 'blue',
      description: 'Current system usage'
    }
  ];

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getTrendIcon = (changeType: StatItem['changeType']) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: StatItem['changeType']) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Overview Statistics</h2>
        <p className="text-gray-600">Key metrics for your healthcare facility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <StatsWidget
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
            trend={
              stat.change !== 0 ? (
                <div className={`flex items-center gap-1 ${getChangeColor(stat.changeType)}`}>
                  {getTrendIcon(stat.changeType)}
                  <span className="text-sm font-medium">
                    {Math.abs(stat.change)}%
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No change</span>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
