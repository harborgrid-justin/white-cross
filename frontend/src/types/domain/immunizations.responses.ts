/**
 * WF-COMP-IMM | immunizations.responses.ts - API Response Interfaces
 * Purpose: Type definitions for API responses and action results
 * Upstream: API services, backend responses
 * Downstream: UI components, state management, error handling
 * Related: immunizations.records.ts, immunizations.compliance.ts, immunizations.statistics.ts
 * Exports: ActionResult, PaginationMeta, API response types
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Standardized API response structures for immunization operations
 */

import type { StudentImmunization } from './immunizations.records';
import type { StudentComplianceSummary } from './immunizations.compliance';
import type { ImmunizationDashboardStats, VaccineStatistics } from './immunizations.statistics';

// ==========================================
// ACTION RESULTS
// ==========================================

/**
 * Generic action result wrapper
 * Provides consistent structure for API responses
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata
 * Standard pagination information for list responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Paginated immunization records response
 */
export interface PaginatedImmunizationsResponse {
  immunizations: StudentImmunization[];
  pagination: PaginationMeta;
}

/**
 * Compliance report response
 * Comprehensive compliance data for reporting
 */
export interface ComplianceReportResponse {
  summary: ImmunizationDashboardStats;
  studentCompliance: StudentComplianceSummary[];
  vaccineStatistics: VaccineStatistics[];
  generatedAt: string;
}
