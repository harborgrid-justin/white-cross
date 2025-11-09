"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeographicRiskAnalysisKit = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
class CountryRiskScore extends sequelize_1.Model {
}
class FATFJurisdiction extends sequelize_1.Model {
}
class SanctionsCountry extends sequelize_1.Model {
}
class CorruptionIndex extends sequelize_1.Model {
}
class MoneyLaunderingIndex extends sequelize_1.Model {
}
class TaxHaven extends sequelize_1.Model {
}
class CrossBorderFlow extends sequelize_1.Model {
}
class EmergingMarketRisk extends sequelize_1.Model {
}
class RegionalRiskAssessment extends sequelize_1.Model {
}
class GeographicConcentration extends sequelize_1.Model {
}
class TradeRouteRisk extends sequelize_1.Model {
}
// ============================================================================
// GEOGRAPHIC RISK ANALYSIS KIT
// ============================================================================
/**
 * GeographicRiskAnalysisKit - Enterprise-grade geographic and jurisdictional risk assessment
 */
class GeographicRiskAnalysisKit {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.initializeModels();
    }
    /**
     * Initialize all Sequelize models
     */
    initializeModels() {
        CountryRiskScore.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false, unique: true },
            countryName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            riskScore: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            riskLevel: {
                type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
                allowNull: false,
            },
            lastUpdated: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            dataSource: { type: sequelize_1.DataTypes.STRING(100) },
        }, { sequelize, tableName: 'country_risk_scores', timestamps: true });
        FATFJurisdiction.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            jurisdictionName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            fatfStatus: {
                type: sequelize_1.DataTypes.ENUM('GREY_LIST', 'BLACK_LIST', 'COMPLIANT'),
                allowNull: false,
            },
            dateAdded: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            dateResolved: { type: sequelize_1.DataTypes.DATE },
            riskFactors: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            recommendedActions: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
        }, { sequelize, tableName: 'fatf_jurisdictions', timestamps: true });
        SanctionsCountry.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            sanctionType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            sanctioningBody: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            effectiveDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            endDate: { type: sequelize_1.DataTypes.DATE },
            severity: {
                type: sequelize_1.DataTypes.ENUM('COMPREHENSIVE', 'TARGETED', 'SECTORAL'),
                allowNull: false,
            },
            description: { type: sequelize_1.DataTypes.TEXT },
        }, { sequelize, tableName: 'sanctions_countries', timestamps: true });
        CorruptionIndex.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            countryName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            corruptionPerceptionIndex: { type: sequelize_1.DataTypes.DECIMAL(3, 1), allowNull: false },
            rank: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            region: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
            year: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            trend: {
                type: sequelize_1.DataTypes.ENUM('IMPROVING', 'STABLE', 'DECLINING'),
                allowNull: false,
            },
        }, { sequelize, tableName: 'corruption_indices', timestamps: true });
        MoneyLaunderingIndex.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            countryName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            mliScore: { type: sequelize_1.DataTypes.DECIMAL(3, 1), allowNull: false },
            riskRating: {
                type: sequelize_1.DataTypes.ENUM('VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'),
                allowNull: false,
            },
            vulnerabilities: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            lastAssessed: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, { sequelize, tableName: 'money_laundering_indices', timestamps: true });
        TaxHaven.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            jurisdictionCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false, unique: true },
            jurisdictionName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            taxRate: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            transparency: {
                type: sequelize_1.DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
                allowNull: false,
            },
            aeoi: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            riskLevel: { type: sequelize_1.DataTypes.DECIMAL(3, 1), allowNull: false },
        }, { sequelize, tableName: 'tax_havens', timestamps: true });
        CrossBorderFlow.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            sourceCountry: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            destinationCountry: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            amount: { type: sequelize_1.DataTypes.DECIMAL(20, 2), allowNull: false },
            currency: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            flowType: {
                type: sequelize_1.DataTypes.ENUM('IMPORT', 'EXPORT', 'TRANSFER', 'REMITTANCE'),
                allowNull: false,
            },
            frequency: {
                type: sequelize_1.DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL'),
                allowNull: false,
            },
            riskScore: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            flagged: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            timestamp: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, { sequelize, tableName: 'cross_border_flows', timestamps: true });
        EmergingMarketRisk.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            countryCode: { type: sequelize_1.DataTypes.STRING(3), allowNull: false, unique: true },
            countryName: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            volatilityIndex: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            creditRating: { type: sequelize_1.DataTypes.STRING(10), allowNull: false },
            debtToGDP: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            externalDebt: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            currentAccount: { type: sequelize_1.DataTypes.DECIMAL(5, 2) },
            riskSummary: { type: sequelize_1.DataTypes.TEXT },
        }, { sequelize, tableName: 'emerging_market_risks', timestamps: true });
        RegionalRiskAssessment.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            region: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
            averageRiskScore: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            dominantRisks: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            affectedCountries: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            trendAnalysis: { type: sequelize_1.DataTypes.TEXT },
            lastUpdated: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, { sequelize, tableName: 'regional_risk_assessments', timestamps: true });
        GeographicConcentration.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            portfolio: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
            country: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            concentration: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            exposureAmount: { type: sequelize_1.DataTypes.DECIMAL(20, 2), allowNull: false },
            riskFlag: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            rebalanceRecommended: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
        }, { sequelize, tableName: 'geographic_concentrations', timestamps: true });
        TradeRouteRisk.init({
            id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
            originCountry: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            destinationCountry: { type: sequelize_1.DataTypes.STRING(3), allowNull: false },
            routePath: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
            riskFactors: { type: sequelize_1.DataTypes.JSON, allowNull: false, defaultValue: [] },
            overallRisk: {
                type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
                allowNull: false,
            },
            averageDelay: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            costImpact: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
            lastAssessed: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, { sequelize, tableName: 'trade_route_risks', timestamps: true });
    }
    // ============================================================================
    // COUNTRY RISK SCORING FUNCTIONS
    // ============================================================================
    /**
     * Calculate comprehensive country risk score
     * @param countryCode ISO 3166-1 alpha-3 country code
     * @param factors Risk factors (0-100 scale for each)
     * @param transaction Optional Sequelize transaction
     * @returns Country risk score and level
     */
    async calculateCountryRiskScore(countryCode, factors, transaction) {
        const weights = {
            politicalStability: 0.25,
            economicOutlook: 0.2,
            regulatoryEnvironment: 0.25,
            corruptionLevel: 0.2,
            conflictRisk: 0.1,
        };
        const riskScore = (factors.politicalStability * weights.politicalStability +
            factors.economicOutlook * weights.economicOutlook +
            factors.regulatoryEnvironment * weights.regulatoryEnvironment +
            factors.corruptionLevel * weights.corruptionLevel +
            factors.conflictRisk * weights.conflictRisk) /
            100;
        let riskLevel;
        if (riskScore < 25)
            riskLevel = 'LOW';
        else if (riskScore < 50)
            riskLevel = 'MEDIUM';
        else if (riskScore < 75)
            riskLevel = 'HIGH';
        else
            riskLevel = 'CRITICAL';
        await CountryRiskScore.upsert({
            countryCode,
            countryName: this.getCountryName(countryCode),
            riskScore,
            riskLevel,
            lastUpdated: new Date(),
            dataSource: 'CALCULATED',
        }, { transaction });
        return { riskScore, riskLevel };
    }
    /**
     * Get country risk profile with historical trends
     * @param countryCode Country code to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Country risk profile with trends
     */
    async getCountryRiskProfile(countryCode, transaction) {
        const current = await CountryRiskScore.findOne({ where: { countryCode }, transaction }, { transaction });
        const historical = await CountryRiskScore.findAll({
            where: { countryCode },
            order: [['lastUpdated', 'DESC']],
            limit: 12,
            transaction,
        }, { transaction });
        let trend = 'STABLE';
        if (historical.length >= 2) {
            const currentScore = historical[0].riskScore;
            const previousScore = historical[Math.min(6, historical.length - 1)].riskScore;
            if (currentScore < previousScore - 5)
                trend = 'IMPROVING';
            else if (currentScore > previousScore + 5)
                trend = 'DETERIORATING';
        }
        return { current, historical, trend };
    }
    /**
     * Compare risk scores across countries
     * @param countryCodes Array of country codes to compare
     * @param transaction Optional Sequelize transaction
     * @returns Comparative risk analysis
     */
    async compareCountryRisks(countryCodes, transaction) {
        const risks = await CountryRiskScore.findAll({
            where: { countryCode: { [sequelize_1.Op.in]: countryCodes } },
            transaction,
        }, { transaction });
        return risks
            .map((r) => ({
            country: r.countryName,
            riskScore: r.riskScore,
            riskLevel: r.riskLevel,
        }))
            .sort((a, b) => b.riskScore - a.riskScore);
    }
    /**
     * Identify high-risk countries for exposure limits
     * @param threshold Risk score threshold (0-100)
     * @param transaction Optional Sequelize transaction
     * @returns List of high-risk countries
     */
    async identifyHighRiskCountries(threshold = 50, transaction) {
        return CountryRiskScore.findAll({
            where: { riskScore: { [sequelize_1.Op.gte]: threshold } },
            order: [['riskScore', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Monitor country risk changes over time
     * @param countryCode Country to monitor
     * @param lookbackDays Historical period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Risk change analysis
     */
    async monitorCountryRiskChanges(countryCode, lookbackDays = 90, transaction) {
        const cutoffDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
        const history = await CountryRiskScore.findAll({
            where: {
                countryCode,
                lastUpdated: { [sequelize_1.Op.gte]: cutoffDate },
            },
            order: [['lastUpdated', 'ASC']],
            transaction,
        }, { transaction });
        if (history.length < 2) {
            throw new Error('Insufficient historical data for analysis');
        }
        const scores = history.map((h) => h.riskScore);
        const currentRisk = scores[scores.length - 1];
        const previousRisk = scores[0];
        const changePercentage = ((currentRisk - previousRisk) / previousRisk) * 100;
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const volatility = Math.sqrt(variance);
        return { country: countryCode, currentRisk, previousRisk, changePercentage, volatility };
    }
    // ============================================================================
    // FATF HIGH-RISK JURISDICTION FUNCTIONS
    // ============================================================================
    /**
     * Identify FATF grey-listed jurisdictions
     * @param transaction Optional Sequelize transaction
     * @returns List of grey-listed jurisdictions
     */
    async identifyFATFGreyList(transaction) {
        return FATFJurisdiction.findAll({
            where: { fatfStatus: 'GREY_LIST' },
            order: [['dateAdded', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Identify FATF black-listed jurisdictions
     * @param transaction Optional Sequelize transaction
     * @returns List of black-listed jurisdictions
     */
    async identifyFATFBlackList(transaction) {
        return FATFJurisdiction.findAll({
            where: { fatfStatus: 'BLACK_LIST' },
            order: [['dateAdded', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Check if jurisdiction is FATF non-compliant
     * @param countryCode Country code to check
     * @param transaction Optional Sequelize transaction
     * @returns FATF compliance status and details
     */
    async checkFATFCompliance(countryCode, transaction) {
        const jurisdiction = await FATFJurisdiction.findOne({ where: { countryCode }, transaction }, { transaction });
        if (!jurisdiction) {
            return { isCompliant: true, status: 'NOT_LISTED', riskFactors: [] };
        }
        return {
            isCompliant: jurisdiction.fatfStatus === 'COMPLIANT',
            status: jurisdiction.fatfStatus,
            riskFactors: jurisdiction.riskFactors,
        };
    }
    /**
     * Track FATF jurisdiction status changes
     * @param countryCode Country to track
     * @param transaction Optional Sequelize transaction
     * @returns Status history and current compliance rating
     */
    async trackFATFStatusChanges(countryCode, transaction) {
        const jurisdiction = await FATFJurisdiction.findOne({ where: { countryCode }, transaction }, { transaction });
        if (!jurisdiction) {
            throw new Error('Jurisdiction not found in FATF records');
        }
        const daysOnList = Math.floor((new Date().getTime() - jurisdiction.dateAdded.getTime()) / (1000 * 60 * 60 * 24));
        return {
            country: jurisdiction.jurisdictionName,
            currentStatus: jurisdiction.fatfStatus,
            dateAdded: jurisdiction.dateAdded,
            dateResolved: jurisdiction.dateResolved,
            daysOnList,
            riskFactors: jurisdiction.riskFactors,
        };
    }
    /**
     * Assess transaction risk based on FATF status
     * @param sourceCountry Transaction source country
     * @param destinationCountry Transaction destination country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns Transaction risk assessment
     */
    async assessFATFTransactionRisk(sourceCountry, destinationCountry, amount, transaction) {
        const [source, destination] = await Promise.all([
            FATFJurisdiction.findOne({ where: { countryCode: sourceCountry }, transaction }, { transaction }),
            FATFJurisdiction.findOne({ where: { countryCode: destinationCountry }, transaction }, { transaction }),
        ]);
        let riskScore = 0;
        let complianceAlert = false;
        if (source?.fatfStatus === 'BLACK_LIST' || destination?.fatfStatus === 'BLACK_LIST') {
            riskScore = 95;
            complianceAlert = true;
        }
        else if (source?.fatfStatus === 'GREY_LIST' || destination?.fatfStatus === 'GREY_LIST') {
            riskScore = 65 + (amount > 500000 ? 15 : 0);
            complianceAlert = amount > 500000;
        }
        const riskLevel = riskScore > 75 ? 'CRITICAL' : riskScore > 50 ? 'HIGH' : 'MEDIUM';
        return { riskScore, riskLevel, complianceAlert };
    }
    // ============================================================================
    // SANCTIONS DETECTION FUNCTIONS
    // ============================================================================
    /**
     * Detect if country is under sanctions
     * @param countryCode Country code to check
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions status and details
     */
    async detectSanctionsCountry(countryCode, transaction) {
        const now = new Date();
        const sanctions = await SanctionsCountry.findAll({
            where: {
                countryCode,
                effectiveDate: { [sequelize_1.Op.lte]: now },
                [sequelize_1.Op.or]: [{ endDate: null }, { endDate: { [sequelize_1.Op.gte]: now } }],
            },
            transaction,
        }, { transaction });
        return {
            isSanctioned: sanctions.length > 0,
            sanctions,
            activeSanctions: sanctions.length,
        };
    }
    /**
     * Get comprehensive sanctions profile for country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Complete sanctions profile
     */
    async getSanctionsProfile(countryCode, transaction) {
        const allSanctions = await SanctionsCountry.findAll({
            where: { countryCode },
            transaction,
        }, { transaction });
        const comprehensive = allSanctions.filter((s) => s.severity === 'COMPREHENSIVE');
        const sectoral = allSanctions.filter((s) => s.severity === 'SECTORAL');
        const targeted = allSanctions.filter((s) => s.severity === 'TARGETED');
        let overallSeverity = 'NONE';
        if (comprehensive.length > 0)
            overallSeverity = 'COMPREHENSIVE';
        else if (sectoral.length > 0)
            overallSeverity = 'SECTORAL';
        else if (targeted.length > 0)
            overallSeverity = 'TARGETED';
        return {
            country: countryCode,
            comprehensiveSanctions: comprehensive,
            sectoralSanctions: sectoral,
            targetedSanctions: targeted,
            overallSeverity,
        };
    }
    /**
     * Identify sectoral sanctions affecting specific industries
     * @param countryCode Country to check
     * @param sectors Industries to check (e.g., ENERGY, FINANCE, DEFENSE)
     * @param transaction Optional Sequelize transaction
     * @returns Affected sectors and restrictions
     */
    async identifySectoralSanctions(countryCode, sectors, transaction) {
        const allSanctions = await SanctionsCountry.findAll({
            where: {
                countryCode,
                severity: 'SECTORAL',
            },
            transaction,
        }, { transaction });
        return sectors.map((sector) => ({
            sector,
            isSanctioned: allSanctions.some((s) => s.sanctionType.includes(sector)),
            sanctions: allSanctions.filter((s) => s.sanctionType.includes(sector)),
        }));
    }
    /**
     * Monitor sanctions expiration and changes
     * @param countryCode Country to monitor
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions timeline and expiration forecast
     */
    async monitorSanctionsTimeline(countryCode, transaction) {
        const today = new Date();
        const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const sanctions = await SanctionsCountry.findAll({
            where: {
                countryCode,
                effectiveDate: { [sequelize_1.Op.lte]: today },
                [sequelize_1.Op.or]: [{ endDate: null }, { endDate: { [sequelize_1.Op.gte]: today } }],
            },
            transaction,
        }, { transaction });
        const expiringSoon = sanctions.filter((s) => s.endDate && s.endDate > today && s.endDate <= thirtyDaysLater);
        const expectedExpiration = sanctions
            .filter((s) => s.endDate)
            .map((s) => s.endDate)
            .sort((a, b) => a.getTime() - b.getTime());
        return {
            activeSanctions: sanctions.length,
            expiringSoon,
            expectedExpiration,
        };
    }
    /**
     * Assess transaction compliance with sanctions regime
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Sanctions compliance assessment
     */
    async assessSanctionsCompliance(sourceCountry, destinationCountry, transaction) {
        const [sourceSanctions, destSanctions] = await Promise.all([
            SanctionsCountry.findAll({
                where: { countryCode: sourceCountry },
                transaction,
            }, { transaction }),
            SanctionsCountry.findAll({
                where: { countryCode: destinationCountry },
                transaction,
            }, { transaction }),
        ]);
        const comprehensive = sourceSanctions.some((s) => s.severity === 'COMPREHENSIVE') ||
            destSanctions.some((s) => s.severity === 'COMPREHENSIVE');
        return {
            complianceStatus: comprehensive ? 'BLOCKED' : 'ALLOWED_WITH_REVIEW',
            blockedTransaction: comprehensive,
            requiredReview: !comprehensive && (sourceSanctions.length > 0 || destSanctions.length > 0),
        };
    }
    // ============================================================================
    // CORRUPTION INDEX INTEGRATION FUNCTIONS
    // ============================================================================
    /**
     * Get corruption perception index for country
     * @param countryCode Country to analyze
     * @param year Specific year (defaults to latest)
     * @param transaction Optional Sequelize transaction
     * @returns Corruption index and ranking
     */
    async getCorruptionIndex(countryCode, year, transaction) {
        const where = { countryCode };
        if (year)
            where.year = year;
        return CorruptionIndex.findOne({
            where,
            order: [['year', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Rank countries by corruption index
     * @param limit Number of top countries to return
     * @param year Specific year to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Ranked list of countries by corruption
     */
    async rankCountriesByCorruption(limit = 10, year, transaction) {
        const where = {};
        if (year)
            where.year = year;
        return CorruptionIndex.findAll({
            where,
            order: [['rank', 'ASC']],
            limit,
            transaction,
        }, { transaction });
    }
    /**
     * Analyze corruption trends by region
     * @param region Geographic region to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Regional corruption analysis
     */
    async analyzeCorruptionByRegion(region, transaction) {
        const countries = await CorruptionIndex.findAll({
            where: { region },
            order: [['corruptionPerceptionIndex', 'ASC']],
            transaction,
        }, { transaction });
        if (countries.length === 0) {
            throw new Error(`No corruption data found for region: ${region}`);
        }
        const indices = countries.map((c) => c.corruptionPerceptionIndex);
        const averageIndex = indices.reduce((a, b) => a + b, 0) / indices.length;
        const improving = countries.filter((c) => c.trend === 'IMPROVING').length;
        const declining = countries.filter((c) => c.trend === 'DECLINING').length;
        let trend = 'STABLE';
        if (improving > declining)
            trend = 'IMPROVING';
        else if (declining > improving)
            trend = 'DECLINING';
        return {
            region,
            averageIndex: Math.round(averageIndex * 10) / 10,
            bestPerforming: countries[0],
            worstPerforming: countries[countries.length - 1],
            trend,
        };
    }
    /**
     * Correlate corruption with AML risks
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Corruption-AML correlation analysis
     */
    async correlateCorruptionWithAMLRisk(countryCode, transaction) {
        const [corruption, mli] = await Promise.all([
            this.getCorruptionIndex(countryCode, undefined, transaction),
            MoneyLaunderingIndex.findOne({ where: { countryCode }, transaction }, { transaction }),
        ]);
        if (!corruption || !mli) {
            throw new Error('Insufficient data for correlation analysis');
        }
        const correlationRatio = (corruption.corruptionPerceptionIndex / 100) * (mli.mliScore / 100);
        let correlationStrength = 'WEAK';
        if (correlationRatio > 0.6)
            correlationStrength = 'STRONG';
        else if (correlationRatio > 0.4)
            correlationStrength = 'MODERATE';
        return {
            country: countryCode,
            corruptionIndex: corruption.corruptionPerceptionIndex,
            amlRiskScore: mli.mliScore,
            correlationStrength,
        };
    }
    /**
     * Assess transaction risk based on corruption levels
     * @param sourceCountry Source country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns Corruption-based risk assessment
     */
    async assessCorruptionRisk(sourceCountry, amount, transaction) {
        const corruption = await this.getCorruptionIndex(sourceCountry, undefined, transaction);
        if (!corruption) {
            throw new Error(`No corruption data for country: ${sourceCountry}`);
        }
        const baseRisk = corruption.corruptionPerceptionIndex;
        const amountRisk = amount > 1000000 ? 20 : 0;
        const riskScore = Math.min(100, baseRisk + amountRisk);
        const riskLevel = riskScore > 70 ? 'HIGH' : riskScore > 50 ? 'MEDIUM' : 'LOW';
        return {
            riskScore,
            riskLevel,
            requiresScrutiny: riskScore > 60,
        };
    }
    // ============================================================================
    // MONEY LAUNDERING INDEX ANALYSIS FUNCTIONS
    // ============================================================================
    /**
     * Get money laundering risk index for country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Money laundering index and vulnerabilities
     */
    async getMoneyLaunderingIndex(countryCode, transaction) {
        return MoneyLaunderingIndex.findOne({ where: { countryCode }, transaction }, { transaction });
    }
    /**
     * Identify high-risk money laundering countries
     * @param riskThreshold Risk rating threshold
     * @param transaction Optional Sequelize transaction
     * @returns List of high-risk countries
     */
    async identifyMoneyLaunderingRisks(riskThreshold = 'HIGH', transaction) {
        const riskOrder = ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'];
        const thresholdIndex = riskOrder.indexOf(riskThreshold);
        const allRisks = await MoneyLaunderingIndex.findAll({ transaction }, { transaction });
        return allRisks
            .filter((r) => riskOrder.indexOf(r.riskRating) >= thresholdIndex)
            .sort((a, b) => b.mliScore - a.mliScore);
    }
    /**
     * Analyze money laundering vulnerabilities by country
     * @param countryCode Country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Detailed vulnerability analysis
     */
    async analyzeMoneyLaunderingVulnerabilities(countryCode, transaction) {
        const mli = await this.getMoneyLaunderingIndex(countryCode, transaction);
        if (!mli) {
            throw new Error(`No money laundering data for country: ${countryCode}`);
        }
        const mitigationActions = [];
        if (mli.vulnerabilities.includes('WEAK_AML_FRAMEWORK')) {
            mitigationActions.push('Require enhanced due diligence on all counterparties');
        }
        if (mli.vulnerabilities.includes('CASH_INTENSIVE_ECONOMY')) {
            mitigationActions.push('Monitor cash transactions exceeding threshold');
        }
        if (mli.vulnerabilities.includes('CORRUPTION')) {
            mitigationActions.push('Implement third-party verification of beneficial ownership');
        }
        return {
            country: countryCode,
            score: mli.mliScore,
            riskRating: mli.riskRating,
            keyVulnerabilities: mli.vulnerabilities,
            mitigationActions,
        };
    }
    /**
     * Monitor money laundering risk changes
     * @param countryCode Country to monitor
     * @param transaction Optional Sequelize transaction
     * @returns Risk trend analysis
     */
    async monitorMoneyLaunderingTrends(countryCode, transaction) {
        const mli = await this.getMoneyLaunderingIndex(countryCode, transaction);
        if (!mli) {
            throw new Error(`No money laundering data for country: ${countryCode}`);
        }
        const riskTrend = mli.vulnerabilities.length > 3 ? 'DETERIORATING' : 'STABLE';
        return {
            country: countryCode,
            currentScore: mli.mliScore,
            assessmentDate: mli.lastAssessed,
            riskTrend,
        };
    }
    /**
     * Assess transaction ML/FT risk based on country profiles
     * @param sourceCountry Source country
     * @param beneficiaryCountry Beneficiary country
     * @param amount Transaction amount
     * @param transaction Optional Sequelize transaction
     * @returns ML/FT risk assessment
     */
    async assessMoneyLaunderingTransactionRisk(sourceCountry, beneficiaryCountry, amount, transaction) {
        const [sourceMli, beneficiaryMli] = await Promise.all([
            this.getMoneyLaunderingIndex(sourceCountry, transaction),
            this.getMoneyLaunderingIndex(beneficiaryCountry, transaction),
        ]);
        const sourceScore = sourceMli?.mliScore || 50;
        const beneficiaryScore = beneficiaryMli?.mliScore || 50;
        const mlRiskScore = Math.round((sourceScore + beneficiaryScore) / 2 + (amount > 500000 ? 10 : 0));
        const ftRiskScore = Math.round(sourceScore * 0.8);
        const overallRisk = mlRiskScore > 75 || ftRiskScore > 70 ? 'CRITICAL' : mlRiskScore > 60 ? 'HIGH' : 'MEDIUM';
        return {
            mlRiskScore: Math.min(100, mlRiskScore),
            ftRiskScore: Math.min(100, ftRiskScore),
            overallRisk,
            requiresReporting: mlRiskScore > 70 || ftRiskScore > 60,
        };
    }
    // ============================================================================
    // TAX HAVEN & OFFSHORE JURISDICTION FUNCTIONS
    // ============================================================================
    /**
     * Identify tax haven jurisdictions
     * @param maxTaxRate Maximum tax rate threshold
     * @param transaction Optional Sequelize transaction
     * @returns List of tax haven jurisdictions
     */
    async identifyTaxHavens(maxTaxRate = 15, transaction) {
        return TaxHaven.findAll({
            where: { taxRate: { [sequelize_1.Op.lte]: maxTaxRate } },
            order: [['taxRate', 'ASC']],
            transaction,
        }, { transaction });
    }
    /**
     * Assess transparency of offshore jurisdiction
     * @param jurisdictionCode Jurisdiction code to assess
     * @param transaction Optional Sequelize transaction
     * @returns Transparency assessment
     */
    async assessOffshoreTransparency(jurisdictionCode, transaction) {
        const haven = await TaxHaven.findOne({ where: { jurisdictionCode }, transaction }, { transaction });
        if (!haven) {
            throw new Error(`Jurisdiction not found: ${jurisdictionCode}`);
        }
        const complianceStatus = haven.aeoi ? 'COMPLIANT' : 'NON_COMPLIANT';
        return {
            jurisdiction: haven.jurisdictionName,
            transparencyRating: haven.transparency,
            aeoi: haven.aeoi,
            riskLevel: haven.riskLevel,
            complianceStatus,
        };
    }
    /**
     * Monitor beneficial ownership in tax havens
     * @param transaction Optional Sequelize transaction
     * @returns Tax haven entities with ownership risk
     */
    async monitorBeneficialOwnershipRisks(transaction) {
        const lowTransparencyHavens = await TaxHaven.findAll({
            where: {
                [sequelize_1.Op.or]: [{ transparency: 'LOW' }, { aeoi: false }],
            },
            transaction,
        }, { transaction });
        return lowTransparencyHavens.map((h) => ({
            jurisdiction: h.jurisdictionName,
            taxRate: h.taxRate,
            transparency: h.transparency,
            ownershipRisk: h.aeoi ? 'MEDIUM' : 'HIGH',
        }));
    }
    /**
     * Identify high-risk offshore financial centers
     * @param riskThreshold Risk level threshold (0-100)
     * @param transaction Optional Sequelize transaction
     * @returns High-risk offshore jurisdictions
     */
    async identifyHighRiskOffshoreJurisdictions(riskThreshold = 60, transaction) {
        return TaxHaven.findAll({
            where: { riskLevel: { [sequelize_1.Op.gte]: riskThreshold } },
            order: [['riskLevel', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Assess exposure to non-compliant tax jurisdictions
     * @param portfolio Portfolio name
     * @param transaction Optional Sequelize transaction
     * @returns Non-compliance exposure analysis
     */
    async assessTaxComplianceExposure(portfolio, transaction) {
        const concentrations = await GeographicConcentration.findAll({ where: { portfolio }, transaction }, { transaction });
        const jurisdictionCodes = concentrations.map((c) => c.country);
        const havens = await TaxHaven.findAll({
            where: { jurisdictionCode: { [sequelize_1.Op.in]: jurisdictionCodes }, aeoi: false },
            transaction,
        }, { transaction });
        const actions = [];
        if (havens.length > 0) {
            actions.push('Conduct beneficial ownership verification');
            actions.push('Implement enhanced documentation requirements');
            actions.push('Monitor for CRS/FATCA compliance');
        }
        return {
            portfolio,
            exposedToNonCompliant: havens.length > 0,
            nonCompliantCount: havens.length,
            recommendedActions: actions,
        };
    }
    // ============================================================================
    // CROSS-BORDER FUND FLOW TRACKING FUNCTIONS
    // ============================================================================
    /**
     * Track cross-border fund flows
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Historical cross-border flows
     */
    async trackCrossBorderFlows(sourceCountry, destinationCountry, transaction) {
        return CrossBorderFlow.findAll({
            where: {
                sourceCountry,
                destinationCountry,
            },
            order: [['timestamp', 'DESC']],
            limit: 100,
            transaction,
        }, { transaction });
    }
    /**
     * Identify suspicious cross-border patterns
     * @param lookbackDays Historical period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Flagged suspicious flows
     */
    async identifySuspiciousCrossBorderPatterns(lookbackDays = 30, transaction) {
        const cutoffDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
        return CrossBorderFlow.findAll({
            where: {
                flagged: true,
                timestamp: { [sequelize_1.Op.gte]: cutoffDate },
            },
            order: [['riskScore', 'DESC']],
            transaction,
        }, { transaction });
    }
    /**
     * Analyze fund flow corridors for risk concentration
     * @param transaction Optional Sequelize transaction
     * @returns Risk corridors with concentration analysis
     */
    async analyzeFundFlowCorridors(transaction) {
        const flows = await CrossBorderFlow.findAll({
            attributes: [
                [(0, sequelize_1.literal)('CONCAT(sourceCountry, "-", destinationCountry)'), 'corridor'],
                [(0, sequelize_1.literal)('SUM(amount)'), 'totalVolume'],
                [(0, sequelize_1.literal)('COUNT(*)'), 'frequency'],
                [(0, sequelize_1.literal)('AVG(riskScore)'), 'averageRisk'],
            ],
            group: ['corridor'],
            raw: true,
            transaction,
        }, { transaction });
        return flows.map((f) => ({
            corridor: f.corridor,
            totalVolume: parseFloat(f.totalVolume),
            frequency: parseInt(f.frequency),
            averageRisk: Math.round(parseFloat(f.averageRisk) * 100) / 100,
            concentrationFlag: parseFloat(f.totalVolume) > 5000000,
        }));
    }
    /**
     * Monitor remittance flows for AML risk
     * @param sourceCountry Source country
     * @param destinationCountry Destination country
     * @param transaction Optional Sequelize transaction
     * @returns Remittance flow analysis
     */
    async monitorRemittanceFlows(sourceCountry, destinationCountry, transaction) {
        const flows = await CrossBorderFlow.findAll({
            where: {
                sourceCountry,
                destinationCountry,
                flowType: 'REMITTANCE',
            },
            transaction,
        }, { transaction });
        if (flows.length === 0) {
            throw new Error('No remittance flows found for corridor');
        }
        const totalRemittances = flows.reduce((sum, f) => sum + f.amount, 0);
        const averageAmount = totalRemittances / flows.length;
        const frequency = flows.length > 10 ? 'FREQUENT' : 'OCCASIONAL';
        const riskAssessment = averageAmount > 100000 ? 'HIGH' : averageAmount > 50000 ? 'MEDIUM' : 'LOW';
        return {
            corridor: `${sourceCountry}->${destinationCountry}`,
            totalRemittances,
            frequency,
            averageAmount: Math.round(averageAmount),
            riskAssessment,
        };
    }
    /**
     * Detect structuring patterns in cross-border flows
     * @param sourceCountry Source country to analyze
     * @param destinationCountry Destination country to analyze
     * @param lookbackDays Period to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Structuring pattern analysis
     */
    async detectStructuringPatterns(sourceCountry, destinationCountry, lookbackDays = 30, transaction) {
        const cutoffDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
        const flows = await CrossBorderFlow.findAll({
            where: {
                sourceCountry,
                destinationCountry,
                timestamp: { [sequelize_1.Op.gte]: cutoffDate },
            },
            order: [['timestamp', 'ASC']],
            transaction,
        }, { transaction });
        if (flows.length < 5) {
            return {
                corridor: `${sourceCountry}->${destinationCountry}`,
                structuringDetected: false,
                consistentPattern: false,
                averageAmount: 0,
                flagForReview: false,
            };
        }
        const amounts = flows.map((f) => f.amount);
        const average = amounts.reduce((a, b) => a + b) / amounts.length;
        const variance = amounts.reduce((sum, a) => sum + Math.pow(a - average, 2)) / amounts.length;
        const standardDeviation = Math.sqrt(variance);
        const structuringDetected = standardDeviation < average * 0.1 && amounts.every((a) => a < 9999.99);
        const consistentPattern = flows.every((f, i) => {
            if (i === 0)
                return true;
            return Math.abs(f.amount - flows[i - 1].amount) < average * 0.05;
        });
        return {
            corridor: `${sourceCountry}->${destinationCountry}`,
            structuringDetected,
            consistentPattern,
            averageAmount: Math.round(average),
            flagForReview: structuringDetected || consistentPattern,
        };
    }
    // ============================================================================
    // GEOGRAPHIC CONCENTRATION & REGIONAL RISK FUNCTIONS
    // ============================================================================
    /**
     * Analyze portfolio geographic concentration
     * @param portfolio Portfolio name
     * @param transaction Optional Sequelize transaction
     * @returns Concentration analysis with risk flags
     */
    async analyzeGeographicConcentration(portfolio, transaction) {
        const concentrations = await GeographicConcentration.findAll({
            where: { portfolio },
            order: [['concentration', 'DESC']],
            transaction,
        }, { transaction });
        const topThreeConcentration = concentrations
            .slice(0, 3)
            .reduce((sum, c) => sum + c.concentration, 0);
        const overconcentration = topThreeConcentration > 60;
        const rebalanceRequired = concentrations.some((c) => c.rebalanceRecommended);
        const recommendations = [];
        if (overconcentration) {
            recommendations.push('Diversify exposure across additional geographies');
        }
        if (concentrations.some((c) => c.riskFlag)) {
            recommendations.push('Reduce exposure to high-risk jurisdictions');
        }
        if (rebalanceRequired) {
            recommendations.push('Rebalance portfolio according to risk tolerance');
        }
        return {
            portfolio,
            concentrations,
            overconcentration,
            rebalanceRequired,
            recommendations,
        };
    }
    /**
     * Assess regional risk aggregation
     * @param region Geographic region to assess
     * @param transaction Optional Sequelize transaction
     * @returns Regional risk profile
     */
    async assessRegionalRiskAggregation(region, transaction) {
        const assessment = await RegionalRiskAssessment.findOne({ where: { region }, transaction }, { transaction });
        if (!assessment) {
            // Calculate if not found
            const countries = await CountryRiskScore.findAll({
                transaction,
                raw: true,
            }, { transaction });
            if (countries.length === 0) {
                return null;
            }
            const avgRisk = countries.reduce((sum, c) => sum + c.riskScore, 0) / countries.length;
            return {
                id: '',
                region,
                averageRiskScore: avgRisk,
                dominantRisks: [],
                affectedCountries: [],
                trendAnalysis: 'INITIAL_ASSESSMENT',
                lastUpdated: new Date(),
            };
        }
        return assessment;
    }
    /**
     * Identify regional contagion risks
     * @param region Starting region for analysis
     * @param transaction Optional Sequelize transaction
     * @returns Contagion risk assessment
     */
    async identifyRegionalContagionRisks(region, transaction) {
        const regionalAssessment = await this.assessRegionalRiskAggregation(region, transaction);
        if (!regionalAssessment) {
            throw new Error(`No regional data for: ${region}`);
        }
        const mitigationMeasures = [];
        if (regionalAssessment.averageRiskScore > 60) {
            mitigationMeasures.push('Implement enhanced monitoring of cross-regional flows');
            mitigationMeasures.push('Review counterparty exposures across region');
            mitigationMeasures.push('Consider hedging strategies');
        }
        return {
            primaryRegion: region,
            contagionRisk: regionalAssessment.averageRiskScore > 60 ? 'HIGH' : 'MODERATE',
            affectedRegions: regionalAssessment.affectedCountries || [],
            mitigationMeasures,
        };
    }
    /**
     * Calculate emerging market risk exposure
     * @param countryCode Emerging market country to analyze
     * @param transaction Optional Sequelize transaction
     * @returns Emerging market risk profile
     */
    async calculateEmergingMarketRisk(countryCode, transaction) {
        return EmergingMarketRisk.findOne({ where: { countryCode }, transaction }, { transaction });
    }
    /**
     * Rank emerging markets by volatility
     * @param limit Number of markets to return
     * @param transaction Optional Sequelize transaction
     * @returns Emerging markets ranked by volatility
     */
    async rankEmergingMarketsByVolatility(limit = 10, transaction) {
        return EmergingMarketRisk.findAll({
            order: [['volatilityIndex', 'DESC']],
            limit,
            transaction,
        }, { transaction });
    }
    /**
     * Identify trade route risks
     * @param originCountry Trade route origin
     * @param destinationCountry Trade route destination
     * @param transaction Optional Sequelize transaction
     * @returns Trade route risk assessment
     */
    async identifyTradeRouteRisks(originCountry, destinationCountry, transaction) {
        return TradeRouteRisk.findOne({
            where: { originCountry, destinationCountry },
            transaction,
        }, { transaction });
    }
    /**
     * Assess trade route delays and cost impacts
     * @param transaction Optional Sequelize transaction
     * @returns Trade routes with highest delays and costs
     */
    async assessTradeRouteImpacts(transaction) {
        const routes = await TradeRouteRisk.findAll({
            order: [['averageDelay', 'DESC']],
            limit: 20,
            transaction,
        }, { transaction });
        return routes.map((r) => ({
            route: `${r.originCountry}-${r.destinationCountry}`,
            delay: r.averageDelay,
            costImpact: r.costImpact,
            riskLevel: r.overallRisk,
        }));
    }
    /**
     * Calculate political stability score
     * @param countryCode Country to assess
     * @param factors Political stability factors
     * @param transaction Optional Sequelize transaction
     * @returns Political stability score
     */
    async calculatePoliticalStabilityScore(countryCode, factors, transaction) {
        const weights = {
            governmentEffectiveness: 0.2,
            regulatoryQuality: 0.2,
            ruleOfLaw: 0.2,
            controlOfCorruption: 0.15,
            politicalStability: 0.15,
            voiceAccountability: 0.1,
        };
        const score = (factors.governmentEffectiveness * weights.governmentEffectiveness +
            factors.regulatoryQuality * weights.regulatoryQuality +
            factors.ruleOfLaw * weights.ruleOfLaw +
            factors.controlOfCorruption * weights.controlOfCorruption +
            factors.politicalStability * weights.politicalStability +
            factors.voiceAccountability * weights.voiceAccountability) /
            100;
        const stabilityRating = score > 60 ? 'STABLE' : score > 40 ? 'MODERATE' : 'UNSTABLE';
        return { countryCode, score: Math.round(score * 100) / 100, stabilityRating };
    }
    /**
     * Score regulatory environment effectiveness
     * @param countryCode Country to assess
     * @param factors Regulatory environment factors
     * @param transaction Optional Sequelize transaction
     * @returns Regulatory environment score
     */
    async scoreRegulatoryEnvironment(countryCode, factors, transaction) {
        const weights = {
            amlCompliance: 0.25,
            fatfRecommendations: 0.25,
            cfTCompliance: 0.25,
            transparencyRequirements: 0.15,
            enforcementCapacity: 0.1,
        };
        const score = (factors.amlCompliance * weights.amlCompliance +
            factors.fatfRecommendations * weights.fatfRecommendations +
            factors.cfTCompliance * weights.cfTCompliance +
            factors.transparencyRequirements * weights.transparencyRequirements +
            factors.enforcementCapacity * weights.enforcementCapacity) /
            100;
        const environmentRating = score > 75 ? 'STRONG' : score > 50 ? 'ADEQUATE' : 'WEAK';
        return { countryCode, score: Math.round(score * 100) / 100, environmentRating };
    }
    /**
     * Helper: Get country name from country code
     * @param countryCode ISO 3166-1 alpha-3 country code
     * @returns Country name
     */
    getCountryName(countryCode) {
        const countryMap = {
            USA: 'United States',
            GBR: 'United Kingdom',
            CHN: 'China',
            IND: 'India',
            DEU: 'Germany',
            FRA: 'France',
            JPN: 'Japan',
            KOR: 'South Korea',
            RUS: 'Russia',
            IRN: 'Iran',
            PRK: 'North Korea',
            SYR: 'Syria',
            KWT: 'Kuwait',
            ARE: 'United Arab Emirates',
            SGP: 'Singapore',
            CHE: 'Switzerland',
            LUX: 'Luxembourg',
            CYM: 'Cayman Islands',
        };
        return countryMap[countryCode] || countryCode;
    }
}
exports.GeographicRiskAnalysisKit = GeographicRiskAnalysisKit;
exports.default = GeographicRiskAnalysisKit;
//# sourceMappingURL=geographic-risk-analysis-kit.js.map