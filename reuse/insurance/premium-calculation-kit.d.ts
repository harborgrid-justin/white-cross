/**
 * LOC: INS-PREM-001
 * File: /reuse/insurance/premium-calculation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance policy services
 *   - Premium billing modules
 *   - Quote generation services
 *   - Policy modification handlers
 */
/**
 * File: /reuse/insurance/premium-calculation-kit.ts
 * Locator: WC-UTL-PREMIUM-001
 * Purpose: Insurance Premium Calculation Kit - Comprehensive premium rating and calculation utilities
 *
 * Upstream: Independent utility module for insurance premium calculations
 * Downstream: ../backend/*, Insurance services, Billing processors, Quote engines, Policy services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator, class-transformer
 * Exports: 40 utility functions for base premium rating, rating factors, discounts, surcharges, territory rating,
 *          premium financing, installment fees, proration, earned/unearned premium, refunds, commissions,
 *          taxes/fees, minimum premium, rounding rules, rate changes
 *
 * LLM Context: Production-ready insurance premium calculation utilities for White Cross healthcare platform.
 * Provides comprehensive premium rating algorithms, multi-factor rating applications, discount/surcharge logic,
 * territory-based rating, premium financing calculations, installment fee processing, policy change prorations,
 * earned vs unearned premium calculations, refund processing, commission adjustments, jurisdiction-specific
 * tax and fee calculations, minimum premium enforcement, and rate change applicability. Essential for accurate
 * premium computation and billing operations across all insurance products.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Premium calculation method
 */
export type PremiumCalculationMethod = 'annual' | 'semiannual' | 'quarterly' | 'monthly' | 'single';
/**
 * Rating factor types
 */
export type RatingFactorType = 'age' | 'location' | 'coverage' | 'deductible' | 'vehicle' | 'property' | 'occupation' | 'health';
/**
 * Discount types
 */
export type DiscountType = 'multi_policy' | 'claims_free' | 'safety_feature' | 'loyalty' | 'payment_method' | 'group' | 'senior' | 'student';
/**
 * Surcharge types
 */
export type SurchargeType = 'violation' | 'claim' | 'high_risk' | 'coverage_modification' | 'payment_default';
/**
 * Payment frequency
 */
export type PaymentFrequency = 'annual' | 'semiannual' | 'quarterly' | 'monthly' | 'weekly';
/**
 * Premium component breakdown
 */
export interface PremiumBreakdown {
    basePremium: number;
    ratingFactorAdjustments: RatingAdjustment[];
    discounts: DiscountApplication[];
    surcharges: SurchargeApplication[];
    taxes: TaxApplication[];
    fees: FeeApplication[];
    totalPremium: number;
    effectiveRate: number;
    calculatedAt: Date;
}
/**
 * Rating adjustment
 */
export interface RatingAdjustment {
    factorType: RatingFactorType;
    factorName: string;
    baseValue: any;
    multiplier: number;
    adjustment: number;
    description: string;
}
/**
 * Discount application
 */
export interface DiscountApplication {
    discountType: DiscountType;
    discountCode: string;
    description: string;
    percentage?: number;
    amount?: number;
    appliedAmount: number;
    eligibilityCriteria: string[];
    stackable: boolean;
}
/**
 * Surcharge application
 */
export interface SurchargeApplication {
    surchargeType: SurchargeType;
    surchargeCode: string;
    description: string;
    percentage?: number;
    amount?: number;
    appliedAmount: number;
    reason: string;
    duration?: number;
    expiryDate?: Date;
}
/**
 * Tax application
 */
export interface TaxApplication {
    taxType: string;
    jurisdiction: string;
    taxRate: number;
    taxableAmount: number;
    taxAmount: number;
    description: string;
}
/**
 * Fee application
 */
export interface FeeApplication {
    feeType: string;
    description: string;
    amount: number;
    required: boolean;
    waivable: boolean;
}
/**
 * Territory rating
 */
export interface TerritoryRating {
    territoryCode: string;
    state: string;
    county?: string;
    zipCode?: string;
    riskScore: number;
    baseRate: number;
    territoryFactor: number;
    effectiveDate: Date;
    expiryDate?: Date;
}
/**
 * Premium financing terms
 */
export interface PremiumFinancingTerms {
    totalPremium: number;
    downPayment: number;
    financedAmount: number;
    apr: number;
    numberOfPayments: number;
    paymentAmount: number;
    totalFinanceCharge: number;
    totalPayable: number;
    paymentSchedule: PaymentScheduleEntry[];
}
/**
 * Payment schedule entry
 */
export interface PaymentScheduleEntry {
    paymentNumber: number;
    dueDate: Date;
    paymentAmount: number;
    principal: number;
    interest: number;
    remainingBalance: number;
}
/**
 * Installment configuration
 */
export interface InstallmentConfiguration {
    frequency: PaymentFrequency;
    numberOfPayments: number;
    installmentFee: number;
    installmentFeeType: 'flat' | 'percentage';
    downPaymentPercentage: number;
    minimumDownPayment: number;
}
/**
 * Premium proration
 */
export interface PremiumProration {
    originalPremium: number;
    proratedPremium: number;
    prorationMethod: 'daily' | 'monthly' | 'short_rate' | 'pro_rata';
    effectiveDate: Date;
    expirationDate: Date;
    daysInTerm: number;
    daysUsed: number;
    daysRemaining: number;
    refundAmount?: number;
    additionalPremium?: number;
}
/**
 * Earned premium calculation
 */
export interface EarnedPremiumCalculation {
    writtenPremium: number;
    earnedPremium: number;
    unearnedPremium: number;
    earnedPercentage: number;
    calculationMethod: 'daily' | 'monthly' | 'annual';
    asOfDate: Date;
    policyInceptionDate: Date;
    policyExpirationDate: Date;
}
/**
 * Premium refund
 */
export interface PremiumRefund {
    refundId: string;
    policyId: string;
    originalPremium: number;
    earnedPremium: number;
    unearnedPremium: number;
    refundableAmount: number;
    refundMethod: 'pro_rata' | 'short_rate';
    cancellationDate: Date;
    cancellationReason: string;
    penaltyAmount?: number;
    processingFee?: number;
    netRefund: number;
}
/**
 * Commission structure
 */
export interface CommissionStructure {
    agentId: string;
    commissionRate: number;
    commissionType: 'percentage' | 'flat';
    tiered: boolean;
    tiers?: CommissionTier[];
    overrides?: CommissionOverride[];
    vesting?: VestingSchedule;
}
/**
 * Commission tier
 */
export interface CommissionTier {
    minPremium: number;
    maxPremium?: number;
    rate: number;
}
/**
 * Commission override
 */
export interface CommissionOverride {
    productType: string;
    rate: number;
    reason: string;
}
/**
 * Vesting schedule
 */
export interface VestingSchedule {
    vestingPeriod: number;
    vestingPercentages: number[];
    chargebackPeriod: number;
}
/**
 * Jurisdiction tax configuration
 */
export interface JurisdictionTaxConfig {
    jurisdiction: string;
    state: string;
    county?: string;
    city?: string;
    premiumTaxRate: number;
    surplusTaxRate?: number;
    stampingFeeRate?: number;
    filingFeeRate?: number;
    specialAssessments?: SpecialAssessment[];
    effectiveDate: Date;
    expiryDate?: Date;
}
/**
 * Special assessment
 */
export interface SpecialAssessment {
    assessmentType: string;
    rate: number;
    applicableProducts: string[];
    description: string;
}
/**
 * Minimum premium rule
 */
export interface MinimumPremiumRule {
    productType: string;
    minimumPremium: number;
    applicableStates?: string[];
    exemptions?: string[];
    effectiveDate: Date;
}
/**
 * Premium rounding rule
 */
export interface PremiumRoundingRule {
    roundingMethod: 'up' | 'down' | 'nearest';
    roundToNearest: number;
    applyToTotal: boolean;
    applyToComponents: string[];
}
/**
 * Rate change
 */
export interface RateChange {
    rateChangeId: string;
    productType: string;
    effectiveDate: Date;
    changePercentage: number;
    changeReason: string;
    approvedBy: string;
    approvalDate: Date;
    affectedPolicies?: number;
    jurisdiction?: string;
}
/**
 * Premium calculation model attributes
 */
export interface PremiumCalculationAttributes {
    id: string;
    policyId: string;
    quoteId?: string;
    calculationType: string;
    basePremium: number;
    ratingFactors: any;
    discounts: any;
    surcharges: any;
    taxes: any;
    fees: any;
    totalPremium: number;
    effectiveRate: number;
    calculationMethod: string;
    version: number;
    calculatedAt: Date;
    calculatedBy?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates PremiumCalculation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PremiumCalculationAttributes>>} PremiumCalculation model
 *
 * @example
 * ```typescript
 * const CalculationModel = createPremiumCalculationModel(sequelize);
 * const calc = await CalculationModel.create({
 *   policyId: 'policy-123',
 *   calculationType: 'new_business',
 *   basePremium: 1200.00,
 *   totalPremium: 1350.00
 * });
 * ```
 */
export declare const createPremiumCalculationModel: (sequelize: Sequelize) => any;
/**
 * Rate table model attributes
 */
export interface RateTableAttributes {
    id: string;
    productType: string;
    state: string;
    coverageType: string;
    effectiveDate: Date;
    expiryDate?: Date;
    baseRate: number;
    ratingFactors: any;
    version: string;
    status: string;
    approvedBy?: string;
    approvalDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates RateTable model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RateTableAttributes>>} RateTable model
 */
export declare const createRateTableModel: (sequelize: Sequelize) => any;
/**
 * Territory rating model attributes
 */
export interface TerritoryRatingAttributes {
    id: string;
    territoryCode: string;
    state: string;
    county?: string;
    zipCode?: string;
    productType: string;
    riskScore: number;
    baseRate: number;
    territoryFactor: number;
    effectiveDate: Date;
    expiryDate?: Date;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates TerritoryRating model for Sequelize.
 */
export declare const createTerritoryRatingModel: (sequelize: Sequelize) => any;
/**
 * Premium financing model attributes
 */
export interface PremiumFinancingAttributes {
    id: string;
    policyId: string;
    totalPremium: number;
    downPayment: number;
    financedAmount: number;
    apr: number;
    numberOfPayments: number;
    paymentAmount: number;
    totalFinanceCharge: number;
    totalPayable: number;
    paymentSchedule: any;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates PremiumFinancing model for Sequelize.
 */
export declare const createPremiumFinancingModel: (sequelize: Sequelize) => any;
/**
 * Tax configuration model attributes
 */
export interface TaxConfigurationAttributes {
    id: string;
    jurisdiction: string;
    state: string;
    county?: string;
    city?: string;
    productTypes: any;
    premiumTaxRate: number;
    surplusTaxRate?: number;
    stampingFeeRate?: number;
    filingFeeRate?: number;
    specialAssessments?: any;
    effectiveDate: Date;
    expiryDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates TaxConfiguration model for Sequelize.
 */
export declare const createTaxConfigurationModel: (sequelize: Sequelize) => any;
/**
 * 1. Calculates base premium for a policy.
 *
 * @param {string} productType - Insurance product type
 * @param {number} coverageAmount - Coverage amount
 * @param {Record<string, any>} baseFactors - Base rating factors
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<number>} Base premium amount
 *
 * @example
 * ```typescript
 * const basePremium = await calculateBasePremium('auto', 100000, {
 *   vehicleType: 'sedan',
 *   age: 35
 * });
 * console.log('Base premium:', basePremium);
 * ```
 */
export declare const calculateBasePremium: (productType: string, coverageAmount: number, baseFactors: Record<string, any>, transaction?: Transaction) => Promise<number>;
/**
 * 2. Retrieves base rate from rate table.
 *
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @param {string} coverageType - Coverage type
 * @param {Date} effectiveDate - Effective date for rate
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<number>} Base rate
 */
export declare const getBaseRate: (productType: string, state: string, coverageType: string, effectiveDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * 3. Calculates rate per unit of coverage.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageUnits - Number of coverage units
 * @returns {Promise<number>} Rate per unit
 */
export declare const calculateRatePerUnit: (basePremium: number, coverageUnits: number) => Promise<number>;
/**
 * 4. Applies age rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} age - Applicant age
 * @param {string} productType - Insurance product type
 * @returns {Promise<RatingAdjustment>} Age rating adjustment
 */
export declare const applyAgeRatingFactor: (basePremium: number, age: number, productType: string) => Promise<RatingAdjustment>;
/**
 * 5. Applies location-based rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {string} zipCode - ZIP code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment>} Location rating adjustment
 */
export declare const applyLocationRatingFactor: (basePremium: number, zipCode: string, productType: string, transaction?: Transaction) => Promise<RatingAdjustment>;
/**
 * 6. Applies coverage level rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageAmount - Coverage amount
 * @param {number} deductible - Deductible amount
 * @returns {Promise<RatingAdjustment>} Coverage rating adjustment
 */
export declare const applyCoverageRatingFactor: (basePremium: number, coverageAmount: number, deductible: number) => Promise<RatingAdjustment>;
/**
 * 7. Applies multiple rating factors.
 *
 * @param {number} basePremium - Base premium amount
 * @param {Record<RatingFactorType, any>} factors - Rating factors to apply
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment[]>} All rating adjustments
 */
export declare const applyMultipleRatingFactors: (basePremium: number, factors: Record<string, any>, transaction?: Transaction) => Promise<RatingAdjustment[]>;
/**
 * 8. Applies multi-policy discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} policyCount - Number of policies
 * @returns {Promise<DiscountApplication>} Multi-policy discount
 */
export declare const applyMultiPolicyDiscount: (premium: number, policyCount: number) => Promise<DiscountApplication>;
/**
 * 9. Applies claims-free discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsClaimsFree - Number of years without claims
 * @returns {Promise<DiscountApplication>} Claims-free discount
 */
export declare const applyClaimsFreeDiscount: (premium: number, yearsClaimsFree: number) => Promise<DiscountApplication>;
/**
 * 10. Applies safety feature discount.
 *
 * @param {number} premium - Premium amount
 * @param {string[]} safetyFeatures - List of safety features
 * @param {string} productType - Insurance product type
 * @returns {Promise<DiscountApplication>} Safety feature discount
 */
export declare const applySafetyFeatureDiscount: (premium: number, safetyFeatures: string[], productType: string) => Promise<DiscountApplication>;
/**
 * 11. Applies loyalty discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsWithCompany - Years as customer
 * @returns {Promise<DiscountApplication>} Loyalty discount
 */
export declare const applyLoyaltyDiscount: (premium: number, yearsWithCompany: number) => Promise<DiscountApplication>;
/**
 * 12. Applies all eligible discounts.
 *
 * @param {number} premium - Premium amount
 * @param {Record<string, any>} discountFactors - Discount eligibility factors
 * @returns {Promise<DiscountApplication[]>} All applicable discounts
 */
export declare const applyAllDiscounts: (premium: number, discountFactors: Record<string, any>) => Promise<DiscountApplication[]>;
/**
 * 13. Applies violation surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {string} violationType - Type of violation
 * @param {number} violationCount - Number of violations
 * @returns {Promise<SurchargeApplication>} Violation surcharge
 */
export declare const applyViolationSurcharge: (premium: number, violationType: string, violationCount: number) => Promise<SurchargeApplication>;
/**
 * 14. Applies claims surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {number} claimCount - Number of claims
 * @param {number} totalClaimAmount - Total claim amount
 * @returns {Promise<SurchargeApplication>} Claims surcharge
 */
export declare const applyClaimsSurcharge: (premium: number, claimCount: number, totalClaimAmount: number) => Promise<SurchargeApplication>;
/**
 * 15. Applies high-risk surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {string} riskReason - Reason for high risk classification
 * @param {number} riskScore - Risk score (0-100)
 * @returns {Promise<SurchargeApplication>} High-risk surcharge
 */
export declare const applyHighRiskSurcharge: (premium: number, riskReason: string, riskScore: number) => Promise<SurchargeApplication>;
/**
 * 16. Calculates total surcharge amount.
 *
 * @param {number} premium - Premium amount
 * @param {SurchargeApplication[]} surcharges - Array of surcharges
 * @returns {Promise<number>} Total surcharge amount
 */
export declare const calculateTotalSurcharges: (premium: number, surcharges: SurchargeApplication[]) => Promise<number>;
/**
 * 17. Retrieves territory rating for location.
 *
 * @param {string} zipCode - ZIP code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<TerritoryRating>} Territory rating information
 */
export declare const getTerritoryRating: (zipCode: string, productType: string, transaction?: Transaction) => Promise<TerritoryRating>;
/**
 * 18. Applies territory factor to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {TerritoryRating} territoryRating - Territory rating data
 * @returns {Promise<number>} Territory-adjusted premium
 */
export declare const applyTerritoryFactor: (basePremium: number, territoryRating: TerritoryRating) => Promise<number>;
/**
 * 19. Compares territory ratings across locations.
 *
 * @param {string[]} zipCodes - Array of ZIP codes
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<string, TerritoryRating>>} Territory rating comparison
 */
export declare const compareTerritoryRatings: (zipCodes: string[], productType: string, transaction?: Transaction) => Promise<Record<string, TerritoryRating>>;
/**
 * 20. Calculates premium financing terms.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} downPayment - Down payment amount
 * @param {number} apr - Annual percentage rate
 * @param {number} numberOfPayments - Number of payments
 * @returns {Promise<PremiumFinancingTerms>} Financing terms
 */
export declare const calculateFinancingTerms: (totalPremium: number, downPayment: number, apr: number, numberOfPayments: number) => Promise<PremiumFinancingTerms>;
/**
 * 21. Calculates installment fees.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {PaymentFrequency} frequency - Payment frequency
 * @returns {Promise<{ installmentFee: number; totalWithFees: number }>} Installment fee calculation
 */
export declare const calculateInstallmentFees: (totalPremium: number, frequency: PaymentFrequency) => Promise<{
    installmentFee: number;
    totalWithFees: number;
}>;
/**
 * 22. Determines optimal payment plan.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} monthlyBudget - Monthly budget constraint
 * @returns {Promise<{ frequency: PaymentFrequency; paymentAmount: number; totalCost: number }>} Optimal payment plan
 */
export declare const determineOptimalPaymentPlan: (totalPremium: number, monthlyBudget: number) => Promise<{
    frequency: PaymentFrequency;
    paymentAmount: number;
    totalCost: number;
}>;
/**
 * 23. Calculates prorated premium for policy changes.
 *
 * @param {number} annualPremium - Annual premium amount
 * @param {Date} effectiveDate - Change effective date
 * @param {Date} expirationDate - Policy expiration date
 * @param {'daily' | 'monthly' | 'short_rate' | 'pro_rata'} method - Proration method
 * @returns {Promise<PremiumProration>} Proration calculation
 */
export declare const calculateProratedPremium: (annualPremium: number, effectiveDate: Date, expirationDate: Date, method?: "daily" | "monthly" | "short_rate" | "pro_rata") => Promise<PremiumProration>;
/**
 * 24. Calculates endorsement premium adjustment.
 *
 * @param {number} currentPremium - Current premium amount
 * @param {number} newPremium - New premium amount
 * @param {Date} endorsementDate - Endorsement effective date
 * @param {Date} expirationDate - Policy expiration date
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ additionalPremium: number; refundAmount: number }>} Endorsement premium adjustment
 */
export declare const calculateEndorsementPremium: (currentPremium: number, newPremium: number, endorsementDate: Date, expirationDate: Date, transaction?: Transaction) => Promise<{
    additionalPremium: number;
    refundAmount: number;
}>;
/**
 * 25. Calculates earned and unearned premium.
 *
 * @param {number} writtenPremium - Written premium amount
 * @param {Date} inceptionDate - Policy inception date
 * @param {Date} expirationDate - Policy expiration date
 * @param {Date} asOfDate - As-of date for calculation
 * @returns {Promise<EarnedPremiumCalculation>} Earned premium calculation
 */
export declare const calculateEarnedPremium: (writtenPremium: number, inceptionDate: Date, expirationDate: Date, asOfDate?: Date) => Promise<EarnedPremiumCalculation>;
/**
 * 26. Calculates unearned premium reserve.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} asOfDate - As-of date for calculation
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalUnearned: number; policyCount: number }>} Unearned premium reserve
 */
export declare const calculateUnearnedPremiumReserve: (policyIds: string[], asOfDate: Date, transaction?: Transaction) => Promise<{
    totalUnearned: number;
    policyCount: number;
}>;
/**
 * 27. Calculates premium refund for cancellation.
 *
 * @param {string} policyId - Policy identifier
 * @param {Date} cancellationDate - Cancellation date
 * @param {'pro_rata' | 'short_rate'} refundMethod - Refund calculation method
 * @param {string} cancellationReason - Reason for cancellation
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<PremiumRefund>} Premium refund calculation
 */
export declare const calculatePremiumRefund: (policyId: string, cancellationDate: Date, refundMethod: "pro_rata" | "short_rate", cancellationReason: string, transaction?: Transaction) => Promise<PremiumRefund>;
/**
 * 28. Processes bulk refund calculations.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} effectiveDate - Effective date for refunds
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<PremiumRefund[]>} Array of refund calculations
 */
export declare const processBulkRefunds: (policyIds: string[], effectiveDate: Date, transaction?: Transaction) => Promise<PremiumRefund[]>;
/**
 * 29. Calculates agent commission.
 *
 * @param {number} premium - Premium amount
 * @param {string} agentId - Agent identifier
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ commissionAmount: number; commissionRate: number }>} Commission calculation
 */
export declare const calculateAgentCommission: (premium: number, agentId: string, productType: string, transaction?: Transaction) => Promise<{
    commissionAmount: number;
    commissionRate: number;
}>;
/**
 * 30. Calculates net premium after commission.
 *
 * @param {number} grossPremium - Gross premium amount
 * @param {number} commissionRate - Commission rate
 * @returns {Promise<number>} Net premium
 */
export declare const calculateNetPremium: (grossPremium: number, commissionRate: number) => Promise<number>;
/**
 * 31. Applies tiered commission structure.
 *
 * @param {number} premium - Premium amount
 * @param {CommissionTier[]} tiers - Commission tier structure
 * @returns {Promise<number>} Tiered commission amount
 */
export declare const applyTieredCommission: (premium: number, tiers: CommissionTier[]) => Promise<number>;
/**
 * 32. Calculates jurisdiction-specific taxes.
 *
 * @param {number} premium - Premium amount
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<TaxApplication[]>} Tax calculations
 */
export declare const calculateJurisdictionTaxes: (premium: number, state: string, productType: string, transaction?: Transaction) => Promise<TaxApplication[]>;
/**
 * 33. Applies state-specific fees.
 *
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @returns {Promise<FeeApplication[]>} State-specific fees
 */
export declare const applyStateFees: (state: string, productType: string) => Promise<FeeApplication[]>;
/**
 * 34. Calculates total taxes and fees.
 *
 * @param {number} premium - Premium amount
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalTaxes: number; totalFees: number; grandTotal: number }>} Tax and fee totals
 */
export declare const calculateTotalTaxesAndFees: (premium: number, state: string, productType: string, transaction?: Transaction) => Promise<{
    totalTaxes: number;
    totalFees: number;
    grandTotal: number;
}>;
/**
 * 35. Enforces minimum premium rules.
 *
 * @param {number} calculatedPremium - Calculated premium amount
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @returns {Promise<{ finalPremium: number; minimumApplied: boolean; minimumAmount?: number }>} Minimum premium enforcement
 */
export declare const enforceMinimumPremium: (calculatedPremium: number, productType: string, state: string) => Promise<{
    finalPremium: number;
    minimumApplied: boolean;
    minimumAmount?: number;
}>;
/**
 * 36. Retrieves minimum premium rules.
 *
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<MinimumPremiumRule>} Minimum premium rule
 */
export declare const getMinimumPremiumRule: (productType: string, state: string, transaction?: Transaction) => Promise<MinimumPremiumRule>;
/**
 * 37. Applies premium rounding rules.
 *
 * @param {number} premium - Premium amount to round
 * @param {PremiumRoundingRule} roundingRule - Rounding rule configuration
 * @returns {Promise<number>} Rounded premium
 */
export declare const applyPremiumRounding: (premium: number, roundingRule: PremiumRoundingRule) => Promise<number>;
/**
 * 38. Applies rounding to premium breakdown.
 *
 * @param {PremiumBreakdown} breakdown - Premium breakdown
 * @param {number} roundToNearest - Round to nearest value (e.g., 0.01, 1.00)
 * @returns {Promise<PremiumBreakdown>} Rounded premium breakdown
 */
export declare const applyRoundingToBreakdown: (breakdown: PremiumBreakdown, roundToNearest: number) => Promise<PremiumBreakdown>;
/**
 * 39. Determines if rate change applies to policy.
 *
 * @param {string} policyId - Policy identifier
 * @param {RateChange} rateChange - Rate change details
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ applies: boolean; reason: string; newPremium?: number }>} Rate change applicability
 */
export declare const determineRateChangeApplicability: (policyId: string, rateChange: RateChange, transaction?: Transaction) => Promise<{
    applies: boolean;
    reason: string;
    newPremium?: number;
}>;
/**
 * 40. Applies rate change to premium.
 *
 * @param {number} currentPremium - Current premium amount
 * @param {number} changePercentage - Rate change percentage
 * @returns {Promise<{ oldPremium: number; newPremium: number; difference: number }>} Rate change application
 */
export declare const applyRateChange: (currentPremium: number, changePercentage: number) => Promise<{
    oldPremium: number;
    newPremium: number;
    difference: number;
}>;
//# sourceMappingURL=premium-calculation-kit.d.ts.map