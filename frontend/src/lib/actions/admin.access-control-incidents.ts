/**
 * @fileoverview Access Control Security Incidents & IP Restrictions Server Actions
 * @module lib/actions/admin.access-control-incidents
 *
 * HIPAA-compliant server actions for security incident tracking and IP restriction management.
 * Includes caching, audit logging, and comprehensive error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/server';
import type { ActionResult } from './admin.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface SecurityIncident {
  id: string;
  userId?: string;
  incidentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IpRestriction {
  id: string;
  ipAddress: string;
  type: 'ALLOW' | 'BLOCK';
  reason?: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AccessControlStatistics {
  totalRoles: number;
  totalPermissions: number;
  totalActiveSessions: number;
  totalSecurityIncidents: number;
  criticalIncidents: number;
  totalIpRestrictions: number;
  recentActivity: Array<{
    type: string;
    count: number;
    timestamp: string;
  }>;
}

export interface CreateSecurityIncidentData {
  userId?: string;
  incidentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSecurityIncidentData {
  resolved?: boolean;
  resolvedBy?: string;
  description?: string;
}

export interface UpdateSecurityIncidentArgs {
  id: string;
  updates: UpdateSecurityIncidentData;
}

export interface CreateIpRestrictionData {
  ipAddress: string;
  type: 'ALLOW' | 'BLOCK';
  reason?: string;
  expiresAt?: string;
}

export interface SecurityIncidentQueryParams {
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved?: boolean;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ==========================================
// SECURITY INCIDENTS OPERATIONS
// ==========================================

/**
 * Get security incidents with optional filters
 */
export async function getSecurityIncidentsAction(
  params?: SecurityIncidentQueryParams
): Promise<ActionResult<{ incidents: SecurityIncident[]; pagination?: PaginationInfo }>> {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `/api/v1/access-control/security-incidents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await serverGet<{ incidents: SecurityIncident[]; pagination?: PaginationInfo }>(
      url,
      {
        next: { tags: ['security-incidents'], revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch security incidents');
    }

    return {
      success: true,
      data: response.data,
      message: 'Security incidents fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch security incidents';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create a new security incident
 */
export async function createSecurityIncidentAction(data: CreateSecurityIncidentData): Promise<ActionResult<SecurityIncident>> {
  try {
    // Validate required fields
    if (!data.incidentType || !data.severity || !data.description) {
      return {
        success: false,
        error: 'Missing required fields: incidentType, severity, description'
      };
    }

    const response = await serverPost<{ incident: SecurityIncident }>(
      '/api/v1/access-control/security-incidents',
      data,
      {
        cache: 'no-store',
        next: { tags: ['security-incidents'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create security incident');
    }

    // Cache invalidation
    revalidateTag('security-incidents', 'default');
    revalidatePath('/admin/security', 'page');

    return {
      success: true,
      data: response.data.incident,
      message: 'Security incident created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create security incident';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update a security incident (e.g., mark as resolved)
 */
export async function updateSecurityIncidentAction(args: UpdateSecurityIncidentArgs): Promise<ActionResult<SecurityIncident>> {
  try {
    const { id, updates } = args;

    if (!id) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    const response = await serverPut<{ incident: SecurityIncident }>(
      `/api/v1/access-control/security-incidents/${id}`,
      updates,
      {
        cache: 'no-store',
        next: { tags: ['security-incidents', `security-incident-${id}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update security incident');
    }

    // Cache invalidation
    revalidateTag('security-incidents', 'default');
    revalidateTag(`security-incident-${id}`, 'default');
    revalidatePath('/admin/security', 'page');

    return {
      success: true,
      data: response.data.incident,
      message: 'Security incident updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update security incident';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// IP RESTRICTIONS OPERATIONS
// ==========================================

/**
 * Get all IP restrictions
 */
export async function getIpRestrictionsAction(): Promise<ActionResult<IpRestriction[]>> {
  try {
    const response = await serverGet<{ restrictions: IpRestriction[] }>(
      '/api/v1/access-control/ip-restrictions',
      {
        next: { tags: ['ip-restrictions'], revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch IP restrictions');
    }

    return {
      success: true,
      data: response.data.restrictions,
      message: 'IP restrictions fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch IP restrictions';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Add a new IP restriction
 */
export async function addIpRestrictionAction(data: CreateIpRestrictionData): Promise<ActionResult<IpRestriction>> {
  try {
    // Validate required fields
    if (!data.ipAddress || !data.type) {
      return {
        success: false,
        error: 'Missing required fields: ipAddress, type'
      };
    }

    const response = await serverPost<{ restriction: IpRestriction }>(
      '/api/v1/access-control/ip-restrictions',
      data,
      {
        cache: 'no-store',
        next: { tags: ['ip-restrictions'] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to add IP restriction');
    }

    // Cache invalidation
    revalidateTag('ip-restrictions', 'default');
    revalidatePath('/admin/security', 'page');

    return {
      success: true,
      data: response.data.restriction,
      message: 'IP restriction added successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to add IP restriction';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Remove an IP restriction
 */
export async function removeIpRestrictionAction(id: string): Promise<ActionResult<string>> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'IP restriction ID is required'
      };
    }

    const response = await serverDelete(
      `/api/v1/access-control/ip-restrictions/${id}`,
      {
        cache: 'no-store'
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove IP restriction');
    }

    // Cache invalidation
    revalidateTag('ip-restrictions', 'default');
    revalidatePath('/admin/security', 'page');

    return {
      success: true,
      data: id,
      message: 'IP restriction removed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to remove IP restriction';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// STATISTICS OPERATIONS
// ==========================================

/**
 * Get access control statistics
 */
export async function getAccessControlStatisticsAction(): Promise<ActionResult<AccessControlStatistics>> {
  try {
    const response = await serverGet<AccessControlStatistics>(
      '/api/v1/access-control/statistics',
      {
        next: { tags: ['access-control-stats'], revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch access control statistics');
    }

    return {
      success: true,
      data: response.data,
      message: 'Statistics fetched successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to fetch access control statistics';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// CACHE REVALIDATION
// ==========================================

/**
 * Revalidate security incidents cache
 */
export async function revalidateSecurityIncidentsCache(): Promise<void> {
  revalidateTag('security-incidents', 'default');
  revalidatePath('/admin/security', 'page');
}

/**
 * Revalidate IP restrictions cache
 */
export async function revalidateIpRestrictionsCache(): Promise<void> {
  revalidateTag('ip-restrictions', 'default');
  revalidatePath('/admin/security', 'page');
}

/**
 * Revalidate access control statistics cache
 */
export async function revalidateAccessControlStatsCache(): Promise<void> {
  revalidateTag('access-control-stats', 'default');
  revalidatePath('/admin/security', 'page');
}
