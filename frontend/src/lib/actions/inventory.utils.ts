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

// Use server-side or fallback to public env variable or default
export const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

/**
 * Enhanced fetch with Next.js v16 capabilities
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
      tags: ['inventory', 'stock']
    }
  });
}
