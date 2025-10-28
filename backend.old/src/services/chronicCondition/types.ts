/**
 * LOC: C1955C1077
 * WC-GEN-232 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - businessLogic.ts (services/chronicCondition/businessLogic.ts)
 */

/**
 * WC-GEN-232 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @fileoverview Chronic Condition Type Definitions
 *
 * Comprehensive TypeScript type definitions for chronic condition management system.
 * Supports ICD-10 coded diagnoses, care plan tracking, educational accommodations,
 * and HIPAA-compliant PHI handling.
 *
 * @module services/chronicCondition/types
 *
 * @remarks
 * Healthcare Context:
 * - ICD-10 coding support for diagnosis tracking
 * - IEP/504 educational accommodation integration
 * - Care plan review scheduling and compliance
 * - Medication and restriction management
 * - Emergency protocol documentation
 *
 * @since 1.0.0
 */

/**
 * Chronic condition status indicating management phase and clinical state.
 *
 * Status drives care workflows, review scheduling, and reporting:
 * - ACTIVE: Requires ongoing management and monitoring
 * - MANAGED: Under control but still requires periodic review
 * - RESOLVED: Successfully treated or outgrown, minimal monitoring
 * - MONITORING: Under observation, not yet confirmed or actively managed
 *
 * @example
 * ```typescript
 * const newDiagnosis: ConditionStatus = 'ACTIVE';
 * const wellControlled: ConditionStatus = 'MANAGED';
 * const cured: ConditionStatus = 'RESOLVED';
 * ```
 */
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING';

/**
 * Data structure for creating a new chronic condition record.
 *
 * Captures comprehensive chronic disease information including diagnosis details,
 * care management requirements, medications, restrictions, and educational
 * accommodation needs.
 *
 * @property {string} studentId - UUID of the student (required, must exist in database)
 * @property {string} [healthRecordId] - UUID of associated health record
 * @property {string} condition - Condition name (e.g., "Type 1 Diabetes", "Asthma", "Epilepsy")
 * @property {string} [icdCode] - ICD-10 diagnosis code (e.g., "E10.9" for Type 1 Diabetes)
 * @property {Date} diagnosedDate - Date of official diagnosis
 * @property {string} [diagnosedBy] - Diagnosing healthcare provider name and credentials
 * @property {ConditionStatus} status - Current management status
 * @property {string} [severity] - Severity level (e.g., "Low", "Moderate", "High", "Critical")
 * @property {string} [notes] - Clinical notes and observations
 * @property {string} [carePlan] - Comprehensive care plan documentation
 * @property {string[]} [medications] - List of prescribed medications for this condition
 * @property {string[]} [restrictions] - Activity or dietary restrictions
 * @property {string[]} [triggers] - Known triggers that worsen the condition
 * @property {string[]} [accommodations] - Required school accommodations
 * @property {string} [emergencyProtocol] - Emergency response procedures
 * @property {Date} [lastReviewDate] - Date of most recent care plan review
 * @property {Date} [nextReviewDate] - Scheduled date for next review
 * @property {boolean} [requiresIEP] - Whether condition requires IEP (Individualized Education Program)
 * @property {boolean} [requires504] - Whether condition requires 504 accommodation plan
 *
 * @example
 * ```typescript
 * const diabetesData: CreateChronicConditionData = {
 *   studentId: 'uuid-student',
 *   condition: 'Type 1 Diabetes',
 *   icdCode: 'E10.9',
 *   diagnosedDate: new Date('2023-05-15'),
 *   diagnosedBy: 'Dr. Sarah Johnson, Pediatric Endocrinology',
 *   status: 'ACTIVE',
 *   severity: 'High',
 *   carePlan: 'Blood glucose monitoring 4x daily...',
 *   medications: ['Insulin - Humalog', 'Insulin - Lantus'],
 *   restrictions: ['No unsupervised activities until stable'],
 *   triggers: ['Illness', 'Stress', 'Irregular meals'],
 *   accommodations: ['Blood sugar checks during class', 'Snacks allowed'],
 *   emergencyProtocol: 'If BG <70 or >300, contact parent and 911',
 *   requiresIEP: true,
 *   nextReviewDate: new Date('2023-08-15')
 * };
 * ```
 */
export interface CreateChronicConditionData {
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosedDate: Date;
  diagnosedBy?: string;
  status: ConditionStatus;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  accommodations?: string[];
  emergencyProtocol?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  requiresIEP?: boolean;
  requires504?: boolean;
}

/**
 * Data structure for updating an existing chronic condition record.
 *
 * Extends CreateChronicConditionData with partial semantics, allowing selective
 * field updates. Includes isActive flag for deactivation control.
 *
 * @property {boolean} [isActive] - Flag to activate/deactivate condition record
 *
 * @example
 * ```typescript
 * const updateData: UpdateChronicConditionData = {
 *   status: 'MANAGED',
 *   carePlan: 'Updated care plan with new protocols...',
 *   lastReviewDate: new Date(),
 *   nextReviewDate: new Date('2024-07-01')
 * };
 * ```
 */
export interface UpdateChronicConditionData extends Partial<CreateChronicConditionData> {
  isActive?: boolean;
}

/**
 * Filter criteria for searching and querying chronic conditions.
 *
 * Supports multi-criteria filtering for care management, compliance reporting,
 * and population health monitoring.
 *
 * @property {string} [studentId] - Filter by specific student
 * @property {ConditionStatus} [status] - Filter by management status
 * @property {boolean} [requiresIEP] - Filter conditions requiring IEP plans
 * @property {boolean} [requires504] - Filter conditions requiring 504 plans
 * @property {boolean} [isActive] - Filter by active/inactive status
 * @property {string} [searchTerm] - Full-text search across condition, ICD code, notes, care plan
 * @property {boolean} [reviewDueSoon] - Filter conditions with reviews due within 30 days
 *
 * @example
 * ```typescript
 * const filters: ChronicConditionFilters = {
 *   status: 'ACTIVE',
 *   requiresIEP: true,
 *   searchTerm: 'diabetes'
 * };
 * ```
 */
export interface ChronicConditionFilters {
  studentId?: string;
  status?: ConditionStatus;
  requiresIEP?: boolean;
  requires504?: boolean;
  isActive?: boolean;
  searchTerm?: string;
  reviewDueSoon?: boolean;
}

/**
 * Pagination configuration for query results.
 *
 * @property {number} [page] - Page number (1-indexed, default: 1)
 * @property {number} [limit] - Results per page (default: 20, max recommended: 100)
 *
 * @example
 * ```typescript
 * const pagination: PaginationOptions = {
 *   page: 2,
 *   limit: 50
 * };
 * ```
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Aggregated statistics for chronic condition management and reporting.
 *
 * Provides population health metrics, compliance tracking, and resource planning data.
 *
 * @property {number} total - Total count of active chronic conditions
 * @property {Record<string, number>} byStatus - Count breakdown by status (ACTIVE, MANAGED, RESOLVED, MONITORING)
 * @property {number} requiresIEP - Count of conditions requiring IEP plans
 * @property {number} requires504 - Count of conditions requiring 504 accommodation plans
 * @property {number} reviewDueSoon - Count of conditions needing review within 30 days
 * @property {number} activeConditions - Count of conditions with ACTIVE status
 *
 * @example
 * ```typescript
 * const stats: ChronicConditionStatistics = {
 *   total: 45,
 *   byStatus: { ACTIVE: 30, MANAGED: 10, RESOLVED: 5, MONITORING: 0 },
 *   requiresIEP: 12,
 *   requires504: 8,
 *   reviewDueSoon: 7,
 *   activeConditions: 30
 * };
 * ```
 */
export interface ChronicConditionStatistics {
  total: number;
  byStatus: Record<string, number>;
  requiresIEP: number;
  requires504: number;
  reviewDueSoon: number;
  activeConditions: number;
}

/**
 * Paginated search results with metadata.
 *
 * @property {any[]} conditions - Array of ChronicCondition model instances with associations
 * @property {number} total - Total count of matching records (across all pages)
 * @property {number} page - Current page number
 * @property {number} pages - Total number of pages available
 *
 * @example
 * ```typescript
 * const results: ChronicConditionSearchResult = {
 *   conditions: [/* ChronicCondition instances *\/],
 *   total: 150,
 *   page: 1,
 *   pages: 8
 * };
 * ```
 */
export interface ChronicConditionSearchResult {
  conditions: any[]; // ChronicCondition type from models
  total: number;
  page: number;
  pages: number;
}

/**
 * Educational accommodation plan types.
 *
 * - IEP: Individualized Education Program (requires specialized instruction)
 * - 504: Section 504 accommodation plan (ensures equal access)
 * - BOTH: Conditions requiring either or both accommodation types
 *
 * @example
 * ```typescript
 * const iepOnly: AccommodationType = 'IEP';
 * const plan504Only: AccommodationType = '504';
 * const anyAccommodation: AccommodationType = 'BOTH';
 * ```
 */
export type AccommodationType = 'IEP' | '504' | 'BOTH';
