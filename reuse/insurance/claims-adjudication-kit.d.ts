/**
 * LOC: INS-ADJUDICATION-001
 * File: /reuse/insurance/claims-adjudication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Claims backend services
 *   - Adjudication workflow modules
 *   - Settlement processing systems
 *   - Litigation management
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Adjudication status
 */
export declare enum AdjudicationStatus {
    PENDING_REVIEW = "pending_review",
    UNDER_INVESTIGATION = "under_investigation",
    COVERAGE_VERIFIED = "coverage_verified",
    LIABILITY_DETERMINED = "liability_determined",
    VALUATION_COMPLETE = "valuation_complete",
    SETTLEMENT_OFFERED = "settlement_offered",
    SETTLEMENT_ACCEPTED = "settlement_accepted",
    SETTLEMENT_REJECTED = "settlement_rejected",
    DENIED = "denied",
    LITIGATION = "litigation",
    CLOSED = "closed"
}
/**
 * Coverage decision
 */
export declare enum CoverageDecision {
    COVERED = "covered",
    NOT_COVERED = "not_covered",
    PARTIALLY_COVERED = "partially_covered",
    PENDING_INVESTIGATION = "pending_investigation",
    RESERVATION_OF_RIGHTS = "reservation_of_rights"
}
/**
 * Liability determination
 */
export declare enum LiabilityDetermination {
    FULL_LIABILITY = "full_liability",
    NO_LIABILITY = "no_liability",
    COMPARATIVE_NEGLIGENCE = "comparative_negligence",
    CONTRIBUTORY_NEGLIGENCE = "contributory_negligence",
    JOINT_AND_SEVERAL = "joint_and_several",
    STRICT_LIABILITY = "strict_liability",
    VICARIOUS_LIABILITY = "vicarious_liability"
}
/**
 * Valuation method
 */
export declare enum ValuationMethod {
    ACTUAL_CASH_VALUE = "actual_cash_value",
    REPLACEMENT_COST = "replacement_cost",
    AGREED_VALUE = "agreed_value",
    STATED_VALUE = "stated_value",
    MARKET_VALUE = "market_value",
    FUNCTIONAL_REPLACEMENT = "functional_replacement"
}
/**
 * Settlement type
 */
export declare enum SettlementType {
    LUMP_SUM = "lump_sum",
    STRUCTURED_SETTLEMENT = "structured_settlement",
    PERIODIC_PAYMENTS = "periodic_payments",
    ANNUITY = "annuity",
    MEDICAL_SET_ASIDE = "medical_set_aside"
}
/**
 * Denial reason
 */
export declare enum DenialReason {
    NO_COVERAGE = "no_coverage",
    POLICY_EXCLUSION = "policy_exclusion",
    POLICY_LAPSED = "policy_lapsed",
    MATERIAL_MISREPRESENTATION = "material_misrepresentation",
    FRAUD = "fraud",
    LATE_REPORTING = "late_reporting",
    OUTSIDE_POLICY_PERIOD = "outside_policy_period",
    INSUFFICIENT_EVIDENCE = "insufficient_evidence",
    CONTRIBUTORY_NEGLIGENCE = "contributory_negligence",
    INTENTIONAL_ACT = "intentional_act"
}
/**
 * Total loss type
 */
export declare enum TotalLossType {
    ACTUAL_TOTAL_LOSS = "actual_total_loss",
    CONSTRUCTIVE_TOTAL_LOSS = "constructive_total_loss",
    ECONOMIC_TOTAL_LOSS = "economic_total_loss",
    NOT_TOTAL_LOSS = "not_total_loss"
}
/**
 * Coverage verification request
 */
export interface CoverageVerificationRequest {
    claimId: string;
    policyId: string;
    lossDate: Date;
    lossType: string;
    lossLocation?: string;
    claimAmount: number;
}
/**
 * Coverage verification result
 */
export interface CoverageVerificationResult {
    coverageDecision: CoverageDecision;
    applicableCoverages: string[];
    excludedCoverages: string[];
    policyInForce: boolean;
    withinCoveragePeriod: boolean;
    withinReportingRequirements: boolean;
    deductibleAmount: number;
    coverageLimit: number;
    remainingLimit: number;
    coinsurancePercentage?: number;
    verificationNotes: string;
    verifiedBy: string;
    verifiedAt: Date;
}
/**
 * Liability assessment data
 */
export interface LiabilityAssessmentData {
    claimId: string;
    insuredPercentage: number;
    claimantPercentage: number;
    thirdPartyPercentages?: Map<string, number>;
    jursdictionRules: string;
    factorsConsidered: string[];
    evidenceReviewed: string[];
}
/**
 * Liability assessment result
 */
export interface LiabilityAssessmentResult {
    determination: LiabilityDetermination;
    insuredLiabilityPercentage: number;
    claimantLiabilityPercentage: number;
    totalDamages: number;
    insuredResponsibility: number;
    claimantResponsibility: number;
    assessmentRationale: string;
    assessedBy: string;
    assessedAt: Date;
}
/**
 * Claim valuation data
 */
export interface ClaimValuationData {
    claimId: string;
    valuationMethod: ValuationMethod;
    propertyValue?: number;
    damageEstimate: number;
    salvageValue?: number;
    depreciation?: number;
    medicalExpenses?: number;
    lostWages?: number;
    painAndSuffering?: number;
    additionalLivingExpenses?: number;
}
/**
 * Claim valuation result
 */
export interface ClaimValuationResult {
    totalValuation: number;
    actualCashValue?: number;
    replacementCost?: number;
    lessDeductible: number;
    lessPriorPayments: number;
    netSettlementAmount: number;
    valuationBreakdown: Record<string, number>;
    valuationDate: Date;
    valuedBy: string;
}
/**
 * Settlement offer data
 */
export interface SettlementOfferData {
    claimId: string;
    offerAmount: number;
    settlementType: SettlementType;
    paymentSchedule?: Array<{
        date: Date;
        amount: number;
    }>;
    conditions?: string[];
    validUntil: Date;
    offeredBy: string;
}
/**
 * Settlement offer result
 */
export interface SettlementOfferResult {
    offerId: string;
    claimId: string;
    offerAmount: number;
    settlementType: SettlementType;
    offerStatus: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
    offerDate: Date;
    validUntil: Date;
    responseDate?: Date;
    responseBy?: string;
    counterOffer?: number;
    acceptanceTerms?: string;
}
/**
 * Structured settlement configuration
 */
export interface StructuredSettlementConfig {
    totalAmount: number;
    initialPayment: number;
    periodicPaymentAmount: number;
    paymentFrequency: 'monthly' | 'quarterly' | 'annually';
    numberOfPayments: number;
    guaranteedPeriodYears: number;
    costOfLivingAdjustment: boolean;
    colaPercentage?: number;
    beneficiaryDesignation: string;
}
/**
 * Denial letter data
 */
export interface DenialLetterData {
    claimId: string;
    denialReason: DenialReason;
    policyProvisions: string[];
    explanationOfDecision: string;
    appealRights: string;
    appealDeadline: Date;
    deniedBy: string;
}
/**
 * Reservation of rights notice
 */
export interface ReservationOfRightsNotice {
    claimId: string;
    reservedIssues: string[];
    coverageQuestionsOutstanding: string[];
    investigationScope: string;
    policyProvisionsAtIssue: string[];
    expectedCompletionDate: Date;
    interimCoveragePosition: string;
    issuedBy: string;
}
/**
 * Total loss determination data
 */
export interface TotalLossDeterminationData {
    propertyValue: number;
    repairCost: number;
    salvageValue: number;
    totalLossThresholdPercentage: number;
    additionalFactors?: string[];
}
/**
 * Total loss determination result
 */
export interface TotalLossDeterminationResult {
    isTotalLoss: boolean;
    totalLossType: TotalLossType;
    propertyValue: number;
    repairCost: number;
    salvageValue: number;
    repairCostPercentage: number;
    totalLossThreshold: number;
    settlementAmount: number;
    settlementCalculation: string;
    determinedBy: string;
    determinedAt: Date;
}
/**
 * Claims adjudication model
 */
export declare class ClaimsAdjudication extends Model {
    id: string;
    claim_id: string;
    policy_id: string;
    adjudication_status: AdjudicationStatus;
    coverage_decision: CoverageDecision;
    liability_determination: LiabilityDetermination;
    insured_liability_percentage: number;
    total_damages: number;
    settlement_amount: number;
    settlement_type: SettlementType;
    deductible_amount: number;
    policy_limit: number;
    valuation_method: ValuationMethod;
    is_total_loss: boolean;
    denial_reason: DenialReason;
    adjudication_notes: string;
    supporting_documents: string[];
    adjudicated_by: string;
    adjudication_date: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
/**
 * Settlement offers model
 */
export declare class SettlementOffer extends Model {
    id: string;
    claim_id: string;
    offer_amount: number;
    settlement_type: SettlementType;
    offer_status: string;
    payment_schedule: Array<{
        date: Date;
        amount: number;
    }>;
    conditions: string[];
    offer_date: Date;
    valid_until: Date;
    offered_by: string;
    response_date: Date;
    response_by: string;
    counter_offer: number;
    acceptance_terms: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
/**
 * Verifies coverage for a claim
 *
 * @param request - Coverage verification request
 * @param transaction - Optional database transaction
 * @returns Coverage verification result
 *
 * @example
 * ```typescript
 * const coverageResult = await verifyCoverage({
 *   claimId: 'claim-123',
 *   policyId: 'policy-456',
 *   lossDate: new Date('2024-06-15'),
 *   lossType: 'collision',
 *   claimAmount: 15000
 * });
 * ```
 */
export declare function verifyCoverage(request: CoverageVerificationRequest, transaction?: Transaction): Promise<CoverageVerificationResult>;
/**
 * Analyzes coverage gaps and exclusions
 */
export declare function analyzeCoverageGaps(policyId: string, claimType: string, transaction?: Transaction): Promise<{
    hasGaps: boolean;
    gaps: string[];
    recommendations: string[];
}>;
/**
 * Checks policy limits and remaining capacity
 */
export declare function checkPolicyLimits(policyId: string, coverageType: string, requestedAmount: number, transaction?: Transaction): Promise<{
    withinLimits: boolean;
    coverageLimit: number;
    usedAmount: number;
    remainingAmount: number;
}>;
/**
 * Issues reservation of rights notice
 */
export declare function issueReservationOfRights(notice: ReservationOfRightsNotice, transaction?: Transaction): Promise<{
    noticeId: string;
    issuedAt: Date;
}>;
/**
 * Determines liability allocation
 */
export declare function determineLiability(assessment: LiabilityAssessmentData, transaction?: Transaction): Promise<LiabilityAssessmentResult>;
/**
 * Calculates comparative negligence
 */
export declare function calculateComparativeNegligence(insuredFaultPercentage: number, claimantFaultPercentage: number, totalDamages: number, jurisdiction: 'pure' | 'modified' | 'contributory'): Promise<{
    insuredOwes: number;
    claimantOwes: number;
    barredRecovery: boolean;
}>;
/**
 * Evaluates vicarious liability
 */
export declare function evaluateVicariousLiability(employerRelationship: boolean, scopeOfEmployment: boolean, agencyRelationship: boolean): Promise<{}>;
/**
 * Values claim using specified method
 */
export declare function valueClaim(data: ClaimValuationData, transaction?: Transaction): Promise<ClaimValuationResult>;
/**
 * Calculates Actual Cash Value (ACV)
 */
export declare function calculateActualCashValue(replacementCost: number, age: number, usefulLife: number, condition: 'excellent' | 'good' | 'fair' | 'poor'): Promise<{
    acv: number;
    depreciation: number;
    depreciationPercentage: number;
}>;
/**
 * Calculates Replacement Cost Value (RCV)
 */
export declare function calculateReplacementCostValue(itemDescription: string, quantity: number, unitCost: number, inflationRate?: number): Promise<{
    rcv: number;
    unitCost: number;
    totalCost: number;
}>;
/**
 * Applies deductible to claim valuation
 */
export declare function applyDeductible(claimValue: number, deductibleAmount: number, deductibleType: 'flat' | 'percentage', deductiblePercentage?: number): Promise<{
    netAmount: number;
    deductibleApplied: number;
}>;
/**
 * Applies policy limits to valuation
 */
export declare function applyPolicyLimits(claimValue: number, perOccurrenceLimit: number, aggregateLimit: number, previousPayments: number): Promise<{
    payableAmount: number;
    excessAmount: number;
    withinLimits: boolean;
}>;
/**
 * Generates settlement offer
 */
export declare function generateSettlementOffer(data: SettlementOfferData, transaction?: Transaction): Promise<SettlementOfferResult>;
/**
 * Accepts settlement offer
 */
export declare function acceptSettlementOffer(offerId: string, acceptedBy: string, acceptanceTerms?: string, transaction?: Transaction): Promise<SettlementOfferResult>;
/**
 * Rejects settlement offer
 */
export declare function rejectSettlementOffer(offerId: string, rejectedBy: string, counterOffer?: number, transaction?: Transaction): Promise<SettlementOfferResult>;
/**
 * Configures structured settlement
 */
export declare function configureStructuredSettlement(config: StructuredSettlementConfig): Promise<{
    presentValue: number;
    futureValue: number;
    paymentSchedule: Array<{
        date: Date;
        amount: number;
    }>;
}>;
/**
 * Calculates settlement authority level
 */
export declare function calculateSettlementAuthority(claimValue: number, adjusterLevel: 'trainee' | 'junior' | 'senior' | 'supervisor' | 'manager'): Promise<{
    hasAuthority: boolean;
    authorityLimit: number;
    requiresApproval: boolean;
    approverLevel?: string;
}>;
/**
 * Generates claim denial letter
 */
export declare function generateDenialLetter(data: DenialLetterData, transaction?: Transaction): Promise<{
    letterId: string;
    denialDate: Date;
    appealDeadline: Date;
}>;
/**
 * Processes denial appeal
 */
export declare function processDenialAppeal(claimId: string, appealReason: string, supportingDocuments: string[], appealedBy: string, transaction?: Transaction): Promise<{
    appealId: string;
    appealStatus: 'pending' | 'under_review';
    reviewDeadline: Date;
}>;
/**
 * Determines if claim is total loss
 */
export declare function determineTotalLoss(data: TotalLossDeterminationData, transaction?: Transaction): Promise<TotalLossDeterminationResult>;
/**
 * Calculates total loss settlement
 */
export declare function calculateTotalLossSettlement(actualCashValue: number, salvageValue: number, deductible: number, priorDamage?: number): Promise<{
    grossSettlement: number;
    lessSalvage: number;
    lessDeductible: number;
    lessPriorDamage: number;
    netSettlement: number;
}>;
/**
 * Tracks claim negotiation progress
 */
export declare function trackNegotiation(claimId: string, demandAmount: number, offerAmount: number, round: number): Promise<{
    negotiationGap: number;
    gapPercentage: number;
    convergenceRate: number;
    recommendation: string;
}>;
/**
 * Calculates settlement recommendation
 */
export declare function calculateSettlementRecommendation(claimValuation: number, liabilityPercentage: number, litigationCostEstimate: number, successProbability: number): Promise<{
    recommendedAmount: number;
    rationale: string;
    confidenceLevel: 'high' | 'medium' | 'low';
}>;
//# sourceMappingURL=claims-adjudication-kit.d.ts.map