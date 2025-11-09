"use strict";
/**
 * LOC: CONS-TAL-MGT-001
 * File: /reuse/server/consulting/talent-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/talent.service.ts
 *   - backend/consulting/workforce-planning.controller.ts
 *   - backend/consulting/succession.service.ts
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
exports.TalentManagementKit = exports.SkillsGapModel = exports.DevelopmentPlanModel = exports.RetentionAnalysisModel = exports.EngagementSurveyModel = exports.TalentAssessmentModel = exports.CompetencyFrameworkModel = exports.SuccessionPlanModel = exports.WorkforcePlanModel = exports.CreateSkillsGapDto = exports.CreateDevelopmentPlanDto = exports.CreateRetentionAnalysisDto = exports.CreateEngagementSurveyDto = exports.CreateTalentAssessmentDto = exports.CreateCompetencyFrameworkDto = exports.CreateSuccessionPlanDto = exports.CreateWorkforcePlanDto = exports.ReviewStatus = exports.PlanningScenario = exports.PotentialRating = exports.PerformanceRating = exports.InterventionType = exports.DevelopmentPriority = exports.FlightRisk = exports.EngagementLevel = exports.ProficiencyLevel = exports.SuccessionReadiness = exports.TalentTier = void 0;
exports.createWorkforcePlan = createWorkforcePlan;
exports.calculateWorkforceGap = calculateWorkforceGap;
exports.projectHeadcount = projectHeadcount;
exports.calculateSpanOfControl = calculateSpanOfControl;
exports.createSuccessionPlan = createSuccessionPlan;
exports.calculateBenchStrength = calculateBenchStrength;
exports.identifySuccessionGaps = identifySuccessionGaps;
exports.createCompetencyFramework = createCompetencyFramework;
exports.calculateCompetencyGap = calculateCompetencyGap;
exports.aggregateCompetencyScores = aggregateCompetencyScores;
exports.createTalentAssessment = createTalentAssessment;
exports.build9BoxGrid = build9BoxGrid;
exports.calibratePerformanceRatings = calibratePerformanceRatings;
exports.identifyHighPotentials = identifyHighPotentials;
exports.createEngagementSurvey = createEngagementSurvey;
exports.calculateEngagementIndex = calculateEngagementIndex;
exports.calculateENPS = calculateENPS;
exports.analyzeEngagementTrends = analyzeEngagementTrends;
exports.createRetentionAnalysis = createRetentionAnalysis;
exports.calculateFlightRiskScore = calculateFlightRiskScore;
exports.predictVoluntaryAttrition = predictVoluntaryAttrition;
exports.calculateRetentionCostImpact = calculateRetentionCostImpact;
exports.createDevelopmentPlan = createDevelopmentPlan;
exports.prioritizeDevelopmentInterventions = prioritizeDevelopmentInterventions;
exports.calculateDevelopmentROI = calculateDevelopmentROI;
exports.trackDevelopmentProgress = trackDevelopmentProgress;
exports.createSkillsGap = createSkillsGap;
exports.prioritizeSkillsGaps = prioritizeSkillsGaps;
exports.calculateSkillsSupplyDemand = calculateSkillsSupplyDemand;
exports.recommendSkillsClosureStrategy = recommendSkillsClosureStrategy;
exports.buildTalentPipelineMetrics = buildTalentPipelineMetrics;
exports.calculateDiversityMetrics = calculateDiversityMetrics;
exports.calculateTalentDensity = calculateTalentDensity;
exports.analyzePerformanceDistribution = analyzePerformanceDistribution;
exports.calculateLearningVelocity = calculateLearningVelocity;
exports.modelTalentAcquisitionNeeds = modelTalentAcquisitionNeeds;
exports.calculateTalentMobilityIndex = calculateTalentMobilityIndex;
exports.analyzeCompensationCompetitiveness = analyzeCompensationCompetitiveness;
exports.calculateTimeToFill = calculateTimeToFill;
exports.generateTalentReviewInsights = generateTalentReviewInsights;
exports.calculateWorkforceProductivityIndex = calculateWorkforceProductivityIndex;
exports.modelOrganizationalChangeImpact = modelOrganizationalChangeImpact;
exports.generateWorkforceScenarios = generateWorkforceScenarios;
/**
 * File: /reuse/server/consulting/talent-management-kit.ts
 * Locator: WC-CONS-TALENT-001
 * Purpose: Enterprise-grade Talent Management Kit - workforce planning, succession, competency frameworks, assessments, engagement, retention
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, talent controllers, HR analytics processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 43 production-ready functions for talent management competing with McKinsey, BCG, Bain HR consulting tools
 *
 * LLM Context: Comprehensive talent management utilities for production-ready management consulting applications.
 * Provides workforce planning, succession planning, competency framework design, talent assessment, engagement surveys,
 * retention analysis, learning development plans, skills gap analysis, high-potential identification, performance calibration,
 * talent pipeline analytics, and diversity & inclusion metrics.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Talent tier classifications
 */
var TalentTier;
(function (TalentTier) {
    TalentTier["TOP_PERFORMER"] = "top_performer";
    TalentTier["HIGH_PERFORMER"] = "high_performer";
    TalentTier["SOLID_PERFORMER"] = "solid_performer";
    TalentTier["NEEDS_IMPROVEMENT"] = "needs_improvement";
    TalentTier["UNDERPERFORMER"] = "underperformer";
})(TalentTier || (exports.TalentTier = TalentTier = {}));
/**
 * Succession readiness levels
 */
var SuccessionReadiness;
(function (SuccessionReadiness) {
    SuccessionReadiness["READY_NOW"] = "ready_now";
    SuccessionReadiness["READY_1_2_YEARS"] = "ready_1_2_years";
    SuccessionReadiness["READY_3_5_YEARS"] = "ready_3_5_years";
    SuccessionReadiness["NOT_READY"] = "not_ready";
    SuccessionReadiness["EMERGENCY_ONLY"] = "emergency_only";
})(SuccessionReadiness || (exports.SuccessionReadiness = SuccessionReadiness = {}));
/**
 * Competency proficiency levels
 */
var ProficiencyLevel;
(function (ProficiencyLevel) {
    ProficiencyLevel["EXPERT"] = "expert";
    ProficiencyLevel["ADVANCED"] = "advanced";
    ProficiencyLevel["INTERMEDIATE"] = "intermediate";
    ProficiencyLevel["BASIC"] = "basic";
    ProficiencyLevel["NOVICE"] = "novice";
    ProficiencyLevel["NOT_APPLICABLE"] = "not_applicable";
})(ProficiencyLevel || (exports.ProficiencyLevel = ProficiencyLevel = {}));
/**
 * Engagement survey sentiment
 */
var EngagementLevel;
(function (EngagementLevel) {
    EngagementLevel["HIGHLY_ENGAGED"] = "highly_engaged";
    EngagementLevel["ENGAGED"] = "engaged";
    EngagementLevel["NEUTRAL"] = "neutral";
    EngagementLevel["DISENGAGED"] = "disengaged";
    EngagementLevel["HIGHLY_DISENGAGED"] = "highly_disengaged";
})(EngagementLevel || (exports.EngagementLevel = EngagementLevel = {}));
/**
 * Flight risk categories
 */
var FlightRisk;
(function (FlightRisk) {
    FlightRisk["LOW"] = "low";
    FlightRisk["MODERATE"] = "moderate";
    FlightRisk["HIGH"] = "high";
    FlightRisk["CRITICAL"] = "critical";
})(FlightRisk || (exports.FlightRisk = FlightRisk = {}));
/**
 * Development need priority
 */
var DevelopmentPriority;
(function (DevelopmentPriority) {
    DevelopmentPriority["CRITICAL"] = "critical";
    DevelopmentPriority["HIGH"] = "high";
    DevelopmentPriority["MEDIUM"] = "medium";
    DevelopmentPriority["LOW"] = "low";
})(DevelopmentPriority || (exports.DevelopmentPriority = DevelopmentPriority = {}));
/**
 * Learning intervention types
 */
var InterventionType;
(function (InterventionType) {
    InterventionType["FORMAL_TRAINING"] = "formal_training";
    InterventionType["COACHING"] = "coaching";
    InterventionType["MENTORING"] = "mentoring";
    InterventionType["JOB_ROTATION"] = "job_rotation";
    InterventionType["STRETCH_ASSIGNMENT"] = "stretch_assignment";
    InterventionType["SELF_DIRECTED"] = "self_directed";
    InterventionType["EXTERNAL_COURSE"] = "external_course";
})(InterventionType || (exports.InterventionType = InterventionType = {}));
/**
 * Performance rating scale
 */
var PerformanceRating;
(function (PerformanceRating) {
    PerformanceRating["EXCEPTIONAL"] = "exceptional";
    PerformanceRating["EXCEEDS_EXPECTATIONS"] = "exceeds_expectations";
    PerformanceRating["MEETS_EXPECTATIONS"] = "meets_expectations";
    PerformanceRating["PARTIALLY_MEETS"] = "partially_meets";
    PerformanceRating["DOES_NOT_MEET"] = "does_not_meet";
})(PerformanceRating || (exports.PerformanceRating = PerformanceRating = {}));
/**
 * Potential assessment
 */
var PotentialRating;
(function (PotentialRating) {
    PotentialRating["HIGH_POTENTIAL"] = "high_potential";
    PotentialRating["MEDIUM_POTENTIAL"] = "medium_potential";
    PotentialRating["LOW_POTENTIAL"] = "low_potential";
    PotentialRating["SPECIALIST"] = "specialist";
})(PotentialRating || (exports.PotentialRating = PotentialRating = {}));
/**
 * Workforce planning scenario
 */
var PlanningScenario;
(function (PlanningScenario) {
    PlanningScenario["BASELINE"] = "baseline";
    PlanningScenario["GROWTH"] = "growth";
    PlanningScenario["CONTRACTION"] = "contraction";
    PlanningScenario["TRANSFORMATION"] = "transformation";
    PlanningScenario["ACQUISITION"] = "acquisition";
})(PlanningScenario || (exports.PlanningScenario = PlanningScenario = {}));
/**
 * Talent review status
 */
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["DRAFT"] = "draft";
    ReviewStatus["IN_PROGRESS"] = "in_progress";
    ReviewStatus["COMPLETED"] = "completed";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["ARCHIVED"] = "archived";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
// ============================================================================
// DTO CLASSES
// ============================================================================
/**
 * DTO for creating workforce plan
 */
let CreateWorkforcePlanDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _scenario_decorators;
    let _scenario_initializers = [];
    let _scenario_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _currentHeadcount_decorators;
    let _currentHeadcount_initializers = [];
    let _currentHeadcount_extraInitializers = [];
    let _targetHeadcount_decorators;
    let _targetHeadcount_initializers = [];
    let _targetHeadcount_extraInitializers = [];
    let _hires_decorators;
    let _hires_initializers = [];
    let _hires_extraInitializers = [];
    let _attrition_decorators;
    let _attrition_initializers = [];
    let _attrition_extraInitializers = [];
    let _internalMoves_decorators;
    let _internalMoves_initializers = [];
    let _internalMoves_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateWorkforcePlanDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.departmentId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.scenario = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _scenario_initializers, void 0));
                this.planName = (__runInitializers(this, _scenario_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.description = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.currentHeadcount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _currentHeadcount_initializers, void 0));
                this.targetHeadcount = (__runInitializers(this, _currentHeadcount_extraInitializers), __runInitializers(this, _targetHeadcount_initializers, void 0));
                this.hires = (__runInitializers(this, _targetHeadcount_extraInitializers), __runInitializers(this, _hires_initializers, void 0));
                this.attrition = (__runInitializers(this, _hires_extraInitializers), __runInitializers(this, _attrition_initializers, void 0));
                this.internalMoves = (__runInitializers(this, _attrition_extraInitializers), __runInitializers(this, _internalMoves_initializers, void 0));
                this.budget = (__runInitializers(this, _internalMoves_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.assumptions = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                this.metadata = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440000' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _scenario_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planning scenario', enum: PlanningScenario }), (0, class_validator_1.IsEnum)(PlanningScenario), (0, class_validator_1.IsNotEmpty)()];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name', example: '2025 Growth Plan' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _currentHeadcount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current headcount', example: 250 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _targetHeadcount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target headcount', example: 300 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _hires_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned hires', example: 60 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _attrition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected attrition', example: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _internalMoves_decorators = [(0, swagger_1.ApiProperty)({ description: 'Internal moves', example: 5 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget allocation', example: 5000000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planning assumptions' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _scenario_decorators, { kind: "field", name: "scenario", static: false, private: false, access: { has: obj => "scenario" in obj, get: obj => obj.scenario, set: (obj, value) => { obj.scenario = value; } }, metadata: _metadata }, _scenario_initializers, _scenario_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _currentHeadcount_decorators, { kind: "field", name: "currentHeadcount", static: false, private: false, access: { has: obj => "currentHeadcount" in obj, get: obj => obj.currentHeadcount, set: (obj, value) => { obj.currentHeadcount = value; } }, metadata: _metadata }, _currentHeadcount_initializers, _currentHeadcount_extraInitializers);
            __esDecorate(null, null, _targetHeadcount_decorators, { kind: "field", name: "targetHeadcount", static: false, private: false, access: { has: obj => "targetHeadcount" in obj, get: obj => obj.targetHeadcount, set: (obj, value) => { obj.targetHeadcount = value; } }, metadata: _metadata }, _targetHeadcount_initializers, _targetHeadcount_extraInitializers);
            __esDecorate(null, null, _hires_decorators, { kind: "field", name: "hires", static: false, private: false, access: { has: obj => "hires" in obj, get: obj => obj.hires, set: (obj, value) => { obj.hires = value; } }, metadata: _metadata }, _hires_initializers, _hires_extraInitializers);
            __esDecorate(null, null, _attrition_decorators, { kind: "field", name: "attrition", static: false, private: false, access: { has: obj => "attrition" in obj, get: obj => obj.attrition, set: (obj, value) => { obj.attrition = value; } }, metadata: _metadata }, _attrition_initializers, _attrition_extraInitializers);
            __esDecorate(null, null, _internalMoves_decorators, { kind: "field", name: "internalMoves", static: false, private: false, access: { has: obj => "internalMoves" in obj, get: obj => obj.internalMoves, set: (obj, value) => { obj.internalMoves = value; } }, metadata: _metadata }, _internalMoves_initializers, _internalMoves_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWorkforcePlanDto = CreateWorkforcePlanDto;
/**
 * DTO for creating succession plan
 */
let CreateSuccessionPlanDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _criticalPositionId_decorators;
    let _criticalPositionId_initializers = [];
    let _criticalPositionId_extraInitializers = [];
    let _positionTitle_decorators;
    let _positionTitle_initializers = [];
    let _positionTitle_extraInitializers = [];
    let _incumbentId_decorators;
    let _incumbentId_initializers = [];
    let _incumbentId_extraInitializers = [];
    let _readinessLevel_decorators;
    let _readinessLevel_initializers = [];
    let _readinessLevel_extraInitializers = [];
    let _successors_decorators;
    let _successors_initializers = [];
    let _successors_extraInitializers = [];
    let _riskOfLoss_decorators;
    let _riskOfLoss_initializers = [];
    let _riskOfLoss_extraInitializers = [];
    let _businessImpactScore_decorators;
    let _businessImpactScore_initializers = [];
    let _businessImpactScore_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _nextReviewDate_decorators;
    let _nextReviewDate_initializers = [];
    let _nextReviewDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateSuccessionPlanDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.criticalPositionId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _criticalPositionId_initializers, void 0));
                this.positionTitle = (__runInitializers(this, _criticalPositionId_extraInitializers), __runInitializers(this, _positionTitle_initializers, void 0));
                this.incumbentId = (__runInitializers(this, _positionTitle_extraInitializers), __runInitializers(this, _incumbentId_initializers, void 0));
                this.readinessLevel = (__runInitializers(this, _incumbentId_extraInitializers), __runInitializers(this, _readinessLevel_initializers, void 0));
                this.successors = (__runInitializers(this, _readinessLevel_extraInitializers), __runInitializers(this, _successors_initializers, void 0));
                this.riskOfLoss = (__runInitializers(this, _successors_extraInitializers), __runInitializers(this, _riskOfLoss_initializers, void 0));
                this.businessImpactScore = (__runInitializers(this, _riskOfLoss_extraInitializers), __runInitializers(this, _businessImpactScore_initializers, void 0));
                this.lastReviewDate = (__runInitializers(this, _businessImpactScore_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
                this.nextReviewDate = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _nextReviewDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _nextReviewDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _criticalPositionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical position ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _positionTitle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position title', example: 'VP of Engineering' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _incumbentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current incumbent ID', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _readinessLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Readiness level', enum: SuccessionReadiness }), (0, class_validator_1.IsEnum)(SuccessionReadiness), (0, class_validator_1.IsNotEmpty)()];
            _successors_decorators = [(0, swagger_1.ApiProperty)({ description: 'Potential successors' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _riskOfLoss_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk of incumbent loss', enum: FlightRisk }), (0, class_validator_1.IsEnum)(FlightRisk), (0, class_validator_1.IsNotEmpty)()];
            _businessImpactScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business impact score (0-100)', example: 95 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _lastReviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last review date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _nextReviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next review date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _criticalPositionId_decorators, { kind: "field", name: "criticalPositionId", static: false, private: false, access: { has: obj => "criticalPositionId" in obj, get: obj => obj.criticalPositionId, set: (obj, value) => { obj.criticalPositionId = value; } }, metadata: _metadata }, _criticalPositionId_initializers, _criticalPositionId_extraInitializers);
            __esDecorate(null, null, _positionTitle_decorators, { kind: "field", name: "positionTitle", static: false, private: false, access: { has: obj => "positionTitle" in obj, get: obj => obj.positionTitle, set: (obj, value) => { obj.positionTitle = value; } }, metadata: _metadata }, _positionTitle_initializers, _positionTitle_extraInitializers);
            __esDecorate(null, null, _incumbentId_decorators, { kind: "field", name: "incumbentId", static: false, private: false, access: { has: obj => "incumbentId" in obj, get: obj => obj.incumbentId, set: (obj, value) => { obj.incumbentId = value; } }, metadata: _metadata }, _incumbentId_initializers, _incumbentId_extraInitializers);
            __esDecorate(null, null, _readinessLevel_decorators, { kind: "field", name: "readinessLevel", static: false, private: false, access: { has: obj => "readinessLevel" in obj, get: obj => obj.readinessLevel, set: (obj, value) => { obj.readinessLevel = value; } }, metadata: _metadata }, _readinessLevel_initializers, _readinessLevel_extraInitializers);
            __esDecorate(null, null, _successors_decorators, { kind: "field", name: "successors", static: false, private: false, access: { has: obj => "successors" in obj, get: obj => obj.successors, set: (obj, value) => { obj.successors = value; } }, metadata: _metadata }, _successors_initializers, _successors_extraInitializers);
            __esDecorate(null, null, _riskOfLoss_decorators, { kind: "field", name: "riskOfLoss", static: false, private: false, access: { has: obj => "riskOfLoss" in obj, get: obj => obj.riskOfLoss, set: (obj, value) => { obj.riskOfLoss = value; } }, metadata: _metadata }, _riskOfLoss_initializers, _riskOfLoss_extraInitializers);
            __esDecorate(null, null, _businessImpactScore_decorators, { kind: "field", name: "businessImpactScore", static: false, private: false, access: { has: obj => "businessImpactScore" in obj, get: obj => obj.businessImpactScore, set: (obj, value) => { obj.businessImpactScore = value; } }, metadata: _metadata }, _businessImpactScore_initializers, _businessImpactScore_extraInitializers);
            __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
            __esDecorate(null, null, _nextReviewDate_decorators, { kind: "field", name: "nextReviewDate", static: false, private: false, access: { has: obj => "nextReviewDate" in obj, get: obj => obj.nextReviewDate, set: (obj, value) => { obj.nextReviewDate = value; } }, metadata: _metadata }, _nextReviewDate_initializers, _nextReviewDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSuccessionPlanDto = CreateSuccessionPlanDto;
/**
 * DTO for creating competency framework
 */
let CreateCompetencyFrameworkDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _applicableRoles_decorators;
    let _applicableRoles_initializers = [];
    let _applicableRoles_extraInitializers = [];
    let _competencies_decorators;
    let _competencies_initializers = [];
    let _competencies_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateCompetencyFrameworkDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.name = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.applicableRoles = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _applicableRoles_initializers, void 0));
                this.competencies = (__runInitializers(this, _applicableRoles_extraInitializers), __runInitializers(this, _competencies_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _competencies_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework name', example: 'Engineering Competency Framework' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _applicableRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applicable roles' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _competencies_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competency definitions' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _applicableRoles_decorators, { kind: "field", name: "applicableRoles", static: false, private: false, access: { has: obj => "applicableRoles" in obj, get: obj => obj.applicableRoles, set: (obj, value) => { obj.applicableRoles = value; } }, metadata: _metadata }, _applicableRoles_initializers, _applicableRoles_extraInitializers);
            __esDecorate(null, null, _competencies_decorators, { kind: "field", name: "competencies", static: false, private: false, access: { has: obj => "competencies" in obj, get: obj => obj.competencies, set: (obj, value) => { obj.competencies = value; } }, metadata: _metadata }, _competencies_initializers, _competencies_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompetencyFrameworkDto = CreateCompetencyFrameworkDto;
/**
 * DTO for creating talent assessment
 */
let CreateTalentAssessmentDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _assessmentType_decorators;
    let _assessmentType_initializers = [];
    let _assessmentType_extraInitializers = [];
    let _assessmentDate_decorators;
    let _assessmentDate_initializers = [];
    let _assessmentDate_extraInitializers = [];
    let _performanceRating_decorators;
    let _performanceRating_initializers = [];
    let _performanceRating_extraInitializers = [];
    let _potentialRating_decorators;
    let _potentialRating_initializers = [];
    let _potentialRating_extraInitializers = [];
    let _talentTier_decorators;
    let _talentTier_initializers = [];
    let _talentTier_extraInitializers = [];
    let _competencyScores_decorators;
    let _competencyScores_initializers = [];
    let _competencyScores_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _developmentAreas_decorators;
    let _developmentAreas_initializers = [];
    let _developmentAreas_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _assessorId_decorators;
    let _assessorId_initializers = [];
    let _assessorId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateTalentAssessmentDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.assessmentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _assessmentType_initializers, void 0));
                this.assessmentDate = (__runInitializers(this, _assessmentType_extraInitializers), __runInitializers(this, _assessmentDate_initializers, void 0));
                this.performanceRating = (__runInitializers(this, _assessmentDate_extraInitializers), __runInitializers(this, _performanceRating_initializers, void 0));
                this.potentialRating = (__runInitializers(this, _performanceRating_extraInitializers), __runInitializers(this, _potentialRating_initializers, void 0));
                this.talentTier = (__runInitializers(this, _potentialRating_extraInitializers), __runInitializers(this, _talentTier_initializers, void 0));
                this.competencyScores = (__runInitializers(this, _talentTier_extraInitializers), __runInitializers(this, _competencyScores_initializers, void 0));
                this.strengths = (__runInitializers(this, _competencyScores_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.developmentAreas = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _developmentAreas_initializers, void 0));
                this.overallScore = (__runInitializers(this, _developmentAreas_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
                this.assessorId = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _assessorId_initializers, void 0));
                this.metadata = (__runInitializers(this, _assessorId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _assessmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment type' }), (0, class_validator_1.IsEnum)(['performance', 'potential', '360', 'competency', 'psychometric']), (0, class_validator_1.IsNotEmpty)()];
            _assessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _performanceRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance rating', enum: PerformanceRating, required: false }), (0, class_validator_1.IsEnum)(PerformanceRating), (0, class_validator_1.IsOptional)()];
            _potentialRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Potential rating', enum: PotentialRating, required: false }), (0, class_validator_1.IsEnum)(PotentialRating), (0, class_validator_1.IsOptional)()];
            _talentTier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Talent tier', enum: TalentTier }), (0, class_validator_1.IsEnum)(TalentTier), (0, class_validator_1.IsNotEmpty)()];
            _competencyScores_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competency scores' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Key strengths' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _developmentAreas_decorators = [(0, swagger_1.ApiProperty)({ description: 'Development areas' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _overallScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall assessment score (0-100)', example: 85 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _assessorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessor ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _assessmentType_decorators, { kind: "field", name: "assessmentType", static: false, private: false, access: { has: obj => "assessmentType" in obj, get: obj => obj.assessmentType, set: (obj, value) => { obj.assessmentType = value; } }, metadata: _metadata }, _assessmentType_initializers, _assessmentType_extraInitializers);
            __esDecorate(null, null, _assessmentDate_decorators, { kind: "field", name: "assessmentDate", static: false, private: false, access: { has: obj => "assessmentDate" in obj, get: obj => obj.assessmentDate, set: (obj, value) => { obj.assessmentDate = value; } }, metadata: _metadata }, _assessmentDate_initializers, _assessmentDate_extraInitializers);
            __esDecorate(null, null, _performanceRating_decorators, { kind: "field", name: "performanceRating", static: false, private: false, access: { has: obj => "performanceRating" in obj, get: obj => obj.performanceRating, set: (obj, value) => { obj.performanceRating = value; } }, metadata: _metadata }, _performanceRating_initializers, _performanceRating_extraInitializers);
            __esDecorate(null, null, _potentialRating_decorators, { kind: "field", name: "potentialRating", static: false, private: false, access: { has: obj => "potentialRating" in obj, get: obj => obj.potentialRating, set: (obj, value) => { obj.potentialRating = value; } }, metadata: _metadata }, _potentialRating_initializers, _potentialRating_extraInitializers);
            __esDecorate(null, null, _talentTier_decorators, { kind: "field", name: "talentTier", static: false, private: false, access: { has: obj => "talentTier" in obj, get: obj => obj.talentTier, set: (obj, value) => { obj.talentTier = value; } }, metadata: _metadata }, _talentTier_initializers, _talentTier_extraInitializers);
            __esDecorate(null, null, _competencyScores_decorators, { kind: "field", name: "competencyScores", static: false, private: false, access: { has: obj => "competencyScores" in obj, get: obj => obj.competencyScores, set: (obj, value) => { obj.competencyScores = value; } }, metadata: _metadata }, _competencyScores_initializers, _competencyScores_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _developmentAreas_decorators, { kind: "field", name: "developmentAreas", static: false, private: false, access: { has: obj => "developmentAreas" in obj, get: obj => obj.developmentAreas, set: (obj, value) => { obj.developmentAreas = value; } }, metadata: _metadata }, _developmentAreas_initializers, _developmentAreas_extraInitializers);
            __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
            __esDecorate(null, null, _assessorId_decorators, { kind: "field", name: "assessorId", static: false, private: false, access: { has: obj => "assessorId" in obj, get: obj => obj.assessorId, set: (obj, value) => { obj.assessorId = value; } }, metadata: _metadata }, _assessorId_initializers, _assessorId_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTalentAssessmentDto = CreateTalentAssessmentDto;
/**
 * DTO for engagement survey
 */
let CreateEngagementSurveyDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _surveyDate_decorators;
    let _surveyDate_initializers = [];
    let _surveyDate_extraInitializers = [];
    let _overallEngagement_decorators;
    let _overallEngagement_initializers = [];
    let _overallEngagement_extraInitializers = [];
    let _engagementScore_decorators;
    let _engagementScore_initializers = [];
    let _engagementScore_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _eNPS_decorators;
    let _eNPS_initializers = [];
    let _eNPS_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _flightRisk_decorators;
    let _flightRisk_initializers = [];
    let _flightRisk_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateEngagementSurveyDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.surveyDate = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _surveyDate_initializers, void 0));
                this.overallEngagement = (__runInitializers(this, _surveyDate_extraInitializers), __runInitializers(this, _overallEngagement_initializers, void 0));
                this.engagementScore = (__runInitializers(this, _overallEngagement_extraInitializers), __runInitializers(this, _engagementScore_initializers, void 0));
                this.dimensions = (__runInitializers(this, _engagementScore_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
                this.eNPS = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _eNPS_initializers, void 0));
                this.comments = (__runInitializers(this, _eNPS_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.flightRisk = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _flightRisk_initializers, void 0));
                this.metadata = (__runInitializers(this, _flightRisk_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _surveyDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Survey date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _overallEngagement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall engagement level', enum: EngagementLevel }), (0, class_validator_1.IsEnum)(EngagementLevel), (0, class_validator_1.IsNotEmpty)()];
            _engagementScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement score (0-100)', example: 78 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement dimensions with scores' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _eNPS_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee Net Promoter Score (-100 to 100)', example: 50 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-100), (0, class_validator_1.Max)(100)];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optional comments', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _flightRisk_decorators = [(0, swagger_1.ApiProperty)({ description: 'Flight risk assessment', enum: FlightRisk }), (0, class_validator_1.IsEnum)(FlightRisk), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _surveyDate_decorators, { kind: "field", name: "surveyDate", static: false, private: false, access: { has: obj => "surveyDate" in obj, get: obj => obj.surveyDate, set: (obj, value) => { obj.surveyDate = value; } }, metadata: _metadata }, _surveyDate_initializers, _surveyDate_extraInitializers);
            __esDecorate(null, null, _overallEngagement_decorators, { kind: "field", name: "overallEngagement", static: false, private: false, access: { has: obj => "overallEngagement" in obj, get: obj => obj.overallEngagement, set: (obj, value) => { obj.overallEngagement = value; } }, metadata: _metadata }, _overallEngagement_initializers, _overallEngagement_extraInitializers);
            __esDecorate(null, null, _engagementScore_decorators, { kind: "field", name: "engagementScore", static: false, private: false, access: { has: obj => "engagementScore" in obj, get: obj => obj.engagementScore, set: (obj, value) => { obj.engagementScore = value; } }, metadata: _metadata }, _engagementScore_initializers, _engagementScore_extraInitializers);
            __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
            __esDecorate(null, null, _eNPS_decorators, { kind: "field", name: "eNPS", static: false, private: false, access: { has: obj => "eNPS" in obj, get: obj => obj.eNPS, set: (obj, value) => { obj.eNPS = value; } }, metadata: _metadata }, _eNPS_initializers, _eNPS_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _flightRisk_decorators, { kind: "field", name: "flightRisk", static: false, private: false, access: { has: obj => "flightRisk" in obj, get: obj => obj.flightRisk, set: (obj, value) => { obj.flightRisk = value; } }, metadata: _metadata }, _flightRisk_initializers, _flightRisk_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEngagementSurveyDto = CreateEngagementSurveyDto;
/**
 * DTO for retention analysis
 */
let CreateRetentionAnalysisDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _flightRisk_decorators;
    let _flightRisk_initializers = [];
    let _flightRisk_extraInitializers = [];
    let _riskScore_decorators;
    let _riskScore_initializers = [];
    let _riskScore_extraInitializers = [];
    let _riskFactors_decorators;
    let _riskFactors_initializers = [];
    let _riskFactors_extraInitializers = [];
    let _tenureMonths_decorators;
    let _tenureMonths_initializers = [];
    let _tenureMonths_extraInitializers = [];
    let _lastPromotion_decorators;
    let _lastPromotion_initializers = [];
    let _lastPromotion_extraInitializers = [];
    let _lastRaise_decorators;
    let _lastRaise_initializers = [];
    let _lastRaise_extraInitializers = [];
    let _engagementTrend_decorators;
    let _engagementTrend_initializers = [];
    let _engagementTrend_extraInitializers = [];
    let _retentionRecommendations_decorators;
    let _retentionRecommendations_initializers = [];
    let _retentionRecommendations_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateRetentionAnalysisDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.flightRisk = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _flightRisk_initializers, void 0));
                this.riskScore = (__runInitializers(this, _flightRisk_extraInitializers), __runInitializers(this, _riskScore_initializers, void 0));
                this.riskFactors = (__runInitializers(this, _riskScore_extraInitializers), __runInitializers(this, _riskFactors_initializers, void 0));
                this.tenureMonths = (__runInitializers(this, _riskFactors_extraInitializers), __runInitializers(this, _tenureMonths_initializers, void 0));
                this.lastPromotion = (__runInitializers(this, _tenureMonths_extraInitializers), __runInitializers(this, _lastPromotion_initializers, void 0));
                this.lastRaise = (__runInitializers(this, _lastPromotion_extraInitializers), __runInitializers(this, _lastRaise_initializers, void 0));
                this.engagementTrend = (__runInitializers(this, _lastRaise_extraInitializers), __runInitializers(this, _engagementTrend_initializers, void 0));
                this.retentionRecommendations = (__runInitializers(this, _engagementTrend_extraInitializers), __runInitializers(this, _retentionRecommendations_initializers, void 0));
                this.metadata = (__runInitializers(this, _retentionRecommendations_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _flightRisk_decorators = [(0, swagger_1.ApiProperty)({ description: 'Flight risk level', enum: FlightRisk }), (0, class_validator_1.IsEnum)(FlightRisk), (0, class_validator_1.IsNotEmpty)()];
            _riskScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk score (0-100)', example: 65 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _riskFactors_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk factors with weights' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _tenureMonths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tenure in months', example: 36 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lastPromotion_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last promotion date', required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _lastRaise_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last raise date', required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _engagementTrend_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement trend' }), (0, class_validator_1.IsEnum)(['increasing', 'stable', 'declining']), (0, class_validator_1.IsNotEmpty)()];
            _retentionRecommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retention recommendations' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _flightRisk_decorators, { kind: "field", name: "flightRisk", static: false, private: false, access: { has: obj => "flightRisk" in obj, get: obj => obj.flightRisk, set: (obj, value) => { obj.flightRisk = value; } }, metadata: _metadata }, _flightRisk_initializers, _flightRisk_extraInitializers);
            __esDecorate(null, null, _riskScore_decorators, { kind: "field", name: "riskScore", static: false, private: false, access: { has: obj => "riskScore" in obj, get: obj => obj.riskScore, set: (obj, value) => { obj.riskScore = value; } }, metadata: _metadata }, _riskScore_initializers, _riskScore_extraInitializers);
            __esDecorate(null, null, _riskFactors_decorators, { kind: "field", name: "riskFactors", static: false, private: false, access: { has: obj => "riskFactors" in obj, get: obj => obj.riskFactors, set: (obj, value) => { obj.riskFactors = value; } }, metadata: _metadata }, _riskFactors_initializers, _riskFactors_extraInitializers);
            __esDecorate(null, null, _tenureMonths_decorators, { kind: "field", name: "tenureMonths", static: false, private: false, access: { has: obj => "tenureMonths" in obj, get: obj => obj.tenureMonths, set: (obj, value) => { obj.tenureMonths = value; } }, metadata: _metadata }, _tenureMonths_initializers, _tenureMonths_extraInitializers);
            __esDecorate(null, null, _lastPromotion_decorators, { kind: "field", name: "lastPromotion", static: false, private: false, access: { has: obj => "lastPromotion" in obj, get: obj => obj.lastPromotion, set: (obj, value) => { obj.lastPromotion = value; } }, metadata: _metadata }, _lastPromotion_initializers, _lastPromotion_extraInitializers);
            __esDecorate(null, null, _lastRaise_decorators, { kind: "field", name: "lastRaise", static: false, private: false, access: { has: obj => "lastRaise" in obj, get: obj => obj.lastRaise, set: (obj, value) => { obj.lastRaise = value; } }, metadata: _metadata }, _lastRaise_initializers, _lastRaise_extraInitializers);
            __esDecorate(null, null, _engagementTrend_decorators, { kind: "field", name: "engagementTrend", static: false, private: false, access: { has: obj => "engagementTrend" in obj, get: obj => obj.engagementTrend, set: (obj, value) => { obj.engagementTrend = value; } }, metadata: _metadata }, _engagementTrend_initializers, _engagementTrend_extraInitializers);
            __esDecorate(null, null, _retentionRecommendations_decorators, { kind: "field", name: "retentionRecommendations", static: false, private: false, access: { has: obj => "retentionRecommendations" in obj, get: obj => obj.retentionRecommendations, set: (obj, value) => { obj.retentionRecommendations = value; } }, metadata: _metadata }, _retentionRecommendations_initializers, _retentionRecommendations_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRetentionAnalysisDto = CreateRetentionAnalysisDto;
/**
 * DTO for development plan
 */
let CreateDevelopmentPlanDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _competencyGaps_decorators;
    let _competencyGaps_initializers = [];
    let _competencyGaps_extraInitializers = [];
    let _interventions_decorators;
    let _interventions_initializers = [];
    let _interventions_extraInitializers = [];
    let _budget_decorators;
    let _budget_initializers = [];
    let _budget_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _progress_decorators;
    let _progress_initializers = [];
    let _progress_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateDevelopmentPlanDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.planName = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.objectives = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.competencyGaps = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _competencyGaps_initializers, void 0));
                this.interventions = (__runInitializers(this, _competencyGaps_extraInitializers), __runInitializers(this, _interventions_initializers, void 0));
                this.budget = (__runInitializers(this, _interventions_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.startDate = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.progress = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _progress_initializers, void 0));
                this.metadata = (__runInitializers(this, _progress_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name', example: 'Leadership Development Plan 2025' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Development objectives' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _competencyGaps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competency gaps to address' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _interventions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Learning interventions' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _budget_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total budget', example: 15000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _progress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current progress (0-100)', example: 35 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _competencyGaps_decorators, { kind: "field", name: "competencyGaps", static: false, private: false, access: { has: obj => "competencyGaps" in obj, get: obj => obj.competencyGaps, set: (obj, value) => { obj.competencyGaps = value; } }, metadata: _metadata }, _competencyGaps_initializers, _competencyGaps_extraInitializers);
            __esDecorate(null, null, _interventions_decorators, { kind: "field", name: "interventions", static: false, private: false, access: { has: obj => "interventions" in obj, get: obj => obj.interventions, set: (obj, value) => { obj.interventions = value; } }, metadata: _metadata }, _interventions_initializers, _interventions_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: obj => "budget" in obj, get: obj => obj.budget, set: (obj, value) => { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: obj => "progress" in obj, get: obj => obj.progress, set: (obj, value) => { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDevelopmentPlanDto = CreateDevelopmentPlanDto;
/**
 * DTO for skills gap analysis
 */
let CreateSkillsGapDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _skillCategory_decorators;
    let _skillCategory_initializers = [];
    let _skillCategory_extraInitializers = [];
    let _skillName_decorators;
    let _skillName_initializers = [];
    let _skillName_extraInitializers = [];
    let _currentSupply_decorators;
    let _currentSupply_initializers = [];
    let _currentSupply_extraInitializers = [];
    let _requiredDemand_decorators;
    let _requiredDemand_initializers = [];
    let _requiredDemand_extraInitializers = [];
    let _criticalityScore_decorators;
    let _criticalityScore_initializers = [];
    let _criticalityScore_extraInitializers = [];
    let _timeToFill_decorators;
    let _timeToFill_initializers = [];
    let _timeToFill_extraInitializers = [];
    let _closureStrategy_decorators;
    let _closureStrategy_initializers = [];
    let _closureStrategy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateSkillsGapDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.departmentId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.skillCategory = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _skillCategory_initializers, void 0));
                this.skillName = (__runInitializers(this, _skillCategory_extraInitializers), __runInitializers(this, _skillName_initializers, void 0));
                this.currentSupply = (__runInitializers(this, _skillName_extraInitializers), __runInitializers(this, _currentSupply_initializers, void 0));
                this.requiredDemand = (__runInitializers(this, _currentSupply_extraInitializers), __runInitializers(this, _requiredDemand_initializers, void 0));
                this.criticalityScore = (__runInitializers(this, _requiredDemand_extraInitializers), __runInitializers(this, _criticalityScore_initializers, void 0));
                this.timeToFill = (__runInitializers(this, _criticalityScore_extraInitializers), __runInitializers(this, _timeToFill_initializers, void 0));
                this.closureStrategy = (__runInitializers(this, _timeToFill_extraInitializers), __runInitializers(this, _closureStrategy_initializers, void 0));
                this.metadata = (__runInitializers(this, _closureStrategy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _skillCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Skill category', example: 'Technical Skills' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _skillName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Skill name', example: 'Machine Learning' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _currentSupply_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current supply (number of employees)', example: 12 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _requiredDemand_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required demand', example: 20 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _criticalityScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Criticality score (0-100)', example: 85 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _timeToFill_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time to fill gap (months)', example: 6 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _closureStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gap closure strategy' }), (0, class_validator_1.IsEnum)(['hire', 'develop', 'contract', 'automate']), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _skillCategory_decorators, { kind: "field", name: "skillCategory", static: false, private: false, access: { has: obj => "skillCategory" in obj, get: obj => obj.skillCategory, set: (obj, value) => { obj.skillCategory = value; } }, metadata: _metadata }, _skillCategory_initializers, _skillCategory_extraInitializers);
            __esDecorate(null, null, _skillName_decorators, { kind: "field", name: "skillName", static: false, private: false, access: { has: obj => "skillName" in obj, get: obj => obj.skillName, set: (obj, value) => { obj.skillName = value; } }, metadata: _metadata }, _skillName_initializers, _skillName_extraInitializers);
            __esDecorate(null, null, _currentSupply_decorators, { kind: "field", name: "currentSupply", static: false, private: false, access: { has: obj => "currentSupply" in obj, get: obj => obj.currentSupply, set: (obj, value) => { obj.currentSupply = value; } }, metadata: _metadata }, _currentSupply_initializers, _currentSupply_extraInitializers);
            __esDecorate(null, null, _requiredDemand_decorators, { kind: "field", name: "requiredDemand", static: false, private: false, access: { has: obj => "requiredDemand" in obj, get: obj => obj.requiredDemand, set: (obj, value) => { obj.requiredDemand = value; } }, metadata: _metadata }, _requiredDemand_initializers, _requiredDemand_extraInitializers);
            __esDecorate(null, null, _criticalityScore_decorators, { kind: "field", name: "criticalityScore", static: false, private: false, access: { has: obj => "criticalityScore" in obj, get: obj => obj.criticalityScore, set: (obj, value) => { obj.criticalityScore = value; } }, metadata: _metadata }, _criticalityScore_initializers, _criticalityScore_extraInitializers);
            __esDecorate(null, null, _timeToFill_decorators, { kind: "field", name: "timeToFill", static: false, private: false, access: { has: obj => "timeToFill" in obj, get: obj => obj.timeToFill, set: (obj, value) => { obj.timeToFill = value; } }, metadata: _metadata }, _timeToFill_initializers, _timeToFill_extraInitializers);
            __esDecorate(null, null, _closureStrategy_decorators, { kind: "field", name: "closureStrategy", static: false, private: false, access: { has: obj => "closureStrategy" in obj, get: obj => obj.closureStrategy, set: (obj, value) => { obj.closureStrategy = value; } }, metadata: _metadata }, _closureStrategy_initializers, _closureStrategy_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSkillsGapDto = CreateSkillsGapDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Workforce Plan Model
 */
class WorkforcePlanModel extends sequelize_1.Model {
    static initialize(sequelize) {
        WorkforcePlanModel.init({
            planId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            departmentId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            scenario: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PlanningScenario)),
                allowNull: false,
            },
            planName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            currentHeadcount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            targetHeadcount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            hires: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            attrition: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            internalMoves: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            budget: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(ReviewStatus)),
                allowNull: false,
                defaultValue: ReviewStatus.DRAFT,
            },
            assumptions: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'workforce_plans',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['departmentId'] },
                { fields: ['scenario'] },
                { fields: ['startDate', 'endDate'] },
            ],
        });
        return WorkforcePlanModel;
    }
}
exports.WorkforcePlanModel = WorkforcePlanModel;
/**
 * Succession Plan Model
 */
class SuccessionPlanModel extends sequelize_1.Model {
    static initialize(sequelize) {
        SuccessionPlanModel.init({
            successionId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            criticalPositionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            positionTitle: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            incumbentId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            readinessLevel: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(SuccessionReadiness)),
                allowNull: false,
            },
            successors: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
                defaultValue: [],
            },
            riskOfLoss: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(FlightRisk)),
                allowNull: false,
            },
            businessImpactScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            lastReviewDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            nextReviewDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(ReviewStatus)),
                allowNull: false,
                defaultValue: ReviewStatus.DRAFT,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'succession_plans',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['criticalPositionId'] },
                { fields: ['incumbentId'] },
                { fields: ['riskOfLoss'] },
                { fields: ['nextReviewDate'] },
            ],
        });
        return SuccessionPlanModel;
    }
}
exports.SuccessionPlanModel = SuccessionPlanModel;
/**
 * Competency Framework Model
 */
class CompetencyFrameworkModel extends sequelize_1.Model {
    static initialize(sequelize) {
        CompetencyFrameworkModel.init({
            frameworkId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            applicableRoles: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: false,
                defaultValue: [],
            },
            competencies: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'competency_frameworks',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['isActive'] },
                { fields: ['effectiveDate'] },
            ],
        });
        return CompetencyFrameworkModel;
    }
}
exports.CompetencyFrameworkModel = CompetencyFrameworkModel;
/**
 * Talent Assessment Model
 */
class TalentAssessmentModel extends sequelize_1.Model {
    static initialize(sequelize) {
        TalentAssessmentModel.init({
            assessmentId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            employeeId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            assessmentType: {
                type: sequelize_1.DataTypes.ENUM('performance', 'potential', '360', 'competency', 'psychometric'),
                allowNull: false,
            },
            assessmentDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            performanceRating: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PerformanceRating)),
                allowNull: true,
            },
            potentialRating: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PotentialRating)),
                allowNull: true,
            },
            talentTier: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(TalentTier)),
                allowNull: false,
            },
            competencyScores: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            strengths: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            developmentAreas: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            overallScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            assessorId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'talent_assessments',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['employeeId'] },
                { fields: ['assessmentType'] },
                { fields: ['talentTier'] },
                { fields: ['assessmentDate'] },
            ],
        });
        return TalentAssessmentModel;
    }
}
exports.TalentAssessmentModel = TalentAssessmentModel;
/**
 * Engagement Survey Model
 */
class EngagementSurveyModel extends sequelize_1.Model {
    static initialize(sequelize) {
        EngagementSurveyModel.init({
            surveyId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            employeeId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            surveyDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            overallEngagement: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(EngagementLevel)),
                allowNull: false,
            },
            engagementScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            dimensions: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            eNPS: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            comments: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            flightRisk: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(FlightRisk)),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'engagement_surveys',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['employeeId'] },
                { fields: ['surveyDate'] },
                { fields: ['overallEngagement'] },
                { fields: ['flightRisk'] },
            ],
        });
        return EngagementSurveyModel;
    }
}
exports.EngagementSurveyModel = EngagementSurveyModel;
/**
 * Retention Analysis Model
 */
class RetentionAnalysisModel extends sequelize_1.Model {
    static initialize(sequelize) {
        RetentionAnalysisModel.init({
            analysisId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            employeeId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            flightRisk: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(FlightRisk)),
                allowNull: false,
            },
            riskScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            riskFactors: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            tenureMonths: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            lastPromotion: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            lastRaise: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            engagementTrend: {
                type: sequelize_1.DataTypes.ENUM('increasing', 'stable', 'declining'),
                allowNull: false,
            },
            retentionRecommendations: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'retention_analyses',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['employeeId'] },
                { fields: ['flightRisk'] },
                { fields: ['analysisDate'] },
            ],
        });
        return RetentionAnalysisModel;
    }
}
exports.RetentionAnalysisModel = RetentionAnalysisModel;
/**
 * Development Plan Model
 */
class DevelopmentPlanModel extends sequelize_1.Model {
    static initialize(sequelize) {
        DevelopmentPlanModel.init({
            planId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            employeeId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            planName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            objectives: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            competencyGaps: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            interventions: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            budget: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            startDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            progress: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(ReviewStatus)),
                allowNull: false,
                defaultValue: ReviewStatus.DRAFT,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'development_plans',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['employeeId'] },
                { fields: ['status'] },
                { fields: ['startDate', 'endDate'] },
            ],
        });
        return DevelopmentPlanModel;
    }
}
exports.DevelopmentPlanModel = DevelopmentPlanModel;
/**
 * Skills Gap Model
 */
class SkillsGapModel extends sequelize_1.Model {
    static initialize(sequelize) {
        SkillsGapModel.init({
            gapId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            departmentId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            skillCategory: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            skillName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            currentSupply: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            requiredDemand: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            gap: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            gapPercent: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            criticalityScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            timeToFill: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            closureStrategy: {
                type: sequelize_1.DataTypes.ENUM('hire', 'develop', 'contract', 'automate'),
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'skills_gaps',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['departmentId'] },
                { fields: ['skillCategory'] },
                { fields: ['criticalityScore'] },
                { fields: ['analysisDate'] },
            ],
        });
        return SkillsGapModel;
    }
}
exports.SkillsGapModel = SkillsGapModel;
// ============================================================================
// TALENT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * 1. Create workforce plan
 */
async function createWorkforcePlan(dto, transaction) {
    return await WorkforcePlanModel.create({
        planId: '',
        ...dto,
        status: ReviewStatus.DRAFT,
    }, { transaction });
}
/**
 * 2. Calculate workforce gap
 */
function calculateWorkforceGap(current, target, attrition) {
    const attritionImpact = current * (attrition / 100);
    const netGap = target - current;
    const totalNeed = netGap + attritionImpact;
    return { netGap, totalNeed, attritionImpact };
}
/**
 * 3. Project headcount over time
 */
function projectHeadcount(baseline, monthlyHires, monthlyAttritionRate, months) {
    const projections = [];
    let currentHeadcount = baseline;
    for (let month = 1; month <= months; month++) {
        const attrition = Math.round(currentHeadcount * monthlyAttritionRate);
        const hires = monthlyHires;
        currentHeadcount = currentHeadcount + hires - attrition;
        projections.push({ month, headcount: currentHeadcount, hires, attrition });
    }
    return projections;
}
/**
 * 4. Calculate span of control metrics
 */
function calculateSpanOfControl(managers, directReports) {
    const avgSpan = managers > 0 ? directReports / managers : 0;
    let recommendation;
    if (avgSpan < 5) {
        recommendation = 'narrow';
    }
    else if (avgSpan >= 5 && avgSpan <= 9) {
        recommendation = 'optimal';
    }
    else {
        recommendation = 'wide';
    }
    const efficiency = Math.min(100, (avgSpan / 7) * 100);
    return { avgSpan, recommendation, efficiency };
}
/**
 * 5. Create succession plan
 */
async function createSuccessionPlan(dto, transaction) {
    return await SuccessionPlanModel.create({
        successionId: '',
        ...dto,
        status: ReviewStatus.DRAFT,
    }, { transaction });
}
/**
 * 6. Calculate succession bench strength
 */
function calculateBenchStrength(criticalPositions, readyNowSuccessors, ready1to2Successors) {
    const totalReadySuccessors = readyNowSuccessors + ready1to2Successors * 0.7;
    const coverageRatio = criticalPositions > 0 ? totalReadySuccessors / criticalPositions : 0;
    const benchStrength = Math.min(100, coverageRatio * 100);
    let riskLevel;
    if (coverageRatio >= 2) {
        riskLevel = 'low';
    }
    else if (coverageRatio >= 1) {
        riskLevel = 'medium';
    }
    else {
        riskLevel = 'high';
    }
    return { benchStrength, coverageRatio, riskLevel };
}
/**
 * 7. Identify succession gaps
 */
async function identifySuccessionGaps(organizationId) {
    const plans = await SuccessionPlanModel.findAll({
        where: { organizationId, status: ReviewStatus.APPROVED },
    });
    return plans
        .map((plan) => {
        const readyNow = plan.successors.filter((s) => s.readiness === SuccessionReadiness.READY_NOW).length;
        const successorCount = plan.successors.length;
        let gapSeverity;
        if (readyNow === 0 && plan.businessImpactScore > 80) {
            gapSeverity = 'critical';
        }
        else if (readyNow < 2 && plan.businessImpactScore > 60) {
            gapSeverity = 'high';
        }
        else {
            gapSeverity = 'medium';
        }
        return {
            positionId: plan.criticalPositionId,
            title: plan.positionTitle,
            successorCount,
            readyNow,
            gapSeverity,
        };
    })
        .filter((gap) => gap.readyNow < 2)
        .sort((a, b) => {
        const severityOrder = { critical: 3, high: 2, medium: 1 };
        return severityOrder[b.gapSeverity] - severityOrder[a.gapSeverity];
    });
}
/**
 * 8. Create competency framework
 */
async function createCompetencyFramework(dto, transaction) {
    return await CompetencyFrameworkModel.create({
        frameworkId: '',
        ...dto,
        isActive: true,
    }, { transaction });
}
/**
 * 9. Calculate competency gap score
 */
function calculateCompetencyGap(currentLevel, requiredLevel) {
    const proficiencyMap = {
        [ProficiencyLevel.NOVICE]: 1,
        [ProficiencyLevel.BASIC]: 2,
        [ProficiencyLevel.INTERMEDIATE]: 3,
        [ProficiencyLevel.ADVANCED]: 4,
        [ProficiencyLevel.EXPERT]: 5,
        [ProficiencyLevel.NOT_APPLICABLE]: 0,
    };
    const currentScore = proficiencyMap[currentLevel];
    const requiredScore = proficiencyMap[requiredLevel];
    const gapScore = Math.max(0, requiredScore - currentScore);
    let priority;
    if (gapScore >= 3) {
        priority = DevelopmentPriority.CRITICAL;
    }
    else if (gapScore === 2) {
        priority = DevelopmentPriority.HIGH;
    }
    else if (gapScore === 1) {
        priority = DevelopmentPriority.MEDIUM;
    }
    else {
        priority = DevelopmentPriority.LOW;
    }
    return { gapScore, priority };
}
/**
 * 10. Aggregate competency scores
 */
function aggregateCompetencyScores(scores) {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
    const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const distribution = {
        expert: 0,
        advanced: 0,
        intermediate: 0,
        basic: 0,
        novice: 0,
    };
    for (const score of scores) {
        if (score.score >= 90)
            distribution.expert++;
        else if (score.score >= 75)
            distribution.advanced++;
        else if (score.score >= 60)
            distribution.intermediate++;
        else if (score.score >= 40)
            distribution.basic++;
        else
            distribution.novice++;
    }
    return { weightedAverage, totalWeight, distribution };
}
/**
 * 11. Create talent assessment
 */
async function createTalentAssessment(dto, transaction) {
    return await TalentAssessmentModel.create({
        assessmentId: '',
        ...dto,
    }, { transaction });
}
/**
 * 12. Build 9-box grid placement
 */
function build9BoxGrid(performance, potential) {
    const performanceScore = performance === PerformanceRating.EXCEPTIONAL
        ? 3
        : performance === PerformanceRating.EXCEEDS_EXPECTATIONS
            ? 2
            : 1;
    const potentialScore = potential === PotentialRating.HIGH_POTENTIAL ? 3 : potential === PotentialRating.MEDIUM_POTENTIAL ? 2 : 1;
    const boxMap = {
        '3-3': { category: 'Star / High Potential', talentAction: 'Accelerate development, retain at all costs' },
        '3-2': { category: 'Core Player', talentAction: 'Develop for current role excellence' },
        '3-1': { category: 'Specialist', talentAction: 'Leverage expertise, limited advancement' },
        '2-3': { category: 'Growth Employee', talentAction: 'Invest in development, monitor progress' },
        '2-2': { category: 'Solid Performer', talentAction: 'Maintain performance, selective development' },
        '2-1': { category: 'Effective Contributor', talentAction: 'Support in current role' },
        '1-3': { category: 'Inconsistent Player', talentAction: 'Coach for performance, reassess potential' },
        '1-2': { category: 'Dilemma', talentAction: 'Performance improvement plan required' },
        '1-1': { category: 'Low Performer', talentAction: 'Exit or significant intervention' },
    };
    const box = `${performanceScore}-${potentialScore}`;
    const result = boxMap[box] || { category: 'Unknown', talentAction: 'Review required' };
    return { box, ...result };
}
/**
 * 13. Calculate performance calibration
 */
function calibratePerformanceRatings(ratings, targetDistribution) {
    const sorted = [...ratings].sort((a, b) => b.score - a.score);
    const total = sorted.length;
    const calibratedRatings = [];
    let currentIndex = 0;
    const ratingOrder = [
        PerformanceRating.EXCEPTIONAL,
        PerformanceRating.EXCEEDS_EXPECTATIONS,
        PerformanceRating.MEETS_EXPECTATIONS,
        PerformanceRating.PARTIALLY_MEETS,
        PerformanceRating.DOES_NOT_MEET,
    ];
    for (const rating of ratingOrder) {
        const targetCount = Math.round((targetDistribution[rating] / 100) * total);
        for (let i = 0; i < targetCount && currentIndex < sorted.length; i++) {
            calibratedRatings.push({
                employeeId: sorted[currentIndex].employeeId,
                original: sorted[currentIndex].rating,
                calibrated: rating,
            });
            currentIndex++;
        }
    }
    while (currentIndex < sorted.length) {
        calibratedRatings.push({
            employeeId: sorted[currentIndex].employeeId,
            original: sorted[currentIndex].rating,
            calibrated: PerformanceRating.MEETS_EXPECTATIONS,
        });
        currentIndex++;
    }
    const changes = calibratedRatings.filter((r) => r.original !== r.calibrated).length;
    const deviation = (changes / total) * 100;
    return { calibratedRatings, deviation };
}
/**
 * 14. Identify high potentials
 */
async function identifyHighPotentials(organizationId, criteria) {
    const assessments = await TalentAssessmentModel.findAll({
        where: {
            organizationId,
            overallScore: { [sequelize_1.Op.gte]: criteria.minPerformanceScore },
            potentialRating: criteria.minPotentialRating,
        },
        order: [['overallScore', 'DESC']],
    });
    return assessments.map((assessment) => {
        const reasoning = [];
        if (assessment.overallScore >= 90)
            reasoning.push('Exceptional performance scores');
        if (assessment.potentialRating === PotentialRating.HIGH_POTENTIAL)
            reasoning.push('High potential rating');
        if (assessment.strengths.length >= 5)
            reasoning.push('Multiple validated strengths');
        return {
            employeeId: assessment.employeeId,
            score: Number(assessment.overallScore),
            talentTier: assessment.talentTier,
            reasoning,
        };
    });
}
/**
 * 15. Create engagement survey
 */
async function createEngagementSurvey(dto, transaction) {
    return await EngagementSurveyModel.create({
        surveyId: '',
        ...dto,
    }, { transaction });
}
/**
 * 16. Calculate engagement index
 */
function calculateEngagementIndex(dimensions) {
    const avgScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;
    let level;
    if (avgScore >= 80)
        level = EngagementLevel.HIGHLY_ENGAGED;
    else if (avgScore >= 65)
        level = EngagementLevel.ENGAGED;
    else if (avgScore >= 50)
        level = EngagementLevel.NEUTRAL;
    else if (avgScore >= 35)
        level = EngagementLevel.DISENGAGED;
    else
        level = EngagementLevel.HIGHLY_DISENGAGED;
    const sorted = [...dimensions].sort((a, b) => b.score - a.score);
    const topDimensions = sorted.slice(0, 3).map((d) => d.dimension);
    const bottomDimensions = sorted.slice(-3).map((d) => d.dimension);
    return { index: avgScore, level, topDimensions, bottomDimensions };
}
/**
 * 17. Calculate eNPS (Employee Net Promoter Score)
 */
function calculateENPS(scores) {
    const total = scores.length;
    const promoters = scores.filter((s) => s >= 9).length;
    const passives = scores.filter((s) => s >= 7 && s < 9).length;
    const detractors = scores.filter((s) => s < 7).length;
    const eNPS = total > 0 ? ((promoters - detractors) / total) * 100 : 0;
    const distribution = {
        promotersPercent: (promoters / total) * 100,
        passivesPercent: (passives / total) * 100,
        detractorsPercent: (detractors / total) * 100,
    };
    return { eNPS, promoters, passives, detractors, distribution };
}
/**
 * 18. Analyze engagement trends
 */
async function analyzeEngagementTrends(organizationId, employeeId, months = 12) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    const surveys = await EngagementSurveyModel.findAll({
        where: {
            organizationId,
            employeeId,
            surveyDate: { [sequelize_1.Op.gte]: cutoffDate },
        },
        order: [['surveyDate', 'ASC']],
    });
    if (surveys.length < 2) {
        return { trend: 'stable', changePercent: 0, surveys: surveys.length };
    }
    const firstScore = Number(surveys[0].engagementScore);
    const lastScore = Number(surveys[surveys.length - 1].engagementScore);
    const changePercent = ((lastScore - firstScore) / firstScore) * 100;
    let trend;
    if (changePercent > 5)
        trend = 'improving';
    else if (changePercent < -5)
        trend = 'declining';
    else
        trend = 'stable';
    return { trend, changePercent, surveys: surveys.length };
}
/**
 * 19. Create retention analysis
 */
async function createRetentionAnalysis(dto, transaction) {
    return await RetentionAnalysisModel.create({
        analysisId: '',
        ...dto,
        analysisDate: new Date(),
    }, { transaction });
}
/**
 * 20. Calculate flight risk score
 */
function calculateFlightRiskScore(factors) {
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
    const riskScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    let flightRisk;
    if (riskScore >= 75)
        flightRisk = FlightRisk.CRITICAL;
    else if (riskScore >= 60)
        flightRisk = FlightRisk.HIGH;
    else if (riskScore >= 40)
        flightRisk = FlightRisk.MODERATE;
    else
        flightRisk = FlightRisk.LOW;
    const topFactors = factors
        .map((f) => ({ factor: f.factor, contribution: f.score * f.weight }))
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 5);
    return { riskScore, flightRisk, topFactors };
}
/**
 * 21. Predict voluntary attrition
 */
function predictVoluntaryAttrition(indicators) {
    let probability = 0;
    // Engagement impact
    if (indicators.engagementScore < 50)
        probability += 40;
    else if (indicators.engagementScore < 65)
        probability += 20;
    // Tenure impact (higher risk in early tenure and long tenure)
    if (indicators.tenureMonths < 12)
        probability += 15;
    else if (indicators.tenureMonths > 60)
        probability += 10;
    // Promotion stagnation
    if (indicators.timeSinceLastPromotion > 36)
        probability += 15;
    else if (indicators.timeSinceLastPromotion > 24)
        probability += 10;
    // Compensation stagnation
    if (indicators.timeSinceLastRaise > 18)
        probability += 10;
    else if (indicators.timeSinceLastRaise > 12)
        probability += 5;
    // Performance paradox (high performers more likely to leave if not progressing)
    if ((indicators.performanceRating === PerformanceRating.EXCEPTIONAL ||
        indicators.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS) &&
        indicators.timeSinceLastPromotion > 24) {
        probability += 15;
    }
    const primaryReasons = [];
    const recommendedActions = [];
    if (indicators.engagementScore < 50) {
        primaryReasons.push('Low engagement');
        recommendedActions.push('Conduct stay interview');
    }
    if (indicators.timeSinceLastPromotion > 24) {
        primaryReasons.push('Career stagnation');
        recommendedActions.push('Discuss career path and advancement opportunities');
    }
    if (indicators.timeSinceLastRaise > 12) {
        primaryReasons.push('Compensation concerns');
        recommendedActions.push('Review compensation against market');
    }
    return { attritionProbability: Math.min(100, probability), primaryReasons, recommendedActions };
}
/**
 * 22. Calculate retention cost impact
 */
function calculateRetentionCostImpact(salary, replacementCostMultiplier = 1.5, productivityLossMonths = 3) {
    const replacementCost = salary * replacementCostMultiplier;
    const monthlyProductivity = salary / 12;
    const productivityLoss = monthlyProductivity * productivityLossMonths;
    const totalImpact = replacementCost + productivityLoss;
    return { replacementCost, productivityLoss, totalImpact };
}
/**
 * 23. Create development plan
 */
async function createDevelopmentPlan(dto, transaction) {
    return await DevelopmentPlanModel.create({
        planId: '',
        ...dto,
        status: ReviewStatus.DRAFT,
    }, { transaction });
}
/**
 * 24. Prioritize development interventions
 */
function prioritizeDevelopmentInterventions(gaps) {
    const prioritized = gaps
        .map((gap) => {
        const priorityScore = gap.gap * 0.3 + gap.businessImpact * 0.4 + gap.urgency * 0.3;
        let recommendedIntervention;
        if (gap.gap >= 3 && gap.urgency > 70) {
            recommendedIntervention = InterventionType.FORMAL_TRAINING;
        }
        else if (gap.businessImpact > 80) {
            recommendedIntervention = InterventionType.COACHING;
        }
        else if (gap.gap === 1) {
            recommendedIntervention = InterventionType.SELF_DIRECTED;
        }
        else {
            recommendedIntervention = InterventionType.MENTORING;
        }
        return { competency: gap.competency, priorityScore, rank: 0, recommendedIntervention };
    })
        .sort((a, b) => b.priorityScore - a.priorityScore)
        .map((item, index) => ({ ...item, rank: index + 1 }));
    return prioritized;
}
/**
 * 25. Calculate development ROI
 */
function calculateDevelopmentROI(investment, outcomes) {
    const totalCost = investment.trainingCost + investment.timeInvestmentHours * investment.hourlyRate;
    const annualBenefit = outcomes.productivityGain + outcomes.performanceImprovement + outcomes.retentionImpact;
    const totalBenefit = annualBenefit;
    const roi = totalCost > 0 ? ((totalBenefit - totalCost) / totalCost) * 100 : 0;
    const paybackMonths = totalBenefit > 0 ? (totalCost / totalBenefit) * 12 : 0;
    return { totalCost, totalBenefit, roi, paybackMonths };
}
/**
 * 26. Track development plan progress
 */
async function trackDevelopmentProgress(planId) {
    const plan = await DevelopmentPlanModel.findByPk(planId);
    if (!plan) {
        throw new Error('Development plan not found');
    }
    const completedInterventions = plan.interventions.filter((i) => i.status === 'completed').length;
    const totalInterventions = plan.interventions.length;
    const calculatedProgress = totalInterventions > 0 ? (completedInterventions / totalInterventions) * 100 : 0;
    const now = new Date();
    const totalDuration = plan.endDate.getTime() - plan.startDate.getTime();
    const elapsed = now.getTime() - plan.startDate.getTime();
    const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);
    const onTrack = calculatedProgress >= expectedProgress * 0.9;
    const nextMilestones = plan.interventions
        .filter((i) => i.status !== 'completed' && new Date(i.startDate) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
        .map((i) => i.description)
        .slice(0, 3);
    return {
        overallProgress: calculatedProgress,
        completedInterventions,
        onTrack,
        nextMilestones,
    };
}
/**
 * 27. Create skills gap analysis
 */
async function createSkillsGap(dto, transaction) {
    const gap = dto.requiredDemand - dto.currentSupply;
    const gapPercent = dto.requiredDemand > 0 ? (gap / dto.requiredDemand) * 100 : 0;
    return await SkillsGapModel.create({
        gapId: '',
        ...dto,
        gap,
        gapPercent,
        analysisDate: new Date(),
    }, { transaction });
}
/**
 * 28. Prioritize skills gaps
 */
async function prioritizeSkillsGaps(organizationId) {
    const gaps = await SkillsGapModel.findAll({
        where: { organizationId },
        order: [
            ['criticalityScore', 'DESC'],
            ['gap', 'DESC'],
        ],
    });
    return gaps.map((gap, index) => ({
        skillName: gap.skillName,
        gap: gap.gap,
        criticalityScore: Number(gap.criticalityScore),
        priorityRank: index + 1,
        closureStrategy: gap.closureStrategy,
    }));
}
/**
 * 29. Calculate skills supply-demand ratio
 */
function calculateSkillsSupplyDemand(supply, demand) {
    const ratio = demand > 0 ? supply / demand : supply > 0 ? Infinity : 1;
    let status;
    let actionRequired;
    if (ratio >= 1.2) {
        status = 'surplus';
        actionRequired = 'Consider redeployment or skill diversification';
    }
    else if (ratio >= 0.9) {
        status = 'balanced';
        actionRequired = 'Monitor and maintain current levels';
    }
    else if (ratio >= 0.6) {
        status = 'shortage';
        actionRequired = 'Accelerate hiring or training programs';
    }
    else {
        status = 'critical_shortage';
        actionRequired = 'Immediate action required - hire externally or contract';
    }
    return { ratio, status, actionRequired };
}
/**
 * 30. Recommend skills closure strategy
 */
function recommendSkillsClosureStrategy(gap) {
    let strategy;
    let rationale;
    let estimatedTimeframe;
    if (gap.criticalityScore > 80 && gap.timeToFill < 3) {
        strategy = 'contract';
        rationale = 'Critical need with short timeline requires external contractors';
        estimatedTimeframe = 1;
    }
    else if (gap.currentMarketAvailability > 70 && gap.size > 5) {
        strategy = 'hire';
        rationale = 'Strong market availability supports external hiring';
        estimatedTimeframe = gap.timeToFill;
    }
    else if (gap.size < 5 && gap.timeToFill > 6) {
        strategy = 'develop';
        rationale = 'Small gap with adequate timeline supports internal development';
        estimatedTimeframe = gap.timeToFill;
    }
    else if (gap.criticalityScore < 40) {
        strategy = 'automate';
        rationale = 'Low criticality skill may be automated or eliminated';
        estimatedTimeframe = 6;
    }
    else {
        strategy = 'hire';
        rationale = 'Default to external hiring given constraints';
        estimatedTimeframe = gap.timeToFill;
    }
    return { strategy, rationale, estimatedTimeframe };
}
/**
 * 31. Build talent pipeline metrics
 */
async function buildTalentPipelineMetrics(organizationId) {
    const [successionPlans, assessments] = await Promise.all([
        SuccessionPlanModel.findAll({ where: { organizationId } }),
        TalentAssessmentModel.findAll({
            where: { organizationId, potentialRating: PotentialRating.HIGH_POTENTIAL },
        }),
    ]);
    const readyNowCount = successionPlans.reduce((sum, plan) => sum + plan.successors.filter((s) => s.readiness === SuccessionReadiness.READY_NOW).length, 0);
    const highPotentialCount = assessments.length;
    const criticalRoles = successionPlans.length;
    const criticalRoleCoverage = criticalRoles > 0 ? (readyNowCount / criticalRoles) * 100 : 0;
    const pipelineDepth = highPotentialCount + readyNowCount;
    let pipelineHealth;
    if (criticalRoleCoverage >= 150)
        pipelineHealth = 'strong';
    else if (criticalRoleCoverage >= 80)
        pipelineHealth = 'adequate';
    else
        pipelineHealth = 'weak';
    return {
        pipelineDepth,
        readyNowCount,
        highPotentialCount,
        criticalRoleCoverage,
        pipelineHealth,
    };
}
/**
 * 32. Calculate diversity metrics
 */
function calculateDiversityMetrics(workforce) {
    const total = workforce.length;
    const genderCounts = {};
    const ethnicityCounts = {};
    const ageBuckets = { 'Under 30': 0, '30-40': 0, '40-50': 0, '50-60': 0, 'Over 60': 0 };
    let leadershipCount = 0;
    let diverseLeadership = 0;
    for (const person of workforce) {
        genderCounts[person.gender] = (genderCounts[person.gender] || 0) + 1;
        ethnicityCounts[person.ethnicity] = (ethnicityCounts[person.ethnicity] || 0) + 1;
        if (person.age < 30)
            ageBuckets['Under 30']++;
        else if (person.age < 40)
            ageBuckets['30-40']++;
        else if (person.age < 50)
            ageBuckets['40-50']++;
        else if (person.age < 60)
            ageBuckets['50-60']++;
        else
            ageBuckets['Over 60']++;
        if (person.level.includes('Director') || person.level.includes('VP') || person.level.includes('C-')) {
            leadershipCount++;
            if (person.gender !== 'Male' || person.ethnicity !== 'White') {
                diverseLeadership++;
            }
        }
    }
    const genderDiversity = {};
    for (const [gender, count] of Object.entries(genderCounts)) {
        genderDiversity[gender] = (count / total) * 100;
    }
    const ethnicDiversity = {};
    for (const [ethnicity, count] of Object.entries(ethnicityCounts)) {
        ethnicDiversity[ethnicity] = (count / total) * 100;
    }
    const ageDistribution = {};
    for (const [bucket, count] of Object.entries(ageBuckets)) {
        ageDistribution[bucket] = (count / total) * 100;
    }
    const leadershipDiversity = leadershipCount > 0 ? (diverseLeadership / leadershipCount) * 100 : 0;
    return { genderDiversity, ethnicDiversity, ageDistribution, leadershipDiversity };
}
/**
 * 33. Calculate talent density
 */
function calculateTalentDensity(topPerformers, totalWorkforce) {
    const densityPercent = totalWorkforce > 0 ? (topPerformers / totalWorkforce) * 100 : 0;
    const benchmark = 20; // Industry benchmark: 20% top performers
    let rating;
    if (densityPercent >= 30)
        rating = 'exceptional';
    else if (densityPercent >= 20)
        rating = 'strong';
    else if (densityPercent >= 15)
        rating = 'adequate';
    else
        rating = 'weak';
    return { densityPercent, benchmark, rating };
}
/**
 * 34. Analyze performance distribution
 */
function analyzePerformanceDistribution(ratings) {
    const distribution = {
        [PerformanceRating.EXCEPTIONAL]: 0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
        [PerformanceRating.MEETS_EXPECTATIONS]: 0,
        [PerformanceRating.PARTIALLY_MEETS]: 0,
        [PerformanceRating.DOES_NOT_MEET]: 0,
    };
    const ratingValues = {
        [PerformanceRating.EXCEPTIONAL]: 5,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
        [PerformanceRating.MEETS_EXPECTATIONS]: 3,
        [PerformanceRating.PARTIALLY_MEETS]: 2,
        [PerformanceRating.DOES_NOT_MEET]: 1,
    };
    for (const rating of ratings) {
        distribution[rating] = (distribution[rating] || 0) + 1;
    }
    const total = ratings.length;
    for (const key in distribution) {
        distribution[key] = (distribution[key] / total) * 100;
    }
    const sum = ratings.reduce((acc, rating) => acc + ratingValues[rating], 0);
    const mean = sum / total;
    const sorted = [...ratings].sort((a, b) => ratingValues[a] - ratingValues[b]);
    const median = sorted[Math.floor(sorted.length / 2)];
    let skew;
    if (mean > ratingValues[median] + 0.3)
        skew = 'positive';
    else if (mean < ratingValues[median] - 0.3)
        skew = 'negative';
    else
        skew = 'neutral';
    return { distribution: distribution, mean, median, skew };
}
/**
 * 35. Calculate learning velocity
 */
function calculateLearningVelocity(interventions, competencyGainMonths) {
    const completed = interventions.filter((i) => i.completed).length;
    const total = interventions.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    const interventionsPerMonth = completed / competencyGainMonths;
    const learningVelocity = interventionsPerMonth * (completionRate / 100);
    return { interventionsPerMonth, completionRate, learningVelocity };
}
/**
 * 36. Model talent acquisition needs
 */
function modelTalentAcquisitionNeeds(plan, timeline) {
    const attrition = Math.round(plan.currentHeadcount * (plan.attritionRate / 100));
    const netGrowth = plan.targetHeadcount - plan.currentHeadcount;
    const totalNeed = netGrowth + attrition;
    const internalPromotions = Math.round(totalNeed * (plan.internalMobility / 100));
    const externalHires = totalNeed - internalPromotions;
    const monthlyHiringRate = externalHires / timeline;
    const recruitingCapacityNeeded = Math.ceil(externalHires / 50); // Assume 1 recruiter per 50 hires/year
    return { externalHires, internalPromotions, monthlyHiringRate, recruitingCapacityNeeded };
}
/**
 * 37. Calculate talent mobility index
 */
function calculateTalentMobilityIndex(movements, workforce) {
    const totalMoves = movements.promotions + movements.lateralMoves + movements.crossFunctional;
    const mobilityIndex = workforce > 0 ? (totalMoves / workforce) * 100 : 0;
    const promotionRate = workforce > 0 ? (movements.promotions / workforce) * 100 : 0;
    const crossFunctionalRate = workforce > 0 ? (movements.crossFunctional / workforce) * 100 : 0;
    let mobilityHealth;
    if (mobilityIndex >= 15)
        mobilityHealth = 'high';
    else if (mobilityIndex >= 8)
        mobilityHealth = 'moderate';
    else
        mobilityHealth = 'low';
    return { mobilityIndex, promotionRate, crossFunctionalRate, mobilityHealth };
}
/**
 * 38. Analyze compensation competitiveness
 */
function analyzeCompensationCompetitiveness(internal, market) {
    const totalComp = internal.salary + internal.bonus + internal.equity;
    const marketPosition = (totalComp / market.p50) * 100;
    let competitiveness;
    if (marketPosition >= 110)
        competitiveness = 'leading';
    else if (marketPosition >= 90)
        competitiveness = 'competitive';
    else
        competitiveness = 'lagging';
    const gap = totalComp - market.p50;
    return { totalComp, marketPosition, competitiveness, gap };
}
/**
 * 39. Calculate time-to-fill metrics
 */
function calculateTimeToFill(requisitions) {
    const timeToFills = requisitions.map((req) => {
        const days = Math.floor((req.filledDate.getTime() - req.openedDate.getTime()) / (1000 * 60 * 60 * 24));
        return { days, level: req.level };
    });
    const avgTimeToFill = timeToFills.reduce((sum, t) => sum + t.days, 0) / timeToFills.length;
    const sorted = [...timeToFills].sort((a, b) => a.days - b.days);
    const medianTimeToFill = sorted[Math.floor(sorted.length / 2)]?.days || 0;
    const byLevel = {};
    for (const ttf of timeToFills) {
        if (!byLevel[ttf.level]) {
            byLevel[ttf.level] = 0;
        }
        byLevel[ttf.level] += ttf.days;
    }
    for (const level in byLevel) {
        const count = timeToFills.filter((t) => t.level === level).length;
        byLevel[level] = byLevel[level] / count;
    }
    const benchmark = 45; // Industry benchmark: 45 days
    const efficiency = Math.max(0, ((benchmark - avgTimeToFill) / benchmark) * 100);
    return { avgTimeToFill, medianTimeToFill, byLevel, efficiency };
}
/**
 * 40. Generate talent review insights
 */
async function generateTalentReviewInsights(organizationId) {
    const [assessments, retentionAnalyses, successionPlans, developmentPlans] = await Promise.all([
        TalentAssessmentModel.findAll({ where: { organizationId } }),
        RetentionAnalysisModel.findAll({ where: { organizationId } }),
        SuccessionPlanModel.findAll({ where: { organizationId } }),
        DevelopmentPlanModel.findAll({ where: { organizationId } }),
    ]);
    const topTalentCount = assessments.filter((a) => a.talentTier === TalentTier.TOP_PERFORMER || a.talentTier === TalentTier.HIGH_PERFORMER).length;
    const flightRiskCount = retentionAnalyses.filter((r) => r.flightRisk === FlightRisk.HIGH || r.flightRisk === FlightRisk.CRITICAL).length;
    const criticalRoles = successionPlans.length;
    const coveredRoles = successionPlans.filter((p) => p.successors.some((s) => s.readiness === SuccessionReadiness.READY_NOW)).length;
    const successionCoverage = criticalRoles > 0 ? (coveredRoles / criticalRoles) * 100 : 0;
    const developmentInvestment = developmentPlans.reduce((sum, p) => sum + Number(p.budget), 0);
    const keyInsights = [];
    const recommendations = [];
    if (topTalentCount < assessments.length * 0.2) {
        keyInsights.push(`Top talent represents only ${((topTalentCount / assessments.length) * 100).toFixed(1)}% of workforce`);
        recommendations.push('Increase investment in talent acquisition and development');
    }
    if (flightRiskCount > assessments.length * 0.1) {
        keyInsights.push(`${flightRiskCount} employees at high flight risk`);
        recommendations.push('Implement retention strategies for high-risk talent');
    }
    if (successionCoverage < 80) {
        keyInsights.push(`Only ${successionCoverage.toFixed(1)}% succession coverage for critical roles`);
        recommendations.push('Accelerate succession planning and development programs');
    }
    return {
        topTalentCount,
        flightRiskCount,
        successionCoverage,
        developmentInvestment,
        keyInsights,
        recommendations,
    };
}
/**
 * 41. Calculate workforce productivity index
 */
function calculateWorkforceProductivityIndex(metrics) {
    // Normalize metrics to 0-100 scale
    const revenueScore = Math.min(100, (metrics.revenuePerEmployee / 200000) * 100);
    const profitScore = Math.min(100, (metrics.profitPerEmployee / 50000) * 100);
    const utilizationScore = metrics.utilizationRate;
    const productivityIndex = (revenueScore * 0.4 + profitScore * 0.4 + utilizationScore * 0.2);
    let rating;
    if (productivityIndex >= 85)
        rating = 'exceptional';
    else if (productivityIndex >= 70)
        rating = 'strong';
    else if (productivityIndex >= 55)
        rating = 'average';
    else
        rating = 'below_average';
    return { productivityIndex, rating };
}
/**
 * 42. Model organizational change impact
 */
function modelOrganizationalChangeImpact(change, workforce) {
    const affectedPercent = (change.affectedHeadcount / workforce.totalHeadcount) * 100;
    let baseImpact = 0;
    let baseAttritionRisk = 0;
    let baseProductivityDip = 0;
    let baseRecoveryMonths = 0;
    switch (change.typeOfChange) {
        case 'restructure':
            baseImpact = 60;
            baseAttritionRisk = 15;
            baseProductivityDip = 20;
            baseRecoveryMonths = 6;
            break;
        case 'merger':
            baseImpact = 75;
            baseAttritionRisk = 25;
            baseProductivityDip = 30;
            baseRecoveryMonths = 12;
            break;
        case 'layoff':
            baseImpact = 80;
            baseAttritionRisk = 30;
            baseProductivityDip = 25;
            baseRecoveryMonths = 9;
            break;
        case 'expansion':
            baseImpact = 40;
            baseAttritionRisk = 10;
            baseProductivityDip = 15;
            baseRecoveryMonths = 3;
            break;
    }
    const scaleMultiplier = 1 + (affectedPercent / 100);
    const engagementMultiplier = workforce.engagementScore < 60 ? 1.3 : workforce.engagementScore > 75 ? 0.8 : 1.0;
    const impactScore = Math.min(100, baseImpact * scaleMultiplier * engagementMultiplier);
    const attritionRisk = Math.min(100, baseAttritionRisk * scaleMultiplier * engagementMultiplier);
    const productivityDip = Math.min(100, baseProductivityDip * scaleMultiplier);
    const recoveryMonths = Math.round(baseRecoveryMonths * scaleMultiplier);
    const recommendations = [
        'Implement comprehensive change management program',
        'Increase communication frequency and transparency',
        'Provide support resources for affected employees',
    ];
    if (attritionRisk > 20) {
        recommendations.push('Develop retention strategies for key talent');
    }
    if (impactScore > 70) {
        recommendations.push('Consider phased implementation to reduce disruption');
    }
    return { impactScore, attritionRisk, productivityDip, recoveryMonths, recommendations };
}
/**
 * 43. Generate workforce scenario planning
 */
function generateWorkforceScenarios(baseline, scenarios) {
    return scenarios.map((scenario) => {
        const netGrowth = baseline.headcount * (scenario.growthRate / 100);
        const attritionLoss = baseline.headcount * (scenario.attritionRate / 100);
        const projectedHeadcount = Math.round(baseline.headcount + netGrowth - attritionLoss);
        const inflatedSalary = baseline.avgSalary * (1 + scenario.salaryInflation / 100);
        const projectedCost = projectedHeadcount * inflatedSalary;
        const budgetVariance = projectedCost - baseline.budget;
        const variancePercent = (budgetVariance / baseline.budget) * 100;
        let feasibility;
        if (variancePercent <= 5)
            feasibility = 'within_budget';
        else if (variancePercent <= 15)
            feasibility = 'over_budget';
        else
            feasibility = 'significantly_over';
        return {
            scenario: scenario.name,
            projectedHeadcount,
            projectedCost,
            budgetVariance,
            feasibility,
        };
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.TalentManagementKit = {
    // Models
    WorkforcePlanModel,
    SuccessionPlanModel,
    CompetencyFrameworkModel,
    TalentAssessmentModel,
    EngagementSurveyModel,
    RetentionAnalysisModel,
    DevelopmentPlanModel,
    SkillsGapModel,
    // DTOs
    CreateWorkforcePlanDto,
    CreateSuccessionPlanDto,
    CreateCompetencyFrameworkDto,
    CreateTalentAssessmentDto,
    CreateEngagementSurveyDto,
    CreateRetentionAnalysisDto,
    CreateDevelopmentPlanDto,
    CreateSkillsGapDto,
    // Functions (43 total)
    createWorkforcePlan,
    calculateWorkforceGap,
    projectHeadcount,
    calculateSpanOfControl,
    createSuccessionPlan,
    calculateBenchStrength,
    identifySuccessionGaps,
    createCompetencyFramework,
    calculateCompetencyGap,
    aggregateCompetencyScores,
    createTalentAssessment,
    build9BoxGrid,
    calibratePerformanceRatings,
    identifyHighPotentials,
    createEngagementSurvey,
    calculateEngagementIndex,
    calculateENPS,
    analyzeEngagementTrends,
    createRetentionAnalysis,
    calculateFlightRiskScore,
    predictVoluntaryAttrition,
    calculateRetentionCostImpact,
    createDevelopmentPlan,
    prioritizeDevelopmentInterventions,
    calculateDevelopmentROI,
    trackDevelopmentProgress,
    createSkillsGap,
    prioritizeSkillsGaps,
    calculateSkillsSupplyDemand,
    recommendSkillsClosureStrategy,
    buildTalentPipelineMetrics,
    calculateDiversityMetrics,
    calculateTalentDensity,
    analyzePerformanceDistribution,
    calculateLearningVelocity,
    modelTalentAcquisitionNeeds,
    calculateTalentMobilityIndex,
    analyzeCompensationCompetitiveness,
    calculateTimeToFill,
    generateTalentReviewInsights,
    calculateWorkforceProductivityIndex,
    modelOrganizationalChangeImpact,
    generateWorkforceScenarios,
};
exports.default = exports.TalentManagementKit;
//# sourceMappingURL=talent-management-kit.js.map