/**
 * API Configuration and Exports Module
 *
 * Central re-export hub for medication domain API functionality. This module serves as the
 * primary entry point for API-related utilities and client configuration used throughout
 * the White Cross Healthcare Platform.
 *
 * @module hooks/api
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Purpose**:
 * - Centralized API exports for medications domain
 * - Provides consistent import path for API utilities
 * - Enables domain-driven API organization
 *
 * **Architecture**:
 * - Re-exports from canonical medication API location
 * - Maintains backward compatibility for legacy imports
 * - Supports future multi-domain API expansion
 *
 * **Usage Patterns**:
 * ```typescript
 * // Import API utilities
 * import { medicationsApi } from '@/hooks/api';
 *
 * // Use API client
 * const medications = await medicationsApi.getAll();
 * ```
 *
 * **Integration**:
 * - Works with TanStack Query for data fetching
 * - Integrates with Redux for state management
 * - Supports authentication and authorization
 * - Includes error handling and retry logic
 *
 * @example
 * ```typescript
 * // Example 1: Import and use medication API
 * import { medicationsApi } from '@/hooks/api';
 *
 * const fetchMedications = async (studentId: string) => {
 *   try {
 *     const meds = await medicationsApi.getByStudent(studentId);
 *     console.log('Medications:', meds);
 *   } catch (error) {
 *     console.error('Failed to fetch medications:', error);
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Example 2: Use with React Query
 * import { useQuery } from '@tanstack/react-query';
 * import { medicationsApi } from '@/hooks/api';
 *
 * function useMedications(studentId: string) {
 *   return useQuery({
 *     queryKey: ['medications', 'student', studentId],
 *     queryFn: () => medicationsApi.getByStudent(studentId)
 *   });
 * }
 * ```
 *
 * @see {@link ./domains/medications/api} for canonical medication API implementation
 * @see {@link ./index} for main hooks export hub
 *
 * @since 1.0.0
 */
export * from './domains/medications/api';
