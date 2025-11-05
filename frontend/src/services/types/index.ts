/**
 * @fileoverview Service Layer Type Re-exports for Type Consistency
 * @module services/types
 * @category Services
 *
 * Centralized re-export point for all service-layer types, ensuring type consistency
 * between services and components. This barrel export prevents type incompatibilities
 * and provides a single source of truth for service-related type definitions.
 *
 * Type Unification Strategy:
 * - Re-exports all types from the main @/types directory
 * - Ensures service layer uses identical types as component layer
 * - Prevents type duplication and version mismatches
 * - Enables easy type refactoring and evolution
 *
 * Architecture Benefits:
 * - Single import path for all service types
 * - Consistent type definitions across layers
 * - Prevents circular type dependencies
 * - Simplifies type imports for service modules
 *
 * Healthcare Context:
 * - Patient, Medication, Appointment types
 * - Health record and vital signs types
 * - API response and error types
 * - Authentication and authorization types
 *
 * @example
 * ```typescript
 * // Import types for service implementation
 * import type { Patient, Medication, ApiResponse } from '@/services/types';
 *
 * // Use in service function
 * async function getPatient(id: string): Promise<ApiResponse<Patient>> {
 *   const response = await apiClient.get<ApiResponse<Patient>>(`/api/patients/${id}`);
 *   return response.data;
 * }
 *
 * // Import medication types
 * import type { Medication, MedicationOrder } from '@/services/types';
 *
 * async function createOrder(order: Omit<MedicationOrder, 'id'>): Promise<MedicationOrder> {
 *   // Implementation
 * }
 *
 * // Import API response types
 * import type { ApiResponse, ApiError } from '@/services/types';
 *
 * function handleResponse<T>(response: ApiResponse<T>): T {
 *   if (response.success) {
 *     return response.data;
 *   }
 *   throw new Error(response.message);
 * }
 * ```
 *
 * @remarks
 * This module should be the primary import point for types within the service layer.
 * Importing directly from @/types in services can lead to inconsistencies if types
 * evolve differently. Always import from @/services/types within service modules.
 *
 * @see {@link @/types} for main type definitions
 */

/**
 * Re-export all types from the main types directory for service layer use
 *
 * @description
 * Exports all types from @/types to ensure consistency between services and components.
 * This includes Patient, Medication, Appointment, User, and all domain types.
 */
export * from '../../types'

/**
 * Explicitly re-export commonly used API types for better IDE support
 *
 * @description
 * These explicit re-exports provide better autocomplete and documentation in IDEs
 * for the most frequently used types in service implementations.
 */
export type {
  ApiResponse,
  LegacyMedicationWithCount
} from '../../types'
