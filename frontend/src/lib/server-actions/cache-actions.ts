/**
 * Server Actions for Cache Invalidation
 * 
 * These server actions can be called from client components
 * to invalidate specific cache tags and paths.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS } from '../cache-invalidation';

/**
 * Safe wrapper for revalidateTag that handles different Next.js versions
 */
function safeRevalidateTag(tag: string): void {
  try {
    // Try the single argument version first (newer Next.js)
    (revalidateTag as any)(tag);
  } catch (error) {
    try {
      // Try the two argument version (older Next.js)
      (revalidateTag as any)(tag, 'page');
    } catch (fallbackError) {
      console.error(`Failed to revalidate tag ${tag}:`, error, fallbackError);
    }
  }
}

/**
 * Server action to invalidate appointments cache from client components
 */
export async function invalidateAppointmentsCacheAction(): Promise<{ success: boolean; message: string }> {
  try {
    safeRevalidateTag(CACHE_TAGS.APPOINTMENTS);
    safeRevalidateTag(CACHE_TAGS.CALENDAR_APPOINTMENTS);
    console.log('Invalidated appointments cache via server action');
    return { success: true, message: 'Appointments cache invalidated successfully' };
  } catch (error) {
    console.error('Cache invalidation failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Cache invalidation failed' 
    };
  }
}

/**
 * Server action to invalidate specific appointment
 */
export async function invalidateAppointmentCacheAction(
  appointmentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    safeRevalidateTag(`${CACHE_TAGS.APPOINTMENT_DETAILS}-${appointmentId}`);
    safeRevalidateTag(CACHE_TAGS.APPOINTMENTS);
    console.log(`Invalidated appointment cache for ${appointmentId} via server action`);
    return { success: true, message: `Appointment ${appointmentId} cache invalidated successfully` };
  } catch (error) {
    console.error('Cache invalidation failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Cache invalidation failed' 
    };
  }
}

/**
 * Server action to invalidate student cache
 */
export async function invalidateStudentCacheAction(
  studentId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (studentId) {
      safeRevalidateTag(`${CACHE_TAGS.STUDENT_DETAILS}-${studentId}`);
      safeRevalidateTag(`${CACHE_TAGS.HEALTH_RECORDS}-${studentId}`);
      safeRevalidateTag(`${CACHE_TAGS.MEDICATIONS}-${studentId}`);
    }
    safeRevalidateTag(CACHE_TAGS.STUDENTS);
    
    const message = studentId 
      ? `Student ${studentId} cache invalidated successfully`
      : 'Students cache invalidated successfully';
      
    return { success: true, message };
  } catch (error) {
    console.error('Cache invalidation failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Cache invalidation failed' 
    };
  }
}

/**
 * Server action to invalidate page cache by path
 */
export async function invalidatePageCacheAction(
  path: string, 
  type: 'layout' | 'page' = 'page'
): Promise<{ success: boolean; message: string }> {
  try {
    revalidatePath(path, type);
    console.log(`Invalidated page cache for ${path} via server action`);
    return { success: true, message: `Page cache for ${path} invalidated successfully` };
  } catch (error) {
    console.error('Page cache invalidation failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Page cache invalidation failed' 
    };
  }
}

/**
 * Server action for emergency cache clear
 */
export async function emergencyCacheClearAction(): Promise<{ success: boolean; message: string }> {
  try {
    const tags = [
      CACHE_TAGS.APPOINTMENTS,
      CACHE_TAGS.CALENDAR_APPOINTMENTS,
      CACHE_TAGS.STUDENTS,
      CACHE_TAGS.HEALTH_RECORDS,
      CACHE_TAGS.MEDICATIONS,
      CACHE_TAGS.INCIDENTS,
      CACHE_TAGS.ANALYTICS,
      CACHE_TAGS.REPORTS,
    ];
    
    for (const tag of tags) {
      safeRevalidateTag(tag);
    }
    
    console.log('Emergency cache clear completed via server action');
    return { success: true, message: 'Emergency cache clear completed successfully' };
  } catch (error) {
    console.error('Emergency cache clear failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Emergency cache clear failed' 
    };
  }
}
