/**
 * LOC: SETTLEMENT_NEG_KIT_001
 * File: /reuse/legal/settlement-negotiation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - Litigation services
 *   - Settlement workflow controllers
 *   - Payment processing services
 *   - Document generation services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Settlement status lifecycle
 */
export declare enum SettlementStatus {
    DRAFT = "draft",
    PROPOSED = "proposed",
    UNDER_NEGOTIATION = "under_negotiation",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
    EXECUTED = "executed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Settlement offer status
 */
export declare enum OfferStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    COUNTERED = "countered",
    WITHDRAWN = "withdrawn",
    EXPIRED = "expired"
}
/**
 * Settlement type categories
 */
export declare enum SettlementType {
    MEDICAL_MALPRACTICE = "medical_malpractice",
    INSURANCE_CLAIM = "insurance_claim",
    PATIENT_DISPUTE = "patient_dispute",
    EMPLOYMENT_DISPUTE = "employment_dispute",
    CONTRACT_DISPUTE = "contract_dispute",
    PERSONAL_INJURY = "personal_injury",
    PROPERTY_DAMAGE = "property_damage",
    BREACH_OF_CONTRACT = "breach_of_contract",
    PROFESSIONAL_LIABILITY = "professional_liability",
    REGULATORY_SETTLEMENT = "regulatory_settlement",
    OTHER = "other"
}
/**
 * Payment plan status
 */
export declare enum PaymentPlanStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    DEFAULTED = "defaulted",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended"
}
/**
 * Payment installment status
 */
export declare enum InstallmentStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue",
    PARTIAL = "partial",
    WAIVED = "waived"
}
/**
 * Negotiation party role
 */
export declare enum NegotiationRole {
    PLAINTIFF = "plaintiff",
    DEFENDANT = "defendant",
    PLAINTIFF_ATTORNEY = "plaintiff_attorney",
    DEFENDANT_ATTORNEY = "defendant_attorney",
    MEDIATOR = "mediator",
    INSURANCE_ADJUSTER = "insurance_adjuster",
    LEGAL_COUNSEL = "legal_counsel",
    EXPERT_WITNESS = "expert_witness",
    OTHER = "other"
}
/**
 * Settlement approval decision
 */
export declare enum ApprovalDecision {
    APPROVED = "approved",
    REJECTED = "rejected",
    REQUIRES_REVISION = "requires_revision",
    ESCALATED = "escalated"
}
/**
 * Release type
 */
export declare enum ReleaseType {
    GENERAL_RELEASE = "general_release",
    LIMITED_RELEASE = "limited_release",
    MUTUAL_RELEASE = "mutual_release",
    COVENANT_NOT_TO_SUE = "covenant_not_to_sue",
    WAIVER = "waiver"
}
/**
 * Negotiation activity type
 */
export declare enum ActivityType {
    OFFER_MADE = "offer_made",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_REJECTED = "offer_rejected",
    COUNTER_OFFER = "counter_offer",
    NOTE_ADDED = "note_added",
    DOCUMENT_UPLOADED = "document_uploaded",
    COMMUNICATION = "communication",
    STATUS_CHANGE = "status_change",
    APPROVAL_REQUESTED = "approval_requested",
    APPROVAL_GRANTED = "approval_granted",
    PAYMENT_MADE = "payment_made"
}
/**
 * Base settlement entity interface
 */
export interface Settlement {
    id: string;
    settlementNumber: string;
    caseId: string;
    settlementType: SettlementType;
    status: SettlementStatus;
    totalAmount: number;
    currency: string;
    demandAmount?: number;
    offerAmount?: number;
    finalAmount?: number;
    description?: string;
    terms: SettlementTerms;
    parties: SettlementParty[];
    paymentPlan?: PaymentPlan;
    releaseDocuments: ReleaseDocument[];
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    executedAt?: Date;
    completedAt?: Date;
    metadata: SettlementMetadata;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Settlement terms and conditions
 */
export interface SettlementTerms {
    confidentialityRequired: boolean;
    nonAdmissionClause: boolean;
    taxResponsibility: 'plaintiff' | 'defendant' | 'split';
    dismissalType: 'with_prejudice' | 'without_prejudice';
    effectiveDate: Date;
    paymentDueDate?: Date;
    specialConditions: string[];
    attachments: string[];
}
/**
 * Settlement metadata
 */
export interface SettlementMetadata {
    negotiationStartDate?: Date;
    negotiationEndDate?: Date;
    numberOfOffers: number;
    numberOfCounterOffers: number;
    mediationRequired: boolean;
    mediatorId?: string;
    authorityLevel: string;
    riskAssessment?: 'low' | 'medium' | 'high' | 'critical';
    customFields: Record<string, any>;
    tags: string[];
    notes?: string;
}
/**
 * Settlement party information
 */
export interface SettlementParty {
    id: string;
    settlementId: string;
    role: NegotiationRole;
    entityType: 'individual' | 'organization';
    name: string;
    email?: string;
    phone?: string;
    organizationId?: string;
    userId?: string;
    authorityLimit?: number;
    signatureRequired: boolean;
    signedAt?: Date;
    signatureUrl?: string;
    isPrimary: boolean;
    metadata: Record<string, any>;
}
/**
 * Settlement offer entity
 */
export interface SettlementOffer {
    id: string;
    settlementId: string;
    offerNumber: number;
    offerType: 'initial' | 'counter' | 'final';
    offeredBy: string;
    offeredByRole: NegotiationRole;
    amount: number;
    currency: string;
    terms: string;
    conditions: string[];
    validUntil?: Date;
    status: OfferStatus;
    responseDeadline?: Date;
    parentOfferId?: string;
    counterOffers: string[];
    rejectionReason?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Negotiation session entity
 */
export interface NegotiationSession {
    id: string;
    settlementId: string;
    sessionNumber: number;
    sessionType: 'direct' | 'mediated' | 'virtual' | 'in_person';
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    participants: NegotiationParticipant[];
    agenda?: string;
    summary?: string;
    outcome?: string;
    nextSteps?: string[];
    attachments: string[];
    metadata: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Negotiation participant
 */
export interface NegotiationParticipant {
    userId: string;
    role: NegotiationRole;
    name: string;
    attended: boolean;
    joinedAt?: Date;
    leftAt?: Date;
}
/**
 * Negotiation activity log
 */
export interface NegotiationActivity {
    id: string;
    settlementId: string;
    activityType: ActivityType;
    description: string;
    performedBy: string;
    performedByRole: NegotiationRole;
    relatedOfferId?: string;
    metadata: Record<string, any>;
    timestamp: Date;
}
/**
 * Payment plan entity
 */
export interface PaymentPlan {
    id: string;
    settlementId: string;
    totalAmount: number;
    currency: string;
    numberOfInstallments: number;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'custom';
    startDate: Date;
    endDate: Date;
    installments: PaymentInstallment[];
    status: PaymentPlanStatus;
    latePaymentPenalty?: number;
    defaultGracePeriodDays: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Payment installment
 */
export interface PaymentInstallment {
    id: string;
    paymentPlanId: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    paidAmount?: number;
    status: InstallmentStatus;
    paymentMethod?: string;
    transactionId?: string;
    receiptUrl?: string;
    lateFeesApplied?: number;
    metadata: Record<string, any>;
}
/**
 * Release document entity
 */
export interface ReleaseDocument {
    id: string;
    settlementId: string;
    releaseType: ReleaseType;
    documentTitle: string;
    content: string;
    templateId?: string;
    variables: Record<string, any>;
    generatedAt: Date;
    signedBy: string[];
    fullyExecuted: boolean;
    executedAt?: Date;
    documentUrl?: string;
    metadata: Record<string, any>;
}
/**
 * Settlement authority configuration
 */
export interface SettlementAuthority {
    id: string;
    userId: string;
    role: string;
    minAmount: number;
    maxAmount: number;
    settlementTypes: SettlementType[];
    requiresApproval: boolean;
    approverUserId?: string;
    delegatedFrom?: string;
    effectiveFrom: Date;
    effectiveUntil?: Date;
    isActive: boolean;
    metadata: Record<string, any>;
}
/**
 * Settlement approval workflow
 */
export interface SettlementApproval {
    id: string;
    settlementId: string;
    approverUserId: string;
    approverRole: string;
    decision?: ApprovalDecision;
    comments?: string;
    requestedAt: Date;
    decidedAt?: Date;
    order: number;
    required: boolean;
    metadata: Record<string, any>;
}
/**
 * Settlement range calculation
 */
export interface SettlementRange {
    settlementId: string;
    minimumAmount: number;
    maximumAmount: number;
    recommendedAmount: number;
    factors: SettlementFactor[];
    confidence: number;
    calculatedAt: Date;
    calculatedBy: string;
}
/**
 * Settlement factor
 */
export interface SettlementFactor {
    name: string;
    weight: number;
    value: number;
    impact: number;
    description?: string;
}
/**
 * Settlement comparison result
 */
export interface SettlementComparison {
    offer1Id: string;
    offer2Id: string;
    amountDifference: number;
    percentageDifference: number;
    termsDifference: string[];
    recommendation: string;
    comparedAt: Date;
}
/**
 * Settlement analytics
 */
export interface SettlementAnalytics {
    totalSettlements: number;
    totalAmount: number;
    averageAmount: number;
    medianAmount: number;
    averageNegotiationDays: number;
    successRate: number;
    byType: Record<SettlementType, number>;
    byStatus: Record<SettlementStatus, number>;
    timeSeriesData: TimeSeriesPoint[];
}
/**
 * Time series data point
 */
export interface TimeSeriesPoint {
    date: Date;
    count: number;
    totalAmount: number;
    averageAmount: number;
}
/**
 * Settlement search filters
 */
export interface SettlementSearchFilters {
    query?: string;
    caseIds?: string[];
    settlementTypes?: SettlementType[];
    statuses?: SettlementStatus[];
    minAmount?: number;
    maxAmount?: number;
    createdFrom?: Date;
    createdTo?: Date;
    executedFrom?: Date;
    executedTo?: Date;
    createdBy?: string;
    approvedBy?: string;
    tenantId?: string;
}
/**
 * Settlement creation schema
 */
export declare const SettlementCreateSchema: any;
/**
 * Settlement offer schema
 */
export declare const SettlementOfferSchema: any;
/**
 * Payment plan schema
 */
export declare const PaymentPlanSchema: any;
/**
 * Negotiation session schema
 */
export declare const NegotiationSessionSchema: any;
/**
 * Settlement authority schema
 */
export declare const SettlementAuthoritySchema: any;
/**
 * Settlement Sequelize Model
 */
export declare class SettlementModel extends Model {
    id: string;
    settlementNumber: string;
    caseId: string;
    settlementType: SettlementType;
    status: SettlementStatus;
    totalAmount: number;
    currency: string;
    demandAmount?: number;
    offerAmount?: number;
    finalAmount?: number;
    description?: string;
    terms: SettlementTerms;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    executedAt?: Date;
    completedAt?: Date;
    metadata: SettlementMetadata;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    offers: SettlementOfferModel[];
    parties: SettlementPartyModel[];
    activities: NegotiationActivityModel[];
}
/**
 * Settlement Offer Sequelize Model
 */
export declare class SettlementOfferModel extends Model {
    id: string;
    settlementId: string;
    offerNumber: number;
    offerType: 'initial' | 'counter' | 'final';
    offeredBy: string;
    offeredByRole: NegotiationRole;
    amount: number;
    currency: string;
    terms: string;
    conditions: string[];
    validUntil?: Date;
    status: OfferStatus;
    responseDeadline?: Date;
    parentOfferId?: string;
    counterOffers: string[];
    rejectionReason?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    settlement: SettlementModel;
}
/**
 * Settlement Party Sequelize Model
 */
export declare class SettlementPartyModel extends Model {
    id: string;
    settlementId: string;
    role: NegotiationRole;
    entityType: 'individual' | 'organization';
    name: string;
    email?: string;
    phone?: string;
    organizationId?: string;
    userId?: string;
    authorityLimit?: number;
    signatureRequired: boolean;
    signedAt?: Date;
    signatureUrl?: string;
    isPrimary: boolean;
    metadata: Record<string, any>;
    settlement: SettlementModel;
}
/**
 * Negotiation Session Sequelize Model
 */
export declare class NegotiationSessionModel extends Model {
    id: string;
    settlementId: string;
    sessionNumber: number;
    sessionType: 'direct' | 'mediated' | 'virtual' | 'in_person';
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    participants: NegotiationParticipant[];
    agenda?: string;
    summary?: string;
    outcome?: string;
    nextSteps?: string[];
    attachments: string[];
    metadata: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Negotiation Activity Sequelize Model
 */
export declare class NegotiationActivityModel extends Model {
    id: string;
    settlementId: string;
    activityType: ActivityType;
    description: string;
    performedBy: string;
    performedByRole: NegotiationRole;
    relatedOfferId?: string;
    metadata: Record<string, any>;
    timestamp: Date;
    settlement: SettlementModel;
}
/**
 * Payment Plan Sequelize Model
 */
export declare class PaymentPlanModel extends Model {
    id: string;
    settlementId: string;
    totalAmount: number;
    currency: string;
    numberOfInstallments: number;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'custom';
    startDate: Date;
    endDate: Date;
    status: PaymentPlanStatus;
    latePaymentPenalty?: number;
    defaultGracePeriodDays: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    installments: PaymentInstallmentModel[];
}
/**
 * Payment Installment Sequelize Model
 */
export declare class PaymentInstallmentModel extends Model {
    id: string;
    paymentPlanId: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    paidAmount?: number;
    status: InstallmentStatus;
    paymentMethod?: string;
    transactionId?: string;
    receiptUrl?: string;
    lateFeesApplied?: number;
    metadata: Record<string, any>;
    paymentPlan: PaymentPlanModel;
}
/**
 * Settlement Authority Sequelize Model
 */
export declare class SettlementAuthorityModel extends Model {
    id: string;
    userId: string;
    role: string;
    minAmount: number;
    maxAmount: number;
    settlementTypes: SettlementType[];
    requiresApproval: boolean;
    approverUserId?: string;
    delegatedFrom?: string;
    effectiveFrom: Date;
    effectiveUntil?: Date;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Register settlement negotiation configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerSettlementConfig()],
 * })
 * ```
 */
export declare function registerSettlementConfig(): any;
/**
 * Create settlement negotiation configuration module
 *
 * @returns DynamicModule for settlement config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createSettlementConfigModule()],
 * })
 * export class SettlementModule {}
 * ```
 */
export declare function createSettlementConfigModule(): DynamicModule;
/**
 * Generate unique settlement number
 *
 * @param configService - Configuration service
 * @returns Unique settlement number
 *
 * @example
 * ```typescript
 * const settlementNumber = await generateSettlementNumber(configService);
 * // 'STL-2025-001234'
 * ```
 */
export declare function generateSettlementNumber(configService: ConfigService): Promise<string>;
/**
 * Create new settlement offer
 *
 * @param data - Settlement creation data
 * @param userId - User creating the settlement
 * @param configService - Configuration service
 * @returns Created settlement
 *
 * @example
 * ```typescript
 * const settlement = await createSettlementOffer({
 *   caseId: 'case_123',
 *   settlementType: SettlementType.MEDICAL_MALPRACTICE,
 *   demandAmount: 500000,
 *   terms: { ... },
 * }, 'user_456', configService);
 * ```
 */
export declare function createSettlementOffer(data: z.infer<typeof SettlementCreateSchema>, userId: string, configService: ConfigService): Promise<Settlement>;
/**
 * Update settlement offer
 *
 * @param settlementId - Settlement ID
 * @param updates - Settlement updates
 * @param userId - User updating the settlement
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await updateSettlementOffer('settlement_123', {
 *   offerAmount: 450000,
 *   status: SettlementStatus.UNDER_NEGOTIATION,
 * }, 'user_456', settlementRepo);
 * ```
 */
export declare function updateSettlementOffer(settlementId: string, updates: Partial<Settlement>, userId: string, repository: any): Promise<void>;
/**
 * Accept settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User accepting the offer
 * @param role - User's role in negotiation
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await acceptSettlementOffer('settlement_123', 'user_456', NegotiationRole.PLAINTIFF_ATTORNEY, settlementRepo);
 * ```
 */
export declare function acceptSettlementOffer(settlementId: string, userId: string, role: NegotiationRole, repository: any): Promise<void>;
/**
 * Reject settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User rejecting the offer
 * @param role - User's role in negotiation
 * @param reason - Rejection reason
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await rejectSettlementOffer('settlement_123', 'user_456', NegotiationRole.DEFENDANT_ATTORNEY, 'Amount too high', settlementRepo);
 * ```
 */
export declare function rejectSettlementOffer(settlementId: string, userId: string, role: NegotiationRole, reason: string, repository: any): Promise<void>;
/**
 * Create counter settlement offer
 *
 * @param settlementId - Original settlement ID
 * @param data - Counter offer data
 * @param userId - User making counter offer
 * @param role - User's role in negotiation
 * @param repository - Offer repository
 * @returns Created counter offer
 *
 * @example
 * ```typescript
 * const counterOffer = await counterSettlementOffer(
 *   'settlement_123',
 *   { amount: 400000, terms: '...', conditions: [] },
 *   'user_456',
 *   NegotiationRole.DEFENDANT_ATTORNEY,
 *   offerRepo
 * );
 * ```
 */
export declare function counterSettlementOffer(settlementId: string, data: z.infer<typeof SettlementOfferSchema>, userId: string, role: NegotiationRole, repository: any): Promise<SettlementOffer>;
/**
 * Withdraw settlement offer
 *
 * @param settlementId - Settlement ID
 * @param userId - User withdrawing the offer
 * @param reason - Withdrawal reason
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await withdrawSettlementOffer('settlement_123', 'user_456', 'Client decision', settlementRepo);
 * ```
 */
export declare function withdrawSettlementOffer(settlementId: string, userId: string, reason: string, repository: any): Promise<void>;
/**
 * Get settlement offer history
 *
 * @param settlementId - Settlement ID
 * @param repository - Offer repository
 * @returns Array of offers
 *
 * @example
 * ```typescript
 * const history = await getSettlementOfferHistory('settlement_123', offerRepo);
 * ```
 */
export declare function getSettlementOfferHistory(settlementId: string, repository: any): Promise<SettlementOffer[]>;
/**
 * Create negotiation session
 *
 * @param settlementId - Settlement ID
 * @param data - Session data
 * @param userId - User creating session
 * @param repository - Session repository
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createNegotiationSession(
 *   'settlement_123',
 *   {
 *     sessionType: 'mediated',
 *     scheduledAt: new Date('2025-02-15T10:00:00Z'),
 *     participants: [...],
 *   },
 *   'user_456',
 *   sessionRepo
 * );
 * ```
 */
export declare function createNegotiationSession(settlementId: string, data: z.infer<typeof NegotiationSessionSchema>, userId: string, repository: any): Promise<NegotiationSession>;
/**
 * Add negotiation note
 *
 * @param settlementId - Settlement ID
 * @param note - Note content
 * @param userId - User adding note
 * @param role - User's role
 * @param repository - Activity repository
 *
 * @example
 * ```typescript
 * await addNegotiationNote(
 *   'settlement_123',
 *   'Discussed payment terms...',
 *   'user_456',
 *   NegotiationRole.PLAINTIFF_ATTORNEY,
 *   activityRepo
 * );
 * ```
 */
export declare function addNegotiationNote(settlementId: string, note: string, userId: string, role: NegotiationRole, repository: any): Promise<void>;
/**
 * Track negotiation activity
 *
 * @param settlementId - Settlement ID
 * @param activityType - Type of activity
 * @param description - Activity description
 * @param userId - User performing activity
 * @param role - User's role
 * @param metadata - Additional metadata
 * @param repository - Activity repository
 *
 * @example
 * ```typescript
 * await trackNegotiationActivity(
 *   'settlement_123',
 *   ActivityType.OFFER_MADE,
 *   'Initial offer presented',
 *   'user_456',
 *   NegotiationRole.PLAINTIFF_ATTORNEY,
 *   { offerId: 'offer_789' },
 *   activityRepo
 * );
 * ```
 */
export declare function trackNegotiationActivity(settlementId: string, activityType: ActivityType, description: string, userId: string, role: NegotiationRole, metadata: Record<string, any>, repository: any): Promise<void>;
/**
 * Get negotiation timeline
 *
 * @param settlementId - Settlement ID
 * @param repository - Activity repository
 * @returns Array of activities in chronological order
 *
 * @example
 * ```typescript
 * const timeline = await getNegotiationTimeline('settlement_123', activityRepo);
 * ```
 */
export declare function getNegotiationTimeline(settlementId: string, repository: any): Promise<NegotiationActivity[]>;
/**
 * Calculate settlement range based on case factors
 *
 * @param caseId - Case ID
 * @param factors - Settlement factors
 * @param userId - User calculating range
 * @returns Settlement range calculation
 *
 * @example
 * ```typescript
 * const range = await calculateSettlementRange('case_123', [
 *   { name: 'medical_expenses', weight: 0.4, value: 200000, impact: 80000 },
 *   { name: 'lost_wages', weight: 0.3, value: 100000, impact: 30000 },
 *   { name: 'pain_suffering', weight: 0.3, value: 150000, impact: 45000 },
 * ], 'user_456');
 * ```
 */
export declare function calculateSettlementRange(caseId: string, factors: SettlementFactor[], userId: string): Promise<SettlementRange>;
/**
 * Evaluate settlement offer against calculated range
 *
 * @param offerId - Offer ID
 * @param range - Settlement range
 * @returns Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateSettlementOffer('offer_123', settlementRange);
 * ```
 */
export declare function evaluateSettlementOffer(offerId: string, range: SettlementRange): Promise<{
    recommendation: string;
    withinRange: boolean;
    percentOfRecommended: number;
}>;
/**
 * Check settlement authority for user
 *
 * @param userId - User ID
 * @param amount - Settlement amount
 * @param settlementType - Settlement type
 * @param repository - Authority repository
 * @returns Authority check result
 *
 * @example
 * ```typescript
 * const hasAuthority = await checkSettlementAuthority('user_123', 250000, SettlementType.MEDICAL_MALPRACTICE, authorityRepo);
 * ```
 */
export declare function checkSettlementAuthority(userId: string, amount: number, settlementType: SettlementType, repository: any): Promise<{
    authorized: boolean;
    requiresApproval: boolean;
    approverUserId?: string;
}>;
/**
 * Request settlement approval
 *
 * @param settlementId - Settlement ID
 * @param approverUserId - Approver user ID
 * @param comments - Request comments
 * @param userId - User requesting approval
 * @param repository - Approval repository
 * @returns Created approval request
 *
 * @example
 * ```typescript
 * const approval = await requestSettlementApproval(
 *   'settlement_123',
 *   'manager_456',
 *   'Amount exceeds authority limit',
 *   'user_789',
 *   approvalRepo
 * );
 * ```
 */
export declare function requestSettlementApproval(settlementId: string, approverUserId: string, comments: string, userId: string, repository: any): Promise<SettlementApproval>;
/**
 * Approve settlement
 *
 * @param approvalId - Approval ID
 * @param decision - Approval decision
 * @param comments - Approval comments
 * @param userId - User approving
 * @param repository - Approval repository
 *
 * @example
 * ```typescript
 * await approveSettlement('approval_123', ApprovalDecision.APPROVED, 'Approved based on case merits', 'manager_456', approvalRepo);
 * ```
 */
export declare function approveSettlement(approvalId: string, decision: ApprovalDecision, comments: string, userId: string, repository: any): Promise<void>;
/**
 * Reject settlement approval
 *
 * @param approvalId - Approval ID
 * @param reason - Rejection reason
 * @param userId - User rejecting
 * @param repository - Approval repository
 *
 * @example
 * ```typescript
 * await rejectSettlementApproval('approval_123', 'Amount too high for case value', 'manager_456', approvalRepo);
 * ```
 */
export declare function rejectSettlementApproval(approvalId: string, reason: string, userId: string, repository: any): Promise<void>;
/**
 * Delegate settlement authority
 *
 * @param fromUserId - User delegating authority
 * @param toUserId - User receiving authority
 * @param data - Authority configuration
 * @param repository - Authority repository
 * @returns Created authority delegation
 *
 * @example
 * ```typescript
 * const delegation = await delegateSettlementAuthority(
 *   'manager_123',
 *   'attorney_456',
 *   {
 *     userId: 'attorney_456',
 *     role: 'attorney',
 *     minAmount: 0,
 *     maxAmount: 50000,
 *     settlementTypes: [SettlementType.MEDICAL_MALPRACTICE],
 *     requiresApproval: false,
 *     effectiveFrom: new Date(),
 *     effectiveUntil: new Date('2025-12-31'),
 *   },
 *   authorityRepo
 * );
 * ```
 */
export declare function delegateSettlementAuthority(fromUserId: string, toUserId: string, data: z.infer<typeof SettlementAuthoritySchema>, repository: any): Promise<SettlementAuthority>;
/**
 * Create payment plan for settlement
 *
 * @param settlementId - Settlement ID
 * @param data - Payment plan data
 * @param userId - User creating plan
 * @returns Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan('settlement_123', {
 *   totalAmount: 300000,
 *   currency: 'USD',
 *   numberOfInstallments: 12,
 *   frequency: 'monthly',
 *   startDate: new Date('2025-03-01'),
 *   defaultGracePeriodDays: 5,
 * }, 'user_456');
 * ```
 */
export declare function createPaymentPlan(settlementId: string, data: z.infer<typeof PaymentPlanSchema>, userId: string): Promise<PaymentPlan>;
/**
 * Validate payment plan
 *
 * @param plan - Payment plan to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePaymentPlan(paymentPlan);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validatePaymentPlan(plan: PaymentPlan): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Calculate payment schedule
 *
 * @param totalAmount - Total payment amount
 * @param numberOfInstallments - Number of installments
 * @param startDate - Start date
 * @param frequency - Payment frequency
 * @returns Array of payment installments
 *
 * @example
 * ```typescript
 * const schedule = calculatePaymentSchedule(300000, 12, new Date('2025-03-01'), 'monthly');
 * ```
 */
export declare function calculatePaymentSchedule(totalAmount: number, numberOfInstallments: number, startDate: Date, frequency: string): PaymentInstallment[];
/**
 * Update payment status
 *
 * @param installmentId - Installment ID
 * @param status - Payment status
 * @param paidAmount - Amount paid
 * @param paymentDetails - Payment details
 * @param repository - Installment repository
 *
 * @example
 * ```typescript
 * await updatePaymentStatus(
 *   'installment_123',
 *   InstallmentStatus.PAID,
 *   25000,
 *   { paymentMethod: 'wire_transfer', transactionId: 'TXN123' },
 *   installmentRepo
 * );
 * ```
 */
export declare function updatePaymentStatus(installmentId: string, status: InstallmentStatus, paidAmount: number, paymentDetails: {
    paymentMethod?: string;
    transactionId?: string;
    receiptUrl?: string;
}, repository: any): Promise<void>;
/**
 * Get payment plan status
 *
 * @param paymentPlanId - Payment plan ID
 * @param repository - Payment plan repository
 * @returns Payment plan status summary
 *
 * @example
 * ```typescript
 * const status = await getPaymentPlanStatus('plan_123', planRepo);
 * console.log(`Paid: ${status.paidCount}/${status.totalCount}, Remaining: ${status.remainingAmount}`);
 * ```
 */
export declare function getPaymentPlanStatus(paymentPlanId: string, repository: any): Promise<{
    totalCount: number;
    paidCount: number;
    overdueCount: number;
    paidAmount: number;
    remainingAmount: number;
    completionPercentage: number;
}>;
/**
 * Generate release document
 *
 * @param settlementId - Settlement ID
 * @param releaseType - Type of release
 * @param variables - Template variables
 * @param userId - User generating document
 * @returns Generated release document
 *
 * @example
 * ```typescript
 * const release = await generateReleaseDocument(
 *   'settlement_123',
 *   ReleaseType.GENERAL_RELEASE,
 *   {
 *     plaintiffName: 'John Doe',
 *     defendantName: 'ABC Hospital',
 *     settlementAmount: 300000,
 *     releaseDate: new Date(),
 *   },
 *   'user_456'
 * );
 * ```
 */
export declare function generateReleaseDocument(settlementId: string, releaseType: ReleaseType, variables: Record<string, any>, userId: string): Promise<ReleaseDocument>;
/**
 * Generate settlement agreement
 *
 * @param settlementId - Settlement ID
 * @param variables - Agreement variables
 * @param userId - User generating agreement
 * @returns Generated settlement agreement
 *
 * @example
 * ```typescript
 * const agreement = await generateSettlementAgreement('settlement_123', {...}, 'user_456');
 * ```
 */
export declare function generateSettlementAgreement(settlementId: string, variables: Record<string, any>, userId: string): Promise<{
    content: string;
    documentUrl?: string;
}>;
/**
 * Validate release terms
 *
 * @param releaseDocument - Release document to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateReleaseTerms(releaseDoc);
 * ```
 */
export declare function validateReleaseTerms(releaseDocument: ReleaseDocument): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Execute settlement (finalize)
 *
 * @param settlementId - Settlement ID
 * @param userId - User executing settlement
 * @param repository - Settlement repository
 *
 * @example
 * ```typescript
 * await executeSettlement('settlement_123', 'user_456', settlementRepo);
 * ```
 */
export declare function executeSettlement(settlementId: string, userId: string, repository: any): Promise<void>;
/**
 * Record settlement payment
 *
 * @param settlementId - Settlement ID
 * @param amount - Payment amount
 * @param paymentMethod - Payment method
 * @param transactionId - Transaction ID
 * @param userId - User recording payment
 *
 * @example
 * ```typescript
 * await recordSettlementPayment(
 *   'settlement_123',
 *   300000,
 *   'wire_transfer',
 *   'TXN789',
 *   'user_456'
 * );
 * ```
 */
export declare function recordSettlementPayment(settlementId: string, amount: number, paymentMethod: string, transactionId: string, userId: string): Promise<void>;
/**
 * Search settlements with filters
 *
 * @param filters - Search filters
 * @param repository - Settlement repository
 * @returns Matching settlements
 *
 * @example
 * ```typescript
 * const settlements = await searchSettlements({
 *   settlementTypes: [SettlementType.MEDICAL_MALPRACTICE],
 *   statuses: [SettlementStatus.EXECUTED],
 *   minAmount: 100000,
 *   maxAmount: 1000000,
 * }, settlementRepo);
 * ```
 */
export declare function searchSettlements(filters: SettlementSearchFilters, repository: any): Promise<Settlement[]>;
/**
 * Get settlement by settlement number
 *
 * @param settlementNumber - Settlement number
 * @param repository - Settlement repository
 * @returns Settlement
 *
 * @example
 * ```typescript
 * const settlement = await getSettlementByNumber('STL-2025-001234', settlementRepo);
 * ```
 */
export declare function getSettlementByNumber(settlementNumber: string, repository: any): Promise<Settlement>;
/**
 * Get settlement analytics
 *
 * @param filters - Analytics filters
 * @param repository - Settlement repository
 * @returns Settlement analytics data
 *
 * @example
 * ```typescript
 * const analytics = await getSettlementAnalytics({ tenantId: 'tenant_123' }, settlementRepo);
 * ```
 */
export declare function getSettlementAnalytics(filters: Partial<SettlementSearchFilters>, repository: any): Promise<SettlementAnalytics>;
/**
 * Compare settlement offers
 *
 * @param offer1Id - First offer ID
 * @param offer2Id - Second offer ID
 * @param repository - Offer repository
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareSettlements('offer_123', 'offer_456', offerRepo);
 * ```
 */
export declare function compareSettlements(offer1Id: string, offer2Id: string, repository: any): Promise<SettlementComparison>;
/**
 * Calculate settlement metrics
 *
 * @param settlementId - Settlement ID
 * @param repository - Settlement repository
 * @returns Settlement metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateSettlementMetrics('settlement_123', settlementRepo);
 * ```
 */
export declare function calculateSettlementMetrics(settlementId: string, repository: any): Promise<{
    negotiationDuration?: number;
    numberOfOffers: number;
    demandToSettlementRatio?: number;
    timeToExecution?: number;
}>;
/**
 * Generate settlement report
 *
 * @param settlementId - Settlement ID
 * @param repository - Settlement repository
 * @returns Settlement report
 *
 * @example
 * ```typescript
 * const report = await generateSettlementReport('settlement_123', settlementRepo);
 * ```
 */
export declare function generateSettlementReport(settlementId: string, repository: any): Promise<{
    summary: string;
    details: Record<string, any>;
}>;
/**
 * Export settlement data
 *
 * @param filters - Export filters
 * @param format - Export format
 * @param repository - Settlement repository
 * @returns Exported data
 *
 * @example
 * ```typescript
 * const data = await exportSettlementData({ statuses: [SettlementStatus.EXECUTED] }, 'json', settlementRepo);
 * ```
 */
export declare function exportSettlementData(filters: SettlementSearchFilters, format: 'json' | 'csv', repository: any): Promise<string>;
/**
 * Settlement Negotiation Service
 * NestJS service for settlement operations with dependency injection
 */
export declare class SettlementNegotiationService {
    private settlementRepo;
    private offerRepo;
    private paymentPlanRepo;
    private authorityRepo;
    private activityRepo;
    private configService;
    private readonly logger;
    constructor(settlementRepo: typeof SettlementModel, offerRepo: typeof SettlementOfferModel, paymentPlanRepo: typeof PaymentPlanModel, authorityRepo: typeof SettlementAuthorityModel, activityRepo: typeof NegotiationActivityModel, configService: ConfigService);
    /**
     * Create new settlement
     */
    create(data: z.infer<typeof SettlementCreateSchema>, userId: string): Promise<Settlement>;
    /**
     * Get settlement by ID
     */
    findById(id: string): Promise<Settlement>;
    /**
     * Search settlements
     */
    search(filters: SettlementSearchFilters): Promise<Settlement[]>;
    /**
     * Create offer
     */
    createOffer(settlementId: string, data: z.infer<typeof SettlementOfferSchema>, userId: string, role: NegotiationRole): Promise<SettlementOffer>;
    /**
     * Create payment plan
     */
    createPaymentPlan(settlementId: string, data: z.infer<typeof PaymentPlanSchema>, userId: string): Promise<PaymentPlan>;
    /**
     * Get analytics
     */
    getAnalytics(filters: Partial<SettlementSearchFilters>): Promise<SettlementAnalytics>;
}
/**
 * Settlement DTO for API documentation
 */
export declare class SettlementDto {
    id: string;
    settlementNumber: string;
    caseId: string;
    settlementType: SettlementType;
    status: SettlementStatus;
    totalAmount: number;
    currency: string;
    demandAmount?: number;
    offerAmount?: number;
}
/**
 * Create Settlement DTO
 */
export declare class CreateSettlementDto {
    caseId: string;
    settlementType: SettlementType;
    demandAmount?: number;
    offerAmount?: number;
    description?: string;
    currency: string;
}
/**
 * Settlement Offer DTO
 */
export declare class SettlementOfferDto {
    id: string;
    settlementId: string;
    offerNumber: number;
    offerType: string;
    amount: number;
    status: OfferStatus;
}
/**
 * Payment Plan DTO
 */
export declare class PaymentPlanDto {
    id: string;
    settlementId: string;
    totalAmount: number;
    numberOfInstallments: number;
    frequency: string;
    status: PaymentPlanStatus;
}
declare const _default: {
    registerSettlementConfig: typeof registerSettlementConfig;
    createSettlementConfigModule: typeof createSettlementConfigModule;
    generateSettlementNumber: typeof generateSettlementNumber;
    createSettlementOffer: typeof createSettlementOffer;
    updateSettlementOffer: typeof updateSettlementOffer;
    acceptSettlementOffer: typeof acceptSettlementOffer;
    rejectSettlementOffer: typeof rejectSettlementOffer;
    counterSettlementOffer: typeof counterSettlementOffer;
    withdrawSettlementOffer: typeof withdrawSettlementOffer;
    getSettlementOfferHistory: typeof getSettlementOfferHistory;
    createNegotiationSession: typeof createNegotiationSession;
    addNegotiationNote: typeof addNegotiationNote;
    trackNegotiationActivity: typeof trackNegotiationActivity;
    getNegotiationTimeline: typeof getNegotiationTimeline;
    calculateSettlementRange: typeof calculateSettlementRange;
    evaluateSettlementOffer: typeof evaluateSettlementOffer;
    checkSettlementAuthority: typeof checkSettlementAuthority;
    requestSettlementApproval: typeof requestSettlementApproval;
    approveSettlement: typeof approveSettlement;
    rejectSettlementApproval: typeof rejectSettlementApproval;
    delegateSettlementAuthority: typeof delegateSettlementAuthority;
    createPaymentPlan: typeof createPaymentPlan;
    validatePaymentPlan: typeof validatePaymentPlan;
    calculatePaymentSchedule: typeof calculatePaymentSchedule;
    updatePaymentStatus: typeof updatePaymentStatus;
    getPaymentPlanStatus: typeof getPaymentPlanStatus;
    generateReleaseDocument: typeof generateReleaseDocument;
    generateSettlementAgreement: typeof generateSettlementAgreement;
    validateReleaseTerms: typeof validateReleaseTerms;
    executeSettlement: typeof executeSettlement;
    recordSettlementPayment: typeof recordSettlementPayment;
    searchSettlements: typeof searchSettlements;
    getSettlementByNumber: typeof getSettlementByNumber;
    getSettlementAnalytics: typeof getSettlementAnalytics;
    compareSettlements: typeof compareSettlements;
    calculateSettlementMetrics: typeof calculateSettlementMetrics;
    generateSettlementReport: typeof generateSettlementReport;
    exportSettlementData: typeof exportSettlementData;
    SettlementNegotiationService: typeof SettlementNegotiationService;
};
export default _default;
//# sourceMappingURL=settlement-negotiation-kit.d.ts.map