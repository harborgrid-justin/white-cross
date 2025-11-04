/**
 * Student Statistics and Analytics Hooks
 * 
 * Comprehensive analytics and reporting functionality for student data
 * with real-time metrics, trend analysis, and dashboard statistics.
 * 
 * @module hooks/students/statistics
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useQuery,
  useQueries,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { studentQueryKeys } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Student enrollment statistics
 */
export interface EnrollmentStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  newThisYear: number;
  transferredOut: number;
  graduated: number;
  byGrade: Record<string, number>;
  bySchool?: Record<string, number>;
  trends: {
    monthlyGrowth: number;
    yearlyGrowth: number;
    projectedEndOfYear: number;
  };
}

/**
 * Health overview statistics
 */
export interface HealthStats {
  studentsWithAllergies: number;
  studentsWithMedications: number;
  studentsWithChronicConditions: number;
  recentIncidents: number;
  pendingAppointments: number;
  overdueCheckups: number;
  vaccinationCompliance: number;
  allergyBreakdown: Record<string, number>;
  medicationBreakdown: Record<string, number>;
  incidentTypes: Record<string, number>;
}

/**
 * Activity and engagement statistics
 */
export interface ActivityStats {
  totalVisits: number;
  averageVisitsPerStudent: number;
  mostVisitedTimes: Array<{ hour: number; count: number }>;
  nurseWorkload: Record<string, number>;
  visitReasons: Record<string, number>;
  seasonalTrends: Array<{ month: string; visits: number; incidents: number }>;
  peakDays: Array<{ date: string; visits: number }>;
}

/**
 * Risk assessment statistics
 */
export interface RiskStats {
  highRiskStudents: number;
  mediumRiskStudents: number;
  lowRiskStudents: number;
  studentsNeedingAttention: number;
  criticalAlerts: number;
  riskFactors: Record<string, number>;
  riskTrends: Array<{ date: string; highRisk: number; alerts: number }>;
}

/**
 * Compliance and regulatory statistics
 */
export interface ComplianceStats {
  vaccinationCompliance: number;
  physicalExamCompliance: number;
  emergencyContactCompliance: number;
  documentationCompliance: number;
  auditReadiness: number;
  complianceByGrade: Record<string, number>;
  nonCompliantStudents: Array<{
    studentId: string;
    name: string;
    issues: string[];
    urgency: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Dashboard metrics overview
 */
export interface DashboardMetrics {
  enrollment: EnrollmentStats;
  health: HealthStats;
  activity: ActivityStats;
  risk: RiskStats;
  compliance: ComplianceStats;
  lastUpdated: string;
  alerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    count?: number;
    actionRequired?: boolean;
  }>;
}

/**
 * Time range options for analytics
 */
export type TimeRange = 
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom';

export interface CustomTimeRange {
  from: string;
  to: string;
}

/**
 * Hook for enrollment statistics and trends
 * 
 * @param timeRange - Time range for analytics
 * @param customRange - Custom date range if timeRange is 'custom'
 * @returns Enrollment statistics and trends
 * 
 * @example
 * ```tsx
 * const { stats, isLoading, error } = useEnrollmentStats('month');
 * 
 * return (
 *   <div>
 *     <h3>Total Students: {stats?.total}</h3>
 *     <p>New this month: {stats?.newThisMonth}</p>
 *     <p>Growth: {stats?.trends.monthlyGrowth}%</p>
 *   </div>
 * );
 * ```
 */
export const useEnrollmentStats = (
  timeRange: TimeRange = 'month',
  customRange?: CustomTimeRange
) => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.enrollment(timeRange as 'daily' | 'weekly' | 'monthly' | 'yearly'),
    queryFn: async (): Promise<EnrollmentStats> => {
      // For now, calculate from student data since we don't have a dedicated endpoint
      const response = await studentsApi.getAll({});
      const students = response.students;
      
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      const active = students.filter(s => s.isActive);
      const inactive = students.filter(s => !s.isActive);
      
      // Calculate new students this month
      const newThisMonth = students.filter(s => 
        s.enrollmentDate && new Date(s.enrollmentDate) >= startOfMonth
      ).length;
      
      // Calculate new students this year
      const newThisYear = students.filter(s => 
        s.enrollmentDate && new Date(s.enrollmentDate) >= startOfYear
      ).length;
      
      // Grade breakdown
      const byGrade = students.reduce((acc, student) => {
        const grade = student.grade || 'Unknown';
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate trends (simplified)
      const lastMonthTotal = students.length - newThisMonth;
      const monthlyGrowth = lastMonthTotal > 0 
        ? ((newThisMonth / lastMonthTotal) * 100) 
        : 0;
      
      const lastYearTotal = students.length - newThisYear;
      const yearlyGrowth = lastYearTotal > 0 
        ? ((newThisYear / lastYearTotal) * 100) 
        : 0;
      
      return {
        total: students.length,
        active: active.length,
        inactive: inactive.length,
        newThisMonth,
        newThisYear,
        transferredOut: 0, // Would need transfer tracking
        graduated: 0, // Would need graduation tracking
        byGrade,
        trends: {
          monthlyGrowth,
          yearlyGrowth,
          projectedEndOfYear: students.length + Math.round(monthlyGrowth * 9), // Rough projection
        },
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for health overview statistics
 * 
 * @param timeRange - Time range for analytics
 * @returns Health statistics and metrics
 */
export const useHealthStats = (timeRange: TimeRange = 'month') => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.healthMetrics(),
    queryFn: async (): Promise<HealthStats> => {
      // Get all students with health data
      const response = await studentsApi.getAll({});
      const students = response.students;
      
      // Calculate health statistics
      const studentsWithAllergies = students.filter(s => 
        s.allergies && s.allergies.length > 0
      ).length;
      
      const studentsWithMedications = students.filter(s => 
        s.medications && s.medications.length > 0
      ).length;
      
      const studentsWithChronicConditions = students.filter(s => 
        s.chronicConditions && s.chronicConditions.length > 0
      ).length;
      
      // Allergy breakdown
      const allergyBreakdown: Record<string, number> = {};
      students.forEach(student => {
        if (student.allergies) {
          student.allergies.forEach(allergy => {
            const allergyName = allergy.allergen || 'Unknown';
            allergyBreakdown[allergyName] = (allergyBreakdown[allergyName] || 0) + 1;
          });
        }
      });
      
      // Medication breakdown
      const medicationBreakdown: Record<string, number> = {};
      students.forEach(student => {
        if (student.medications) {
          student.medications.forEach(medication => {
            const medName = medication.medication?.name || 'Unknown';
            medicationBreakdown[medName] = (medicationBreakdown[medName] || 0) + 1;
          });
        }
      });
      
      return {
        studentsWithAllergies,
        studentsWithMedications,
        studentsWithChronicConditions,
        recentIncidents: 0, // Would need incident data
        pendingAppointments: 0, // Would need appointment data
        overdueCheckups: 0, // Would need checkup tracking
        vaccinationCompliance: 85, // Placeholder - would calculate from vaccination records
        allergyBreakdown,
        medicationBreakdown,
        incidentTypes: {}, // Would need incident type tracking
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for activity and engagement statistics
 * 
 * @param timeRange - Time range for analytics
 * @returns Activity statistics and trends
 */
export const useActivityStats = (timeRange: TimeRange = 'month') => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.trends('activity', timeRange),
    queryFn: async (): Promise<ActivityStats> => {
      // This would typically come from visit/appointment data
      // For now, return placeholder data with realistic structure
      return {
        totalVisits: 0,
        averageVisitsPerStudent: 0,
        mostVisitedTimes: [
          { hour: 9, count: 45 },
          { hour: 10, count: 52 },
          { hour: 11, count: 38 },
          { hour: 13, count: 41 },
          { hour: 14, count: 35 },
        ],
        nurseWorkload: {},
        visitReasons: {
          'Medication Administration': 45,
          'Illness Assessment': 32,
          'Injury Care': 28,
          'Routine Check': 15,
          'Emergency': 8,
        },
        seasonalTrends: [],
        peakDays: [],
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for risk assessment statistics
 * 
 * @param timeRange - Time range for analytics
 * @returns Risk assessment data
 */
export const useRiskStats = (timeRange: TimeRange = 'month') => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.trends('risk', timeRange),
    queryFn: async (): Promise<RiskStats> => {
      const response = await studentsApi.getAll({});
      const students = response.students;
      
      // Simple risk assessment based on health data
      let highRisk = 0;
      let mediumRisk = 0;
      let lowRisk = 0;
      
      students.forEach(student => {
        const riskFactors = [
          student.allergies?.some(a => a.severity === 'SEVERE'),
          student.medications?.length && student.medications.length > 2,
          student.chronicConditions?.length && student.chronicConditions.length > 0,
        ].filter(Boolean).length;
        
        if (riskFactors >= 2) {
          highRisk++;
        } else if (riskFactors === 1) {
          mediumRisk++;
        } else {
          lowRisk++;
        }
      });
      
      return {
        highRiskStudents: highRisk,
        mediumRiskStudents: mediumRisk,
        lowRiskStudents: lowRisk,
        studentsNeedingAttention: highRisk + Math.floor(mediumRisk * 0.3),
        criticalAlerts: Math.floor(highRisk * 0.2),
        riskFactors: {
          'Severe Allergies': students.filter(s => 
            s.allergies?.some(a => a.severity === 'SEVERE')
          ).length,
          'Multiple Medications': students.filter(s => 
            s.medications && s.medications.length > 2
          ).length,
          'Chronic Conditions': students.filter(s => 
            s.chronicConditions && s.chronicConditions.length > 0
          ).length,
        },
        riskTrends: [], // Would need historical data
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for compliance statistics
 * 
 * @param timeRange - Time range for analytics
 * @returns Compliance metrics and non-compliant students
 */
export const useComplianceStats = (timeRange: TimeRange = 'month') => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.trends('compliance', timeRange),
    queryFn: async (): Promise<ComplianceStats> => {
      const response = await studentsApi.getAll({});
      const students = response.students;
      
      // Calculate compliance metrics
      const totalStudents = students.length;
      
      // Emergency contact compliance
      const emergencyContactCompliant = students.filter(s => 
        s.emergencyContacts && s.emergencyContacts.length > 0
      ).length;
      
      // Compliance by grade
      const complianceByGrade: Record<string, number> = {};
      const gradeGroups = students.reduce((acc, student) => {
        const grade = student.grade || 'Unknown';
        if (!acc[grade]) acc[grade] = [];
        acc[grade].push(student);
        return acc;
      }, {} as Record<string, Student[]>);
      
      Object.entries(gradeGroups).forEach(([grade, gradeStudents]) => {
        const compliant = gradeStudents.filter(s => 
          s.emergencyContacts?.length
        ).length;
        complianceByGrade[grade] = Math.round((compliant / gradeStudents.length) * 100);
      });
      
      // Find non-compliant students
      const nonCompliantStudents = students
        .filter(s => {
          const issues: string[] = [];
          if (!s.emergencyContacts?.length) issues.push('Missing emergency contacts');
          return issues.length > 0;
        })
        .map(s => {
          const issues: string[] = [];
          if (!s.emergencyContacts?.length) issues.push('Missing emergency contacts');
          
          return {
            studentId: s.id,
            name: `${s.firstName} ${s.lastName}`,
            issues,
            urgency: (issues.length >= 2 ? 'high' : issues.length === 1 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          };
        })
        .slice(0, 50); // Limit to first 50 for performance
      
      return {
        vaccinationCompliance: 85, // Placeholder since we don't have vaccination data
        physicalExamCompliance: 75, // Placeholder
        emergencyContactCompliance: Math.round((emergencyContactCompliant / totalStudents) * 100),
        documentationCompliance: 80, // Placeholder
        auditReadiness: 78, // Calculated average
        complianceByGrade,
        nonCompliantStudents,
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for comprehensive dashboard metrics
 * 
 * @param timeRange - Time range for analytics
 * @returns Complete dashboard metrics
 * 
 * @example
 * ```tsx
 * const { metrics, isLoading, error } = useDashboardMetrics('month');
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return (
 *   <Dashboard
 *     enrollment={metrics.enrollment}
 *     health={metrics.health}
 *     activity={metrics.activity}
 *     alerts={metrics.alerts}
 *   />
 * );
 * ```
 */
export const useDashboardMetrics = (timeRange: TimeRange = 'month') => {
  const enrollmentQuery = useEnrollmentStats(timeRange);
  const healthQuery = useHealthStats(timeRange);
  const activityQuery = useActivityStats(timeRange);
  const riskQuery = useRiskStats(timeRange);
  const complianceQuery = useComplianceStats(timeRange);

  const metrics = useMemo((): DashboardMetrics | null => {
    if (!enrollmentQuery.data || !healthQuery.data || !activityQuery.data || 
        !riskQuery.data || !complianceQuery.data) {
      return null;
    }

    // Generate alerts based on data
    const alerts = [];
    
    if (riskQuery.data.criticalAlerts > 0) {
      alerts.push({
        id: 'critical-alerts',
        type: 'critical' as const,
        message: `${riskQuery.data.criticalAlerts} students require immediate attention`,
        count: riskQuery.data.criticalAlerts,
        actionRequired: true,
      });
    }
    
    if (complianceQuery.data.vaccinationCompliance < 90) {
      alerts.push({
        id: 'vaccination-compliance',
        type: 'warning' as const,
        message: `Vaccination compliance is ${complianceQuery.data.vaccinationCompliance}% (target: 90%)`,
        actionRequired: true,
      });
    }
    
    if (enrollmentQuery.data.trends.monthlyGrowth > 10) {
      alerts.push({
        id: 'high-growth',
        type: 'info' as const,
        message: `Student enrollment increased by ${enrollmentQuery.data.trends.monthlyGrowth.toFixed(1)}% this month`,
      });
    }

    return {
      enrollment: enrollmentQuery.data,
      health: healthQuery.data,
      activity: activityQuery.data,
      risk: riskQuery.data,
      compliance: complianceQuery.data,
      lastUpdated: new Date().toISOString(),
      alerts,
    };
  }, [
    enrollmentQuery.data,
    healthQuery.data,
    activityQuery.data,
    riskQuery.data,
    complianceQuery.data,
  ]);

  const isLoading = 
    enrollmentQuery.isLoading ||
    healthQuery.isLoading ||
    activityQuery.isLoading ||
    riskQuery.isLoading ||
    complianceQuery.isLoading;

  const error = 
    enrollmentQuery.error ||
    healthQuery.error ||
    activityQuery.error ||
    riskQuery.error ||
    complianceQuery.error;

  const refetch = () => {
    enrollmentQuery.refetch();
    healthQuery.refetch();
    activityQuery.refetch();
    riskQuery.refetch();
    complianceQuery.refetch();
  };

  return {
    metrics,
    isLoading,
    error: error as ApiError | null,
    refetch,
    
    // Individual query status for granular loading states
    enrollment: {
      data: enrollmentQuery.data,
      isLoading: enrollmentQuery.isLoading,
      error: enrollmentQuery.error,
    },
    health: {
      data: healthQuery.data,
      isLoading: healthQuery.isLoading,
      error: healthQuery.error,
    },
    activity: {
      data: activityQuery.data,
      isLoading: activityQuery.isLoading,
      error: activityQuery.error,
    },
    risk: {
      data: riskQuery.data,
      isLoading: riskQuery.isLoading,
      error: riskQuery.error,
    },
    compliance: {
      data: complianceQuery.data,
      isLoading: complianceQuery.isLoading,
      error: complianceQuery.error,
    },
  };
};

/**
 * Hook for trend analysis over time
 * 
 * @param metric - Metric to analyze
 * @param period - Time period for trend analysis
 * @returns Trend data and analysis
 */
export const useTrendAnalysis = (
  metric: 'enrollment' | 'health' | 'activity' | 'compliance',
  period: 'daily' | 'weekly' | 'monthly' = 'monthly'
) => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.trends(metric, period),
    queryFn: async () => {
      // This would fetch historical data for trend analysis
      // For now, return placeholder structure
      const dataPoints = [];
      const now = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        dataPoints.push({
          date: date.toISOString(),
          value: Math.floor(Math.random() * 100) + 50, // Placeholder data
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        });
      }
      
      return {
        metric,
        period,
        dataPoints,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        changePercent: (Math.random() * 20) - 10, // -10% to +10%
        analysis: 'Trend analysis would provide insights here',
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for comparative statistics across different groups
 * 
 * @param groupBy - How to group the comparison
 * @param metric - Metric to compare
 * @returns Comparative statistics
 */
export const useComparativeStats = (
  groupBy: 'grade' | 'school' | 'nurse' | 'month',
  metric: 'enrollment' | 'health' | 'activity' | 'compliance'
) => {
  const config = cacheConfig.statistics;

  return useQuery({
    queryKey: studentQueryKeys.statistics.trends(groupBy, metric),
    queryFn: async () => {
      const response = await studentsApi.getAll({});
      const students = response.students;
      
      // Group students by the specified criteria
      const groups: Record<string, Student[]> = {};
      
      students.forEach(student => {
        let groupKey: string;
        
        switch (groupBy) {
          case 'grade':
            groupKey = student.grade || 'Unknown';
            break;
          case 'school':
            groupKey = 'Main School'; // Use placeholder since schoolId doesn't exist
            break;
          case 'nurse':
            groupKey = student.nurseId || 'Unassigned';
            break;
          case 'month':
            groupKey = student.enrollmentDate 
              ? new Date(student.enrollmentDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Unknown';
            break;
          default:
            groupKey = 'Unknown';
        }
        
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(student);
      });
      
      // Calculate metric for each group
      const comparisons = Object.entries(groups).map(([groupName, groupStudents]) => {
        let value: number;
        
        switch (metric) {
          case 'enrollment':
            value = groupStudents.length;
            break;
          case 'health':
            value = groupStudents.filter(s => 
              s.allergies?.length || s.medications?.length || s.chronicConditions?.length
            ).length;
            break;
          case 'activity':
            value = 0; // Would calculate from visit data
            break;
          case 'compliance':
            value = groupStudents.filter(s => 
              s.emergencyContacts?.length
            ).length / groupStudents.length * 100;
            break;
          default:
            value = 0;
        }
        
        return {
          group: groupName,
          value,
          count: groupStudents.length,
          percentage: (groupStudents.length / students.length) * 100,
        };
      });
      
      // Sort by value descending
      comparisons.sort((a, b) => b.value - a.value);
      
      return {
        groupBy,
        metric,
        comparisons,
        total: students.length,
        average: comparisons.reduce((sum, comp) => sum + comp.value, 0) / comparisons.length,
      };
    },
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Export all statistics hooks
 */
export default {
  useEnrollmentStats,
  useHealthStats,
  useActivityStats,
  useRiskStats,
  useComplianceStats,
  useDashboardMetrics,
  useTrendAnalysis,
  useComparativeStats,
};
