/**
 * Cache Invalidation Utilities for Next.js App Router
 * 
 * Provides utilities for invalidating specific cache tags and paths
 * to ensure data consistency across the application.
 */

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Cache tags used throughout the application
 */
export const CACHE_TAGS = {
  // Appointments
  APPOINTMENTS: 'appointments',
  CALENDAR_APPOINTMENTS: 'calendar-appointments',
  APPOINTMENT_DETAILS: 'appointment-details',
  
  // Students
  STUDENTS: 'students',
  STUDENT_DETAILS: 'student-details',
  
  // Health Records
  HEALTH_RECORDS: 'health-records',
  
  // Medications
  MEDICATIONS: 'medications',
  MEDICATION_SCHEDULE: 'medication-schedule',
  
  // Incidents
  INCIDENTS: 'incidents',
  
  // Analytics
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
} as const;

/**
 * Invalidate appointments cache
 * Use this when appointments are created, updated, or deleted
 */
export async function invalidateAppointments(): Promise<void> {
  try {
    revalidateTag(CACHE_TAGS.APPOINTMENTS);
    revalidateTag(CACHE_TAGS.CALENDAR_APPOINTMENTS);
    console.log('Invalidated appointments cache');
  } catch (error) {
    console.error('Failed to invalidate appointments cache:', error);
  }
}

/**
 * Invalidate specific appointment details
 */
export async function invalidateAppointmentDetails(appointmentId: string): Promise<void> {
  try {
    revalidateTag(`${CACHE_TAGS.APPOINTMENT_DETAILS}-${appointmentId}`);
    revalidateTag(CACHE_TAGS.APPOINTMENTS); // Also invalidate the list
    console.log(`Invalidated appointment details cache for ${appointmentId}`);
  } catch (error) {
    console.error(`Failed to invalidate appointment details cache for ${appointmentId}:`, error);
  }
}

/**
 * Invalidate student-related caches
 */
export async function invalidateStudents(): Promise<void> {
  try {
    revalidateTag(CACHE_TAGS.STUDENTS);
    console.log('Invalidated students cache');
  } catch (error) {
    console.error('Failed to invalidate students cache:', error);
  }
}

/**
 * Invalidate specific student details and related data
 */
export async function invalidateStudentDetails(studentId: string): Promise<void> {
  try {
    revalidateTag(`${CACHE_TAGS.STUDENT_DETAILS}-${studentId}`);
    revalidateTag(`${CACHE_TAGS.HEALTH_RECORDS}-${studentId}`);
    revalidateTag(`${CACHE_TAGS.MEDICATIONS}-${studentId}`);
    revalidateTag(CACHE_TAGS.STUDENTS); // Also invalidate the list
    console.log(`Invalidated student details cache for ${studentId}`);
  } catch (error) {
    console.error(`Failed to invalidate student details cache for ${studentId}:`, error);
  }
}

/**
 * Invalidate medications cache
 */
export async function invalidateMedications(): Promise<void> {
  try {
    revalidateTag(CACHE_TAGS.MEDICATIONS);
    revalidateTag(CACHE_TAGS.MEDICATION_SCHEDULE);
    console.log('Invalidated medications cache');
  } catch (error) {
    console.error('Failed to invalidate medications cache:', error);
  }
}

/**
 * Invalidate analytics and reports cache
 */
export async function invalidateAnalytics(): Promise<void> {
  try {
    revalidateTag(CACHE_TAGS.ANALYTICS);
    revalidateTag(CACHE_TAGS.REPORTS);
    console.log('Invalidated analytics cache');
  } catch (error) {
    console.error('Failed to invalidate analytics cache:', error);
  }
}

/**
 * Invalidate page-specific cache by path
 * Use this for pages that don't use tagged caching
 */
export async function invalidatePage(path: string, type: 'layout' | 'page' = 'page'): Promise<void> {
  try {
    revalidatePath(path, type);
    console.log(`Invalidated page cache for ${path}`);
  } catch (error) {
    console.error(`Failed to invalidate page cache for ${path}:`, error);
  }
}

/**
 * Invalidate multiple cache tags at once
 */
export async function invalidateMultipleTags(tags: string[]): Promise<void> {
  try {
    for (const tag of tags) {
      revalidateTag(tag);
    }
    console.log(`Invalidated cache tags: ${tags.join(', ')}`);
  } catch (error) {
    console.error(`Failed to invalidate cache tags: ${tags.join(', ')}`, error);
  }
}

/**
 * Invalidate all appointment-related caches
 * Use this for major appointment system changes
 */
export async function invalidateAllAppointmentCaches(): Promise<void> {
  await invalidateMultipleTags([
    CACHE_TAGS.APPOINTMENTS,
    CACHE_TAGS.CALENDAR_APPOINTMENTS,
    CACHE_TAGS.APPOINTMENT_DETAILS,
  ]);
}

/**
 * Emergency cache clear - invalidates all major cache tags
 * Use sparingly, only when necessary
 */
export async function emergencyCacheClear(): Promise<void> {
  await invalidateMultipleTags([
    CACHE_TAGS.APPOINTMENTS,
    CACHE_TAGS.CALENDAR_APPOINTMENTS,
    CACHE_TAGS.STUDENTS,
    CACHE_TAGS.HEALTH_RECORDS,
    CACHE_TAGS.MEDICATIONS,
    CACHE_TAGS.INCIDENTS,
    CACHE_TAGS.ANALYTICS,
    CACHE_TAGS.REPORTS,
  ]);
  
  console.log('Emergency cache clear completed');
}


export default {
  CACHE_TAGS,
  invalidateAppointments,
  invalidateAppointmentDetails,
  invalidateStudents,
  invalidateStudentDetails,
  invalidateMedications,
  invalidateAnalytics,
  invalidatePage,
  invalidateMultipleTags,
  invalidateAllAppointmentCaches,
  emergencyCacheClear,
};
