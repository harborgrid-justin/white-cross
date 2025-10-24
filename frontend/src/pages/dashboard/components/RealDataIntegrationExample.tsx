/**
 * Real Data Integration Example
 * 
 * This example demonstrates how to integrate dashboard components with real backend data
 * using the existing TanStack Query architecture and actual available hooks.
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

// Import actual available services
import { 
  appointmentsApi,
  studentsApi,
  healthRecordsApi,
  medicationsApi,
  inventoryApi 
} from '@/services';

// Import available hooks
import { 
  useAppointmentsList,
  useUpcomingAppointments
} from '@/hooks';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

interface RealDataDashboardProps {
  className?: string;
  nurseId?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

/**
 * Custom hook for dashboard statistics using TanStack Query directly
 * This demonstrates how to create your own statistics hooks
 */
function useDashboardStatistics(filters?: { dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['dashboard-statistics', filters],
    queryFn: async () => {
      // Make parallel API calls for different statistics
      const [appointmentStats, inventoryAlerts, studentCount] = await Promise.all([
        appointmentsApi.getStatistics(filters),
        inventoryApi.getAlerts(),
        studentsApi.getAll({ page: 1, limit: 1 }) // Just to get total count
      ]);

      // Process and return dashboard data
      return {
        totalAppointments: appointmentStats.totalAppointments || 0,
        upcomingAppointments: appointmentStats.upcomingCount || 0,
        completedToday: appointmentStats.completedToday || 0,
        appointmentsTrend: appointmentStats.percentageChange || 0,
        
        totalStudents: studentCount.total || 0,
        studentsTrend: studentCount.trend || 0,

        criticalAlerts: inventoryAlerts.filter((alert: any) => alert.severity === 'critical').length || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Real Data Dashboard Component
 */
export function RealDataIntegrationExample({ className, nurseId, dateRange }: RealDataDashboardProps) {
  const { data: stats, isLoading, error, refetch } = useDashboardStatistics({
    dateFrom: dateRange?.startDate,
    dateTo: dateRange?.endDate,
  });

  const { data: upcomingAppointments } = useUpcomingAppointments({
    limit: 5,
    nurseId,
  });

  if (isLoading) {
    return (
      <div className={cn('p-6 space-y-4', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-6', className)}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error loading dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Appointments"
          value={stats?.totalAppointments ?? 0}
          trend={stats?.appointmentsTrend ?? 0}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          trend={stats?.studentsTrend ?? 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Completed Today"
          value={stats?.completedToday ?? 0}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Critical Alerts"
          value={stats?.criticalAlerts ?? 0}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments && upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-2">
            {upcomingAppointments.slice(0, 5).map((appointment: any) => (
              <div key={appointment.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{appointment.studentName}</p>
                  <p className="text-sm text-gray-500">{appointment.appointmentType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(appointment.scheduledAt).toLocaleTimeString()}</p>
                  <p className="text-xs text-gray-500">{appointment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'emerald' | 'red';
}

function StatCard({ title, value, trend, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend !== undefined && (
            <p className={cn('text-sm mt-1', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-full', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
