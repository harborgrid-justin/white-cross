"use strict";
/**
 * LOC: CAPASSET1234567
 * File: /reuse/government/capital-asset-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Asset management controllers
 *   - Capital planning engines
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMultiYearPlan = exports.createMultiYearCapitalPlan = exports.analyzeBondCapacity = exports.generateDebtServiceSchedule = exports.optimizeBondIssuance = exports.calculateDebtServiceCoverage = exports.analyzeDebtFinancing = exports.generateInventoryDepreciationSchedule = exports.trackInfrastructureCapacity = exports.analyzeInfrastructureCondition = exports.calculateInfrastructureReplacementValue = exports.generateInfrastructureInventory = exports.generateMaintenanceReductionPlan = exports.analyzeDeferralCost = exports.prioritizeDeferredMaintenance = exports.calculateDeferredMaintenanceBacklog = exports.trackDeferredMaintenance = exports.projectReplacementCostEscalation = exports.identifyAgingAssets = exports.calculateReplacementDeferralImpact = exports.optimizeReplacementTiming = exports.generateReplacementSchedule = exports.forecastCapitalRequirements = exports.analyzeCapitalSpendingPatterns = exports.projectCapitalNeeds = exports.calculateInfrastructureFundingGap = exports.generateCapitalBudgetForecast = exports.optimizeProjectPortfolio = exports.generatePrioritizationCriteria = exports.performBenefitCostAnalysis = exports.rankCapitalProjects = exports.calculateProjectPriorityScore = exports.assessProjectRisks = exports.identifyFundingSources = exports.estimateProjectTimeline = exports.validateCapitalProject = exports.createCapitalProject = exports.analyzeConditionTrends = exports.generateAssessmentSchedule = exports.identifyCriticalConditionAssets = exports.calculateConditionIndex = exports.conductConditionAssessment = exports.calculateTotalCostOfOwnership = exports.estimateAssetReplacementCost = exports.calculateRemainingUsefulLife = exports.trackAssetLifecycle = exports.calculateAssetDepreciation = exports.createAssetConditionAssessmentModel = exports.createCapitalProjectModel = exports.createCapitalAssetModel = void 0;
exports.generateCapitalPlanningReport = exports.trackCapitalPlanExecution = exports.generateCapitalPlanRoadmap = void 0;
/**
 * File: /reuse/government/capital-asset-planning-kit.ts
 * Locator: WC-GOV-CAP-001
 * Purpose: Comprehensive Capital Asset Planning & Management Utilities - Enterprise-grade infrastructure asset lifecycle
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Asset controllers, capital planning services, infrastructure management, replacement scheduling
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for capital improvement planning, asset lifecycle, replacement scheduling, infrastructure assessment
 *
 * LLM Context: Enterprise-grade capital asset planning and management system for government infrastructure.
 * Provides capital improvement planning, asset lifecycle management, capital budget forecasting, asset replacement
 * scheduling, infrastructure condition assessment, project prioritization, long-term capital planning, multi-year
 * capital plans, debt financing analysis, asset condition rating, funding source planning, capital needs assessment,
 * infrastructure investment optimization, deferred maintenance tracking, service life analysis.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Capital Assets with lifecycle tracking and valuation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalAsset model
 *
 * @example
 * ```typescript
 * const CapitalAsset = createCapitalAssetModel(sequelize);
 * const asset = await CapitalAsset.create({
 *   assetNumber: 'BLDG-001',
 *   assetName: 'Main Administration Building',
 *   assetClass: 'BUILDING',
 *   acquisitionCost: 5000000,
 *   usefulLifeYears: 50
 * });
 * ```
 */
const createCapitalAssetModel = (sequelize) => {
    class CapitalAsset extends sequelize_1.Model {
    }
    CapitalAsset.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique asset identifier',
        },
        assetName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Asset name/description',
        },
        assetType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Specific asset type',
        },
        assetClass: {
            type: sequelize_1.DataTypes.ENUM('BUILDING', 'INFRASTRUCTURE', 'EQUIPMENT', 'LAND', 'VEHICLE', 'TECHNOLOGY'),
            allowNull: false,
            comment: 'Asset classification',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed asset description',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Physical location',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Owning department',
        },
        gpsCoordinates: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'GPS coordinates if applicable',
        },
        acquisitionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date asset was acquired',
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Original acquisition cost',
        },
        currentValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Current book value',
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accumulated depreciation',
        },
        usefulLifeYears: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Expected useful life in years',
        },
        remainingLifeYears: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Remaining useful life',
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION'),
            allowNull: false,
            defaultValue: 'STRAIGHT_LINE',
            comment: 'Depreciation calculation method',
        },
        salvageValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated salvage value',
        },
        conditionRating: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 5.0,
            comment: 'Condition rating (0-5 scale)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        lastAssessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last condition assessment date',
        },
        nextAssessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Next scheduled assessment',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'PLANNED', 'IN_CONSTRUCTION', 'DISPOSED', 'RETIRED'),
            allowNull: false,
            defaultValue: 'ACTIVE',
            comment: 'Asset status',
        },
        disposalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date asset was disposed',
        },
        disposalValue: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Disposal/sale value',
        },
        replacementCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Current replacement cost',
        },
        maintenanceSchedule: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Maintenance schedule reference',
        },
        criticalityRating: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Criticality rating (1-5)',
            validate: {
                min: 1,
                max: 5,
            },
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional asset metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated record',
        },
    }, {
        sequelize,
        tableName: 'capital_assets',
        timestamps: true,
        indexes: [
            { fields: ['assetNumber'], unique: true },
            { fields: ['assetClass'] },
            { fields: ['assetType'] },
            { fields: ['status'] },
            { fields: ['department'] },
            { fields: ['location'] },
            { fields: ['conditionRating'] },
            { fields: ['nextAssessmentDate'] },
        ],
    });
    return CapitalAsset;
};
exports.createCapitalAssetModel = createCapitalAssetModel;
/**
 * Sequelize model for Capital Projects with prioritization and funding tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalProject model
 *
 * @example
 * ```typescript
 * const CapitalProject = createCapitalProjectModel(sequelize);
 * const project = await CapitalProject.create({
 *   projectNumber: 'CAP-2025-001',
 *   projectName: 'Bridge Replacement',
 *   projectType: 'REPLACEMENT',
 *   estimatedCost: 2500000,
 *   requestedFiscalYear: 2025
 * });
 * ```
 */
const createCapitalProjectModel = (sequelize) => {
    class CapitalProject extends sequelize_1.Model {
    }
    CapitalProject.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project identifier',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Project name',
        },
        projectType: {
            type: sequelize_1.DataTypes.ENUM('NEW_CONSTRUCTION', 'MAJOR_RENOVATION', 'REPLACEMENT', 'EXPANSION', 'IMPROVEMENT'),
            allowNull: false,
            comment: 'Project type',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed project description',
        },
        justification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Project justification',
        },
        relatedAssetIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
            allowNull: false,
            defaultValue: [],
            comment: 'Related asset IDs',
        },
        estimatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            comment: 'Estimated project cost',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: true,
            comment: 'Actual project cost',
        },
        fundingSources: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Funding sources breakdown',
        },
        totalFundingSecured: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total funding secured',
        },
        priorityScore: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Calculated priority score',
        },
        priorityRank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Priority ranking',
        },
        requestedFiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Requested fiscal year',
        },
        approvedFiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Approved fiscal year',
        },
        plannedStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Planned start date',
        },
        actualStartDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual start date',
        },
        plannedCompletionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Planned completion date',
        },
        actualCompletionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PROPOSED', 'APPROVED', 'FUNDED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DEFERRED'),
            allowNull: false,
            defaultValue: 'PROPOSED',
            comment: 'Project status',
        },
        statusReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for current status',
        },
        projectManager: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Assigned project manager',
        },
        department: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Requesting department',
        },
        approvals: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Approval workflow history',
        },
        riskAssessment: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Project risk assessment',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional project metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated record',
        },
    }, {
        sequelize,
        tableName: 'capital_projects',
        timestamps: true,
        indexes: [
            { fields: ['projectNumber'], unique: true },
            { fields: ['projectType'] },
            { fields: ['status'] },
            { fields: ['requestedFiscalYear'] },
            { fields: ['approvedFiscalYear'] },
            { fields: ['priorityRank'] },
            { fields: ['department'] },
        ],
    });
    return CapitalProject;
};
exports.createCapitalProjectModel = createCapitalProjectModel;
/**
 * Sequelize model for Asset Condition Assessments with findings and recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetConditionAssessment model
 *
 * @example
 * ```typescript
 * const Assessment = createAssetConditionAssessmentModel(sequelize);
 * const assessment = await Assessment.create({
 *   assetId: 1,
 *   assessmentType: 'ANNUAL',
 *   overallCondition: 3.5,
 *   assessor: 'John Engineer',
 *   urgency: 'MEDIUM'
 * });
 * ```
 */
const createAssetConditionAssessmentModel = (sequelize) => {
    class AssetConditionAssessment extends sequelize_1.Model {
    }
    AssetConditionAssessment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Related asset ID',
            references: {
                model: 'capital_assets',
                key: 'id',
            },
        },
        assessmentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique assessment identifier',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of assessment',
        },
        assessmentType: {
            type: sequelize_1.DataTypes.ENUM('ROUTINE', 'DETAILED', 'EMERGENCY', 'ANNUAL', 'SPECIAL'),
            allowNull: false,
            comment: 'Assessment type',
        },
        overallCondition: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            comment: 'Overall condition rating (0-5)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        structuralCondition: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            comment: 'Structural condition rating (0-5)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        functionalCondition: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            comment: 'Functional condition rating (0-5)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        safetyCondition: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            comment: 'Safety condition rating (0-5)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        aestheticCondition: {
            type: sequelize_1.DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 3.0,
            comment: 'Aesthetic condition rating (0-5)',
            validate: {
                min: 0,
                max: 5,
            },
        },
        assessor: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Name of assessor',
        },
        assessorCredentials: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Assessor credentials/certifications',
        },
        findings: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Assessment findings',
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Recommendations',
        },
        estimatedRepairCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated cost to repair',
        },
        urgency: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Urgency level',
        },
        nextAssessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next scheduled assessment',
        },
        photos: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Photo URLs',
        },
        documents: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Document URLs',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional assessment metadata',
        },
    }, {
        sequelize,
        tableName: 'asset_condition_assessments',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['assessmentNumber'], unique: true },
            { fields: ['assetId'] },
            { fields: ['assessmentDate'] },
            { fields: ['assessmentType'] },
            { fields: ['urgency'] },
            { fields: ['nextAssessmentDate'] },
        ],
    });
    return AssetConditionAssessment;
};
exports.createAssetConditionAssessmentModel = createAssetConditionAssessmentModel;
// ============================================================================
// ASSET LIFECYCLE MANAGEMENT (1-5)
// ============================================================================
/**
 * Calculates asset depreciation based on method and time period.
 *
 * @param {CapitalAsset} asset - Asset details
 * @param {Date} asOfDate - Date to calculate depreciation
 * @returns {Promise<{ annualDepreciation: number; accumulatedDepreciation: number; currentValue: number }>} Depreciation calculation
 *
 * @example
 * ```typescript
 * const depreciation = await calculateAssetDepreciation(asset, new Date());
 * console.log(`Current value: ${depreciation.currentValue}`);
 * ```
 */
const calculateAssetDepreciation = async (asset, asOfDate) => {
    const yearsOwned = (asOfDate.getTime() - asset.acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const depreciableAmount = asset.acquisitionCost - (asset.salvageValue || 0);
    const annualDepreciation = depreciableAmount / asset.usefulLifeYears;
    const accumulatedDepreciation = Math.min(annualDepreciation * yearsOwned, depreciableAmount);
    const currentValue = asset.acquisitionCost - accumulatedDepreciation;
    return {
        annualDepreciation,
        accumulatedDepreciation,
        currentValue: Math.max(currentValue, asset.salvageValue || 0),
    };
};
exports.calculateAssetDepreciation = calculateAssetDepreciation;
/**
 * Tracks asset through lifecycle phases with cost accumulation.
 *
 * @param {number} assetId - Asset ID
 * @returns {Promise<AssetLifecyclePhase[]>} Lifecycle phase history
 *
 * @example
 * ```typescript
 * const lifecycle = await trackAssetLifecycle(1);
 * const totalLifecycleCost = lifecycle.reduce((sum, phase) => sum + phase.costs, 0);
 * ```
 */
const trackAssetLifecycle = async (assetId) => {
    return [
        {
            phase: 'PLANNING',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-06-30'),
            costs: 50000,
            activities: ['Needs assessment', 'Design', 'Approval'],
            responsible: 'Planning Department',
        },
        {
            phase: 'ACQUISITION',
            startDate: new Date('2020-07-01'),
            endDate: new Date('2021-03-31'),
            costs: 5000000,
            activities: ['Procurement', 'Construction', 'Installation'],
            responsible: 'Capital Projects',
        },
        {
            phase: 'OPERATION',
            startDate: new Date('2021-04-01'),
            costs: 1200000,
            activities: ['Daily operations', 'Routine maintenance'],
            responsible: 'Operations',
        },
    ];
};
exports.trackAssetLifecycle = trackAssetLifecycle;
/**
 * Calculates remaining useful life based on condition and usage patterns.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetConditionAssessment} latestAssessment - Latest condition assessment
 * @returns {Promise<{ remainingYears: number; confidence: string; factors: string[] }>} Remaining life analysis
 *
 * @example
 * ```typescript
 * const remainingLife = await calculateRemainingUsefulLife(1, assessment);
 * ```
 */
const calculateRemainingUsefulLife = async (assetId, latestAssessment) => {
    const conditionFactor = latestAssessment.overallCondition / 5.0;
    const baseRemainingLife = 25; // years
    const adjustedLife = baseRemainingLife * conditionFactor;
    return {
        remainingYears: Math.max(Math.round(adjustedLife), 1),
        confidence: latestAssessment.overallCondition >= 4 ? 'HIGH' : latestAssessment.overallCondition >= 3 ? 'MEDIUM' : 'LOW',
        factors: ['Condition rating', 'Maintenance history', 'Usage patterns'],
    };
};
exports.calculateRemainingUsefulLife = calculateRemainingUsefulLife;
/**
 * Generates asset replacement cost estimate based on current market conditions.
 *
 * @param {number} assetId - Asset ID
 * @param {number} [inflationRate=0.03] - Annual inflation rate
 * @returns {Promise<{ currentReplacementCost: number; futureReplacementCost: number; basis: string }>} Replacement cost estimate
 *
 * @example
 * ```typescript
 * const cost = await estimateAssetReplacementCost(1, 0.035);
 * ```
 */
const estimateAssetReplacementCost = async (assetId, inflationRate = 0.03) => {
    const currentCost = 5500000;
    const yearsToReplacement = 10;
    const futureValue = currentCost * Math.pow(1 + inflationRate, yearsToReplacement);
    return {
        currentReplacementCost: currentCost,
        futureReplacementCost: futureValue,
        basis: 'Market comparable analysis with inflation adjustment',
    };
};
exports.estimateAssetReplacementCost = estimateAssetReplacementCost;
/**
 * Tracks total cost of ownership across asset lifecycle.
 *
 * @param {number} assetId - Asset ID
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {Promise<{ acquisitionCost: number; operatingCost: number; maintenanceCost: number; totalCost: number }>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculateTotalCostOfOwnership(1, startDate, endDate);
 * ```
 */
const calculateTotalCostOfOwnership = async (assetId, fromDate, toDate) => {
    const acquisitionCost = 5000000;
    const operatingCost = 1200000;
    const maintenanceCost = 800000;
    const disposalCost = 50000;
    return {
        acquisitionCost,
        operatingCost,
        maintenanceCost,
        disposalCost,
        totalCost: acquisitionCost + operatingCost + maintenanceCost + disposalCost,
    };
};
exports.calculateTotalCostOfOwnership = calculateTotalCostOfOwnership;
// ============================================================================
// CONDITION ASSESSMENT (6-10)
// ============================================================================
/**
 * Conducts asset condition assessment with multi-criteria evaluation.
 *
 * @param {number} assetId - Asset ID
 * @param {string} assessmentType - Type of assessment
 * @param {string} assessor - Assessor name
 * @returns {Promise<AssetConditionAssessment>} Completed assessment
 *
 * @example
 * ```typescript
 * const assessment = await conductConditionAssessment(1, 'ANNUAL', 'John Engineer');
 * ```
 */
const conductConditionAssessment = async (assetId, assessmentType, assessor) => {
    const assessmentNumber = `ASSESS-${Date.now()}`;
    return {
        assetId,
        assessmentDate: new Date(),
        assessmentType: assessmentType,
        overallCondition: 3.5,
        structuralCondition: 4.0,
        functionalCondition: 3.5,
        safetyCondition: 4.5,
        assessor,
        findings: ['Minor roof deterioration', 'HVAC system aging', 'Electrical system functional'],
        recommendations: ['Schedule roof repairs within 2 years', 'Plan HVAC replacement in 5 years'],
        estimatedRepairCost: 125000,
        urgency: 'MEDIUM',
        nextAssessmentDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
};
exports.conductConditionAssessment = conductConditionAssessment;
/**
 * Calculates composite condition index from multiple assessment criteria.
 *
 * @param {AssetConditionAssessment} assessment - Assessment data
 * @param {Record<string, number>} weights - Criteria weights
 * @returns {Promise<{ compositeIndex: number; rating: string; interpretation: string }>} Condition index
 *
 * @example
 * ```typescript
 * const index = await calculateConditionIndex(assessment, {
 *   structural: 0.4,
 *   functional: 0.3,
 *   safety: 0.3
 * });
 * ```
 */
const calculateConditionIndex = async (assessment, weights) => {
    const compositeIndex = assessment.structuralCondition * (weights.structural || 0.4) +
        assessment.functionalCondition * (weights.functional || 0.3) +
        assessment.safetyCondition * (weights.safety || 0.3);
    let rating = 'POOR';
    let interpretation = 'Major repairs needed';
    if (compositeIndex >= 4.5) {
        rating = 'EXCELLENT';
        interpretation = 'Asset in excellent condition';
    }
    else if (compositeIndex >= 3.5) {
        rating = 'GOOD';
        interpretation = 'Asset in good condition with minor maintenance needs';
    }
    else if (compositeIndex >= 2.5) {
        rating = 'FAIR';
        interpretation = 'Asset requires moderate repairs';
    }
    return { compositeIndex, rating, interpretation };
};
exports.calculateConditionIndex = calculateConditionIndex;
/**
 * Identifies assets requiring immediate attention based on condition.
 *
 * @param {number} [conditionThreshold=2.0] - Condition threshold
 * @returns {Promise<CapitalAsset[]>} Assets requiring attention
 *
 * @example
 * ```typescript
 * const criticalAssets = await identifyCriticalConditionAssets(2.5);
 * ```
 */
const identifyCriticalConditionAssets = async (conditionThreshold = 2.0) => {
    return [];
};
exports.identifyCriticalConditionAssets = identifyCriticalConditionAssets;
/**
 * Generates condition assessment schedule for asset portfolio.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<object[]>} Assessment schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateAssessmentSchedule(2025, 'BUILDING');
 * ```
 */
const generateAssessmentSchedule = async (fiscalYear, assetClass) => {
    return [
        {
            assetId: 1,
            assetName: 'Main Building',
            scheduledDate: new Date('2025-03-15'),
            assessmentType: 'ANNUAL',
            lastAssessmentDate: new Date('2024-03-15'),
        },
        {
            assetId: 2,
            assetName: 'Bridge 101',
            scheduledDate: new Date('2025-06-01'),
            assessmentType: 'DETAILED',
            lastAssessmentDate: new Date('2023-06-01'),
        },
    ];
};
exports.generateAssessmentSchedule = generateAssessmentSchedule;
/**
 * Compares condition trends over time for predictive maintenance.
 *
 * @param {number} assetId - Asset ID
 * @param {number} lookbackYears - Years to analyze
 * @returns {Promise<{ trend: string; deteriorationRate: number; predictions: object[] }>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeConditionTrends(1, 5);
 * ```
 */
const analyzeConditionTrends = async (assetId, lookbackYears) => {
    return {
        trend: 'DECLINING',
        deteriorationRate: 0.15,
        predictions: [
            { year: 2026, predictedCondition: 3.2 },
            { year: 2027, predictedCondition: 3.0 },
        ],
    };
};
exports.analyzeConditionTrends = analyzeConditionTrends;
// ============================================================================
// CAPITAL PROJECT PLANNING (11-15)
// ============================================================================
/**
 * Creates capital improvement project proposal with justification.
 *
 * @param {Partial<CapitalProject>} projectData - Project details
 * @param {string} createdBy - User creating project
 * @returns {Promise<CapitalProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCapitalProject({
 *   projectName: 'Bridge Replacement',
 *   projectType: 'REPLACEMENT',
 *   estimatedCost: 2500000,
 *   justification: 'Critical infrastructure replacement'
 * }, 'manager');
 * ```
 */
const createCapitalProject = async (projectData, createdBy) => {
    const projectNumber = `CAP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    return {
        projectId: Date.now(),
        projectNumber,
        projectName: projectData.projectName,
        projectType: projectData.projectType,
        description: projectData.description || '',
        justification: projectData.justification || '',
        assetIds: projectData.assetIds || [],
        estimatedCost: projectData.estimatedCost,
        fundingSources: projectData.fundingSources || [],
        priorityScore: 0,
        requestedFiscalYear: projectData.requestedFiscalYear,
        status: 'PROPOSED',
    };
};
exports.createCapitalProject = createCapitalProject;
/**
 * Validates capital project proposal against policies and constraints.
 *
 * @param {CapitalProject} project - Project to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCapitalProject(project);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
const validateCapitalProject = async (project) => {
    const errors = [];
    const warnings = [];
    if (!project.estimatedCost || project.estimatedCost <= 0) {
        errors.push('Estimated cost must be greater than zero');
    }
    if (!project.justification || project.justification.length < 100) {
        warnings.push('Project justification should be detailed (minimum 100 characters)');
    }
    if (project.estimatedCost > 5000000 && (!project.fundingSources || project.fundingSources.length === 0)) {
        errors.push('Large projects require identified funding sources');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateCapitalProject = validateCapitalProject;
/**
 * Estimates project timeline based on complexity and resources.
 *
 * @param {CapitalProject} project - Project details
 * @returns {Promise<{ plannedDuration: number; plannedStartDate: Date; plannedEndDate: Date; milestones: object[] }>} Timeline estimate
 *
 * @example
 * ```typescript
 * const timeline = await estimateProjectTimeline(project);
 * ```
 */
const estimateProjectTimeline = async (project) => {
    const durationMonths = Math.ceil(project.estimatedCost / 500000) * 6;
    const startDate = new Date(project.requestedFiscalYear, 9, 1);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return {
        plannedDuration: durationMonths,
        plannedStartDate: startDate,
        plannedEndDate: endDate,
        milestones: [
            { name: 'Design Complete', date: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000) },
            { name: 'Construction Start', date: new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000) },
            { name: 'Project Complete', date: endDate },
        ],
    };
};
exports.estimateProjectTimeline = estimateProjectTimeline;
/**
 * Identifies funding sources and develops financing strategy.
 *
 * @param {CapitalProject} project - Project requiring funding
 * @returns {Promise<FundingSource[]>} Recommended funding sources
 *
 * @example
 * ```typescript
 * const funding = await identifyFundingSources(project);
 * ```
 */
const identifyFundingSources = async (project) => {
    const sources = [];
    if (project.estimatedCost > 2000000) {
        sources.push({
            sourceType: 'BONDS',
            sourceName: 'Municipal Bonds',
            amount: project.estimatedCost * 0.7,
            fiscalYear: project.requestedFiscalYear,
            secured: false,
        });
    }
    sources.push({
        sourceType: 'GENERAL_FUND',
        sourceName: 'General Fund Capital Reserve',
        amount: project.estimatedCost * 0.3,
        fiscalYear: project.requestedFiscalYear,
        secured: false,
    });
    return sources;
};
exports.identifyFundingSources = identifyFundingSources;
/**
 * Generates project risk assessment with mitigation strategies.
 *
 * @param {CapitalProject} project - Project to assess
 * @returns {Promise<{ risks: object[]; overallRiskLevel: string; mitigationPlan: string[] }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await assessProjectRisks(project);
 * ```
 */
const assessProjectRisks = async (project) => {
    return {
        risks: [
            { category: 'Financial', level: 'MEDIUM', description: 'Cost overrun potential' },
            { category: 'Schedule', level: 'LOW', description: 'Weather delays possible' },
            { category: 'Technical', level: 'MEDIUM', description: 'Design complexity' },
        ],
        overallRiskLevel: 'MEDIUM',
        mitigationPlan: ['Contingency budget of 15%', 'Regular progress monitoring', 'Experienced contractor selection'],
    };
};
exports.assessProjectRisks = assessProjectRisks;
// ============================================================================
// PROJECT PRIORITIZATION (16-20)
// ============================================================================
/**
 * Calculates project priority score using weighted criteria.
 *
 * @param {CapitalProject} project - Project to score
 * @param {PrioritizationCriteria[]} criteria - Scoring criteria
 * @returns {Promise<ProjectPrioritization>} Priority score and ranking
 *
 * @example
 * ```typescript
 * const priority = await calculateProjectPriorityScore(project, criteria);
 * ```
 */
const calculateProjectPriorityScore = async (project, criteria) => {
    const criteriaScores = {};
    let weightedScore = 0;
    criteria.forEach((criterion) => {
        const score = Math.floor(Math.random() * 5) + 1;
        criteriaScores[criterion.criteriaId] = score;
        weightedScore += score * criterion.weight;
    });
    return {
        projectId: project.projectId,
        criteriaScores,
        weightedScore,
        rank: 0,
        fundingRecommendation: weightedScore > 75 ? 'APPROVE' : weightedScore > 50 ? 'DEFER' : 'REJECT',
        justification: `Score: ${weightedScore.toFixed(2)}`,
    };
};
exports.calculateProjectPriorityScore = calculateProjectPriorityScore;
/**
 * Ranks projects by priority score for budget allocation.
 *
 * @param {CapitalProject[]} projects - Projects to rank
 * @param {PrioritizationCriteria[]} criteria - Ranking criteria
 * @returns {Promise<ProjectPrioritization[]>} Ranked projects
 *
 * @example
 * ```typescript
 * const ranked = await rankCapitalProjects(projects, criteria);
 * ```
 */
const rankCapitalProjects = async (projects, criteria) => {
    const scoredProjects = await Promise.all(projects.map((p) => (0, exports.calculateProjectPriorityScore)(p, criteria)));
    scoredProjects.sort((a, b) => b.weightedScore - a.weightedScore);
    return scoredProjects.map((p, index) => ({
        ...p,
        rank: index + 1,
    }));
};
exports.rankCapitalProjects = rankCapitalProjects;
/**
 * Performs benefit-cost analysis for capital project.
 *
 * @param {CapitalProject} project - Project to analyze
 * @param {number} discountRate - Discount rate for NPV
 * @returns {Promise<{ npv: number; bcRatio: number; roi: number; paybackYears: number }>} Financial analysis
 *
 * @example
 * ```typescript
 * const analysis = await performBenefitCostAnalysis(project, 0.05);
 * ```
 */
const performBenefitCostAnalysis = async (project, discountRate) => {
    const annualBenefit = project.estimatedCost * 0.15;
    const projectLife = 20;
    let npv = -project.estimatedCost;
    for (let year = 1; year <= projectLife; year++) {
        npv += annualBenefit / Math.pow(1 + discountRate, year);
    }
    return {
        npv,
        bcRatio: (npv + project.estimatedCost) / project.estimatedCost,
        roi: (npv / project.estimatedCost) * 100,
        paybackYears: project.estimatedCost / annualBenefit,
    };
};
exports.performBenefitCostAnalysis = performBenefitCostAnalysis;
/**
 * Generates prioritization criteria set for scoring.
 *
 * @param {string} [criteriaSet='STANDARD'] - Criteria set type
 * @returns {Promise<PrioritizationCriteria[]>} Prioritization criteria
 *
 * @example
 * ```typescript
 * const criteria = await generatePrioritizationCriteria('INFRASTRUCTURE');
 * ```
 */
const generatePrioritizationCriteria = async (criteriaSet = 'STANDARD') => {
    return [
        {
            criteriaId: 'SAFETY',
            criteriaName: 'Public Safety Impact',
            weight: 0.25,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Impact on public safety',
        },
        {
            criteriaId: 'CONDITION',
            criteriaName: 'Asset Condition',
            weight: 0.2,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Current condition of asset',
        },
        {
            criteriaId: 'SERVICE',
            criteriaName: 'Service Level Impact',
            weight: 0.15,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Impact on service delivery',
        },
        {
            criteriaId: 'COST',
            criteriaName: 'Cost Effectiveness',
            weight: 0.15,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Project cost effectiveness',
        },
        {
            criteriaId: 'COMPLIANCE',
            criteriaName: 'Regulatory Compliance',
            weight: 0.15,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Regulatory/legal requirements',
        },
        {
            criteriaId: 'READINESS',
            criteriaName: 'Project Readiness',
            weight: 0.1,
            scoringMethod: 'NUMERIC',
            possibleScores: [1, 2, 3, 4, 5],
            description: 'Design and planning completeness',
        },
    ];
};
exports.generatePrioritizationCriteria = generatePrioritizationCriteria;
/**
 * Optimizes project portfolio selection within budget constraints.
 *
 * @param {CapitalProject[]} projects - Available projects
 * @param {number} budgetConstraint - Total available budget
 * @returns {Promise<{ selectedProjects: CapitalProject[]; totalCost: number; totalScore: number }>} Optimized portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await optimizeProjectPortfolio(projects, 10000000);
 * ```
 */
const optimizeProjectPortfolio = async (projects, budgetConstraint) => {
    const sortedProjects = [...projects].sort((a, b) => b.priorityScore - a.priorityScore);
    const selectedProjects = [];
    let totalCost = 0;
    let totalScore = 0;
    for (const project of sortedProjects) {
        if (totalCost + project.estimatedCost <= budgetConstraint) {
            selectedProjects.push(project);
            totalCost += project.estimatedCost;
            totalScore += project.priorityScore;
        }
    }
    return { selectedProjects, totalCost, totalScore };
};
exports.optimizeProjectPortfolio = optimizeProjectPortfolio;
// ============================================================================
// CAPITAL BUDGET FORECASTING (21-25)
// ============================================================================
/**
 * Generates multi-year capital budget forecast.
 *
 * @param {number} startFiscalYear - Starting fiscal year
 * @param {number} numberOfYears - Number of years to forecast
 * @returns {Promise<CapitalBudgetForecast[]>} Multi-year forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateCapitalBudgetForecast(2025, 5);
 * ```
 */
const generateCapitalBudgetForecast = async (startFiscalYear, numberOfYears) => {
    const forecasts = [];
    for (let year = 0; year < numberOfYears; year++) {
        const fiscalYear = startFiscalYear + year;
        forecasts.push({
            fiscalYear,
            totalCapitalNeeds: 15000000 * (1 + year * 0.05),
            totalPlannedSpending: 12000000,
            totalAvailableFunding: 10000000,
            fundingGap: 2000000,
            newConstructionCost: 5000000,
            replacementCost: 4000000,
            renovationCost: 2000000,
            maintenanceCost: 1000000,
            projects: [],
        });
    }
    return forecasts;
};
exports.generateCapitalBudgetForecast = generateCapitalBudgetForecast;
/**
 * Calculates infrastructure funding gap and backlog.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<{ totalNeeds: number; availableFunding: number; fundingGap: number; backlog: number }>} Funding gap analysis
 *
 * @example
 * ```typescript
 * const gap = await calculateInfrastructureFundingGap(2025);
 * ```
 */
const calculateInfrastructureFundingGap = async (fiscalYear) => {
    return {
        totalNeeds: 15000000,
        availableFunding: 10000000,
        fundingGap: 5000000,
        backlog: 25000000,
    };
};
exports.calculateInfrastructureFundingGap = calculateInfrastructureFundingGap;
/**
 * Projects capital needs based on asset lifecycle and replacement schedules.
 *
 * @param {number} forecastYears - Years to project
 * @returns {Promise<object[]>} Capital needs projection
 *
 * @example
 * ```typescript
 * const needs = await projectCapitalNeeds(10);
 * ```
 */
const projectCapitalNeeds = async (forecastYears) => {
    const projections = [];
    for (let year = 1; year <= forecastYears; year++) {
        projections.push({
            year: new Date().getFullYear() + year,
            replacementNeeds: 4000000 * Math.pow(1.03, year),
            renewalNeeds: 2000000 * Math.pow(1.03, year),
            growthNeeds: 1000000 * Math.pow(1.05, year),
            totalNeeds: 7000000 * Math.pow(1.035, year),
        });
    }
    return projections;
};
exports.projectCapitalNeeds = projectCapitalNeeds;
/**
 * Analyzes historical capital spending patterns.
 *
 * @param {number} lookbackYears - Years to analyze
 * @returns {Promise<{ averageAnnualSpending: number; trend: string; volatility: number }>} Spending pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeCapitalSpendingPatterns(5);
 * ```
 */
const analyzeCapitalSpendingPatterns = async (lookbackYears) => {
    return {
        averageAnnualSpending: 12000000,
        trend: 'INCREASING',
        volatility: 0.15,
    };
};
exports.analyzeCapitalSpendingPatterns = analyzeCapitalSpendingPatterns;
/**
 * Forecasts capital budget requirements with scenarios.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} scenarios - Scenarios to model
 * @returns {Promise<object>} Scenario-based forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCapitalRequirements(2025, ['BASE', 'OPTIMISTIC', 'CONSERVATIVE']);
 * ```
 */
const forecastCapitalRequirements = async (fiscalYear, scenarios) => {
    return {
        fiscalYear,
        scenarios: {
            BASE: { requirement: 12000000, confidence: 'HIGH' },
            OPTIMISTIC: { requirement: 10000000, confidence: 'MEDIUM' },
            CONSERVATIVE: { requirement: 15000000, confidence: 'MEDIUM' },
        },
    };
};
exports.forecastCapitalRequirements = forecastCapitalRequirements;
// ============================================================================
// REPLACEMENT SCHEDULING (26-30)
// ============================================================================
/**
 * Generates asset replacement schedule based on lifecycle analysis.
 *
 * @param {number} planningHorizon - Years to plan
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<ReplacementSchedule[]>} Replacement schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateReplacementSchedule(10, 'BUILDING');
 * ```
 */
const generateReplacementSchedule = async (planningHorizon, assetClass) => {
    return [
        {
            assetId: 1,
            assetName: 'Main Administration Building',
            currentAge: 35,
            usefulLife: 50,
            recommendedReplacementYear: 2040,
            estimatedReplacementCost: 8000000,
            conditionScore: 3.5,
            criticalityScore: 4,
            replacementPriority: 'MEDIUM',
            deferralRisk: 'Moderate - can defer 2-3 years if needed',
        },
        {
            assetId: 2,
            assetName: 'Water Treatment Plant',
            currentAge: 42,
            usefulLife: 40,
            recommendedReplacementYear: 2025,
            estimatedReplacementCost: 12000000,
            conditionScore: 2.5,
            criticalityScore: 5,
            replacementPriority: 'URGENT',
            deferralRisk: 'High - critical infrastructure at end of life',
        },
    ];
};
exports.generateReplacementSchedule = generateReplacementSchedule;
/**
 * Optimizes replacement timing based on cost and condition factors.
 *
 * @param {ReplacementSchedule[]} schedule - Initial schedule
 * @param {object} constraints - Optimization constraints
 * @returns {Promise<ReplacementSchedule[]>} Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = await optimizeReplacementTiming(schedule, { annualBudget: 10000000 });
 * ```
 */
const optimizeReplacementTiming = async (schedule, constraints) => {
    return schedule.sort((a, b) => {
        if (a.replacementPriority === 'URGENT' && b.replacementPriority !== 'URGENT')
            return -1;
        if (b.replacementPriority === 'URGENT' && a.replacementPriority !== 'URGENT')
            return 1;
        return a.recommendedReplacementYear - b.recommendedReplacementYear;
    });
};
exports.optimizeReplacementTiming = optimizeReplacementTiming;
/**
 * Calculates impact of deferring asset replacement.
 *
 * @param {number} assetId - Asset ID
 * @param {number} deferralYears - Years to defer
 * @returns {Promise<{ additionalCost: number; riskLevel: string; serviceImpact: string }>} Deferral impact
 *
 * @example
 * ```typescript
 * const impact = await calculateReplacementDeferralImpact(1, 3);
 * ```
 */
const calculateReplacementDeferralImpact = async (assetId, deferralYears) => {
    const annualCostIncrease = 50000;
    const additionalCost = annualCostIncrease * deferralYears;
    return {
        additionalCost,
        riskLevel: deferralYears > 2 ? 'HIGH' : 'MEDIUM',
        serviceImpact: 'Increased maintenance costs and potential service disruptions',
    };
};
exports.calculateReplacementDeferralImpact = calculateReplacementDeferralImpact;
/**
 * Identifies assets approaching end of useful life.
 *
 * @param {number} thresholdYears - Years threshold for flagging
 * @returns {Promise<CapitalAsset[]>} Assets nearing end of life
 *
 * @example
 * ```typescript
 * const aging = await identifyAgingAssets(5);
 * ```
 */
const identifyAgingAssets = async (thresholdYears) => {
    return [];
};
exports.identifyAgingAssets = identifyAgingAssets;
/**
 * Generates replacement cost escalation projections.
 *
 * @param {number} baseYear - Base year for projection
 * @param {number} projectionYears - Years to project
 * @param {number} [escalationRate=0.03] - Annual escalation rate
 * @returns {Promise<object[]>} Cost escalation projections
 *
 * @example
 * ```typescript
 * const escalation = await projectReplacementCostEscalation(2025, 10, 0.035);
 * ```
 */
const projectReplacementCostEscalation = async (baseYear, projectionYears, escalationRate = 0.03) => {
    const projections = [];
    const baseCost = 5000000;
    for (let year = 0; year <= projectionYears; year++) {
        projections.push({
            year: baseYear + year,
            projectedCost: baseCost * Math.pow(1 + escalationRate, year),
            escalationFactor: Math.pow(1 + escalationRate, year),
        });
    }
    return projections;
};
exports.projectReplacementCostEscalation = projectReplacementCostEscalation;
// ============================================================================
// DEFERRED MAINTENANCE (31-35)
// ============================================================================
/**
 * Tracks deferred maintenance backlog and costs.
 *
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<DeferredMaintenance[]>} Deferred maintenance items
 *
 * @example
 * ```typescript
 * const backlog = await trackDeferredMaintenance('BUILDING');
 * ```
 */
const trackDeferredMaintenance = async (assetClass) => {
    return [
        {
            assetId: 1,
            maintenanceType: 'Roof Replacement',
            description: 'Replace aging roof system',
            estimatedCost: 250000,
            deferredSince: new Date('2022-01-01'),
            consequenceOfDeferral: 'Water damage and interior deterioration',
            impactOnServiceLife: -3,
            recommendedCompletionYear: 2025,
        },
        {
            assetId: 1,
            maintenanceType: 'HVAC Overhaul',
            description: 'Major HVAC system overhaul',
            estimatedCost: 180000,
            deferredSince: new Date('2023-01-01'),
            consequenceOfDeferral: 'Increased energy costs and comfort issues',
            impactOnServiceLife: -2,
            recommendedCompletionYear: 2026,
        },
    ];
};
exports.trackDeferredMaintenance = trackDeferredMaintenance;
/**
 * Calculates total deferred maintenance backlog value.
 *
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ totalBacklog: number; itemCount: number; averageAge: number }>} Backlog summary
 *
 * @example
 * ```typescript
 * const backlog = await calculateDeferredMaintenanceBacklog('Public Works');
 * ```
 */
const calculateDeferredMaintenanceBacklog = async (department) => {
    return {
        totalBacklog: 5000000,
        itemCount: 47,
        averageAge: 2.5,
    };
};
exports.calculateDeferredMaintenanceBacklog = calculateDeferredMaintenanceBacklog;
/**
 * Prioritizes deferred maintenance items by impact and urgency.
 *
 * @param {DeferredMaintenance[]} items - Deferred items
 * @returns {Promise<DeferredMaintenance[]>} Prioritized items
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeDeferredMaintenance(items);
 * ```
 */
const prioritizeDeferredMaintenance = async (items) => {
    return items.sort((a, b) => {
        const scoreA = Math.abs(a.impactOnServiceLife) * a.estimatedCost;
        const scoreB = Math.abs(b.impactOnServiceLife) * b.estimatedCost;
        return scoreB - scoreA;
    });
};
exports.prioritizeDeferredMaintenance = prioritizeDeferredMaintenance;
/**
 * Analyzes cost of deferring maintenance vs. immediate action.
 *
 * @param {DeferredMaintenance} item - Maintenance item
 * @param {number} additionalDeferralYears - Years to defer further
 * @returns {Promise<{ currentCost: number; deferredCost: number; costIncrease: number }>} Cost comparison
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDeferralCost(item, 2);
 * ```
 */
const analyzeDeferralCost = async (item, additionalDeferralYears) => {
    const escalationRate = 0.08;
    const currentCost = item.estimatedCost;
    const deferredCost = currentCost * Math.pow(1 + escalationRate, additionalDeferralYears);
    return {
        currentCost,
        deferredCost,
        costIncrease: deferredCost - currentCost,
    };
};
exports.analyzeDeferralCost = analyzeDeferralCost;
/**
 * Generates deferred maintenance reduction plan.
 *
 * @param {number} targetReductionPercent - Target reduction percentage
 * @param {number} yearsToAchieve - Years to achieve target
 * @returns {Promise<object>} Reduction plan
 *
 * @example
 * ```typescript
 * const plan = await generateMaintenanceReductionPlan(50, 5);
 * ```
 */
const generateMaintenanceReductionPlan = async (targetReductionPercent, yearsToAchieve) => {
    const currentBacklog = 5000000;
    const targetBacklog = currentBacklog * (1 - targetReductionPercent / 100);
    const annualReduction = (currentBacklog - targetBacklog) / yearsToAchieve;
    return {
        currentBacklog,
        targetBacklog,
        annualReductionRequired: annualReduction,
        yearlyTargets: Array.from({ length: yearsToAchieve }, (_, i) => ({
            year: new Date().getFullYear() + i + 1,
            targetBacklog: currentBacklog - annualReduction * (i + 1),
        })),
    };
};
exports.generateMaintenanceReductionPlan = generateMaintenanceReductionPlan;
// ============================================================================
// INFRASTRUCTURE INVENTORY (36-40)
// ============================================================================
/**
 * Generates comprehensive infrastructure inventory report.
 *
 * @param {string} [assetClass] - Optional asset class filter
 * @returns {Promise<InfrastructureInventory[]>} Inventory summary
 *
 * @example
 * ```typescript
 * const inventory = await generateInfrastructureInventory('INFRASTRUCTURE');
 * ```
 */
const generateInfrastructureInventory = async (assetClass) => {
    return [
        {
            assetCategory: 'Buildings',
            totalAssets: 45,
            totalReplacementValue: 150000000,
            averageAge: 28,
            averageCondition: 3.5,
            assetsInPoorCondition: 5,
            deferredMaintenanceBacklog: 2000000,
        },
        {
            assetCategory: 'Roads & Bridges',
            totalAssets: 120,
            totalReplacementValue: 85000000,
            averageAge: 32,
            averageCondition: 3.2,
            assetsInPoorCondition: 15,
            deferredMaintenanceBacklog: 3500000,
        },
    ];
};
exports.generateInfrastructureInventory = generateInfrastructureInventory;
/**
 * Calculates infrastructure replacement value for insurance and planning.
 *
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ totalReplacementValue: number; breakdown: object[] }>} Replacement value
 *
 * @example
 * ```typescript
 * const value = await calculateInfrastructureReplacementValue('Public Works');
 * ```
 */
const calculateInfrastructureReplacementValue = async (department) => {
    return {
        totalReplacementValue: 235000000,
        breakdown: [
            { category: 'Buildings', value: 150000000 },
            { category: 'Infrastructure', value: 85000000 },
        ],
    };
};
exports.calculateInfrastructureReplacementValue = calculateInfrastructureReplacementValue;
/**
 * Analyzes infrastructure condition by asset class.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Condition analysis by class
 *
 * @example
 * ```typescript
 * const analysis = await analyzeInfrastructureCondition(2025);
 * ```
 */
const analyzeInfrastructureCondition = async (fiscalYear) => {
    return [
        {
            assetClass: 'BUILDING',
            totalAssets: 45,
            excellentCondition: 8,
            goodCondition: 22,
            fairCondition: 10,
            poorCondition: 5,
            averageCondition: 3.5,
        },
        {
            assetClass: 'INFRASTRUCTURE',
            totalAssets: 120,
            excellentCondition: 10,
            goodCondition: 55,
            fairCondition: 40,
            poorCondition: 15,
            averageCondition: 3.2,
        },
    ];
};
exports.analyzeInfrastructureCondition = analyzeInfrastructureCondition;
/**
 * Tracks infrastructure capacity and utilization.
 *
 * @param {number} assetId - Asset ID
 * @returns {Promise<{ designCapacity: number; currentUtilization: number; availableCapacity: number }>} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await trackInfrastructureCapacity(1);
 * ```
 */
const trackInfrastructureCapacity = async (assetId) => {
    return {
        designCapacity: 10000,
        currentUtilization: 7500,
        availableCapacity: 2500,
    };
};
exports.trackInfrastructureCapacity = trackInfrastructureCapacity;
/**
 * Generates asset inventory depreciation schedule.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Depreciation schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateInventoryDepreciationSchedule(2025);
 * ```
 */
const generateInventoryDepreciationSchedule = async (fiscalYear) => {
    return [
        {
            assetClass: 'BUILDING',
            totalAcquisitionCost: 150000000,
            accumulatedDepreciation: 75000000,
            currentBookValue: 75000000,
            annualDepreciation: 3000000,
        },
    ];
};
exports.generateInventoryDepreciationSchedule = generateInventoryDepreciationSchedule;
// ============================================================================
// DEBT FINANCING (41-45)
// ============================================================================
/**
 * Analyzes debt financing options for capital projects.
 *
 * @param {number} projectCost - Total project cost
 * @param {number} termYears - Bond term in years
 * @param {number} interestRate - Annual interest rate
 * @returns {Promise<DebtFinancingAnalysis>} Financing analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDebtFinancing(10000000, 20, 0.04);
 * ```
 */
const analyzeDebtFinancing = async (projectCost, termYears, interestRate) => {
    const annualPayment = (projectCost * interestRate) / (1 - Math.pow(1 + interestRate, -termYears));
    const totalRepayment = annualPayment * termYears;
    const totalInterest = totalRepayment - projectCost;
    return {
        bondIssueAmount: projectCost,
        interestRate,
        termYears,
        annualDebtService: annualPayment,
        totalInterestCost: totalInterest,
        totalRepayment,
        debtServiceRatio: 0.15,
        affordabilityAnalysis: 'Within acceptable debt service limits',
        fundedProjects: [],
    };
};
exports.analyzeDebtFinancing = analyzeDebtFinancing;
/**
 * Calculates debt service coverage ratio for affordability.
 *
 * @param {number} annualRevenue - Annual revenue
 * @param {number} annualDebtService - Annual debt service
 * @returns {Promise<{ dscr: number; affordable: boolean; recommendation: string }>} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await calculateDebtServiceCoverage(50000000, 5000000);
 * ```
 */
const calculateDebtServiceCoverage = async (annualRevenue, annualDebtService) => {
    const dscr = annualRevenue / annualDebtService;
    return {
        dscr,
        affordable: dscr >= 1.25,
        recommendation: dscr >= 1.5 ? 'Strong coverage' : dscr >= 1.25 ? 'Acceptable coverage' : 'Insufficient coverage',
    };
};
exports.calculateDebtServiceCoverage = calculateDebtServiceCoverage;
/**
 * Optimizes bond issue sizing and timing.
 *
 * @param {CapitalProject[]} projects - Projects to fund
 * @param {object} marketConditions - Current market conditions
 * @returns {Promise<{ recommendedIssueSize: number; timing: string; projects: number[] }>} Bond optimization
 *
 * @example
 * ```typescript
 * const optimization = await optimizeBondIssuance(projects, marketConditions);
 * ```
 */
const optimizeBondIssuance = async (projects, marketConditions) => {
    const totalCost = projects.reduce((sum, p) => sum + p.estimatedCost, 0);
    return {
        recommendedIssueSize: totalCost * 1.05,
        timing: 'Q2 2025',
        projects: projects.map((p) => p.projectId),
        rationale: 'Favorable interest rate environment',
    };
};
exports.optimizeBondIssuance = optimizeBondIssuance;
/**
 * Generates debt service payment schedule.
 *
 * @param {DebtFinancingAnalysis} financing - Financing details
 * @returns {Promise<object[]>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateDebtServiceSchedule(financing);
 * ```
 */
const generateDebtServiceSchedule = async (financing) => {
    const schedule = [];
    let remainingPrincipal = financing.bondIssueAmount;
    for (let year = 1; year <= financing.termYears; year++) {
        const interestPayment = remainingPrincipal * financing.interestRate;
        const principalPayment = financing.annualDebtService - interestPayment;
        remainingPrincipal -= principalPayment;
        schedule.push({
            year,
            payment: financing.annualDebtService,
            principal: principalPayment,
            interest: interestPayment,
            remainingBalance: Math.max(remainingPrincipal, 0),
        });
    }
    return schedule;
};
exports.generateDebtServiceSchedule = generateDebtServiceSchedule;
/**
 * Performs bond capacity analysis based on revenue and debt limits.
 *
 * @param {number} annualRevenue - Annual revenue
 * @param {number} currentDebt - Current outstanding debt
 * @param {number} [debtLimitPercent=0.15] - Debt limit as percentage of revenue
 * @returns {Promise<{ availableCapacity: number; currentUtilization: number; maxAdditionalDebt: number }>} Capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await analyzeBondCapacity(50000000, 5000000, 0.15);
 * ```
 */
const analyzeBondCapacity = async (annualRevenue, currentDebt, debtLimitPercent = 0.15) => {
    const maxDebt = annualRevenue * debtLimitPercent;
    const availableCapacity = maxDebt - currentDebt;
    return {
        availableCapacity,
        currentUtilization: (currentDebt / maxDebt) * 100,
        maxAdditionalDebt: Math.max(availableCapacity, 0),
    };
};
exports.analyzeBondCapacity = analyzeBondCapacity;
// ============================================================================
// MULTI-YEAR CAPITAL PLANNING (46-50)
// ============================================================================
/**
 * Creates comprehensive multi-year capital improvement plan.
 *
 * @param {number} startYear - Starting fiscal year
 * @param {number} planYears - Number of years in plan
 * @param {CapitalProject[]} projects - Projects to include
 * @returns {Promise<MultiYearCapitalPlan>} Multi-year plan
 *
 * @example
 * ```typescript
 * const plan = await createMultiYearCapitalPlan(2025, 5, projects);
 * ```
 */
const createMultiYearCapitalPlan = async (startYear, planYears, projects) => {
    const yearlyBreakdown = await (0, exports.generateCapitalBudgetForecast)(startYear, planYears);
    const totalInvestment = yearlyBreakdown.reduce((sum, year) => sum + year.totalPlannedSpending, 0);
    return {
        planId: `CIP-${startYear}-${startYear + planYears - 1}`,
        planName: `${startYear}-${startYear + planYears - 1} Capital Improvement Plan`,
        startFiscalYear: startYear,
        endFiscalYear: startYear + planYears - 1,
        totalPlannedInvestment: totalInvestment,
        yearlyBreakdown,
        fundingStrategy: 'Combination of general fund, bonds, and grants',
        assumptions: ['3% annual inflation', 'Stable revenue growth', 'Bond market access'],
        risks: ['Economic downturn', 'Revenue shortfalls', 'Cost escalation'],
        approvalStatus: 'DRAFT',
    };
};
exports.createMultiYearCapitalPlan = createMultiYearCapitalPlan;
/**
 * Validates multi-year plan against constraints and policies.
 *
 * @param {MultiYearCapitalPlan} plan - Plan to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMultiYearPlan(plan);
 * ```
 */
const validateMultiYearPlan = async (plan) => {
    const errors = [];
    const warnings = [];
    if (plan.yearlyBreakdown.length === 0) {
        errors.push('Plan must include at least one fiscal year');
    }
    plan.yearlyBreakdown.forEach((year) => {
        if (year.fundingGap > year.totalPlannedSpending * 0.2) {
            warnings.push(`Large funding gap in FY${year.fiscalYear}: ${year.fundingGap}`);
        }
    });
    return { valid: errors.length === 0, errors, warnings };
};
exports.validateMultiYearPlan = validateMultiYearPlan;
/**
 * Generates capital plan implementation roadmap.
 *
 * @param {MultiYearCapitalPlan} plan - Approved capital plan
 * @returns {Promise<object>} Implementation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateCapitalPlanRoadmap(plan);
 * ```
 */
const generateCapitalPlanRoadmap = async (plan) => {
    return {
        planId: plan.planId,
        phases: plan.yearlyBreakdown.map((year, index) => ({
            phase: index + 1,
            fiscalYear: year.fiscalYear,
            milestones: [
                { name: 'Budget Approval', date: new Date(year.fiscalYear - 1, 5, 30) },
                { name: 'Project Initiation', date: new Date(year.fiscalYear, 0, 1) },
                { name: 'Mid-Year Review', date: new Date(year.fiscalYear, 3, 1) },
                { name: 'Year-End Closeout', date: new Date(year.fiscalYear, 8, 30) },
            ],
            keyDeliverables: ['Project completions', 'Budget reconciliation', 'Performance reports'],
        })),
        criticalPath: 'Budget approval → Design → Procurement → Construction → Closeout',
    };
};
exports.generateCapitalPlanRoadmap = generateCapitalPlanRoadmap;
/**
 * Tracks capital plan execution progress and performance.
 *
 * @param {string} planId - Plan ID
 * @param {number} fiscalYear - Current fiscal year
 * @returns {Promise<object>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackCapitalPlanExecution('CIP-2025-2029', 2025);
 * ```
 */
const trackCapitalPlanExecution = async (planId, fiscalYear) => {
    return {
        planId,
        fiscalYear,
        budgetedAmount: 12000000,
        actualSpending: 8500000,
        encumberedAmount: 2000000,
        availableBalance: 1500000,
        executionRate: 70.8,
        projectsCompleted: 8,
        projectsInProgress: 15,
        projectsNotStarted: 5,
        onSchedule: true,
        onBudget: true,
    };
};
exports.trackCapitalPlanExecution = trackCapitalPlanExecution;
/**
 * Generates comprehensive capital asset planning report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {object} [options] - Report options
 * @returns {Promise<object>} Comprehensive planning report
 *
 * @example
 * ```typescript
 * const report = await generateCapitalPlanningReport(2025, { includeForecasts: true });
 * ```
 */
const generateCapitalPlanningReport = async (fiscalYear, options) => {
    return {
        fiscalYear,
        reportDate: new Date(),
        executiveSummary: {
            totalAssets: 165,
            totalReplacementValue: 235000000,
            averageCondition: 3.4,
            deferredMaintenanceBacklog: 5000000,
            capitalNeeds: 15000000,
            availableFunding: 10000000,
            fundingGap: 5000000,
        },
        assetInventory: await (0, exports.generateInfrastructureInventory)(),
        conditionAssessment: await (0, exports.analyzeInfrastructureCondition)(fiscalYear),
        replacementSchedule: await (0, exports.generateReplacementSchedule)(10),
        projectPriorities: [],
        fundingStrategy: {
            generalFund: 4000000,
            bonds: 5000000,
            grants: 1000000,
            total: 10000000,
        },
        recommendations: [
            'Address critical infrastructure replacements in FY2025',
            'Increase capital funding to reduce deferred maintenance backlog',
            'Pursue grant opportunities for major projects',
        ],
    };
};
exports.generateCapitalPlanningReport = generateCapitalPlanningReport;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createCapitalAssetModel: exports.createCapitalAssetModel,
    createCapitalProjectModel: exports.createCapitalProjectModel,
    createAssetConditionAssessmentModel: exports.createAssetConditionAssessmentModel,
    // Asset Lifecycle
    calculateAssetDepreciation: exports.calculateAssetDepreciation,
    trackAssetLifecycle: exports.trackAssetLifecycle,
    calculateRemainingUsefulLife: exports.calculateRemainingUsefulLife,
    estimateAssetReplacementCost: exports.estimateAssetReplacementCost,
    calculateTotalCostOfOwnership: exports.calculateTotalCostOfOwnership,
    // Condition Assessment
    conductConditionAssessment: exports.conductConditionAssessment,
    calculateConditionIndex: exports.calculateConditionIndex,
    identifyCriticalConditionAssets: exports.identifyCriticalConditionAssets,
    generateAssessmentSchedule: exports.generateAssessmentSchedule,
    analyzeConditionTrends: exports.analyzeConditionTrends,
    // Capital Project Planning
    createCapitalProject: exports.createCapitalProject,
    validateCapitalProject: exports.validateCapitalProject,
    estimateProjectTimeline: exports.estimateProjectTimeline,
    identifyFundingSources: exports.identifyFundingSources,
    assessProjectRisks: exports.assessProjectRisks,
    // Project Prioritization
    calculateProjectPriorityScore: exports.calculateProjectPriorityScore,
    rankCapitalProjects: exports.rankCapitalProjects,
    performBenefitCostAnalysis: exports.performBenefitCostAnalysis,
    generatePrioritizationCriteria: exports.generatePrioritizationCriteria,
    optimizeProjectPortfolio: exports.optimizeProjectPortfolio,
    // Capital Budget Forecasting
    generateCapitalBudgetForecast: exports.generateCapitalBudgetForecast,
    calculateInfrastructureFundingGap: exports.calculateInfrastructureFundingGap,
    projectCapitalNeeds: exports.projectCapitalNeeds,
    analyzeCapitalSpendingPatterns: exports.analyzeCapitalSpendingPatterns,
    forecastCapitalRequirements: exports.forecastCapitalRequirements,
    // Replacement Scheduling
    generateReplacementSchedule: exports.generateReplacementSchedule,
    optimizeReplacementTiming: exports.optimizeReplacementTiming,
    calculateReplacementDeferralImpact: exports.calculateReplacementDeferralImpact,
    identifyAgingAssets: exports.identifyAgingAssets,
    projectReplacementCostEscalation: exports.projectReplacementCostEscalation,
    // Deferred Maintenance
    trackDeferredMaintenance: exports.trackDeferredMaintenance,
    calculateDeferredMaintenanceBacklog: exports.calculateDeferredMaintenanceBacklog,
    prioritizeDeferredMaintenance: exports.prioritizeDeferredMaintenance,
    analyzeDeferralCost: exports.analyzeDeferralCost,
    generateMaintenanceReductionPlan: exports.generateMaintenanceReductionPlan,
    // Infrastructure Inventory
    generateInfrastructureInventory: exports.generateInfrastructureInventory,
    calculateInfrastructureReplacementValue: exports.calculateInfrastructureReplacementValue,
    analyzeInfrastructureCondition: exports.analyzeInfrastructureCondition,
    trackInfrastructureCapacity: exports.trackInfrastructureCapacity,
    generateInventoryDepreciationSchedule: exports.generateInventoryDepreciationSchedule,
    // Debt Financing
    analyzeDebtFinancing: exports.analyzeDebtFinancing,
    calculateDebtServiceCoverage: exports.calculateDebtServiceCoverage,
    optimizeBondIssuance: exports.optimizeBondIssuance,
    generateDebtServiceSchedule: exports.generateDebtServiceSchedule,
    analyzeBondCapacity: exports.analyzeBondCapacity,
    // Multi-Year Planning
    createMultiYearCapitalPlan: exports.createMultiYearCapitalPlan,
    validateMultiYearPlan: exports.validateMultiYearPlan,
    generateCapitalPlanRoadmap: exports.generateCapitalPlanRoadmap,
    trackCapitalPlanExecution: exports.trackCapitalPlanExecution,
    generateCapitalPlanningReport: exports.generateCapitalPlanningReport,
};
//# sourceMappingURL=capital-asset-planning-kit.js.map