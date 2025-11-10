/**
 * Core medication type definitions
 *
 * Note: Runtime values are in separate files:
 * - core.schemas.ts - Zod validation schemas
 */

/**
 * Core medication type categories
 */
export type MedicationType =
  | 'prescription'
  | 'over_the_counter'
  | 'supplement'
  | 'emergency'
  | 'inhaler'
  | 'epipen'
  | 'insulin'
  | 'controlled_substance';

/**
 * Medication lifecycle status
 */
export type MedicationStatus =
  | 'active'
  | 'discontinued'
  | 'expired'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

/**
 * Routes of medication administration
 */
export type AdministrationRoute =
  | 'oral'
  | 'injection'
  | 'topical'
  | 'inhaled'
  | 'nasal'
  | 'rectal'
  | 'sublingual'
  | 'transdermal';

/**
 * Medication administration frequency patterns
 */
export type MedicationFrequency =
  | 'as_needed'
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'every_4_hours'
  | 'every_6_hours'
  | 'every_8_hours'
  | 'every_12_hours'
  | 'weekly'
  | 'monthly'
  | 'custom';

/**
 * Alert severity levels
 */
export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Drug interaction severity classification
 */
export type InteractionType = 'major' | 'moderate' | 'minor';

/**
 * Medication interaction information
 *
 * @description Represents potential drug-drug interactions
 */
export interface MedicationInteraction {
  /** Unique interaction identifier */
  id: string;
  /** ID of the interacting medication (optional for non-medication interactions) */
  interactingMedicationId?: string;
  /** Name of the interacting substance */
  interactingMedicationName: string;
  /** Severity classification of the interaction */
  interactionType: InteractionType;
  /** Detailed description of the interaction */
  description: string;
  /** Clinical recommendations for managing the interaction */
  recommendations: string;
}

/**
 * Core medication entity
 *
 * @description Complete medication record including dosage, schedule, and safety information
 */
export interface Medication {
  /** Unique medication identifier */
  id: string;
  /** Medication name (generic or brand) */
  name: string;
  /** Generic (non-proprietary) medication name */
  genericName?: string;
  /** Brand (proprietary) medication name */
  brandName?: string;
  /** National Drug Code - unique FDA identifier */
  ndc?: string;
  /** Medication classification category */
  type: MedicationType;
  /** Current lifecycle status */
  status: MedicationStatus;

  // Dosage Information
  /** Medication strength (e.g., "500mg", "5mg/ml") */
  strength: string;
  /** Physical form (e.g., tablet, capsule, liquid) */
  dosageForm: string;
  /** Method of administration */
  administrationRoute: AdministrationRoute;

  // Prescription Details
  /** ID of the prescribing physician */
  prescriberId?: string;
  /** Name of the prescribing physician */
  prescriberName?: string;
  /** Prescription identification number */
  prescriptionNumber?: string;
  /** Date the medication was prescribed */
  prescribedDate?: Date;

  // Administration Schedule
  /** How often the medication should be administered */
  frequency: MedicationFrequency;
  /** Detailed administration instructions */
  dosageInstructions: string;
  /** Maximum allowable dose in 24 hours */
  maxDailyDose?: number;

  // Dates
  /** Date medication administration should begin */
  startDate: Date;
  /** Date medication administration should end (if applicable) */
  endDate?: Date;
  /** Timestamp of last administration */
  lastAdministered?: Date;
  /** Calculated next administration time */
  nextDue?: Date;

  // Storage and Handling
  /** Special storage conditions (e.g., refrigeration) */
  storageRequirements?: string;
  /** Additional handling or administration instructions */
  specialInstructions?: string;

  // Safety Information
  /** Important warnings and precautions */
  warnings?: string[];
  /** Conditions or situations where medication should not be used */
  contraindications?: string[];
  /** Known adverse effects */
  sideEffects?: string[];
  /** Potential drug-drug or drug-food interactions */
  interactions?: MedicationInteraction[];

  // Tracking
  /** ID of the student for whom medication is prescribed */
  studentId: string;
  /** ID of staff member who created the record */
  createdBy: string;
  /** ID of staff member who last updated the record */
  updatedBy?: string;
  /** Record creation timestamp */
  createdAt: Date;
  /** Record last update timestamp */
  updatedAt: Date;

  // Compliance
  /** Whether medication is a controlled substance */
  isControlled: boolean;
  /** Whether parental consent is required */
  requiresParentConsent: boolean;
  /** Whether physician order is required */
  requiresPhysicianOrder: boolean;

  // Notes
  /** General notes (visible to appropriate staff) */
  notes?: string;
  /** Internal notes (restricted visibility) */
  internalNotes?: string;
}

/**
 * Medication alert notification
 *
 * @description Represents system-generated alerts for medication safety and compliance
 */
export interface MedicationAlert {
  /** Unique alert identifier */
  id: string;
  /** Associated medication ID (if applicable) */
  medicationId?: string;
  /** Associated student ID (if applicable) */
  studentId?: string;
  /** Alert category */
  type: 'expiration' | 'interaction' | 'allergy' | 'refill' | 'missed_dose' | 'adverse_reaction';
  /** Alert severity */
  level: AlertLevel;
  /** Short alert title */
  title: string;
  /** Detailed alert description */
  description: string;

  // Alert Timing
  /** When the alert was triggered */
  triggeredAt: Date;
  /** When the alert was acknowledged (if applicable) */
  acknowledgedAt?: Date;
  /** Staff member who acknowledged the alert */
  acknowledgedBy?: string;
  /** When the alert was resolved (if applicable) */
  resolvedAt?: Date;
  /** Staff member who resolved the alert */
  resolvedBy?: string;

  // Actions
  /** Recommended steps to address the alert */
  recommendedActions?: string[];
  /** Whether the alert is currently active */
  isActive: boolean;
}

/**
 * Medication inventory tracking
 *
 * @description Tracks physical inventory, expiration, and reordering
 */
export interface MedicationInventory {
  /** Unique inventory record identifier */
  id: string;
  /** Associated medication ID */
  medicationId: string;

  // Inventory Details
  /** Manufacturer lot number */
  lotNumber?: string;
  /** Expiration date of this inventory lot */
  expirationDate: Date;
  /** Current quantity in stock */
  quantityInStock: number;
  /** Threshold for reorder alerts */
  minimumQuantity: number;
  /** Unit of measure (e.g., tablets, ml, doses) */
  unitType: string;

  // Cost and Ordering
  /** Cost per unit (for budgeting) */
  costPerUnit?: number;
  /** Supplier or pharmacy name */
  supplier?: string;
  /** Date of last order */
  lastOrderDate?: Date;
  /** Scheduled next order date */
  nextOrderDate?: Date;

  // Storage
  /** Physical storage location */
  storageLocation: string;
  /** Required storage conditions */
  storageConditions: string;

  // Tracking
  /** Record creation timestamp */
  createdAt: Date;
  /** Record last update timestamp */
  updatedAt: Date;
}

