/**
 * LOC: INS-REINS-001
 * File: /reuse/insurance/reinsurance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - date-fns
 *   - decimal.js
 *
 * DOWNSTREAM (imported by):
 *   - Reinsurance controllers
 *   - Underwriting services
 *   - Claims processing modules
 *   - Risk management systems
 *   - Financial reporting services
 */
import { Sequelize } from 'sequelize';
/**
 * Reinsurance configuration from environment
 */
export interface ReinsuranceConfigEnv {
    ENABLE_AUTOMATIC_TREATIES: string;
    ENABLE_FACULTATIVE_PLACEMENT: string;
    DEFAULT_CEDING_COMMISSION_PCT: string;
    RETENTION_LIMIT_MULTIPLIER: string;
    CATASTROPHE_THRESHOLD_AMOUNT: string;
    AGGREGATE_EXCESS_ATTACHMENT: string;
    BORDEREAU_SUBMISSION_FREQUENCY: string;
    PAYMENT_SETTLEMENT_DAYS: string;
    COLLECTIBILITY_REVIEW_DAYS: string;
    RETROCESSION_ENABLED: string;
    MINIMUM_REINSURER_RATING: string;
    MAX_SINGLE_REINSURER_SHARE_PCT: string;
}
/**
 * Loads reinsurance configuration from environment variables.
 *
 * @returns {ReinsuranceConfig} Reinsurance configuration object
 *
 * @example
 * ```typescript
 * const config = loadReinsuranceConfig();
 * console.log('Automatic treaties enabled:', config.enableAutomaticTreaties);
 * ```
 */
export declare const loadReinsuranceConfig: () => ReinsuranceConfig;
/**
 * Validates reinsurance configuration.
 *
 * @param {ReinsuranceConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateReinsuranceConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
export declare const validateReinsuranceConfig: (config: ReinsuranceConfig) => string[];
/**
 * Reinsurance configuration
 */
export interface ReinsuranceConfig {
    enableAutomaticTreaties: boolean;
    enableFacultativePlacement: boolean;
    defaultCedingCommissionPct: number;
    retentionLimitMultiplier: number;
    catastropheThresholdAmount: number;
    aggregateExcessAttachment: number;
    bordereauSubmissionFrequency: string;
    paymentSettlementDays: number;
    collectibilityReviewDays: number;
    retrocessionEnabled: boolean;
    minimumReinsurerRating: string;
    maxSingleReinsurerSharePct: number;
}
/**
 * Reinsurance treaty types
 */
export type TreatyType = 'quota_share' | 'surplus' | 'excess_of_loss_per_risk' | 'excess_of_loss_per_occurrence' | 'catastrophe_excess' | 'aggregate_excess' | 'stop_loss' | 'facultative';
/**
 * Treaty status
 */
export type TreatyStatus = 'draft' | 'pending_approval' | 'bound' | 'in_force' | 'expired' | 'cancelled' | 'renewed';
/**
 * Reinsurer financial strength rating
 */
export type ReinsurerRating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+' | 'BBB' | 'BBB-' | 'Below_Investment_Grade';
/**
 * Bordereau submission frequency
 */
export type BordereauFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'on_demand';
/**
 * Recoverable status
 */
export type RecoverableStatus = 'pending' | 'billed' | 'acknowledged' | 'disputed' | 'collected' | 'written_off' | 'litigation';
/**
 * Reinsurance treaty structure
 */
export interface ReinsuranceTreaty {
    id?: string;
    treatyNumber: string;
    treatyName: string;
    treatyType: TreatyType;
    status: TreatyStatus;
    effectiveDate: Date;
    expirationDate: Date;
    cancellationDate?: Date;
    cedingCompanyId: string;
    reinsurerParticipations: ReinsurerParticipation[];
    coverageTerms: CoverageTerms;
    premiumTerms: PremiumTerms;
    commissionTerms?: CommissionTerms;
    settlementTerms: SettlementTerms;
    specialConditions?: string[];
    attachedDocuments?: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Reinsurer participation in treaty
 */
export interface ReinsurerParticipation {
    reinsurerId: string;
    reinsurerName: string;
    participationPct: number;
    shareAmount?: number;
    rating: ReinsurerRating;
    authorized: boolean;
    securityProvided?: {
        type: 'letter_of_credit' | 'trust_fund' | 'funds_withheld';
        amount: number;
        expirationDate?: Date;
    };
}
/**
 * Coverage terms
 */
export interface CoverageTerms {
    coverageType: string;
    retentionAmount?: number;
    limitAmount: number;
    numberOfLayers?: number;
    attachmentPoint?: number;
    reinstatementProvisions?: {
        numberOfReinstatements: number;
        premium: number;
        proRata: boolean;
    };
    aggregateLimit?: number;
    exclusions?: string[];
    territory?: string[];
    linesOfBusiness?: string[];
}
/**
 * Premium terms
 */
export interface PremiumTerms {
    premiumBasis: 'gross_written' | 'net_written' | 'earned' | 'risk_premium' | 'deposit_premium';
    cedingRate?: number;
    minimumPremium?: number;
    depositPremium?: number;
    swingRating?: boolean;
    experienceRating?: boolean;
    premiumAdjustmentFrequency?: BordereauFrequency;
    premiumPaymentFrequency: BordereauFrequency;
}
/**
 * Commission terms
 */
export interface CommissionTerms {
    commissionType: 'flat' | 'sliding_scale' | 'profit_commission' | 'contingent';
    flatCommissionPct?: number;
    slidingScaleLadder?: Array<{
        lossRatioMin: number;
        lossRatioMax: number;
        commissionPct: number;
    }>;
    profitCommissionPct?: number;
    profitCarryForward?: boolean;
    expenseAllowance?: number;
    overridingCommission?: number;
}
/**
 * Settlement terms
 */
export interface SettlementTerms {
    bordereauFrequency: BordereauFrequency;
    paymentDueDays: number;
    interestOnOverdue: number;
    cashCallProvisions?: boolean;
    offsettingAllowed: boolean;
    currencySettlement: string;
}
/**
 * Facultative certificate
 */
export interface FacultativeCertificate {
    id?: string;
    certificateNumber: string;
    policyId: string;
    policyNumber: string;
    insuredName: string;
    effectiveDate: Date;
    expirationDate: Date;
    submissionDate: Date;
    boundDate?: Date;
    cedingAmount: number;
    retentionAmount: number;
    facultativeAmount: number;
    reinsurerParticipations: ReinsurerParticipation[];
    premiumDetails: {
        grossPremium: number;
        cedingPremiumPct: number;
        cedingPremiumAmount: number;
        cedingCommissionPct: number;
        cedingCommissionAmount: number;
    };
    underwritingInfo: {
        riskDescription: string;
        occupancy?: string;
        construction?: string;
        protection?: string;
        exposure?: string;
        deductible?: number;
        coinsurance?: number;
    };
    status: 'quoted' | 'bound' | 'declined' | 'expired' | 'cancelled';
    declinationReason?: string;
    specialConditions?: string[];
    createdBy: string;
    createdAt: Date;
}
/**
 * Reinsurance recoverable
 */
export interface ReinsuranceRecoverable {
    id?: string;
    claimId: string;
    claimNumber: string;
    treatyId?: string;
    facultativeCertId?: string;
    lossDate: Date;
    reportedDate: Date;
    paidLossAmount: number;
    caseReserveAmount: number;
    ibnrAmount: number;
    totalIncurredAmount: number;
    cedingRetention: number;
    recoverableAmount: number;
    reinsurerAllocations: Array<{
        reinsurerId: string;
        allocationPct: number;
        recoverableAmount: number;
        paidAmount: number;
        outstandingAmount: number;
    }>;
    status: RecoverableStatus;
    bordereauSubmitted?: Date;
    invoicedDate?: Date;
    collectedDate?: Date;
    disputeDetails?: {
        disputedAmount: number;
        disputeReason: string;
        disputedDate: Date;
        resolutionDate?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bordereau (premium or loss statement)
 */
export interface Bordereau {
    id?: string;
    bordereauNumber: string;
    treatyId: string;
    bordereauType: 'premium' | 'loss';
    periodStart: Date;
    periodEnd: Date;
    submissionDate: Date;
    lineItems: BordereauLineItem[];
    summary: {
        totalGrossPremium?: number;
        totalCededPremium?: number;
        totalCommission?: number;
        netPremiumDue?: number;
        totalLosses?: number;
        totalRecoverables?: number;
        numberOfItems: number;
    };
    currency: string;
    status: 'draft' | 'submitted' | 'acknowledged' | 'disputed' | 'settled';
    acknowledgedDate?: Date;
    settledDate?: Date;
    paymentReference?: string;
    attachments?: string[];
}
/**
 * Bordereau line item
 */
export interface BordereauLineItem {
    policyNumber?: string;
    claimNumber?: string;
    insuredName?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    lossDate?: Date;
    grossAmount: number;
    retentionAmount: number;
    cededAmount: number;
    commissionAmount?: number;
    metadata?: Record<string, any>;
}
/**
 * Retrocession program
 */
export interface RetrocessionProgram {
    id?: string;
    programName: string;
    effectiveDate: Date;
    expirationDate: Date;
    originalTreatyIds: string[];
    retrocessionnaires: Array<{
        retrocessionaireId: string;
        retrocessionaireName: string;
        participationPct: number;
        rating: ReinsurerRating;
    }>;
    retrocededPct: number;
    retainedPct: number;
    structure: 'proportional' | 'non_proportional';
    status: 'active' | 'expired' | 'cancelled';
    createdAt: Date;
}
/**
 * Reinsurance capacity analysis
 */
export interface CapacityAnalysis {
    analysisDate: Date;
    lineOfBusiness: string;
    currentRetention: number;
    availableTreatyCapacity: number;
    facultativeCapacity: number;
    totalCapacity: number;
    capacityUtilization: number;
    capacityUtilizationPct: number;
    projectedNeeds: number;
    capacityShortfall?: number;
    recommendations: string[];
}
/**
 * Collectibility assessment
 */
export interface CollectibilityAssessment {
    reinsurerId: string;
    assessmentDate: Date;
    currentRating: ReinsurerRating;
    priorRating?: ReinsurerRating;
    outstandingRecoverables: number;
    overdueRecoverables: number;
    collectionRate90Days: number;
    disputeRate: number;
    riskScore: number;
    riskCategory: 'low' | 'medium' | 'high' | 'severe';
    allowanceForDoubtfulAccounts: number;
    allowancePct: number;
    watchList: boolean;
    notes?: string;
    nextReviewDate: Date;
}
/**
 * Reinsurance treaty model attributes
 */
export interface ReinsuranceTreatyAttributes {
    id: string;
    treatyNumber: string;
    treatyName: string;
    treatyType: TreatyType;
    status: TreatyStatus;
    effectiveDate: Date;
    expirationDate: Date;
    cancellationDate?: Date;
    cedingCompanyId: string;
    reinsurerParticipations: ReinsurerParticipation[];
    coverageTerms: CoverageTerms;
    premiumTerms: PremiumTerms;
    commissionTerms?: CommissionTerms;
    settlementTerms: SettlementTerms;
    specialConditions?: string[];
    attachedDocuments?: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ReinsuranceTreaty model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReinsuranceTreatyAttributes>>} ReinsuranceTreaty model
 *
 * @example
 * ```typescript
 * const TreatyModel = createReinsuranceTreatyModel(sequelize);
 * const treaty = await TreatyModel.create({
 *   treatyNumber: 'QS-2024-001',
 *   treatyName: 'Property Quota Share 2024',
 *   treatyType: 'quota_share',
 *   status: 'in_force'
 * });
 * ```
 */
export declare const createReinsuranceTreatyModel: (sequelize: Sequelize) => any;
/**
 * Facultative certificate model attributes
 */
export interface FacultativeCertificateAttributes {
    id: string;
    certificateNumber: string;
    policyId: string;
    policyNumber: string;
    insuredName: string;
    effectiveDate: Date;
    expirationDate: Date;
    submissionDate: Date;
    boundDate?: Date;
    cedingAmount: number;
    retentionAmount: number;
    facultativeAmount: number;
    reinsurerParticipations: ReinsurerParticipation[];
    premiumDetails: any;
    underwritingInfo: any;
    status: string;
    declinationReason?: string;
    specialConditions?: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates FacultativeCertificate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FacultativeCertificateAttributes>>} FacultativeCertificate model
 */
export declare const createFacultativeCertificateModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new reinsurance treaty.
 *
 * @param {Partial<ReinsuranceTreaty>} treatyData - Treaty data
 * @returns {Promise<ReinsuranceTreaty>} Created treaty
 *
 * @example
 * ```typescript
 * const treaty = await createReinsuranceTreaty({
 *   treatyName: 'Property Quota Share 2024',
 *   treatyType: 'quota_share',
 *   effectiveDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const createReinsuranceTreaty: (treatyData: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
/**
 * 2. Updates existing treaty.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Partial<ReinsuranceTreaty>} updates - Treaty updates
 * @returns {Promise<ReinsuranceTreaty>} Updated treaty
 *
 * @example
 * ```typescript
 * const updated = await updateReinsuranceTreaty(treatyId, {
 *   status: 'in_force'
 * });
 * ```
 */
export declare const updateReinsuranceTreaty: (treatyId: string, updates: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
/**
 * 3. Adds reinsurer participation to treaty.
 *
 * @param {string} treatyId - Treaty ID
 * @param {ReinsurerParticipation} participation - Reinsurer participation details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addReinsurerParticipation(treatyId, {
 *   reinsurerId: 'reinsurer-123',
 *   reinsurerName: 'Munich Re',
 *   participationPct: 30,
 *   rating: 'AA+',
 *   authorized: true
 * });
 * ```
 */
export declare const addReinsurerParticipation: (treatyId: string, participation: ReinsurerParticipation) => Promise<void>;
/**
 * 4. Validates treaty participation percentages sum to 100.
 *
 * @param {ReinsurerParticipation[]} participations - Reinsurer participations
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateParticipationPercentages(participations);
 * if (!isValid) throw new Error('Participations must sum to 100%');
 * ```
 */
export declare const validateParticipationPercentages: (participations: ReinsurerParticipation[]) => boolean;
/**
 * 5. Gets active treaties by type.
 *
 * @param {TreatyType} treatyType - Treaty type
 * @param {Date} [effectiveDate] - Effective date
 * @returns {Promise<ReinsuranceTreaty[]>} Active treaties
 *
 * @example
 * ```typescript
 * const quotaShareTreaties = await getActiveTreatiesByType('quota_share');
 * ```
 */
export declare const getActiveTreatiesByType: (treatyType: TreatyType, effectiveDate?: Date) => Promise<ReinsuranceTreaty[]>;
/**
 * 6. Creates facultative certificate.
 *
 * @param {Partial<FacultativeCertificate>} certData - Certificate data
 * @returns {Promise<FacultativeCertificate>} Created certificate
 *
 * @example
 * ```typescript
 * const cert = await createFacultativeCertificate({
 *   policyId: 'policy-123',
 *   cedingAmount: 5000000,
 *   retentionAmount: 1000000,
 *   facultativeAmount: 4000000
 * });
 * ```
 */
export declare const createFacultativeCertificate: (certData: Partial<FacultativeCertificate>) => Promise<FacultativeCertificate>;
/**
 * 7. Submits facultative quote request.
 *
 * @param {string} certificateId - Certificate ID
 * @param {string[]} reinsurerIds - Reinsurer IDs to quote
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await submitFacultativeQuote(certId, ['reinsurer-1', 'reinsurer-2']);
 * ```
 */
export declare const submitFacultativeQuote: (certificateId: string, reinsurerIds: string[]) => Promise<void>;
/**
 * 8. Binds facultative coverage.
 *
 * @param {string} certificateId - Certificate ID
 * @param {ReinsurerParticipation[]} acceptedQuotes - Accepted reinsurer quotes
 * @returns {Promise<FacultativeCertificate>} Bound certificate
 *
 * @example
 * ```typescript
 * const bound = await bindFacultativeCoverage(certId, acceptedQuotes);
 * ```
 */
export declare const bindFacultativeCoverage: (certificateId: string, acceptedQuotes: ReinsurerParticipation[]) => Promise<FacultativeCertificate>;
/**
 * 9. Calculates facultative premium allocation.
 *
 * @param {number} grossPremium - Gross premium
 * @param {number} cedingPct - Ceding percentage
 * @param {number} commissionPct - Commission percentage
 * @returns {{ cedingPremium: number; commission: number; netPremium: number }}
 *
 * @example
 * ```typescript
 * const allocation = calculateFacultativePremiumAllocation(100000, 80, 25);
 * console.log('Net premium:', allocation.netPremium);
 * ```
 */
export declare const calculateFacultativePremiumAllocation: (grossPremium: number, cedingPct: number, commissionPct: number) => {
    cedingPremium: number;
    commission: number;
    netPremium: number;
};
/**
 * 10. Calculates quota share ceded premium.
 *
 * @param {number} grossPremium - Gross written premium
 * @param {number} quotaSharePct - Quota share percentage
 * @returns {number} Ceded premium
 *
 * @example
 * ```typescript
 * const ceded = calculateQuotaShareCededPremium(1000000, 30);
 * console.log('Ceded premium:', ceded); // 300000
 * ```
 */
export declare const calculateQuotaShareCededPremium: (grossPremium: number, quotaSharePct: number) => number;
/**
 * 11. Calculates surplus treaty ceded premium.
 *
 * @param {number} policyLimit - Policy limit
 * @param {number} retention - Retention amount
 * @param {number} numberOfLines - Number of surplus lines
 * @param {number} premiumRate - Premium rate
 * @returns {number} Ceded premium
 *
 * @example
 * ```typescript
 * const ceded = calculateSurplusCededPremium(5000000, 1000000, 4, 0.05);
 * ```
 */
export declare const calculateSurplusCededPremium: (policyLimit: number, retention: number, numberOfLines: number, premiumRate: number) => number;
/**
 * 12. Calculates excess of loss premium.
 *
 * @param {number} subjectPremium - Subject premium
 * @param {number} rate - Excess of loss rate
 * @param {number} minimumPremium - Minimum premium
 * @returns {number} Excess of loss premium
 *
 * @example
 * ```typescript
 * const premium = calculateExcessOfLossPremium(10000000, 0.05, 250000);
 * ```
 */
export declare const calculateExcessOfLossPremium: (subjectPremium: number, rate: number, minimumPremium?: number) => number;
/**
 * 13. Applies swing rating adjustment.
 *
 * @param {number} depositPremium - Deposit premium
 * @param {number} actualLossRatio - Actual loss ratio
 * @param {number} targetLossRatio - Target loss ratio
 * @param {number} maxSwingPct - Maximum swing percentage
 * @returns {number} Adjusted premium
 *
 * @example
 * ```typescript
 * const adjusted = applySwingRatingAdjustment(500000, 0.65, 0.60, 25);
 * ```
 */
export declare const applySwingRatingAdjustment: (depositPremium: number, actualLossRatio: number, targetLossRatio: number, maxSwingPct: number) => number;
/**
 * 14. Calculates reinstatement premium.
 *
 * @param {number} originalPremium - Original treaty premium
 * @param {number} lossAmount - Loss amount
 * @param {number} limit - Treaty limit
 * @param {number} reinstatementPct - Reinstatement premium percentage
 * @param {boolean} proRata - Pro rata reinstatement
 * @returns {number} Reinstatement premium
 *
 * @example
 * ```typescript
 * const reinstatement = calculateReinstatementPremium(1000000, 3000000, 5000000, 100, true);
 * ```
 */
export declare const calculateReinstatementPremium: (originalPremium: number, lossAmount: number, limit: number, reinstatementPct: number, proRata: boolean) => number;
/**
 * 15. Calculates flat ceding commission.
 *
 * @param {number} cedingPremium - Ceding premium
 * @param {number} commissionPct - Commission percentage
 * @returns {number} Commission amount
 *
 * @example
 * ```typescript
 * const commission = calculateFlatCedingCommission(500000, 25);
 * console.log('Commission:', commission); // 125000
 * ```
 */
export declare const calculateFlatCedingCommission: (cedingPremium: number, commissionPct: number) => number;
/**
 * 16. Calculates sliding scale commission.
 *
 * @param {number} cedingPremium - Ceding premium
 * @param {number} lossRatio - Loss ratio
 * @param {CommissionTerms['slidingScaleLadder']} ladder - Sliding scale ladder
 * @returns {number} Commission amount
 *
 * @example
 * ```typescript
 * const commission = calculateSlidingScaleCommission(1000000, 0.62, [
 *   { lossRatioMin: 0, lossRatioMax: 0.60, commissionPct: 30 },
 *   { lossRatioMin: 0.60, lossRatioMax: 0.70, commissionPct: 25 }
 * ]);
 * ```
 */
export declare const calculateSlidingScaleCommission: (cedingPremium: number, lossRatio: number, ladder?: Array<{
    lossRatioMin: number;
    lossRatioMax: number;
    commissionPct: number;
}>) => number;
/**
 * 17. Calculates profit commission.
 *
 * @param {number} earnedPremium - Earned premium
 * @param {number} incurredLosses - Incurred losses
 * @param {number} expenses - Expenses
 * @param {number} profitCommissionPct - Profit commission percentage
 * @returns {number} Profit commission
 *
 * @example
 * ```typescript
 * const profitComm = calculateProfitCommission(2000000, 1200000, 200000, 50);
 * ```
 */
export declare const calculateProfitCommission: (earnedPremium: number, incurredLosses: number, expenses: number, profitCommissionPct: number) => number;
/**
 * 18. Calculates contingent commission.
 *
 * @param {number} totalPremium - Total premium
 * @param {number} totalLosses - Total losses
 * @param {number} targetLossRatio - Target loss ratio
 * @param {number} commissionRate - Commission rate if target met
 * @returns {number} Contingent commission
 *
 * @example
 * ```typescript
 * const contingent = calculateContingentCommission(5000000, 2800000, 0.60, 10);
 * ```
 */
export declare const calculateContingentCommission: (totalPremium: number, totalLosses: number, targetLossRatio: number, commissionRate: number) => number;
/**
 * 19. Creates reinsurance recoverable.
 *
 * @param {Partial<ReinsuranceRecoverable>} recoverableData - Recoverable data
 * @returns {Promise<ReinsuranceRecoverable>} Created recoverable
 *
 * @example
 * ```typescript
 * const recoverable = await createReinsuranceRecoverable({
 *   claimId: 'claim-123',
 *   totalIncurredAmount: 5000000,
 *   cedingRetention: 1000000,
 *   recoverableAmount: 4000000
 * });
 * ```
 */
export declare const createReinsuranceRecoverable: (recoverableData: Partial<ReinsuranceRecoverable>) => Promise<ReinsuranceRecoverable>;
/**
 * 20. Calculates recoverable amount under quota share.
 *
 * @param {number} totalIncurred - Total incurred loss
 * @param {number} retention - Retention amount
 * @param {number} quotaSharePct - Quota share percentage
 * @returns {number} Recoverable amount
 *
 * @example
 * ```typescript
 * const recoverable = calculateQuotaShareRecoverable(5000000, 0, 30);
 * console.log('Recoverable:', recoverable); // 1500000
 * ```
 */
export declare const calculateQuotaShareRecoverable: (totalIncurred: number, retention: number, quotaSharePct: number) => number;
/**
 * 21. Calculates recoverable under excess of loss.
 *
 * @param {number} lossAmount - Loss amount
 * @param {number} attachmentPoint - Attachment point
 * @param {number} limit - Layer limit
 * @returns {number} Recoverable amount
 *
 * @example
 * ```typescript
 * const recoverable = calculateExcessOfLossRecoverable(8000000, 2000000, 5000000);
 * console.log('Recoverable:', recoverable); // 5000000 (capped at limit)
 * ```
 */
export declare const calculateExcessOfLossRecoverable: (lossAmount: number, attachmentPoint: number, limit: number) => number;
/**
 * 22. Allocates recoverable to reinsurers.
 *
 * @param {number} totalRecoverable - Total recoverable amount
 * @param {ReinsurerParticipation[]} participations - Reinsurer participations
 * @returns {Array<{ reinsurerId: string; allocationPct: number; recoverableAmount: number }>}
 *
 * @example
 * ```typescript
 * const allocations = allocateRecoverableToReinsurers(4000000, participations);
 * ```
 */
export declare const allocateRecoverableToReinsurers: (totalRecoverable: number, participations: ReinsurerParticipation[]) => Array<{
    reinsurerId: string;
    allocationPct: number;
    recoverableAmount: number;
    paidAmount: number;
    outstandingAmount: number;
}>;
/**
 * 23. Updates recoverable status.
 *
 * @param {string} recoverableId - Recoverable ID
 * @param {RecoverableStatus} status - New status
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateRecoverableStatus(recoverableId, 'collected');
 * ```
 */
export declare const updateRecoverableStatus: (recoverableId: string, status: RecoverableStatus) => Promise<void>;
/**
 * 24. Sends loss notification to reinsurers.
 *
 * @param {string} claimId - Claim ID
 * @param {string[]} reinsurerIds - Reinsurer IDs
 * @param {Object} lossDetails - Loss details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendLossNotification(claimId, reinsurerIds, {
 *   lossDate: new Date(),
 *   estimatedAmount: 5000000,
 *   description: 'Major property damage'
 * });
 * ```
 */
export declare const sendLossNotification: (claimId: string, reinsurerIds: string[], lossDetails: {
    lossDate: Date;
    estimatedAmount: number;
    description: string;
}) => Promise<void>;
/**
 * 25. Generates catastrophe loss report.
 *
 * @param {Date} eventDate - Catastrophe event date
 * @param {string} eventName - Event name
 * @param {string[]} affectedClaimIds - Affected claim IDs
 * @returns {Promise<{ totalIncurred: number; totalRecoverable: number; affectedTreaties: string[] }>}
 *
 * @example
 * ```typescript
 * const catReport = await generateCatastropheLossReport(
 *   new Date('2024-08-15'),
 *   'Hurricane Alpha',
 *   affectedClaimIds
 * );
 * ```
 */
export declare const generateCatastropheLossReport: (eventDate: Date, eventName: string, affectedClaimIds: string[]) => Promise<{
    totalIncurred: number;
    totalRecoverable: number;
    affectedTreaties: string[];
}>;
/**
 * 26. Creates premium bordereau.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {BordereauLineItem[]} lineItems - Line items
 * @returns {Promise<Bordereau>} Created bordereau
 *
 * @example
 * ```typescript
 * const bordereau = await createPremiumBordereau(
 *   treatyId,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   lineItems
 * );
 * ```
 */
export declare const createPremiumBordereau: (treatyId: string, periodStart: Date, periodEnd: Date, lineItems: BordereauLineItem[]) => Promise<Bordereau>;
/**
 * 27. Creates loss bordereau.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {BordereauLineItem[]} lossItems - Loss line items
 * @returns {Promise<Bordereau>} Created loss bordereau
 *
 * @example
 * ```typescript
 * const lossBordereau = await createLossBordereau(treatyId, periodStart, periodEnd, lossItems);
 * ```
 */
export declare const createLossBordereau: (treatyId: string, periodStart: Date, periodEnd: Date, lossItems: BordereauLineItem[]) => Promise<Bordereau>;
/**
 * 28. Submits bordereau to reinsurers.
 *
 * @param {string} bordereauId - Bordereau ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await submitBordereau(bordereauId);
 * ```
 */
export declare const submitBordereau: (bordereauId: string) => Promise<void>;
/**
 * 29. Reconciles bordereau payments.
 *
 * @param {string} bordereauId - Bordereau ID
 * @param {number} paymentAmount - Payment amount
 * @param {Date} paymentDate - Payment date
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reconcileBordereauPayment(bordereauId, 450000, new Date());
 * ```
 */
export declare const reconcileBordereauPayment: (bordereauId: string, paymentAmount: number, paymentDate: Date) => Promise<void>;
/**
 * 30. Creates retrocession program.
 *
 * @param {Partial<RetrocessionProgram>} programData - Program data
 * @returns {Promise<RetrocessionProgram>} Created program
 *
 * @example
 * ```typescript
 * const program = await createRetrocessionProgram({
 *   programName: 'Catastrophe Retro 2024',
 *   retrocededPct: 50,
 *   retainedPct: 50
 * });
 * ```
 */
export declare const createRetrocessionProgram: (programData: Partial<RetrocessionProgram>) => Promise<RetrocessionProgram>;
/**
 * 31. Calculates retrocession ceded premium.
 *
 * @param {number} originalCededPremium - Original ceded premium
 * @param {number} retrocessionPct - Retrocession percentage
 * @returns {number} Retroceded premium
 *
 * @example
 * ```typescript
 * const retroceded = calculateRetrocessionPremium(5000000, 50);
 * console.log('Retroceded:', retroceded); // 2500000
 * ```
 */
export declare const calculateRetrocessionPremium: (originalCededPremium: number, retrocessionPct: number) => number;
/**
 * 32. Analyzes reinsurance capacity.
 *
 * @param {string} lineOfBusiness - Line of business
 * @returns {Promise<CapacityAnalysis>} Capacity analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeReinsuranceCapacity('property');
 * console.log('Available capacity:', analysis.availableTreatyCapacity);
 * ```
 */
export declare const analyzeReinsuranceCapacity: (lineOfBusiness: string) => Promise<CapacityAnalysis>;
/**
 * 33. Calculates aggregate excess attachment.
 *
 * @param {number} annualPremium - Annual premium
 * @param {number} expectedLossRatio - Expected loss ratio
 * @param {number} attachmentMultiple - Attachment point multiple
 * @returns {number} Attachment point
 *
 * @example
 * ```typescript
 * const attachment = calculateAggregateExcessAttachment(10000000, 0.65, 1.5);
 * ```
 */
export declare const calculateAggregateExcessAttachment: (annualPremium: number, expectedLossRatio: number, attachmentMultiple: number) => number;
/**
 * 34. Optimizes retention levels.
 *
 * @param {number} capitalBase - Capital base
 * @param {number} riskTolerance - Risk tolerance percentage
 * @returns {number} Recommended retention
 *
 * @example
 * ```typescript
 * const retention = optimizeRetentionLevel(50000000, 0.10);
 * ```
 */
export declare const optimizeRetentionLevel: (capitalBase: number, riskTolerance: number) => number;
/**
 * 35. Identifies expiring treaties.
 *
 * @param {number} daysThreshold - Days until expiration
 * @returns {Promise<ReinsuranceTreaty[]>} Expiring treaties
 *
 * @example
 * ```typescript
 * const expiring = await identifyExpiringTreaties(90);
 * console.log(`${expiring.length} treaties expiring in 90 days`);
 * ```
 */
export declare const identifyExpiringTreaties: (daysThreshold: number) => Promise<ReinsuranceTreaty[]>;
/**
 * 36. Generates treaty renewal.
 *
 * @param {string} currentTreatyId - Current treaty ID
 * @param {Partial<ReinsuranceTreaty>} renewalTerms - Renewal terms
 * @returns {Promise<ReinsuranceTreaty>} Renewed treaty
 *
 * @example
 * ```typescript
 * const renewed = await generateTreatyRenewal(treatyId, {
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
export declare const generateTreatyRenewal: (currentTreatyId: string, renewalTerms: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
/**
 * 37. Generates reinsurance accounting report.
 *
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ cededPremium: number; commission: number; recoverables: number; netPosition: number }>}
 *
 * @example
 * ```typescript
 * const report = await generateReinsuranceAccountingReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateReinsuranceAccountingReport: (periodStart: Date, periodEnd: Date) => Promise<{
    cededPremium: number;
    commission: number;
    recoverables: number;
    netPosition: number;
}>;
/**
 * 38. Generates statutory schedule F.
 *
 * @param {number} year - Reporting year
 * @returns {Promise<any>} Schedule F data
 *
 * @example
 * ```typescript
 * const scheduleF = await generateStatutoryScheduleF(2024);
 * ```
 */
export declare const generateStatutoryScheduleF: (year: number) => Promise<any>;
/**
 * 39. Calculates reinsurance leverage ratio.
 *
 * @param {number} cededPremium - Ceded premium
 * @param {number} netPremium - Net premium written
 * @returns {number} Leverage ratio
 *
 * @example
 * ```typescript
 * const leverage = calculateReinsuranceLeverageRatio(15000000, 50000000);
 * console.log('Leverage ratio:', leverage); // 0.30
 * ```
 */
export declare const calculateReinsuranceLeverageRatio: (cededPremium: number, netPremium: number) => number;
/**
 * 40. Performs collectibility assessment.
 *
 * @param {string} reinsurerId - Reinsurer ID
 * @returns {Promise<CollectibilityAssessment>} Assessment
 *
 * @example
 * ```typescript
 * const assessment = await performCollectibilityAssessment('reinsurer-123');
 * console.log('Risk category:', assessment.riskCategory);
 * ```
 */
export declare const performCollectibilityAssessment: (reinsurerId: string) => Promise<CollectibilityAssessment>;
/**
 * 41. Calculates allowance for uncollectible reinsurance.
 *
 * @param {number} outstandingRecoverables - Outstanding recoverables
 * @param {ReinsurerRating} rating - Reinsurer rating
 * @param {number} overdueAmount - Overdue amount
 * @returns {number} Allowance amount
 *
 * @example
 * ```typescript
 * const allowance = calculateUncollectibleAllowance(5000000, 'BBB', 500000);
 * ```
 */
export declare const calculateUncollectibleAllowance: (outstandingRecoverables: number, rating: ReinsurerRating, overdueAmount: number) => number;
/**
 * 42. Monitors unauthorized reinsurance.
 *
 * @param {string} reinsurerId - Reinsurer ID
 * @returns {Promise<{ authorized: boolean; collateralRequired: number; collateralPosted: number }>}
 *
 * @example
 * ```typescript
 * const status = await monitorUnauthorizedReinsurance('reinsurer-123');
 * if (!status.authorized) console.log('Collateral required:', status.collateralRequired);
 * ```
 */
export declare const monitorUnauthorizedReinsurance: (reinsurerId: string) => Promise<{
    authorized: boolean;
    collateralRequired: number;
    collateralPosted: number;
}>;
/**
 * 43. Validates treaty terms.
 *
 * @param {ReinsuranceTreaty} treaty - Treaty to validate
 * @returns {string[]} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateTreatyTerms(treaty);
 * if (errors.length > 0) console.error('Validation errors:', errors);
 * ```
 */
export declare const validateTreatyTerms: (treaty: ReinsuranceTreaty) => string[];
/**
 * 44. Calculates net retention.
 *
 * @param {number} policyLimit - Policy limit
 * @param {number} quotaShareCeded - Quota share ceded amount
 * @param {number} excessCeded - Excess ceded amount
 * @returns {number} Net retention
 *
 * @example
 * ```typescript
 * const retention = calculateNetRetention(10000000, 3000000, 5000000);
 * console.log('Net retention:', retention); // 2000000
 * ```
 */
export declare const calculateNetRetention: (policyLimit: number, quotaShareCeded: number, excessCeded: number) => number;
/**
 * 45. Generates treaty performance metrics.
 *
 * @param {string} treatyId - Treaty ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ lossRatio: number; combinedRatio: number; profitMargin: number }>}
 *
 * @example
 * ```typescript
 * const metrics = await generateTreatyPerformanceMetrics(
 *   treatyId,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateTreatyPerformanceMetrics: (treatyId: string, periodStart: Date, periodEnd: Date) => Promise<{
    lossRatio: number;
    combinedRatio: number;
    profitMargin: number;
}>;
declare const _default: {
    loadReinsuranceConfig: () => ReinsuranceConfig;
    validateReinsuranceConfig: (config: ReinsuranceConfig) => string[];
    createReinsuranceTreatyModel: (sequelize: Sequelize) => any;
    createFacultativeCertificateModel: (sequelize: Sequelize) => any;
    createReinsuranceTreaty: (treatyData: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
    updateReinsuranceTreaty: (treatyId: string, updates: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
    addReinsurerParticipation: (treatyId: string, participation: ReinsurerParticipation) => Promise<void>;
    validateParticipationPercentages: (participations: ReinsurerParticipation[]) => boolean;
    getActiveTreatiesByType: (treatyType: TreatyType, effectiveDate?: Date) => Promise<ReinsuranceTreaty[]>;
    createFacultativeCertificate: (certData: Partial<FacultativeCertificate>) => Promise<FacultativeCertificate>;
    submitFacultativeQuote: (certificateId: string, reinsurerIds: string[]) => Promise<void>;
    bindFacultativeCoverage: (certificateId: string, acceptedQuotes: ReinsurerParticipation[]) => Promise<FacultativeCertificate>;
    calculateFacultativePremiumAllocation: (grossPremium: number, cedingPct: number, commissionPct: number) => {
        cedingPremium: number;
        commission: number;
        netPremium: number;
    };
    calculateQuotaShareCededPremium: (grossPremium: number, quotaSharePct: number) => number;
    calculateSurplusCededPremium: (policyLimit: number, retention: number, numberOfLines: number, premiumRate: number) => number;
    calculateExcessOfLossPremium: (subjectPremium: number, rate: number, minimumPremium?: number) => number;
    applySwingRatingAdjustment: (depositPremium: number, actualLossRatio: number, targetLossRatio: number, maxSwingPct: number) => number;
    calculateReinstatementPremium: (originalPremium: number, lossAmount: number, limit: number, reinstatementPct: number, proRata: boolean) => number;
    calculateFlatCedingCommission: (cedingPremium: number, commissionPct: number) => number;
    calculateSlidingScaleCommission: (cedingPremium: number, lossRatio: number, ladder?: Array<{
        lossRatioMin: number;
        lossRatioMax: number;
        commissionPct: number;
    }>) => number;
    calculateProfitCommission: (earnedPremium: number, incurredLosses: number, expenses: number, profitCommissionPct: number) => number;
    calculateContingentCommission: (totalPremium: number, totalLosses: number, targetLossRatio: number, commissionRate: number) => number;
    createReinsuranceRecoverable: (recoverableData: Partial<ReinsuranceRecoverable>) => Promise<ReinsuranceRecoverable>;
    calculateQuotaShareRecoverable: (totalIncurred: number, retention: number, quotaSharePct: number) => number;
    calculateExcessOfLossRecoverable: (lossAmount: number, attachmentPoint: number, limit: number) => number;
    allocateRecoverableToReinsurers: (totalRecoverable: number, participations: ReinsurerParticipation[]) => Array<{
        reinsurerId: string;
        allocationPct: number;
        recoverableAmount: number;
        paidAmount: number;
        outstandingAmount: number;
    }>;
    updateRecoverableStatus: (recoverableId: string, status: RecoverableStatus) => Promise<void>;
    sendLossNotification: (claimId: string, reinsurerIds: string[], lossDetails: {
        lossDate: Date;
        estimatedAmount: number;
        description: string;
    }) => Promise<void>;
    generateCatastropheLossReport: (eventDate: Date, eventName: string, affectedClaimIds: string[]) => Promise<{
        totalIncurred: number;
        totalRecoverable: number;
        affectedTreaties: string[];
    }>;
    createPremiumBordereau: (treatyId: string, periodStart: Date, periodEnd: Date, lineItems: BordereauLineItem[]) => Promise<Bordereau>;
    createLossBordereau: (treatyId: string, periodStart: Date, periodEnd: Date, lossItems: BordereauLineItem[]) => Promise<Bordereau>;
    submitBordereau: (bordereauId: string) => Promise<void>;
    reconcileBordereauPayment: (bordereauId: string, paymentAmount: number, paymentDate: Date) => Promise<void>;
    createRetrocessionProgram: (programData: Partial<RetrocessionProgram>) => Promise<RetrocessionProgram>;
    calculateRetrocessionPremium: (originalCededPremium: number, retrocessionPct: number) => number;
    analyzeReinsuranceCapacity: (lineOfBusiness: string) => Promise<CapacityAnalysis>;
    calculateAggregateExcessAttachment: (annualPremium: number, expectedLossRatio: number, attachmentMultiple: number) => number;
    optimizeRetentionLevel: (capitalBase: number, riskTolerance: number) => number;
    identifyExpiringTreaties: (daysThreshold: number) => Promise<ReinsuranceTreaty[]>;
    generateTreatyRenewal: (currentTreatyId: string, renewalTerms: Partial<ReinsuranceTreaty>) => Promise<ReinsuranceTreaty>;
    generateReinsuranceAccountingReport: (periodStart: Date, periodEnd: Date) => Promise<{
        cededPremium: number;
        commission: number;
        recoverables: number;
        netPosition: number;
    }>;
    generateStatutoryScheduleF: (year: number) => Promise<any>;
    calculateReinsuranceLeverageRatio: (cededPremium: number, netPremium: number) => number;
    performCollectibilityAssessment: (reinsurerId: string) => Promise<CollectibilityAssessment>;
    calculateUncollectibleAllowance: (outstandingRecoverables: number, rating: ReinsurerRating, overdueAmount: number) => number;
    monitorUnauthorizedReinsurance: (reinsurerId: string) => Promise<{
        authorized: boolean;
        collateralRequired: number;
        collateralPosted: number;
    }>;
    validateTreatyTerms: (treaty: ReinsuranceTreaty) => string[];
    calculateNetRetention: (policyLimit: number, quotaShareCeded: number, excessCeded: number) => number;
    generateTreatyPerformanceMetrics: (treatyId: string, periodStart: Date, periodEnd: Date) => Promise<{
        lossRatio: number;
        combinedRatio: number;
        profitMargin: number;
    }>;
};
export default _default;
//# sourceMappingURL=reinsurance-management-kit.d.ts.map