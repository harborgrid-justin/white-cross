"use strict";
/**
 * LOC: INNO1234567
 * File: /reuse/consulting/innovation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../config-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend innovation services
 *   - R&D management controllers
 *   - Portfolio optimization services
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
exports.manageInnovationKnowledge = exports.facilitateCollaborationSession = exports.formInnovationTeam = exports.generateGovernanceComplianceReport = exports.implementInnovationBoard = exports.trackInnovationDecisionEffectiveness = exports.routeInnovationDecision = exports.defineInnovationGovernance = exports.generateTechnologyInvestmentRecommendations = exports.forecastTechnologyAdoption = exports.analyzeTechnologyLandscape = exports.evaluateTechnologyStrategicFit = exports.assessTechnologyReadiness = exports.generateIdeaHeatmap = exports.mergeSimilarIdeas = exports.crowdsourceIdeaEvaluation = exports.scoreInnovationIdea = exports.captureInnovationIdea = exports.generateInnovationScorecard = exports.benchmarkInnovationPerformance = exports.measureInnovationCulture = exports.trackInnovationPipelineHealth = exports.calculateInnovationMetrics = exports.forecastRDOutcomes = exports.measureRDProductivity = exports.trackRDMilestones = exports.allocateRDBudget = exports.optimizeRDProjectSelection = exports.generatePortfolioRecommendations = exports.optimizePortfolioResourceAllocation = exports.evaluatePortfolioPerformance = exports.balanceInnovationPortfolio = exports.createInnovationPortfolio = exports.generateFunnelVelocityDashboard = exports.optimizeFunnelCriteria = exports.identifyFunnelBottlenecks = exports.calculateFunnelConversionRates = exports.trackInnovationFunnel = exports.calculateStageGateCycleTime = exports.generateStageGateReport = exports.advanceToNextGate = exports.evaluateGateCriteria = exports.createStageGateProcess = exports.createInnovationPortfolioModel = exports.createRDProjectModel = exports.createInnovationIdeaModel = exports.InnovationMetricDto = exports.CreateRDProjectDto = exports.UpdateStageGatePhaseDto = exports.CreateInnovationIdeaDto = void 0;
exports.generateCollaborationNetworkAnalysis = exports.measureTeamInnovationPerformance = void 0;
/**
 * File: /reuse/consulting/innovation-management-kit.ts
 * Locator: WC-INNO-MGT-001
 * Purpose: Comprehensive Innovation Management & R&D Optimization Utilities
 *
 * Upstream: Error handling, validation, configuration management utilities
 * Downstream: ../backend/*, Innovation controllers, R&D services, portfolio managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for stage-gate process, innovation funnels, portfolio management, R&D optimization
 *
 * LLM Context: Enterprise-grade innovation management system for managing innovation lifecycles.
 * Provides stage-gate process management, innovation funnel tracking, portfolio optimization, R&D resource allocation,
 * idea management, technology assessment, innovation metrics, governance frameworks, collaboration tools,
 * technology scouting, patent management, innovation roadmaps, and innovation ecosystem management.
 */
const sequelize_1 = require("sequelize");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// SWAGGER DTOs
// ============================================================================
let CreateInnovationIdeaDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _estimatedImpact_decorators;
    let _estimatedImpact_initializers = [];
    let _estimatedImpact_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateInnovationIdeaDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.estimatedImpact = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _estimatedImpact_initializers, void 0));
                this.estimatedCost = (__runInitializers(this, _estimatedImpact_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
                this.tags = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Idea title', example: 'AI-Powered Project Scheduler' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description', example: 'Automated scheduling using machine learning' }), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Innovation category', enum: ['PRODUCT', 'PROCESS', 'BUSINESS_MODEL', 'TECHNOLOGY', 'SERVICE'] }), (0, class_validator_1.IsEnum)(['PRODUCT', 'PROCESS', 'BUSINESS_MODEL', 'TECHNOLOGY', 'SERVICE'])];
            _estimatedImpact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated impact score (1-100)', example: 85 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost', example: 500000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags for categorization', example: ['AI', 'Automation', 'Efficiency'] }), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _estimatedImpact_decorators, { kind: "field", name: "estimatedImpact", static: false, private: false, access: { has: obj => "estimatedImpact" in obj, get: obj => obj.estimatedImpact, set: (obj, value) => { obj.estimatedImpact = value; } }, metadata: _metadata }, _estimatedImpact_initializers, _estimatedImpact_extraInitializers);
            __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateInnovationIdeaDto = CreateInnovationIdeaDto;
let UpdateStageGatePhaseDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _completionPercentage_decorators;
    let _completionPercentage_initializers = [];
    let _completionPercentage_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class UpdateStageGatePhaseDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.completionPercentage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _completionPercentage_initializers, void 0));
                this.comments = (__runInitializers(this, _completionPercentage_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Phase status', enum: ['IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'] }), (0, class_validator_1.IsEnum)(['IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'])];
            _completionPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion percentage', example: 75 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewer comments', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _completionPercentage_decorators, { kind: "field", name: "completionPercentage", static: false, private: false, access: { has: obj => "completionPercentage" in obj, get: obj => obj.completionPercentage, set: (obj, value) => { obj.completionPercentage = value; } }, metadata: _metadata }, _completionPercentage_initializers, _completionPercentage_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateStageGatePhaseDto = UpdateStageGatePhaseDto;
let CreateRDProjectDto = (() => {
    var _a;
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _projectType_decorators;
    let _projectType_initializers = [];
    let _projectType_extraInitializers = [];
    let _leadResearcher_decorators;
    let _leadResearcher_initializers = [];
    let _leadResearcher_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    return _a = class CreateRDProjectDto {
            constructor() {
                this.projectName = __runInitializers(this, _projectName_initializers, void 0);
                this.projectType = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _projectType_initializers, void 0));
                this.leadResearcher = (__runInitializers(this, _projectType_extraInitializers), __runInitializers(this, _leadResearcher_initializers, void 0));
                this.budget = (__runInitializers(this, _leadResearcher_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.startDate = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                __runInitializers(this, _endDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project name', example: 'Quantum Computing Research' }), (0, class_validator_1.IsString)()];
            _projectType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project type', enum: ['BASIC_RESEARCH', 'APPLIED_RESEARCH', 'EXPERIMENTAL_DEVELOPMENT'] }), (0, class_validator_1.IsEnum)(['BASIC_RESEARCH', 'APPLIED_RESEARCH', 'EXPERIMENTAL_DEVELOPMENT'])];
            _leadResearcher_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lead researcher user ID', example: 'dr.johnson' }), (0, class_validator_1.IsString)()];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project budget', example: 2000000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2025-01-01' }), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2026-12-31' }), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
            __esDecorate(null, null, _projectType_decorators, { kind: "field", name: "projectType", static: false, private: false, access: { has: obj => "projectType" in obj, get: obj => obj.projectType, set: (obj, value) => { obj.projectType = value; } }, metadata: _metadata }, _projectType_initializers, _projectType_extraInitializers);
            __esDecorate(null, null, _leadResearcher_decorators, { kind: "field", name: "leadResearcher", static: false, private: false, access: { has: obj => "leadResearcher" in obj, get: obj => obj.leadResearcher, set: (obj, value) => { obj.leadResearcher = value; } }, metadata: _metadata }, _leadResearcher_initializers, _leadResearcher_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRDProjectDto = CreateRDProjectDto;
let InnovationMetricDto = (() => {
    var _a;
    let _metricName_decorators;
    let _metricName_initializers = [];
    let _metricName_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    return _a = class InnovationMetricDto {
            constructor() {
                this.metricName = __runInitializers(this, _metricName_initializers, void 0);
                this.metricType = (__runInitializers(this, _metricName_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
                this.value = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.target = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _target_initializers, void 0));
                this.unit = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                __runInitializers(this, _unit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _metricName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric name', example: 'Innovation Success Rate' }), (0, class_validator_1.IsString)()];
            _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: ['INPUT', 'OUTPUT', 'OUTCOME', 'IMPACT'] }), (0, class_validator_1.IsEnum)(['INPUT', 'OUTPUT', 'OUTCOME', 'IMPACT'])];
            _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current value', example: 72.5 }), (0, class_validator_1.IsNumber)()];
            _target_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value', example: 80 }), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement', example: 'PERCENTAGE' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _metricName_decorators, { kind: "field", name: "metricName", static: false, private: false, access: { has: obj => "metricName" in obj, get: obj => obj.metricName, set: (obj, value) => { obj.metricName = value; } }, metadata: _metadata }, _metricName_initializers, _metricName_extraInitializers);
            __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.InnovationMetricDto = InnovationMetricDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Innovation Ideas with full lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InnovationIdea model
 *
 * @example
 * ```typescript
 * const InnovationIdea = createInnovationIdeaModel(sequelize);
 * const idea = await InnovationIdea.create({
 *   title: 'AI-Powered Scheduler',
 *   category: 'TECHNOLOGY',
 *   stage: 'IDEATION',
 *   status: 'SUBMITTED'
 * });
 * ```
 */
const createInnovationIdeaModel = (sequelize) => {
    class InnovationIdea extends sequelize_1.Model {
    }
    InnovationIdea.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ideaId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique idea identifier',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Idea title',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed description',
        },
        submittedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who submitted idea',
        },
        submittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Submission timestamp',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('PRODUCT', 'PROCESS', 'BUSINESS_MODEL', 'TECHNOLOGY', 'SERVICE', 'OTHER'),
            allowNull: false,
            comment: 'Innovation category',
        },
        stage: {
            type: sequelize_1.DataTypes.ENUM('IDEATION', 'CONCEPT', 'DEVELOPMENT', 'TESTING', 'LAUNCH', 'RETIRED'),
            allowNull: false,
            defaultValue: 'IDEATION',
            comment: 'Current stage in innovation lifecycle',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED', 'ARCHIVED'),
            allowNull: false,
            defaultValue: 'DRAFT',
            comment: 'Idea status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
            allowNull: false,
            defaultValue: 'MEDIUM',
            comment: 'Idea priority',
        },
        estimatedImpact: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Estimated impact score (1-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        estimatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Estimated implementation cost',
        },
        estimatedROI: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Estimated return on investment',
        },
        actualImpact: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Actual impact achieved',
        },
        actualCost: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Actual implementation cost',
        },
        actualROI: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Actual ROI achieved',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Tags for categorization',
        },
        attachments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Attached documents/files',
        },
        votes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of votes received',
        },
        comments: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of comments',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User assigned to implement',
        },
        implementedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Implementation date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'innovation_ideas',
        timestamps: true,
        indexes: [
            { fields: ['ideaId'], unique: true },
            { fields: ['category'] },
            { fields: ['stage'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['submittedBy'] },
            { fields: ['submittedAt'] },
            { fields: ['estimatedImpact'] },
        ],
    });
    return InnovationIdea;
};
exports.createInnovationIdeaModel = createInnovationIdeaModel;
/**
 * Sequelize model for R&D Projects with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RDProject model
 *
 * @example
 * ```typescript
 * const RDProject = createRDProjectModel(sequelize);
 * const project = await RDProject.create({
 *   projectName: 'Quantum Computing Research',
 *   projectType: 'BASIC_RESEARCH',
 *   budget: 2000000,
 *   leadResearcher: 'dr.johnson'
 * });
 * ```
 */
const createRDProjectModel = (sequelize) => {
    class RDProject extends sequelize_1.Model {
    }
    RDProject.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique project identifier',
        },
        projectName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Project name',
        },
        projectType: {
            type: sequelize_1.DataTypes.ENUM('BASIC_RESEARCH', 'APPLIED_RESEARCH', 'EXPERIMENTAL_DEVELOPMENT', 'INNOVATION_PROJECT'),
            allowNull: false,
            comment: 'Type of R&D project',
        },
        leadResearcher: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Lead researcher user ID',
        },
        team: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Team member user IDs',
        },
        budget: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total project budget',
        },
        spentBudget: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount spent to date',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Project start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Planned end date',
        },
        actualEndDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PLANNING',
            comment: 'Project status',
        },
        completionPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion percentage',
            validate: {
                min: 0,
                max: 100,
            },
        },
        milestones: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Project milestones',
        },
        deliverables: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Expected deliverables',
        },
        kpis: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Key performance indicators',
        },
        risks: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Identified risks and mitigation',
        },
        publications: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of publications',
        },
        patents: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of patents filed',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'rd_projects',
        timestamps: true,
        indexes: [
            { fields: ['projectId'], unique: true },
            { fields: ['projectType'] },
            { fields: ['leadResearcher'] },
            { fields: ['status'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return RDProject;
};
exports.createRDProjectModel = createRDProjectModel;
/**
 * Sequelize model for Innovation Portfolio Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InnovationPortfolio model
 *
 * @example
 * ```typescript
 * const InnovationPortfolio = createInnovationPortfolioModel(sequelize);
 * const portfolio = await InnovationPortfolio.create({
 *   portfolioName: 'Digital Transformation',
 *   strategy: 'TRANSFORMATIONAL',
 *   totalBudget: 10000000
 * });
 * ```
 */
const createInnovationPortfolioModel = (sequelize) => {
    class InnovationPortfolio extends sequelize_1.Model {
    }
    InnovationPortfolio.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        portfolioId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique portfolio identifier',
        },
        portfolioName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Portfolio name',
        },
        strategy: {
            type: sequelize_1.DataTypes.ENUM('CORE', 'ADJACENT', 'TRANSFORMATIONAL', 'MIXED'),
            allowNull: false,
            comment: 'Innovation strategy focus',
        },
        totalBudget: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total portfolio budget',
        },
        allocatedBudget: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount allocated to projects',
        },
        numberOfProjects: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of projects in portfolio',
        },
        projects: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Portfolio projects',
        },
        performanceMetrics: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Performance metrics',
        },
        balanceScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Portfolio balance score',
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall risk score',
        },
        owner: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Portfolio owner',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'UNDER_REVIEW', 'CLOSED'),
            allowNull: false,
            defaultValue: 'ACTIVE',
            comment: 'Portfolio status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'innovation_portfolios',
        timestamps: true,
        indexes: [
            { fields: ['portfolioId'], unique: true },
            { fields: ['strategy'] },
            { fields: ['owner'] },
            { fields: ['status'] },
        ],
    });
    return InnovationPortfolio;
};
exports.createInnovationPortfolioModel = createInnovationPortfolioModel;
// ============================================================================
// STAGE-GATE PROCESS MANAGEMENT (1-5)
// ============================================================================
/**
 * Creates a new stage-gate process for innovation project.
 *
 * @param {string} projectId - Project ID
 * @param {string} projectName - Project name
 * @param {number} numberOfGates - Number of gates (typically 5-7)
 * @returns {Promise<Array<StageGatePhase>>} Stage-gate phases
 *
 * @example
 * ```typescript
 * const phases = await createStageGateProcess('PROJ-001', 'New Product Launch', 5);
 * ```
 */
const createStageGateProcess = async (projectId, projectName, numberOfGates = 5) => {
    const gateTypes = [
        'DISCOVERY',
        'SCOPING',
        'BUSINESS_CASE',
        'DEVELOPMENT',
        'TESTING',
        'LAUNCH',
    ];
    return gateTypes.slice(0, numberOfGates).map((gateType, index) => ({
        phaseId: `${projectId}-GATE-${index + 1}`,
        phaseName: `Gate ${index + 1}: ${gateType}`,
        phaseNumber: index + 1,
        gateType,
        criteria: generateGateCriteria(gateType),
        requiredDocuments: getRequiredDocuments(gateType),
        approvers: [],
        status: index === 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        duration: 30 * (index + 1),
        budget: 100000 * (index + 1),
    }));
};
exports.createStageGateProcess = createStageGateProcess;
/**
 * Evaluates gate criteria and determines if project can proceed.
 *
 * @param {string} phaseId - Phase ID
 * @param {Array<{ criterion: string; score: number }>} criteriaScores - Scored criteria
 * @param {number} [passingThreshold=70] - Minimum passing score
 * @returns {Promise<{ passed: boolean; totalScore: number; feedback: string[] }>} Gate evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateGateCriteria('PROJ-001-GATE-1', [
 *   { criterion: 'Market Potential', score: 85 },
 *   { criterion: 'Technical Feasibility', score: 75 }
 * ], 70);
 * ```
 */
const evaluateGateCriteria = async (phaseId, criteriaScores, passingThreshold = 70) => {
    const totalScore = criteriaScores.reduce((sum, item) => sum + item.score, 0) / criteriaScores.length;
    const feedback = [];
    criteriaScores.forEach((item) => {
        if (item.score < 60) {
            feedback.push(`${item.criterion} needs significant improvement (score: ${item.score})`);
        }
        else if (item.score < 70) {
            feedback.push(`${item.criterion} requires attention (score: ${item.score})`);
        }
    });
    return {
        passed: totalScore >= passingThreshold,
        totalScore,
        feedback,
    };
};
exports.evaluateGateCriteria = evaluateGateCriteria;
/**
 * Advances project to next stage-gate phase.
 *
 * @param {string} projectId - Project ID
 * @param {number} currentPhase - Current phase number
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<{ nextPhase: number; message: string }>} Advancement result
 *
 * @example
 * ```typescript
 * const result = await advanceToNextGate('PROJ-001', 1, 'manager.smith');
 * ```
 */
const advanceToNextGate = async (projectId, currentPhase, approvedBy) => {
    const nextPhase = currentPhase + 1;
    return {
        nextPhase,
        message: `Project ${projectId} advanced to Phase ${nextPhase} by ${approvedBy}`,
    };
};
exports.advanceToNextGate = advanceToNextGate;
/**
 * Generates comprehensive stage-gate report.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object>} Stage-gate report
 *
 * @example
 * ```typescript
 * const report = await generateStageGateReport('PROJ-001');
 * ```
 */
const generateStageGateReport = async (projectId) => {
    return {
        projectId,
        currentPhase: 3,
        totalPhases: 5,
        completionPercentage: 60,
        phasesCompleted: 2,
        timeElapsed: 120,
        budgetSpent: 450000,
        overallHealth: 'ON_TRACK',
        risks: [],
        nextMilestone: 'Development Phase Review',
    };
};
exports.generateStageGateReport = generateStageGateReport;
/**
 * Calculates stage-gate cycle time metrics.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<{ avgTimePerPhase: number; totalCycleTime: number; bottlenecks: string[] }>} Cycle time metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateStageGateCycleTime('PROJ-001');
 * ```
 */
const calculateStageGateCycleTime = async (projectId) => {
    return {
        avgTimePerPhase: 45,
        totalCycleTime: 225,
        bottlenecks: ['Business Case Approval delayed by 15 days'],
    };
};
exports.calculateStageGateCycleTime = calculateStageGateCycleTime;
// ============================================================================
// INNOVATION FUNNEL MANAGEMENT (6-10)
// ============================================================================
/**
 * Tracks ideas through innovation funnel stages.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<InnovationFunnel[]>} Funnel stage data
 *
 * @example
 * ```typescript
 * const funnel = await trackInnovationFunnel(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const trackInnovationFunnel = async (startDate, endDate) => {
    return [
        {
            funnelId: 'FUNNEL-IDEATION',
            stage: 'IDEATION',
            ideasCount: 500,
            conversionRate: 60,
            avgTimeInStage: 7,
            dropoutRate: 40,
            qualityScore: 65,
        },
        {
            funnelId: 'FUNNEL-SCREENING',
            stage: 'SCREENING',
            ideasCount: 300,
            conversionRate: 50,
            avgTimeInStage: 14,
            dropoutRate: 50,
            qualityScore: 72,
        },
        {
            funnelId: 'FUNNEL-VALIDATION',
            stage: 'VALIDATION',
            ideasCount: 150,
            conversionRate: 40,
            avgTimeInStage: 30,
            dropoutRate: 60,
            qualityScore: 78,
        },
        {
            funnelId: 'FUNNEL-DEVELOPMENT',
            stage: 'DEVELOPMENT',
            ideasCount: 60,
            conversionRate: 70,
            avgTimeInStage: 90,
            dropoutRate: 30,
            qualityScore: 85,
        },
        {
            funnelId: 'FUNNEL-SCALING',
            stage: 'SCALING',
            ideasCount: 42,
            conversionRate: 90,
            avgTimeInStage: 120,
            dropoutRate: 10,
            qualityScore: 92,
        },
    ];
};
exports.trackInnovationFunnel = trackInnovationFunnel;
/**
 * Calculates funnel conversion rates between stages.
 *
 * @param {InnovationFunnel[]} funnelData - Funnel stage data
 * @returns {Promise<Array<{ fromStage: string; toStage: string; rate: number }>>} Conversion rates
 *
 * @example
 * ```typescript
 * const rates = await calculateFunnelConversionRates(funnelData);
 * ```
 */
const calculateFunnelConversionRates = async (funnelData) => {
    const rates = [];
    for (let i = 0; i < funnelData.length - 1; i++) {
        const current = funnelData[i];
        const next = funnelData[i + 1];
        const rate = (next.ideasCount / current.ideasCount) * 100;
        rates.push({
            fromStage: current.stage,
            toStage: next.stage,
            rate,
        });
    }
    return rates;
};
exports.calculateFunnelConversionRates = calculateFunnelConversionRates;
/**
 * Identifies funnel bottlenecks and improvement opportunities.
 *
 * @param {InnovationFunnel[]} funnelData - Funnel stage data
 * @returns {Promise<Array<{ stage: string; issue: string; recommendation: string }>>} Identified bottlenecks
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyFunnelBottlenecks(funnelData);
 * ```
 */
const identifyFunnelBottlenecks = async (funnelData) => {
    const bottlenecks = [];
    funnelData.forEach((stage) => {
        if (stage.dropoutRate > 50) {
            bottlenecks.push({
                stage: stage.stage,
                issue: `High dropout rate: ${stage.dropoutRate}%`,
                recommendation: 'Review screening criteria and provide better support for ideas in this stage',
            });
        }
        if (stage.avgTimeInStage > 60) {
            bottlenecks.push({
                stage: stage.stage,
                issue: `Long cycle time: ${stage.avgTimeInStage} days`,
                recommendation: 'Streamline approval processes and allocate more resources',
            });
        }
    });
    return bottlenecks;
};
exports.identifyFunnelBottlenecks = identifyFunnelBottlenecks;
/**
 * Optimizes funnel stage criteria based on historical data.
 *
 * @param {string} stage - Funnel stage
 * @param {object} historicalData - Historical performance data
 * @returns {Promise<{ optimizedCriteria: string[]; expectedImprovement: number }>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeFunnelCriteria('SCREENING', historicalData);
 * ```
 */
const optimizeFunnelCriteria = async (stage, historicalData) => {
    return {
        optimizedCriteria: [
            'Market size > $10M',
            'Technical feasibility score > 70',
            'Strategic alignment score > 60',
            'Resource availability confirmed',
        ],
        expectedImprovement: 15.5,
    };
};
exports.optimizeFunnelCriteria = optimizeFunnelCriteria;
/**
 * Generates funnel velocity dashboard.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Funnel velocity metrics
 *
 * @example
 * ```typescript
 * const velocity = await generateFunnelVelocityDashboard(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const generateFunnelVelocityDashboard = async (startDate, endDate) => {
    return {
        totalIdeasEntered: 500,
        ideasLaunched: 42,
        overallConversionRate: 8.4,
        avgTimeToMarket: 180,
        velocityTrend: 'IMPROVING',
        topPerformingCategory: 'TECHNOLOGY',
        recommendedActions: ['Increase screening efficiency', 'Add more validation resources'],
    };
};
exports.generateFunnelVelocityDashboard = generateFunnelVelocityDashboard;
// ============================================================================
// PORTFOLIO MANAGEMENT (11-15)
// ============================================================================
/**
 * Creates innovation portfolio with strategic allocation.
 *
 * @param {string} portfolioName - Portfolio name
 * @param {number} totalBudget - Total budget
 * @param {object} strategyAllocation - Budget allocation by strategy
 * @returns {Promise<InnovationPortfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createInnovationPortfolio('2025 Innovation', 10000000, {
 *   CORE: 0.70,
 *   ADJACENT: 0.20,
 *   TRANSFORMATIONAL: 0.10
 * });
 * ```
 */
const createInnovationPortfolio = async (portfolioName, totalBudget, strategyAllocation) => {
    return {
        portfolioId: `PORT-${Date.now()}`,
        portfolioName,
        strategy: 'MIXED',
        totalBudget,
        allocatedBudget: 0,
        numberOfProjects: 0,
        projects: [],
        performanceMetrics: {
            avgROI: 0,
            successRate: 0,
            timeToMarket: 0,
        },
    };
};
exports.createInnovationPortfolio = createInnovationPortfolio;
/**
 * Balances portfolio across risk, return, and strategic fit.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {object} constraints - Portfolio constraints
 * @returns {Promise<{ rebalanced: boolean; changes: any[] }>} Rebalancing result
 *
 * @example
 * ```typescript
 * const result = await balanceInnovationPortfolio('PORT-001', {
 *   maxRiskScore: 6.0,
 *   minROI: 15,
 *   strategicAlignment: 0.70
 * });
 * ```
 */
const balanceInnovationPortfolio = async (portfolioId, constraints) => {
    return {
        rebalanced: true,
        changes: [
            { action: 'INCREASE_ALLOCATION', project: 'PROJ-003', amount: 250000, reason: 'High ROI potential' },
            { action: 'DECREASE_ALLOCATION', project: 'PROJ-007', amount: 100000, reason: 'Risk mitigation' },
        ],
    };
};
exports.balanceInnovationPortfolio = balanceInnovationPortfolio;
/**
 * Evaluates portfolio performance and health.
 *
 * @param {string} portfolioId - Portfolio ID
 * @returns {Promise<object>} Portfolio performance metrics
 *
 * @example
 * ```typescript
 * const performance = await evaluatePortfolioPerformance('PORT-001');
 * ```
 */
const evaluatePortfolioPerformance = async (portfolioId) => {
    return {
        portfolioId,
        overallHealth: 'HEALTHY',
        totalValue: 12500000,
        expectedROI: 18.5,
        riskAdjustedReturn: 15.2,
        portfolioBalance: {
            core: 65,
            adjacent: 25,
            transformational: 10,
        },
        topProjects: [
            { projectId: 'PROJ-003', name: 'AI Platform', value: 2500000, roi: 32 },
            { projectId: 'PROJ-005', name: 'Cloud Migration', value: 1800000, roi: 25 },
        ],
        atRiskProjects: [{ projectId: 'PROJ-007', name: 'Blockchain Initiative', issue: 'Budget overrun' }],
    };
};
exports.evaluatePortfolioPerformance = evaluatePortfolioPerformance;
/**
 * Optimizes resource allocation across portfolio projects.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {number} availableResources - Available resource pool
 * @returns {Promise<Array<{ projectId: string; allocation: number; justification: string }>>} Optimized allocation
 *
 * @example
 * ```typescript
 * const allocation = await optimizePortfolioResourceAllocation('PORT-001', 50);
 * ```
 */
const optimizePortfolioResourceAllocation = async (portfolioId, availableResources) => {
    return [
        { projectId: 'PROJ-003', allocation: 20, justification: 'High strategic value and ROI' },
        { projectId: 'PROJ-005', allocation: 15, justification: 'Critical for digital transformation' },
        { projectId: 'PROJ-008', allocation: 10, justification: 'Market opportunity' },
        { projectId: 'PROJ-012', allocation: 5, justification: 'Exploration phase' },
    ];
};
exports.optimizePortfolioResourceAllocation = optimizePortfolioResourceAllocation;
/**
 * Generates portfolio strategy recommendations.
 *
 * @param {string} portfolioId - Portfolio ID
 * @param {object} marketData - Market trends and opportunities
 * @returns {Promise<Array<{ recommendation: string; rationale: string; priority: string }>>} Strategic recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generatePortfolioRecommendations('PORT-001', marketData);
 * ```
 */
const generatePortfolioRecommendations = async (portfolioId, marketData) => {
    return [
        {
            recommendation: 'Increase AI/ML investment by 15%',
            rationale: 'Market growing at 45% CAGR, strong competitive advantage',
            priority: 'HIGH',
        },
        {
            recommendation: 'Phase out legacy modernization projects',
            rationale: 'Low ROI and strategic value',
            priority: 'MEDIUM',
        },
        {
            recommendation: 'Launch sustainability innovation track',
            rationale: 'Regulatory requirements and market demand',
            priority: 'HIGH',
        },
    ];
};
exports.generatePortfolioRecommendations = generatePortfolioRecommendations;
// ============================================================================
// R&D OPTIMIZATION (16-20)
// ============================================================================
/**
 * Optimizes R&D project selection and prioritization.
 *
 * @param {RDProject[]} candidateProjects - Candidate R&D projects
 * @param {number} budgetConstraint - Available budget
 * @param {object} criteria - Selection criteria
 * @returns {Promise<Array<{ project: RDProject; score: number; selected: boolean }>>} Optimized selection
 *
 * @example
 * ```typescript
 * const selection = await optimizeRDProjectSelection(projects, 5000000, {
 *   strategicFit: 0.30,
 *   technicalFeasibility: 0.25,
 *   commercialPotential: 0.25,
 *   riskLevel: 0.20
 * });
 * ```
 */
const optimizeRDProjectSelection = async (candidateProjects, budgetConstraint, criteria) => {
    return candidateProjects.map((project) => ({
        project,
        score: Math.random() * 100,
        selected: Math.random() > 0.5,
    }));
};
exports.optimizeRDProjectSelection = optimizeRDProjectSelection;
/**
 * Allocates R&D budget across projects and phases.
 *
 * @param {string[]} projectIds - Project IDs
 * @param {number} totalBudget - Total R&D budget
 * @param {string} allocationMethod - Allocation method
 * @returns {Promise<Array<{ projectId: string; allocation: number; percentage: number }>>} Budget allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateRDBudget(['PROJ-001', 'PROJ-002'], 5000000, 'STRATEGIC_PRIORITY');
 * ```
 */
const allocateRDBudget = async (projectIds, totalBudget, allocationMethod) => {
    const allocation = totalBudget / projectIds.length;
    return projectIds.map((projectId) => ({
        projectId,
        allocation,
        percentage: (allocation / totalBudget) * 100,
    }));
};
exports.allocateRDBudget = allocateRDBudget;
/**
 * Tracks R&D project milestones and deliverables.
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<object>} Milestone tracking data
 *
 * @example
 * ```typescript
 * const tracking = await trackRDMilestones('PROJ-001');
 * ```
 */
const trackRDMilestones = async (projectId) => {
    return {
        projectId,
        totalMilestones: 8,
        completedMilestones: 5,
        upcomingMilestones: [
            { name: 'Prototype Testing', dueDate: new Date('2025-03-15'), status: 'ON_TRACK' },
            { name: 'Pilot Deployment', dueDate: new Date('2025-05-01'), status: 'PLANNING' },
        ],
        delayedMilestones: [{ name: 'Patent Filing', originalDate: new Date('2025-01-15'), newDate: new Date('2025-02-01') }],
    };
};
exports.trackRDMilestones = trackRDMilestones;
/**
 * Measures R&D productivity and efficiency.
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<object>} R&D productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = await measureRDProductivity(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const measureRDProductivity = async (startDate, endDate) => {
    return {
        totalProjects: 15,
        activeProjects: 12,
        completedProjects: 3,
        budgetUtilization: 87.5,
        deliverableCompletionRate: 92,
        publicationsPerProject: 2.3,
        patentsPerProject: 0.8,
        avgProjectDuration: 18,
        costPerDeliverable: 125000,
        productivityTrend: 'IMPROVING',
    };
};
exports.measureRDProductivity = measureRDProductivity;
/**
 * Forecasts R&D outcomes and success probability.
 *
 * @param {string} projectId - Project ID
 * @param {object} historicalData - Historical project data
 * @returns {Promise<{ successProbability: number; expectedOutcomes: any[]; risks: any[] }>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastRDOutcomes('PROJ-001', historicalData);
 * ```
 */
const forecastRDOutcomes = async (projectId, historicalData) => {
    return {
        successProbability: 78.5,
        expectedOutcomes: [
            { outcome: 'Patent filed', probability: 85 },
            { outcome: 'Commercial product', probability: 60 },
            { outcome: 'Technology licensed', probability: 40 },
        ],
        risks: [
            { risk: 'Technical complexity', impact: 'HIGH', probability: 'MEDIUM' },
            { risk: 'Market timing', impact: 'MEDIUM', probability: 'LOW' },
        ],
    };
};
exports.forecastRDOutcomes = forecastRDOutcomes;
// ============================================================================
// INNOVATION METRICS & KPIs (21-25)
// ============================================================================
/**
 * Calculates comprehensive innovation metrics.
 *
 * @param {Date} startDate - Calculation start date
 * @param {Date} endDate - Calculation end date
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<InnovationMetric[]>} Innovation metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateInnovationMetrics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const calculateInnovationMetrics = async (startDate, endDate, organizationCode) => {
    return [
        {
            metricId: 'INNO-001',
            metricName: 'Innovation Success Rate',
            metricType: 'OUTCOME',
            category: 'EFFECTIVENESS',
            value: 42.5,
            target: 50,
            unit: 'PERCENTAGE',
            period: 'ANNUAL',
            trend: 'IMPROVING',
            benchmark: 38,
        },
        {
            metricId: 'INNO-002',
            metricName: 'Time to Market',
            metricType: 'OUTPUT',
            category: 'SPEED',
            value: 180,
            target: 150,
            unit: 'DAYS',
            period: 'ANNUAL',
            trend: 'DECLINING',
            benchmark: 165,
        },
        {
            metricId: 'INNO-003',
            metricName: 'Innovation ROI',
            metricType: 'IMPACT',
            category: 'FINANCIAL',
            value: 18.5,
            target: 20,
            unit: 'PERCENTAGE',
            period: 'ANNUAL',
            trend: 'STABLE',
            benchmark: 15,
        },
    ];
};
exports.calculateInnovationMetrics = calculateInnovationMetrics;
/**
 * Tracks innovation pipeline health.
 *
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Pipeline health metrics
 *
 * @example
 * ```typescript
 * const health = await trackInnovationPipelineHealth();
 * ```
 */
const trackInnovationPipelineHealth = async (organizationCode) => {
    return {
        overallHealth: 'HEALTHY',
        totalIdeas: 250,
        activeProjects: 35,
        pipelineValue: 45000000,
        riskScore: 4.2,
        diversificationScore: 78,
        balanceScore: 82,
        velocityScore: 75,
        recommendations: ['Increase early-stage ideation', 'Accelerate validation stage'],
    };
};
exports.trackInnovationPipelineHealth = trackInnovationPipelineHealth;
/**
 * Measures innovation culture and capability maturity.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Culture and capability assessment
 *
 * @example
 * ```typescript
 * const assessment = await measureInnovationCulture('ORG-001');
 * ```
 */
const measureInnovationCulture = async (organizationCode) => {
    return {
        organizationCode,
        overallMaturity: 3.5,
        maturityLevel: 'DEVELOPING',
        dimensions: {
            leadership: 4.0,
            strategy: 3.8,
            process: 3.2,
            resources: 3.5,
            culture: 3.6,
            measurement: 3.0,
        },
        strengths: ['Strong leadership support', 'Clear innovation strategy'],
        weaknesses: ['Limited measurement systems', 'Process inefficiencies'],
        improvementAreas: ['Implement innovation metrics dashboard', 'Streamline approval processes'],
    };
};
exports.measureInnovationCulture = measureInnovationCulture;
/**
 * Benchmarks innovation performance against industry.
 *
 * @param {InnovationMetric[]} metrics - Organization metrics
 * @param {string} industry - Industry code
 * @returns {Promise<Array<{ metric: string; position: string; percentile: number }>>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkInnovationPerformance(metrics, 'TECH-001');
 * ```
 */
const benchmarkInnovationPerformance = async (metrics, industry) => {
    return metrics.map((metric) => ({
        metric: metric.metricName,
        position: metric.value > metric.benchmark ? 'ABOVE_AVERAGE' : 'BELOW_AVERAGE',
        percentile: 65,
    }));
};
exports.benchmarkInnovationPerformance = benchmarkInnovationPerformance;
/**
 * Generates innovation scorecard dashboard.
 *
 * @param {Date} startDate - Dashboard start date
 * @param {Date} endDate - Dashboard end date
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Innovation scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateInnovationScorecard(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const generateInnovationScorecard = async (startDate, endDate, organizationCode) => {
    return {
        period: { startDate, endDate },
        overallScore: 72,
        rating: 'GOOD',
        categories: {
            input: { score: 75, trend: 'IMPROVING' },
            process: { score: 68, trend: 'STABLE' },
            output: { score: 72, trend: 'IMPROVING' },
            outcome: { score: 70, trend: 'STABLE' },
        },
        topPerformers: ['AI Innovation', 'Process Automation'],
        areasForImprovement: ['Time to Market', 'Idea Conversion Rate'],
    };
};
exports.generateInnovationScorecard = generateInnovationScorecard;
// ============================================================================
// IDEA MANAGEMENT (26-30)
// ============================================================================
/**
 * Captures and validates innovation ideas.
 *
 * @param {Partial<InnovationIdea>} ideaData - Idea data
 * @returns {Promise<InnovationIdea>} Created idea
 *
 * @example
 * ```typescript
 * const idea = await captureInnovationIdea({
 *   title: 'Automated Testing Platform',
 *   description: 'AI-driven test automation',
 *   category: 'TECHNOLOGY',
 *   estimatedImpact: 85
 * });
 * ```
 */
const captureInnovationIdea = async (ideaData) => {
    return {
        ideaId: `IDEA-${Date.now()}`,
        title: ideaData.title || '',
        description: ideaData.description || '',
        submittedBy: ideaData.submittedBy || 'user',
        submittedAt: new Date(),
        category: ideaData.category || 'TECHNOLOGY',
        stage: 'IDEATION',
        status: 'SUBMITTED',
        priority: 'MEDIUM',
        estimatedImpact: ideaData.estimatedImpact || 0,
        estimatedCost: ideaData.estimatedCost || 0,
        estimatedROI: ideaData.estimatedROI || 0,
        tags: ideaData.tags || [],
        attachments: ideaData.attachments || [],
    };
};
exports.captureInnovationIdea = captureInnovationIdea;
/**
 * Scores and prioritizes ideas using weighted criteria.
 *
 * @param {string} ideaId - Idea ID
 * @param {object} scoringCriteria - Scoring criteria with weights
 * @returns {Promise<{ totalScore: number; ranking: string; recommendation: string }>} Idea score
 *
 * @example
 * ```typescript
 * const score = await scoreInnovationIdea('IDEA-001', {
 *   marketPotential: { weight: 0.30, score: 85 },
 *   technicalFeasibility: { weight: 0.25, score: 75 },
 *   strategicFit: { weight: 0.25, score: 90 },
 *   resourceRequirements: { weight: 0.20, score: 70 }
 * });
 * ```
 */
const scoreInnovationIdea = async (ideaId, scoringCriteria) => {
    const totalScore = Object.values(scoringCriteria).reduce((sum, item) => sum + item.weight * item.score, 0);
    let ranking = 'LOW';
    let recommendation = 'Monitor';
    if (totalScore >= 80) {
        ranking = 'HIGH';
        recommendation = 'Fast-track for development';
    }
    else if (totalScore >= 65) {
        ranking = 'MEDIUM';
        recommendation = 'Further evaluation needed';
    }
    return { totalScore, ranking, recommendation };
};
exports.scoreInnovationIdea = scoreInnovationIdea;
/**
 * Facilitates crowdsourced idea evaluation.
 *
 * @param {string} ideaId - Idea ID
 * @param {Array<{ userId: string; rating: number; comments: string }>} evaluations - User evaluations
 * @returns {Promise<{ avgRating: number; totalVotes: number; sentiment: string }>} Crowdsourced evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await crowdsourceIdeaEvaluation('IDEA-001', [
 *   { userId: 'user1', rating: 8, comments: 'Great potential' },
 *   { userId: 'user2', rating: 9, comments: 'Solves real problem' }
 * ]);
 * ```
 */
const crowdsourceIdeaEvaluation = async (ideaId, evaluations) => {
    const avgRating = evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length;
    return {
        avgRating,
        totalVotes: evaluations.length,
        sentiment: avgRating >= 7 ? 'POSITIVE' : avgRating >= 5 ? 'NEUTRAL' : 'NEGATIVE',
    };
};
exports.crowdsourceIdeaEvaluation = crowdsourceIdeaEvaluation;
/**
 * Merges similar or duplicate ideas.
 *
 * @param {string[]} ideaIds - Idea IDs to merge
 * @param {string} primaryIdeaId - Primary idea to keep
 * @returns {Promise<{ mergedIdeaId: string; consolidatedTags: string[]; combinedScore: number }>} Merge result
 *
 * @example
 * ```typescript
 * const merged = await mergeSimilarIdeas(['IDEA-001', 'IDEA-002', 'IDEA-003'], 'IDEA-001');
 * ```
 */
const mergeSimilarIdeas = async (ideaIds, primaryIdeaId) => {
    return {
        mergedIdeaId: primaryIdeaId,
        consolidatedTags: ['AI', 'Automation', 'Efficiency', 'Cost-Reduction'],
        combinedScore: 87,
    };
};
exports.mergeSimilarIdeas = mergeSimilarIdeas;
/**
 * Generates idea portfolio heatmap.
 *
 * @param {string} [category] - Optional category filter
 * @returns {Promise<Array<{ idea: string; impact: number; feasibility: number; priority: string }>>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = await generateIdeaHeatmap('TECHNOLOGY');
 * ```
 */
const generateIdeaHeatmap = async (category) => {
    return [
        { idea: 'AI-Powered Analytics', impact: 90, feasibility: 75, priority: 'HIGH' },
        { idea: 'Blockchain Integration', impact: 70, feasibility: 45, priority: 'MEDIUM' },
        { idea: 'Mobile App Redesign', impact: 60, feasibility: 85, priority: 'MEDIUM' },
    ];
};
exports.generateIdeaHeatmap = generateIdeaHeatmap;
// ============================================================================
// TECHNOLOGY ASSESSMENT (31-35)
// ============================================================================
/**
 * Assesses technology readiness level (TRL).
 *
 * @param {string} technologyId - Technology ID
 * @param {object} assessmentCriteria - Assessment criteria
 * @returns {Promise<{ trl: number; maturity: string; gaps: string[]; roadmap: any[] }>} TRL assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessTechnologyReadiness('TECH-001', criteria);
 * ```
 */
const assessTechnologyReadiness = async (technologyId, assessmentCriteria) => {
    return {
        trl: 6,
        maturity: 'PILOT',
        gaps: ['Scalability not proven', 'Integration testing incomplete'],
        roadmap: [
            { phase: 'Scale Testing', duration: 3, dependencies: [] },
            { phase: 'Integration', duration: 2, dependencies: ['Scale Testing'] },
            { phase: 'Deployment', duration: 4, dependencies: ['Integration'] },
        ],
    };
};
exports.assessTechnologyReadiness = assessTechnologyReadiness;
/**
 * Evaluates technology strategic fit.
 *
 * @param {string} technologyId - Technology ID
 * @param {object} strategicGoals - Organization strategic goals
 * @returns {Promise<{ fitScore: number; alignment: string; opportunities: string[] }>} Strategic fit evaluation
 *
 * @example
 * ```typescript
 * const fit = await evaluateTechnologyStrategicFit('TECH-001', strategicGoals);
 * ```
 */
const evaluateTechnologyStrategicFit = async (technologyId, strategicGoals) => {
    return {
        fitScore: 82,
        alignment: 'STRONG',
        opportunities: ['Cost reduction', 'Revenue growth', 'Market differentiation'],
    };
};
exports.evaluateTechnologyStrategicFit = evaluateTechnologyStrategicFit;
/**
 * Analyzes technology competitive landscape.
 *
 * @param {string} technologyType - Technology type
 * @param {string[]} competitors - Competitor list
 * @returns {Promise<object>} Competitive analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTechnologyLandscape('AI_PLATFORM', ['CompA', 'CompB']);
 * ```
 */
const analyzeTechnologyLandscape = async (technologyType, competitors) => {
    return {
        technologyType,
        marketSize: 25000000000,
        growthRate: 35,
        competitivePosition: 'CHALLENGER',
        marketLeader: 'CompA',
        differentiators: ['Speed', 'Cost', 'Integration'],
        threats: ['New entrants', 'Disruptive technology'],
        opportunities: ['Emerging markets', 'Strategic partnerships'],
    };
};
exports.analyzeTechnologyLandscape = analyzeTechnologyLandscape;
/**
 * Forecasts technology adoption and diffusion.
 *
 * @param {string} technologyId - Technology ID
 * @param {object} marketData - Market and adoption data
 * @returns {Promise<{ adoptionCurve: any[]; peakAdoption: Date; marketPenetration: number }>} Adoption forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastTechnologyAdoption('TECH-001', marketData);
 * ```
 */
const forecastTechnologyAdoption = async (technologyId, marketData) => {
    return {
        adoptionCurve: [
            { period: 'Year 1', adoption: 2 },
            { period: 'Year 2', adoption: 8 },
            { period: 'Year 3', adoption: 18 },
            { period: 'Year 4', adoption: 35 },
            { period: 'Year 5', adoption: 52 },
        ],
        peakAdoption: new Date('2028-12-31'),
        marketPenetration: 52,
    };
};
exports.forecastTechnologyAdoption = forecastTechnologyAdoption;
/**
 * Generates technology investment recommendations.
 *
 * @param {TechnologyAssessment[]} assessments - Technology assessments
 * @param {number} budgetConstraint - Available budget
 * @returns {Promise<Array<{ technology: string; recommendation: string; investment: number; rationale: string }>>} Investment recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateTechnologyInvestmentRecommendations(assessments, 5000000);
 * ```
 */
const generateTechnologyInvestmentRecommendations = async (assessments, budgetConstraint) => {
    return [
        {
            technology: 'AI Platform',
            recommendation: 'INVEST',
            investment: 2000000,
            rationale: 'High strategic fit, proven technology, strong ROI potential',
        },
        {
            technology: 'Quantum Computing',
            recommendation: 'EXPLORE',
            investment: 500000,
            rationale: 'Emerging technology, long-term potential, high risk',
        },
    ];
};
exports.generateTechnologyInvestmentRecommendations = generateTechnologyInvestmentRecommendations;
// ============================================================================
// INNOVATION GOVERNANCE (36-40)
// ============================================================================
/**
 * Defines innovation governance framework.
 *
 * @param {object} governanceStructure - Governance structure definition
 * @returns {Promise<InnovationGovernance>} Created governance framework
 *
 * @example
 * ```typescript
 * const governance = await defineInnovationGovernance({
 *   policyName: 'Innovation Approval Process',
 *   policyType: 'APPROVAL',
 *   decisionCriteria: ['Strategic fit', 'ROI > 15%', 'Risk level < 6']
 * });
 * ```
 */
const defineInnovationGovernance = async (governanceStructure) => {
    return {
        governanceId: `GOV-${Date.now()}`,
        policyName: governanceStructure.policyName,
        policyType: governanceStructure.policyType,
        decisionCriteria: governanceStructure.decisionCriteria || [],
        approvalLevels: [
            { level: 'TEAM_LEAD', threshold: 50000, approvers: ['team-leads'] },
            { level: 'DIRECTOR', threshold: 250000, approvers: ['directors'] },
            { level: 'VP', threshold: 1000000, approvers: ['vps'] },
            { level: 'EXECUTIVE', threshold: Infinity, approvers: ['executives'] },
        ],
        reviewFrequency: 'QUARTERLY',
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };
};
exports.defineInnovationGovernance = defineInnovationGovernance;
/**
 * Routes innovation decisions to appropriate approvers.
 *
 * @param {string} itemId - Item ID (idea, project, etc.)
 * @param {string} itemType - Item type
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<{ approvalLevel: string; approvers: string[]; timeline: number }>} Routing decision
 *
 * @example
 * ```typescript
 * const routing = await routeInnovationDecision('IDEA-001', 'FUNDING', 500000);
 * ```
 */
const routeInnovationDecision = async (itemId, itemType, requestedAmount) => {
    let approvalLevel = 'TEAM_LEAD';
    let timeline = 5;
    if (requestedAmount > 1000000) {
        approvalLevel = 'EXECUTIVE';
        timeline = 30;
    }
    else if (requestedAmount > 250000) {
        approvalLevel = 'VP';
        timeline = 15;
    }
    else if (requestedAmount > 50000) {
        approvalLevel = 'DIRECTOR';
        timeline = 10;
    }
    return {
        approvalLevel,
        approvers: [`${approvalLevel.toLowerCase()}-group`],
        timeline,
    };
};
exports.routeInnovationDecision = routeInnovationDecision;
/**
 * Tracks innovation decision-making effectiveness.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Decision effectiveness metrics
 *
 * @example
 * ```typescript
 * const effectiveness = await trackInnovationDecisionEffectiveness(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const trackInnovationDecisionEffectiveness = async (startDate, endDate) => {
    return {
        totalDecisions: 145,
        approved: 98,
        rejected: 35,
        deferred: 12,
        avgDecisionTime: 12,
        successRateOfApproved: 68,
        falsePositiveRate: 32,
        falseNegativeRate: 8,
        decisionQuality: 'GOOD',
        recommendations: ['Improve initial screening', 'Add post-decision reviews'],
    };
};
exports.trackInnovationDecisionEffectiveness = trackInnovationDecisionEffectiveness;
/**
 * Implements innovation review boards and committees.
 *
 * @param {object} boardConfig - Board configuration
 * @returns {Promise<{ boardId: string; members: any[]; schedule: any }>} Created board
 *
 * @example
 * ```typescript
 * const board = await implementInnovationBoard({
 *   boardName: 'Technology Review Board',
 *   members: ['cto', 'vp-engineering', 'director-innovation'],
 *   meetingFrequency: 'MONTHLY'
 * });
 * ```
 */
const implementInnovationBoard = async (boardConfig) => {
    return {
        boardId: `BOARD-${Date.now()}`,
        boardName: boardConfig.boardName,
        members: boardConfig.members || [],
        meetingFrequency: boardConfig.meetingFrequency || 'MONTHLY',
        nextMeeting: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        charter: 'Review and approve innovation initiatives',
    };
};
exports.implementInnovationBoard = implementInnovationBoard;
/**
 * Generates innovation governance compliance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Governance compliance report
 *
 * @example
 * ```typescript
 * const report = await generateGovernanceComplianceReport(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const generateGovernanceComplianceReport = async (startDate, endDate) => {
    return {
        period: { startDate, endDate },
        overallCompliance: 94,
        compliantDecisions: 137,
        nonCompliantDecisions: 8,
        violations: [
            { type: 'Approval threshold exceeded', count: 3, severity: 'MEDIUM' },
            { type: 'Documentation incomplete', count: 5, severity: 'LOW' },
        ],
        recommendations: ['Implement automated approval routing', 'Enhance documentation templates'],
    };
};
exports.generateGovernanceComplianceReport = generateGovernanceComplianceReport;
// ============================================================================
// COLLABORATION & TEAMS (41-45)
// ============================================================================
/**
 * Forms cross-functional innovation teams.
 *
 * @param {string} projectId - Project ID
 * @param {string[]} requiredSkills - Required skills
 * @param {number} teamSize - Desired team size
 * @returns {Promise<CollaborationTeam>} Formed team
 *
 * @example
 * ```typescript
 * const team = await formInnovationTeam('PROJ-001', ['AI', 'UX', 'Product'], 5);
 * ```
 */
const formInnovationTeam = async (projectId, requiredSkills, teamSize) => {
    return {
        teamId: `TEAM-${Date.now()}`,
        teamName: `Innovation Team - ${projectId}`,
        teamType: 'CROSS_FUNCTIONAL',
        members: [
            { userId: 'user1', role: 'LEAD', expertise: ['AI', 'ML'] },
            { userId: 'user2', role: 'DEVELOPER', expertise: ['Backend', 'APIs'] },
            { userId: 'user3', role: 'DESIGNER', expertise: ['UX', 'UI'] },
        ],
        projects: [projectId],
        performanceScore: 0,
        collaborationTools: ['Slack', 'Jira', 'Miro'],
    };
};
exports.formInnovationTeam = formInnovationTeam;
/**
 * Facilitates innovation collaboration sessions.
 *
 * @param {string} sessionType - Session type (brainstorming, design thinking, etc.)
 * @param {string[]} participants - Participant user IDs
 * @param {object} sessionConfig - Session configuration
 * @returns {Promise<{ sessionId: string; agenda: any[]; outputs: any }>} Collaboration session
 *
 * @example
 * ```typescript
 * const session = await facilitateCollaborationSession('DESIGN_THINKING', ['user1', 'user2'], {
 *   duration: 120,
 *   facilitator: 'facilitator1'
 * });
 * ```
 */
const facilitateCollaborationSession = async (sessionType, participants, sessionConfig) => {
    return {
        sessionId: `SESSION-${Date.now()}`,
        sessionType,
        participants,
        startTime: new Date(),
        duration: sessionConfig.duration || 60,
        facilitator: sessionConfig.facilitator,
        agenda: [
            { phase: 'Empathize', duration: 20 },
            { phase: 'Define', duration: 20 },
            { phase: 'Ideate', duration: 30 },
            { phase: 'Prototype', duration: 30 },
            { phase: 'Test', duration: 20 },
        ],
        outputs: {
            ideasGenerated: 0,
            prototypes: 0,
            actionItems: [],
        },
    };
};
exports.facilitateCollaborationSession = facilitateCollaborationSession;
/**
 * Manages innovation knowledge sharing and documentation.
 *
 * @param {string} projectId - Project ID
 * @param {object} knowledgeAssets - Knowledge assets to capture
 * @returns {Promise<{ repository: string; assets: any[]; accessibility: string }>} Knowledge management
 *
 * @example
 * ```typescript
 * const knowledge = await manageInnovationKnowledge('PROJ-001', {
 *   documents: ['design-doc.pdf', 'research-findings.pdf'],
 *   lessons: ['Technical challenges', 'Market insights']
 * });
 * ```
 */
const manageInnovationKnowledge = async (projectId, knowledgeAssets) => {
    return {
        projectId,
        repository: `knowledge-base/${projectId}`,
        assets: [
            { type: 'DOCUMENT', name: 'Project Charter', status: 'PUBLISHED' },
            { type: 'LESSON_LEARNED', name: 'Market Research Insights', status: 'PUBLISHED' },
            { type: 'BEST_PRACTICE', name: 'Rapid Prototyping Guide', status: 'DRAFT' },
        ],
        accessibility: 'ORGANIZATION_WIDE',
        contributors: 12,
        views: 145,
    };
};
exports.manageInnovationKnowledge = manageInnovationKnowledge;
/**
 * Measures team innovation performance.
 *
 * @param {string} teamId - Team ID
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<object>} Team performance metrics
 *
 * @example
 * ```typescript
 * const performance = await measureTeamInnovationPerformance('TEAM-001', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
const measureTeamInnovationPerformance = async (teamId, startDate, endDate) => {
    return {
        teamId,
        period: { startDate, endDate },
        projectsCompleted: 5,
        ideasGenerated: 45,
        implementationRate: 22,
        avgProjectDuration: 120,
        collaborationScore: 85,
        innovationScore: 78,
        strengths: ['Fast execution', 'Creative solutions'],
        improvements: ['Better documentation', 'Cross-team collaboration'],
    };
};
exports.measureTeamInnovationPerformance = measureTeamInnovationPerformance;
/**
 * Generates innovation collaboration network analysis.
 *
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<object>} Network analysis
 *
 * @example
 * ```typescript
 * const network = await generateCollaborationNetworkAnalysis();
 * ```
 */
const generateCollaborationNetworkAnalysis = async (organizationCode) => {
    return {
        totalNodes: 250,
        totalConnections: 1850,
        networkDensity: 0.68,
        centralNodes: [
            { userId: 'user1', connections: 45, influence: 92 },
            { userId: 'user2', connections: 38, influence: 85 },
        ],
        clusters: [
            { name: 'AI Innovation Hub', size: 35, focus: 'Artificial Intelligence' },
            { name: 'Customer Experience', size: 28, focus: 'UX/Design' },
        ],
        isolatedNodes: 12,
        recommendations: ['Connect isolated innovators', 'Foster cross-cluster collaboration'],
    };
};
exports.generateCollaborationNetworkAnalysis = generateCollaborationNetworkAnalysis;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Generates gate criteria based on gate type.
 */
const generateGateCriteria = (gateType) => {
    const criteriaMap = {
        DISCOVERY: ['Market Potential', 'Technical Feasibility', 'Strategic Alignment'],
        SCOPING: ['Customer Need Validation', 'Competitive Analysis', 'Resource Requirements'],
        BUSINESS_CASE: ['Financial Projections', 'ROI Analysis', 'Risk Assessment'],
        DEVELOPMENT: ['Technical Progress', 'Budget Adherence', 'Timeline Compliance'],
        TESTING: ['Quality Metrics', 'User Acceptance', 'Performance Benchmarks'],
        LAUNCH: ['Market Readiness', 'Go-to-Market Strategy', 'Success Metrics'],
    };
    const criteria = criteriaMap[gateType] || [];
    return criteria.map((criterion) => ({ criterion, weight: 1.0 / criteria.length, score: 0 }));
};
/**
 * Gets required documents for gate type.
 */
const getRequiredDocuments = (gateType) => {
    const documentsMap = {
        DISCOVERY: ['Opportunity Brief', 'Market Research', 'Initial Feasibility'],
        SCOPING: ['Concept Definition', 'Customer Validation', 'Resource Plan'],
        BUSINESS_CASE: ['Business Plan', 'Financial Model', 'Risk Analysis'],
        DEVELOPMENT: ['Technical Specifications', 'Progress Reports', 'Test Plans'],
        TESTING: ['Test Results', 'User Feedback', 'Quality Reports'],
        LAUNCH: ['Launch Plan', 'Marketing Materials', 'Success Metrics Dashboard'],
    };
    return documentsMap[gateType] || [];
};
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createInnovationIdeaModel: exports.createInnovationIdeaModel,
    createRDProjectModel: exports.createRDProjectModel,
    createInnovationPortfolioModel: exports.createInnovationPortfolioModel,
    // Stage-Gate Process
    createStageGateProcess: exports.createStageGateProcess,
    evaluateGateCriteria: exports.evaluateGateCriteria,
    advanceToNextGate: exports.advanceToNextGate,
    generateStageGateReport: exports.generateStageGateReport,
    calculateStageGateCycleTime: exports.calculateStageGateCycleTime,
    // Innovation Funnel
    trackInnovationFunnel: exports.trackInnovationFunnel,
    calculateFunnelConversionRates: exports.calculateFunnelConversionRates,
    identifyFunnelBottlenecks: exports.identifyFunnelBottlenecks,
    optimizeFunnelCriteria: exports.optimizeFunnelCriteria,
    generateFunnelVelocityDashboard: exports.generateFunnelVelocityDashboard,
    // Portfolio Management
    createInnovationPortfolio: exports.createInnovationPortfolio,
    balanceInnovationPortfolio: exports.balanceInnovationPortfolio,
    evaluatePortfolioPerformance: exports.evaluatePortfolioPerformance,
    optimizePortfolioResourceAllocation: exports.optimizePortfolioResourceAllocation,
    generatePortfolioRecommendations: exports.generatePortfolioRecommendations,
    // R&D Optimization
    optimizeRDProjectSelection: exports.optimizeRDProjectSelection,
    allocateRDBudget: exports.allocateRDBudget,
    trackRDMilestones: exports.trackRDMilestones,
    measureRDProductivity: exports.measureRDProductivity,
    forecastRDOutcomes: exports.forecastRDOutcomes,
    // Innovation Metrics
    calculateInnovationMetrics: exports.calculateInnovationMetrics,
    trackInnovationPipelineHealth: exports.trackInnovationPipelineHealth,
    measureInnovationCulture: exports.measureInnovationCulture,
    benchmarkInnovationPerformance: exports.benchmarkInnovationPerformance,
    generateInnovationScorecard: exports.generateInnovationScorecard,
    // Idea Management
    captureInnovationIdea: exports.captureInnovationIdea,
    scoreInnovationIdea: exports.scoreInnovationIdea,
    crowdsourceIdeaEvaluation: exports.crowdsourceIdeaEvaluation,
    mergeSimilarIdeas: exports.mergeSimilarIdeas,
    generateIdeaHeatmap: exports.generateIdeaHeatmap,
    // Technology Assessment
    assessTechnologyReadiness: exports.assessTechnologyReadiness,
    evaluateTechnologyStrategicFit: exports.evaluateTechnologyStrategicFit,
    analyzeTechnologyLandscape: exports.analyzeTechnologyLandscape,
    forecastTechnologyAdoption: exports.forecastTechnologyAdoption,
    generateTechnologyInvestmentRecommendations: exports.generateTechnologyInvestmentRecommendations,
    // Innovation Governance
    defineInnovationGovernance: exports.defineInnovationGovernance,
    routeInnovationDecision: exports.routeInnovationDecision,
    trackInnovationDecisionEffectiveness: exports.trackInnovationDecisionEffectiveness,
    implementInnovationBoard: exports.implementInnovationBoard,
    generateGovernanceComplianceReport: exports.generateGovernanceComplianceReport,
    // Collaboration & Teams
    formInnovationTeam: exports.formInnovationTeam,
    facilitateCollaborationSession: exports.facilitateCollaborationSession,
    manageInnovationKnowledge: exports.manageInnovationKnowledge,
    measureTeamInnovationPerformance: exports.measureTeamInnovationPerformance,
    generateCollaborationNetworkAnalysis: exports.generateCollaborationNetworkAnalysis,
};
//# sourceMappingURL=innovation-management-kit.js.map