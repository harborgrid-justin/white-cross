/**
 * @fileoverview Configuration Helpers for Next.js API Client
 * @module lib/api/nextjs-client.config
 * @category API Client
 *
 * This module contains configuration helpers for authentication, API URLs,
 * CSRF tokens, and request tracing.
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

import { cookies, headers } from 'next/headers';
import { COOKIE_NAMES } from '@/identity-access/lib/config/cookies';

// ==========================================
// CONFIGURATION HELPERS
// ==========================================

/**
 * Get API base URL from environment
 *
 * Checks multiple environment variables in order of preference:
 * 1. API_BASE_URL - Server-side API URL
 * 2. NEXT_PUBLIC_API_URL - Public API URL
 * 3. Fallback to localhost:3001
 *
 * @returns The API base URL
 */
export function getApiBaseUrl(): string {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  );
}

/**
 * Get authentication token from production-ready httpOnly cookies
 * Uses the existing JWT-based authentication system
 *
 * Tries multiple cookie names that might contain the auth token:
 * - COOKIE_NAMES.ACCESS_TOKEN (primary)
 * - auth.token
 * - auth_token
 * - accessToken
 *
 * @returns Promise resolving to the auth token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();

    // Try multiple cookie names that might be used for the auth token
    const token =
      cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value ||
      cookieStore.get('auth.token')?.value ||
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('accessToken')?.value;

    return token || null;
  } catch (error) {
    console.error('[Next API Client] Failed to get auth token:', error);
    return null;
  }
}

/**
 * Generate unique request ID for tracing
 * Made dynamic to avoid prerendering issues
 *
 * Format: {timestamp}-{random-string}
 * Example: 1699876543210-abc123def
 *
 * @returns A unique request ID
 */
export function generateRequestId(): string {
  // Access headers first to make this function dynamic during prerendering
  headers();
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get CSRF token from cookies
 *
 * CSRF tokens are used to protect against Cross-Site Request Forgery attacks
 * in state-changing operations (POST, PUT, PATCH, DELETE).
 *
 * @returns Promise resolving to the CSRF token or null if not found
 */
export async function getCsrfToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('csrf-token')?.value || null;
  } catch (error) {
    console.error('[Next API Client] Failed to get CSRF token:', error);
    return null;
  }
}
