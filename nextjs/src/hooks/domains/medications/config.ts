/**
 * Medications Domain Configuration
 * 
 * Enterprise-grade configuration for medications domain with query keys,
 * cache strategies, and medication-specific constants.
 * 
 * @module hooks/domains/medications/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { DataSensitivity } from '../../shared/useCacheManager';

/**
 * Centralized query key factory for medications domain
 */
export const medicationQueryKeys = {
  // Base keys
  domain: ['medications'] as const,
  
  // Main query categories
  base: {
    lists: () => [...medicationQueryKeys.domain, 'list'] as const,
    details: () => [...medicationQueryKeys.domain, 'detail'] as const,
    inventory: () => [...medicationQueryKeys.domain, 'inventory'] as const,
    administration: () => [...medicationQueryKeys.domain, 'administration'] as const,
    reminders: () => [...medicationQueryKeys.domain, 'reminders'] as const,
    reactions: () => [...medicationQueryKeys.domain, 'adverse-reactions'] as const,
    alerts: () => [...medicationQueryKeys.domain, 'alerts'] as const,
    statistics: () => [...medicationQueryKeys.domain, 'statistics'] as const,
  },
  
  // Specific queries
  lists: {
    all: (filters?: any) => [...medicationQueryKeys.base.lists(), filters] as const,
    byStudent: (studentId: string) => [...medicationQueryKeys.base.lists(), 'student', studentId] as const,
    active: () => [...medicationQueryKeys.base.lists(), 'active'] as const,
  },
  
  details: {
    byId: (id: string) => [...medicationQueryKeys.base.details(), id] as const,
  },
  
  inventory: {
    all: (filters?: any) => [...medicationQueryKeys.base.inventory(), filters] as const,
    lowStock: () => [...medicationQueryKeys.base.inventory(), 'low-stock'] as const,
    byCategory: (category: string) => [...medicationQueryKeys.base.inventory(), 'category', category] as const,
  },
  
  administration: {
    byStudent: (studentId: string, date?: string) => [...medicationQueryKeys.base.administration(), 'student', studentId, date] as const,
    schedule: (date?: string) => [...medicationQueryKeys.base.administration(), 'schedule', date] as const,
    history: (studentId: string, limit?: number) => [...medicationQueryKeys.base.administration(), 'history', studentId, limit] as const,
  },
  
  reminders: {
    all: (filters?: any) => [...medicationQueryKeys.base.reminders(), filters] as const,
    upcoming: (hours?: number) => [...medicationQueryKeys.base.reminders(), 'upcoming', hours] as const,
    byStudent: (studentId: string) => [...medicationQueryKeys.base.reminders(), 'student', studentId] as const,
  },
  
  reactions: {
    all: (filters?: any) => [...medicationQueryKeys.base.reactions(), filters] as const,
    byStudent: (studentId: string) => [...medicationQueryKeys.base.reactions(), 'student', studentId] as const,
    byMedication: (medicationId: string) => [...medicationQueryKeys.base.reactions(), 'medication', medicationId] as const,
  },
  
  alerts: {
    all: () => [...medicationQueryKeys.base.alerts()] as const,
    critical: () => [...medicationQueryKeys.base.alerts(), 'critical'] as const,
    byStudent: (studentId: string) => [...medicationQueryKeys.base.alerts(), 'student', studentId] as const,
  },
  
  statistics: {
    overview: (filters?: any) => [...medicationQueryKeys.base.statistics(), 'overview', filters] as const,
    compliance: (period?: string) => [...medicationQueryKeys.base.statistics(), 'compliance', period] as const,
  },
} as const;

/**
 * Data sensitivity mapping for medications domain
 */
export const MEDICATION_DATA_SENSITIVITY: Record<string, DataSensitivity> = {
  // Patient medication data - critical sensitivity
  medicationDetails: 'critical',
  patientMedications: 'critical',
  administrationRecords: 'critical',
  adverseReactions: 'critical',
  
  // Medication information - PHI sensitivity
  medicationInfo: 'phi',
  dosageInfo: 'phi',
  prescriptionData: 'phi',
  
  // Operational data - confidential sensitivity
  inventory: 'confidential',
  reminders: 'confidential',
  alerts: 'confidential',
  
  // Statistics and analytics - internal sensitivity
  statistics: 'internal',
  complianceReports: 'internal',
  
  // System data - public sensitivity
  medicationCatalog: 'public',
  categories: 'public',
} as const;

/**
 * Cache configuration for medications domain
 */
export const MEDICATION_CACHE_CONFIG = {
  // Critical patient medication data - minimal caching
  patientMedications: {
    staleTime: 0, // Always fresh
    gcTime: 1 * 60 * 1000, // 1 minute
  },
  
  // Administration records - very short cache
  administration: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  },
  
  // Adverse reactions - no cache for safety
  adverseReactions: {
    staleTime: 0, // Always fresh
    gcTime: 1 * 60 * 1000, // 1 minute
  },
  
  // Alerts - short cache
  alerts: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  },
  
  // Reminders - short cache
  reminders: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Inventory - moderate cache
  inventory: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },
  
  // Medication catalog - longer cache
  catalog: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  // Statistics - longer cache
  statistics: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Mutations
  mutations: {
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Medication list filters interface
 */
export interface MedicationListFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  studentId?: string;
  sortBy?: 'name' | 'category' | 'dateAdded' | 'lastAdministered';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Medication error codes
 */
export const MEDICATION_ERROR_CODES = {
  NOT_FOUND: 'Medication not found',
  CREATE_FAILED: 'Failed to create medication',
  UPDATE_FAILED: 'Failed to update medication',
  DELETE_FAILED: 'Failed to delete medication',
  ADMINISTRATION_FAILED: 'Failed to record medication administration',
  INVENTORY_ERROR: 'Inventory operation failed',
  DOSAGE_VALIDATION_ERROR: 'Invalid dosage format',
  ALLERGY_CONFLICT: 'Medication conflicts with known allergies',
  INTERACTION_WARNING: 'Potential drug interaction detected',
  INSUFFICIENT_INVENTORY: 'Insufficient inventory for administration',
} as const;

/**
 * Medication operations constants
 */
export const MEDICATION_OPERATIONS = {
  CREATE: 'create_medication',
  UPDATE: 'update_medication',
  DELETE: 'delete_medication',
  ADMINISTER: 'administer_medication',
  REPORT_REACTION: 'report_adverse_reaction',
  UPDATE_INVENTORY: 'update_inventory',
  CREATE_REMINDER: 'create_reminder',
  DISMISS_ALERT: 'dismiss_alert',
} as const;

/**
 * Dosage validation regex patterns
 */
export const DOSAGE_PATTERNS = {
  STANDARD: /^[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp|g|mcg|mL|L)$/i,
  RANGE: /^[0-9]+(\.[0-9]+)?\s*-\s*[0-9]+(\.[0-9]+)?\s*(mg|ml|units?|tablets?|capsules?|puffs?|drops?|tsp|tbsp|g|mcg|mL|L)$/i,
  PER_KG: /^[0-9]+(\.[0-9]+)?\s*(mg|ml|mcg|g)\/kg$/i,
} as const;