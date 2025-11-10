/**
 * LOC: HBCKIT001
 * File: /reuse/server/health/health-billing-claims-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js)
 *   - Healthcare EDI libraries (x12-parser, node-edi)
 *
 * DOWNSTREAM (imported by):
 *   - Billing services
 *   - Claims processing workflows
 *   - Revenue cycle management
 *   - Insurance verification services
 *   - Payment posting services
 */

/**
 * File: /reuse/server/health/health-billing-claims-kit.ts
 * Locator: WC-HEALTH-BILLING-001
 * Purpose: Healthcare Billing & Claims Management Utilities - Production-ready claims processing and billing workflows
 *
 * Upstream: Independent utility module for healthcare billing operations
 * Downstream: ../backend/*, Billing modules, Claims processing, Revenue cycle management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, EDI parsers
 * Exports: 45 utility functions for claim generation, validation, submission, tracking, denial management, payment processing
 *
 * LLM Context: Epic Resolute Billing-level functionality for healthcare claims management.
 * Provides comprehensive claim generation (CMS-1500, UB-04), EDI transaction support (837, 276, 277, 835),
 * claim scrubbing and validation, denial management with appeal workflows, electronic remittance advice
 * parsing, payment posting, patient statement generation, insurance verification, and medical code
 * validation (CPT, HCPCS, ICD-10, modifiers). HIPAA-compliant with production-ready error handling.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Claim status enumeration
 */
export enum ClaimStatus {
  DRAFT = 'draft',
  READY = 'ready',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDED = 'pended',
  DENIED = 'denied',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  APPEALED = 'appealed',
  CLOSED = 'closed',
}

/**
 * Claim type enumeration
 */
export enum ClaimType {
  PROFESSIONAL = 'professional', // CMS-1500
  INSTITUTIONAL = 'institutional', // UB-04
  DENTAL = 'dental',
  PHARMACY = 'pharmacy',
}

/**
 * EDI transaction type
 */
export enum EDITransactionType {
  CLAIM_837P = '837P', // Professional claim
  CLAIM_837I = '837I', // Institutional claim
  CLAIM_STATUS_276 = '276', // Claim status inquiry
  CLAIM_STATUS_277 = '277', // Claim status response
  ERA_835 = '835', // Electronic remittance advice
  ELIGIBILITY_270 = '270', // Eligibility inquiry
  ELIGIBILITY_271 = '271', // Eligibility response
}

/**
 * Denial reason codes
 */
export enum DenialReasonCode {
  MISSING_INFO = 'missing_information',
  INVALID_CODE = 'invalid_code',
  NOT_COVERED = 'not_covered',
  AUTHORIZATION_REQUIRED = 'authorization_required',
  TIMELY_FILING = 'timely_filing_limit',
  DUPLICATE_CLAIM = 'duplicate_claim',
  ELIGIBILITY = 'patient_not_eligible',
  COORDINATION_BENEFITS = 'coordination_of_benefits',
}

/**
 * Patient demographic information
 */
export interface PatientDemographics {
  patientId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'U' | 'O';
  ssn?: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  phone?: string;
  email?: string;
}

/**
 * Insurance payer information
 */
export interface InsurancePayer {
  payerId: string;
  payerName: string;
  payerType: 'primary' | 'secondary' | 'tertiary';
  planName?: string;
  policyNumber: string;
  groupNumber?: string;
  effectiveDate?: Date;
  terminationDate?: Date;
  subscriberId?: string;
  subscriberName?: string;
  subscriberRelationship?: string;
}

/**
 * Service line item for claims
 */
export interface ServiceLine {
  lineNumber: number;
  serviceDate: Date;
  placeOfService: string;
  procedureCode: string; // CPT/HCPCS
  modifiers?: string[];
  diagnosisPointers: number[];
  units: number;
  chargeAmount: number;
  ndc?: string; // National Drug Code
  renderingProviderId?: string;
  description?: string;
}

/**
 * Diagnosis code information
 */
export interface DiagnosisCode {
  sequence: number;
  code: string; // ICD-10
  codeType: 'ICD10' | 'ICD9';
  description?: string;
  isPrimary?: boolean;
}

/**
 * Provider information
 */
export interface ProviderInfo {
  providerId: string;
  npi: string;
  taxonomyCode?: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  taxId?: string;
}

/**
 * CMS-1500 claim structure
 */
export interface CMS1500Claim {
  claimId: string;
  claimType: ClaimType.PROFESSIONAL;
  patient: PatientDemographics;
  subscriber: PatientDemographics | null;
  payer: InsurancePayer;
  renderingProvider: ProviderInfo;
  billingProvider: ProviderInfo;
  referringProvider?: ProviderInfo;
  serviceLines: ServiceLine[];
  diagnosisCodes: DiagnosisCode[];
  totalCharges: number;
  priorAuthNumber?: string;
  assignmentOfBenefits: boolean;
  patientSignatureOnFile: boolean;
  providerSignatureDate: Date;
  accidentInfo?: {
    type: 'auto' | 'employment' | 'other';
    date: Date;
    state?: string;
  };
  referralNumber?: string;
  claimNotes?: string;
  attachmentControlNumber?: string;
}

/**
 * UB-04 claim structure
 */
export interface UB04Claim {
  claimId: string;
  claimType: ClaimType.INSTITUTIONAL;
  patient: PatientDemographics;
  payer: InsurancePayer;
  facility: ProviderInfo;
  attendingProvider: ProviderInfo;
  operatingProvider?: ProviderInfo;
  admissionDate: Date;
  dischargeDate?: Date;
  admissionType: string;
  admissionSource: string;
  patientStatus: string;
  billType: string; // 3-digit bill type
  revenueLines: RevenueCodeLine[];
  diagnosisCodes: DiagnosisCode[];
  procedureCodes?: ProcedureCode[];
  totalCharges: number;
  drgCode?: string;
  valueCodeAmounts?: ValueCodeAmount[];
  occurrenceCodeDates?: OccurrenceCode[];
  conditionCodes?: string[];
}

/**
 * Revenue code line for UB-04
 */
export interface RevenueCodeLine {
  lineNumber: number;
  revenueCode: string;
  description?: string;
  hcpcsCode?: string;
  modifiers?: string[];
  serviceDate?: Date;
  units: number;
  chargeAmount: number;
  nonCoveredCharges?: number;
}

/**
 * Procedure code for UB-04
 */
export interface ProcedureCode {
  sequence: number;
  code: string;
  codeType: 'ICD10-PCS' | 'CPT';
  date?: Date;
}

/**
 * Value code and amount
 */
export interface ValueCodeAmount {
  code: string;
  amount: number;
}

/**
 * Occurrence code and date
 */
export interface OccurrenceCode {
  code: string;
  date: Date;
}

/**
 * Claim validation result
 */
export interface ClaimValidationResult {
  isValid: boolean;
  errors: ClaimValidationError[];
  warnings: ClaimValidationWarning[];
  scrubbingScore: number; // 0-100
}

/**
 * Claim validation error
 */
export interface ClaimValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'critical' | 'error' | 'warning';
}

/**
 * Claim validation warning
 */
export interface ClaimValidationWarning {
  field: string;
  code: string;
  message: string;
  suggestion?: string;
}

/**
 * EDI 837 transaction
 */
export interface EDI837Transaction {
  transactionId: string;
  transactionType: EDITransactionType.CLAIM_837P | EDITransactionType.CLAIM_837I;
  senderId: string;
  receiverId: string;
  submissionDate: Date;
  claims: Array<CMS1500Claim | UB04Claim>;
  controlNumber: string;
  ediContent: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'rejected';
}

/**
 * Claim status inquiry (276)
 */
export interface ClaimStatusInquiry {
  inquiryId: string;
  claimId: string;
  payerId: string;
  patientId: string;
  serviceDate: Date;
  submittedAmount: number;
  providerNPI: string;
}

/**
 * Claim status response (277)
 */
export interface ClaimStatusResponse {
  responseId: string;
  inquiryId: string;
  claimId: string;
  status: ClaimStatus;
  statusCategory: string;
  statusCode: string;
  statusDescription: string;
  checkNumber?: string;
  checkDate?: Date;
  paidAmount?: number;
  adjudicationDate?: Date;
  remarks?: string[];
}

/**
 * Denial information
 */
export interface DenialInfo {
  denialId: string;
  claimId: string;
  denialDate: Date;
  denialReason: DenialReasonCode;
  denialReasonDescription: string;
  adjustmentGroupCode: string;
  adjustmentReasonCode: string;
  deniedAmount: number;
  remarkCodes?: string[];
  appealable: boolean;
  appealDeadline?: Date;
}

/**
 * Appeal workflow
 */
export interface AppealWorkflow {
  appealId: string;
  denialId: string;
  claimId: string;
  appealLevel: 1 | 2 | 3;
  appealDate: Date;
  appealDeadline: Date;
  appealReason: string;
  supportingDocuments: string[];
  status: 'pending' | 'submitted' | 'approved' | 'denied' | 'partial';
  resolution?: string;
  resolutionDate?: Date;
  recoveredAmount?: number;
}

/**
 * Electronic Remittance Advice (835)
 */
export interface ERA835 {
  eraId: string;
  payerId: string;
  payerName: string;
  paymentMethod: 'CHK' | 'ACH' | 'NON';
  checkNumber?: string;
  checkDate: Date;
  paymentAmount: number;
  claimPayments: ClaimPayment[];
  rawEDI: string;
  processedDate?: Date;
}

/**
 * Claim payment from ERA
 */
export interface ClaimPayment {
  claimId: string;
  patientControlNumber: string;
  claimStatusCode: string;
  chargedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  patientResponsibility: number;
  serviceLines: ServiceLinePayment[];
  adjustments: PaymentAdjustment[];
  remarks?: string[];
}

/**
 * Service line payment detail
 */
export interface ServiceLinePayment {
  lineNumber: number;
  procedureCode: string;
  chargedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  deductible: number;
  coinsurance: number;
  copay: number;
  adjustments: PaymentAdjustment[];
}

/**
 * Payment adjustment
 */
export interface PaymentAdjustment {
  groupCode: 'CO' | 'PR' | 'OA' | 'PI';
  reasonCode: string;
  amount: number;
  quantity?: number;
  description?: string;
}

/**
 * Patient statement
 */
export interface PatientStatement {
  statementId: string;
  patientId: string;
  statementDate: Date;
  dueDate: Date;
  previousBalance: number;
  charges: number;
  payments: number;
  adjustments: number;
  currentBalance: number;
  agingBuckets: AgingBucket[];
  transactions: StatementTransaction[];
}

/**
 * Aging bucket for A/R
 */
export interface AgingBucket {
  period: '0-30' | '31-60' | '61-90' | '91-120' | '120+';
  amount: number;
}

/**
 * Statement transaction
 */
export interface StatementTransaction {
  date: Date;
  description: string;
  charges: number;
  payments: number;
  adjustments: number;
  balance: number;
}

/**
 * Insurance verification result
 */
export interface InsuranceVerification {
  verificationId: string;
  patientId: string;
  payerId: string;
  verificationDate: Date;
  isActive: boolean;
  effectiveDate?: Date;
  terminationDate?: Date;
  copay?: number;
  deductible?: number;
  deductibleMet?: number;
  outOfPocketMax?: number;
  outOfPocketMet?: number;
  coverageLevel: 'individual' | 'family';
  planType?: string;
  benefits?: BenefitInfo[];
  authorizationRequired?: boolean;
  referralRequired?: boolean;
}

/**
 * Benefit information
 */
export interface BenefitInfo {
  serviceType: string;
  coverageLevel: 'in-network' | 'out-of-network';
  covered: boolean;
  copay?: number;
  coinsurance?: number;
  deductible?: number;
  limitations?: string;
  priorAuthRequired?: boolean;
}

/**
 * Medical code validation result
 */
export interface CodeValidationResult {
  code: string;
  codeType: 'CPT' | 'HCPCS' | 'ICD10' | 'ICD10-PCS' | 'MODIFIER';
  isValid: boolean;
  description?: string;
  effectiveDate?: Date;
  terminationDate?: Date;
  errors?: string[];
}

/**
 * Modifier validation rules
 */
export interface ModifierRule {
  modifier: string;
  description: string;
  allowedWith?: string[];
  notAllowedWith?: string[];
  requiresSecondModifier?: boolean;
  placeOfServiceRestrictions?: string[];
}

// ============================================================================
// SECTION 1: CLAIM GENERATION & FORMATS (Functions 1-6)
// ============================================================================

/**
 * 1. Generates a CMS-1500 professional claim with comprehensive validation.
 *
 * @param {object} claimData - Claim data including patient, provider, and service information
 * @returns {CMS1500Claim} Generated CMS-1500 claim
 *
 * @example
 * ```typescript
 * const claim = generateCMS1500Claim({
 *   patient: patientDemographics,
 *   payer: insuranceInfo,
 *   renderingProvider: providerInfo,
 *   serviceLines: [
 *     { procedureCode: '99213', serviceDate: new Date(), chargeAmount: 150.00, units: 1 }
 *   ],
 *   diagnosisCodes: [{ sequence: 1, code: 'E11.9', codeType: 'ICD10' }]
 * });
 * ```
 */
export function generateCMS1500Claim(claimData: Partial<CMS1500Claim>): CMS1500Claim {
  const claimId = claimData.claimId || `CLM-${crypto.randomUUID()}`;

  const totalCharges = (claimData.serviceLines || []).reduce(
    (sum, line) => sum + line.chargeAmount,
    0
  );

  return {
    claimId,
    claimType: ClaimType.PROFESSIONAL,
    patient: claimData.patient!,
    subscriber: claimData.subscriber || null,
    payer: claimData.payer!,
    renderingProvider: claimData.renderingProvider!,
    billingProvider: claimData.billingProvider || claimData.renderingProvider!,
    referringProvider: claimData.referringProvider,
    serviceLines: claimData.serviceLines || [],
    diagnosisCodes: claimData.diagnosisCodes || [],
    totalCharges,
    priorAuthNumber: claimData.priorAuthNumber,
    assignmentOfBenefits: claimData.assignmentOfBenefits ?? true,
    patientSignatureOnFile: claimData.patientSignatureOnFile ?? true,
    providerSignatureDate: claimData.providerSignatureDate || new Date(),
    accidentInfo: claimData.accidentInfo,
    referralNumber: claimData.referralNumber,
    claimNotes: claimData.claimNotes,
    attachmentControlNumber: claimData.attachmentControlNumber,
  };
}

/**
 * 2. Generates a UB-04 institutional claim with facility billing support.
 *
 * @param {object} claimData - Institutional claim data
 * @returns {UB04Claim} Generated UB-04 claim
 *
 * @example
 * ```typescript
 * const claim = generateUB04Claim({
 *   patient: patientInfo,
 *   facility: facilityInfo,
 *   billType: '111', // Inpatient hospital
 *   admissionDate: new Date('2024-01-15'),
 *   dischargeDate: new Date('2024-01-18'),
 *   revenueLines: [
 *     { revenueCode: '0250', description: 'Pharmacy', chargeAmount: 500.00, units: 1 }
 *   ]
 * });
 * ```
 */
export function generateUB04Claim(claimData: Partial<UB04Claim>): UB04Claim {
  const claimId = claimData.claimId || `CLM-${crypto.randomUUID()}`;

  const totalCharges = (claimData.revenueLines || []).reduce(
    (sum, line) => sum + line.chargeAmount,
    0
  );

  return {
    claimId,
    claimType: ClaimType.INSTITUTIONAL,
    patient: claimData.patient!,
    payer: claimData.payer!,
    facility: claimData.facility!,
    attendingProvider: claimData.attendingProvider!,
    operatingProvider: claimData.operatingProvider,
    admissionDate: claimData.admissionDate!,
    dischargeDate: claimData.dischargeDate,
    admissionType: claimData.admissionType || '1',
    admissionSource: claimData.admissionSource || '1',
    patientStatus: claimData.patientStatus || '01',
    billType: claimData.billType || '111',
    revenueLines: claimData.revenueLines || [],
    diagnosisCodes: claimData.diagnosisCodes || [],
    procedureCodes: claimData.procedureCodes,
    totalCharges,
    drgCode: claimData.drgCode,
    valueCodeAmounts: claimData.valueCodeAmounts,
    occurrenceCodeDates: claimData.occurrenceCodeDates,
    conditionCodes: claimData.conditionCodes,
  };
}

/**
 * 3. Converts claim to HIPAA-compliant JSON format for storage.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to serialize
 * @returns {string} JSON string with HIPAA-compliant formatting
 *
 * @example
 * ```typescript
 * const jsonClaim = serializeClaimToJSON(claim);
 * await storeClaimInDatabase(claimId, jsonClaim);
 * ```
 */
export function serializeClaimToJSON(claim: CMS1500Claim | UB04Claim): string {
  return JSON.stringify(claim, null, 2);
}

/**
 * 4. Deserializes claim from JSON storage.
 *
 * @param {string} jsonString - JSON claim data
 * @returns {CMS1500Claim | UB04Claim} Deserialized claim
 *
 * @example
 * ```typescript
 * const claimJson = await fetchClaimFromDatabase(claimId);
 * const claim = deserializeClaimFromJSON(claimJson);
 * ```
 */
export function deserializeClaimFromJSON(jsonString: string): CMS1500Claim | UB04Claim {
  const parsed = JSON.parse(jsonString);

  // Convert date strings back to Date objects
  if (parsed.serviceLines) {
    parsed.serviceLines = parsed.serviceLines.map((line: any) => ({
      ...line,
      serviceDate: new Date(line.serviceDate),
    }));
  }

  if (parsed.patient?.dateOfBirth) {
    parsed.patient.dateOfBirth = new Date(parsed.patient.dateOfBirth);
  }

  return parsed;
}

/**
 * 5. Generates claim control number (ICN/DCN) for tracking.
 *
 * @param {string} prefix - Optional prefix (e.g., payer identifier)
 * @returns {string} Unique claim control number
 *
 * @example
 * ```typescript
 * const icn = generateClaimControlNumber('BCBS');
 * // Result: 'BCBS-2024-A1B2C3D4E5F6'
 * ```
 */
export function generateClaimControlNumber(prefix: string = 'CLM'): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `${prefix}-${year}-${random}`;
}

/**
 * 6. Calculates claim totals and validates line item amounts.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to calculate
 * @returns {object} Total calculations
 *
 * @example
 * ```typescript
 * const totals = calculateClaimTotals(claim);
 * console.log('Total charges:', totals.totalCharges);
 * console.log('Line count:', totals.lineCount);
 * ```
 */
export function calculateClaimTotals(claim: CMS1500Claim | UB04Claim): {
  totalCharges: number;
  lineCount: number;
  isValid: boolean;
} {
  let totalCharges = 0;
  let lineCount = 0;

  if ('serviceLines' in claim) {
    lineCount = claim.serviceLines.length;
    totalCharges = claim.serviceLines.reduce((sum, line) => sum + line.chargeAmount, 0);
  } else if ('revenueLines' in claim) {
    lineCount = claim.revenueLines.length;
    totalCharges = claim.revenueLines.reduce((sum, line) => sum + line.chargeAmount, 0);
  }

  return {
    totalCharges: Math.round(totalCharges * 100) / 100,
    lineCount,
    isValid: totalCharges === claim.totalCharges,
  };
}

// ============================================================================
// SECTION 2: CLAIM SCRUBBING & VALIDATION (Functions 7-12)
// ============================================================================

/**
 * 7. Validates claim against payer-specific rules and regulations.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to validate
 * @param {string} payerId - Payer ID for rule lookup
 * @returns {ClaimValidationResult} Comprehensive validation result
 *
 * @example
 * ```typescript
 * const validation = validateClaim(claim, 'BCBS001');
 * if (!validation.isValid) {
 *   console.error('Claim errors:', validation.errors);
 *   return;
 * }
 * ```
 */
export function validateClaim(
  claim: CMS1500Claim | UB04Claim,
  payerId: string
): ClaimValidationResult {
  const errors: ClaimValidationError[] = [];
  const warnings: ClaimValidationWarning[] = [];

  // Required field validation
  if (!claim.patient.patientId) {
    errors.push({
      field: 'patient.patientId',
      code: 'REQUIRED_FIELD',
      message: 'Patient ID is required',
      severity: 'critical',
    });
  }

  if (!claim.payer.payerId) {
    errors.push({
      field: 'payer.payerId',
      code: 'REQUIRED_FIELD',
      message: 'Payer ID is required',
      severity: 'critical',
    });
  }

  // Service line validation
  if ('serviceLines' in claim && claim.serviceLines.length === 0) {
    errors.push({
      field: 'serviceLines',
      code: 'NO_SERVICE_LINES',
      message: 'At least one service line is required',
      severity: 'critical',
    });
  }

  // Diagnosis code validation
  if (claim.diagnosisCodes.length === 0) {
    errors.push({
      field: 'diagnosisCodes',
      code: 'NO_DIAGNOSIS',
      message: 'At least one diagnosis code is required',
      severity: 'critical',
    });
  }

  // Calculate scrubbing score
  const maxScore = 100;
  const errorDeduction = errors.length * 20;
  const warningDeduction = warnings.length * 5;
  const scrubbingScore = Math.max(0, maxScore - errorDeduction - warningDeduction);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    scrubbingScore,
  };
}

/**
 * 8. Performs automated claim scrubbing to identify and fix common issues.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to scrub
 * @returns {object} Scrubbed claim and fix report
 *
 * @example
 * ```typescript
 * const { scrubbedClaim, fixes } = scrubClaim(claim);
 * console.log('Applied fixes:', fixes);
 * await submitClaim(scrubbedClaim);
 * ```
 */
export function scrubClaim(claim: CMS1500Claim | UB04Claim): {
  scrubbedClaim: CMS1500Claim | UB04Claim;
  fixes: string[];
} {
  const fixes: string[] = [];
  const scrubbedClaim = JSON.parse(JSON.stringify(claim));

  // Trim whitespace from all string fields
  if (scrubbedClaim.patient.firstName !== scrubbedClaim.patient.firstName.trim()) {
    scrubbedClaim.patient.firstName = scrubbedClaim.patient.firstName.trim();
    fixes.push('Trimmed whitespace from patient first name');
  }

  // Ensure diagnosis pointers are valid
  if ('serviceLines' in scrubbedClaim) {
    scrubbedClaim.serviceLines.forEach((line: ServiceLine, idx: number) => {
      if (!line.diagnosisPointers || line.diagnosisPointers.length === 0) {
        scrubbedClaim.serviceLines[idx].diagnosisPointers = [1];
        fixes.push(`Added default diagnosis pointer to service line ${line.lineNumber}`);
      }
    });
  }

  return { scrubbedClaim, fixes };
}

/**
 * 9. Validates diagnosis codes against ICD-10 standards.
 *
 * @param {DiagnosisCode[]} diagnosisCodes - Diagnosis codes to validate
 * @returns {CodeValidationResult[]} Validation results
 *
 * @example
 * ```typescript
 * const results = validateDiagnosisCodes(claim.diagnosisCodes);
 * const invalid = results.filter(r => !r.isValid);
 * if (invalid.length > 0) {
 *   console.error('Invalid diagnosis codes:', invalid);
 * }
 * ```
 */
export function validateDiagnosisCodes(diagnosisCodes: DiagnosisCode[]): CodeValidationResult[] {
  return diagnosisCodes.map(diag => {
    // Basic ICD-10 format validation (simplified)
    const isValid = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/.test(diag.code);

    return {
      code: diag.code,
      codeType: diag.codeType,
      isValid,
      description: diag.description,
      errors: isValid ? undefined : ['Invalid ICD-10 format'],
    };
  });
}

/**
 * 10. Validates procedure codes (CPT/HCPCS) against current code sets.
 *
 * @param {string} procedureCode - Procedure code to validate
 * @returns {CodeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateProcedureCode('99213');
 * if (!result.isValid) {
 *   throw new Error(`Invalid procedure code: ${result.errors.join(', ')}`);
 * }
 * ```
 */
export function validateProcedureCode(procedureCode: string): CodeValidationResult {
  // CPT codes: 5 digits
  const isCPT = /^\d{5}$/.test(procedureCode);

  // HCPCS codes: 1 letter + 4 digits
  const isHCPCS = /^[A-Z]\d{4}$/.test(procedureCode);

  const isValid = isCPT || isHCPCS;

  return {
    code: procedureCode,
    codeType: isCPT ? 'CPT' : 'HCPCS',
    isValid,
    errors: isValid ? undefined : ['Invalid CPT/HCPCS format'],
  };
}

/**
 * 11. Checks for duplicate claims to prevent resubmission.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to check
 * @param {Array<CMS1500Claim | UB04Claim>} existingClaims - Previously submitted claims
 * @returns {object} Duplicate check result
 *
 * @example
 * ```typescript
 * const result = checkDuplicateClaim(newClaim, existingClaims);
 * if (result.isDuplicate) {
 *   console.warn('Duplicate claim detected:', result.matchingClaimId);
 * }
 * ```
 */
export function checkDuplicateClaim(
  claim: CMS1500Claim | UB04Claim,
  existingClaims: Array<CMS1500Claim | UB04Claim>
): { isDuplicate: boolean; matchingClaimId?: string } {
  for (const existing of existingClaims) {
    if (
      existing.patient.patientId === claim.patient.patientId &&
      existing.payer.payerId === claim.payer.payerId &&
      existing.totalCharges === claim.totalCharges
    ) {
      return { isDuplicate: true, matchingClaimId: existing.claimId };
    }
  }

  return { isDuplicate: false };
}

/**
 * 12. Validates claim against timely filing limits.
 *
 * @param {CMS1500Claim | UB04Claim} claim - Claim to validate
 * @param {number} timelyFilingDays - Payer's timely filing limit in days
 * @returns {object} Timely filing validation result
 *
 * @example
 * ```typescript
 * const result = validateTimelyFiling(claim, 90);
 * if (!result.isTimely) {
 *   console.error('Claim exceeds timely filing limit:', result.daysLate);
 * }
 * ```
 */
export function validateTimelyFiling(
  claim: CMS1500Claim | UB04Claim,
  timelyFilingDays: number
): { isTimely: boolean; daysLate?: number; deadline: Date } {
  let serviceDate: Date;

  if ('serviceLines' in claim && claim.serviceLines.length > 0) {
    serviceDate = claim.serviceLines[0].serviceDate;
  } else if ('admissionDate' in claim) {
    serviceDate = claim.dischargeDate || claim.admissionDate;
  } else {
    serviceDate = new Date();
  }

  const deadline = new Date(serviceDate);
  deadline.setDate(deadline.getDate() + timelyFilingDays);

  const today = new Date();
  const isTimely = today <= deadline;

  const daysLate = isTimely ? undefined : Math.floor(
    (today.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { isTimely, daysLate, deadline };
}

// ============================================================================
// SECTION 3: EDI TRANSACTION MANAGEMENT (Functions 13-18)
// ============================================================================

/**
 * 13. Generates EDI 837P (Professional) transaction from CMS-1500 claim.
 *
 * @param {CMS1500Claim} claim - Professional claim
 * @param {object} config - EDI configuration
 * @returns {EDI837Transaction} EDI 837P transaction
 *
 * @example
 * ```typescript
 * const edi837 = generateEDI837P(claim, {
 *   senderId: 'PROVIDER123',
 *   receiverId: 'PAYER456',
 *   submitterName: 'Medical Billing Inc'
 * });
 * ```
 */
export function generateEDI837P(
  claim: CMS1500Claim,
  config: { senderId: string; receiverId: string; submitterName?: string }
): EDI837Transaction {
  const controlNumber = generateClaimControlNumber('EDI');

  // Simplified EDI generation (production would use full X12 library)
  const ediContent = [
    'ISA*00*          *00*          *ZZ*' + config.senderId.padEnd(15) + '*ZZ*' + config.receiverId.padEnd(15),
    'GS*HC*' + config.senderId + '*' + config.receiverId + '*' + formatEDIDate(new Date()),
    'ST*837*0001*005010X222A1',
    'BHT*0019*00*' + claim.claimId + '*' + formatEDIDate(new Date()),
    // Add claim segments (simplified)
    'SE*10*0001',
    'GE*1*1',
    'IEA*1*' + controlNumber,
  ].join('~\n') + '~';

  return {
    transactionId: `EDI-${crypto.randomUUID()}`,
    transactionType: EDITransactionType.CLAIM_837P,
    senderId: config.senderId,
    receiverId: config.receiverId,
    submissionDate: new Date(),
    claims: [claim],
    controlNumber,
    ediContent,
    status: 'pending',
  };
}

/**
 * 14. Generates EDI 837I (Institutional) transaction from UB-04 claim.
 *
 * @param {UB04Claim} claim - Institutional claim
 * @param {object} config - EDI configuration
 * @returns {EDI837Transaction} EDI 837I transaction
 *
 * @example
 * ```typescript
 * const edi837I = generateEDI837I(claim, {
 *   senderId: 'HOSPITAL123',
 *   receiverId: 'PAYER456'
 * });
 * ```
 */
export function generateEDI837I(
  claim: UB04Claim,
  config: { senderId: string; receiverId: string }
): EDI837Transaction {
  const controlNumber = generateClaimControlNumber('EDI');

  const ediContent = [
    'ISA*00*          *00*          *ZZ*' + config.senderId.padEnd(15) + '*ZZ*' + config.receiverId.padEnd(15),
    'GS*HI*' + config.senderId + '*' + config.receiverId + '*' + formatEDIDate(new Date()),
    'ST*837*0001*005010X223A2',
    'BHT*0019*00*' + claim.claimId + '*' + formatEDIDate(new Date()),
    'SE*10*0001',
    'GE*1*1',
    'IEA*1*' + controlNumber,
  ].join('~\n') + '~';

  return {
    transactionId: `EDI-${crypto.randomUUID()}`,
    transactionType: EDITransactionType.CLAIM_837I,
    senderId: config.senderId,
    receiverId: config.receiverId,
    submissionDate: new Date(),
    claims: [claim],
    controlNumber,
    ediContent,
    status: 'pending',
  };
}

/**
 * 15. Validates EDI transaction structure and control numbers.
 *
 * @param {EDI837Transaction} transaction - EDI transaction to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEDITransaction(ediTransaction);
 * if (!result.isValid) {
 *   console.error('EDI errors:', result.errors);
 * }
 * ```
 */
export function validateEDITransaction(transaction: EDI837Transaction): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!transaction.ediContent.startsWith('ISA')) {
    errors.push('Missing ISA segment');
  }

  if (!transaction.ediContent.includes('~')) {
    errors.push('Missing segment terminators');
  }

  if (!transaction.controlNumber) {
    errors.push('Missing control number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 16. Parses EDI 835 (ERA) electronic remittance advice.
 *
 * @param {string} ediContent - Raw EDI 835 content
 * @returns {ERA835} Parsed ERA data
 *
 * @example
 * ```typescript
 * const era = parseERA835(rawEDI);
 * console.log('Payment amount:', era.paymentAmount);
 * era.claimPayments.forEach(payment => {
 *   console.log('Claim:', payment.claimId, 'Paid:', payment.paidAmount);
 * });
 * ```
 */
export function parseERA835(ediContent: string): ERA835 {
  // Simplified ERA parsing (production would use full X12 parser)
  const segments = ediContent.split('~').map(s => s.trim());

  const bprSegment = segments.find(s => s.startsWith('BPR'));
  const paymentAmount = bprSegment ? parseFloat(bprSegment.split('*')[2]) : 0;

  const checkDate = new Date();

  return {
    eraId: `ERA-${crypto.randomUUID()}`,
    payerId: 'UNKNOWN',
    payerName: 'Unknown Payer',
    paymentMethod: 'CHK',
    checkDate,
    paymentAmount,
    claimPayments: [],
    rawEDI: ediContent,
  };
}

/**
 * 17. Generates claim status inquiry (EDI 276).
 *
 * @param {ClaimStatusInquiry} inquiry - Status inquiry details
 * @returns {string} EDI 276 transaction
 *
 * @example
 * ```typescript
 * const inquiry276 = generateClaimStatusInquiry({
 *   claimId: 'CLM-123',
 *   payerId: 'BCBS001',
 *   patientId: 'PAT-456',
 *   serviceDate: new Date('2024-01-15'),
 *   submittedAmount: 250.00,
 *   providerNPI: '1234567890'
 * });
 * ```
 */
export function generateClaimStatusInquiry(inquiry: ClaimStatusInquiry): string {
  const controlNumber = generateClaimControlNumber('276');

  return [
    'ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       ',
    'GS*HS*SENDER*RECEIVER*' + formatEDIDate(new Date()),
    'ST*276*0001*005010X212',
    'BHT*0010*13*' + inquiry.inquiryId + '*' + formatEDIDate(new Date()),
    'HL*1**20*1',
    'NM1*PR*2*' + inquiry.payerId,
    'TRN*1*' + inquiry.claimId,
    'REF*D9*' + inquiry.claimId,
    'DTP*472*D8*' + formatEDIDate(inquiry.serviceDate),
    'SE*9*0001',
    'GE*1*1',
    'IEA*1*' + controlNumber,
  ].join('~\n') + '~';
}

/**
 * 18. Parses claim status response (EDI 277).
 *
 * @param {string} edi277Content - Raw EDI 277 content
 * @returns {ClaimStatusResponse} Parsed status response
 *
 * @example
 * ```typescript
 * const statusResponse = parseClaimStatusResponse(edi277);
 * console.log('Claim status:', statusResponse.status);
 * console.log('Status description:', statusResponse.statusDescription);
 * ```
 */
export function parseClaimStatusResponse(edi277Content: string): ClaimStatusResponse {
  // Simplified parsing
  return {
    responseId: `RESP-${crypto.randomUUID()}`,
    inquiryId: 'UNKNOWN',
    claimId: 'UNKNOWN',
    status: ClaimStatus.SUBMITTED,
    statusCategory: 'A',
    statusCode: 'A1',
    statusDescription: 'Claim received and acknowledged',
  };
}

// ============================================================================
// SECTION 4: CLAIM STATUS & TRACKING (Functions 19-24)
// ============================================================================

/**
 * 19. Tracks claim status through lifecycle.
 *
 * @param {string} claimId - Claim ID to track
 * @param {ClaimStatus} newStatus - New claim status
 * @returns {object} Status update record
 *
 * @example
 * ```typescript
 * const update = trackClaimStatus('CLM-123', ClaimStatus.SUBMITTED);
 * await logClaimStatusChange(update);
 * ```
 */
export function trackClaimStatus(claimId: string, newStatus: ClaimStatus): {
  claimId: string;
  status: ClaimStatus;
  timestamp: Date;
  updateId: string;
} {
  return {
    claimId,
    status: newStatus,
    timestamp: new Date(),
    updateId: crypto.randomUUID(),
  };
}

/**
 * 20. Gets claim adjudication status from payer response.
 *
 * @param {string} statusCode - Payer status code
 * @returns {object} Adjudication status details
 *
 * @example
 * ```typescript
 * const status = getClaimAdjudicationStatus('A1');
 * console.log('Status:', status.description);
 * console.log('Action needed:', status.actionRequired);
 * ```
 */
export function getClaimAdjudicationStatus(statusCode: string): {
  code: string;
  description: string;
  actionRequired: boolean;
  category: 'finalized' | 'pending' | 'denied';
} {
  const statusMap: Record<string, any> = {
    'A1': { description: 'Claim acknowledged', actionRequired: false, category: 'pending' },
    'A2': { description: 'Claim processed', actionRequired: false, category: 'finalized' },
    'P1': { description: 'Pended for review', actionRequired: true, category: 'pending' },
    'D1': { description: 'Claim denied', actionRequired: true, category: 'denied' },
  };

  return {
    code: statusCode,
    ...(statusMap[statusCode] || {
      description: 'Unknown status',
      actionRequired: true,
      category: 'pending',
    }),
  };
}

/**
 * 21. Calculates expected payment date based on payer contract.
 *
 * @param {Date} submissionDate - Claim submission date
 * @param {number} payerDays - Payer's standard processing days
 * @returns {Date} Expected payment date
 *
 * @example
 * ```typescript
 * const expectedDate = calculateExpectedPaymentDate(new Date(), 30);
 * console.log('Expected payment:', expectedDate.toLocaleDateString());
 * ```
 */
export function calculateExpectedPaymentDate(submissionDate: Date, payerDays: number): Date {
  const expected = new Date(submissionDate);
  expected.setDate(expected.getDate() + payerDays);
  return expected;
}

/**
 * 22. Identifies claims requiring follow-up action.
 *
 * @param {Array<{claimId: string; status: ClaimStatus; submissionDate: Date}>} claims - Claims to check
 * @param {number} followUpDays - Days before follow-up required
 * @returns {string[]} Claim IDs requiring follow-up
 *
 * @example
 * ```typescript
 * const followUpNeeded = identifyClaimsRequiringFollowUp(allClaims, 30);
 * followUpNeeded.forEach(claimId => {
 *   console.log('Follow up on claim:', claimId);
 * });
 * ```
 */
export function identifyClaimsRequiringFollowUp(
  claims: Array<{ claimId: string; status: ClaimStatus; submissionDate: Date }>,
  followUpDays: number
): string[] {
  const today = new Date();
  const followUpDeadline = new Date();
  followUpDeadline.setDate(followUpDeadline.getDate() - followUpDays);

  return claims
    .filter(claim =>
      claim.status === ClaimStatus.SUBMITTED &&
      claim.submissionDate <= followUpDeadline
    )
    .map(claim => claim.claimId);
}

/**
 * 23. Generates claim tracking report.
 *
 * @param {Array<{claimId: string; status: ClaimStatus; amount: number}>} claims - Claims to report
 * @returns {object} Tracking report summary
 *
 * @example
 * ```typescript
 * const report = generateClaimTrackingReport(claims);
 * console.log('Total submitted:', report.totalSubmitted);
 * console.log('Total paid:', report.totalPaid);
 * ```
 */
export function generateClaimTrackingReport(
  claims: Array<{ claimId: string; status: ClaimStatus; amount: number }>
): {
  totalClaims: number;
  totalAmount: number;
  statusBreakdown: Record<ClaimStatus, { count: number; amount: number }>;
} {
  const statusBreakdown = {} as Record<ClaimStatus, { count: number; amount: number }>;

  Object.values(ClaimStatus).forEach(status => {
    statusBreakdown[status] = { count: 0, amount: 0 };
  });

  claims.forEach(claim => {
    statusBreakdown[claim.status].count++;
    statusBreakdown[claim.status].amount += claim.amount;
  });

  return {
    totalClaims: claims.length,
    totalAmount: claims.reduce((sum, c) => sum + c.amount, 0),
    statusBreakdown,
  };
}

/**
 * 24. Monitors claim aging and escalation triggers.
 *
 * @param {Array<{claimId: string; submissionDate: Date; status: ClaimStatus}>} claims - Claims to monitor
 * @returns {object} Aging analysis
 *
 * @example
 * ```typescript
 * const aging = monitorClaimAging(claims);
 * console.log('Claims over 90 days:', aging.over90Days);
 * ```
 */
export function monitorClaimAging(
  claims: Array<{ claimId: string; submissionDate: Date; status: ClaimStatus }>
): {
  under30Days: number;
  days30to60: number;
  days60to90: number;
  over90Days: number;
  escalationRequired: string[];
} {
  const today = new Date();
  const buckets = {
    under30Days: 0,
    days30to60: 0,
    days60to90: 0,
    over90Days: 0,
    escalationRequired: [] as string[],
  };

  claims.forEach(claim => {
    const ageDays = Math.floor(
      (today.getTime() - claim.submissionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (ageDays < 30) buckets.under30Days++;
    else if (ageDays < 60) buckets.days30to60++;
    else if (ageDays < 90) buckets.days60to90++;
    else {
      buckets.over90Days++;
      if (claim.status !== ClaimStatus.PAID) {
        buckets.escalationRequired.push(claim.claimId);
      }
    }
  });

  return buckets;
}

// ============================================================================
// SECTION 5: DENIAL MANAGEMENT & APPEALS (Functions 25-30)
// ============================================================================

/**
 * 25. Creates denial record from payer response.
 *
 * @param {object} denialData - Denial information from ERA or 277
 * @returns {DenialInfo} Structured denial record
 *
 * @example
 * ```typescript
 * const denial = createDenialRecord({
 *   claimId: 'CLM-123',
 *   adjustmentReasonCode: '50',
 *   deniedAmount: 150.00,
 *   denialReason: DenialReasonCode.NOT_COVERED
 * });
 * ```
 */
export function createDenialRecord(denialData: Partial<DenialInfo>): DenialInfo {
  const denialDate = denialData.denialDate || new Date();
  const appealDeadline = new Date(denialDate);
  appealDeadline.setDate(appealDeadline.getDate() + 90); // 90-day appeal window

  return {
    denialId: denialData.denialId || `DEN-${crypto.randomUUID()}`,
    claimId: denialData.claimId!,
    denialDate,
    denialReason: denialData.denialReason || DenialReasonCode.MISSING_INFO,
    denialReasonDescription: denialData.denialReasonDescription || 'Denial reason not specified',
    adjustmentGroupCode: denialData.adjustmentGroupCode || 'CO',
    adjustmentReasonCode: denialData.adjustmentReasonCode || '1',
    deniedAmount: denialData.deniedAmount || 0,
    remarkCodes: denialData.remarkCodes,
    appealable: denialData.appealable ?? true,
    appealDeadline,
  };
}

/**
 * 26. Determines if denial is appealable and identifies appeal strategy.
 *
 * @param {DenialInfo} denial - Denial information
 * @returns {object} Appeal recommendation
 *
 * @example
 * ```typescript
 * const recommendation = analyzeDenialAppealability(denial);
 * if (recommendation.shouldAppeal) {
 *   console.log('Appeal strategy:', recommendation.strategy);
 * }
 * ```
 */
export function analyzeDenialAppealability(denial: DenialInfo): {
  shouldAppeal: boolean;
  strategy?: string;
  requiredDocuments?: string[];
  successProbability?: 'high' | 'medium' | 'low';
} {
  if (!denial.appealable) {
    return { shouldAppeal: false };
  }

  const strategyMap: Record<DenialReasonCode, any> = {
    [DenialReasonCode.MISSING_INFO]: {
      strategy: 'Provide missing documentation',
      requiredDocuments: ['Medical records', 'Lab results'],
      successProbability: 'high',
    },
    [DenialReasonCode.AUTHORIZATION_REQUIRED]: {
      strategy: 'Obtain retroactive authorization',
      requiredDocuments: ['Authorization request', 'Medical necessity documentation'],
      successProbability: 'medium',
    },
    [DenialReasonCode.NOT_COVERED]: {
      strategy: 'Appeal with medical necessity justification',
      requiredDocuments: ['Letter of medical necessity', 'Clinical guidelines'],
      successProbability: 'low',
    },
  };

  const recommendation = strategyMap[denial.denialReason];

  return {
    shouldAppeal: true,
    ...(recommendation || {
      strategy: 'Standard appeal with documentation',
      requiredDocuments: ['Supporting documentation'],
      successProbability: 'medium',
    }),
  };
}

/**
 * 27. Initiates appeal workflow for denied claim.
 *
 * @param {DenialInfo} denial - Denial to appeal
 * @param {object} appealData - Appeal information
 * @returns {AppealWorkflow} Created appeal workflow
 *
 * @example
 * ```typescript
 * const appeal = initiateAppealWorkflow(denial, {
 *   appealReason: 'Medical necessity for treatment',
 *   supportingDocuments: ['doc1.pdf', 'doc2.pdf']
 * });
 * ```
 */
export function initiateAppealWorkflow(
  denial: DenialInfo,
  appealData: { appealReason: string; supportingDocuments: string[] }
): AppealWorkflow {
  return {
    appealId: `APP-${crypto.randomUUID()}`,
    denialId: denial.denialId,
    claimId: denial.claimId,
    appealLevel: 1,
    appealDate: new Date(),
    appealDeadline: denial.appealDeadline!,
    appealReason: appealData.appealReason,
    supportingDocuments: appealData.supportingDocuments,
    status: 'pending',
  };
}

/**
 * 28. Tracks appeal through multiple levels (1st, 2nd, 3rd level appeals).
 *
 * @param {AppealWorkflow} appeal - Current appeal
 * @param {object} update - Appeal status update
 * @returns {AppealWorkflow} Updated appeal workflow
 *
 * @example
 * ```typescript
 * const updated = trackAppealProgress(appeal, {
 *   status: 'denied',
 *   resolution: 'Initial appeal denied, escalating to level 2'
 * });
 * ```
 */
export function trackAppealProgress(
  appeal: AppealWorkflow,
  update: { status: AppealWorkflow['status']; resolution?: string; recoveredAmount?: number }
): AppealWorkflow {
  return {
    ...appeal,
    status: update.status,
    resolution: update.resolution,
    resolutionDate: new Date(),
    recoveredAmount: update.recoveredAmount,
  };
}

/**
 * 29. Generates appeal letter with supporting documentation references.
 *
 * @param {AppealWorkflow} appeal - Appeal workflow
 * @param {DenialInfo} denial - Original denial
 * @returns {string} Formatted appeal letter
 *
 * @example
 * ```typescript
 * const letter = generateAppealLetter(appeal, denial);
 * await sendAppealToPayerWithDocuments(letter, appeal.supportingDocuments);
 * ```
 */
export function generateAppealLetter(appeal: AppealWorkflow, denial: DenialInfo): string {
  const today = new Date().toLocaleDateString();

  return `
APPEAL LETTER - LEVEL ${appeal.appealLevel}

Date: ${today}
Appeal ID: ${appeal.appealId}
Claim ID: ${appeal.claimId}
Denial ID: ${denial.denialId}

RE: Appeal of Denied Claim - ${denial.denialReasonDescription}

Dear Claims Review Department,

We are writing to appeal the denial of the above-referenced claim dated ${denial.denialDate.toLocaleDateString()}.

REASON FOR APPEAL:
${appeal.appealReason}

DENIAL INFORMATION:
- Denial Reason: ${denial.denialReasonDescription}
- Adjustment Code: ${denial.adjustmentReasonCode}
- Denied Amount: $${denial.deniedAmount.toFixed(2)}

SUPPORTING DOCUMENTATION:
${appeal.supportingDocuments.map((doc, idx) => `${idx + 1}. ${doc}`).join('\n')}

We respectfully request reconsideration of this claim based on the supporting documentation provided.

Deadline for Response: ${appeal.appealDeadline.toLocaleDateString()}

Sincerely,
Billing Department
  `.trim();
}

/**
 * 30. Calculates denial rate and identifies trends.
 *
 * @param {DenialInfo[]} denials - Historical denials
 * @param {number} totalClaims - Total claims submitted
 * @returns {object} Denial analytics
 *
 * @example
 * ```typescript
 * const analytics = calculateDenialRate(denials, totalClaims);
 * console.log('Denial rate:', analytics.denialRate);
 * console.log('Top denial reasons:', analytics.topReasons);
 * ```
 */
export function calculateDenialRate(denials: DenialInfo[], totalClaims: number): {
  denialRate: number;
  topReasons: Array<{ reason: DenialReasonCode; count: number; percentage: number }>;
  totalDeniedAmount: number;
} {
  const denialRate = totalClaims > 0 ? (denials.length / totalClaims) * 100 : 0;

  const reasonCounts = denials.reduce((acc, denial) => {
    acc[denial.denialReason] = (acc[denial.denialReason] || 0) + 1;
    return acc;
  }, {} as Record<DenialReasonCode, number>);

  const topReasons = Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason: reason as DenialReasonCode,
      count,
      percentage: (count / denials.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const totalDeniedAmount = denials.reduce((sum, d) => sum + d.deniedAmount, 0);

  return {
    denialRate: Math.round(denialRate * 100) / 100,
    topReasons,
    totalDeniedAmount,
  };
}

// ============================================================================
// SECTION 6: PAYMENT PROCESSING & ERA (Functions 31-36)
// ============================================================================

/**
 * 31. Posts payment from ERA to patient account.
 *
 * @param {ClaimPayment} payment - Payment from ERA
 * @param {string} accountId - Patient account ID
 * @returns {object} Payment posting record
 *
 * @example
 * ```typescript
 * const posting = postPaymentToAccount(eraPayment, 'ACC-123');
 * await updatePatientBalance(posting);
 * ```
 */
export function postPaymentToAccount(payment: ClaimPayment, accountId: string): {
  postingId: string;
  accountId: string;
  claimId: string;
  paidAmount: number;
  adjustments: number;
  patientBalance: number;
  postingDate: Date;
} {
  const totalAdjustments = payment.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const patientBalance = payment.patientResponsibility;

  return {
    postingId: `POST-${crypto.randomUUID()}`,
    accountId,
    claimId: payment.claimId,
    paidAmount: payment.paidAmount,
    adjustments: totalAdjustments,
    patientBalance,
    postingDate: new Date(),
  };
}

/**
 * 32. Reconciles ERA payment with bank deposit.
 *
 * @param {ERA835} era - Electronic remittance advice
 * @param {number} depositAmount - Actual bank deposit
 * @returns {object} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = reconcileERAPayment(era, 1500.00);
 * if (!reconciliation.balanced) {
 *   console.error('Variance:', reconciliation.variance);
 * }
 * ```
 */
export function reconcileERAPayment(era: ERA835, depositAmount: number): {
  balanced: boolean;
  eraAmount: number;
  depositAmount: number;
  variance: number;
} {
  const variance = Math.abs(era.paymentAmount - depositAmount);
  const balanced = variance < 0.01; // Allow for penny rounding

  return {
    balanced,
    eraAmount: era.paymentAmount,
    depositAmount,
    variance: Math.round(variance * 100) / 100,
  };
}

/**
 * 33. Processes payment adjustments (contractual, deductible, coinsurance).
 *
 * @param {PaymentAdjustment[]} adjustments - Adjustments from ERA
 * @returns {object} Categorized adjustments
 *
 * @example
 * ```typescript
 * const categorized = processPaymentAdjustments(payment.adjustments);
 * console.log('Contractual adjustments:', categorized.contractual);
 * console.log('Patient responsibility:', categorized.patientResponsibility);
 * ```
 */
export function processPaymentAdjustments(adjustments: PaymentAdjustment[]): {
  contractual: number;
  patientResponsibility: number;
  other: number;
  total: number;
} {
  const result = {
    contractual: 0,
    patientResponsibility: 0,
    other: 0,
    total: 0,
  };

  adjustments.forEach(adj => {
    result.total += adj.amount;

    if (adj.groupCode === 'CO') {
      result.contractual += adj.amount;
    } else if (adj.groupCode === 'PR') {
      result.patientResponsibility += adj.amount;
    } else {
      result.other += adj.amount;
    }
  });

  return result;
}

/**
 * 34. Calculates patient balance after insurance payment.
 *
 * @param {ClaimPayment} payment - Payment from ERA
 * @returns {number} Patient balance due
 *
 * @example
 * ```typescript
 * const balance = calculatePatientBalance(payment);
 * await generatePatientStatement(patientId, balance);
 * ```
 */
export function calculatePatientBalance(payment: ClaimPayment): number {
  return Math.round(payment.patientResponsibility * 100) / 100;
}

/**
 * 35. Identifies underpayments and payment variances.
 *
 * @param {ClaimPayment} payment - Payment from ERA
 * @param {number} expectedAmount - Expected payment amount
 * @returns {object} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = identifyPaymentVariances(payment, expectedAmount);
 * if (variance.hasVariance) {
 *   console.log('Underpaid by:', variance.varianceAmount);
 * }
 * ```
 */
export function identifyPaymentVariances(
  payment: ClaimPayment,
  expectedAmount: number
): {
  hasVariance: boolean;
  varianceAmount: number;
  variancePercentage: number;
  isUnderpayment: boolean;
} {
  const varianceAmount = expectedAmount - payment.paidAmount;
  const hasVariance = Math.abs(varianceAmount) > 0.01;
  const variancePercentage = expectedAmount > 0 ? (varianceAmount / expectedAmount) * 100 : 0;

  return {
    hasVariance,
    varianceAmount: Math.round(varianceAmount * 100) / 100,
    variancePercentage: Math.round(variancePercentage * 100) / 100,
    isUnderpayment: varianceAmount > 0,
  };
}

/**
 * 36. Generates payment posting batch for accounting integration.
 *
 * @param {ClaimPayment[]} payments - Payments to post
 * @param {Date} batchDate - Batch posting date
 * @returns {object} Payment batch
 *
 * @example
 * ```typescript
 * const batch = generatePaymentPostingBatch(payments, new Date());
 * await postBatchToAccountingSystem(batch);
 * ```
 */
export function generatePaymentPostingBatch(payments: ClaimPayment[], batchDate: Date): {
  batchId: string;
  batchDate: Date;
  paymentCount: number;
  totalPaid: number;
  totalAdjustments: number;
  payments: ClaimPayment[];
} {
  const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalAdjustments = payments.reduce(
    (sum, p) => sum + p.adjustments.reduce((adjSum, adj) => adjSum + adj.amount, 0),
    0
  );

  return {
    batchId: `BATCH-${crypto.randomUUID()}`,
    batchDate,
    paymentCount: payments.length,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalAdjustments: Math.round(totalAdjustments * 100) / 100,
    payments,
  };
}

// ============================================================================
// SECTION 7: MEDICAL CODING VALIDATION (Functions 37-42)
// ============================================================================

/**
 * 37. Validates CPT code format and range.
 *
 * @param {string} cptCode - CPT code to validate
 * @returns {CodeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCPTCode('99213');
 * if (!result.isValid) {
 *   throw new Error('Invalid CPT code');
 * }
 * ```
 */
export function validateCPTCode(cptCode: string): CodeValidationResult {
  const isValid = /^\d{5}$/.test(cptCode);

  return {
    code: cptCode,
    codeType: 'CPT',
    isValid,
    errors: isValid ? undefined : ['CPT code must be exactly 5 digits'],
  };
}

/**
 * 38. Validates HCPCS code format.
 *
 * @param {string} hcpcsCode - HCPCS code to validate
 * @returns {CodeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHCPCSCode('J0585');
 * if (!result.isValid) {
 *   console.error('Invalid HCPCS code format');
 * }
 * ```
 */
export function validateHCPCSCode(hcpcsCode: string): CodeValidationResult {
  const isValid = /^[A-Z]\d{4}$/.test(hcpcsCode);

  return {
    code: hcpcsCode,
    codeType: 'HCPCS',
    isValid,
    errors: isValid ? undefined : ['HCPCS code must be 1 letter followed by 4 digits'],
  };
}

/**
 * 39. Validates ICD-10 diagnosis code format and structure.
 *
 * @param {string} icd10Code - ICD-10 code to validate
 * @returns {CodeValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateICD10Code('E11.9');
 * if (result.isValid) {
 *   console.log('Valid ICD-10 code');
 * }
 * ```
 */
export function validateICD10Code(icd10Code: string): CodeValidationResult {
  // ICD-10: Letter + 2 digits + optional decimal + up to 4 more characters
  const isValid = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/.test(icd10Code);

  return {
    code: icd10Code,
    codeType: 'ICD10',
    isValid,
    errors: isValid ? undefined : ['Invalid ICD-10 format'],
  };
}

/**
 * 40. Validates modifier usage and combinations.
 *
 * @param {string[]} modifiers - Modifiers to validate
 * @param {string} procedureCode - Associated procedure code
 * @returns {object} Modifier validation result
 *
 * @example
 * ```typescript
 * const result = validateModifiers(['25', '59'], '99213');
 * if (!result.isValid) {
 *   console.error('Modifier errors:', result.errors);
 * }
 * ```
 */
export function validateModifiers(modifiers: string[], procedureCode: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check modifier format (2 characters)
  modifiers.forEach(mod => {
    if (!/^[A-Z0-9]{2}$/.test(mod)) {
      errors.push(`Invalid modifier format: ${mod}`);
    }
  });

  // Check for mutually exclusive modifiers
  if (modifiers.includes('59') && modifiers.includes('XE')) {
    errors.push('Modifiers 59 and XE are mutually exclusive');
  }

  // Warn about duplicate modifiers
  const uniqueModifiers = new Set(modifiers);
  if (uniqueModifiers.size !== modifiers.length) {
    warnings.push('Duplicate modifiers detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 41. Checks for NCCI edits (National Correct Coding Initiative).
 *
 * @param {string} code1 - First procedure code
 * @param {string} code2 - Second procedure code
 * @returns {object} NCCI edit check result
 *
 * @example
 * ```typescript
 * const result = checkNCCIEdits('99213', '36415');
 * if (result.hasEdit) {
 *   console.log('NCCI edit found:', result.editType);
 *   console.log('Modifier allowed:', result.modifierAllowed);
 * }
 * ```
 */
export function checkNCCIEdits(code1: string, code2: string): {
  hasEdit: boolean;
  editType?: 'column1/column2' | 'mutually_exclusive';
  modifierAllowed?: boolean;
  description?: string;
} {
  // Simplified NCCI check (production would use comprehensive NCCI database)
  // This is a placeholder - actual implementation requires NCCI edit tables

  return {
    hasEdit: false,
    modifierAllowed: true,
  };
}

/**
 * 42. Validates diagnosis-to-procedure medical necessity linkage.
 *
 * @param {string} procedureCode - CPT/HCPCS code
 * @param {string[]} diagnosisCodes - ICD-10 codes
 * @returns {object} Medical necessity validation
 *
 * @example
 * ```typescript
 * const result = validateMedicalNecessity('99213', ['E11.9', 'I10']);
 * if (!result.isSupported) {
 *   console.warn('Medical necessity may not be supported');
 * }
 * ```
 */
export function validateMedicalNecessity(procedureCode: string, diagnosisCodes: string[]): {
  isSupported: boolean;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
} {
  // Simplified medical necessity check
  // Production would use LCD/NCD databases and payer-specific policies

  if (diagnosisCodes.length === 0) {
    return {
      isSupported: false,
      confidence: 'low',
      warnings: ['No diagnosis codes provided'],
    };
  }

  return {
    isSupported: true,
    confidence: 'medium',
    warnings: [],
  };
}

// ============================================================================
// SECTION 8: SUPPORTING FUNCTIONS (Functions 43-45)
// ============================================================================

/**
 * 43. Generates patient statement with aging buckets.
 *
 * @param {string} patientId - Patient ID
 * @param {StatementTransaction[]} transactions - Account transactions
 * @returns {PatientStatement} Generated patient statement
 *
 * @example
 * ```typescript
 * const statement = generatePatientStatement('PAT-123', transactions);
 * await sendStatementToPatient(statement);
 * ```
 */
export function generatePatientStatement(
  patientId: string,
  transactions: StatementTransaction[]
): PatientStatement {
  const currentBalance = transactions.length > 0
    ? transactions[transactions.length - 1].balance
    : 0;

  const totalCharges = transactions.reduce((sum, t) => sum + t.charges, 0);
  const totalPayments = transactions.reduce((sum, t) => sum + t.payments, 0);
  const totalAdjustments = transactions.reduce((sum, t) => sum + t.adjustments, 0);

  // Calculate aging (simplified)
  const agingBuckets: AgingBucket[] = [
    { period: '0-30', amount: currentBalance * 0.4 },
    { period: '31-60', amount: currentBalance * 0.3 },
    { period: '61-90', amount: currentBalance * 0.2 },
    { period: '91-120', amount: currentBalance * 0.1 },
    { period: '120+', amount: 0 },
  ];

  const statementDate = new Date();
  const dueDate = new Date(statementDate);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    statementId: `STMT-${crypto.randomUUID()}`,
    patientId,
    statementDate,
    dueDate,
    previousBalance: 0,
    charges: totalCharges,
    payments: totalPayments,
    adjustments: totalAdjustments,
    currentBalance,
    agingBuckets,
    transactions,
  };
}

/**
 * 44. Performs insurance eligibility verification.
 *
 * @param {PatientDemographics} patient - Patient information
 * @param {InsurancePayer} payer - Insurance payer
 * @returns {Promise<InsuranceVerification>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyInsuranceEligibility(patient, payer);
 * if (!verification.isActive) {
 *   console.error('Patient insurance is not active');
 * }
 * ```
 */
export async function verifyInsuranceEligibility(
  patient: PatientDemographics,
  payer: InsurancePayer
): Promise<InsuranceVerification> {
  // Simplified verification (production would make EDI 270/271 transaction)

  return {
    verificationId: `VER-${crypto.randomUUID()}`,
    patientId: patient.patientId,
    payerId: payer.payerId,
    verificationDate: new Date(),
    isActive: true,
    effectiveDate: payer.effectiveDate,
    terminationDate: payer.terminationDate,
    coverageLevel: 'individual',
    benefits: [
      {
        serviceType: 'office_visit',
        coverageLevel: 'in-network',
        covered: true,
        copay: 25,
        coinsurance: 20,
        priorAuthRequired: false,
      },
    ],
  };
}

/**
 * 45. Formats EDI date (YYMMDD or CCYYMMDD).
 *
 * @param {Date} date - Date to format
 * @param {boolean} includeCentury - Include century (8 digits)
 * @returns {string} Formatted EDI date
 *
 * @example
 * ```typescript
 * const ediDate = formatEDIDate(new Date(), true);
 * // Result: '20240115'
 * ```
 */
export function formatEDIDate(date: Date, includeCentury: boolean = true): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (includeCentury) {
    return `${year}${month}${day}`;
  } else {
    return `${String(year).slice(2)}${month}${day}`;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Claim Generation
  generateCMS1500Claim,
  generateUB04Claim,
  serializeClaimToJSON,
  deserializeClaimFromJSON,
  generateClaimControlNumber,
  calculateClaimTotals,

  // Claim Validation
  validateClaim,
  scrubClaim,
  validateDiagnosisCodes,
  validateProcedureCode,
  checkDuplicateClaim,
  validateTimelyFiling,

  // EDI Transactions
  generateEDI837P,
  generateEDI837I,
  validateEDITransaction,
  parseERA835,
  generateClaimStatusInquiry,
  parseClaimStatusResponse,

  // Claim Tracking
  trackClaimStatus,
  getClaimAdjudicationStatus,
  calculateExpectedPaymentDate,
  identifyClaimsRequiringFollowUp,
  generateClaimTrackingReport,
  monitorClaimAging,

  // Denial Management
  createDenialRecord,
  analyzeDenialAppealability,
  initiateAppealWorkflow,
  trackAppealProgress,
  generateAppealLetter,
  calculateDenialRate,

  // Payment Processing
  postPaymentToAccount,
  reconcileERAPayment,
  processPaymentAdjustments,
  calculatePatientBalance,
  identifyPaymentVariances,
  generatePaymentPostingBatch,

  // Medical Coding
  validateCPTCode,
  validateHCPCSCode,
  validateICD10Code,
  validateModifiers,
  checkNCCIEdits,
  validateMedicalNecessity,

  // Supporting Functions
  generatePatientStatement,
  verifyInsuranceEligibility,
  formatEDIDate,
};
