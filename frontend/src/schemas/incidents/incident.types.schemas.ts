/**
 * @fileoverview Type-Specific Incident Schemas
 * @module schemas/incidents/incident.types
 *
 * Extended schemas for specific incident types (Injury, Illness, Behavioral, Safety, Emergency).
 * Each schema extends BaseIncidentSchema with type-specific required fields and validation.
 */

import { z } from 'zod';
import { BaseIncidentSchema } from './incident.base.schemas';
import {
  InjuryType,
  InjuryLocation,
  BehaviorType,
  HazardType,
  EmergencyType,
  EmergencySeverity,
} from './incident.enums.schemas';

// ==========================================
// INJURY INCIDENT SCHEMA
// ==========================================

/**
 * Injury Incident Schema
 * Extended fields specific to physical injury incidents
 *
 * @remarks
 * Includes:
 * - Detailed injury classification (type and body location)
 * - Activity context and supervision status
 * - Treatment details and provider information
 * - Safety equipment usage tracking
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

// ==========================================
// ILLNESS INCIDENT SCHEMA
// ==========================================

/**
 * Vitals Schema
 * Medical vital signs recorded during illness assessment
 */
export const VitalsSchema = z.object({
  temperature: z.number().optional(),
  heartRate: z.number().optional(),
  respiratoryRate: z.number().optional(),
  bloodPressure: z.string().optional(),
  oxygenSaturation: z.number().optional(),
});

export type Vitals = z.infer<typeof VitalsSchema>;

/**
 * Illness Incident Schema
 * Extended fields for illness and medical symptom incidents
 *
 * @remarks
 * Includes:
 * - Symptom tracking with onset time
 * - Vital signs monitoring
 * - Contagion risk assessment
 * - Return-to-school criteria
 */
export const IllnessIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('ILLNESS'),

  // Illness details
  symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  onsetTime: z.string().datetime(),
  temperature: z.number().optional(),
  vitalsChecked: z.boolean().default(false),
  vitals: VitalsSchema.optional(),

  // Contagion tracking
  possiblyContagious: z.boolean().default(false),
  isolationRequired: z.boolean().default(false),
  returnToSchoolCriteria: z.string().max(500).optional(),
});

export type IllnessIncident = z.infer<typeof IllnessIncidentSchema>;

// ==========================================
// BEHAVIORAL INCIDENT SCHEMA
// ==========================================

/**
 * Behavioral Incident Schema
 * Extended fields for behavioral and disciplinary incidents
 *
 * @remarks
 * Includes:
 * - Behavior classification and triggers
 * - Intervention strategies used
 * - Additional parties involved (students/staff)
 * - Disciplinary actions taken
 * - IEP/504 plan relevance tracking
 */
export const BehavioralIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('BEHAVIORAL'),

  // Behavioral details
  behaviorType: BehaviorType,

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

// ==========================================
// SAFETY INCIDENT SCHEMA
// ==========================================

/**
 * Safety Incident Schema
 * Extended fields for safety hazards and facility issues
 *
 * @remarks
 * Includes:
 * - Hazard type classification
 * - Immediate mitigation actions
 * - Area security and equipment tagging
 * - Long-term resolution tracking
 * - Maintenance ticket integration
 */
export const SafetyIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('SAFETY'),

  // Safety hazard details
  hazardType: HazardType,

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

// ==========================================
// EMERGENCY INCIDENT SCHEMA
// ==========================================

/**
 * Emergency Incident Schema
 * Extended fields for critical emergency situations
 *
 * @remarks
 * Includes:
 * - Emergency type classification
 * - Emergency services response tracking
 * - Life-saving measures documentation
 * - First responder and coordinator identification
 *
 * Note: Emergency incidents are always CRITICAL or LIFE_THREATENING severity
 */
export const EmergencyIncidentSchema = BaseIncidentSchema.extend({
  type: z.literal('EMERGENCY'),
  severity: EmergencySeverity, // Emergency is always serious

  // Emergency details
  emergencyType: EmergencyType,

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
