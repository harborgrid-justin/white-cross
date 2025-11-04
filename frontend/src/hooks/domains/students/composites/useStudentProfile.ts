/**
 * Student Profile Composite Hook
 *
 * Combines all data for a complete student profile including health records,
 * medications, incidents, and activity timeline.
 *
 * @module hooks/students/composites/useStudentProfile
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useStudentDetail } from '../coreQueries';
import { useStudentMutations } from '../mutations';
import { usePHIHandler, useOptimisticUpdates } from '../utils';
import type { Student } from '@/types/student.types';

/**
 * Enhanced API error type
 */
interface ApiError extends Error {
  status?: number;
  response?: any;
}

/**
 * Configuration options for useStudentProfile
 */
export interface UseStudentProfileOptions {
  includeHealthRecords?: boolean;
  includeMedications?: boolean;
  includeIncidents?: boolean;
  enablePHI?: boolean;
  enableOptimisticUpdates?: boolean;
}

/**
 * Student profile hook that combines all data for a complete student profile
 *
 * @param studentId - Student ID
 * @param options - Configuration options
 * @returns Complete student profile data
 *
 * @example
 * ```tsx
 * const profile = useStudentProfile(studentId, {
 *   includeHealthRecords: true,
 *   includeMedications: true,
 *   enablePHI: true
 * });
 *
 * return (
 *   <StudentProfilePage
 *     student={profile.student}
 *     healthData={profile.healthData}
 *     medications={profile.medications}
 *     timeline={profile.timeline}
 *   />
 * );
 * ```
 */
export const useStudentProfile = (
  studentId: string,
  options?: UseStudentProfileOptions
) => {
  const {
    includeHealthRecords = true,
    includeMedications = true,
    includeIncidents = true,
    enablePHI = true,
    enableOptimisticUpdates = true,
  } = options || {};

  // Core student data
  const studentQuery = useStudentDetail(studentId);
  const mutations = useStudentMutations();
  const phiHandler = usePHIHandler({
    sanitize: enablePHI,
    logAccess: enablePHI,
  });
  const optimisticUpdates = useOptimisticUpdates();

  // Log access for audit trail
  useEffect(() => {
    if (studentId && enablePHI) {
      phiHandler.logAccessEvent(studentId, 'student-profile-view');
    }
  }, [studentId, enablePHI, phiHandler]);

  // Enhanced update function with optimistic updates
  const updateStudent = useCallback(async (updates: Partial<Student>) => {
    if (!studentId) return;

    let rollback: (() => void) | undefined;

    if (enableOptimisticUpdates) {
      rollback = optimisticUpdates.performOptimisticUpdate(
        `profile-update-${studentId}`,
        studentId,
        updates
      );
    }

    try {
      const result = await mutations.updateStudent.mutateAsync({
        id: studentId,
        data: updates,
      });

      if (enablePHI) {
        phiHandler.logAccessEvent(studentId, `student-profile-update: ${Object.keys(updates).join(', ')}`);
      }

      return result;
    } catch (error) {
      if (rollback) rollback();
      throw error;
    }
  }, [studentId, mutations.updateStudent, optimisticUpdates, phiHandler, enablePHI, enableOptimisticUpdates]);

  // Derived data
  const student = studentQuery.data;
  const sanitizedStudent = enablePHI && student ? phiHandler.sanitizeStudent(student) : student;

  // Health data aggregation
  const healthData = useMemo(() => {
    if (!student) return null;

    return {
      allergies: student.allergies || [],
      chronicConditions: student.chronicConditions || [],
      medications: includeMedications ? (student.medications || []) : [],
      healthRecords: includeHealthRecords ? (student.healthRecords || []) : [],
      incidents: includeIncidents ? (student.incidentReports || []) : [],
      emergencyContacts: student.emergencyContacts || [],
    };
  }, [student, includeMedications, includeHealthRecords, includeIncidents]);

  // Activity timeline
  const timeline = useMemo(() => {
    if (!student) return [];

    const events = [];

    // Add enrollment
    if (student.enrollmentDate) {
      events.push({
        id: 'enrollment',
        type: 'enrollment',
        date: student.enrollmentDate,
        title: 'Student Enrolled',
        description: `Enrolled in grade ${student.grade}`,
      });
    }

    // Add health records
    if (student.healthRecords) {
      student.healthRecords.forEach(record => {
        events.push({
          id: `health-${record.id}`,
          type: 'health',
          date: record.date,
          title: 'Health Record',
          description: record.type || 'Health record entry',
        });
      });
    }

    // Add incidents
    if (student.incidentReports) {
      student.incidentReports.forEach(incident => {
        events.push({
          id: `incident-${incident.id}`,
          type: 'incident',
          date: incident.dateTime,
          title: 'Incident Report',
          description: incident.description || 'Incident occurred',
        });
      });
    }

    // Sort by date (newest first)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [student]);

  return {
    // Core data
    student: sanitizedStudent,
    healthData,
    timeline,

    // State
    isLoading: studentQuery.isLoading,
    error: studentQuery.error as ApiError | null,
    isFound: !!student,

    // Actions
    updateStudent,
    refetch: studentQuery.refetch,

    // Mutations
    mutations: {
      isUpdating: mutations.updateStudent.isPending,
      isDeleting: mutations.deactivateStudent.isPending,
      delete: () => mutations.deactivateStudent.mutateAsync(studentId),
      reactivate: () => mutations.reactivateStudent.mutateAsync(studentId),
    },
  };
};
