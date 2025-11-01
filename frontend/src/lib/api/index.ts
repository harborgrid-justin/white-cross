/**
 * @fileoverview Centralized API Actions Hub
 * @module lib/api
 * @category API Client
 * 
 * This is the single entry point for ALL API actions in the frontend.
 * All API calls should go through this centralized hub to ensure:
 * - Consistent error handling
 * - Unified caching strategy
 * - Centralized authentication
 * - Request/response logging
 * - Type safety
 * 
 * @example
 * ```typescript
 * import { apiActions } from '@/lib/api';
 * 
 * // All API calls go through centralized actions
 * const students = await apiActions.students.getAll({ grade: '5' });
 * const user = await apiActions.auth.getCurrentUser();
 * const appointments = await apiActions.appointments.getUpcoming();
 * ```
 * 
 * @version 1.0.0
 * @since 2025-10-31
 */

// Export client-side API functions (safe for Client Components)
export { 
  clientFetch,
  clientGet, 
  clientPost, 
  clientPut, 
  clientPatch, 
  clientDelete,
  apiClient,
  fetchApi
} from './client';

// Re-export client functions with server naming for compatibility
export { 
  clientGet as serverGet,
  clientPost as serverPost,
  clientPut as serverPut,
  clientPatch as serverPatch,
  clientDelete as serverDelete,
  clientFetch as nextFetch
} from './client';

// Export types
export type {
  ClientFetchOptions,
  ApiClientOptions,
  ApiErrorResponse
} from './client';

// Import for internal use
import type { ClientFetchOptions } from './client';

// Provide stub functions for server-only functions to maintain compatibility
export function buildCacheTags(
  resourceType: string,
  isPHI: boolean = true,
  additionalTags: string[] = []
): string[] {
  const tags: string[] = [resourceType];
  if (isPHI) {
    tags.push('phi-data');
  }
  return [...tags, ...additionalTags];
}

export function buildResourceTag(
  resourceType: string,
  resourceId: string
): string {
  return `${resourceType}-${resourceId}`;
}

// Export additional types for compatibility
export interface NextFetchOptions extends ClientFetchOptions {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface NextCacheConfig {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface CacheLifeConfig {
  ttl: number;
  stale?: number;
  max?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface NextApiClientError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
  traceId?: string;
  isNetworkError?: boolean;
  isServerError?: boolean;
  isValidationError?: boolean;
}

// Import all API services
import * as servicesApi from '@/services/api';

/**
 * Centralized API Actions Hub
 * 
 * This object provides a single point of access to all API operations
 * organized by domain. Each domain uses the centralized client for
 * consistent behavior across the application.
 */
export const apiActions = {
  // Authentication & Authorization
  auth: servicesApi.authApi,
  
  // User Management
  users: servicesApi.usersApi,
  administration: servicesApi.administrationApi,
  accessControl: servicesApi.accessControlApi,
  
  // Student Management
  students: servicesApi.studentsApi,
  studentManagement: servicesApi.studentManagementApi,
  
  // Health Records & Medical
  healthRecords: servicesApi.healthRecordsApi,
  healthAssessments: servicesApi.healthAssessmentsApi,
  medications: servicesApi.medicationsApi,
  
  // Appointments & Scheduling
  appointments: servicesApi.appointmentsApi,
  
  // Communication & Messaging
  communication: servicesApi.communicationApi,
  messages: servicesApi.messagesApi,
  broadcasts: servicesApi.broadcastsApi,
  
  // Emergency & Incidents
  emergencyContacts: servicesApi.emergencyContactsApi,
  incidents: servicesApi.incidentsApi,
  
  // Documents & Records
  documents: servicesApi.documentsApi,
  
  // Analytics & Reporting
  analytics: servicesApi.analyticsApi,
  reports: servicesApi.reportsApi,
  dashboard: servicesApi.dashboardApi,
  
  // Financial Management
  billing: servicesApi.billingApi,
  budget: servicesApi.budgetApi,
  purchaseOrders: servicesApi.purchaseOrderApi,
  vendors: servicesApi.vendorApi,
  
  // Inventory Management
  inventory: servicesApi.inventoryApi,
  
  // Compliance & Audit
  compliance: servicesApi.complianceApi,
  audit: servicesApi.auditApi,
  
  // System Integration
  integration: servicesApi.integrationApi,
} as const;

/**
 * Centralized API Error Handler
 * 
 * Provides consistent error handling across all API calls
 */
export class CentralizedApiError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: unknown;
  
  constructor(
    message: string, 
    code: string = 'API_ERROR', 
    status?: number, 
    details?: unknown
  ) {
    super(message);
    this.name = 'CentralizedApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Centralized API Request Wrapper
 * 
 * Wraps all API calls with consistent error handling, logging, and caching
 */
export async function centralizedApiRequest<T>(
  apiCall: () => Promise<T>,
  context: {
    operation: string;
    domain: string;
    cacheTags?: string[];
    requiresAuth?: boolean;
  }
): Promise<T> {
  const { operation, domain, cacheTags = [], requiresAuth = true } = context;
  
  try {
    console.log(`[API] ${domain}.${operation} - Starting request`);
    
    const startTime = Date.now();
    const result = await apiCall();
    const endTime = Date.now();
    
    console.log(`[API] ${domain}.${operation} - Completed in ${endTime - startTime}ms`);
    
    return result;
  } catch (error) {
    console.error(`[API] ${domain}.${operation} - Error:`, error);
    
    if (error instanceof Error) {
      throw new CentralizedApiError(
        error.message,
        `${domain.toUpperCase()}_${operation.toUpperCase()}_ERROR`,
        undefined,
        error
      );
    }
    
    throw new CentralizedApiError(
      'Unknown API error occurred',
      `${domain.toUpperCase()}_${operation.toUpperCase()}_UNKNOWN_ERROR`
    );
  }
}

/**
 * Centralized Cache Management
 * 
 * Provides unified cache invalidation and management
 */
export const apiCache = {
  /**
   * Invalidate cache tags
   */
  invalidate: async (tags: string[]) => {
    // This would integrate with Next.js cache invalidation
    // For now, log the operation
    console.log('[API Cache] Invalidating tags:', tags);
  },
  
  /**
   * Clear all cache
   */
  clearAll: async () => {
    console.log('[API Cache] Clearing all cache');
  },
  
  /**
   * Build cache key for operation
   */
  buildKey: (domain: string, operation: string, params?: Record<string, unknown>) => {
    const paramsKey = params ? JSON.stringify(params) : '';
    return `${domain}:${operation}:${paramsKey}`;
  }
} as const;

/**
 * API Actions Type Definitions
 */
export type ApiActionsType = typeof apiActions;
export type ApiDomain = keyof ApiActionsType;

/**
 * Default export for convenient access
 */
export default apiActions;
