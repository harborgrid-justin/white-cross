/**
 * Combined Organizations Management Service
 *
 * @deprecated This service is deprecated and will be removed in a future version.
 * Use server actions from '@/lib/actions/admin.districts' and '@/lib/actions/admin.schools'.
 *
 * Migration Path:
 * 1. Split unified service calls into separate district and school actions
 * 2. Update imports from appropriate server action modules
 * 3. Remove OrganizationsService instantiation
 *
 * @example Migration example
 * ```typescript
 * // DEPRECATED: Legacy unified service
 * import { createOrganizationsService } from '@/services/modules/administrationApi/organizations';
 * const service = createOrganizationsService(apiClient);
 * const hierarchy = await service.getHierarchy();
 * const stats = await service.getOrganizationStatistics();
 *
 * // RECOMMENDED: Server actions approach
 * import { getDistricts } from '@/lib/actions/admin.districts';
 * import { getSchools } from '@/lib/actions/admin.schools';
 * // Build hierarchy from separate calls or use dedicated hierarchy action
 * const districts = await getDistricts();
 * const schools = await getSchools();
 * ```
 *
 * Provides unified access to both districts and schools management,
 * along with cross-organizational operations including:
 * - Organizational hierarchy management
 * - Cross-organization statistics
 * - Organization-wide search
 * - Unified reporting
 *
 * @module services/modules/administrationApi/organizations/organizations
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z } from 'zod';
import { ApiResponse } from '../../../types';
import { createApiError } from '../../../core/errors';
import type { District, School } from '../types';
import { DistrictsService, createDistrictsService } from './districts';
import { SchoolsService, createSchoolsService } from './schools';
import { handleZodValidationError } from './validation-utils';

/**
 * Combined Organizations Management Service
 */
export class OrganizationsService {
  public readonly districts: DistrictsService;
  public readonly schools: SchoolsService;

  constructor(private readonly client: ApiClient) {
    this.districts = createDistrictsService(client);
    this.schools = createSchoolsService(client);
  }

  /**
   * Get organizational hierarchy
   */
  async getHierarchy(): Promise<Array<District & {
    schools: School[];
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ hierarchy: Array<District & {
        schools: School[];
      }> }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/hierarchy`
      );

      return response.data.data.hierarchy;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch organizational hierarchy');
    }
  }

  /**
   * Get organizational statistics
   */
  async getOrganizationStatistics(): Promise<{
    totalDistricts: number;
    activeDistricts: number;
    totalSchools: number;
    activeSchools: number;
    totalUsers: number;
    activeUsers: number;
    totalEnrollment: number;
    schoolsByType: Record<string, number>;
    usersByRole: Record<string, number>;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalDistricts: number;
        activeDistricts: number;
        totalSchools: number;
        activeSchools: number;
        totalUsers: number;
        activeUsers: number;
        totalEnrollment: number;
        schoolsByType: Record<string, number>;
        usersByRole: Record<string, number>;
      }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/statistics/organizations`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch organization statistics');
    }
  }

  /**
   * Search across all organizations
   */
  async searchOrganizations(query: string, filters: {
    type?: 'district' | 'school' | 'both';
    isActive?: boolean;
    limit?: number;
  } = {}): Promise<{
    districts: District[];
    schools: School[];
    totalResults: number;
  }> {
    try {
      if (!query.trim()) throw new Error('Search query is required');

      const searchSchema = z.object({
        query: z.string().min(1, 'Query is required').max(255, 'Query too long'),
        type: z.enum(['district', 'school', 'both']).optional().default('both'),
        isActive: z.boolean().optional(),
        limit: z.number().int().min(1).max(100).optional().default(20),
      });

      const validatedFilters = searchSchema.parse({ query, ...filters });

      const params = new URLSearchParams();
      params.append('query', validatedFilters.query);
      params.append('type', validatedFilters.type);
      if (validatedFilters.isActive !== undefined) params.append('isActive', String(validatedFilters.isActive));
      params.append('limit', String(validatedFilters.limit));

      const response = await this.client.get<ApiResponse<{
        districts: District[];
        schools: School[];
        totalResults: number;
      }>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}/search?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        handleZodValidationError(error);
      }
      throw createApiError(error, 'Organization search failed');
    }
  }
}

/**
 * Factory function to create OrganizationsService instance
 */
export function createOrganizationsService(client: ApiClient): OrganizationsService {
  return new OrganizationsService(client);
}
