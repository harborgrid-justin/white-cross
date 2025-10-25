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
 * @fileoverview Allergy Service Type Definitions
 *
 * Central TypeScript type definitions for allergy services. Defines severity levels,
 * data transfer objects, search filters, and response structures used throughout the
 * allergy management system. All types align with clinical allergy documentation standards.
 *
 * @module services/allergy/types
 * @since 1.0.0
 */

import { AllergySeverity as AllergySeverityEnum } from '../../database/types/enums';

/**
 * Clinical allergy severity levels aligned with medical standards.
 *
 * Severity classification guides clinical decision-making, medication cross-checking
 * priority, and emergency response protocols.
 *
 * @typedef {('MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING')} AllergySeverity
 *
 * @property {'MILD'} MILD - Minor reactions (mild rash, itching) - monitoring required
 * @property {'MODERATE'} MODERATE - Significant reactions (widespread hives) - medical evaluation needed
 * @property {'SEVERE'} SEVERE - Serious reactions requiring immediate medical intervention
 * @property {'LIFE_THREATENING'} LIFE_THREATENING - Anaphylaxis risk - requires EpiPen and emergency services
 *
 * @example
 * ```typescript
 * const severity: AllergySeverity = 'LIFE_THREATENING';
 * if (severity === 'LIFE_THREATENING' || severity === 'SEVERE') {
 *   console.log('CRITICAL: Medication cross-check required');
 * }
 * ```
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Data transfer object for creating new allergy records.
 *
 * @interface CreateAllergyData
 * @property {string} studentId - Student's unique identifier (required)
 * @property {string} allergen - Allergen name: medication, food, or environmental substance (required)
 * @property {string} [allergenType] - Category: MEDICATION, FOOD, ENVIRONMENTAL, etc.
 * @property {AllergySeverity} severity - Clinical severity classification (required)
 * @property {string} [reaction] - Detailed description of allergic reaction symptoms
 * @property {string} [treatment] - Emergency treatment protocol and intervention
 * @property {boolean} verified - Whether clinically verified by healthcare professional (required)
 * @property {string} [verifiedBy] - User ID of healthcare professional who verified allergy
 * @property {Date} [verifiedAt] - Verification timestamp (auto-set if verified=true)
 * @property {string} [notes] - Additional clinical notes and observations
 * @property {string} [healthRecordId] - Link to comprehensive health record if applicable
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
 * Data transfer object for updating existing allergy records.
 *
 * All fields from CreateAllergyData are optional for partial updates.
 *
 * @interface UpdateAllergyData
 * @extends {Partial<CreateAllergyData>}
 * @property {boolean} [isActive] - Active status flag for soft-delete functionality
 *
 * @remarks
 * Partial updates allow modifying individual fields without replacing entire record.
 * Use isActive=false for soft-delete (deactivation) while preserving clinical history.
 */
export interface UpdateAllergyData extends Partial<CreateAllergyData> {
  isActive?: boolean;
}

/**
 * Search and filter criteria for allergy queries.
 *
 * @interface AllergyFilters
 * @property {string} [studentId] - Filter to specific student's allergies
 * @property {AllergySeverity} [severity] - Filter by severity level
 * @property {string} [allergenType] - Filter by allergen category
 * @property {boolean} [verified] - Filter by verification status
 * @property {boolean} [isActive] - Filter by active/inactive status
 * @property {string} [searchTerm] - Full-text search across allergen, reaction, treatment, notes
 *
 * @remarks
 * All filters are optional and combine with AND logic. Empty filters object returns all allergies.
 * searchTerm performs case-insensitive LIKE search across multiple text fields.
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
 * Pagination controls for query operations.
 *
 * @interface PaginationOptions
 * @property {number} [page=1] - Page number (1-indexed)
 * @property {number} [limit=20] - Results per page
 *
 * @remarks
 * Page numbers are 1-indexed for user-friendly APIs. Backend converts to 0-indexed offset.
 * Default limit of 20 balances performance and usability.
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Allergy statistics aggregation for analytics and reporting.
 *
 * @interface AllergyStatistics
 * @property {number} total - Total number of allergies matching filters
 * @property {Record<string, number>} bySeverity - Count by severity level (MILD, MODERATE, SEVERE, LIFE_THREATENING)
 * @property {Record<string, number>} byType - Count by allergen type (MEDICATION, FOOD, ENVIRONMENTAL, etc.)
 * @property {number} verified - Count of clinically verified allergies
 * @property {number} unverified - Count of unverified (parent-reported) allergies
 * @property {number} critical - Count of SEVERE and LIFE_THREATENING allergies
 *
 * @remarks
 * Used for clinical dashboards, safety monitoring, and compliance reporting.
 * Critical count highlights high-risk allergies requiring immediate attention.
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
 * Paginated search results with metadata.
 *
 * @interface PaginatedAllergyResults
 * @property {Array<any>} allergies - Array of allergy records matching search criteria
 * @property {number} total - Total count across all pages
 * @property {number} page - Current page number (1-indexed)
 * @property {number} pages - Total number of pages
 *
 * @remarks
 * Supports efficient UI pagination and infinite scroll implementations.
 * Total and pages enable accurate pagination controls and progress indicators.
 */
export interface PaginatedAllergyResults {
  allergies: any[];
  total: number;
  page: number;
  pages: number;
}
