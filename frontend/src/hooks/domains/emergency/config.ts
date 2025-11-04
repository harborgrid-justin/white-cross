/**
 * Emergency Domain Configuration Module
 *
 * Centralized configuration for emergency management system including query keys,
 * cache strategies, TypeScript types, and utility functions for TanStack Query integration.
 *
 * @module hooks/domains/emergency/config
 *
 * @remarks
 * This module provides the foundational configuration for the emergency management system:
 *
 * **Query Keys**:
 * - Hierarchical key structure for efficient cache management
 * - Supports filtering and detail views for all emergency entities
 * - Enables precise cache invalidation strategies
 *
 * **Cache Configuration**:
 * - Real-time data (incidents): 2-minute stale time with automatic refetch
 * - Static data (procedures): 1-hour stale time for reduced network traffic
 * - Balanced caching for contacts, resources, and training data
 *
 * **Type System**:
 * - Comprehensive TypeScript interfaces for all emergency entities
 * - Support for complex workflows (escalation, communication, recovery)
 * - Interoperability with incident reporting and healthcare compliance
 *
 * **HIPAA Compliance**:
 * - Audit trail support through user tracking in all entities
 * - PHI handling guidelines for emergency contacts
 * - Secure communication channel specifications
 *
 * @example
 * ```typescript
 * // Use query keys for cache management
 * import { EMERGENCY_QUERY_KEYS } from '@/hooks/domains/emergency/config';
 *
 * const queryKey = EMERGENCY_QUERY_KEYS.incidentDetails('incident-123');
 * queryClient.invalidateQueries({ queryKey });
 * ```
 *
 * @example
 * ```typescript
 * // Apply cache configuration
 * import { EMERGENCY_CACHE_CONFIG } from '@/hooks/domains/emergency/config';
 *
 * useQuery({
 *   queryKey: ['emergency-data'],
 *   queryFn: fetchData,
 *   staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
 * });
 * ```
 *
 * @deprecated This file is maintained for backward compatibility.
 * Import directly from the modular files for better tree-shaking:
 * - emergencyQueryKeys
 * - emergencyCacheConfig
 * - emergencyTypes
 * - emergencyCacheUtils
 *
 * @see {@link useEmergencyQueries} for query hook implementations
 * @see {@link useEmergencyMutations} for mutation hook implementations
 */

// Re-export query keys
export { EMERGENCY_QUERY_KEYS } from './emergencyQueryKeys';

// Re-export cache configuration
export { EMERGENCY_CACHE_CONFIG } from './emergencyCacheConfig';

// Re-export all type definitions
export type {
  EmergencyPlan,
  EmergencyPlanCategory,
  EmergencyIncident,
  IncidentType,
  IncidentLocation,
  IncidentTimelineEntry,
  IncidentCommunication,
  IncidentDamage,
  EmergencyContact,
  ContactAddress,
  ContactAvailability,
  EmergencyProcedure,
  ProcedureStep,
  ChecklistItem,
  ProcedureDocument,
  EmergencyResource,
  ResourceType,
  MaintenanceSchedule,
  ResourceSupplier,
  EmergencyTraining,
  TrainingFrequency,
  TrainingModule,
  TrainingActivity,
  TrainingMaterial,
  TrainingAssessment,
  AssessmentQuestion,
  EscalationLevel,
  EscalationRule,
  CommunicationStep,
  RecoveryStep,
  EmergencyUser,
} from './emergencyTypes';

// Re-export cache utility functions
export {
  invalidateEmergencyPlansQueries,
  invalidateIncidentsQueries,
  invalidateContactsQueries,
  invalidateProceduresQueries,
  invalidateResourcesQueries,
  invalidateTrainingQueries,
  invalidateAllEmergencyQueries,
} from './emergencyCacheUtils';
