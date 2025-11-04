/**
 * @fileoverview Utility Functions for Health Records Module
 * @module lib/actions/health-records.utils
 *
 * Shared utility functions for authentication, audit context creation,
 * and enhanced fetch operations with Next.js v16 caching capabilities.
 * HIPAA CRITICAL: These utilities support mandatory audit logging for PHI access.
 */

'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import {
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

/**
 * Backend API base URL
 * Uses server-side env variable or falls back to public env or default
 */
export const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Get authentication token from cookies
 * Used by all server actions to authenticate API requests
 *
 * @returns Promise resolving to auth token string or null if not authenticated
 *
 * @example
 * ```typescript
 * const token = await getAuthToken();
 * if (!token) {
 *   return { errors: { _form: ['Authentication required'] } };
 * }
 * ```
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

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

/**
 * Create audit context from request headers
 * HIPAA CRITICAL: Captures IP address and user agent for all PHI access logs
 *
 * @returns Promise resolving to audit context with userId, ipAddress, and userAgent
 *
 * @example
 * ```typescript
 * const auditContext = await createAuditContext();
 * await auditLog({
 *   ...auditContext,
 *   action: AUDIT_ACTIONS.VIEW_HEALTH_RECORD,
 *   resource: 'HealthRecord',
 *   success: true
 * });
 * ```
 */
export async function createAuditContext() {
  const headersList = await headers();
  const request = {
    headers: headersList
  } as Request;

  const userId = await getCurrentUserId();
  return {
    userId,
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}

/**
 * Enhanced fetch with Next.js v16 capabilities
 * Automatically adds authentication headers and caching tags for PHI data
 *
 * @param url - Full URL to fetch
 * @param options - Standard fetch options (method, body, headers, etc.)
 * @returns Promise resolving to Response object
 *
 * @example
 * ```typescript
 * const response = await enhancedFetch(`${BACKEND_URL}/health-record`, {
 *   method: 'POST',
 *   body: JSON.stringify(data)
 * });
 * ```
 */
export async function enhancedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    next: {
      revalidate: 300, // 5 minute cache
      tags: ['health-records', 'phi-data']
    }
  });
}
