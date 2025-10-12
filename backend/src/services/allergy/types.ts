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
