/**
 * Cache Invalidation Utilities
 *
 * Provides type-safe cache invalidation for Next.js v16
 * with support for granular and cross-resource invalidation.
 *
 * @module lib/cache/invalidation
 */

import { revalidateTag, revalidatePath } from 'next/cache';
import { generateCacheTags, generateRelatedTags, RESOURCE_CACHE_CONFIG } from './config';

/**
 * Invalidate cache for a specific resource
 *
 * @example
 * await invalidateResource('students', '123');
 * // Invalidates: ['students', 'student-123', 'phi-data']
 */
export async function invalidateResource(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  resourceId?: string,
  additionalTags: string[] = []
): Promise<void> {
  const tags = generateCacheTags(resourceType, resourceId, additionalTags);

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate cache for related resources
 *
 * @example
 * // When updating a student's health record:
 * await invalidateRelatedResources('healthRecords', '123', {
 *   studentId: '456'
 * });
 * // Invalidates health record tags AND student-related tags
 */
export async function invalidateRelatedResources(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  resourceId: string,
  relations: {
    studentId?: string;
    appointmentId?: string;
    medicationId?: string;
    incidentId?: string;
  } = {}
): Promise<void> {
  const tags = generateRelatedTags(resourceType, resourceId, relations);

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate cache by path
 *
 * @example
 * await invalidatePath('/dashboard');
 * await invalidatePath('/students/[id]', 'page');
 */
export async function invalidatePath(
  path: string,
  type: 'page' | 'layout' = 'page'
): Promise<void> {
  revalidatePath(path, type);
}

/**
 * Invalidate all caches (use sparingly!)
 *
 * This invalidates all resource types and should only be used
 * for critical system-wide updates.
 */
export async function invalidateAll(): Promise<void> {
  const allResourceTypes = Object.keys(RESOURCE_CACHE_CONFIG) as Array<
    keyof typeof RESOURCE_CACHE_CONFIG
  >;

  for (const resourceType of allResourceTypes) {
    await invalidateResource(resourceType);
  }
}

/**
 * Batch invalidate multiple resources
 *
 * @example
 * await batchInvalidate([
 *   { type: 'students', id: '123' },
 *   { type: 'appointments', id: '456' },
 *   { type: 'healthRecords', id: '789' }
 * ]);
 */
export async function batchInvalidate(
  resources: Array<{
    type: keyof typeof RESOURCE_CACHE_CONFIG;
    id?: string;
    tags?: string[];
  }>
): Promise<void> {
  const allTags = new Set<string>();

  // Collect all unique tags
  for (const resource of resources) {
    const tags = generateCacheTags(resource.type, resource.id, resource.tags || []);
    tags.forEach(tag => allTags.add(tag));
  }

  // Invalidate all unique tags
  for (const tag of allTags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate student-related caches
 *
 * When a student record changes, invalidate all related data:
 * - Student profile
 * - Health records
 * - Medications
 * - Appointments
 * - Incidents
 */
export async function invalidateStudentData(studentId: string): Promise<void> {
  const tags = [
    'students',
    `student-${studentId}`,
    `student-${studentId}-health-records`,
    `student-${studentId}-medications`,
    `student-${studentId}-appointments`,
    `student-${studentId}-incidents`
  ];

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate appointment-related caches
 *
 * When an appointment changes, invalidate related data
 */
export async function invalidateAppointmentData(
  appointmentId: string,
  studentId?: string
): Promise<void> {
  const tags = [
    'appointments',
    `appointment-${appointmentId}`
  ];

  if (studentId) {
    tags.push(`student-${studentId}-appointments`);
    tags.push(`student-${studentId}`);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate health record-related caches
 */
export async function invalidateHealthRecordData(
  healthRecordId: string,
  studentId?: string
): Promise<void> {
  const tags = [
    'health-records',
    `health-record-${healthRecordId}`
  ];

  if (studentId) {
    tags.push(`student-${studentId}-health-records`);
    tags.push(`student-${studentId}`);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate medication-related caches
 */
export async function invalidateMedicationData(
  medicationId: string,
  studentId?: string
): Promise<void> {
  const tags = [
    'medications',
    `medication-${medicationId}`
  ];

  if (studentId) {
    tags.push(`student-${studentId}-medications`);
    tags.push(`student-${studentId}`);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }
}

/**
 * Invalidate incident-related caches
 */
export async function invalidateIncidentData(
  incidentId: string,
  studentId?: string
): Promise<void> {
  const tags = [
    'incidents',
    `incident-${incidentId}`
  ];

  if (studentId) {
    tags.push(`student-${studentId}-incidents`);
    tags.push(`student-${studentId}`);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }
}
