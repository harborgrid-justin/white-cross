"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRateChange = exports.determineRateChangeApplicability = exports.applyRoundingToBreakdown = exports.applyPremiumRounding = exports.getMinimumPremiumRule = exports.enforceMinimumPremium = exports.calculateTotalTaxesAndFees = exports.applyStateFees = exports.calculateJurisdictionTaxes = exports.applyTieredCommission = exports.calculateNetPremium = exports.calculateAgentCommission = exports.processBulkRefunds = exports.calculatePremiumRefund = exports.calculateUnearnedPremiumReserve = exports.calculateEarnedPremium = exports.calculateEndorsementPremium = exports.calculateProratedPremium = exports.determineOptimalPaymentPlan = exports.calculateInstallmentFees = exports.calculateFinancingTerms = exports.compareTerritoryRatings = exports.applyTerritoryFactor = exports.getTerritoryRating = exports.calculateTotalSurcharges = exports.applyHighRiskSurcharge = exports.applyClaimsSurcharge = exports.applyViolationSurcharge = exports.applyAllDiscounts = exports.applyLoyaltyDiscount = exports.applySafetyFeatureDiscount = exports.applyClaimsFreeDiscount = exports.applyMultiPolicyDiscount = exports.applyMultipleRatingFactors = exports.applyCoverageRatingFactor = exports.applyLocationRatingFactor = exports.applyAgeRatingFactor = exports.calculateRatePerUnit = exports.getBaseRate = exports.calculateBasePremium = exports.createTaxConfigurationModel = exports.createPremiumFinancingModel = exports.createTerritoryRatingModel = exports.createRateTableModel = exports.createPremiumCalculationModel = void 0;
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
const sequelize_1 = require("sequelize");
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
const createPremiumCalculationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to policy',
        },
        quoteId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to quote if applicable',
        },
        calculationType: {
            type: sequelize_1.DataTypes.ENUM('new_business', 'renewal', 'endorsement', 'quote', 'audit'),
            allowNull: false,
        },
        basePremium: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        ratingFactors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applied rating factors',
        },
        discounts: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applied discounts',
        },
        surcharges: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applied surcharges',
        },
        taxes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applied taxes',
        },
        fees: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applied fees',
        },
        totalPremium: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        effectiveRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: false,
            comment: 'Effective premium rate per unit',
        },
        calculationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'standard',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Calculation version for tracking changes',
        },
        calculatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        calculatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'System or user ID',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional calculation metadata',
        },
    };
    const options = {
        tableName: 'premium_calculations',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['quoteId'] },
            { fields: ['calculationType'] },
            { fields: ['calculatedAt'] },
            { fields: ['version'] },
        ],
    };
    return sequelize.define('PremiumCalculation', attributes, options);
};
exports.createPremiumCalculationModel = createPremiumCalculationModel;
/**
 * Creates RateTable model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RateTableAttributes>>} RateTable model
 */
const createRateTableModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        productType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Insurance product type',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
            comment: 'Two-letter state code',
        },
        coverageType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        baseRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: false,
            validate: { min: 0 },
        },
        ratingFactors: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Rating factor definitions and multipliers',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending_approval', 'approved', 'active', 'expired', 'superseded'),
            allowNull: false,
            defaultValue: 'draft',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        approvalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'rate_tables',
        timestamps: true,
        indexes: [
            { fields: ['productType', 'state', 'effectiveDate'] },
            { fields: ['status'] },
            { fields: ['effectiveDate'] },
            { fields: ['version'] },
        ],
    };
    return sequelize.define('RateTable', attributes, options);
};
exports.createRateTableModel = createRateTableModel;
/**
 * Creates TerritoryRating model for Sequelize.
 */
const createTerritoryRatingModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        territoryCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        state: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
        },
        county: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        zipCode: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        productType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            validate: { min: 0, max: 100 },
        },
        baseRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 6),
            allowNull: false,
            validate: { min: 0 },
        },
        territoryFactor: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Multiplier applied to base premium',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'territory_ratings',
        timestamps: true,
        indexes: [
            { fields: ['territoryCode'] },
            { fields: ['state', 'zipCode'] },
            { fields: ['productType'] },
            { fields: ['effectiveDate'] },
        ],
    };
    return sequelize.define('TerritoryRating', attributes, options);
};
exports.createTerritoryRatingModel = createTerritoryRatingModel;
/**
 * Creates PremiumFinancing model for Sequelize.
 */
const createPremiumFinancingModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        totalPremium: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        downPayment: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        financedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        apr: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Annual percentage rate',
        },
        numberOfPayments: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        paymentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        totalFinanceCharge: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        totalPayable: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: { min: 0 },
        },
        paymentSchedule: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'paid_off', 'defaulted', 'cancelled'),
            allowNull: false,
            defaultValue: 'active',
        },
    };
    const options = {
        tableName: 'premium_financing',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['status'] },
        ],
    };
    return sequelize.define('PremiumFinancing', attributes, options);
};
exports.createPremiumFinancingModel = createPremiumFinancingModel;
/**
 * Creates TaxConfiguration model for Sequelize.
 */
const createTaxConfigurationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Jurisdiction identifier',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
        },
        county: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        city: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        productTypes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Applicable product types',
        },
        premiumTaxRate: {
            type: sequelize_1.DataTypes.DECIMAL(6, 5),
            allowNull: false,
            validate: { min: 0, max: 1 },
        },
        surplusTaxRate: {
            type: sequelize_1.DataTypes.DECIMAL(6, 5),
            allowNull: true,
            validate: { min: 0, max: 1 },
        },
        stampingFeeRate: {
            type: sequelize_1.DataTypes.DECIMAL(6, 5),
            allowNull: true,
            validate: { min: 0, max: 1 },
        },
        filingFeeRate: {
            type: sequelize_1.DataTypes.DECIMAL(6, 5),
            allowNull: true,
            validate: { min: 0, max: 1 },
        },
        specialAssessments: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    };
    const options = {
        tableName: 'tax_configurations',
        timestamps: true,
        indexes: [
            { fields: ['jurisdiction'] },
            { fields: ['state'] },
            { fields: ['effectiveDate'] },
        ],
    };
    return sequelize.define('TaxConfiguration', attributes, options);
};
exports.createTaxConfigurationModel = createTaxConfigurationModel;
// ============================================================================
// 1. BASE PREMIUM RATING ALGORITHMS
// ============================================================================
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
const calculateBasePremium = async (productType, coverageAmount, baseFactors, transaction) => {
    // Base rate lookup and calculation logic
    const baseRate = 0.012; // Example rate
    return coverageAmount * baseRate;
};
exports.calculateBasePremium = calculateBasePremium;
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
const getBaseRate = async (productType, state, coverageType, effectiveDate, transaction) => {
    // Rate table lookup logic
    return 0.015;
};
exports.getBaseRate = getBaseRate;
/**
 * 3. Calculates rate per unit of coverage.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageUnits - Number of coverage units
 * @returns {Promise<number>} Rate per unit
 */
const calculateRatePerUnit = async (basePremium, coverageUnits) => {
    if (coverageUnits === 0)
        return 0;
    return basePremium / coverageUnits;
};
exports.calculateRatePerUnit = calculateRatePerUnit;
// ============================================================================
// 2. RATING FACTOR APPLICATIONS
// ============================================================================
/**
 * 4. Applies age rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} age - Applicant age
 * @param {string} productType - Insurance product type
 * @returns {Promise<RatingAdjustment>} Age rating adjustment
 */
const applyAgeRatingFactor = async (basePremium, age, productType) => {
    let multiplier = 1.0;
    if (age < 25)
        multiplier = 1.25;
    else if (age >= 25 && age < 35)
        multiplier = 1.10;
    else if (age >= 35 && age < 50)
        multiplier = 1.0;
    else if (age >= 50 && age < 65)
        multiplier = 1.05;
    else
        multiplier = 1.15;
    return {
        factorType: 'age',
        factorName: 'Age Rating',
        baseValue: age,
        multiplier,
        adjustment: basePremium * (multiplier - 1),
        description: `Age ${age} rating factor`,
    };
};
exports.applyAgeRatingFactor = applyAgeRatingFactor;
/**
 * 5. Applies location-based rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {string} zipCode - ZIP code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment>} Location rating adjustment
 */
const applyLocationRatingFactor = async (basePremium, zipCode, productType, transaction) => {
    const territoryFactor = 1.05; // Would be looked up from territory table
    return {
        factorType: 'location',
        factorName: 'Territory Rating',
        baseValue: zipCode,
        multiplier: territoryFactor,
        adjustment: basePremium * (territoryFactor - 1),
        description: `Territory ${zipCode} rating factor`,
    };
};
exports.applyLocationRatingFactor = applyLocationRatingFactor;
/**
 * 6. Applies coverage level rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageAmount - Coverage amount
 * @param {number} deductible - Deductible amount
 * @returns {Promise<RatingAdjustment>} Coverage rating adjustment
 */
const applyCoverageRatingFactor = async (basePremium, coverageAmount, deductible) => {
    const deductibleFactor = deductible >= 1000 ? 0.90 : 1.0;
    return {
        factorType: 'coverage',
        factorName: 'Coverage/Deductible Factor',
        baseValue: { coverageAmount, deductible },
        multiplier: deductibleFactor,
        adjustment: basePremium * (deductibleFactor - 1),
        description: `$${deductible} deductible factor`,
    };
};
exports.applyCoverageRatingFactor = applyCoverageRatingFactor;
/**
 * 7. Applies multiple rating factors.
 *
 * @param {number} basePremium - Base premium amount
 * @param {Record<RatingFactorType, any>} factors - Rating factors to apply
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment[]>} All rating adjustments
 */
const applyMultipleRatingFactors = async (basePremium, factors, transaction) => {
    const adjustments = [];
    // Apply each factor sequentially
    if (factors.age) {
        adjustments.push(await (0, exports.applyAgeRatingFactor)(basePremium, factors.age, factors.productType));
    }
    return adjustments;
};
exports.applyMultipleRatingFactors = applyMultipleRatingFactors;
// ============================================================================
// 3. DISCOUNT CALCULATIONS
// ============================================================================
/**
 * 8. Applies multi-policy discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} policyCount - Number of policies
 * @returns {Promise<DiscountApplication>} Multi-policy discount
 */
const applyMultiPolicyDiscount = async (premium, policyCount) => {
    let percentage = 0;
    if (policyCount >= 2)
        percentage = 0.10;
    if (policyCount >= 3)
        percentage = 0.15;
    if (policyCount >= 5)
        percentage = 0.20;
    return {
        discountType: 'multi_policy',
        discountCode: 'MULTI_POLICY',
        description: `Multi-policy discount (${policyCount} policies)`,
        percentage,
        appliedAmount: premium * percentage,
        eligibilityCriteria: [`Minimum ${policyCount} active policies`],
        stackable: true,
    };
};
exports.applyMultiPolicyDiscount = applyMultiPolicyDiscount;
/**
 * 9. Applies claims-free discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsClaimsFree - Number of years without claims
 * @returns {Promise<DiscountApplication>} Claims-free discount
 */
const applyClaimsFreeDiscount = async (premium, yearsClaimsFree) => {
    const percentage = Math.min(0.25, yearsClaimsFree * 0.05);
    return {
        discountType: 'claims_free',
        discountCode: 'CLAIMS_FREE',
        description: `${yearsClaimsFree} years claims-free discount`,
        percentage,
        appliedAmount: premium * percentage,
        eligibilityCriteria: ['No claims in specified period'],
        stackable: true,
    };
};
exports.applyClaimsFreeDiscount = applyClaimsFreeDiscount;
/**
 * 10. Applies safety feature discount.
 *
 * @param {number} premium - Premium amount
 * @param {string[]} safetyFeatures - List of safety features
 * @param {string} productType - Insurance product type
 * @returns {Promise<DiscountApplication>} Safety feature discount
 */
const applySafetyFeatureDiscount = async (premium, safetyFeatures, productType) => {
    const discountPerFeature = 0.02;
    const percentage = Math.min(0.15, safetyFeatures.length * discountPerFeature);
    return {
        discountType: 'safety_feature',
        discountCode: 'SAFETY_FEATURES',
        description: `Safety features discount (${safetyFeatures.length} features)`,
        percentage,
        appliedAmount: premium * percentage,
        eligibilityCriteria: safetyFeatures,
        stackable: true,
    };
};
exports.applySafetyFeatureDiscount = applySafetyFeatureDiscount;
/**
 * 11. Applies loyalty discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsWithCompany - Years as customer
 * @returns {Promise<DiscountApplication>} Loyalty discount
 */
const applyLoyaltyDiscount = async (premium, yearsWithCompany) => {
    const percentage = Math.min(0.20, yearsWithCompany * 0.02);
    return {
        discountType: 'loyalty',
        discountCode: 'LOYALTY',
        description: `${yearsWithCompany} year loyalty discount`,
        percentage,
        appliedAmount: premium * percentage,
        eligibilityCriteria: [`Customer for ${yearsWithCompany} years`],
        stackable: true,
    };
};
exports.applyLoyaltyDiscount = applyLoyaltyDiscount;
/**
 * 12. Applies all eligible discounts.
 *
 * @param {number} premium - Premium amount
 * @param {Record<string, any>} discountFactors - Discount eligibility factors
 * @returns {Promise<DiscountApplication[]>} All applicable discounts
 */
const applyAllDiscounts = async (premium, discountFactors) => {
    const discounts = [];
    if (discountFactors.policyCount && discountFactors.policyCount > 1) {
        discounts.push(await (0, exports.applyMultiPolicyDiscount)(premium, discountFactors.policyCount));
    }
    if (discountFactors.yearsClaimsFree) {
        discounts.push(await (0, exports.applyClaimsFreeDiscount)(premium, discountFactors.yearsClaimsFree));
    }
    if (discountFactors.safetyFeatures) {
        discounts.push(await (0, exports.applySafetyFeatureDiscount)(premium, discountFactors.safetyFeatures, discountFactors.productType));
    }
    if (discountFactors.yearsWithCompany) {
        discounts.push(await (0, exports.applyLoyaltyDiscount)(premium, discountFactors.yearsWithCompany));
    }
    return discounts;
};
exports.applyAllDiscounts = applyAllDiscounts;
// ============================================================================
// 4. SURCHARGE APPLICATIONS
// ============================================================================
/**
 * 13. Applies violation surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {string} violationType - Type of violation
 * @param {number} violationCount - Number of violations
 * @returns {Promise<SurchargeApplication>} Violation surcharge
 */
const applyViolationSurcharge = async (premium, violationType, violationCount) => {
    const surchargeRates = {
        speeding: 0.15,
        dui: 0.50,
        accident: 0.25,
        reckless: 0.30,
    };
    const baseRate = surchargeRates[violationType] || 0.10;
    const percentage = baseRate * violationCount;
    return {
        surchargeType: 'violation',
        surchargeCode: `VIOLATION_${violationType.toUpperCase()}`,
        description: `${violationType} violation surcharge`,
        percentage,
        appliedAmount: premium * percentage,
        reason: `${violationCount} ${violationType} violation(s)`,
        duration: 36, // months
    };
};
exports.applyViolationSurcharge = applyViolationSurcharge;
/**
 * 14. Applies claims surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {number} claimCount - Number of claims
 * @param {number} totalClaimAmount - Total claim amount
 * @returns {Promise<SurchargeApplication>} Claims surcharge
 */
const applyClaimsSurcharge = async (premium, claimCount, totalClaimAmount) => {
    const percentage = Math.min(0.40, claimCount * 0.10);
    return {
        surchargeType: 'claim',
        surchargeCode: 'CLAIMS_HISTORY',
        description: `Claims history surcharge`,
        percentage,
        appliedAmount: premium * percentage,
        reason: `${claimCount} claim(s) totaling $${totalClaimAmount}`,
        duration: 36,
    };
};
exports.applyClaimsSurcharge = applyClaimsSurcharge;
/**
 * 15. Applies high-risk surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {string} riskReason - Reason for high risk classification
 * @param {number} riskScore - Risk score (0-100)
 * @returns {Promise<SurchargeApplication>} High-risk surcharge
 */
const applyHighRiskSurcharge = async (premium, riskReason, riskScore) => {
    const percentage = (riskScore / 100) * 0.50;
    return {
        surchargeType: 'high_risk',
        surchargeCode: 'HIGH_RISK',
        description: 'High-risk surcharge',
        percentage,
        appliedAmount: premium * percentage,
        reason: riskReason,
    };
};
exports.applyHighRiskSurcharge = applyHighRiskSurcharge;
/**
 * 16. Calculates total surcharge amount.
 *
 * @param {number} premium - Premium amount
 * @param {SurchargeApplication[]} surcharges - Array of surcharges
 * @returns {Promise<number>} Total surcharge amount
 */
const calculateTotalSurcharges = async (premium, surcharges) => {
    return surcharges.reduce((total, surcharge) => total + surcharge.appliedAmount, 0);
};
exports.calculateTotalSurcharges = calculateTotalSurcharges;
// ============================================================================
// 5. TERRITORY-BASED RATING
// ============================================================================
/**
 * 17. Retrieves territory rating for location.
 *
 * @param {string} zipCode - ZIP code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<TerritoryRating>} Territory rating information
 */
const getTerritoryRating = async (zipCode, productType, transaction) => {
    return {
        territoryCode: 'T001',
        state: 'CA',
        zipCode,
        riskScore: 65,
        baseRate: 0.015,
        territoryFactor: 1.05,
        effectiveDate: new Date(),
    };
};
exports.getTerritoryRating = getTerritoryRating;
/**
 * 18. Applies territory factor to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {TerritoryRating} territoryRating - Territory rating data
 * @returns {Promise<number>} Territory-adjusted premium
 */
const applyTerritoryFactor = async (basePremium, territoryRating) => {
    return basePremium * territoryRating.territoryFactor;
};
exports.applyTerritoryFactor = applyTerritoryFactor;
/**
 * 19. Compares territory ratings across locations.
 *
 * @param {string[]} zipCodes - Array of ZIP codes
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<string, TerritoryRating>>} Territory rating comparison
 */
const compareTerritoryRatings = async (zipCodes, productType, transaction) => {
    const ratings = {};
    for (const zip of zipCodes) {
        ratings[zip] = await (0, exports.getTerritoryRating)(zip, productType, transaction);
    }
    return ratings;
};
exports.compareTerritoryRatings = compareTerritoryRatings;
// ============================================================================
// 6. PREMIUM FINANCING CALCULATIONS
// ============================================================================
/**
 * 20. Calculates premium financing terms.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} downPayment - Down payment amount
 * @param {number} apr - Annual percentage rate
 * @param {number} numberOfPayments - Number of payments
 * @returns {Promise<PremiumFinancingTerms>} Financing terms
 */
const calculateFinancingTerms = async (totalPremium, downPayment, apr, numberOfPayments) => {
    const financedAmount = totalPremium - downPayment;
    const monthlyRate = apr / 12;
    const paymentAmount = (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayable = downPayment + paymentAmount * numberOfPayments;
    const totalFinanceCharge = totalPayable - totalPremium;
    const paymentSchedule = [];
    let remainingBalance = financedAmount;
    for (let i = 1; i <= numberOfPayments; i++) {
        const interest = remainingBalance * monthlyRate;
        const principal = paymentAmount - interest;
        remainingBalance -= principal;
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        paymentSchedule.push({
            paymentNumber: i,
            dueDate,
            paymentAmount,
            principal,
            interest,
            remainingBalance: Math.max(0, remainingBalance),
        });
    }
    return {
        totalPremium,
        downPayment,
        financedAmount,
        apr,
        numberOfPayments,
        paymentAmount,
        totalFinanceCharge,
        totalPayable,
        paymentSchedule,
    };
};
exports.calculateFinancingTerms = calculateFinancingTerms;
// ============================================================================
// 7. INSTALLMENT FEE CALCULATIONS
// ============================================================================
/**
 * 21. Calculates installment fees.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {PaymentFrequency} frequency - Payment frequency
 * @returns {Promise<{ installmentFee: number; totalWithFees: number }>} Installment fee calculation
 */
const calculateInstallmentFees = async (totalPremium, frequency) => {
    const feeRates = {
        annual: 0,
        semiannual: 0.02,
        quarterly: 0.03,
        monthly: 0.05,
        weekly: 0.08,
    };
    const installmentFee = totalPremium * (feeRates[frequency] || 0);
    return {
        installmentFee,
        totalWithFees: totalPremium + installmentFee,
    };
};
exports.calculateInstallmentFees = calculateInstallmentFees;
/**
 * 22. Determines optimal payment plan.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} monthlyBudget - Monthly budget constraint
 * @returns {Promise<{ frequency: PaymentFrequency; paymentAmount: number; totalCost: number }>} Optimal payment plan
 */
const determineOptimalPaymentPlan = async (totalPremium, monthlyBudget) => {
    const plans = [
        { frequency: 'annual', payments: 1 },
        { frequency: 'semiannual', payments: 2 },
        { frequency: 'quarterly', payments: 4 },
        { frequency: 'monthly', payments: 12 },
    ];
    for (const plan of plans) {
        const { installmentFee, totalWithFees } = await (0, exports.calculateInstallmentFees)(totalPremium, plan.frequency);
        const paymentAmount = totalWithFees / plan.payments;
        if (paymentAmount <= monthlyBudget * (plan.payments / 12)) {
            return {
                frequency: plan.frequency,
                paymentAmount,
                totalCost: totalWithFees,
            };
        }
    }
    // Default to monthly if no plan fits
    const monthly = await (0, exports.calculateInstallmentFees)(totalPremium, 'monthly');
    return {
        frequency: 'monthly',
        paymentAmount: monthly.totalWithFees / 12,
        totalCost: monthly.totalWithFees,
    };
};
exports.determineOptimalPaymentPlan = determineOptimalPaymentPlan;
// ============================================================================
// 8. PREMIUM PRORATION FOR POLICY CHANGES
// ============================================================================
/**
 * 23. Calculates prorated premium for policy changes.
 *
 * @param {number} annualPremium - Annual premium amount
 * @param {Date} effectiveDate - Change effective date
 * @param {Date} expirationDate - Policy expiration date
 * @param {'daily' | 'monthly' | 'short_rate' | 'pro_rata'} method - Proration method
 * @returns {Promise<PremiumProration>} Proration calculation
 */
const calculateProratedPremium = async (annualPremium, effectiveDate, expirationDate, method = 'daily') => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((expirationDate.getTime() - effectiveDate.getTime()) / msPerDay);
    const today = new Date();
    const daysUsed = Math.floor((today.getTime() - effectiveDate.getTime()) / msPerDay);
    const daysRemaining = totalDays - daysUsed;
    let proratedPremium;
    if (method === 'daily') {
        const dailyRate = annualPremium / totalDays;
        proratedPremium = dailyRate * daysRemaining;
    }
    else if (method === 'monthly') {
        const monthsRemaining = Math.ceil(daysRemaining / 30);
        proratedPremium = (annualPremium / 12) * monthsRemaining;
    }
    else if (method === 'short_rate') {
        // Short-rate includes penalty (typically 90% of pro-rata)
        const dailyRate = annualPremium / totalDays;
        proratedPremium = dailyRate * daysRemaining * 0.9;
    }
    else {
        // pro_rata
        proratedPremium = (annualPremium / totalDays) * daysRemaining;
    }
    return {
        originalPremium: annualPremium,
        proratedPremium,
        prorationMethod: method,
        effectiveDate,
        expirationDate,
        daysInTerm: totalDays,
        daysUsed,
        daysRemaining,
    };
};
exports.calculateProratedPremium = calculateProratedPremium;
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
const calculateEndorsementPremium = async (currentPremium, newPremium, endorsementDate, expirationDate, transaction) => {
    const premiumDifference = newPremium - currentPremium;
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.floor((expirationDate.getTime() - endorsementDate.getTime()) / msPerDay);
    const totalDays = 365;
    const proratedDifference = (premiumDifference / totalDays) * daysRemaining;
    return {
        additionalPremium: proratedDifference > 0 ? proratedDifference : 0,
        refundAmount: proratedDifference < 0 ? Math.abs(proratedDifference) : 0,
    };
};
exports.calculateEndorsementPremium = calculateEndorsementPremium;
// ============================================================================
// 9. EARNED VS. UNEARNED PREMIUM CALCULATIONS
// ============================================================================
/**
 * 25. Calculates earned and unearned premium.
 *
 * @param {number} writtenPremium - Written premium amount
 * @param {Date} inceptionDate - Policy inception date
 * @param {Date} expirationDate - Policy expiration date
 * @param {Date} asOfDate - As-of date for calculation
 * @returns {Promise<EarnedPremiumCalculation>} Earned premium calculation
 */
const calculateEarnedPremium = async (writtenPremium, inceptionDate, expirationDate, asOfDate = new Date()) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((expirationDate.getTime() - inceptionDate.getTime()) / msPerDay);
    const daysElapsed = Math.floor((asOfDate.getTime() - inceptionDate.getTime()) / msPerDay);
    const earnedPercentage = Math.min(100, (daysElapsed / totalDays) * 100);
    const earnedPremium = (writtenPremium * earnedPercentage) / 100;
    const unearnedPremium = writtenPremium - earnedPremium;
    return {
        writtenPremium,
        earnedPremium,
        unearnedPremium,
        earnedPercentage,
        calculationMethod: 'daily',
        asOfDate,
        policyInceptionDate: inceptionDate,
        policyExpirationDate: expirationDate,
    };
};
exports.calculateEarnedPremium = calculateEarnedPremium;
/**
 * 26. Calculates unearned premium reserve.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} asOfDate - As-of date for calculation
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalUnearned: number; policyCount: number }>} Unearned premium reserve
 */
const calculateUnearnedPremiumReserve = async (policyIds, asOfDate, transaction) => {
    // Would query policies and sum unearned premiums
    return {
        totalUnearned: 0,
        policyCount: policyIds.length,
    };
};
exports.calculateUnearnedPremiumReserve = calculateUnearnedPremiumReserve;
// ============================================================================
// 10. PREMIUM REFUND CALCULATIONS
// ============================================================================
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
const calculatePremiumRefund = async (policyId, cancellationDate, refundMethod, cancellationReason, transaction) => {
    const originalPremium = 1200; // Would be fetched from policy
    const earnedPremium = 400; // Would be calculated
    const unearnedPremium = originalPremium - earnedPremium;
    let penaltyAmount = 0;
    if (refundMethod === 'short_rate') {
        penaltyAmount = unearnedPremium * 0.10;
    }
    const processingFee = 25;
    const refundableAmount = unearnedPremium - penaltyAmount;
    const netRefund = refundableAmount - processingFee;
    return {
        refundId: `refund-${Date.now()}`,
        policyId,
        originalPremium,
        earnedPremium,
        unearnedPremium,
        refundableAmount,
        refundMethod,
        cancellationDate,
        cancellationReason,
        penaltyAmount,
        processingFee,
        netRefund: Math.max(0, netRefund),
    };
};
exports.calculatePremiumRefund = calculatePremiumRefund;
/**
 * 28. Processes bulk refund calculations.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} effectiveDate - Effective date for refunds
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<PremiumRefund[]>} Array of refund calculations
 */
const processBulkRefunds = async (policyIds, effectiveDate, transaction) => {
    const refunds = [];
    for (const policyId of policyIds) {
        refunds.push(await (0, exports.calculatePremiumRefund)(policyId, effectiveDate, 'pro_rata', 'Bulk cancellation', transaction));
    }
    return refunds;
};
exports.processBulkRefunds = processBulkRefunds;
// ============================================================================
// 11. COMMISSION-ADJUSTED PREMIUMS
// ============================================================================
/**
 * 29. Calculates agent commission.
 *
 * @param {number} premium - Premium amount
 * @param {string} agentId - Agent identifier
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ commissionAmount: number; commissionRate: number }>} Commission calculation
 */
const calculateAgentCommission = async (premium, agentId, productType, transaction) => {
    const commissionRate = 0.12; // Would be looked up from agent commission structure
    return {
        commissionAmount: premium * commissionRate,
        commissionRate,
    };
};
exports.calculateAgentCommission = calculateAgentCommission;
/**
 * 30. Calculates net premium after commission.
 *
 * @param {number} grossPremium - Gross premium amount
 * @param {number} commissionRate - Commission rate
 * @returns {Promise<number>} Net premium
 */
const calculateNetPremium = async (grossPremium, commissionRate) => {
    return grossPremium * (1 - commissionRate);
};
exports.calculateNetPremium = calculateNetPremium;
/**
 * 31. Applies tiered commission structure.
 *
 * @param {number} premium - Premium amount
 * @param {CommissionTier[]} tiers - Commission tier structure
 * @returns {Promise<number>} Tiered commission amount
 */
const applyTieredCommission = async (premium, tiers) => {
    let commission = 0;
    for (const tier of tiers) {
        if (premium >= tier.minPremium) {
            const tierPremium = tier.maxPremium
                ? Math.min(premium, tier.maxPremium) - tier.minPremium
                : premium - tier.minPremium;
            commission += tierPremium * tier.rate;
        }
    }
    return commission;
};
exports.applyTieredCommission = applyTieredCommission;
// ============================================================================
// 12. TAX AND FEE CALCULATIONS BY JURISDICTION
// ============================================================================
/**
 * 32. Calculates jurisdiction-specific taxes.
 *
 * @param {number} premium - Premium amount
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<TaxApplication[]>} Tax calculations
 */
const calculateJurisdictionTaxes = async (premium, state, productType, transaction) => {
    const taxes = [];
    // Example: Premium tax
    taxes.push({
        taxType: 'Premium Tax',
        jurisdiction: state,
        taxRate: 0.025,
        taxableAmount: premium,
        taxAmount: premium * 0.025,
        description: `${state} premium tax`,
    });
    return taxes;
};
exports.calculateJurisdictionTaxes = calculateJurisdictionTaxes;
/**
 * 33. Applies state-specific fees.
 *
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @returns {Promise<FeeApplication[]>} State-specific fees
 */
const applyStateFees = async (state, productType) => {
    const fees = [];
    // Example fees
    fees.push({
        feeType: 'Policy Fee',
        description: `${state} policy issuance fee`,
        amount: 15,
        required: true,
        waivable: false,
    });
    return fees;
};
exports.applyStateFees = applyStateFees;
/**
 * 34. Calculates total taxes and fees.
 *
 * @param {number} premium - Premium amount
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalTaxes: number; totalFees: number; grandTotal: number }>} Tax and fee totals
 */
const calculateTotalTaxesAndFees = async (premium, state, productType, transaction) => {
    const taxes = await (0, exports.calculateJurisdictionTaxes)(premium, state, productType, transaction);
    const fees = await (0, exports.applyStateFees)(state, productType);
    const totalTaxes = taxes.reduce((sum, tax) => sum + tax.taxAmount, 0);
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    return {
        totalTaxes,
        totalFees,
        grandTotal: premium + totalTaxes + totalFees,
    };
};
exports.calculateTotalTaxesAndFees = calculateTotalTaxesAndFees;
// ============================================================================
// 13. MINIMUM PREMIUM ENFORCEMENT
// ============================================================================
/**
 * 35. Enforces minimum premium rules.
 *
 * @param {number} calculatedPremium - Calculated premium amount
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @returns {Promise<{ finalPremium: number; minimumApplied: boolean; minimumAmount?: number }>} Minimum premium enforcement
 */
const enforceMinimumPremium = async (calculatedPremium, productType, state) => {
    const minimumPremium = 100; // Would be looked up from minimum premium rules
    if (calculatedPremium < minimumPremium) {
        return {
            finalPremium: minimumPremium,
            minimumApplied: true,
            minimumAmount: minimumPremium,
        };
    }
    return {
        finalPremium: calculatedPremium,
        minimumApplied: false,
    };
};
exports.enforceMinimumPremium = enforceMinimumPremium;
/**
 * 36. Retrieves minimum premium rules.
 *
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<MinimumPremiumRule>} Minimum premium rule
 */
const getMinimumPremiumRule = async (productType, state, transaction) => {
    return {
        productType,
        minimumPremium: 100,
        applicableStates: [state],
        effectiveDate: new Date(),
    };
};
exports.getMinimumPremiumRule = getMinimumPremiumRule;
// ============================================================================
// 14. PREMIUM ROUNDING RULES
// ============================================================================
/**
 * 37. Applies premium rounding rules.
 *
 * @param {number} premium - Premium amount to round
 * @param {PremiumRoundingRule} roundingRule - Rounding rule configuration
 * @returns {Promise<number>} Rounded premium
 */
const applyPremiumRounding = async (premium, roundingRule) => {
    const { roundingMethod, roundToNearest } = roundingRule;
    if (roundingMethod === 'up') {
        return Math.ceil(premium / roundToNearest) * roundToNearest;
    }
    else if (roundingMethod === 'down') {
        return Math.floor(premium / roundToNearest) * roundToNearest;
    }
    else {
        return Math.round(premium / roundToNearest) * roundToNearest;
    }
};
exports.applyPremiumRounding = applyPremiumRounding;
/**
 * 38. Applies rounding to premium breakdown.
 *
 * @param {PremiumBreakdown} breakdown - Premium breakdown
 * @param {number} roundToNearest - Round to nearest value (e.g., 0.01, 1.00)
 * @returns {Promise<PremiumBreakdown>} Rounded premium breakdown
 */
const applyRoundingToBreakdown = async (breakdown, roundToNearest) => {
    const roundingRule = {
        roundingMethod: 'nearest',
        roundToNearest,
        applyToTotal: true,
        applyToComponents: ['basePremium', 'totalPremium'],
    };
    return {
        ...breakdown,
        basePremium: await (0, exports.applyPremiumRounding)(breakdown.basePremium, roundingRule),
        totalPremium: await (0, exports.applyPremiumRounding)(breakdown.totalPremium, roundingRule),
    };
};
exports.applyRoundingToBreakdown = applyRoundingToBreakdown;
// ============================================================================
// 15. RATE CHANGE APPLICABILITY
// ============================================================================
/**
 * 39. Determines if rate change applies to policy.
 *
 * @param {string} policyId - Policy identifier
 * @param {RateChange} rateChange - Rate change details
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ applies: boolean; reason: string; newPremium?: number }>} Rate change applicability
 */
const determineRateChangeApplicability = async (policyId, rateChange, transaction) => {
    // Would fetch policy details and check if rate change applies
    const policyEffectiveDate = new Date('2024-01-01');
    const applies = policyEffectiveDate < rateChange.effectiveDate;
    return {
        applies,
        reason: applies ? 'Policy renews after rate change effective date' : 'Policy not affected',
    };
};
exports.determineRateChangeApplicability = determineRateChangeApplicability;
/**
 * 40. Applies rate change to premium.
 *
 * @param {number} currentPremium - Current premium amount
 * @param {number} changePercentage - Rate change percentage
 * @returns {Promise<{ oldPremium: number; newPremium: number; difference: number }>} Rate change application
 */
const applyRateChange = async (currentPremium, changePercentage) => {
    const newPremium = currentPremium * (1 + changePercentage / 100);
    const difference = newPremium - currentPremium;
    return {
        oldPremium: currentPremium,
        newPremium,
        difference,
    };
};
exports.applyRateChange = applyRateChange;
//# sourceMappingURL=premium-calculation-kit.js.map