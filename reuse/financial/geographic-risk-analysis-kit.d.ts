/**
 * Geographic Risk Analysis Kit
 *
 * Enterprise-grade financial toolkit for comprehensive geographic and jurisdictional risk assessment.
 * Includes country risk scoring, sanctions detection, corruption analysis, money laundering detection,
 * tax haven identification, and cross-border fund flow monitoring.
 *
 * @module GeographicRiskAnalysisKit
 * @version 2.0.0
 * @author Financial Compliance Team
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Country Risk Score model
 */
interface CountryRiskScoreAttributes {
    id: string;
    countryCode: string;
    countryName: string;
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    lastUpdated: Date;
    dataSource: string;
}
/**
 * FATF Jurisdiction model
 */
interface FATFJurisdictionAttributes {
    id: string;
    countryCode: string;
    jurisdictionName: string;
    fatfStatus: 'GREY_LIST' | 'BLACK_LIST' | 'COMPLIANT';
    dateAdded: Date;
    dateResolved?: Date;
    riskFactors: string[];
    recommendedActions: string[];
}
/**
 * Sanctions Country model
 */
interface SanctionsCountryAttributes {
    id: string;
    countryCode: string;
    sanctionType: string;
    sanctioningBody: string;
    effectiveDate: Date;
    endDate?: Date;
    severity: 'COMPREHENSIVE' | 'TARGETED' | 'SECTORAL';
    description: string;
}
/**
 * Corruption Index model
 */
interface CorruptionIndexAttributes {
    id: string;
    countryCode: string;
    countryName: string;
    corruptionPerceptionIndex: number;
    rank: number;
    region: string;
    year: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}
/**
 * Money Laundering Index model
 */
interface MoneyLaunderingIndexAttributes {
    id: string;
    countryCode: string;
    countryName: string;
    mliScore: number;
    riskRating: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
    vulnerabilities: string[];
    lastAssessed: Date;
}
/**
 * Tax Haven model
 */
interface TaxHavenAttributes {
    id: string;
    jurisdictionCode: string;
    jurisdictionName: string;
    taxRate: number;
    transparency: 'HIGH' | 'MEDIUM' | 'LOW';
    aeoi: boolean;
    riskLevel: number;
}
/**
 * Cross-Border Flow model
 */
interface CrossBorderFlowAttributes {
    id: string;
    sourceCountry: string;
    destinationCountry: string;
    amount: number;
    currency: string;
    flowType: 'IMPORT' | 'EXPORT' | 'TRANSFER' | 'REMITTANCE';
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';
    riskScore: number;
    flagged: boolean;
    timestamp: Date;
}
/**
 * Emerging Market Risk model
 */
interface EmergingMarketRiskAttributes {
    id: string;
    countryCode: string;
    countryName: string;
    volatilityIndex: number;
    creditRating: string;
    debtToGDP: number;
    externalDebt: number;
    currentAccount: number;
    riskSummary: string;
}
/**
 * Regional Risk Assessment model
 */
interface RegionalRiskAssessmentAttributes {
    id: string;
    region: string;
    averageRiskScore: number;
    dominantRisks: string[];
    affectedCountries: string[];
    trendAnalysis: string;
    lastUpdated: Date;
}
/**
 * Geographic Concentration model
 */
interface GeographicConcentrationAttributes {
    id: string;
    portfolio: string;
    country: string;
    concentration: number;
    exposureAmount: number;
    riskFlag: boolean;
    rebalanceRecommended: boolean;
}
/**
 * Trade Route Risk model
 */
interface TradeRouteRiskAttributes {
    id: string;
    originCountry: string;
    destinationCountry: string;
    routePath: string;
    riskFactors: string[];
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    averageDelay: number;
    costImpact: number;
    lastAssessed: Date;
}
/**
 * GeographicRiskAnalysisKit - Enterprise-grade geographic and jurisdictional risk assessment
 */
export declare class GeographicRiskAnalysisKit {
    private sequelize;
    constructor(sequelize: Sequelize);
    /**
     * Initialize all Sequelize models
     */
    private initializeModels;
    /**
     * Calculate comprehensive country risk score
     * @param countryCode ISO 3166-1 alpha-3 country code
     * @param factors Risk factors (0-100 scale for each)
     * @param transaction Optional Sequelize transaction
     * @returns Country risk score and level
     */
    calculateCountryRiskScore(countryCode: string, factors: {
        politicalStability: number;
        economicOutlook: number;
        regulatoryEnvironment: number;
        corruptionLevel: number;
        conflictRisk: number;
    }, transaction?: Transaction): Promise<{
        riskScore: number;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }>;
    /**
     * Get country risk profile with historical trends
     * @param countryCode Country code to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Country risk profile with trends
     */
    getCountryRiskProfile(countryCode: string, transaction?: Transaction): Promise<{
        current: CountryRiskScoreAttributes | null;
        historical: CountryRiskScoreAttributes[];
        trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
    }>;
    /**
     * Compare risk scores across countries
     * @param countryCodes Array of country codes to compare
     * @param transaction Optional Sequelize transaction
     * @returns Comparative risk analysis
     */
    compareCountryRisks(countryCodes: string[], transaction?: Transaction): Promise<Array<{
        country: string;
        riskScore: number;
        riskLevel: string;
    }>>;
    /**
     * Identify high-risk countries for exposure limits
     * @param threshold Risk score threshold (0-100)
     * @param transaction Optional Sequelize transaction
     * @returns List of high-risk countries
     */
    identifyHighRiskCountries(threshold?: number, transaction?: Transaction): Promise<CountryRiskScoreAttributes[]>;
    /**
     * Monitor country risk changes over time
     * @param countryCode Country to monitor
     * @param lookbackDays Historical period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Risk change analysis
     */
    monitorCountryRiskChanges(countryCode: string, lookbackDays?: number, transaction?: Transaction): Promise<{
        country: string;
        currentRisk: number;
        previousRisk: number;
        changePercentage: number;
        volatility: number;
    }>;
    /**
     * Identify FATF grey-listed jurisdictions
     * @param transaction Optional Sequelize transaction
     * @returns List of grey-listed jurisdictions
     */
    identifyFATFGreyList(transaction?: Transaction): Promise<FATFJurisdictionAttributes[]>;
    /**
     * Identify FATF black-listed jurisdictions
     * @param transaction Optional Sequelize transaction
     * @returns List of black-listed jurisdictions
     */
    identifyFATFBlackList(transaction?: Transaction): Promise<FATFJurisdictionAttributes[]>;
    /**
     * Check if jurisdiction is FATF non-compliant
     * @param countryCode Country code to check
     * @param transaction Optional Sequelize transaction
     * @returns FATF compliance status and details
     */
    checkFATFCompliance(countryCode: string, transaction?: Transaction): Promise<{
        isCompliant: boolean;
        status: string;
        riskFactors: string[];
    }>;
    /**
     * Track FATF jurisdiction status changes
     * @param countryCode Country to track
     * @param transaction Optional Sequelize transaction
     * @returns Status history and current compliance rating
     */
    trackFATFStatusChanges(countryCode: string, transaction?: Transaction): Promise<{
        country: string;
        currentStatus: string;
        dateAdded: Date;
        dateResolved?: Date;
        daysOnList: number;
        riskFactors: string[];
    }>;
    /**
     * Assess transaction risk based on FATF status
     * @param sourceCountry Transaction source country
     * @param destinationCountry Transaction destination country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns Transaction risk assessment
     */
    assessFATFTransactionRisk(sourceCountry: string, destinationCountry: string, amount: number, transaction?: Transaction): Promise<{
        riskScore: number;
        riskLevel: string;
        complianceAlert: boolean;
    }>;
    /**
     * Detect if country is under sanctions
     * @param countryCode Country code to check
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions status and details
     */
    detectSanctionsCountry(countryCode: string, transaction?: Transaction): Promise<{
        isSanctioned: boolean;
        sanctions: SanctionsCountryAttributes[];
        activeSanctions: number;
    }>;
    /**
     * Get comprehensive sanctions profile for country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Complete sanctions profile
     */
    getSanctionsProfile(countryCode: string, transaction?: Transaction): Promise<{
        country: string;
        comprehensiveSanctions: SanctionsCountryAttributes[];
        sectoralSanctions: SanctionsCountryAttributes[];
        targetedSanctions: SanctionsCountryAttributes[];
        overallSeverity: 'COMPREHENSIVE' | 'TARGETED' | 'SECTORAL' | 'NONE';
    }>;
    /**
     * Identify sectoral sanctions affecting specific industries
     * @param countryCode Country to check
     * @param sectors Industries to check (e.g., ENERGY, FINANCE, DEFENSE)
     * @param transaction Optional Sequelize transaction
     * @returns Affected sectors and restrictions
     */
    identifySectoralSanctions(countryCode: string, sectors: string[], transaction?: Transaction): Promise<{
        sector: string;
        isSanctioned: boolean;
        sanctions: SanctionsCountryAttributes[];
    }[]>;
    /**
     * Monitor sanctions expiration and changes
     * @param countryCode Country to monitor
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions timeline and expiration forecast
     */
    monitorSanctionsTimeline(countryCode: string, transaction?: Transaction): Promise<{
        activeSanctions: number;
        expiringSoon: SanctionsCountryAttributes[];
        expectedExpiration: Date[];
    }>;
    /**
     * Assess transaction compliance with sanctions regime
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions compliance assessment
     */
    assessSanctionsCompliance(sourceCountry: string, destinationCountry: string, transaction?: Transaction): Promise<{
        complianceStatus: string;
        blockedTransaction: boolean;
        requiredReview: boolean;
    }>;
    /**
     * Get corruption perception index for country
     * @param countryCode Country to analyze
     * @param year Specific year (defaults to latest)
     * @param transaction Optional Sequelize transaction
     * @returns Corruption index and ranking
     */
    getCorruptionIndex(countryCode: string, year?: number, transaction?: Transaction): Promise<CorruptionIndexAttributes | null>;
    /**
     * Rank countries by corruption index
     * @param limit Number of top countries to return
     * @param year Specific year to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Ranked list of countries by corruption
     */
    rankCountriesByCorruption(limit?: number, year?: number, transaction?: Transaction): Promise<CorruptionIndexAttributes[]>;
    /**
     * Analyze corruption trends by region
     * @param region Geographic region to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Regional corruption analysis
     */
    analyzeCorruptionByRegion(region: string, transaction?: Transaction): Promise<{
        region: string;
        averageIndex: number;
        bestPerforming: CorruptionIndexAttributes | null;
        worstPerforming: CorruptionIndexAttributes | null;
        trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    }>;
    /**
     * Correlate corruption with AML risks
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Corruption-AML correlation analysis
     */
    correlateCorruptionWithAMLRisk(countryCode: string, transaction?: Transaction): Promise<{
        country: string;
        corruptionIndex: number;
        amlRiskScore: number;
        correlationStrength: string;
    }>;
    /**
     * Assess transaction risk based on corruption levels
     * @param sourceCountry Source country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns Corruption-based risk assessment
     */
    assessCorruptionRisk(sourceCountry: string, amount: number, transaction?: Transaction): Promise<{
        riskScore: number;
        riskLevel: string;
        requiresScrutiny: boolean;
    }>;
    /**
     * Get money laundering risk index for country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Money laundering index and vulnerabilities
     */
    getMoneyLaunderingIndex(countryCode: string, transaction?: Transaction): Promise<MoneyLaunderingIndexAttributes | null>;
    /**
     * Identify high-risk money laundering countries
     * @param riskThreshold Risk rating threshold
     * @param transaction Optional Sequelize transaction
     * @returns List of high-risk countries
     */
    identifyMoneyLaunderingRisks(riskThreshold?: string, transaction?: Transaction): Promise<MoneyLaunderingIndexAttributes[]>;
    /**
     * Analyze money laundering vulnerabilities by country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Detailed vulnerability analysis
     */
    analyzeMoneyLaunderingVulnerabilities(countryCode: string, transaction?: Transaction): Promise<{
        country: string;
        score: number;
        riskRating: string;
        keyVulnerabilities: string[];
        mitigationActions: string[];
    }>;
    /**
     * Monitor money laundering risk changes
     * @param countryCode Country to monitor
     * @param transaction Optional Sequelize transaction
     * @returns Risk trend analysis
     */
    monitorMoneyLaunderingTrends(countryCode: string, transaction?: Transaction): Promise<{
        country: string;
        currentScore: number;
        assessmentDate: Date;
        riskTrend: string;
    }>;
    /**
     * Assess transaction ML/FT risk based on country profiles
     * @param sourceCountry Source country
     * @param beneficiaryCountry Beneficiary country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns ML/FT risk assessment
     */
    assessMoneyLaunderingTransactionRisk(sourceCountry: string, beneficiaryCountry: string, amount: number, transaction?: Transaction): Promise<{
        mlRiskScore: number;
        ftRiskScore: number;
        overallRisk: string;
        requiresReporting: boolean;
    }>;
    /**
     * Identify tax haven jurisdictions
     * @param maxTaxRate Maximum tax rate threshold
     * @param transaction Optional Sequelize transaction
     * @returns List of tax haven jurisdictions
     */
    identifyTaxHavens(maxTaxRate?: number, transaction?: Transaction): Promise<TaxHavenAttributes[]>;
    /**
     * Assess transparency of offshore jurisdiction
     * @param jurisdictionCode Jurisdiction code to assess
     * @param transaction Optional Sequelize transaction
     * @returns Transparency assessment
     */
    assessOffshoreTransparency(jurisdictionCode: string, transaction?: Transaction): Promise<{
        jurisdiction: string;
        transparencyRating: 'HIGH' | 'MEDIUM' | 'LOW';
        aeoi: boolean;
        riskLevel: number;
        complianceStatus: string;
    }>;
    /**
     * Monitor beneficial ownership in tax havens
     * @param transaction Optional Sequelize transaction
     * @returns Tax haven entities with ownership risk
     */
    monitorBeneficialOwnershipRisks(transaction?: Transaction): Promise<Array<{
        jurisdiction: string;
        taxRate: number;
        transparency: string;
        ownershipRisk: string;
    }>>;
    /**
     * Identify high-risk offshore financial centers
     * @param riskThreshold Risk level threshold (0-100)
     * @param transaction Optional Sequelize transaction
     * @returns High-risk offshore jurisdictions
     */
    identifyHighRiskOffshoreJurisdictions(riskThreshold?: number, transaction?: Transaction): Promise<TaxHavenAttributes[]>;
    /**
     * Assess exposure to non-compliant tax jurisdictions
     * @param portfolio Portfolio name
     * @param transaction Optional Sequelize transaction
     * @returns Non-compliance exposure analysis
     */
    assessTaxComplianceExposure(portfolio: string, transaction?: Transaction): Promise<{
        portfolio: string;
        exposedToNonCompliant: boolean;
        nonCompliantCount: number;
        recommendedActions: string[];
    }>;
    /**
     * Track cross-border fund flows
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Historical cross-border flows
     */
    trackCrossBorderFlows(sourceCountry: string, destinationCountry: string, transaction?: Transaction): Promise<CrossBorderFlowAttributes[]>;
    /**
     * Identify suspicious cross-border patterns
     * @param lookbackDays Historical period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Flagged suspicious flows
     */
    identifySuspiciousCrossBorderPatterns(lookbackDays?: number, transaction?: Transaction): Promise<CrossBorderFlowAttributes[]>;
    /**
     * Analyze fund flow corridors for risk concentration
     * @param transaction Optional Sequelize transaction
     * @returns Risk corridors with concentration analysis
     */
    analyzeFundFlowCorridors(transaction?: Transaction): Promise<Array<{
        corridor: string;
        totalVolume: number;
        frequency: number;
        averageRisk: number;
        concentrationFlag: boolean;
    }>>;
    /**
     * Monitor remittance flows for AML risk
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Remittance flow analysis
     */
    monitorRemittanceFlows(sourceCountry: string, destinationCountry: string, transaction?: Transaction): Promise<{
        corridor: string;
        totalRemittances: number;
        frequency: string;
        averageAmount: number;
        riskAssessment: string;
    }>;
    /**
     * Detect structuring patterns in cross-border flows
     * @param sourceCountry Source country to analyze
     * @param destinationCountry Destination country to analyze
     * @param lookbackDays Period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Structuring pattern analysis
     */
    detectStructuringPatterns(sourceCountry: string, destinationCountry: string, lookbackDays?: number, transaction?: Transaction): Promise<{
        corridor: string;
        structuringDetected: boolean;
        consistentPattern: boolean;
        averageAmount: number;
        flagForReview: boolean;
    }>;
    /**
     * Analyze portfolio geographic concentration
     * @param portfolio Portfolio name
     * @param transaction Optional Sequelize transaction
     * @returns Concentration analysis with risk flags
     */
    analyzeGeographicConcentration(portfolio: string, transaction?: Transaction): Promise<{
        portfolio: string;
        concentrations: GeographicConcentrationAttributes[];
        overconcentration: boolean;
        rebalanceRequired: boolean;
        recommendations: string[];
    }>;
    /**
     * Assess regional risk aggregation
     * @param region Geographic region to assess
     * @param transaction Optional Sequelize transaction
     * @returns Regional risk profile
     */
    assessRegionalRiskAggregation(region: string, transaction?: Transaction): Promise<RegionalRiskAssessmentAttributes | null>;
    /**
     * Identify regional contagion risks
     * @param region Starting region for analysis
     * @param transaction Optional Sequelize transaction
     * @returns Contagion risk assessment
     */
    identifyRegionalContagionRisks(region: string, transaction?: Transaction): Promise<{
        primaryRegion: string;
        contagionRisk: string;
        affectedRegions: string[];
        mitigationMeasures: string[];
    }>;
    /**
     * Calculate emerging market risk exposure
     * @param countryCode Emerging market country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Emerging market risk profile
     */
    calculateEmergingMarketRisk(countryCode: string, transaction?: Transaction): Promise<EmergingMarketRiskAttributes | null>;
    /**
     * Rank emerging markets by volatility
     * @param limit Number of markets to return
     * @param transaction Optional Sequelize transaction
     * @returns Emerging markets ranked by volatility
     */
    rankEmergingMarketsByVolatility(limit?: number, transaction?: Transaction): Promise<EmergingMarketRiskAttributes[]>;
    /**
     * Identify trade route risks
     * @param originCountry Trade route origin
     * @param destinationCountry Trade route destination
     * @param transaction Optional Sequelize transaction
     * @returns Trade route risk assessment
     */
    identifyTradeRouteRisks(originCountry: string, destinationCountry: string, transaction?: Transaction): Promise<TradeRouteRiskAttributes | null>;
    /**
     * Assess trade route delays and cost impacts
     * @param transaction Optional Sequelize transaction
     * @returns Trade routes with highest delays and costs
     */
    assessTradeRouteImpacts(transaction?: Transaction): Promise<Array<{
        route: string;
        delay: number;
        costImpact: number;
        riskLevel: string;
    }>>;
    /**
     * Calculate political stability score
     * @param countryCode Country to assess
     * @param factors Political stability factors
     * @param transaction Optional Sequelize transaction
     * @returns Political stability score
     */
    calculatePoliticalStabilityScore(countryCode: string, factors: {
        governmentEffectiveness: number;
        regulatoryQuality: number;
        ruleOfLaw: number;
        controlOfCorruption: number;
        politicalStability: number;
        voiceAccountability: number;
    }, transaction?: Transaction): Promise<{
        countryCode: string;
        score: number;
        stabilityRating: string;
    }>;
    /**
     * Score regulatory environment effectiveness
     * @param countryCode Country to assess
     * @param factors Regulatory environment factors
     * @param transaction Optional Sequelize transaction
     * @returns Regulatory environment score
     */
    scoreRegulatoryEnvironment(countryCode: string, factors: {
        amlCompliance: number;
        fatfRecommendations: number;
        cfTCompliance: number;
        transparencyRequirements: number;
        enforcementCapacity: number;
    }, transaction?: Transaction): Promise<{
        countryCode: string;
        score: number;
        environmentRating: string;
    }>;
    /**
     * Helper: Get country name from country code
     * @param countryCode ISO 3166-1 alpha-3 country code
     * @returns Country name
     */
    private getCountryName;
}
export default GeographicRiskAnalysisKit;
//# sourceMappingURL=geographic-risk-analysis-kit.d.ts.map