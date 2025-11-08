/**
 * AML Risk Scoring and Assessment Kit
 *
 * Enterprise-grade Anti-Money Laundering (AML) risk assessment system with
 * comprehensive scoring algorithms, dynamic weighting, and risk-based controls.
 *
 * Features:
 * - Multi-dimensional customer risk scoring
 * - Transaction-level risk assessment
 * - Geographic and channel risk evaluation
 * - Composite risk rating with factor weighting
 * - Risk tier assignment and controls
 * - Mitigation strategy generation
 * - Inherent vs residual risk analysis
 * - Risk appetite framework alignment
 * - Enterprise aggregation and monitoring
 * - Dynamic model updates and learning
 *
 * @module aml-risk-scoring-assessment-kit
 */

/**
 * Core AML risk score (0-100, where 100 is highest risk)
 */
export type RiskScore = number & { readonly __brand: 'RiskScore' };

/**
 * Risk tier classification
 */
export type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical';

/**
 * Risk category enumeration
 */
export enum RiskCategory {
  CustomerProfile = 'CUSTOMER_PROFILE',
  TransactionBehavior = 'TRANSACTION_BEHAVIOR',
  ProductService = 'PRODUCT_SERVICE',
  Geographic = 'GEOGRAPHIC',
  ChannelDelivery = 'CHANNEL_DELIVERY',
  ComplianceHistory = 'COMPLIANCE_HISTORY',
  BusinessStructure = 'BUSINESS_STRUCTURE',
}

/**
 * Customer profile data for AML assessment
 */
export interface CustomerProfile {
  customerId: string;
  customerType: 'Individual' | 'SME' | 'Corporate' | 'Financial Institution' | 'NGO' | 'Unknown';
  incorporationDate?: Date;
  registeredCountries: string[];
  businessActivities: string[];
  ownershipStructure: 'Direct' | 'Opaque' | 'Mixed';
  pep: boolean; // Politically Exposed Person
  sanctionMatches: number;
  complianceRating: number; // 0-100
  previousALerts: number;
  yearlyTransactionVolume: number;
}

/**
 * Transaction details for risk assessment
 */
export interface TransactionRecord {
  transactionId: string;
  customerId: string;
  amount: number;
  currency: string;
  transactionDate: Date;
  transactionType: 'Wire' | 'Card' | 'ACH' | 'Cash' | 'Crypto' | 'Other';
  direction: 'Inbound' | 'Outbound';
  counterpartyCountry: string;
  counterpartyType: 'Individual' | 'Business' | 'Unknown';
  purpose: string;
  settlementTime: number; // hours
}

/**
 * Product/service information
 */
export interface ProductService {
  productId: string;
  category: string;
  inherentRiskLevel: 'Low' | 'Medium' | 'High';
  regulatoryRestrictions: string[];
  typicalAmlControls: string[];
}

/**
 * Geographic region risk data
 */
export interface GeographicRegion {
  countryCode: string;
  countryName: string;
  amlIndex: number; // 0-100
  corruptionIndex: number; // 0-100
  sanctionedCountry: boolean;
  financialCenterStatus: boolean;
  instabilityIndex: number; // 0-100
}

/**
 * Risk factor weight configuration
 */
export interface RiskFactorWeights {
  customerProfileWeight: number;
  transactionBehaviorWeight: number;
  productServiceWeight: number;
  geographicWeight: number;
  channelWeight: number;
  complianceHistoryWeight: number;
  businessStructureWeight: number;
}

/**
 * Composite risk assessment result
 */
export interface CompositeRiskAssessment {
  customerId: string;
  overallRiskScore: RiskScore;
  riskTier: RiskTier;
  componentScores: {
    [key in RiskCategory]?: number;
  };
  applicableControls: string[];
  mitigationStrategies: string[];
  inherentRisk: RiskScore;
  residualRisk: RiskScore;
  lastAssessmentDate: Date;
  nextReviewDate: Date;
}

/**
 * Risk matrix for visualization
 */
export interface RiskMatrix {
  rows: Array<{
    factor: string;
    score: number;
    tier: RiskTier;
  }>;
  columns: {
    probability: number[];
    impact: number[];
  };
  crossFactorCorrelations: Map<string, number>;
}

/**
 * Dynamic risk model with learning capability
 */
export interface DynamicRiskModel {
  modelId: string;
  version: string;
  lastTrainingDate: Date;
  factorImportance: Map<string, number>;
  historicalAccuracy: number;
  falsePositiveRate: number;
}

/**
 * Risk-based control framework
 */
export interface RiskBasedControl {
  controlId: string;
  riskTierApplicable: RiskTier[];
  controlType: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annually' | 'Continuous';
  description: string;
}

/**
 * Risk appetite configuration
 */
export interface RiskAppetite {
  maxAcceptableRiskScore: number;
  acceptableRiskTiers: RiskTier[];
  riskToleranceByCategory: Map<RiskCategory, number>;
  escalationThresholds: Map<RiskTier, number>;
}

/**
 * Enterprise risk aggregation view
 */
export interface EnterpriseRiskView {
  aggregatedDate: Date;
  totalCustomers: number;
  riskDistribution: {
    [key in RiskTier]: number;
  };
  highestRiskCustomers: string[];
  portfolioRiskScore: RiskScore;
  complianceStatus: 'Pass' | 'Fail' | 'Needs Review';
  recommendedActions: string[];
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Create a valid RiskScore from a number
 * @param score - Numeric score (0-100)
 * @returns RiskScore branded type
 * @throws Error if score is not in valid range
 */
export function createRiskScore(score: number): RiskScore {
  if (score < 0 || score > 100 || !Number.isFinite(score)) {
    throw new Error(`Invalid risk score: ${score}. Must be between 0 and 100.`);
  }
  return score as RiskScore;
}

/**
 * Determine risk tier from score
 * @param score - Risk score (0-100)
 * @returns Appropriate RiskTier
 */
export function scoreToRiskTier(score: RiskScore): RiskTier {
  if (score < 25) return 'Low';
  if (score < 50) return 'Medium';
  if (score < 75) return 'High';
  return 'Critical';
}

/**
 * Validate geographic risk data
 * @param region - Geographic region to validate
 * @returns Validation result with any errors
 */
export function validateGeographicData(
  region: Partial<GeographicRegion>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!region.countryCode || region.countryCode.length !== 2) {
    errors.push('Country code must be 2-character ISO code');
  }

  if (region.amlIndex !== undefined && (region.amlIndex < 0 || region.amlIndex > 100)) {
    errors.push('AML index must be between 0 and 100');
  }

  if (
    region.corruptionIndex !== undefined &&
    (region.corruptionIndex < 0 || region.corruptionIndex > 100)
  ) {
    errors.push('Corruption index must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Normalize risk score to standard scale
 * @param score - Raw score value
 * @param min - Minimum possible value
 * @param max - Maximum possible value
 * @returns Normalized score between 0-100
 */
export function normalizeRiskScore(score: number, min: number, max: number): RiskScore {
  if (max <= min) {
    throw new Error('Max must be greater than min');
  }
  const normalized = ((score - min) / (max - min)) * 100;
  return createRiskScore(Math.min(Math.max(normalized, 0), 100));
}

// ==================== CUSTOMER RISK ALGORITHMS ====================

/**
 * Calculate customer profile risk score
 * Evaluates inherent risk based on customer characteristics
 * @param profile - Customer profile data
 * @returns Risk score component (0-100)
 */
export function calculateCustomerProfileRisk(profile: CustomerProfile): number {
  let score = 0;

  // Customer type risk
  const customerTypeRisk: Record<string, number> = {
    'Financial Institution': 5,
    Corporate: 15,
    SME: 25,
    Individual: 35,
    NGO: 45,
    Unknown: 95,
  };
  score += customerTypeRisk[profile.customerType] || 50;

  // Ownership structure risk
  if (profile.ownershipStructure === 'Opaque') {
    score += 25;
  } else if (profile.ownershipStructure === 'Mixed') {
    score += 12;
  }

  // PEP risk
  if (profile.pep) {
    score += 20;
  }

  // Sanction matches
  score += Math.min(profile.sanctionMatches * 15, 30);

  // Compliance rating (inverse)
  score += (100 - profile.complianceRating) * 0.3;

  // Previous alerts
  score += Math.min(profile.previousALerts * 5, 20);

  // Normalize to 0-100
  return Math.min(score, 100);
}

/**
 * Calculate customer tenure risk
 * Newer customers typically have higher risk
 * @param incorporationDate - Customer incorporation/onboarding date
 * @returns Risk score component (0-100)
 */
export function calculateCustomerTenureRisk(incorporationDate: Date): number {
  const now = new Date();
  const tenureMonths = (now.getTime() - incorporationDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (tenureMonths < 6) return 85;
  if (tenureMonths < 12) return 65;
  if (tenureMonths < 24) return 45;
  if (tenureMonths < 60) return 25;
  return 10;
}

/**
 * Calculate beneficial ownership complexity risk
 * Complex ownership structures increase risk
 * @param ownershipLayers - Number of ownership layers
 * @param jurisdictionCount - Number of different jurisdictions
 * @returns Risk score component (0-100)
 */
export function calculateBeneficialOwnershipRisk(
  ownershipLayers: number,
  jurisdictionCount: number,
): number {
  let score = 0;

  // Layer complexity
  if (ownershipLayers > 5) score += 30;
  else if (ownershipLayers > 3) score += 20;
  else if (ownershipLayers > 1) score += 10;

  // Jurisdiction diversity
  if (jurisdictionCount > 5) score += 25;
  else if (jurisdictionCount > 3) score += 15;
  else if (jurisdictionCount > 1) score += 8;

  return Math.min(score, 100);
}

/**
 * Calculate business activity risk
 * Certain industries are inherently higher risk
 * @param activities - List of business activities
 * @returns Risk score component (0-100)
 */
export function calculateBusinessActivityRisk(activities: string[]): number {
  const highRiskActivities = new Set([
    'Money Transmission',
    'Cryptocurrency',
    'Gambling',
    'Precious Metals Trading',
    'Arms Dealing',
    'Sanctions Violation',
    'Illicit Goods',
  ]);

  const mediumRiskActivities = new Set([
    'Real Estate',
    'International Trade',
    'Consulting',
    'Financial Advisory',
    'Currency Exchange',
  ]);

  let score = 0;
  const activitySet = new Set(activities);

  // High-risk activities
  for (const activity of activities) {
    if (highRiskActivities.has(activity)) score += 40;
    else if (mediumRiskActivities.has(activity)) score += 15;
  }

  // Multiple high-risk activities compounds risk
  const highRiskCount = activities.filter((a) => highRiskActivities.has(a)).length;
  if (highRiskCount > 1) score += highRiskCount * 10;

  return Math.min(score, 100);
}

/**
 * Calculate customer relationship risk based on counterparty profile
 * @param counterpartyCountries - Countries where customer conducts business
 * @param geographicRegions - Reference geographic risk data
 * @returns Risk score component (0-100)
 */
export function calculateCounterpartyGeographicRisk(
  counterpartyCountries: string[],
  geographicRegions: Map<string, GeographicRegion>,
): number {
  let totalRisk = 0;

  for (const country of counterpartyCountries) {
    const region = geographicRegions.get(country);
    if (region) {
      let countryRisk = region.amlIndex * 0.4 + region.corruptionIndex * 0.3;
      if (region.sanctionedCountry) countryRisk += 30;
      totalRisk += countryRisk;
    } else {
      totalRisk += 50; // Unknown country premium
    }
  }

  return Math.min(totalRisk / counterpartyCountries.length, 100);
}

// ==================== TRANSACTION RISK ASSESSMENT ====================

/**
 * Calculate transaction amount risk
 * Unusual amounts indicate elevated risk
 * @param amount - Transaction amount
 * @param customerAverageTransaction - Customer's typical transaction size
 * @returns Risk score component (0-100)
 */
export function calculateTransactionAmountRisk(
  amount: number,
  customerAverageTransaction: number,
): number {
  if (customerAverageTransaction === 0) return 50;

  const ratio = amount / customerAverageTransaction;

  if (ratio > 100) return 95;
  if (ratio > 50) return 85;
  if (ratio > 20) return 70;
  if (ratio > 10) return 50;
  if (ratio > 5) return 30;
  if (ratio < 0.1) return 60; // Unusually small
  if (ratio < 0.5) return 40;

  return 20;
}

/**
 * Calculate transaction frequency risk
 * Sudden changes in activity level indicate risk
 * @param transactionFrequency - Transactions per month
 * @param historicalFrequency - Customer's historical monthly average
 * @returns Risk score component (0-100)
 */
export function calculateTransactionFrequencyRisk(
  transactionFrequency: number,
  historicalFrequency: number,
): number {
  if (historicalFrequency === 0) return 40;

  const frequencyRatio = transactionFrequency / historicalFrequency;

  if (frequencyRatio > 10) return 80;
  if (frequencyRatio > 5) return 65;
  if (frequencyRatio > 3) return 45;
  if (frequencyRatio > 1.5) return 25;
  if (frequencyRatio < 0.5) return 30; // Unusual reduction
  if (frequencyRatio < 0.1) return 20;

  return 15;
}

/**
 * Calculate transaction type risk
 * Certain transaction types carry inherent risk
 * @param transactionType - Type of transaction
 * @returns Risk score component (0-100)
 */
export function calculateTransactionTypeRisk(
  transactionType: string,
): number {
  const typeRiskScores: Record<string, number> = {
    Crypto: 85,
    Wire: 45,
    Cash: 75,
    Card: 25,
    ACH: 20,
    Other: 50,
  };

  return typeRiskScores[transactionType] || 40;
}

/**
 * Calculate transaction timing risk
 * Off-hours or unusual timing patterns indicate risk
 * @param transactionDate - Date and time of transaction
 * @returns Risk score component (0-100)
 */
export function calculateTransactionTimingRisk(transactionDate: Date): number {
  const hour = transactionDate.getHours();
  const dayOfWeek = transactionDate.getDay();

  // Off-hours premium (0-5am)
  if (hour < 5) return 60;

  // Weekend premium
  if (dayOfWeek === 0 || dayOfWeek === 6) return 25;

  return 15;
}

/**
 * Calculate settlement speed risk
 * Rapid or delayed settlements may indicate risk
 * @param settlementHours - Time to settlement
 * @returns Risk score component (0-100)
 */
export function calculateSettlementSpeedRisk(settlementHours: number): number {
  if (settlementHours < 1) return 70; // Instant/too fast
  if (settlementHours < 4) return 40;
  if (settlementHours < 24) return 20;
  if (settlementHours < 72) return 15;
  if (settlementHours > 30 * 24) return 65; // Unusually delayed
  return 10;
}

/**
 * Calculate transaction pattern anomaly risk
 * Detects deviations from normal customer behavior
 * @param currentTransaction - Current transaction
 * @param historicalAverages - Customer's historical transaction profile
 * @returns Risk score component (0-100)
 */
export function calculateTransactionPatternAnomalyRisk(
  currentTransaction: TransactionRecord,
  historicalAverages: {
    avgAmount: number;
    avgFrequency: number;
    mostCommonCountries: string[];
    mostCommonTypes: string[];
    stdDeviation: number;
  },
): number {
  let anomalyScore = 0;

  // Amount anomaly
  const amountZScore =
    (currentTransaction.amount - historicalAverages.avgAmount) /
    (historicalAverages.stdDeviation || 1);
  if (Math.abs(amountZScore) > 3) anomalyScore += 40;
  else if (Math.abs(amountZScore) > 2) anomalyScore += 25;

  // Country anomaly
  if (!historicalAverages.mostCommonCountries.includes(currentTransaction.counterpartyCountry)) {
    anomalyScore += 20;
  }

  // Transaction type anomaly
  if (!historicalAverages.mostCommonTypes.includes(currentTransaction.transactionType)) {
    anomalyScore += 15;
  }

  return Math.min(anomalyScore, 100);
}

// ==================== PRODUCT/SERVICE RISK EVALUATION ====================

/**
 * Calculate product inherent risk
 * Products themselves carry inherent AML risk
 * @param product - Product or service information
 * @returns Risk score component (0-100)
 */
export function calculateProductInherentRisk(product: ProductService): number {
  let score = 0;

  // Base risk by level
  const riskLevelScores: Record<string, number> = {
    Low: 15,
    Medium: 45,
    High: 80,
  };
  score = riskLevelScores[product.inherentRiskLevel] || 50;

  // Regulatory restrictions amplify risk
  if (product.regulatoryRestrictions.length > 0) {
    score += product.regulatoryRestrictions.length * 5;
  }

  return Math.min(score, 100);
}

/**
 * Calculate product usage risk
 * How the product is used affects overall risk
 * @param transactionVolume - Annual transaction volume through product
 * @param avgTransactionSize - Average transaction size
 * @param typicalMarketBehavior - Expected behavior for product type
 * @returns Risk score component (0-100)
 */
export function calculateProductUsageRisk(
  transactionVolume: number,
  avgTransactionSize: number,
  typicalMarketBehavior: {
    typicalVolumeRange: [number, number];
    typicalSizeRange: [number, number];
  },
): number {
  let score = 0;

  // Volume anomaly
  const [minVol, maxVol] = typicalMarketBehavior.typicalVolumeRange;
  if (transactionVolume > maxVol * 2) score += 30;
  else if (transactionVolume < minVol / 2) score += 20;

  // Size anomaly
  const [minSize, maxSize] = typicalMarketBehavior.typicalSizeRange;
  if (avgTransactionSize > maxSize * 2) score += 25;
  else if (avgTransactionSize < minSize / 2) score += 15;

  return Math.min(score, 100);
}

/**
 * Calculate product control adequacy
 * Evaluates if existing controls match risk level
 * @param product - Product information
 * @param appliedControls - Controls actually applied
 * @returns Risk score component (0-100, lower is better control)
 */
export function calculateProductControlAdequacy(
  product: ProductService,
  appliedControls: string[],
): number {
  const requiredControls = new Set(product.typicalAmlControls);
  const appliedSet = new Set(appliedControls);

  let score = 0;

  // Coverage gap
  const missingControls = product.typicalAmlControls.filter(
    (c) => !appliedSet.has(c),
  ).length;
  score += missingControls * 10;

  return Math.min(score, 100);
}

// ==================== GEOGRAPHIC SCORING ====================

/**
 * Calculate jurisdiction risk score
 * Comprehensive geographic risk assessment
 * @param regions - Geographic regions involved
 * @returns Risk score component (0-100)
 */
export function calculateJurisdictionRisk(regions: GeographicRegion[]): number {
  if (regions.length === 0) return 50;

  let totalRisk = 0;

  for (const region of regions) {
    let regionRisk = 0;

    // AML framework
    regionRisk += region.amlIndex * 0.35;

    // Corruption
    regionRisk += region.corruptionIndex * 0.25;

    // Sanctions
    if (region.sanctionedCountry) regionRisk += 40;

    // Political instability
    regionRisk += region.instabilityIndex * 0.15;

    // Financial center status (can be double-edged)
    if (region.financialCenterStatus) regionRisk += 15; // More scrutiny needed

    totalRisk += regionRisk;
  }

  const avgRisk = totalRisk / regions.length;
  return Math.min(avgRisk, 100);
}

/**
 * Calculate high-risk jurisdiction exposure
 * Quantifies exposure to problematic jurisdictions
 * @param jurisdictions - List of jurisdiction codes
 * @param highRiskList - List of high-risk jurisdiction codes
 * @returns Risk score component (0-100)
 */
export function calculateHighRiskJurisdictionExposure(
  jurisdictions: string[],
  highRiskList: string[],
): number {
  const highRiskSet = new Set(highRiskList);
  const exposures = jurisdictions.filter((j) => highRiskSet.has(j)).length;
  return (exposures / jurisdictions.length) * 100;
}

/**
 * Calculate sanction regime exposure
 * Evaluates exposure to sanctioned countries/entities
 * @param exposedCountries - Countries with business relationships
 * @param sanctionedCountries - Known sanctioned jurisdictions
 * @returns Risk score component (0-100)
 */
export function calculateSanctionRegimeExposure(
  exposedCountries: string[],
  sanctionedCountries: string[],
): number {
  const sanctionSet = new Set(sanctionedCountries);
  let score = 0;

  for (const country of exposedCountries) {
    if (sanctionSet.has(country)) {
      score += 100; // Direct exposure to sanctions = critical
      break;
    }
  }

  return Math.min(score, 100);
}

// ==================== CHANNEL RISK EVALUATION ====================

/**
 * Calculate distribution channel risk
 * Different delivery channels have inherent risk profiles
 * @param channel - Distribution channel type
 * @returns Risk score component (0-100)
 */
export function calculateChannelRisk(
  channel: string,
): number {
  const channelRisks: Record<string, number> = {
    'Online': 35,
    'Branch': 20,
    'Mobile': 45,
    'API': 25,
    'Third-Party Referral': 60,
    'Correspondent Banking': 55,
    'Peer-to-Peer': 85,
    'Cryptocurrency Exchange': 90,
    'Unknown': 80,
  };

  return channelRisks[channel] || 50;
}

/**
 * Calculate third-party risk
 * Evaluates risks from intermediaries and partners
 * @param thirdPartyName - Name of third-party provider
 * @param riskRating - Third-party's own risk rating (0-100)
 * @param complianceTrack - Third-party's compliance history
 * @returns Risk score component (0-100)
 */
export function calculateThirdPartyRisk(
  thirdPartyName: string,
  riskRating: number,
  complianceTrack: 'Good' | 'Fair' | 'Poor',
): number {
  let score = riskRating * 0.6; // Weight third-party's own risk

  // Compliance track record
  if (complianceTrack === 'Poor') score += 25;
  else if (complianceTrack === 'Fair') score += 12;

  return Math.min(score, 100);
}

/**
 * Calculate digital channel risk
 * Digital channels may have unique security/compliance risks
 * @param isOnline - Whether transaction is online
 * @param encryptionLevel - Encryption standard used
 * @param authenticationFactor - Number of authentication factors
 * @returns Risk score component (0-100)
 */
export function calculateDigitalChannelRisk(
  isOnline: boolean,
  encryptionLevel: 'None' | 'Basic' | 'Standard' | 'Enhanced',
  authenticationFactor: number,
): number {
  if (!isOnline) return 15; // Offline is lower risk

  let score = 0;

  // Encryption
  const encryptionRisks: Record<string, number> = {
    None: 70,
    Basic: 45,
    Standard: 20,
    Enhanced: 5,
  };
  score += encryptionRisks[encryptionLevel] || 40;

  // Authentication
  if (authenticationFactor < 1) score += 50;
  else if (authenticationFactor === 1) score += 25;
  else if (authenticationFactor === 2) score += 10;

  return Math.min(score, 100);
}

// ==================== COMPOSITE RATING AND WEIGHTING ====================

/**
 * Calculate composite AML risk score
 * Combines multiple risk dimensions with configurable weights
 * @param componentScores - Individual risk component scores
 * @param weights - Weight configuration for each component
 * @returns Overall composite risk score (0-100)
 */
export function calculateCompositeRiskScore(
  componentScores: Partial<Record<RiskCategory, number>>,
  weights: Partial<RiskFactorWeights>,
): RiskScore {
  const defaultWeights: RiskFactorWeights = {
    customerProfileWeight: 0.25,
    transactionBehaviorWeight: 0.25,
    productServiceWeight: 0.15,
    geographicWeight: 0.15,
    channelWeight: 0.1,
    complianceHistoryWeight: 0.07,
    businessStructureWeight: 0.03,
  };

  const finalWeights = { ...defaultWeights, ...weights };
  let totalScore = 0;
  let totalWeight = 0;

  // Customer profile
  if (componentScores[RiskCategory.CustomerProfile] !== undefined) {
    totalScore += (componentScores[RiskCategory.CustomerProfile] || 0) *
      finalWeights.customerProfileWeight;
    totalWeight += finalWeights.customerProfileWeight;
  }

  // Transaction behavior
  if (componentScores[RiskCategory.TransactionBehavior] !== undefined) {
    totalScore += (componentScores[RiskCategory.TransactionBehavior] || 0) *
      finalWeights.transactionBehaviorWeight;
    totalWeight += finalWeights.transactionBehaviorWeight;
  }

  // Product/service
  if (componentScores[RiskCategory.ProductService] !== undefined) {
    totalScore += (componentScores[RiskCategory.ProductService] || 0) *
      finalWeights.productServiceWeight;
    totalWeight += finalWeights.productServiceWeight;
  }

  // Geographic
  if (componentScores[RiskCategory.Geographic] !== undefined) {
    totalScore += (componentScores[RiskCategory.Geographic] || 0) *
      finalWeights.geographicWeight;
    totalWeight += finalWeights.geographicWeight;
  }

  // Channel
  if (componentScores[RiskCategory.ChannelDelivery] !== undefined) {
    totalScore += (componentScores[RiskCategory.ChannelDelivery] || 0) *
      finalWeights.channelWeight;
    totalWeight += finalWeights.channelWeight;
  }

  // Compliance history
  if (componentScores[RiskCategory.ComplianceHistory] !== undefined) {
    totalScore += (componentScores[RiskCategory.ComplianceHistory] || 0) *
      finalWeights.complianceHistoryWeight;
    totalWeight += finalWeights.complianceHistoryWeight;
  }

  // Business structure
  if (componentScores[RiskCategory.BusinessStructure] !== undefined) {
    totalScore += (componentScores[RiskCategory.BusinessStructure] || 0) *
      finalWeights.businessStructureWeight;
    totalWeight += finalWeights.businessStructureWeight;
  }

  const compositeScore = totalWeight > 0 ? totalScore / totalWeight : 50;
  return createRiskScore(compositeScore);
}

/**
 * Apply risk modifier based on temporal factors
 * Recent events may temporarily increase risk
 * @param baseScore - Base composite risk score
 * @param recentAnomalies - Number of recent suspicious transactions
 * @param monthsSinceLastReview - Time since last assessment
 * @returns Adjusted risk score
 */
export function applyTemporalRiskModifier(
  baseScore: RiskScore,
  recentAnomalies: number,
  monthsSinceLastReview: number,
): RiskScore {
  let adjustedScore = baseScore;

  // Recent anomalies increase risk
  adjustedScore += Math.min(recentAnomalies * 2, 15);

  // Stale assessments increase risk
  if (monthsSinceLastReview > 12) adjustedScore += 10;
  else if (monthsSinceLastReview > 6) adjustedScore += 5;

  return createRiskScore(Math.min(adjustedScore, 100));
}

/**
 * Create comprehensive risk matrix
 * Visualizes risk across multiple factors
 * @param factors - Risk factors with scores
 * @returns Risk matrix structure
 */
export function createRiskMatrix(
  factors: Array<{ name: string; score: number }>,
): RiskMatrix {
  const sortedFactors = factors.sort((a, b) => b.score - a.score);

  return {
    rows: sortedFactors.map((f) => ({
      factor: f.name,
      score: f.score,
      tier: scoreToRiskTier(createRiskScore(f.score)),
    })),
    columns: {
      probability: [0, 25, 50, 75, 100],
      impact: [0, 25, 50, 75, 100],
    },
    crossFactorCorrelations: new Map(),
  };
}

// ==================== DYNAMIC MODEL UPDATES ====================

/**
 * Update factor weights based on model performance
 * Allows machine learning-driven optimization
 * @param currentWeights - Current weight configuration
 * @param performanceMetrics - Model accuracy metrics
 * @returns Updated weight configuration
 */
export function updateFactorWeights(
  currentWeights: RiskFactorWeights,
  performanceMetrics: {
    customerProfileAccuracy: number;
    transactionBehaviorAccuracy: number;
    productServiceAccuracy: number;
    geographicAccuracy: number;
    channelAccuracy: number;
  },
): RiskFactorWeights {
  // Normalize accuracies
  const totalAccuracy =
    performanceMetrics.customerProfileAccuracy +
    performanceMetrics.transactionBehaviorAccuracy +
    performanceMetrics.productServiceAccuracy +
    performanceMetrics.geographicAccuracy +
    performanceMetrics.channelAccuracy;

  return {
    customerProfileWeight:
      (performanceMetrics.customerProfileAccuracy / totalAccuracy) * 0.3,
    transactionBehaviorWeight:
      (performanceMetrics.transactionBehaviorAccuracy / totalAccuracy) * 0.3,
    productServiceWeight:
      (performanceMetrics.productServiceAccuracy / totalAccuracy) * 0.18,
    geographicWeight: (performanceMetrics.geographicAccuracy / totalAccuracy) * 0.15,
    channelWeight: (performanceMetrics.channelAccuracy / totalAccuracy) * 0.07,
    complianceHistoryWeight: 0.07,
    businessStructureWeight: 0.03,
  };
}

/**
 * Calculate model drift detection
 * Identifies when risk model performance degrades
 * @param historicalAccuracy - Model's historical accuracy
 * @param recentAccuracy - Recent period accuracy
 * @param threshold - Drift threshold (default 0.05 = 5%)
 * @returns Drift detection result
 */
export function detectModelDrift(
  historicalAccuracy: number,
  recentAccuracy: number,
  threshold: number = 0.05,
): { driftDetected: boolean; degradation: number; recommendation: string } {
  const degradation = historicalAccuracy - recentAccuracy;
  const driftDetected = degradation > threshold;

  let recommendation = 'Model performing within acceptable parameters';
  if (driftDetected) {
    if (degradation > 0.15) {
      recommendation = 'Critical: Model requires immediate retraining';
    } else if (degradation > 0.1) {
      recommendation = 'High: Schedule model retraining';
    } else {
      recommendation = 'Moderate: Monitor model performance closely';
    }
  }

  return {
    driftDetected,
    degradation,
    recommendation,
  };
}

/**
 * Reweight factors based on recent transaction data
 * Adapts model to changing risk landscape
 * @param baseWeights - Starting weights
 * @param recentTransactions - Recent transaction sample
 * @returns Adapted weights
 */
export function adaptWeightsToRecentActivity(
  baseWeights: RiskFactorWeights,
  recentTransactions: TransactionRecord[],
): RiskFactorWeights {
  if (recentTransactions.length === 0) return baseWeights;

  // Analyze transaction characteristics
  const cryptoTransactions = recentTransactions.filter(
    (t) => t.transactionType === 'Crypto',
  ).length;
  const highAmountTransactions = recentTransactions.filter(
    (t) => t.amount > 100000,
  ).length;

  // Boost channel weight if crypto prevalent
  const weights = { ...baseWeights };
  if (cryptoTransactions / recentTransactions.length > 0.3) {
    weights.channelWeight += 0.05;
  }

  return weights;
}

// ==================== TIER ASSIGNMENT AND CONTROLS ====================

/**
 * Assign customer to risk tier with controls
 * Determines appropriate control level and monitoring
 * @param riskScore - Overall risk score
 * @returns Tier with recommended controls
 */
export function assignRiskTierWithControls(
  riskScore: RiskScore,
): { tier: RiskTier; controls: string[]; reviewFrequency: string } {
  const tier = scoreToRiskTier(riskScore);

  const controlMatrix: Record<RiskTier, { controls: string[]; reviewFrequency: string }> = {
    Low: {
      controls: [
        'Annual KYC review',
        'Basic transaction monitoring',
        'Standard sanctions screening',
      ],
      reviewFrequency: 'Annually',
    },
    Medium: {
      controls: [
        'Semi-annual KYC review',
        'Enhanced transaction monitoring',
        'Quarterly risk assessment',
        'Enhanced due diligence on high-risk transactions',
      ],
      reviewFrequency: 'Semi-annually',
    },
    High: {
      controls: [
        'Quarterly KYC review',
        'Real-time transaction monitoring',
        'Monthly risk assessment',
        'Enhanced due diligence on all transactions',
        'Approval required for transactions > threshold',
        'Quarterly management review',
      ],
      reviewFrequency: 'Quarterly',
    },
    Critical: {
      controls: [
        'Monthly KYC review',
        'Continuous transaction monitoring',
        'Weekly risk assessment',
        'Enhanced due diligence on all transactions',
        'Prior approval required for all transactions',
        'Escalation to compliance officer',
        'Possible account restrictions or closure review',
        'Daily management review',
      ],
      reviewFrequency: 'Monthly',
    },
  };

  return {
    tier,
    ...controlMatrix[tier],
  };
}

/**
 * Apply dynamic control adjustments
 * Modifies controls based on specific risk factors
 * @param baseControls - Standard controls for tier
 * @param riskFactors - Specific risk factors present
 * @returns Adjusted control list
 */
export function applyDynamicControlAdjustments(
  baseControls: string[],
  riskFactors: string[],
): string[] {
  const adjustedControls = new Set(baseControls);

  for (const factor of riskFactors) {
    switch (factor) {
      case 'PEP':
        adjustedControls.add('Enhanced beneficial ownership verification');
        adjustedControls.add('Source of funds verification');
        break;
      case 'Sanctions':
        adjustedControls.add('Continuous sanctions screening');
        adjustedControls.add('Quarterly compliance certification');
        break;
      case 'High-Risk Jurisdiction':
        adjustedControls.add('Country-specific monitoring');
        adjustedControls.add('Enhanced due diligence');
        break;
      case 'Unusual Transactions':
        adjustedControls.add('Prior approval for transactions');
        break;
      case 'Complex Ownership':
        adjustedControls.add('Annual beneficial ownership update');
        adjustedControls.add('Organizational structure review');
        break;
    }
  }

  return Array.from(adjustedControls);
}

// ==================== MITIGATION STRATEGIES ====================

/**
 * Generate risk mitigation strategies
 * Recommends actions to reduce identified risks
 * @param riskScore - Current risk score
 * @param riskFactors - Specific risk factors identified
 * @param customerType - Type of customer
 * @returns List of mitigation strategies
 */
export function generateMitigationStrategies(
  riskScore: RiskScore,
  riskFactors: string[],
  customerType: string,
): string[] {
  const strategies: string[] = [];

  // Core mitigation based on score
  if (riskScore > 75) {
    strategies.push('Conduct comprehensive enhanced due diligence');
    strategies.push('Implement continuous transaction monitoring');
    strategies.push('Schedule immediate compliance officer review');
    strategies.push('Consider account restrictions or suspension');
  } else if (riskScore > 50) {
    strategies.push('Enhance ongoing due diligence procedures');
    strategies.push('Implement targeted transaction monitoring');
    strategies.push('Schedule quarterly compliance review');
  } else {
    strategies.push('Maintain standard monitoring procedures');
    strategies.push('Conduct annual compliance review');
  }

  // Factor-specific mitigations
  if (riskFactors.includes('PEP')) {
    strategies.push('Verify source of funds for all transactions');
    strategies.push('Obtain beneficial ownership certification');
  }

  if (riskFactors.includes('High-Risk Jurisdiction')) {
    strategies.push('Screen all counterparties against sanctions lists');
    strategies.push('Document business rationale for relationships');
  }

  if (riskFactors.includes('Unusual Transactions')) {
    strategies.push('Implement pre-approval requirement for large transactions');
    strategies.push('Conduct transaction investigation and documentation');
  }

  if (riskFactors.includes('Complex Ownership')) {
    strategies.push('Obtain complete organizational chart');
    strategies.push('Verify ultimate beneficial owners');
  }

  // Customer-type specific
  if (customerType === 'Individual') {
    strategies.push('Obtain employment verification');
    strategies.push('Document source of wealth');
  } else if (customerType === 'Corporate') {
    strategies.push('Verify corporate registrations');
    strategies.push('Confirm board authorization for account');
  }

  return strategies;
}

/**
 * Calculate mitigation effectiveness
 * Estimates how much risk is reduced by mitigations
 * @param baseRiskScore - Risk before mitigations
 * @param appliedMitigations - List of applied mitigation strategies
 * @returns Residual risk score
 */
export function calculateMitigationEffectiveness(
  baseRiskScore: RiskScore,
  appliedMitigations: string[],
): RiskScore {
  let residualScore = baseRiskScore;

  // Each mitigation reduces risk by estimated amount
  const mitigationEffectiveness: Record<string, number> = {
    'Conduct comprehensive enhanced due diligence': 15,
    'Implement continuous transaction monitoring': 20,
    'Verify source of funds for all transactions': 12,
    'Screen all counterparties against sanctions lists': 10,
    'Implement pre-approval requirement for large transactions': 8,
    'Obtain complete organizational chart': 5,
    'Maintain standard monitoring procedures': 3,
  };

  for (const mitigation of appliedMitigations) {
    const effectiveness = mitigationEffectiveness[mitigation] || 5;
    residualScore -= effectiveness;
  }

  return createRiskScore(Math.max(residualScore, 0));
}

// ==================== INHERENT VS RESIDUAL RISK ====================

/**
 * Calculate inherent risk
 * Risk before any controls are applied
 * @param profile - Customer profile
 * @param transactions - Recent transactions
 * @param products - Products used
 * @returns Inherent risk score
 */
export function calculateInherentRisk(
  profile: CustomerProfile,
  transactions: TransactionRecord[],
  products: ProductService[],
): RiskScore {
  const componentScores: Partial<Record<RiskCategory, number>> = {};

  componentScores[RiskCategory.CustomerProfile] = calculateCustomerProfileRisk(
    profile,
  );

  // Average transaction risk
  if (transactions.length > 0) {
    const transactionRisks = transactions.map((t) =>
      calculateTransactionTypeRisk(t.transactionType),
    );
    componentScores[RiskCategory.TransactionBehavior] =
      transactionRisks.reduce((a, b) => a + b, 0) / transactionRisks.length;
  }

  // Average product risk
  if (products.length > 0) {
    const productRisks = products.map((p) => calculateProductInherentRisk(p));
    componentScores[RiskCategory.ProductService] =
      productRisks.reduce((a, b) => a + b, 0) / productRisks.length;
  }

  return calculateCompositeRiskScore(componentScores, {
    customerProfileWeight: 0.4,
    transactionBehaviorWeight: 0.3,
    productServiceWeight: 0.3,
  });
}

/**
 * Calculate residual risk
 * Risk remaining after all controls are applied
 * @param inherentRisk - Inherent risk score
 * @param appliedControls - Controls in place
 * @param controlEffectiveness - Map of control to effectiveness (0-1)
 * @returns Residual risk score
 */
export function calculateResidualRisk(
  inherentRisk: RiskScore,
  appliedControls: string[],
  controlEffectiveness: Map<string, number> = new Map(),
): RiskScore {
  let controlReduction = 0;

  for (const control of appliedControls) {
    const effectiveness = controlEffectiveness.get(control) || 0.5;
    controlReduction += effectiveness * 10; // Each control can reduce up to 10 points
  }

  const residualRisk = Math.max(inherentRisk - controlReduction, 0);
  return createRiskScore(residualRisk);
}

/**
 * Compare inherent vs residual risk
 * Determines if controls are adequate
 * @param inherentRisk - Risk without controls
 * @param residualRisk - Risk with controls
 * @param acceptableResidualLevel - Target residual risk level
 * @returns Analysis result
 */
export function analyzeRiskReduction(
  inherentRisk: RiskScore,
  residualRisk: RiskScore,
  acceptableResidualLevel: RiskScore,
): {
  controlAdequate: boolean;
  riskReduction: number;
  reductionPercentage: number;
  recommendation: string;
} {
  const riskReduction = inherentRisk - residualRisk;
  const reductionPercentage = (riskReduction / inherentRisk) * 100;
  const controlAdequate = residualRisk <= acceptableResidualLevel;

  let recommendation = 'Current controls appear adequate';
  if (!controlAdequate) {
    const gap = residualRisk - acceptableResidualLevel;
    if (gap > 20) {
      recommendation = 'Critical: Additional controls urgently needed';
    } else if (gap > 10) {
      recommendation = 'High: Strengthen controls to reduce risk';
    } else {
      recommendation = 'Moderate: Consider enhancing current controls';
    }
  }

  return {
    controlAdequate,
    riskReduction,
    reductionPercentage,
    recommendation,
  };
}

// ==================== RISK APPETITE FRAMEWORK ====================

/**
 * Create default risk appetite framework
 * Sets organization-wide risk tolerance
 * @param riskTolerance - Organization's risk tolerance (0-100)
 * @returns Risk appetite configuration
 */
export function createRiskAppetiteFramework(riskTolerance: number): RiskAppetite {
  const acceptableRiskTiers: RiskTier[] =
    riskTolerance > 70
      ? ['Low', 'Medium']
      : riskTolerance > 40
        ? ['Low']
        : [];

  return {
    maxAcceptableRiskScore: createRiskScore(riskTolerance),
    acceptableRiskTiers,
    riskToleranceByCategory: new Map([
      [RiskCategory.CustomerProfile, riskTolerance * 0.8],
      [RiskCategory.TransactionBehavior, riskTolerance * 0.9],
      [RiskCategory.ProductService, riskTolerance * 0.7],
      [RiskCategory.Geographic, riskTolerance * 0.5],
      [RiskCategory.ChannelDelivery, riskTolerance * 0.8],
      [RiskCategory.ComplianceHistory, riskTolerance * 0.6],
      [RiskCategory.BusinessStructure, riskTolerance * 0.7],
    ]),
    escalationThresholds: new Map([
      ['Low', riskTolerance * 0.3],
      ['Medium', riskTolerance * 0.6],
      ['High', riskTolerance * 0.85],
      ['Critical', 100],
    ]),
  };
}

/**
 * Evaluate appetite alignment
 * Determines if risk assessment aligns with appetite
 * @param riskScore - Current risk score
 * @param appetite - Risk appetite framework
 * @returns Alignment analysis
 */
export function evaluateAppetiteAlignment(
  riskScore: RiskScore,
  appetite: RiskAppetite,
): {
  withinAppetite: boolean;
  breachSeverity: 'None' | 'Minor' | 'Moderate' | 'Severe';
  action: string;
} {
  const withinAppetite = riskScore <= appetite.maxAcceptableRiskScore;

  let breachSeverity: 'None' | 'Minor' | 'Moderate' | 'Severe' = 'None';
  let action = 'No action required';

  if (!withinAppetite) {
    const excess = riskScore - appetite.maxAcceptableRiskScore;

    if (excess < 10) {
      breachSeverity = 'Minor';
      action = 'Monitor risk; document exception';
    } else if (excess < 20) {
      breachSeverity = 'Moderate';
      action = 'Escalate to risk committee; implement mitigation';
    } else {
      breachSeverity = 'Severe';
      action = 'Immediate escalation to board; consider account closure';
    }
  }

  return {
    withinAppetite,
    breachSeverity,
    action,
  };
}

/**
 * Calculate portfolio risk vs appetite
 * Aggregates customer risks against organization appetite
 * @param customerRisks - Array of individual customer risk scores
 * @param appetite - Risk appetite framework
 * @returns Portfolio assessment
 */
export function evaluatePortfolioVsAppetite(
  customerRisks: RiskScore[],
  appetite: RiskAppetite,
): {
  portfolioRiskScore: RiskScore;
  percentageWithinAppetite: number;
  percentageExceeding: number;
  recommendation: string;
} {
  if (customerRisks.length === 0) {
    return {
      portfolioRiskScore: createRiskScore(0),
      percentageWithinAppetite: 100,
      percentageExceeding: 0,
      recommendation: 'No customers to assess',
    };
  }

  const avgRisk =
    customerRisks.reduce((a, b) => a + b, 0) / customerRisks.length;
  const portfolioRiskScore = createRiskScore(avgRisk);

  const withinAppetite = customerRisks.filter(
    (r) => r <= appetite.maxAcceptableRiskScore,
  ).length;
  const percentageWithinAppetite = (withinAppetite / customerRisks.length) * 100;
  const percentageExceeding = 100 - percentageWithinAppetite;

  let recommendation = 'Portfolio within risk appetite';
  if (percentageExceeding > 30) {
    recommendation = 'High percentage of customers exceed appetite; review portfolio composition';
  } else if (percentageExceeding > 10) {
    recommendation = 'Some customers exceed appetite; implement targeted mitigations';
  }

  return {
    portfolioRiskScore,
    percentageWithinAppetite,
    percentageExceeding,
    recommendation,
  };
}

// ==================== ENTERPRISE AGGREGATION ====================

/**
 * Aggregate customer risk assessments
 * Creates enterprise-wide risk view
 * @param customerAssessments - Individual customer risk assessments
 * @param assessmentDate - Date of aggregation
 * @returns Enterprise risk aggregation
 */
export function aggregateEnterpriseRisk(
  customerAssessments: CompositeRiskAssessment[],
  assessmentDate: Date,
): EnterpriseRiskView {
  if (customerAssessments.length === 0) {
    return {
      aggregatedDate: assessmentDate,
      totalCustomers: 0,
      riskDistribution: {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0,
      },
      highestRiskCustomers: [],
      portfolioRiskScore: createRiskScore(0),
      complianceStatus: 'Pass',
      recommendedActions: [],
    };
  }

  // Distribution calculation
  const riskDistribution: Record<RiskTier, number> = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };

  let totalScore = 0;
  const sortedByRisk = [...customerAssessments].sort(
    (a, b) => b.overallRiskScore - a.overallRiskScore,
  );

  for (const assessment of customerAssessments) {
    riskDistribution[assessment.riskTier]++;
    totalScore += assessment.overallRiskScore;
  }

  // Portfolio score
  const portfolioRiskScore = createRiskScore(totalScore / customerAssessments.length);

  // Highest risk customers
  const highestRiskCustomers = sortedByRisk
    .slice(0, Math.min(10, customerAssessments.length))
    .map((a) => a.customerId);

  // Compliance status
  const criticalCount = riskDistribution.Critical;
  const highCount = riskDistribution.High;
  const complianceStatus: 'Pass' | 'Fail' | 'Needs Review' =
    criticalCount > 0
      ? 'Fail'
      : highCount > customerAssessments.length * 0.2
        ? 'Needs Review'
        : 'Pass';

  // Recommendations
  const recommendedActions: string[] = [];
  if (criticalCount > 0) {
    recommendedActions.push(`${criticalCount} critical risk customers require immediate action`);
  }
  if (highCount > customerAssessments.length * 0.25) {
    recommendedActions.push('High proportion of High-risk customers; enhance oversight');
  }
  if (portfolioRiskScore > 50) {
    recommendedActions.push('Portfolio risk score elevated; consider portfolio rebalancing');
  }

  return {
    aggregatedDate: assessmentDate,
    totalCustomers: customerAssessments.length,
    riskDistribution,
    highestRiskCustomers,
    portfolioRiskScore,
    complianceStatus,
    recommendedActions,
  };
}

/**
 * Calculate concentration risk
 * Identifies over-exposure to specific risk factors
 * @param assessments - Customer risk assessments
 * @param concentrationThreshold - Threshold for concern (e.g., 0.30 = 30%)
 * @returns Concentration risk analysis
 */
export function calculateConcentrationRisk(
  assessments: CompositeRiskAssessment[],
  concentrationThreshold: number = 0.3,
): {
  customerConcentration: { customerId: string; proportion: number }[];
  riskTierConcentration: { tier: RiskTier; proportion: number }[];
  concernAreas: string[];
} {
  const totalRisk = assessments.reduce((sum, a) => sum + a.overallRiskScore, 0);

  // Customer concentration
  const customerConcentration = assessments
    .map((a) => ({
      customerId: a.customerId,
      proportion: a.overallRiskScore / totalRisk,
    }))
    .filter((c) => c.proportion > concentrationThreshold)
    .sort((a, b) => b.proportion - a.proportion);

  // Risk tier concentration
  const tierCounts: Record<RiskTier, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  for (const assessment of assessments) {
    tierCounts[assessment.riskTier]++;
  }

  const riskTierConcentration: { tier: RiskTier; proportion: number }[] = [];
  for (const [tier, count] of Object.entries(tierCounts)) {
    const proportion = count / assessments.length;
    if (proportion > concentrationThreshold) {
      riskTierConcentration.push({
        tier: tier as RiskTier,
        proportion,
      });
    }
  }

  const concernAreas: string[] = [];
  if (customerConcentration.length > 0) {
    concernAreas.push(
      `Concentration risk: ${customerConcentration[0].customerId} represents ${(customerConcentration[0].proportion * 100).toFixed(1)}% of portfolio risk`,
    );
  }
  if (tierCounts.Critical > 0) {
    concernAreas.push(`Critical risk concentration: ${tierCounts.Critical} critical-tier customers`);
  }

  return {
    customerConcentration,
    riskTierConcentration,
    concernAreas,
  };
}

/**
 * Generate enterprise risk report
 * Comprehensive view of organizational AML risk
 * @param enterpriseView - Aggregated enterprise risk data
 * @param appetite - Risk appetite framework
 * @returns Formatted risk report
 */
export function generateEnterpriseRiskReport(
  enterpriseView: EnterpriseRiskView,
  appetite: RiskAppetite,
): {
  summary: string;
  keyMetrics: Record<string, string | number>;
  riskArea: string;
  recommendations: string[];
} {
  const { portfolioRiskScore, riskDistribution, complianceStatus } = enterpriseView;

  const withinAppetite = portfolioRiskScore <= appetite.maxAcceptableRiskScore;
  let riskArea = 'Low';
  if (portfolioRiskScore > 75) riskArea = 'Critical';
  else if (portfolioRiskScore > 50) riskArea = 'High';
  else if (portfolioRiskScore > 25) riskArea = 'Medium';

  const summary = `Enterprise portfolio consists of ${enterpriseView.totalCustomers} customers with an average risk score of ${portfolioRiskScore.toFixed(1)}.
Distribution: Low (${riskDistribution.Low}), Medium (${riskDistribution.Medium}), High (${riskDistribution.High}), Critical (${riskDistribution.Critical}).
Overall compliance status: ${complianceStatus}.`;

  return {
    summary,
    keyMetrics: {
      'Total Customers': enterpriseView.totalCustomers,
      'Portfolio Risk Score': portfolioRiskScore,
      'Risk Area': riskArea,
      'Low Tier Percentage': ((riskDistribution.Low / enterpriseView.totalCustomers) * 100).toFixed(1),
      'Critical Tier Count': riskDistribution.Critical,
      'Compliance Status': complianceStatus,
    },
    riskArea,
    recommendations: enterpriseView.recommendedActions,
  };
}

/**
 * Perform stress testing on risk portfolio
 * Evaluates portfolio resilience to scenario changes
 * @param assessments - Current customer assessments
 * @param scenario - Risk scenario (geographic escalation, recession, etc.)
 * @returns Stressed risk metrics
 */
export function performPortfolioStressTest(
  assessments: CompositeRiskAssessment[],
  scenario: 'Geographic Escalation' | 'Economic Downturn' | 'Regulatory Tightening' | 'Data Breach',
): {
  stressedPortfolioScore: RiskScore;
  affectedCustomers: number;
  recommendation: string;
} {
  let stressMultiplier = 1;
  let affectedPercentage = 0.5;

  switch (scenario) {
    case 'Geographic Escalation':
      stressMultiplier = 1.25;
      affectedPercentage = 0.4;
      break;
    case 'Economic Downturn':
      stressMultiplier = 1.15;
      affectedPercentage = 0.6;
      break;
    case 'Regulatory Tightening':
      stressMultiplier = 1.2;
      affectedPercentage = 0.8;
      break;
    case 'Data Breach':
      stressMultiplier = 1.3;
      affectedPercentage = 1.0;
      break;
  }

  const affectedCount = Math.ceil(assessments.length * affectedPercentage);
  const stressedRisks = assessments
    .slice(0, affectedCount)
    .map((a) => Math.min(a.overallRiskScore * stressMultiplier, 100));

  const avgStressedRisk =
    (stressedRisks.reduce((a, b) => a + b, 0) +
      assessments
        .slice(affectedCount)
        .reduce((sum, a) => sum + a.overallRiskScore, 0)) /
    assessments.length;

  let recommendation = 'Portfolio stress manageable with current controls';
  if (avgStressedRisk > 60) {
    recommendation = 'Stress scenario indicates significant risk; consider mitigation planning';
  } else if (avgStressedRisk > 50) {
    recommendation = 'Moderate stress impact; monitor and be prepared to enhance controls';
  }

  return {
    stressedPortfolioScore: createRiskScore(avgStressedRisk),
    affectedCustomers: affectedCount,
    recommendation,
  };
}

/**
 * Identify systemic risk factors
 * Finds correlated risk increases across portfolio
 * @param assessments - Customer assessments over time
 * @param timeWindow - Time period to analyze (days)
 * @returns Systemic risk analysis
 */
export function identifySystemicRiskFactors(
  assessments: Array<{
    date: Date;
    assessment: CompositeRiskAssessment;
  }>,
  timeWindow: number = 90,
): {
  systemicFactors: string[];
  correlationStrength: number;
  affectedCustomerProportion: number;
  alert: string;
} {
  if (assessments.length < 2) {
    return {
      systemicFactors: [],
      correlationStrength: 0,
      affectedCustomerProportion: 0,
      alert: 'Insufficient data for systemic risk analysis',
    };
  }

  const cutoffDate = new Date(Date.now() - timeWindow * 24 * 60 * 60 * 1000);
  const recentAssessments = assessments.filter((a) => a.date >= cutoffDate);

  let riskIncrease = 0;
  let affectedCount = 0;

  for (const assessment of recentAssessments) {
    if (assessment.assessment.overallRiskScore > 50) {
      riskIncrease += 1;
    }
  }

  affectedCount = recentAssessments.filter(
    (a) => a.assessment.overallRiskScore > 50,
  ).length;
  const affectedProportion = affectedCount / (recentAssessments.length || 1);
  const correlationStrength = Math.min(affectedProportion, 1);

  const systemicFactors: string[] = [];
  let alert = 'No systemic risk factors detected';

  if (affectedProportion > 0.7) {
    systemicFactors.push('Widespread risk elevation across portfolio');
    alert = 'Critical: Systemic risk elevation detected across >70% of customers';
  } else if (affectedProportion > 0.4) {
    systemicFactors.push('Significant risk elevation trend');
    alert = 'Warning: Significant risk elevation in 40-70% of customers';
  }

  return {
    systemicFactors,
    correlationStrength,
    affectedCustomerProportion: affectedProportion,
    alert,
  };
}
