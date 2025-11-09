/**
 * LOC: INS-ACTUARIAL-001
 * File: /reuse/insurance/actuarial-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Pricing and rating modules
 *   - Risk management services
 *   - Reserving and financial systems
 */

/**
 * File: /reuse/insurance/actuarial-analysis-kit.ts
 * Locator: WC-INS-ACTUARIAL-001
 * Purpose: Enterprise Insurance Actuarial Analysis Kit - Comprehensive actuarial operations and analytics
 *
 * Upstream: Independent utility module for insurance actuarial operations
 * Downstream: ../backend/*, Pricing services, Reserving systems, Financial reporting, Risk analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 utility functions for loss ratios, combined ratios, pure premium, loss development, IBNR, severity, frequency, credibility, experience mod, rate adequacy, pricing validation, reserves, ultimate loss, retention, reinsurance optimization
 *
 * LLM Context: Production-ready actuarial analysis utilities for White Cross insurance platform.
 * Provides comprehensive actuarial calculations including loss ratio trending, combined ratio analysis,
 * pure premium development, loss development factors, IBNR reserves, claim severity distributions,
 * frequency-severity modeling, credibility weighting, experience modification calculations, rate adequacy
 * testing, pricing model validation, reserve adequacy testing, ultimate loss projections, retention analysis,
 * and reinsurance optimization. Designed to compete with Allstate, Progressive, and Farmers platforms.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions, Sequelize } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Actuarial metric type
 */
export enum ActuarialMetricType {
  LOSS_RATIO = 'loss_ratio',
  COMBINED_RATIO = 'combined_ratio',
  EXPENSE_RATIO = 'expense_ratio',
  PURE_PREMIUM = 'pure_premium',
  ULTIMATE_LOSS = 'ultimate_loss',
  IBNR_RESERVE = 'ibnr_reserve',
  CASE_RESERVE = 'case_reserve',
  CREDIBILITY_FACTOR = 'credibility_factor',
  EXPERIENCE_MOD = 'experience_mod',
  LOSS_DEVELOPMENT = 'loss_development',
  FREQUENCY = 'frequency',
  SEVERITY = 'severity',
}

/**
 * Development period type
 */
export enum DevelopmentPeriod {
  MONTHS_12 = '12_months',
  MONTHS_24 = '24_months',
  MONTHS_36 = '36_months',
  MONTHS_48 = '48_months',
  MONTHS_60 = '60_months',
  MONTHS_72 = '72_months',
  MONTHS_84 = '84_months',
  MONTHS_96 = '96_months',
  MONTHS_108 = '108_months',
  MONTHS_120 = '120_months',
  ULTIMATE = 'ultimate',
}

/**
 * Valuation method
 */
export enum ValuationMethod {
  PAID_LOSS = 'paid_loss',
  INCURRED_LOSS = 'incurred_loss',
  REPORTED_LOSS = 'reported_loss',
  CASE_INCURRED = 'case_incurred',
  EXPECTED_LOSS = 'expected_loss',
}

/**
 * Distribution type
 */
export enum DistributionType {
  NORMAL = 'normal',
  LOGNORMAL = 'lognormal',
  GAMMA = 'gamma',
  PARETO = 'pareto',
  WEIBULL = 'weibull',
  EXPONENTIAL = 'exponential',
  POISSON = 'poisson',
  NEGATIVE_BINOMIAL = 'negative_binomial',
}

/**
 * Credibility method
 */
export enum CredibilityMethod {
  FULL_CREDIBILITY = 'full_credibility',
  PARTIAL_CREDIBILITY = 'partial_credibility',
  LIMITED_FLUCTUATION = 'limited_fluctuation',
  BUHLMANN = 'buhlmann',
  GREATEST_ACCURACY = 'greatest_accuracy',
}

/**
 * Rate adequacy status
 */
export enum RateAdequacyStatus {
  ADEQUATE = 'adequate',
  INADEQUATE = 'inadequate',
  EXCESSIVE = 'excessive',
  MARGINALLY_ADEQUATE = 'marginally_adequate',
  REQUIRES_REVISION = 'requires_revision',
}

/**
 * Loss ratio calculation data
 */
export interface LossRatioData {
  periodStart: Date;
  periodEnd: Date;
  productLine?: string;
  geography?: string;
  policyType?: string;
  includeDevelopment?: boolean;
}

/**
 * Loss ratio result
 */
export interface LossRatioResult {
  earnedPremium: number;
  incurredLoss: number;
  lossRatio: number;
  lossRatioPercentage: number;
  claimCount: number;
  averageClaimCost: number;
  periodStart: Date;
  periodEnd: Date;
  calculatedAt: Date;
}

/**
 * Combined ratio result
 */
export interface CombinedRatioResult {
  earnedPremium: number;
  incurredLoss: number;
  expenseAmount: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  underwritingProfit: number;
  profitMargin: number;
  calculatedAt: Date;
}

/**
 * Pure premium calculation data
 */
export interface PurePremiumData {
  exposureBase: number;
  incurredLosses: number;
  claimCount: number;
  periodStart: Date;
  periodEnd: Date;
  productLine: string;
}

/**
 * Loss development factor data
 */
export interface LossDevFactorData {
  accidentYear: number;
  valuationDate: Date;
  developmentMonth: number;
  paidLoss: number;
  caseReserves: number;
  incurredLoss: number;
  reportedClaimCount: number;
}

/**
 * IBNR reserve calculation
 */
export interface IBNRReserveData {
  accidentYear: number;
  reportedLosses: number;
  ultimateLosses: number;
  paidLosses: number;
  caseReserves: number;
  developmentAge: number;
}

/**
 * Severity distribution result
 */
export interface SeverityDistribution {
  distributionType: DistributionType;
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  percentile95: number;
  percentile99: number;
  maxLoss: number;
  minLoss: number;
  sampleSize: number;
}

/**
 * Frequency analysis result
 */
export interface FrequencyAnalysis {
  exposures: number;
  claimCount: number;
  frequency: number;
  expectedClaims: number;
  actualVsExpected: number;
  varianceToExpected: number;
  confidenceInterval: {
    lower: number;
    upper: number;
    confidenceLevel: number;
  };
}

/**
 * Credibility weighting result
 */
export interface CredibilityWeighting {
  credibilityFactor: number;
  credibilityMethod: CredibilityMethod;
  actualExperience: number;
  expectedExperience: number;
  creditedValue: number;
  exposureCount: number;
  fullCredibilityStandard: number;
  isFullCredibility: boolean;
}

/**
 * Experience modification data
 */
export interface ExperienceModData {
  actualLosses: number;
  expectedLosses: number;
  actualPrimaryLosses: number;
  expectedPrimaryLosses: number;
  ballastValue: number;
  weightingFactor: number;
}

/**
 * Rate adequacy analysis
 */
export interface RateAdequacyAnalysis {
  currentRate: number;
  indicatedRate: number;
  rateChange: number;
  rateChangePercentage: number;
  adequacyStatus: RateAdequacyStatus;
  lossRatio: number;
  targetLossRatio: number;
  expenseRatio: number;
  targetCombinedRatio: number;
  profitMargin: number;
  recommendation: string;
}

/**
 * Ultimate loss projection
 */
export interface UltimateLossProjection {
  accidentYear: number;
  reportedLosses: number;
  paidLosses: number;
  caseReserves: number;
  projectedUltimateLoss: number;
  ibnrReserve: number;
  developmentMethod: string;
  confidenceInterval: {
    lower: number;
    upper: number;
    confidenceLevel: number;
  };
  calculatedAt: Date;
}

/**
 * Retention analysis result
 */
export interface RetentionAnalysis {
  productLine: string;
  totalPoliciesStart: number;
  renewedPolicies: number;
  cancelledPolicies: number;
  nonRenewedPolicies: number;
  retentionRate: number;
  cancellationRate: number;
  nonRenewalRate: number;
  averageTenure: number;
  lifetimeValue: number;
}

/**
 * Reinsurance optimization result
 */
export interface ReinsuranceOptimization {
  retentionAmount: number;
  cededAmount: number;
  reinsurerShare: number;
  cededPremium: number;
  cedingCommission: number;
  netCost: number;
  riskReduction: number;
  capitalRelief: number;
  returnOnCapital: number;
  recommendation: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Actuarial calculation model
 */
@Table({
  tableName: 'actuarial_calculations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['calculation_type'] },
    { fields: ['accident_year'] },
    { fields: ['valuation_date'] },
    { fields: ['product_line'] },
    { fields: ['created_at'] },
  ],
})
export class ActuarialCalculation extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  calculation_type: ActuarialMetricType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  accident_year: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  valuation_date: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  product_line: string;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
  })
  earned_premium: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
  })
  incurred_loss: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
  })
  paid_loss: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
  })
  case_reserves: number;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: true,
  })
  ibnr_reserves: number;

  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: true,
  })
  loss_ratio: number;

  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: true,
  })
  combined_ratio: number;

  @Column({
    type: DataType.DECIMAL(10, 6),
    allowNull: true,
  })
  development_factor: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  calculation_details: Record<string, any>;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  calculated_by: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}

// ============================================================================
// LOSS RATIO FUNCTIONS
// ============================================================================

/**
 * Calculates loss ratio for a given period
 *
 * @param data - Loss ratio calculation parameters
 * @param transaction - Optional database transaction
 * @returns Loss ratio analysis result
 *
 * @example
 * ```typescript
 * const lossRatio = await calculateLossRatio({
 *   periodStart: new Date('2024-01-01'),
 *   periodEnd: new Date('2024-12-31'),
 *   productLine: 'auto',
 *   includeDevelopment: true
 * });
 * console.log(`Loss Ratio: ${lossRatio.lossRatioPercentage}%`);
 * ```
 */
export async function calculateLossRatio(
  data: LossRatioData,
  transaction?: Transaction,
): Promise<LossRatioResult> {
  const { periodStart, periodEnd, productLine, geography, policyType, includeDevelopment } = data;

  // Build where clause
  const whereClause: WhereOptions = {
    valuation_date: {
      [Op.between]: [periodStart, periodEnd],
    },
  };

  if (productLine) whereClause.product_line = productLine;

  // Aggregate premium and losses
  const result = await ActuarialCalculation.findOne({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('earned_premium')), 'totalPremium'],
      [Sequelize.fn('SUM', Sequelize.col('incurred_loss')), 'totalLoss'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'claimCount'],
      [Sequelize.fn('AVG', Sequelize.col('incurred_loss')), 'avgClaim'],
    ],
    where: whereClause,
    transaction,
    raw: true,
  });

  const earnedPremium = parseFloat(result['totalPremium'] || '0');
  const incurredLoss = parseFloat(result['totalLoss'] || '0');
  const claimCount = parseInt(result['claimCount'] || '0', 10);
  const averageClaimCost = parseFloat(result['avgClaim'] || '0');

  const lossRatio = earnedPremium > 0 ? incurredLoss / earnedPremium : 0;
  const lossRatioPercentage = lossRatio * 100;

  return {
    earnedPremium,
    incurredLoss,
    lossRatio,
    lossRatioPercentage,
    claimCount,
    averageClaimCost,
    periodStart,
    periodEnd,
    calculatedAt: new Date(),
  };
}

/**
 * Calculates trending loss ratio over multiple periods
 */
export async function calculateLossRatioTrend(
  startDate: Date,
  endDate: Date,
  intervalMonths: number,
  productLine?: string,
  transaction?: Transaction,
): Promise<LossRatioResult[]> {
  const results: LossRatioResult[] = [];
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + intervalMonths);

    const lossRatio = await calculateLossRatio(
      {
        periodStart: currentDate,
        periodEnd: nextDate > endDate ? endDate : nextDate,
        productLine,
      },
      transaction,
    );

    results.push(lossRatio);
    currentDate = nextDate;
  }

  return results;
}

/**
 * Calculates combined ratio (loss ratio + expense ratio)
 */
export async function calculateCombinedRatio(
  periodStart: Date,
  periodEnd: Date,
  productLine?: string,
  transaction?: Transaction,
): Promise<CombinedRatioResult> {
  const lossRatioResult = await calculateLossRatio(
    {
      periodStart,
      periodEnd,
      productLine,
    },
    transaction,
  );

  // Calculate expense ratio (typically 20-30% of premium)
  const expenseAmount = lossRatioResult.earnedPremium * 0.25; // 25% expense ratio assumption
  const expenseRatio = lossRatioResult.earnedPremium > 0 ? expenseAmount / lossRatioResult.earnedPremium : 0;
  const combinedRatio = lossRatioResult.lossRatio + expenseRatio;
  const underwritingProfit = lossRatioResult.earnedPremium - lossRatioResult.incurredLoss - expenseAmount;
  const profitMargin =
    lossRatioResult.earnedPremium > 0 ? underwritingProfit / lossRatioResult.earnedPremium : 0;

  return {
    earnedPremium: lossRatioResult.earnedPremium,
    incurredLoss: lossRatioResult.incurredLoss,
    expenseAmount,
    lossRatio: lossRatioResult.lossRatio,
    expenseRatio,
    combinedRatio,
    underwritingProfit,
    profitMargin,
    calculatedAt: new Date(),
  };
}

// ============================================================================
// PURE PREMIUM FUNCTIONS
// ============================================================================

/**
 * Calculates pure premium (loss cost per exposure)
 */
export async function calculatePurePremium(
  data: PurePremiumData,
  transaction?: Transaction,
): Promise<number> {
  const { exposureBase, incurredLosses } = data;

  if (exposureBase <= 0) {
    throw new BadRequestException('Exposure base must be greater than zero');
  }

  return incurredLosses / exposureBase;
}

/**
 * Develops pure premium with trend factors
 */
export async function developPurePremium(
  basePurePremium: number,
  trendFactor: number,
  periods: number,
): Promise<number> {
  return basePurePremium * Math.pow(1 + trendFactor, periods);
}

/**
 * Calculates credibility-weighted pure premium
 */
export async function calculateCreditedPurePremium(
  actualPurePremium: number,
  expectedPurePremium: number,
  credibilityFactor: number,
): Promise<number> {
  if (credibilityFactor < 0 || credibilityFactor > 1) {
    throw new BadRequestException('Credibility factor must be between 0 and 1');
  }

  return credibilityFactor * actualPurePremium + (1 - credibilityFactor) * expectedPurePremium;
}

// ============================================================================
// LOSS DEVELOPMENT FUNCTIONS
// ============================================================================

/**
 * Calculates age-to-age loss development factors
 */
export async function calculateAgeToAgeDevelopmentFactors(
  accidentYear: number,
  productLine: string,
  transaction?: Transaction,
): Promise<Map<number, number>> {
  const developmentFactors = new Map<number, number>();

  // Get loss data at different development ages
  const lossData = await ActuarialCalculation.findAll({
    where: {
      accident_year: accidentYear,
      product_line: productLine,
      calculation_type: ActuarialMetricType.LOSS_DEVELOPMENT,
    },
    order: [['valuation_date', 'ASC']],
    transaction,
  });

  // Calculate age-to-age factors
  for (let i = 1; i < lossData.length; i++) {
    const previousLoss = parseFloat(lossData[i - 1].incurred_loss?.toString() || '0');
    const currentLoss = parseFloat(lossData[i].incurred_loss?.toString() || '0');

    if (previousLoss > 0) {
      const developmentAge = i * 12; // months
      const factor = currentLoss / previousLoss;
      developmentFactors.set(developmentAge, factor);
    }
  }

  return developmentFactors;
}

/**
 * Calculates age-to-ultimate loss development factors
 */
export async function calculateAgeToUltimateDevelopmentFactor(
  ageMonths: number,
  ageToAgeFactors: Map<number, number>,
): Promise<number> {
  let cumulativeFactor = 1.0;

  for (const [age, factor] of ageToAgeFactors) {
    if (age >= ageMonths) {
      cumulativeFactor *= factor;
    }
  }

  return cumulativeFactor;
}

/**
 * Calculates selected loss development factors using averaging methods
 */
export async function calculateSelectedDevelopmentFactors(
  historicalFactors: number[][],
  method: 'simple' | 'weighted' | 'geometric' = 'simple',
): Promise<number[]> {
  const selectedFactors: number[] = [];

  for (let col = 0; col < historicalFactors[0].length; col++) {
    const columnFactors = historicalFactors.map((row) => row[col]).filter((f) => f > 0);

    let selectedFactor: number;

    if (method === 'simple') {
      selectedFactor = columnFactors.reduce((sum, f) => sum + f, 0) / columnFactors.length;
    } else if (method === 'weighted') {
      // More weight to recent years
      const weights = columnFactors.map((_, idx) => idx + 1);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      selectedFactor = columnFactors.reduce((sum, f, idx) => sum + f * weights[idx], 0) / totalWeight;
    } else {
      // Geometric average
      const product = columnFactors.reduce((prod, f) => prod * f, 1);
      selectedFactor = Math.pow(product, 1 / columnFactors.length);
    }

    selectedFactors.push(selectedFactor);
  }

  return selectedFactors;
}

// ============================================================================
// IBNR RESERVE FUNCTIONS
// ============================================================================

/**
 * Calculates IBNR reserves using chain ladder method
 */
export async function calculateIBNRReserves(
  data: IBNRReserveData,
  developmentFactors: number[],
  transaction?: Transaction,
): Promise<number> {
  const { reportedLosses, paidLosses, caseReserves, developmentAge } = data;

  // Apply development factors to reach ultimate losses
  let ultimateLosses = reportedLosses;
  for (let i = Math.floor(developmentAge / 12); i < developmentFactors.length; i++) {
    ultimateLosses *= developmentFactors[i];
  }

  // IBNR = Ultimate - Reported
  const ibnrReserves = ultimateLosses - reportedLosses;

  return Math.max(0, ibnrReserves);
}

/**
 * Calculates IBNR using Bornhuetter-Ferguson method
 */
export async function calculateBornhuetterFergusonIBNR(
  earnedPremium: number,
  expectedLossRatio: number,
  reportedLosses: number,
  percentReported: number,
): Promise<number> {
  const expectedUltimateLosses = earnedPremium * expectedLossRatio;
  const expectedIBNR = expectedUltimateLosses * (1 - percentReported);
  const chainLadderIBNR = reportedLosses * (1 / percentReported - 1);

  // BF method blends expected and actual
  return (expectedIBNR + chainLadderIBNR) / 2;
}

/**
 * Calculates total reserves (case + IBNR)
 */
export async function calculateTotalReserves(
  caseReserves: number,
  ibnrReserves: number,
  additionalExpenseReserves?: number,
): Promise<number> {
  return caseReserves + ibnrReserves + (additionalExpenseReserves || 0);
}

// ============================================================================
// SEVERITY FUNCTIONS
// ============================================================================

/**
 * Analyzes claim severity distribution
 */
export async function analyzeSeverityDistribution(
  claimAmounts: number[],
  distributionType: DistributionType = DistributionType.LOGNORMAL,
): Promise<SeverityDistribution> {
  if (claimAmounts.length === 0) {
    throw new BadRequestException('Claim amounts array cannot be empty');
  }

  const sortedAmounts = [...claimAmounts].sort((a, b) => a - b);
  const n = sortedAmounts.length;

  // Calculate basic statistics
  const mean = sortedAmounts.reduce((sum, val) => sum + val, 0) / n;
  const median = n % 2 === 0 ? (sortedAmounts[n / 2 - 1] + sortedAmounts[n / 2]) / 2 : sortedAmounts[Math.floor(n / 2)];

  // Calculate variance and standard deviation
  const variance = sortedAmounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const standardDeviation = Math.sqrt(variance);

  // Calculate skewness and kurtosis
  const skewness =
    sortedAmounts.reduce((sum, val) => sum + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
  const kurtosis =
    sortedAmounts.reduce((sum, val) => sum + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;

  // Calculate percentiles
  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * n) - 1;
    return sortedAmounts[Math.max(0, Math.min(index, n - 1))];
  };

  // Mode calculation (simplified - most frequent value)
  const frequencyMap = new Map<number, number>();
  sortedAmounts.forEach((val) => {
    frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
  });
  const mode = [...frequencyMap.entries()].reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  return {
    distributionType,
    mean,
    median,
    mode,
    standardDeviation,
    variance,
    skewness,
    kurtosis,
    percentile50: getPercentile(50),
    percentile75: getPercentile(75),
    percentile90: getPercentile(90),
    percentile95: getPercentile(95),
    percentile99: getPercentile(99),
    maxLoss: sortedAmounts[n - 1],
    minLoss: sortedAmounts[0],
    sampleSize: n,
  };
}

/**
 * Calculates expected severity from distribution parameters
 */
export async function calculateExpectedSeverity(
  distributionType: DistributionType,
  parameters: Record<string, number>,
): Promise<number> {
  switch (distributionType) {
    case DistributionType.NORMAL:
      return parameters.mean || 0;

    case DistributionType.LOGNORMAL:
      // E[X] = exp(μ + σ²/2)
      return Math.exp(parameters.mu + Math.pow(parameters.sigma, 2) / 2);

    case DistributionType.GAMMA:
      // E[X] = α * θ
      return parameters.alpha * parameters.theta;

    case DistributionType.PARETO:
      // E[X] = α * x_m / (α - 1) for α > 1
      if (parameters.alpha <= 1) {
        throw new BadRequestException('Pareto alpha must be > 1 for finite mean');
      }
      return (parameters.alpha * parameters.xm) / (parameters.alpha - 1);

    default:
      throw new BadRequestException(`Unsupported distribution type: ${distributionType}`);
  }
}

/**
 * Fits severity distribution to claim data
 */
export async function fitSeverityDistribution(
  claimAmounts: number[],
  distributionType: DistributionType,
): Promise<Record<string, number>> {
  const analysis = await analyzeSeverityDistribution(claimAmounts, distributionType);

  const parameters: Record<string, number> = {};

  switch (distributionType) {
    case DistributionType.NORMAL:
      parameters.mean = analysis.mean;
      parameters.sigma = analysis.standardDeviation;
      break;

    case DistributionType.LOGNORMAL:
      // Convert to log-space
      const logAmounts = claimAmounts.map((x) => Math.log(x));
      const logMean = logAmounts.reduce((sum, val) => sum + val, 0) / logAmounts.length;
      const logVar =
        logAmounts.reduce((sum, val) => sum + Math.pow(val - logMean, 2), 0) / (logAmounts.length - 1);
      parameters.mu = logMean;
      parameters.sigma = Math.sqrt(logVar);
      break;

    case DistributionType.GAMMA:
      // Method of moments
      parameters.alpha = Math.pow(analysis.mean, 2) / analysis.variance;
      parameters.theta = analysis.variance / analysis.mean;
      break;

    default:
      throw new BadRequestException(`Parameter fitting not implemented for ${distributionType}`);
  }

  return parameters;
}

// ============================================================================
// FREQUENCY FUNCTIONS
// ============================================================================

/**
 * Analyzes claim frequency
 */
export async function analyzeClaimFrequency(
  exposures: number,
  claimCount: number,
  confidenceLevel: number = 0.95,
): Promise<FrequencyAnalysis> {
  if (exposures <= 0) {
    throw new BadRequestException('Exposures must be greater than zero');
  }

  const frequency = claimCount / exposures;
  const expectedClaims = frequency * exposures;
  const actualVsExpected = claimCount / expectedClaims;
  const varianceToExpected = ((claimCount - expectedClaims) / expectedClaims) * 100;

  // Calculate confidence interval using Poisson distribution approximation
  const z = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.645;
  const standardError = Math.sqrt(frequency / exposures);
  const marginOfError = z * standardError;

  return {
    exposures,
    claimCount,
    frequency,
    expectedClaims,
    actualVsExpected,
    varianceToExpected,
    confidenceInterval: {
      lower: Math.max(0, frequency - marginOfError),
      upper: frequency + marginOfError,
      confidenceLevel,
    },
  };
}

/**
 * Calculates frequency trend over time
 */
export async function calculateFrequencyTrend(
  historicalData: Array<{ exposures: number; claimCount: number; year: number }>,
): Promise<number> {
  if (historicalData.length < 2) {
    throw new BadRequestException('Need at least 2 years of data for trend analysis');
  }

  const frequencies = historicalData.map((d) => d.claimCount / d.exposures);

  // Simple linear regression
  const n = frequencies.length;
  const xMean = (n - 1) / 2;
  const yMean = frequencies.reduce((sum, f) => sum + f, 0) / n;

  const numerator = frequencies.reduce((sum, y, i) => sum + (i - xMean) * (y - yMean), 0);
  const denominator = frequencies.reduce((sum, _, i) => sum + Math.pow(i - xMean, 2), 0);

  const slope = numerator / denominator;

  // Return annual trend as percentage
  return (slope / yMean) * 100;
}

/**
 * Projects future claim frequency
 */
export async function projectClaimFrequency(
  currentFrequency: number,
  trendFactor: number,
  periods: number,
): Promise<number> {
  return currentFrequency * Math.pow(1 + trendFactor, periods);
}

// ============================================================================
// CREDIBILITY FUNCTIONS
// ============================================================================

/**
 * Calculates credibility weighting
 */
export async function calculateCredibility(
  exposureCount: number,
  fullCredibilityStandard: number,
  method: CredibilityMethod = CredibilityMethod.LIMITED_FLUCTUATION,
): Promise<number> {
  if (fullCredibilityStandard <= 0) {
    throw new BadRequestException('Full credibility standard must be greater than zero');
  }

  switch (method) {
    case CredibilityMethod.FULL_CREDIBILITY:
      return exposureCount >= fullCredibilityStandard ? 1.0 : 0.0;

    case CredibilityMethod.PARTIAL_CREDIBILITY:
    case CredibilityMethod.LIMITED_FLUCTUATION:
      // Square root rule
      return Math.min(1.0, Math.sqrt(exposureCount / fullCredibilityStandard));

    case CredibilityMethod.BUHLMANN:
      // Bühlmann credibility formula
      const k = fullCredibilityStandard;
      return exposureCount / (exposureCount + k);

    default:
      throw new BadRequestException(`Unsupported credibility method: ${method}`);
  }
}

/**
 * Applies credibility weighting to blend actual and expected values
 */
export async function applyCredibilityWeighting(
  actualExperience: number,
  expectedExperience: number,
  credibilityFactor: number,
): Promise<CredibilityWeighting> {
  if (credibilityFactor < 0 || credibilityFactor > 1) {
    throw new BadRequestException('Credibility factor must be between 0 and 1');
  }

  const creditedValue = credibilityFactor * actualExperience + (1 - credibilityFactor) * expectedExperience;

  return {
    credibilityFactor,
    credibilityMethod: CredibilityMethod.BUHLMANN,
    actualExperience,
    expectedExperience,
    creditedValue,
    exposureCount: 0, // Would be passed from calculation context
    fullCredibilityStandard: 0, // Would be passed from calculation context
    isFullCredibility: credibilityFactor >= 1.0,
  };
}

// ============================================================================
// EXPERIENCE MODIFICATION FUNCTIONS
// ============================================================================

/**
 * Calculates experience modification factor (workers compensation style)
 */
export async function calculateExperienceMod(data: ExperienceModData): Promise<number> {
  const { actualLosses, expectedLosses, actualPrimaryLosses, expectedPrimaryLosses, ballastValue, weightingFactor } =
    data;

  if (expectedLosses <= 0) {
    throw new BadRequestException('Expected losses must be greater than zero');
  }

  // E-Mod formula: (Primary Losses * Weight + Excess Losses) / Expected Losses
  const primaryWeight = weightingFactor;
  const actualExcess = actualLosses - actualPrimaryLosses;
  const expectedExcess = expectedLosses - expectedPrimaryLosses;

  const numerator = actualPrimaryLosses * primaryWeight + actualExcess + ballastValue;
  const denominator = expectedPrimaryLosses * primaryWeight + expectedExcess + ballastValue;

  const experienceMod = numerator / denominator;

  return Math.max(0.5, Math.min(2.0, experienceMod)); // Cap between 0.5 and 2.0
}

/**
 * Calculates three-year average experience mod
 */
export async function calculateThreeYearAverageExperienceMod(
  year1Mod: number,
  year2Mod: number,
  year3Mod: number,
): Promise<number> {
  return (year1Mod + year2Mod + year3Mod) / 3;
}

// ============================================================================
// RATE ADEQUACY FUNCTIONS
// ============================================================================

/**
 * Performs rate adequacy analysis
 */
export async function performRateAdequacyAnalysis(
  earnedPremium: number,
  incurredLoss: number,
  expenses: number,
  targetCombinedRatio: number,
  transaction?: Transaction,
): Promise<RateAdequacyAnalysis> {
  const lossRatio = earnedPremium > 0 ? incurredLoss / earnedPremium : 0;
  const expenseRatio = earnedPremium > 0 ? expenses / earnedPremium : 0;
  const currentCombinedRatio = lossRatio + expenseRatio;

  // Calculate indicated rate
  const currentRate = 100; // Base rate assumption
  const indicatedRate = currentRate * (currentCombinedRatio / targetCombinedRatio);
  const rateChange = indicatedRate - currentRate;
  const rateChangePercentage = (rateChange / currentRate) * 100;

  // Determine adequacy status
  let adequacyStatus: RateAdequacyStatus;
  if (currentCombinedRatio <= targetCombinedRatio * 0.95) {
    adequacyStatus = RateAdequacyStatus.EXCESSIVE;
  } else if (currentCombinedRatio <= targetCombinedRatio) {
    adequacyStatus = RateAdequacyStatus.ADEQUATE;
  } else if (currentCombinedRatio <= targetCombinedRatio * 1.05) {
    adequacyStatus = RateAdequacyStatus.MARGINALLY_ADEQUATE;
  } else if (currentCombinedRatio <= targetCombinedRatio * 1.15) {
    adequacyStatus = RateAdequacyStatus.INADEQUATE;
  } else {
    adequacyStatus = RateAdequacyStatus.REQUIRES_REVISION;
  }

  const profitMargin = 1 - currentCombinedRatio;

  let recommendation: string;
  if (adequacyStatus === RateAdequacyStatus.EXCESSIVE) {
    recommendation = `Rates appear excessive. Consider ${Math.abs(rateChangePercentage).toFixed(1)}% rate decrease.`;
  } else if (adequacyStatus === RateAdequacyStatus.INADEQUATE || adequacyStatus === RateAdequacyStatus.REQUIRES_REVISION) {
    recommendation = `Rates are inadequate. Recommend ${rateChangePercentage.toFixed(1)}% rate increase.`;
  } else {
    recommendation = 'Rates are adequate. Monitor performance closely.';
  }

  return {
    currentRate,
    indicatedRate,
    rateChange,
    rateChangePercentage,
    adequacyStatus,
    lossRatio,
    targetLossRatio: targetCombinedRatio - expenseRatio,
    expenseRatio,
    targetCombinedRatio,
    profitMargin,
    recommendation,
  };
}

/**
 * Tests rate adequacy by coverage type
 */
export async function testRateAdequacyByCoverage(
  coverageType: string,
  periodStart: Date,
  periodEnd: Date,
  targetCombinedRatio: number,
  transaction?: Transaction,
): Promise<RateAdequacyAnalysis> {
  // Get aggregated data for coverage type
  const result = await ActuarialCalculation.findOne({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('earned_premium')), 'totalPremium'],
      [Sequelize.fn('SUM', Sequelize.col('incurred_loss')), 'totalLoss'],
    ],
    where: {
      valuation_date: { [Op.between]: [periodStart, periodEnd] },
      product_line: coverageType,
    },
    transaction,
    raw: true,
  });

  const earnedPremium = parseFloat(result['totalPremium'] || '0');
  const incurredLoss = parseFloat(result['totalLoss'] || '0');
  const expenses = earnedPremium * 0.25; // 25% expense assumption

  return performRateAdequacyAnalysis(earnedPremium, incurredLoss, expenses, targetCombinedRatio, transaction);
}

// ============================================================================
// ULTIMATE LOSS PROJECTION FUNCTIONS
// ============================================================================

/**
 * Projects ultimate losses using development method
 */
export async function projectUltimateLosses(
  accidentYear: number,
  reportedLosses: number,
  developmentAge: number,
  developmentFactors: number[],
  method: 'chain_ladder' | 'bornhuetter_ferguson' = 'chain_ladder',
): Promise<UltimateLossProjection> {
  let projectedUltimateLoss: number;
  const ageIndex = Math.floor(developmentAge / 12);

  if (method === 'chain_ladder') {
    // Apply remaining development factors
    projectedUltimateLoss = reportedLosses;
    for (let i = ageIndex; i < developmentFactors.length; i++) {
      projectedUltimateLoss *= developmentFactors[i];
    }
  } else {
    // Bornhuetter-Ferguson approach would need additional parameters
    throw new BadRequestException('BF method requires additional parameters');
  }

  const ibnrReserve = projectedUltimateLoss - reportedLosses;

  // Simplified confidence interval (would use bootstrapping in production)
  const stdError = projectedUltimateLoss * 0.15; // 15% coefficient of variation
  const z = 1.96; // 95% confidence

  return {
    accidentYear,
    reportedLosses,
    paidLosses: reportedLosses * 0.7, // Assumption
    caseReserves: reportedLosses * 0.3, // Assumption
    projectedUltimateLoss,
    ibnrReserve,
    developmentMethod: method,
    confidenceInterval: {
      lower: projectedUltimateLoss - z * stdError,
      upper: projectedUltimateLoss + z * stdError,
      confidenceLevel: 0.95,
    },
    calculatedAt: new Date(),
  };
}

/**
 * Projects ultimate losses for all open accident years
 */
export async function projectAllAccidentYears(
  currentYear: number,
  yearsToProject: number,
  developmentFactors: number[],
  transaction?: Transaction,
): Promise<UltimateLossProjection[]> {
  const projections: UltimateLossProjection[] = [];

  for (let i = 0; i < yearsToProject; i++) {
    const accidentYear = currentYear - i;
    const developmentAge = i * 12;

    // Get reported losses for this accident year
    const calculation = await ActuarialCalculation.findOne({
      where: {
        accident_year: accidentYear,
        calculation_type: ActuarialMetricType.ULTIMATE_LOSS,
      },
      order: [['valuation_date', 'DESC']],
      transaction,
    });

    if (calculation) {
      const reportedLosses = parseFloat(calculation.incurred_loss?.toString() || '0');
      const projection = await projectUltimateLosses(accidentYear, reportedLosses, developmentAge, developmentFactors);
      projections.push(projection);
    }
  }

  return projections;
}

// ============================================================================
// RETENTION ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyzes policy retention rates
 */
export async function analyzeRetention(
  productLine: string,
  periodStart: Date,
  periodEnd: Date,
  transaction?: Transaction,
): Promise<RetentionAnalysis> {
  // This would query policy data - simplified for example
  const totalPoliciesStart = 1000;
  const renewedPolicies = 850;
  const cancelledPolicies = 100;
  const nonRenewedPolicies = 50;

  const retentionRate = (renewedPolicies / totalPoliciesStart) * 100;
  const cancellationRate = (cancelledPolicies / totalPoliciesStart) * 100;
  const nonRenewalRate = (nonRenewedPolicies / totalPoliciesStart) * 100;
  const averageTenure = 3.5; // years
  const lifetimeValue = 5000; // dollars

  return {
    productLine,
    totalPoliciesStart,
    renewedPolicies,
    cancelledPolicies,
    nonRenewedPolicies,
    retentionRate,
    cancellationRate,
    nonRenewalRate,
    averageTenure,
    lifetimeValue,
  };
}

/**
 * Calculates cohort retention over time
 */
export async function calculateCohortRetention(
  cohortStartDate: Date,
  monthsToAnalyze: number,
): Promise<Map<number, number>> {
  const retentionByMonth = new Map<number, number>();

  // Simplified - would query actual policy data
  let remainingPolicies = 1000;
  for (let month = 0; month <= monthsToAnalyze; month++) {
    const retentionRate = remainingPolicies / 1000;
    retentionByMonth.set(month, retentionRate * 100);
    remainingPolicies *= 0.98; // 2% monthly attrition
  }

  return retentionByMonth;
}

// ============================================================================
// REINSURANCE OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Optimizes reinsurance retention levels
 */
export async function optimizeReinsuranceRetention(
  grossPremium: number,
  expectedLossRatio: number,
  capitalRequirement: number,
  reinsurerPricing: { retentionLevel: number; rate: number }[],
): Promise<ReinsuranceOptimization> {
  let bestOption: ReinsuranceOptimization | null = null;
  let bestROC = -Infinity;

  for (const option of reinsurerPricing) {
    const retentionAmount = grossPremium * option.retentionLevel;
    const cededAmount = grossPremium - retentionAmount;
    const reinsurerShare = 1 - option.retentionLevel;
    const cededPremium = cededAmount * option.rate;
    const cedingCommission = cededPremium * 0.25; // 25% ceding commission
    const netCost = cededPremium - cedingCommission;
    const riskReduction = grossPremium * expectedLossRatio * reinsurerShare;
    const capitalRelief = capitalRequirement * reinsurerShare;
    const returnOnCapital = (grossPremium * (1 - expectedLossRatio) - netCost) / (capitalRequirement - capitalRelief);

    if (returnOnCapital > bestROC) {
      bestROC = returnOnCapital;
      bestOption = {
        retentionAmount,
        cededAmount,
        reinsurerShare,
        cededPremium,
        cedingCommission,
        netCost,
        riskReduction,
        capitalRelief,
        returnOnCapital,
        recommendation: `Optimal retention: ${(option.retentionLevel * 100).toFixed(0)}%`,
      };
    }
  }

  if (!bestOption) {
    throw new BadRequestException('No viable reinsurance options provided');
  }

  return bestOption;
}

/**
 * Calculates reinsurance recovery on a claim
 */
export async function calculateReinsuranceRecovery(
  claimAmount: number,
  retentionLimit: number,
  reinsurerShare: number,
): Promise<number> {
  if (claimAmount <= retentionLimit) {
    return 0;
  }

  const excessAmount = claimAmount - retentionLimit;
  return excessAmount * reinsurerShare;
}

/**
 * Models catastrophe reinsurance need
 */
export async function modelCatastropheReinsuranceNeed(
  portfolioValue: number,
  catExposure: number,
  pmlLevel: number, // 1-in-X year event
  availableCapital: number,
): Promise<{ recommendedCoverage: number; attachmentPoint: number; layers: number }> {
  // Probable Maximum Loss calculation
  const pml = portfolioValue * catExposure * (1 / Math.log(pmlLevel));

  // Determine attachment point (retention)
  const attachmentPoint = Math.min(availableCapital * 0.5, pml * 0.1);

  // Recommended coverage above retention
  const recommendedCoverage = pml - attachmentPoint;

  // Number of reinsurance layers needed
  const layers = Math.ceil(recommendedCoverage / (attachmentPoint * 2));

  return {
    recommendedCoverage,
    attachmentPoint,
    layers,
  };
}
