/**
 * WF-COMP-131 | healthRecordsConfig.ts - Configuration for health records caching
 * Purpose: Cache time constants and query key factory for health records
 * Upstream: None | Dependencies: None
 * Downstream: All health records hook modules
 * Related: Health records hooks, React Query configuration
 * Exports: constants, query key factory | Key Features: Healthcare-appropriate caching
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Cache configuration for healthcare data safety
 * LLM Context: HIPAA-compliant cache strategies and query key management
 */

import type { HealthRecordFilters } from '@/services';
import type { HealthRecord } from '@/types/healthRecords';
import type { PaginationParams } from './types';

/**
 * Cache time constants following healthcare safety standards:
 * - NO CACHE for safety-critical data (allergies, vital signs)
 * - Short cache for frequently changing data (health records)
 * - Moderate cache for historical data (vaccinations, screenings)
 * - Longer cache for stable data (growth measurements)
 */
export const STALE_TIME = {
  HEALTH_RECORDS: 5 * 60 * 1000,      // 5 minutes
  ALLERGIES: 0,                        // NO CACHE - safety critical
  CHRONIC_CONDITIONS: 5 * 60 * 1000,   // 5 minutes
  VACCINATIONS: 10 * 60 * 1000,        // 10 minutes
  GROWTH: 15 * 60 * 1000,              // 15 minutes
  SCREENINGS: 10 * 60 * 1000,          // 10 minutes
  VITALS: 0,                           // NO CACHE - real-time critical
  SUMMARY: 5 * 60 * 1000,              // 5 minutes
  STATISTICS: 5 * 60 * 1000,           // 5 minutes
};

export const CACHE_TIME = {
  DEFAULT: 30 * 60 * 1000,             // 30 minutes
  LONG: 60 * 60 * 1000,                // 1 hour
  CRITICAL: 0,                          // NO CACHE for critical data
};

export const RETRY_CONFIG = {
  ATTEMPTS: 3,
  DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Hierarchical query key factory for React Query cache management
 * Enables granular invalidation and cache updates
 */
export const healthRecordKeys = {
  all: ['healthRecords'] as const,

  // Health Records Main
  records: (studentId?: string, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'records', studentId, filters] as const,
  record: (id: string) => [...healthRecordKeys.all, 'record', id] as const,
  recordsByType: (studentId: string, type: HealthRecord['type']) =>
    [...healthRecordKeys.all, 'recordsByType', studentId, type] as const,
  timeline: (studentId: string) => [...healthRecordKeys.all, 'timeline', studentId] as const,
  summary: (studentId: string) => [...healthRecordKeys.all, 'summary', studentId] as const,
  search: (studentId: string, query: string) =>
    [...healthRecordKeys.all, 'search', studentId, query] as const,

  // Allergies
  allergies: (studentId: string) => [...healthRecordKeys.all, 'allergies', studentId] as const,
  allergy: (id: string) => [...healthRecordKeys.all, 'allergy', id] as const,
  criticalAllergies: (studentId: string) =>
    [...healthRecordKeys.all, 'criticalAllergies', studentId] as const,
  allergyContraindications: (studentId: string, medicationId?: string) =>
    [...healthRecordKeys.all, 'allergyContraindications', studentId, medicationId] as const,
  allergyStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'allergyStatistics', filters] as const,

  // Chronic Conditions
  chronicConditions: (studentId: string) =>
    [...healthRecordKeys.all, 'chronicConditions', studentId] as const,
  condition: (id: string) => [...healthRecordKeys.all, 'condition', id] as const,
  activeConditions: (studentId: string) =>
    [...healthRecordKeys.all, 'activeConditions', studentId] as const,
  conditionsNeedingReview: () => [...healthRecordKeys.all, 'conditionsNeedingReview'] as const,
  conditionStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'conditionStatistics', filters] as const,

  // Vaccinations
  vaccinations: (studentId: string) => [...healthRecordKeys.all, 'vaccinations', studentId] as const,
  vaccination: (id: string) => [...healthRecordKeys.all, 'vaccination', id] as const,
  vaccinationCompliance: (studentId: string) =>
    [...healthRecordKeys.all, 'vaccinationCompliance', studentId] as const,
  upcomingVaccinations: (studentId: string) =>
    [...healthRecordKeys.all, 'upcomingVaccinations', studentId] as const,
  vaccinationReport: (studentId: string) =>
    [...healthRecordKeys.all, 'vaccinationReport', studentId] as const,
  vaccinationStatistics: (schoolId?: string) =>
    [...healthRecordKeys.all, 'vaccinationStatistics', schoolId] as const,

  // Screenings
  screenings: (studentId: string) => [...healthRecordKeys.all, 'screenings', studentId] as const,
  screening: (id: string) => [...healthRecordKeys.all, 'screening', id] as const,
  screeningsDue: () => [...healthRecordKeys.all, 'screeningsDue'] as const,
  screeningStatistics: (filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'screeningStatistics', filters] as const,

  // Growth Measurements
  growth: (studentId: string) => [...healthRecordKeys.all, 'growth', studentId] as const,
  growthMeasurement: (id: string) => [...healthRecordKeys.all, 'growthMeasurement', id] as const,
  growthTrends: (studentId: string) => [...healthRecordKeys.all, 'growthTrends', studentId] as const,
  growthConcerns: (studentId: string) =>
    [...healthRecordKeys.all, 'growthConcerns', studentId] as const,
  growthPercentiles: (studentId: string) =>
    [...healthRecordKeys.all, 'growthPercentiles', studentId] as const,

  // Vital Signs
  vitals: (studentId: string, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'vitals', studentId, filters] as const,
  latestVitals: (studentId: string) => [...healthRecordKeys.all, 'latestVitals', studentId] as const,
  vitalTrends: (studentId: string, type?: string) =>
    [...healthRecordKeys.all, 'vitalTrends', studentId, type] as const,

  // Pagination
  paginated: (pagination?: PaginationParams, filters?: HealthRecordFilters) =>
    [...healthRecordKeys.all, 'paginated', pagination, filters] as const,
};
