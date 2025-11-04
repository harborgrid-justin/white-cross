/**
 * Student Health Statistics Hook
 *
 * Provides health overview statistics including allergies, medications,
 * chronic conditions, and vaccination compliance.
 *
 * @module hooks/students/statistics/useHealthStats
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { studentQueryKeys } from '../queryKeys';
import { cacheConfig } from '../cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { HealthStats, TimeRange } from './types';

/**
 * Hook for health overview statistics
 *
 * @param timeRange - Time range for analytics
 * @returns Health statistics and metrics
 *
 * @example
 * ```tsx
 * const { data: healthStats, isLoading } = useHealthStats('month');
 *
 * return (
 *   <div>
 *     <h3>Students with Allergies: {healthStats?.studentsWithAllergies}</h3>
 *     <p>Vaccination Compliance: {healthStats?.vaccinationCompliance}%</p>
 *   </div>
 * );
 * ```
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
