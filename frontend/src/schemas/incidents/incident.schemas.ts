/**
 * @fileoverview Incident Report Validation Schemas
 * @module schemas/incidents/incident
 *
 * Comprehensive Zod schemas for incident reporting, validation, and legal compliance.
 * Supports multiple incident types with type-specific required fields.
 */

import { z } from 'zod';

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

/**
 * Incident Type Classification
 */
export const IncidentType = z.enum([
  'INJURY',              // Physical injuries
  'ILLNESS',             // Illness or symptoms
  'BEHAVIORAL',          // Behavioral incidents
  'SAFETY',              // Safety hazards or violations
  'EMERGENCY',           // Emergency situations
  'MEDICATION_ERROR',    // Medication administration errors
  'ALLERGIC_REACTION',   // Allergic reactions
  'SEIZURE',             // Seizure events
  'MENTAL_HEALTH',       // Mental health crises
  'BULLYING',            // Bullying incidents
  'PROPERTY_DAMAGE',     // Property damage
  'OTHER',               // Other incidents
]);

export type IncidentTypeEnum = z.infer<typeof IncidentType>;

/**
 * Incident Status Workflow
 * Legal workflow: pending → investigating → requires-action → resolved
 */
export const IncidentStatus = z.enum([
  'PENDING_REVIEW',      // Initial status - awaiting review
  'UNDER_INVESTIGATION', // Active investigation in progress
  'REQUIRES_ACTION',     // Action items identified, awaiting completion
  'RESOLVED',            // Fully resolved and closed
  'ARCHIVED',            // Archived for legal retention
]);

export type IncidentStatusEnum = z.infer<typeof IncidentStatus>;

/**
 * Incident Severity Classification
 */
export const IncidentSeverity = z.enum([
  'MINOR',               // Minor incident, no medical attention
  'MODERATE',            // Moderate incident, first aid provided
  'SERIOUS',             // Serious incident, medical attention required
  'CRITICAL',            // Critical incident, emergency response
  'LIFE_THREATENING',    // Life-threatening emergency
]);

export type IncidentSeverityEnum = z.infer<typeof IncidentSeverity>;

/**
 * Injury Location (Body Part)
 */
export const InjuryLocation = z.enum([
  'HEAD',
  'FACE',
  'EYE',
  'EAR',
  'NOSE',
  'MOUTH',
  'TEETH',
  'NECK',
  'SHOULDER',
  'ARM',
  'ELBOW',
  'WRIST',
  'HAND',
  'FINGER',
  'CHEST',
  'ABDOMEN',
  'BACK',
  'HIP',
  'LEG',
  'KNEE',
  'ANKLE',
  'FOOT',
  'TOE',
  'MULTIPLE',
  'OTHER',
]);

export type InjuryLocationEnum = z.infer<typeof InjuryLocation>;

/**
 * Injury Type Classification
 */
export const InjuryType = z.enum([
  'ABRASION',
  'BRUISE',
  'BURN',
  'CONCUSSION',
  'CUT',
  'DISLOCATION',
  'FRACTURE',
  'LACERATION',
  'PUNCTURE',
  'SPRAIN',
  'STRAIN',
  'SWELLING',
  'OTHER',
]);

export type InjuryTypeEnum = z.infer<typeof InjuryType>;

/**
 * Location Type (Where incident occurred)
 */
export const LocationType = z.enum([
  'CLASSROOM',
  'GYMNASIUM',
  'CAFETERIA',
  'PLAYGROUND',
  'HALLWAY',
  'BATHROOM',
  'NURSES_OFFICE',
  'LIBRARY',
  'AUDITORIUM',
  'BUS',
  'PARKING_LOT',
  'FIELD_TRIP',
  'SPORTS_FIELD',
  'POOL',
  'OTHER',
]);

export type LocationTypeEnum = z.infer<typeof LocationType>;

/**
 * Medical Response Type
 */
export const MedicalResponse = z.enum([
  'NONE',                       // No medical attention needed
  'FIRST_AID',                  // First aid provided at school
  'NURSE_EVALUATION',           // Evaluated by school nurse
  'PARENT_NOTIFIED',            // Parent notified and picked up
  'URGENT_CARE',                // Transported to urgent care
  'EMERGENCY_ROOM',             // Transported to ER
  'AMBULANCE_CALLED',           // Emergency services called
  'HOSPITALIZED',               // Student hospitalized
]);

export type MedicalResponseEnum = z.infer<typeof MedicalResponse>;

// ==========================================
// BASE INCIDENT SCHEMA
// ==========================================

/**
 * Base Incident Report Schema
 * Common fields for all incident types
 */
export const BaseIncidentSchema = z.object({
  // Identification
  id: z.string().uuid().optional(),
  incidentNumber: z.string().optional(), // Auto-generated: INC-2024-0001

  // Classification
  type: IncidentType,
  status: IncidentStatus.default('PENDING_REVIEW'),
  severity: IncidentSeverity,

  // Student Information
  studentId: z.string().uuid({
    required_error: 'Student is required',
    invalid_type_error: 'Invalid student ID',
  }),
  studentName: z.string().optional(), // Denormalized for quick access
  studentGrade: z.string().optional(),

  // Date/Time Information
  incidentDate: z.string().datetime({
    required_error: 'Incident date and time are required',
  }),
  reportedDate: z.string().datetime().optional(), // When reported (may differ from incident)

  // Location Information
  location: LocationType,
  locationDetails: z.string().min(1, 'Location details are required').max(500),

  // Incident Details
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),

  // Reporter Information
  reportedBy: z.string().uuid({
    required_error: 'Reporter is required',
  }),
  reportedByName: z.string().optional(),
  reportedByRole: z.string().optional(),

  // Medical Response
  medicalResponse: MedicalResponse.default('NONE'),
  medicalNotes: z.string().max(2000).optional(),

  // Parent/Guardian Notification
  parentNotified: z.boolean().default(false),
  parentNotifiedAt: z.string().datetime().optional(),
  parentNotifiedBy: z.string().optional(),
  parentNotificationMethod: z.enum(['PHONE', 'EMAIL', 'IN_PERSON', 'TEXT']).optional(),

  // Follow-up
  requiresFollowUp: z.boolean().default(false),
  followUpNotes: z.string().max(2000).optional(),

  // Audit Trail
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),

  // Legal & Compliance
  legalReviewRequired: z.boolean().default(false),
  legalReviewedAt: z.string().datetime().optional(),
  legalReviewedBy: z.string().optional(),

  // Attachments
  attachments: z.array(z.object({
    id: z.string().uuid(),
    filename: z.string(),
    url: z.string().url(),
    uploadedAt: z.string().datetime(),
    uploadedBy: z.string().uuid(),
  })).optional(),

  // Tags for categorization
  tags: z.array(z.string()).optional(),

  // Privacy flags
  isConfidential: z.boolean().default(false),
  restrictedAccess: z.boolean().default(false),
});

export type BaseIncident = z.infer<typeof BaseIncidentSchema>;

// ==========================================
// TYPE-SPECIFIC SCHEMAS
// ==========================================

/**
 * Injury Incident Schema
 * Extended fields specific to injury incidents
 */
export const InjuryIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('INJURY'),

  // Injury-specific fields
  injuryType: InjuryType,
  injuryLocation: InjuryLocation,
  injuryDescription: z.string().min(10).max(1000),

  // Activity context
  activityDuringIncident: z.string().max(500),
  supervised: z.boolean(),
  supervisorName: z.string().optional(),

  // Treatment
  treatmentProvided: z.string().max(1000),
  treatedBy: z.string().optional(),

  // Safety equipment
  safetyEquipmentUsed: z.boolean().default(false),
  safetyEquipmentDetails: z.string().max(500).optional(),
});

export type InjuryIncident = z.infer<typeof InjuryIncidentSchema>;

/**
 * Illness Incident Schema
 */
export const IllnessIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('ILLNESS'),

  // Illness details
  symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  onsetTime: z.string().datetime(),
  temperature: z.number().optional(),
  vitalsChecked: z.boolean().default(false),
  vitals: z.object({
    temperature: z.number().optional(),
    heartRate: z.number().optional(),
    respiratoryRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    oxygenSaturation: z.number().optional(),
  }).optional(),

  // Contagion tracking
  possiblyContagious: z.boolean().default(false),
  isolationRequired: z.boolean().default(false),
  returnToSchoolCriteria: z.string().max(500).optional(),
});

export type IllnessIncident = z.infer<typeof IllnessIncidentSchema>;

/**
 * Behavioral Incident Schema
 */
export const BehavioralIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('BEHAVIORAL'),

  // Behavioral details
  behaviorType: z.enum([
    'AGGRESSION',
    'DEFIANCE',
    'DISRUPTION',
    'VERBAL_ABUSE',
    'PHYSICAL_ALTERCATION',
    'PROPERTY_DESTRUCTION',
    'SELF_HARM',
    'ELOPEMENT',
    'OTHER',
  ]),

  // Incident specifics
  triggers: z.array(z.string()).optional(),
  interventionsUsed: z.array(z.string()),
  studentResponse: z.string().max(1000),

  // Additional parties
  otherStudentsInvolved: z.array(z.string().uuid()).optional(),
  staffInvolved: z.array(z.string().uuid()).optional(),

  // Disciplinary action
  disciplinaryActionTaken: z.boolean().default(false),
  disciplinaryDetails: z.string().max(1000).optional(),

  // IEP/504 relevance
  iepRelevant: z.boolean().default(false),
  iepNotes: z.string().max(500).optional(),
});

export type BehavioralIncident = z.infer<typeof BehavioralIncidentSchema>;

/**
 * Safety Incident Schema
 */
export const SafetyIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('SAFETY'),

  // Safety hazard details
  hazardType: z.enum([
    'EQUIPMENT_FAILURE',
    'FACILITY_HAZARD',
    'ENVIRONMENTAL',
    'SECURITY_BREACH',
    'FIRE_HAZARD',
    'CHEMICAL_EXPOSURE',
    'OTHER',
  ]),

  // Immediate action
  immediateMitigation: z.string().max(1000),
  areaSecured: z.boolean(),
  equipmentTagged: z.boolean().default(false),

  // Long-term resolution
  permanentFixRequired: z.boolean(),
  maintenanceTicketNumber: z.string().optional(),
  estimatedResolutionDate: z.string().datetime().optional(),
});

export type SafetyIncident = z.infer<typeof SafetyIncidentSchema>;

/**
 * Emergency Incident Schema
 */
export const EmergencyIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('EMERGENCY'),
  severity: z.enum(['CRITICAL', 'LIFE_THREATENING']), // Emergency is always serious

  // Emergency details
  emergencyType: z.enum([
    'CARDIAC_ARREST',
    'SEVERE_ALLERGIC_REACTION',
    'SEIZURE',
    'SEVERE_INJURY',
    'RESPIRATORY_DISTRESS',
    'UNCONSCIOUS',
    'SEVERE_BLEEDING',
    'OTHER',
  ]),

  // Emergency response
  emergencyServicesContacted: z.boolean(),
  emergencyContactTime: z.string().datetime().optional(),
  emergencyArrivalTime: z.string().datetime().optional(),
  hospitalDestination: z.string().optional(),

  // Life-saving measures
  cprPerformed: z.boolean().default(false),
  aedUsed: z.boolean().default(false),
  epipenAdministered: z.boolean().default(false),
  otherInterventions: z.array(z.string()).optional(),

  // Personnel
  firstResponders: z.array(z.string()),
  emergencyCoordinator: z.string(),
});

export type EmergencyIncident = z.infer<typeof EmergencyIncidentSchema>;

// ==========================================
// UNION TYPE FOR ALL INCIDENTS
// ==========================================

/**
 * Discriminated Union of All Incident Types
 */
export const IncidentSchema = z.discriminatedUnion('type', [
  InjuryIncidentSchema,
  IllnessIncidentSchema,
  BehavioralIncidentSchema,
  SafetyIncidentSchema,
  EmergencyIncidentSchema,
  BaseIncidentSchema, // Fallback for other types
]);

export type Incident = z.infer<typeof IncidentSchema>;

// ==========================================
// CREATE/UPDATE SCHEMAS
// ==========================================

/**
 * Create Incident Schema (without auto-generated fields)
 */
export const CreateIncidentSchema = BaseIncidentSchema.omit({
  id: true,
  incidentNumber: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;

/**
 * Update Incident Schema (partial update)
 */
export const UpdateIncidentSchema = BaseIncidentSchema.partial().extend({
  id: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export type UpdateIncidentInput = z.infer<typeof UpdateIncidentSchema>;

// ==========================================
// QUERY/FILTER SCHEMAS
// ==========================================

/**
 * Incident Filter Schema
 */
export const IncidentFilterSchema = z.object({
  type: IncidentType.optional(),
  status: IncidentStatus.optional(),
  severity: IncidentSeverity.optional(),
  studentId: z.string().uuid().optional(),
  reportedBy: z.string().uuid().optional(),
  location: LocationType.optional(),

  // Date range
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  // Search
  search: z.string().optional(),

  // Pagination
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),

  // Sorting
  sortBy: z.enum(['incidentDate', 'severity', 'status', 'type', 'createdAt']).default('incidentDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type IncidentFilter = z.infer<typeof IncidentFilterSchema>;

// ==========================================
// STATUS TRANSITION VALIDATION
// ==========================================

/**
 * Valid status transitions for workflow enforcement
 */
export const VALID_STATUS_TRANSITIONS: Record<IncidentStatusEnum, IncidentStatusEnum[]> = {
  PENDING_REVIEW: ['UNDER_INVESTIGATION', 'RESOLVED', 'ARCHIVED'],
  UNDER_INVESTIGATION: ['REQUIRES_ACTION', 'RESOLVED', 'PENDING_REVIEW'],
  REQUIRES_ACTION: ['UNDER_INVESTIGATION', 'RESOLVED'],
  RESOLVED: ['ARCHIVED', 'UNDER_INVESTIGATION'], // Can reopen
  ARCHIVED: [], // Terminal state
};

/**
 * Validate status transition
 */
export function isValidStatusTransition(
  currentStatus: IncidentStatusEnum,
  newStatus: IncidentStatusEnum
): boolean {
  return VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}
