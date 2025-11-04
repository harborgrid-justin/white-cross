/**
 * @fileoverview Admin Data Caching Operations
 * @module lib/actions/admin.cache
 *
 * HIPAA-compliant cached read operations for administrative data.
 * Uses Next.js cache() for automatic memoization and revalidation.
 *
 * Features:
 * - Automatic request deduplication
 * - Configurable cache TTL per resource type
 * - Tag-based cache invalidation
 * - Type-safe data retrieval
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type {
  AdminUser,
  District,
  School,
  ApiResponse,
} from './admin.types';
import type { SystemHealth } from '@/types/domain/admin';

// ==========================================
// ADMIN USER CACHE OPERATIONS
// ==========================================

/**
 * Get admin user by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getAdminUser = cache(async (id: string): Promise<AdminUser | null> => {
  try {
    const response = await serverGet<ApiResponse<AdminUser>>(
      API_ENDPOINTS.ADMIN.USER_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`admin-user-${id}`, CACHE_TAGS.ADMIN_USERS]
        }
      }
    );

    return response.data || null;
  } catch (error) {
    console.error('Failed to get admin user:', error);
    return null;
  }
});

/**
 * Get all admin users with caching
 */
export const getAdminUsers = cache(async (filters?: Record<string, unknown>): Promise<AdminUser[]> => {
  try {
    const response = await serverGet<ApiResponse<AdminUser[]>>(
      API_ENDPOINTS.ADMIN.USERS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [CACHE_TAGS.ADMIN_USERS, 'admin-user-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get admin users:', error);
    return [];
  }
});

// ==========================================
// DISTRICT CACHE OPERATIONS
// ==========================================

/**
 * Get district by ID with caching
 */
export const getDistrict = cache(async (id: string): Promise<District | null> => {
  try {
    const response = await serverGet<ApiResponse<District>>(
      API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`district-${id}`, CACHE_TAGS.ADMIN_DISTRICTS]
        }
      }
    );

    return response.data || null;
  } catch (error) {
    console.error('Failed to get district:', error);
    return null;
  }
});

/**
 * Get all districts with caching
 */
export const getDistricts = cache(async (filters?: Record<string, unknown>): Promise<District[]> => {
  try {
    const response = await serverGet<ApiResponse<District[]>>(
      API_ENDPOINTS.ADMIN.DISTRICTS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [CACHE_TAGS.ADMIN_DISTRICTS, 'district-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get districts:', error);
    return [];
  }
});

// ==========================================
// SCHOOL CACHE OPERATIONS
// ==========================================

/**
 * Get school by ID with caching
 */
export const getSchool = cache(async (id: string): Promise<School | null> => {
  try {
    const response = await serverGet<ApiResponse<School>>(
      API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`school-${id}`, CACHE_TAGS.ADMIN_SCHOOLS]
        }
      }
    );

    return response.data || null;
  } catch (error) {
    console.error('Failed to get school:', error);
    return null;
  }
});

/**
 * Get all schools with caching
 */
export const getSchools = cache(async (filters?: Record<string, unknown>): Promise<School[]> => {
  try {
    const response = await serverGet<ApiResponse<School[]>>(
      API_ENDPOINTS.ADMIN.SCHOOLS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [CACHE_TAGS.ADMIN_SCHOOLS, 'school-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get schools:', error);
    return [];
  }
});

// ==========================================
// SYSTEM MONITORING CACHE OPERATIONS
// ==========================================

/**
 * Get system health information
 * Cached for 30 seconds to prevent excessive monitoring calls
 */
export const getSystemHealth = cache(async (): Promise<SystemHealth> => {
  try {
    // In production, fetch from actual monitoring service
    // For now, returning mock data
    const mockHealth: SystemHealth = {
      status: 'healthy',
      overall: {
        uptime: 2592000, // 30 days in seconds
        lastRestart: new Date('2025-09-26T00:00:00'),
        version: '1.0.0',
      },
      services: [
        {
          name: 'Database',
          status: 'operational',
          responseTime: 15,
          uptime: 99.9,
          lastCheck: new Date(),
        },
        {
          name: 'API Server',
          status: 'operational',
          responseTime: 45,
          uptime: 99.8,
          lastCheck: new Date(),
        },
        {
          name: 'Redis Cache',
          status: 'operational',
          responseTime: 5,
          uptime: 99.95,
          lastCheck: new Date(),
        },
        {
          name: 'Email Service',
          status: 'degraded',
          responseTime: 250,
          uptime: 98.5,
          lastCheck: new Date(),
          errorRate: 0.5,
        },
      ],
      metrics: {
        cpu: {
          usage: 45.2,
          cores: 8,
          temperature: 65,
        },
        memory: {
          used: 12884901888, // 12 GB
          total: 17179869184, // 16 GB
          percentage: 75,
        },
        disk: {
          used: 214748364800, // 200 GB
          total: 536870912000, // 500 GB
          percentage: 40,
        },
        network: {
          incoming: 1048576, // 1 MB/s
          outgoing: 524288, // 512 KB/s
        },
      },
      alerts: [
        {
          id: '1',
          severity: 'warning',
          service: 'Email Service',
          message: 'Response time above threshold (250ms > 200ms)',
          timestamp: new Date(),
          acknowledged: false,
        },
      ],
    };

    return mockHealth;
  } catch (error) {
    console.error('Failed to get system health:', error);
    throw new Error('Failed to retrieve system health information');
  }
});

/**
 * Get system metrics for dashboard
 */
export const getSystemMetrics = cache(async () => {
  // Mock metrics data - replace with actual implementation
  return {
    cpu: {
      usage: 35,
      cores: 8
    },
    memory: {
      used: 2048,
      total: 8192,
      percentage: 25
    },
    disk: {
      used: 120,
      total: 500,
      percentage: 24
    },
    network: {
      incoming: 1024,
      outgoing: 512
    }
  };
});
