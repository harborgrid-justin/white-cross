/**
 * @fileoverview Utility Functions for Health Records Module
 * @module lib/actions/health-records.utils
 *
 * Shared utility functions for health records operations.
 * HIPAA CRITICAL: These utilities support mandatory audit logging for PHI access.
 *
 * NOTE: This file does NOT use 'use server' because it exports constants
 * and utility functions that can be used in both server and client contexts.
 * Individual async functions can be imported and used in server actions.
 *
 * MIGRATION NOTE: This file previously contained enhancedFetch, getAuthToken,
 * createAuditContext, and BACKEND_URL. These have been migrated to use the
 * centralized @/lib/api/server instead:
 * - Use serverGet, serverPost, serverPut, serverDelete from @/lib/api/server
 * - Use getAuthToken from @/lib/api/server
 * - Use createAuditContextFromServer from @/lib/audit
 * - Use getApiBaseUrl from @/lib/api/server
 */

import { cookies } from 'next/headers';

/**
 * Get current user ID from cookies
 * Used for audit logging to track which user performed an action
 *
 * @returns Promise resolving to user ID string or null if not available
 *
 * @example
 * ```typescript
 * const userId = await getCurrentUserId();
 * await auditLog({ userId, action: 'VIEW_RECORD', ... });
 * ```
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}
