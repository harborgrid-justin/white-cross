/**
 * @fileoverview Admin Schools Management Server Actions
 * @module lib/actions/admin.schools
 * @category Admin - Server Actions
 */

'use server';

import { revalidateTag } from 'next/cache';
import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS } from '@/lib/cache/constants';

export interface School {
  id: string;
  name: string;
  code: string;
  districtId: string;
  districtName: string;
  address: string;
  phoneNumber: string;
  email: string;
  principalName: string;
  studentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSearchParams {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  districtId?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch schools data with server-side caching
 */
async function fetchSchoolsData(searchParams: SchoolSearchParams = {}) {
  const params = new URLSearchParams();
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.status && searchParams.status !== 'all') {
    params.append('status', searchParams.status);
  }
  if (searchParams.districtId && searchParams.districtId !== 'all') {
    params.append('districtId', searchParams.districtId);
  }
  if (searchParams.page) params.append('page', searchParams.page.toString());
  if (searchParams.limit) params.append('limit', searchParams.limit.toString());

  const response = await serverGet<{
    schools: School[];
    total: number;
    page: number;
    totalPages: number;
  }>(`${API_ENDPOINTS.ADMIN.SCHOOLS}?${params.toString()}`);

  return response;
}

/**
 * Get schools data for admin management
 * Server component compatible data fetcher
 */
export async function getAdminSchools(searchParams: SchoolSearchParams = {}) {
  try {
    const data = await fetchSchoolsData(searchParams);
    
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error('Error fetching admin schools:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch schools',
      data: {
        schools: [],
        total: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}

/**
 * Get single school by ID
 */
async function fetchSchoolById(id: string) {
  const response = await serverGet<School>(
    `${API_ENDPOINTS.ADMIN.SCHOOLS}/${id}`
  );

  return response;
}

/**
 * Get school by ID for admin management
 */
export async function getAdminSchoolById(id: string) {
  try {
    const data = await fetchSchoolById(id);
    
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error('Error fetching school:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch school',
      data: null,
    };
  }
}

/**
 * Get districts for school filtering
 */
async function fetchDistrictsForFilter() {
  const response = await serverGet<{ id: string; name: string }[]>(
    `${API_ENDPOINTS.ADMIN.DISTRICTS}?limit=100&status=active`
  );

  return response;
}

/**
 * Get districts for school filtering dropdown
 */
export async function getDistrictsForSchoolFilter() {
  try {
    const data = await fetchDistrictsForFilter();
    
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error('Error fetching districts for filter:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch districts',
      data: [],
    };
  }
}

/**
 * Invalidate schools cache
 * Used after mutations to ensure fresh data
 */
export async function revalidateSchoolsCache() {
  revalidateTag(CACHE_TAGS.ADMIN_SCHOOLS, 'default');
}
