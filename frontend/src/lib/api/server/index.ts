/**
 * @fileoverview Server-Side API Barrel Export
 * @module lib/api/server
 * @category API Client
 *
 * Central export point for all server-side API utilities.
 * This module consolidates exports from config, core, methods, types, and utils.
 *
 * **IMPORTANT**: Only import this in Server Components or Server Actions.
 * These modules use 'next/headers' and other server-only APIs.
 *
 * @version 1.0.0
 * @since 2025-11-15
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
} from './types';

export { NextApiClientError } from './types';

// ==========================================
// CONFIGURATION EXPORTS
// ==========================================

export {
  getApiBaseUrl,
  getAuthToken,
  getCsrfToken,
  generateRequestId,
} from './config';

// ==========================================
// CORE EXPORTS
// ==========================================

export { nextFetch, handleErrorResponse } from './core';

// ==========================================
// HTTP METHOD EXPORTS
// ==========================================

export {
  serverGet,
  serverPost,
  serverPut,
  serverPatch,
  serverDelete,
} from './methods';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export { buildCacheTags, buildResourceTag } from './utils';
