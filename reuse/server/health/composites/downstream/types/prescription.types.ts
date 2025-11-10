/**
 * Prescription and E-Prescribing Types
 *
 * Type definitions for electronic prescribing (EPCS), prescription management,
 * pharmacy integration (SureScripts), and controlled substance prescribing.
 *
 * Supports:
 * - EPCS (Electronic Prescribing for Controlled Substances)
 * - SureScripts integration
 * - PDMP (Prescription Drug Monitoring Program) queries
 * - Formulary checking
 * - Prior authorization
 *
 * @module prescription.types
 * @since 1.0.0
 */

import { MedicationRoute, MedicationFrequency, MedicationForm } from './medication.types';
import { EntityStatus, Address, PhoneNumber } from './common.types';

/**
 * E-Prescription request
 *
 * @example
 * ```typescript
 * const prescription: EPrescriptionRequest = {
 *   patientId: 'PAT-123',
 *   medicationName: 'Lisinopril 10mg tablets',
 *   quantity: 30,
 *   daysSupply: 30,
 *   refills: 3,
 *   prescriberId: 'PROV-456',
 *   pharmacyNCPDP: 'NCPDP-789',
 *   directions: 'Take 1 tablet by mouth once daily'
 * };
 * ```
 */
export interface EPrescriptionRequest {
  /** Patient ID */
  patientId: string;

  /** Medication name with strength and form */
  medicationName: string;

  /** NDC (National Drug Code) */
  ndc?: string;

  /** RxNorm code */
  rxNormCode?: string;

  /** Quantity to dispense */
  quantity: number;

  /** Unit of measure (tablets, ml, etc.) */
  quantityUnit?: string;

  /** Days supply */
  daysSupply: number;

  /** Number of refills */
  refills: number;

  /** Prescriber ID */
  prescriberId: string;

  /** Prescriber NPI */
  prescriberNPI: string;

  /** Prescriber DEA number (for controlled substances) */
  prescriberDEA?: string;

  /** Pharmacy NCPDP ID */
  pharmacyNCPDP: string;

  /** Directions for use (SIG) */
  directions: string;

  /** Indication/diagnosis */
  indication?: string;

  /** Notes to pharmacist */
  pharmacistNotes?: string;

  /** Whether DAW (Dispense As Written - no substitutions) */
  dispenseAsWritten?: boolean;

  /** Substitutions allowed */
  substitutionsAllowed?: boolean;

  /** Whether this is an electronic controlled substance prescription */
  isControlledSubstance?: boolean;

  /** DEA schedule (II, III, IV, V) */
  deaSchedule?: string;

  /** Priority */
  priority?: 'routine' | 'urgent';

  /** Earliest fill date */
  earliestFillDate?: Date;
}

/**
 * E-Prescription response from pharmacy system
 *
 * @example
 * ```typescript
 * const response: EPrescriptionResponse = {
 *   prescriptionId: 'RX-123',
 *   status: 'sent',
 *   pharmacyName: 'CVS Pharmacy',
 *   pharmacyPhone: '+1-617-555-0199',
 *   confirmationNumber: 'CONF-456',
 *   sentDate: new Date()
 * };
 * ```
 */
export interface EPrescriptionResponse {
  /** Prescription ID */
  prescriptionId: string;

  /** Transmission status */
  status: 'sent' | 'accepted' | 'rejected' | 'pending' | 'error';

  /** Pharmacy name */
  pharmacyName: string;

  /** Pharmacy phone */
  pharmacyPhone: string;

  /** Pharmacy address */
  pharmacyAddress?: Address;

  /** Confirmation number from SureScripts */
  confirmationNumber?: string;

  /** When prescription was sent */
  sentDate: Date;

  /** When pharmacy accepted */
  acceptedDate?: Date;

  /** Rejection reason (if rejected) */
  rejectionReason?: string;

  /** Error details (if error) */
  errorDetails?: string;

  /** Expected ready date */
  expectedReadyDate?: Date;

  /** Messages from pharmacy */
  pharmacyMessages?: string[];
}

/**
 * Prescription status
 *
 * @example
 * ```typescript
 * const status: PrescriptionStatus = {
 *   prescriptionId: 'RX-123',
 *   status: 'active',
 *   writtenDate: new Date('2025-11-01'),
 *   lastFilledDate: new Date('2025-11-05'),
 *   refillsRemaining: 2,
 *   expirationDate: new Date('2026-11-01')
 * };
 * ```
 */
export interface PrescriptionStatus {
  /** Prescription ID */
  prescriptionId: string;

  /** Current status */
  status: 'active' | 'filled' | 'expired' | 'cancelled' | 'discontinued';

  /** When prescription was written */
  writtenDate: Date;

  /** Last fill date */
  lastFilledDate?: Date;

  /** Refills remaining */
  refillsRemaining: number;

  /** Total refills authorized */
  totalRefills: number;

  /** Expiration date */
  expirationDate: Date;

  /** Prescribing provider */
  prescriber: string;

  /** Pharmacy where filled */
  pharmacy?: string;

  /** Next refill eligible date */
  nextRefillEligibleDate?: Date;
}

/**
 * Pharmacy information
 *
 * @example
 * ```typescript
 * const pharmacy: PharmacyInfo = {
 *   ncpdpId: 'NCPDP-123',
 *   name: 'CVS Pharmacy',
 *   address: {
 *     line1: '456 Main St',
 *     city: 'Boston',
 *     state: 'MA',
 *     postalCode: '02101',
 *     country: 'USA'
 *   },
 *   phone: '+1-617-555-0199',
 *   is24Hour: false,
 *   acceptsEPrescriptions: true
 * };
 * ```
 */
export interface PharmacyInfo {
  /** NCPDP (National Council for Prescription Drug Programs) ID */
  ncpdpId: string;

  /** Pharmacy name */
  name: string;

  /** Address */
  address: Address;

  /** Phone number */
  phone: string;

  /** Fax number */
  fax?: string;

  /** Email */
  email?: string;

  /** Whether 24-hour pharmacy */
  is24Hour: boolean;

  /** Whether accepts e-prescriptions */
  acceptsEPrescriptions: boolean;

  /** Whether accepts controlled substance e-prescriptions */
  acceptsControlledSubstanceEPrescriptions?: boolean;

  /** Store hours */
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };

  /** Services offered */
  services?: string[];

  /** Distance from patient (if search-based) */
  distanceMiles?: number;
}

/**
 * Prescription refill request
 *
 * @example
 * ```typescript
 * const refill: PrescriptionRefillRequest = {
 *   prescriptionId: 'RX-123',
 *   patientId: 'PAT-456',
 *   pharmacyNCPDP: 'NCPDP-789',
 *   requestedBy: 'patient',
 *   urgency: 'routine'
 * };
 * ```
 */
export interface PrescriptionRefillRequest {
  /** Prescription ID */
  prescriptionId: string;

  /** Patient ID */
  patientId: string;

  /** Pharmacy NCPDP ID */
  pharmacyNCPDP: string;

  /** Who requested refill */
  requestedBy: 'patient' | 'provider' | 'pharmacy';

  /** Urgency level */
  urgency: 'routine' | 'urgent';

  /** Notes/reason */
  notes?: string;

  /** Requested pickup date */
  requestedPickupDate?: Date;
}

/**
 * Prescription refill response
 *
 * @example
 * ```typescript
 * const response: PrescriptionRefillResponse = {
 *   approved: true,
 *   newPrescriptionId: 'RX-789',
 *   expectedReadyDate: new Date('2025-11-12'),
 *   message: 'Refill approved and sent to pharmacy'
 * };
 * ```
 */
export interface PrescriptionRefillResponse {
  /** Whether refill was approved */
  approved: boolean;

  /** New prescription ID (if approved) */
  newPrescriptionId?: string;

  /** Expected ready date */
  expectedReadyDate?: Date;

  /** Message to patient */
  message: string;

  /** Denial reason (if not approved) */
  denialReason?: string;

  /** Whether requires provider contact */
  requiresProviderContact?: boolean;
}

/**
 * PDMP (Prescription Drug Monitoring Program) query request
 *
 * @example
 * ```typescript
 * const query: PDMPQueryRequest = {
 *   patientId: 'PAT-123',
 *   state: 'MA',
 *   requestingProvider: 'PROV-456',
 *   requestingProviderNPI: 'NPI-789',
 *   requestingProviderDEA: 'DEA-012'
 * };
 * ```
 */
export interface PDMPQueryRequest {
  /** Patient ID */
  patientId: string;

  /** Patient first name */
  patientFirstName: string;

  /** Patient last name */
  patientLastName: string;

  /** Patient date of birth */
  patientDateOfBirth: Date;

  /** Patient state */
  state: string;

  /** Requesting provider ID */
  requestingProvider: string;

  /** Requesting provider NPI */
  requestingProviderNPI: string;

  /** Requesting provider DEA */
  requestingProviderDEA: string;

  /** Date range for query */
  startDate?: Date;
  endDate?: Date;
}

/**
 * PDMP query response
 *
 * @example
 * ```typescript
 * const response: PDMPQueryResponse = {
 *   prescriptions: [...],
 *   totalPrescriptions: 5,
 *   controlledSubstanceCount: 2,
 *   queryDate: new Date(),
 *   alerts: ['Multiple prescribers detected']
 * };
 * ```
 */
export interface PDMPQueryResponse {
  /** Prescriptions found */
  prescriptions: PDMPPrescription[];

  /** Total number of prescriptions */
  totalPrescriptions: number;

  /** Number of controlled substance prescriptions */
  controlledSubstanceCount: number;

  /** When query was performed */
  queryDate: Date;

  /** Alerts/warnings */
  alerts?: string[];

  /** Risk score (if calculated) */
  riskScore?: number;

  /** Risk level */
  riskLevel?: 'low' | 'medium' | 'high';
}

/**
 * PDMP prescription entry
 *
 * @example
 * ```typescript
 * const prescription: PDMPPrescription = {
 *   medicationName: 'Oxycodone 5mg',
 *   deaSchedule: 'II',
 *   quantity: 30,
 *   daysSupply: 7,
 *   prescriber: 'Dr. Smith',
 *   prescriberNPI: 'NPI-123',
 *   pharmacy: 'CVS Pharmacy',
 *   fillDate: new Date('2025-11-01')
 * };
 * ```
 */
export interface PDMPPrescription {
  /** Medication name */
  medicationName: string;

  /** NDC code */
  ndc?: string;

  /** DEA schedule */
  deaSchedule: string;

  /** Quantity dispensed */
  quantity: number;

  /** Days supply */
  daysSupply: number;

  /** Prescriber name */
  prescriber: string;

  /** Prescriber NPI */
  prescriberNPI: string;

  /** Prescriber DEA */
  prescriberDEA?: string;

  /** Pharmacy name */
  pharmacy: string;

  /** Pharmacy NCPDP */
  pharmacyNCPDP?: string;

  /** Fill date */
  fillDate: Date;

  /** Refill number */
  refillNumber?: number;

  /** Payment method */
  paymentMethod?: 'cash' | 'insurance' | 'other';
}

/**
 * Prior authorization request
 *
 * @example
 * ```typescript
 * const authRequest: PriorAuthorizationRequest = {
 *   patientId: 'PAT-123',
 *   medicationName: 'Humira 40mg/0.8ml',
 *   diagnosis: 'Rheumatoid Arthritis',
 *   icd10Code: 'M06.9',
 *   requestingProvider: 'Dr. Smith',
 *   justification: 'Patient failed first-line therapy with methotrexate',
 *   urgency: 'urgent'
 * };
 * ```
 */
export interface PriorAuthorizationRequest {
  /** Patient ID */
  patientId: string;

  /** Medication name */
  medicationName: string;

  /** NDC code */
  ndc?: string;

  /** Diagnosis */
  diagnosis: string;

  /** ICD-10 code */
  icd10Code: string;

  /** Quantity requested */
  quantity?: number;

  /** Days supply */
  daysSupply?: number;

  /** Requesting provider */
  requestingProvider: string;

  /** Requesting provider NPI */
  requestingProviderNPI: string;

  /** Insurance/payer */
  payer?: string;

  /** Clinical justification */
  justification: string;

  /** Supporting documentation */
  supportingDocuments?: string[];

  /** Previous treatments tried */
  previousTreatments?: string[];

  /** Urgency level */
  urgency: 'routine' | 'urgent';
}

/**
 * Prior authorization response
 *
 * @example
 * ```typescript
 * const authResponse: PriorAuthorizationResponse = {
 *   authorizationId: 'AUTH-123',
 *   status: 'approved',
 *   approvedQuantity: 2,
 *   approvedDaysSupply: 30,
 *   authorizationNumber: 'AUTH-NUM-456',
 *   effectiveDate: new Date('2025-11-10'),
 *   expirationDate: new Date('2026-11-10')
 * };
 * ```
 */
export interface PriorAuthorizationResponse {
  /** Authorization request ID */
  authorizationId: string;

  /** Status */
  status: 'approved' | 'denied' | 'pending' | 'more_info_needed';

  /** Approved quantity */
  approvedQuantity?: number;

  /** Approved days supply */
  approvedDaysSupply?: number;

  /** Authorization number */
  authorizationNumber?: string;

  /** Effective date */
  effectiveDate?: Date;

  /** Expiration date */
  expirationDate?: Date;

  /** Denial reason (if denied) */
  denialReason?: string;

  /** Additional information needed (if pending) */
  additionalInfoNeeded?: string[];

  /** Payer contact info */
  payerContact?: {
    phone: string;
    fax?: string;
    email?: string;
  };

  /** Decision date */
  decisionDate?: Date;
}

/**
 * Formulary alternatives suggestion
 *
 * @example
 * ```typescript
 * const alternative: FormularyAlternative = {
 *   requestedMedication: 'Lipitor 20mg',
 *   isOnFormulary: false,
 *   requiresPriorAuth: true,
 *   alternatives: [
 *     {
 *       medicationName: 'Atorvastatin 20mg',
 *       isGeneric: true,
 *       isPreferred: true,
 *       costDifference: -50.00,
 *       requiresPriorAuth: false
 *     }
 *   ]
 * };
 * ```
 */
export interface FormularyAlternative {
  /** Requested medication */
  requestedMedication: string;

  /** Whether on formulary */
  isOnFormulary: boolean;

  /** Whether requires prior authorization */
  requiresPriorAuth: boolean;

  /** Formulary tier (1-5) */
  formularyTier?: number;

  /** Copay amount */
  copayAmount?: number;

  /** Alternative medications */
  alternatives?: {
    medicationName: string;
    isGeneric: boolean;
    isPreferred: boolean;
    costDifference: number;
    requiresPriorAuth: boolean;
    formularyTier?: number;
  }[];
}

/**
 * Prescription history entry
 *
 * @example
 * ```typescript
 * const history: PrescriptionHistoryEntry = {
 *   prescriptionId: 'RX-123',
 *   medicationName: 'Lisinopril 10mg',
 *   writtenDate: new Date('2025-11-01'),
 *   filledDate: new Date('2025-11-05'),
 *   quantity: 30,
 *   daysSupply: 30,
 *   prescriber: 'Dr. Smith',
 *   pharmacy: 'CVS Pharmacy',
 *   status: 'filled'
 * };
 * ```
 */
export interface PrescriptionHistoryEntry {
  /** Prescription ID */
  prescriptionId: string;

  /** Medication name */
  medicationName: string;

  /** Written date */
  writtenDate: Date;

  /** Filled date */
  filledDate?: Date;

  /** Quantity */
  quantity: number;

  /** Days supply */
  daysSupply: number;

  /** Prescriber */
  prescriber: string;

  /** Pharmacy */
  pharmacy?: string;

  /** Status */
  status: EntityStatus;

  /** Refill number (0 = original, 1+ = refills) */
  refillNumber: number;

  /** Cost */
  cost?: number;

  /** Insurance paid */
  insurancePaid?: number;

  /** Patient paid */
  patientPaid?: number;
}
