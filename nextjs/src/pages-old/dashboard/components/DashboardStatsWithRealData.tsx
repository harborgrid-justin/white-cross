/**
 * DashboardStats - Real Data Integration Example
 * 
 * This example shows how to integrate the DashboardStats component
 * with real backend data using TanStack Query hooks.
 */

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  Activity,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { StatsWidget } from './StatsWidget';

// Import the actual hooks for real data
import { 
  useAppointmentStatistics,
  useStudentStatistics,
  useHealthRecordsStatistics,
  useMedicationStatistics,
  useInventoryAlerts 
} from '@/hooks';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

interface DashboardStatsProps {
  className?: string;
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };
}

export function DashboardStatsWithRealData({ 
  className, 
  dateRange 
}: DashboardStatsProps) {
  // Real data hooks - replace mock data with actual API calls
  const { 
    data: appointmentStats, 
    isLoading: appointmentsLoading,
    error: appointmentsError 
  } = useAppointmentStatistics({
    dateFrom: dateRange?.startDate,
    dateTo: dateRange?.endDate
  });

  const { 
    data: studentStats, 
    isLoading: studentsLoading,
    error: studentsError 
  } = useStudentStatistics();

  const { 
    data: healthStats, 
    isLoading: healthLoading,
    error: healthError 
  } = useHealthRecordsStatistics({
    dateFrom: dateRange?.startDate,
    dateTo: dateRange?.endDate
  });

  const { 
    data: medicationStats, 
    isLoading: medicationsLoading,
    error: medicationsError 
  } = useMedicationStatistics();

  const { 
    data: inventoryAlerts, 
    isLoading: inventoryLoading,
    error: inventoryError 
  } = useInventoryAlerts();

  // Aggregate loading and error states
  const isLoading = appointmentsLoading || studentsLoading || 
                   healthLoading || medicationsLoading || inventoryLoading;

  const hasError = appointmentsError || studentsError || 
                  healthError || medicationsError || inventoryError;

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg border p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className={cn("bg-red-50 border border-red-200 rounded-lg p-6", className)}>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Unable to load dashboard statistics
            </h3>
            <p className="text-sm text-red-600 mt-1">
              Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate derived stats from real data
  const totalPatients = studentStats?.totalStudents || 0;
  const totalAppointments = appointmentStats?.totalAppointments || 0;
  const pendingTasks = healthStats?.pendingHealthScreenings || 0;
  const criticalAlerts = inventoryAlerts?.criticalAlerts || 0;
  const completedAppointments = appointmentStats?.completedAppointments || 0;
  const activeMedications = medicationStats?.activePrescriptions || 0;

  // Calculate trends (percentage change from previous period)
  const patientsTrend = studentStats?.trend || 0;
  const appointmentsTrend = appointmentStats?.trend || 0;
  const tasksTrend = healthStats?.screeningsTrend || 0;
  const alertsTrend = inventoryAlerts?.alertsTrend || 0;
  const completionsTrend = appointmentStats?.completionsTrend || 0;
  const medicationsTrend = medicationStats?.prescriptionsTrend || 0;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      <StatsWidget
        title="Total Patients"
        value={totalPatients}
        trend={patientsTrend}
        icon={Users}
        description="Active student patients"
        trendLabel={patientsTrend > 0 ? "increase from last month" : "decrease from last month"}
      />
      
      <StatsWidget
        title="Appointments"
        value={totalAppointments}
        trend={appointmentsTrend}
        icon={Calendar}
        description="Scheduled this month"
        trendLabel={appointmentsTrend > 0 ? "more than last month" : "fewer than last month"}
      />
      
      <StatsWidget
        title="Pending Tasks"
        value={pendingTasks}
        trend={tasksTrend}
        icon={ClipboardList}
        description="Health screenings due"
        trendLabel={tasksTrend > 0 ? "increase from last week" : "decrease from last week"}
        variant={pendingTasks > 20 ? "warning" : "default"}
      />
      
      <StatsWidget
        title="Critical Alerts"
        value={criticalAlerts}
        trend={alertsTrend}
        icon={AlertTriangle}
        description="Inventory & health alerts"
        trendLabel={alertsTrend > 0 ? "more than yesterday" : "fewer than yesterday"}
        variant={criticalAlerts > 0 ? "danger" : "success"}
      />
      
      <StatsWidget
        title="Completed Today"
        value={completedAppointments}
        trend={completionsTrend}
        icon={CheckCircle}
        description="Appointments completed"
        trendLabel={completionsTrend > 0 ? "above daily average" : "below daily average"}
        variant="success"
      />
      
      <StatsWidget
        title="Active Medications"
        value={activeMedications}
        trend={medicationsTrend}
        icon={Activity}
        description="Current prescriptions"
        trendLabel={medicationsTrend > 0 ? "new prescriptions" : "fewer active"}
      />
    </div>
  );
}
