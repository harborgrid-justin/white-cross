/**
 * @fileoverview Next.js Fetch-Based API Client
 * @module lib/api/nextjs-client
 * @category API Client
 *
 * Enterprise-grade HTTP client built on Next.js native fetch API with comprehensive
 * caching, revalidation, and error handling capabilities.
 *
 * Key Features:
 * - Native Next.js fetch with automatic request deduplication
 * - Cache configuration (cache, revalidate, tags)
 * - cacheLife support for Next.js 15+
 * - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication token injection
 * - CSRF protection headers
 * - Comprehensive error handling and retry logic
 * - Request ID generation for tracing
 * - HIPAA-compliant audit logging integration
 *
 * This client is designed to replace axios-based clients in Server Components
 * and Server Actions, enabling full integration with Next.js caching system.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * const students = await serverGet<Student[]>('/api/students', {
 *   status: 'active'
 * }, {
 *   cache: 'force-cache',
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD,
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // In a Server Action
 * const result = await serverPost<Student>('/api/students', data, {
 *   cache: 'no-store',
 *   next: { tags: [CACHE_TAGS.STUDENTS] }
 * });
 * ```
 *
 * @version 1.0.0
 * @since 2025-10-31
 * @refactored 2025-11-12
 */

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ApiClientOptions,
  NextCacheConfig,
  CacheLifeConfig,
  NextFetchOptions,
  ApiResponse,
  ApiErrorResponse,
} from './nextjs-client.types';

export { NextApiClientError } from './nextjs-client.types';

// ==========================================
// CONFIGURATION EXPORTS
// ==========================================

export {
  getApiBaseUrl,
  getAuthToken,
  getCsrfToken,
  generateRequestId,
} from './nextjs-client.config';

// ==========================================
// CORE EXPORTS
// ==========================================

export { nextFetch, handleErrorResponse } from './nextjs-client.core';

// ==========================================
// HTTP METHOD EXPORTS
// ==========================================

export {
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
} from './nextjs-client.methods';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export { buildCacheTags, buildResourceTag } from './nextjs-client.utils';

// ==========================================
// LEGACY EXPORTS
// ==========================================

export { apiClient, fetchApi } from './nextjs-client.legacy';

// ==========================================
// DEFAULT EXPORT
// ==========================================

import { nextFetch } from './nextjs-client.core';
import {
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
} from './nextjs-client.methods';
import { buildCacheTags, buildResourceTag } from './nextjs-client.utils';
import { apiClient, fetchApi } from './nextjs-client.legacy';

/**
 * Default export object providing all client methods
 *
 * @example
 * ```typescript
 * import nextjsClient from '@/lib/api/nextjs-client';
 *
 * const data = await nextjsClient.serverGet('/api/students');
 * ```
 */
const nextjsClient = {
  // Core
  nextFetch,

  // HTTP Methods
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,

  // Utilities
  buildCacheTags,
  buildResourceTag,

  // Legacy
  apiClient,
  fetchApi,
};

export default nextjsClient;
