/**
 * WF-COMP-325 | incidents/statistics.ts - Incident statistics and analytics types
 * Purpose: Type definitions for incident statistics and search functionality
 * Upstream: API analytics endpoints | Dependencies: Core enums
 * Downstream: Analytics components, dashboards | Called by: Statistics hooks, reports
 * Related: entities.ts, responses.ts
 * Exports: Statistics interfaces | Key Features: Analytics and metrics tracking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Data aggregation → Statistics calculation → Analytics display
 * LLM Context: Incident statistics and analytics type definitions
 */

/**
 * Incident Reports Module - Statistics and Analytics Types
 * Provides analytics and metrics about incidents
 */

// =====================
// STATISTICS
// =====================

/**
 * Incident statistics response
 * Provides analytics and metrics about incidents
 */
export interface IncidentStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byLocation: Record<string, number>;
  parentNotificationRate: number;
  followUpRate: number;
  averageResponseTime: number; // in minutes
}

/**
 * Filter parameters for statistics queries
 */
export interface IncidentStatisticsFilters {
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}

// =====================
// SEARCH
// =====================

/**
 * Search parameters for incident reports
 */
export interface IncidentSearchParams {
  query: string;
  page?: number;
  limit?: number;
}
