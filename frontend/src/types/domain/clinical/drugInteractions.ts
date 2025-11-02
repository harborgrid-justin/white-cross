/**
 * Drug Interaction Checker Types
 *
 * Types for drug-drug interaction checking, dose calculation, and medication safety.
 * Critical for patient safety and medication error prevention.
 *
 * @module types/clinical/drugInteractions
 * @category Clinical
 */

import { z } from 'zod';
import type { BaseEntity, ApiResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Severity of drug interaction
 */
export enum InteractionSeverity {
  /** No known interaction */
  NONE = 'NONE',
  /** Minor interaction - monitor */
  MINOR = 'MINOR',
  /** Moderate interaction - use caution */
  MODERATE = 'MODERATE',
  /** Major interaction - avoid combination */
  MAJOR = 'MAJOR',
  /** Contraindicated - do not use together */
  CONTRAINDICATED = 'CONTRAINDICATED',
}

/**
 * Type of drug interaction
 */
export enum InteractionType {
  /** Drug-drug interaction */
  DRUG_DRUG = 'DRUG_DRUG',
  /** Drug-food interaction */
  DRUG_FOOD = 'DRUG_FOOD',
  /** Drug-allergy interaction */
  DRUG_ALLERGY = 'DRUG_ALLERGY',
  /** Drug-condition interaction */
  DRUG_CONDITION = 'DRUG_CONDITION',
  /** Drug-lab interaction */
  DRUG_LAB = 'DRUG_LAB',
  /** Duplicate therapy */
  DUPLICATE_THERAPY = 'DUPLICATE_THERAPY',
}

/**
 * Mechanism of interaction
 */
export enum InteractionMechanism {
  /** Pharmacokinetic interaction (absorption, distribution, metabolism, excretion) */
  PHARMACOKINETIC = 'PHARMACOKINETIC',
  /** Pharmacodynamic interaction (additive, synergistic, antagonistic effects) */
  PHARMACODYNAMIC = 'PHARMACODYNAMIC',
  /** Both pharmacokinetic and pharmacodynamic */
  MIXED = 'MIXED',
  /** Unknown mechanism */
  UNKNOWN = 'UNKNOWN',
}

/**
 * Drug class categorization
 */
export enum DrugClass {
  ANALGESIC = 'ANALGESIC',
  ANTIBIOTIC = 'ANTIBIOTIC',
  ANTIHISTAMINE = 'ANTIHISTAMINE',
  ANTIHYPERTENSIVE = 'ANTIHYPERTENSIVE',
  BRONCHODILATOR = 'BRONCHODILATOR',
  CORTICOSTEROID = 'CORTICOSTEROID',
  DECONGESTANT = 'DECONGESTANT',
  NSAID = 'NSAID',
  STIMULANT = 'STIMULANT',
  ANTICONVULSANT = 'ANTICONVULSANT',
  ANTIDEPRESSANT = 'ANTIDEPRESSANT',
  ANTIPSYCHOTIC = 'ANTIPSYCHOTIC',
  DIABETES_MEDICATION = 'DIABETES_MEDICATION',
  IMMUNOSUPPRESSANT = 'IMMUNOSUPPRESSANT',
  OTHER = 'OTHER',
}

/**
 * Evidence level for interaction
 */
export enum EvidenceLevel {
  /** Well-established in literature */
  ESTABLISHED = 'ESTABLISHED',
  /** Probable based on studies */
  PROBABLE = 'PROBABLE',
  /** Theoretical based on mechanism */
  THEORETICAL = 'THEORETICAL',
  /** Unknown or insufficient evidence */
  UNKNOWN = 'UNKNOWN',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Drug reference entry
 *
 * Comprehensive drug information for interaction checking.
 *
 * @property {string} drugId - Unique drug identifier
 * @property {string} brandName - Brand/trade name
 * @property {string} genericName - Generic/chemical name
 * @property {DrugClass[]} drugClasses - Drug classifications
 * @property {string} [ndcCode] - National Drug Code
 * @property {string} [rxcui] - RxNorm Concept Unique Identifier
 * @property {string} activeIngredients - Active ingredient(s)
 * @property {string[]} indications - Medical indications
 * @property {string[]} contraindications - Contraindications
 * @property {string[]} warnings - Black box warnings and cautions
 * @property {string[]} sideEffects - Common side effects
 * @property {string} [dosageInfo] - Standard dosage information
 * @property {Record<string, any>} [pharmacology] - Pharmacological properties
 */
export interface DrugReference extends BaseEntity {
  drugId: string;
  brandName: string;
  genericName: string;
  drugClasses: DrugClass[];
  ndcCode?: string | null;
  rxcui?: string | null;
  activeIngredients: string;
  indications: string[];
  contraindications: string[];
  warnings: string[];
  sideEffects: string[];
  dosageInfo?: string | null;
  pharmacology?: Record<string, any> | null;
}

/**
 * Drug interaction record
 *
 * Details of potential interaction between two drugs.
 *
 * @property {string} drug1Id - First drug ID (RxCUI or internal ID)
 * @property {string} drug1Name - First drug name
 * @property {string} drug2Id - Second drug ID
 * @property {string} drug2Name - Second drug name
 * @property {InteractionSeverity} severity - Interaction severity
 * @property {InteractionType} interactionType - Type of interaction
 * @property {InteractionMechanism} mechanism - Mechanism of interaction
 * @property {EvidenceLevel} evidenceLevel - Evidence strength
 * @property {string} description - Detailed description of interaction
 * @property {string} clinicalEffects - Clinical effects of interaction
 * @property {string} [management] - Recommended management strategy
 * @property {string[]} references - Literature references
 * @property {string} [monographId] - Reference to full monograph
 */
export interface DrugInteraction extends BaseEntity {
  drug1Id: string;
  drug1Name: string;
  drug2Id: string;
  drug2Name: string;
  severity: InteractionSeverity;
  interactionType: InteractionType;
  mechanism: InteractionMechanism;
  evidenceLevel: EvidenceLevel;
  description: string;
  clinicalEffects: string;
  management?: string | null;
  references: string[];
  monographId?: string | null;
}

/**
 * Interaction check request/result
 *
 * Result of checking medications for interactions.
 *
 * @property {string} studentId - Student being checked
 * @property {string[]} medicationIds - Medications being checked
 * @property {DrugInteraction[]} interactions - Detected interactions
 * @property {InteractionSeverity} maxSeverity - Highest severity found
 * @property {boolean} hasContraindications - Whether contraindications exist
 * @property {number} interactionCount - Total interactions found
 * @property {string} checkedAt - ISO timestamp of check
 * @property {string} checkedBy - User who performed check
 */
export interface InteractionCheckResult {
  studentId: string;
  medicationIds: string[];
  interactions: DrugInteraction[];
  maxSeverity: InteractionSeverity;
  hasContraindications: boolean;
  interactionCount: number;
  checkedAt: string;
  checkedBy: string;
}

/**
 * Dose calculation parameters
 *
 * Parameters for calculating appropriate medication dose.
 *
 * @property {string} medicationId - Medication being dosed
 * @property {number} weightKg - Patient weight in kg
 * @property {number} [heightCm] - Patient height in cm (for BSA)
 * @property {number} [age] - Patient age in years
 * @property {string} [indication] - Medical indication
 * @property {string} [renalFunction] - Renal function (CrCl or GFR)
 * @property {string} [hepaticFunction] - Hepatic function status
 */
export interface DoseCalculationParams {
  medicationId: string;
  weightKg: number;
  heightCm?: number;
  age?: number;
  indication?: string;
  renalFunction?: string;
  hepaticFunction?: string;
}

/**
 * Dose calculation result
 *
 * Calculated dose recommendation with rationale.
 *
 * @property {number} recommendedDose - Recommended dose amount
 * @property {string} doseUnit - Unit of dose (mg, mL, etc.)
 * @property {string} frequency - Dosing frequency
 * @property {number} [minDose] - Minimum safe dose
 * @property {number} [maxDose] - Maximum safe dose
 * @property {string} route - Route of administration
 * @property {string} rationale - Rationale for dose recommendation
 * @property {string[]} warnings - Dosing warnings or cautions
 * @property {boolean} requiresAdjustment - Whether dose requires adjustment
 * @property {string} [adjustmentReason] - Reason for dose adjustment
 */
export interface DoseCalculationResult {
  recommendedDose: number;
  doseUnit: string;
  frequency: string;
  minDose?: number;
  maxDose?: number;
  route: string;
  rationale: string;
  warnings: string[];
  requiresAdjustment: boolean;
  adjustmentReason?: string;
}

/**
 * Side effect profile
 *
 * Side effect information for a medication.
 */
export interface SideEffectProfile {
  medicationId: string;
  medicationName: string;
  commonSideEffects: Array<{
    effect: string;
    frequency: 'VERY_COMMON' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'VERY_RARE';
    severity: 'MILD' | 'MODERATE' | 'SEVERE';
  }>;
  seriousSideEffects: Array<{
    effect: string;
    symptoms: string[];
    action: string;
  }>;
  blackBoxWarnings: string[];
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to check drug interactions
 */
export interface CheckInteractionsRequest {
  studentId: string;
  medicationIds: string[];
  includeAllergies?: boolean;
  includeConditions?: boolean;
}

/**
 * Request to calculate dose
 */
export interface CalculateDoseRequest extends DoseCalculationParams {
  studentId: string;
}

/**
 * Request to search drug database
 */
export interface DrugSearchRequest {
  query: string;
  searchFields?: ('brandName' | 'genericName' | 'activeIngredients')[];
  drugClass?: DrugClass;
  limit?: number;
}

/**
 * Response types
 */
export type InteractionCheckResponse = ApiResponse<InteractionCheckResult>;
export type DoseCalculationResponse = ApiResponse<DoseCalculationResult>;
export type DrugReferenceResponse = ApiResponse<DrugReference>;
export type DrugSearchResponse = ApiResponse<DrugReference[]>;
export type SideEffectResponse = ApiResponse<SideEffectProfile>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

/**
 * Zod schema for interaction check
 */
export const CheckInteractionsSchema = z.object({
  studentId: z.string().uuid(),
  medicationIds: z.array(z.string()).min(1, 'At least one medication required'),
  includeAllergies: z.boolean().optional(),
  includeConditions: z.boolean().optional(),
});

/**
 * Zod schema for dose calculation
 */
export const CalculateDoseSchema = z.object({
  studentId: z.string().uuid(),
  medicationId: z.string().min(1),
  weightKg: z.number().positive().max(300),
  heightCm: z.number().positive().max(250).optional(),
  age: z.number().int().min(0).max(21).optional(),
  indication: z.string().optional(),
  renalFunction: z.string().optional(),
  hepaticFunction: z.string().optional(),
});

/**
 * Zod schema for drug search
 */
export const DrugSearchSchema = z.object({
  query: z.string().min(2),
  searchFields: z.array(z.enum(['brandName', 'genericName', 'activeIngredients'])).optional(),
  drugClass: z.nativeEnum(DrugClass).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

/**
 * Drug Interactions Redux slice state
 */
export interface DrugInteractionsState {
  drugReferences: DrugReference[];
  recentChecks: InteractionCheckResult[];
  selectedDrug: DrugReference | null;
  searchResults: DrugReference[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for Interaction Checker component
 */
export interface InteractionCheckerProps {
  studentId: string;
  currentMedications: string[];
  onInteractionsDetected?: (result: InteractionCheckResult) => void;
  autoCheck?: boolean;
}

/**
 * Props for Interaction Alert component
 */
export interface InteractionAlertProps {
  interaction: DrugInteraction;
  onViewDetails?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

/**
 * Props for Dose Calculator component
 */
export interface DoseCalculatorProps {
  medicationId: string;
  studentId: string;
  onCalculated?: (result: DoseCalculationResult) => void;
}

/**
 * Props for Drug Search component
 */
export interface DrugSearchProps {
  onSelectDrug: (drug: DrugReference) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Props for Side Effects component
 */
export interface SideEffectsDisplayProps {
  profile: SideEffectProfile;
  showAll?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Interaction grouped by severity
 */
export type InteractionsBySeverity = Record<InteractionSeverity, DrugInteraction[]>;

/**
 * Contraindicated drug pair
 */
export type ContraindicatedPair = DrugInteraction & {
  severity: InteractionSeverity.CONTRAINDICATED;
};

/**
 * Drug with interaction count
 */
export type DrugWithInteractions = DrugReference & {
  interactionCount: number;
  maxInteractionSeverity: InteractionSeverity;
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if interaction is contraindicated
 */
export function isContraindicated(interaction: DrugInteraction): interaction is ContraindicatedPair {
  return interaction.severity === InteractionSeverity.CONTRAINDICATED;
}

/**
 * Check if interaction is severe (major or contraindicated)
 */
export function isSevereInteraction(interaction: DrugInteraction): boolean {
  return [InteractionSeverity.MAJOR, InteractionSeverity.CONTRAINDICATED].includes(
    interaction.severity
  );
}

/**
 * Check if dose is within safe range
 */
export function isDoseSafe(
  dose: number,
  result: DoseCalculationResult
): boolean {
  if (result.minDose !== undefined && dose < result.minDose) return false;
  if (result.maxDose !== undefined && dose > result.maxDose) return false;
  return true;
}

/**
 * Group interactions by severity
 */
export function groupInteractionsBySeverity(
  interactions: DrugInteraction[]
): InteractionsBySeverity {
  return interactions.reduce(
    (acc, interaction) => {
      if (!acc[interaction.severity]) {
        acc[interaction.severity] = [];
      }
      acc[interaction.severity].push(interaction);
      return acc;
    },
    {} as InteractionsBySeverity
  );
}
