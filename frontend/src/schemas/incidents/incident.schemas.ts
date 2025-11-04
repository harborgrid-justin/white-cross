/**
 * @fileoverview Incident Schemas - Barrel Export
 * @module schemas/incidents/incident
 *
 * Centralized export for all incident-related schemas, types, and validation utilities.
 * This file maintains backward compatibility while organizing schemas into focused modules.
 *
 * @remarks
 * Schema organization:
 * - incident.enums.schemas.ts: All enum definitions and constants
 * - incident.base.schemas.ts: Base incident schema with common fields
 * - incident.types.schemas.ts: Type-specific schemas (Injury, Illness, Behavioral, Safety, Emergency)
 * - incident.crud.schemas.ts: Create/Update schemas and discriminated union
 * - incident.filter.schemas.ts: Query, filter, and pagination schemas
 * - incident.validation.ts: Status transition and field validation utilities
 */

// ==========================================
// ENUMS & CONSTANTS
// ==========================================
export {
  // Primary enums
  IncidentType,
  IncidentStatus,
  IncidentSeverity,
  LocationType,
  MedicalResponse,
  ParentNotificationMethod,

  // Injury enums
  InjuryLocation,
  InjuryType,

  // Behavioral enums
  BehaviorType,

  // Safety enums
  HazardType,

  // Emergency enums
  EmergencyType,
  EmergencySeverity,

  // Enum types
  type IncidentTypeEnum,
  type IncidentStatusEnum,
  type IncidentSeverityEnum,
  type LocationTypeEnum,
  type MedicalResponseEnum,
  type ParentNotificationMethodEnum,
  type InjuryLocationEnum,
  type InjuryTypeEnum,
  type BehaviorTypeEnum,
  type HazardTypeEnum,
  type EmergencyTypeEnum,
  type EmergencySeverityEnum,
} from './incident.enums.schemas';

// ==========================================
// BASE SCHEMAS
// ==========================================
export {
  BaseIncidentSchema,
  AttachmentSchema,
  type BaseIncident,
  type Attachment,
} from './incident.base.schemas';

// ==========================================
// TYPE-SPECIFIC SCHEMAS
// ==========================================
export {
  // Schemas
  InjuryIncidentSchema,
  IllnessIncidentSchema,
  BehavioralIncidentSchema,
  SafetyIncidentSchema,
  EmergencyIncidentSchema,
  VitalsSchema,

  // Types
  type InjuryIncident,
  type IllnessIncident,
  type BehavioralIncident,
  type SafetyIncident,
  type EmergencyIncident,
  type Vitals,
} from './incident.types.schemas';

// ==========================================
// CRUD SCHEMAS
// ==========================================
export {
  // Main schemas
  IncidentSchema,
  CreateIncidentSchema,
  UpdateIncidentSchema,
  PatchIncidentSchema,

  // Type-specific create schemas
  CreateInjuryIncidentSchema,
  CreateIllnessIncidentSchema,
  CreateBehavioralIncidentSchema,
  CreateSafetyIncidentSchema,
  CreateEmergencyIncidentSchema,

  // Types
  type Incident,
  type CreateIncidentInput,
  type UpdateIncidentInput,
  type PatchIncidentInput,
  type CreateInjuryIncidentInput,
  type CreateIllnessIncidentInput,
  type CreateBehavioralIncidentInput,
  type CreateSafetyIncidentInput,
  type CreateEmergencyIncidentInput,
} from './incident.crud.schemas';

// ==========================================
// FILTER & QUERY SCHEMAS
// ==========================================
export {
  IncidentFilterSchema,
  AdvancedIncidentFilterSchema,
  IncidentSearchSchema,
  IncidentListResponseSchema,
  type IncidentFilter,
  type AdvancedIncidentFilter,
  type IncidentSearch,
  type IncidentListResponse,
} from './incident.filter.schemas';

// ==========================================
// VALIDATION UTILITIES
// ==========================================
export {
  VALID_STATUS_TRANSITIONS,
  isValidStatusTransition,
  getValidNextStatuses,
  isTerminalStatus,
  validateIncidentTypeFields,
} from './incident.validation';
