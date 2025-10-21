/**
 * LOC: 7B66A8600C
 * WC-GEN-202 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - auditLogging.ts (services/allergy/auditLogging.ts)
 *   - bulkOperations.ts (services/allergy/bulkOperations.ts)
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 *   - queryOperations.ts (services/allergy/queryOperations.ts)
 *   - statistics.ts (services/allergy/statistics.ts)
 *   - ... and 1 more
 */

/**
 * WC-GEN-202 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Allergy Service Types and Interfaces
 *
 * Central location for all allergy-related type definitions
 *
 * @module services/allergy/types
 */

import { AllergySeverity as AllergySeverityEnum } from '../../database/types/enums';

/**
 * Allergy severity levels (aligned with medical standards)
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Interface for creating a new allergy record
 */
export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  allergenType?: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
  healthRecordId?: string;
}

/**
 * Interface for updating an allergy record
 */
export interface UpdateAllergyData extends Partial<CreateAllergyData> {
  isActive?: boolean;
}

/**
 * Interface for allergy search filters
 */
export interface AllergyFilters {
  studentId?: string;
  severity?: AllergySeverity;
  allergenType?: string;
  verified?: boolean;
  isActive?: boolean;
  searchTerm?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Allergy statistics response
 */
export interface AllergyStatistics {
  total: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  verified: number;
  unverified: number;
  critical: number;
}

/**
 * Paginated allergy search results
 */
export interface PaginatedAllergyResults {
  allergies: any[];
  total: number;
  page: number;
  pages: number;
}
