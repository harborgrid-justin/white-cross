/**
 * @fileoverview Incident Filter and Query Schemas
 * @module schemas/incidents/incident.filter
 *
 * Schemas for filtering, searching, sorting, and paginating incident records.
 * Supports complex queries with multiple filter criteria.
 */

import { z } from 'zod';
import {
  IncidentType,
  IncidentStatus,
  IncidentSeverity,
  LocationType,
} from './incident.enums.schemas';

// ==========================================
// INCIDENT FILTER SCHEMA
// ==========================================

/**
 * Incident Filter Schema
 *
 * @remarks
 * Comprehensive filtering options for incident queries:
 * - Type, status, severity, location filtering
 * - Student and reporter filtering
 * - Date range queries
 * - Full-text search
 * - Pagination with configurable page size
 * - Sorting by multiple fields with direction
 *
 * @example
 * ```typescript
 * const filter: IncidentFilter = {
 *   type: 'INJURY',
 *   status: 'PENDING_REVIEW',
 *   severity: 'SERIOUS',
 *   startDate: '2024-01-01T00:00:00Z',
 *   endDate: '2024-12-31T23:59:59Z',
 *   page: 1,
 *   limit: 20,
 *   sortBy: 'incidentDate',
 *   sortOrder: 'desc'
 * };
 * ```
 */
export const IncidentFilterSchema = z.object({
  // ==========================================
  // CLASSIFICATION FILTERS
  // ==========================================
  type: IncidentType.optional(),
  status: IncidentStatus.optional(),
  severity: IncidentSeverity.optional(),
  location: LocationType.optional(),

  // ==========================================
  // ENTITY FILTERS
  // ==========================================
  studentId: z.string().uuid().optional(),
  reportedBy: z.string().uuid().optional(),

  // ==========================================
  // DATE RANGE FILTERS
  // ==========================================
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  // ==========================================
  // SEARCH
  // ==========================================
  search: z.string().optional(),

  // ==========================================
  // PAGINATION
  // ==========================================
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),

  // ==========================================
  // SORTING
  // ==========================================
  sortBy: z.enum(['incidentDate', 'severity', 'status', 'type', 'createdAt']).default('incidentDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type IncidentFilter = z.infer<typeof IncidentFilterSchema>;

// ==========================================
// ADVANCED FILTER SCHEMAS
// ==========================================

/**
 * Advanced Incident Filter Schema
 *
 * @remarks
 * Extended filtering with additional criteria:
 * - Multiple types, statuses, severities
 * - Legal review status
 * - Follow-up requirements
 * - Confidentiality flags
 */
export const AdvancedIncidentFilterSchema = IncidentFilterSchema.extend({
  types: z.array(IncidentType).optional(),
  statuses: z.array(IncidentStatus).optional(),
  severities: z.array(IncidentSeverity).optional(),
  locations: z.array(LocationType).optional(),

  // Legal and compliance filters
  legalReviewRequired: z.boolean().optional(),
  isConfidential: z.boolean().optional(),
  requiresFollowUp: z.boolean().optional(),

  // Medical response filters
  medicalResponse: z.enum([
    'NONE',
    'FIRST_AID',
    'NURSE_EVALUATION',
    'PARENT_NOTIFIED',
    'URGENT_CARE',
    'EMERGENCY_ROOM',
    'AMBULANCE_CALLED',
    'HOSPITALIZED',
  ]).optional(),

  // Parent notification filter
  parentNotified: z.boolean().optional(),
});

export type AdvancedIncidentFilter = z.infer<typeof AdvancedIncidentFilterSchema>;

// ==========================================
// INCIDENT SEARCH SCHEMA
// ==========================================

/**
 * Incident Search Schema
 *
 * @remarks
 * Lightweight schema for quick searches without complex filters.
 * Useful for search bars and autocomplete functionality.
 */
export const IncidentSearchSchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().int().positive().max(50).default(10),
});

export type IncidentSearch = z.infer<typeof IncidentSearchSchema>;

// ==========================================
// INCIDENT LIST RESPONSE SCHEMA
// ==========================================

/**
 * Incident List Response Schema
 *
 * @remarks
 * Wrapper for paginated incident list responses.
 * Provides metadata for UI pagination controls.
 */
export const IncidentListResponseSchema = z.object({
  incidents: z.array(z.any()), // Use actual IncidentSchema in implementation
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasMore: z.boolean(),
});

export type IncidentListResponse = z.infer<typeof IncidentListResponseSchema>;
