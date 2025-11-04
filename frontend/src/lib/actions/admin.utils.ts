/**
 * @fileoverview Admin Utility Functions
 * @module lib/actions/admin.utils
 *
 * Utility functions for admin operations including existence checks,
 * count operations, and cache management.
 *
 * Features:
 * - Resource existence validation
 * - Count aggregation for admin resources
 * - Cache clearing and invalidation
 * - Type-safe utility operations
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/constants';
import { getAdminUser, getAdminUsers, getDistrict, getDistricts, getSchool, getSchools } from './admin.cache';

// ==========================================
// EXISTENCE CHECK UTILITIES
// ==========================================

/**
 * Check if admin user exists
 */
export async function adminUserExists(userId: string): Promise<boolean> {
  const user = await getAdminUser(userId);
  return user !== null;
}

/**
 * Check if district exists
 */
export async function districtExists(districtId: string): Promise<boolean> {
  const district = await getDistrict(districtId);
  return district !== null;
}

/**
 * Check if school exists
 */
export async function schoolExists(schoolId: string): Promise<boolean> {
  const school = await getSchool(schoolId);
  return school !== null;
}

// ==========================================
// COUNT UTILITIES
// ==========================================

/**
 * Get admin user count
 */
export async function getAdminUserCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const users = await getAdminUsers(filters);
    return users.length;
  } catch {
    return 0;
  }
}

/**
 * Get district count
 */
export async function getDistrictCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const districts = await getDistricts(filters);
    return districts.length;
  } catch {
    return 0;
  }
}

/**
 * Get school count
 */
export async function getSchoolCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const schools = await getSchools(filters);
    return schools.length;
  } catch {
    return 0;
  }
}

// ==========================================
// CACHE MANAGEMENT UTILITIES
// ==========================================

/**
 * Clear admin cache
 * Invalidates all admin-related cache entries
 */
export async function clearAdminCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all admin caches
  [
    CACHE_TAGS.ADMIN_USERS,
    CACHE_TAGS.ADMIN_DISTRICTS,
    CACHE_TAGS.ADMIN_SCHOOLS,
    CACHE_TAGS.ADMIN_SETTINGS,
    CACHE_TAGS.ADMIN_LICENSES,
    CACHE_TAGS.ADMIN_BACKUPS,
    CACHE_TAGS.ADMIN_METRICS,
    CACHE_TAGS.ADMIN_TRAINING,
    CACHE_TAGS.ADMIN_AUDIT_LOGS
  ].forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('admin-user-list', 'default');
  revalidateTag('district-list', 'default');
  revalidateTag('school-list', 'default');

  // Clear paths
  revalidatePath('/admin', 'page');
  revalidatePath('/admin/users', 'page');
  revalidatePath('/admin/districts', 'page');
  revalidatePath('/admin/schools', 'page');
  revalidatePath('/admin/settings', 'page');
}
