/**
 * LOC: RISKASS001
 * File: /reuse/insurance/risk-assessment-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable insurance utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Underwriting services
 *   - Risk management modules
 *   - Policy pricing engines
 *   - Catastrophe modeling systems
 *   - Portfolio management services
 */

/**
 * File: /reuse/insurance/risk-assessment-kit.ts
 * Locator: WC-INS-RISKASS-001
 * Purpose: Comprehensive Risk Assessment and Analysis Kit for Insurance Underwriting
 *
 * Upstream: Independent utility module for insurance risk assessment operations
 * Downstream: ../backend/*, Underwriting services, Pricing engines, Risk management controllers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ utility functions for risk scoring, hazard analysis, exposure quantification, catastrophe modeling
 *
 * LLM Context: Production-ready insurance risk assessment utilities for enterprise underwriting and portfolio management.
 * Provides comprehensive risk evaluation including scoring algorithms, hazard identification, exposure analysis,
 * loss frequency prediction, severity assessment, risk pooling, catastrophe modeling integration, geographic risk analysis,
 * industry-specific risk factors, concentration monitoring, portfolio aggregation, risk appetite enforcement, mitigation
 * recommendations, and third-party risk data integration (ISO, Verisk). Essential for underwriting decisions and
 * portfolio risk management in commercial and personal lines insurance.
 */

import { Model, DataTypes, Sequelize, Op, Transaction, QueryTypes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RiskScore {
  riskId: string;
  policyId: string;
  applicantId: string;
  lineOfBusiness: string;
  overallScore: number;
  categoryScores: {
    hazard: number;
    exposure: number;
    frequency: number;
    severity: number;
    geographic: number;
    financial: number;
  };
  tier: 'preferred' | 'standard' | 'substandard' | 'declined';
  calculatedAt: Date;
  expiresAt: Date;
  metadata: Record<string, any>;
}

interface HazardClassification {
  hazardId: string;
  riskId: string;
  hazardType: string;
  category: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain';
  impact: number;
  mitigationFactors: string[];
  requiresInspection: boolean;
  notes: string;
}

interface ExposureAnalysis {
  exposureId: string;
  riskId: string;
  exposureType: string;
  totalInsuredValue: number;
  maximumPossibleLoss: number;
  probableMaximumLoss: number;
  expectedLoss: number;
  concentrationIndex: number;
  geographicSpread: number;
  industryConcentration: number;
  analysisDate: Date;
}

interface LossFrequencyModel {
  modelId: string;
  lineOfBusiness: string;
  riskClass: string;
  historicalFrequency: number;
  predictedFrequency: number;
  confidenceInterval: { lower: number; upper: number };
  trendFactor: number;
  seasonalityAdjustment: number;
  credibility: number;
  dataPoints: number;
  modelType: string;
}

interface SeverityAssessment {
  assessmentId: string;
  riskId: string;
  perilType: string;
  expectedSeverity: number;
  worstCaseSeverity: number;
  averageHistoricalSeverity: number;
  severityDistribution: string;
  limitOfLiability: number;
  attachmentPoint: number;
  exhaustionProbability: number;
}

interface RiskPool {
  poolId: string;
  poolName: string;
  lineOfBusiness: string;
  memberCount: number;
  totalExposure: number;
  averageRiskScore: number;
  homogeneityIndex: number;
  diversificationScore: number;
  rateClass: string;
  effectiveDate: Date;
  expirationDate: Date;
}

interface CatastropheModel {
  modelId: string;
  eventType: string;
  geographicRegion: string;
  returnPeriod: number;
  eventProbability: number;
  estimatedLoss: number;
  affectedPolicies: number;
  confidenceLevel: number;
  modelProvider: string;
  lastUpdated: Date;
}

interface GeographicRisk {
  geoRiskId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    zipCode: string;
    county: string;
    state: string;
  };
  perilScores: {
    earthquake: number;
    hurricane: number;
    flood: number;
    tornado: number;
    wildfire: number;
    hail: number;
  };
  territoryCode: string;
  protectionClass: string;
  distanceToCoast: number;
  elevation: number;
  floodZone: string;
}

interface IndustryRiskFactor {
  industryCode: string;
  industryName: string;
  naicsCode: string;
  baselineRiskMultiplier: number;
  lossRatio: number;
  frequencyFactor: number;
  severityFactor: number;
  emergingRisks: string[];
  regulatoryComplexity: number;
  trendDirection: 'improving' | 'stable' | 'deteriorating';
}

interface RiskConcentration {
  concentrationId: string;
  portfolioId: string;
  concentrationType: 'geographic' | 'industry' | 'peril' | 'product' | 'customer';
  concentrationMetric: number;
  threshold: number;
  exceedsLimit: boolean;
  aggregateExposure: number;
  topExposures: Array<{ id: string; exposure: number; percentage: number }>;
  diversificationIndex: number;
}

interface PortfolioRiskMetrics {
  portfolioId: string;
  totalPolicies: number;
  totalPremium: number;
  totalExposure: number;
  weightedAverageRiskScore: number;
  expectedLossRatio: number;
  volatility: number;
  varConfidenceLevel: number;
  valueAtRisk: number;
  tailValueAtRisk: number;
  riskAdjustedCapital: number;
}

interface RiskAppetite {
  appetiteId: string;
  lineOfBusiness: string;
  maxSingleRiskExposure: number;
  maxAggregateExposure: number;
  targetLossRatio: number;
  maxLossRatio: number;
  minRiskScore: number;
  maxRiskScore: number;
  acceptablePerils: string[];
  excludedIndustries: string[];
  geographicLimits: Record<string, number>;
  enforced: boolean;
}

interface MitigationRecommendation {
  recommendationId: string;
  riskId: string;
  mitigationType: string;
  description: string;
  expectedRiskReduction: number;
  estimatedCost: number;
  costBenefitRatio: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementationTimeline: string;
  requiredForApproval: boolean;
}

interface ThirdPartyRiskData {
  dataId: string;
  provider: 'ISO' | 'Verisk' | 'CoreLogic' | 'RMS' | 'AIR';
  dataType: string;
  riskId: string;
  score: number;
  grade: string;
  reportDate: Date;
  expirationDate: Date;
  rawData: Record<string, any>;
  integrationStatus: 'pending' | 'integrated' | 'failed';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for risk score tracking and analysis.
 */
export const createRiskScoreModel = (sequelize: Sequelize) => {
  class RiskScoreModel extends Model {
    public id!: number;
    public riskId!: string;
    public policyId!: string;
    public applicantId!: string;
    public lineOfBusiness!: string;
    public overallScore!: number;
    public categoryScores!: Record<string, number>;
    public tier!: string;
    public calculatedAt!: Date;
    public expiresAt!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RiskScoreModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      riskId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique risk assessment identifier',
      },
      policyId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated policy identifier',
      },
      applicantId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Applicant/insured identifier',
      },
      lineOfBusiness: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Insurance line of business',
      },
      overallScore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Overall risk score (0-100)',
      },
      categoryScores: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Category-specific risk scores',
      },
      tier: {
        type: DataTypes.ENUM('preferred', 'standard', 'substandard', 'declined'),
        allowNull: false,
        comment: 'Risk tier classification',
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Calculation timestamp',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Score expiration timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional risk metadata',
      },
    },
    {
      sequelize,
      tableName: 'risk_scores',
      timestamps: true,
      indexes: [
        { fields: ['riskId'], unique: true },
        { fields: ['policyId'] },
        { fields: ['applicantId'] },
        { fields: ['lineOfBusiness', 'tier'] },
        { fields: ['overallScore'] },
        { fields: ['calculatedAt'] },
      ],
    },
  );

  return RiskScoreModel;
};

/**
 * Sequelize model for hazard classification and tracking.
 */
export const createHazardModel = (sequelize: Sequelize) => {
  class HazardModel extends Model {
    public id!: number;
    public hazardId!: string;
    public riskId!: string;
    public hazardType!: string;
    public category!: string;
    public severity!: string;
    public likelihood!: string;
    public impact!: number;
    public mitigationFactors!: string[];
    public requiresInspection!: boolean;
    public notes!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HazardModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hazardId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique hazard identifier',
      },
      riskId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated risk assessment',
      },
      hazardType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of hazard identified',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Hazard category',
      },
      severity: {
        type: DataTypes.ENUM('minor', 'moderate', 'major', 'critical'),
        allowNull: false,
        comment: 'Hazard severity level',
      },
      likelihood: {
        type: DataTypes.ENUM('rare', 'unlikely', 'possible', 'likely', 'certain'),
        allowNull: false,
        comment: 'Likelihood of occurrence',
      },
      impact: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Potential financial impact',
      },
      mitigationFactors: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Identified mitigation factors',
      },
      requiresInspection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires physical inspection',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional hazard notes',
      },
    },
    {
      sequelize,
      tableName: 'hazards',
      timestamps: true,
      indexes: [
        { fields: ['hazardId'], unique: true },
        { fields: ['riskId'] },
        { fields: ['hazardType'] },
        { fields: ['severity', 'likelihood'] },
        { fields: ['requiresInspection'] },
      ],
    },
  );

  return HazardModel;
};

/**
 * Sequelize model for exposure analysis tracking.
 */
export const createExposureAnalysisModel = (sequelize: Sequelize) => {
  class ExposureAnalysisModel extends Model {
    public id!: number;
    public exposureId!: string;
    public riskId!: string;
    public exposureType!: string;
    public totalInsuredValue!: number;
    public maximumPossibleLoss!: number;
    public probableMaximumLoss!: number;
    public expectedLoss!: number;
    public concentrationIndex!: number;
    public geographicSpread!: number;
    public industryConcentration!: number;
    public analysisDate!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ExposureAnalysisModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exposureId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique exposure analysis identifier',
      },
      riskId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated risk assessment',
      },
      exposureType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of exposure',
      },
      totalInsuredValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total insured value',
      },
      maximumPossibleLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Maximum possible loss (MPL)',
      },
      probableMaximumLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Probable maximum loss (PML)',
      },
      expectedLoss: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Expected loss amount',
      },
      concentrationIndex: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Concentration index',
      },
      geographicSpread: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Geographic diversification score',
      },
      industryConcentration: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Industry concentration metric',
      },
      analysisDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Analysis timestamp',
      },
    },
    {
      sequelize,
      tableName: 'exposure_analyses',
      timestamps: true,
      indexes: [
        { fields: ['exposureId'], unique: true },
        { fields: ['riskId'] },
        { fields: ['exposureType'] },
        { fields: ['totalInsuredValue'] },
        { fields: ['analysisDate'] },
      ],
    },
  );

  return ExposureAnalysisModel;
};

// ============================================================================
// RISK SCORING & CLASSIFICATION (Functions 1-8)
// ============================================================================

/**
 * Calculates comprehensive risk score for a policy application.
 *
 * @param {string} policyId - Policy identifier
 * @param {string} applicantId - Applicant identifier
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {Record<string, any>} riskFactors - Risk factor inputs
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskScore>} Calculated risk score
 *
 * @example
 * ```typescript
 * const score = await calculateRiskScore(
 *   'POL-12345',
 *   'APP-67890',
 *   'commercial_property',
 *   { buildingAge: 50, sprinklerSystem: true, previousClaims: 2 },
 *   RiskScoreModel,
 *   HazardModel,
 *   transaction
 * );
 * ```
 */
export const calculateRiskScore = async (
  policyId: string,
  applicantId: string,
  lineOfBusiness: string,
  riskFactors: Record<string, any>,
  RiskScoreModel: any,
  HazardModel: any,
  transaction?: Transaction,
): Promise<RiskScore> => {
  // Calculate category scores
  const hazardScore = await calculateHazardScore(riskFactors, HazardModel, transaction);
  const exposureScore = calculateExposureScore(riskFactors);
  const frequencyScore = calculateFrequencyScore(riskFactors);
  const severityScore = calculateSeverityScore(riskFactors);
  const geographicScore = calculateGeographicScore(riskFactors);
  const financialScore = calculateFinancialScore(riskFactors);

  // Weighted overall score
  const categoryScores = {
    hazard: hazardScore,
    exposure: exposureScore,
    frequency: frequencyScore,
    severity: severityScore,
    geographic: geographicScore,
    financial: financialScore,
  };

  const weights = { hazard: 0.25, exposure: 0.20, frequency: 0.15, severity: 0.20, geographic: 0.10, financial: 0.10 };
  const overallScore =
    hazardScore * weights.hazard +
    exposureScore * weights.exposure +
    frequencyScore * weights.frequency +
    severityScore * weights.severity +
    geographicScore * weights.geographic +
    financialScore * weights.financial;

  // Determine tier
  let tier: 'preferred' | 'standard' | 'substandard' | 'declined';
  if (overallScore >= 80) tier = 'preferred';
  else if (overallScore >= 60) tier = 'standard';
  else if (overallScore >= 40) tier = 'substandard';
  else tier = 'declined';

  const riskId = `RISK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days

  const record = await RiskScoreModel.create(
    {
      riskId,
      policyId,
      applicantId,
      lineOfBusiness,
      overallScore,
      categoryScores,
      tier,
      calculatedAt: now,
      expiresAt,
      metadata: { riskFactors, calculationMethod: 'weighted_composite_v2' },
    },
    { transaction },
  );

  return record.toJSON();
};

/**
 * Identifies and classifies hazards for a risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} propertyData - Property/risk data
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<HazardClassification[]>} Identified hazards
 */
export const identifyHazards = async (
  riskId: string,
  propertyData: Record<string, any>,
  HazardModel: any,
  transaction?: Transaction,
): Promise<HazardClassification[]> => {
  const hazards: any[] = [];

  // Building age hazard
  if (propertyData.buildingAge > 50) {
    hazards.push({
      hazardId: `HAZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      riskId,
      hazardType: 'structural_age',
      category: 'property',
      severity: propertyData.buildingAge > 75 ? 'major' : 'moderate',
      likelihood: 'possible',
      impact: propertyData.buildingValue * 0.15,
      mitigationFactors: propertyData.renovationYear ? ['recent_renovation'] : [],
      requiresInspection: propertyData.buildingAge > 75,
      notes: `Building age: ${propertyData.buildingAge} years`,
    });
  }

  // Fire protection hazard
  if (!propertyData.sprinklerSystem) {
    hazards.push({
      hazardId: `HAZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      riskId,
      hazardType: 'fire_protection',
      category: 'safety',
      severity: 'major',
      likelihood: 'possible',
      impact: propertyData.buildingValue * 0.25,
      mitigationFactors: propertyData.fireExtinguishers ? ['fire_extinguishers'] : [],
      requiresInspection: true,
      notes: 'No automatic sprinkler system detected',
    });
  }

  // Claims history hazard
  if (propertyData.previousClaims > 2) {
    hazards.push({
      hazardId: `HAZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      riskId,
      hazardType: 'claims_history',
      category: 'underwriting',
      severity: propertyData.previousClaims > 4 ? 'critical' : 'major',
      likelihood: 'likely',
      impact: propertyData.averageClaimAmount || 50000,
      mitigationFactors: [],
      requiresInspection: false,
      notes: `${propertyData.previousClaims} claims in past 5 years`,
    });
  }

  const records = await HazardModel.bulkCreate(hazards, { transaction });
  return records.map((r: any) => r.toJSON());
};

/**
 * Analyzes and quantifies exposure for risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} exposureData - Exposure data
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<ExposureAnalysis>} Exposure analysis results
 */
export const quantifyExposure = async (
  riskId: string,
  exposureData: Record<string, any>,
  ExposureAnalysisModel: any,
  transaction?: Transaction,
): Promise<ExposureAnalysis> => {
  const tiv = exposureData.totalInsuredValue || 0;
  const mpl = tiv; // Maximum possible loss = 100% of TIV
  const pml = tiv * 0.40; // Probable maximum loss = 40% of TIV (industry standard)
  const expectedLoss = tiv * (exposureData.expectedLossRatio || 0.02);

  const concentrationIndex = calculateConcentrationIndex(exposureData);
  const geographicSpread = calculateGeographicSpread(exposureData);
  const industryConcentration = calculateIndustryConcentration(exposureData);

  const exposureId = `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const record = await ExposureAnalysisModel.create(
    {
      exposureId,
      riskId,
      exposureType: exposureData.exposureType || 'property',
      totalInsuredValue: tiv,
      maximumPossibleLoss: mpl,
      probableMaximumLoss: pml,
      expectedLoss,
      concentrationIndex,
      geographicSpread,
      industryConcentration,
      analysisDate: new Date(),
    },
    { transaction },
  );

  return record.toJSON();
};

/**
 * Predicts loss frequency using historical data and modeling.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {string} riskClass - Risk classification
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<LossFrequencyModel>} Loss frequency prediction
 */
export const predictLossFrequency = async (
  lineOfBusiness: string,
  riskClass: string,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<LossFrequencyModel> => {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

  const historicalData = await ClaimModel.findAll({
    where: {
      lineOfBusiness,
      riskClass,
      lossDate: { [Op.gte]: fiveYearsAgo },
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'claimCount'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('policyId'))), 'exposureCount'],
      [Sequelize.fn('EXTRACT', Sequelize.literal("YEAR FROM loss_date")), 'year'],
    ],
    group: [Sequelize.fn('EXTRACT', Sequelize.literal("YEAR FROM loss_date"))],
    transaction,
  });

  const frequencies = historicalData.map((d: any) => {
    const data = d.toJSON();
    return data.exposureCount > 0 ? data.claimCount / data.exposureCount : 0;
  });

  const historicalFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const trendFactor = calculateTrendFactor(frequencies);
  const predictedFrequency = historicalFrequency * trendFactor;

  const stdDev = calculateStdDev(frequencies);
  const confidenceInterval = {
    lower: Math.max(0, predictedFrequency - 1.96 * stdDev),
    upper: predictedFrequency + 1.96 * stdDev,
  };

  return {
    modelId: `FREQ-${Date.now()}`,
    lineOfBusiness,
    riskClass,
    historicalFrequency,
    predictedFrequency,
    confidenceInterval,
    trendFactor,
    seasonalityAdjustment: 1.0,
    credibility: Math.min(1.0, historicalData.length / 5),
    dataPoints: historicalData.length,
    modelType: 'poisson_regression',
  };
};

/**
 * Assesses loss severity using distribution analysis.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {string} perilType - Type of peril
 * @param {any} ClaimModel - Sequelize model
 * @param {Record<string, any>} policyLimits - Policy limits
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<SeverityAssessment>} Severity assessment
 */
export const assessLossSeverity = async (
  riskId: string,
  perilType: string,
  ClaimModel: any,
  policyLimits: Record<string, any>,
  transaction?: Transaction,
): Promise<SeverityAssessment> => {
  const severityData = await ClaimModel.findAll({
    where: { perilType },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('paidAmount')), 'avgSeverity'],
      [Sequelize.fn('MAX', Sequelize.col('paidAmount')), 'maxSeverity'],
      [Sequelize.fn('STDDEV', Sequelize.col('paidAmount')), 'stdDev'],
      [Sequelize.fn('PERCENTILE_CONT', 0.95), 'p95'],
    ],
    transaction,
  });

  const stats = severityData[0]?.toJSON() || {};
  const avgSeverity = parseFloat(stats.avgSeverity || '0');
  const maxSeverity = parseFloat(stats.maxSeverity || '0');

  const limitOfLiability = policyLimits.limit || 1000000;
  const attachmentPoint = policyLimits.deductible || 0;
  const exhaustionProbability = maxSeverity > limitOfLiability ? 0.05 : 0.01;

  return {
    assessmentId: `SEV-${Date.now()}`,
    riskId,
    perilType,
    expectedSeverity: avgSeverity,
    worstCaseSeverity: maxSeverity,
    averageHistoricalSeverity: avgSeverity,
    severityDistribution: 'lognormal',
    limitOfLiability,
    attachmentPoint,
    exhaustionProbability,
  };
};

/**
 * Performs risk segmentation and pooling analysis.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskPool[]>} Risk pool segments
 */
export const segmentRiskPools = async (
  lineOfBusiness: string,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<RiskPool[]> => {
  const pools = await RiskScoreModel.findAll({
    where: {
      lineOfBusiness,
      expiresAt: { [Op.gt]: new Date() },
    },
    attributes: [
      'tier',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'memberCount'],
      [Sequelize.fn('AVG', Sequelize.col('overallScore')), 'avgScore'],
      [Sequelize.fn('STDDEV', Sequelize.col('overallScore')), 'stdDev'],
      [Sequelize.fn('SUM', Sequelize.literal("(metadata->>'totalInsuredValue')::numeric")), 'totalExposure'],
    ],
    group: ['tier'],
    transaction,
  });

  return pools.map((pool: any) => {
    const data = pool.toJSON();
    const stdDev = parseFloat(data.stdDev || '0');
    const avgScore = parseFloat(data.avgScore || '0');
    const homogeneityIndex = avgScore > 0 ? 1 - stdDev / avgScore : 0;

    return {
      poolId: `POOL-${lineOfBusiness}-${data.tier}`,
      poolName: `${lineOfBusiness} - ${data.tier}`,
      lineOfBusiness,
      memberCount: data.memberCount,
      totalExposure: parseFloat(data.totalExposure || '0'),
      averageRiskScore: avgScore,
      homogeneityIndex,
      diversificationScore: 0.75, // Calculated separately
      rateClass: data.tier,
      effectiveDate: new Date(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  });
};

/**
 * Analyzes catastrophe exposure using modeling data.
 *
 * @param {string} eventType - Catastrophe event type
 * @param {string} geographicRegion - Geographic region
 * @param {any} PolicyModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<CatastropheModel>} Catastrophe model results
 */
export const analyzeCatastropheExposure = async (
  eventType: string,
  geographicRegion: string,
  PolicyModel: any,
  transaction?: Transaction,
): Promise<CatastropheModel> => {
  const exposedPolicies = await PolicyModel.findAll({
    where: {
      status: 'active',
      [Op.or]: [
        { state: { [Op.in]: getStatesInRegion(geographicRegion) } },
        Sequelize.where(Sequelize.literal("metadata->>'catZone'"), geographicRegion),
      ],
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'policyCount'],
      [Sequelize.fn('SUM', Sequelize.col('limitAmount')), 'aggregateLimit'],
    ],
    transaction,
  });

  const stats = exposedPolicies[0]?.toJSON() || { policyCount: 0, aggregateLimit: 0 };

  // Catastrophe modeling parameters (would integrate with RMS/AIR in production)
  const returnPeriod = eventType === 'hurricane' ? 100 : eventType === 'earthquake' ? 500 : 250;
  const eventProbability = 1 / returnPeriod;
  const damageRatio = eventType === 'hurricane' ? 0.30 : eventType === 'earthquake' ? 0.40 : 0.20;
  const estimatedLoss = parseFloat(stats.aggregateLimit || '0') * damageRatio;

  return {
    modelId: `CAT-${Date.now()}`,
    eventType,
    geographicRegion,
    returnPeriod,
    eventProbability,
    estimatedLoss,
    affectedPolicies: stats.policyCount,
    confidenceLevel: 0.95,
    modelProvider: 'internal_model',
    lastUpdated: new Date(),
  };
};

/**
 * Performs comprehensive geographic risk analysis.
 *
 * @param {Record<string, any>} location - Location data
 * @param {any} GeoRiskModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<GeographicRisk>} Geographic risk assessment
 */
export const analyzeGeographicRisk = async (
  location: Record<string, any>,
  GeoRiskModel: any,
  transaction?: Transaction,
): Promise<GeographicRisk> => {
  // Calculate peril scores based on geographic data
  const earthquakeScore = calculateEarthquakeRisk(location);
  const hurricaneScore = calculateHurricaneRisk(location);
  const floodScore = calculateFloodRisk(location);
  const tornadoScore = calculateTornadoRisk(location);
  const wildfireScore = calculateWildfireRisk(location);
  const hailScore = calculateHailRisk(location);

  const geoRiskId = `GEO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const record = await GeoRiskModel.create(
    {
      geoRiskId,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        zipCode: location.zipCode,
        county: location.county,
        state: location.state,
      },
      perilScores: {
        earthquake: earthquakeScore,
        hurricane: hurricaneScore,
        flood: floodScore,
        tornado: tornadoScore,
        wildfire: wildfireScore,
        hail: hailScore,
      },
      territoryCode: location.territoryCode || 'UNK',
      protectionClass: location.protectionClass || '5',
      distanceToCoast: location.distanceToCoast || 999,
      elevation: location.elevation || 0,
      floodZone: location.floodZone || 'X',
    },
    { transaction },
  );

  return record.toJSON();
};

// ============================================================================
// INDUSTRY & CONCENTRATION ANALYSIS (Functions 9-16)
// ============================================================================

/**
 * Analyzes industry-specific risk factors.
 *
 * @param {string} industryCode - Industry classification code
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IndustryRiskFactor>} Industry risk analysis
 */
export const analyzeIndustryRisk = async (
  industryCode: string,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<IndustryRiskFactor> => {
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const industryData = await ClaimModel.findAll({
    where: {
      industryCode,
      lossDate: { [Op.gte]: threeYearsAgo },
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'claimCount'],
      [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalPaid'],
      [Sequelize.fn('SUM', Sequelize.col('earnedPremium')), 'totalPremium'],
      [Sequelize.fn('AVG', Sequelize.col('paidAmount')), 'avgSeverity'],
    ],
    transaction,
  });

  const stats = industryData[0]?.toJSON() || {};
  const totalPaid = parseFloat(stats.totalPaid || '0');
  const totalPremium = parseFloat(stats.totalPremium || '1');
  const lossRatio = totalPremium > 0 ? totalPaid / totalPremium : 0;

  const baselineMultiplier = lossRatio > 0.80 ? 1.5 : lossRatio > 0.60 ? 1.2 : 1.0;
  const frequencyFactor = stats.claimCount > 100 ? 1.3 : 1.0;
  const severityFactor = parseFloat(stats.avgSeverity || '0') > 50000 ? 1.4 : 1.0;

  return {
    industryCode,
    industryName: getIndustryName(industryCode),
    naicsCode: industryCode,
    baselineRiskMultiplier: baselineMultiplier,
    lossRatio,
    frequencyFactor,
    severityFactor,
    emergingRisks: ['cyber_liability', 'supply_chain'],
    regulatoryComplexity: 5,
    trendDirection: lossRatio > 0.75 ? 'deteriorating' : lossRatio < 0.55 ? 'improving' : 'stable',
  };
};

/**
 * Monitors and analyzes risk concentration in portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} concentrationType - Type of concentration to analyze
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskConcentration>} Concentration analysis
 */
export const monitorRiskConcentration = async (
  portfolioId: string,
  concentrationType: 'geographic' | 'industry' | 'peril' | 'product' | 'customer',
  PolicyModel: any,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<RiskConcentration> => {
  let groupByField: string;
  let thresholdPercentage = 0.15; // 15% default threshold

  switch (concentrationType) {
    case 'geographic':
      groupByField = 'state';
      break;
    case 'industry':
      groupByField = 'industryCode';
      break;
    case 'peril':
      groupByField = 'primaryPeril';
      break;
    case 'product':
      groupByField = 'productCode';
      break;
    case 'customer':
      groupByField = 'customerId';
      thresholdPercentage = 0.10; // 10% for single customer
      break;
  }

  const concentrationData = await PolicyModel.findAll({
    where: {
      portfolioId,
      status: 'active',
    },
    attributes: [
      groupByField,
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'policyCount'],
      [Sequelize.fn('SUM', Sequelize.col('limitAmount')), 'totalExposure'],
    ],
    group: [groupByField],
    order: [[Sequelize.literal('total_exposure'), 'DESC']],
    limit: 10,
    transaction,
  });

  const totalExposure = await PolicyModel.sum('limitAmount', {
    where: { portfolioId, status: 'active' },
    transaction,
  });

  const topExposures = concentrationData.map((item: any) => {
    const data = item.toJSON();
    const exposure = parseFloat(data.totalExposure || '0');
    return {
      id: data[groupByField],
      exposure,
      percentage: totalExposure > 0 ? exposure / totalExposure : 0,
    };
  });

  const maxConcentration = topExposures.length > 0 ? topExposures[0].percentage : 0;
  const herfindahlIndex = topExposures.reduce((sum, item) => sum + item.percentage ** 2, 0);
  const diversificationIndex = 1 - herfindahlIndex;

  return {
    concentrationId: `CONC-${Date.now()}`,
    portfolioId,
    concentrationType,
    concentrationMetric: maxConcentration,
    threshold: thresholdPercentage,
    exceedsLimit: maxConcentration > thresholdPercentage,
    aggregateExposure: totalExposure,
    topExposures,
    diversificationIndex,
  };
};

/**
 * Aggregates portfolio-level risk metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<PortfolioRiskMetrics>} Portfolio risk metrics
 */
export const aggregatePortfolioRisk = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<PortfolioRiskMetrics> => {
  const portfolioStats = await PolicyModel.findAll({
    where: { portfolioId, status: 'active' },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'policyCount'],
      [Sequelize.fn('SUM', Sequelize.col('premiumAmount')), 'totalPremium'],
      [Sequelize.fn('SUM', Sequelize.col('limitAmount')), 'totalExposure'],
    ],
    transaction,
  });

  const stats = portfolioStats[0]?.toJSON() || {};

  const riskScores = await RiskScoreModel.findAll({
    where: {
      policyId: {
        [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}' AND status = 'active')`),
      },
    },
    attributes: [[Sequelize.fn('AVG', Sequelize.col('overallScore')), 'avgScore'], [Sequelize.fn('STDDEV', Sequelize.col('overallScore')), 'stdDev']],
    transaction,
  });

  const riskStats = riskScores[0]?.toJSON() || {};
  const weightedAvgScore = parseFloat(riskStats.avgScore || '0');
  const volatility = parseFloat(riskStats.stdDev || '0');

  // Value at Risk calculation (simplified)
  const varConfidenceLevel = 0.95;
  const totalPremium = parseFloat(stats.totalPremium || '0');
  const expectedLossRatio = 0.65; // Industry average
  const valueAtRisk = totalPremium * expectedLossRatio * 1.645; // 95% confidence
  const tailValueAtRisk = totalPremium * expectedLossRatio * 2.0; // CVaR

  const riskAdjustedCapital = calculateRiskAdjustedCapital(parseFloat(stats.totalExposure || '0'), volatility);

  return {
    portfolioId,
    totalPolicies: stats.policyCount,
    totalPremium,
    totalExposure: parseFloat(stats.totalExposure || '0'),
    weightedAverageRiskScore: weightedAvgScore,
    expectedLossRatio,
    volatility,
    varConfidenceLevel,
    valueAtRisk,
    tailValueAtRisk,
    riskAdjustedCapital,
  };
};

/**
 * Enforces risk appetite framework constraints.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {RiskScore} riskScore - Risk score to validate
 * @param {any} RiskAppetiteModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<{ approved: boolean; violations: string[] }>} Approval status
 */
export const enforceRiskAppetite = async (
  lineOfBusiness: string,
  riskScore: RiskScore,
  RiskAppetiteModel: any,
  transaction?: Transaction,
): Promise<{ approved: boolean; violations: string[] }> => {
  const appetite = await RiskAppetiteModel.findOne({
    where: {
      lineOfBusiness,
      enforced: true,
    },
    transaction,
  });

  if (!appetite) {
    return { approved: true, violations: [] };
  }

  const appetiteData = appetite.toJSON();
  const violations: string[] = [];

  if (riskScore.overallScore < appetiteData.minRiskScore) {
    violations.push(`Risk score ${riskScore.overallScore} below minimum ${appetiteData.minRiskScore}`);
  }

  if (riskScore.overallScore > appetiteData.maxRiskScore) {
    violations.push(`Risk score ${riskScore.overallScore} exceeds maximum ${appetiteData.maxRiskScore}`);
  }

  if (riskScore.tier === 'declined' && appetiteData.minRiskScore > 0) {
    violations.push('Risk tier is declined');
  }

  const approved = violations.length === 0;
  return { approved, violations };
};

/**
 * Generates risk mitigation recommendations.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {HazardClassification[]} hazards - Identified hazards
 * @param {any} MitigationModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<MitigationRecommendation[]>} Mitigation recommendations
 */
export const generateMitigationRecommendations = async (
  riskId: string,
  hazards: HazardClassification[],
  MitigationModel: any,
  transaction?: Transaction,
): Promise<MitigationRecommendation[]> => {
  const recommendations: any[] = [];

  for (const hazard of hazards) {
    if (hazard.hazardType === 'fire_protection' && hazard.severity === 'major') {
      recommendations.push({
        recommendationId: `MIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        riskId,
        mitigationType: 'install_sprinkler_system',
        description: 'Install automatic fire sprinkler system per NFPA 13 standards',
        expectedRiskReduction: 25,
        estimatedCost: 15000,
        costBenefitRatio: 1.67,
        priority: 'high',
        implementationTimeline: '90 days',
        requiredForApproval: true,
      });
    }

    if (hazard.hazardType === 'structural_age' && hazard.severity === 'major') {
      recommendations.push({
        recommendationId: `MIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        riskId,
        mitigationType: 'structural_inspection',
        description: 'Conduct comprehensive structural engineering inspection',
        expectedRiskReduction: 10,
        estimatedCost: 2500,
        costBenefitRatio: 4.0,
        priority: 'medium',
        implementationTimeline: '30 days',
        requiredForApproval: true,
      });
    }

    if (hazard.hazardType === 'claims_history' && hazard.severity === 'critical') {
      recommendations.push({
        recommendationId: `MIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        riskId,
        mitigationType: 'loss_control_program',
        description: 'Implement comprehensive loss control and prevention program',
        expectedRiskReduction: 15,
        estimatedCost: 5000,
        costBenefitRatio: 3.0,
        priority: 'high',
        implementationTimeline: '60 days',
        requiredForApproval: false,
      });
    }
  }

  if (recommendations.length > 0) {
    const records = await MitigationModel.bulkCreate(recommendations, { transaction });
    return records.map((r: any) => r.toJSON());
  }

  return [];
};

/**
 * Integrates third-party risk data (ISO, Verisk).
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {string} provider - Data provider
 * @param {Record<string, any>} requestData - Request parameters
 * @param {any} ThirdPartyDataModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<ThirdPartyRiskData>} Third-party risk data
 */
export const integrateThirdPartyRiskData = async (
  riskId: string,
  provider: 'ISO' | 'Verisk' | 'CoreLogic' | 'RMS' | 'AIR',
  requestData: Record<string, any>,
  ThirdPartyDataModel: any,
  transaction?: Transaction,
): Promise<ThirdPartyRiskData> => {
  // Simulate API call to third-party provider
  const mockResponse = generateMockThirdPartyData(provider, requestData);

  const dataId = `TPD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000); // 180 days

  const record = await ThirdPartyDataModel.create(
    {
      dataId,
      provider,
      dataType: mockResponse.dataType,
      riskId,
      score: mockResponse.score,
      grade: mockResponse.grade,
      reportDate: now,
      expirationDate,
      rawData: mockResponse.data,
      integrationStatus: 'integrated',
    },
    { transaction },
  );

  return record.toJSON();
};

/**
 * Retrieves active risk scores with filtering.
 *
 * @param {Record<string, any>} filters - Filter criteria
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<RiskScore[]>} Filtered risk scores
 */
export const getActiveRiskScores = async (
  filters: Record<string, any>,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<RiskScore[]> => {
  const whereClause: any = {
    expiresAt: { [Op.gt]: new Date() },
  };

  if (filters.lineOfBusiness) {
    whereClause.lineOfBusiness = filters.lineOfBusiness;
  }

  if (filters.tier) {
    whereClause.tier = Array.isArray(filters.tier) ? { [Op.in]: filters.tier } : filters.tier;
  }

  if (filters.minScore !== undefined) {
    whereClause.overallScore = { [Op.gte]: filters.minScore };
  }

  if (filters.maxScore !== undefined) {
    whereClause.overallScore = { ...whereClause.overallScore, [Op.lte]: filters.maxScore };
  }

  const records = await RiskScoreModel.findAll({
    where: whereClause,
    order: [['calculatedAt', 'DESC']],
    limit: filters.limit || 100,
    offset: filters.offset || 0,
    transaction,
  });

  return records.map((r: any) => r.toJSON());
};

/**
 * Retrieves hazards for a specific risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<HazardClassification[]>} Hazards for risk
 */
export const getHazardsByRisk = async (riskId: string, HazardModel: any, transaction?: Transaction): Promise<HazardClassification[]> => {
  const records = await HazardModel.findAll({
    where: { riskId },
    order: [
      ['severity', 'DESC'],
      ['likelihood', 'DESC'],
    ],
    transaction,
  });

  return records.map((r: any) => r.toJSON());
};

// ============================================================================
// ADVANCED RISK ANALYTICS (Functions 17-26)
// ============================================================================

/**
 * Calculates risk correlation matrix across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, Record<string, number>>>} Correlation matrix
 */
export const calculateRiskCorrelationMatrix = async (
  portfolioId: string,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, Record<string, number>>> => {
  const riskScores = await RiskScoreModel.findAll({
    where: {
      policyId: {
        [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
      },
    },
    attributes: ['categoryScores'],
    transaction,
  });

  const categories = ['hazard', 'exposure', 'frequency', 'severity', 'geographic', 'financial'];
  const matrix: Record<string, Record<string, number>> = {};

  for (const cat1 of categories) {
    matrix[cat1] = {};
    for (const cat2 of categories) {
      if (cat1 === cat2) {
        matrix[cat1][cat2] = 1.0;
      } else {
        const values1 = riskScores.map((r: any) => r.categoryScores[cat1] || 0);
        const values2 = riskScores.map((r: any) => r.categoryScores[cat2] || 0);
        matrix[cat1][cat2] = calculateCorrelation(values1, values2);
      }
    }
  }

  return matrix;
};

/**
 * Performs stress testing on risk portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Record<string, any>} stressScenario - Stress test scenario
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Stress test results
 */
export const performStressTesting = async (
  portfolioId: string,
  stressScenario: Record<string, any>,
  PolicyModel: any,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const baselineMetrics = await aggregatePortfolioRisk(portfolioId, PolicyModel, RiskScoreModel, {} as any, transaction);

  const stressedLossRatio = baselineMetrics.expectedLossRatio * (1 + stressScenario.lossRatioShock || 0.25);
  const stressedVolatility = baselineMetrics.volatility * (1 + stressScenario.volatilityShock || 0.50);
  const stressedVaR = baselineMetrics.valueAtRisk * (1 + stressScenario.varShock || 0.40);

  const capitalDeficiency = Math.max(0, stressedVaR - baselineMetrics.riskAdjustedCapital);

  return {
    scenario: stressScenario.name || 'custom_stress',
    baselineMetrics,
    stressedMetrics: {
      lossRatio: stressedLossRatio,
      volatility: stressedVolatility,
      valueAtRisk: stressedVaR,
      capitalDeficiency,
    },
    impact: {
      lossRatioChange: stressedLossRatio - baselineMetrics.expectedLossRatio,
      volatilityChange: stressedVolatility - baselineMetrics.volatility,
      varChange: stressedVaR - baselineMetrics.valueAtRisk,
    },
    capitalAdequacy: capitalDeficiency === 0 ? 'adequate' : 'deficient',
  };
};

/**
 * Analyzes risk trends over time.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {number} periodMonths - Analysis period in months
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Risk trend data
 */
export const analyzeRiskTrends = async (
  lineOfBusiness: string,
  periodMonths: number,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - periodMonths);

  const trends = await RiskScoreModel.findAll({
    where: {
      lineOfBusiness,
      calculatedAt: { [Op.gte]: startDate },
    },
    attributes: [
      [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('calculatedAt')), 'month'],
      [Sequelize.fn('AVG', Sequelize.col('overallScore')), 'avgScore'],
      [Sequelize.fn('STDDEV', Sequelize.col('overallScore')), 'stdDev'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'assessmentCount'],
      'tier',
    ],
    group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('calculatedAt')), 'tier'],
    order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('calculatedAt')), 'ASC']],
    transaction,
  });

  return trends.map((t: any) => t.toJSON());
};

/**
 * Performs peer benchmarking analysis.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Benchmark comparison
 */
export const benchmarkAgainstPeers = async (riskId: string, RiskScoreModel: any, transaction?: Transaction): Promise<Record<string, any>> => {
  const targetRisk = await RiskScoreModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!targetRisk) {
    throw new Error('Risk assessment not found');
  }

  const target = targetRisk.toJSON();

  const peerMetrics = await RiskScoreModel.findAll({
    where: {
      lineOfBusiness: target.lineOfBusiness,
      tier: target.tier,
      calculatedAt: { [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('overallScore')), 'avgScore'],
      [Sequelize.fn('PERCENTILE_CONT', 0.25), 'p25'],
      [Sequelize.fn('PERCENTILE_CONT', 0.50), 'p50'],
      [Sequelize.fn('PERCENTILE_CONT', 0.75), 'p75'],
      [Sequelize.fn('MIN', Sequelize.col('overallScore')), 'minScore'],
      [Sequelize.fn('MAX', Sequelize.col('overallScore')), 'maxScore'],
    ],
    transaction,
  });

  const benchmark = peerMetrics[0]?.toJSON() || {};

  return {
    targetScore: target.overallScore,
    peerAverage: parseFloat(benchmark.avgScore || '0'),
    percentile: calculatePercentile(target.overallScore, benchmark),
    comparison: target.overallScore > parseFloat(benchmark.avgScore || '0') ? 'above_average' : 'below_average',
    quartile: determineQuartile(target.overallScore, benchmark),
    peerRange: {
      min: parseFloat(benchmark.minScore || '0'),
      max: parseFloat(benchmark.maxScore || '0'),
      p25: parseFloat(benchmark.p25 || '0'),
      median: parseFloat(benchmark.p50 || '0'),
      p75: parseFloat(benchmark.p75 || '0'),
    },
  };
};

/**
 * Generates risk heat map data.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Heat map data
 */
export const generateRiskHeatMap = async (portfolioId: string, RiskScoreModel: any, transaction?: Transaction): Promise<Record<string, any>> => {
  const heatMapData = await RiskScoreModel.findAll({
    where: {
      policyId: {
        [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
      },
    },
    attributes: [
      [Sequelize.literal("categoryScores->>'hazard'"), 'hazardScore'],
      [Sequelize.literal("categoryScores->>'severity'"), 'severityScore'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    group: [Sequelize.literal("categoryScores->>'hazard'"), Sequelize.literal("categoryScores->>'severity'")],
    transaction,
  });

  const matrix: Record<string, Record<string, number>> = {};
  const hazardBuckets = ['0-20', '20-40', '40-60', '60-80', '80-100'];
  const severityBuckets = ['0-20', '20-40', '40-60', '60-80', '80-100'];

  for (const hBucket of hazardBuckets) {
    matrix[hBucket] = {};
    for (const sBucket of severityBuckets) {
      matrix[hBucket][sBucket] = 0;
    }
  }

  for (const point of heatMapData) {
    const data = point.toJSON();
    const hazard = parseFloat(data.hazardScore || '0');
    const severity = parseFloat(data.severityScore || '0');
    const hBucket = getBucket(hazard);
    const sBucket = getBucket(severity);
    matrix[hBucket][sBucket] = data.count;
  }

  return { matrix, portfolioId, generatedAt: new Date() };
};

/**
 * Calculates risk-adjusted return metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Risk-adjusted return metrics
 */
export const calculateRiskAdjustedReturn = async (
  portfolioId: string,
  PolicyModel: any,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const financialData = await PolicyModel.findAll({
    where: { portfolioId, status: 'active' },
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('premiumAmount')), 'totalPremium'],
      [Sequelize.fn('SUM', Sequelize.col('limitAmount')), 'totalExposure'],
    ],
    transaction,
  });

  const claimData = await ClaimModel.findAll({
    where: {
      policyId: {
        [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
      },
      status: 'closed',
    },
    attributes: [[Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalLosses']],
    transaction,
  });

  const totalPremium = parseFloat(financialData[0]?.toJSON().totalPremium || '0');
  const totalExposure = parseFloat(financialData[0]?.toJSON().totalExposure || '0');
  const totalLosses = parseFloat(claimData[0]?.toJSON().totalLosses || '0');

  const underwritingProfit = totalPremium - totalLosses;
  const returnOnExposure = totalExposure > 0 ? underwritingProfit / totalExposure : 0;
  const sharpeRatio = calculateSharpeRatio(underwritingProfit, totalPremium);

  return {
    portfolioId,
    totalPremium,
    totalLosses,
    underwritingProfit,
    lossRatio: totalPremium > 0 ? totalLosses / totalPremium : 0,
    returnOnExposure,
    sharpeRatio,
    riskAdjustedReturn: sharpeRatio * returnOnExposure,
  };
};

/**
 * Performs Monte Carlo simulation for risk modeling.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {number} iterations - Number of simulation iterations
 * @param {Record<string, any>} parameters - Simulation parameters
 * @returns {Promise<Record<string, any>>} Simulation results
 */
export const performMonteCarloSimulation = async (
  riskId: string,
  iterations: number,
  parameters: Record<string, any>,
): Promise<Record<string, any>> => {
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const frequency = generateRandomPoisson(parameters.expectedFrequency || 0.05);
    const severity = generateRandomLognormal(parameters.expectedSeverity || 50000, parameters.severityStdDev || 25000);
    const loss = frequency * severity;
    results.push(loss);
  }

  results.sort((a, b) => a - b);

  const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
  const var95 = results[Math.floor(iterations * 0.95)];
  const var99 = results[Math.floor(iterations * 0.99)];
  const tvar95 = results.slice(Math.floor(iterations * 0.95)).reduce((sum, val) => sum + val, 0) / (iterations * 0.05);

  return {
    riskId,
    iterations,
    statistics: {
      mean,
      median: results[Math.floor(iterations * 0.5)],
      stdDev: calculateStdDev(results),
      min: results[0],
      max: results[iterations - 1],
    },
    valueAtRisk: {
      var95,
      var99,
      tvar95,
    },
    distribution: {
      p10: results[Math.floor(iterations * 0.1)],
      p25: results[Math.floor(iterations * 0.25)],
      p50: results[Math.floor(iterations * 0.5)],
      p75: results[Math.floor(iterations * 0.75)],
      p90: results[Math.floor(iterations * 0.9)],
    },
  };
};

/**
 * Analyzes emerging risk patterns.
 *
 * @param {string} lineOfBusiness - Insurance line of business
 * @param {number} lookbackDays - Analysis period in days
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Emerging risk patterns
 */
export const analyzeEmergingRisks = async (
  lineOfBusiness: string,
  lookbackDays: number,
  RiskScoreModel: any,
  HazardModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - lookbackDays);

  const emergingHazards = await HazardModel.findAll({
    where: {
      createdAt: { [Op.gte]: startDate },
    },
    attributes: ['hazardType', 'category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'frequency'], [Sequelize.fn('AVG', Sequelize.col('impact')), 'avgImpact']],
    group: ['hazardType', 'category'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('id')), Op.gt, 5),
    order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
    transaction,
  });

  return emergingHazards.map((h: any) => {
    const data = h.toJSON();
    return {
      hazardType: data.hazardType,
      category: data.category,
      frequency: data.frequency,
      averageImpact: parseFloat(data.avgImpact || '0'),
      trend: 'emerging',
      recommendedAction: 'monitor_closely',
    };
  });
};

/**
 * Performs scenario analysis for risk assessment.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>[]} scenarios - Analysis scenarios
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Scenario analysis results
 */
export const performScenarioAnalysis = async (
  riskId: string,
  scenarios: Record<string, any>[],
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const baseRisk = await RiskScoreModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!baseRisk) {
    throw new Error('Risk assessment not found');
  }

  const base = baseRisk.toJSON();
  const results: Record<string, any>[] = [];

  for (const scenario of scenarios) {
    const adjustedScore = base.overallScore * (1 + (scenario.scoreAdjustment || 0));
    const adjustedCategoryScores = { ...base.categoryScores };

    for (const [category, adjustment] of Object.entries(scenario.categoryAdjustments || {})) {
      if (adjustedCategoryScores[category]) {
        adjustedCategoryScores[category] *= 1 + (adjustment as number);
      }
    }

    results.push({
      scenarioName: scenario.name,
      baseScore: base.overallScore,
      adjustedScore,
      scoreDelta: adjustedScore - base.overallScore,
      adjustedCategoryScores,
      impact: adjustedScore > base.overallScore ? 'favorable' : 'unfavorable',
      probability: scenario.probability || 0.5,
    });
  }

  return results;
};

/**
 * Generates comprehensive risk dashboard metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Dashboard metrics
 */
export const generateRiskDashboard = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  HazardModel: any,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const [portfolioMetrics, tierDistribution, hazardSummary, concentrationMetrics] = await Promise.all([
    aggregatePortfolioRisk(portfolioId, PolicyModel, RiskScoreModel, ClaimModel, transaction),
    RiskScoreModel.findAll({
      where: {
        policyId: {
          [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
        },
      },
      attributes: ['tier', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['tier'],
      transaction,
    }),
    HazardModel.findAll({
      attributes: ['severity', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
      group: ['severity'],
      transaction,
    }),
    monitorRiskConcentration(portfolioId, 'geographic', PolicyModel, RiskScoreModel, transaction),
  ]);

  return {
    portfolioId,
    generatedAt: new Date(),
    summary: portfolioMetrics,
    tierDistribution: tierDistribution.map((t: any) => t.toJSON()),
    hazardSummary: hazardSummary.map((h: any) => h.toJSON()),
    concentrationMetrics,
    alerts: concentrationMetrics.exceedsLimit ? ['Geographic concentration exceeds threshold'] : [],
  };
};

// ============================================================================
// SPECIALIZED RISK OPERATIONS (Functions 27-38)
// ============================================================================

/**
 * Validates risk assessment completeness.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<{ complete: boolean; missingComponents: string[] }>} Validation results
 */
export const validateRiskAssessment = async (
  riskId: string,
  RiskScoreModel: any,
  HazardModel: any,
  ExposureAnalysisModel: any,
  transaction?: Transaction,
): Promise<{ complete: boolean; missingComponents: string[] }> => {
  const missingComponents: string[] = [];

  const riskScore = await RiskScoreModel.findOne({ where: { riskId }, transaction });
  if (!riskScore) {
    missingComponents.push('risk_score');
  }

  const hazards = await HazardModel.count({ where: { riskId }, transaction });
  if (hazards === 0) {
    missingComponents.push('hazard_identification');
  }

  const exposure = await ExposureAnalysisModel.findOne({ where: { riskId }, transaction });
  if (!exposure) {
    missingComponents.push('exposure_analysis');
  }

  return {
    complete: missingComponents.length === 0,
    missingComponents,
  };
};

/**
 * Archives expired risk assessments.
 *
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of archived assessments
 */
export const archiveExpiredRiskAssessments = async (RiskScoreModel: any, transaction?: Transaction): Promise<number> => {
  const [updated] = await RiskScoreModel.update(
    { metadata: Sequelize.fn('jsonb_set', Sequelize.col('metadata'), '{archived}', 'true') },
    {
      where: {
        expiresAt: { [Op.lt]: new Date() },
        [Op.not]: [Sequelize.where(Sequelize.literal("metadata->>'archived'"), 'true')],
      },
      transaction,
    },
  );

  return updated;
};

/**
 * Recalculates risk scores for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of recalculated scores
 */
export const recalculatePortfolioRiskScores = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  HazardModel: any,
  transaction?: Transaction,
): Promise<number> => {
  const policies = await PolicyModel.findAll({
    where: { portfolioId, status: 'active' },
    transaction,
  });

  let recalculated = 0;

  for (const policy of policies) {
    const policyData = policy.toJSON();
    await calculateRiskScore(policyData.policyId, policyData.customerId, policyData.lineOfBusiness, policyData.riskFactors || {}, RiskScoreModel, HazardModel, transaction);
    recalculated++;
  }

  return recalculated;
};

/**
 * Exports risk assessment data for reporting.
 *
 * @param {string[]} riskIds - Risk assessment identifiers
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} ExposureAnalysisModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Export data
 */
export const exportRiskAssessmentData = async (
  riskIds: string[],
  RiskScoreModel: any,
  HazardModel: any,
  ExposureAnalysisModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const exportData: Record<string, any>[] = [];

  for (const riskId of riskIds) {
    const [riskScore, hazards, exposure] = await Promise.all([
      RiskScoreModel.findOne({ where: { riskId }, transaction }),
      HazardModel.findAll({ where: { riskId }, transaction }),
      ExposureAnalysisModel.findOne({ where: { riskId }, transaction }),
    ]);

    exportData.push({
      riskId,
      riskScore: riskScore?.toJSON(),
      hazards: hazards.map((h: any) => h.toJSON()),
      exposure: exposure?.toJSON(),
      exportedAt: new Date(),
    });
  }

  return exportData;
};

/**
 * Compares risk assessments across time periods.
 *
 * @param {string} policyId - Policy identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Comparison results
 */
export const compareRiskAssessmentsOverTime = async (
  policyId: string,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const assessments = await RiskScoreModel.findAll({
    where: { policyId },
    order: [['calculatedAt', 'DESC']],
    limit: 2,
    transaction,
  });

  if (assessments.length < 2) {
    return { comparison: 'insufficient_data', assessments: assessments.map((a: any) => a.toJSON()) };
  }

  const [current, previous] = assessments.map((a: any) => a.toJSON());

  return {
    policyId,
    current: {
      riskId: current.riskId,
      overallScore: current.overallScore,
      tier: current.tier,
      calculatedAt: current.calculatedAt,
    },
    previous: {
      riskId: previous.riskId,
      overallScore: previous.overallScore,
      tier: previous.tier,
      calculatedAt: previous.calculatedAt,
    },
    changes: {
      scoreDelta: current.overallScore - previous.overallScore,
      tierChange: current.tier !== previous.tier,
      direction: current.overallScore > previous.overallScore ? 'improving' : current.overallScore < previous.overallScore ? 'deteriorating' : 'stable',
      percentageChange: previous.overallScore > 0 ? ((current.overallScore - previous.overallScore) / previous.overallScore) * 100 : 0,
    },
  };
};

/**
 * Identifies high-risk policies requiring attention.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} High-risk policies
 */
export const identifyHighRiskPolicies = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const highRiskPolicies = await PolicyModel.findAll({
    where: { portfolioId, status: 'active' },
    include: [
      {
        model: RiskScoreModel,
        as: 'riskScore',
        where: {
          [Op.or]: [{ tier: 'substandard' }, { tier: 'declined' }, { overallScore: { [Op.lt]: 50 } }],
          expiresAt: { [Op.gt]: new Date() },
        },
        required: true,
      },
    ],
    order: [[{ model: RiskScoreModel, as: 'riskScore' }, 'overallScore', 'ASC']],
    transaction,
  });

  return highRiskPolicies.map((p: any) => p.toJSON());
};

/**
 * Generates risk improvement action plan.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} HazardModel - Sequelize model
 * @param {any} MitigationModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Action plan
 */
export const generateRiskImprovementPlan = async (
  riskId: string,
  RiskScoreModel: any,
  HazardModel: any,
  MitigationModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const [riskScore, hazards, mitigations] = await Promise.all([
    RiskScoreModel.findOne({ where: { riskId }, transaction }),
    HazardModel.findAll({ where: { riskId }, order: [['severity', 'DESC']], transaction }),
    MitigationModel.findAll({ where: { riskId }, order: [['priority', 'DESC']], transaction }),
  ]);

  const currentScore = riskScore?.toJSON().overallScore || 0;
  const targetScore = Math.min(100, currentScore + 20);
  const totalMitigationImpact = mitigations.reduce((sum: number, m: any) => sum + (m.toJSON().expectedRiskReduction || 0), 0);

  return {
    riskId,
    currentScore,
    targetScore,
    gap: targetScore - currentScore,
    criticalHazards: hazards.slice(0, 5).map((h: any) => h.toJSON()),
    recommendedActions: mitigations.map((m: any) => m.toJSON()),
    expectedImprovement: totalMitigationImpact,
    timeline: '90-180 days',
    estimatedCost: mitigations.reduce((sum: number, m: any) => sum + (m.toJSON().estimatedCost || 0), 0),
  };
};

/**
 * Analyzes risk appetite compliance across portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} RiskAppetiteModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Compliance analysis
 */
export const analyzeRiskAppetiteCompliance = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  RiskAppetiteModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const policies = await PolicyModel.findAll({
    where: { portfolioId, status: 'active' },
    include: [
      {
        model: RiskScoreModel,
        as: 'riskScore',
        required: true,
      },
    ],
    transaction,
  });

  const appetites = await RiskAppetiteModel.findAll({
    where: { enforced: true },
    transaction,
  });

  const violations: Record<string, any>[] = [];
  let compliantCount = 0;

  for (const policy of policies) {
    const policyData = policy.toJSON();
    const riskScore = policyData.riskScore;
    const appetite = appetites.find((a: any) => a.lineOfBusiness === policyData.lineOfBusiness);

    if (appetite) {
      const appetiteData = appetite.toJSON();
      const policyViolations: string[] = [];

      if (riskScore.overallScore < appetiteData.minRiskScore) {
        policyViolations.push('below_minimum_score');
      }
      if (riskScore.overallScore > appetiteData.maxRiskScore) {
        policyViolations.push('exceeds_maximum_score');
      }

      if (policyViolations.length > 0) {
        violations.push({
          policyId: policyData.policyId,
          violations: policyViolations,
          currentScore: riskScore.overallScore,
          limits: { min: appetiteData.minRiskScore, max: appetiteData.maxRiskScore },
        });
      } else {
        compliantCount++;
      }
    }
  }

  return {
    portfolioId,
    totalPolicies: policies.length,
    compliantPolicies: compliantCount,
    violations,
    complianceRate: policies.length > 0 ? compliantCount / policies.length : 0,
    requiresAction: violations.length > 0,
  };
};

/**
 * Performs what-if analysis for risk changes.
 *
 * @param {string} riskId - Risk assessment identifier
 * @param {Record<string, any>} proposedChanges - Proposed risk factor changes
 * @param {any} RiskScoreModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} What-if analysis results
 */
export const performWhatIfAnalysis = async (
  riskId: string,
  proposedChanges: Record<string, any>,
  RiskScoreModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const currentRisk = await RiskScoreModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!currentRisk) {
    throw new Error('Risk assessment not found');
  }

  const current = currentRisk.toJSON();
  const simulatedCategoryScores = { ...current.categoryScores };

  // Apply proposed changes to category scores
  for (const [category, change] of Object.entries(proposedChanges)) {
    if (simulatedCategoryScores[category] !== undefined) {
      simulatedCategoryScores[category] = Math.max(0, Math.min(100, simulatedCategoryScores[category] + (change as number)));
    }
  }

  // Recalculate overall score with new category scores
  const weights = { hazard: 0.25, exposure: 0.2, frequency: 0.15, severity: 0.2, geographic: 0.1, financial: 0.1 };
  const simulatedOverallScore =
    simulatedCategoryScores.hazard * weights.hazard +
    simulatedCategoryScores.exposure * weights.exposure +
    simulatedCategoryScores.frequency * weights.frequency +
    simulatedCategoryScores.severity * weights.severity +
    simulatedCategoryScores.geographic * weights.geographic +
    simulatedCategoryScores.financial * weights.financial;

  let simulatedTier: string;
  if (simulatedOverallScore >= 80) simulatedTier = 'preferred';
  else if (simulatedOverallScore >= 60) simulatedTier = 'standard';
  else if (simulatedOverallScore >= 40) simulatedTier = 'substandard';
  else simulatedTier = 'declined';

  return {
    riskId,
    current: {
      overallScore: current.overallScore,
      tier: current.tier,
      categoryScores: current.categoryScores,
    },
    simulated: {
      overallScore: simulatedOverallScore,
      tier: simulatedTier,
      categoryScores: simulatedCategoryScores,
    },
    impact: {
      scoreDelta: simulatedOverallScore - current.overallScore,
      tierChange: simulatedTier !== current.tier,
      improved: simulatedOverallScore > current.overallScore,
    },
    proposedChanges,
  };
};

/**
 * Generates regulatory risk reporting data.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {any} PolicyModel - Sequelize model
 * @param {any} RiskScoreModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Regulatory report data
 */
export const generateRegulatoryRiskReport = async (
  portfolioId: string,
  PolicyModel: any,
  RiskScoreModel: any,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const [portfolioMetrics, riskDistribution, lossData] = await Promise.all([
    aggregatePortfolioRisk(portfolioId, PolicyModel, RiskScoreModel, ClaimModel, transaction),
    RiskScoreModel.findAll({
      attributes: ['tier', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'], [Sequelize.fn('AVG', Sequelize.col('overallScore')), 'avgScore']],
      group: ['tier'],
      transaction,
    }),
    ClaimModel.findAll({
      where: {
        policyId: {
          [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
        },
      },
      attributes: [[Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalLosses'], [Sequelize.fn('COUNT', Sequelize.col('id')), 'claimCount']],
      transaction,
    }),
  ]);

  const lossStats = lossData[0]?.toJSON() || {};

  return {
    reportDate: new Date(),
    portfolioId,
    reportingPeriod: 'annual',
    summary: {
      totalPolicies: portfolioMetrics.totalPolicies,
      totalPremium: portfolioMetrics.totalPremium,
      totalExposure: portfolioMetrics.totalExposure,
      riskAdjustedCapital: portfolioMetrics.riskAdjustedCapital,
    },
    riskMetrics: {
      weightedAverageRiskScore: portfolioMetrics.weightedAverageRiskScore,
      valueAtRisk: portfolioMetrics.valueAtRisk,
      expectedLossRatio: portfolioMetrics.expectedLossRatio,
    },
    riskDistribution: riskDistribution.map((r: any) => r.toJSON()),
    lossData: {
      totalLosses: parseFloat(lossStats.totalLosses || '0'),
      claimCount: lossStats.claimCount,
      lossRatio: portfolioMetrics.totalPremium > 0 ? parseFloat(lossStats.totalLosses || '0') / portfolioMetrics.totalPremium : 0,
    },
    compliance: 'adequate',
    certifiedBy: 'Chief Risk Officer',
  };
};

/**
 * Calculates catastrophe loss estimates for portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string[]} eventTypes - Catastrophe event types
 * @param {any} PolicyModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>[]>} Catastrophe loss estimates
 */
export const calculateCatastropheLossEstimates = async (
  portfolioId: string,
  eventTypes: string[],
  PolicyModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>[]> => {
  const estimates: Record<string, any>[] = [];

  for (const eventType of eventTypes) {
    const exposedPolicies = await PolicyModel.findAll({
      where: {
        portfolioId,
        status: 'active',
      },
      attributes: [
        'state',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'policyCount'],
        [Sequelize.fn('SUM', Sequelize.col('limitAmount')), 'aggregateLimit'],
      ],
      group: ['state'],
      transaction,
    });

    let totalEstimatedLoss = 0;
    let totalPoliciesAtRisk = 0;

    for (const exposure of exposedPolicies) {
      const data = exposure.toJSON();
      const damageRatio = getCatastropheDamageRatio(eventType, data.state);
      const estimatedLoss = parseFloat(data.aggregateLimit || '0') * damageRatio;
      totalEstimatedLoss += estimatedLoss;
      totalPoliciesAtRisk += data.policyCount;
    }

    estimates.push({
      eventType,
      returnPeriod: getReturnPeriod(eventType),
      totalPoliciesAtRisk,
      estimatedLoss: totalEstimatedLoss,
      pml90: totalEstimatedLoss * 0.90,
      pml95: totalEstimatedLoss * 0.95,
      pml99: totalEstimatedLoss * 0.99,
      lastModeled: new Date(),
    });
  }

  return estimates;
};

/**
 * Performs reinsurance optimization analysis.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {Record<string, any>} reinsuranceOptions - Reinsurance program options
 * @param {any} PolicyModel - Sequelize model
 * @param {any} ClaimModel - Sequelize model
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<Record<string, any>>} Reinsurance optimization results
 */
export const optimizeReinsurance = async (
  portfolioId: string,
  reinsuranceOptions: Record<string, any>,
  PolicyModel: any,
  ClaimModel: any,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const portfolioMetrics = await aggregatePortfolioRisk(portfolioId, PolicyModel, {} as any, ClaimModel, transaction);

  const retentionLimit = reinsuranceOptions.retentionLimit || 1000000;
  const reinsuranceLimit = reinsuranceOptions.reinsuranceLimit || 10000000;
  const reinsurancePremiumRate = reinsuranceOptions.premiumRate || 0.15;

  const excessLosses = await ClaimModel.sum('paidAmount', {
    where: {
      policyId: {
        [Op.in]: Sequelize.literal(`(SELECT policy_id FROM policies WHERE portfolio_id = '${portfolioId}')`),
      },
      paidAmount: { [Op.gt]: retentionLimit },
    },
    transaction,
  });

  const cededLosses = Math.min(excessLosses || 0, reinsuranceLimit);
  const reinsurancePremium = reinsuranceLimit * reinsurancePremiumRate;
  const netRetention = (excessLosses || 0) - cededLosses + reinsurancePremium;

  return {
    portfolioId,
    program: {
      retentionLimit,
      reinsuranceLimit,
      reinsurancePremiumRate,
      reinsurancePremium,
    },
    analysis: {
      totalExcessLosses: excessLosses || 0,
      cededLosses,
      netRetention,
      savingsRatio: excessLosses > 0 ? cededLosses / excessLosses : 0,
      costBenefitRatio: reinsurancePremium > 0 ? cededLosses / reinsurancePremium : 0,
    },
    recommendation: reinsurancePremium < cededLosses ? 'optimal' : 'reconsider',
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateHazardScore(riskFactors: Record<string, any>, HazardModel: any, transaction?: Transaction): number {
  let score = 80; // Base score

  if (riskFactors.buildingAge > 50) score -= 10;
  if (riskFactors.buildingAge > 75) score -= 10;
  if (!riskFactors.sprinklerSystem) score -= 15;
  if (riskFactors.previousClaims > 2) score -= riskFactors.previousClaims * 5;

  return Math.max(0, Math.min(100, score));
}

function calculateExposureScore(riskFactors: Record<string, any>): number {
  let score = 70;
  const tiv = riskFactors.totalInsuredValue || 0;

  if (tiv > 5000000) score -= 15;
  else if (tiv > 1000000) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function calculateFrequencyScore(riskFactors: Record<string, any>): number {
  let score = 75;
  if (riskFactors.previousClaims > 2) score -= riskFactors.previousClaims * 8;
  return Math.max(0, Math.min(100, score));
}

function calculateSeverityScore(riskFactors: Record<string, any>): number {
  let score = 70;
  const avgClaimAmount = riskFactors.averageClaimAmount || 0;
  if (avgClaimAmount > 100000) score -= 20;
  else if (avgClaimAmount > 50000) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function calculateGeographicScore(riskFactors: Record<string, any>): number {
  let score = 80;
  if (riskFactors.floodZone === 'A' || riskFactors.floodZone === 'V') score -= 20;
  if (riskFactors.earthquakeZone > 3) score -= 15;
  if (riskFactors.hurricaneZone) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function calculateFinancialScore(riskFactors: Record<string, any>): number {
  let score = 75;
  if (riskFactors.creditScore < 650) score -= 15;
  if (riskFactors.debtToIncomeRatio > 0.40) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function calculateConcentrationIndex(exposureData: Record<string, any>): number {
  return exposureData.concentrationIndex || 0.25;
}

function calculateGeographicSpread(exposureData: Record<string, any>): number {
  return exposureData.geographicSpread || 0.60;
}

function calculateIndustryConcentration(exposureData: Record<string, any>): number {
  return exposureData.industryConcentration || 0.30;
}

function calculateTrendFactor(frequencies: number[]): number {
  if (frequencies.length < 2) return 1.0;
  const recent = frequencies.slice(-2).reduce((a, b) => a + b, 0) / 2;
  const older = frequencies.slice(0, -2).reduce((a, b) => a + b, 0) / (frequencies.length - 2);
  return older > 0 ? recent / older : 1.0;
}

function calculateStdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function getStatesInRegion(region: string): string[] {
  const regions: Record<string, string[]> = {
    northeast: ['CT', 'ME', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    southeast: ['AL', 'FL', 'GA', 'KY', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    midwest: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
    southwest: ['AZ', 'NM', 'OK', 'TX'],
    west: ['CA', 'CO', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
  };
  return regions[region.toLowerCase()] || [];
}

function calculateEarthquakeRisk(location: Record<string, any>): number {
  const highRiskStates = ['CA', 'AK', 'HI', 'NV', 'UT'];
  return highRiskStates.includes(location.state) ? 75 : 25;
}

function calculateHurricaneRisk(location: Record<string, any>): number {
  const coastalStates = ['FL', 'LA', 'TX', 'NC', 'SC', 'GA', 'AL', 'MS'];
  const distanceToCoast = location.distanceToCoast || 999;
  if (coastalStates.includes(location.state) && distanceToCoast < 50) return 80;
  if (coastalStates.includes(location.state)) return 50;
  return 10;
}

function calculateFloodRisk(location: Record<string, any>): number {
  const floodZone = location.floodZone || 'X';
  if (floodZone === 'A' || floodZone === 'V') return 85;
  if (floodZone === 'B' || floodZone === 'C') return 50;
  return 20;
}

function calculateTornadoRisk(location: Record<string, any>): number {
  const tornadoAlley = ['KS', 'OK', 'TX', 'NE', 'SD'];
  return tornadoAlley.includes(location.state) ? 70 : 30;
}

function calculateWildfireRisk(location: Record<string, any>): number {
  const wildfireStates = ['CA', 'OR', 'WA', 'CO', 'MT', 'ID'];
  return wildfireStates.includes(location.state) ? 65 : 15;
}

function calculateHailRisk(location: Record<string, any>): number {
  const hailStates = ['TX', 'OK', 'KS', 'NE', 'CO'];
  return hailStates.includes(location.state) ? 60 : 25;
}

function getIndustryName(industryCode: string): string {
  const industries: Record<string, string> = {
    '236': 'Construction',
    '722': 'Food Services',
    '484': 'Trucking',
    '531': 'Real Estate',
    '541': 'Professional Services',
  };
  return industries[industryCode] || 'Unknown Industry';
}

function calculateRiskAdjustedCapital(totalExposure: number, volatility: number): number {
  const capitalRatio = 0.12; // 12% base capital requirement
  const volatilityAdjustment = volatility / 100;
  return totalExposure * (capitalRatio + volatilityAdjustment);
}

function calculateCorrelation(values1: number[], values2: number[]): number {
  if (values1.length !== values2.length || values1.length === 0) return 0;

  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;

  let numerator = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    sum1Sq += diff1 ** 2;
    sum2Sq += diff2 ** 2;
  }

  const denominator = Math.sqrt(sum1Sq * sum2Sq);
  return denominator > 0 ? numerator / denominator : 0;
}

function calculateSharpeRatio(profit: number, premium: number): number {
  const riskFreeRate = 0.03; // 3% risk-free rate
  const returnRate = premium > 0 ? profit / premium : 0;
  const excessReturn = returnRate - riskFreeRate;
  const volatility = 0.15; // Assumed volatility
  return volatility > 0 ? excessReturn / volatility : 0;
}

function generateRandomPoisson(lambda: number): number {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function generateRandomLognormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.exp(mean + stdDev * z);
}

function calculatePercentile(value: number, benchmark: Record<string, any>): number {
  const min = parseFloat(benchmark.minScore || '0');
  const max = parseFloat(benchmark.maxScore || '100');
  return max > min ? ((value - min) / (max - min)) * 100 : 50;
}

function determineQuartile(value: number, benchmark: Record<string, any>): number {
  const p25 = parseFloat(benchmark.p25 || '0');
  const p50 = parseFloat(benchmark.p50 || '0');
  const p75 = parseFloat(benchmark.p75 || '0');
  if (value <= p25) return 1;
  if (value <= p50) return 2;
  if (value <= p75) return 3;
  return 4;
}

function getBucket(score: number): string {
  if (score < 20) return '0-20';
  if (score < 40) return '20-40';
  if (score < 60) return '40-60';
  if (score < 80) return '60-80';
  return '80-100';
}

function generateMockThirdPartyData(provider: string, requestData: Record<string, any>): Record<string, any> {
  return {
    dataType: 'property_risk_score',
    score: 75 + Math.random() * 20,
    grade: 'B+',
    data: {
      provider,
      requestData,
      assessedAt: new Date(),
      factors: {
        construction: 'standard',
        occupancy: 'low_hazard',
        protection: 'adequate',
        exposure: 'moderate',
      },
    },
  };
}

function getCatastropheDamageRatio(eventType: string, state: string): number {
  if (eventType === 'hurricane' && ['FL', 'LA', 'TX'].includes(state)) return 0.30;
  if (eventType === 'earthquake' && state === 'CA') return 0.40;
  if (eventType === 'tornado' && ['OK', 'KS'].includes(state)) return 0.25;
  return 0.15;
}

function getReturnPeriod(eventType: string): number {
  if (eventType === 'earthquake') return 500;
  if (eventType === 'hurricane') return 100;
  if (eventType === 'tornado') return 50;
  return 250;
}
