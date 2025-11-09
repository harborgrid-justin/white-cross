/**
 * LOC: SUST1234567
 * File: /reuse/consulting/sustainability-consulting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../config-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend sustainability services
 *   - ESG reporting controllers
 *   - Carbon accounting services
 */
/**
 * File: /reuse/consulting/sustainability-consulting-kit.ts
 * Locator: WC-SUST-MGT-001
 * Purpose: Comprehensive Sustainability & ESG Management Utilities
 *
 * Upstream: Error handling, validation, configuration management utilities
 * Downstream: ../backend/*, ESG controllers, sustainability services, carbon accounting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for ESG scoring, carbon footprint, circular economy, sustainability reporting
 *
 * LLM Context: Enterprise-grade sustainability management system for ESG compliance and environmental impact.
 * Provides ESG scoring, carbon footprint tracking, circular economy metrics, sustainability reporting,
 * environmental compliance, social impact measurement, governance frameworks, supply chain sustainability,
 * green technology assessment, renewable energy tracking, waste management, and sustainability dashboards.
 */
import { Sequelize } from 'sequelize';
interface ESGScore {
    scoreId: string;
    organizationCode: string;
    assessmentDate: Date;
    overallScore: number;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C';
    methodology: string;
    assessor: string;
    certifications: string[];
    trends: {
        environmental: 'IMPROVING' | 'STABLE' | 'DECLINING';
        social: 'IMPROVING' | 'STABLE' | 'DECLINING';
        governance: 'IMPROVING' | 'STABLE' | 'DECLINING';
    };
}
interface CarbonFootprint {
    footprintId: string;
    organizationCode: string;
    reportingPeriod: string;
    scope1Emissions: number;
    scope2Emissions: number;
    scope3Emissions: number;
    totalEmissions: number;
    emissionsIntensity: number;
    baselineYear: number;
    baselineEmissions: number;
    reductionTarget: number;
    reductionAchieved: number;
    offsetsPurchased: number;
    netEmissions: number;
    calculationMethod: string;
    verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
}
interface SustainabilityReport {
    reportId: string;
    reportType: 'GRI' | 'SASB' | 'TCFD' | 'CDP' | 'INTEGRATED' | 'CUSTOM';
    fiscalYear: number;
    reportingPeriod: string;
    organizationCode: string;
    frameworkVersion: string;
    materiality: Array<{
        topic: string;
        significance: string;
        stakeholders: string[];
    }>;
    indicators: Array<{
        code: string;
        name: string;
        value: any;
        unit: string;
    }>;
    narrative: string;
    assuranceLevel: 'LIMITED' | 'REASONABLE' | 'NONE';
    assuranceProvider?: string;
    publicationDate: Date;
    status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED';
}
interface EnvironmentalCompliance {
    complianceId: string;
    regulationType: 'AIR_QUALITY' | 'WATER_QUALITY' | 'WASTE' | 'HAZMAT' | 'EMISSIONS' | 'BIODIVERSITY';
    regulation: string;
    jurisdiction: string;
    requirementDescription: string;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NOT_APPLICABLE';
    lastAssessmentDate: Date;
    nextAssessmentDate: Date;
    violations: Array<{
        date: Date;
        description: string;
        severity: string;
        remediation: string;
    }>;
    permits: Array<{
        permitNumber: string;
        type: string;
        expiryDate: Date;
        status: string;
    }>;
    responsibleParty: string;
}
interface GovernanceFramework {
    frameworkId: string;
    frameworkName: string;
    category: 'BOARD_STRUCTURE' | 'ETHICS' | 'TRANSPARENCY' | 'RISK_MANAGEMENT' | 'STAKEHOLDER_ENGAGEMENT';
    policies: Array<{
        policyName: string;
        version: string;
        effectiveDate: Date;
        reviewDate: Date;
    }>;
    controls: Array<{
        controlName: string;
        type: string;
        effectiveness: string;
    }>;
    auditResults: Array<{
        auditDate: Date;
        findings: number;
        severity: string;
    }>;
    maturityLevel: 'INITIAL' | 'DEVELOPING' | 'DEFINED' | 'MANAGED' | 'OPTIMIZED';
    complianceRate: number;
}
interface SupplyChainSustainability {
    assessmentId: string;
    supplierCode: string;
    supplierName: string;
    tier: number;
    sustainabilityScore: number;
    environmentalRating: string;
    socialRating: string;
    governanceRating: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    certifications: string[];
    auditDate: Date;
    auditFindings: Array<{
        finding: string;
        severity: string;
        status: string;
    }>;
    improvementPlan: string[];
}
interface RenewableEnergyData {
    facilityId: string;
    energyType: 'SOLAR' | 'WIND' | 'HYDRO' | 'GEOTHERMAL' | 'BIOMASS';
    capacity: number;
    generation: number;
    efficiency: number;
    carbonAvoided: number;
    costSavings: number;
    renewablePercentage: number;
}
export declare class CreateESGAssessmentDto {
    organizationCode: string;
    methodology: string;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
}
export declare class CreateCarbonFootprintDto {
    organizationCode: string;
    reportingPeriod: string;
    scope1Emissions: number;
    scope2Emissions: number;
    scope3Emissions: number;
}
export declare class CreateSustainabilityReportDto {
    reportType: string;
    fiscalYear: number;
    organizationCode: string;
    frameworkVersion: string;
}
export declare class CircularEconomyMetricDto {
    metricName: string;
    category: string;
    value: number;
    target: number;
}
/**
 * Sequelize model for ESG Scores with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ESGScore model
 *
 * @example
 * ```typescript
 * const ESGScore = createESGScoreModel(sequelize);
 * const score = await ESGScore.create({
 *   organizationCode: 'ORG-001',
 *   environmentalScore: 75,
 *   socialScore: 82,
 *   governanceScore: 88
 * });
 * ```
 */
export declare const createESGScoreModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        scoreId: string;
        organizationCode: string;
        assessmentDate: Date;
        overallScore: number;
        environmentalScore: number;
        socialScore: number;
        governanceScore: number;
        rating: string;
        methodology: string;
        assessor: string;
        certifications: string[];
        trends: Record<string, any>;
        dataQuality: string;
        materiality: Record<string, any>;
        stakeholderEngagement: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Carbon Footprint tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CarbonFootprint model
 *
 * @example
 * ```typescript
 * const CarbonFootprint = createCarbonFootprintModel(sequelize);
 * const footprint = await CarbonFootprint.create({
 *   organizationCode: 'ORG-001',
 *   reportingPeriod: '2025-Q1',
 *   scope1Emissions: 5000,
 *   scope2Emissions: 3000,
 *   scope3Emissions: 12000
 * });
 * ```
 */
export declare const createCarbonFootprintModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        footprintId: string;
        organizationCode: string;
        reportingPeriod: string;
        scope1Emissions: number;
        scope2Emissions: number;
        scope3Emissions: number;
        totalEmissions: number;
        emissionsIntensity: number;
        baselineYear: number;
        baselineEmissions: number;
        reductionTarget: number;
        reductionAchieved: number;
        offsetsPurchased: number;
        netEmissions: number;
        calculationMethod: string;
        verificationStatus: string;
        verifier: string | null;
        verificationDate: Date | null;
        emissionSources: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Sustainability Reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SustainabilityReport model
 *
 * @example
 * ```typescript
 * const SustainabilityReport = createSustainabilityReportModel(sequelize);
 * const report = await SustainabilityReport.create({
 *   reportType: 'GRI',
 *   fiscalYear: 2025,
 *   organizationCode: 'ORG-001',
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createSustainabilityReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        reportType: string;
        fiscalYear: number;
        reportingPeriod: string;
        organizationCode: string;
        frameworkVersion: string;
        materiality: Record<string, any>;
        indicators: Record<string, any>;
        narrative: string | null;
        assuranceLevel: string;
        assuranceProvider: string | null;
        assuranceDate: Date | null;
        publicationDate: Date | null;
        status: string;
        preparedBy: string;
        reviewedBy: string | null;
        approvedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Calculates comprehensive ESG score across all dimensions.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} assessmentData - Assessment data
 * @returns {Promise<ESGScore>} Calculated ESG score
 *
 * @example
 * ```typescript
 * const score = await calculateESGScore('ORG-001', {
 *   environmental: { emissions: 5000, energy: 10000, water: 5000 },
 *   social: { diversity: 0.45, safety: 2.1, engagement: 85 },
 *   governance: { boardIndependence: 0.70, ethics: 92, transparency: 88 }
 * });
 * ```
 */
export declare const calculateESGScore: (organizationCode: string, assessmentData: any) => Promise<ESGScore>;
/**
 * Benchmarks ESG performance against industry peers.
 *
 * @param {ESGScore} score - Organization ESG score
 * @param {string} industryCode - Industry classification
 * @returns {Promise<{ percentile: number; peerComparison: any; recommendations: string[] }>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkESGPerformance(score, 'NAICS-236220');
 * ```
 */
export declare const benchmarkESGPerformance: (score: ESGScore, industryCode: string) => Promise<{
    percentile: number;
    peerComparison: any;
    recommendations: string[];
}>;
/**
 * Generates ESG materiality assessment.
 *
 * @param {string} organizationCode - Organization code
 * @param {string[]} stakeholderGroups - Stakeholder groups to survey
 * @returns {Promise<Array<{ topic: string; significance: number; stakeholderPriority: number }>>} Materiality matrix
 *
 * @example
 * ```typescript
 * const materiality = await generateESGMaterialityAssessment('ORG-001', ['EMPLOYEES', 'INVESTORS', 'COMMUNITY']);
 * ```
 */
export declare const generateESGMaterialityAssessment: (organizationCode: string, stakeholderGroups: string[]) => Promise<Array<{
    topic: string;
    significance: number;
    stakeholderPriority: number;
}>>;
/**
 * Tracks ESG performance trends over time.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} numberOfPeriods - Number of periods to analyze
 * @returns {Promise<object>} ESG trend analysis
 *
 * @example
 * ```typescript
 * const trends = await trackESGPerformanceTrends('ORG-001', 8);
 * ```
 */
export declare const trackESGPerformanceTrends: (organizationCode: string, numberOfPeriods: number) => Promise<any>;
/**
 * Generates ESG risk assessment and mitigation strategies.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ risk: string; category: string; severity: string; likelihood: string; mitigation: string }>>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await generateESGRiskAssessment('ORG-001');
 * ```
 */
export declare const generateESGRiskAssessment: (organizationCode: string) => Promise<Array<{
    risk: string;
    category: string;
    severity: string;
    likelihood: string;
    mitigation: string;
}>>;
/**
 * Calculates organizational carbon footprint across all scopes.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @param {object} emissionData - Emission data by source
 * @returns {Promise<CarbonFootprint>} Carbon footprint calculation
 *
 * @example
 * ```typescript
 * const footprint = await calculateCarbonFootprint('ORG-001', '2025-Q1', {
 *   scope1: { naturalGas: 2000, fleet: 3000 },
 *   scope2: { electricity: 3000 },
 *   scope3: { businessTravel: 5000, procurement: 7000 }
 * });
 * ```
 */
export declare const calculateCarbonFootprint: (organizationCode: string, reportingPeriod: string, emissionData: any) => Promise<CarbonFootprint>;
/**
 * Tracks carbon reduction progress against targets.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} targetYear - Target year for net-zero
 * @returns {Promise<object>} Reduction progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackCarbonReductionProgress('ORG-001', 2050);
 * ```
 */
export declare const trackCarbonReductionProgress: (organizationCode: string, targetYear: number) => Promise<any>;
/**
 * Identifies carbon hotspots and reduction opportunities.
 *
 * @param {CarbonFootprint} footprint - Carbon footprint data
 * @returns {Promise<Array<{ source: string; emissions: number; percentage: number; reductionPotential: number }>>} Hotspot analysis
 *
 * @example
 * ```typescript
 * const hotspots = await identifyCarbonHotspots(footprint);
 * ```
 */
export declare const identifyCarbonHotspots: (footprint: CarbonFootprint) => Promise<Array<{
    source: string;
    emissions: number;
    percentage: number;
    reductionPotential: number;
}>>;
/**
 * Generates carbon offset recommendations.
 *
 * @param {number} emissionsToOffset - Emissions to offset (tCO2e)
 * @param {object} preferences - Offset preferences
 * @returns {Promise<Array<{ project: string; type: string; cost: number; certification: string; rating: number }>>} Offset recommendations
 *
 * @example
 * ```typescript
 * const offsets = await generateCarbonOffsetRecommendations(5000, { type: 'NATURE_BASED', region: 'NORTH_AMERICA' });
 * ```
 */
export declare const generateCarbonOffsetRecommendations: (emissionsToOffset: number, preferences: any) => Promise<Array<{
    project: string;
    type: string;
    cost: number;
    certification: string;
    rating: number;
}>>;
/**
 * Forecasts future carbon emissions based on current trajectory.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} forecastYears - Number of years to forecast
 * @param {object} [assumptions] - Forecast assumptions
 * @returns {Promise<Array<{ year: number; projected: number; withReductions: number; netZeroPath: number }>>} Emission forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCarbonEmissions('ORG-001', 10, { growthRate: 2, reductionRate: 5 });
 * ```
 */
export declare const forecastCarbonEmissions: (organizationCode: string, forecastYears: number, assumptions?: any) => Promise<Array<{
    year: number;
    projected: number;
    withReductions: number;
    netZeroPath: number;
}>>;
/**
 * Calculates material circularity index for products/operations.
 *
 * @param {string} productId - Product ID or operation ID
 * @param {object} materialData - Material flow data
 * @returns {Promise<{ mci: number; linearityIndex: number; recycledContent: number; recyclability: number }>} Circularity metrics
 *
 * @example
 * ```typescript
 * const mci = await calculateMaterialCircularityIndex('PROD-001', {
 *   virginMaterial: 70,
 *   recycledMaterial: 30,
 *   recyclableAtEOL: 85
 * });
 * ```
 */
export declare const calculateMaterialCircularityIndex: (productId: string, materialData: any) => Promise<{
    mci: number;
    linearityIndex: number;
    recycledContent: number;
    recyclability: number;
}>;
/**
 * Tracks waste generation, diversion, and circularity.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<object>} Waste management metrics
 *
 * @example
 * ```typescript
 * const waste = await trackWasteCircularity('ORG-001', '2025-Q1');
 * ```
 */
export declare const trackWasteCircularity: (organizationCode: string, reportingPeriod: string) => Promise<any>;
/**
 * Measures product lifecycle circularity.
 *
 * @param {string} productId - Product ID
 * @returns {Promise<object>} Lifecycle circularity assessment
 *
 * @example
 * ```typescript
 * const lifecycle = await measureProductLifecycleCircularity('PROD-001');
 * ```
 */
export declare const measureProductLifecycleCircularity: (productId: string) => Promise<any>;
/**
 * Identifies circular economy opportunities and strategies.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} [sector] - Optional sector focus
 * @returns {Promise<Array<{ opportunity: string; category: string; potential: number; investment: number; payback: number }>>} CE opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyCircularEconomyOpportunities('ORG-001', 'MANUFACTURING');
 * ```
 */
export declare const identifyCircularEconomyOpportunities: (organizationCode: string, sector?: string) => Promise<Array<{
    opportunity: string;
    category: string;
    potential: number;
    investment: number;
    payback: number;
}>>;
/**
 * Generates circular economy performance dashboard.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} CE dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = await generateCircularEconomyDashboard('ORG-001');
 * ```
 */
export declare const generateCircularEconomyDashboard: (organizationCode: string) => Promise<any>;
/**
 * Generates GRI-compliant sustainability report.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {string} griVersion - GRI standards version
 * @returns {Promise<SustainabilityReport>} GRI report
 *
 * @example
 * ```typescript
 * const report = await generateGRIReport('ORG-001', 2025, 'GRI_2021');
 * ```
 */
export declare const generateGRIReport: (organizationCode: string, fiscalYear: number, griVersion: string) => Promise<SustainabilityReport>;
/**
 * Generates SASB industry-specific sustainability metrics.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} industryCode - SASB industry code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} SASB metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateSASBMetrics('ORG-001', 'IF-EN-410', 2025);
 * ```
 */
export declare const generateSASBMetrics: (organizationCode: string, industryCode: string, fiscalYear: number) => Promise<any>;
/**
 * Generates TCFD climate-related financial disclosures.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} TCFD disclosure
 *
 * @example
 * ```typescript
 * const disclosure = await generateTCFDDisclosure('ORG-001', 2025);
 * ```
 */
export declare const generateTCFDDisclosure: (organizationCode: string, fiscalYear: number) => Promise<any>;
/**
 * Generates CDP climate change response.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} year - Reporting year
 * @returns {Promise<object>} CDP response
 *
 * @example
 * ```typescript
 * const response = await generateCDPResponse('ORG-001', 2025);
 * ```
 */
export declare const generateCDPResponse: (organizationCode: string, year: number) => Promise<any>;
/**
 * Validates sustainability report completeness and accuracy.
 *
 * @param {SustainabilityReport} report - Report to validate
 * @returns {Promise<{ valid: boolean; completeness: number; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSustainabilityReport(report);
 * ```
 */
export declare const validateSustainabilityReport: (report: SustainabilityReport) => Promise<{
    valid: boolean;
    completeness: number;
    errors: string[];
    warnings: string[];
}>;
/**
 * Tracks environmental compliance across regulations.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} jurisdiction - Regulatory jurisdiction
 * @returns {Promise<EnvironmentalCompliance[]>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await trackEnvironmentalCompliance('ORG-001', 'US_EPA');
 * ```
 */
export declare const trackEnvironmentalCompliance: (organizationCode: string, jurisdiction: string) => Promise<EnvironmentalCompliance[]>;
/**
 * Manages environmental permits and licenses.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ permit: string; type: string; status: string; expiry: Date; actions: string[] }>>} Permit status
 *
 * @example
 * ```typescript
 * const permits = await manageEnvironmentalPermits('ORG-001');
 * ```
 */
export declare const manageEnvironmentalPermits: (organizationCode: string) => Promise<Array<{
    permit: string;
    type: string;
    status: string;
    expiry: Date;
    actions: string[];
}>>;
/**
 * Monitors environmental incidents and violations.
 *
 * @param {string} organizationCode - Organization code
 * @param {Date} startDate - Monitoring start date
 * @param {Date} endDate - Monitoring end date
 * @returns {Promise<Array<{ incident: string; date: Date; severity: string; status: string; remediation: string }>>} Incident log
 *
 * @example
 * ```typescript
 * const incidents = await monitorEnvironmentalIncidents('ORG-001', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const monitorEnvironmentalIncidents: (organizationCode: string, startDate: Date, endDate: Date) => Promise<Array<{
    incident: string;
    date: Date;
    severity: string;
    status: string;
    remediation: string;
}>>;
/**
 * Generates environmental compliance audit report.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} auditScope - Audit scope
 * @returns {Promise<object>} Compliance audit report
 *
 * @example
 * ```typescript
 * const audit = await generateComplianceAuditReport('ORG-001', 'COMPREHENSIVE');
 * ```
 */
export declare const generateComplianceAuditReport: (organizationCode: string, auditScope: string) => Promise<any>;
/**
 * Calculates environmental compliance risk score.
 *
 * @param {EnvironmentalCompliance[]} complianceData - Compliance data
 * @returns {Promise<{ riskScore: number; riskLevel: string; criticalAreas: string[] }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risk = await calculateComplianceRiskScore(complianceData);
 * ```
 */
export declare const calculateComplianceRiskScore: (complianceData: EnvironmentalCompliance[]) => Promise<{
    riskScore: number;
    riskLevel: string;
    criticalAreas: string[];
}>;
/**
 * Measures employee wellbeing and engagement metrics.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<object>} Employee wellbeing metrics
 *
 * @example
 * ```typescript
 * const wellbeing = await measureEmployeeWellbeing('ORG-001', '2025-Q1');
 * ```
 */
export declare const measureEmployeeWellbeing: (organizationCode: string, reportingPeriod: string) => Promise<any>;
/**
 * Tracks diversity, equity, and inclusion metrics.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} DEI metrics
 *
 * @example
 * ```typescript
 * const dei = await trackDiversityEquityInclusion('ORG-001');
 * ```
 */
export declare const trackDiversityEquityInclusion: (organizationCode: string) => Promise<any>;
/**
 * Measures community engagement and impact.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<object>} Community impact metrics
 *
 * @example
 * ```typescript
 * const impact = await measureCommunityImpact('ORG-001', '2025-Q1');
 * ```
 */
export declare const measureCommunityImpact: (organizationCode: string, reportingPeriod: string) => Promise<any>;
/**
 * Assesses supply chain social responsibility.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Supply chain social assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessSupplyChainSocialResponsibility('ORG-001');
 * ```
 */
export declare const assessSupplyChainSocialResponsibility: (organizationCode: string) => Promise<any>;
/**
 * Generates social impact dashboard and report.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Social impact report
 *
 * @example
 * ```typescript
 * const report = await generateSocialImpactDashboard('ORG-001', 2025);
 * ```
 */
export declare const generateSocialImpactDashboard: (organizationCode: string, fiscalYear: number) => Promise<any>;
/**
 * Implements sustainability governance structure.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} governanceModel - Governance model definition
 * @returns {Promise<GovernanceFramework>} Governance framework
 *
 * @example
 * ```typescript
 * const governance = await implementSustainabilityGovernance('ORG-001', {
 *   boardOversight: true,
 *   executiveCommittee: true,
 *   crossFunctionalTeams: true
 * });
 * ```
 */
export declare const implementSustainabilityGovernance: (organizationCode: string, governanceModel: any) => Promise<GovernanceFramework>;
/**
 * Tracks board-level ESG oversight.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Board ESG oversight metrics
 *
 * @example
 * ```typescript
 * const oversight = await trackBoardESGOversight('ORG-001', 2025);
 * ```
 */
export declare const trackBoardESGOversight: (organizationCode: string, fiscalYear: number) => Promise<any>;
/**
 * Manages stakeholder engagement processes.
 *
 * @param {string} organizationCode - Organization code
 * @param {string[]} stakeholderGroups - Stakeholder groups
 * @returns {Promise<object>} Stakeholder engagement summary
 *
 * @example
 * ```typescript
 * const engagement = await manageStakeholderEngagement('ORG-001', ['INVESTORS', 'EMPLOYEES', 'COMMUNITIES']);
 * ```
 */
export declare const manageStakeholderEngagement: (organizationCode: string, stakeholderGroups: string[]) => Promise<any>;
/**
 * Implements ethics and transparency controls.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Ethics and transparency framework
 *
 * @example
 * ```typescript
 * const ethics = await implementEthicsTransparencyControls('ORG-001');
 * ```
 */
export declare const implementEthicsTransparencyControls: (organizationCode: string) => Promise<any>;
/**
 * Generates governance maturity assessment.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Governance maturity assessment
 *
 * @example
 * ```typescript
 * const maturity = await generateGovernanceMaturityAssessment('ORG-001');
 * ```
 */
export declare const generateGovernanceMaturityAssessment: (organizationCode: string) => Promise<any>;
/**
 * Assesses supplier sustainability performance.
 *
 * @param {string} supplierCode - Supplier code
 * @returns {Promise<SupplyChainSustainability>} Supplier sustainability assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessSupplierSustainability('SUP-001');
 * ```
 */
export declare const assessSupplierSustainability: (supplierCode: string) => Promise<SupplyChainSustainability>;
/**
 * Tracks supply chain carbon emissions (Scope 3).
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<object>} Supply chain emissions
 *
 * @example
 * ```typescript
 * const emissions = await trackSupplyChainEmissions('ORG-001', '2025-Q1');
 * ```
 */
export declare const trackSupplyChainEmissions: (organizationCode: string, reportingPeriod: string) => Promise<any>;
/**
 * Implements supplier sustainability requirements.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} requirements - Sustainability requirements
 * @returns {Promise<object>} Implementation status
 *
 * @example
 * ```typescript
 * const implementation = await implementSupplierSustainabilityRequirements('ORG-001', {
 *   carbonReduction: 20,
 *   certifications: ['ISO14001'],
 *   codeOfConduct: true
 * });
 * ```
 */
export declare const implementSupplierSustainabilityRequirements: (organizationCode: string, requirements: any) => Promise<any>;
/**
 * Optimizes supply chain for sustainability.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} optimizationGoals - Optimization goals
 * @returns {Promise<Array<{ recommendation: string; impact: number; cost: number; timeline: number }>>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeSupplyChainSustainability('ORG-001', {
 *   carbonReduction: 30,
 *   circularEconomy: true,
 *   resilience: true
 * });
 * ```
 */
export declare const optimizeSupplyChainSustainability: (organizationCode: string, optimizationGoals: any) => Promise<Array<{
    recommendation: string;
    impact: number;
    cost: number;
    timeline: number;
}>>;
/**
 * Generates supply chain sustainability scorecard.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Supply chain scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateSupplyChainSustainabilityScorecard('ORG-001');
 * ```
 */
export declare const generateSupplyChainSustainabilityScorecard: (organizationCode: string) => Promise<any>;
/**
 * Assesses renewable energy opportunities.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} facilityId - Facility ID
 * @returns {Promise<Array<{ technology: string; potential: number; cost: number; payback: number; priority: string }>>} Renewable energy opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await assessRenewableEnergyOpportunities('ORG-001', 'FAC-001');
 * ```
 */
export declare const assessRenewableEnergyOpportunities: (organizationCode: string, facilityId: string) => Promise<Array<{
    technology: string;
    potential: number;
    cost: number;
    payback: number;
    priority: string;
}>>;
/**
 * Tracks renewable energy generation and consumption.
 *
 * @param {string} organizationCode - Organization code
 * @param {string} reportingPeriod - Reporting period
 * @returns {Promise<RenewableEnergyData[]>} Renewable energy data
 *
 * @example
 * ```typescript
 * const renewable = await trackRenewableEnergyPerformance('ORG-001', '2025-Q1');
 * ```
 */
export declare const trackRenewableEnergyPerformance: (organizationCode: string, reportingPeriod: string) => Promise<RenewableEnergyData[]>;
/**
 * Evaluates energy efficiency improvement projects.
 *
 * @param {string} organizationCode - Organization code
 * @param {Array<object>} projects - Energy efficiency projects
 * @returns {Promise<Array<{ project: string; savingsPotential: number; investment: number; roi: number; priority: string }>>} Project evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateEnergyEfficiencyProjects('ORG-001', [
 *   { name: 'LED Lighting Upgrade', scope: 'ALL_FACILITIES' },
 *   { name: 'HVAC Optimization', scope: 'HEADQUARTERS' }
 * ]);
 * ```
 */
export declare const evaluateEnergyEfficiencyProjects: (organizationCode: string, projects: Array<object>) => Promise<Array<{
    project: string;
    savingsPotential: number;
    investment: number;
    roi: number;
    priority: string;
}>>;
/**
 * Calculates green building certification potential.
 *
 * @param {string} facilityId - Facility ID
 * @param {string} certificationTarget - Target certification (LEED, BREEAM, etc.)
 * @returns {Promise<{ currentScore: number; targetScore: number; gap: number; requirements: any[] }>} Certification assessment
 *
 * @example
 * ```typescript
 * const certification = await calculateGreenBuildingCertification('FAC-001', 'LEED_GOLD');
 * ```
 */
export declare const calculateGreenBuildingCertification: (facilityId: string, certificationTarget: string) => Promise<{
    currentScore: number;
    targetScore: number;
    gap: number;
    requirements: any[];
}>;
/**
 * Generates green technology ROI dashboard.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Green technology ROI dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateGreenTechnologyROIDashboard('ORG-001');
 * ```
 */
export declare const generateGreenTechnologyROIDashboard: (organizationCode: string) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createESGScoreModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            scoreId: string;
            organizationCode: string;
            assessmentDate: Date;
            overallScore: number;
            environmentalScore: number;
            socialScore: number;
            governanceScore: number;
            rating: string;
            methodology: string;
            assessor: string;
            certifications: string[];
            trends: Record<string, any>;
            dataQuality: string;
            materiality: Record<string, any>;
            stakeholderEngagement: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCarbonFootprintModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            footprintId: string;
            organizationCode: string;
            reportingPeriod: string;
            scope1Emissions: number;
            scope2Emissions: number;
            scope3Emissions: number;
            totalEmissions: number;
            emissionsIntensity: number;
            baselineYear: number;
            baselineEmissions: number;
            reductionTarget: number;
            reductionAchieved: number;
            offsetsPurchased: number;
            netEmissions: number;
            calculationMethod: string;
            verificationStatus: string;
            verifier: string | null;
            verificationDate: Date | null;
            emissionSources: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSustainabilityReportModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            reportId: string;
            reportType: string;
            fiscalYear: number;
            reportingPeriod: string;
            organizationCode: string;
            frameworkVersion: string;
            materiality: Record<string, any>;
            indicators: Record<string, any>;
            narrative: string | null;
            assuranceLevel: string;
            assuranceProvider: string | null;
            assuranceDate: Date | null;
            publicationDate: Date | null;
            status: string;
            preparedBy: string;
            reviewedBy: string | null;
            approvedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    calculateESGScore: (organizationCode: string, assessmentData: any) => Promise<ESGScore>;
    benchmarkESGPerformance: (score: ESGScore, industryCode: string) => Promise<{
        percentile: number;
        peerComparison: any;
        recommendations: string[];
    }>;
    generateESGMaterialityAssessment: (organizationCode: string, stakeholderGroups: string[]) => Promise<Array<{
        topic: string;
        significance: number;
        stakeholderPriority: number;
    }>>;
    trackESGPerformanceTrends: (organizationCode: string, numberOfPeriods: number) => Promise<any>;
    generateESGRiskAssessment: (organizationCode: string) => Promise<Array<{
        risk: string;
        category: string;
        severity: string;
        likelihood: string;
        mitigation: string;
    }>>;
    calculateCarbonFootprint: (organizationCode: string, reportingPeriod: string, emissionData: any) => Promise<CarbonFootprint>;
    trackCarbonReductionProgress: (organizationCode: string, targetYear: number) => Promise<any>;
    identifyCarbonHotspots: (footprint: CarbonFootprint) => Promise<Array<{
        source: string;
        emissions: number;
        percentage: number;
        reductionPotential: number;
    }>>;
    generateCarbonOffsetRecommendations: (emissionsToOffset: number, preferences: any) => Promise<Array<{
        project: string;
        type: string;
        cost: number;
        certification: string;
        rating: number;
    }>>;
    forecastCarbonEmissions: (organizationCode: string, forecastYears: number, assumptions?: any) => Promise<Array<{
        year: number;
        projected: number;
        withReductions: number;
        netZeroPath: number;
    }>>;
    calculateMaterialCircularityIndex: (productId: string, materialData: any) => Promise<{
        mci: number;
        linearityIndex: number;
        recycledContent: number;
        recyclability: number;
    }>;
    trackWasteCircularity: (organizationCode: string, reportingPeriod: string) => Promise<any>;
    measureProductLifecycleCircularity: (productId: string) => Promise<any>;
    identifyCircularEconomyOpportunities: (organizationCode: string, sector?: string) => Promise<Array<{
        opportunity: string;
        category: string;
        potential: number;
        investment: number;
        payback: number;
    }>>;
    generateCircularEconomyDashboard: (organizationCode: string) => Promise<any>;
    generateGRIReport: (organizationCode: string, fiscalYear: number, griVersion: string) => Promise<SustainabilityReport>;
    generateSASBMetrics: (organizationCode: string, industryCode: string, fiscalYear: number) => Promise<any>;
    generateTCFDDisclosure: (organizationCode: string, fiscalYear: number) => Promise<any>;
    generateCDPResponse: (organizationCode: string, year: number) => Promise<any>;
    validateSustainabilityReport: (report: SustainabilityReport) => Promise<{
        valid: boolean;
        completeness: number;
        errors: string[];
        warnings: string[];
    }>;
    trackEnvironmentalCompliance: (organizationCode: string, jurisdiction: string) => Promise<EnvironmentalCompliance[]>;
    manageEnvironmentalPermits: (organizationCode: string) => Promise<Array<{
        permit: string;
        type: string;
        status: string;
        expiry: Date;
        actions: string[];
    }>>;
    monitorEnvironmentalIncidents: (organizationCode: string, startDate: Date, endDate: Date) => Promise<Array<{
        incident: string;
        date: Date;
        severity: string;
        status: string;
        remediation: string;
    }>>;
    generateComplianceAuditReport: (organizationCode: string, auditScope: string) => Promise<any>;
    calculateComplianceRiskScore: (complianceData: EnvironmentalCompliance[]) => Promise<{
        riskScore: number;
        riskLevel: string;
        criticalAreas: string[];
    }>;
    measureEmployeeWellbeing: (organizationCode: string, reportingPeriod: string) => Promise<any>;
    trackDiversityEquityInclusion: (organizationCode: string) => Promise<any>;
    measureCommunityImpact: (organizationCode: string, reportingPeriod: string) => Promise<any>;
    assessSupplyChainSocialResponsibility: (organizationCode: string) => Promise<any>;
    generateSocialImpactDashboard: (organizationCode: string, fiscalYear: number) => Promise<any>;
    implementSustainabilityGovernance: (organizationCode: string, governanceModel: any) => Promise<GovernanceFramework>;
    trackBoardESGOversight: (organizationCode: string, fiscalYear: number) => Promise<any>;
    manageStakeholderEngagement: (organizationCode: string, stakeholderGroups: string[]) => Promise<any>;
    implementEthicsTransparencyControls: (organizationCode: string) => Promise<any>;
    generateGovernanceMaturityAssessment: (organizationCode: string) => Promise<any>;
    assessSupplierSustainability: (supplierCode: string) => Promise<SupplyChainSustainability>;
    trackSupplyChainEmissions: (organizationCode: string, reportingPeriod: string) => Promise<any>;
    implementSupplierSustainabilityRequirements: (organizationCode: string, requirements: any) => Promise<any>;
    optimizeSupplyChainSustainability: (organizationCode: string, optimizationGoals: any) => Promise<Array<{
        recommendation: string;
        impact: number;
        cost: number;
        timeline: number;
    }>>;
    generateSupplyChainSustainabilityScorecard: (organizationCode: string) => Promise<any>;
    assessRenewableEnergyOpportunities: (organizationCode: string, facilityId: string) => Promise<Array<{
        technology: string;
        potential: number;
        cost: number;
        payback: number;
        priority: string;
    }>>;
    trackRenewableEnergyPerformance: (organizationCode: string, reportingPeriod: string) => Promise<RenewableEnergyData[]>;
    evaluateEnergyEfficiencyProjects: (organizationCode: string, projects: Array<object>) => Promise<Array<{
        project: string;
        savingsPotential: number;
        investment: number;
        roi: number;
        priority: string;
    }>>;
    calculateGreenBuildingCertification: (facilityId: string, certificationTarget: string) => Promise<{
        currentScore: number;
        targetScore: number;
        gap: number;
        requirements: any[];
    }>;
    generateGreenTechnologyROIDashboard: (organizationCode: string) => Promise<any>;
};
export default _default;
//# sourceMappingURL=sustainability-consulting-kit.d.ts.map