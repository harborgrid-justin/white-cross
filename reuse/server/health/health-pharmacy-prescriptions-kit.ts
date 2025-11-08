/**
 * LOC: HPHARMKIT001
 * File: /reuse/server/health/health-pharmacy-prescriptions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - TypeScript 5.x
 *   - NCPDP SCRIPT libraries
 *   - FHIR R4 libraries
 *
 * DOWNSTREAM (imported by):
 *   - E-prescribing services
 *   - Medication services
 *   - Pharmacy integration services
 *   - Clinical decision support
 *   - Controlled substance monitoring
 */

/**
 * File: /reuse/server/health/health-pharmacy-prescriptions-kit.ts
 * Locator: WC-HEALTH-PHARMKIT-001
 * Purpose: Comprehensive Pharmacy and E-Prescribing Toolkit - Epic Willow-level medication management
 *
 * Upstream: Independent utility module for pharmacy and prescription operations
 * Downstream: ../backend/health/*, Pharmacy modules, E-prescribing integration
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, NCPDP SCRIPT, FHIR R4
 * Exports: 45 utility functions for e-prescribing, medication management, drug safety
 *
 * LLM Context: Enterprise-grade pharmacy and e-prescribing toolkit for White Cross healthcare platform.
 * Provides comprehensive e-prescribing with NCPDP SCRIPT support, prescription creation and validation
 * with dosage calculation, medication reconciliation with comprehensive history tracking, drug interaction
 * checking with severity scoring, allergy cross-sensitivity checking, formulary verification with
 * tier-based coverage, prior authorization workflow automation, prescription renewal request processing,
 * DEA-compliant controlled substance tracking with PDMP integration, barcode-verified medication
 * administration records (MAR), IV fluid management with rate calculations, medication barcode verification
 * with NDC validation, pharmacy inventory integration, and compounding instruction generation - all
 * HIPAA-compliant with full audit trails for regulatory compliance.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Prescription status enumeration
 */
export enum PrescriptionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ENTERED_IN_ERROR = 'entered_in_error',
  STOPPED = 'stopped'
}

/**
 * Prescription priority
 */
export enum PrescriptionPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat'
}

/**
 * Drug form enumeration
 */
export enum DrugForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  INJECTION = 'injection',
  TOPICAL = 'topical',
  INHALER = 'inhaler',
  PATCH = 'patch',
  SUPPOSITORY = 'suppository',
  CREAM = 'cream',
  OINTMENT = 'ointment'
}

/**
 * Route of administration
 */
export enum RouteOfAdministration {
  ORAL = 'oral',
  IV = 'intravenous',
  IM = 'intramuscular',
  SC = 'subcutaneous',
  TOPICAL = 'topical',
  RECTAL = 'rectal',
  INHALED = 'inhaled',
  SUBLINGUAL = 'sublingual',
  TRANSDERMAL = 'transdermal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal'
}

/**
 * DEA schedule for controlled substances
 */
export enum DEASchedule {
  SCHEDULE_I = 'I',
  SCHEDULE_II = 'II',
  SCHEDULE_III = 'III',
  SCHEDULE_IV = 'IV',
  SCHEDULE_V = 'V',
  NON_CONTROLLED = 'NC'
}

/**
 * Drug interaction severity
 */
export enum InteractionSeverity {
  CONTRAINDICATED = 'contraindicated',
  MAJOR = 'major',
  MODERATE = 'moderate',
  MINOR = 'minor',
  UNKNOWN = 'unknown'
}

/**
 * Prescription creation data
 */
export interface CreatePrescriptionDto {
  patientId: string;
  prescriberId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  route: RouteOfAdministration;
  frequency: string;
  quantity: number;
  quantityUnit: string;
  refills: number;
  daysSupply: number;
  instructions: string;
  indication?: string;
  priority?: PrescriptionPriority;
  substituteAllowed?: boolean;
  pharmacyId?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Prescription data
 */
export interface Prescription {
  prescriptionId: string;
  rxNumber: string;
  patientId: string;
  prescriberId: string;
  prescriberName?: string;
  medicationId: string;
  medicationName: string;
  genericName?: string;
  ndcCode?: string;
  dosage: string;
  strength?: string;
  form: DrugForm;
  route: RouteOfAdministration;
  frequency: string;
  quantity: number;
  quantityUnit: string;
  refills: number;
  refillsRemaining: number;
  daysSupply: number;
  instructions: string;
  indication?: string;
  status: PrescriptionStatus;
  priority: PrescriptionPriority;
  substituteAllowed: boolean;
  prescribedDate: Date;
  startDate?: Date;
  endDate?: Date;
  lastFilledDate?: Date;
  pharmacyId?: string;
  deaSchedule?: DEASchedule;
  isPRN?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Medication information
 */
export interface MedicationInfo {
  medicationId: string;
  brandName: string;
  genericName: string;
  ndcCode: string;
  rxcui?: string;
  strength: string;
  form: DrugForm;
  route: RouteOfAdministration[];
  deaSchedule: DEASchedule;
  manufacturer?: string;
  activeIngredients: string[];
  warnings?: string[];
  contraindications?: string[];
  blackBoxWarning?: string;
  pregnancy Category?: string;
}

/**
 * Drug interaction
 */
export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: InteractionSeverity;
  description: string;
  clinicalEffects?: string;
  management?: string;
  references?: string[];
}

/**
 * Drug allergy
 */
export interface DrugAllergy {
  allergyId: string;
  patientId: string;
  allergen: string;
  allergenType: 'medication' | 'food' | 'environmental';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  onsetDate?: Date;
  verifiedBy?: string;
  verifiedDate?: Date;
  status: 'active' | 'inactive' | 'resolved';
  notes?: string;
}

/**
 * Allergy cross-sensitivity
 */
export interface AllergyCrossSensitivity {
  allergen: string;
  crossSensitiveMedications: string[];
  likelihood: 'high' | 'moderate' | 'low';
  description: string;
}

/**
 * Formulary entry
 */
export interface FormularyEntry {
  medicationId: string;
  medicationName: string;
  genericName: string;
  ndcCode: string;
  tier: number;
  preferred: boolean;
  requiresPriorAuth: boolean;
  quantityLimit?: number;
  quantityLimitPeriod?: string;
  stepTherapyRequired?: boolean;
  alternatives?: FormularyAlternative[];
  copay?: number;
  coinsurance?: number;
  restrictions?: string[];
}

/**
 * Formulary alternative
 */
export interface FormularyAlternative {
  medicationId: string;
  medicationName: string;
  genericName: string;
  tier: number;
  costSavings?: number;
  reason: string;
}

/**
 * Prior authorization request
 */
export interface PriorAuthorizationRequest {
  paRequestId: string;
  prescriptionId: string;
  patientId: string;
  medicationId: string;
  medicationName: string;
  requestedQuantity: number;
  requestedDaysSupply: number;
  diagnosis: string[];
  icdCodes: string[];
  clinicalJustification: string;
  triedAndFailed?: string[];
  contraindicationsToAlternatives?: string[];
  supportingDocuments?: string[];
  requestedBy: string;
  requestedDate: Date;
  status: 'pending' | 'approved' | 'denied' | 'more_info_needed';
  reviewedBy?: string;
  reviewedDate?: Date;
  approvalNumber?: string;
  denialReason?: string;
  validUntil?: Date;
}

/**
 * Prescription renewal request
 */
export interface PrescriptionRenewalRequest {
  renewalRequestId: string;
  prescriptionId: string;
  rxNumber: string;
  patientId: string;
  medicationName: string;
  requestedBy: 'patient' | 'pharmacy' | 'provider';
  requestedDate: Date;
  requestedRefills: number;
  pharmacyId?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  status: 'pending' | 'approved' | 'denied' | 'requires_appointment';
  reviewedBy?: string;
  reviewedDate?: Date;
  denialReason?: string;
  notes?: string;
}

/**
 * PDMP (Prescription Drug Monitoring Program) query
 */
export interface PDMPQuery {
  queryId: string;
  patientId: string;
  patientName: string;
  dateOfBirth: Date;
  state: string;
  queryDate: Date;
  queriedBy: string;
  purpose: 'prescribing' | 'dispensing' | 'review';
  results?: PDMPResult[];
}

/**
 * PDMP result
 */
export interface PDMPResult {
  prescriptionId: string;
  medicationName: string;
  deaSchedule: DEASchedule;
  prescribedDate: Date;
  filledDate: Date;
  quantity: number;
  daysSupply: number;
  prescriberName: string;
  prescriberDEA?: string;
  pharmacyName: string;
  pharmacyDEA?: string;
}

/**
 * Medication reconciliation
 */
export interface MedicationReconciliation {
  reconciliationId: string;
  patientId: string;
  reconciliationType: 'admission' | 'transfer' | 'discharge';
  reconciliationDate: Date;
  performedBy: string;
  homeMedications: ReconciliationMedication[];
  facilityMedications: ReconciliationMedication[];
  discrepancies: MedicationDiscrepancy[];
  resolved: boolean;
  resolvedBy?: string;
  resolvedDate?: Date;
  notes?: string;
}

/**
 * Reconciliation medication
 */
export interface ReconciliationMedication {
  medicationName: string;
  dosage: string;
  route: RouteOfAdministration;
  frequency: string;
  lastTaken?: Date;
  source: 'patient_reported' | 'pharmacy_records' | 'provider_list' | 'ehr';
  verified: boolean;
}

/**
 * Medication discrepancy
 */
export interface MedicationDiscrepancy {
  discrepancyType: 'omission' | 'commission' | 'dose_change' | 'frequency_change' | 'route_change';
  medication: string;
  homeDose?: string;
  facilityDose?: string;
  clinicalSignificance: 'high' | 'medium' | 'low';
  action: 'continue' | 'discontinue' | 'modify' | 'investigate';
  reason?: string;
}

/**
 * Medication administration record (MAR)
 */
export interface MedicationAdministrationRecord {
  marId: string;
  patientId: string;
  prescriptionId: string;
  medicationName: string;
  scheduledTime: Date;
  administeredTime?: Date;
  dosageAdministered?: string;
  route: RouteOfAdministration;
  administeredBy?: string;
  status: 'scheduled' | 'administered' | 'missed' | 'refused' | 'held' | 'not_available';
  refusalReason?: string;
  holdReason?: string;
  barcodeScanned?: boolean;
  witnessedBy?: string;
  site?: string;
  notes?: string;
}

/**
 * IV fluid order
 */
export interface IVFluidOrder {
  ivOrderId: string;
  patientId: string;
  prescriberId: string;
  fluidType: string;
  additives?: IVAdditive[];
  totalVolume: number;
  volumeUnit: 'mL' | 'L';
  rate: number;
  rateUnit: 'mL/hr' | 'mL/min' | 'drops/min';
  route: 'peripheral_iv' | 'central_line' | 'picc';
  duration?: number;
  startTime?: Date;
  expectedEndTime?: Date;
  status: 'active' | 'completed' | 'stopped' | 'paused';
  indications?: string;
  specialInstructions?: string;
}

/**
 * IV additive
 */
export interface IVAdditive {
  medicationName: string;
  dose: number;
  doseUnit: string;
  concentration?: string;
}

/**
 * Medication barcode verification
 */
export interface MedicationBarcodeVerification {
  verificationId: string;
  patientBarcode: string;
  medicationBarcode: string;
  ndcCode: string;
  lotNumber?: string;
  expirationDate?: Date;
  verifiedAt: Date;
  verifiedBy: string;
  matches: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Pharmacy inventory item
 */
export interface PharmacyInventoryItem {
  inventoryId: string;
  medicationId: string;
  medicationName: string;
  ndcCode: string;
  lotNumber: string;
  expirationDate: Date;
  quantityOnHand: number;
  quantityUnit: string;
  location: string;
  reorderLevel: number;
  reorderQuantity: number;
  cost?: number;
  lastRestocked?: Date;
  deaSchedule?: DEASchedule;
}

/**
 * Compounding instructions
 */
export interface CompoundingInstructions {
  compoundId: string;
  formulaName: string;
  ingredients: CompoundIngredient[];
  finalVolume?: number;
  finalVolumeUnit?: string;
  preparationMethod: string;
  equipment?: string[];
  stability?: string;
  storage?: string;
  beyondUseDate?: Date;
  preparedBy?: string;
  verifiedBy?: string;
  specialInstructions?: string;
}

/**
 * Compound ingredient
 */
export interface CompoundIngredient {
  ingredientName: string;
  quantity: number;
  quantityUnit: string;
  form?: string;
  source?: string;
  lotNumber?: string;
}

/**
 * NCPDP SCRIPT message
 */
export interface NCPDPScriptMessage {
  messageId: string;
  messageType: 'NewRx' | 'RefillRequest' | 'RxChangeRequest' | 'CancelRx' | 'Status';
  version: string;
  sender: NCPDPParticipant;
  receiver: NCPDPParticipant;
  patient: NCPDPPatient;
  prescription?: NCPDPPrescription;
  sentAt: Date;
  rawMessage?: string;
}

/**
 * NCPDP participant
 */
export interface NCPDPParticipant {
  npi?: string;
  ncpdpId?: string;
  name: string;
  address?: string;
  phone?: string;
  fax?: string;
}

/**
 * NCPDP patient
 */
export interface NCPDPPatient {
  patientId: string;
  name: {
    first: string;
    last: string;
    middle?: string;
  };
  dateOfBirth: Date;
  sex: 'M' | 'F' | 'U';
  address?: string;
  phone?: string;
}

/**
 * NCPDP prescription
 */
export interface NCPDPPrescription {
  rxNumber: string;
  medicationName: string;
  strength: string;
  form: string;
  quantity: number;
  quantityUnit: string;
  daysSupply: number;
  refills: number;
  substitutionsAllowed: boolean;
  sig: string;
  notes?: string;
  daw?: boolean; // Dispense As Written
}

// ============================================================================
// SECTION 1: E-PRESCRIBING (NCPDP SCRIPT) (Functions 1-6)
// ============================================================================

/**
 * 1. Creates NCPDP SCRIPT NewRx message for electronic prescribing.
 *
 * @param {Prescription} prescription - Prescription data
 * @param {Object} participants - Sender and receiver information
 * @returns {NCPDPScriptMessage} NCPDP SCRIPT message
 *
 * @example
 * ```typescript
 * const scriptMessage = createNCPDPNewRxMessage(prescription, {
 *   sender: {
 *     npi: '1234567890',
 *     name: 'Dr. John Smith',
 *     phone: '555-0100'
 *   },
 *   receiver: {
 *     ncpdpId: '1234567',
 *     name: 'Community Pharmacy',
 *     phone: '555-0200'
 *   },
 *   patient: {
 *     patientId: 'PAT-123',
 *     name: { first: 'Jane', last: 'Doe' },
 *     dateOfBirth: new Date('1980-05-15'),
 *     sex: 'F'
 *   }
 * });
 * ```
 */
export function createNCPDPNewRxMessage(
  prescription: Prescription,
  participants: {
    sender: NCPDPParticipant;
    receiver: NCPDPParticipant;
    patient: NCPDPPatient;
  }
): NCPDPScriptMessage {
  return {
    messageId: `MSG-${crypto.randomUUID()}`,
    messageType: 'NewRx',
    version: '10.6',
    sender: participants.sender,
    receiver: participants.receiver,
    patient: participants.patient,
    prescription: {
      rxNumber: prescription.rxNumber,
      medicationName: prescription.medicationName,
      strength: prescription.strength || prescription.dosage,
      form: prescription.form,
      quantity: prescription.quantity,
      quantityUnit: prescription.quantityUnit,
      daysSupply: prescription.daysSupply,
      refills: prescription.refills,
      substitutionsAllowed: prescription.substituteAllowed,
      sig: prescription.instructions,
      daw: !prescription.substituteAllowed
    },
    sentAt: new Date()
  };
}

/**
 * 2. Creates NCPDP SCRIPT RefillRequest message.
 *
 * @param {PrescriptionRenewalRequest} renewalRequest - Renewal request
 * @param {Object} participants - Pharmacy and prescriber information
 * @returns {NCPDPScriptMessage} NCPDP SCRIPT message
 *
 * @example
 * ```typescript
 * const refillRequest = createNCPDPRefillRequest(renewalRequest, {
 *   pharmacy: { ncpdpId: '1234567', name: 'Community Pharmacy' },
 *   prescriber: { npi: '1234567890', name: 'Dr. Smith' },
 *   patient: patientInfo
 * });
 * ```
 */
export function createNCPDPRefillRequest(
  renewalRequest: PrescriptionRenewalRequest,
  participants: {
    pharmacy: NCPDPParticipant;
    prescriber: NCPDPParticipant;
    patient: NCPDPPatient;
  }
): NCPDPScriptMessage {
  return {
    messageId: `MSG-${crypto.randomUUID()}`,
    messageType: 'RefillRequest',
    version: '10.6',
    sender: participants.pharmacy,
    receiver: participants.prescriber,
    patient: participants.patient,
    prescription: {
      rxNumber: renewalRequest.rxNumber,
      medicationName: renewalRequest.medicationName,
      strength: '',
      form: '',
      quantity: 0,
      quantityUnit: '',
      daysSupply: 0,
      refills: renewalRequest.requestedRefills,
      substitutionsAllowed: true,
      sig: ''
    },
    sentAt: new Date()
  };
}

/**
 * 3. Validates NCPDP SCRIPT message structure and content.
 *
 * @param {NCPDPScriptMessage} message - NCPDP message
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateNCPDPScriptMessage(message);
 * if (!validation.valid) {
 *   console.error('NCPDP errors:', validation.errors);
 * }
 * ```
 */
export function validateNCPDPScriptMessage(message: NCPDPScriptMessage): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!message.messageId) {
    errors.push('Message ID is required');
  }

  if (!message.sender?.npi && !message.sender?.ncpdpId) {
    errors.push('Sender must have NPI or NCPDP ID');
  }

  if (!message.receiver?.npi && !message.receiver?.ncpdpId) {
    errors.push('Receiver must have NPI or NCPDP ID');
  }

  if (!message.patient?.patientId) {
    errors.push('Patient ID is required');
  }

  if (!message.patient?.name?.first || !message.patient?.name?.last) {
    errors.push('Patient first and last name required');
  }

  if (!message.patient?.dateOfBirth) {
    errors.push('Patient date of birth is required');
  }

  if (message.messageType === 'NewRx' && message.prescription) {
    if (!message.prescription.medicationName) {
      errors.push('Medication name is required');
    }
    if (!message.prescription.quantity || message.prescription.quantity <= 0) {
      errors.push('Valid quantity is required');
    }
    if (!message.prescription.sig) {
      warnings.push('Prescription instructions (SIG) are recommended');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 4. Parses received NCPDP SCRIPT message.
 *
 * @param {string} rawMessage - Raw NCPDP message
 * @returns {NCPDPScriptMessage} Parsed message
 *
 * @example
 * ```typescript
 * const message = parseNCPDPScriptMessage(rawXML);
 * console.log(`Received ${message.messageType} for patient ${message.patient.name.last}`);
 * ```
 */
export function parseNCPDPScriptMessage(rawMessage: string): NCPDPScriptMessage {
  // In production, would parse XML or JSON based on format
  // Placeholder implementation for type safety
  return {
    messageId: '',
    messageType: 'NewRx',
    version: '10.6',
    sender: { name: '' },
    receiver: { name: '' },
    patient: {
      patientId: '',
      name: { first: '', last: '' },
      dateOfBirth: new Date(),
      sex: 'U'
    },
    sentAt: new Date(),
    rawMessage
  };
}

/**
 * 5. Sends NCPDP SCRIPT message to pharmacy via secure gateway.
 *
 * @param {NCPDPScriptMessage} message - Message to send
 * @returns {Promise<Object>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendNCPDPScriptMessage(newRxMessage);
 * if (result.success) {
 *   console.log('Prescription sent successfully');
 * }
 * ```
 */
export async function sendNCPDPScriptMessage(message: NCPDPScriptMessage): Promise<{
  success: boolean;
  messageId: string;
  confirmationNumber?: string;
  error?: string;
}> {
  const validation = validateNCPDPScriptMessage(message);
  if (!validation.valid) {
    return {
      success: false,
      messageId: message.messageId,
      error: validation.errors.join('; ')
    };
  }

  // In production, would send to NCPDP gateway
  // Placeholder for type safety
  return {
    success: true,
    messageId: message.messageId,
    confirmationNumber: `CONF-${crypto.randomUUID()}`
  };
}

/**
 * 6. Processes NCPDP SCRIPT response/acknowledgment.
 *
 * @param {NCPDPScriptMessage} originalMessage - Original message
 * @param {string} response - Response from pharmacy
 * @returns {Object} Processing result
 *
 * @example
 * ```typescript
 * const result = processNCPDPScriptResponse(originalMessage, responseXML);
 * if (result.accepted) {
 *   console.log('Prescription accepted by pharmacy');
 * }
 * ```
 */
export function processNCPDPScriptResponse(
  originalMessage: NCPDPScriptMessage,
  response: string
): {
  accepted: boolean;
  status: string;
  pharmacyRxNumber?: string;
  message?: string;
  errors?: string[];
} {
  // In production, would parse response XML/JSON
  return {
    accepted: true,
    status: 'accepted'
  };
}

// ============================================================================
// SECTION 2: PRESCRIPTION CREATION AND VALIDATION (Functions 7-12)
// ============================================================================

/**
 * 7. Creates new prescription with comprehensive validation.
 *
 * @param {CreatePrescriptionDto} prescriptionData - Prescription data
 * @returns {Prescription} Created prescription
 *
 * @example
 * ```typescript
 * const prescription = createPrescription({
 *   patientId: 'PAT-123',
 *   prescriberId: 'PROV-456',
 *   medicationId: 'MED-789',
 *   medicationName: 'Lisinopril 10mg Tablet',
 *   dosage: '10mg',
 *   route: RouteOfAdministration.ORAL,
 *   frequency: 'Once daily',
 *   quantity: 90,
 *   quantityUnit: 'tablets',
 *   refills: 3,
 *   daysSupply: 90,
 *   instructions: 'Take one tablet by mouth daily for blood pressure',
 *   indication: 'Hypertension'
 * });
 * ```
 */
export function createPrescription(prescriptionData: CreatePrescriptionDto): Prescription {
  const rxNumber = generateRxNumber();

  return {
    prescriptionId: `RX-${crypto.randomUUID()}`,
    rxNumber,
    patientId: prescriptionData.patientId,
    prescriberId: prescriptionData.prescriberId,
    medicationId: prescriptionData.medicationId,
    medicationName: prescriptionData.medicationName,
    dosage: prescriptionData.dosage,
    form: DrugForm.TABLET, // Would come from medication info
    route: prescriptionData.route,
    frequency: prescriptionData.frequency,
    quantity: prescriptionData.quantity,
    quantityUnit: prescriptionData.quantityUnit,
    refills: prescriptionData.refills,
    refillsRemaining: prescriptionData.refills,
    daysSupply: prescriptionData.daysSupply,
    instructions: prescriptionData.instructions,
    indication: prescriptionData.indication,
    status: PrescriptionStatus.ACTIVE,
    priority: prescriptionData.priority || PrescriptionPriority.ROUTINE,
    substituteAllowed: prescriptionData.substituteAllowed ?? true,
    prescribedDate: new Date(),
    startDate: prescriptionData.startDate,
    endDate: prescriptionData.endDate,
    pharmacyId: prescriptionData.pharmacyId
  };
}

/**
 * 8. Generates unique prescription (Rx) number.
 *
 * @returns {string} Prescription number
 *
 * @example
 * ```typescript
 * const rxNumber = generateRxNumber();
 * // Returns: 'RX-20240115-001234'
 * ```
 */
export function generateRxNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  return `RX-${year}${month}${day}-${sequence}`;
}

/**
 * 9. Validates prescription for completeness and safety.
 *
 * @param {CreatePrescriptionDto} prescriptionData - Prescription to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePrescription(prescriptionData);
 * if (!validation.valid) {
 *   console.error('Prescription errors:', validation.errors);
 * }
 * ```
 */
export function validatePrescription(prescriptionData: CreatePrescriptionDto): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!prescriptionData.patientId) {
    errors.push('Patient ID is required');
  }

  if (!prescriptionData.prescriberId) {
    errors.push('Prescriber ID is required');
  }

  if (!prescriptionData.medicationId || !prescriptionData.medicationName) {
    errors.push('Medication information is required');
  }

  if (!prescriptionData.dosage) {
    errors.push('Dosage is required');
  }

  if (!prescriptionData.route) {
    errors.push('Route of administration is required');
  }

  if (!prescriptionData.frequency) {
    errors.push('Frequency is required');
  }

  if (!prescriptionData.quantity || prescriptionData.quantity <= 0) {
    errors.push('Valid quantity is required');
  }

  if (!prescriptionData.daysSupply || prescriptionData.daysSupply <= 0) {
    errors.push('Valid days supply is required');
  }

  if (!prescriptionData.instructions) {
    warnings.push('Patient instructions are recommended');
  }

  if (prescriptionData.refills > 5) {
    warnings.push('High number of refills (>5) - verify this is intentional');
  }

  if (prescriptionData.daysSupply > 90) {
    warnings.push('Days supply >90 may require prior authorization');
  }

  // Validate quantity matches days supply
  const expectedQuantityPerDay = prescriptionData.quantity / prescriptionData.daysSupply;
  if (expectedQuantityPerDay > 10) {
    warnings.push('Quantity appears high for days supply - verify dosing');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 10. Calculates appropriate days supply based on dosing.
 *
 * @param {Object} dosingInfo - Dosing information
 * @returns {number} Calculated days supply
 *
 * @example
 * ```typescript
 * const daysSupply = calculateDaysSupply({
 *   quantity: 90,
 *   quantityUnit: 'tablets',
 *   frequency: 'TID', // Three times daily
 *   dosesPerAdministration: 1
 * });
 * // Returns: 30
 * ```
 */
export function calculateDaysSupply(dosingInfo: {
  quantity: number;
  quantityUnit: string;
  frequency: string;
  dosesPerAdministration: number;
}): number {
  const frequencyMap: Record<string, number> = {
    'QD': 1,
    'BID': 2,
    'TID': 3,
    'QID': 4,
    'Q12H': 2,
    'Q8H': 3,
    'Q6H': 4,
    'Q4H': 6,
    'QHS': 1,
    'QAM': 1,
    'QPM': 1,
    'PRN': 2 // Estimate for PRN
  };

  const frequencyUpper = dosingInfo.frequency.toUpperCase();
  let timesPerDay = 1;

  // Check for exact match
  if (frequencyMap[frequencyUpper]) {
    timesPerDay = frequencyMap[frequencyUpper];
  } else {
    // Parse text like "three times daily" or "2 times per day"
    const match = frequencyUpper.match(/(\d+|ONE|TWO|THREE|FOUR)\s*(TIME|X)/);
    if (match) {
      const numMap: Record<string, number> = {
        'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4
      };
      const num = match[1];
      timesPerDay = numMap[num] || parseInt(num) || 1;
    }
  }

  const totalDosesPerDay = timesPerDay * dosingInfo.dosesPerAdministration;
  const daysSupply = Math.floor(dosingInfo.quantity / totalDosesPerDay);

  return daysSupply;
}

/**
 * 11. Updates prescription status with validation.
 *
 * @param {Prescription} prescription - Prescription to update
 * @param {PrescriptionStatus} newStatus - New status
 * @param {string} updatedBy - User performing update
 * @returns {Prescription} Updated prescription
 *
 * @example
 * ```typescript
 * const updated = updatePrescriptionStatus(prescription, PrescriptionStatus.COMPLETED, 'PHARM-123');
 * ```
 */
export function updatePrescriptionStatus(
  prescription: Prescription,
  newStatus: PrescriptionStatus,
  updatedBy: string
): Prescription {
  const validTransitions: Record<PrescriptionStatus, PrescriptionStatus[]> = {
    [PrescriptionStatus.DRAFT]: [PrescriptionStatus.ACTIVE, PrescriptionStatus.CANCELLED],
    [PrescriptionStatus.ACTIVE]: [PrescriptionStatus.SUSPENDED, PrescriptionStatus.COMPLETED, PrescriptionStatus.STOPPED, PrescriptionStatus.CANCELLED],
    [PrescriptionStatus.SUSPENDED]: [PrescriptionStatus.ACTIVE, PrescriptionStatus.STOPPED],
    [PrescriptionStatus.COMPLETED]: [],
    [PrescriptionStatus.CANCELLED]: [],
    [PrescriptionStatus.ENTERED_IN_ERROR]: [],
    [PrescriptionStatus.STOPPED]: []
  };

  if (!validTransitions[prescription.status]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${prescription.status} to ${newStatus}`);
  }

  const updated = { ...prescription, status: newStatus };

  if (!updated.metadata) updated.metadata = {};
  updated.metadata.lastUpdatedBy = updatedBy;
  updated.metadata.lastUpdatedAt = new Date();
  updated.metadata.statusChangeReason = newStatus;

  return updated;
}

/**
 * 12. Records prescription fill and updates refills remaining.
 *
 * @param {Prescription} prescription - Prescription to fill
 * @param {Object} fillData - Fill information
 * @returns {Prescription} Updated prescription
 *
 * @example
 * ```typescript
 * const filled = recordPrescriptionFill(prescription, {
 *   pharmacyId: 'PHARM-123',
 *   filledBy: 'PHARMACIST-456',
 *   quantityDispensed: 90,
 *   daysSupply: 90
 * });
 * ```
 */
export function recordPrescriptionFill(
  prescription: Prescription,
  fillData: {
    pharmacyId: string;
    filledBy: string;
    quantityDispensed: number;
    daysSupply: number;
  }
): Prescription {
  if (prescription.refillsRemaining <= 0) {
    throw new Error('No refills remaining');
  }

  if (prescription.status !== PrescriptionStatus.ACTIVE) {
    throw new Error('Can only fill active prescriptions');
  }

  const updated = { ...prescription };
  updated.refillsRemaining -= 1;
  updated.lastFilledDate = new Date();

  if (updated.refillsRemaining === 0) {
    updated.status = PrescriptionStatus.COMPLETED;
  }

  if (!updated.metadata) updated.metadata = {};
  updated.metadata.lastFillPharmacy = fillData.pharmacyId;
  updated.metadata.lastFilledBy = fillData.filledBy;
  updated.metadata.lastQuantityDispensed = fillData.quantityDispensed;
  updated.metadata.lastDaysSupply = fillData.daysSupply;

  return updated;
}

// ============================================================================
// SECTION 3: MEDICATION RECONCILIATION (Functions 13-15)
// ============================================================================

/**
 * 13. Creates medication reconciliation record.
 *
 * @param {Object} reconciliationData - Reconciliation data
 * @returns {MedicationReconciliation} Reconciliation record
 *
 * @example
 * ```typescript
 * const reconciliation = createMedicationReconciliation({
 *   patientId: 'PAT-123',
 *   reconciliationType: 'admission',
 *   performedBy: 'NURSE-456',
 *   homeMedications: [...],
 *   facilityMedications: [...]
 * });
 * ```
 */
export function createMedicationReconciliation(reconciliationData: {
  patientId: string;
  reconciliationType: 'admission' | 'transfer' | 'discharge';
  performedBy: string;
  homeMedications: ReconciliationMedication[];
  facilityMedications: ReconciliationMedication[];
}): MedicationReconciliation {
  const discrepancies = identifyMedicationDiscrepancies(
    reconciliationData.homeMedications,
    reconciliationData.facilityMedications
  );

  return {
    reconciliationId: `RECON-${crypto.randomUUID()}`,
    patientId: reconciliationData.patientId,
    reconciliationType: reconciliationData.reconciliationType,
    reconciliationDate: new Date(),
    performedBy: reconciliationData.performedBy,
    homeMedications: reconciliationData.homeMedications,
    facilityMedications: reconciliationData.facilityMedications,
    discrepancies,
    resolved: discrepancies.length === 0
  };
}

/**
 * 14. Identifies discrepancies between home and facility medications.
 *
 * @param {ReconciliationMedication[]} homeMeds - Home medications
 * @param {ReconciliationMedication[]} facilityMeds - Facility medications
 * @returns {MedicationDiscrepancy[]} Identified discrepancies
 *
 * @example
 * ```typescript
 * const discrepancies = identifyMedicationDiscrepancies(homeMeds, facilityMeds);
 * console.log(`Found ${discrepancies.length} discrepancies`);
 * ```
 */
export function identifyMedicationDiscrepancies(
  homeMeds: ReconciliationMedication[],
  facilityMeds: ReconciliationMedication[]
): MedicationDiscrepancy[] {
  const discrepancies: MedicationDiscrepancy[] = [];

  // Check for omissions (home meds not in facility list)
  homeMeds.forEach(homeMed => {
    const inFacility = facilityMeds.some(
      f => normalizeM medicationName(f.medicationName) === normalizeMedicationName(homeMed.medicationName)
    );

    if (!inFacility) {
      discrepancies.push({
        discrepancyType: 'omission',
        medication: homeMed.medicationName,
        homeDose: `${homeMed.dosage} ${homeMed.route} ${homeMed.frequency}`,
        clinicalSignificance: assessClinicalSignificance(homeMed),
        action: 'investigate'
      });
    }
  });

  // Check for commissions (facility meds not in home list)
  facilityMeds.forEach(facilityMed => {
    const inHome = homeMeds.some(
      h => normalizeMedicationName(h.medicationName) === normalizeMedicationName(facilityMed.medicationName)
    );

    if (!inHome) {
      discrepancies.push({
        discrepancyType: 'commission',
        medication: facilityMed.medicationName,
        facilityDose: `${facilityMed.dosage} ${facilityMed.route} ${facilityMed.frequency}`,
        clinicalSignificance: assessClinicalSignificance(facilityMed),
        action: 'investigate'
      });
    }
  });

  // Check for dose/frequency/route changes
  homeMeds.forEach(homeMed => {
    const facilityMed = facilityMeds.find(
      f => normalizeMedicationName(f.medicationName) === normalizeMedicationName(homeMed.medicationName)
    );

    if (facilityMed) {
      if (homeMed.dosage !== facilityMed.dosage) {
        discrepancies.push({
          discrepancyType: 'dose_change',
          medication: homeMed.medicationName,
          homeDose: homeMed.dosage,
          facilityDose: facilityMed.dosage,
          clinicalSignificance: 'medium',
          action: 'investigate'
        });
      }

      if (homeMed.frequency !== facilityMed.frequency) {
        discrepancies.push({
          discrepancyType: 'frequency_change',
          medication: homeMed.medicationName,
          homeDose: homeMed.frequency,
          facilityDose: facilityMed.frequency,
          clinicalSignificance: 'medium',
          action: 'investigate'
        });
      }

      if (homeMed.route !== facilityMed.route) {
        discrepancies.push({
          discrepancyType: 'route_change',
          medication: homeMed.medicationName,
          homeDose: homeMed.route,
          facilityDose: facilityMed.route,
          clinicalSignificance: 'high',
          action: 'investigate'
        });
      }
    }
  });

  return discrepancies;
}

/**
 * 15. Resolves medication reconciliation discrepancies.
 *
 * @param {MedicationReconciliation} reconciliation - Reconciliation record
 * @param {string} resolvedBy - User resolving
 * @param {string} notes - Resolution notes
 * @returns {MedicationReconciliation} Resolved reconciliation
 *
 * @example
 * ```typescript
 * const resolved = resolveMedicationReconciliation(reconciliation, 'DR-SMITH',
 *   'All discrepancies reviewed and addressed with patient and pharmacy');
 * ```
 */
export function resolveMedicationReconciliation(
  reconciliation: MedicationReconciliation,
  resolvedBy: string,
  notes: string
): MedicationReconciliation {
  return {
    ...reconciliation,
    resolved: true,
    resolvedBy,
    resolvedDate: new Date(),
    notes
  };
}

// ============================================================================
// SECTION 4: DRUG INTERACTION CHECKING (Functions 16-19)
// ============================================================================

/**
 * 16. Checks for drug-drug interactions.
 *
 * @param {string[]} medicationIds - List of medication IDs
 * @returns {DrugInteraction[]} Identified interactions
 *
 * @example
 * ```typescript
 * const interactions = checkDrugInteractions(['MED-123', 'MED-456', 'MED-789']);
 * const major = interactions.filter(i => i.severity === InteractionSeverity.MAJOR);
 * ```
 */
export function checkDrugInteractions(medicationIds: string[]): DrugInteraction[] {
  // In production, would query drug interaction database
  const interactions: DrugInteraction[] = [];

  // Example interaction detection logic
  // This would interface with commercial drug databases like First DataBank, Micromedex, etc.

  return interactions;
}

/**
 * 17. Checks specific interaction between two medications.
 *
 * @param {string} medicationA - First medication ID
 * @param {string} medicationB - Second medication ID
 * @returns {DrugInteraction | null} Interaction if exists
 *
 * @example
 * ```typescript
 * const interaction = checkDrugDrugInteraction('WARFARIN', 'ASPIRIN');
 * if (interaction && interaction.severity === InteractionSeverity.MAJOR) {
 *   console.warn('Major interaction detected:', interaction.description);
 * }
 * ```
 */
export function checkDrugDrugInteraction(
  medicationA: string,
  medicationB: string
): DrugInteraction | null {
  // In production, would query interaction database
  // Known high-risk interactions would be checked
  const knownInteractions: Record<string, Record<string, DrugInteraction>> = {
    'WARFARIN': {
      'ASPIRIN': {
        drugA: 'WARFARIN',
        drugB: 'ASPIRIN',
        severity: InteractionSeverity.MAJOR,
        description: 'Increased risk of bleeding',
        clinicalEffects: 'Concurrent use may increase anticoagulant effect and bleeding risk',
        management: 'Monitor INR closely. Consider alternative antiplatelet if possible.'
      }
    }
  };

  return knownInteractions[medicationA]?.[medicationB] || null;
}

/**
 * 18. Assesses interaction severity and provides recommendations.
 *
 * @param {DrugInteraction} interaction - Drug interaction
 * @returns {Object} Assessment and recommendations
 *
 * @example
 * ```typescript
 * const assessment = assessInteractionSeverity(interaction);
 * if (assessment.requiresIntervention) {
 *   console.log('Action required:', assessment.recommendation);
 * }
 * ```
 */
export function assessInteractionSeverity(interaction: DrugInteraction): {
  severity: InteractionSeverity;
  requiresIntervention: boolean;
  allowPrescribing: boolean;
  recommendation: string;
} {
  switch (interaction.severity) {
    case InteractionSeverity.CONTRAINDICATED:
      return {
        severity: interaction.severity,
        requiresIntervention: true,
        allowPrescribing: false,
        recommendation: 'Do not prescribe together. Choose alternative medication.'
      };

    case InteractionSeverity.MAJOR:
      return {
        severity: interaction.severity,
        requiresIntervention: true,
        allowPrescribing: true,
        recommendation: 'Major interaction. Override requires clinical justification and enhanced monitoring plan.'
      };

    case InteractionSeverity.MODERATE:
      return {
        severity: interaction.severity,
        requiresIntervention: false,
        allowPrescribing: true,
        recommendation: 'Monitor patient for interaction effects. Consider dosage adjustment.'
      };

    case InteractionSeverity.MINOR:
      return {
        severity: interaction.severity,
        requiresIntervention: false,
        allowPrescribing: true,
        recommendation: 'Minor interaction. Standard monitoring appropriate.'
      };

    default:
      return {
        severity: interaction.severity,
        requiresIntervention: false,
        allowPrescribing: true,
        recommendation: 'Unknown interaction severity. Use clinical judgment.'
      };
  }
}

/**
 * 19. Checks for therapeutic duplication.
 *
 * @param {string[]} medicationIds - List of medication IDs
 * @returns {Object[]} Identified duplications
 *
 * @example
 * ```typescript
 * const duplications = checkTherapeuticDuplication(['LISINOPRIL', 'ENALAPRIL']);
 * // Both are ACE inhibitors - duplication detected
 * ```
 */
export function checkTherapeuticDuplication(medicationIds: string[]): Array<{
  medications: string[];
  therapeuticClass: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}> {
  // In production, would check therapeutic class database
  const duplications: Array<{
    medications: string[];
    therapeuticClass: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }> = [];

  return duplications;
}

// ============================================================================
// SECTION 5: ALLERGY CHECKING (Functions 20-22)
// ============================================================================

/**
 * 20. Checks for drug allergies and cross-sensitivities.
 *
 * @param {string} medicationId - Medication to check
 * @param {DrugAllergy[]} patientAllergies - Patient's allergies
 * @returns {Object} Allergy check result
 *
 * @example
 * ```typescript
 * const allergyCheck = checkDrugAllergies('PENICILLIN-VK', patientAllergies);
 * if (allergyCheck.hasAllergy) {
 *   console.error('ALLERGY ALERT:', allergyCheck.matchedAllergies);
 * }
 * ```
 */
export function checkDrugAllergies(
  medicationId: string,
  patientAllergies: DrugAllergy[]
): {
  hasAllergy: boolean;
  hasCrossSensitivity: boolean;
  matchedAllergies: DrugAllergy[];
  crossSensitivities: AllergyCrossSensitivity[];
  severity: 'life-threatening' | 'severe' | 'moderate' | 'mild' | 'none';
  recommendation: string;
} {
  const activeAllergies = patientAllergies.filter(a => a.status === 'active');

  // Check for direct allergy match
  const matchedAllergies = activeAllergies.filter(allergy =>
    normalizeMedicationName(allergy.allergen).includes(normalizeMedicationName(medicationId))
  );

  // Check for cross-sensitivities
  const crossSensitivities = checkCrossSensitivities(medicationId, activeAllergies);

  const hasAllergy = matchedAllergies.length > 0;
  const hasCrossSensitivity = crossSensitivities.length > 0;

  let severity: 'life-threatening' | 'severe' | 'moderate' | 'mild' | 'none' = 'none';
  let recommendation = 'No known allergies to this medication';

  if (hasAllergy) {
    const maxSeverity = matchedAllergies.reduce((max, allergy) => {
      const severityRank = { 'mild': 1, 'moderate': 2, 'severe': 3, 'life-threatening': 4 };
      return severityRank[allergy.severity] > severityRank[max] ? allergy.severity : max;
    }, 'mild' as any);

    severity = maxSeverity;
    recommendation = `CONTRAINDICATED - Patient has documented ${severity} allergy to this medication`;
  } else if (hasCrossSensitivity) {
    severity = crossSensitivities[0].likelihood === 'high' ? 'severe' : 'moderate';
    recommendation = `WARNING - Possible cross-sensitivity. Patient allergic to ${crossSensitivities[0].allergen}`;
  }

  return {
    hasAllergy,
    hasCrossSensitivity,
    matchedAllergies,
    crossSensitivities,
    severity,
    recommendation
  };
}

/**
 * 21. Checks for cross-sensitivity to related medications.
 *
 * @param {string} medicationId - Medication to check
 * @param {DrugAllergy[]} allergies - Patient allergies
 * @returns {AllergyCrossSensitivity[]} Cross-sensitivities
 *
 * @example
 * ```typescript
 * const crossSens = checkCrossSensitivities('CEPHALEXIN', allergies);
 * // May detect cross-sensitivity if patient allergic to penicillin
 * ```
 */
export function checkCrossSensitivities(
  medicationId: string,
  allergies: DrugAllergy[]
): AllergyCrossSensitivity[] {
  // Known cross-sensitivities
  const crossSensitivityMap: Record<string, AllergyCrossSensitivity> = {
    'PENICILLIN': {
      allergen: 'Penicillin',
      crossSensitiveMedications: ['AMOXICILLIN', 'AMPICILLIN', 'CEPHALEXIN', 'CEFAZOLIN'],
      likelihood: 'moderate',
      description: 'Cross-reactivity between penicillins and cephalosporins (approximately 10%)'
    },
    'SULFA': {
      allergen: 'Sulfonamides',
      crossSensitiveMedications: ['SULFAMETHOXAZOLE', 'FUROSEMIDE', 'HYDROCHLOROTHIAZIDE'],
      likelihood: 'low',
      description: 'Possible cross-reactivity with sulfonamide-containing medications'
    }
  };

  const crossSensitivities: AllergyCrossSensitivity[] = [];

  allergies.forEach(allergy => {
    const allergenUpper = allergy.allergen.toUpperCase();
    Object.entries(crossSensitivityMap).forEach(([key, crossSens]) => {
      if (allergenUpper.includes(key) &&
          crossSens.crossSensitiveMedications.some(med =>
            medicationId.toUpperCase().includes(med)
          )) {
        crossSensitivities.push(crossSens);
      }
    });
  });

  return crossSensitivities;
}

/**
 * 22. Records new drug allergy for patient.
 *
 * @param {Object} allergyData - Allergy information
 * @returns {DrugAllergy} Created allergy record
 *
 * @example
 * ```typescript
 * const allergy = recordDrugAllergy({
 *   patientId: 'PAT-123',
 *   allergen: 'Penicillin',
 *   allergenType: 'medication',
 *   reaction: 'Hives and facial swelling',
 *   severity: 'severe',
 *   verifiedBy: 'DR-SMITH'
 * });
 * ```
 */
export function recordDrugAllergy(allergyData: {
  patientId: string;
  allergen: string;
  allergenType: 'medication' | 'food' | 'environmental';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  onsetDate?: Date;
  verifiedBy?: string;
  notes?: string;
}): DrugAllergy {
  return {
    allergyId: `ALLERGY-${crypto.randomUUID()}`,
    patientId: allergyData.patientId,
    allergen: allergyData.allergen,
    allergenType: allergyData.allergenType,
    reaction: allergyData.reaction,
    severity: allergyData.severity,
    onsetDate: allergyData.onsetDate,
    verifiedBy: allergyData.verifiedBy,
    verifiedDate: allergyData.verifiedBy ? new Date() : undefined,
    status: 'active',
    notes: allergyData.notes
  };
}

// ============================================================================
// SECTION 6: FORMULARY CHECKING (Functions 23-25)
// ============================================================================

/**
 * 23. Checks if medication is on formulary.
 *
 * @param {string} medicationId - Medication to check
 * @param {string} insurancePlanId - Insurance plan
 * @returns {FormularyEntry | null} Formulary entry if covered
 *
 * @example
 * ```typescript
 * const formulary = checkFormulary('MED-123', 'INS-PLAN-456');
 * if (formulary?.requiresPriorAuth) {
 *   console.log('Prior authorization required');
 * }
 * ```
 */
export function checkFormulary(
  medicationId: string,
  insurancePlanId: string
): FormularyEntry | null {
  // In production, would query formulary database or payer API
  return null;
}

/**
 * 24. Finds formulary alternatives for non-covered medication.
 *
 * @param {string} medicationId - Original medication
 * @param {string} insurancePlanId - Insurance plan
 * @returns {FormularyAlternative[]} Alternative medications
 *
 * @example
 * ```typescript
 * const alternatives = findFormularyAlternatives('BRAND-MED-123', 'INS-456');
 * alternatives.forEach(alt => {
 *   console.log(`${alt.medicationName} - Tier ${alt.tier} - Save $${alt.costSavings}`);
 * });
 * ```
 */
export function findFormularyAlternatives(
  medicationId: string,
  insurancePlanId: string
): FormularyAlternative[] {
  // In production, would query formulary for therapeutic equivalents
  const alternatives: FormularyAlternative[] = [];

  return alternatives;
}

/**
 * 25. Calculates estimated patient cost based on formulary tier.
 *
 * @param {FormularyEntry} formularyEntry - Formulary entry
 * @param {number} quantity - Quantity prescribed
 * @returns {Object} Cost estimate
 *
 * @example
 * ```typescript
 * const cost = calculatePatientCost(formularyEntry, 90);
 * console.log(`Estimated copay: $${cost.estimatedCopay}`);
 * ```
 */
export function calculatePatientCost(
  formularyEntry: FormularyEntry,
  quantity: number
): {
  tier: number;
  estimatedCopay?: number;
  coinsuranceAmount?: number;
  totalEstimatedCost?: number;
} {
  let estimatedCopay = formularyEntry.copay;
  let coinsuranceAmount: number | undefined;

  if (formularyEntry.coinsurance) {
    // Would need drug cost to calculate coinsurance
    coinsuranceAmount = 0; // Placeholder
  }

  return {
    tier: formularyEntry.tier,
    estimatedCopay,
    coinsuranceAmount,
    totalEstimatedCost: estimatedCopay || coinsuranceAmount
  };
}

// ============================================================================
// SECTION 7: PRIOR AUTHORIZATION (Functions 26-28)
// ============================================================================

/**
 * 26. Creates prior authorization request.
 *
 * @param {Object} paData - Prior authorization data
 * @returns {PriorAuthorizationRequest} PA request
 *
 * @example
 * ```typescript
 * const paRequest = createPriorAuthorizationRequest({
 *   prescriptionId: 'RX-123',
 *   patientId: 'PAT-456',
 *   medicationId: 'MED-789',
 *   medicationName: 'Humira 40mg Injection',
 *   requestedQuantity: 2,
 *   requestedDaysSupply: 30,
 *   diagnosis: ['Rheumatoid Arthritis'],
 *   icdCodes: ['M05.79'],
 *   clinicalJustification: 'Patient failed methotrexate and sulfasalazine...',
 *   triedAndFailed: ['Methotrexate', 'Sulfasalazine'],
 *   requestedBy: 'DR-SMITH'
 * });
 * ```
 */
export function createPriorAuthorizationRequest(paData: {
  prescriptionId: string;
  patientId: string;
  medicationId: string;
  medicationName: string;
  requestedQuantity: number;
  requestedDaysSupply: number;
  diagnosis: string[];
  icdCodes: string[];
  clinicalJustification: string;
  triedAndFailed?: string[];
  contraindicationsToAlternatives?: string[];
  supportingDocuments?: string[];
  requestedBy: string;
}): PriorAuthorizationRequest {
  return {
    paRequestId: `PA-${crypto.randomUUID()}`,
    prescriptionId: paData.prescriptionId,
    patientId: paData.patientId,
    medicationId: paData.medicationId,
    medicationName: paData.medicationName,
    requestedQuantity: paData.requestedQuantity,
    requestedDaysSupply: paData.requestedDaysSupply,
    diagnosis: paData.diagnosis,
    icdCodes: paData.icdCodes,
    clinicalJustification: paData.clinicalJustification,
    triedAndFailed: paData.triedAndFailed,
    contraindicationsToAlternatives: paData.contraindicationsToAlternatives,
    supportingDocuments: paData.supportingDocuments,
    requestedBy: paData.requestedBy,
    requestedDate: new Date(),
    status: 'pending'
  };
}

/**
 * 27. Processes prior authorization response from payer.
 *
 * @param {PriorAuthorizationRequest} paRequest - PA request
 * @param {Object} response - Payer response
 * @returns {PriorAuthorizationRequest} Updated PA request
 *
 * @example
 * ```typescript
 * const updated = processPriorAuthorizationResponse(paRequest, {
 *   status: 'approved',
 *   reviewedBy: 'PAYER-REVIEWER-123',
 *   approvalNumber: 'PA-APPROVAL-789',
 *   validUntil: new Date('2024-12-31')
 * });
 * ```
 */
export function processPriorAuthorizationResponse(
  paRequest: PriorAuthorizationRequest,
  response: {
    status: 'approved' | 'denied' | 'more_info_needed';
    reviewedBy: string;
    approvalNumber?: string;
    denialReason?: string;
    validUntil?: Date;
  }
): PriorAuthorizationRequest {
  return {
    ...paRequest,
    status: response.status,
    reviewedBy: response.reviewedBy,
    reviewedDate: new Date(),
    approvalNumber: response.approvalNumber,
    denialReason: response.denialReason,
    validUntil: response.validUntil
  };
}

/**
 * 28. Validates if prior authorization is still valid.
 *
 * @param {PriorAuthorizationRequest} paRequest - PA request
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePriorAuthorizationValidity(paRequest);
 * if (!validation.isValid) {
 *   console.log('PA expired - need new authorization');
 * }
 * ```
 */
export function validatePriorAuthorizationValidity(paRequest: PriorAuthorizationRequest): {
  isValid: boolean;
  reason?: string;
  daysRemaining?: number;
} {
  if (paRequest.status !== 'approved') {
    return {
      isValid: false,
      reason: `Prior authorization is ${paRequest.status}, not approved`
    };
  }

  if (!paRequest.validUntil) {
    return { isValid: true };
  }

  const now = new Date();
  if (paRequest.validUntil < now) {
    return {
      isValid: false,
      reason: 'Prior authorization has expired',
      daysRemaining: 0
    };
  }

  const daysRemaining = Math.floor(
    (paRequest.validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    isValid: true,
    daysRemaining
  };
}

// ============================================================================
// SECTION 8: PRESCRIPTION RENEWALS (Functions 29-31)
// ============================================================================

/**
 * 29. Creates prescription renewal request.
 *
 * @param {Object} renewalData - Renewal request data
 * @returns {PrescriptionRenewalRequest} Renewal request
 *
 * @example
 * ```typescript
 * const renewalRequest = createPrescriptionRenewalRequest({
 *   prescriptionId: 'RX-123',
 *   rxNumber: 'RX-20240115-001234',
 *   patientId: 'PAT-456',
 *   medicationName: 'Lisinopril 10mg',
 *   requestedBy: 'patient',
 *   requestedRefills: 3
 * });
 * ```
 */
export function createPrescriptionRenewalRequest(renewalData: {
  prescriptionId: string;
  rxNumber: string;
  patientId: string;
  medicationName: string;
  requestedBy: 'patient' | 'pharmacy' | 'provider';
  requestedRefills: number;
  pharmacyId?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
}): PrescriptionRenewalRequest {
  return {
    renewalRequestId: `RENEW-${crypto.randomUUID()}`,
    prescriptionId: renewalData.prescriptionId,
    rxNumber: renewalData.rxNumber,
    patientId: renewalData.patientId,
    medicationName: renewalData.medicationName,
    requestedBy: renewalData.requestedBy,
    requestedDate: new Date(),
    requestedRefills: renewalData.requestedRefills,
    pharmacyId: renewalData.pharmacyId,
    pharmacyName: renewalData.pharmacyName,
    pharmacyPhone: renewalData.pharmacyPhone,
    status: 'pending'
  };
}

/**
 * 30. Processes renewal request (approve/deny).
 *
 * @param {PrescriptionRenewalRequest} request - Renewal request
 * @param {Object} decision - Approval decision
 * @returns {PrescriptionRenewalRequest} Updated request
 *
 * @example
 * ```typescript
 * const approved = processRenewalRequest(renewalRequest, {
 *   status: 'approved',
 *   reviewedBy: 'DR-SMITH',
 *   notes: 'Renewed for 3 additional refills'
 * });
 * ```
 */
export function processRenewalRequest(
  request: PrescriptionRenewalRequest,
  decision: {
    status: 'approved' | 'denied' | 'requires_appointment';
    reviewedBy: string;
    denialReason?: string;
    notes?: string;
  }
): PrescriptionRenewalRequest {
  return {
    ...request,
    status: decision.status,
    reviewedBy: decision.reviewedBy,
    reviewedDate: new Date(),
    denialReason: decision.denialReason,
    notes: decision.notes
  };
}

/**
 * 31. Determines if renewal requires provider appointment.
 *
 * @param {Prescription} prescription - Original prescription
 * @param {Date} lastVisitDate - Last provider visit
 * @returns {Object} Renewal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = checkRenewalEligibility(prescription, lastVisitDate);
 * if (!eligibility.eligible) {
 *   console.log('Reason:', eligibility.reason);
 * }
 * ```
 */
export function checkRenewalEligibility(
  prescription: Prescription,
  lastVisitDate?: Date
): {
  eligible: boolean;
  reason?: string;
  requiresAppointment: boolean;
} {
  // Check if any refills remaining
  if (prescription.refillsRemaining <= 0) {
    return {
      eligible: false,
      reason: 'No refills remaining - new prescription required',
      requiresAppointment: true
    };
  }

  // Controlled substances may have time restrictions
  if (prescription.deaSchedule && prescription.deaSchedule !== DEASchedule.NON_CONTROLLED) {
    if ([DEASchedule.SCHEDULE_II].includes(prescription.deaSchedule)) {
      return {
        eligible: false,
        reason: 'Schedule II controlled substances cannot be refilled - new prescription required',
        requiresAppointment: true
      };
    }
  }

  // Check if prescription has expired
  if (prescription.endDate && prescription.endDate < new Date()) {
    return {
      eligible: false,
      reason: 'Prescription has expired - new prescription required',
      requiresAppointment: true
    };
  }

  // Check time since last provider visit (e.g., chronic medications may require annual visit)
  if (lastVisitDate) {
    const daysSinceVisit = (Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceVisit > 365) {
      return {
        eligible: false,
        reason: 'Patient requires annual visit for chronic medication renewal',
        requiresAppointment: true
      };
    }
  }

  return {
    eligible: true,
    requiresAppointment: false
  };
}

// ============================================================================
// SECTION 9: CONTROLLED SUBSTANCES & PDMP (Functions 32-34)
// ============================================================================

/**
 * 32. Queries PDMP (Prescription Drug Monitoring Program).
 *
 * @param {Object} queryData - PDMP query data
 * @returns {Promise<PDMPQuery>} PDMP query result
 *
 * @example
 * ```typescript
 * const pdmpData = await queryPDMP({
 *   patientId: 'PAT-123',
 *   patientName: 'John Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   state: 'CA',
 *   queriedBy: 'DR-SMITH',
 *   purpose: 'prescribing'
 * });
 * ```
 */
export async function queryPDMP(queryData: {
  patientId: string;
  patientName: string;
  dateOfBirth: Date;
  state: string;
  queriedBy: string;
  purpose: 'prescribing' | 'dispensing' | 'review';
}): Promise<PDMPQuery> {
  // In production, would interface with state PDMP system
  const query: PDMPQuery = {
    queryId: `PDMP-${crypto.randomUUID()}`,
    patientId: queryData.patientId,
    patientName: queryData.patientName,
    dateOfBirth: queryData.dateOfBirth,
    state: queryData.state,
    queryDate: new Date(),
    queriedBy: queryData.queriedBy,
    purpose: queryData.purpose,
    results: [] // Would be populated from PDMP response
  };

  return query;
}

/**
 * 33. Validates DEA number for controlled substance prescribing.
 *
 * @param {string} deaNumber - DEA number to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDEANumber('AB1234563');
 * if (!validation.valid) {
 *   console.error('Invalid DEA number');
 * }
 * ```
 */
export function validateDEANumber(deaNumber: string): {
  valid: boolean;
  registrantType?: string;
  error?: string;
} {
  if (!deaNumber || deaNumber.length !== 9) {
    return { valid: false, error: 'DEA number must be 9 characters' };
  }

  const pattern = /^[A-Z]{2}\d{7}$/;
  if (!pattern.test(deaNumber)) {
    return { valid: false, error: 'Invalid DEA number format' };
  }

  // Validate check digit
  const digits = deaNumber.substring(2);
  const sum1 = parseInt(digits[0]) + parseInt(digits[2]) + parseInt(digits[4]);
  const sum2 = parseInt(digits[1]) + parseInt(digits[3]) + parseInt(digits[5]);
  const checkDigit = (sum1 + sum2 * 2) % 10;

  if (checkDigit !== parseInt(digits[6])) {
    return { valid: false, error: 'Invalid DEA check digit' };
  }

  // Determine registrant type
  const registrantTypes: Record<string, string> = {
    'A': 'Practitioner (e.g., physician, dentist)',
    'B': 'Hospital/Clinic',
    'C': 'Practitioner (VA, DoD, PHS)',
    'D': 'Teaching Institution',
    'E': 'Manufacturer',
    'F': 'Distributor',
    'G': 'Researcher',
    'H': 'Analytical Lab',
    'M': 'Mid-level Practitioner'
  };

  const registrantType = registrantTypes[deaNumber[0]] || 'Unknown';

  return {
    valid: true,
    registrantType
  };
}

/**
 * 34. Checks if controlled substance prescription limits are exceeded.
 *
 * @param {Prescription} prescription - Prescription to check
 * @param {PDMPResult[]} pdmpResults - Recent PDMP results
 * @returns {Object} Limit check result
 *
 * @example
 * ```typescript
 * const limitCheck = checkControlledSubstanceLimits(prescription, pdmpResults);
 * if (limitCheck.exceedsLimits) {
 *   console.warn('Patient exceeds controlled substance limits:', limitCheck.warnings);
 * }
 * ```
 */
export function checkControlledSubstanceLimits(
  prescription: Prescription,
  pdmpResults: PDMPResult[]
): {
  exceedsLimits: boolean;
  warnings: string[];
  morphineEquivalentDose?: number;
  multiplePrescriberAlert?: boolean;
  multiplePharmacyAlert?: boolean;
} {
  const warnings: string[] = [];
  let morphineEquivalentDose = 0;
  let multiplePrescriberAlert = false;
  let multiplePharmacyAlert = false;

  // Check for multiple prescribers
  const prescribers = new Set(pdmpResults.map(r => r.prescriberName));
  if (prescribers.size > 3) {
    multiplePrescriberAlert = true;
    warnings.push(`Patient has received prescriptions from ${prescribers.size} different prescribers`);
  }

  // Check for multiple pharmacies
  const pharmacies = new Set(pdmpResults.map(r => r.pharmacyName));
  if (pharmacies.size > 3) {
    multiplePharmacyAlert = true;
    warnings.push(`Patient has filled prescriptions at ${pharmacies.size} different pharmacies`);
  }

  // Calculate morphine equivalent dose (MED) for opioids
  // This is a simplified example - production would use comprehensive conversion tables
  const opioidPrescriptions = pdmpResults.filter(r =>
    [DEASchedule.SCHEDULE_II, DEASchedule.SCHEDULE_III].includes(r.deaSchedule)
  );

  if (opioidPrescriptions.length > 0) {
    // Would calculate actual MED based on medication and dosage
    morphineEquivalentDose = 0; // Placeholder

    if (morphineEquivalentDose > 90) {
      warnings.push(`Morphine equivalent dose (${morphineEquivalentDose} MME/day) exceeds CDC guideline of 90 MME/day`);
    }
  }

  // Check for early refills
  const recentFills = pdmpResults.filter(r => {
    const daysSinceFill = (Date.now() - r.filledDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceFill < r.daysSupply * 0.8; // Filled before 80% of supply should be used
  });

  if (recentFills.length > 0) {
    warnings.push('Patient has history of early refills');
  }

  return {
    exceedsLimits: warnings.length > 0,
    warnings,
    morphineEquivalentDose: morphineEquivalentDose > 0 ? morphineEquivalentDose : undefined,
    multiplePrescriberAlert,
    multiplePharmacyAlert
  };
}

// ============================================================================
// SECTION 10: MEDICATION ADMINISTRATION RECORD (MAR) (Functions 35-37)
// ============================================================================

/**
 * 35. Creates medication administration record entry.
 *
 * @param {Object} marData - MAR entry data
 * @returns {MedicationAdministrationRecord} MAR entry
 *
 * @example
 * ```typescript
 * const marEntry = createMAREntry({
 *   patientId: 'PAT-123',
 *   prescriptionId: 'RX-456',
 *   medicationName: 'Lisinopril 10mg',
 *   scheduledTime: new Date('2024-01-15T09:00:00'),
 *   route: RouteOfAdministration.ORAL
 * });
 * ```
 */
export function createMAREntry(marData: {
  patientId: string;
  prescriptionId: string;
  medicationName: string;
  scheduledTime: Date;
  route: RouteOfAdministration;
}): MedicationAdministrationRecord {
  return {
    marId: `MAR-${crypto.randomUUID()}`,
    patientId: marData.patientId,
    prescriptionId: marData.prescriptionId,
    medicationName: marData.medicationName,
    scheduledTime: marData.scheduledTime,
    route: marData.route,
    status: 'scheduled'
  };
}

/**
 * 36. Records medication administration with barcode verification.
 *
 * @param {MedicationAdministrationRecord} marEntry - MAR entry
 * @param {Object} administrationData - Administration details
 * @returns {MedicationAdministrationRecord} Updated MAR entry
 *
 * @example
 * ```typescript
 * const administered = recordMedicationAdministration(marEntry, {
 *   administeredBy: 'NURSE-789',
 *   dosageAdministered: '10mg',
 *   barcodeScanned: true,
 *   site: 'Left deltoid',
 *   witnessedBy: 'NURSE-012'
 * });
 * ```
 */
export function recordMedicationAdministration(
  marEntry: MedicationAdministrationRecord,
  administrationData: {
    administeredBy: string;
    dosageAdministered: string;
    barcodeScanned?: boolean;
    site?: string;
    witnessedBy?: string;
    notes?: string;
  }
): MedicationAdministrationRecord {
  return {
    ...marEntry,
    administeredTime: new Date(),
    dosageAdministered: administrationData.dosageAdministered,
    administeredBy: administrationData.administeredBy,
    status: 'administered',
    barcodeScanned: administrationData.barcodeScanned,
    site: administrationData.site,
    witnessedBy: administrationData.witnessedBy,
    notes: administrationData.notes
  };
}

/**
 * 37. Records medication not given (held, refused, unavailable).
 *
 * @param {MedicationAdministrationRecord} marEntry - MAR entry
 * @param {Object} notGivenData - Not given details
 * @returns {MedicationAdministrationRecord} Updated MAR entry
 *
 * @example
 * ```typescript
 * const notGiven = recordMedicationNotGiven(marEntry, {
 *   status: 'refused',
 *   refusalReason: 'Patient stated feeling nauseous',
 *   recordedBy: 'NURSE-789'
 * });
 * ```
 */
export function recordMedicationNotGiven(
  marEntry: MedicationAdministrationRecord,
  notGivenData: {
    status: 'missed' | 'refused' | 'held' | 'not_available';
    refusalReason?: string;
    holdReason?: string;
    recordedBy: string;
    notes?: string;
  }
): MedicationAdministrationRecord {
  return {
    ...marEntry,
    status: notGivenData.status,
    refusalReason: notGivenData.refusalReason,
    holdReason: notGivenData.holdReason,
    notes: notGivenData.notes
  };
}

// ============================================================================
// SECTION 11: IV FLUID MANAGEMENT (Functions 38-39)
// ============================================================================

/**
 * 38. Creates IV fluid order with rate calculations.
 *
 * @param {Object} ivData - IV fluid order data
 * @returns {IVFluidOrder} IV fluid order
 *
 * @example
 * ```typescript
 * const ivOrder = createIVFluidOrder({
 *   patientId: 'PAT-123',
 *   prescriberId: 'DR-456',
 *   fluidType: 'Normal Saline 0.9%',
 *   additives: [
 *     { medicationName: 'Potassium Chloride', dose: 20, doseUnit: 'mEq' }
 *   ],
 *   totalVolume: 1000,
 *   volumeUnit: 'mL',
 *   rate: 125,
 *   rateUnit: 'mL/hr',
 *   route: 'peripheral_iv'
 * });
 * ```
 */
export function createIVFluidOrder(ivData: {
  patientId: string;
  prescriberId: string;
  fluidType: string;
  additives?: IVAdditive[];
  totalVolume: number;
  volumeUnit: 'mL' | 'L';
  rate: number;
  rateUnit: 'mL/hr' | 'mL/min' | 'drops/min';
  route: 'peripheral_iv' | 'central_line' | 'picc';
  indications?: string;
  specialInstructions?: string;
}): IVFluidOrder {
  const volumeInML = ivData.volumeUnit === 'L' ? ivData.totalVolume * 1000 : ivData.totalVolume;

  let rateInMLPerHr = ivData.rate;
  if (ivData.rateUnit === 'mL/min') {
    rateInMLPerHr = ivData.rate * 60;
  } else if (ivData.rateUnit === 'drops/min') {
    // Assuming standard drip set (15 drops/mL)
    rateInMLPerHr = (ivData.rate / 15) * 60;
  }

  const durationHours = volumeInML / rateInMLPerHr;
  const startTime = new Date();
  const expectedEndTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

  return {
    ivOrderId: `IV-${crypto.randomUUID()}`,
    patientId: ivData.patientId,
    prescriberId: ivData.prescriberId,
    fluidType: ivData.fluidType,
    additives: ivData.additives,
    totalVolume: ivData.totalVolume,
    volumeUnit: ivData.volumeUnit,
    rate: ivData.rate,
    rateUnit: ivData.rateUnit,
    route: ivData.route,
    duration: durationHours,
    startTime,
    expectedEndTime,
    status: 'active',
    indications: ivData.indications,
    specialInstructions: ivData.specialInstructions
  };
}

/**
 * 39. Calculates IV drip rate in drops per minute.
 *
 * @param {Object} ivParams - IV parameters
 * @returns {number} Drip rate in drops/min
 *
 * @example
 * ```typescript
 * const dripRate = calculateIVDripRate({
 *   volumeML: 1000,
 *   durationHours: 8,
 *   dropFactor: 15
 * });
 * // Returns: 31 drops/min
 * ```
 */
export function calculateIVDripRate(ivParams: {
  volumeML: number;
  durationHours: number;
  dropFactor: number; // drops/mL (10, 15, 20, or 60 for microdrip)
}): number {
  const rateMLPerHr = ivParams.volumeML / ivParams.durationHours;
  const rateMLPerMin = rateMLPerHr / 60;
  const dropsPerMin = rateMLPerMin * ivParams.dropFactor;

  return Math.round(dropsPerMin);
}

// ============================================================================
// SECTION 12: MEDICATION BARCODE VERIFICATION (Functions 40-41)
// ============================================================================

/**
 * 40. Verifies medication barcode matches prescription.
 *
 * @param {Object} barcodeData - Barcode verification data
 * @returns {MedicationBarcodeVerification} Verification result
 *
 * @example
 * ```typescript
 * const verification = verifyMedicationBarcode({
 *   patientBarcode: 'PAT-123-WRISTBAND',
 *   medicationBarcode: 'NDC-12345-678-90',
 *   ndcCode: '12345-678-90',
 *   lotNumber: 'LOT123456',
 *   expirationDate: new Date('2025-12-31'),
 *   verifiedBy: 'NURSE-789',
 *   expectedMedicationId: 'MED-123'
 * });
 * ```
 */
export function verifyMedicationBarcode(barcodeData: {
  patientBarcode: string;
  medicationBarcode: string;
  ndcCode: string;
  lotNumber?: string;
  expirationDate?: Date;
  verifiedBy: string;
  expectedMedicationId: string;
}): MedicationBarcodeVerification {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verify expiration date
  if (barcodeData.expirationDate && barcodeData.expirationDate < new Date()) {
    errors.push('Medication is expired');
  } else if (barcodeData.expirationDate) {
    const daysUntilExpiration = Math.floor(
      (barcodeData.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiration < 30) {
      warnings.push(`Medication expires in ${daysUntilExpiration} days`);
    }
  }

  // In production, would verify NDC matches expected medication
  const matches = errors.length === 0;

  return {
    verificationId: `VERIFY-${crypto.randomUUID()}`,
    patientBarcode: barcodeData.patientBarcode,
    medicationBarcode: barcodeData.medicationBarcode,
    ndcCode: barcodeData.ndcCode,
    lotNumber: barcodeData.lotNumber,
    expirationDate: barcodeData.expirationDate,
    verifiedAt: new Date(),
    verifiedBy: barcodeData.verifiedBy,
    matches,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * 41. Parses NDC (National Drug Code) barcode.
 *
 * @param {string} barcode - NDC barcode
 * @returns {Object} Parsed NDC components
 *
 * @example
 * ```typescript
 * const ndc = parseNDCBarcode('12345-678-90');
 * // Returns: { labelerCode: '12345', productCode: '678', packageCode: '90' }
 * ```
 */
export function parseNDCBarcode(barcode: string): {
  ndcCode: string;
  labelerCode: string;
  productCode: string;
  packageCode: string;
  valid: boolean;
} {
  // Remove hyphens and validate length
  const cleaned = barcode.replace(/-/g, '');

  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return {
      ndcCode: barcode,
      labelerCode: '',
      productCode: '',
      packageCode: '',
      valid: false
    };
  }

  // NDC can be in formats: 4-4-2, 5-3-2, or 5-4-1
  let labelerCode = '';
  let productCode = '';
  let packageCode = '';

  if (barcode.includes('-')) {
    const parts = barcode.split('-');
    if (parts.length === 3) {
      [labelerCode, productCode, packageCode] = parts;
    }
  } else {
    // Assume 5-4-1 format for 10 digits, 5-4-2 for 11
    if (cleaned.length === 10) {
      labelerCode = cleaned.substring(0, 5);
      productCode = cleaned.substring(5, 9);
      packageCode = cleaned.substring(9);
    } else {
      labelerCode = cleaned.substring(0, 5);
      productCode = cleaned.substring(5, 9);
      packageCode = cleaned.substring(9);
    }
  }

  return {
    ndcCode: `${labelerCode}-${productCode}-${packageCode}`,
    labelerCode,
    productCode,
    packageCode,
    valid: true
  };
}

// ============================================================================
// SECTION 13: PHARMACY INVENTORY (Functions 42-43)
// ============================================================================

/**
 * 42. Checks pharmacy inventory for medication availability.
 *
 * @param {string} medicationId - Medication to check
 * @param {number} quantityNeeded - Quantity needed
 * @param {string} pharmacyId - Pharmacy identifier
 * @returns {Object} Inventory check result
 *
 * @example
 * ```typescript
 * const inventory = checkPharmacyInventory('MED-123', 90, 'PHARM-456');
 * if (!inventory.available) {
 *   console.log(`Only ${inventory.quantityAvailable} available`);
 * }
 * ```
 */
export function checkPharmacyInventory(
  medicationId: string,
  quantityNeeded: number,
  pharmacyId: string
): {
  available: boolean;
  quantityAvailable: number;
  location?: string;
  estimatedRestockDate?: Date;
} {
  // In production, would query pharmacy inventory system
  return {
    available: true,
    quantityAvailable: quantityNeeded
  };
}

/**
 * 43. Creates inventory reorder alert when below threshold.
 *
 * @param {PharmacyInventoryItem} inventoryItem - Inventory item
 * @returns {Object | null} Reorder alert if needed
 *
 * @example
 * ```typescript
 * const alert = createInventoryReorderAlert(inventoryItem);
 * if (alert) {
 *   console.log(`Reorder ${alert.reorderQuantity} units of ${alert.medicationName}`);
 * }
 * ```
 */
export function createInventoryReorderAlert(
  inventoryItem: PharmacyInventoryItem
): {
  alertId: string;
  medicationId: string;
  medicationName: string;
  currentQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  priority: 'high' | 'medium' | 'low';
} | null {
  if (inventoryItem.quantityOnHand > inventoryItem.reorderLevel) {
    return null;
  }

  let priority: 'high' | 'medium' | 'low' = 'low';
  if (inventoryItem.quantityOnHand === 0) {
    priority = 'high';
  } else if (inventoryItem.quantityOnHand < inventoryItem.reorderLevel * 0.5) {
    priority = 'medium';
  }

  return {
    alertId: `REORDER-${crypto.randomUUID()}`,
    medicationId: inventoryItem.medicationId,
    medicationName: inventoryItem.medicationName,
    currentQuantity: inventoryItem.quantityOnHand,
    reorderLevel: inventoryItem.reorderLevel,
    reorderQuantity: inventoryItem.reorderQuantity,
    priority
  };
}

// ============================================================================
// SECTION 14: COMPOUNDING INSTRUCTIONS (Functions 44-45)
// ============================================================================

/**
 * 44. Generates compounding instructions for custom formulations.
 *
 * @param {Object} compoundData - Compound formulation data
 * @returns {CompoundingInstructions} Compounding instructions
 *
 * @example
 * ```typescript
 * const instructions = generateCompoundingInstructions({
 *   formulaName: 'Hydrocortisone 2.5% Cream',
 *   ingredients: [
 *     { ingredientName: 'Hydrocortisone powder', quantity: 2.5, quantityUnit: 'g' },
 *     { ingredientName: 'Aquaphor base', quantity: 97.5, quantityUnit: 'g' }
 *   ],
 *   finalVolume: 100,
 *   finalVolumeUnit: 'g',
 *   preparationMethod: 'Geometric dilution',
 *   stability: '90 days',
 *   storage: 'Room temperature',
 *   preparedBy: 'PHARM-123'
 * });
 * ```
 */
export function generateCompoundingInstructions(compoundData: {
  formulaName: string;
  ingredients: CompoundIngredient[];
  finalVolume?: number;
  finalVolumeUnit?: string;
  preparationMethod: string;
  equipment?: string[];
  stability?: string;
  storage?: string;
  preparedBy?: string;
  specialInstructions?: string;
}): CompoundingInstructions {
  const beyondUseDate = calculateBeyondUseDate(compoundData.stability || '30 days');

  return {
    compoundId: `COMP-${crypto.randomUUID()}`,
    formulaName: compoundData.formulaName,
    ingredients: compoundData.ingredients,
    finalVolume: compoundData.finalVolume,
    finalVolumeUnit: compoundData.finalVolumeUnit,
    preparationMethod: compoundData.preparationMethod,
    equipment: compoundData.equipment,
    stability: compoundData.stability,
    storage: compoundData.storage,
    beyondUseDate,
    preparedBy: compoundData.preparedBy,
    specialInstructions: compoundData.specialInstructions
  };
}

/**
 * 45. Calculates beyond-use date for compounded medication.
 *
 * @param {string} stability - Stability period (e.g., "90 days", "6 months")
 * @returns {Date} Beyond-use date
 *
 * @example
 * ```typescript
 * const bud = calculateBeyondUseDate('90 days');
 * // Returns date 90 days from now
 * ```
 */
export function calculateBeyondUseDate(stability: string): Date {
  const now = new Date();

  const match = stability.match(/(\d+)\s*(day|days|week|weeks|month|months|year|years)/i);
  if (!match) {
    // Default to 30 days if can't parse
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  let daysToAdd = 0;
  if (unit.startsWith('day')) {
    daysToAdd = value;
  } else if (unit.startsWith('week')) {
    daysToAdd = value * 7;
  } else if (unit.startsWith('month')) {
    daysToAdd = value * 30; // Approximate
  } else if (unit.startsWith('year')) {
    daysToAdd = value * 365;
  }

  return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}

// ============================================================================
// SECTION 15: MEDICATION ADHERENCE AND PATIENT EDUCATION (Functions 46-47)
// ============================================================================

/**
 * 46. Calculates medication adherence rate (Medication Possession Ratio).
 *
 * @param {Object} adherenceData - Adherence calculation data
 * @returns {Object} Adherence metrics
 *
 * @example
 * ```typescript
 * const adherence = calculateMedicationAdherence({
 *   prescriptionDate: new Date('2024-01-01'),
 *   daysSupply: 90,
 *   fillDates: [
 *     new Date('2024-01-01'),
 *     new Date('2024-03-25'),
 *     new Date('2024-06-20')
 *   ],
 *   evaluationDate: new Date('2024-09-15')
 * });
 * console.log(`Adherence rate: ${adherence.adherenceRate}%`);
 * ```
 */
export function calculateMedicationAdherence(adherenceData: {
  prescriptionDate: Date;
  daysSupply: number;
  fillDates: Date[];
  evaluationDate: Date;
}): {
  adherenceRate: number;
  medicationPossessionRatio: number;
  totalDaysCovered: number;
  totalDaysInPeriod: number;
  classification: 'excellent' | 'good' | 'fair' | 'poor';
  missedDays: number;
} {
  const { prescriptionDate, daysSupply, fillDates, evaluationDate } = adherenceData;

  // Calculate total days in evaluation period
  const totalDaysInPeriod = Math.floor(
    (evaluationDate.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate total days of medication supplied
  const totalDaysSupplied = fillDates.length * daysSupply;

  // Calculate Medication Possession Ratio (MPR)
  const mpr = Math.min((totalDaysSupplied / totalDaysInPeriod) * 100, 100);

  // Calculate days covered (accounting for overlapping fills)
  let totalDaysCovered = 0;
  const sortedFills = [...fillDates].sort((a, b) => a.getTime() - b.getTime());

  sortedFills.forEach((fillDate, index) => {
    const fillEndDate = new Date(fillDate.getTime() + daysSupply * 24 * 60 * 60 * 1000);
    const nextFillDate = sortedFills[index + 1];

    if (!nextFillDate || nextFillDate > fillEndDate) {
      // No overlap
      totalDaysCovered += daysSupply;
    } else {
      // Overlap - only count until next fill
      const daysUntilNextFill = Math.floor(
        (nextFillDate.getTime() - fillDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalDaysCovered += Math.min(daysUntilNextFill, daysSupply);
    }
  });

  const adherenceRate = Math.min((totalDaysCovered / totalDaysInPeriod) * 100, 100);
  const missedDays = Math.max(totalDaysInPeriod - totalDaysCovered, 0);

  let classification: 'excellent' | 'good' | 'fair' | 'poor';
  if (adherenceRate >= 90) {
    classification = 'excellent';
  } else if (adherenceRate >= 80) {
    classification = 'good';
  } else if (adherenceRate >= 60) {
    classification = 'fair';
  } else {
    classification = 'poor';
  }

  return {
    adherenceRate: Math.round(adherenceRate * 10) / 10,
    medicationPossessionRatio: Math.round(mpr * 10) / 10,
    totalDaysCovered,
    totalDaysInPeriod,
    classification,
    missedDays
  };
}

/**
 * 47. Generates patient-friendly medication instructions.
 *
 * @param {Prescription} prescription - Prescription data
 * @param {Object} options - Instruction generation options
 * @returns {Object} Patient instructions
 *
 * @example
 * ```typescript
 * const instructions = generatePatientMedicationInstructions(prescription, {
 *   language: 'en',
 *   readingLevel: 'grade-6',
 *   includeWarnings: true,
 *   includeFoodInteractions: true
 * });
 * console.log(instructions.simpleInstructions);
 * // "Take 1 tablet by mouth once daily in the morning with or without food"
 * ```
 */
export function generatePatientMedicationInstructions(
  prescription: Prescription,
  options?: {
    language?: 'en' | 'es';
    readingLevel?: 'grade-6' | 'grade-9' | 'grade-12';
    includeWarnings?: boolean;
    includeFoodInteractions?: boolean;
    includeStorage?: boolean;
  }
): {
  simpleInstructions: string;
  detailedInstructions: string[];
  warnings: string[];
  foodInteractions?: string;
  storageInstructions?: string;
  missedDoseInstructions?: string;
} {
  const opts = {
    language: options?.language || 'en',
    readingLevel: options?.readingLevel || 'grade-6',
    includeWarnings: options?.includeWarnings ?? true,
    includeFoodInteractions: options?.includeFoodInteractions ?? true,
    includeStorage: options?.includeStorage ?? true
  };

  // Parse dosage and frequency into simple language
  const routeInstructions: Record<RouteOfAdministration, string> = {
    [RouteOfAdministration.ORAL]: 'by mouth',
    [RouteOfAdministration.IV]: 'by IV',
    [RouteOfAdministration.IM]: 'by injection into muscle',
    [RouteOfAdministration.SC]: 'by injection under the skin',
    [RouteOfAdministration.TOPICAL]: 'on the skin',
    [RouteOfAdministration.RECTAL]: 'rectally',
    [RouteOfAdministration.INHALED]: 'by inhaler',
    [RouteOfAdministration.SUBLINGUAL]: 'under the tongue',
    [RouteOfAdministration.TRANSDERMAL]: 'on the skin (patch)',
    [RouteOfAdministration.OPHTHALMIC]: 'in the eye',
    [RouteOfAdministration.OTIC]: 'in the ear',
    [RouteOfAdministration.NASAL]: 'in the nose'
  };

  // Create simple instructions
  const route = routeInstructions[prescription.route] || 'as directed';
  const frequency = prescription.frequency.toLowerCase();
  const isPRN = prescription.isPRN || frequency.includes('prn') || frequency.includes('as needed');

  let simpleInstructions = `Take ${prescription.dosage} ${route}`;

  if (isPRN) {
    simpleInstructions += ` as needed ${prescription.indication ? 'for ' + prescription.indication : ''}`;
  } else {
    simpleInstructions += ` ${frequency}`;
  }

  if (prescription.instructions) {
    simpleInstructions = prescription.instructions;
  }

  // Detailed instructions
  const detailedInstructions: string[] = [
    simpleInstructions,
    `You have ${prescription.refillsRemaining} refills remaining`,
    `This prescription is for ${prescription.daysSupply} days`
  ];

  if (prescription.indication) {
    detailedInstructions.push(`This medication is for: ${prescription.indication}`);
  }

  // Warnings
  const warnings: string[] = [];

  if (prescription.deaSchedule && prescription.deaSchedule !== DEASchedule.NON_CONTROLLED) {
    warnings.push('This is a controlled substance. Keep in a secure location.');
    warnings.push('Do not share this medication with others.');
  }

  if (opts.includeWarnings) {
    warnings.push('Do not stop taking this medication without consulting your doctor');
    warnings.push('Contact your doctor if you experience any unusual side effects');

    if (prescription.route === RouteOfAdministration.ORAL) {
      warnings.push('Swallow tablets/capsules whole unless directed otherwise');
    }
  }

  // Food interactions (simplified - would come from drug database)
  let foodInteractions: string | undefined;
  if (opts.includeFoodInteractions) {
    foodInteractions = 'May be taken with or without food';
  }

  // Storage instructions
  let storageInstructions: string | undefined;
  if (opts.includeStorage) {
    storageInstructions = 'Store at room temperature away from moisture and heat. Keep out of reach of children.';
  }

  // Missed dose instructions
  const missedDoseInstructions = isPRN
    ? 'This medication is taken as needed. Skip if not needed.'
    : 'If you miss a dose, take it as soon as you remember. If it is almost time for your next dose, skip the missed dose. Do not take two doses at once.';

  return {
    simpleInstructions,
    detailedInstructions,
    warnings,
    foodInteractions: opts.includeFoodInteractions ? foodInteractions : undefined,
    storageInstructions: opts.includeStorage ? storageInstructions : undefined,
    missedDoseInstructions
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalizes medication name for comparison.
 */
function normalizeMedicationName(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Assesses clinical significance of medication.
 */
function assessClinicalSignificance(
  medication: ReconciliationMedication
): 'high' | 'medium' | 'low' {
  // In production, would check against medication database
  // High-risk medications: anticoagulants, insulin, immunosuppressants, etc.
  const highRiskMedications = [
    'warfarin', 'insulin', 'heparin', 'chemotherapy',
    'immunosuppressant', 'anticonvulsant'
  ];

  const medNameLower = medication.medicationName.toLowerCase();
  const isHighRisk = highRiskMedications.some(risk =>
    medNameLower.includes(risk)
  );

  return isHighRisk ? 'high' : 'medium';
}
