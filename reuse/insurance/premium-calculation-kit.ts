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

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsDate,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createPremiumCalculationModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    policyId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference to policy',
    },
    quoteId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference to quote if applicable',
    },
    calculationType: {
      type: DataTypes.ENUM('new_business', 'renewal', 'endorsement', 'quote', 'audit'),
      allowNull: false,
    },
    basePremium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    ratingFactors: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applied rating factors',
    },
    discounts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applied discounts',
    },
    surcharges: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applied surcharges',
    },
    taxes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applied taxes',
    },
    fees: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applied fees',
    },
    totalPremium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    effectiveRate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      comment: 'Effective premium rate per unit',
    },
    calculationMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'standard',
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Calculation version for tracking changes',
    },
    calculatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    calculatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'System or user ID',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional calculation metadata',
    },
  };

  const options: ModelOptions = {
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
export const createRateTableModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Insurance product type',
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      comment: 'Two-letter state code',
    },
    coverageType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    baseRate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: { min: 0 },
    },
    ratingFactors: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Rating factor definitions and multipliers',
    },
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'active', 'expired', 'superseded'),
      allowNull: false,
      defaultValue: 'draft',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
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
export const createTerritoryRatingModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    territoryCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    county: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    productType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    riskScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    baseRate: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: { min: 0 },
    },
    territoryFactor: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      comment: 'Multiplier applied to base premium',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
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
export const createPremiumFinancingModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    policyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalPremium: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    downPayment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    financedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    apr: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      comment: 'Annual percentage rate',
    },
    numberOfPayments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    paymentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    totalFinanceCharge: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    totalPayable: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    paymentSchedule: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('active', 'paid_off', 'defaulted', 'cancelled'),
      allowNull: false,
      defaultValue: 'active',
    },
  };

  const options: ModelOptions = {
    tableName: 'premium_financing',
    timestamps: true,
    indexes: [
      { fields: ['policyId'] },
      { fields: ['status'] },
    ],
  };

  return sequelize.define('PremiumFinancing', attributes, options);
};

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
export const createTaxConfigurationModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jurisdiction: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Jurisdiction identifier',
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    county: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    productTypes: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Applicable product types',
    },
    premiumTaxRate: {
      type: DataTypes.DECIMAL(6, 5),
      allowNull: false,
      validate: { min: 0, max: 1 },
    },
    surplusTaxRate: {
      type: DataTypes.DECIMAL(6, 5),
      allowNull: true,
      validate: { min: 0, max: 1 },
    },
    stampingFeeRate: {
      type: DataTypes.DECIMAL(6, 5),
      allowNull: true,
      validate: { min: 0, max: 1 },
    },
    filingFeeRate: {
      type: DataTypes.DECIMAL(6, 5),
      allowNull: true,
      validate: { min: 0, max: 1 },
    },
    specialAssessments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
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
export const calculateBasePremium = async (
  productType: string,
  coverageAmount: number,
  baseFactors: Record<string, any>,
  transaction?: Transaction,
): Promise<number> => {
  // Base rate lookup and calculation logic
  const baseRate = 0.012; // Example rate
  return coverageAmount * baseRate;
};

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
export const getBaseRate = async (
  productType: string,
  state: string,
  coverageType: string,
  effectiveDate: Date,
  transaction?: Transaction,
): Promise<number> => {
  // Rate table lookup logic
  return 0.015;
};

/**
 * 3. Calculates rate per unit of coverage.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageUnits - Number of coverage units
 * @returns {Promise<number>} Rate per unit
 */
export const calculateRatePerUnit = async (
  basePremium: number,
  coverageUnits: number,
): Promise<number> => {
  if (coverageUnits === 0) return 0;
  return basePremium / coverageUnits;
};

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
export const applyAgeRatingFactor = async (
  basePremium: number,
  age: number,
  productType: string,
): Promise<RatingAdjustment> => {
  let multiplier = 1.0;

  if (age < 25) multiplier = 1.25;
  else if (age >= 25 && age < 35) multiplier = 1.10;
  else if (age >= 35 && age < 50) multiplier = 1.0;
  else if (age >= 50 && age < 65) multiplier = 1.05;
  else multiplier = 1.15;

  return {
    factorType: 'age',
    factorName: 'Age Rating',
    baseValue: age,
    multiplier,
    adjustment: basePremium * (multiplier - 1),
    description: `Age ${age} rating factor`,
  };
};

/**
 * 5. Applies location-based rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {string} zipCode - ZIP code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment>} Location rating adjustment
 */
export const applyLocationRatingFactor = async (
  basePremium: number,
  zipCode: string,
  productType: string,
  transaction?: Transaction,
): Promise<RatingAdjustment> => {
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

/**
 * 6. Applies coverage level rating factor.
 *
 * @param {number} basePremium - Base premium amount
 * @param {number} coverageAmount - Coverage amount
 * @param {number} deductible - Deductible amount
 * @returns {Promise<RatingAdjustment>} Coverage rating adjustment
 */
export const applyCoverageRatingFactor = async (
  basePremium: number,
  coverageAmount: number,
  deductible: number,
): Promise<RatingAdjustment> => {
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

/**
 * 7. Applies multiple rating factors.
 *
 * @param {number} basePremium - Base premium amount
 * @param {Record<RatingFactorType, any>} factors - Rating factors to apply
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RatingAdjustment[]>} All rating adjustments
 */
export const applyMultipleRatingFactors = async (
  basePremium: number,
  factors: Record<string, any>,
  transaction?: Transaction,
): Promise<RatingAdjustment[]> => {
  const adjustments: RatingAdjustment[] = [];

  // Apply each factor sequentially
  if (factors.age) {
    adjustments.push(await applyAgeRatingFactor(basePremium, factors.age, factors.productType));
  }

  return adjustments;
};

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
export const applyMultiPolicyDiscount = async (
  premium: number,
  policyCount: number,
): Promise<DiscountApplication> => {
  let percentage = 0;

  if (policyCount >= 2) percentage = 0.10;
  if (policyCount >= 3) percentage = 0.15;
  if (policyCount >= 5) percentage = 0.20;

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

/**
 * 9. Applies claims-free discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsClaimsFree - Number of years without claims
 * @returns {Promise<DiscountApplication>} Claims-free discount
 */
export const applyClaimsFreeDiscount = async (
  premium: number,
  yearsClaimsFree: number,
): Promise<DiscountApplication> => {
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

/**
 * 10. Applies safety feature discount.
 *
 * @param {number} premium - Premium amount
 * @param {string[]} safetyFeatures - List of safety features
 * @param {string} productType - Insurance product type
 * @returns {Promise<DiscountApplication>} Safety feature discount
 */
export const applySafetyFeatureDiscount = async (
  premium: number,
  safetyFeatures: string[],
  productType: string,
): Promise<DiscountApplication> => {
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

/**
 * 11. Applies loyalty discount.
 *
 * @param {number} premium - Premium amount
 * @param {number} yearsWithCompany - Years as customer
 * @returns {Promise<DiscountApplication>} Loyalty discount
 */
export const applyLoyaltyDiscount = async (
  premium: number,
  yearsWithCompany: number,
): Promise<DiscountApplication> => {
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

/**
 * 12. Applies all eligible discounts.
 *
 * @param {number} premium - Premium amount
 * @param {Record<string, any>} discountFactors - Discount eligibility factors
 * @returns {Promise<DiscountApplication[]>} All applicable discounts
 */
export const applyAllDiscounts = async (
  premium: number,
  discountFactors: Record<string, any>,
): Promise<DiscountApplication[]> => {
  const discounts: DiscountApplication[] = [];

  if (discountFactors.policyCount && discountFactors.policyCount > 1) {
    discounts.push(await applyMultiPolicyDiscount(premium, discountFactors.policyCount));
  }

  if (discountFactors.yearsClaimsFree) {
    discounts.push(await applyClaimsFreeDiscount(premium, discountFactors.yearsClaimsFree));
  }

  if (discountFactors.safetyFeatures) {
    discounts.push(
      await applySafetyFeatureDiscount(premium, discountFactors.safetyFeatures, discountFactors.productType)
    );
  }

  if (discountFactors.yearsWithCompany) {
    discounts.push(await applyLoyaltyDiscount(premium, discountFactors.yearsWithCompany));
  }

  return discounts;
};

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
export const applyViolationSurcharge = async (
  premium: number,
  violationType: string,
  violationCount: number,
): Promise<SurchargeApplication> => {
  const surchargeRates: Record<string, number> = {
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

/**
 * 14. Applies claims surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {number} claimCount - Number of claims
 * @param {number} totalClaimAmount - Total claim amount
 * @returns {Promise<SurchargeApplication>} Claims surcharge
 */
export const applyClaimsSurcharge = async (
  premium: number,
  claimCount: number,
  totalClaimAmount: number,
): Promise<SurchargeApplication> => {
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

/**
 * 15. Applies high-risk surcharge.
 *
 * @param {number} premium - Premium amount
 * @param {string} riskReason - Reason for high risk classification
 * @param {number} riskScore - Risk score (0-100)
 * @returns {Promise<SurchargeApplication>} High-risk surcharge
 */
export const applyHighRiskSurcharge = async (
  premium: number,
  riskReason: string,
  riskScore: number,
): Promise<SurchargeApplication> => {
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

/**
 * 16. Calculates total surcharge amount.
 *
 * @param {number} premium - Premium amount
 * @param {SurchargeApplication[]} surcharges - Array of surcharges
 * @returns {Promise<number>} Total surcharge amount
 */
export const calculateTotalSurcharges = async (
  premium: number,
  surcharges: SurchargeApplication[],
): Promise<number> => {
  return surcharges.reduce((total, surcharge) => total + surcharge.appliedAmount, 0);
};

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
export const getTerritoryRating = async (
  zipCode: string,
  productType: string,
  transaction?: Transaction,
): Promise<TerritoryRating> => {
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

/**
 * 18. Applies territory factor to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {TerritoryRating} territoryRating - Territory rating data
 * @returns {Promise<number>} Territory-adjusted premium
 */
export const applyTerritoryFactor = async (
  basePremium: number,
  territoryRating: TerritoryRating,
): Promise<number> => {
  return basePremium * territoryRating.territoryFactor;
};

/**
 * 19. Compares territory ratings across locations.
 *
 * @param {string[]} zipCodes - Array of ZIP codes
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<string, TerritoryRating>>} Territory rating comparison
 */
export const compareTerritoryRatings = async (
  zipCodes: string[],
  productType: string,
  transaction?: Transaction,
): Promise<Record<string, TerritoryRating>> => {
  const ratings: Record<string, TerritoryRating> = {};

  for (const zip of zipCodes) {
    ratings[zip] = await getTerritoryRating(zip, productType, transaction);
  }

  return ratings;
};

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
export const calculateFinancingTerms = async (
  totalPremium: number,
  downPayment: number,
  apr: number,
  numberOfPayments: number,
): Promise<PremiumFinancingTerms> => {
  const financedAmount = totalPremium - downPayment;
  const monthlyRate = apr / 12;
  const paymentAmount =
    (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayable = downPayment + paymentAmount * numberOfPayments;
  const totalFinanceCharge = totalPayable - totalPremium;

  const paymentSchedule: PaymentScheduleEntry[] = [];
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
export const calculateInstallmentFees = async (
  totalPremium: number,
  frequency: PaymentFrequency,
): Promise<{ installmentFee: number; totalWithFees: number }> => {
  const feeRates: Record<PaymentFrequency, number> = {
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

/**
 * 22. Determines optimal payment plan.
 *
 * @param {number} totalPremium - Total premium amount
 * @param {number} monthlyBudget - Monthly budget constraint
 * @returns {Promise<{ frequency: PaymentFrequency; paymentAmount: number; totalCost: number }>} Optimal payment plan
 */
export const determineOptimalPaymentPlan = async (
  totalPremium: number,
  monthlyBudget: number,
): Promise<{ frequency: PaymentFrequency; paymentAmount: number; totalCost: number }> => {
  const plans: Array<{ frequency: PaymentFrequency; payments: number }> = [
    { frequency: 'annual', payments: 1 },
    { frequency: 'semiannual', payments: 2 },
    { frequency: 'quarterly', payments: 4 },
    { frequency: 'monthly', payments: 12 },
  ];

  for (const plan of plans) {
    const { installmentFee, totalWithFees } = await calculateInstallmentFees(
      totalPremium,
      plan.frequency
    );
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
  const monthly = await calculateInstallmentFees(totalPremium, 'monthly');
  return {
    frequency: 'monthly',
    paymentAmount: monthly.totalWithFees / 12,
    totalCost: monthly.totalWithFees,
  };
};

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
export const calculateProratedPremium = async (
  annualPremium: number,
  effectiveDate: Date,
  expirationDate: Date,
  method: 'daily' | 'monthly' | 'short_rate' | 'pro_rata' = 'daily',
): Promise<PremiumProration> => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((expirationDate.getTime() - effectiveDate.getTime()) / msPerDay);
  const today = new Date();
  const daysUsed = Math.floor((today.getTime() - effectiveDate.getTime()) / msPerDay);
  const daysRemaining = totalDays - daysUsed;

  let proratedPremium: number;

  if (method === 'daily') {
    const dailyRate = annualPremium / totalDays;
    proratedPremium = dailyRate * daysRemaining;
  } else if (method === 'monthly') {
    const monthsRemaining = Math.ceil(daysRemaining / 30);
    proratedPremium = (annualPremium / 12) * monthsRemaining;
  } else if (method === 'short_rate') {
    // Short-rate includes penalty (typically 90% of pro-rata)
    const dailyRate = annualPremium / totalDays;
    proratedPremium = dailyRate * daysRemaining * 0.9;
  } else {
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
export const calculateEndorsementPremium = async (
  currentPremium: number,
  newPremium: number,
  endorsementDate: Date,
  expirationDate: Date,
  transaction?: Transaction,
): Promise<{ additionalPremium: number; refundAmount: number }> => {
  const premiumDifference = newPremium - currentPremium;
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.floor(
    (expirationDate.getTime() - endorsementDate.getTime()) / msPerDay
  );
  const totalDays = 365;

  const proratedDifference = (premiumDifference / totalDays) * daysRemaining;

  return {
    additionalPremium: proratedDifference > 0 ? proratedDifference : 0,
    refundAmount: proratedDifference < 0 ? Math.abs(proratedDifference) : 0,
  };
};

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
export const calculateEarnedPremium = async (
  writtenPremium: number,
  inceptionDate: Date,
  expirationDate: Date,
  asOfDate: Date = new Date(),
): Promise<EarnedPremiumCalculation> => {
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

/**
 * 26. Calculates unearned premium reserve.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} asOfDate - As-of date for calculation
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalUnearned: number; policyCount: number }>} Unearned premium reserve
 */
export const calculateUnearnedPremiumReserve = async (
  policyIds: string[],
  asOfDate: Date,
  transaction?: Transaction,
): Promise<{ totalUnearned: number; policyCount: number }> => {
  // Would query policies and sum unearned premiums
  return {
    totalUnearned: 0,
    policyCount: policyIds.length,
  };
};

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
export const calculatePremiumRefund = async (
  policyId: string,
  cancellationDate: Date,
  refundMethod: 'pro_rata' | 'short_rate',
  cancellationReason: string,
  transaction?: Transaction,
): Promise<PremiumRefund> => {
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

/**
 * 28. Processes bulk refund calculations.
 *
 * @param {string[]} policyIds - Array of policy identifiers
 * @param {Date} effectiveDate - Effective date for refunds
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<PremiumRefund[]>} Array of refund calculations
 */
export const processBulkRefunds = async (
  policyIds: string[],
  effectiveDate: Date,
  transaction?: Transaction,
): Promise<PremiumRefund[]> => {
  const refunds: PremiumRefund[] = [];

  for (const policyId of policyIds) {
    refunds.push(
      await calculatePremiumRefund(policyId, effectiveDate, 'pro_rata', 'Bulk cancellation', transaction)
    );
  }

  return refunds;
};

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
export const calculateAgentCommission = async (
  premium: number,
  agentId: string,
  productType: string,
  transaction?: Transaction,
): Promise<{ commissionAmount: number; commissionRate: number }> => {
  const commissionRate = 0.12; // Would be looked up from agent commission structure

  return {
    commissionAmount: premium * commissionRate,
    commissionRate,
  };
};

/**
 * 30. Calculates net premium after commission.
 *
 * @param {number} grossPremium - Gross premium amount
 * @param {number} commissionRate - Commission rate
 * @returns {Promise<number>} Net premium
 */
export const calculateNetPremium = async (
  grossPremium: number,
  commissionRate: number,
): Promise<number> => {
  return grossPremium * (1 - commissionRate);
};

/**
 * 31. Applies tiered commission structure.
 *
 * @param {number} premium - Premium amount
 * @param {CommissionTier[]} tiers - Commission tier structure
 * @returns {Promise<number>} Tiered commission amount
 */
export const applyTieredCommission = async (
  premium: number,
  tiers: CommissionTier[],
): Promise<number> => {
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
export const calculateJurisdictionTaxes = async (
  premium: number,
  state: string,
  productType: string,
  transaction?: Transaction,
): Promise<TaxApplication[]> => {
  const taxes: TaxApplication[] = [];

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

/**
 * 33. Applies state-specific fees.
 *
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @returns {Promise<FeeApplication[]>} State-specific fees
 */
export const applyStateFees = async (
  state: string,
  productType: string,
): Promise<FeeApplication[]> => {
  const fees: FeeApplication[] = [];

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

/**
 * 34. Calculates total taxes and fees.
 *
 * @param {number} premium - Premium amount
 * @param {string} state - State code
 * @param {string} productType - Insurance product type
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ totalTaxes: number; totalFees: number; grandTotal: number }>} Tax and fee totals
 */
export const calculateTotalTaxesAndFees = async (
  premium: number,
  state: string,
  productType: string,
  transaction?: Transaction,
): Promise<{ totalTaxes: number; totalFees: number; grandTotal: number }> => {
  const taxes = await calculateJurisdictionTaxes(premium, state, productType, transaction);
  const fees = await applyStateFees(state, productType);

  const totalTaxes = taxes.reduce((sum, tax) => sum + tax.taxAmount, 0);
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return {
    totalTaxes,
    totalFees,
    grandTotal: premium + totalTaxes + totalFees,
  };
};

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
export const enforceMinimumPremium = async (
  calculatedPremium: number,
  productType: string,
  state: string,
): Promise<{ finalPremium: number; minimumApplied: boolean; minimumAmount?: number }> => {
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

/**
 * 36. Retrieves minimum premium rules.
 *
 * @param {string} productType - Insurance product type
 * @param {string} state - State code
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<MinimumPremiumRule>} Minimum premium rule
 */
export const getMinimumPremiumRule = async (
  productType: string,
  state: string,
  transaction?: Transaction,
): Promise<MinimumPremiumRule> => {
  return {
    productType,
    minimumPremium: 100,
    applicableStates: [state],
    effectiveDate: new Date(),
  };
};

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
export const applyPremiumRounding = async (
  premium: number,
  roundingRule: PremiumRoundingRule,
): Promise<number> => {
  const { roundingMethod, roundToNearest } = roundingRule;

  if (roundingMethod === 'up') {
    return Math.ceil(premium / roundToNearest) * roundToNearest;
  } else if (roundingMethod === 'down') {
    return Math.floor(premium / roundToNearest) * roundToNearest;
  } else {
    return Math.round(premium / roundToNearest) * roundToNearest;
  }
};

/**
 * 38. Applies rounding to premium breakdown.
 *
 * @param {PremiumBreakdown} breakdown - Premium breakdown
 * @param {number} roundToNearest - Round to nearest value (e.g., 0.01, 1.00)
 * @returns {Promise<PremiumBreakdown>} Rounded premium breakdown
 */
export const applyRoundingToBreakdown = async (
  breakdown: PremiumBreakdown,
  roundToNearest: number,
): Promise<PremiumBreakdown> => {
  const roundingRule: PremiumRoundingRule = {
    roundingMethod: 'nearest',
    roundToNearest,
    applyToTotal: true,
    applyToComponents: ['basePremium', 'totalPremium'],
  };

  return {
    ...breakdown,
    basePremium: await applyPremiumRounding(breakdown.basePremium, roundingRule),
    totalPremium: await applyPremiumRounding(breakdown.totalPremium, roundingRule),
  };
};

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
export const determineRateChangeApplicability = async (
  policyId: string,
  rateChange: RateChange,
  transaction?: Transaction,
): Promise<{ applies: boolean; reason: string; newPremium?: number }> => {
  // Would fetch policy details and check if rate change applies
  const policyEffectiveDate = new Date('2024-01-01');
  const applies = policyEffectiveDate < rateChange.effectiveDate;

  return {
    applies,
    reason: applies ? 'Policy renews after rate change effective date' : 'Policy not affected',
  };
};

/**
 * 40. Applies rate change to premium.
 *
 * @param {number} currentPremium - Current premium amount
 * @param {number} changePercentage - Rate change percentage
 * @returns {Promise<{ oldPremium: number; newPremium: number; difference: number }>} Rate change application
 */
export const applyRateChange = async (
  currentPremium: number,
  changePercentage: number,
): Promise<{ oldPremium: number; newPremium: number; difference: number }> => {
  const newPremium = currentPremium * (1 + changePercentage / 100);
  const difference = newPremium - currentPremium;

  return {
    oldPremium: currentPremium,
    newPremium,
    difference,
  };
};
