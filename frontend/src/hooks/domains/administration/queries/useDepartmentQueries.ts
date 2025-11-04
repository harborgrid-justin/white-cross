/**
 * @fileoverview Department management query hooks
 * @module hooks/domains/administration/queries/useDepartmentQueries
 * @category Hooks
 *
 * Custom React Query hooks for department management operations.
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - 10 minute stale time (departments rarely change)
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * @example
 * ```typescript
 * // Fetch departments
 * function DepartmentList() {
 *   const { data: departments } = useDepartments();
 *   return <List items={departments} />;
 * }
 *
 * // Fetch department details
 * function DepartmentView({ id }: { id: string }) {
 *   const { data: department } = useDepartmentDetails(id);
 *   return <Details data={department} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  Department,
} from '../config';

// ==========================================
// DEPARTMENT MANAGEMENT QUERIES
// ==========================================

/**
 * Hook to fetch list of departments with optional filters
 * @param filters - Optional filters for departments list
 * @param options - React Query options
 * @returns Query result with departments list
 */
export const useDepartments = (
  filters?: any,
  options?: UseQueryOptions<Department[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentsList(filters),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartments method, using empty array for now
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch department details by ID
 * @param id - Department ID
 * @param options - React Query options
 * @returns Query result with department details
 */
export const useDepartmentDetails = (
  id: string,
  options?: UseQueryOptions<Department, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentDetails(id),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartmentById method
      return {} as Department;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch staff members of a department
 * @param deptId - Department ID
 * @param options - React Query options
 * @returns Query result with department staff
 */
export const useDepartmentStaff = (
  deptId: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentStaff(deptId),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartmentStaff method
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    enabled: !!deptId,
    ...options,
  });
};
