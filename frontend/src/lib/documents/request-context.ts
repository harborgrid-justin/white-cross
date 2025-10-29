/**
 * Request Context Utilities for Server Actions
 *
 * Provides utilities to extract IP address and user agent in server actions.
 * Server actions don't have direct access to Request objects, so we extract
 * from Next.js headers.
 *
 * @module lib/documents/request-context
 */

import { headers } from 'next/headers';

/**
 * Request context information
 */
export interface RequestContext {
  /** IP address of the client */
  ipAddress?: string;
  /** User agent string */
  userAgent?: string;
}

/**
 * Get client IP address from headers in server action context
 *
 * @returns IP address or undefined
 */
export async function getClientIP(): Promise<string | undefined> {
  try {
    const headersList = await headers();

    // Check various headers for IP address (in order of preference)
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip', // Cloudflare
      'x-client-ip',
      'x-cluster-client-ip'
    ];

    for (const header of ipHeaders) {
      const value = headersList.get(header);
      if (value) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return value.split(',')[0].trim();
      }
    }

    return undefined;
  } catch (error) {
    // headers() might throw in some contexts
    console.error('[RequestContext] Failed to get IP address:', error);
    return undefined;
  }
}

/**
 * Get user agent from headers in server action context
 *
 * @returns User agent string or undefined
 */
export async function getUserAgent(): Promise<string | undefined> {
  try {
    const headersList = await headers();
    return headersList.get('user-agent') || undefined;
  } catch (error) {
    // headers() might throw in some contexts
    console.error('[RequestContext] Failed to get user agent:', error);
    return undefined;
  }
}

/**
 * Get full request context (IP and user agent)
 *
 * @returns Request context object
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function myServerAction() {
 *   const context = await getRequestContext();
 *   // context.ipAddress and context.userAgent available
 * }
 * ```
 */
export async function getRequestContext(): Promise<RequestContext> {
  const [ipAddress, userAgent] = await Promise.all([
    getClientIP(),
    getUserAgent()
  ]);

  return {
    ipAddress,
    userAgent
  };
}
