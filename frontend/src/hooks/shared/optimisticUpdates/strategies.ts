/**
 * Domain-Specific Optimistic Update Strategies
 *
 * Pre-built optimistic update patterns for common domain operations
 * (medications, students, health records, appointments)
 *
 * @module hooks/shared/optimisticUpdates/strategies
 */

import { QueryClient } from '@tanstack/react-query';
import { createMultiQueryOptimisticUpdate, createOptimisticListAdd } from './core';

/**
 * Medication administration optimistic update
 */
export const createMedicationAdministrationOptimistic = async (
  queryClient: QueryClient,
  medicationId: string,
  studentId: string,
  administrationData: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Update medication detail
    {
      queryKey: ['medications', medicationId],
      updater: (old: any) => ({
        ...old,
        lastAdministeredAt: new Date().toISOString(),
        administrationHistory: [
          administrationData,
          ...(old?.administrationHistory || []),
        ],
      }),
    },
    // Update medications list for student
    {
      queryKey: ['medications', 'student', studentId],
      updater: (old: any) => {
        if (!old?.medications) return old;

        return {
          ...old,
          medications: old.medications.map((med: any) =>
            med.id === medicationId
              ? {
                  ...med,
                  lastAdministeredAt: new Date().toISOString(),
                }
              : med
          ),
        };
      },
    },
    // Update medications due today
    {
      queryKey: ['medications', 'due-today'],
      updater: (old: any[] = []) =>
        old.filter((med: any) => med.id !== medicationId),
    },
  ]);
};

/**
 * Student creation optimistic update
 */
export const createStudentCreationOptimistic = async (
  queryClient: QueryClient,
  newStudent: any
) => {
  return createOptimisticListAdd(
    queryClient,
    ['students', 'list'],
    newStudent
  );
};

/**
 * Health record creation optimistic update
 */
export const createHealthRecordOptimistic = async (
  queryClient: QueryClient,
  studentId: string,
  newRecord: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Add to student's health records
    {
      queryKey: ['health-records', 'student', studentId],
      updater: (old: any = []) => [newRecord, ...old],
    },
    // Add to all health records list
    {
      queryKey: ['health-records', 'list'],
      updater: (old: any = []) => [newRecord, ...old],
    },
    // Update student's health record count
    {
      queryKey: ['students', 'detail', studentId],
      updater: (old: any) => ({
        ...old,
        healthRecordCount: (old?.healthRecordCount || 0) + 1,
      }),
    },
  ]);
};

/**
 * Appointment scheduling optimistic update
 */
export const createAppointmentSchedulingOptimistic = async (
  queryClient: QueryClient,
  studentId: string,
  newAppointment: any
) => {
  return createMultiQueryOptimisticUpdate(queryClient, [
    // Add to student's appointments
    {
      queryKey: ['appointments', 'student', studentId],
      updater: (old: any = []) => [...old, newAppointment],
    },
    // Add to upcoming appointments
    {
      queryKey: ['appointments', 'upcoming'],
      updater: (old: any = []) => {
        const appointments = [...old, newAppointment];
        return appointments.sort((a, b) =>
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        );
      },
    },
  ]);
};
