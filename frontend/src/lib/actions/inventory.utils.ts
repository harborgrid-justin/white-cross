/**
 * @fileoverview Utility Functions for Inventory Management
 * @module lib/actions/inventory.utils
 *
 * Shared utility functions for authentication, audit context, and enhanced fetch.
 */

'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { extractIPAddress, extractUserAgent } from '@/lib/audit';

/**
 * Get auth token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
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
