/**
 * Student Enrollment Statistics Hook
 *
 * Provides enrollment statistics, trends, and growth analytics.
 *
 * @module hooks/students/statistics/useEnrollmentStats
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { studentQueryKeys } from '../queryKeys';
import { cacheConfig } from '../cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { EnrollmentStats, TimeRange, CustomTimeRange } from './types';

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
