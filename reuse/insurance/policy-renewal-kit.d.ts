/**
 * LOC: INS-RNW-001
 * File: /reuse/insurance/policy-renewal-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - @nestjs/schedule
 *   - nodemailer
 *
 * DOWNSTREAM (imported by):
 *   - Policy services
 *   - Renewal controllers
 *   - Underwriting modules
 *   - Retention analytics services
 */
/**
 * File: /reuse/insurance/policy-renewal-kit.ts
 * Locator: WC-INS-POLREN-001
 * Purpose: Policy Renewal Management Kit - Comprehensive renewal utilities for insurance platforms
 *
 * Upstream: @nestjs/common, @nestjs/config, sequelize, @nestjs/schedule, nodemailer
 * Downstream: Policy services, renewal controllers, underwriting modules, retention analytics
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, @nestjs/schedule 4.x
 * Exports: 40 utility functions for renewal invitations, quotes, underwriting, rate calculations, declinations, notices, automation, negotiation, incentives, multi-year policies
 *
 * LLM Context: Production-grade policy renewal management utilities for enterprise insurance platforms.
 * Provides renewal invitation generation, quote preparation, underwriting review, rate change calculations,
 * declination management, non-renewal notices, automatic renewal processing, negotiation tracking,
 * retention incentives, multi-year policy handling, documentation generation, payment scheduling,
 * early renewal options, analytics, and cross-sell opportunities at renewal time.
 * Essential for managing the complete policy renewal lifecycle, maximizing retention rates,
 * and ensuring compliance with regulatory requirements for timely renewal notifications.
 */
import { Sequelize } from 'sequelize';
/**
 * Policy renewal configuration from environment
 */
export interface RenewalConfigEnv {
    RENEWAL_NOTICE_DAYS_ADVANCE: string;
    NON_RENEWAL_NOTICE_DAYS: string;
    EARLY_RENEWAL_DAYS_BEFORE: string;
    AUTO_RENEWAL_ENABLED: string;
    RETENTION_INCENTIVE_MAX_DISCOUNT: string;
    MULTI_YEAR_RENEWAL_ENABLED: string;
    RENEWAL_QUOTE_VALIDITY_DAYS: string;
    UNDERWRITING_REVIEW_REQUIRED: string;
    RENEWAL_GRACE_PERIOD_DAYS: string;
    CROSS_SELL_AT_RENEWAL: string;
}
/**
 * Loads policy renewal configuration from environment variables.
 *
 * @returns {RenewalConfig} Renewal configuration object
 *
 * @example
 * ```typescript
 * const config = loadRenewalConfig();
 * console.log('Auto renewal enabled:', config.autoRenewalEnabled);
 * ```
 */
export declare const loadRenewalConfig: () => RenewalConfig;
/**
 * Validates renewal configuration.
 *
 * @param {RenewalConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateRenewalConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
export declare const validateRenewalConfig: (config: RenewalConfig) => string[];
/**
 * Renewal configuration
 */
export interface RenewalConfig {
    renewalNoticeDaysAdvance: number;
    nonRenewalNoticeDays: number;
    earlyRenewalDaysBefore: number;
    autoRenewalEnabled: boolean;
    retentionIncentiveMaxDiscount: number;
    multiYearRenewalEnabled: boolean;
    renewalQuoteValidityDays: number;
    underwritingReviewRequired: boolean;
    renewalGracePeriodDays: number;
    crossSellAtRenewal: boolean;
}
/**
 * Renewal status types
 */
export type RenewalStatus = 'pending_invitation' | 'invitation_sent' | 'quote_prepared' | 'underwriting_review' | 'quote_issued' | 'negotiating' | 'accepted' | 'declined' | 'non_renewed' | 'renewed' | 'lapsed';
/**
 * Renewal decision types
 */
export type RenewalDecision = 'renew' | 'non_renew' | 'conditional_renew' | 'pending';
/**
 * Rate change reason types
 */
export type RateChangeReason = 'claims_experience' | 'industry_trend' | 'regulatory_change' | 'risk_reassessment' | 'coverage_modification' | 'underwriting_criteria' | 'market_conditions' | 'loss_ratio_adjustment';
/**
 * Policy renewal invitation
 */
export interface RenewalInvitation {
    id?: string;
    policyId: string;
    policyNumber: string;
    policyHolderId: string;
    currentExpirationDate: Date;
    proposedRenewalDate: Date;
    invitationSentDate?: Date;
    responseDeadline: Date;
    status: RenewalStatus;
    preferredContactMethod: 'email' | 'mail' | 'phone' | 'portal';
    agentId?: string;
    metadata?: Record<string, any>;
}
/**
 * Renewal quote information
 */
export interface RenewalQuote {
    id?: string;
    renewalId: string;
    policyId: string;
    quoteNumber: string;
    currentPremium: number;
    proposedPremium: number;
    premiumChange: number;
    premiumChangePercent: number;
    rateChangeReasons: RateChangeReason[];
    coverageChanges: CoverageChange[];
    effectiveDate: Date;
    expirationDate: Date;
    quoteValidUntil: Date;
    termsAndConditions: string;
    bindDeadline: Date;
    generatedAt: Date;
    generatedBy: string;
}
/**
 * Coverage change details
 */
export interface CoverageChange {
    coverageType: string;
    currentLimit?: number;
    proposedLimit?: number;
    currentDeductible?: number;
    proposedDeductible?: number;
    action: 'added' | 'removed' | 'modified' | 'unchanged';
    premiumImpact: number;
    reason?: string;
}
/**
 * Underwriting review for renewal
 */
export interface RenewalUnderwritingReview {
    id?: string;
    renewalId: string;
    policyId: string;
    reviewerId: string;
    reviewStartDate: Date;
    reviewCompletedDate?: Date;
    claimsHistory: ClaimsSummary;
    lossRatio: number;
    riskScore: number;
    underwritingDecision: RenewalDecision;
    conditions: string[];
    rateModifications: RateModification[];
    notes: string;
    requiresManualReview: boolean;
}
/**
 * Claims summary for renewal review
 */
export interface ClaimsSummary {
    totalClaimsCount: number;
    totalClaimsAmount: number;
    claimsInLastYear: number;
    claimFrequency: number;
    averageClaimSeverity: number;
    largestClaim: number;
    openClaimsCount: number;
    claimTypes: Map<string, number>;
}
/**
 * Rate modification details
 */
export interface RateModification {
    factor: string;
    currentValue: number;
    proposedValue: number;
    impact: number;
    reason: RateChangeReason;
    justification: string;
}
/**
 * Non-renewal notice
 */
export interface NonRenewalNotice {
    id?: string;
    policyId: string;
    policyNumber: string;
    policyHolderId: string;
    expirationDate: Date;
    noticeSentDate: Date;
    reason: NonRenewalReason;
    detailedExplanation: string;
    regulatoryCompliance: RegulatoryCompliance;
    appealDeadline?: Date;
    alternativeOptions?: string[];
    sentBy: string;
}
/**
 * Non-renewal reason types
 */
export type NonRenewalReason = 'excessive_claims' | 'underwriting_criteria' | 'non_payment' | 'misrepresentation' | 'regulatory_requirement' | 'business_decision' | 'risk_appetite_change' | 'coverage_unavailable';
/**
 * Regulatory compliance tracking
 */
export interface RegulatoryCompliance {
    jurisdiction: string;
    minimumNoticeDays: number;
    actualNoticeDays: number;
    isCompliant: boolean;
    filingNumber?: string;
    approvalDate?: Date;
    complianceNotes: string[];
}
/**
 * Renewal negotiation tracking
 */
export interface RenewalNegotiation {
    id?: string;
    renewalId: string;
    policyId: string;
    initiatedDate: Date;
    currentOffer: NegotiationOffer;
    previousOffers: NegotiationOffer[];
    policyholderRequests: string[];
    status: 'active' | 'accepted' | 'rejected' | 'abandoned';
    assignedNegotiator: string;
    lastActivityDate: Date;
    resolutionDate?: Date;
}
/**
 * Negotiation offer details
 */
export interface NegotiationOffer {
    offerNumber: number;
    premium: number;
    coverageLimits: Map<string, number>;
    deductibles: Map<string, number>;
    specialTerms: string[];
    validUntil: Date;
    offeredBy: 'insurer' | 'policyholder';
    offeredAt: Date;
}
/**
 * Retention incentive
 */
export interface RetentionIncentive {
    id?: string;
    renewalId: string;
    policyId: string;
    incentiveType: IncentiveType;
    discountAmount: number;
    discountPercent: number;
    conditions: string[];
    validFrom: Date;
    validUntil: Date;
    approved: boolean;
    approvedBy?: string;
    redemptionStatus: 'pending' | 'applied' | 'expired' | 'declined';
}
/**
 * Retention incentive types
 */
export type IncentiveType = 'loyalty_discount' | 'multi_policy_discount' | 'claims_free_discount' | 'early_renewal_discount' | 'payment_plan_discount' | 'enhanced_coverage_upgrade' | 'waived_deductible';
/**
 * Multi-year renewal policy
 */
export interface MultiYearRenewal {
    id?: string;
    policyId: string;
    termYears: number;
    annualPremiums: number[];
    totalPremium: number;
    premiumGuarantee: boolean;
    rateAdjustmentCap?: number;
    earlyTerminationPenalty?: number;
    renewalDates: Date[];
    specialTerms: string[];
    savingsVsAnnual: number;
}
/**
 * Renewal payment schedule
 */
export interface RenewalPaymentSchedule {
    id?: string;
    renewalId: string;
    policyId: string;
    totalPremium: number;
    paymentFrequency: 'annual' | 'semi_annual' | 'quarterly' | 'monthly';
    installmentAmount: number;
    numberOfInstallments: number;
    paymentDates: Date[];
    downPayment: number;
    installmentFee: number;
    totalWithFees: number;
}
/**
 * Renewal analytics data
 */
export interface RenewalAnalytics {
    periodStart: Date;
    periodEnd: Date;
    totalPoliciesExpiring: number;
    renewalInvitationsSent: number;
    quotesIssued: number;
    policiesRenewed: number;
    policiesNonRenewed: number;
    policiesLapsed: number;
    retentionRate: number;
    averagePremiumChange: number;
    totalPremiumRenewed: number;
    incentivesOffered: number;
    incentivesRedeemed: number;
    averageNegotiationDuration: number;
    topNonRenewalReasons: Map<NonRenewalReason, number>;
}
/**
 * Cross-sell opportunity at renewal
 */
export interface RenewalCrossSellOpportunity {
    id?: string;
    renewalId: string;
    policyId: string;
    policyHolderId: string;
    recommendedProducts: RecommendedProduct[];
    eligibilityScore: number;
    bundleDiscount?: number;
    presentedDate?: Date;
    response?: 'interested' | 'not_interested' | 'pending';
    followUpScheduled?: Date;
}
/**
 * Recommended product for cross-sell
 */
export interface RecommendedProduct {
    productCode: string;
    productName: string;
    estimatedPremium: number;
    coverageHighlights: string[];
    relevanceScore: number;
    bundleCompatible: boolean;
}
/**
 * Renewal invitation model attributes
 */
export interface RenewalInvitationAttributes {
    id: string;
    policyId: string;
    policyNumber: string;
    policyHolderId: string;
    currentExpirationDate: Date;
    proposedRenewalDate: Date;
    invitationSentDate?: Date;
    responseDeadline: Date;
    status: string;
    preferredContactMethod: string;
    agentId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates RenewalInvitation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RenewalInvitationAttributes>>} RenewalInvitation model
 *
 * @example
 * ```typescript
 * const RenewalInvitationModel = createRenewalInvitationModel(sequelize);
 * const invitation = await RenewalInvitationModel.create({
 *   policyId: 'pol-123',
 *   policyNumber: 'POL-2024-12345',
 *   policyHolderId: 'holder-456',
 *   currentExpirationDate: new Date('2025-12-31'),
 *   proposedRenewalDate: new Date('2026-01-01'),
 *   responseDeadline: new Date('2025-11-15'),
 *   status: 'pending_invitation'
 * });
 * ```
 */
export declare const createRenewalInvitationModel: (sequelize: Sequelize) => any;
/**
 * Renewal quote model attributes
 */
export interface RenewalQuoteAttributes {
    id: string;
    renewalId: string;
    policyId: string;
    quoteNumber: string;
    currentPremium: number;
    proposedPremium: number;
    premiumChange: number;
    premiumChangePercent: number;
    rateChangeReasons: string[];
    coverageChanges: Record<string, any>[];
    effectiveDate: Date;
    expirationDate: Date;
    quoteValidUntil: Date;
    termsAndConditions: string;
    bindDeadline: Date;
    generatedAt: Date;
    generatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates RenewalQuote model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RenewalQuoteAttributes>>} RenewalQuote model
 *
 * @example
 * ```typescript
 * const RenewalQuoteModel = createRenewalQuoteModel(sequelize);
 * const quote = await RenewalQuoteModel.create({
 *   renewalId: 'ren-123',
 *   policyId: 'pol-456',
 *   quoteNumber: 'RQ-2024-98765',
 *   currentPremium: 1200.00,
 *   proposedPremium: 1350.00,
 *   premiumChange: 150.00,
 *   premiumChangePercent: 12.5
 * });
 * ```
 */
export declare const createRenewalQuoteModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates renewal invitation for policy.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Partial<RenewalInvitation>} [options] - Additional invitation options
 * @returns {Promise<RenewalInvitation>} Generated renewal invitation
 * @throws {Error} If policy not found or not eligible for renewal
 *
 * @example
 * ```typescript
 * const invitation = await generateRenewalInvitation('pol-123', {
 *   preferredContactMethod: 'email',
 *   agentId: 'agent-456'
 * });
 * console.log('Invitation ID:', invitation.id);
 * ```
 *
 * @see {@link sendRenewalInvitation} for sending the invitation
 * @see {@link batchGenerateRenewalInvitations} for bulk generation
 */
export declare const generateRenewalInvitation: (policyId: string, options?: Partial<RenewalInvitation>) => Promise<RenewalInvitation>;
/**
 * 2. Sends renewal invitation to policyholder.
 *
 * @async
 * @param {string} invitationId - Invitation ID
 * @param {Object} [deliveryOptions] - Delivery options
 * @returns {Promise<{ sent: boolean; sentDate: Date; deliveryMethod: string }>} Delivery status
 * @throws {Error} If invitation not found or already sent
 *
 * @example
 * ```typescript
 * const result = await sendRenewalInvitation('inv-123', {
 *   includeQuote: true,
 *   priority: 'high'
 * });
 * console.log('Sent via:', result.deliveryMethod);
 * ```
 *
 * @see {@link trackRenewalInvitationDelivery} for delivery tracking
 */
export declare const sendRenewalInvitation: (invitationId: string, deliveryOptions?: {
    includeQuote?: boolean;
    priority?: "normal" | "high";
}) => Promise<{
    sent: boolean;
    sentDate: Date;
    deliveryMethod: string;
}>;
/**
 * 3. Batch generates renewal invitations for expiring policies.
 *
 * @async
 * @param {Date} expirationDateStart - Start of expiration date range
 * @param {Date} expirationDateEnd - End of expiration date range
 * @param {Object} [filters] - Additional filters
 * @returns {Promise<RenewalInvitation[]>} Generated invitations
 *
 * @example
 * ```typescript
 * const startDate = new Date('2025-01-01');
 * const endDate = new Date('2025-01-31');
 * const invitations = await batchGenerateRenewalInvitations(startDate, endDate, {
 *   agentId: 'agent-789',
 *   policyType: 'auto'
 * });
 * console.log('Generated', invitations.length, 'invitations');
 * ```
 *
 * @see {@link generateRenewalInvitation} for single invitation generation
 */
export declare const batchGenerateRenewalInvitations: (expirationDateStart: Date, expirationDateEnd: Date, filters?: {
    agentId?: string;
    policyType?: string;
    minimumPremium?: number;
}) => Promise<RenewalInvitation[]>;
/**
 * 4. Tracks renewal invitation delivery and response.
 *
 * @async
 * @param {string} invitationId - Invitation ID
 * @returns {Promise<{ delivered: boolean; opened: boolean; responseReceived: boolean; responseDate?: Date }>} Tracking status
 *
 * @example
 * ```typescript
 * const tracking = await trackRenewalInvitationDelivery('inv-123');
 * if (tracking.opened && !tracking.responseReceived) {
 *   console.log('Invitation opened but no response yet');
 * }
 * ```
 */
export declare const trackRenewalInvitationDelivery: (invitationId: string) => Promise<{
    delivered: boolean;
    opened: boolean;
    responseReceived: boolean;
    responseDate?: Date;
}>;
/**
 * 5. Prepares renewal quote with updated rates.
 *
 * @async
 * @param {string} renewalId - Renewal invitation ID
 * @param {Partial<RenewalQuote>} quoteOptions - Quote options and overrides
 * @returns {Promise<RenewalQuote>} Prepared renewal quote
 * @throws {Error} If renewal not found or not eligible for quoting
 *
 * @example
 * ```typescript
 * const quote = await prepareRenewalQuote('ren-123', {
 *   proposedPremium: 1500.00,
 *   rateChangeReasons: ['claims_experience', 'market_conditions']
 * });
 * console.log('Premium change:', quote.premiumChangePercent, '%');
 * ```
 *
 * @see {@link calculateRenewalPremium} for premium calculation
 * @see {@link issueRenewalQuote} for issuing the quote
 */
export declare const prepareRenewalQuote: (renewalId: string, quoteOptions?: Partial<RenewalQuote>) => Promise<RenewalQuote>;
/**
 * 6. Calculates renewal premium based on multiple rating factors.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Object} ratingFactors - Rating factors for calculation
 * @returns {Promise<{ basePremium: number; adjustedPremium: number; factors: RateModification[] }>} Premium calculation
 *
 * @example
 * ```typescript
 * const calculation = await calculateRenewalPremium('pol-123', {
 *   lossRatio: 0.75,
 *   claimsCount: 2,
 *   creditScore: 720,
 *   yearsWithCompany: 5
 * });
 * console.log('Final premium:', calculation.adjustedPremium);
 * ```
 *
 * @see {@link applyRateModifications} for applying individual rate factors
 */
export declare const calculateRenewalPremium: (policyId: string, ratingFactors: {
    lossRatio?: number;
    claimsCount?: number;
    creditScore?: number;
    yearsWithCompany?: number;
}) => Promise<{
    basePremium: number;
    adjustedPremium: number;
    factors: RateModification[];
}>;
/**
 * 7. Issues renewal quote to policyholder.
 *
 * @async
 * @param {string} quoteId - Quote ID
 * @param {Object} [issuanceOptions] - Issuance options
 * @returns {Promise<{ issued: boolean; issuedDate: Date; deliveryMethod: string }>} Issuance result
 * @throws {Error} If quote expired or already issued
 *
 * @example
 * ```typescript
 * const result = await issueRenewalQuote('quote-123', {
 *   deliveryMethod: 'email',
 *   includeComparison: true
 * });
 * console.log('Quote issued:', result.issuedDate);
 * ```
 */
export declare const issueRenewalQuote: (quoteId: string, issuanceOptions?: {
    deliveryMethod?: string;
    includeComparison?: boolean;
}) => Promise<{
    issued: boolean;
    issuedDate: Date;
    deliveryMethod: string;
}>;
/**
 * 8. Compares renewal quote with current policy.
 *
 * @async
 * @param {string} quoteId - Quote ID
 * @returns {Promise<{ premiumComparison: Object; coverageComparison: Object; recommendations: string[] }>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareRenewalQuote('quote-123');
 * console.log('Premium change:', comparison.premiumComparison.changePercent);
 * comparison.recommendations.forEach(rec => console.log('-', rec));
 * ```
 */
export declare const compareRenewalQuote: (quoteId: string) => Promise<{
    premiumComparison: {
        current: number;
        proposed: number;
        change: number;
        changePercent: number;
    };
    coverageComparison: {
        added: string[];
        removed: string[];
        modified: string[];
    };
    recommendations: string[];
}>;
/**
 * 9. Initiates underwriting review for renewal.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {string} reviewerId - Underwriter ID
 * @returns {Promise<RenewalUnderwritingReview>} Underwriting review record
 * @throws {Error} If renewal not eligible for underwriting
 *
 * @example
 * ```typescript
 * const review = await initiateRenewalUnderwritingReview('ren-123', 'uw-456');
 * console.log('Review started:', review.reviewStartDate);
 * ```
 *
 * @see {@link completeUnderwritingReview} for completing the review
 * @see {@link getRenewalRiskScore} for risk assessment
 */
export declare const initiateRenewalUnderwritingReview: (renewalId: string, reviewerId: string) => Promise<RenewalUnderwritingReview>;
/**
 * 10. Analyzes claims history for renewal underwriting.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {number} [yearsBack] - Number of years to analyze
 * @returns {Promise<ClaimsSummary>} Claims analysis
 *
 * @example
 * ```typescript
 * const claimsAnalysis = await analyzeRenewalClaimsHistory('pol-123', 3);
 * console.log('Total claims:', claimsAnalysis.totalClaimsCount);
 * console.log('Loss ratio:', claimsAnalysis.totalClaimsAmount / totalPremium);
 * ```
 */
export declare const analyzeRenewalClaimsHistory: (policyId: string, yearsBack?: number) => Promise<ClaimsSummary>;
/**
 * 11. Calculates renewal risk score.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {ClaimsSummary} claimsHistory - Claims history
 * @returns {Promise<{ riskScore: number; riskCategory: 'low' | 'medium' | 'high' | 'severe'; factors: string[] }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = await getRenewalRiskScore('pol-123', claimsHistory);
 * console.log('Risk category:', risk.riskCategory);
 * risk.factors.forEach(factor => console.log('-', factor));
 * ```
 */
export declare const getRenewalRiskScore: (policyId: string, claimsHistory: ClaimsSummary) => Promise<{
    riskScore: number;
    riskCategory: "low" | "medium" | "high" | "severe";
    factors: string[];
}>;
/**
 * 12. Completes underwriting review with decision.
 *
 * @async
 * @param {string} reviewId - Review ID
 * @param {Object} reviewDecision - Underwriting decision details
 * @returns {Promise<RenewalUnderwritingReview>} Completed review
 * @throws {Error} If review not found or already completed
 *
 * @example
 * ```typescript
 * const completed = await completeUnderwritingReview('review-123', {
 *   decision: 'conditional_renew',
 *   conditions: ['Increase deductible to $1000', 'Remove coverage for rental'],
 *   rateModifications: [{ factor: 'claims', impact: 0.15, reason: 'claims_experience' }]
 * });
 * ```
 */
export declare const completeUnderwritingReview: (reviewId: string, reviewDecision: {
    decision: RenewalDecision;
    conditions?: string[];
    rateModifications?: RateModification[];
    notes?: string;
}) => Promise<RenewalUnderwritingReview>;
/**
 * 13. Calculates rate changes for renewal based on multiple factors.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {RateChangeReason[]} reasons - Reasons for rate change
 * @returns {Promise<{ currentRate: number; proposedRate: number; change: number; breakdown: RateModification[] }>} Rate calculation
 *
 * @example
 * ```typescript
 * const rateChange = await calculateRenewalRateChange('pol-123', [
 *   'claims_experience',
 *   'market_conditions'
 * ]);
 * console.log('Rate increase:', rateChange.change);
 * ```
 *
 * @see {@link applyRateModifications} for applying rate factors
 */
export declare const calculateRenewalRateChange: (policyId: string, reasons: RateChangeReason[]) => Promise<{
    currentRate: number;
    proposedRate: number;
    change: number;
    breakdown: RateModification[];
}>;
/**
 * 14. Applies individual rate modification factors.
 *
 * @async
 * @param {number} baseRate - Base rate
 * @param {RateModification[]} modifications - Rate modifications to apply
 * @returns {Promise<number>} Final rate after modifications
 *
 * @example
 * ```typescript
 * const modifications = [
 *   { factor: 'claims', currentValue: 1.0, proposedValue: 1.15, impact: 0.15, reason: 'claims_experience' },
 *   { factor: 'territory', currentValue: 1.0, proposedValue: 1.05, impact: 0.05, reason: 'market_conditions' }
 * ];
 * const finalRate = await applyRateModifications(1.0, modifications);
 * ```
 */
export declare const applyRateModifications: (baseRate: number, modifications: RateModification[]) => Promise<number>;
/**
 * 15. Generates rate change justification document.
 *
 * @async
 * @param {string} quoteId - Quote ID
 * @returns {Promise<{ document: string; regulatoryFiling?: string }>} Justification document
 *
 * @example
 * ```typescript
 * const justification = await generateRateChangeJustification('quote-123');
 * console.log(justification.document);
 * ```
 */
export declare const generateRateChangeJustification: (quoteId: string) => Promise<{
    document: string;
    regulatoryFiling?: string;
}>;
/**
 * 16. Declines renewal with documented reason.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} declinationDetails - Declination details
 * @returns {Promise<{ declined: boolean; declinedDate: Date; notificationSent: boolean }>} Declination result
 * @throws {Error} If renewal already processed
 *
 * @example
 * ```typescript
 * const result = await declineRenewal('ren-123', {
 *   reason: 'excessive_claims',
 *   explanation: 'Loss ratio exceeds acceptable threshold',
 *   alternativeOptions: ['Refer to surplus lines carrier']
 * });
 * ```
 *
 * @see {@link sendNonRenewalNotice} for sending declination notice
 */
export declare const declineRenewal: (renewalId: string, declinationDetails: {
    reason: NonRenewalReason;
    explanation: string;
    alternativeOptions?: string[];
}) => Promise<{
    declined: boolean;
    declinedDate: Date;
    notificationSent: boolean;
}>;
/**
 * 17. Processes renewal appeal from declined policyholder.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} appealDetails - Appeal information
 * @returns {Promise<{ appealId: string; status: 'pending' | 'approved' | 'denied'; reviewDate: Date }>} Appeal processing result
 *
 * @example
 * ```typescript
 * const appeal = await processRenewalAppeal('ren-123', {
 *   appealReason: 'Claims circumstances were extraordinary',
 *   supportingDocuments: ['doc-1', 'doc-2'],
 *   requestedReviewBy: 'uw-senior-456'
 * });
 * console.log('Appeal status:', appeal.status);
 * ```
 */
export declare const processRenewalAppeal: (renewalId: string, appealDetails: {
    appealReason: string;
    supportingDocuments?: string[];
    requestedReviewBy?: string;
}) => Promise<{
    appealId: string;
    status: "pending" | "approved" | "denied";
    reviewDate: Date;
}>;
/**
 * 18. Sends non-renewal notice to policyholder.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {NonRenewalNotice} noticeDetails - Notice details
 * @returns {Promise<NonRenewalNotice>} Sent notice
 * @throws {Error} If notice timing violates regulatory requirements
 *
 * @example
 * ```typescript
 * const notice = await sendNonRenewalNotice('pol-123', {
 *   reason: 'underwriting_criteria',
 *   detailedExplanation: 'Risk profile no longer meets underwriting guidelines',
 *   regulatoryCompliance: {
 *     jurisdiction: 'CA',
 *     minimumNoticeDays: 60,
 *     actualNoticeDays: 75,
 *     isCompliant: true
 *   }
 * });
 * ```
 *
 * @see {@link validateNonRenewalNoticeTiming} for compliance validation
 */
export declare const sendNonRenewalNotice: (policyId: string, noticeDetails: Partial<NonRenewalNotice>) => Promise<NonRenewalNotice>;
/**
 * 19. Validates non-renewal notice timing for regulatory compliance.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Date} proposedNoticeDate - Proposed notice date
 * @param {string} jurisdiction - Regulatory jurisdiction
 * @returns {Promise<RegulatoryCompliance>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateNonRenewalNoticeTiming(
 *   'pol-123',
 *   new Date('2025-10-01'),
 *   'NY'
 * );
 * if (!compliance.isCompliant) {
 *   console.error('Notice timing violation:', compliance.complianceNotes);
 * }
 * ```
 */
export declare const validateNonRenewalNoticeTiming: (policyId: string, proposedNoticeDate: Date, jurisdiction: string) => Promise<RegulatoryCompliance>;
/**
 * 20. Tracks non-renewal notice delivery and acknowledgment.
 *
 * @async
 * @param {string} noticeId - Notice ID
 * @returns {Promise<{ delivered: boolean; deliveryDate?: Date; acknowledged: boolean; acknowledgmentDate?: Date }>} Tracking status
 *
 * @example
 * ```typescript
 * const tracking = await trackNonRenewalNotice('notice-123');
 * if (tracking.delivered && !tracking.acknowledged) {
 *   console.log('Notice delivered but not yet acknowledged');
 * }
 * ```
 */
export declare const trackNonRenewalNotice: (noticeId: string) => Promise<{
    delivered: boolean;
    deliveryDate?: Date;
    acknowledged: boolean;
    acknowledgmentDate?: Date;
}>;
/**
 * 21. Processes automatic renewal for eligible policies.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Object} [options] - Auto-renewal options
 * @returns {Promise<{ renewed: boolean; newPolicyId: string; effectiveDate: Date }>} Renewal result
 * @throws {Error} If policy not eligible for auto-renewal
 *
 * @example
 * ```typescript
 * const result = await processAutomaticRenewal('pol-123', {
 *   applyLoyaltyDiscount: true,
 *   sendConfirmation: true
 * });
 * console.log('New policy ID:', result.newPolicyId);
 * ```
 *
 * @see {@link validateAutoRenewalEligibility} for eligibility check
 */
export declare const processAutomaticRenewal: (policyId: string, options?: {
    applyLoyaltyDiscount?: boolean;
    sendConfirmation?: boolean;
}) => Promise<{
    renewed: boolean;
    newPolicyId: string;
    effectiveDate: Date;
}>;
/**
 * 22. Validates policy eligibility for automatic renewal.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @returns {Promise<{ eligible: boolean; reasons: string[]; requirements: string[] }>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateAutoRenewalEligibility('pol-123');
 * if (!eligibility.eligible) {
 *   console.log('Ineligible reasons:', eligibility.reasons);
 * }
 * ```
 */
export declare const validateAutoRenewalEligibility: (policyId: string) => Promise<{
    eligible: boolean;
    reasons: string[];
    requirements: string[];
}>;
/**
 * 23. Configures automatic renewal settings for policy.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Object} settings - Auto-renewal settings
 * @returns {Promise<{ configured: boolean; settings: Object }>} Configuration result
 *
 * @example
 * ```typescript
 * const config = await configureAutoRenewal('pol-123', {
 *   enabled: true,
 *   notifyDaysBefore: 30,
 *   autoPayment: true,
 *   rateCapPercent: 10
 * });
 * ```
 */
export declare const configureAutoRenewal: (policyId: string, settings: {
    enabled: boolean;
    notifyDaysBefore?: number;
    autoPayment?: boolean;
    rateCapPercent?: number;
}) => Promise<{
    configured: boolean;
    settings: typeof settings;
}>;
/**
 * 24. Initiates renewal negotiation process.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} initialOffer - Initial offer details
 * @returns {Promise<RenewalNegotiation>} Negotiation record
 *
 * @example
 * ```typescript
 * const negotiation = await initiateRenewalNegotiation('ren-123', {
 *   premium: 1400,
 *   coverageLimits: new Map([['liability', 500000]]),
 *   validUntil: new Date('2025-11-30')
 * });
 * ```
 *
 * @see {@link submitNegotiationCounterOffer} for submitting offers
 */
export declare const initiateRenewalNegotiation: (renewalId: string, initialOffer: {
    premium: number;
    coverageLimits?: Map<string, number>;
    validUntil: Date;
}) => Promise<RenewalNegotiation>;
/**
 * 25. Submits counter-offer in renewal negotiation.
 *
 * @async
 * @param {string} negotiationId - Negotiation ID
 * @param {NegotiationOffer} counterOffer - Counter-offer details
 * @returns {Promise<RenewalNegotiation>} Updated negotiation
 *
 * @example
 * ```typescript
 * const updated = await submitNegotiationCounterOffer('neg-123', {
 *   offerNumber: 2,
 *   premium: 1300,
 *   coverageLimits: new Map([['liability', 500000]]),
 *   validUntil: new Date('2025-12-15'),
 *   offeredBy: 'policyholder'
 * });
 * ```
 */
export declare const submitNegotiationCounterOffer: (negotiationId: string, counterOffer: Partial<NegotiationOffer>) => Promise<RenewalNegotiation>;
/**
 * 26. Finalizes renewal negotiation with acceptance.
 *
 * @async
 * @param {string} negotiationId - Negotiation ID
 * @param {Object} finalTerms - Final agreed terms
 * @returns {Promise<{ finalized: boolean; finalOffer: NegotiationOffer; bindingDate: Date }>} Finalization result
 *
 * @example
 * ```typescript
 * const result = await finalizeRenewalNegotiation('neg-123', {
 *   premium: 1325,
 *   acceptedBy: 'policyholder'
 * });
 * console.log('Binding date:', result.bindingDate);
 * ```
 */
export declare const finalizeRenewalNegotiation: (negotiationId: string, finalTerms: {
    premium: number;
    acceptedBy: "insurer" | "policyholder";
}) => Promise<{
    finalized: boolean;
    finalOffer: NegotiationOffer;
    bindingDate: Date;
}>;
/**
 * 27. Generates retention incentive offer for at-risk renewal.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {IncentiveType} incentiveType - Type of incentive
 * @param {Object} [options] - Incentive options
 * @returns {Promise<RetentionIncentive>} Incentive offer
 *
 * @example
 * ```typescript
 * const incentive = await generateRetentionIncentive('ren-123', 'loyalty_discount', {
 *   discountPercent: 10,
 *   conditions: ['Maintain claims-free status', 'Enroll in autopay']
 * });
 * console.log('Discount:', incentive.discountPercent, '%');
 * ```
 *
 * @see {@link applyRetentionIncentive} for applying the incentive
 */
export declare const generateRetentionIncentive: (renewalId: string, incentiveType: IncentiveType, options?: {
    discountPercent?: number;
    conditions?: string[];
}) => Promise<RetentionIncentive>;
/**
 * 28. Applies retention incentive to renewal quote.
 *
 * @async
 * @param {string} quoteId - Quote ID
 * @param {string} incentiveId - Incentive ID
 * @returns {Promise<{ applied: boolean; newPremium: number; savings: number }>} Application result
 *
 * @example
 * ```typescript
 * const result = await applyRetentionIncentive('quote-123', 'inc-456');
 * console.log('New premium:', result.newPremium);
 * console.log('Savings:', result.savings);
 * ```
 */
export declare const applyRetentionIncentive: (quoteId: string, incentiveId: string) => Promise<{
    applied: boolean;
    newPremium: number;
    savings: number;
}>;
/**
 * 29. Calculates retention probability and risk score.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Object} factors - Factors affecting retention
 * @returns {Promise<{ retentionProbability: number; riskLevel: 'low' | 'medium' | 'high'; recommendedActions: string[] }>} Retention analysis
 *
 * @example
 * ```typescript
 * const analysis = await calculateRetentionProbability('pol-123', {
 *   premiumIncrease: 15,
 *   yearsWithCompany: 7,
 *   claimsInLastYear: 0,
 *   competitorQuotes: 2
 * });
 * console.log('Retention probability:', analysis.retentionProbability);
 * ```
 */
export declare const calculateRetentionProbability: (policyId: string, factors: {
    premiumIncrease?: number;
    yearsWithCompany?: number;
    claimsInLastYear?: number;
    competitorQuotes?: number;
}) => Promise<{
    retentionProbability: number;
    riskLevel: "low" | "medium" | "high";
    recommendedActions: string[];
}>;
/**
 * 30. Creates multi-year renewal offer.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {number} termYears - Number of years (2-5)
 * @param {Object} [options] - Multi-year options
 * @returns {Promise<MultiYearRenewal>} Multi-year renewal offer
 * @throws {Error} If multi-year renewals not enabled or term invalid
 *
 * @example
 * ```typescript
 * const multiYear = await createMultiYearRenewal('pol-123', 3, {
 *   premiumGuarantee: true,
 *   rateAdjustmentCap: 5
 * });
 * console.log('Total 3-year premium:', multiYear.totalPremium);
 * console.log('Savings vs annual:', multiYear.savingsVsAnnual);
 * ```
 */
export declare const createMultiYearRenewal: (policyId: string, termYears: number, options?: {
    premiumGuarantee?: boolean;
    rateAdjustmentCap?: number;
}) => Promise<MultiYearRenewal>;
/**
 * 31. Compares multi-year vs annual renewal options.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {number[]} termYearOptions - Term year options to compare
 * @returns {Promise<Array<{ termYears: number; totalPremium: number; annualEquivalent: number; savings: number }>>} Comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareMultiYearRenewalOptions('pol-123', [1, 2, 3, 5]);
 * comparison.forEach(option => {
 *   console.log(`${option.termYears} year(s): $${option.totalPremium} (save $${option.savings})`);
 * });
 * ```
 */
export declare const compareMultiYearRenewalOptions: (policyId: string, termYearOptions: number[]) => Promise<Array<{
    termYears: number;
    totalPremium: number;
    annualEquivalent: number;
    savings: number;
}>>;
/**
 * 32. Generates renewal policy documents.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} [options] - Document generation options
 * @returns {Promise<{ documents: Array<{ type: string; url: string; generatedAt: Date }> }>} Generated documents
 *
 * @example
 * ```typescript
 * const docs = await generateRenewalDocuments('ren-123', {
 *   includeDeclarations: true,
 *   includeEndorsements: true,
 *   format: 'pdf'
 * });
 * docs.documents.forEach(doc => console.log(`${doc.type}: ${doc.url}`));
 * ```
 */
export declare const generateRenewalDocuments: (renewalId: string, options?: {
    includeDeclarations?: boolean;
    includeEndorsements?: boolean;
    format?: "pdf" | "docx";
}) => Promise<{
    documents: Array<{
        type: string;
        url: string;
        generatedAt: Date;
    }>;
}>;
/**
 * 33. Generates renewal comparison document for policyholder.
 *
 * @async
 * @param {string} quoteId - Quote ID
 * @returns {Promise<{ documentUrl: string; highlightedChanges: string[] }>} Comparison document
 *
 * @example
 * ```typescript
 * const comparison = await generateRenewalComparisonDocument('quote-123');
 * console.log('Download at:', comparison.documentUrl);
 * comparison.highlightedChanges.forEach(change => console.log('-', change));
 * ```
 */
export declare const generateRenewalComparisonDocument: (quoteId: string) => Promise<{
    documentUrl: string;
    highlightedChanges: string[];
}>;
/**
 * 34. Creates payment schedule for renewal.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} scheduleOptions - Payment schedule options
 * @returns {Promise<RenewalPaymentSchedule>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createRenewalPaymentSchedule('ren-123', {
 *   paymentFrequency: 'monthly',
 *   downPaymentPercent: 20
 * });
 * console.log('Monthly payment:', schedule.installmentAmount);
 * schedule.paymentDates.forEach(date => console.log('Payment due:', date));
 * ```
 */
export declare const createRenewalPaymentSchedule: (renewalId: string, scheduleOptions: {
    paymentFrequency: "annual" | "semi_annual" | "quarterly" | "monthly";
    downPaymentPercent?: number;
}) => Promise<RenewalPaymentSchedule>;
/**
 * 35. Processes renewal payment and updates policy status.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} paymentDetails - Payment information
 * @returns {Promise<{ paymentProcessed: boolean; policyActivated: boolean; confirmationNumber: string }>} Payment result
 *
 * @example
 * ```typescript
 * const result = await processRenewalPayment('ren-123', {
 *   amount: 1350,
 *   paymentMethod: 'credit_card',
 *   transactionId: 'txn-789'
 * });
 * console.log('Confirmation:', result.confirmationNumber);
 * ```
 */
export declare const processRenewalPayment: (renewalId: string, paymentDetails: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
}) => Promise<{
    paymentProcessed: boolean;
    policyActivated: boolean;
    confirmationNumber: string;
}>;
/**
 * 36. Offers early renewal with incentive.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {number} daysBeforeExpiration - Days before expiration to renew
 * @returns {Promise<{ eligible: boolean; earlyRenewalDiscount: number; offerValidUntil: Date }>} Early renewal offer
 *
 * @example
 * ```typescript
 * const offer = await offerEarlyRenewal('pol-123', 60);
 * if (offer.eligible) {
 *   console.log('Early renewal discount:', offer.earlyRenewalDiscount, '%');
 * }
 * ```
 */
export declare const offerEarlyRenewal: (policyId: string, daysBeforeExpiration: number) => Promise<{
    eligible: boolean;
    earlyRenewalDiscount: number;
    offerValidUntil: Date;
}>;
/**
 * 37. Processes early renewal acceptance.
 *
 * @async
 * @param {string} policyId - Policy ID
 * @param {Date} requestedEffectiveDate - Requested effective date
 * @returns {Promise<{ processed: boolean; newPolicyId: string; effectiveDate: Date; savings: number }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processEarlyRenewal('pol-123', new Date('2025-11-01'));
 * console.log('New policy:', result.newPolicyId);
 * console.log('Savings:', result.savings);
 * ```
 */
export declare const processEarlyRenewal: (policyId: string, requestedEffectiveDate: Date) => Promise<{
    processed: boolean;
    newPolicyId: string;
    effectiveDate: Date;
    savings: number;
}>;
/**
 * 38. Generates renewal analytics for specified period.
 *
 * @async
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {Object} [filters] - Analytics filters
 * @returns {Promise<RenewalAnalytics>} Renewal analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateRenewalAnalytics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   { agentId: 'agent-123', policyType: 'auto' }
 * );
 * console.log('Retention rate:', analytics.retentionRate, '%');
 * console.log('Total premium renewed:', analytics.totalPremiumRenewed);
 * ```
 */
export declare const generateRenewalAnalytics: (periodStart: Date, periodEnd: Date, filters?: {
    agentId?: string;
    policyType?: string;
    jurisdiction?: string;
}) => Promise<RenewalAnalytics>;
/**
 * 39. Forecasts renewal volume and premium for upcoming period.
 *
 * @async
 * @param {Date} forecastPeriodStart - Forecast period start
 * @param {Date} forecastPeriodEnd - Forecast period end
 * @returns {Promise<{ expectedRenewals: number; expectedPremium: number; confidenceInterval: [number, number] }>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastRenewalVolume(
 *   new Date('2025-01-01'),
 *   new Date('2025-03-31')
 * );
 * console.log('Expected renewals:', forecast.expectedRenewals);
 * console.log('Expected premium:', forecast.expectedPremium);
 * ```
 */
export declare const forecastRenewalVolume: (forecastPeriodStart: Date, forecastPeriodEnd: Date) => Promise<{
    expectedRenewals: number;
    expectedPremium: number;
    confidenceInterval: [number, number];
}>;
/**
 * 40. Identifies cross-sell opportunities at renewal.
 *
 * @async
 * @param {string} renewalId - Renewal ID
 * @param {Object} [options] - Cross-sell options
 * @returns {Promise<RenewalCrossSellOpportunity>} Cross-sell opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyRenewalCrossSellOpportunities('ren-123', {
 *   includeBundle: true,
 *   maxProducts: 3
 * });
 * opportunities.recommendedProducts.forEach(product => {
 *   console.log(`${product.productName}: $${product.estimatedPremium}`);
 * });
 * console.log('Bundle discount:', opportunities.bundleDiscount);
 * ```
 */
export declare const identifyRenewalCrossSellOpportunities: (renewalId: string, options?: {
    includeBundle?: boolean;
    maxProducts?: number;
}) => Promise<RenewalCrossSellOpportunity>;
declare const _default: {
    loadRenewalConfig: () => RenewalConfig;
    validateRenewalConfig: (config: RenewalConfig) => string[];
    createRenewalInvitationModel: (sequelize: Sequelize) => any;
    createRenewalQuoteModel: (sequelize: Sequelize) => any;
    generateRenewalInvitation: (policyId: string, options?: Partial<RenewalInvitation>) => Promise<RenewalInvitation>;
    sendRenewalInvitation: (invitationId: string, deliveryOptions?: {
        includeQuote?: boolean;
        priority?: "normal" | "high";
    }) => Promise<{
        sent: boolean;
        sentDate: Date;
        deliveryMethod: string;
    }>;
    batchGenerateRenewalInvitations: (expirationDateStart: Date, expirationDateEnd: Date, filters?: {
        agentId?: string;
        policyType?: string;
        minimumPremium?: number;
    }) => Promise<RenewalInvitation[]>;
    trackRenewalInvitationDelivery: (invitationId: string) => Promise<{
        delivered: boolean;
        opened: boolean;
        responseReceived: boolean;
        responseDate?: Date;
    }>;
    prepareRenewalQuote: (renewalId: string, quoteOptions?: Partial<RenewalQuote>) => Promise<RenewalQuote>;
    calculateRenewalPremium: (policyId: string, ratingFactors: {
        lossRatio?: number;
        claimsCount?: number;
        creditScore?: number;
        yearsWithCompany?: number;
    }) => Promise<{
        basePremium: number;
        adjustedPremium: number;
        factors: RateModification[];
    }>;
    issueRenewalQuote: (quoteId: string, issuanceOptions?: {
        deliveryMethod?: string;
        includeComparison?: boolean;
    }) => Promise<{
        issued: boolean;
        issuedDate: Date;
        deliveryMethod: string;
    }>;
    compareRenewalQuote: (quoteId: string) => Promise<{
        premiumComparison: {
            current: number;
            proposed: number;
            change: number;
            changePercent: number;
        };
        coverageComparison: {
            added: string[];
            removed: string[];
            modified: string[];
        };
        recommendations: string[];
    }>;
    initiateRenewalUnderwritingReview: (renewalId: string, reviewerId: string) => Promise<RenewalUnderwritingReview>;
    analyzeRenewalClaimsHistory: (policyId: string, yearsBack?: number) => Promise<ClaimsSummary>;
    getRenewalRiskScore: (policyId: string, claimsHistory: ClaimsSummary) => Promise<{
        riskScore: number;
        riskCategory: "low" | "medium" | "high" | "severe";
        factors: string[];
    }>;
    completeUnderwritingReview: (reviewId: string, reviewDecision: {
        decision: RenewalDecision;
        conditions?: string[];
        rateModifications?: RateModification[];
        notes?: string;
    }) => Promise<RenewalUnderwritingReview>;
    calculateRenewalRateChange: (policyId: string, reasons: RateChangeReason[]) => Promise<{
        currentRate: number;
        proposedRate: number;
        change: number;
        breakdown: RateModification[];
    }>;
    applyRateModifications: (baseRate: number, modifications: RateModification[]) => Promise<number>;
    generateRateChangeJustification: (quoteId: string) => Promise<{
        document: string;
        regulatoryFiling?: string;
    }>;
    declineRenewal: (renewalId: string, declinationDetails: {
        reason: NonRenewalReason;
        explanation: string;
        alternativeOptions?: string[];
    }) => Promise<{
        declined: boolean;
        declinedDate: Date;
        notificationSent: boolean;
    }>;
    processRenewalAppeal: (renewalId: string, appealDetails: {
        appealReason: string;
        supportingDocuments?: string[];
        requestedReviewBy?: string;
    }) => Promise<{
        appealId: string;
        status: "pending" | "approved" | "denied";
        reviewDate: Date;
    }>;
    sendNonRenewalNotice: (policyId: string, noticeDetails: Partial<NonRenewalNotice>) => Promise<NonRenewalNotice>;
    validateNonRenewalNoticeTiming: (policyId: string, proposedNoticeDate: Date, jurisdiction: string) => Promise<RegulatoryCompliance>;
    trackNonRenewalNotice: (noticeId: string) => Promise<{
        delivered: boolean;
        deliveryDate?: Date;
        acknowledged: boolean;
        acknowledgmentDate?: Date;
    }>;
    processAutomaticRenewal: (policyId: string, options?: {
        applyLoyaltyDiscount?: boolean;
        sendConfirmation?: boolean;
    }) => Promise<{
        renewed: boolean;
        newPolicyId: string;
        effectiveDate: Date;
    }>;
    validateAutoRenewalEligibility: (policyId: string) => Promise<{
        eligible: boolean;
        reasons: string[];
        requirements: string[];
    }>;
    configureAutoRenewal: (policyId: string, settings: {
        enabled: boolean;
        notifyDaysBefore?: number;
        autoPayment?: boolean;
        rateCapPercent?: number;
    }) => Promise<{
        configured: boolean;
        settings: typeof settings;
    }>;
    initiateRenewalNegotiation: (renewalId: string, initialOffer: {
        premium: number;
        coverageLimits?: Map<string, number>;
        validUntil: Date;
    }) => Promise<RenewalNegotiation>;
    submitNegotiationCounterOffer: (negotiationId: string, counterOffer: Partial<NegotiationOffer>) => Promise<RenewalNegotiation>;
    finalizeRenewalNegotiation: (negotiationId: string, finalTerms: {
        premium: number;
        acceptedBy: "insurer" | "policyholder";
    }) => Promise<{
        finalized: boolean;
        finalOffer: NegotiationOffer;
        bindingDate: Date;
    }>;
    generateRetentionIncentive: (renewalId: string, incentiveType: IncentiveType, options?: {
        discountPercent?: number;
        conditions?: string[];
    }) => Promise<RetentionIncentive>;
    applyRetentionIncentive: (quoteId: string, incentiveId: string) => Promise<{
        applied: boolean;
        newPremium: number;
        savings: number;
    }>;
    calculateRetentionProbability: (policyId: string, factors: {
        premiumIncrease?: number;
        yearsWithCompany?: number;
        claimsInLastYear?: number;
        competitorQuotes?: number;
    }) => Promise<{
        retentionProbability: number;
        riskLevel: "low" | "medium" | "high";
        recommendedActions: string[];
    }>;
    createMultiYearRenewal: (policyId: string, termYears: number, options?: {
        premiumGuarantee?: boolean;
        rateAdjustmentCap?: number;
    }) => Promise<MultiYearRenewal>;
    compareMultiYearRenewalOptions: (policyId: string, termYearOptions: number[]) => Promise<Array<{
        termYears: number;
        totalPremium: number;
        annualEquivalent: number;
        savings: number;
    }>>;
    generateRenewalDocuments: (renewalId: string, options?: {
        includeDeclarations?: boolean;
        includeEndorsements?: boolean;
        format?: "pdf" | "docx";
    }) => Promise<{
        documents: Array<{
            type: string;
            url: string;
            generatedAt: Date;
        }>;
    }>;
    generateRenewalComparisonDocument: (quoteId: string) => Promise<{
        documentUrl: string;
        highlightedChanges: string[];
    }>;
    createRenewalPaymentSchedule: (renewalId: string, scheduleOptions: {
        paymentFrequency: "annual" | "semi_annual" | "quarterly" | "monthly";
        downPaymentPercent?: number;
    }) => Promise<RenewalPaymentSchedule>;
    processRenewalPayment: (renewalId: string, paymentDetails: {
        amount: number;
        paymentMethod: string;
        transactionId?: string;
    }) => Promise<{
        paymentProcessed: boolean;
        policyActivated: boolean;
        confirmationNumber: string;
    }>;
    offerEarlyRenewal: (policyId: string, daysBeforeExpiration: number) => Promise<{
        eligible: boolean;
        earlyRenewalDiscount: number;
        offerValidUntil: Date;
    }>;
    processEarlyRenewal: (policyId: string, requestedEffectiveDate: Date) => Promise<{
        processed: boolean;
        newPolicyId: string;
        effectiveDate: Date;
        savings: number;
    }>;
    generateRenewalAnalytics: (periodStart: Date, periodEnd: Date, filters?: {
        agentId?: string;
        policyType?: string;
        jurisdiction?: string;
    }) => Promise<RenewalAnalytics>;
    forecastRenewalVolume: (forecastPeriodStart: Date, forecastPeriodEnd: Date) => Promise<{
        expectedRenewals: number;
        expectedPremium: number;
        confidenceInterval: [number, number];
    }>;
    identifyRenewalCrossSellOpportunities: (renewalId: string, options?: {
        includeBundle?: boolean;
        maxProducts?: number;
    }) => Promise<RenewalCrossSellOpportunity>;
};
export default _default;
//# sourceMappingURL=policy-renewal-kit.d.ts.map