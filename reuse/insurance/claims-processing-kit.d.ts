/**
 * LOC: INS-CLAIMS-001
 * File: /reuse/insurance/claims-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Claims management modules
 *   - Adjusting services
 *   - Subrogation systems
 */
import { Transaction, Sequelize } from 'sequelize';
/**
 * Claim status
 */
export declare enum ClaimStatus {
    FNOL_RECEIVED = "fnol_received",
    OPEN = "open",
    ASSIGNED = "assigned",
    UNDER_INVESTIGATION = "under_investigation",
    PENDING_DOCUMENTATION = "pending_documentation",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    SETTLEMENT_NEGOTIATION = "settlement_negotiation",
    SETTLED = "settled",
    PAID = "paid",
    CLOSED = "closed",
    DENIED = "denied",
    REOPENED = "reopened",
    SUBROGATION = "subrogation",
    LITIGATION = "litigation",
    SUSPENDED = "suspended"
}
/**
 * Claim type
 */
export declare enum ClaimType {
    AUTO_COLLISION = "auto_collision",
    AUTO_COMPREHENSIVE = "auto_comprehensive",
    AUTO_LIABILITY = "auto_liability",
    AUTO_MEDICAL = "auto_medical",
    AUTO_UNINSURED = "auto_uninsured",
    PROPERTY_FIRE = "property_fire",
    PROPERTY_WATER = "property_water",
    PROPERTY_THEFT = "property_theft",
    PROPERTY_VANDALISM = "property_vandalism",
    PROPERTY_WEATHER = "property_weather",
    LIABILITY_BODILY_INJURY = "liability_bodily_injury",
    LIABILITY_PROPERTY_DAMAGE = "liability_property_damage",
    LIABILITY_PERSONAL_INJURY = "liability_personal_injury",
    WORKERS_COMP = "workers_comp",
    HEALTH = "health",
    LIFE = "life",
    DISABILITY = "disability"
}
/**
 * Loss type
 */
export declare enum LossType {
    COLLISION = "collision",
    COMPREHENSIVE = "comprehensive",
    FIRE = "fire",
    THEFT = "theft",
    VANDALISM = "vandalism",
    WEATHER = "weather",
    WATER_DAMAGE = "water_damage",
    BODILY_INJURY = "bodily_injury",
    PROPERTY_DAMAGE = "property_damage",
    MEDICAL = "medical",
    DEATH = "death",
    OTHER = "other"
}
/**
 * Claim severity
 */
export declare enum ClaimSeverity {
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    SEVERE = "severe",
    CATASTROPHIC = "catastrophic"
}
/**
 * Reserve type
 */
export declare enum ReserveType {
    INDEMNITY = "indemnity",
    EXPENSE = "expense",
    LEGAL = "legal",
    MEDICAL = "medical",
    TOTAL = "total"
}
/**
 * Payment type
 */
export declare enum PaymentType {
    INDEMNITY = "indemnity",
    MEDICAL = "medical",
    EXPENSE = "expense",
    DEDUCTIBLE_RECOVERY = "deductible_recovery",
    SALVAGE_RECOVERY = "salvage_recovery",
    SUBROGATION_RECOVERY = "subrogation_recovery",
    PARTIAL_PAYMENT = "partial_payment",
    FINAL_PAYMENT = "final_payment"
}
/**
 * Investigation status
 */
export declare enum InvestigationStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    PENDING_INFO = "pending_info",
    COMPLETED = "completed",
    SUSPENDED = "suspended"
}
/**
 * Adjuster type
 */
export declare enum AdjusterType {
    STAFF = "staff",
    INDEPENDENT = "independent",
    PUBLIC = "public",
    DESK = "desk",
    FIELD = "field"
}
/**
 * Liability determination
 */
export declare enum LiabilityDetermination {
    INSURED_AT_FAULT = "insured_at_fault",
    THIRD_PARTY_AT_FAULT = "third_party_at_fault",
    COMPARATIVE = "comparative",
    NO_FAULT = "no_fault",
    PENDING = "pending",
    DISPUTED = "disputed"
}
/**
 * Document type
 */
export declare enum ClaimDocumentType {
    POLICE_REPORT = "police_report",
    MEDICAL_RECORD = "medical_record",
    REPAIR_ESTIMATE = "repair_estimate",
    INVOICE = "invoice",
    RECEIPT = "receipt",
    PHOTO = "photo",
    VIDEO = "video",
    WITNESS_STATEMENT = "witness_statement",
    RECORDED_STATEMENT = "recorded_statement",
    EXPERT_REPORT = "expert_report",
    CORRESPONDENCE = "correspondence",
    LEGAL_DOCUMENT = "legal_document"
}
/**
 * First Notice of Loss (FNOL) data
 */
export interface FNOLData {
    policyId: string;
    claimType: ClaimType;
    lossType: LossType;
    lossDate: Date;
    reportedDate: Date;
    reportedBy: string;
    reportedByRelation: string;
    lossDescription: string;
    lossLocation: LossLocation;
    policeReportNumber?: string;
    policeReportFiled: boolean;
    estimatedLossAmount?: number;
    injuries?: InjuryInfo[];
    witnesses?: WitnessInfo[];
    thirdParties?: ThirdPartyInfo[];
    contactPhone: string;
    contactEmail?: string;
    urgentIndicator: boolean;
    metadata?: Record<string, any>;
}
/**
 * Loss location
 */
export interface LossLocation {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Injury information
 */
export interface InjuryInfo {
    injuredParty: string;
    injuryType: string;
    injuryDescription: string;
    medicalTreatment: boolean;
    hospitalName?: string;
    severity: string;
}
/**
 * Witness information
 */
export interface WitnessInfo {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    statement?: string;
}
/**
 * Third party information
 */
export interface ThirdPartyInfo {
    name: string;
    phone: string;
    email?: string;
    insuranceCarrier?: string;
    policyNumber?: string;
    vehicleInfo?: VehicleInfo;
}
/**
 * Vehicle information
 */
export interface VehicleInfo {
    make: string;
    model: string;
    year: number;
    vin?: string;
    licensePlate?: string;
    state?: string;
}
/**
 * Claim assignment data
 */
export interface ClaimAssignmentData {
    claimId: string;
    adjusterId: string;
    adjusterType: AdjusterType;
    assignedBy: string;
    priority: number;
    specialInstructions?: string;
    assignmentReason?: string;
}
/**
 * Investigation data
 */
export interface InvestigationData {
    claimId: string;
    investigationType: string;
    investigatorId: string;
    startDate: Date;
    targetCompletionDate?: Date;
    scope: string;
    objectives: string[];
    findings?: string;
    recommendations?: string;
}
/**
 * Reserve data
 */
export interface ReserveData {
    claimId: string;
    reserveType: ReserveType;
    amount: number;
    reason: string;
    setBy: string;
    effectiveDate: Date;
    notes?: string;
}
/**
 * Payment data
 */
export interface PaymentData {
    claimId: string;
    paymentType: PaymentType;
    amount: number;
    payeeName: string;
    payeeType: string;
    paymentMethod: string;
    checkNumber?: string;
    transactionId?: string;
    paymentDate: Date;
    authorizedBy: string;
    memo?: string;
    supportingDocuments?: string[];
}
/**
 * Settlement data
 */
export interface SettlementData {
    claimId: string;
    settlementAmount: number;
    settlementType: string;
    negotiatedBy: string;
    claimantAcceptance: boolean;
    releaseObtained: boolean;
    settlementDate: Date;
    terms?: string;
    conditions?: string[];
}
/**
 * Diary entry data
 */
export interface DiaryEntryData {
    claimId: string;
    taskType: string;
    taskDescription: string;
    assignedTo: string;
    dueDate: Date;
    priority: string;
    relatedParty?: string;
    notes?: string;
}
/**
 * Claim note data
 */
export interface ClaimNoteData {
    claimId: string;
    noteType: string;
    content: string;
    createdBy: string;
    confidential: boolean;
    tags?: string[];
}
/**
 * Subrogation opportunity
 */
export interface SubrogationOpportunity {
    claimId: string;
    potentialRecovery: number;
    responsibleParty: string;
    responsiblePartyInsurer?: string;
    basis: string;
    probability: number;
    identifiedBy: string;
    identifiedDate: Date;
}
/**
 * Salvage assessment
 */
export interface SalvageAssessment {
    claimId: string;
    itemDescription: string;
    estimatedValue: number;
    condition: string;
    dispositionPlan: string;
    assessedBy: string;
    assessedDate: Date;
}
/**
 * Claim reopening data
 */
export interface ClaimReopeningData {
    claimId: string;
    reopenReason: string;
    reopenedBy: string;
    additionalReserve?: number;
    newAssignedAdjusterId?: string;
    notes: string;
}
/**
 * Escalation data
 */
export interface EscalationData {
    claimId: string;
    escalationType: string;
    escalatedTo: string;
    escalatedBy: string;
    reason: string;
    urgency: string;
    requestedAction?: string;
}
/**
 * Claim model attributes
 */
export interface ClaimAttributes {
    id: string;
    claimNumber: string;
    policyId: string;
    claimType: ClaimType;
    lossType: LossType;
    status: ClaimStatus;
    severity: ClaimSeverity;
    lossDate: Date;
    reportedDate: Date;
    reportedBy: string;
    reportedByRelation: string;
    lossDescription: string;
    lossLocation: any;
    policeReportNumber?: string;
    policeReportFiled: boolean;
    estimatedLossAmount?: number;
    actualLossAmount?: number;
    paidAmount: number;
    reserveAmount: number;
    assignedAdjusterId?: string;
    adjusterType?: AdjusterType;
    liabilityDetermination?: LiabilityDetermination;
    liabilityPercentage?: number;
    injuries?: any;
    witnesses?: any;
    thirdParties?: any;
    closedDate?: Date;
    deniedDate?: Date;
    denialReason?: string;
    subrogationPotential: boolean;
    salvageValue?: number;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Creates Claim model for Sequelize.
 */
export declare const createClaimModel: (sequelize: Sequelize) => any;
/**
 * Claim reserve history model attributes
 */
export interface ClaimReserveHistoryAttributes {
    id: string;
    claimId: string;
    reserveType: ReserveType;
    previousAmount: number;
    newAmount: number;
    changeAmount: number;
    reason: string;
    setBy: string;
    effectiveDate: Date;
    notes?: string;
    createdAt: Date;
}
/**
 * Creates ClaimReserveHistory model for Sequelize.
 */
export declare const createClaimReserveHistoryModel: (sequelize: Sequelize) => any;
/**
 * 1. Registers First Notice of Loss (FNOL).
 *
 * @param {FNOLData} data - FNOL data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created claim
 *
 * @example
 * ```typescript
 * const claim = await registerFNOL({
 *   policyId: 'policy-123',
 *   claimType: ClaimType.AUTO_COLLISION,
 *   lossType: LossType.COLLISION,
 *   lossDate: new Date('2025-01-15'),
 *   reportedDate: new Date(),
 *   reportedBy: 'John Doe',
 *   reportedByRelation: 'Insured',
 *   lossDescription: 'Rear-ended at stoplight',
 *   lossLocation: {...},
 *   policeReportFiled: true,
 *   contactPhone: '555-1234'
 * });
 * ```
 */
export declare const registerFNOL: (data: FNOLData, transaction?: Transaction) => Promise<any>;
/**
 * 2. Updates FNOL information.
 *
 * @param {string} claimId - Claim ID
 * @param {Partial<FNOLData>} updates - Updated FNOL data
 * @param {string} updatedBy - User updating the FNOL
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
export declare const updateFNOL: (claimId: string, updates: Partial<FNOLData>, updatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 3. Validates FNOL completeness.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ complete: boolean; missingFields: string[] }>} Validation result
 */
export declare const validateFNOL: (claimId: string, transaction?: Transaction) => Promise<{
    complete: boolean;
    missingFields: string[];
}>;
/**
 * 4. Converts FNOL to open claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} openedBy - User opening the claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Opened claim
 */
export declare const openClaim: (claimId: string, openedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 5. Assigns claim to adjuster.
 *
 * @param {ClaimAssignmentData} data - Assignment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Assigned claim
 */
export declare const assignClaim: (data: ClaimAssignmentData, transaction?: Transaction) => Promise<any>;
/**
 * 6. Reassigns claim to different adjuster.
 *
 * @param {string} claimId - Claim ID
 * @param {string} newAdjusterId - New adjuster ID
 * @param {string} reason - Reassignment reason
 * @param {string} reassignedBy - User performing reassignment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reassigned claim
 */
export declare const reassignClaim: (claimId: string, newAdjusterId: string, reason: string, reassignedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 7. Routes claim based on business rules.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ adjusterId: string; adjusterType: AdjusterType; reason: string }>} Routing recommendation
 */
export declare const routeClaim: (claimId: string, transaction?: Transaction) => Promise<{
    adjusterId: string;
    adjusterType: AdjusterType;
    reason: string;
}>;
/**
 * 8. Retrieves adjuster workload.
 *
 * @param {string} adjusterId - Adjuster ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ openClaims: number; totalReserves: number; averageSeverity: string }>} Workload metrics
 */
export declare const getAdjusterWorkload: (adjusterId: string, transaction?: Transaction) => Promise<{
    openClaims: number;
    totalReserves: number;
    averageSeverity: string;
}>;
/**
 * 9. Initiates claim investigation.
 *
 * @param {InvestigationData} data - Investigation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Investigation record
 */
export declare const initiateInvestigation: (data: InvestigationData, transaction?: Transaction) => Promise<any>;
/**
 * 10. Updates investigation findings.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string} findings - Investigation findings
 * @param {string} recommendations - Recommendations
 * @param {string} updatedBy - User updating findings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated investigation
 */
export declare const updateInvestigationFindings: (investigationId: string, findings: string, recommendations: string, updatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 11. Completes investigation.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string} completedBy - User completing investigation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed investigation
 */
export declare const completeInvestigation: (investigationId: string, completedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 12. Determines liability based on investigation.
 *
 * @param {string} claimId - Claim ID
 * @param {LiabilityDetermination} determination - Liability determination
 * @param {number} percentage - Liability percentage
 * @param {string} determinedBy - User making determination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
export declare const determineLiability: (claimId: string, determination: LiabilityDetermination, percentage: number, determinedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 13. Sets initial loss reserve.
 *
 * @param {ReserveData} data - Reserve data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reserve record
 */
export declare const setInitialReserve: (data: ReserveData, transaction?: Transaction) => Promise<any>;
/**
 * 14. Updates loss reserve amount.
 *
 * @param {ReserveData} data - Reserve data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reserve record
 */
export declare const updateReserve: (data: ReserveData, transaction?: Transaction) => Promise<any>;
/**
 * 15. Retrieves reserve history for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Reserve history
 */
export declare const getReserveHistory: (claimId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 16. Calculates reserve adequacy.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ adequate: boolean; recommendedReserve: number; currentReserve: number }>} Adequacy assessment
 */
export declare const assessReserveAdequacy: (claimId: string, transaction?: Transaction) => Promise<{
    adequate: boolean;
    recommendedReserve: number;
    currentReserve: number;
}>;
/**
 * 17. Processes claim payment.
 *
 * @param {PaymentData} data - Payment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment record
 */
export declare const processClaimPayment: (data: PaymentData, transaction?: Transaction) => Promise<any>;
/**
 * 18. Retrieves payment history for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payment history
 */
export declare const getPaymentHistory: (claimId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 19. Calculates remaining reserves.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Remaining reserves
 */
export declare const calculateRemainingReserves: (claimId: string, transaction?: Transaction) => Promise<number>;
/**
 * 20. Voids a payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} voidReason - Reason for voiding
 * @param {string} voidedBy - User voiding payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 */
export declare const voidPayment: (paymentId: string, voidReason: string, voidedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 21. Initiates settlement negotiation.
 *
 * @param {string} claimId - Claim ID
 * @param {number} initialOffer - Initial settlement offer
 * @param {string} initiatedBy - User initiating settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Settlement negotiation record
 */
export declare const initiateSettlement: (claimId: string, initialOffer: number, initiatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 22. Updates settlement offer.
 *
 * @param {string} settlementId - Settlement ID
 * @param {number} newOffer - New settlement offer
 * @param {string} offeredBy - User making offer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated settlement
 */
export declare const updateSettlementOffer: (settlementId: string, newOffer: number, offeredBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 23. Finalizes settlement.
 *
 * @param {SettlementData} data - Settlement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Finalized settlement
 */
export declare const finalizeSettlement: (data: SettlementData, transaction?: Transaction) => Promise<any>;
/**
 * 24. Creates diary entry/task.
 *
 * @param {DiaryEntryData} data - Diary entry data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Diary entry
 */
export declare const createDiaryEntry: (data: DiaryEntryData, transaction?: Transaction) => Promise<any>;
/**
 * 25. Completes diary entry/task.
 *
 * @param {string} diaryId - Diary entry ID
 * @param {string} completionNotes - Completion notes
 * @param {string} completedBy - User completing task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed diary entry
 */
export declare const completeDiaryEntry: (diaryId: string, completionNotes: string, completedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 26. Retrieves pending tasks for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Pending tasks
 */
export declare const getPendingTasks: (claimId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 27. Retrieves overdue tasks for adjuster.
 *
 * @param {string} adjusterId - Adjuster ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Overdue tasks
 */
export declare const getOverdueTasks: (adjusterId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 28. Uploads claim document.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimDocumentType} documentType - Document type
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} uploadedBy - User uploading document
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Document record
 */
export declare const uploadClaimDocument: (claimId: string, documentType: ClaimDocumentType, fileBuffer: Buffer, fileName: string, uploadedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 29. Retrieves claim documents.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimDocumentType} [documentType] - Optional filter by type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Documents
 */
export declare const getClaimDocuments: (claimId: string, documentType?: ClaimDocumentType, transaction?: Transaction) => Promise<any[]>;
/**
 * 30. Adds claim note.
 *
 * @param {ClaimNoteData} data - Note data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Note record
 */
export declare const addClaimNote: (data: ClaimNoteData, transaction?: Transaction) => Promise<any>;
/**
 * 31. Retrieves claim notes.
 *
 * @param {string} claimId - Claim ID
 * @param {boolean} [includeConfidential] - Include confidential notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Notes
 */
export declare const getClaimNotes: (claimId: string, includeConfidential?: boolean, transaction?: Transaction) => Promise<any[]>;
/**
 * 32. Updates claim status.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimStatus} newStatus - New status
 * @param {string} reason - Reason for status change
 * @param {string} updatedBy - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
export declare const updateClaimStatus: (claimId: string, newStatus: ClaimStatus, reason: string, updatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 33. Closes claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} closureReason - Closure reason
 * @param {string} closedBy - User closing claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed claim
 */
export declare const closeClaim: (claimId: string, closureReason: string, closedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 34. Denies claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} denialReason - Denial reason
 * @param {string} deniedBy - User denying claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Denied claim
 */
export declare const denyClaim: (claimId: string, denialReason: string, deniedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 35. Reopens closed claim.
 *
 * @param {ClaimReopeningData} data - Reopening data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reopened claim
 */
export declare const reopenClaim: (data: ClaimReopeningData, transaction?: Transaction) => Promise<any>;
/**
 * 36. Identifies subrogation opportunity.
 *
 * @param {SubrogationOpportunity} data - Subrogation opportunity data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Subrogation record
 */
export declare const identifySubrogationOpportunity: (data: SubrogationOpportunity, transaction?: Transaction) => Promise<any>;
/**
 * 37. Pursues subrogation recovery.
 *
 * @param {string} subrogationId - Subrogation record ID
 * @param {string} pursuedBy - User pursuing subrogation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated subrogation
 */
export declare const pursueSubrogation: (subrogationId: string, pursuedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 38. Records subrogation recovery.
 *
 * @param {string} subrogationId - Subrogation record ID
 * @param {number} recoveryAmount - Recovered amount
 * @param {string} recoveredBy - User recording recovery
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated subrogation
 */
export declare const recordSubrogationRecovery: (subrogationId: string, recoveryAmount: number, recoveredBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 39. Assesses salvage value.
 *
 * @param {SalvageAssessment} data - Salvage assessment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Salvage record
 */
export declare const assessSalvageValue: (data: SalvageAssessment, transaction?: Transaction) => Promise<any>;
/**
 * 40. Records salvage recovery.
 *
 * @param {string} salvageId - Salvage record ID
 * @param {number} actualRecovery - Actual recovery amount
 * @param {string} recoveredBy - User recording recovery
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated salvage
 */
export declare const recordSalvageRecovery: (salvageId: string, actualRecovery: number, recoveredBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 41. Escalates claim.
 *
 * @param {EscalationData} data - Escalation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Escalation record
 */
export declare const escalateClaim: (data: EscalationData, transaction?: Transaction) => Promise<any>;
/**
 * 42. Generates claims report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string[]} [filters] - Optional filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Claims report
 */
export declare const generateClaimsReport: (startDate: Date, endDate: Date, filters?: string[], transaction?: Transaction) => Promise<any>;
/**
 * 43. Retrieves claim analytics.
 *
 * @param {string} [adjusterId] - Optional adjuster filter
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Claim analytics
 */
export declare const getClaimAnalytics: (adjusterId?: string, startDate?: Date, endDate?: Date, transaction?: Transaction) => Promise<any>;
/**
 * 44. Retrieves claim lifecycle timeline.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Timeline events
 */
export declare const getClaimTimeline: (claimId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 45. Validates claim closure eligibility.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 */
export declare const validateClaimClosureEligibility: (claimId: string, transaction?: Transaction) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
declare const _default: {
    registerFNOL: (data: FNOLData, transaction?: Transaction) => Promise<any>;
    updateFNOL: (claimId: string, updates: Partial<FNOLData>, updatedBy: string, transaction?: Transaction) => Promise<any>;
    validateFNOL: (claimId: string, transaction?: Transaction) => Promise<{
        complete: boolean;
        missingFields: string[];
    }>;
    openClaim: (claimId: string, openedBy: string, transaction?: Transaction) => Promise<any>;
    assignClaim: (data: ClaimAssignmentData, transaction?: Transaction) => Promise<any>;
    reassignClaim: (claimId: string, newAdjusterId: string, reason: string, reassignedBy: string, transaction?: Transaction) => Promise<any>;
    routeClaim: (claimId: string, transaction?: Transaction) => Promise<{
        adjusterId: string;
        adjusterType: AdjusterType;
        reason: string;
    }>;
    getAdjusterWorkload: (adjusterId: string, transaction?: Transaction) => Promise<{
        openClaims: number;
        totalReserves: number;
        averageSeverity: string;
    }>;
    initiateInvestigation: (data: InvestigationData, transaction?: Transaction) => Promise<any>;
    updateInvestigationFindings: (investigationId: string, findings: string, recommendations: string, updatedBy: string, transaction?: Transaction) => Promise<any>;
    completeInvestigation: (investigationId: string, completedBy: string, transaction?: Transaction) => Promise<any>;
    determineLiability: (claimId: string, determination: LiabilityDetermination, percentage: number, determinedBy: string, transaction?: Transaction) => Promise<any>;
    setInitialReserve: (data: ReserveData, transaction?: Transaction) => Promise<any>;
    updateReserve: (data: ReserveData, transaction?: Transaction) => Promise<any>;
    getReserveHistory: (claimId: string, transaction?: Transaction) => Promise<any[]>;
    assessReserveAdequacy: (claimId: string, transaction?: Transaction) => Promise<{
        adequate: boolean;
        recommendedReserve: number;
        currentReserve: number;
    }>;
    processClaimPayment: (data: PaymentData, transaction?: Transaction) => Promise<any>;
    getPaymentHistory: (claimId: string, transaction?: Transaction) => Promise<any[]>;
    calculateRemainingReserves: (claimId: string, transaction?: Transaction) => Promise<number>;
    voidPayment: (paymentId: string, voidReason: string, voidedBy: string, transaction?: Transaction) => Promise<any>;
    initiateSettlement: (claimId: string, initialOffer: number, initiatedBy: string, transaction?: Transaction) => Promise<any>;
    updateSettlementOffer: (settlementId: string, newOffer: number, offeredBy: string, transaction?: Transaction) => Promise<any>;
    finalizeSettlement: (data: SettlementData, transaction?: Transaction) => Promise<any>;
    createDiaryEntry: (data: DiaryEntryData, transaction?: Transaction) => Promise<any>;
    completeDiaryEntry: (diaryId: string, completionNotes: string, completedBy: string, transaction?: Transaction) => Promise<any>;
    getPendingTasks: (claimId: string, transaction?: Transaction) => Promise<any[]>;
    getOverdueTasks: (adjusterId: string, transaction?: Transaction) => Promise<any[]>;
    uploadClaimDocument: (claimId: string, documentType: ClaimDocumentType, fileBuffer: Buffer, fileName: string, uploadedBy: string, transaction?: Transaction) => Promise<any>;
    getClaimDocuments: (claimId: string, documentType?: ClaimDocumentType, transaction?: Transaction) => Promise<any[]>;
    addClaimNote: (data: ClaimNoteData, transaction?: Transaction) => Promise<any>;
    getClaimNotes: (claimId: string, includeConfidential?: boolean, transaction?: Transaction) => Promise<any[]>;
    updateClaimStatus: (claimId: string, newStatus: ClaimStatus, reason: string, updatedBy: string, transaction?: Transaction) => Promise<any>;
    closeClaim: (claimId: string, closureReason: string, closedBy: string, transaction?: Transaction) => Promise<any>;
    denyClaim: (claimId: string, denialReason: string, deniedBy: string, transaction?: Transaction) => Promise<any>;
    reopenClaim: (data: ClaimReopeningData, transaction?: Transaction) => Promise<any>;
    identifySubrogationOpportunity: (data: SubrogationOpportunity, transaction?: Transaction) => Promise<any>;
    pursueSubrogation: (subrogationId: string, pursuedBy: string, transaction?: Transaction) => Promise<any>;
    recordSubrogationRecovery: (subrogationId: string, recoveryAmount: number, recoveredBy: string, transaction?: Transaction) => Promise<any>;
    assessSalvageValue: (data: SalvageAssessment, transaction?: Transaction) => Promise<any>;
    recordSalvageRecovery: (salvageId: string, actualRecovery: number, recoveredBy: string, transaction?: Transaction) => Promise<any>;
    escalateClaim: (data: EscalationData, transaction?: Transaction) => Promise<any>;
    generateClaimsReport: (startDate: Date, endDate: Date, filters?: string[], transaction?: Transaction) => Promise<any>;
    getClaimAnalytics: (adjusterId?: string, startDate?: Date, endDate?: Date, transaction?: Transaction) => Promise<any>;
    getClaimTimeline: (claimId: string, transaction?: Transaction) => Promise<any[]>;
    validateClaimClosureEligibility: (claimId: string, transaction?: Transaction) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    createClaimModel: (sequelize: Sequelize) => any;
    createClaimReserveHistoryModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=claims-processing-kit.d.ts.map