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
interface CarbonFootprint {
    id: string;
    propertyId: string;
    period: DateRange;
    totalEmissions: number;
    scope1Emissions: number;
    scope2Emissions: number;
    scope3Emissions: number;
    bySource: Record<EmissionSource, number>;
    offsetsApplied: number;
    netEmissions: number;
    intensity: number;
    baselineComparison?: {
        change: number;
        percentChange: number;
    };
    lastCalculated: Date;
}
type EmissionSource = 'natural_gas' | 'electricity' | 'water' | 'waste' | 'refrigerants' | 'commuting' | 'fuel_oil' | 'propane' | 'purchased_steam' | 'business_travel';
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
    vintage: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
    verificationStandard: 'VCS' | 'Gold Standard' | 'CDM' | 'ACR' | 'CAR' | 'other';
    retirementDate: Date;
    isRetired: boolean;
    metadata?: Record<string, unknown>;
}
type OffsetType = 'renewable_energy' | 'methane_capture' | 'reforestation' | 'energy_efficiency' | 'carbon_capture' | 'biomass_energy' | 'avoided_deforestation';
interface EnergyConsumptionMetric {
    propertyId: string;
    period: DateRange;
    electricity: {
        consumption: number;
        cost: number;
        renewable: number;
        renewablePercent: number;
    };
    naturalGas: {
        consumption: number;
        cost: number;
    };
    otherFuels: Array<{
        type: string;
        consumption: number;
        unit: string;
        cost: number;
    }>;
    totalEnergyUsage: number;
    energyIntensity: number;
}
interface WaterUsageMetric {
    propertyId: string;
    period: DateRange;
    freshWaterConsumption: number;
    recycledWaterUsage: number;
    rainwaterHarvested: number;
    totalWaterUsage: number;
    waterIntensity: number;
    wasteWaterGenerated: number;
    waterTreatedOnsite: boolean;
    waterReuseRate: number;
    cost: number;
}
interface WasteStream {
    id: string;
    propertyId: string;
    wasteType: WasteType;
    description: string;
    quantity: number;
    unit: 'metric_ton' | 'cubic_yard' | 'gallon';
    disposalMethod: DisposalMethod;
    vendor?: string;
    cost: number;
    recycleContent: number;
    isHazardous: boolean;
    recordedDate: Date;
    fiscalYear: number;
}
type WasteType = 'general_waste' | 'organic' | 'paper' | 'cardboard' | 'plastic' | 'glass' | 'metal' | 'wood' | 'construction_demolition' | 'hazardous' | 'electronic' | 'mixed_recycling';
type DisposalMethod = 'landfill' | 'recycling' | 'composting' | 'incineration' | 'hazmat_facility' | 'donation' | 'resale';
interface RecyclingProgram {
    id: string;
    propertyId: string;
    name: string;
    status: ProgramStatus;
    wasteTypesIncluded: WasteType[];
    recyclingRate: number;
    materialsDivertedFromLandfill: number;
    annualSavings: number;
    participantCount?: number;
    launchDate: Date;
    targetRecyclingRate: number;
}
type ProgramStatus = 'planned' | 'active' | 'suspended' | 'completed' | 'discontinued';
interface GreenCertification {
    id: string;
    propertyId: string;
    certificationName: CertificationType;
    certificationLevel?: CertificationLevel;
    certifyingBody: string;
    issueDate: Date;
    expirationDate?: Date;
    isActive: boolean;
    achievementScore?: number;
    scoreMetricType?: 'percentage' | 'points' | 'stars';
    totalScore?: number;
    certificationNumber?: string;
    auditDate?: Date;
    nextAuditDue?: Date;
    costs: {
        applicationFee: number;
        annualFee: number;
        auditFee?: number;
    };
}
type CertificationType = 'LEED' | 'BREEAM' | 'ENERGY_STAR' | 'Green_Globes' | 'Fitwel' | 'Living_Building_Challenge' | 'WELL' | 'ISO_14001' | 'B_Corp' | 'Net_Zero_Ready' | 'Climate_Pledge_Arena' | 'Carbon_Trust' | 'SITES';
type CertificationLevel = 'Certified' | 'Silver' | 'Gold' | 'Platinum' | '1_Star' | '2_Star' | '3_Star' | '4_Star' | '5_Star';
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
    alignmentWithSDGs?: string[];
    owningDepartment?: string;
    progressCheckpoints: ProgressCheckpoint[];
    currentProgress?: number;
    completionPercentage?: number;
}
type GoalType = 'reduction' | 'increase' | 'achievement' | 'transition';
type GoalCategory = 'carbon_neutrality' | 'renewable_energy' | 'water_conservation' | 'waste_diversion' | 'energy_efficiency' | 'green_building' | 'sustainable_procurement' | 'biodiversity' | 'community_engagement';
type GoalStatus = 'proposed' | 'approved' | 'in_progress' | 'at_risk' | 'achieved' | 'cancelled' | 'on_hold';
interface ProgressCheckpoint {
    checkpointDate: Date;
    targetValue: number;
    actualValue: number;
    percentComplete: number;
    notes?: string;
    lastUpdated: Date;
}
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
type RegulationType = 'emissions_reporting' | 'energy_audit' | 'water_disclosure' | 'waste_management' | 'hazardous_materials' | 'environmental_impact' | 'building_code' | 'air_quality' | 'soil_protection' | 'noise_control' | 'climate_action' | 'disclosure_requirement';
type ComplianceStatus = 'compliant' | 'in_progress' | 'non_compliant' | 'pending_review' | 'waiver_applied' | 'extension_granted';
interface EnvironmentalAudit {
    id: string;
    propertyId: string;
    auditType: AuditType;
    auditDate: Date;
    auditedBy: string;
    findings: Audit;
}
type AuditType = 'internal_environmental' | 'third_party_certification' | 'regulatory_inspection' | 'sustainability_assessment' | 'energy_audit' | 'water_audit' | 'waste_audit';
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
interface RenewableEnergySystem {
    id: string;
    propertyId: string;
    systemType: RenewableType;
    capacity: number;
    installedDate: Date;
    status: 'operational' | 'planned' | 'under_maintenance' | 'decommissioned';
    annualProduction: number;
    actualProduction?: number;
    performanceRatio?: number;
    investmentCost?: number;
    incentivesReceived?: number;
    paybackPeriod?: number;
    lifespan: number;
    monitoring: {
        realtime: boolean;
        lastUpdate: Date;
        currentOutput?: number;
    };
}
type RenewableType = 'solar_pv' | 'solar_thermal' | 'wind' | 'geothermal' | 'biomass' | 'hydro' | 'micro_hydro' | 'battery_storage' | 'virtual_power_plant' | 'district_energy';
interface GridIntegration {
    propertyId: string;
    exportCapability: boolean;
    gridConnected: boolean;
    netMeteringAvailable: boolean;
    demandResponseParticipation: boolean;
    virtualPowerPlantMember?: boolean;
    microGridParticipation?: boolean;
    peakShavingCapability: number;
    demandFlexibilityScore?: number;
    gridServicesRevenue?: number;
}
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
type ReportType = 'annual_sustainability' | 'esg' | 'carbon_footprint' | 'environmental_disclosure' | 'integrated_report' | 'climate_action_plan' | 'gender_equality_report';
type ReportingFramework = 'GRI' | 'SASB' | 'TCFD' | 'CDSB' | 'CDP' | 'Science_Based_Targets' | 'B_Impact_Assessment' | 'IRIS+';
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
    overallScore: number;
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
export declare const calculateCarbonFootprint: (emissions: Record<EmissionSource, number>, offsetQuantity?: number) => Omit<CarbonFootprint, "id" | "propertyId">;
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
export declare const convertEnergyToCO2: (energyType: string, quantity: number, unit: string, region: string) => number;
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
export declare const recordCarbonOffset: (offsetData: Partial<CarbonOffset>) => CarbonOffset;
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
export declare const calculateCarbonIntensity: (totalEmissions: number, propertySquareFeet: number) => number;
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
export declare const projectCarbonEmissions: (historicalEmissions: number[], yearsAhead: number, changeRate?: number) => number[];
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
export declare const createEnergyMetric: (data: Partial<EnergyConsumptionMetric>) => EnergyConsumptionMetric;
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
export declare const createWaterMetric: (data: Partial<WaterUsageMetric>) => WaterUsageMetric;
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
export declare const detectEnergyAnomalies: (dailyConsumption: number[], stdDevThreshold?: number) => Array<{
    date: number;
    value: number;
    anomaly: boolean;
}>;
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
export declare const calculateWaterConservationPotential: (metric: WaterUsageMetric, benchmarkConsumption: number) => number;
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
export declare const estimateEnergySavings: (baseline: EnergyConsumptionMetric, measures: Array<{
    measure: string;
    savingsPercent: number;
}>) => {
    totalSavingsPercent: number;
    savedKwh: number;
    savedTherms: number;
    savingsByCurrency: number;
    measures: Array<{
        measure: string;
        savingsPercent: number;
        kwhSaved: number;
    }>;
};
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
export declare const recordWasteStream: (data: Partial<WasteStream>) => WasteStream;
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
export declare const calculateWasteDiversion: (wasteStreams: WasteStream[]) => {
    totalWaste: number;
    divertedWaste: number;
    landfillWaste: number;
    diversionRate: number;
    costSavings: number;
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
export declare const createRecyclingProgram: (data: Partial<RecyclingProgram>) => RecyclingProgram;
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
export declare const analyzeWasteComposition: (wasteStreams: WasteStream[]) => {
    byType: Record<WasteType, number>;
    hazardousWaste: number;
    hazardousPercent: number;
    highestVolumeWaste: WasteType;
    costByWasteType: Record<WasteType, number>;
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
export declare const calculateWasteCostAvoidance: (baseline: WasteStream[], current: WasteStream[], landfillCostPerTon: number) => {
    baselineWaste: number;
    currentWaste: number;
    reducedWaste: number;
    avoidedCosts: number;
    reductionPercent: number;
};
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
export declare const recordGreenCertification: (data: Partial<GreenCertification>) => GreenCertification;
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
export declare const assessCertificationReadiness: (cert: GreenCertification, criteriaCompletion: Record<string, number>) => {
    criteria: Record<string, number>;
    overallReadiness: number;
    readyForCertification: boolean;
    gapsRemaining: Array<{
        criterion: string;
        completionPercent: number;
    }>;
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
export declare const calculateCertificationCosts: (certifications: GreenCertification[], yearsProjection?: number) => {
    annualCosts: number;
    projectedCosts: number;
    costByType: Record<string, number>;
    renewal: Array<{
        cert: string;
        renewalDate: Date;
        cost: number;
    }>;
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
export declare const compareCertificationStandards: (certifications: CertificationType[], propertyProfile: {
    squareFeet: number;
    type: string;
}) => Array<{
    cert: CertificationType;
    alignment: number;
    pros: string[];
    cons: string[];
}>;
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
export declare const createSustainabilityGoal: (data: Partial<SustainabilityGoal>) => SustainabilityGoal;
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
export declare const updateGoalProgress: (goal: SustainabilityGoal, currentValue: number) => SustainabilityGoal;
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
export declare const evaluateGoalStatus: (goal: SustainabilityGoal) => {
    status: GoalStatus;
    trajectory: "on_track" | "at_risk" | "off_track" | "ahead_of_schedule";
    percentToTarget: number;
    yearsRemaining: number;
    recommendedActions: string[];
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
export declare const calculateRequiredPace: (goal: SustainabilityGoal, currentProgress: number) => {
    requiredReductionPerMonth: number;
    requiredReductionPerQuarter: number;
    annualTarget: number;
    milestoneDates: Array<{
        date: Date;
        targetValue: number;
    }>;
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
export declare const alignWithSDGs: (goals: SustainabilityGoal[]) => Record<string, SustainabilityGoal[]>;
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
export declare const recordCompliance: (data: Partial<EnvironmentalCompliance>) => EnvironmentalCompliance;
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
export declare const scheduleAudit: (data: Partial<EnvironmentalAudit>) => EnvironmentalAudit;
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
export declare const analyzeComplianceRisk: (requirements: EnvironmentalCompliance[]) => {
    criticalItems: EnvironmentalCompliance[];
    atRiskCount: number;
    overallRisk: "high" | "medium" | "low";
    recommendedPriorities: Array<{
        requirement: string;
        daysUntilDeadline: number;
        riskLevel: string;
    }>;
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
export declare const updateAuditFindings: (audit: EnvironmentalAudit, updatedFindings: AuditFinding[]) => EnvironmentalAudit;
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
export declare const generateComplianceCalendar: (requirements: EnvironmentalCompliance[], months?: number) => {
    calendar: Record<string, EnvironmentalCompliance[]>;
    upcomingDeadlines: Array<{
        requirement: string;
        deadline: Date;
        daysRemaining: number;
    }>;
    overduDeadlines: EnvironmentalCompliance[];
};
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
export declare const recordRenewableSystem: (data: Partial<RenewableEnergySystem>) => RenewableEnergySystem;
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
export declare const calculateRenewableROI: (system: RenewableEnergySystem, electricityRate: number) => {
    annualProduction: number;
    annualSavings: number;
    investmentCost: number;
    netInvestment: number;
    paybackPeriod: number;
    roi: number;
    npv25Year: number;
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
export declare const configureGridIntegration: (data: Partial<GridIntegration>) => GridIntegration;
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
export declare const projectRenewableGeneration: (system: RenewableEnergySystem, yearsAhead: number, performanceDegradation?: number) => number[];
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
export declare const optimizeRenewableUtilization: (renewable: RenewableEnergySystem, storageCapacity: number, consumptionProfile: number) => {
    selfConsumptionRate: number;
    gridExportCapacity: number;
    storageRecommendation: number;
    optimizedSchedule: string;
    peakShavingPotential: number;
};
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
export declare const initiateSustainabilityReport: (data: Partial<SustainabilityReport>) => SustainabilityReport;
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
export declare const calculateESGScore: (env: EnvironmentalMetrics, social?: SocialMetrics, gov?: GovernanceMetrics) => Omit<ESGScore, "propertyId" | "portfolioId">;
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
export declare const generateESGBenchmarkReport: (score: ESGScore, benchmarks: {
    industryAverage: number;
    peerAverage: number;
    topQuartile: number;
}) => {
    score: ESGScore;
    benchmarks: Record<string, number>;
    performanceGap: Record<string, number>;
    percentile: number;
    recommendations: string[];
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
export declare const mapMetricsToFrameworks: (metrics: EnvironmentalMetrics, frameworks: ReportingFramework[]) => Record<string, Record<string, unknown>>;
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
export declare const assessMateriality: (metrics: Record<string, number>, stakeholderPriority: Record<string, number>, businessImpact: Record<string, number>) => {
    materialTopics: Array<{
        topic: string;
        materiality: number;
        stakeholderConcern: number;
        businessImpact: number;
    }>;
    reportingPriority: Array<{
        topic: string;
        priority: "critical" | "high" | "medium" | "low";
    }>;
};
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
export declare const generateSustainabilityDashboard: (carbon: Omit<CarbonFootprint, "id" | "propertyId">, energy: EnergyConsumptionMetric, water: WaterUsageMetric) => {
    totalCarbonFootprint: number;
    renewableEnergyPercent: number;
    waterEfficiency: number;
    costSavings: number;
    trendDirection: "improving" | "stable" | "worsening";
    keyMetrics: Record<string, number>;
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
export declare const exportSustainabilityReport: (report: SustainabilityReport, format?: "json" | "csv" | "pdf_ready") => string;
declare const _default: {
    calculateCarbonFootprint: (emissions: Record<EmissionSource, number>, offsetQuantity?: number) => Omit<CarbonFootprint, "id" | "propertyId">;
    convertEnergyToCO2: (energyType: string, quantity: number, unit: string, region: string) => number;
    recordCarbonOffset: (offsetData: Partial<CarbonOffset>) => CarbonOffset;
    calculateCarbonIntensity: (totalEmissions: number, propertySquareFeet: number) => number;
    projectCarbonEmissions: (historicalEmissions: number[], yearsAhead: number, changeRate?: number) => number[];
    createEnergyMetric: (data: Partial<EnergyConsumptionMetric>) => EnergyConsumptionMetric;
    createWaterMetric: (data: Partial<WaterUsageMetric>) => WaterUsageMetric;
    detectEnergyAnomalies: (dailyConsumption: number[], stdDevThreshold?: number) => Array<{
        date: number;
        value: number;
        anomaly: boolean;
    }>;
    calculateWaterConservationPotential: (metric: WaterUsageMetric, benchmarkConsumption: number) => number;
    estimateEnergySavings: (baseline: EnergyConsumptionMetric, measures: Array<{
        measure: string;
        savingsPercent: number;
    }>) => {
        totalSavingsPercent: number;
        savedKwh: number;
        savedTherms: number;
        savingsByCurrency: number;
        measures: Array<{
            measure: string;
            savingsPercent: number;
            kwhSaved: number;
        }>;
    };
    recordWasteStream: (data: Partial<WasteStream>) => WasteStream;
    calculateWasteDiversion: (wasteStreams: WasteStream[]) => {
        totalWaste: number;
        divertedWaste: number;
        landfillWaste: number;
        diversionRate: number;
        costSavings: number;
    };
    createRecyclingProgram: (data: Partial<RecyclingProgram>) => RecyclingProgram;
    analyzeWasteComposition: (wasteStreams: WasteStream[]) => {
        byType: Record<WasteType, number>;
        hazardousWaste: number;
        hazardousPercent: number;
        highestVolumeWaste: WasteType;
        costByWasteType: Record<WasteType, number>;
    };
    calculateWasteCostAvoidance: (baseline: WasteStream[], current: WasteStream[], landfillCostPerTon: number) => {
        baselineWaste: number;
        currentWaste: number;
        reducedWaste: number;
        avoidedCosts: number;
        reductionPercent: number;
    };
    recordGreenCertification: (data: Partial<GreenCertification>) => GreenCertification;
    assessCertificationReadiness: (cert: GreenCertification, criteriaCompletion: Record<string, number>) => {
        criteria: Record<string, number>;
        overallReadiness: number;
        readyForCertification: boolean;
        gapsRemaining: Array<{
            criterion: string;
            completionPercent: number;
        }>;
    };
    calculateCertificationCosts: (certifications: GreenCertification[], yearsProjection?: number) => {
        annualCosts: number;
        projectedCosts: number;
        costByType: Record<string, number>;
        renewal: Array<{
            cert: string;
            renewalDate: Date;
            cost: number;
        }>;
    };
    compareCertificationStandards: (certifications: CertificationType[], propertyProfile: {
        squareFeet: number;
        type: string;
    }) => Array<{
        cert: CertificationType;
        alignment: number;
        pros: string[];
        cons: string[];
    }>;
    createSustainabilityGoal: (data: Partial<SustainabilityGoal>) => SustainabilityGoal;
    updateGoalProgress: (goal: SustainabilityGoal, currentValue: number) => SustainabilityGoal;
    evaluateGoalStatus: (goal: SustainabilityGoal) => {
        status: GoalStatus;
        trajectory: "on_track" | "at_risk" | "off_track" | "ahead_of_schedule";
        percentToTarget: number;
        yearsRemaining: number;
        recommendedActions: string[];
    };
    calculateRequiredPace: (goal: SustainabilityGoal, currentProgress: number) => {
        requiredReductionPerMonth: number;
        requiredReductionPerQuarter: number;
        annualTarget: number;
        milestoneDates: Array<{
            date: Date;
            targetValue: number;
        }>;
    };
    alignWithSDGs: (goals: SustainabilityGoal[]) => Record<string, SustainabilityGoal[]>;
    recordCompliance: (data: Partial<EnvironmentalCompliance>) => EnvironmentalCompliance;
    scheduleAudit: (data: Partial<EnvironmentalAudit>) => EnvironmentalAudit;
    analyzeComplianceRisk: (requirements: EnvironmentalCompliance[]) => {
        criticalItems: EnvironmentalCompliance[];
        atRiskCount: number;
        overallRisk: "high" | "medium" | "low";
        recommendedPriorities: Array<{
            requirement: string;
            daysUntilDeadline: number;
            riskLevel: string;
        }>;
    };
    updateAuditFindings: (audit: EnvironmentalAudit, updatedFindings: AuditFinding[]) => EnvironmentalAudit;
    generateComplianceCalendar: (requirements: EnvironmentalCompliance[], months?: number) => {
        calendar: Record<string, EnvironmentalCompliance[]>;
        upcomingDeadlines: Array<{
            requirement: string;
            deadline: Date;
            daysRemaining: number;
        }>;
        overduDeadlines: EnvironmentalCompliance[];
    };
    recordRenewableSystem: (data: Partial<RenewableEnergySystem>) => RenewableEnergySystem;
    calculateRenewableROI: (system: RenewableEnergySystem, electricityRate: number) => {
        annualProduction: number;
        annualSavings: number;
        investmentCost: number;
        netInvestment: number;
        paybackPeriod: number;
        roi: number;
        npv25Year: number;
    };
    configureGridIntegration: (data: Partial<GridIntegration>) => GridIntegration;
    projectRenewableGeneration: (system: RenewableEnergySystem, yearsAhead: number, performanceDegradation?: number) => number[];
    optimizeRenewableUtilization: (renewable: RenewableEnergySystem, storageCapacity: number, consumptionProfile: number) => {
        selfConsumptionRate: number;
        gridExportCapacity: number;
        storageRecommendation: number;
        optimizedSchedule: string;
        peakShavingPotential: number;
    };
    initiateSustainabilityReport: (data: Partial<SustainabilityReport>) => SustainabilityReport;
    calculateESGScore: (env: EnvironmentalMetrics, social?: SocialMetrics, gov?: GovernanceMetrics) => Omit<ESGScore, "propertyId" | "portfolioId">;
    generateESGBenchmarkReport: (score: ESGScore, benchmarks: {
        industryAverage: number;
        peerAverage: number;
        topQuartile: number;
    }) => {
        score: ESGScore;
        benchmarks: Record<string, number>;
        performanceGap: Record<string, number>;
        percentile: number;
        recommendations: string[];
    };
    mapMetricsToFrameworks: (metrics: EnvironmentalMetrics, frameworks: ReportingFramework[]) => Record<string, Record<string, unknown>>;
    assessMateriality: (metrics: Record<string, number>, stakeholderPriority: Record<string, number>, businessImpact: Record<string, number>) => {
        materialTopics: Array<{
            topic: string;
            materiality: number;
            stakeholderConcern: number;
            businessImpact: number;
        }>;
        reportingPriority: Array<{
            topic: string;
            priority: "critical" | "high" | "medium" | "low";
        }>;
    };
    generateSustainabilityDashboard: (carbon: Omit<CarbonFootprint, "id" | "propertyId">, energy: EnergyConsumptionMetric, water: WaterUsageMetric) => {
        totalCarbonFootprint: number;
        renewableEnergyPercent: number;
        waterEfficiency: number;
        costSavings: number;
        trendDirection: "improving" | "stable" | "worsening";
        keyMetrics: Record<string, number>;
    };
    exportSustainabilityReport: (report: SustainabilityReport, format?: "json" | "csv" | "pdf_ready") => string;
};
export default _default;
//# sourceMappingURL=property-sustainability-kit.d.ts.map