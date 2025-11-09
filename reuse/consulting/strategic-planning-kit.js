"use strict";
/**
 * LOC: CONSSTRAT12345
 * File: /reuse/consulting/strategic-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Strategic planning controllers
 *   - Business analytics dashboards
 *   - Executive reporting engines
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancedScorecardModel = exports.BCGMatrixModel = exports.PorterFiveForcesModel = exports.SWOTAnalysisModel = exports.CriticalUncertaintyDto = exports.AssumptionDto = exports.ScenarioDto = exports.CreateScenarioPlanningDto = exports.PerformanceMeasureDto = exports.StrategicObjectiveDto = exports.PerspectiveMetricsDto = exports.CreateBalancedScorecardDto = exports.GrowthInitiativeDto = exports.CreateAnsoffMatrixDto = exports.BCGBusinessUnitDto = exports.CreateBCGMatrixDto = exports.ForceFactorDto = exports.ForceAnalysisDto = exports.CreatePorterFiveForcesDto = exports.SWOTItemDto = exports.CreateSWOTAnalysisDto = exports.StrategicRiskLevel = exports.GrowthStrategy = exports.CompetitiveIntensity = exports.InitiativeStatus = exports.StrategyPriority = exports.StrategicPosition = exports.StrategyFramework = void 0;
exports.createSWOTAnalysis = createSWOTAnalysis;
exports.generateCrossFactorAnalysis = generateCrossFactorAnalysis;
exports.generateSWOTRecommendations = generateSWOTRecommendations;
exports.createPorterFiveForcesAnalysis = createPorterFiveForcesAnalysis;
exports.calculateIndustryAttractiveness = calculateIndustryAttractiveness;
exports.createBCGMatrixAnalysis = createBCGMatrixAnalysis;
exports.determineBCGPosition = determineBCGPosition;
exports.getBCGStrategy = getBCGStrategy;
exports.getInvestmentPriority = getInvestmentPriority;
exports.generatePortfolioRecommendations = generatePortfolioRecommendations;
exports.calculateResourceAllocation = calculateResourceAllocation;
exports.identifyStrategicGaps = identifyStrategicGaps;
exports.createAnsoffMatrixAnalysis = createAnsoffMatrixAnalysis;
exports.assessAnsoffRisk = assessAnsoffRisk;
exports.createBalancedScorecard = createBalancedScorecard;
exports.buildStrategyMap = buildStrategyMap;
exports.calculateBalancedScorecardPerformance = calculateBalancedScorecardPerformance;
exports.trackMeasurePerformance = trackMeasurePerformance;
exports.createScenarioPlanningAnalysis = createScenarioPlanningAnalysis;
exports.generateEarlyWarningIndicators = generateEarlyWarningIndicators;
exports.generateContingencyPlans = generateContingencyPlans;
exports.assessScenarioProbability = assessScenarioProbability;
exports.createValueChainAnalysis = createValueChainAnalysis;
exports.identifyCostDrivers = identifyCostDrivers;
exports.identifyValueDrivers = identifyValueDrivers;
exports.identifyCompetitiveAdvantages = identifyCompetitiveAdvantages;
exports.calculateValueChainMargin = calculateValueChainMargin;
exports.benchmarkValueChainActivities = benchmarkValueChainActivities;
exports.generateStrategicRoadmap = generateStrategicRoadmap;
exports.performStakeholderAnalysis = performStakeholderAnalysis;
exports.calculateStrategicFitScore = calculateStrategicFitScore;
exports.optimizePortfolioAllocation = optimizePortfolioAllocation;
exports.conductPESTELAnalysis = conductPESTELAnalysis;
exports.analyzeCoreCompetencies = analyzeCoreCompetencies;
exports.calculateMarketAttractiveness = calculateMarketAttractiveness;
exports.performGapAnalysis = performGapAnalysis;
exports.simulateStrategicScenarios = simulateStrategicScenarios;
exports.prioritizeStrategicInitiatives = prioritizeStrategicInitiatives;
exports.trackStrategicKPIs = trackStrategicKPIs;
exports.generateStrategyExecutionDashboard = generateStrategyExecutionDashboard;
exports.analyzeStrategicDependencies = analyzeStrategicDependencies;
exports.calculateStrategicMomentum = calculateStrategicMomentum;
exports.assessStrategicAgility = assessStrategicAgility;
exports.forecastStrategicOutcomes = forecastStrategicOutcomes;
exports.generateExecutiveStrategySummary = generateExecutiveStrategySummary;
/**
 * File: /reuse/consulting/strategic-planning-kit.ts
 * Locator: WC-CONSULTING-STRATEGY-001
 * Purpose: Comprehensive Strategic Planning & Analysis - McKinsey/BCG-level strategic frameworks and methodologies
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, strategy services, analytics platforms, executive dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for SWOT analysis, Porter's Five Forces, BCG Matrix, Ansoff Matrix, balanced scorecard, scenario planning
 *
 * LLM Context: Enterprise-grade strategic planning system competing with McKinsey/BCG/Bain capabilities.
 * Provides comprehensive strategic analysis frameworks including SWOT, Porter's Five Forces, BCG Matrix,
 * Ansoff Matrix, balanced scorecard, scenario planning, competitive intelligence, market analysis,
 * strategic roadmapping, value chain analysis, blue ocean strategy, core competency analysis,
 * stakeholder mapping, strategic risk assessment, portfolio optimization, and strategic performance tracking.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Strategic analysis framework types
 */
var StrategyFramework;
(function (StrategyFramework) {
    StrategyFramework["SWOT"] = "swot";
    StrategyFramework["PORTER_FIVE_FORCES"] = "porter_five_forces";
    StrategyFramework["BCG_MATRIX"] = "bcg_matrix";
    StrategyFramework["ANSOFF_MATRIX"] = "ansoff_matrix";
    StrategyFramework["BALANCED_SCORECARD"] = "balanced_scorecard";
    StrategyFramework["VALUE_CHAIN"] = "value_chain";
    StrategyFramework["PESTEL"] = "pestel";
    StrategyFramework["BLUE_OCEAN"] = "blue_ocean";
    StrategyFramework["CORE_COMPETENCY"] = "core_competency";
    StrategyFramework["SCENARIO_PLANNING"] = "scenario_planning";
})(StrategyFramework || (exports.StrategyFramework = StrategyFramework = {}));
/**
 * Strategic position quadrants
 */
var StrategicPosition;
(function (StrategicPosition) {
    StrategicPosition["STAR"] = "star";
    StrategicPosition["CASH_COW"] = "cash_cow";
    StrategicPosition["QUESTION_MARK"] = "question_mark";
    StrategicPosition["DOG"] = "dog";
    StrategicPosition["LEADER"] = "leader";
    StrategicPosition["CHALLENGER"] = "challenger";
    StrategicPosition["FOLLOWER"] = "follower";
    StrategicPosition["NICHER"] = "nicher";
})(StrategicPosition || (exports.StrategicPosition = StrategicPosition = {}));
/**
 * Strategic priority levels
 */
var StrategyPriority;
(function (StrategyPriority) {
    StrategyPriority["CRITICAL"] = "critical";
    StrategyPriority["HIGH"] = "high";
    StrategyPriority["MEDIUM"] = "medium";
    StrategyPriority["LOW"] = "low";
    StrategyPriority["DEFERRED"] = "deferred";
})(StrategyPriority || (exports.StrategyPriority = StrategyPriority = {}));
/**
 * Strategic initiative status
 */
var InitiativeStatus;
(function (InitiativeStatus) {
    InitiativeStatus["PROPOSED"] = "proposed";
    InitiativeStatus["APPROVED"] = "approved";
    InitiativeStatus["IN_PROGRESS"] = "in_progress";
    InitiativeStatus["ON_HOLD"] = "on_hold";
    InitiativeStatus["COMPLETED"] = "completed";
    InitiativeStatus["CANCELLED"] = "cancelled";
    InitiativeStatus["UNDER_REVIEW"] = "under_review";
})(InitiativeStatus || (exports.InitiativeStatus = InitiativeStatus = {}));
/**
 * Competitive intensity levels
 */
var CompetitiveIntensity;
(function (CompetitiveIntensity) {
    CompetitiveIntensity["VERY_HIGH"] = "very_high";
    CompetitiveIntensity["HIGH"] = "high";
    CompetitiveIntensity["MODERATE"] = "moderate";
    CompetitiveIntensity["LOW"] = "low";
    CompetitiveIntensity["VERY_LOW"] = "very_low";
})(CompetitiveIntensity || (exports.CompetitiveIntensity = CompetitiveIntensity = {}));
/**
 * Growth strategy types
 */
var GrowthStrategy;
(function (GrowthStrategy) {
    GrowthStrategy["MARKET_PENETRATION"] = "market_penetration";
    GrowthStrategy["MARKET_DEVELOPMENT"] = "market_development";
    GrowthStrategy["PRODUCT_DEVELOPMENT"] = "product_development";
    GrowthStrategy["DIVERSIFICATION"] = "diversification";
    GrowthStrategy["VERTICAL_INTEGRATION"] = "vertical_integration";
    GrowthStrategy["HORIZONTAL_INTEGRATION"] = "horizontal_integration";
})(GrowthStrategy || (exports.GrowthStrategy = GrowthStrategy = {}));
/**
 * Strategic risk levels
 */
var StrategicRiskLevel;
(function (StrategicRiskLevel) {
    StrategicRiskLevel["CRITICAL"] = "critical";
    StrategicRiskLevel["HIGH"] = "high";
    StrategicRiskLevel["MODERATE"] = "moderate";
    StrategicRiskLevel["LOW"] = "low";
    StrategicRiskLevel["NEGLIGIBLE"] = "negligible";
})(StrategicRiskLevel || (exports.StrategicRiskLevel = StrategicRiskLevel = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * DTO for creating SWOT analysis
 */
let CreateSWOTAnalysisDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _analysisName_decorators;
    let _analysisName_initializers = [];
    let _analysisName_extraInitializers = [];
    let _analysisDate_decorators;
    let _analysisDate_initializers = [];
    let _analysisDate_extraInitializers = [];
    let _timeHorizon_decorators;
    let _timeHorizon_initializers = [];
    let _timeHorizon_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _weaknesses_decorators;
    let _weaknesses_initializers = [];
    let _weaknesses_extraInitializers = [];
    let _opportunities_decorators;
    let _opportunities_initializers = [];
    let _opportunities_extraInitializers = [];
    let _threats_decorators;
    let _threats_initializers = [];
    let _threats_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateSWOTAnalysisDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.analysisName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _analysisName_initializers, void 0));
                this.analysisDate = (__runInitializers(this, _analysisName_extraInitializers), __runInitializers(this, _analysisDate_initializers, void 0));
                this.timeHorizon = (__runInitializers(this, _analysisDate_extraInitializers), __runInitializers(this, _timeHorizon_initializers, void 0));
                this.strengths = (__runInitializers(this, _timeHorizon_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.weaknesses = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _weaknesses_initializers, void 0));
                this.opportunities = (__runInitializers(this, _weaknesses_extraInitializers), __runInitializers(this, _opportunities_initializers, void 0));
                this.threats = (__runInitializers(this, _opportunities_extraInitializers), __runInitializers(this, _threats_initializers, void 0));
                this.metadata = (__runInitializers(this, _threats_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _analysisDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis date' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _timeHorizon_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time horizon for analysis' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of strengths', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SWOTItemDto)];
            _weaknesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of weaknesses', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SWOTItemDto)];
            _opportunities_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of opportunities', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SWOTItemDto)];
            _threats_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of threats', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => SWOTItemDto)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _analysisName_decorators, { kind: "field", name: "analysisName", static: false, private: false, access: { has: obj => "analysisName" in obj, get: obj => obj.analysisName, set: (obj, value) => { obj.analysisName = value; } }, metadata: _metadata }, _analysisName_initializers, _analysisName_extraInitializers);
            __esDecorate(null, null, _analysisDate_decorators, { kind: "field", name: "analysisDate", static: false, private: false, access: { has: obj => "analysisDate" in obj, get: obj => obj.analysisDate, set: (obj, value) => { obj.analysisDate = value; } }, metadata: _metadata }, _analysisDate_initializers, _analysisDate_extraInitializers);
            __esDecorate(null, null, _timeHorizon_decorators, { kind: "field", name: "timeHorizon", static: false, private: false, access: { has: obj => "timeHorizon" in obj, get: obj => obj.timeHorizon, set: (obj, value) => { obj.timeHorizon = value; } }, metadata: _metadata }, _timeHorizon_initializers, _timeHorizon_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _weaknesses_decorators, { kind: "field", name: "weaknesses", static: false, private: false, access: { has: obj => "weaknesses" in obj, get: obj => obj.weaknesses, set: (obj, value) => { obj.weaknesses = value; } }, metadata: _metadata }, _weaknesses_initializers, _weaknesses_extraInitializers);
            __esDecorate(null, null, _opportunities_decorators, { kind: "field", name: "opportunities", static: false, private: false, access: { has: obj => "opportunities" in obj, get: obj => obj.opportunities, set: (obj, value) => { obj.opportunities = value; } }, metadata: _metadata }, _opportunities_initializers, _opportunities_extraInitializers);
            __esDecorate(null, null, _threats_decorators, { kind: "field", name: "threats", static: false, private: false, access: { has: obj => "threats" in obj, get: obj => obj.threats, set: (obj, value) => { obj.threats = value; } }, metadata: _metadata }, _threats_initializers, _threats_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSWOTAnalysisDto = CreateSWOTAnalysisDto;
/**
 * DTO for SWOT item
 */
let SWOTItemDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _urgency_decorators;
    let _urgency_initializers = [];
    let _urgency_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _relatedFactors_decorators;
    let _relatedFactors_initializers = [];
    let _relatedFactors_extraInitializers = [];
    let _actionItems_decorators;
    let _actionItems_initializers = [];
    let _actionItems_extraInitializers = [];
    return _a = class SWOTItemDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.impact = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.urgency = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _urgency_initializers, void 0));
                this.evidence = (__runInitializers(this, _urgency_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
                this.relatedFactors = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _relatedFactors_initializers, void 0));
                this.actionItems = (__runInitializers(this, _relatedFactors_extraInitializers), __runInitializers(this, _actionItems_initializers, void 0));
                __runInitializers(this, _actionItems_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'SWOT category' }), (0, class_validator_1.IsEnum)(['strength', 'weakness', 'opportunity', 'threat']), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _urgency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Urgency score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _evidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supporting evidence', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _relatedFactors_decorators = [(0, swagger_1.ApiProperty)({ description: 'Related factors', type: [String], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _actionItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action items', type: [String], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _urgency_decorators, { kind: "field", name: "urgency", static: false, private: false, access: { has: obj => "urgency" in obj, get: obj => obj.urgency, set: (obj, value) => { obj.urgency = value; } }, metadata: _metadata }, _urgency_initializers, _urgency_extraInitializers);
            __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
            __esDecorate(null, null, _relatedFactors_decorators, { kind: "field", name: "relatedFactors", static: false, private: false, access: { has: obj => "relatedFactors" in obj, get: obj => obj.relatedFactors, set: (obj, value) => { obj.relatedFactors = value; } }, metadata: _metadata }, _relatedFactors_initializers, _relatedFactors_extraInitializers);
            __esDecorate(null, null, _actionItems_decorators, { kind: "field", name: "actionItems", static: false, private: false, access: { has: obj => "actionItems" in obj, get: obj => obj.actionItems, set: (obj, value) => { obj.actionItems = value; } }, metadata: _metadata }, _actionItems_initializers, _actionItems_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SWOTItemDto = SWOTItemDto;
/**
 * DTO for creating Porter's Five Forces analysis
 */
let CreatePorterFiveForcesDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _industry_decorators;
    let _industry_initializers = [];
    let _industry_extraInitializers = [];
    let _analysisDate_decorators;
    let _analysisDate_initializers = [];
    let _analysisDate_extraInitializers = [];
    let _competitiveRivalry_decorators;
    let _competitiveRivalry_initializers = [];
    let _competitiveRivalry_extraInitializers = [];
    let _threatOfNewEntrants_decorators;
    let _threatOfNewEntrants_initializers = [];
    let _threatOfNewEntrants_extraInitializers = [];
    let _bargainingPowerSuppliers_decorators;
    let _bargainingPowerSuppliers_initializers = [];
    let _bargainingPowerSuppliers_extraInitializers = [];
    let _bargainingPowerBuyers_decorators;
    let _bargainingPowerBuyers_initializers = [];
    let _bargainingPowerBuyers_extraInitializers = [];
    let _threatOfSubstitutes_decorators;
    let _threatOfSubstitutes_initializers = [];
    let _threatOfSubstitutes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePorterFiveForcesDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.industry = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _industry_initializers, void 0));
                this.analysisDate = (__runInitializers(this, _industry_extraInitializers), __runInitializers(this, _analysisDate_initializers, void 0));
                this.competitiveRivalry = (__runInitializers(this, _analysisDate_extraInitializers), __runInitializers(this, _competitiveRivalry_initializers, void 0));
                this.threatOfNewEntrants = (__runInitializers(this, _competitiveRivalry_extraInitializers), __runInitializers(this, _threatOfNewEntrants_initializers, void 0));
                this.bargainingPowerSuppliers = (__runInitializers(this, _threatOfNewEntrants_extraInitializers), __runInitializers(this, _bargainingPowerSuppliers_initializers, void 0));
                this.bargainingPowerBuyers = (__runInitializers(this, _bargainingPowerSuppliers_extraInitializers), __runInitializers(this, _bargainingPowerBuyers_initializers, void 0));
                this.threatOfSubstitutes = (__runInitializers(this, _bargainingPowerBuyers_extraInitializers), __runInitializers(this, _threatOfSubstitutes_initializers, void 0));
                this.metadata = (__runInitializers(this, _threatOfSubstitutes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _industry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Industry name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis date' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _competitiveRivalry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitive rivalry analysis' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => ForceAnalysisDto)];
            _threatOfNewEntrants_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat of new entrants analysis' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => ForceAnalysisDto)];
            _bargainingPowerSuppliers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bargaining power of suppliers analysis' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => ForceAnalysisDto)];
            _bargainingPowerBuyers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bargaining power of buyers analysis' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => ForceAnalysisDto)];
            _threatOfSubstitutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat of substitutes analysis' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => ForceAnalysisDto)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _industry_decorators, { kind: "field", name: "industry", static: false, private: false, access: { has: obj => "industry" in obj, get: obj => obj.industry, set: (obj, value) => { obj.industry = value; } }, metadata: _metadata }, _industry_initializers, _industry_extraInitializers);
            __esDecorate(null, null, _analysisDate_decorators, { kind: "field", name: "analysisDate", static: false, private: false, access: { has: obj => "analysisDate" in obj, get: obj => obj.analysisDate, set: (obj, value) => { obj.analysisDate = value; } }, metadata: _metadata }, _analysisDate_initializers, _analysisDate_extraInitializers);
            __esDecorate(null, null, _competitiveRivalry_decorators, { kind: "field", name: "competitiveRivalry", static: false, private: false, access: { has: obj => "competitiveRivalry" in obj, get: obj => obj.competitiveRivalry, set: (obj, value) => { obj.competitiveRivalry = value; } }, metadata: _metadata }, _competitiveRivalry_initializers, _competitiveRivalry_extraInitializers);
            __esDecorate(null, null, _threatOfNewEntrants_decorators, { kind: "field", name: "threatOfNewEntrants", static: false, private: false, access: { has: obj => "threatOfNewEntrants" in obj, get: obj => obj.threatOfNewEntrants, set: (obj, value) => { obj.threatOfNewEntrants = value; } }, metadata: _metadata }, _threatOfNewEntrants_initializers, _threatOfNewEntrants_extraInitializers);
            __esDecorate(null, null, _bargainingPowerSuppliers_decorators, { kind: "field", name: "bargainingPowerSuppliers", static: false, private: false, access: { has: obj => "bargainingPowerSuppliers" in obj, get: obj => obj.bargainingPowerSuppliers, set: (obj, value) => { obj.bargainingPowerSuppliers = value; } }, metadata: _metadata }, _bargainingPowerSuppliers_initializers, _bargainingPowerSuppliers_extraInitializers);
            __esDecorate(null, null, _bargainingPowerBuyers_decorators, { kind: "field", name: "bargainingPowerBuyers", static: false, private: false, access: { has: obj => "bargainingPowerBuyers" in obj, get: obj => obj.bargainingPowerBuyers, set: (obj, value) => { obj.bargainingPowerBuyers = value; } }, metadata: _metadata }, _bargainingPowerBuyers_initializers, _bargainingPowerBuyers_extraInitializers);
            __esDecorate(null, null, _threatOfSubstitutes_decorators, { kind: "field", name: "threatOfSubstitutes", static: false, private: false, access: { has: obj => "threatOfSubstitutes" in obj, get: obj => obj.threatOfSubstitutes, set: (obj, value) => { obj.threatOfSubstitutes = value; } }, metadata: _metadata }, _threatOfSubstitutes_initializers, _threatOfSubstitutes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePorterFiveForcesDto = CreatePorterFiveForcesDto;
/**
 * DTO for force analysis
 */
let ForceAnalysisDto = (() => {
    var _a;
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _intensityScore_decorators;
    let _intensityScore_initializers = [];
    let _intensityScore_extraInitializers = [];
    let _keyFactors_decorators;
    let _keyFactors_initializers = [];
    let _keyFactors_extraInitializers = [];
    let _strategicResponse_decorators;
    let _strategicResponse_initializers = [];
    let _strategicResponse_extraInitializers = [];
    return _a = class ForceAnalysisDto {
            constructor() {
                this.intensity = __runInitializers(this, _intensity_initializers, void 0);
                this.intensityScore = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _intensityScore_initializers, void 0));
                this.keyFactors = (__runInitializers(this, _intensityScore_extraInitializers), __runInitializers(this, _keyFactors_initializers, void 0));
                this.strategicResponse = (__runInitializers(this, _keyFactors_extraInitializers), __runInitializers(this, _strategicResponse_initializers, void 0));
                __runInitializers(this, _strategicResponse_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _intensity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitive intensity level', enum: CompetitiveIntensity }), (0, class_validator_1.IsEnum)(CompetitiveIntensity)];
            _intensityScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Intensity score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _keyFactors_decorators = [(0, swagger_1.ApiProperty)({ description: 'Key factors', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => ForceFactorDto)];
            _strategicResponse_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic response' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _intensityScore_decorators, { kind: "field", name: "intensityScore", static: false, private: false, access: { has: obj => "intensityScore" in obj, get: obj => obj.intensityScore, set: (obj, value) => { obj.intensityScore = value; } }, metadata: _metadata }, _intensityScore_initializers, _intensityScore_extraInitializers);
            __esDecorate(null, null, _keyFactors_decorators, { kind: "field", name: "keyFactors", static: false, private: false, access: { has: obj => "keyFactors" in obj, get: obj => obj.keyFactors, set: (obj, value) => { obj.keyFactors = value; } }, metadata: _metadata }, _keyFactors_initializers, _keyFactors_extraInitializers);
            __esDecorate(null, null, _strategicResponse_decorators, { kind: "field", name: "strategicResponse", static: false, private: false, access: { has: obj => "strategicResponse" in obj, get: obj => obj.strategicResponse, set: (obj, value) => { obj.strategicResponse = value; } }, metadata: _metadata }, _strategicResponse_initializers, _strategicResponse_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ForceAnalysisDto = ForceAnalysisDto;
/**
 * DTO for force factor
 */
let ForceFactorDto = (() => {
    var _a;
    let _factor_decorators;
    let _factor_initializers = [];
    let _factor_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _trend_decorators;
    let _trend_initializers = [];
    let _trend_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class ForceFactorDto {
            constructor() {
                this.factor = __runInitializers(this, _factor_initializers, void 0);
                this.impact = (__runInitializers(this, _factor_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.trend = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _trend_initializers, void 0));
                this.description = (__runInitializers(this, _trend_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _factor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Factor name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _trend_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trend direction', enum: ['increasing', 'stable', 'decreasing'] }), (0, class_validator_1.IsEnum)(['increasing', 'stable', 'decreasing'])];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Factor description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _factor_decorators, { kind: "field", name: "factor", static: false, private: false, access: { has: obj => "factor" in obj, get: obj => obj.factor, set: (obj, value) => { obj.factor = value; } }, metadata: _metadata }, _factor_initializers, _factor_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _trend_decorators, { kind: "field", name: "trend", static: false, private: false, access: { has: obj => "trend" in obj, get: obj => obj.trend, set: (obj, value) => { obj.trend = value; } }, metadata: _metadata }, _trend_initializers, _trend_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ForceFactorDto = ForceFactorDto;
/**
 * DTO for creating BCG Matrix analysis
 */
let CreateBCGMatrixDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _portfolioName_decorators;
    let _portfolioName_initializers = [];
    let _portfolioName_extraInitializers = [];
    let _analysisDate_decorators;
    let _analysisDate_initializers = [];
    let _analysisDate_extraInitializers = [];
    let _businessUnits_decorators;
    let _businessUnits_initializers = [];
    let _businessUnits_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateBCGMatrixDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.portfolioName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _portfolioName_initializers, void 0));
                this.analysisDate = (__runInitializers(this, _portfolioName_extraInitializers), __runInitializers(this, _analysisDate_initializers, void 0));
                this.businessUnits = (__runInitializers(this, _analysisDate_extraInitializers), __runInitializers(this, _businessUnits_initializers, void 0));
                this.metadata = (__runInitializers(this, _businessUnits_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _portfolioName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis date' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _businessUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business units', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => BCGBusinessUnitDto)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _portfolioName_decorators, { kind: "field", name: "portfolioName", static: false, private: false, access: { has: obj => "portfolioName" in obj, get: obj => obj.portfolioName, set: (obj, value) => { obj.portfolioName = value; } }, metadata: _metadata }, _portfolioName_initializers, _portfolioName_extraInitializers);
            __esDecorate(null, null, _analysisDate_decorators, { kind: "field", name: "analysisDate", static: false, private: false, access: { has: obj => "analysisDate" in obj, get: obj => obj.analysisDate, set: (obj, value) => { obj.analysisDate = value; } }, metadata: _metadata }, _analysisDate_initializers, _analysisDate_extraInitializers);
            __esDecorate(null, null, _businessUnits_decorators, { kind: "field", name: "businessUnits", static: false, private: false, access: { has: obj => "businessUnits" in obj, get: obj => obj.businessUnits, set: (obj, value) => { obj.businessUnits = value; } }, metadata: _metadata }, _businessUnits_initializers, _businessUnits_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBCGMatrixDto = CreateBCGMatrixDto;
/**
 * DTO for BCG business unit
 */
let BCGBusinessUnitDto = (() => {
    var _a;
    let _unitName_decorators;
    let _unitName_initializers = [];
    let _unitName_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _marketGrowthRate_decorators;
    let _marketGrowthRate_initializers = [];
    let _marketGrowthRate_extraInitializers = [];
    let _relativeMarketShare_decorators;
    let _relativeMarketShare_initializers = [];
    let _relativeMarketShare_extraInitializers = [];
    let _revenue_decorators;
    let _revenue_initializers = [];
    let _revenue_extraInitializers = [];
    let _profitMargin_decorators;
    let _profitMargin_initializers = [];
    let _profitMargin_extraInitializers = [];
    let _strategicImportance_decorators;
    let _strategicImportance_initializers = [];
    let _strategicImportance_extraInitializers = [];
    let _recommendedStrategy_decorators;
    let _recommendedStrategy_initializers = [];
    let _recommendedStrategy_extraInitializers = [];
    return _a = class BCGBusinessUnitDto {
            constructor() {
                this.unitName = __runInitializers(this, _unitName_initializers, void 0);
                this.position = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _position_initializers, void 0));
                this.marketGrowthRate = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _marketGrowthRate_initializers, void 0));
                this.relativeMarketShare = (__runInitializers(this, _marketGrowthRate_extraInitializers), __runInitializers(this, _relativeMarketShare_initializers, void 0));
                this.revenue = (__runInitializers(this, _relativeMarketShare_extraInitializers), __runInitializers(this, _revenue_initializers, void 0));
                this.profitMargin = (__runInitializers(this, _revenue_extraInitializers), __runInitializers(this, _profitMargin_initializers, void 0));
                this.strategicImportance = (__runInitializers(this, _profitMargin_extraInitializers), __runInitializers(this, _strategicImportance_initializers, void 0));
                this.recommendedStrategy = (__runInitializers(this, _strategicImportance_extraInitializers), __runInitializers(this, _recommendedStrategy_initializers, void 0));
                __runInitializers(this, _recommendedStrategy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business unit name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _position_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic position', enum: StrategicPosition }), (0, class_validator_1.IsEnum)(StrategicPosition)];
            _marketGrowthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market growth rate percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _relativeMarketShare_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relative market share ratio' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _revenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _profitMargin_decorators = [(0, swagger_1.ApiProperty)({ description: 'Profit margin percentage' }), (0, class_validator_1.IsNumber)()];
            _strategicImportance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic importance score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _recommendedStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommended strategy' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: obj => "unitName" in obj, get: obj => obj.unitName, set: (obj, value) => { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
            __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
            __esDecorate(null, null, _marketGrowthRate_decorators, { kind: "field", name: "marketGrowthRate", static: false, private: false, access: { has: obj => "marketGrowthRate" in obj, get: obj => obj.marketGrowthRate, set: (obj, value) => { obj.marketGrowthRate = value; } }, metadata: _metadata }, _marketGrowthRate_initializers, _marketGrowthRate_extraInitializers);
            __esDecorate(null, null, _relativeMarketShare_decorators, { kind: "field", name: "relativeMarketShare", static: false, private: false, access: { has: obj => "relativeMarketShare" in obj, get: obj => obj.relativeMarketShare, set: (obj, value) => { obj.relativeMarketShare = value; } }, metadata: _metadata }, _relativeMarketShare_initializers, _relativeMarketShare_extraInitializers);
            __esDecorate(null, null, _revenue_decorators, { kind: "field", name: "revenue", static: false, private: false, access: { has: obj => "revenue" in obj, get: obj => obj.revenue, set: (obj, value) => { obj.revenue = value; } }, metadata: _metadata }, _revenue_initializers, _revenue_extraInitializers);
            __esDecorate(null, null, _profitMargin_decorators, { kind: "field", name: "profitMargin", static: false, private: false, access: { has: obj => "profitMargin" in obj, get: obj => obj.profitMargin, set: (obj, value) => { obj.profitMargin = value; } }, metadata: _metadata }, _profitMargin_initializers, _profitMargin_extraInitializers);
            __esDecorate(null, null, _strategicImportance_decorators, { kind: "field", name: "strategicImportance", static: false, private: false, access: { has: obj => "strategicImportance" in obj, get: obj => obj.strategicImportance, set: (obj, value) => { obj.strategicImportance = value; } }, metadata: _metadata }, _strategicImportance_initializers, _strategicImportance_extraInitializers);
            __esDecorate(null, null, _recommendedStrategy_decorators, { kind: "field", name: "recommendedStrategy", static: false, private: false, access: { has: obj => "recommendedStrategy" in obj, get: obj => obj.recommendedStrategy, set: (obj, value) => { obj.recommendedStrategy = value; } }, metadata: _metadata }, _recommendedStrategy_initializers, _recommendedStrategy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BCGBusinessUnitDto = BCGBusinessUnitDto;
/**
 * DTO for creating Ansoff Matrix analysis
 */
let CreateAnsoffMatrixDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _analysisName_decorators;
    let _analysisName_initializers = [];
    let _analysisName_extraInitializers = [];
    let _analysisDate_decorators;
    let _analysisDate_initializers = [];
    let _analysisDate_extraInitializers = [];
    let _marketPenetration_decorators;
    let _marketPenetration_initializers = [];
    let _marketPenetration_extraInitializers = [];
    let _marketDevelopment_decorators;
    let _marketDevelopment_initializers = [];
    let _marketDevelopment_extraInitializers = [];
    let _productDevelopment_decorators;
    let _productDevelopment_initializers = [];
    let _productDevelopment_extraInitializers = [];
    let _diversification_decorators;
    let _diversification_initializers = [];
    let _diversification_extraInitializers = [];
    let _recommendedStrategy_decorators;
    let _recommendedStrategy_initializers = [];
    let _recommendedStrategy_extraInitializers = [];
    return _a = class CreateAnsoffMatrixDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.analysisName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _analysisName_initializers, void 0));
                this.analysisDate = (__runInitializers(this, _analysisName_extraInitializers), __runInitializers(this, _analysisDate_initializers, void 0));
                this.marketPenetration = (__runInitializers(this, _analysisDate_extraInitializers), __runInitializers(this, _marketPenetration_initializers, void 0));
                this.marketDevelopment = (__runInitializers(this, _marketPenetration_extraInitializers), __runInitializers(this, _marketDevelopment_initializers, void 0));
                this.productDevelopment = (__runInitializers(this, _marketDevelopment_extraInitializers), __runInitializers(this, _productDevelopment_initializers, void 0));
                this.diversification = (__runInitializers(this, _productDevelopment_extraInitializers), __runInitializers(this, _diversification_initializers, void 0));
                this.recommendedStrategy = (__runInitializers(this, _diversification_extraInitializers), __runInitializers(this, _recommendedStrategy_initializers, void 0));
                __runInitializers(this, _recommendedStrategy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis date' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _marketPenetration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market penetration initiatives', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => GrowthInitiativeDto)];
            _marketDevelopment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market development initiatives', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => GrowthInitiativeDto)];
            _productDevelopment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product development initiatives', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => GrowthInitiativeDto)];
            _diversification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Diversification initiatives', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => GrowthInitiativeDto)];
            _recommendedStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommended growth strategy', enum: GrowthStrategy }), (0, class_validator_1.IsEnum)(GrowthStrategy)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _analysisName_decorators, { kind: "field", name: "analysisName", static: false, private: false, access: { has: obj => "analysisName" in obj, get: obj => obj.analysisName, set: (obj, value) => { obj.analysisName = value; } }, metadata: _metadata }, _analysisName_initializers, _analysisName_extraInitializers);
            __esDecorate(null, null, _analysisDate_decorators, { kind: "field", name: "analysisDate", static: false, private: false, access: { has: obj => "analysisDate" in obj, get: obj => obj.analysisDate, set: (obj, value) => { obj.analysisDate = value; } }, metadata: _metadata }, _analysisDate_initializers, _analysisDate_extraInitializers);
            __esDecorate(null, null, _marketPenetration_decorators, { kind: "field", name: "marketPenetration", static: false, private: false, access: { has: obj => "marketPenetration" in obj, get: obj => obj.marketPenetration, set: (obj, value) => { obj.marketPenetration = value; } }, metadata: _metadata }, _marketPenetration_initializers, _marketPenetration_extraInitializers);
            __esDecorate(null, null, _marketDevelopment_decorators, { kind: "field", name: "marketDevelopment", static: false, private: false, access: { has: obj => "marketDevelopment" in obj, get: obj => obj.marketDevelopment, set: (obj, value) => { obj.marketDevelopment = value; } }, metadata: _metadata }, _marketDevelopment_initializers, _marketDevelopment_extraInitializers);
            __esDecorate(null, null, _productDevelopment_decorators, { kind: "field", name: "productDevelopment", static: false, private: false, access: { has: obj => "productDevelopment" in obj, get: obj => obj.productDevelopment, set: (obj, value) => { obj.productDevelopment = value; } }, metadata: _metadata }, _productDevelopment_initializers, _productDevelopment_extraInitializers);
            __esDecorate(null, null, _diversification_decorators, { kind: "field", name: "diversification", static: false, private: false, access: { has: obj => "diversification" in obj, get: obj => obj.diversification, set: (obj, value) => { obj.diversification = value; } }, metadata: _metadata }, _diversification_initializers, _diversification_extraInitializers);
            __esDecorate(null, null, _recommendedStrategy_decorators, { kind: "field", name: "recommendedStrategy", static: false, private: false, access: { has: obj => "recommendedStrategy" in obj, get: obj => obj.recommendedStrategy, set: (obj, value) => { obj.recommendedStrategy = value; } }, metadata: _metadata }, _recommendedStrategy_initializers, _recommendedStrategy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAnsoffMatrixDto = CreateAnsoffMatrixDto;
/**
 * DTO for growth initiative
 */
let GrowthInitiativeDto = (() => {
    var _a;
    let _initiativeName_decorators;
    let _initiativeName_initializers = [];
    let _initiativeName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _expectedRevenue_decorators;
    let _expectedRevenue_initializers = [];
    let _expectedRevenue_extraInitializers = [];
    let _investmentRequired_decorators;
    let _investmentRequired_initializers = [];
    let _investmentRequired_extraInitializers = [];
    let _roi_decorators;
    let _roi_initializers = [];
    let _roi_extraInitializers = [];
    let _timeToMarket_decorators;
    let _timeToMarket_initializers = [];
    let _timeToMarket_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    let _successProbability_decorators;
    let _successProbability_initializers = [];
    let _successProbability_extraInitializers = [];
    let _strategicFit_decorators;
    let _strategicFit_initializers = [];
    let _strategicFit_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class GrowthInitiativeDto {
            constructor() {
                this.initiativeName = __runInitializers(this, _initiativeName_initializers, void 0);
                this.description = (__runInitializers(this, _initiativeName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.expectedRevenue = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _expectedRevenue_initializers, void 0));
                this.investmentRequired = (__runInitializers(this, _expectedRevenue_extraInitializers), __runInitializers(this, _investmentRequired_initializers, void 0));
                this.roi = (__runInitializers(this, _investmentRequired_extraInitializers), __runInitializers(this, _roi_initializers, void 0));
                this.timeToMarket = (__runInitializers(this, _roi_extraInitializers), __runInitializers(this, _timeToMarket_initializers, void 0));
                this.riskLevel = (__runInitializers(this, _timeToMarket_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
                this.successProbability = (__runInitializers(this, _riskLevel_extraInitializers), __runInitializers(this, _successProbability_initializers, void 0));
                this.strategicFit = (__runInitializers(this, _successProbability_extraInitializers), __runInitializers(this, _strategicFit_initializers, void 0));
                this.priority = (__runInitializers(this, _strategicFit_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _initiativeName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initiative name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initiative description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _expectedRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected revenue' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _investmentRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Investment required' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _roi_decorators = [(0, swagger_1.ApiProperty)({ description: 'ROI percentage' }), (0, class_validator_1.IsNumber)()];
            _timeToMarket_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time to market in months' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _riskLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk level', enum: StrategicRiskLevel }), (0, class_validator_1.IsEnum)(StrategicRiskLevel)];
            _successProbability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success probability 0-1' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _strategicFit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic fit score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level', enum: StrategyPriority }), (0, class_validator_1.IsEnum)(StrategyPriority)];
            __esDecorate(null, null, _initiativeName_decorators, { kind: "field", name: "initiativeName", static: false, private: false, access: { has: obj => "initiativeName" in obj, get: obj => obj.initiativeName, set: (obj, value) => { obj.initiativeName = value; } }, metadata: _metadata }, _initiativeName_initializers, _initiativeName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _expectedRevenue_decorators, { kind: "field", name: "expectedRevenue", static: false, private: false, access: { has: obj => "expectedRevenue" in obj, get: obj => obj.expectedRevenue, set: (obj, value) => { obj.expectedRevenue = value; } }, metadata: _metadata }, _expectedRevenue_initializers, _expectedRevenue_extraInitializers);
            __esDecorate(null, null, _investmentRequired_decorators, { kind: "field", name: "investmentRequired", static: false, private: false, access: { has: obj => "investmentRequired" in obj, get: obj => obj.investmentRequired, set: (obj, value) => { obj.investmentRequired = value; } }, metadata: _metadata }, _investmentRequired_initializers, _investmentRequired_extraInitializers);
            __esDecorate(null, null, _roi_decorators, { kind: "field", name: "roi", static: false, private: false, access: { has: obj => "roi" in obj, get: obj => obj.roi, set: (obj, value) => { obj.roi = value; } }, metadata: _metadata }, _roi_initializers, _roi_extraInitializers);
            __esDecorate(null, null, _timeToMarket_decorators, { kind: "field", name: "timeToMarket", static: false, private: false, access: { has: obj => "timeToMarket" in obj, get: obj => obj.timeToMarket, set: (obj, value) => { obj.timeToMarket = value; } }, metadata: _metadata }, _timeToMarket_initializers, _timeToMarket_extraInitializers);
            __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
            __esDecorate(null, null, _successProbability_decorators, { kind: "field", name: "successProbability", static: false, private: false, access: { has: obj => "successProbability" in obj, get: obj => obj.successProbability, set: (obj, value) => { obj.successProbability = value; } }, metadata: _metadata }, _successProbability_initializers, _successProbability_extraInitializers);
            __esDecorate(null, null, _strategicFit_decorators, { kind: "field", name: "strategicFit", static: false, private: false, access: { has: obj => "strategicFit" in obj, get: obj => obj.strategicFit, set: (obj, value) => { obj.strategicFit = value; } }, metadata: _metadata }, _strategicFit_initializers, _strategicFit_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GrowthInitiativeDto = GrowthInitiativeDto;
/**
 * DTO for creating Balanced Scorecard
 */
let CreateBalancedScorecardDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _scorecardName_decorators;
    let _scorecardName_initializers = [];
    let _scorecardName_extraInitializers = [];
    let _period_decorators;
    let _period_initializers = [];
    let _period_extraInitializers = [];
    let _financialPerspective_decorators;
    let _financialPerspective_initializers = [];
    let _financialPerspective_extraInitializers = [];
    let _customerPerspective_decorators;
    let _customerPerspective_initializers = [];
    let _customerPerspective_extraInitializers = [];
    let _internalProcessPerspective_decorators;
    let _internalProcessPerspective_initializers = [];
    let _internalProcessPerspective_extraInitializers = [];
    let _learningGrowthPerspective_decorators;
    let _learningGrowthPerspective_initializers = [];
    let _learningGrowthPerspective_extraInitializers = [];
    return _a = class CreateBalancedScorecardDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.scorecardName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _scorecardName_initializers, void 0));
                this.period = (__runInitializers(this, _scorecardName_extraInitializers), __runInitializers(this, _period_initializers, void 0));
                this.financialPerspective = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _financialPerspective_initializers, void 0));
                this.customerPerspective = (__runInitializers(this, _financialPerspective_extraInitializers), __runInitializers(this, _customerPerspective_initializers, void 0));
                this.internalProcessPerspective = (__runInitializers(this, _customerPerspective_extraInitializers), __runInitializers(this, _internalProcessPerspective_initializers, void 0));
                this.learningGrowthPerspective = (__runInitializers(this, _internalProcessPerspective_extraInitializers), __runInitializers(this, _learningGrowthPerspective_initializers, void 0));
                __runInitializers(this, _learningGrowthPerspective_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _scorecardName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scorecard name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _period_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period (e.g., Q1 2024)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _financialPerspective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Financial perspective metrics' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => PerspectiveMetricsDto)];
            _customerPerspective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer perspective metrics' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => PerspectiveMetricsDto)];
            _internalProcessPerspective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Internal process perspective metrics' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => PerspectiveMetricsDto)];
            _learningGrowthPerspective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Learning & growth perspective metrics' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => PerspectiveMetricsDto)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _scorecardName_decorators, { kind: "field", name: "scorecardName", static: false, private: false, access: { has: obj => "scorecardName" in obj, get: obj => obj.scorecardName, set: (obj, value) => { obj.scorecardName = value; } }, metadata: _metadata }, _scorecardName_initializers, _scorecardName_extraInitializers);
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: obj => "period" in obj, get: obj => obj.period, set: (obj, value) => { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _financialPerspective_decorators, { kind: "field", name: "financialPerspective", static: false, private: false, access: { has: obj => "financialPerspective" in obj, get: obj => obj.financialPerspective, set: (obj, value) => { obj.financialPerspective = value; } }, metadata: _metadata }, _financialPerspective_initializers, _financialPerspective_extraInitializers);
            __esDecorate(null, null, _customerPerspective_decorators, { kind: "field", name: "customerPerspective", static: false, private: false, access: { has: obj => "customerPerspective" in obj, get: obj => obj.customerPerspective, set: (obj, value) => { obj.customerPerspective = value; } }, metadata: _metadata }, _customerPerspective_initializers, _customerPerspective_extraInitializers);
            __esDecorate(null, null, _internalProcessPerspective_decorators, { kind: "field", name: "internalProcessPerspective", static: false, private: false, access: { has: obj => "internalProcessPerspective" in obj, get: obj => obj.internalProcessPerspective, set: (obj, value) => { obj.internalProcessPerspective = value; } }, metadata: _metadata }, _internalProcessPerspective_initializers, _internalProcessPerspective_extraInitializers);
            __esDecorate(null, null, _learningGrowthPerspective_decorators, { kind: "field", name: "learningGrowthPerspective", static: false, private: false, access: { has: obj => "learningGrowthPerspective" in obj, get: obj => obj.learningGrowthPerspective, set: (obj, value) => { obj.learningGrowthPerspective = value; } }, metadata: _metadata }, _learningGrowthPerspective_initializers, _learningGrowthPerspective_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBalancedScorecardDto = CreateBalancedScorecardDto;
/**
 * DTO for perspective metrics
 */
let PerspectiveMetricsDto = (() => {
    var _a;
    let _perspective_decorators;
    let _perspective_initializers = [];
    let _perspective_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _measures_decorators;
    let _measures_initializers = [];
    let _measures_extraInitializers = [];
    let _targetScore_decorators;
    let _targetScore_initializers = [];
    let _targetScore_extraInitializers = [];
    return _a = class PerspectiveMetricsDto {
            constructor() {
                this.perspective = __runInitializers(this, _perspective_initializers, void 0);
                this.objectives = (__runInitializers(this, _perspective_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.measures = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _measures_initializers, void 0));
                this.targetScore = (__runInitializers(this, _measures_extraInitializers), __runInitializers(this, _targetScore_initializers, void 0));
                __runInitializers(this, _targetScore_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _perspective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Perspective type', enum: ['financial', 'customer', 'internal', 'learning'] }), (0, class_validator_1.IsEnum)(['financial', 'customer', 'internal', 'learning'])];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic objectives', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => StrategicObjectiveDto)];
            _measures_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance measures', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => PerformanceMeasureDto)];
            _targetScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target score' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _perspective_decorators, { kind: "field", name: "perspective", static: false, private: false, access: { has: obj => "perspective" in obj, get: obj => obj.perspective, set: (obj, value) => { obj.perspective = value; } }, metadata: _metadata }, _perspective_initializers, _perspective_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _measures_decorators, { kind: "field", name: "measures", static: false, private: false, access: { has: obj => "measures" in obj, get: obj => obj.measures, set: (obj, value) => { obj.measures = value; } }, metadata: _metadata }, _measures_initializers, _measures_extraInitializers);
            __esDecorate(null, null, _targetScore_decorators, { kind: "field", name: "targetScore", static: false, private: false, access: { has: obj => "targetScore" in obj, get: obj => obj.targetScore, set: (obj, value) => { obj.targetScore = value; } }, metadata: _metadata }, _targetScore_initializers, _targetScore_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerspectiveMetricsDto = PerspectiveMetricsDto;
/**
 * DTO for strategic objective
 */
let StrategicObjectiveDto = (() => {
    var _a;
    let _objectiveName_decorators;
    let _objectiveName_initializers = [];
    let _objectiveName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    return _a = class StrategicObjectiveDto {
            constructor() {
                this.objectiveName = __runInitializers(this, _objectiveName_initializers, void 0);
                this.description = (__runInitializers(this, _objectiveName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.weight = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.owner = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                __runInitializers(this, _owner_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _objectiveName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objective name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weight percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _owner_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _objectiveName_decorators, { kind: "field", name: "objectiveName", static: false, private: false, access: { has: obj => "objectiveName" in obj, get: obj => obj.objectiveName, set: (obj, value) => { obj.objectiveName = value; } }, metadata: _metadata }, _objectiveName_initializers, _objectiveName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.StrategicObjectiveDto = StrategicObjectiveDto;
/**
 * DTO for performance measure
 */
let PerformanceMeasureDto = (() => {
    var _a;
    let _measureName_decorators;
    let _measureName_initializers = [];
    let _measureName_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _baseline_decorators;
    let _baseline_initializers = [];
    let _baseline_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    return _a = class PerformanceMeasureDto {
            constructor() {
                this.measureName = __runInitializers(this, _measureName_initializers, void 0);
                this.metricType = (__runInitializers(this, _measureName_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.unit = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.targetValue = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.baseline = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _baseline_initializers, void 0));
                this.frequency = (__runInitializers(this, _baseline_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                __runInitializers(this, _frequency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _measureName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measure name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: ['leading', 'lagging'] }), (0, class_validator_1.IsEnum)(['leading', 'lagging'])];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, class_validator_1.IsNumber)()];
            _baseline_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline value' }), (0, class_validator_1.IsNumber)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement frequency', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] }), (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'quarterly', 'annual'])];
            __esDecorate(null, null, _measureName_decorators, { kind: "field", name: "measureName", static: false, private: false, access: { has: obj => "measureName" in obj, get: obj => obj.measureName, set: (obj, value) => { obj.measureName = value; } }, metadata: _metadata }, _measureName_initializers, _measureName_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _baseline_decorators, { kind: "field", name: "baseline", static: false, private: false, access: { has: obj => "baseline" in obj, get: obj => obj.baseline, set: (obj, value) => { obj.baseline = value; } }, metadata: _metadata }, _baseline_initializers, _baseline_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformanceMeasureDto = PerformanceMeasureDto;
/**
 * DTO for creating scenario planning analysis
 */
let CreateScenarioPlanningDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _analysisName_decorators;
    let _analysisName_initializers = [];
    let _analysisName_extraInitializers = [];
    let _timeHorizon_decorators;
    let _timeHorizon_initializers = [];
    let _timeHorizon_extraInitializers = [];
    let _scenarios_decorators;
    let _scenarios_initializers = [];
    let _scenarios_extraInitializers = [];
    let _criticalUncertainties_decorators;
    let _criticalUncertainties_initializers = [];
    let _criticalUncertainties_extraInitializers = [];
    return _a = class CreateScenarioPlanningDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.analysisName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _analysisName_initializers, void 0));
                this.timeHorizon = (__runInitializers(this, _analysisName_extraInitializers), __runInitializers(this, _timeHorizon_initializers, void 0));
                this.scenarios = (__runInitializers(this, _timeHorizon_extraInitializers), __runInitializers(this, _scenarios_initializers, void 0));
                this.criticalUncertainties = (__runInitializers(this, _scenarios_extraInitializers), __runInitializers(this, _criticalUncertainties_initializers, void 0));
                __runInitializers(this, _criticalUncertainties_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _analysisName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _timeHorizon_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time horizon' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _scenarios_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scenarios', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => ScenarioDto)];
            _criticalUncertainties_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical uncertainties', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => CriticalUncertaintyDto)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _analysisName_decorators, { kind: "field", name: "analysisName", static: false, private: false, access: { has: obj => "analysisName" in obj, get: obj => obj.analysisName, set: (obj, value) => { obj.analysisName = value; } }, metadata: _metadata }, _analysisName_initializers, _analysisName_extraInitializers);
            __esDecorate(null, null, _timeHorizon_decorators, { kind: "field", name: "timeHorizon", static: false, private: false, access: { has: obj => "timeHorizon" in obj, get: obj => obj.timeHorizon, set: (obj, value) => { obj.timeHorizon = value; } }, metadata: _metadata }, _timeHorizon_initializers, _timeHorizon_extraInitializers);
            __esDecorate(null, null, _scenarios_decorators, { kind: "field", name: "scenarios", static: false, private: false, access: { has: obj => "scenarios" in obj, get: obj => obj.scenarios, set: (obj, value) => { obj.scenarios = value; } }, metadata: _metadata }, _scenarios_initializers, _scenarios_extraInitializers);
            __esDecorate(null, null, _criticalUncertainties_decorators, { kind: "field", name: "criticalUncertainties", static: false, private: false, access: { has: obj => "criticalUncertainties" in obj, get: obj => obj.criticalUncertainties, set: (obj, value) => { obj.criticalUncertainties = value; } }, metadata: _metadata }, _criticalUncertainties_initializers, _criticalUncertainties_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateScenarioPlanningDto = CreateScenarioPlanningDto;
/**
 * DTO for scenario
 */
let ScenarioDto = (() => {
    var _a;
    let _scenarioName_decorators;
    let _scenarioName_initializers = [];
    let _scenarioName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _probability_decorators;
    let _probability_initializers = [];
    let _probability_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _strategicImplications_decorators;
    let _strategicImplications_initializers = [];
    let _strategicImplications_extraInitializers = [];
    return _a = class ScenarioDto {
            constructor() {
                this.scenarioName = __runInitializers(this, _scenarioName_initializers, void 0);
                this.description = (__runInitializers(this, _scenarioName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.probability = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _probability_initializers, void 0));
                this.impact = (__runInitializers(this, _probability_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.assumptions = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                this.strategicImplications = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _strategicImplications_initializers, void 0));
                __runInitializers(this, _strategicImplications_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _scenarioName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scenario name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _probability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Probability 0-1' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assumptions', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => AssumptionDto)];
            _strategicImplications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic implications', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _scenarioName_decorators, { kind: "field", name: "scenarioName", static: false, private: false, access: { has: obj => "scenarioName" in obj, get: obj => obj.scenarioName, set: (obj, value) => { obj.scenarioName = value; } }, metadata: _metadata }, _scenarioName_initializers, _scenarioName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _probability_decorators, { kind: "field", name: "probability", static: false, private: false, access: { has: obj => "probability" in obj, get: obj => obj.probability, set: (obj, value) => { obj.probability = value; } }, metadata: _metadata }, _probability_initializers, _probability_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            __esDecorate(null, null, _strategicImplications_decorators, { kind: "field", name: "strategicImplications", static: false, private: false, access: { has: obj => "strategicImplications" in obj, get: obj => obj.strategicImplications, set: (obj, value) => { obj.strategicImplications = value; } }, metadata: _metadata }, _strategicImplications_initializers, _strategicImplications_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ScenarioDto = ScenarioDto;
/**
 * DTO for assumption
 */
let AssumptionDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _assumption_decorators;
    let _assumption_initializers = [];
    let _assumption_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _evidenceSupport_decorators;
    let _evidenceSupport_initializers = [];
    let _evidenceSupport_extraInitializers = [];
    return _a = class AssumptionDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.assumption = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _assumption_initializers, void 0));
                this.confidence = (__runInitializers(this, _assumption_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
                this.evidenceSupport = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _evidenceSupport_initializers, void 0));
                __runInitializers(this, _evidenceSupport_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _assumption_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assumption text' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _confidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence level 0-1' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _evidenceSupport_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supporting evidence', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _assumption_decorators, { kind: "field", name: "assumption", static: false, private: false, access: { has: obj => "assumption" in obj, get: obj => obj.assumption, set: (obj, value) => { obj.assumption = value; } }, metadata: _metadata }, _assumption_initializers, _assumption_extraInitializers);
            __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
            __esDecorate(null, null, _evidenceSupport_decorators, { kind: "field", name: "evidenceSupport", static: false, private: false, access: { has: obj => "evidenceSupport" in obj, get: obj => obj.evidenceSupport, set: (obj, value) => { obj.evidenceSupport = value; } }, metadata: _metadata }, _evidenceSupport_initializers, _evidenceSupport_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssumptionDto = AssumptionDto;
/**
 * DTO for critical uncertainty
 */
let CriticalUncertaintyDto = (() => {
    var _a;
    let _uncertaintyName_decorators;
    let _uncertaintyName_initializers = [];
    let _uncertaintyName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _predictability_decorators;
    let _predictability_initializers = [];
    let _predictability_extraInitializers = [];
    let _monitoringMethod_decorators;
    let _monitoringMethod_initializers = [];
    let _monitoringMethod_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    return _a = class CriticalUncertaintyDto {
            constructor() {
                this.uncertaintyName = __runInitializers(this, _uncertaintyName_initializers, void 0);
                this.description = (__runInitializers(this, _uncertaintyName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.impact = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.predictability = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _predictability_initializers, void 0));
                this.monitoringMethod = (__runInitializers(this, _predictability_extraInitializers), __runInitializers(this, _monitoringMethod_initializers, void 0));
                this.owner = (__runInitializers(this, _monitoringMethod_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                __runInitializers(this, _owner_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _uncertaintyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Uncertainty name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _predictability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Predictability score 1-10' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _monitoringMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Monitoring method' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _owner_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _uncertaintyName_decorators, { kind: "field", name: "uncertaintyName", static: false, private: false, access: { has: obj => "uncertaintyName" in obj, get: obj => obj.uncertaintyName, set: (obj, value) => { obj.uncertaintyName = value; } }, metadata: _metadata }, _uncertaintyName_initializers, _uncertaintyName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _predictability_decorators, { kind: "field", name: "predictability", static: false, private: false, access: { has: obj => "predictability" in obj, get: obj => obj.predictability, set: (obj, value) => { obj.predictability = value; } }, metadata: _metadata }, _predictability_initializers, _predictability_extraInitializers);
            __esDecorate(null, null, _monitoringMethod_decorators, { kind: "field", name: "monitoringMethod", static: false, private: false, access: { has: obj => "monitoringMethod" in obj, get: obj => obj.monitoringMethod, set: (obj, value) => { obj.monitoringMethod = value; } }, metadata: _metadata }, _monitoringMethod_initializers, _monitoringMethod_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CriticalUncertaintyDto = CriticalUncertaintyDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * SWOT Analysis Model
 * Stores comprehensive SWOT analysis data
 */
class SWOTAnalysisModel extends sequelize_1.Model {
    static initModel(sequelize) {
        SWOTAnalysisModel.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'organization_id',
            },
            analysisName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
                field: 'analysis_name',
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
                field: 'analysis_date',
            },
            timeHorizon: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
                field: 'time_horizon',
            },
            strengths: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
            },
            weaknesses: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
            },
            opportunities: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
            },
            threats: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
            },
            strategicRecommendations: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'strategic_recommendations',
            },
            crossFactorAnalysis: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'cross_factor_analysis',
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(InitiativeStatus)),
                allowNull: false,
                defaultValue: InitiativeStatus.PROPOSED,
            },
            createdBy: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'created_by',
            },
            approvedBy: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                field: 'approved_by',
            },
            approvedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                field: 'approved_at',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
            },
        }, {
            sequelize,
            tableName: 'swot_analyses',
            underscored: true,
            timestamps: true,
        });
        return SWOTAnalysisModel;
    }
}
exports.SWOTAnalysisModel = SWOTAnalysisModel;
/**
 * Porter Five Forces Model
 * Stores Porter's Five Forces analysis
 */
class PorterFiveForcesModel extends sequelize_1.Model {
    static initModel(sequelize) {
        PorterFiveForcesModel.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'organization_id',
            },
            industry: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
                field: 'analysis_date',
            },
            competitiveRivalry: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'competitive_rivalry',
            },
            threatOfNewEntrants: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'threat_of_new_entrants',
            },
            bargainingPowerSuppliers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'bargaining_power_suppliers',
            },
            bargainingPowerBuyers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'bargaining_power_buyers',
            },
            threatOfSubstitutes: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'threat_of_substitutes',
            },
            overallAttractiveness: {
                type: sequelize_1.DataTypes.DECIMAL(3, 1),
                allowNull: false,
                field: 'overall_attractiveness',
            },
            strategicImplications: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'strategic_implications',
            },
            actionItems: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'action_items',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
            },
        }, {
            sequelize,
            tableName: 'porter_five_forces_analyses',
            underscored: true,
            timestamps: true,
        });
        return PorterFiveForcesModel;
    }
}
exports.PorterFiveForcesModel = PorterFiveForcesModel;
/**
 * BCG Matrix Model
 * Stores BCG Matrix portfolio analysis
 */
class BCGMatrixModel extends sequelize_1.Model {
    static initModel(sequelize) {
        BCGMatrixModel.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'organization_id',
            },
            portfolioName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
                field: 'portfolio_name',
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
                field: 'analysis_date',
            },
            businessUnits: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'business_units',
            },
            portfolioRecommendations: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'portfolio_recommendations',
            },
            resourceAllocation: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'resource_allocation',
            },
            strategicGaps: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'strategic_gaps',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
            },
        }, {
            sequelize,
            tableName: 'bcg_matrix_analyses',
            underscored: true,
            timestamps: true,
        });
        return BCGMatrixModel;
    }
}
exports.BCGMatrixModel = BCGMatrixModel;
/**
 * Balanced Scorecard Model
 * Stores balanced scorecard data
 */
class BalancedScorecardModel extends sequelize_1.Model {
    static initModel(sequelize) {
        BalancedScorecardModel.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                field: 'organization_id',
            },
            scorecardName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
                field: 'scorecard_name',
            },
            period: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
            },
            financialPerspective: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'financial_perspective',
            },
            customerPerspective: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'customer_perspective',
            },
            internalProcessPerspective: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'internal_process_perspective',
            },
            learningGrowthPerspective: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                field: 'learning_growth_perspective',
            },
            strategicObjectives: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'strategic_objectives',
            },
            strategyMap: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'strategy_map',
            },
            overallScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                field: 'overall_score',
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(InitiativeStatus)),
                allowNull: false,
                defaultValue: InitiativeStatus.IN_PROGRESS,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'created_at',
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                field: 'updated_at',
            },
        }, {
            sequelize,
            tableName: 'balanced_scorecards',
            underscored: true,
            timestamps: true,
        });
        return BalancedScorecardModel;
    }
}
exports.BalancedScorecardModel = BalancedScorecardModel;
// ============================================================================
// FUNCTION 1: CREATE SWOT ANALYSIS
// ============================================================================
/**
 * Function 1: Create comprehensive SWOT analysis
 *
 * Generates a complete SWOT analysis with strengths, weaknesses, opportunities,
 * threats, cross-factor analysis, and strategic recommendations.
 *
 * @param context - Strategy context
 * @param data - SWOT analysis data
 * @param transaction - Database transaction
 * @returns Created SWOT analysis
 *
 * @example
 * ```typescript
 * const swot = await createSWOTAnalysis(
 *   context,
 *   {
 *     organizationId: 'org-123',
 *     analysisName: 'Q4 2024 Strategic SWOT',
 *     strengths: [{ category: 'strength', description: 'Market leader', impact: 9, urgency: 8 }],
 *     // ... other data
 *   },
 *   transaction
 * );
 * ```
 */
async function createSWOTAnalysis(context, data, transaction) {
    try {
        const swotId = data.id || generateUUID();
        const timestamp = new Date().toISOString();
        // Generate cross-factor analysis
        const crossFactorAnalysis = generateCrossFactorAnalysis(data.strengths || [], data.weaknesses || [], data.opportunities || [], data.threats || []);
        // Generate strategic recommendations
        const recommendations = generateSWOTRecommendations(data.strengths || [], data.weaknesses || [], data.opportunities || [], data.threats || [], crossFactorAnalysis);
        const swotAnalysis = {
            id: swotId,
            organizationId: data.organizationId || context.organizationId,
            analysisName: data.analysisName || 'SWOT Analysis',
            analysisDate: data.analysisDate || timestamp.split('T')[0],
            timeHorizon: data.timeHorizon || '12 months',
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            opportunities: data.opportunities || [],
            threats: data.threats || [],
            strategicRecommendations: recommendations,
            crossFactorAnalysis,
            status: data.status || InitiativeStatus.PROPOSED,
            createdBy: context.userId,
            approvedBy: data.approvedBy,
            approvedAt: data.approvedAt,
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.SWOT,
            },
        };
        // Store in database
        await SWOTAnalysisModel.create({
            ...swotAnalysis,
            strengths: JSON.stringify(swotAnalysis.strengths),
            weaknesses: JSON.stringify(swotAnalysis.weaknesses),
            opportunities: JSON.stringify(swotAnalysis.opportunities),
            threats: JSON.stringify(swotAnalysis.threats),
            strategicRecommendations: JSON.stringify(swotAnalysis.strategicRecommendations),
            crossFactorAnalysis: JSON.stringify(swotAnalysis.crossFactorAnalysis),
            metadata: JSON.stringify(swotAnalysis.metadata),
        }, { transaction });
        return swotAnalysis;
    }
    catch (error) {
        throw new Error(`Failed to create SWOT analysis: ${error.message}`);
    }
}
// ============================================================================
// FUNCTION 2: GENERATE CROSS-FACTOR SWOT ANALYSIS
// ============================================================================
/**
 * Function 2: Generate cross-factor SWOT analysis (SO, WO, ST, WT strategies)
 *
 * Analyzes combinations of SWOT factors to identify strategic options:
 * - SO: Use strengths to capitalize on opportunities
 * - WO: Overcome weaknesses to pursue opportunities
 * - ST: Use strengths to mitigate threats
 * - WT: Minimize weaknesses and avoid threats
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @returns Cross-factor strategic options
 *
 * @example
 * ```typescript
 * const crossFactors = generateCrossFactorAnalysis(strengths, weaknesses, opportunities, threats);
 * // Returns SO, WO, ST, WT strategic recommendations
 * ```
 */
function generateCrossFactorAnalysis(strengths, weaknesses, opportunities, threats) {
    const crossFactors = [];
    // SO Strategies: Strength-Opportunity
    const topStrengths = strengths.sort((a, b) => b.impact - a.impact).slice(0, 3);
    const topOpportunities = opportunities.sort((a, b) => b.impact - a.impact).slice(0, 3);
    topStrengths.forEach((strength, i) => {
        const opp = topOpportunities[i];
        if (opp) {
            crossFactors.push({
                type: 'SO',
                strategy: `Leverage ${strength.description} to capitalize on ${opp.description}`,
                relatedStrengths: [strength.id],
                relatedOpportunities: [opp.id],
                priority: strength.impact + opp.impact > 15 ? StrategyPriority.HIGH : StrategyPriority.MEDIUM,
                estimatedImpact: (strength.impact + opp.impact) / 2,
                implementationComplexity: 5,
            });
        }
    });
    // WO Strategies: Weakness-Opportunity
    const criticalWeaknesses = weaknesses.sort((a, b) => b.urgency - a.urgency).slice(0, 2);
    criticalWeaknesses.forEach((weakness, i) => {
        const opp = topOpportunities[i];
        if (opp) {
            crossFactors.push({
                type: 'WO',
                strategy: `Address ${weakness.description} to enable pursuit of ${opp.description}`,
                relatedWeaknesses: [weakness.id],
                relatedOpportunities: [opp.id],
                priority: StrategyPriority.MEDIUM,
                estimatedImpact: opp.impact - weakness.impact,
                implementationComplexity: 7,
            });
        }
    });
    // ST Strategies: Strength-Threat
    const topThreats = threats.sort((a, b) => b.urgency - a.urgency).slice(0, 3);
    topStrengths.forEach((strength, i) => {
        const threat = topThreats[i];
        if (threat) {
            crossFactors.push({
                type: 'ST',
                strategy: `Use ${strength.description} to mitigate ${threat.description}`,
                relatedStrengths: [strength.id],
                relatedThreats: [threat.id],
                priority: threat.urgency > 7 ? StrategyPriority.HIGH : StrategyPriority.MEDIUM,
                estimatedImpact: strength.impact - threat.impact,
                implementationComplexity: 6,
            });
        }
    });
    // WT Strategies: Weakness-Threat
    criticalWeaknesses.forEach((weakness, i) => {
        const threat = topThreats[i];
        if (threat) {
            crossFactors.push({
                type: 'WT',
                strategy: `Minimize ${weakness.description} to reduce exposure to ${threat.description}`,
                relatedWeaknesses: [weakness.id],
                relatedThreats: [threat.id],
                priority: StrategyPriority.CRITICAL,
                estimatedImpact: 10 - ((weakness.impact + threat.impact) / 2),
                implementationComplexity: 8,
            });
        }
    });
    return crossFactors.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, deferred: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
// ============================================================================
// FUNCTION 3: GENERATE SWOT STRATEGIC RECOMMENDATIONS
// ============================================================================
/**
 * Function 3: Generate strategic recommendations from SWOT analysis
 *
 * Creates prioritized strategic recommendations based on SWOT factors
 * and cross-factor analysis.
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @param crossFactors - Cross-factor analysis results
 * @returns Prioritized strategic recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateSWOTRecommendations(
 *   strengths, weaknesses, opportunities, threats, crossFactors
 * );
 * ```
 */
function generateSWOTRecommendations(strengths, weaknesses, opportunities, threats, crossFactors) {
    const recommendations = [];
    // Generate recommendations from cross-factor strategies
    crossFactors.forEach((cf, index) => {
        recommendations.push({
            id: `rec-${index + 1}`,
            recommendation: cf.strategy,
            rationale: `Based on ${cf.type} strategic analysis`,
            expectedBenefit: `Impact score: ${cf.estimatedImpact.toFixed(1)}/10`,
            implementationCost: cf.implementationComplexity * 100000,
            timeframe: cf.implementationComplexity < 6 ? '3-6 months' : '6-12 months',
            priority: cf.priority,
            risks: [`Implementation complexity: ${cf.implementationComplexity}/10`],
            dependencies: [],
        });
    });
    // Add urgent threat mitigation recommendations
    const urgentThreats = threats.filter(t => t.urgency >= 8);
    urgentThreats.forEach((threat, index) => {
        recommendations.push({
            id: `threat-rec-${index + 1}`,
            recommendation: `Immediate action required: ${threat.actionItems.join(', ')}`,
            rationale: `Critical threat identified: ${threat.description}`,
            expectedBenefit: 'Prevent significant business impact',
            implementationCost: threat.impact * 50000,
            timeframe: '1-3 months',
            priority: StrategyPriority.CRITICAL,
            risks: ['Delayed action may result in competitive disadvantage'],
            dependencies: [],
        });
    });
    return recommendations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, deferred: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
// ============================================================================
// FUNCTION 4: CREATE PORTER'S FIVE FORCES ANALYSIS
// ============================================================================
/**
 * Function 4: Create Porter's Five Forces industry analysis
 *
 * Analyzes industry competitive forces: rivalry, new entrants, suppliers,
 * buyers, and substitutes to determine industry attractiveness.
 *
 * @param context - Strategy context
 * @param data - Five forces analysis data
 * @param transaction - Database transaction
 * @returns Created Porter's Five Forces analysis
 *
 * @example
 * ```typescript
 * const analysis = await createPorterFiveForcesAnalysis(context, {
 *   industry: 'Software as a Service',
 *   competitiveRivalry: { intensity: 'high', intensityScore: 8, ... },
 *   // ... other forces
 * });
 * ```
 */
async function createPorterFiveForcesAnalysis(context, data, transaction) {
    try {
        const analysisId = generateUUID();
        const timestamp = new Date().toISOString();
        // Calculate overall industry attractiveness
        const attractiveness = calculateIndustryAttractiveness([
            data.competitiveRivalry,
            data.threatOfNewEntrants,
            data.bargainingPowerSuppliers,
            data.bargainingPowerBuyers,
            data.threatOfSubstitutes,
        ]);
        // Generate strategic implications
        const implications = generatePorterImplications(data.competitiveRivalry, data.threatOfNewEntrants, data.bargainingPowerSuppliers, data.bargainingPowerBuyers, data.threatOfSubstitutes);
        const analysis = {
            id: analysisId,
            organizationId: data.organizationId || context.organizationId,
            industry: data.industry || 'Unknown Industry',
            analysisDate: data.analysisDate || timestamp.split('T')[0],
            competitiveRivalry: data.competitiveRivalry,
            threatOfNewEntrants: data.threatOfNewEntrants,
            bargainingPowerSuppliers: data.bargainingPowerSuppliers,
            bargainingPowerBuyers: data.bargainingPowerBuyers,
            threatOfSubstitutes: data.threatOfSubstitutes,
            overallAttractiveness: attractiveness,
            strategicImplications: implications,
            actionItems: data.actionItems || [],
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.PORTER_FIVE_FORCES,
            },
        };
        await PorterFiveForcesModel.create({
            ...analysis,
            competitiveRivalry: JSON.stringify(analysis.competitiveRivalry),
            threatOfNewEntrants: JSON.stringify(analysis.threatOfNewEntrants),
            bargainingPowerSuppliers: JSON.stringify(analysis.bargainingPowerSuppliers),
            bargainingPowerBuyers: JSON.stringify(analysis.bargainingPowerBuyers),
            threatOfSubstitutes: JSON.stringify(analysis.threatOfSubstitutes),
            strategicImplications: JSON.stringify(analysis.strategicImplications),
            actionItems: JSON.stringify(analysis.actionItems),
            metadata: JSON.stringify(analysis.metadata),
        }, { transaction });
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to create Porter's Five Forces analysis: ${error.message}`);
    }
}
// ============================================================================
// FUNCTION 5: CALCULATE INDUSTRY ATTRACTIVENESS
// ============================================================================
/**
 * Function 5: Calculate overall industry attractiveness score
 *
 * Aggregates the five forces intensity scores to determine overall
 * industry attractiveness (higher score = more attractive industry).
 *
 * @param forces - Array of force analyses
 * @returns Overall attractiveness score (1-10)
 *
 * @example
 * ```typescript
 * const score = calculateIndustryAttractiveness([
 *   rivalryAnalysis, newEntrantsAnalysis, suppliersAnalysis, buyersAnalysis, substitutesAnalysis
 * ]);
 * // Returns 6.5 (moderately attractive)
 * ```
 */
function calculateIndustryAttractiveness(forces) {
    // Lower intensity = higher attractiveness
    const totalIntensity = forces.reduce((sum, force) => sum + force.intensityScore, 0);
    const avgIntensity = totalIntensity / forces.length;
    // Invert the scale (10 - avg gives attractiveness)
    const attractiveness = 10 - avgIntensity;
    return Math.max(1, Math.min(10, attractiveness));
}
// ============================================================================
// FUNCTION 6-45: Additional Strategic Planning Functions
// ============================================================================
// Helper function for UUID generation
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
// Helper function to generate Porter implications
function generatePorterImplications(rivalry, newEntrants, suppliers, buyers, substitutes) {
    const implications = [];
    if (rivalry.intensityScore >= 7) {
        implications.push('High competitive rivalry requires differentiation strategy');
    }
    if (newEntrants.intensityScore >= 7) {
        implications.push('Low barriers to entry necessitate building competitive moats');
    }
    if (suppliers.intensityScore >= 7) {
        implications.push('Strong supplier power suggests vertical integration or diversification');
    }
    if (buyers.intensityScore >= 7) {
        implications.push('High buyer power requires customer lock-in mechanisms');
    }
    if (substitutes.intensityScore >= 7) {
        implications.push('Threat of substitutes demands continuous innovation');
    }
    return implications;
}
/**
 * Function 6: Create BCG Matrix portfolio analysis
 * Positions business units in BCG Matrix (Stars, Cash Cows, Question Marks, Dogs)
 */
async function createBCGMatrixAnalysis(context, data, transaction) {
    try {
        const analysisId = generateUUID();
        const timestamp = new Date().toISOString();
        // Position each business unit in BCG matrix
        const positionedUnits = data.businessUnits.map(unit => ({
            ...unit,
            position: determineBCGPosition(unit.marketGrowthRate, unit.relativeMarketShare),
            recommendedStrategy: getBCGStrategy(unit),
            investmentPriority: getInvestmentPriority(unit),
        }));
        // Generate portfolio recommendations
        const recommendations = generatePortfolioRecommendations(positionedUnits);
        // Calculate resource allocation
        const resourceAllocation = calculateResourceAllocation(positionedUnits);
        const analysis = {
            id: analysisId,
            organizationId: data.organizationId || context.organizationId,
            portfolioName: data.portfolioName || 'Portfolio Analysis',
            analysisDate: data.analysisDate || timestamp.split('T')[0],
            businessUnits: positionedUnits,
            portfolioRecommendations: recommendations,
            resourceAllocation,
            strategicGaps: identifyStrategicGaps(positionedUnits),
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.BCG_MATRIX,
            },
        };
        await BCGMatrixModel.create({
            ...analysis,
            businessUnits: JSON.stringify(analysis.businessUnits),
            portfolioRecommendations: JSON.stringify(analysis.portfolioRecommendations),
            resourceAllocation: JSON.stringify(analysis.resourceAllocation),
            strategicGaps: JSON.stringify(analysis.strategicGaps),
            metadata: JSON.stringify(analysis.metadata),
        }, { transaction });
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to create BCG Matrix analysis: ${error.message}`);
    }
}
/**
 * Function 7: Determine BCG Matrix position
 * Classifies business unit into Stars, Cash Cows, Question Marks, or Dogs
 */
function determineBCGPosition(marketGrowthRate, relativeMarketShare) {
    const highGrowth = marketGrowthRate >= 10; // 10% threshold
    const highShare = relativeMarketShare >= 1.0; // 1.0 = market leader
    if (highGrowth && highShare)
        return StrategicPosition.STAR;
    if (!highGrowth && highShare)
        return StrategicPosition.CASH_COW;
    if (highGrowth && !highShare)
        return StrategicPosition.QUESTION_MARK;
    return StrategicPosition.DOG;
}
/**
 * Function 8: Get BCG strategy recommendation
 * Returns appropriate strategy based on BCG position
 */
function getBCGStrategy(unit) {
    switch (unit.position) {
        case StrategicPosition.STAR:
            return 'Invest aggressively to maintain market leadership and capture growth';
        case StrategicPosition.CASH_COW:
            return 'Harvest cash flow while maintaining position with minimal investment';
        case StrategicPosition.QUESTION_MARK:
            return 'Evaluate growth potential; invest selectively or divest';
        case StrategicPosition.DOG:
            return 'Divest or turnaround if strategic value exists';
        default:
            return 'Conduct detailed strategic review';
    }
}
/**
 * Function 9: Calculate investment priority
 * Determines investment priority based on BCG position and strategic importance
 */
function getInvestmentPriority(unit) {
    if (unit.position === StrategicPosition.STAR)
        return StrategyPriority.CRITICAL;
    if (unit.position === StrategicPosition.QUESTION_MARK && unit.strategicImportance >= 7) {
        return StrategyPriority.HIGH;
    }
    if (unit.position === StrategicPosition.CASH_COW)
        return StrategyPriority.MEDIUM;
    return StrategyPriority.LOW;
}
/**
 * Function 10: Generate portfolio recommendations
 * Creates strategic recommendations for portfolio management
 */
function generatePortfolioRecommendations(units) {
    const recommendations = [];
    const stars = units.filter(u => u.position === StrategicPosition.STAR);
    const cows = units.filter(u => u.position === StrategicPosition.CASH_COW);
    const questions = units.filter(u => u.position === StrategicPosition.QUESTION_MARK);
    const dogs = units.filter(u => u.position === StrategicPosition.DOG);
    if (stars.length > 0) {
        recommendations.push({
            type: 'invest',
            businessUnits: stars.map(s => s.id),
            rationale: 'Stars are high-growth market leaders requiring investment to maintain position',
            expectedOutcome: 'Sustained market leadership and future cash generation',
            risks: ['Market growth may slow', 'Competition may intensify'],
            requiredInvestment: stars.reduce((sum, s) => sum + s.revenue * 0.2, 0),
            expectedReturn: stars.reduce((sum, s) => sum + s.revenue * 0.3, 0),
            timeframe: '2-3 years',
        });
    }
    if (cows.length > 0) {
        recommendations.push({
            type: 'harvest',
            businessUnits: cows.map(c => c.id),
            rationale: 'Cash Cows generate strong cash flow in mature markets',
            expectedOutcome: 'Maximize cash extraction for portfolio investment',
            risks: ['Market may decline faster than expected'],
            requiredInvestment: cows.reduce((sum, c) => sum + c.revenue * 0.05, 0),
            expectedReturn: cows.reduce((sum, c) => sum + c.revenue * c.profitMargin, 0),
            timeframe: 'Ongoing',
        });
    }
    return recommendations;
}
/**
 * Function 11: Calculate resource allocation
 * Determines optimal resource distribution across portfolio
 */
function calculateResourceAllocation(units) {
    const totalRevenue = units.reduce((sum, u) => sum + u.revenue, 0);
    const allocations = [];
    units.forEach(unit => {
        const currentAllocation = (unit.revenue / totalRevenue) * 100;
        let recommendedAllocation = currentAllocation;
        // Adjust based on position
        if (unit.position === StrategicPosition.STAR) {
            recommendedAllocation *= 1.2; // 20% more
        }
        else if (unit.position === StrategicPosition.DOG) {
            recommendedAllocation *= 0.5; // 50% less
        }
        allocations.push({
            businessUnitId: unit.id,
            allocationType: 'capital',
            currentAllocation,
            recommendedAllocation,
            variance: recommendedAllocation - currentAllocation,
            justification: `Based on ${unit.position} position and ${unit.strategicImportance}/10 strategic importance`,
        });
    });
    return allocations;
}
/**
 * Function 12: Identify strategic gaps in portfolio
 * Detects portfolio imbalances and risks
 */
function identifyStrategicGaps(units) {
    const gaps = [];
    const stars = units.filter(u => u.position === StrategicPosition.STAR);
    const cows = units.filter(u => u.position === StrategicPosition.CASH_COW);
    const questions = units.filter(u => u.position === StrategicPosition.QUESTION_MARK);
    const dogs = units.filter(u => u.position === StrategicPosition.DOG);
    if (stars.length === 0) {
        gaps.push('No Stars: Portfolio lacks high-growth market leaders');
    }
    if (cows.length === 0) {
        gaps.push('No Cash Cows: Portfolio may face cash flow challenges');
    }
    if (dogs.length / units.length > 0.3) {
        gaps.push('Too many Dogs: Portfolio needs pruning and reallocation');
    }
    if (questions.length / units.length > 0.4) {
        gaps.push('Too many Question Marks: Portfolio has excessive risk and uncertainty');
    }
    return gaps;
}
/**
 * Function 13: Create Ansoff Matrix growth analysis
 * Analyzes growth strategies across market/product dimensions
 */
async function createAnsoffMatrixAnalysis(context, data, transaction) {
    try {
        const analysisId = generateUUID();
        const timestamp = new Date().toISOString();
        // Assess risk for each quadrant
        const riskAssessment = assessAnsoffRisk(data.marketPenetration || [], data.marketDevelopment || [], data.productDevelopment || [], data.diversification || []);
        const analysis = {
            id: analysisId,
            organizationId: data.organizationId || context.organizationId,
            analysisName: data.analysisName || 'Growth Strategy Analysis',
            analysisDate: data.analysisDate || timestamp.split('T')[0],
            marketPenetration: data.marketPenetration || [],
            marketDevelopment: data.marketDevelopment || [],
            productDevelopment: data.productDevelopment || [],
            diversification: data.diversification || [],
            recommendedStrategy: data.recommendedStrategy || GrowthStrategy.MARKET_PENETRATION,
            riskAssessment,
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.ANSOFF_MATRIX,
            },
        };
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to create Ansoff Matrix analysis: ${error.message}`);
    }
}
/**
 * Function 14: Assess Ansoff Matrix risk levels
 * Evaluates risk across all growth strategies
 */
function assessAnsoffRisk(marketPen, marketDev, productDev, diversification) {
    const allInitiatives = [...marketPen, ...marketDev, ...productDev, ...diversification];
    const marketRisks = [
        {
            id: 'mr-1',
            riskDescription: 'Market acceptance uncertainty',
            probability: 0.6,
            impact: 7,
            riskScore: 4.2,
            category: 'market',
        },
    ];
    const operationalRisks = [
        {
            id: 'or-1',
            riskDescription: 'Execution capability gaps',
            probability: 0.5,
            impact: 6,
            riskScore: 3.0,
            category: 'operational',
        },
    ];
    const avgRisk = allInitiatives.reduce((sum, i) => {
        const riskValue = { critical: 5, high: 4, moderate: 3, low: 2, negligible: 1 };
        return sum + riskValue[i.riskLevel];
    }, 0) / allInitiatives.length;
    return {
        overallRisk: avgRisk > 3.5 ? StrategicRiskLevel.HIGH : StrategicRiskLevel.MODERATE,
        riskScore: avgRisk * 20,
        marketRisks,
        operationalRisks,
        financialRisks: [],
        competitiveRisks: [],
        mitigationPlan: [],
    };
}
/**
 * Function 15: Create Balanced Scorecard
 * Implements balanced scorecard strategic performance management
 */
async function createBalancedScorecard(context, data, transaction) {
    try {
        const scorecardId = generateUUID();
        const timestamp = new Date().toISOString();
        // Calculate overall score from all perspectives
        const perspectives = [
            data.financialPerspective,
            data.customerPerspective,
            data.internalProcessPerspective,
            data.learningGrowthPerspective,
        ].filter(Boolean);
        const overallScore = perspectives.reduce((sum, p) => sum + (p?.currentScore || 0), 0) / perspectives.length;
        // Build strategy map
        const strategyMap = buildStrategyMap(data.strategicObjectives || []);
        const scorecard = {
            id: scorecardId,
            organizationId: data.organizationId || context.organizationId,
            scorecardName: data.scorecardName || 'Balanced Scorecard',
            period: data.period || new Date().toISOString().slice(0, 7),
            financialPerspective: data.financialPerspective,
            customerPerspective: data.customerPerspective,
            internalProcessPerspective: data.internalProcessPerspective,
            learningGrowthPerspective: data.learningGrowthPerspective,
            strategicObjectives: data.strategicObjectives || [],
            strategyMap,
            overallScore,
            status: data.status || InitiativeStatus.IN_PROGRESS,
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.BALANCED_SCORECARD,
            },
        };
        await BalancedScorecardModel.create({
            ...scorecard,
            financialPerspective: JSON.stringify(scorecard.financialPerspective),
            customerPerspective: JSON.stringify(scorecard.customerPerspective),
            internalProcessPerspective: JSON.stringify(scorecard.internalProcessPerspective),
            learningGrowthPerspective: JSON.stringify(scorecard.learningGrowthPerspective),
            strategicObjectives: JSON.stringify(scorecard.strategicObjectives),
            strategyMap: JSON.stringify(scorecard.strategyMap),
            metadata: JSON.stringify(scorecard.metadata),
        }, { transaction });
        return scorecard;
    }
    catch (error) {
        throw new Error(`Failed to create Balanced Scorecard: ${error.message}`);
    }
}
/**
 * Function 16: Build strategy map
 * Creates causal linkages between strategic objectives
 */
function buildStrategyMap(objectives) {
    const map = [];
    objectives.forEach(obj => {
        map.push({
            objectiveId: obj.id,
            perspective: obj.perspective,
            dependencies: [],
            contributesTo: obj.linkedObjectives || [],
        });
    });
    return map;
}
/**
 * Function 17: Calculate balanced scorecard performance
 * Computes weighted performance scores across perspectives
 */
function calculateBalancedScorecardPerformance(scorecard) {
    const perspectives = [
        scorecard.financialPerspective,
        scorecard.customerPerspective,
        scorecard.internalProcessPerspective,
        scorecard.learningGrowthPerspective,
    ];
    let totalScore = 0;
    let totalWeight = 0;
    perspectives.forEach(perspective => {
        perspective.objectives.forEach(objective => {
            totalScore += (objective.weight / 100) * (perspective.currentScore || 0);
            totalWeight += objective.weight;
        });
    });
    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
}
/**
 * Function 18: Track BSC measure performance
 * Monitors KPI performance against targets
 */
function trackMeasurePerformance(measure, actualValue) {
    const variance = actualValue - measure.targetValue;
    const variancePercent = (variance / measure.targetValue) * 100;
    let status;
    if (actualValue >= measure.targetValue) {
        status = 'achieved';
    }
    else if (variancePercent > -10) {
        status = 'on-track';
    }
    else if (variancePercent > -20) {
        status = 'at-risk';
    }
    else {
        status = 'behind';
    }
    return {
        measureId: measure.id,
        period: new Date().toISOString().slice(0, 7),
        targetValue: measure.targetValue,
        actualValue,
        variance,
        status,
    };
}
/**
 * Function 19: Create scenario planning analysis
 * Develops multiple future scenarios for strategic planning
 */
async function createScenarioPlanningAnalysis(context, data, transaction) {
    try {
        const analysisId = generateUUID();
        const timestamp = new Date().toISOString();
        // Generate early warning indicators for each scenario
        const indicators = generateEarlyWarningIndicators(data.scenarios || []);
        // Create contingency plans
        const contingencyPlans = generateContingencyPlans(data.scenarios || []);
        const analysis = {
            id: analysisId,
            organizationId: data.organizationId || context.organizationId,
            analysisName: data.analysisName || 'Scenario Planning Analysis',
            timeHorizon: data.timeHorizon || '5 years',
            scenarios: data.scenarios || [],
            criticalUncertainties: data.criticalUncertainties || [],
            earlyWarningIndicators: indicators,
            contingencyPlans,
            recommendedActions: data.recommendedActions || [],
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.SCENARIO_PLANNING,
            },
        };
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to create scenario planning analysis: ${error.message}`);
    }
}
/**
 * Function 20: Generate early warning indicators
 * Creates monitoring indicators for scenario triggers
 */
function generateEarlyWarningIndicators(scenarios) {
    const indicators = [];
    scenarios.forEach((scenario, index) => {
        scenario.assumptions.forEach((assumption, aIndex) => {
            indicators.push({
                id: `ewi-${index}-${aIndex}`,
                indicatorName: `Monitor ${assumption.category}`,
                scenarioId: scenario.id,
                currentValue: 50,
                thresholdValue: 70,
                trend: 'stable',
                monitoringFrequency: 'monthly',
                alertOwner: context.userId,
            });
        });
    });
    return indicators;
}
/**
 * Function 21: Generate contingency plans
 * Creates response plans for different scenarios
 */
function generateContingencyPlans(scenarios) {
    return scenarios.map((scenario, index) => ({
        id: `cp-${index}`,
        scenarioId: scenario.id,
        planName: `Contingency Plan: ${scenario.scenarioName}`,
        triggers: scenario.assumptions.map(a => a.assumption),
        actions: [],
        resources: [],
        responsibleParty: 'Strategy Team',
        activationCriteria: `Scenario probability exceeds ${(scenario.probability * 100).toFixed(0)}%`,
    }));
}
/**
 * Function 22: Assess scenario probability
 * Evaluates likelihood of scenario occurrence
 */
function assessScenarioProbability(scenario, currentIndicators) {
    const relevantIndicators = currentIndicators.filter(i => i.scenarioId === scenario.id);
    if (relevantIndicators.length === 0)
        return scenario.probability;
    const indicatorStrength = relevantIndicators.reduce((sum, indicator) => {
        const ratio = indicator.currentValue / indicator.thresholdValue;
        return sum + ratio;
    }, 0) / relevantIndicators.length;
    return Math.min(1, scenario.probability * indicatorStrength);
}
/**
 * Function 23: Create value chain analysis
 * Analyzes primary and support activities for competitive advantage
 */
async function createValueChainAnalysis(context, data, transaction) {
    try {
        const analysisId = generateUUID();
        const timestamp = new Date().toISOString();
        // Identify cost and value drivers
        const costDrivers = identifyCostDrivers(data.primaryActivities || [], data.supportActivities || []);
        const valueDrivers = identifyValueDrivers(data.primaryActivities || [], data.supportActivities || []);
        // Identify competitive advantages
        const advantages = identifyCompetitiveAdvantages([...data.primaryActivities || [], ...data.supportActivities || []]);
        const analysis = {
            id: analysisId,
            organizationId: data.organizationId || context.organizationId,
            analysisDate: data.analysisDate || timestamp.split('T')[0],
            primaryActivities: data.primaryActivities || [],
            supportActivities: data.supportActivities || [],
            costDrivers,
            valueDrivers,
            competitiveAdvantages: advantages,
            improvementOpportunities: data.improvementOpportunities || [],
            metadata: {
                ...data.metadata,
                createdAt: timestamp,
                framework: StrategyFramework.VALUE_CHAIN,
            },
        };
        return analysis;
    }
    catch (error) {
        throw new Error(`Failed to create value chain analysis: ${error.message}`);
    }
}
/**
 * Function 24: Identify cost drivers
 * Finds key cost drivers in value chain activities
 */
function identifyCostDrivers(primary, support) {
    const allActivities = [...primary, ...support];
    const drivers = [];
    allActivities.forEach(activity => {
        if (activity.costContribution > 15) {
            drivers.push({
                activityId: activity.id,
                driver: `${activity.activityName} cost contribution`,
                impactLevel: Math.round(activity.costContribution / 10),
                optimization: `Reduce ${activity.activityName} costs through process improvement`,
                expectedSavings: activity.costContribution * 10000,
            });
        }
    });
    return drivers.sort((a, b) => b.impactLevel - a.impactLevel);
}
/**
 * Function 25: Identify value drivers
 * Finds key value creation drivers in value chain
 */
function identifyValueDrivers(primary, support) {
    const allActivities = [...primary, ...support];
    const drivers = [];
    allActivities.forEach(activity => {
        if (activity.valueContribution >= 7) {
            drivers.push({
                activityId: activity.id,
                driver: `${activity.activityName} value creation`,
                customerValue: activity.valueContribution,
                differentiationPotential: activity.improvementPotential,
                enhancementStrategy: `Enhance ${activity.activityName} to increase customer value`,
                expectedRevenue: activity.valueContribution * 50000,
            });
        }
    });
    return drivers.sort((a, b) => b.customerValue - a.customerValue);
}
/**
 * Function 26: Identify competitive advantages
 * Detects sources of competitive advantage in value chain
 */
function identifyCompetitiveAdvantages(activities) {
    const advantages = [];
    const superior = activities.filter(a => a.competitivePosition === 'superior');
    superior.forEach(activity => {
        const type = activity.costContribution < 10 ? 'cost' : 'differentiation';
        advantages.push({
            source: activity.activityName,
            type,
            sustainability: activity.efficiency,
            activities: [activity.id],
            protection: `Maintain excellence in ${activity.activityName}`,
        });
    });
    return advantages;
}
// Continuing with remaining functions 27-45...
/**
 * Function 27: Calculate value chain margin
 * Computes total margin from value chain activities
 */
function calculateValueChainMargin(analysis) {
    const totalValue = [...analysis.primaryActivities, ...analysis.supportActivities]
        .reduce((sum, a) => sum + a.valueContribution, 0);
    const totalCost = [...analysis.primaryActivities, ...analysis.supportActivities]
        .reduce((sum, a) => sum + a.costContribution, 0);
    return ((totalValue - totalCost) / totalValue) * 100;
}
/**
 * Function 28: Benchmark value chain activities
 * Compares activities against industry benchmarks
 */
function benchmarkValueChainActivities(activities, benchmarks) {
    return activities.map(activity => ({
        activity: activity.activityName,
        gap: (benchmarks[activity.category] || 5) - activity.efficiency,
    }));
}
/**
 * Function 29: Generate strategic roadmap
 * Creates multi-year strategic implementation roadmap
 */
function generateStrategicRoadmap(initiatives, timeHorizon) {
    const roadmap = [];
    for (let year = 1; year <= timeHorizon; year++) {
        const yearInitiatives = initiatives.filter(i => {
            const start = new Date(i.startDate);
            const end = new Date(i.endDate);
            const currentYear = new Date().getFullYear() + year - 1;
            return start.getFullYear() <= currentYear && end.getFullYear() >= currentYear;
        });
        roadmap.push({ year, initiatives: yearInitiatives });
    }
    return roadmap;
}
/**
 * Function 30: Perform stakeholder analysis
 * Maps and analyzes key stakeholders
 */
function performStakeholderAnalysis(stakeholders) {
    return stakeholders.map(stakeholder => {
        let quadrant;
        let strategy;
        if (stakeholder.power >= 5 && stakeholder.interest >= 5) {
            quadrant = 'Key Players';
            strategy = 'Manage Closely';
        }
        else if (stakeholder.power >= 5 && stakeholder.interest < 5) {
            quadrant = 'Keep Satisfied';
            strategy = 'Keep Satisfied';
        }
        else if (stakeholder.power < 5 && stakeholder.interest >= 5) {
            quadrant = 'Keep Informed';
            strategy = 'Keep Informed';
        }
        else {
            quadrant = 'Monitor';
            strategy = 'Monitor Minimally';
        }
        return { name: stakeholder.name, quadrant, strategy };
    });
}
/**
 * Function 31: Calculate strategic fit score
 * Assesses alignment between initiative and strategy
 */
function calculateStrategicFitScore(initiative, strategicObjectives) {
    // Weighted scoring based on strategic alignment
    const alignmentScore = initiative.strategicFit;
    const riskAdjustment = (6 - getRiskValue(initiative.riskLevel)) / 5;
    const roiImpact = Math.min(initiative.roi / 100, 1);
    return (alignmentScore * 0.5 + riskAdjustment * 10 * 0.3 + roiImpact * 10 * 0.2);
}
function getRiskValue(risk) {
    const values = { critical: 5, high: 4, moderate: 3, low: 2, negligible: 1 };
    return values[risk] || 3;
}
/**
 * Function 32: Optimize portfolio allocation
 * Uses efficient frontier to optimize portfolio mix
 */
function optimizePortfolioAllocation(units, constraints) {
    const allocations = [];
    const totalRevenue = units.reduce((sum, u) => sum + u.revenue, 0);
    units.forEach(unit => {
        const risk = getPositionRisk(unit.position);
        const expectedReturn = unit.profitMargin;
        let weight = 0;
        if (risk <= constraints.maxRisk && expectedReturn >= constraints.minReturn) {
            weight = (expectedReturn / risk) * (unit.revenue / totalRevenue);
        }
        allocations.push({
            businessUnitId: unit.id,
            allocationType: 'capital',
            currentAllocation: (unit.revenue / totalRevenue) * 100,
            recommendedAllocation: weight * 100,
            variance: (weight * 100) - ((unit.revenue / totalRevenue) * 100),
            justification: `Risk-adjusted allocation based on ${expectedReturn}% return and ${risk} risk`,
        });
    });
    return allocations;
}
function getPositionRisk(position) {
    const risks = {
        [StrategicPosition.STAR]: 3,
        [StrategicPosition.CASH_COW]: 1,
        [StrategicPosition.QUESTION_MARK]: 4,
        [StrategicPosition.DOG]: 2,
        [StrategicPosition.LEADER]: 2,
        [StrategicPosition.CHALLENGER]: 3,
        [StrategicPosition.FOLLOWER]: 3,
        [StrategicPosition.NICHER]: 4,
    };
    return risks[position] || 3;
}
/**
 * Function 33: Conduct PESTEL analysis
 * Analyzes Political, Economic, Social, Technological, Environmental, Legal factors
 */
function conductPESTELAnalysis(factors) {
    const categories = ['political', 'economic', 'social', 'technological', 'environmental', 'legal'];
    return categories.map(category => {
        const categoryFactors = factors[category] || [];
        const totalImpact = categoryFactors.reduce((sum, f) => sum + f.impact, 0);
        const keyFactors = categoryFactors
            .filter(f => f.impact >= 7)
            .map(f => f.factor);
        return { category, totalImpact, keyFactors };
    });
}
/**
 * Function 34: Analyze core competencies
 * Identifies and evaluates organizational core competencies
 */
function analyzeCoreCompetencies(competencies) {
    return competencies.map(comp => {
        const isCoreCompetency = comp.valuable && comp.rare && comp.inimitable;
        const sustainableAdvantage = isCoreCompetency && comp.organized;
        return {
            name: comp.name,
            isCoreCompetency,
            sustainableAdvantage,
        };
    });
}
/**
 * Function 35: Calculate market attractiveness
 * Evaluates market attractiveness using multiple factors
 */
function calculateMarketAttractiveness(market) {
    const weights = {
        size: 0.2,
        growth: 0.3,
        profitability: 0.25,
        competitiveIntensity: 0.15,
        barriers: 0.1,
    };
    return (market.size * weights.size +
        market.growth * weights.growth +
        market.profitability * weights.profitability +
        (10 - market.competitiveIntensity) * weights.competitiveIntensity +
        market.barriers * weights.barriers);
}
/**
 * Function 36: Perform gap analysis
 * Identifies gaps between current and desired state
 */
function performGapAnalysis(currentState, desiredState) {
    const gaps = [];
    Object.keys(desiredState).forEach(dimension => {
        const gap = desiredState[dimension] - (currentState[dimension] || 0);
        let priority;
        if (gap >= 5)
            priority = StrategyPriority.CRITICAL;
        else if (gap >= 3)
            priority = StrategyPriority.HIGH;
        else if (gap >= 1)
            priority = StrategyPriority.MEDIUM;
        else
            priority = StrategyPriority.LOW;
        gaps.push({ dimension, gap, priority });
    });
    return gaps.sort((a, b) => b.gap - a.gap);
}
/**
 * Function 37: Simulate strategic scenarios
 * Runs Monte Carlo simulation for strategic outcomes
 */
function simulateStrategicScenarios(initiative, iterations = 1000) {
    const results = [];
    for (let i = 0; i < iterations; i++) {
        const randomFactor = 0.5 + Math.random();
        const simulatedROI = initiative.roi * randomFactor * initiative.successProbability;
        results.push(simulatedROI);
    }
    const meanROI = results.reduce((sum, r) => sum + r, 0) / results.length;
    const variance = results.reduce((sum, r) => sum + Math.pow(r - meanROI, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);
    const successProbability = results.filter(r => r > 0).length / results.length;
    return { meanROI, stdDev, successProbability };
}
/**
 * Function 38: Prioritize strategic initiatives
 * Ranks initiatives using multi-criteria decision analysis
 */
function prioritizeStrategicInitiatives(initiatives, criteria) {
    const scored = initiatives.map(initiative => {
        const score = (initiative.expectedImpact / 10) * criteria.impact +
            ((100 - initiative.progress) / 100) * criteria.feasibility +
            (isUrgent(initiative.endDate) ? 1 : 0.5) * criteria.urgency +
            criteria.alignment;
        return { ...initiative, score };
    });
    return scored.sort((a, b) => b.score - a.score);
}
function isUrgent(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const monthsUntilEnd = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilEnd < 6;
}
/**
 * Function 39: Track strategic KPIs
 * Monitors key performance indicators for strategic initiatives
 */
function trackStrategicKPIs(kpis) {
    let weightedProgress = 0;
    let totalWeight = 0;
    const atRiskKPIs = [];
    kpis.forEach(kpi => {
        const progress = (kpi.current / kpi.target) * 100;
        weightedProgress += progress * kpi.weight;
        totalWeight += kpi.weight;
        if (progress < 70) {
            atRiskKPIs.push(kpi.name);
        }
    });
    const overallProgress = totalWeight > 0 ? weightedProgress / totalWeight : 0;
    return { overallProgress, atRiskKPIs };
}
/**
 * Function 40: Generate strategy execution dashboard
 * Creates comprehensive dashboard metrics for strategy tracking
 */
function generateStrategyExecutionDashboard(scorecard, initiatives) {
    const perspectives = [
        scorecard.financialPerspective,
        scorecard.customerPerspective,
        scorecard.internalProcessPerspective,
        scorecard.learningGrowthPerspective,
    ];
    const perspectiveHealth = {};
    perspectives.forEach(p => {
        perspectiveHealth[p.perspective] = (p.currentScore / p.targetScore) * 100;
    });
    const overallHealth = Object.values(perspectiveHealth).reduce((sum, h) => sum + h, 0) / 4;
    const initiativeProgress = initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length;
    const atRiskCount = initiatives.filter(i => i.progress < 50 && i.status === InitiativeStatus.IN_PROGRESS).length;
    return {
        overallHealth,
        perspectiveHealth,
        initiativeProgress,
        atRiskCount,
    };
}
/**
 * Function 41: Analyze strategic dependencies
 * Maps dependencies between strategic initiatives
 */
function analyzeStrategicDependencies(initiatives) {
    return initiatives.map(initiative => {
        const blockedBy = initiatives
            .filter(other => initiative.dependencies.includes(other.id))
            .map(other => other.initiativeName);
        const blocks = initiatives
            .filter(other => other.dependencies.includes(initiative.id))
            .map(other => other.initiativeName);
        return {
            initiative: initiative.initiativeName,
            blockedBy,
            blocks,
        };
    });
}
/**
 * Function 42: Calculate strategic momentum
 * Measures rate of strategic progress
 */
function calculateStrategicMomentum(historicalScores) {
    if (historicalScores.length < 2) {
        return { momentum: 0, trend: 'steady' };
    }
    const recent = historicalScores.slice(-3);
    const changes = recent.slice(1).map((score, i) => score.score - recent[i].score);
    const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    let trend;
    if (avgChange > 2)
        trend = 'accelerating';
    else if (avgChange < -2)
        trend = 'decelerating';
    else
        trend = 'steady';
    return { momentum: avgChange, trend };
}
/**
 * Function 43: Assess strategic agility
 * Evaluates organization's ability to adapt strategy
 */
function assessStrategicAgility(factors) {
    const scores = Object.entries(factors);
    const agilityScore = scores.reduce((sum, [_, value]) => sum + value, 0) / scores.length;
    const strengths = scores.filter(([_, value]) => value >= 7).map(([key]) => key);
    const weaknesses = scores.filter(([_, value]) => value < 5).map(([key]) => key);
    return { agilityScore, strengths, weaknesses };
}
/**
 * Function 44: Forecast strategic outcomes
 * Projects future outcomes based on current trajectory
 */
function forecastStrategicOutcomes(currentMetrics, growthRates, periods) {
    const forecast = [];
    for (let period = 1; period <= periods; period++) {
        const metrics = {};
        Object.keys(currentMetrics).forEach(metric => {
            const growthRate = growthRates[metric] || 0;
            metrics[metric] = currentMetrics[metric] * Math.pow(1 + growthRate, period);
        });
        forecast.push({ period, metrics });
    }
    return forecast;
}
/**
 * Function 45: Generate executive strategy summary
 * Creates C-suite ready strategic summary
 */
function generateExecutiveStrategySummary(swot, porter, bcg, scorecard) {
    const strategicPosition = `Industry attractiveness: ${porter.overallAttractiveness.toFixed(1)}/10. Portfolio balanced with ${bcg.businessUnits.filter(u => u.position === StrategicPosition.STAR).length} Stars and ${bcg.businessUnits.filter(u => u.position === StrategicPosition.CASH_COW).length} Cash Cows.`;
    const keyRecommendations = [
        ...swot.strategicRecommendations.slice(0, 3).map(r => r.recommendation),
        ...bcg.portfolioRecommendations.slice(0, 2).map(r => r.rationale),
    ];
    const criticalRisks = swot.threats
        .filter(t => t.urgency >= 8)
        .map(t => t.description);
    const performanceSummary = `Overall scorecard performance: ${scorecard.overallScore.toFixed(1)}%. ${scorecard.overallScore >= 80 ? 'On track' : scorecard.overallScore >= 60 ? 'Needs attention' : 'Critical intervention required'}.`;
    const nextSteps = swot.crossFactorAnalysis
        .filter(cf => cf.priority === StrategyPriority.CRITICAL || cf.priority === StrategyPriority.HIGH)
        .slice(0, 5)
        .map(cf => cf.strategy);
    return {
        strategicPosition,
        keyRecommendations,
        criticalRisks,
        performanceSummary,
        nextSteps,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // SWOT Analysis
    createSWOTAnalysis,
    generateCrossFactorAnalysis,
    generateSWOTRecommendations,
    // Porter's Five Forces
    createPorterFiveForcesAnalysis,
    calculateIndustryAttractiveness,
    // BCG Matrix
    createBCGMatrixAnalysis,
    determineBCGPosition,
    getBCGStrategy,
    getInvestmentPriority,
    generatePortfolioRecommendations,
    calculateResourceAllocation,
    identifyStrategicGaps,
    // Ansoff Matrix
    createAnsoffMatrixAnalysis,
    assessAnsoffRisk,
    // Balanced Scorecard
    createBalancedScorecard,
    buildStrategyMap,
    calculateBalancedScorecardPerformance,
    trackMeasurePerformance,
    // Scenario Planning
    createScenarioPlanningAnalysis,
    generateEarlyWarningIndicators,
    generateContingencyPlans,
    assessScenarioProbability,
    // Value Chain
    createValueChainAnalysis,
    identifyCostDrivers,
    identifyValueDrivers,
    identifyCompetitiveAdvantages,
    calculateValueChainMargin,
    benchmarkValueChainActivities,
    // Additional Strategic Tools
    generateStrategicRoadmap,
    performStakeholderAnalysis,
    calculateStrategicFitScore,
    optimizePortfolioAllocation,
    conductPESTELAnalysis,
    analyzeCoreCompetencies,
    calculateMarketAttractiveness,
    performGapAnalysis,
    simulateStrategicScenarios,
    prioritizeStrategicInitiatives,
    trackStrategicKPIs,
    generateStrategyExecutionDashboard,
    analyzeStrategicDependencies,
    calculateStrategicMomentum,
    assessStrategicAgility,
    forecastStrategicOutcomes,
    generateExecutiveStrategySummary,
    // Models
    SWOTAnalysisModel,
    PorterFiveForcesModel,
    BCGMatrixModel,
    BalancedScorecardModel,
};
//# sourceMappingURL=strategic-planning-kit.js.map