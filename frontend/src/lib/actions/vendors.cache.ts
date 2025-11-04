/**
 * @fileoverview Vendor Caching Utilities
 * @module lib/actions/vendors/cache
 *
 * Caching layer for vendor data with Next.js cache integration.
 * Includes cached getter functions and cache invalidation utilities.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types';
import type {
  Vendor,
  VendorContract,
  VendorEvaluation,
  VendorFilters,
  VendorAnalytics
} from './vendors.types';

// Import cache tags
import { VENDOR_CACHE_TAGS as CACHE_TAGS } from './vendors.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get vendor by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getVendor = cache(async (id: string): Promise<Vendor | null> => {
  try {
    const response = await serverGet<ApiResponse<Vendor>>(
      API_ENDPOINTS.VENDORS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-${id}`, CACHE_TAGS.VENDORS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get vendor:', error);
    return null;
  }
});

/**
 * Get all vendors with optional filtering and caching
 */
export const getVendors = cache(async (filters?: VendorFilters): Promise<Vendor[]> => {
  try {
    const response = await serverGet<ApiResponse<Vendor[]>>(
      API_ENDPOINTS.VENDORS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [CACHE_TAGS.VENDORS, 'vendor-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendors:', error);
    return [];
  }
});

/**
 * Get vendor contracts with caching
 */
export const getVendorContracts = cache(async (vendorId: string): Promise<VendorContract[]> => {
  try {
    const response = await serverGet<ApiResponse<VendorContract[]>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/contracts`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-contracts-${vendorId}`, CACHE_TAGS.CONTRACTS]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendor contracts:', error);
    return [];
  }
});

/**
 * Get vendor evaluations with caching
 */
export const getVendorEvaluations = cache(async (vendorId: string): Promise<VendorEvaluation[]> => {
  try {
    const response = await serverGet<ApiResponse<VendorEvaluation[]>>(
      `${API_ENDPOINTS.VENDORS.BY_ID(vendorId)}/evaluations`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`vendor-evaluations-${vendorId}`, CACHE_TAGS.EVALUATIONS]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get vendor evaluations:', error);
    return [];
  }
});

/**
 * Get vendor analytics with caching
 */
export const getVendorAnalytics = cache(async (filters?: Record<string, unknown>): Promise<VendorAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<VendorAnalytics>>(
      API_ENDPOINTS.VENDORS.STATISTICS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['vendor-analytics', 'vendor-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get vendor analytics:', error);
    return null;
  }
});

// ==========================================
// CACHE INVALIDATION
// ==========================================

/**
 * Clear vendor cache for specific vendor or all vendors
 * Invalidates all related cache tags and paths
 */
export async function clearVendorCache(vendorId?: string): Promise<void> {
  if (vendorId) {
    revalidateTag(`vendor-${vendorId}`, 'default');
    revalidateTag(`vendor-contracts-${vendorId}`, 'default');
    revalidateTag(`vendor-evaluations-${vendorId}`, 'default');
  }

  // Clear all vendor caches
  Object.values(CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('vendor-list', 'default');
  revalidateTag('vendor-stats', 'default');

  // Clear paths
  revalidatePath('/vendors', 'page');
  if (vendorId) {
    revalidatePath(`/vendors/${vendorId}`, 'page');
  }
}
