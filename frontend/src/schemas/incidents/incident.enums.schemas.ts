/**
 * @fileoverview Incident Schema Enums and Constants
 * @module schemas/incidents/incident.enums
 *
 * All enum definitions and type constants for incident reporting.
 * Provides type-safe enumerations for incident classification, severity, locations, and responses.
 */

import { z } from 'zod';

// ==========================================
// INCIDENT CLASSIFICATION ENUMS
// ==========================================

/**
 * Incident Type Classification
 * Defines the primary category of the incident for routing and handling
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
 * Ensures proper tracking and accountability throughout incident lifecycle
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
 * Determines urgency, response requirements, and reporting obligations
 */
export const IncidentSeverity = z.enum([
  'MINOR',               // Minor incident, no medical attention
  'MODERATE',            // Moderate incident, first aid provided
  'SERIOUS',             // Serious incident, medical attention required
  'CRITICAL',            // Critical incident, emergency response
  'LIFE_THREATENING',    // Life-threatening emergency
]);

export type IncidentSeverityEnum = z.infer<typeof IncidentSeverity>;

// ==========================================
// INJURY-SPECIFIC ENUMS
// ==========================================

/**
 * Injury Location (Body Part)
 * Anatomical locations for injury documentation and medical tracking
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
 * Medical classification of injury type for treatment and documentation
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

// ==========================================
// LOCATION ENUMS
// ==========================================

/**
 * Location Type (Where incident occurred)
 * Physical locations within school facilities for incident mapping and safety analysis
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

// ==========================================
// MEDICAL RESPONSE ENUMS
// ==========================================

/**
 * Medical Response Type
 * Level of medical intervention provided, critical for compliance and liability tracking
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
// PARENT NOTIFICATION ENUMS
// ==========================================

/**
 * Parent Notification Method
 * Communication channel used for parent/guardian notification
 */
export const ParentNotificationMethod = z.enum([
  'PHONE',
  'EMAIL',
  'IN_PERSON',
  'TEXT',
]);

export type ParentNotificationMethodEnum = z.infer<typeof ParentNotificationMethod>;

// ==========================================
// BEHAVIORAL INCIDENT ENUMS
// ==========================================

/**
 * Behavioral Incident Type
 * Classification of behavioral incidents for intervention tracking
 */
export const BehaviorType = z.enum([
  'AGGRESSION',
  'DEFIANCE',
  'DISRUPTION',
  'VERBAL_ABUSE',
  'PHYSICAL_ALTERCATION',
  'PROPERTY_DESTRUCTION',
  'SELF_HARM',
  'ELOPEMENT',
  'OTHER',
]);

export type BehaviorTypeEnum = z.infer<typeof BehaviorType>;

// ==========================================
// SAFETY INCIDENT ENUMS
// ==========================================

/**
 * Safety Hazard Type
 * Classification of safety hazards for maintenance and risk management
 */
export const HazardType = z.enum([
  'EQUIPMENT_FAILURE',
  'FACILITY_HAZARD',
  'ENVIRONMENTAL',
  'SECURITY_BREACH',
  'FIRE_HAZARD',
  'CHEMICAL_EXPOSURE',
  'OTHER',
]);

export type HazardTypeEnum = z.infer<typeof HazardType>;

// ==========================================
// EMERGENCY INCIDENT ENUMS
// ==========================================

/**
 * Emergency Type Classification
 * Critical emergency categories requiring immediate response
 */
export const EmergencyType = z.enum([
  'CARDIAC_ARREST',
  'SEVERE_ALLERGIC_REACTION',
  'SEIZURE',
  'SEVERE_INJURY',
  'RESPIRATORY_DISTRESS',
  'UNCONSCIOUS',
  'SEVERE_BLEEDING',
  'OTHER',
]);

export type EmergencyTypeEnum = z.infer<typeof EmergencyType>;

/**
 * Emergency Severity (restricted subset)
 * Emergency incidents are always critical or life-threatening
 */
export const EmergencySeverity = z.enum([
  'CRITICAL',
  'LIFE_THREATENING',
]);

export type EmergencySeverityEnum = z.infer<typeof EmergencySeverity>;
