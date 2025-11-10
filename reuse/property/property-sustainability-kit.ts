/**
 * LOC: PROP-SUS-001
 * File: /reuse/property/property-sustainability-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Environmental compliance modules
 *   - ESG reporting systems
 *   - Sustainability tracking applications
 */

/**
 * File: /reuse/property/property-sustainability-kit.ts
 * Locator: WC-PROP-SUS-001
 * Purpose: Sustainability Management Kit - Comprehensive environmental tracking, ESG metrics, and compliance
 *
 * Upstream: Independent utility module for property sustainability operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for sustainability management, carbon tracking, ESG reporting, and compliance
 *
 * LLM Context: Enterprise-grade sustainability management utilities for property management systems.
 * Provides carbon footprint tracking, energy/water monitoring, waste management, LEED certifications,
 * green building standards, sustainability goal setting, environmental compliance, renewable energy
 * integration, sustainability reporting, and ESG metrics. Essential for reducing environmental impact,
 * achieving sustainability goals, meeting regulatory requirements, and demonstrating corporate
 * environmental responsibility.
 */

// ============================================================================
// TYPE DEFINITIONS - CARBON FOOTPRINT & EMISSIONS
// ============================================================================

interface CarbonFootprint {
  id: string;
  propertyId: string;
  period: DateRange;
  totalEmissions: number; // metric tons CO2e
  scope1Emissions: number; // Direct emissions (natural gas, fuel)
  scope2Emissions: number; // Indirect from electricity
  scope3Emissions: number; // Other indirect (waste, water, commuting)
  bySource: Record<EmissionSource, number>;
  offsetsApplied: number; // metric tons
  netEmissions: number; // After offsets
  intensity: number; // metric tons CO2e per sqft
  baselineComparison?: {
    change: number;
    percentChange: number;
  };
  lastCalculated: Date;
}

type EmissionSource =
  | 'natural_gas'
  | 'electricity'
  | 'water'
  | 'waste'
  | 'refrigerants'
  | 'commuting'
  | 'fuel_oil'
  | 'propane'
  | 'purchased_steam'
  | 'business_travel';

interface DateRange {
  start: Date;
  end: Date;
}

interface CarbonOffset {
  id: string;
  propertyId: string;
  offsetType: OffsetType;
  provider: string;
  certificateNumber: string;
  vintage: number; // Year credits were generated
  quantity: number; // metric tons CO2e
  unitCost: number; // $/ton
  totalCost: number;
  verificationStandard: 'VCS' | 'Gold Standard' | 'CDM' | 'ACR' | 'CAR' | 'other';
  retirementDate: Date;
  isRetired: boolean;
  metadata?: Record<string, unknown>;
}

type OffsetType =
  | 'renewable_energy'
  | 'methane_capture'
  | 'reforestation'
  | 'energy_efficiency'
  | 'carbon_capture'
  | 'biomass_energy'
  | 'avoided_deforestation';

// ============================================================================
// TYPE DEFINITIONS - ENERGY & WATER CONSUMPTION
// ============================================================================

interface EnergyConsumptionMetric {
  propertyId: string;
  period: DateRange;
  electricity: {
    consumption: number; // kWh
    cost: number;
    renewable: number; // kWh from renewable sources
    renewablePercent: number;
  };
  naturalGas: {
    consumption: number; // therms
    cost: number;
  };
  otherFuels: Array<{
    type: string;
    consumption: number;
    unit: string;
    cost: number;
  }>;
  totalEnergyUsage: number; // kBtu
  energyIntensity: number; // kBtu per sqft
}

interface WaterUsageMetric {
  propertyId: string;
  period: DateRange;
  freshWaterConsumption: number; // gallons
  recycledWaterUsage: number; // gallons
  rainwaterHarvested: number; // gallons
  totalWaterUsage: number; // gallons
  waterIntensity: number; // gallons per sqft
  wasteWaterGenerated: number; // gallons
  waterTreatedOnsite: boolean;
  waterReuseRate: number; // percentage
  cost: number;
}

// ============================================================================
// TYPE DEFINITIONS - WASTE & RECYCLING
// ============================================================================

interface WasteStream {
  id: string;
  propertyId: string;
  wasteType: WasteType;
  description: string;
  quantity: number; // metric tons
  unit: 'metric_ton' | 'cubic_yard' | 'gallon';
  disposalMethod: DisposalMethod;
  vendor?: string;
  cost: number;
  recycleContent: number; // percentage
  isHazardous: boolean;
  recordedDate: Date;
  fiscalYear: number;
}

type WasteType =
  | 'general_waste'
  | 'organic'
  | 'paper'
  | 'cardboard'
  | 'plastic'
  | 'glass'
  | 'metal'
  | 'wood'
  | 'construction_demolition'
  | 'hazardous'
  | 'electronic'
  | 'mixed_recycling';

type DisposalMethod =
  | 'landfill'
  | 'recycling'
  | 'composting'
  | 'incineration'
  | 'hazmat_facility'
  | 'donation'
  | 'resale';

interface RecyclingProgram {
  id: string;
  propertyId: string;
  name: string;
  status: ProgramStatus;
  wasteTypesIncluded: WasteType[];
  recyclingRate: number; // percentage
  materialsDivertedFromLandfill: number; // metric tons/year
  annualSavings: number; // $
  participantCount?: number;
  launchDate: Date;
  targetRecyclingRate: number;
}

type ProgramStatus = 'planned' | 'active' | 'suspended' | 'completed' | 'discontinued';

// ============================================================================
// TYPE DEFINITIONS - GREEN CERTIFICATIONS
// ============================================================================

interface GreenCertification {
  id: string;
  propertyId: string;
  certificationName: CertificationType;
  certificationLevel?: CertificationLevel;
  certifyingBody: string;
  issueDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  achievementScore?: number; // Percentage or point score
  scoreMetricType?: 'percentage' | 'points' | 'stars';
  totalScore?: number; // Maximum possible score
  certificationNumber?: string;
  auditDate?: Date;
  nextAuditDue?: Date;
  costs: {
    applicationFee: number;
    annualFee: number;
    auditFee?: number;
  };
}

type CertificationType =
  | 'LEED'
  | 'BREEAM'
  | 'ENERGY_STAR'
  | 'Green_Globes'
  | 'Fitwel'
  | 'Living_Building_Challenge'
  | 'WELL'
  | 'ISO_14001'
  | 'B_Corp'
  | 'Net_Zero_Ready'
  | 'Climate_Pledge_Arena'
  | 'Carbon_Trust'
  | 'SITES';

type CertificationLevel =
  | 'Certified'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | '1_Star'
  | '2_Star'
  | '3_Star'
  | '4_Star'
  | '5_Star';

// ============================================================================
// TYPE DEFINITIONS - SUSTAINABILITY GOALS & TARGETS
// ============================================================================

interface SustainabilityGoal {
  id: string;
  propertyId: string;
  goalType: GoalType;
  category: GoalCategory;
  description: string;
  targetValue: number;
  targetUnit: string;
  baselineValue: number;
  baselineYear: number;
  deadline: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: GoalStatus;
  scienceBasedTarget?: boolean;
  alignmentWithSDGs?: string[]; // UN Sustainable Development Goals
  owningDepartment?: string;
  progressCheckpoints: ProgressCheckpoint[];
  currentProgress?: number;
  completionPercentage?: number;
}

type GoalType = 'reduction' | 'increase' | 'achievement' | 'transition';

type GoalCategory =
  | 'carbon_neutrality'
  | 'renewable_energy'
  | 'water_conservation'
  | 'waste_diversion'
  | 'energy_efficiency'
  | 'green_building'
  | 'sustainable_procurement'
  | 'biodiversity'
  | 'community_engagement';

type GoalStatus =
  | 'proposed'
  | 'approved'
  | 'in_progress'
  | 'at_risk'
  | 'achieved'
  | 'cancelled'
  | 'on_hold';

interface ProgressCheckpoint {
  checkpointDate: Date;
  targetValue: number;
  actualValue: number;
  percentComplete: number;
  notes?: string;
  lastUpdated: Date;
}

// ============================================================================
// TYPE DEFINITIONS - ENVIRONMENTAL COMPLIANCE
// ============================================================================

interface EnvironmentalCompliance {
  id: string;
  propertyId: string;
  regulationType: RegulationType;
  jurisdiction: string;
  requirement: string;
  deadline: Date;
  status: ComplianceStatus;
  percentComplete: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  responsibleParty?: string;
  requiredDocumentation: string[];
  submissionDate?: Date;
  lastAuditDate?: Date;
  nextAuditDue?: Date;
  associatedCosts?: number;
  notes?: string;
}

type RegulationType =
  | 'emissions_reporting'
  | 'energy_audit'
  | 'water_disclosure'
  | 'waste_management'
  | 'hazardous_materials'
  | 'environmental_impact'
  | 'building_code'
  | 'air_quality'
  | 'soil_protection'
  | 'noise_control'
  | 'climate_action'
  | 'disclosure_requirement';

type ComplianceStatus =
  | 'compliant'
  | 'in_progress'
  | 'non_compliant'
  | 'pending_review'
  | 'waiver_applied'
  | 'extension_granted';

interface EnvironmentalAudit {
  id: string;
  propertyId: string;
  auditType: AuditType;
  auditDate: Date;
  auditedBy: string;
  findings: Audit
Finding[];
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'critical';
  nonConformances: number;
  correctiveActions: string[];
  nextAuditDue: Date;
  report?: string;
}

type AuditType =
  | 'internal_environmental'
  | 'third_party_certification'
  | 'regulatory_inspection'
  | 'sustainability_assessment'
  | 'energy_audit'
  | 'water_audit'
  | 'waste_audit';

interface AuditFinding {
  id: string;
  category: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  description: string;
  evidence?: string;
  correctionRequired: boolean;
  targetDate?: Date;
  completionDate?: Date;
}

// ============================================================================
// TYPE DEFINITIONS - RENEWABLE ENERGY & GRID INTEGRATION
// ============================================================================

interface RenewableEnergySystem {
  id: string;
  propertyId: string;
  systemType: RenewableType;
  capacity: number; // kW
  installedDate: Date;
  status: 'operational' | 'planned' | 'under_maintenance' | 'decommissioned';
  annualProduction: number; // kWh/year (estimated or actual)
  actualProduction?: number; // kWh/year
  performanceRatio?: number; // Percentage of ideal
  investmentCost?: number;
  incentivesReceived?: number;
  paybackPeriod?: number; // years
  lifespan: number; // years
  monitoring: {
    realtime: boolean;
    lastUpdate: Date;
    currentOutput?: number; // kW
  };
}

type RenewableType =
  | 'solar_pv'
  | 'solar_thermal'
  | 'wind'
  | 'geothermal'
  | 'biomass'
  | 'hydro'
  | 'micro_hydro'
  | 'battery_storage'
  | 'virtual_power_plant'
  | 'district_energy';

interface GridIntegration {
  propertyId: string;
  exportCapability: boolean;
  gridConnected: boolean;
  netMeteringAvailable: boolean;
  demandResponseParticipation: boolean;
  virtualPowerPlantMember?: boolean;
  microGridParticipation?: boolean;
  peakShavingCapability: number; // kW
  demandFlexibilityScore?: number;
  gridServicesRevenue?: number; // Annual $/year
}

// ============================================================================
// TYPE DEFINITIONS - SUSTAINABILITY REPORTING & ESG
// ============================================================================

interface SustainabilityReport {
  id: string;
  propertyId?: string;
  portfolioId?: string;
  reportingYear: number;
  reportType: ReportType;
  frameworksUsed: ReportingFramework[];
  sections: ReportSection[];
  environmentalMetrics: EnvironmentalMetrics;
  socialMetrics?: SocialMetrics;
  governanceMetrics?: GovernanceMetrics;
  stakeholderEngagement?: StakeholderInfo[];
  assuranceLevel?: 'limited' | 'reasonable' | 'none';
  publishedDate?: Date;
  externalAssurance?: boolean;
  assuranceProvider?: string;
}

type ReportType =
  | 'annual_sustainability'
  | 'esg'
  | 'carbon_footprint'
  | 'environmental_disclosure'
  | 'integrated_report'
  | 'climate_action_plan'
  | 'gender_equality_report';

type ReportingFramework =
  | 'GRI'
  | 'SASB'
  | 'TCFD'
  | 'CDSB'
  | 'CDP'
  | 'Science_Based_Targets'
  | 'B_Impact_Assessment'
  | 'IRIS+';

interface ReportSection {
  title: string;
  content: string;
  dataPoints: Record<string, unknown>;
  visualizations?: string[];
}

interface EnvironmentalMetrics {
  carboneFootprint: number;
  energyConsumption: number;
  renewableEnergyPercentage: number;
  waterConsumption: number;
  wasteGenerated: number;
  wasteRecycled: number;
  wasteRecyclingRate: number;
  hazardousWaste: number;
  biodiversityImpact?: string;
  pollutantEmissions?: Record<string, number>;
}

interface SocialMetrics {
  employeeCount?: number;
  femaleLeadershipPercentage?: number;
  workplaceInjuryRate?: number;
  communityInvestment?: number;
  volunteerHours?: number;
  localSupplierSpend?: number;
}

interface GovernanceMetrics {
  boardDiversity?: number;
  executiveCompensationLinkedToESG?: boolean;
  whistleblowerMechanismInPlace?: boolean;
  ethicsTrainingCompletion?: number;
  dataPrivacyIncidents?: number;
}

interface StakeholderInfo {
  group: string;
  engagementMethod: string;
  frequency: string;
  keyTopics?: string[];
}

interface ESGScore {
  propertyId?: string;
  portfolioId?: string;
  evaluationDate: Date;
  overallScore: number; // 0-100
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  benchmarkComparison?: {
    industryAverage: number;
    peerAverage: number;
    percentile: number;
  };
  improvementAreas: string[];
  strengths: string[];
}

// ============================================================================
// CARBON FOOTPRINT TRACKING - 5 FUNCTIONS
// ============================================================================

/**
 * Calculates total carbon footprint with scope breakdown.
 *
 * @param {Record<EmissionSource, number>} emissions - Emissions by source
 * @param {number} offsetQuantity - Offsets applied in metric tons CO2e
 * @returns {CarbonFootprint} Complete carbon footprint analysis
 *
 * @example
 * ```typescript
 * const footprint = calculateCarbonFootprint(
 *   {
 *     electricity: 500,
 *     natural_gas: 150,
 *     waste: 25
 *   },
 *   50
 * );
 * ```
 */
export const calculateCarbonFootprint = (
  emissions: Record<EmissionSource, number>,
  offsetQuantity: number = 0
): Omit<CarbonFootprint, 'id' | 'propertyId'> => {
  const scope1Sources: EmissionSource[] = [
    'natural_gas',
    'fuel_oil',
    'propane',
    'refrigerants',
    'business_travel',
  ];
  const scope2Sources: EmissionSource[] = ['electricity', 'purchased_steam'];
  const scope3Sources: EmissionSource[] = ['water', 'waste', 'commuting'];

  const scope1 = scope1Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
  const scope2 = scope2Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
  const scope3 = scope3Sources.reduce((sum, src) => sum + (emissions[src] || 0), 0);
  const totalEmissions = scope1 + scope2 + scope3;
  const netEmissions = Math.max(0, totalEmissions - offsetQuantity);

  return {
    period: { start: new Date(), end: new Date() },
    totalEmissions,
    scope1Emissions: scope1,
    scope2Emissions: scope2,
    scope3Emissions: scope3,
    bySource: emissions,
    offsetsApplied: offsetQuantity,
    netEmissions,
    intensity: 0,
    lastCalculated: new Date(),
  };
};

/**
 * Converts energy consumption to CO2 equivalent using emission factors.
 *
 * @param {string} energyType - Type of energy (electricity, gas, etc.)
 * @param {number} quantity - Quantity consumed
 * @param {string} unit - Unit of measurement
 * @param {string} region - Geographic region for emission factor
 * @returns {number} CO2 equivalent in metric tons
 *
 * @example
 * ```typescript
 * const co2 = convertEnergyToCO2('electricity', 1000, 'kwh', 'US_Northeast');
 * console.log(co2); // ~0.4 metric tons
 * ```
 */
export const convertEnergyToCO2 = (
  energyType: string,
  quantity: number,
  unit: string,
  region: string
): number => {
  const emissionFactors: Record<string, Record<string, number>> = {
    US_Northeast: { electricity_kwh: 0.000366, natural_gas_therm: 0.00536 },
    US_Southeast: { electricity_kwh: 0.000404, natural_gas_therm: 0.00536 },
    US_Midwest: { electricity_kwh: 0.000485, natural_gas_therm: 0.00536 },
    US_Southwest: { electricity_kwh: 0.000381, natural_gas_therm: 0.00536 },
    US_West: { electricity_kwh: 0.000245, natural_gas_therm: 0.00536 },
    EU: { electricity_kwh: 0.000233, natural_gas_therm: 0.00536 },
    ASIA: { electricity_kwh: 0.000531, natural_gas_therm: 0.00536 },
  };

  const key = `${energyType}_${unit}`;
  const factor = emissionFactors[region]?.[key] || 0.0004;
  return quantity * factor;
};

/**
 * Tracks and validates carbon offset transactions.
 *
 * @param {Partial<CarbonOffset>} offsetData - Offset transaction details
 * @returns {CarbonOffset} Recorded offset
 *
 * @example
 * ```typescript
 * const offset = recordCarbonOffset({
 *   propertyId: 'PROP-001',
 *   offsetType: 'renewable_energy',
 *   provider: 'Carbon Trust',
 *   certificateNumber: 'CT-2024-001',
 *   vintage: 2024,
 *   quantity: 100,
 *   unitCost: 15
 * });
 * ```
 */
export const recordCarbonOffset = (offsetData: Partial<CarbonOffset>): CarbonOffset => ({
  id: offsetData.id || `OFFSET-${Date.now()}`,
  propertyId: offsetData.propertyId!,
  offsetType: offsetData.offsetType!,
  provider: offsetData.provider!,
  certificateNumber: offsetData.certificateNumber!,
  vintage: offsetData.vintage!,
  quantity: offsetData.quantity!,
  unitCost: offsetData.unitCost!,
  totalCost: (offsetData.quantity || 0) * (offsetData.unitCost || 0),
  verificationStandard: offsetData.verificationStandard || 'VCS',
  retirementDate: offsetData.retirementDate || new Date(),
  isRetired: offsetData.isRetired || false,
  metadata: offsetData.metadata,
});

/**
 * Calculates carbon intensity per square foot of property.
 *
 * @param {number} totalEmissions - Total emissions in metric tons CO2e
 * @param {number} propertySquareFeet - Property size in square feet
 * @returns {number} Carbon intensity metric
 *
 * @example
 * ```typescript
 * const intensity = calculateCarbonIntensity(500, 50000);
 * console.log(intensity); // 0.01 metric tons CO2e/sqft
 * ```
 */
export const calculateCarbonIntensity = (
  totalEmissions: number,
  propertySquareFeet: number
): number => {
  if (propertySquareFeet <= 0) return 0;
  return totalEmissions / propertySquareFeet;
};

/**
 * Projects future carbon emissions based on historical trends.
 *
 * @param {number[]} historicalEmissions - Previous years' emissions
 * @param {number} yearsAhead - Years to project forward
 * @param {number} changeRate - Expected annual change rate (-0.05 for 5% reduction)
 * @returns {number[]} Projected emissions for future years
 *
 * @example
 * ```typescript
 * const projections = projectCarbonEmissions([500, 480, 460], 5, -0.04);
 * // Returns array of 5 projected values
 * ```
 */
export const projectCarbonEmissions = (
  historicalEmissions: number[],
  yearsAhead: number,
  changeRate: number = 0
): number[] => {
  if (historicalEmissions.length === 0) return [];

  const lastValue = historicalEmissions[historicalEmissions.length - 1];
  const projections: number[] = [];
  let currentValue = lastValue;

  for (let i = 0; i < yearsAhead; i++) {
    currentValue = currentValue * (1 + changeRate);
    projections.push(Math.max(0, currentValue));
  }

  return projections;
};

// ============================================================================
// ENERGY & WATER MONITORING - 5 FUNCTIONS
// ============================================================================

/**
 * Creates comprehensive energy consumption metric snapshot.
 *
 * @param {Partial<EnergyConsumptionMetric>} data - Energy consumption data
 * @returns {EnergyConsumptionMetric} Complete energy metrics
 *
 * @example
 * ```typescript
 * const metrics = createEnergyMetric({
 *   electricity: { consumption: 50000, cost: 5000, renewable: 10000 }
 * });
 * ```
 */
export const createEnergyMetric = (
  data: Partial<EnergyConsumptionMetric>
): EnergyConsumptionMetric => {
  const totalBtu =
    (data.electricity?.consumption || 0) * 3.412 +
    (data.naturalGas?.consumption || 0) * 100000 +
    (data.otherFuels?.reduce((sum, f) => sum + (f.consumption || 0), 0) || 0) * 100000;

  return {
    propertyId: data.propertyId || '',
    period: data.period || { start: new Date(), end: new Date() },
    electricity: {
      consumption: data.electricity?.consumption || 0,
      cost: data.electricity?.cost || 0,
      renewable: data.electricity?.renewable || 0,
      renewablePercent: data.electricity?.renewablePercent || 0,
    },
    naturalGas: {
      consumption: data.naturalGas?.consumption || 0,
      cost: data.naturalGas?.cost || 0,
    },
    otherFuels: data.otherFuels || [],
    totalEnergyUsage: totalBtu,
    energyIntensity: 0,
  };
};

/**
 * Calculates water usage metrics and conservation potential.
 *
 * @param {Partial<WaterUsageMetric>} data - Water usage data
 * @returns {WaterUsageMetric} Complete water metrics
 *
 * @example
 * ```typescript
 * const water = createWaterMetric({
 *   freshWaterConsumption: 500000,
 *   recycledWaterUsage: 50000
 * });
 * ```
 */
export const createWaterMetric = (
  data: Partial<WaterUsageMetric>
): WaterUsageMetric => {
  const freshUsage = data.freshWaterConsumption || 0;
  const recycledUsage = data.recycledWaterUsage || 0;
  const rainwater = data.rainwaterHarvested || 0;
  const totalUsage = freshUsage + recycledUsage + rainwater;
  const reuseRate =
    totalUsage > 0 ? ((recycledUsage + rainwater) / totalUsage) * 100 : 0;

  return {
    propertyId: data.propertyId || '',
    period: data.period || { start: new Date(), end: new Date() },
    freshWaterConsumption: freshUsage,
    recycledWaterUsage: recycledUsage,
    rainwaterHarvested: rainwater,
    totalWaterUsage: totalUsage,
    waterIntensity: 0,
    wasteWaterGenerated: data.wasteWaterGenerated || 0,
    waterTreatedOnsite: data.waterTreatedOnsite || false,
    waterReuseRate: reuseRate,
    cost: data.cost || 0,
  };
};

/**
 * Detects anomalies in energy consumption patterns.
 *
 * @param {number[]} dailyConsumption - Daily consumption readings
 * @param {number} stdDevThreshold - Standard deviations for anomaly detection
 * @returns {Array<{date: number; value: number; anomaly: boolean}>} Flagged anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectEnergyAnomalies([100, 105, 102, 104, 500, 103], 2);
 * // Flags the 500 value as anomaly
 * ```
 */
export const detectEnergyAnomalies = (
  dailyConsumption: number[],
  stdDevThreshold: number = 2
): Array<{ date: number; value: number; anomaly: boolean }> => {
  if (dailyConsumption.length < 3) {
    return dailyConsumption.map((val, idx) => ({
      date: idx,
      value: val,
      anomaly: false,
    }));
  }

  const mean = dailyConsumption.reduce((a, b) => a + b) / dailyConsumption.length;
  const variance =
    dailyConsumption.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    dailyConsumption.length;
  const stdDev = Math.sqrt(variance);
  const threshold = mean + stdDev * stdDevThreshold;

  return dailyConsumption.map((val, idx) => ({
    date: idx,
    value: val,
    anomaly: Math.abs(val - mean) > stdDev * stdDevThreshold,
  }));
};

/**
 * Calculates water conservation opportunity score.
 *
 * @param {WaterUsageMetric} metric - Current water usage metrics
 * @param {number} benchmarkConsumption - Industry benchmark consumption
 * @returns {number} Conservation opportunity score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateWaterConservationPotential(waterMetric, 350000);
 * ```
 */
export const calculateWaterConservationPotential = (
  metric: WaterUsageMetric,
  benchmarkConsumption: number
): number => {
  const currentUsage = metric.totalWaterUsage;
  if (currentUsage <= benchmarkConsumption) return 100;

  const excess = currentUsage - benchmarkConsumption;
  const percentOverBenchmark = (excess / benchmarkConsumption) * 100;
  const score = Math.max(0, 100 - percentOverBenchmark);
  return Math.round(score);
};

/**
 * Estimates energy savings from conservation measures.
 *
 * @param {EnergyConsumptionMetric} baseline - Baseline energy consumption
 * @param {Array<{measure: string; savingsPercent: number}>} measures - Conservation measures
 * @returns {object} Projected savings summary
 *
 * @example
 * ```typescript
 * const savings = estimateEnergySavings(baseline, [
 *   { measure: 'LED retrofit', savingsPercent: 15 },
 *   { measure: 'HVAC optimization', savingsPercent: 10 }
 * ]);
 * ```
 */
export const estimateEnergySavings = (
  baseline: EnergyConsumptionMetric,
  measures: Array<{ measure: string; savingsPercent: number }>
): {
  totalSavingsPercent: number;
  savedKwh: number;
  savedTherms: number;
  savingsByCurrency: number;
  measures: Array<{ measure: string; savingsPercent: number; kwhSaved: number }>;
} => {
  const totalSavingsPercent = measures.reduce((sum, m) => sum + m.savingsPercent, 0);
  const electricitySavings =
    baseline.electricity.consumption * (totalSavingsPercent / 100);
  const gasSavings = baseline.naturalGas.consumption * (totalSavingsPercent / 100);
  const costSavings =
    electricitySavings * (baseline.electricity.cost / baseline.electricity.consumption) +
    gasSavings * (baseline.naturalGas.cost / baseline.naturalGas.consumption);

  return {
    totalSavingsPercent,
    savedKwh: electricitySavings,
    savedTherms: gasSavings,
    savingsByCurrency: costSavings,
    measures: measures.map((m) => ({
      ...m,
      kwhSaved: baseline.electricity.consumption * (m.savingsPercent / 100),
    })),
  };
};

// ============================================================================
// WASTE MANAGEMENT & RECYCLING - 5 FUNCTIONS
// ============================================================================

/**
 * Records waste stream data with categorization.
 *
 * @param {Partial<WasteStream>} data - Waste stream information
 * @returns {WasteStream} Recorded waste stream
 *
 * @example
 * ```typescript
 * const waste = recordWasteStream({
 *   propertyId: 'PROP-001',
 *   wasteType: 'paper',
 *   quantity: 10,
 *   disposalMethod: 'recycling'
 * });
 * ```
 */
export const recordWasteStream = (data: Partial<WasteStream>): WasteStream => ({
  id: data.id || `WASTE-${Date.now()}`,
  propertyId: data.propertyId!,
  wasteType: data.wasteType!,
  description: data.description || '',
  quantity: data.quantity!,
  unit: data.unit || 'metric_ton',
  disposalMethod: data.disposalMethod!,
  vendor: data.vendor,
  cost: data.cost || 0,
  recycleContent: data.recycleContent || 0,
  isHazardous: data.isHazardous || false,
  recordedDate: data.recordedDate || new Date(),
  fiscalYear: data.fiscalYear || new Date().getFullYear(),
});

/**
 * Calculates waste diversion rate and landfill reduction.
 *
 * @param {WasteStream[]} wasteStreams - All waste streams for period
 * @returns {object} Waste diversion metrics
 *
 * @example
 * ```typescript
 * const diversion = calculateWasteDiversion(wasteData);
 * ```
 */
export const calculateWasteDiversion = (wasteStreams: WasteStream[]): {
  totalWaste: number;
  divertedWaste: number;
  landfillWaste: number;
  diversionRate: number;
  costSavings: number;
} => {
  const totalWaste = wasteStreams.reduce((sum, w) => sum + w.quantity, 0);
  const divertedWaste = wasteStreams
    .filter((w) => w.disposalMethod !== 'landfill')
    .reduce((sum, w) => sum + w.quantity, 0);
  const landfillWaste = wasteStreams
    .filter((w) => w.disposalMethod === 'landfill')
    .reduce((sum, w) => sum + w.quantity, 0);
  const diversionRate = totalWaste > 0 ? (divertedWaste / totalWaste) * 100 : 0;
  const costSavings = wasteStreams
    .filter((w) => w.disposalMethod === 'recycling' || w.disposalMethod === 'donation')
    .reduce((sum, w) => sum + w.cost, 0);

  return {
    totalWaste,
    divertedWaste,
    landfillWaste,
    diversionRate: Math.round(diversionRate),
    costSavings,
  };
};

/**
 * Creates recycling program tracking record.
 *
 * @param {Partial<RecyclingProgram>} data - Program information
 * @returns {RecyclingProgram} Recycling program record
 *
 * @example
 * ```typescript
 * const program = createRecyclingProgram({
 *   propertyId: 'PROP-001',
 *   name: 'Comprehensive Recycling Initiative',
 *   wasteTypesIncluded: ['paper', 'plastic', 'glass']
 * });
 * ```
 */
export const createRecyclingProgram = (
  data: Partial<RecyclingProgram>
): RecyclingProgram => ({
  id: data.id || `RECYCLE-${Date.now()}`,
  propertyId: data.propertyId!,
  name: data.name!,
  status: data.status || 'active',
  wasteTypesIncluded: data.wasteTypesIncluded || [],
  recyclingRate: data.recyclingRate || 0,
  materialsDivertedFromLandfill: data.materialsDivertedFromLandfill || 0,
  annualSavings: data.annualSavings || 0,
  participantCount: data.participantCount,
  launchDate: data.launchDate || new Date(),
  targetRecyclingRate: data.targetRecyclingRate || 75,
});

/**
 * Analyzes waste composition and hazard levels.
 *
 * @param {WasteStream[]} wasteStreams - Waste streams to analyze
 * @returns {object} Composition and hazard analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeWasteComposition(wasteData);
 * ```
 */
export const analyzeWasteComposition = (
  wasteStreams: WasteStream[]
): {
  byType: Record<WasteType, number>;
  hazardousWaste: number;
  hazardousPercent: number;
  highestVolumeWaste: WasteType;
  costByWasteType: Record<WasteType, number>;
} => {
  const byType: Record<WasteType, number> = {} as Record<WasteType, number>;
  const costByType: Record<WasteType, number> = {} as Record<WasteType, number>;
  let hazardousTotal = 0;

  wasteStreams.forEach((w) => {
    byType[w.wasteType] = (byType[w.wasteType] || 0) + w.quantity;
    costByType[w.wasteType] = (costByType[w.wasteType] || 0) + w.cost;
    if (w.isHazardous) hazardousTotal += w.quantity;
  });

  const totalWaste = Object.values(byType).reduce((a, b) => a + b, 0);
  const highestVolume = Object.entries(byType).sort(([, a], [, b]) => b - a)[0]?.[0];

  return {
    byType,
    hazardousWaste: hazardousTotal,
    hazardousPercent: totalWaste > 0 ? (hazardousTotal / totalWaste) * 100 : 0,
    highestVolumeWaste: highestVolume as WasteType,
    costByWasteType: costByType,
  };
};

/**
 * Calculates cost avoidance from waste reduction initiatives.
 *
 * @param {WasteStream[]} baseline - Baseline waste streams
 * @param {WasteStream[]} current - Current waste streams
 * @param {number} landfillCostPerTon - Landfill disposal cost
 * @returns {object} Cost avoidance summary
 *
 * @example
 * ```typescript
 * const savings = calculateWasteCostAvoidance(baseline, current, 75);
 * ```
 */
export const calculateWasteCostAvoidance = (
  baseline: WasteStream[],
  current: WasteStream[],
  landfillCostPerTon: number
): {
  baselineWaste: number;
  currentWaste: number;
  reducedWaste: number;
  avoidedCosts: number;
  reductionPercent: number;
} => {
  const baselineTotal = baseline.reduce((sum, w) => sum + w.quantity, 0);
  const currentTotal = current.reduce((sum, w) => sum + w.quantity, 0);
  const reducedWaste = baselineTotal - currentTotal;
  const avoidedCosts = reducedWaste * landfillCostPerTon;

  return {
    baselineWaste: baselineTotal,
    currentWaste: currentTotal,
    reducedWaste,
    avoidedCosts: Math.max(0, avoidedCosts),
    reductionPercent: baselineTotal > 0 ? (reducedWaste / baselineTotal) * 100 : 0,
  };
};

// ============================================================================
// GREEN BUILDING CERTIFICATIONS - 4 FUNCTIONS
// ============================================================================

/**
 * Registers or updates green building certification.
 *
 * @param {Partial<GreenCertification>} data - Certification details
 * @returns {GreenCertification} Certification record
 *
 * @example
 * ```typescript
 * const cert = recordGreenCertification({
 *   propertyId: 'PROP-001',
 *   certificationName: 'LEED',
 *   certificationLevel: 'Gold',
 *   achievementScore: 75
 * });
 * ```
 */
export const recordGreenCertification = (
  data: Partial<GreenCertification>
): GreenCertification => ({
  id: data.id || `CERT-${Date.now()}`,
  propertyId: data.propertyId!,
  certificationName: data.certificationName!,
  certificationLevel: data.certificationLevel,
  certifyingBody: data.certifyingBody || '',
  issueDate: data.issueDate || new Date(),
  expirationDate: data.expirationDate,
  isActive: data.isActive !== false,
  achievementScore: data.achievementScore,
  scoreMetricType: data.scoreMetricType || 'percentage',
  totalScore: data.totalScore,
  certificationNumber: data.certificationNumber,
  auditDate: data.auditDate,
  nextAuditDue: data.nextAuditDue,
  costs: {
    applicationFee: data.costs?.applicationFee || 0,
    annualFee: data.costs?.annualFee || 0,
    auditFee: data.costs?.auditFee,
  },
});

/**
 * Evaluates progress toward certification requirements.
 *
 * @param {GreenCertification} cert - Certification record
 * @param {Record<string, number>} criteriaCompletion - Criterion completion status
 * @returns {object} Certification readiness assessment
 *
 * @example
 * ```typescript
 * const readiness = assessCertificationReadiness(cert, {
 *   'Energy Performance': 85,
 *   'Water Efficiency': 70
 * });
 * ```
 */
export const assessCertificationReadiness = (
  cert: GreenCertification,
  criteriaCompletion: Record<string, number>
): {
  criteria: Record<string, number>;
  overallReadiness: number;
  readyForCertification: boolean;
  gapsRemaining: Array<{ criterion: string; completionPercent: number }>;
} => {
  const values = Object.values(criteriaCompletion);
  const overallReadiness =
    values.length > 0 ? Math.round(values.reduce((a, b) => a + b) / values.length) : 0;

  const gaps = Object.entries(criteriaCompletion)
    .filter(([, percent]) => percent < 100)
    .map(([criterion, percent]) => ({ criterion, completionPercent: percent }));

  return {
    criteria: criteriaCompletion,
    overallReadiness,
    readyForCertification: overallReadiness >= 90,
    gapsRemaining: gaps,
  };
};

/**
 * Calculates certification maintenance and renewal costs.
 *
 * @param {GreenCertification[]} certifications - Active certifications
 * @param {number} yearsProjection - Years to project costs
 * @returns {object} Cost analysis and recommendations
 *
 * @example
 * ```typescript
 * const costs = calculateCertificationCosts(certs, 5);
 * ```
 */
export const calculateCertificationCosts = (
  certifications: GreenCertification[],
  yearsProjection: number = 1
): {
  annualCosts: number;
  projectedCosts: number;
  costByType: Record<string, number>;
  renewal: Array<{ cert: string; renewalDate: Date; cost: number }>;
} => {
  let annualCosts = 0;
  const costByType: Record<string, number> = {};

  certifications.forEach((c) => {
    const annualCost = (c.costs.annualFee || 0) + (c.costs.auditFee || 0) / 3;
    annualCosts += annualCost;
    costByType[c.certificationName] = annualCost;
  });

  const upcomingRenewals = certifications
    .filter((c) => c.expirationDate)
    .map((c) => ({
      cert: c.certificationName,
      renewalDate: c.expirationDate!,
      cost: (c.costs.applicationFee || 0) + (c.costs.annualFee || 0),
    }));

  return {
    annualCosts,
    projectedCosts: annualCosts * yearsProjection,
    costByType,
    renewal: upcomingRenewals,
  };
};

/**
 * Compares multiple certification standards and recommendations.
 *
 * @param {CertificationType[]} certifications - Certifications to compare
 * @param {object} propertyProfile - Property characteristics
 * @returns {Array<{cert: CertificationType; alignment: number; pros: string[]; cons: string[]}>}
 *
 * @example
 * ```typescript
 * const comparison = compareCertificationStandards(
 *   ['LEED', 'BREEAM', 'ENERGY_STAR'],
 *   { squareFeet: 100000, type: 'office' }
 * );
 * ```
 */
export const compareCertificationStandards = (
  certifications: CertificationType[],
  propertyProfile: { squareFeet: number; type: string }
): Array<{
  cert: CertificationType;
  alignment: number;
  pros: string[];
  cons: string[];
}> => {
  const alignmentScores: Record<CertificationType, number> = {
    LEED: propertyProfile.type === 'office' ? 95 : 70,
    BREEAM: propertyProfile.type === 'commercial' ? 90 : 75,
    ENERGY_STAR: 85,
    Green_Globes: 80,
    Fitwel: propertyProfile.type === 'office' ? 90 : 60,
    Living_Building_Challenge: 75,
    WELL: propertyProfile.type === 'office' ? 95 : 65,
    ISO_14001: 85,
    B_Corp: 70,
    Net_Zero_Ready: 80,
    Climate_Pledge_Arena: 65,
    Carbon_Trust: 75,
    SITES: propertyProfile.type === 'commercial' ? 80 : 70,
  };

  return certifications.map((cert) => ({
    cert,
    alignment: alignmentScores[cert] || 70,
    pros: [`Recognized standard for ${cert}`, 'Credible third-party validation'],
    cons: ['Costs associated', 'Audit requirements'],
  }));
};

// ============================================================================
// SUSTAINABILITY GOALS & TARGETS - 5 FUNCTIONS
// ============================================================================

/**
 * Creates a sustainability goal with progress tracking.
 *
 * @param {Partial<SustainabilityGoal>} data - Goal definition
 * @returns {SustainabilityGoal} Goal record
 *
 * @example
 * ```typescript
 * const goal = createSustainabilityGoal({
 *   propertyId: 'PROP-001',
 *   goalType: 'reduction',
 *   category: 'carbon_neutrality',
 *   targetValue: 50,
 *   targetUnit: 'percent',
 *   baselineValue: 100,
 *   baselineYear: 2020,
 *   deadline: new Date('2030-12-31')
 * });
 * ```
 */
export const createSustainabilityGoal = (
  data: Partial<SustainabilityGoal>
): SustainabilityGoal => ({
  id: data.id || `GOAL-${Date.now()}`,
  propertyId: data.propertyId!,
  goalType: data.goalType!,
  category: data.category!,
  description: data.description || '',
  targetValue: data.targetValue!,
  targetUnit: data.targetUnit!,
  baselineValue: data.baselineValue!,
  baselineYear: data.baselineYear!,
  deadline: data.deadline!,
  priority: data.priority || 'medium',
  status: data.status || 'proposed',
  scienceBasedTarget: data.scienceBasedTarget || false,
  alignmentWithSDGs: data.alignmentWithSDGs,
  owningDepartment: data.owningDepartment,
  progressCheckpoints: data.progressCheckpoints || [],
  currentProgress: data.currentProgress,
  completionPercentage: data.completionPercentage,
});

/**
 * Updates goal progress and calculates completion percentage.
 *
 * @param {SustainabilityGoal} goal - Goal to update
 * @param {number} currentValue - Current achievement value
 * @returns {SustainabilityGoal} Updated goal with progress
 *
 * @example
 * ```typescript
 * const updated = updateGoalProgress(goal, 45);
 * ```
 */
export const updateGoalProgress = (
  goal: SustainabilityGoal,
  currentValue: number
): SustainabilityGoal => {
  const targetReduction = Math.abs(goal.targetValue - goal.baselineValue);
  const currentReduction = Math.abs(goal.baselineValue - currentValue);
  const completionPercent =
    targetReduction > 0 ? Math.min(100, (currentReduction / targetReduction) * 100) : 0;

  return {
    ...goal,
    currentProgress: currentValue,
    completionPercentage: Math.round(completionPercent),
    progressCheckpoints: [
      ...goal.progressCheckpoints,
      {
        checkpointDate: new Date(),
        targetValue: goal.targetValue,
        actualValue: currentValue,
        percentComplete: Math.round(completionPercent),
        lastUpdated: new Date(),
      },
    ],
  };
};

/**
 * Evaluates goal achievement status with timeline analysis.
 *
 * @param {SustainabilityGoal} goal - Goal to evaluate
 * @returns {object} Achievement status and trajectory
 *
 * @example
 * ```typescript
 * const status = evaluateGoalStatus(goal);
 * ```
 */
export const evaluateGoalStatus = (
  goal: SustainabilityGoal
): {
  status: GoalStatus;
  trajectory: 'on_track' | 'at_risk' | 'off_track' | 'ahead_of_schedule';
  percentToTarget: number;
  yearsRemaining: number;
  recommendedActions: string[];
} => {
  const today = new Date();
  const yearsToDeadline =
    (goal.deadline.getTime() - today.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const percentComplete = goal.completionPercentage || 0;
  const expectedProgressByNow =
    yearsToDeadline > 0 ? 100 - (yearsToDeadline / 10) * 100 : 100;

  let trajectory: 'on_track' | 'at_risk' | 'off_track' | 'ahead_of_schedule';
  if (percentComplete > expectedProgressByNow + 10) {
    trajectory = 'ahead_of_schedule';
  } else if (percentComplete >= expectedProgressByNow - 10) {
    trajectory = 'on_track';
  } else if (percentComplete >= expectedProgressByNow - 25) {
    trajectory = 'at_risk';
  } else {
    trajectory = 'off_track';
  }

  const actions: string[] = [];
  if (trajectory === 'off_track') {
    actions.push('Escalate to management', 'Increase resources', 'Review implementation plan');
  } else if (trajectory === 'at_risk') {
    actions.push('Monitor progress closely', 'Adjust timeline if needed');
  }

  return {
    status: goal.status,
    trajectory,
    percentToTarget: percentComplete,
    yearsRemaining: Math.max(0, yearsToDeadline),
    recommendedActions: actions,
  };
};

/**
 * Calculates required progress pace to meet goals.
 *
 * @param {SustainabilityGoal} goal - Goal with deadline
 * @param {number} currentProgress - Current progress value
 * @returns {object} Required pacing and milestone schedule
 *
 * @example
 * ```typescript
 * const pacing = calculateRequiredPace(goal, 30);
 * ```
 */
export const calculateRequiredPace = (
  goal: SustainabilityGoal,
  currentProgress: number
): {
  requiredReductionPerMonth: number;
  requiredReductionPerQuarter: number;
  annualTarget: number;
  milestoneDates: Array<{ date: Date; targetValue: number }>;
} => {
  const today = new Date();
  const monthsRemaining =
    (goal.deadline.getFullYear() - today.getFullYear()) * 12 +
    (goal.deadline.getMonth() - today.getMonth());

  const remainingReduction = Math.abs(goal.targetValue - currentProgress);
  const requiredPerMonth = monthsRemaining > 0 ? remainingReduction / monthsRemaining : 0;
  const requiredPerQuarter = requiredPerMonth * 3;
  const annualTarget = requiredPerMonth * 12;

  const milestones: Array<{ date: Date; targetValue: number }> = [];
  for (let i = 1; i <= 4; i++) {
    const milestoneDate = new Date(today);
    milestoneDate.setMonth(milestoneDate.getMonth() + Math.floor(monthsRemaining / 4) * i);
    milestones.push({
      date: milestoneDate,
      targetValue: currentProgress + remainingReduction * (i / 4),
    });
  }

  return {
    requiredReductionPerMonth: Math.round(requiredPerMonth * 100) / 100,
    requiredReductionPerQuarter: Math.round(requiredPerQuarter * 100) / 100,
    annualTarget: Math.round(annualTarget * 100) / 100,
    milestoneDates: milestones,
  };
};

/**
 * Compares goal alignment with UN Sustainable Development Goals.
 *
 * @param {SustainabilityGoal[]} goals - Portfolio of sustainability goals
 * @returns {Record<string, SustainabilityGoal[]>} Goals mapped to SDGs
 *
 * @example
 * ```typescript
 * const sdgAlignment = alignWithSDGs(goals);
 * ```
 */
export const alignWithSDGs = (
  goals: SustainabilityGoal[]
): Record<string, SustainabilityGoal[]> => {
  const sdgMap: Record<string, SustainabilityGoal[]> = {
    'SDG 7 - Affordable and Clean Energy': [],
    'SDG 12 - Responsible Consumption': [],
    'SDG 13 - Climate Action': [],
    'SDG 15 - Life on Land': [],
    'SDG 6 - Clean Water': [],
  };

  goals.forEach((goal) => {
    const alignments = goal.alignmentWithSDGs || [];
    alignments.forEach((sdg) => {
      if (sdgMap[sdg]) {
        sdgMap[sdg].push(goal);
      }
    });
  });

  return sdgMap;
};

// ============================================================================
// ENVIRONMENTAL COMPLIANCE & AUDITS - 5 FUNCTIONS
// ============================================================================

/**
 * Registers environmental compliance requirement.
 *
 * @param {Partial<EnvironmentalCompliance>} data - Compliance details
 * @returns {EnvironmentalCompliance} Compliance record
 *
 * @example
 * ```typescript
 * const compliance = recordCompliance({
 *   propertyId: 'PROP-001',
 *   regulationType: 'emissions_reporting',
 *   requirement: 'Annual greenhouse gas emissions disclosure',
 *   deadline: new Date('2024-12-31')
 * });
 * ```
 */
export const recordCompliance = (
  data: Partial<EnvironmentalCompliance>
): EnvironmentalCompliance => ({
  id: data.id || `COMP-${Date.now()}`,
  propertyId: data.propertyId!,
  regulationType: data.regulationType!,
  jurisdiction: data.jurisdiction || '',
  requirement: data.requirement!,
  deadline: data.deadline!,
  status: data.status || 'in_progress',
  percentComplete: data.percentComplete || 0,
  riskLevel: data.riskLevel || 'medium',
  responsibleParty: data.responsibleParty,
  requiredDocumentation: data.requiredDocumentation || [],
  submissionDate: data.submissionDate,
  lastAuditDate: data.lastAuditDate,
  nextAuditDue: data.nextAuditDue,
  associatedCosts: data.associatedCosts,
  notes: data.notes,
});

/**
 * Schedules and tracks environmental audits.
 *
 * @param {Partial<EnvironmentalAudit>} data - Audit details
 * @returns {EnvironmentalAudit} Audit record
 *
 * @example
 * ```typescript
 * const audit = scheduleAudit({
 *   propertyId: 'PROP-001',
 *   auditType: 'energy_audit',
 *   auditedBy: 'Certified Auditor'
 * });
 * ```
 */
export const scheduleAudit = (data: Partial<EnvironmentalAudit>): EnvironmentalAudit => {
  const nextAudit = new Date();
  nextAudit.setFullYear(nextAudit.getFullYear() + 1);

  return {
    id: data.id || `AUDIT-${Date.now()}`,
    propertyId: data.propertyId!,
    auditType: data.auditType!,
    auditDate: data.auditDate || new Date(),
    auditedBy: data.auditedBy!,
    findings: data.findings || [],
    overallRating: data.overallRating || 'satisfactory',
    nonConformances: data.nonConformances || 0,
    correctiveActions: data.correctiveActions || [],
    nextAuditDue: data.nextAuditDue || nextAudit,
    report: data.report,
  };
};

/**
 * Calculates compliance risk and prioritizes requirements.
 *
 * @param {EnvironmentalCompliance[]} requirements - All compliance requirements
 * @returns {object} Risk analysis and prioritization matrix
 *
 * @example
 * ```typescript
 * const riskAnalysis = analyzeComplianceRisk(requirements);
 * ```
 */
export const analyzeComplianceRisk = (
  requirements: EnvironmentalCompliance[]
): {
  criticalItems: EnvironmentalCompliance[];
  atRiskCount: number;
  overallRisk: 'high' | 'medium' | 'low';
  recommendedPriorities: Array<{
    requirement: string;
    daysUntilDeadline: number;
    riskLevel: string;
  }>;
} => {
  const today = new Date();
  const criticalItems = requirements.filter((r) => r.riskLevel === 'critical');
  const atRiskItems = requirements.filter(
    (r) =>
      (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000) < 90 &&
      r.status !== 'compliant'
  );

  const overallRisk =
    criticalItems.length > 0 ? 'high' : atRiskItems.length > 0 ? 'medium' : 'low';

  const priorities = requirements
    .filter((r) => r.status !== 'compliant')
    .map((r) => ({
      requirement: r.requirement,
      daysUntilDeadline: Math.ceil(
        (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
      ),
      riskLevel: r.riskLevel,
    }))
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
    .slice(0, 5);

  return {
    criticalItems,
    atRiskCount: atRiskItems.length,
    overallRisk,
    recommendedPriorities: priorities,
  };
};

/**
 * Tracks audit findings and corrective action progress.
 *
 * @param {EnvironmentalAudit} audit - Completed audit
 * @param {AuditFinding[]} updatedFindings - Finding updates with completion status
 * @returns {EnvironmentalAudit} Updated audit record
 *
 * @example
 * ```typescript
 * const updated = updateAuditFindings(audit, findings);
 * ```
 */
export const updateAuditFindings = (
  audit: EnvironmentalAudit,
  updatedFindings: AuditFinding[]
): EnvironmentalAudit => {
  const completedActions = updatedFindings.filter((f) => f.completionDate).length;
  const remainingActions = updatedFindings.filter((f) => !f.completionDate).length;

  return {
    ...audit,
    findings: updatedFindings,
    nonConformances: updatedFindings.filter((f) => f.severity === 'critical' || f.severity === 'major').length,
    correctiveActions: updatedFindings
      .filter((f) => f.correctionRequired)
      .map((f) => `${f.description} - ${f.completionDate ? 'Completed' : 'In Progress'}`),
  };
};

/**
 * Generates compliance calendar with deadline tracking.
 *
 * @param {EnvironmentalCompliance[]} requirements - Compliance requirements
 * @param {number} months - Number of months to project
 * @returns {object} Calendar of upcoming deadlines
 *
 * @example
 * ```typescript
 * const calendar = generateComplianceCalendar(requirements, 12);
 * ```
 */
export const generateComplianceCalendar = (
  requirements: EnvironmentalCompliance[],
  months: number = 12
): {
  calendar: Record<string, EnvironmentalCompliance[]>;
  upcomingDeadlines: Array<{ requirement: string; deadline: Date; daysRemaining: number }>;
  overduDeadlines: EnvironmentalCompliance[];
} => {
  const calendar: Record<string, EnvironmentalCompliance[]> = {};
  const today = new Date();

  requirements.forEach((req) => {
    const monthKey = `${req.deadline.getFullYear()}-${String(req.deadline.getMonth() + 1).padStart(2, '0')}`;
    if (!calendar[monthKey]) calendar[monthKey] = [];
    calendar[monthKey].push(req);
  });

  const upcomingDeadlines = requirements
    .filter(
      (r) =>
        r.deadline >= today &&
        (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000) <= months * 30
    )
    .map((r) => ({
      requirement: r.requirement,
      deadline: r.deadline,
      daysRemaining: Math.ceil(
        (r.deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
      ),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const overdue = requirements.filter(
    (r) => r.deadline < today && r.status !== 'compliant'
  );

  return {
    calendar,
    upcomingDeadlines,
    overduDeadlines: overdue,
  };
};

// ============================================================================
// RENEWABLE ENERGY INTEGRATION - 5 FUNCTIONS
// ============================================================================

/**
 * Records renewable energy system installation and performance.
 *
 * @param {Partial<RenewableEnergySystem>} data - System details
 * @returns {RenewableEnergySystem} System record
 *
 * @example
 * ```typescript
 * const solar = recordRenewableSystem({
 *   propertyId: 'PROP-001',
 *   systemType: 'solar_pv',
 *   capacity: 50,
 *   annualProduction: 65000
 * });
 * ```
 */
export const recordRenewableSystem = (
  data: Partial<RenewableEnergySystem>
): RenewableEnergySystem => ({
  id: data.id || `RENEW-${Date.now()}`,
  propertyId: data.propertyId!,
  systemType: data.systemType!,
  capacity: data.capacity!,
  installedDate: data.installedDate || new Date(),
  status: data.status || 'operational',
  annualProduction: data.annualProduction!,
  actualProduction: data.actualProduction,
  performanceRatio: data.performanceRatio,
  investmentCost: data.investmentCost,
  incentivesReceived: data.incentivesReceived,
  paybackPeriod: data.paybackPeriod,
  lifespan: data.lifespan || 25,
  monitoring: {
    realtime: data.monitoring?.realtime || false,
    lastUpdate: data.monitoring?.lastUpdate || new Date(),
    currentOutput: data.monitoring?.currentOutput,
  },
});

/**
 * Calculates renewable energy return on investment and payback.
 *
 * @param {RenewableEnergySystem} system - Renewable system
 * @param {number} electricityRate - $/kWh rate
 * @returns {object} Financial analysis
 *
 * @example
 * ```typescript
 * const roi = calculateRenewableROI(solar, 0.12);
 * ```
 */
export const calculateRenewableROI = (
  system: RenewableEnergySystem,
  electricityRate: number
): {
  annualProduction: number;
  annualSavings: number;
  investmentCost: number;
  netInvestment: number;
  paybackPeriod: number;
  roi: number;
  npv25Year: number;
} => {
  const annualProduction = system.actualProduction || system.annualProduction;
  const annualSavings = annualProduction * electricityRate;
  const investment = system.investmentCost || 0;
  const incentives = system.incentivesReceived || 0;
  const netInvestment = investment - incentives;
  const payback = netInvestment > 0 ? netInvestment / Math.max(annualSavings, 0.01) : 0;
  const roi = (annualSavings / Math.max(netInvestment, 1)) * 100;
  const npv = annualSavings * 25 - netInvestment;

  return {
    annualProduction,
    annualSavings: Math.round(annualSavings),
    investmentCost: investment,
    netInvestment,
    paybackPeriod: Math.round(payback * 10) / 10,
    roi: Math.round(roi),
    npv25Year: npv,
  };
};

/**
 * Configures grid integration and demand response capabilities.
 *
 * @param {Partial<GridIntegration>} data - Grid settings
 * @returns {GridIntegration} Grid integration record
 *
 * @example
 * ```typescript
 * const gridIntegration = configureGridIntegration({
 *   propertyId: 'PROP-001',
 *   exportCapability: true,
 *   demandResponseParticipation: true
 * });
 * ```
 */
export const configureGridIntegration = (
  data: Partial<GridIntegration>
): GridIntegration => ({
  propertyId: data.propertyId!,
  exportCapability: data.exportCapability || false,
  gridConnected: data.gridConnected || false,
  netMeteringAvailable: data.netMeteringAvailable || false,
  demandResponseParticipation: data.demandResponseParticipation || false,
  virtualPowerPlantMember: data.virtualPowerPlantMember || false,
  microGridParticipation: data.microGridParticipation || false,
  peakShavingCapability: data.peakShavingCapability || 0,
  demandFlexibilityScore: data.demandFlexibilityScore,
  gridServicesRevenue: data.gridServicesRevenue,
});

/**
 * Projects renewable energy generation with weather and performance factors.
 *
 * @param {RenewableEnergySystem} system - System configuration
 * @param {number} yearsAhead - Years to project
 * @param {number} performanceDegradation - Annual performance loss percentage
 * @returns {number[]} Projected annual production
 *
 * @example
 * ```typescript
 * const projections = projectRenewableGeneration(solar, 25, 0.005);
 * ```
 */
export const projectRenewableGeneration = (
  system: RenewableEnergySystem,
  yearsAhead: number,
  performanceDegradation: number = 0.005
): number[] => {
  const projections: number[] = [];
  let currentProduction = system.annualProduction;

  for (let i = 0; i < yearsAhead; i++) {
    currentProduction = currentProduction * (1 - performanceDegradation);
    projections.push(Math.max(0, currentProduction));
  }

  return projections;
};

/**
 * Optimizes renewable energy utilization with battery storage modeling.
 *
 * @param {RenewableEnergySystem} renewable - Renewable system
 * @param {number} storageCapacity - Battery storage in kWh
 * @param {number} consumptionProfile - Average hourly consumption
 * @returns {object} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = optimizeRenewableUtilization(solar, 200, 10);
 * ```
 */
export const optimizeRenewableUtilization = (
  renewable: RenewableEnergySystem,
  storageCapacity: number,
  consumptionProfile: number
): {
  selfConsumptionRate: number;
  gridExportCapacity: number;
  storageRecommendation: number;
  optimizedSchedule: string;
  peakShavingPotential: number;
} => {
  const annualProduction = renewable.annualProduction;
  const avgHourlyProduction = annualProduction / 8760;
  const selfConsumptionRate = Math.min(100, (consumptionProfile / Math.max(avgHourlyProduction, 1)) * 100);
  const gridExport = Math.max(0, avgHourlyProduction - consumptionProfile);
  const recommendedStorage = Math.max(0, (gridExport * 4 - storageCapacity) * 8);
  const peakShaving = Math.min(gridExport, storageCapacity / 4);

  return {
    selfConsumptionRate: Math.round(selfConsumptionRate),
    gridExportCapacity: Math.round(gridExport),
    storageRecommendation: Math.round(recommendedStorage),
    optimizedSchedule: `Store excess during peak production (${avgHourlyProduction > consumptionProfile ? 'Daytime' : 'Nighttime'}), discharge during high consumption`,
    peakShavingPotential: Math.round(peakShaving),
  };
};

// ============================================================================
// SUSTAINABILITY REPORTING & ESG - 6 FUNCTIONS
// ============================================================================

/**
 * Creates comprehensive sustainability report structure.
 *
 * @param {Partial<SustainabilityReport>} data - Report details
 * @returns {SustainabilityReport} Report skeleton
 *
 * @example
 * ```typescript
 * const report = initiateSustainabilityReport({
 *   propertyId: 'PROP-001',
 *   reportingYear: 2024,
 *   reportType: 'annual_sustainability',
 *   frameworksUsed: ['GRI', 'SASB']
 * });
 * ```
 */
export const initiateSustainabilityReport = (
  data: Partial<SustainabilityReport>
): SustainabilityReport => ({
  id: data.id || `REPORT-${Date.now()}`,
  propertyId: data.propertyId,
  portfolioId: data.portfolioId,
  reportingYear: data.reportingYear || new Date().getFullYear(),
  reportType: data.reportType!,
  frameworksUsed: data.frameworksUsed || [],
  sections: data.sections || [],
  environmentalMetrics: data.environmentalMetrics || {
    carboneFootprint: 0,
    energyConsumption: 0,
    renewableEnergyPercentage: 0,
    waterConsumption: 0,
    wasteGenerated: 0,
    wasteRecycled: 0,
    wasteRecyclingRate: 0,
    hazardousWaste: 0,
  },
  socialMetrics: data.socialMetrics,
  governanceMetrics: data.governanceMetrics,
  stakeholderEngagement: data.stakeholderEngagement,
  assuranceLevel: data.assuranceLevel,
  externalAssurance: data.externalAssurance || false,
  assuranceProvider: data.assuranceProvider,
});

/**
 * Calculates ESG (Environmental, Social, Governance) score.
 *
 * @param {EnvironmentalMetrics} env - Environmental metrics
 * @param {SocialMetrics} social - Social metrics
 * @param {GovernanceMetrics} gov - Governance metrics
 * @returns {ESGScore} Composite ESG score
 *
 * @example
 * ```typescript
 * const esgScore = calculateESGScore(envMetrics, socialMetrics, govMetrics);
 * ```
 */
export const calculateESGScore = (
  env: EnvironmentalMetrics,
  social?: SocialMetrics,
  gov?: GovernanceMetrics
): Omit<ESGScore, 'propertyId' | 'portfolioId'> => {
  // Environmental scoring (0-100)
  const energyScore = Math.min(100, ((env.renewableEnergyPercentage || 0) / 100) * 100);
  const wasteScore = Math.min(100, (env.wasteRecyclingRate || 0));
  const environmentalScore = Math.round((energyScore + wasteScore) / 2);

  // Social scoring (0-100)
  const socialScore = Math.round(
    ((social?.femaleLeadershipPercentage || 50) / 100) * 50 +
    ((social?.communityInvestment || 0) > 0 ? 50 : 0)
  );

  // Governance scoring (0-100)
  const govScore = Math.round(
    ((gov?.boardDiversity || 50) / 100) * 50 +
    (gov?.whistleblowerMechanismInPlace ? 50 : 0)
  );

  const overallScore = Math.round(
    (environmentalScore * 0.5 + socialScore * 0.25 + govScore * 0.25)
  );

  return {
    evaluationDate: new Date(),
    overallScore,
    environmentalScore,
    socialScore,
    governanceScore: govScore,
    improvementAreas: [],
    strengths: [],
  };
};

/**
 * Generates ESG report with benchmarking.
 *
 * @param {ESGScore} score - ESG score
 * @param {object} benchmarks - Industry benchmarks
 * @returns {object} ESG report with comparisons
 *
 * @example
 * ```typescript
 * const report = generateESGBenchmarkReport(score, benchmarks);
 * ```
 */
export const generateESGBenchmarkReport = (
  score: ESGScore,
  benchmarks: { industryAverage: number; peerAverage: number; topQuartile: number }
): {
  score: ESGScore;
  benchmarks: Record<string, number>;
  performanceGap: Record<string, number>;
  percentile: number;
  recommendations: string[];
} => {
  const gap = {
    overall: benchmarks.industryAverage - score.overallScore,
    environmental:
      benchmarks.industryAverage - score.environmentalScore,
    social: benchmarks.industryAverage - score.socialScore,
    governance: benchmarks.industryAverage - score.governanceScore,
  };

  const recommendations: string[] = [];
  if (gap.environmental > 10) {
    recommendations.push('Strengthen environmental initiatives to meet industry standards');
  }
  if (gap.social > 10) {
    recommendations.push('Enhance social responsibility programs');
  }
  if (gap.governance > 10) {
    recommendations.push('Improve governance structures and transparency');
  }

  const percentile = Math.round(
    ((benchmarks.topQuartile - score.overallScore) /
      (benchmarks.topQuartile - benchmarks.industryAverage)) *
    100
  );

  return {
    score,
    benchmarks: {
      industryAverage: benchmarks.industryAverage,
      peerAverage: benchmarks.peerAverage,
      topQuartile: benchmarks.topQuartile,
    },
    performanceGap: gap,
    percentile: Math.max(0, Math.min(100, percentile)),
    recommendations,
  };
};

/**
 * Maps metrics to reporting frameworks (GRI, SASB, TCFD, etc.).
 *
 * @param {EnvironmentalMetrics} metrics - Environmental metrics
 * @param {ReportingFramework[]} frameworks - Frameworks to map to
 * @returns {Record<string, Record<string, unknown>>} Framework-mapped metrics
 *
 * @example
 * ```typescript
 * const mapped = mapMetricsToFrameworks(metrics, ['GRI', 'SASB']);
 * ```
 */
export const mapMetricsToFrameworks = (
  metrics: EnvironmentalMetrics,
  frameworks: ReportingFramework[]
): Record<string, Record<string, unknown>> => {
  const mappings: Record<string, Record<string, unknown>> = {};

  frameworks.forEach((framework) => {
    if (framework === 'GRI') {
      mappings.GRI = {
        '305-1': metrics.scope1Emissions || 0,
        '305-2': metrics.scope2Emissions || 0,
        '306-3': metrics.wasteGenerated,
        '303-3': metrics.waterConsumption,
      };
    } else if (framework === 'SASB') {
      mappings.SASB = {
        'Energy_Management': metrics.energyConsumption,
        'GHG_Emissions': metrics.carboneFootprint,
        'Waste_Hazardous_Materials': metrics.hazardousWaste,
      };
    } else if (framework === 'TCFD') {
      mappings.TCFD = {
        'Scope 1': 0,
        'Scope 2': 0,
        'Climate Risks': 'To be assessed',
      };
    }
  });

  return mappings;
};

/**
 * Calculates materiality assessment for sustainability reporting.
 *
 * @param {Record<string, number>} metrics - All potential metrics
 * @param {Record<string, number>} stakeholderPriority - Stakeholder priorities (0-100)
 * @param {Record<string, number>} businessImpact - Business impact scores (0-100)
 * @returns {object} Materiality matrix and priorities
 *
 * @example
 * ```typescript
 * const materiality = assessMateriality(metrics, priorities, impacts);
 * ```
 */
export const assessMateriality = (
  metrics: Record<string, number>,
  stakeholderPriority: Record<string, number>,
  businessImpact: Record<string, number>
): {
  materialTopics: Array<{
    topic: string;
    materiality: number;
    stakeholderConcern: number;
    businessImpact: number;
  }>;
  reportingPriority: Array<{
    topic: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>;
} => {
  const materialTopics = Object.keys(metrics).map((topic) => {
    const stakeholderScore = stakeholderPriority[topic] || 0;
    const impactScore = businessImpact[topic] || 0;
    const materiality = (stakeholderScore + impactScore) / 2;

    return {
      topic,
      materiality,
      stakeholderConcern: stakeholderScore,
      businessImpact: impactScore,
    };
  });

  const sorted = materialTopics.sort((a, b) => b.materiality - a.materiality);

  const reportingPriority = sorted.map(({ topic, materiality }) => {
    let priority: 'critical' | 'high' | 'medium' | 'low';
    if (materiality >= 80) priority = 'critical';
    else if (materiality >= 60) priority = 'high';
    else if (materiality >= 40) priority = 'medium';
    else priority = 'low';

    return { topic, priority };
  });

  return {
    materialTopics: sorted,
    reportingPriority,
  };
};

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS - 2 FUNCTIONS
// ============================================================================

/**
 * Generates sustainability performance dashboard metrics.
 *
 * @param {CarbonFootprint} carbon - Carbon footprint data
 * @param {EnergyConsumptionMetric} energy - Energy metrics
 * @param {WaterUsageMetric} water - Water metrics
 * @returns {object} Unified sustainability dashboard
 *
 * @example
 * ```typescript
 * const dashboard = generateSustainabilityDashboard(carbon, energy, water);
 * ```
 */
export const generateSustainabilityDashboard = (
  carbon: Omit<CarbonFootprint, 'id' | 'propertyId'>,
  energy: EnergyConsumptionMetric,
  water: WaterUsageMetric
): {
  totalCarbonFootprint: number;
  renewableEnergyPercent: number;
  waterEfficiency: number;
  costSavings: number;
  trendDirection: 'improving' | 'stable' | 'worsening';
  keyMetrics: Record<string, number>;
} => {
  const renewablePercent = (energy.electricity.renewable / energy.electricity.consumption) * 100;
  const waterBenchmark = 50000;
  const waterEfficiency = Math.min(100, ((waterBenchmark - water.totalWaterUsage) / waterBenchmark) * 100);

  return {
    totalCarbonFootprint: Math.round(carbon.netEmissions),
    renewableEnergyPercent: Math.round(renewablePercent),
    waterEfficiency: Math.max(0, Math.round(waterEfficiency)),
    costSavings: Math.round(energy.electricity.cost * 0.1 + water.cost * 0.15),
    trendDirection: 'improving',
    keyMetrics: {
      carbonIntensity: carbon.intensity,
      energyIntensity: energy.energyIntensity,
      waterIntensity: water.waterIntensity,
      offsetsApplied: carbon.offsetsApplied,
    },
  };
};

/**
 * Exports sustainability data in standard formats for reporting.
 *
 * @param {SustainabilityReport} report - Complete report
 * @param {string} format - Export format ('json' | 'csv' | 'pdf_ready')
 * @returns {string} Formatted report data
 *
 * @example
 * ```typescript
 * const exported = exportSustainabilityReport(report, 'json');
 * ```
 */
export const exportSustainabilityReport = (
  report: SustainabilityReport,
  format: 'json' | 'csv' | 'pdf_ready' = 'json'
): string => {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  } else if (format === 'csv') {
    const headers = [
      'Report Type',
      'Year',
      'Carbon Footprint',
      'Energy Consumption',
      'Water Consumption',
      'Waste Generated',
      'Recycling Rate',
    ];
    const values = [
      report.reportType,
      report.reportingYear,
      report.environmentalMetrics.carboneFootprint,
      report.environmentalMetrics.energyConsumption,
      report.environmentalMetrics.waterConsumption,
      report.environmentalMetrics.wasteGenerated,
      report.environmentalMetrics.wasteRecyclingRate,
    ];
    return `${headers.join(',')}\n${values.join(',')}`;
  } else {
    // PDF-ready format
    return `
SUSTAINABILITY REPORT ${report.reportingYear}
=====================================
Report Type: ${report.reportType}
Frameworks: ${report.frameworksUsed.join(', ')}

ENVIRONMENTAL METRICS
Carbon Footprint: ${report.environmentalMetrics.carboneFootprint} metric tons CO2e
Energy Consumption: ${report.environmentalMetrics.energyConsumption} kWh
Water Usage: ${report.environmentalMetrics.waterConsumption} gallons
Waste Generated: ${report.environmentalMetrics.wasteGenerated} tons
Recycling Rate: ${report.environmentalMetrics.wasteRecyclingRate}%
    `.trim();
  }
};

export default {
  calculateCarbonFootprint,
  convertEnergyToCO2,
  recordCarbonOffset,
  calculateCarbonIntensity,
  projectCarbonEmissions,
  createEnergyMetric,
  createWaterMetric,
  detectEnergyAnomalies,
  calculateWaterConservationPotential,
  estimateEnergySavings,
  recordWasteStream,
  calculateWasteDiversion,
  createRecyclingProgram,
  analyzeWasteComposition,
  calculateWasteCostAvoidance,
  recordGreenCertification,
  assessCertificationReadiness,
  calculateCertificationCosts,
  compareCertificationStandards,
  createSustainabilityGoal,
  updateGoalProgress,
  evaluateGoalStatus,
  calculateRequiredPace,
  alignWithSDGs,
  recordCompliance,
  scheduleAudit,
  analyzeComplianceRisk,
  updateAuditFindings,
  generateComplianceCalendar,
  recordRenewableSystem,
  calculateRenewableROI,
  configureGridIntegration,
  projectRenewableGeneration,
  optimizeRenewableUtilization,
  initiateSustainabilityReport,
  calculateESGScore,
  generateESGBenchmarkReport,
  mapMetricsToFrameworks,
  assessMateriality,
  generateSustainabilityDashboard,
  exportSustainabilityReport,
};
