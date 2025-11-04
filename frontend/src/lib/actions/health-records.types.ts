/**
 * @fileoverview Type Definitions for Health Records Module
 * @module lib/actions/health-records.types
 *
 * Shared TypeScript interfaces and types used across health records modules.
 * This module provides type safety for server actions, API responses, and dashboard metrics.
 */

/**
 * Standard action result interface for server actions
 * Used throughout health records modules for consistent response shape
 */
export interface ActionResult<T = unknown> {
  /** Indicates if the action succeeded */
  success?: boolean;
  /** Data payload returned on success */
  data?: T;
  /** Field-level validation errors */
  errors?: Record<string, string[]> & {
    /** Form-level errors */
    _form?: string[];
  };
  /** Human-readable success/error message */
  message?: string;
}

/**
 * Health Records Statistics Interface
 * Dashboard metrics for health records overview
 * Used by dashboard components for displaying aggregate data
 */
export interface HealthRecordsStats {
  /** Total number of health records across all types */
  totalRecords: number;
  /** Number of active medical conditions */
  activeConditions: number;
  /** Number of critical/severe allergies requiring immediate attention */
  criticalAllergies: number;
  /** Number of pending or overdue immunizations */
  pendingImmunizations: number;
  /** Number of records updated in the last 30 days */
  recentUpdates: number;
  /** Overall compliance percentage (0-100) */
  compliance: number;
  /** Number of follow-ups requiring urgent attention */
  urgentFollowUps: number;
  /** Breakdown of records by type */
  recordTypes: {
    /** Total immunization records */
    immunizations: number;
    /** Total allergy records */
    allergies: number;
    /** Total condition records */
    conditions: number;
    /** Total vital signs records */
    vitalSigns: number;
    /** Total medication records */
    medications: number;
  };
}
