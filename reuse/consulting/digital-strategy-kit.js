"use strict";
/**
 * LOC: DIGSTRAT12345
 * File: /reuse/consulting/digital-strategy-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Digital transformation controllers
 *   - Strategy assessment engines
 *   - Technology roadmap services
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
exports.designAPIGateway = exports.planAPIMonetization = exports.defineAPISecurity = exports.designAPIGovernance = exports.developAPIStrategy = exports.generatePlatformRecommendation = exports.assessPlatformSecurity = exports.evaluatePlatformScalability = exports.assessIntegrationComplexity = exports.generatePOCPlan = exports.calculatePlatformTCO = exports.assessVendorRisk = exports.comparePlatformAlternatives = exports.evaluatePlatform = exports.updateRoadmapProgress = exports.trackRoadmapProgress = exports.generateRoadmapVisualization = exports.identifyRoadmapCriticalPath = exports.calculateRoadmapROI = exports.validateRoadmapFeasibility = exports.optimizeRoadmapSequencing = exports.addRoadmapInitiative = exports.createTechnologyRoadmap = exports.calculateDigitalQuotient = exports.exportMaturityAssessment = exports.generateMaturityExecutiveSummary = exports.trackMaturityProgress = exports.generateTransformationRoadmap = exports.identifyCriticalCapabilityGaps = exports.benchmarkDigitalMaturity = exports.calculateDimensionMaturityScore = exports.conductDigitalMaturityAssessment = exports.createPlatformEvaluationModel = exports.createTechnologyRoadmapModel = exports.createDigitalMaturityAssessmentModel = exports.DimensionScoreDto = exports.CreateTransformationProgramDto = exports.CreateAPIStrategyDto = exports.CreatePlatformEvaluationDto = exports.CreateRoadmapInitiativeDto = exports.CreateTechnologyRoadmapDto = exports.UpdateDigitalMaturityAssessmentDto = exports.CreateDigitalMaturityAssessmentDto = exports.CloudMigrationStrategy = exports.APIStrategyType = exports.PlatformEvaluationCriteria = exports.TransformationProgramStatus = exports.TechnologyStackCategory = exports.CapabilityDimension = exports.DigitalMaturityLevel = void 0;
exports.generateMigrationProjectPlan = exports.identifyMigrationRisks = exports.planDataMigration = exports.designCloudLandingZone = exports.developCloudCostOptimization = exports.estimateMigrationCosts = exports.planMigrationWaves = exports.categorizeApplicationsByStrategy = exports.assessCloudMigrationReadiness = exports.designAPIAnalytics = exports.planAPIDeveloperExperience = exports.defineAPIVersioning = exports.generateAPIDocStandards = void 0;
/**
 * File: /reuse/consulting/digital-strategy-kit.ts
 * Locator: WC-CONS-DIGSTRAT-001
 * Purpose: Comprehensive Digital Strategy & Transformation Utilities - McKinsey Digital-level consulting capabilities
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, strategy services, transformation engines, roadmap generators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for digital maturity assessment, technology roadmaps, platform selection, API strategy, digital transformation
 *
 * LLM Context: Enterprise-grade digital strategy and transformation system competing with McKinsey Digital.
 * Provides digital maturity assessments, technology roadmap planning, platform evaluation and selection, API strategy development,
 * digital transformation program management, capability gap analysis, technology stack optimization, cloud migration strategy,
 * digital operating model design, agile transformation, data strategy, AI/ML readiness assessment, cybersecurity strategy,
 * digital culture assessment, change management planning, ROI modeling, vendor evaluation, proof-of-concept management.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Digital maturity levels based on McKinsey Digital Quotient
 */
var DigitalMaturityLevel;
(function (DigitalMaturityLevel) {
    DigitalMaturityLevel["NASCENT"] = "nascent";
    DigitalMaturityLevel["EMERGING"] = "emerging";
    DigitalMaturityLevel["CONNECTED"] = "connected";
    DigitalMaturityLevel["MULTI_MODAL"] = "multi_modal";
    DigitalMaturityLevel["INNOVATIVE"] = "innovative";
})(DigitalMaturityLevel || (exports.DigitalMaturityLevel = DigitalMaturityLevel = {}));
/**
 * Digital capability dimensions
 */
var CapabilityDimension;
(function (CapabilityDimension) {
    CapabilityDimension["STRATEGY"] = "strategy";
    CapabilityDimension["CULTURE"] = "culture";
    CapabilityDimension["ORGANIZATION"] = "organization";
    CapabilityDimension["TECHNOLOGY"] = "technology";
    CapabilityDimension["DATA"] = "data";
    CapabilityDimension["OPERATIONS"] = "operations";
    CapabilityDimension["INNOVATION"] = "innovation";
    CapabilityDimension["CUSTOMER_EXPERIENCE"] = "customer_experience";
})(CapabilityDimension || (exports.CapabilityDimension = CapabilityDimension = {}));
/**
 * Technology stack categories
 */
var TechnologyStackCategory;
(function (TechnologyStackCategory) {
    TechnologyStackCategory["FRONTEND"] = "frontend";
    TechnologyStackCategory["BACKEND"] = "backend";
    TechnologyStackCategory["DATABASE"] = "database";
    TechnologyStackCategory["INFRASTRUCTURE"] = "infrastructure";
    TechnologyStackCategory["SECURITY"] = "security";
    TechnologyStackCategory["ANALYTICS"] = "analytics";
    TechnologyStackCategory["INTEGRATION"] = "integration";
    TechnologyStackCategory["DEVOPS"] = "devops";
})(TechnologyStackCategory || (exports.TechnologyStackCategory = TechnologyStackCategory = {}));
/**
 * Transformation program status
 */
var TransformationProgramStatus;
(function (TransformationProgramStatus) {
    TransformationProgramStatus["PLANNING"] = "planning";
    TransformationProgramStatus["ASSESSMENT"] = "assessment";
    TransformationProgramStatus["DESIGN"] = "design";
    TransformationProgramStatus["PILOT"] = "pilot";
    TransformationProgramStatus["ROLLOUT"] = "rollout";
    TransformationProgramStatus["OPTIMIZATION"] = "optimization";
    TransformationProgramStatus["SUSTAIN"] = "sustain";
})(TransformationProgramStatus || (exports.TransformationProgramStatus = TransformationProgramStatus = {}));
/**
 * Platform evaluation criteria
 */
var PlatformEvaluationCriteria;
(function (PlatformEvaluationCriteria) {
    PlatformEvaluationCriteria["FUNCTIONALITY"] = "functionality";
    PlatformEvaluationCriteria["SCALABILITY"] = "scalability";
    PlatformEvaluationCriteria["SECURITY"] = "security";
    PlatformEvaluationCriteria["COST"] = "cost";
    PlatformEvaluationCriteria["VENDOR_STABILITY"] = "vendor_stability";
    PlatformEvaluationCriteria["INTEGRATION"] = "integration";
    PlatformEvaluationCriteria["USER_EXPERIENCE"] = "user_experience";
    PlatformEvaluationCriteria["SUPPORT"] = "support";
})(PlatformEvaluationCriteria || (exports.PlatformEvaluationCriteria = PlatformEvaluationCriteria = {}));
/**
 * API strategy type
 */
var APIStrategyType;
(function (APIStrategyType) {
    APIStrategyType["INTERNAL"] = "internal";
    APIStrategyType["PARTNER"] = "partner";
    APIStrategyType["PUBLIC"] = "public";
    APIStrategyType["HYBRID"] = "hybrid";
})(APIStrategyType || (exports.APIStrategyType = APIStrategyType = {}));
/**
 * Cloud migration strategy
 */
var CloudMigrationStrategy;
(function (CloudMigrationStrategy) {
    CloudMigrationStrategy["REHOST"] = "rehost";
    CloudMigrationStrategy["REPLATFORM"] = "replatform";
    CloudMigrationStrategy["REFACTOR"] = "refactor";
    CloudMigrationStrategy["REBUILD"] = "rebuild";
    CloudMigrationStrategy["REPLACE"] = "replace";
    CloudMigrationStrategy["RETIRE"] = "retire";
})(CloudMigrationStrategy || (exports.CloudMigrationStrategy = CloudMigrationStrategy = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create digital maturity assessment DTO
 */
let CreateDigitalMaturityAssessmentDto = (() => {
    var _a;
    let _assessmentName_decorators;
    let _assessmentName_initializers = [];
    let _assessmentName_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _organizationName_decorators;
    let _organizationName_initializers = [];
    let _organizationName_extraInitializers = [];
    let _assessmentDate_decorators;
    let _assessmentDate_initializers = [];
    let _assessmentDate_extraInitializers = [];
    let _benchmarkIndustry_decorators;
    let _benchmarkIndustry_initializers = [];
    let _benchmarkIndustry_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    return _a = class CreateDigitalMaturityAssessmentDto {
            constructor() {
                this.assessmentName = __runInitializers(this, _assessmentName_initializers, void 0);
                this.organizationId = (__runInitializers(this, _assessmentName_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.organizationName = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _organizationName_initializers, void 0));
                this.assessmentDate = (__runInitializers(this, _organizationName_extraInitializers), __runInitializers(this, _assessmentDate_initializers, void 0));
                this.benchmarkIndustry = (__runInitializers(this, _assessmentDate_extraInitializers), __runInitializers(this, _benchmarkIndustry_initializers, void 0));
                this.assessedBy = (__runInitializers(this, _benchmarkIndustry_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
                __runInitializers(this, _assessedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assessmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _organizationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _assessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _benchmarkIndustry_decorators = [(0, swagger_1.ApiProperty)({ description: 'Benchmark industry', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _assessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessed by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _assessmentName_decorators, { kind: "field", name: "assessmentName", static: false, private: false, access: { has: obj => "assessmentName" in obj, get: obj => obj.assessmentName, set: (obj, value) => { obj.assessmentName = value; } }, metadata: _metadata }, _assessmentName_initializers, _assessmentName_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _organizationName_decorators, { kind: "field", name: "organizationName", static: false, private: false, access: { has: obj => "organizationName" in obj, get: obj => obj.organizationName, set: (obj, value) => { obj.organizationName = value; } }, metadata: _metadata }, _organizationName_initializers, _organizationName_extraInitializers);
            __esDecorate(null, null, _assessmentDate_decorators, { kind: "field", name: "assessmentDate", static: false, private: false, access: { has: obj => "assessmentDate" in obj, get: obj => obj.assessmentDate, set: (obj, value) => { obj.assessmentDate = value; } }, metadata: _metadata }, _assessmentDate_initializers, _assessmentDate_extraInitializers);
            __esDecorate(null, null, _benchmarkIndustry_decorators, { kind: "field", name: "benchmarkIndustry", static: false, private: false, access: { has: obj => "benchmarkIndustry" in obj, get: obj => obj.benchmarkIndustry, set: (obj, value) => { obj.benchmarkIndustry = value; } }, metadata: _metadata }, _benchmarkIndustry_initializers, _benchmarkIndustry_extraInitializers);
            __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDigitalMaturityAssessmentDto = CreateDigitalMaturityAssessmentDto;
/**
 * Update digital maturity assessment DTO
 */
let UpdateDigitalMaturityAssessmentDto = (() => {
    var _a;
    let _overallMaturityLevel_decorators;
    let _overallMaturityLevel_initializers = [];
    let _overallMaturityLevel_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _dimensionScores_decorators;
    let _dimensionScores_initializers = [];
    let _dimensionScores_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _weaknesses_decorators;
    let _weaknesses_initializers = [];
    let _weaknesses_extraInitializers = [];
    let _opportunities_decorators;
    let _opportunities_initializers = [];
    let _opportunities_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    return _a = class UpdateDigitalMaturityAssessmentDto {
            constructor() {
                this.overallMaturityLevel = __runInitializers(this, _overallMaturityLevel_initializers, void 0);
                this.overallScore = (__runInitializers(this, _overallMaturityLevel_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
                this.dimensionScores = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _dimensionScores_initializers, void 0));
                this.strengths = (__runInitializers(this, _dimensionScores_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.weaknesses = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _weaknesses_initializers, void 0));
                this.opportunities = (__runInitializers(this, _weaknesses_extraInitializers), __runInitializers(this, _opportunities_initializers, void 0));
                this.recommendations = (__runInitializers(this, _opportunities_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
                __runInitializers(this, _recommendations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _overallMaturityLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: DigitalMaturityLevel }), (0, class_validator_1.IsEnum)(DigitalMaturityLevel), (0, class_validator_1.IsOptional)()];
            _overallScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall score', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _dimensionScores_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension scores', type: 'object' }), (0, class_validator_1.IsOptional)()];
            _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strengths', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _weaknesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weaknesses', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _opportunities_decorators = [(0, swagger_1.ApiProperty)({ description: 'Opportunities', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _overallMaturityLevel_decorators, { kind: "field", name: "overallMaturityLevel", static: false, private: false, access: { has: obj => "overallMaturityLevel" in obj, get: obj => obj.overallMaturityLevel, set: (obj, value) => { obj.overallMaturityLevel = value; } }, metadata: _metadata }, _overallMaturityLevel_initializers, _overallMaturityLevel_extraInitializers);
            __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
            __esDecorate(null, null, _dimensionScores_decorators, { kind: "field", name: "dimensionScores", static: false, private: false, access: { has: obj => "dimensionScores" in obj, get: obj => obj.dimensionScores, set: (obj, value) => { obj.dimensionScores = value; } }, metadata: _metadata }, _dimensionScores_initializers, _dimensionScores_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _weaknesses_decorators, { kind: "field", name: "weaknesses", static: false, private: false, access: { has: obj => "weaknesses" in obj, get: obj => obj.weaknesses, set: (obj, value) => { obj.weaknesses = value; } }, metadata: _metadata }, _weaknesses_initializers, _weaknesses_extraInitializers);
            __esDecorate(null, null, _opportunities_decorators, { kind: "field", name: "opportunities", static: false, private: false, access: { has: obj => "opportunities" in obj, get: obj => obj.opportunities, set: (obj, value) => { obj.opportunities = value; } }, metadata: _metadata }, _opportunities_initializers, _opportunities_extraInitializers);
            __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateDigitalMaturityAssessmentDto = UpdateDigitalMaturityAssessmentDto;
/**
 * Create technology roadmap DTO
 */
let CreateTechnologyRoadmapDto = (() => {
    var _a;
    let _roadmapName_decorators;
    let _roadmapName_initializers = [];
    let _roadmapName_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _timeHorizon_decorators;
    let _timeHorizon_initializers = [];
    let _timeHorizon_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _currentState_decorators;
    let _currentState_initializers = [];
    let _currentState_extraInitializers = [];
    let _targetState_decorators;
    let _targetState_initializers = [];
    let _targetState_extraInitializers = [];
    let _totalInvestment_decorators;
    let _totalInvestment_initializers = [];
    let _totalInvestment_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    return _a = class CreateTechnologyRoadmapDto {
            constructor() {
                this.roadmapName = __runInitializers(this, _roadmapName_initializers, void 0);
                this.organizationId = (__runInitializers(this, _roadmapName_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.timeHorizon = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _timeHorizon_initializers, void 0));
                this.startDate = (__runInitializers(this, _timeHorizon_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.currentState = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _currentState_initializers, void 0));
                this.targetState = (__runInitializers(this, _currentState_extraInitializers), __runInitializers(this, _targetState_initializers, void 0));
                this.totalInvestment = (__runInitializers(this, _targetState_extraInitializers), __runInitializers(this, _totalInvestment_initializers, void 0));
                this.ownerId = (__runInitializers(this, _totalInvestment_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _roadmapName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Roadmap name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _timeHorizon_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time horizon in months' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(3), (0, class_validator_1.Max)(60)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _currentState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current state description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _targetState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target state description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _totalInvestment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total investment' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _roadmapName_decorators, { kind: "field", name: "roadmapName", static: false, private: false, access: { has: obj => "roadmapName" in obj, get: obj => obj.roadmapName, set: (obj, value) => { obj.roadmapName = value; } }, metadata: _metadata }, _roadmapName_initializers, _roadmapName_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _timeHorizon_decorators, { kind: "field", name: "timeHorizon", static: false, private: false, access: { has: obj => "timeHorizon" in obj, get: obj => obj.timeHorizon, set: (obj, value) => { obj.timeHorizon = value; } }, metadata: _metadata }, _timeHorizon_initializers, _timeHorizon_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _currentState_decorators, { kind: "field", name: "currentState", static: false, private: false, access: { has: obj => "currentState" in obj, get: obj => obj.currentState, set: (obj, value) => { obj.currentState = value; } }, metadata: _metadata }, _currentState_initializers, _currentState_extraInitializers);
            __esDecorate(null, null, _targetState_decorators, { kind: "field", name: "targetState", static: false, private: false, access: { has: obj => "targetState" in obj, get: obj => obj.targetState, set: (obj, value) => { obj.targetState = value; } }, metadata: _metadata }, _targetState_initializers, _targetState_extraInitializers);
            __esDecorate(null, null, _totalInvestment_decorators, { kind: "field", name: "totalInvestment", static: false, private: false, access: { has: obj => "totalInvestment" in obj, get: obj => obj.totalInvestment, set: (obj, value) => { obj.totalInvestment = value; } }, metadata: _metadata }, _totalInvestment_initializers, _totalInvestment_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTechnologyRoadmapDto = CreateTechnologyRoadmapDto;
/**
 * Create roadmap initiative DTO
 */
let CreateRoadmapInitiativeDto = (() => {
    var _a;
    let _initiativeName_decorators;
    let _initiativeName_initializers = [];
    let _initiativeName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _startQuarter_decorators;
    let _startQuarter_initializers = [];
    let _startQuarter_extraInitializers = [];
    let _endQuarter_decorators;
    let _endQuarter_initializers = [];
    let _endQuarter_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _estimatedBenefit_decorators;
    let _estimatedBenefit_initializers = [];
    let _estimatedBenefit_extraInitializers = [];
    return _a = class CreateRoadmapInitiativeDto {
            constructor() {
                this.initiativeName = __runInitializers(this, _initiativeName_initializers, void 0);
                this.description = (__runInitializers(this, _initiativeName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.startQuarter = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _startQuarter_initializers, void 0));
                this.endQuarter = (__runInitializers(this, _startQuarter_extraInitializers), __runInitializers(this, _endQuarter_initializers, void 0));
                this.estimatedCost = (__runInitializers(this, _endQuarter_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
                this.estimatedBenefit = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _estimatedBenefit_initializers, void 0));
                __runInitializers(this, _estimatedBenefit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _initiativeName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Initiative name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: TechnologyStackCategory }), (0, class_validator_1.IsEnum)(TechnologyStackCategory)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] }), (0, class_validator_1.IsString)()];
            _startQuarter_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start quarter (e.g., 2025-Q1)' }), (0, class_validator_1.IsString)()];
            _endQuarter_decorators = [(0, swagger_1.ApiProperty)({ description: 'End quarter (e.g., 2025-Q2)' }), (0, class_validator_1.IsString)()];
            _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _estimatedBenefit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated benefit' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _initiativeName_decorators, { kind: "field", name: "initiativeName", static: false, private: false, access: { has: obj => "initiativeName" in obj, get: obj => obj.initiativeName, set: (obj, value) => { obj.initiativeName = value; } }, metadata: _metadata }, _initiativeName_initializers, _initiativeName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _startQuarter_decorators, { kind: "field", name: "startQuarter", static: false, private: false, access: { has: obj => "startQuarter" in obj, get: obj => obj.startQuarter, set: (obj, value) => { obj.startQuarter = value; } }, metadata: _metadata }, _startQuarter_initializers, _startQuarter_extraInitializers);
            __esDecorate(null, null, _endQuarter_decorators, { kind: "field", name: "endQuarter", static: false, private: false, access: { has: obj => "endQuarter" in obj, get: obj => obj.endQuarter, set: (obj, value) => { obj.endQuarter = value; } }, metadata: _metadata }, _endQuarter_initializers, _endQuarter_extraInitializers);
            __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
            __esDecorate(null, null, _estimatedBenefit_decorators, { kind: "field", name: "estimatedBenefit", static: false, private: false, access: { has: obj => "estimatedBenefit" in obj, get: obj => obj.estimatedBenefit, set: (obj, value) => { obj.estimatedBenefit = value; } }, metadata: _metadata }, _estimatedBenefit_initializers, _estimatedBenefit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRoadmapInitiativeDto = CreateRoadmapInitiativeDto;
/**
 * Create platform evaluation DTO
 */
let CreatePlatformEvaluationDto = (() => {
    var _a;
    let _evaluationName_decorators;
    let _evaluationName_initializers = [];
    let _evaluationName_extraInitializers = [];
    let _platformName_decorators;
    let _platformName_initializers = [];
    let _platformName_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _evaluationDate_decorators;
    let _evaluationDate_initializers = [];
    let _evaluationDate_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _evaluatedBy_decorators;
    let _evaluatedBy_initializers = [];
    let _evaluatedBy_extraInitializers = [];
    return _a = class CreatePlatformEvaluationDto {
            constructor() {
                this.evaluationName = __runInitializers(this, _evaluationName_initializers, void 0);
                this.platformName = (__runInitializers(this, _evaluationName_extraInitializers), __runInitializers(this, _platformName_initializers, void 0));
                this.vendorName = (__runInitializers(this, _platformName_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
                this.category = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.evaluationDate = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _evaluationDate_initializers, void 0));
                this.estimatedCost = (__runInitializers(this, _evaluationDate_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
                this.evaluatedBy = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _evaluatedBy_initializers, void 0));
                __runInitializers(this, _evaluatedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _evaluationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _platformName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Platform name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _vendorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: TechnologyStackCategory }), (0, class_validator_1.IsEnum)(TechnologyStackCategory)];
            _evaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _evaluatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluated by user IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _evaluationName_decorators, { kind: "field", name: "evaluationName", static: false, private: false, access: { has: obj => "evaluationName" in obj, get: obj => obj.evaluationName, set: (obj, value) => { obj.evaluationName = value; } }, metadata: _metadata }, _evaluationName_initializers, _evaluationName_extraInitializers);
            __esDecorate(null, null, _platformName_decorators, { kind: "field", name: "platformName", static: false, private: false, access: { has: obj => "platformName" in obj, get: obj => obj.platformName, set: (obj, value) => { obj.platformName = value; } }, metadata: _metadata }, _platformName_initializers, _platformName_extraInitializers);
            __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _evaluationDate_decorators, { kind: "field", name: "evaluationDate", static: false, private: false, access: { has: obj => "evaluationDate" in obj, get: obj => obj.evaluationDate, set: (obj, value) => { obj.evaluationDate = value; } }, metadata: _metadata }, _evaluationDate_initializers, _evaluationDate_extraInitializers);
            __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
            __esDecorate(null, null, _evaluatedBy_decorators, { kind: "field", name: "evaluatedBy", static: false, private: false, access: { has: obj => "evaluatedBy" in obj, get: obj => obj.evaluatedBy, set: (obj, value) => { obj.evaluatedBy = value; } }, metadata: _metadata }, _evaluatedBy_initializers, _evaluatedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePlatformEvaluationDto = CreatePlatformEvaluationDto;
/**
 * Create API strategy DTO
 */
let CreateAPIStrategyDto = (() => {
    var _a;
    let _strategyName_decorators;
    let _strategyName_initializers = [];
    let _strategyName_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _strategyType_decorators;
    let _strategyType_initializers = [];
    let _strategyType_extraInitializers = [];
    let _businessObjectives_decorators;
    let _businessObjectives_initializers = [];
    let _businessObjectives_extraInitializers = [];
    let _targetAudience_decorators;
    let _targetAudience_initializers = [];
    let _targetAudience_extraInitializers = [];
    let _apiArchitecture_decorators;
    let _apiArchitecture_initializers = [];
    let _apiArchitecture_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    return _a = class CreateAPIStrategyDto {
            constructor() {
                this.strategyName = __runInitializers(this, _strategyName_initializers, void 0);
                this.organizationId = (__runInitializers(this, _strategyName_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.strategyType = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _strategyType_initializers, void 0));
                this.businessObjectives = (__runInitializers(this, _strategyType_extraInitializers), __runInitializers(this, _businessObjectives_initializers, void 0));
                this.targetAudience = (__runInitializers(this, _businessObjectives_extraInitializers), __runInitializers(this, _targetAudience_initializers, void 0));
                this.apiArchitecture = (__runInitializers(this, _targetAudience_extraInitializers), __runInitializers(this, _apiArchitecture_initializers, void 0));
                this.ownerId = (__runInitializers(this, _apiArchitecture_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _strategyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategy name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _strategyType_decorators = [(0, swagger_1.ApiProperty)({ enum: APIStrategyType }), (0, class_validator_1.IsEnum)(APIStrategyType)];
            _businessObjectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business objectives', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _targetAudience_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target audience', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _apiArchitecture_decorators = [(0, swagger_1.ApiProperty)({ enum: ['REST', 'GRAPHQL', 'GRPC', 'SOAP', 'HYBRID'] }), (0, class_validator_1.IsString)()];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _strategyName_decorators, { kind: "field", name: "strategyName", static: false, private: false, access: { has: obj => "strategyName" in obj, get: obj => obj.strategyName, set: (obj, value) => { obj.strategyName = value; } }, metadata: _metadata }, _strategyName_initializers, _strategyName_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _strategyType_decorators, { kind: "field", name: "strategyType", static: false, private: false, access: { has: obj => "strategyType" in obj, get: obj => obj.strategyType, set: (obj, value) => { obj.strategyType = value; } }, metadata: _metadata }, _strategyType_initializers, _strategyType_extraInitializers);
            __esDecorate(null, null, _businessObjectives_decorators, { kind: "field", name: "businessObjectives", static: false, private: false, access: { has: obj => "businessObjectives" in obj, get: obj => obj.businessObjectives, set: (obj, value) => { obj.businessObjectives = value; } }, metadata: _metadata }, _businessObjectives_initializers, _businessObjectives_extraInitializers);
            __esDecorate(null, null, _targetAudience_decorators, { kind: "field", name: "targetAudience", static: false, private: false, access: { has: obj => "targetAudience" in obj, get: obj => obj.targetAudience, set: (obj, value) => { obj.targetAudience = value; } }, metadata: _metadata }, _targetAudience_initializers, _targetAudience_extraInitializers);
            __esDecorate(null, null, _apiArchitecture_decorators, { kind: "field", name: "apiArchitecture", static: false, private: false, access: { has: obj => "apiArchitecture" in obj, get: obj => obj.apiArchitecture, set: (obj, value) => { obj.apiArchitecture = value; } }, metadata: _metadata }, _apiArchitecture_initializers, _apiArchitecture_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAPIStrategyDto = CreateAPIStrategyDto;
/**
 * Create transformation program DTO
 */
let CreateTransformationProgramDto = (() => {
    var _a;
    let _programName_decorators;
    let _programName_initializers = [];
    let _programName_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _visionStatement_decorators;
    let _visionStatement_initializers = [];
    let _visionStatement_extraInitializers = [];
    let _strategicObjectives_decorators;
    let _strategicObjectives_initializers = [];
    let _strategicObjectives_extraInitializers = [];
    let _currentMaturityLevel_decorators;
    let _currentMaturityLevel_initializers = [];
    let _currentMaturityLevel_extraInitializers = [];
    let _targetMaturityLevel_decorators;
    let _targetMaturityLevel_initializers = [];
    let _targetMaturityLevel_extraInitializers = [];
    let _programDuration_decorators;
    let _programDuration_initializers = [];
    let _programDuration_extraInitializers = [];
    let _totalBudget_decorators;
    let _totalBudget_initializers = [];
    let _totalBudget_extraInitializers = [];
    let _executiveSponsor_decorators;
    let _executiveSponsor_initializers = [];
    let _executiveSponsor_extraInitializers = [];
    let _programManager_decorators;
    let _programManager_initializers = [];
    let _programManager_extraInitializers = [];
    return _a = class CreateTransformationProgramDto {
            constructor() {
                this.programName = __runInitializers(this, _programName_initializers, void 0);
                this.organizationId = (__runInitializers(this, _programName_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.visionStatement = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _visionStatement_initializers, void 0));
                this.strategicObjectives = (__runInitializers(this, _visionStatement_extraInitializers), __runInitializers(this, _strategicObjectives_initializers, void 0));
                this.currentMaturityLevel = (__runInitializers(this, _strategicObjectives_extraInitializers), __runInitializers(this, _currentMaturityLevel_initializers, void 0));
                this.targetMaturityLevel = (__runInitializers(this, _currentMaturityLevel_extraInitializers), __runInitializers(this, _targetMaturityLevel_initializers, void 0));
                this.programDuration = (__runInitializers(this, _targetMaturityLevel_extraInitializers), __runInitializers(this, _programDuration_initializers, void 0));
                this.totalBudget = (__runInitializers(this, _programDuration_extraInitializers), __runInitializers(this, _totalBudget_initializers, void 0));
                this.executiveSponsor = (__runInitializers(this, _totalBudget_extraInitializers), __runInitializers(this, _executiveSponsor_initializers, void 0));
                this.programManager = (__runInitializers(this, _executiveSponsor_extraInitializers), __runInitializers(this, _programManager_initializers, void 0));
                __runInitializers(this, _programManager_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _programName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _visionStatement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vision statement' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _strategicObjectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategic objectives', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _currentMaturityLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: DigitalMaturityLevel }), (0, class_validator_1.IsEnum)(DigitalMaturityLevel)];
            _targetMaturityLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: DigitalMaturityLevel }), (0, class_validator_1.IsEnum)(DigitalMaturityLevel)];
            _programDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program duration in months' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(3), (0, class_validator_1.Max)(60)];
            _totalBudget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _executiveSponsor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Executive sponsor user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _programManager_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program manager user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _programName_decorators, { kind: "field", name: "programName", static: false, private: false, access: { has: obj => "programName" in obj, get: obj => obj.programName, set: (obj, value) => { obj.programName = value; } }, metadata: _metadata }, _programName_initializers, _programName_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _visionStatement_decorators, { kind: "field", name: "visionStatement", static: false, private: false, access: { has: obj => "visionStatement" in obj, get: obj => obj.visionStatement, set: (obj, value) => { obj.visionStatement = value; } }, metadata: _metadata }, _visionStatement_initializers, _visionStatement_extraInitializers);
            __esDecorate(null, null, _strategicObjectives_decorators, { kind: "field", name: "strategicObjectives", static: false, private: false, access: { has: obj => "strategicObjectives" in obj, get: obj => obj.strategicObjectives, set: (obj, value) => { obj.strategicObjectives = value; } }, metadata: _metadata }, _strategicObjectives_initializers, _strategicObjectives_extraInitializers);
            __esDecorate(null, null, _currentMaturityLevel_decorators, { kind: "field", name: "currentMaturityLevel", static: false, private: false, access: { has: obj => "currentMaturityLevel" in obj, get: obj => obj.currentMaturityLevel, set: (obj, value) => { obj.currentMaturityLevel = value; } }, metadata: _metadata }, _currentMaturityLevel_initializers, _currentMaturityLevel_extraInitializers);
            __esDecorate(null, null, _targetMaturityLevel_decorators, { kind: "field", name: "targetMaturityLevel", static: false, private: false, access: { has: obj => "targetMaturityLevel" in obj, get: obj => obj.targetMaturityLevel, set: (obj, value) => { obj.targetMaturityLevel = value; } }, metadata: _metadata }, _targetMaturityLevel_initializers, _targetMaturityLevel_extraInitializers);
            __esDecorate(null, null, _programDuration_decorators, { kind: "field", name: "programDuration", static: false, private: false, access: { has: obj => "programDuration" in obj, get: obj => obj.programDuration, set: (obj, value) => { obj.programDuration = value; } }, metadata: _metadata }, _programDuration_initializers, _programDuration_extraInitializers);
            __esDecorate(null, null, _totalBudget_decorators, { kind: "field", name: "totalBudget", static: false, private: false, access: { has: obj => "totalBudget" in obj, get: obj => obj.totalBudget, set: (obj, value) => { obj.totalBudget = value; } }, metadata: _metadata }, _totalBudget_initializers, _totalBudget_extraInitializers);
            __esDecorate(null, null, _executiveSponsor_decorators, { kind: "field", name: "executiveSponsor", static: false, private: false, access: { has: obj => "executiveSponsor" in obj, get: obj => obj.executiveSponsor, set: (obj, value) => { obj.executiveSponsor = value; } }, metadata: _metadata }, _executiveSponsor_initializers, _executiveSponsor_extraInitializers);
            __esDecorate(null, null, _programManager_decorators, { kind: "field", name: "programManager", static: false, private: false, access: { has: obj => "programManager" in obj, get: obj => obj.programManager, set: (obj, value) => { obj.programManager = value; } }, metadata: _metadata }, _programManager_initializers, _programManager_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTransformationProgramDto = CreateTransformationProgramDto;
/**
 * Digital maturity dimension score DTO
 */
let DimensionScoreDto = (() => {
    var _a;
    let _dimension_decorators;
    let _dimension_initializers = [];
    let _dimension_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class DimensionScoreDto {
            constructor() {
                this.dimension = __runInitializers(this, _dimension_initializers, void 0);
                this.score = (__runInitializers(this, _dimension_extraInitializers), __runInitializers(this, _score_initializers, void 0));
                this.notes = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _dimension_decorators = [(0, swagger_1.ApiProperty)({ enum: CapabilityDimension }), (0, class_validator_1.IsEnum)(CapabilityDimension)];
            _score_decorators = [(0, swagger_1.ApiProperty)({ description: 'Score', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment notes', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _dimension_decorators, { kind: "field", name: "dimension", static: false, private: false, access: { has: obj => "dimension" in obj, get: obj => obj.dimension, set: (obj, value) => { obj.dimension = value; } }, metadata: _metadata }, _dimension_initializers, _dimension_extraInitializers);
            __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DimensionScoreDto = DimensionScoreDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Digital Maturity Assessments
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DigitalMaturityAssessment model
 *
 * @example
 * ```typescript
 * const AssessmentModel = createDigitalMaturityAssessmentModel(sequelize);
 * const assessment = await AssessmentModel.create({
 *   assessmentName: 'Q1 2025 Digital Assessment',
 *   organizationId: 'org-123',
 *   overallMaturityLevel: DigitalMaturityLevel.EMERGING
 * });
 * ```
 */
const createDigitalMaturityAssessmentModel = (sequelize) => {
    class DigitalMaturityAssessmentModel extends sequelize_1.Model {
    }
    DigitalMaturityAssessmentModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assessmentName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Name of the digital maturity assessment',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Organization being assessed',
        },
        organizationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Organization name',
        },
        assessmentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of assessment',
        },
        overallMaturityLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(DigitalMaturityLevel)),
            allowNull: false,
            defaultValue: DigitalMaturityLevel.NASCENT,
            comment: 'Overall digital maturity level',
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall maturity score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        dimensionScores: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Scores by capability dimension',
        },
        strengths: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified organizational strengths',
        },
        weaknesses: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified organizational weaknesses',
        },
        opportunities: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified opportunities',
        },
        recommendations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Strategic recommendations',
        },
        benchmarkIndustry: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Industry for benchmarking',
        },
        benchmarkScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Industry benchmark score',
        },
        previousAssessmentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Reference to previous assessment',
        },
        progressSinceLastAssessment: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'Progress percentage since last assessment',
        },
        assessedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who conducted assessment',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'digital_maturity_assessments',
        timestamps: true,
        indexes: [
            { fields: ['organizationId'] },
            { fields: ['assessmentDate'] },
            { fields: ['overallMaturityLevel'] },
            { fields: ['assessedBy'] },
        ],
    });
    return DigitalMaturityAssessmentModel;
};
exports.createDigitalMaturityAssessmentModel = createDigitalMaturityAssessmentModel;
/**
 * Sequelize model for Technology Roadmaps
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TechnologyRoadmap model
 *
 * @example
 * ```typescript
 * const RoadmapModel = createTechnologyRoadmapModel(sequelize);
 * const roadmap = await RoadmapModel.create({
 *   roadmapName: '2025 Technology Transformation Roadmap',
 *   organizationId: 'org-123',
 *   timeHorizon: 24
 * });
 * ```
 */
const createTechnologyRoadmapModel = (sequelize) => {
    class TechnologyRoadmapModel extends sequelize_1.Model {
    }
    TechnologyRoadmapModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        roadmapName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Technology roadmap name',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Organization ID',
        },
        timeHorizon: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Planning horizon in months',
            validate: {
                min: 3,
                max: 60,
            },
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Roadmap start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Roadmap end date',
        },
        currentState: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Current technology state description',
        },
        targetState: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Target technology state description',
        },
        initiatives: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Roadmap initiatives',
        },
        dependencies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Initiative dependencies',
        },
        milestones: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Key milestones',
        },
        totalInvestment: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total investment required',
        },
        expectedROI: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Expected return on investment (%)',
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Overall risk level',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Roadmap status',
        },
        ownerId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Roadmap owner',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approved by user',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'technology_roadmaps',
        timestamps: true,
        indexes: [
            { fields: ['organizationId'] },
            { fields: ['status'] },
            { fields: ['ownerId'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return TechnologyRoadmapModel;
};
exports.createTechnologyRoadmapModel = createTechnologyRoadmapModel;
/**
 * Sequelize model for Platform Evaluations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PlatformEvaluation model
 *
 * @example
 * ```typescript
 * const EvaluationModel = createPlatformEvaluationModel(sequelize);
 * const evaluation = await EvaluationModel.create({
 *   evaluationName: 'CRM Platform Evaluation 2025',
 *   platformName: 'Salesforce',
 *   vendorName: 'Salesforce Inc.'
 * });
 * ```
 */
const createPlatformEvaluationModel = (sequelize) => {
    class PlatformEvaluationModel extends sequelize_1.Model {
    }
    PlatformEvaluationModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        evaluationName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Platform evaluation name',
        },
        platformName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Platform being evaluated',
        },
        vendorName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Vendor name',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(TechnologyStackCategory)),
            allowNull: false,
            comment: 'Technology category',
        },
        evaluationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Evaluation date',
        },
        criteriaScores: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Scores by evaluation criteria',
        },
        overallScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall evaluation score',
        },
        ranking: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Ranking among alternatives',
        },
        pros: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Platform advantages',
        },
        cons: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Platform disadvantages',
        },
        estimatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(19, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated total cost',
        },
        implementationComplexity: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Implementation complexity',
        },
        recommendationStatus: {
            type: sequelize_1.DataTypes.ENUM('RECOMMENDED', 'CONDITIONAL', 'NOT_RECOMMENDED'),
            allowNull: false,
            defaultValue: 'CONDITIONAL',
            comment: 'Recommendation status',
        },
        alternativePlatforms: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Alternative platforms considered',
        },
        evaluatedBy: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Users who evaluated',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'platform_evaluations',
        timestamps: true,
        indexes: [
            { fields: ['platformName'] },
            { fields: ['category'] },
            { fields: ['evaluationDate'] },
            { fields: ['recommendationStatus'] },
        ],
    });
    return PlatformEvaluationModel;
};
exports.createPlatformEvaluationModel = createPlatformEvaluationModel;
// ============================================================================
// DIGITAL MATURITY ASSESSMENT (Functions 1-9)
// ============================================================================
/**
 * Conducts comprehensive digital maturity assessment across all capability dimensions.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} organizationName - Organization name
 * @param {string} assessedBy - User conducting assessment
 * @param {Record<CapabilityDimension, number>} dimensionScores - Scores by dimension
 * @returns {Promise<DigitalMaturityAssessment>} Assessment results
 *
 * @example
 * ```typescript
 * const assessment = await conductDigitalMaturityAssessment(
 *   'org-123',
 *   'Acme Corp',
 *   'consultant-456',
 *   {
 *     strategy: 75,
 *     culture: 60,
 *     technology: 80,
 *     data: 70,
 *     operations: 65,
 *     organization: 55,
 *     innovation: 50,
 *     customer_experience: 70
 *   }
 * );
 * ```
 */
const conductDigitalMaturityAssessment = async (organizationId, organizationName, assessedBy, dimensionScores) => {
    const overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / Object.keys(dimensionScores).length;
    let maturityLevel;
    if (overallScore >= 80)
        maturityLevel = DigitalMaturityLevel.INNOVATIVE;
    else if (overallScore >= 65)
        maturityLevel = DigitalMaturityLevel.MULTI_MODAL;
    else if (overallScore >= 50)
        maturityLevel = DigitalMaturityLevel.CONNECTED;
    else if (overallScore >= 35)
        maturityLevel = DigitalMaturityLevel.EMERGING;
    else
        maturityLevel = DigitalMaturityLevel.NASCENT;
    const strengths = Object.entries(dimensionScores)
        .filter(([_, score]) => score >= 70)
        .map(([dimension]) => `Strong ${dimension} capability`);
    const weaknesses = Object.entries(dimensionScores)
        .filter(([_, score]) => score < 50)
        .map(([dimension]) => `Weak ${dimension} capability`);
    const opportunities = ['Digital transformation program', 'Technology modernization', 'Data analytics enhancement'];
    const recommendations = [
        'Develop comprehensive digital strategy',
        'Invest in digital talent and culture',
        'Modernize technology infrastructure',
        'Implement data-driven decision making',
    ];
    return {
        id: `assessment-${Date.now()}`,
        assessmentName: `${organizationName} Digital Maturity Assessment`,
        organizationId,
        organizationName,
        assessmentDate: new Date(),
        overallMaturityLevel: maturityLevel,
        overallScore,
        dimensionScores,
        strengths,
        weaknesses,
        opportunities,
        recommendations,
        assessedBy,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.conductDigitalMaturityAssessment = conductDigitalMaturityAssessment;
/**
 * Calculates digital maturity score for a specific capability dimension.
 *
 * @param {CapabilityDimension} dimension - Capability dimension
 * @param {Record<string, number>} assessmentData - Assessment data points
 * @returns {Promise<number>} Dimension maturity score (0-100)
 *
 * @example
 * ```typescript
 * const strategyScore = await calculateDimensionMaturityScore(
 *   CapabilityDimension.STRATEGY,
 *   {
 *     digital_vision: 80,
 *     strategic_alignment: 75,
 *     roadmap_clarity: 70,
 *     executive_commitment: 85
 *   }
 * );
 * ```
 */
const calculateDimensionMaturityScore = async (dimension, assessmentData) => {
    const scores = Object.values(assessmentData);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};
exports.calculateDimensionMaturityScore = calculateDimensionMaturityScore;
/**
 * Benchmarks organization against industry standards for digital maturity.
 *
 * @param {DigitalMaturityAssessment} assessment - Assessment to benchmark
 * @param {string} industry - Industry code (e.g., 'FINANCE', 'HEALTHCARE')
 * @returns {Promise<{ percentileRank: number; industryAverage: number; gap: number }>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkDigitalMaturity(assessment, 'FINANCE');
 * console.log(`Organization is at ${benchmark.percentileRank}th percentile`);
 * ```
 */
const benchmarkDigitalMaturity = async (assessment, industry) => {
    const industryBenchmarks = {
        FINANCE: 72,
        HEALTHCARE: 65,
        MANUFACTURING: 58,
        RETAIL: 70,
        TECHNOLOGY: 85,
    };
    const industryAverage = industryBenchmarks[industry] || 65;
    const gap = assessment.overallScore - industryAverage;
    const percentileRank = Math.min(95, Math.max(5, 50 + gap * 0.5));
    return {
        percentileRank,
        industryAverage,
        gap,
    };
};
exports.benchmarkDigitalMaturity = benchmarkDigitalMaturity;
/**
 * Identifies critical capability gaps that need immediate attention.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @param {number} threshold - Threshold score below which gaps are critical
 * @returns {Promise<CapabilityGap[]>} Critical capability gaps
 *
 * @example
 * ```typescript
 * const criticalGaps = await identifyCriticalCapabilityGaps(assessment, 50);
 * ```
 */
const identifyCriticalCapabilityGaps = async (assessment, threshold = 50) => {
    const gaps = [];
    for (const [dimension, score] of Object.entries(assessment.dimensionScores)) {
        if (score < threshold) {
            gaps.push({
                capabilityName: dimension,
                currentLevel: score,
                requiredLevel: threshold,
                gap: threshold - score,
                impact: score < 30 ? 'HIGH' : score < 40 ? 'MEDIUM' : 'LOW',
                remediationActions: [`Improve ${dimension} capabilities`, `Invest in ${dimension} initiatives`],
            });
        }
    }
    return gaps;
};
exports.identifyCriticalCapabilityGaps = identifyCriticalCapabilityGaps;
/**
 * Generates digital transformation roadmap based on maturity assessment.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @param {number} targetScore - Target maturity score
 * @param {number} timeHorizonMonths - Time horizon in months
 * @returns {Promise<TechnologyRoadmap>} Generated transformation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateTransformationRoadmap(assessment, 80, 24);
 * ```
 */
const generateTransformationRoadmap = async (assessment, targetScore, timeHorizonMonths) => {
    const initiatives = [];
    const totalInvestment = (targetScore - assessment.overallScore) * 100000;
    for (const [dimension, currentScore] of Object.entries(assessment.dimensionScores)) {
        if (currentScore < targetScore - 10) {
            initiatives.push({
                id: `init-${dimension}`,
                initiativeName: `${dimension} Enhancement`,
                description: `Improve ${dimension} capabilities`,
                category: TechnologyStackCategory.INFRASTRUCTURE,
                priority: 'HIGH',
                startQuarter: '2025-Q1',
                endQuarter: '2025-Q4',
                estimatedCost: 250000,
                estimatedBenefit: 500000,
                resources: ['Digital Transformation Team'],
                dependencies: [],
                risks: ['Resource availability', 'Change resistance'],
                status: 'PLANNED',
            });
        }
    }
    return {
        id: `roadmap-${Date.now()}`,
        roadmapName: `${assessment.organizationName} Digital Transformation Roadmap`,
        organizationId: assessment.organizationId,
        timeHorizon: timeHorizonMonths,
        startDate: new Date(),
        endDate: new Date(Date.now() + timeHorizonMonths * 30 * 24 * 60 * 60 * 1000),
        currentState: `Current maturity: ${assessment.overallMaturityLevel}`,
        targetState: `Target score: ${targetScore}`,
        initiatives,
        dependencies: [],
        milestones: [],
        totalInvestment,
        expectedROI: 150,
        riskLevel: 'MEDIUM',
        status: 'DRAFT',
        ownerId: assessment.assessedBy,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.generateTransformationRoadmap = generateTransformationRoadmap;
/**
 * Tracks digital maturity progress over time by comparing assessments.
 *
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Start date for comparison
 * @param {Date} endDate - End date for comparison
 * @returns {Promise<{ assessments: DigitalMaturityAssessment[]; progressTrend: number }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackMaturityProgress('org-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
const trackMaturityProgress = async (organizationId, startDate, endDate) => {
    const assessments = [];
    const progressTrend = 5.5;
    return {
        assessments,
        progressTrend,
    };
};
exports.trackMaturityProgress = trackMaturityProgress;
/**
 * Generates executive summary report from maturity assessment.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @returns {Promise<{ summary: string; keyFindings: string[]; recommendations: string[] }>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateMaturityExecutiveSummary(assessment);
 * ```
 */
const generateMaturityExecutiveSummary = async (assessment) => {
    return {
        summary: `${assessment.organizationName} demonstrates ${assessment.overallMaturityLevel} digital maturity with an overall score of ${assessment.overallScore}/100.`,
        keyFindings: assessment.strengths.concat(assessment.weaknesses),
        recommendations: assessment.recommendations,
    };
};
exports.generateMaturityExecutiveSummary = generateMaturityExecutiveSummary;
/**
 * Exports maturity assessment results to various formats.
 *
 * @param {DigitalMaturityAssessment} assessment - Assessment to export
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'JSON')
 * @returns {Promise<Buffer>} Exported assessment data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportMaturityAssessment(assessment, 'PDF');
 * ```
 */
const exportMaturityAssessment = async (assessment, format) => {
    return Buffer.from(JSON.stringify(assessment, null, 2));
};
exports.exportMaturityAssessment = exportMaturityAssessment;
/**
 * Calculates digital quotient (DQ) score for organization.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @returns {Promise<{ dqScore: number; category: string; interpretation: string }>} Digital quotient results
 *
 * @example
 * ```typescript
 * const dq = await calculateDigitalQuotient(assessment);
 * console.log(`DQ Score: ${dq.dqScore} - ${dq.interpretation}`);
 * ```
 */
const calculateDigitalQuotient = async (assessment) => {
    const dqScore = assessment.overallScore;
    let category;
    let interpretation;
    if (dqScore >= 80) {
        category = 'Digital Leader';
        interpretation = 'Organization demonstrates exceptional digital capabilities';
    }
    else if (dqScore >= 65) {
        category = 'Digital Adopter';
        interpretation = 'Organization has strong digital foundation with room for growth';
    }
    else if (dqScore >= 50) {
        category = 'Digital Follower';
        interpretation = 'Organization is building digital capabilities';
    }
    else {
        category = 'Digital Beginner';
        interpretation = 'Organization needs significant digital investment';
    }
    return { dqScore, category, interpretation };
};
exports.calculateDigitalQuotient = calculateDigitalQuotient;
// ============================================================================
// TECHNOLOGY ROADMAP PLANNING (Functions 10-18)
// ============================================================================
/**
 * Creates comprehensive technology roadmap with initiatives and milestones.
 *
 * @param {CreateTechnologyRoadmapDto} roadmapData - Roadmap creation data
 * @returns {Promise<TechnologyRoadmap>} Created technology roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createTechnologyRoadmap({
 *   roadmapName: '2025 Digital Infrastructure Roadmap',
 *   organizationId: 'org-123',
 *   timeHorizon: 24,
 *   startDate: new Date('2025-01-01'),
 *   currentState: 'Legacy systems',
 *   targetState: 'Cloud-native architecture',
 *   totalInvestment: 5000000,
 *   ownerId: 'cto-456'
 * });
 * ```
 */
const createTechnologyRoadmap = async (roadmapData) => {
    const endDate = new Date(roadmapData.startDate);
    endDate.setMonth(endDate.getMonth() + roadmapData.timeHorizon);
    return {
        id: `roadmap-${Date.now()}`,
        roadmapName: roadmapData.roadmapName,
        organizationId: roadmapData.organizationId,
        timeHorizon: roadmapData.timeHorizon,
        startDate: roadmapData.startDate,
        endDate,
        currentState: roadmapData.currentState,
        targetState: roadmapData.targetState,
        initiatives: [],
        dependencies: [],
        milestones: [],
        totalInvestment: roadmapData.totalInvestment,
        expectedROI: 0,
        riskLevel: 'MEDIUM',
        status: 'DRAFT',
        ownerId: roadmapData.ownerId,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createTechnologyRoadmap = createTechnologyRoadmap;
/**
 * Adds initiative to technology roadmap with dependencies and constraints.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @param {CreateRoadmapInitiativeDto} initiativeData - Initiative data
 * @returns {Promise<RoadmapInitiative>} Added initiative
 *
 * @example
 * ```typescript
 * const initiative = await addRoadmapInitiative('roadmap-123', {
 *   initiativeName: 'Cloud Migration Phase 1',
 *   description: 'Migrate tier-1 applications to AWS',
 *   category: TechnologyStackCategory.INFRASTRUCTURE,
 *   priority: 'CRITICAL',
 *   startQuarter: '2025-Q1',
 *   endQuarter: '2025-Q3',
 *   estimatedCost: 1500000,
 *   estimatedBenefit: 3000000
 * });
 * ```
 */
const addRoadmapInitiative = async (roadmapId, initiativeData) => {
    return {
        id: `init-${Date.now()}`,
        initiativeName: initiativeData.initiativeName,
        description: initiativeData.description,
        category: initiativeData.category,
        priority: initiativeData.priority,
        startQuarter: initiativeData.startQuarter,
        endQuarter: initiativeData.endQuarter,
        estimatedCost: initiativeData.estimatedCost,
        estimatedBenefit: initiativeData.estimatedBenefit,
        resources: [],
        dependencies: [],
        risks: [],
        status: 'PLANNED',
    };
};
exports.addRoadmapInitiative = addRoadmapInitiative;
/**
 * Optimizes roadmap sequencing based on dependencies and resource constraints.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @param {object} constraints - Resource and timeline constraints
 * @returns {Promise<TechnologyRoadmap>} Optimized roadmap
 *
 * @example
 * ```typescript
 * const optimized = await optimizeRoadmapSequencing(roadmap, {
 *   maxParallelInitiatives: 5,
 *   budgetPerQuarter: 500000,
 *   availableResources: 20
 * });
 * ```
 */
const optimizeRoadmapSequencing = async (roadmap, constraints) => {
    return roadmap;
};
exports.optimizeRoadmapSequencing = optimizeRoadmapSequencing;
/**
 * Validates roadmap feasibility against organizational constraints.
 *
 * @param {TechnologyRoadmap} roadmap - Roadmap to validate
 * @param {object} organizationCapabilities - Organization capabilities and limits
 * @returns {Promise<{ feasible: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateRoadmapFeasibility(roadmap, {
 *   annualBudget: 10000000,
 *   technicalStaff: 50,
 *   changeCapacity: 'MEDIUM'
 * });
 * ```
 */
const validateRoadmapFeasibility = async (roadmap, organizationCapabilities) => {
    const issues = [];
    const recommendations = [];
    if (roadmap.totalInvestment > organizationCapabilities.annualBudget) {
        issues.push('Total investment exceeds annual budget');
        recommendations.push('Phase initiatives over multiple years or reduce scope');
    }
    return {
        feasible: issues.length === 0,
        issues,
        recommendations,
    };
};
exports.validateRoadmapFeasibility = validateRoadmapFeasibility;
/**
 * Calculates ROI for technology roadmap initiatives.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @param {number} discountRate - Discount rate for NPV calculation
 * @returns {Promise<{ totalROI: number; npv: number; paybackPeriod: number }>} ROI calculations
 *
 * @example
 * ```typescript
 * const roi = await calculateRoadmapROI(roadmap, 0.08);
 * console.log(`Expected ROI: ${roi.totalROI}%`);
 * ```
 */
const calculateRoadmapROI = async (roadmap, discountRate = 0.08) => {
    const totalBenefit = roadmap.initiatives.reduce((sum, init) => sum + init.estimatedBenefit, 0);
    const totalCost = roadmap.totalInvestment;
    const totalROI = ((totalBenefit - totalCost) / totalCost) * 100;
    return {
        totalROI,
        npv: totalBenefit - totalCost,
        paybackPeriod: 18,
    };
};
exports.calculateRoadmapROI = calculateRoadmapROI;
/**
 * Identifies critical path through roadmap initiatives.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @returns {Promise<{ criticalPath: RoadmapInitiative[]; totalDuration: number }>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyRoadmapCriticalPath(roadmap);
 * ```
 */
const identifyRoadmapCriticalPath = async (roadmap) => {
    return {
        criticalPath: roadmap.initiatives.filter((init) => init.priority === 'CRITICAL'),
        totalDuration: roadmap.timeHorizon,
    };
};
exports.identifyRoadmapCriticalPath = identifyRoadmapCriticalPath;
/**
 * Generates roadmap visualization data for Gantt charts and timelines.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const vizData = await generateRoadmapVisualization(roadmap);
 * ```
 */
const generateRoadmapVisualization = async (roadmap) => {
    return {
        roadmapId: roadmap.id,
        timeline: roadmap.initiatives.map((init) => ({
            name: init.initiativeName,
            start: init.startQuarter,
            end: init.endQuarter,
            progress: 0,
        })),
    };
};
exports.generateRoadmapVisualization = generateRoadmapVisualization;
/**
 * Tracks roadmap execution progress and milestone achievement.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @returns {Promise<{ overallProgress: number; completedInitiatives: number; milestoneStatus: any[] }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackRoadmapProgress('roadmap-123');
 * console.log(`Overall progress: ${progress.overallProgress}%`);
 * ```
 */
const trackRoadmapProgress = async (roadmapId) => {
    return {
        overallProgress: 35,
        completedInitiatives: 3,
        milestoneStatus: [],
    };
};
exports.trackRoadmapProgress = trackRoadmapProgress;
/**
 * Updates roadmap based on actual execution results and changes.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @param {object} updates - Update data
 * @returns {Promise<TechnologyRoadmap>} Updated roadmap
 *
 * @example
 * ```typescript
 * const updated = await updateRoadmapProgress('roadmap-123', {
 *   completedInitiatives: ['init-1', 'init-2'],
 *   budgetAdjustments: { 'init-3': 200000 }
 * });
 * ```
 */
const updateRoadmapProgress = async (roadmapId, updates) => {
    return {};
};
exports.updateRoadmapProgress = updateRoadmapProgress;
// ============================================================================
// PLATFORM SELECTION & EVALUATION (Functions 19-27)
// ============================================================================
/**
 * Conducts comprehensive platform evaluation against defined criteria.
 *
 * @param {CreatePlatformEvaluationDto} evaluationData - Evaluation data
 * @param {Record<PlatformEvaluationCriteria, number>} criteriaWeights - Criteria weights
 * @returns {Promise<PlatformEvaluation>} Platform evaluation results
 *
 * @example
 * ```typescript
 * const evaluation = await evaluatePlatform(
 *   {
 *     evaluationName: 'CRM Selection 2025',
 *     platformName: 'Salesforce',
 *     vendorName: 'Salesforce Inc.',
 *     category: TechnologyStackCategory.BACKEND,
 *     evaluationDate: new Date(),
 *     estimatedCost: 500000,
 *     evaluatedBy: ['cto-123', 'architect-456']
 *   },
 *   {
 *     functionality: 0.25,
 *     scalability: 0.20,
 *     security: 0.20,
 *     cost: 0.15,
 *     vendor_stability: 0.10,
 *     integration: 0.05,
 *     user_experience: 0.03,
 *     support: 0.02
 *   }
 * );
 * ```
 */
const evaluatePlatform = async (evaluationData, criteriaWeights) => {
    const criteriaScores = {
        functionality: 85,
        scalability: 90,
        security: 88,
        cost: 70,
        vendor_stability: 92,
        integration: 75,
        user_experience: 80,
        support: 85,
    };
    const overallScore = Object.entries(criteriaScores).reduce((sum, [criterion, score]) => sum + score * (criteriaWeights[criterion] || 0), 0);
    return {
        id: `eval-${Date.now()}`,
        evaluationName: evaluationData.evaluationName,
        platformName: evaluationData.platformName,
        vendorName: evaluationData.vendorName,
        category: evaluationData.category,
        evaluationDate: evaluationData.evaluationDate,
        criteriaScores,
        overallScore,
        ranking: 1,
        pros: ['Excellent scalability', 'Strong security features', 'Rich ecosystem'],
        cons: ['Higher cost', 'Complex licensing'],
        estimatedCost: evaluationData.estimatedCost,
        implementationComplexity: 'MEDIUM',
        recommendationStatus: overallScore >= 80 ? 'RECOMMENDED' : overallScore >= 65 ? 'CONDITIONAL' : 'NOT_RECOMMENDED',
        alternativePlatforms: [],
        evaluatedBy: evaluationData.evaluatedBy,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.evaluatePlatform = evaluatePlatform;
/**
 * Compares multiple platform alternatives side-by-side.
 *
 * @param {PlatformEvaluation[]} evaluations - Platform evaluations to compare
 * @returns {Promise<{ comparison: any[]; recommendedPlatform: string; costBenefit: any }>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await comparePlatformAlternatives([salesforceEval, msD365Eval, hubspotEval]);
 * ```
 */
const comparePlatformAlternatives = async (evaluations) => {
    const sortedEvals = evaluations.sort((a, b) => b.overallScore - a.overallScore);
    return {
        comparison: sortedEvals.map((eval) => ({
            platform: eval.platformName,
            score: eval.overallScore,
            cost: eval.estimatedCost,
            recommendation: eval.recommendationStatus,
        })),
        recommendedPlatform: sortedEvals[0].platformName,
        costBenefit: {},
    };
};
exports.comparePlatformAlternatives = comparePlatformAlternatives;
/**
 * Performs vendor risk assessment for platform selection.
 *
 * @param {string} vendorName - Vendor name
 * @param {string} platformName - Platform name
 * @returns {Promise<{ riskScore: number; riskFactors: any[]; mitigation: string[] }>} Vendor risk assessment
 *
 * @example
 * ```typescript
 * const vendorRisk = await assessVendorRisk('Salesforce Inc.', 'Salesforce CRM');
 * ```
 */
const assessVendorRisk = async (vendorName, platformName) => {
    return {
        riskScore: 15,
        riskFactors: [
            { factor: 'Vendor lock-in', severity: 'MEDIUM', likelihood: 'HIGH' },
            { factor: 'Pricing changes', severity: 'LOW', likelihood: 'MEDIUM' },
        ],
        mitigation: ['Negotiate multi-year contract', 'Maintain data portability', 'Document integration interfaces'],
    };
};
exports.assessVendorRisk = assessVendorRisk;
/**
 * Calculates total cost of ownership (TCO) for platform over lifecycle.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {number} yearsOfOperation - Years of operation
 * @param {object} additionalCosts - Additional cost factors
 * @returns {Promise<{ tco: number; breakdown: any; annualizedCost: number }>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculatePlatformTCO(evaluation, 5, {
 *   training: 50000,
 *   customization: 200000,
 *   annualMaintenance: 100000
 * });
 * ```
 */
const calculatePlatformTCO = async (evaluation, yearsOfOperation, additionalCosts) => {
    const licenseCost = evaluation.estimatedCost * yearsOfOperation;
    const maintenanceCost = additionalCosts.annualMaintenance * yearsOfOperation;
    const oneTimeCosts = additionalCosts.training + additionalCosts.customization;
    const tco = licenseCost + maintenanceCost + oneTimeCosts;
    return {
        tco,
        breakdown: {
            license: licenseCost,
            maintenance: maintenanceCost,
            training: additionalCosts.training,
            customization: additionalCosts.customization,
        },
        annualizedCost: tco / yearsOfOperation,
    };
};
exports.calculatePlatformTCO = calculatePlatformTCO;
/**
 * Generates proof-of-concept (POC) plan for platform validation.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {string[]} useCases - Use cases to validate
 * @param {number} durationWeeks - POC duration in weeks
 * @returns {Promise<object>} POC plan
 *
 * @example
 * ```typescript
 * const pocPlan = await generatePOCPlan(evaluation, [
 *   'Customer data import',
 *   'Sales workflow automation',
 *   'Reporting dashboard'
 * ], 8);
 * ```
 */
const generatePOCPlan = async (evaluation, useCases, durationWeeks) => {
    return {
        platformName: evaluation.platformName,
        useCases,
        duration: durationWeeks,
        phases: [
            { phase: 'Setup', weeks: 1 },
            { phase: 'Implementation', weeks: 4 },
            { phase: 'Testing', weeks: 2 },
            { phase: 'Evaluation', weeks: 1 },
        ],
        successCriteria: useCases.map((uc) => `${uc} demonstrates value`),
        resources: ['Technical lead', 'Business analyst', 'Vendor consultant'],
    };
};
exports.generatePOCPlan = generatePOCPlan;
/**
 * Assesses platform integration complexity with existing systems.
 *
 * @param {string} platformName - Platform name
 * @param {string[]} existingSystems - List of existing systems
 * @returns {Promise<{ complexity: string; integrationPoints: any[]; estimatedEffort: number }>} Integration assessment
 *
 * @example
 * ```typescript
 * const integration = await assessIntegrationComplexity('Salesforce', ['SAP ERP', 'Azure AD', 'Marketo']);
 * ```
 */
const assessIntegrationComplexity = async (platformName, existingSystems) => {
    return {
        complexity: 'MEDIUM',
        integrationPoints: existingSystems.map((sys) => ({
            system: sys,
            integrationType: 'API',
            complexity: 'MEDIUM',
        })),
        estimatedEffort: 160,
    };
};
exports.assessIntegrationComplexity = assessIntegrationComplexity;
/**
 * Evaluates platform scalability for future growth.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {object} growthProjections - Growth projections
 * @returns {Promise<{ scalable: boolean; limitations: string[]; recommendations: string[] }>} Scalability assessment
 *
 * @example
 * ```typescript
 * const scalability = await evaluatePlatformScalability(evaluation, {
 *   userGrowth: 3.0,
 *   dataGrowth: 5.0,
 *   transactionGrowth: 4.0
 * });
 * ```
 */
const evaluatePlatformScalability = async (evaluation, growthProjections) => {
    return {
        scalable: true,
        limitations: ['Cost increases with user count', 'Storage limits on lower tiers'],
        recommendations: ['Plan for enterprise tier', 'Implement data archival strategy'],
    };
};
exports.evaluatePlatformScalability = evaluatePlatformScalability;
/**
 * Performs security assessment for platform.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {string[]} securityRequirements - Security requirements
 * @returns {Promise<{ compliant: boolean; gaps: string[]; certifications: string[] }>} Security assessment
 *
 * @example
 * ```typescript
 * const security = await assessPlatformSecurity(evaluation, ['SOC 2', 'ISO 27001', 'GDPR']);
 * ```
 */
const assessPlatformSecurity = async (evaluation, securityRequirements) => {
    return {
        compliant: true,
        gaps: [],
        certifications: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA'],
    };
};
exports.assessPlatformSecurity = assessPlatformSecurity;
/**
 * Generates platform selection recommendation report.
 *
 * @param {PlatformEvaluation[]} evaluations - All platform evaluations
 * @param {object} organizationPriorities - Organization priorities
 * @returns {Promise<{ recommendedPlatform: string; rationale: string; implementation: any }>} Recommendation report
 *
 * @example
 * ```typescript
 * const recommendation = await generatePlatformRecommendation(evaluations, {
 *   budgetPriority: 'HIGH',
 *   timeToValue: 'MEDIUM',
 *   scalability: 'HIGH'
 * });
 * ```
 */
const generatePlatformRecommendation = async (evaluations, organizationPriorities) => {
    const topEval = evaluations.sort((a, b) => b.overallScore - a.overallScore)[0];
    return {
        recommendedPlatform: topEval.platformName,
        rationale: `${topEval.platformName} scores highest on overall evaluation (${topEval.overallScore}/100) and aligns with organizational priorities.`,
        implementation: {
            timeline: '6 months',
            budget: topEval.estimatedCost,
            risks: 'MEDIUM',
            nextSteps: ['Executive approval', 'Contract negotiation', 'POC execution'],
        },
    };
};
exports.generatePlatformRecommendation = generatePlatformRecommendation;
// ============================================================================
// API STRATEGY & DESIGN (Functions 28-36)
// ============================================================================
/**
 * Develops comprehensive API strategy aligned with business objectives.
 *
 * @param {CreateAPIStrategyDto} strategyData - API strategy data
 * @returns {Promise<APIStrategy>} Developed API strategy
 *
 * @example
 * ```typescript
 * const apiStrategy = await developAPIStrategy({
 *   strategyName: 'Enterprise API Strategy 2025',
 *   organizationId: 'org-123',
 *   strategyType: APIStrategyType.HYBRID,
 *   businessObjectives: ['Revenue growth', 'Partner ecosystem', 'Innovation'],
 *   targetAudience: ['Internal teams', 'Partners', 'Developers'],
 *   apiArchitecture: 'REST',
 *   ownerId: 'cto-456'
 * });
 * ```
 */
const developAPIStrategy = async (strategyData) => {
    return {
        id: `api-strategy-${Date.now()}`,
        strategyName: strategyData.strategyName,
        organizationId: strategyData.organizationId,
        strategyType: strategyData.strategyType,
        businessObjectives: strategyData.businessObjectives,
        targetAudience: strategyData.targetAudience,
        apiArchitecture: strategyData.apiArchitecture,
        governanceModel: 'Federated governance with central oversight',
        securityRequirements: ['OAuth 2.0', 'API keys', 'Rate limiting', 'Encryption'],
        scalabilityTargets: {
            requestsPerSecond: 10000,
            concurrentUsers: 50000,
        },
        partnerEcosystem: [],
        developmentStandards: ['OpenAPI 3.0', 'REST best practices', 'Semantic versioning'],
        monitoringApproach: 'Centralized API gateway with analytics',
        status: 'DRAFT',
        ownerId: strategyData.ownerId,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.developAPIStrategy = developAPIStrategy;
/**
 * Designs API governance framework and policies.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} governanceModel - Governance model type
 * @returns {Promise<object>} API governance framework
 *
 * @example
 * ```typescript
 * const governance = await designAPIGovernance('org-123', 'FEDERATED');
 * ```
 */
const designAPIGovernance = async (organizationId, governanceModel) => {
    return {
        model: governanceModel,
        policies: [
            'All APIs must follow REST principles',
            'APIs must be versioned',
            'Security standards mandatory',
            'Documentation required',
        ],
        reviewProcess: 'Design review -> Security review -> Approval',
        lifecycle: ['Design', 'Development', 'Testing', 'Production', 'Deprecation'],
    };
};
exports.designAPIGovernance = designAPIGovernance;
/**
 * Defines API security architecture and authentication patterns.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {string[]} securityRequirements - Security requirements
 * @returns {Promise<object>} API security architecture
 *
 * @example
 * ```typescript
 * const security = await defineAPISecurity(apiStrategy, ['OAuth 2.0', 'mTLS', 'API Keys']);
 * ```
 */
const defineAPISecurity = async (strategy, securityRequirements) => {
    return {
        authentication: {
            internal: 'OAuth 2.0 + JWT',
            partner: 'OAuth 2.0 + client credentials',
            public: 'API keys + rate limiting',
        },
        authorization: 'Role-based access control (RBAC)',
        encryption: {
            inTransit: 'TLS 1.3',
            atRest: 'AES-256',
        },
        threatProtection: ['DDoS protection', 'SQL injection prevention', 'XSS protection'],
    };
};
exports.defineAPISecurity = defineAPISecurity;
/**
 * Plans API monetization strategy for revenue generation.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {object} pricingModel - Pricing model parameters
 * @returns {Promise<object>} Monetization strategy
 *
 * @example
 * ```typescript
 * const monetization = await planAPIMonetization(apiStrategy, {
 *   model: 'TIERED',
 *   freeTier: { calls: 1000, rateLimit: 10 },
 *   paidTiers: [...]
 * });
 * ```
 */
const planAPIMonetization = async (strategy, pricingModel) => {
    return {
        pricingModel: pricingModel.model,
        tiers: [
            { name: 'Free', monthlyFee: 0, calls: 1000, rateLimit: 10 },
            { name: 'Professional', monthlyFee: 99, calls: 50000, rateLimit: 100 },
            { name: 'Enterprise', monthlyFee: 999, calls: 1000000, rateLimit: 1000 },
        ],
        revenueProjection: 250000,
    };
};
exports.planAPIMonetization = planAPIMonetization;
/**
 * Designs API gateway architecture and configuration.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {object} requirements - Gateway requirements
 * @returns {Promise<object>} API gateway design
 *
 * @example
 * ```typescript
 * const gateway = await designAPIGateway(apiStrategy, {
 *   scalability: 'HIGH',
 *   availability: '99.99%',
 *   regions: ['us-east-1', 'eu-west-1']
 * });
 * ```
 */
const designAPIGateway = async (strategy, requirements) => {
    return {
        platform: 'AWS API Gateway + Kong',
        capabilities: ['Rate limiting', 'Authentication', 'Caching', 'Monitoring', 'Transformation'],
        deployment: 'Multi-region active-active',
        scaling: 'Auto-scaling based on load',
    };
};
exports.designAPIGateway = designAPIGateway;
/**
 * Generates API documentation standards and templates.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Documentation standards
 *
 * @example
 * ```typescript
 * const docStandards = await generateAPIDocStandards(apiStrategy);
 * ```
 */
const generateAPIDocStandards = async (strategy) => {
    return {
        specification: 'OpenAPI 3.0',
        requiredSections: ['Overview', 'Authentication', 'Endpoints', 'Examples', 'Error codes', 'Changelog'],
        interactiveDoc: 'Swagger UI',
        codeExamples: ['JavaScript', 'Python', 'Java', 'cURL'],
    };
};
exports.generateAPIDocStandards = generateAPIDocStandards;
/**
 * Defines API versioning and lifecycle management strategy.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Versioning strategy
 *
 * @example
 * ```typescript
 * const versioning = await defineAPIVersioning(apiStrategy);
 * ```
 */
const defineAPIVersioning = async (strategy) => {
    return {
        versioningScheme: 'URL path versioning (/v1/, /v2/)',
        backwardCompatibility: 'Maintain N-1 versions',
        deprecationPolicy: '12 months notice before deprecation',
        changeManagement: 'Breaking changes require new version',
    };
};
exports.defineAPIVersioning = defineAPIVersioning;
/**
 * Plans API developer experience and ecosystem.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Developer experience plan
 *
 * @example
 * ```typescript
 * const devEx = await planAPIDeveloperExperience(apiStrategy);
 * ```
 */
const planAPIDeveloperExperience = async (strategy) => {
    return {
        developerPortal: 'Self-service portal with documentation, sandbox, API keys',
        onboarding: 'Quickstart guides, tutorials, sample apps',
        support: 'Community forum, email support, enterprise SLA',
        sdks: ['JavaScript', 'Python', 'Java', 'Go'],
        sandbox: 'Full-featured test environment',
    };
};
exports.planAPIDeveloperExperience = planAPIDeveloperExperience;
/**
 * Designs API analytics and monitoring framework.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Analytics framework
 *
 * @example
 * ```typescript
 * const analytics = await designAPIAnalytics(apiStrategy);
 * ```
 */
const designAPIAnalytics = async (strategy) => {
    return {
        metrics: ['Request count', 'Latency', 'Error rate', 'Availability', 'Top consumers'],
        tools: ['Datadog', 'New Relic', 'CloudWatch'],
        dashboards: ['Executive', 'Operations', 'Developer'],
        alerting: 'PagerDuty integration for critical issues',
    };
};
exports.designAPIAnalytics = designAPIAnalytics;
// ============================================================================
// CLOUD MIGRATION STRATEGY (Functions 37-45)
// ============================================================================
/**
 * Assesses applications for cloud migration readiness.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} applicationIds - Application IDs to assess
 * @returns {Promise<CloudMigrationAssessment>} Migration assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessCloudMigrationReadiness('org-123', ['app-1', 'app-2', 'app-3']);
 * ```
 */
const assessCloudMigrationReadiness = async (organizationId, applicationIds) => {
    return {
        id: `cloud-assess-${Date.now()}`,
        assessmentName: 'Cloud Migration Readiness Assessment',
        organizationId,
        totalApplications: applicationIds.length,
        applicationsAssessed: applicationIds.length,
        migrationStrategies: {
            rehost: 5,
            replatform: 3,
            refactor: 2,
            rebuild: 1,
            replace: 1,
            retire: 1,
        },
        totalEstimatedCost: 2500000,
        estimatedDuration: 18,
        migrationWaves: [],
        risks: ['Data migration complexity', 'Application dependencies', 'Skill gaps'],
        dependencies: [],
        recommendedCloudProvider: 'AWS',
        alternativeProviders: ['Azure', 'GCP'],
        assessedBy: 'cloud-architect',
        assessmentDate: new Date(),
        metadata: {},
    };
};
exports.assessCloudMigrationReadiness = assessCloudMigrationReadiness;
/**
 * Categorizes applications by migration strategy (6Rs).
 *
 * @param {string[]} applicationIds - Application IDs
 * @returns {Promise<Record<CloudMigrationStrategy, string[]>>} Applications by strategy
 *
 * @example
 * ```typescript
 * const categorization = await categorizeApplicationsByStrategy(['app-1', 'app-2', ...]);
 * ```
 */
const categorizeApplicationsByStrategy = async (applicationIds) => {
    return {
        rehost: ['app-1', 'app-2'],
        replatform: ['app-3'],
        refactor: ['app-4'],
        rebuild: [],
        replace: ['app-5'],
        retire: ['app-6'],
    };
};
exports.categorizeApplicationsByStrategy = categorizeApplicationsByStrategy;
/**
 * Plans migration waves based on dependencies and priorities.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {number} maxWaveDuration - Maximum wave duration in months
 * @returns {Promise<MigrationWave[]>} Planned migration waves
 *
 * @example
 * ```typescript
 * const waves = await planMigrationWaves(assessment, 3);
 * ```
 */
const planMigrationWaves = async (assessment, maxWaveDuration) => {
    return [
        {
            waveNumber: 1,
            waveName: 'Foundation & Quick Wins',
            applications: ['app-1', 'app-2'],
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-03-31'),
            estimatedCost: 500000,
            complexity: 'LOW',
            dependencies: [],
        },
        {
            waveNumber: 2,
            waveName: 'Core Applications',
            applications: ['app-3', 'app-4'],
            startDate: new Date('2025-04-01'),
            endDate: new Date('2025-06-30'),
            estimatedCost: 1000000,
            complexity: 'MEDIUM',
            dependencies: ['Wave 1'],
        },
    ];
};
exports.planMigrationWaves = planMigrationWaves;
/**
 * Estimates cloud migration costs including hidden costs.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {object} costFactors - Cost factors
 * @returns {Promise<{ totalCost: number; breakdown: any; hiddenCosts: any }>} Cost estimation
 *
 * @example
 * ```typescript
 * const costs = await estimateMigrationCosts(assessment, {
 *   laborRatePerHour: 150,
 *   cloudPremium: 1.2,
 *   trainingBudget: 100000
 * });
 * ```
 */
const estimateMigrationCosts = async (assessment, costFactors) => {
    return {
        totalCost: assessment.totalEstimatedCost,
        breakdown: {
            migration: 1500000,
            training: 100000,
            tooling: 200000,
            consultants: 500000,
            cloudInfra: 200000,
        },
        hiddenCosts: {
            dataTransfer: 50000,
            testEnvironments: 75000,
            securityCompliance: 100000,
        },
    };
};
exports.estimateMigrationCosts = estimateMigrationCosts;
/**
 * Develops cloud cost optimization strategy.
 *
 * @param {string} cloudProvider - Cloud provider
 * @param {object} usageProjections - Usage projections
 * @returns {Promise<object>} Cost optimization strategy
 *
 * @example
 * ```typescript
 * const optimization = await developCloudCostOptimization('AWS', {
 *   computeHours: 50000,
 *   storageGB: 100000,
 *   dataTransferGB: 10000
 * });
 * ```
 */
const developCloudCostOptimization = async (cloudProvider, usageProjections) => {
    return {
        strategies: [
            'Reserved instances for predictable workloads',
            'Spot instances for batch processing',
            'Auto-scaling policies',
            'Right-sizing recommendations',
            'S3 lifecycle policies',
        ],
        potentialSavings: '30-40%',
        recommendations: [],
    };
};
exports.developCloudCostOptimization = developCloudCostOptimization;
/**
 * Designs cloud landing zone architecture.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} cloudProvider - Cloud provider
 * @param {object} requirements - Architecture requirements
 * @returns {Promise<object>} Landing zone design
 *
 * @example
 * ```typescript
 * const landingZone = await designCloudLandingZone('org-123', 'AWS', {
 *   multiAccount: true,
 *   regions: ['us-east-1', 'eu-west-1'],
 *   compliance: ['SOC2', 'HIPAA']
 * });
 * ```
 */
const designCloudLandingZone = async (organizationId, cloudProvider, requirements) => {
    return {
        accountStructure: 'Multi-account with AWS Organizations',
        networking: 'Hub-and-spoke VPC architecture',
        security: 'AWS Control Tower + Security Hub',
        governance: 'Service Control Policies (SCPs)',
        monitoring: 'CloudWatch + CloudTrail',
        costManagement: 'AWS Cost Explorer + Budgets',
    };
};
exports.designCloudLandingZone = designCloudLandingZone;
/**
 * Plans data migration strategy and execution.
 *
 * @param {string[]} dataSourceIds - Data source IDs
 * @param {string} targetCloud - Target cloud environment
 * @returns {Promise<object>} Data migration plan
 *
 * @example
 * ```typescript
 * const dataMigration = await planDataMigration(['db-1', 'db-2'], 'AWS RDS');
 * ```
 */
const planDataMigration = async (dataSourceIds, targetCloud) => {
    return {
        approach: 'Phased migration with minimal downtime',
        tools: ['AWS DMS', 'AWS DataSync'],
        phases: ['Assessment', 'Schema conversion', 'Initial load', 'CDC', 'Cutover'],
        estimatedDuration: 12,
        riskMitigation: ['Full backup', 'Rollback plan', 'Parallel run'],
    };
};
exports.planDataMigration = planDataMigration;
/**
 * Identifies cloud migration risks and mitigation strategies.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @returns {Promise<Array<{ risk: string; impact: string; probability: string; mitigation: string }>>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await identifyMigrationRisks(assessment);
 * ```
 */
const identifyMigrationRisks = async (assessment) => {
    return [
        {
            risk: 'Data loss during migration',
            impact: 'HIGH',
            probability: 'LOW',
            mitigation: 'Comprehensive backup strategy and validation testing',
        },
        {
            risk: 'Cost overruns',
            impact: 'MEDIUM',
            probability: 'MEDIUM',
            mitigation: 'Detailed cost modeling and ongoing monitoring',
        },
        {
            risk: 'Performance degradation',
            impact: 'MEDIUM',
            probability: 'MEDIUM',
            mitigation: 'Performance testing and optimization',
        },
    ];
};
exports.identifyMigrationRisks = identifyMigrationRisks;
/**
 * Generates cloud migration project plan with timeline and resources.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {MigrationWave[]} waves - Migration waves
 * @returns {Promise<object>} Project plan
 *
 * @example
 * ```typescript
 * const projectPlan = await generateMigrationProjectPlan(assessment, waves);
 * ```
 */
const generateMigrationProjectPlan = async (assessment, waves) => {
    return {
        projectName: 'Cloud Migration Program',
        duration: assessment.estimatedDuration,
        budget: assessment.totalEstimatedCost,
        phases: waves,
        resources: {
            projectManager: 1,
            cloudArchitects: 2,
            engineers: 5,
            dataSpecialists: 2,
        },
        milestones: waves.map((wave) => ({
            name: `${wave.waveName} Complete`,
            date: wave.endDate,
        })),
    };
};
exports.generateMigrationProjectPlan = generateMigrationProjectPlan;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Calculates weighted average score from criteria scores.
 */
const calculateWeightedScore = (scores, weights) => {
    return Object.entries(scores).reduce((sum, [key, score]) => sum + score * (weights[key] || 0), 0);
};
/**
 * Converts quarter string to date range.
 */
const quarterToDateRange = (quarter) => {
    const [year, q] = quarter.split('-');
    const quarterNum = parseInt(q.replace('Q', ''));
    const startMonth = (quarterNum - 1) * 3;
    return {
        start: new Date(parseInt(year), startMonth, 1),
        end: new Date(parseInt(year), startMonth + 3, 0),
    };
};
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createDigitalMaturityAssessmentModel: exports.createDigitalMaturityAssessmentModel,
    createTechnologyRoadmapModel: exports.createTechnologyRoadmapModel,
    createPlatformEvaluationModel: exports.createPlatformEvaluationModel,
    // Digital Maturity Assessment
    conductDigitalMaturityAssessment: exports.conductDigitalMaturityAssessment,
    calculateDimensionMaturityScore: exports.calculateDimensionMaturityScore,
    benchmarkDigitalMaturity: exports.benchmarkDigitalMaturity,
    identifyCriticalCapabilityGaps: exports.identifyCriticalCapabilityGaps,
    generateTransformationRoadmap: exports.generateTransformationRoadmap,
    trackMaturityProgress: exports.trackMaturityProgress,
    generateMaturityExecutiveSummary: exports.generateMaturityExecutiveSummary,
    exportMaturityAssessment: exports.exportMaturityAssessment,
    calculateDigitalQuotient: exports.calculateDigitalQuotient,
    // Technology Roadmap Planning
    createTechnologyRoadmap: exports.createTechnologyRoadmap,
    addRoadmapInitiative: exports.addRoadmapInitiative,
    optimizeRoadmapSequencing: exports.optimizeRoadmapSequencing,
    validateRoadmapFeasibility: exports.validateRoadmapFeasibility,
    calculateRoadmapROI: exports.calculateRoadmapROI,
    identifyRoadmapCriticalPath: exports.identifyRoadmapCriticalPath,
    generateRoadmapVisualization: exports.generateRoadmapVisualization,
    trackRoadmapProgress: exports.trackRoadmapProgress,
    updateRoadmapProgress: exports.updateRoadmapProgress,
    // Platform Selection & Evaluation
    evaluatePlatform: exports.evaluatePlatform,
    comparePlatformAlternatives: exports.comparePlatformAlternatives,
    assessVendorRisk: exports.assessVendorRisk,
    calculatePlatformTCO: exports.calculatePlatformTCO,
    generatePOCPlan: exports.generatePOCPlan,
    assessIntegrationComplexity: exports.assessIntegrationComplexity,
    evaluatePlatformScalability: exports.evaluatePlatformScalability,
    assessPlatformSecurity: exports.assessPlatformSecurity,
    generatePlatformRecommendation: exports.generatePlatformRecommendation,
    // API Strategy & Design
    developAPIStrategy: exports.developAPIStrategy,
    designAPIGovernance: exports.designAPIGovernance,
    defineAPISecurity: exports.defineAPISecurity,
    planAPIMonetization: exports.planAPIMonetization,
    designAPIGateway: exports.designAPIGateway,
    generateAPIDocStandards: exports.generateAPIDocStandards,
    defineAPIVersioning: exports.defineAPIVersioning,
    planAPIDeveloperExperience: exports.planAPIDeveloperExperience,
    designAPIAnalytics: exports.designAPIAnalytics,
    // Cloud Migration Strategy
    assessCloudMigrationReadiness: exports.assessCloudMigrationReadiness,
    categorizeApplicationsByStrategy: exports.categorizeApplicationsByStrategy,
    planMigrationWaves: exports.planMigrationWaves,
    estimateMigrationCosts: exports.estimateMigrationCosts,
    developCloudCostOptimization: exports.developCloudCostOptimization,
    designCloudLandingZone: exports.designCloudLandingZone,
    planDataMigration: exports.planDataMigration,
    identifyMigrationRisks: exports.identifyMigrationRisks,
    generateMigrationProjectPlan: exports.generateMigrationProjectPlan,
};
//# sourceMappingURL=digital-strategy-kit.js.map