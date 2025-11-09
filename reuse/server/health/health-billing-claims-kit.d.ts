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
 * Claim status enumeration
 */
export declare enum ClaimStatus {
    DRAFT = "draft",
    READY = "ready",
    SUBMITTED = "submitted",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PENDED = "pended",
    DENIED = "denied",
    PAID = "paid",
    PARTIALLY_PAID = "partially_paid",
    APPEALED = "appealed",
    CLOSED = "closed"
}
/**
 * Claim type enumeration
 */
export declare enum ClaimType {
    PROFESSIONAL = "professional",// CMS-1500
    INSTITUTIONAL = "institutional",// UB-04
    DENTAL = "dental",
    PHARMACY = "pharmacy"
}
/**
 * EDI transaction type
 */
export declare enum EDITransactionType {
    CLAIM_837P = "837P",// Professional claim
    CLAIM_837I = "837I",// Institutional claim
    CLAIM_STATUS_276 = "276",// Claim status inquiry
    CLAIM_STATUS_277 = "277",// Claim status response
    ERA_835 = "835",// Electronic remittance advice
    ELIGIBILITY_270 = "270",// Eligibility inquiry
    ELIGIBILITY_271 = "271"
}
/**
 * Denial reason codes
 */
export declare enum DenialReasonCode {
    MISSING_INFO = "missing_information",
    INVALID_CODE = "invalid_code",
    NOT_COVERED = "not_covered",
    AUTHORIZATION_REQUIRED = "authorization_required",
    TIMELY_FILING = "timely_filing_limit",
    DUPLICATE_CLAIM = "duplicate_claim",
    ELIGIBILITY = "patient_not_eligible",
    COORDINATION_BENEFITS = "coordination_of_benefits"
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
    procedureCode: string;
    modifiers?: string[];
    diagnosisPointers: number[];
    units: number;
    chargeAmount: number;
    ndc?: string;
    renderingProviderId?: string;
    description?: string;
}
/**
 * Diagnosis code information
 */
export interface DiagnosisCode {
    sequence: number;
    code: string;
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
    billType: string;
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
    scrubbingScore: number;
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
export declare function generateCMS1500Claim(claimData: Partial<CMS1500Claim>): CMS1500Claim;
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
export declare function generateUB04Claim(claimData: Partial<UB04Claim>): UB04Claim;
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
export declare function serializeClaimToJSON(claim: CMS1500Claim | UB04Claim): string;
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
export declare function deserializeClaimFromJSON(jsonString: string): CMS1500Claim | UB04Claim;
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
export declare function generateClaimControlNumber(prefix?: string): string;
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
export declare function calculateClaimTotals(claim: CMS1500Claim | UB04Claim): {
    totalCharges: number;
    lineCount: number;
    isValid: boolean;
};
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
export declare function validateClaim(claim: CMS1500Claim | UB04Claim, payerId: string): ClaimValidationResult;
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
export declare function scrubClaim(claim: CMS1500Claim | UB04Claim): {
    scrubbedClaim: CMS1500Claim | UB04Claim;
    fixes: string[];
};
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
export declare function validateDiagnosisCodes(diagnosisCodes: DiagnosisCode[]): CodeValidationResult[];
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
export declare function validateProcedureCode(procedureCode: string): CodeValidationResult;
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
export declare function checkDuplicateClaim(claim: CMS1500Claim | UB04Claim, existingClaims: Array<CMS1500Claim | UB04Claim>): {
    isDuplicate: boolean;
    matchingClaimId?: string;
};
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
export declare function validateTimelyFiling(claim: CMS1500Claim | UB04Claim, timelyFilingDays: number): {
    isTimely: boolean;
    daysLate?: number;
    deadline: Date;
};
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
export declare function generateEDI837P(claim: CMS1500Claim, config: {
    senderId: string;
    receiverId: string;
    submitterName?: string;
}): EDI837Transaction;
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
export declare function generateEDI837I(claim: UB04Claim, config: {
    senderId: string;
    receiverId: string;
}): EDI837Transaction;
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
export declare function validateEDITransaction(transaction: EDI837Transaction): {
    isValid: boolean;
    errors: string[];
};
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
export declare function parseERA835(ediContent: string): ERA835;
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
export declare function generateClaimStatusInquiry(inquiry: ClaimStatusInquiry): string;
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
export declare function parseClaimStatusResponse(edi277Content: string): ClaimStatusResponse;
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
export declare function trackClaimStatus(claimId: string, newStatus: ClaimStatus): {
    claimId: string;
    status: ClaimStatus;
    timestamp: Date;
    updateId: string;
};
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
export declare function getClaimAdjudicationStatus(statusCode: string): {
    code: string;
    description: string;
    actionRequired: boolean;
    category: 'finalized' | 'pending' | 'denied';
};
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
export declare function calculateExpectedPaymentDate(submissionDate: Date, payerDays: number): Date;
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
export declare function identifyClaimsRequiringFollowUp(claims: Array<{
    claimId: string;
    status: ClaimStatus;
    submissionDate: Date;
}>, followUpDays: number): string[];
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
export declare function generateClaimTrackingReport(claims: Array<{
    claimId: string;
    status: ClaimStatus;
    amount: number;
}>): {
    totalClaims: number;
    totalAmount: number;
    statusBreakdown: Record<ClaimStatus, {
        count: number;
        amount: number;
    }>;
};
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
export declare function monitorClaimAging(claims: Array<{
    claimId: string;
    submissionDate: Date;
    status: ClaimStatus;
}>): {
    under30Days: number;
    days30to60: number;
    days60to90: number;
    over90Days: number;
    escalationRequired: string[];
};
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
export declare function createDenialRecord(denialData: Partial<DenialInfo>): DenialInfo;
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
export declare function analyzeDenialAppealability(denial: DenialInfo): {
    shouldAppeal: boolean;
    strategy?: string;
    requiredDocuments?: string[];
    successProbability?: 'high' | 'medium' | 'low';
};
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
export declare function initiateAppealWorkflow(denial: DenialInfo, appealData: {
    appealReason: string;
    supportingDocuments: string[];
}): AppealWorkflow;
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
export declare function trackAppealProgress(appeal: AppealWorkflow, update: {
    status: AppealWorkflow['status'];
    resolution?: string;
    recoveredAmount?: number;
}): AppealWorkflow;
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
export declare function generateAppealLetter(appeal: AppealWorkflow, denial: DenialInfo): string;
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
export declare function calculateDenialRate(denials: DenialInfo[], totalClaims: number): {
    denialRate: number;
    topReasons: Array<{
        reason: DenialReasonCode;
        count: number;
        percentage: number;
    }>;
    totalDeniedAmount: number;
};
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
export declare function postPaymentToAccount(payment: ClaimPayment, accountId: string): {
    postingId: string;
    accountId: string;
    claimId: string;
    paidAmount: number;
    adjustments: number;
    patientBalance: number;
    postingDate: Date;
};
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
export declare function reconcileERAPayment(era: ERA835, depositAmount: number): {
    balanced: boolean;
    eraAmount: number;
    depositAmount: number;
    variance: number;
};
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
export declare function processPaymentAdjustments(adjustments: PaymentAdjustment[]): {
    contractual: number;
    patientResponsibility: number;
    other: number;
    total: number;
};
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
export declare function calculatePatientBalance(payment: ClaimPayment): number;
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
export declare function identifyPaymentVariances(payment: ClaimPayment, expectedAmount: number): {
    hasVariance: boolean;
    varianceAmount: number;
    variancePercentage: number;
    isUnderpayment: boolean;
};
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
export declare function generatePaymentPostingBatch(payments: ClaimPayment[], batchDate: Date): {
    batchId: string;
    batchDate: Date;
    paymentCount: number;
    totalPaid: number;
    totalAdjustments: number;
    payments: ClaimPayment[];
};
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
export declare function validateCPTCode(cptCode: string): CodeValidationResult;
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
export declare function validateHCPCSCode(hcpcsCode: string): CodeValidationResult;
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
export declare function validateICD10Code(icd10Code: string): CodeValidationResult;
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
export declare function validateModifiers(modifiers: string[], procedureCode: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function checkNCCIEdits(code1: string, code2: string): {
    hasEdit: boolean;
    editType?: 'column1/column2' | 'mutually_exclusive';
    modifierAllowed?: boolean;
    description?: string;
};
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
export declare function validateMedicalNecessity(procedureCode: string, diagnosisCodes: string[]): {
    isSupported: boolean;
    confidence: 'high' | 'medium' | 'low';
    warnings: string[];
};
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
export declare function generatePatientStatement(patientId: string, transactions: StatementTransaction[]): PatientStatement;
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
export declare function verifyInsuranceEligibility(patient: PatientDemographics, payer: InsurancePayer): Promise<InsuranceVerification>;
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
export declare function formatEDIDate(date: Date, includeCentury?: boolean): string;
declare const _default: {
    generateCMS1500Claim: typeof generateCMS1500Claim;
    generateUB04Claim: typeof generateUB04Claim;
    serializeClaimToJSON: typeof serializeClaimToJSON;
    deserializeClaimFromJSON: typeof deserializeClaimFromJSON;
    generateClaimControlNumber: typeof generateClaimControlNumber;
    calculateClaimTotals: typeof calculateClaimTotals;
    validateClaim: typeof validateClaim;
    scrubClaim: typeof scrubClaim;
    validateDiagnosisCodes: typeof validateDiagnosisCodes;
    validateProcedureCode: typeof validateProcedureCode;
    checkDuplicateClaim: typeof checkDuplicateClaim;
    validateTimelyFiling: typeof validateTimelyFiling;
    generateEDI837P: typeof generateEDI837P;
    generateEDI837I: typeof generateEDI837I;
    validateEDITransaction: typeof validateEDITransaction;
    parseERA835: typeof parseERA835;
    generateClaimStatusInquiry: typeof generateClaimStatusInquiry;
    parseClaimStatusResponse: typeof parseClaimStatusResponse;
    trackClaimStatus: typeof trackClaimStatus;
    getClaimAdjudicationStatus: typeof getClaimAdjudicationStatus;
    calculateExpectedPaymentDate: typeof calculateExpectedPaymentDate;
    identifyClaimsRequiringFollowUp: typeof identifyClaimsRequiringFollowUp;
    generateClaimTrackingReport: typeof generateClaimTrackingReport;
    monitorClaimAging: typeof monitorClaimAging;
    createDenialRecord: typeof createDenialRecord;
    analyzeDenialAppealability: typeof analyzeDenialAppealability;
    initiateAppealWorkflow: typeof initiateAppealWorkflow;
    trackAppealProgress: typeof trackAppealProgress;
    generateAppealLetter: typeof generateAppealLetter;
    calculateDenialRate: typeof calculateDenialRate;
    postPaymentToAccount: typeof postPaymentToAccount;
    reconcileERAPayment: typeof reconcileERAPayment;
    processPaymentAdjustments: typeof processPaymentAdjustments;
    calculatePatientBalance: typeof calculatePatientBalance;
    identifyPaymentVariances: typeof identifyPaymentVariances;
    generatePaymentPostingBatch: typeof generatePaymentPostingBatch;
    validateCPTCode: typeof validateCPTCode;
    validateHCPCSCode: typeof validateHCPCSCode;
    validateICD10Code: typeof validateICD10Code;
    validateModifiers: typeof validateModifiers;
    checkNCCIEdits: typeof checkNCCIEdits;
    validateMedicalNecessity: typeof validateMedicalNecessity;
    generatePatientStatement: typeof generatePatientStatement;
    verifyInsuranceEligibility: typeof verifyInsuranceEligibility;
    formatEDIDate: typeof formatEDIDate;
};
export default _default;
//# sourceMappingURL=health-billing-claims-kit.d.ts.map