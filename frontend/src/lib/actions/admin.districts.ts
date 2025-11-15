/**
 * @fileoverview Admin Districts Management Server Actions
 * @module lib/actions/admin.districts
 * @category Admin - Server Actions
 */

'use server';

import { revalidateTag } from 'next/cache';
import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS } from '@/lib/cache/constants';

export interface District {
  id: string;
  name: string;
  code: string;
  address: string;
  phoneNumber: string;
  email: string;
  schoolCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DistrictSearchParams {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

/**
 * Fetch districts data with server-side caching
 */
async function fetchDistrictsData(searchParams: DistrictSearchParams = {}) {
  const params = new URLSearchParams();
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.status && searchParams.status !== 'all') {
    params.append('status', searchParams.status);
  }
  if (searchParams.page) params.append('page', searchParams.page.toString());
  if (searchParams.limit) params.append('limit', searchParams.limit.toString());

  const response = await serverGet<{
    districts: District[];
    total: number;
    page: number;
    totalPages: number;
  }>(`${API_ENDPOINTS.ADMIN.DISTRICTS}?${params.toString()}`);

  return response;
}

/**
 * Get districts data for admin management
 * Server component compatible data fetcher
 */
export async function getAdminDistricts(searchParams: DistrictSearchParams = {}) {
  try {
    const data = await fetchDistrictsData(searchParams);
    
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error('Error fetching admin districts:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch districts',
      data: {
        districts: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}

/**
 * Get single district by ID
 */
async function fetchDistrictById(id: string) {
  const response = await serverGet<District>(
    `${API_ENDPOINTS.ADMIN.DISTRICTS}/${id}`
  );

  return response;
}

/**
 * Get district by ID for admin management
 */
export async function getAdminDistrictById(id: string) {
  try {
    const data = await fetchDistrictById(id);
    
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error('Error fetching district:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch district',
      data: null,
    };
  }
}

/**
 * Invalidate districts cache
 * Used after mutations to ensure fresh data
 */
export async function revalidateDistrictsCache() {
  revalidateTag(CACHE_TAGS.ADMIN_DISTRICTS, 'default');
}
