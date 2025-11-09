"use strict";
/**
 * LOC: CONS-PERF-MGT-001
 * File: /reuse/server/consulting/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/performance.service.ts
 *   - backend/consulting/okr.controller.ts
 *   - backend/consulting/calibration.service.ts
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
exports.PerformanceImprovementPlan = exports.PerformanceReview = exports.KPI = exports.KeyResult = exports.Objective = exports.CreatePIPDto = exports.CreateCalibrationSessionDto = exports.CreatePerformanceReviewDto = exports.CreateFeedbackRequestDto = exports.CreateKPIDto = exports.CreateKeyResultDto = exports.CreateObjectiveDto = exports.DevelopmentCategory = exports.AlignmentLevel = exports.PIPStatus = exports.CalibrationDecision = exports.BalancedScorecardPerspective = exports.KPIMeasurementType = exports.FeedbackType = exports.ReviewCycleFrequency = exports.PerformanceRating = exports.GoalStatus = exports.GoalType = void 0;
exports.initObjectiveModel = initObjectiveModel;
exports.initKeyResultModel = initKeyResultModel;
exports.initKPIModel = initKPIModel;
exports.initPerformanceReviewModel = initPerformanceReviewModel;
exports.initPerformanceImprovementPlanModel = initPerformanceImprovementPlanModel;
exports.createObjective = createObjective;
exports.createKeyResult = createKeyResult;
exports.calculateProgress = calculateProgress;
exports.updateKeyResultProgress = updateKeyResultProgress;
exports.createKPI = createKPI;
exports.updateKPIValue = updateKPIValue;
exports.evaluateKPIStatus = evaluateKPIStatus;
exports.createBalancedScorecard = createBalancedScorecard;
exports.addScorecardPerspective = addScorecardPerspective;
exports.calculateBalancedScorecardScore = calculateBalancedScorecardScore;
exports.create360FeedbackRequest = create360FeedbackRequest;
exports.submit360FeedbackResponse = submit360FeedbackResponse;
exports.aggregate360Feedback = aggregate360Feedback;
exports.createPerformanceReview = createPerformanceReview;
exports.createCalibrationSession = createCalibrationSession;
exports.calibratePerformanceRating = calibratePerformanceRating;
exports.validateRatingDistribution = validateRatingDistribution;
exports.cascadeGoals = cascadeGoals;
exports.validateGoalAlignment = validateGoalAlignment;
exports.createPerformanceImprovementPlan = createPerformanceImprovementPlan;
exports.addPIPProgressNote = addPIPProgressNote;
exports.evaluatePIPSuccess = evaluatePIPSuccess;
exports.createContinuousFeedback = createContinuousFeedback;
exports.acknowledgeContinuousFeedback = acknowledgeContinuousFeedback;
exports.analyzeFeedbackTrends = analyzeFeedbackTrends;
exports.createTalentReview = createTalentReview;
exports.plotOn9Box = plotOn9Box;
exports.generateSuccessionPlan = generateSuccessionPlan;
exports.generatePerformanceAnalytics = generatePerformanceAnalytics;
exports.exportOKRs = exportOKRs;
exports.importOKRs = importOKRs;
exports.calculateTeamPerformanceScore = calculateTeamPerformanceScore;
exports.generatePerformanceRecommendations = generatePerformanceRecommendations;
exports.schedulePerformanceReviewCycle = schedulePerformanceReviewCycle;
exports.calculateCompensationAdjustment = calculateCompensationAdjustment;
exports.identifyHighPotentialEmployees = identifyHighPotentialEmployees;
exports.generateDevelopmentPlan = generateDevelopmentPlan;
exports.analyzeOrganizationalAlignment = analyzeOrganizationalAlignment;
exports.generatePerformanceDashboard = generatePerformanceDashboard;
/**
 * File: /reuse/server/consulting/performance-management-kit.ts
 * Locator: WC-CONS-PERFMGT-001
 * Purpose: Enterprise-grade Performance Management Kit - OKRs, KPIs, balanced scorecard, 360 feedback, calibration
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, performance controllers, calibration processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 production-ready functions for performance management competing with Workday, SuccessFactors, Lattice
 *
 * LLM Context: Comprehensive performance management utilities for production-ready consulting applications.
 * Provides OKR framework implementation, KPI design and tracking, balanced scorecard methodology, 360-degree feedback,
 * performance calibration sessions, goal cascading, performance improvement plans, continuous feedback, ratings,
 * talent review processes, succession planning integration, and performance analytics.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Goal types
 */
var GoalType;
(function (GoalType) {
    GoalType["OBJECTIVE"] = "objective";
    GoalType["KEY_RESULT"] = "key_result";
    GoalType["KPI"] = "kpi";
    GoalType["MILESTONE"] = "milestone";
    GoalType["BEHAVIOR"] = "behavior";
    GoalType["DEVELOPMENT"] = "development";
})(GoalType || (exports.GoalType = GoalType = {}));
/**
 * Goal status
 */
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DRAFT"] = "draft";
    GoalStatus["ACTIVE"] = "active";
    GoalStatus["AT_RISK"] = "at_risk";
    GoalStatus["COMPLETED"] = "completed";
    GoalStatus["DEFERRED"] = "deferred";
    GoalStatus["CANCELLED"] = "cancelled";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
/**
 * Performance rating scale
 */
var PerformanceRating;
(function (PerformanceRating) {
    PerformanceRating["UNSATISFACTORY"] = "unsatisfactory";
    PerformanceRating["NEEDS_IMPROVEMENT"] = "needs_improvement";
    PerformanceRating["MEETS_EXPECTATIONS"] = "meets_expectations";
    PerformanceRating["EXCEEDS_EXPECTATIONS"] = "exceeds_expectations";
    PerformanceRating["OUTSTANDING"] = "outstanding";
})(PerformanceRating || (exports.PerformanceRating = PerformanceRating = {}));
/**
 * Review cycle frequency
 */
var ReviewCycleFrequency;
(function (ReviewCycleFrequency) {
    ReviewCycleFrequency["QUARTERLY"] = "quarterly";
    ReviewCycleFrequency["SEMI_ANNUAL"] = "semi_annual";
    ReviewCycleFrequency["ANNUAL"] = "annual";
    ReviewCycleFrequency["CONTINUOUS"] = "continuous";
})(ReviewCycleFrequency || (exports.ReviewCycleFrequency = ReviewCycleFrequency = {}));
/**
 * Feedback types
 */
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["UPWARD"] = "upward";
    FeedbackType["DOWNWARD"] = "downward";
    FeedbackType["PEER"] = "peer";
    FeedbackType["SELF"] = "self";
    FeedbackType["CUSTOMER"] = "customer";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
/**
 * KPI measurement types
 */
var KPIMeasurementType;
(function (KPIMeasurementType) {
    KPIMeasurementType["NUMERIC"] = "numeric";
    KPIMeasurementType["PERCENTAGE"] = "percentage";
    KPIMeasurementType["CURRENCY"] = "currency";
    KPIMeasurementType["BOOLEAN"] = "boolean";
    KPIMeasurementType["MILESTONE"] = "milestone";
})(KPIMeasurementType || (exports.KPIMeasurementType = KPIMeasurementType = {}));
/**
 * Balanced scorecard perspectives
 */
var BalancedScorecardPerspective;
(function (BalancedScorecardPerspective) {
    BalancedScorecardPerspective["FINANCIAL"] = "financial";
    BalancedScorecardPerspective["CUSTOMER"] = "customer";
    BalancedScorecardPerspective["INTERNAL_PROCESS"] = "internal_process";
    BalancedScorecardPerspective["LEARNING_GROWTH"] = "learning_growth";
})(BalancedScorecardPerspective || (exports.BalancedScorecardPerspective = BalancedScorecardPerspective = {}));
/**
 * Calibration decision types
 */
var CalibrationDecision;
(function (CalibrationDecision) {
    CalibrationDecision["CONFIRMED"] = "confirmed";
    CalibrationDecision["UPGRADED"] = "upgraded";
    CalibrationDecision["DOWNGRADED"] = "downgraded";
    CalibrationDecision["UNDER_REVIEW"] = "under_review";
})(CalibrationDecision || (exports.CalibrationDecision = CalibrationDecision = {}));
/**
 * Performance improvement plan status
 */
var PIPStatus;
(function (PIPStatus) {
    PIPStatus["ACTIVE"] = "active";
    PIPStatus["ON_TRACK"] = "on_track";
    PIPStatus["AT_RISK"] = "at_risk";
    PIPStatus["COMPLETED_SUCCESS"] = "completed_success";
    PIPStatus["COMPLETED_FAILURE"] = "completed_failure";
    PIPStatus["CANCELLED"] = "cancelled";
})(PIPStatus || (exports.PIPStatus = PIPStatus = {}));
/**
 * Goal alignment levels
 */
var AlignmentLevel;
(function (AlignmentLevel) {
    AlignmentLevel["COMPANY"] = "company";
    AlignmentLevel["DIVISION"] = "division";
    AlignmentLevel["DEPARTMENT"] = "department";
    AlignmentLevel["TEAM"] = "team";
    AlignmentLevel["INDIVIDUAL"] = "individual";
})(AlignmentLevel || (exports.AlignmentLevel = AlignmentLevel = {}));
/**
 * Development area categories
 */
var DevelopmentCategory;
(function (DevelopmentCategory) {
    DevelopmentCategory["TECHNICAL_SKILLS"] = "technical_skills";
    DevelopmentCategory["LEADERSHIP"] = "leadership";
    DevelopmentCategory["COMMUNICATION"] = "communication";
    DevelopmentCategory["COLLABORATION"] = "collaboration";
    DevelopmentCategory["INNOVATION"] = "innovation";
    DevelopmentCategory["EXECUTION"] = "execution";
})(DevelopmentCategory || (exports.DevelopmentCategory = DevelopmentCategory = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION AND SWAGGER
// ============================================================================
/**
 * Create Objective DTO
 */
let CreateObjectiveDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _alignmentLevel_decorators;
    let _alignmentLevel_initializers = [];
    let _alignmentLevel_extraInitializers = [];
    let _parentObjectiveId_decorators;
    let _parentObjectiveId_initializers = [];
    let _parentObjectiveId_extraInitializers = [];
    let _timeFrame_decorators;
    let _timeFrame_initializers = [];
    let _timeFrame_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    return _a = class CreateObjectiveDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.alignmentLevel = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _alignmentLevel_initializers, void 0));
                this.parentObjectiveId = (__runInitializers(this, _alignmentLevel_extraInitializers), __runInitializers(this, _parentObjectiveId_initializers, void 0));
                this.timeFrame = (__runInitializers(this, _parentObjectiveId_extraInitializers), __runInitializers(this, _timeFrame_initializers, void 0));
                this.startDate = (__runInitializers(this, _timeFrame_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.weight = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                __runInitializers(this, _weight_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objective title', example: 'Increase customer satisfaction' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(5), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed description', example: 'Improve NPS score by implementing customer feedback loop' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _alignmentLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: AlignmentLevel, description: 'Alignment level' }), (0, class_validator_1.IsEnum)(AlignmentLevel)];
            _parentObjectiveId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent objective ID for cascading', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _timeFrame_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time frame', example: 'Q1 2024' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _weight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weight/importance', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _alignmentLevel_decorators, { kind: "field", name: "alignmentLevel", static: false, private: false, access: { has: obj => "alignmentLevel" in obj, get: obj => obj.alignmentLevel, set: (obj, value) => { obj.alignmentLevel = value; } }, metadata: _metadata }, _alignmentLevel_initializers, _alignmentLevel_extraInitializers);
            __esDecorate(null, null, _parentObjectiveId_decorators, { kind: "field", name: "parentObjectiveId", static: false, private: false, access: { has: obj => "parentObjectiveId" in obj, get: obj => obj.parentObjectiveId, set: (obj, value) => { obj.parentObjectiveId = value; } }, metadata: _metadata }, _parentObjectiveId_initializers, _parentObjectiveId_extraInitializers);
            __esDecorate(null, null, _timeFrame_decorators, { kind: "field", name: "timeFrame", static: false, private: false, access: { has: obj => "timeFrame" in obj, get: obj => obj.timeFrame, set: (obj, value) => { obj.timeFrame = value; } }, metadata: _metadata }, _timeFrame_initializers, _timeFrame_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateObjectiveDto = CreateObjectiveDto;
/**
 * Create Key Result DTO
 */
let CreateKeyResultDto = (() => {
    var _a;
    let _objectiveId_decorators;
    let _objectiveId_initializers = [];
    let _objectiveId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _measurementType_decorators;
    let _measurementType_initializers = [];
    let _measurementType_extraInitializers = [];
    let _startValue_decorators;
    let _startValue_initializers = [];
    let _startValue_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    return _a = class CreateKeyResultDto {
            constructor() {
                this.objectiveId = __runInitializers(this, _objectiveId_initializers, void 0);
                this.title = (__runInitializers(this, _objectiveId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.measurementType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _measurementType_initializers, void 0));
                this.startValue = (__runInitializers(this, _measurementType_extraInitializers), __runInitializers(this, _startValue_initializers, void 0));
                this.targetValue = (__runInitializers(this, _startValue_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.unit = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.weight = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                __runInitializers(this, _weight_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _objectiveId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objective ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Key result title', example: 'Achieve NPS score of 70+' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(5), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _measurementType_decorators = [(0, swagger_1.ApiProperty)({ enum: KPIMeasurementType, description: 'Measurement type' }), (0, class_validator_1.IsEnum)(KPIMeasurementType)];
            _startValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Starting value', example: 55 }), (0, class_validator_1.IsNumber)()];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value', example: 70 }), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement', example: 'points' }), (0, class_validator_1.IsString)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weight relative to other key results', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _objectiveId_decorators, { kind: "field", name: "objectiveId", static: false, private: false, access: { has: obj => "objectiveId" in obj, get: obj => obj.objectiveId, set: (obj, value) => { obj.objectiveId = value; } }, metadata: _metadata }, _objectiveId_initializers, _objectiveId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _measurementType_decorators, { kind: "field", name: "measurementType", static: false, private: false, access: { has: obj => "measurementType" in obj, get: obj => obj.measurementType, set: (obj, value) => { obj.measurementType = value; } }, metadata: _metadata }, _measurementType_initializers, _measurementType_extraInitializers);
            __esDecorate(null, null, _startValue_decorators, { kind: "field", name: "startValue", static: false, private: false, access: { has: obj => "startValue" in obj, get: obj => obj.startValue, set: (obj, value) => { obj.startValue = value; } }, metadata: _metadata }, _startValue_initializers, _startValue_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateKeyResultDto = CreateKeyResultDto;
/**
 * Create KPI DTO
 */
let CreateKPIDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _measurementType_decorators;
    let _measurementType_initializers = [];
    let _measurementType_extraInitializers = [];
    let _formula_decorators;
    let _formula_initializers = [];
    let _formula_extraInitializers = [];
    let _dataSource_decorators;
    let _dataSource_initializers = [];
    let _dataSource_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _thresholdGreen_decorators;
    let _thresholdGreen_initializers = [];
    let _thresholdGreen_extraInitializers = [];
    let _thresholdYellow_decorators;
    let _thresholdYellow_initializers = [];
    let _thresholdYellow_extraInitializers = [];
    let _thresholdRed_decorators;
    let _thresholdRed_initializers = [];
    let _thresholdRed_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class CreateKPIDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.owner = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                this.measurementType = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _measurementType_initializers, void 0));
                this.formula = (__runInitializers(this, _measurementType_extraInitializers), __runInitializers(this, _formula_initializers, void 0));
                this.dataSource = (__runInitializers(this, _formula_extraInitializers), __runInitializers(this, _dataSource_initializers, void 0));
                this.frequency = (__runInitializers(this, _dataSource_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.targetValue = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.thresholdGreen = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _thresholdGreen_initializers, void 0));
                this.thresholdYellow = (__runInitializers(this, _thresholdGreen_extraInitializers), __runInitializers(this, _thresholdYellow_initializers, void 0));
                this.thresholdRed = (__runInitializers(this, _thresholdYellow_extraInitializers), __runInitializers(this, _thresholdRed_initializers, void 0));
                this.unit = (__runInitializers(this, _thresholdRed_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.priority = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI name', example: 'Customer Retention Rate' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(150)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category', example: 'Customer Success' }), (0, class_validator_1.IsString)()];
            _owner_decorators = [(0, swagger_1.ApiProperty)({ description: 'KPI owner' }), (0, class_validator_1.IsString)()];
            _measurementType_decorators = [(0, swagger_1.ApiProperty)({ enum: KPIMeasurementType, description: 'Measurement type' }), (0, class_validator_1.IsEnum)(KPIMeasurementType)];
            _formula_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calculation formula', example: '(Retained Customers / Total Customers) * 100' }), (0, class_validator_1.IsString)()];
            _dataSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data source', example: 'CRM System' }), (0, class_validator_1.IsString)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement frequency', example: 'monthly' }), (0, class_validator_1.IsString)()];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, class_validator_1.IsNumber)()];
            _thresholdGreen_decorators = [(0, swagger_1.ApiProperty)({ description: 'Green threshold (good performance)' }), (0, class_validator_1.IsNumber)()];
            _thresholdYellow_decorators = [(0, swagger_1.ApiProperty)({ description: 'Yellow threshold (warning)' }), (0, class_validator_1.IsNumber)()];
            _thresholdRed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Red threshold (critical)' }), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit', example: '%' }), (0, class_validator_1.IsString)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'], description: 'Priority level' }), (0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'])];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            __esDecorate(null, null, _measurementType_decorators, { kind: "field", name: "measurementType", static: false, private: false, access: { has: obj => "measurementType" in obj, get: obj => obj.measurementType, set: (obj, value) => { obj.measurementType = value; } }, metadata: _metadata }, _measurementType_initializers, _measurementType_extraInitializers);
            __esDecorate(null, null, _formula_decorators, { kind: "field", name: "formula", static: false, private: false, access: { has: obj => "formula" in obj, get: obj => obj.formula, set: (obj, value) => { obj.formula = value; } }, metadata: _metadata }, _formula_initializers, _formula_extraInitializers);
            __esDecorate(null, null, _dataSource_decorators, { kind: "field", name: "dataSource", static: false, private: false, access: { has: obj => "dataSource" in obj, get: obj => obj.dataSource, set: (obj, value) => { obj.dataSource = value; } }, metadata: _metadata }, _dataSource_initializers, _dataSource_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _thresholdGreen_decorators, { kind: "field", name: "thresholdGreen", static: false, private: false, access: { has: obj => "thresholdGreen" in obj, get: obj => obj.thresholdGreen, set: (obj, value) => { obj.thresholdGreen = value; } }, metadata: _metadata }, _thresholdGreen_initializers, _thresholdGreen_extraInitializers);
            __esDecorate(null, null, _thresholdYellow_decorators, { kind: "field", name: "thresholdYellow", static: false, private: false, access: { has: obj => "thresholdYellow" in obj, get: obj => obj.thresholdYellow, set: (obj, value) => { obj.thresholdYellow = value; } }, metadata: _metadata }, _thresholdYellow_initializers, _thresholdYellow_extraInitializers);
            __esDecorate(null, null, _thresholdRed_decorators, { kind: "field", name: "thresholdRed", static: false, private: false, access: { has: obj => "thresholdRed" in obj, get: obj => obj.thresholdRed, set: (obj, value) => { obj.thresholdRed = value; } }, metadata: _metadata }, _thresholdRed_initializers, _thresholdRed_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateKPIDto = CreateKPIDto;
/**
 * Create Feedback Request DTO
 */
let CreateFeedbackRequestDto = (() => {
    var _a;
    let _subjectId_decorators;
    let _subjectId_initializers = [];
    let _subjectId_extraInitializers = [];
    let _feedbackType_decorators;
    let _feedbackType_initializers = [];
    let _feedbackType_extraInitializers = [];
    let _reviewers_decorators;
    let _reviewers_initializers = [];
    let _reviewers_extraInitializers = [];
    let _questions_decorators;
    let _questions_initializers = [];
    let _questions_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _purpose_decorators;
    let _purpose_initializers = [];
    let _purpose_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    return _a = class CreateFeedbackRequestDto {
            constructor() {
                this.subjectId = __runInitializers(this, _subjectId_initializers, void 0);
                this.feedbackType = (__runInitializers(this, _subjectId_extraInitializers), __runInitializers(this, _feedbackType_initializers, void 0));
                this.reviewers = (__runInitializers(this, _feedbackType_extraInitializers), __runInitializers(this, _reviewers_initializers, void 0));
                this.questions = (__runInitializers(this, _reviewers_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                this.dueDate = (__runInitializers(this, _questions_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.purpose = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
                this.isAnonymous = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
                __runInitializers(this, _isAnonymous_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subjectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subject employee ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _feedbackType_decorators = [(0, swagger_1.ApiProperty)({ enum: FeedbackType, description: 'Type of feedback' }), (0, class_validator_1.IsEnum)(FeedbackType)];
            _reviewers_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of reviewer IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _questions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feedback questions', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date for responses' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _purpose_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purpose of feedback request' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _isAnonymous_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether feedback is anonymous', default: false }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _subjectId_decorators, { kind: "field", name: "subjectId", static: false, private: false, access: { has: obj => "subjectId" in obj, get: obj => obj.subjectId, set: (obj, value) => { obj.subjectId = value; } }, metadata: _metadata }, _subjectId_initializers, _subjectId_extraInitializers);
            __esDecorate(null, null, _feedbackType_decorators, { kind: "field", name: "feedbackType", static: false, private: false, access: { has: obj => "feedbackType" in obj, get: obj => obj.feedbackType, set: (obj, value) => { obj.feedbackType = value; } }, metadata: _metadata }, _feedbackType_initializers, _feedbackType_extraInitializers);
            __esDecorate(null, null, _reviewers_decorators, { kind: "field", name: "reviewers", static: false, private: false, access: { has: obj => "reviewers" in obj, get: obj => obj.reviewers, set: (obj, value) => { obj.reviewers = value; } }, metadata: _metadata }, _reviewers_initializers, _reviewers_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: obj => "questions" in obj, get: obj => obj.questions, set: (obj, value) => { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: obj => "purpose" in obj, get: obj => obj.purpose, set: (obj, value) => { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
            __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateFeedbackRequestDto = CreateFeedbackRequestDto;
/**
 * Create Performance Review DTO
 */
let CreatePerformanceReviewDto = (() => {
    var _a;
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _reviewCycle_decorators;
    let _reviewCycle_initializers = [];
    let _reviewCycle_extraInitializers = [];
    let _reviewPeriodStart_decorators;
    let _reviewPeriodStart_initializers = [];
    let _reviewPeriodStart_extraInitializers = [];
    let _reviewPeriodEnd_decorators;
    let _reviewPeriodEnd_initializers = [];
    let _reviewPeriodEnd_extraInitializers = [];
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    let _goalAchievement_decorators;
    let _goalAchievement_initializers = [];
    let _goalAchievement_extraInitializers = [];
    let _competencyRatings_decorators;
    let _competencyRatings_initializers = [];
    let _competencyRatings_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _areasForImprovement_decorators;
    let _areasForImprovement_initializers = [];
    let _areasForImprovement_extraInitializers = [];
    let _developmentGoals_decorators;
    let _developmentGoals_initializers = [];
    let _developmentGoals_extraInitializers = [];
    let _promotionRecommendation_decorators;
    let _promotionRecommendation_initializers = [];
    let _promotionRecommendation_extraInitializers = [];
    let _compensationRecommendation_decorators;
    let _compensationRecommendation_initializers = [];
    let _compensationRecommendation_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class CreatePerformanceReviewDto {
            constructor() {
                this.employeeId = __runInitializers(this, _employeeId_initializers, void 0);
                this.reviewCycle = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _reviewCycle_initializers, void 0));
                this.reviewPeriodStart = (__runInitializers(this, _reviewCycle_extraInitializers), __runInitializers(this, _reviewPeriodStart_initializers, void 0));
                this.reviewPeriodEnd = (__runInitializers(this, _reviewPeriodStart_extraInitializers), __runInitializers(this, _reviewPeriodEnd_initializers, void 0));
                this.overallRating = (__runInitializers(this, _reviewPeriodEnd_extraInitializers), __runInitializers(this, _overallRating_initializers, void 0));
                this.goalAchievement = (__runInitializers(this, _overallRating_extraInitializers), __runInitializers(this, _goalAchievement_initializers, void 0));
                this.competencyRatings = (__runInitializers(this, _goalAchievement_extraInitializers), __runInitializers(this, _competencyRatings_initializers, void 0));
                this.strengths = (__runInitializers(this, _competencyRatings_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.areasForImprovement = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _areasForImprovement_initializers, void 0));
                this.developmentGoals = (__runInitializers(this, _areasForImprovement_extraInitializers), __runInitializers(this, _developmentGoals_initializers, void 0));
                this.promotionRecommendation = (__runInitializers(this, _developmentGoals_extraInitializers), __runInitializers(this, _promotionRecommendation_initializers, void 0));
                this.compensationRecommendation = (__runInitializers(this, _promotionRecommendation_extraInitializers), __runInitializers(this, _compensationRecommendation_initializers, void 0));
                this.comments = (__runInitializers(this, _compensationRecommendation_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID being reviewed' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _reviewCycle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review cycle identifier', example: '2024-Q1' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _reviewPeriodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review period start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reviewPeriodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review period end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _overallRating_decorators = [(0, swagger_1.ApiProperty)({ enum: PerformanceRating, description: 'Overall performance rating' }), (0, class_validator_1.IsEnum)(PerformanceRating)];
            _goalAchievement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Goal achievement percentage', minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _competencyRatings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competency ratings', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strengths identified', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _areasForImprovement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Areas for improvement', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _developmentGoals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Development goals for next period', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _promotionRecommendation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion recommendation', default: false }), (0, class_validator_1.IsBoolean)()];
            _compensationRecommendation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compensation recommendation details' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional comments' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _reviewCycle_decorators, { kind: "field", name: "reviewCycle", static: false, private: false, access: { has: obj => "reviewCycle" in obj, get: obj => obj.reviewCycle, set: (obj, value) => { obj.reviewCycle = value; } }, metadata: _metadata }, _reviewCycle_initializers, _reviewCycle_extraInitializers);
            __esDecorate(null, null, _reviewPeriodStart_decorators, { kind: "field", name: "reviewPeriodStart", static: false, private: false, access: { has: obj => "reviewPeriodStart" in obj, get: obj => obj.reviewPeriodStart, set: (obj, value) => { obj.reviewPeriodStart = value; } }, metadata: _metadata }, _reviewPeriodStart_initializers, _reviewPeriodStart_extraInitializers);
            __esDecorate(null, null, _reviewPeriodEnd_decorators, { kind: "field", name: "reviewPeriodEnd", static: false, private: false, access: { has: obj => "reviewPeriodEnd" in obj, get: obj => obj.reviewPeriodEnd, set: (obj, value) => { obj.reviewPeriodEnd = value; } }, metadata: _metadata }, _reviewPeriodEnd_initializers, _reviewPeriodEnd_extraInitializers);
            __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
            __esDecorate(null, null, _goalAchievement_decorators, { kind: "field", name: "goalAchievement", static: false, private: false, access: { has: obj => "goalAchievement" in obj, get: obj => obj.goalAchievement, set: (obj, value) => { obj.goalAchievement = value; } }, metadata: _metadata }, _goalAchievement_initializers, _goalAchievement_extraInitializers);
            __esDecorate(null, null, _competencyRatings_decorators, { kind: "field", name: "competencyRatings", static: false, private: false, access: { has: obj => "competencyRatings" in obj, get: obj => obj.competencyRatings, set: (obj, value) => { obj.competencyRatings = value; } }, metadata: _metadata }, _competencyRatings_initializers, _competencyRatings_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _areasForImprovement_decorators, { kind: "field", name: "areasForImprovement", static: false, private: false, access: { has: obj => "areasForImprovement" in obj, get: obj => obj.areasForImprovement, set: (obj, value) => { obj.areasForImprovement = value; } }, metadata: _metadata }, _areasForImprovement_initializers, _areasForImprovement_extraInitializers);
            __esDecorate(null, null, _developmentGoals_decorators, { kind: "field", name: "developmentGoals", static: false, private: false, access: { has: obj => "developmentGoals" in obj, get: obj => obj.developmentGoals, set: (obj, value) => { obj.developmentGoals = value; } }, metadata: _metadata }, _developmentGoals_initializers, _developmentGoals_extraInitializers);
            __esDecorate(null, null, _promotionRecommendation_decorators, { kind: "field", name: "promotionRecommendation", static: false, private: false, access: { has: obj => "promotionRecommendation" in obj, get: obj => obj.promotionRecommendation, set: (obj, value) => { obj.promotionRecommendation = value; } }, metadata: _metadata }, _promotionRecommendation_initializers, _promotionRecommendation_extraInitializers);
            __esDecorate(null, null, _compensationRecommendation_decorators, { kind: "field", name: "compensationRecommendation", static: false, private: false, access: { has: obj => "compensationRecommendation" in obj, get: obj => obj.compensationRecommendation, set: (obj, value) => { obj.compensationRecommendation = value; } }, metadata: _metadata }, _compensationRecommendation_initializers, _compensationRecommendation_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePerformanceReviewDto = CreatePerformanceReviewDto;
/**
 * Create Calibration Session DTO
 */
let CreateCalibrationSessionDto = (() => {
    var _a;
    let _sessionName_decorators;
    let _sessionName_initializers = [];
    let _sessionName_extraInitializers = [];
    let _calibrationCycle_decorators;
    let _calibrationCycle_initializers = [];
    let _calibrationCycle_extraInitializers = [];
    let _facilitatorId_decorators;
    let _facilitatorId_initializers = [];
    let _facilitatorId_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _reviews_decorators;
    let _reviews_initializers = [];
    let _reviews_extraInitializers = [];
    let _sessionDate_decorators;
    let _sessionDate_initializers = [];
    let _sessionDate_extraInitializers = [];
    return _a = class CreateCalibrationSessionDto {
            constructor() {
                this.sessionName = __runInitializers(this, _sessionName_initializers, void 0);
                this.calibrationCycle = (__runInitializers(this, _sessionName_extraInitializers), __runInitializers(this, _calibrationCycle_initializers, void 0));
                this.facilitatorId = (__runInitializers(this, _calibrationCycle_extraInitializers), __runInitializers(this, _facilitatorId_initializers, void 0));
                this.participants = (__runInitializers(this, _facilitatorId_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
                this.reviews = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
                this.sessionDate = (__runInitializers(this, _reviews_extraInitializers), __runInitializers(this, _sessionDate_initializers, void 0));
                __runInitializers(this, _sessionDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sessionName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session name', example: 'Q1 2024 Performance Calibration' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _calibrationCycle_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration cycle', example: '2024-Q1' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _facilitatorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Facilitator user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _participants_decorators = [(0, swagger_1.ApiProperty)({ description: 'Participant user IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _reviews_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review IDs to calibrate', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _sessionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _sessionName_decorators, { kind: "field", name: "sessionName", static: false, private: false, access: { has: obj => "sessionName" in obj, get: obj => obj.sessionName, set: (obj, value) => { obj.sessionName = value; } }, metadata: _metadata }, _sessionName_initializers, _sessionName_extraInitializers);
            __esDecorate(null, null, _calibrationCycle_decorators, { kind: "field", name: "calibrationCycle", static: false, private: false, access: { has: obj => "calibrationCycle" in obj, get: obj => obj.calibrationCycle, set: (obj, value) => { obj.calibrationCycle = value; } }, metadata: _metadata }, _calibrationCycle_initializers, _calibrationCycle_extraInitializers);
            __esDecorate(null, null, _facilitatorId_decorators, { kind: "field", name: "facilitatorId", static: false, private: false, access: { has: obj => "facilitatorId" in obj, get: obj => obj.facilitatorId, set: (obj, value) => { obj.facilitatorId = value; } }, metadata: _metadata }, _facilitatorId_initializers, _facilitatorId_extraInitializers);
            __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
            __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: obj => "reviews" in obj, get: obj => obj.reviews, set: (obj, value) => { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
            __esDecorate(null, null, _sessionDate_decorators, { kind: "field", name: "sessionDate", static: false, private: false, access: { has: obj => "sessionDate" in obj, get: obj => obj.sessionDate, set: (obj, value) => { obj.sessionDate = value; } }, metadata: _metadata }, _sessionDate_initializers, _sessionDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCalibrationSessionDto = CreateCalibrationSessionDto;
/**
 * Create PIP DTO
 */
let CreatePIPDto = (() => {
    var _a;
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _concernsIdentified_decorators;
    let _concernsIdentified_initializers = [];
    let _concernsIdentified_extraInitializers = [];
    let _performanceGaps_decorators;
    let _performanceGaps_initializers = [];
    let _performanceGaps_extraInitializers = [];
    let _improvementActions_decorators;
    let _improvementActions_initializers = [];
    let _improvementActions_extraInitializers = [];
    let _successCriteria_decorators;
    let _successCriteria_initializers = [];
    let _successCriteria_extraInitializers = [];
    let _supportProvided_decorators;
    let _supportProvided_initializers = [];
    let _supportProvided_extraInitializers = [];
    return _a = class CreatePIPDto {
            constructor() {
                this.employeeId = __runInitializers(this, _employeeId_initializers, void 0);
                this.managerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                this.startDate = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.reviewDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.concernsIdentified = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _concernsIdentified_initializers, void 0));
                this.performanceGaps = (__runInitializers(this, _concernsIdentified_extraInitializers), __runInitializers(this, _performanceGaps_initializers, void 0));
                this.improvementActions = (__runInitializers(this, _performanceGaps_extraInitializers), __runInitializers(this, _improvementActions_initializers, void 0));
                this.successCriteria = (__runInitializers(this, _improvementActions_extraInitializers), __runInitializers(this, _successCriteria_initializers, void 0));
                this.supportProvided = (__runInitializers(this, _successCriteria_extraInitializers), __runInitializers(this, _supportProvided_initializers, void 0));
                __runInitializers(this, _supportProvided_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _employeeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Employee ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'PIP start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'PIP end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _concernsIdentified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Concerns identified', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _performanceGaps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance gaps', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _improvementActions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Improvement actions', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _successCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success criteria', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _supportProvided_decorators = [(0, swagger_1.ApiProperty)({ description: 'Support provided', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _concernsIdentified_decorators, { kind: "field", name: "concernsIdentified", static: false, private: false, access: { has: obj => "concernsIdentified" in obj, get: obj => obj.concernsIdentified, set: (obj, value) => { obj.concernsIdentified = value; } }, metadata: _metadata }, _concernsIdentified_initializers, _concernsIdentified_extraInitializers);
            __esDecorate(null, null, _performanceGaps_decorators, { kind: "field", name: "performanceGaps", static: false, private: false, access: { has: obj => "performanceGaps" in obj, get: obj => obj.performanceGaps, set: (obj, value) => { obj.performanceGaps = value; } }, metadata: _metadata }, _performanceGaps_initializers, _performanceGaps_extraInitializers);
            __esDecorate(null, null, _improvementActions_decorators, { kind: "field", name: "improvementActions", static: false, private: false, access: { has: obj => "improvementActions" in obj, get: obj => obj.improvementActions, set: (obj, value) => { obj.improvementActions = value; } }, metadata: _metadata }, _improvementActions_initializers, _improvementActions_extraInitializers);
            __esDecorate(null, null, _successCriteria_decorators, { kind: "field", name: "successCriteria", static: false, private: false, access: { has: obj => "successCriteria" in obj, get: obj => obj.successCriteria, set: (obj, value) => { obj.successCriteria = value; } }, metadata: _metadata }, _successCriteria_initializers, _successCriteria_extraInitializers);
            __esDecorate(null, null, _supportProvided_decorators, { kind: "field", name: "supportProvided", static: false, private: false, access: { has: obj => "supportProvided" in obj, get: obj => obj.supportProvided, set: (obj, value) => { obj.supportProvided = value; } }, metadata: _metadata }, _supportProvided_initializers, _supportProvided_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePIPDto = CreatePIPDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Objective Model
 */
let Objective = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _objectiveId_decorators;
    let _objectiveId_initializers = [];
    let _objectiveId_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _alignmentLevel_decorators;
    let _alignmentLevel_initializers = [];
    let _alignmentLevel_extraInitializers = [];
    let _parentObjectiveId_decorators;
    let _parentObjectiveId_initializers = [];
    let _parentObjectiveId_extraInitializers = [];
    let _timeFrame_decorators;
    let _timeFrame_initializers = [];
    let _timeFrame_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _progress_decorators;
    let _progress_initializers = [];
    let _progress_extraInitializers = [];
    let _confidenceLevel_decorators;
    let _confidenceLevel_initializers = [];
    let _confidenceLevel_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class Objective extends _classSuper {
            constructor() {
                super(...arguments);
                this.objectiveId = __runInitializers(this, _objectiveId_initializers, void 0);
                this.organizationId = (__runInitializers(this, _objectiveId_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.ownerId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                this.title = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.alignmentLevel = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _alignmentLevel_initializers, void 0));
                this.parentObjectiveId = (__runInitializers(this, _alignmentLevel_extraInitializers), __runInitializers(this, _parentObjectiveId_initializers, void 0));
                this.timeFrame = (__runInitializers(this, _parentObjectiveId_extraInitializers), __runInitializers(this, _timeFrame_initializers, void 0));
                this.startDate = (__runInitializers(this, _timeFrame_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.weight = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.status = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.progress = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progress_initializers, void 0));
                this.confidenceLevel = (__runInitializers(this, _progress_extraInitializers), __runInitializers(this, _confidenceLevel_initializers, void 0));
                this.metadata = (__runInitializers(this, _confidenceLevel_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _objectiveId_decorators = [(0, swagger_1.ApiProperty)()];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)()];
            _ownerId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _alignmentLevel_decorators = [(0, swagger_1.ApiProperty)()];
            _parentObjectiveId_decorators = [(0, swagger_1.ApiProperty)()];
            _timeFrame_decorators = [(0, swagger_1.ApiProperty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _progress_decorators = [(0, swagger_1.ApiProperty)()];
            _confidenceLevel_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _objectiveId_decorators, { kind: "field", name: "objectiveId", static: false, private: false, access: { has: obj => "objectiveId" in obj, get: obj => obj.objectiveId, set: (obj, value) => { obj.objectiveId = value; } }, metadata: _metadata }, _objectiveId_initializers, _objectiveId_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _alignmentLevel_decorators, { kind: "field", name: "alignmentLevel", static: false, private: false, access: { has: obj => "alignmentLevel" in obj, get: obj => obj.alignmentLevel, set: (obj, value) => { obj.alignmentLevel = value; } }, metadata: _metadata }, _alignmentLevel_initializers, _alignmentLevel_extraInitializers);
            __esDecorate(null, null, _parentObjectiveId_decorators, { kind: "field", name: "parentObjectiveId", static: false, private: false, access: { has: obj => "parentObjectiveId" in obj, get: obj => obj.parentObjectiveId, set: (obj, value) => { obj.parentObjectiveId = value; } }, metadata: _metadata }, _parentObjectiveId_initializers, _parentObjectiveId_extraInitializers);
            __esDecorate(null, null, _timeFrame_decorators, { kind: "field", name: "timeFrame", static: false, private: false, access: { has: obj => "timeFrame" in obj, get: obj => obj.timeFrame, set: (obj, value) => { obj.timeFrame = value; } }, metadata: _metadata }, _timeFrame_initializers, _timeFrame_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: obj => "progress" in obj, get: obj => obj.progress, set: (obj, value) => { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
            __esDecorate(null, null, _confidenceLevel_decorators, { kind: "field", name: "confidenceLevel", static: false, private: false, access: { has: obj => "confidenceLevel" in obj, get: obj => obj.confidenceLevel, set: (obj, value) => { obj.confidenceLevel = value; } }, metadata: _metadata }, _confidenceLevel_initializers, _confidenceLevel_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.Objective = Objective;
function initObjectiveModel(sequelize) {
    Objective.init({
        objectiveId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'organization_id',
        },
        ownerId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'owner_id',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        alignmentLevel: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AlignmentLevel)),
            allowNull: false,
            field: 'alignment_level',
        },
        parentObjectiveId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'parent_objective_id',
        },
        timeFrame: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            field: 'time_frame',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'end_date',
        },
        weight: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 100,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(GoalStatus)),
            allowNull: false,
            defaultValue: GoalStatus.DRAFT,
        },
        progress: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        confidenceLevel: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 50,
            field: 'confidence_level',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'objectives',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['organization_id'] },
            { fields: ['owner_id'] },
            { fields: ['parent_objective_id'] },
            { fields: ['status'] },
            { fields: ['start_date', 'end_date'] },
        ],
    });
    return Objective;
}
/**
 * Key Result Model
 */
let KeyResult = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _keyResultId_decorators;
    let _keyResultId_initializers = [];
    let _keyResultId_extraInitializers = [];
    let _objectiveId_decorators;
    let _objectiveId_initializers = [];
    let _objectiveId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _measurementType_decorators;
    let _measurementType_initializers = [];
    let _measurementType_extraInitializers = [];
    let _startValue_decorators;
    let _startValue_initializers = [];
    let _startValue_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _progress_decorators;
    let _progress_initializers = [];
    let _progress_extraInitializers = [];
    let _milestones_decorators;
    let _milestones_initializers = [];
    let _milestones_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class KeyResult extends _classSuper {
            constructor() {
                super(...arguments);
                this.keyResultId = __runInitializers(this, _keyResultId_initializers, void 0);
                this.objectiveId = (__runInitializers(this, _keyResultId_extraInitializers), __runInitializers(this, _objectiveId_initializers, void 0));
                this.title = (__runInitializers(this, _objectiveId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.measurementType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _measurementType_initializers, void 0));
                this.startValue = (__runInitializers(this, _measurementType_extraInitializers), __runInitializers(this, _startValue_initializers, void 0));
                this.targetValue = (__runInitializers(this, _startValue_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.currentValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
                this.unit = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.weight = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.status = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.progress = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progress_initializers, void 0));
                this.milestones = (__runInitializers(this, _progress_extraInitializers), __runInitializers(this, _milestones_initializers, void 0));
                this.createdAt = (__runInitializers(this, _milestones_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _keyResultId_decorators = [(0, swagger_1.ApiProperty)()];
            _objectiveId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _measurementType_decorators = [(0, swagger_1.ApiProperty)()];
            _startValue_decorators = [(0, swagger_1.ApiProperty)()];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)()];
            _currentValue_decorators = [(0, swagger_1.ApiProperty)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)()];
            _weight_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _progress_decorators = [(0, swagger_1.ApiProperty)()];
            _milestones_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _keyResultId_decorators, { kind: "field", name: "keyResultId", static: false, private: false, access: { has: obj => "keyResultId" in obj, get: obj => obj.keyResultId, set: (obj, value) => { obj.keyResultId = value; } }, metadata: _metadata }, _keyResultId_initializers, _keyResultId_extraInitializers);
            __esDecorate(null, null, _objectiveId_decorators, { kind: "field", name: "objectiveId", static: false, private: false, access: { has: obj => "objectiveId" in obj, get: obj => obj.objectiveId, set: (obj, value) => { obj.objectiveId = value; } }, metadata: _metadata }, _objectiveId_initializers, _objectiveId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _measurementType_decorators, { kind: "field", name: "measurementType", static: false, private: false, access: { has: obj => "measurementType" in obj, get: obj => obj.measurementType, set: (obj, value) => { obj.measurementType = value; } }, metadata: _metadata }, _measurementType_initializers, _measurementType_extraInitializers);
            __esDecorate(null, null, _startValue_decorators, { kind: "field", name: "startValue", static: false, private: false, access: { has: obj => "startValue" in obj, get: obj => obj.startValue, set: (obj, value) => { obj.startValue = value; } }, metadata: _metadata }, _startValue_initializers, _startValue_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: obj => "progress" in obj, get: obj => obj.progress, set: (obj, value) => { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
            __esDecorate(null, null, _milestones_decorators, { kind: "field", name: "milestones", static: false, private: false, access: { has: obj => "milestones" in obj, get: obj => obj.milestones, set: (obj, value) => { obj.milestones = value; } }, metadata: _metadata }, _milestones_initializers, _milestones_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KeyResult = KeyResult;
function initKeyResultModel(sequelize) {
    KeyResult.init({
        keyResultId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            field: 'key_result_id',
        },
        objectiveId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'objective_id',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        measurementType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(KPIMeasurementType)),
            allowNull: false,
            field: 'measurement_type',
        },
        startValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'start_value',
        },
        targetValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'target_value',
        },
        currentValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'current_value',
        },
        unit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        weight: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 100,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(GoalStatus)),
            allowNull: false,
            defaultValue: GoalStatus.DRAFT,
        },
        progress: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        milestones: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'key_results',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['objective_id'] },
            { fields: ['status'] },
        ],
    });
    return KeyResult;
}
/**
 * KPI Model
 */
let KPI = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _kpiId_decorators;
    let _kpiId_initializers = [];
    let _kpiId_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _measurementType_decorators;
    let _measurementType_initializers = [];
    let _measurementType_extraInitializers = [];
    let _formula_decorators;
    let _formula_initializers = [];
    let _formula_extraInitializers = [];
    let _dataSource_decorators;
    let _dataSource_initializers = [];
    let _dataSource_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _thresholdGreen_decorators;
    let _thresholdGreen_initializers = [];
    let _thresholdGreen_extraInitializers = [];
    let _thresholdYellow_decorators;
    let _thresholdYellow_initializers = [];
    let _thresholdYellow_extraInitializers = [];
    let _thresholdRed_decorators;
    let _thresholdRed_initializers = [];
    let _thresholdRed_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _trend_decorators;
    let _trend_initializers = [];
    let _trend_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class KPI extends _classSuper {
            constructor() {
                super(...arguments);
                this.kpiId = __runInitializers(this, _kpiId_initializers, void 0);
                this.organizationId = (__runInitializers(this, _kpiId_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.name = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.owner = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
                this.measurementType = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _measurementType_initializers, void 0));
                this.formula = (__runInitializers(this, _measurementType_extraInitializers), __runInitializers(this, _formula_initializers, void 0));
                this.dataSource = (__runInitializers(this, _formula_extraInitializers), __runInitializers(this, _dataSource_initializers, void 0));
                this.frequency = (__runInitializers(this, _dataSource_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.targetValue = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
                this.currentValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
                this.thresholdGreen = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _thresholdGreen_initializers, void 0));
                this.thresholdYellow = (__runInitializers(this, _thresholdGreen_extraInitializers), __runInitializers(this, _thresholdYellow_initializers, void 0));
                this.thresholdRed = (__runInitializers(this, _thresholdYellow_extraInitializers), __runInitializers(this, _thresholdRed_initializers, void 0));
                this.unit = (__runInitializers(this, _thresholdRed_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.trend = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _trend_initializers, void 0));
                this.priority = (__runInitializers(this, _trend_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.createdAt = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _kpiId_decorators = [(0, swagger_1.ApiProperty)()];
            _organizationId_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _category_decorators = [(0, swagger_1.ApiProperty)()];
            _owner_decorators = [(0, swagger_1.ApiProperty)()];
            _measurementType_decorators = [(0, swagger_1.ApiProperty)()];
            _formula_decorators = [(0, swagger_1.ApiProperty)()];
            _dataSource_decorators = [(0, swagger_1.ApiProperty)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)()];
            _targetValue_decorators = [(0, swagger_1.ApiProperty)()];
            _currentValue_decorators = [(0, swagger_1.ApiProperty)()];
            _thresholdGreen_decorators = [(0, swagger_1.ApiProperty)()];
            _thresholdYellow_decorators = [(0, swagger_1.ApiProperty)()];
            _thresholdRed_decorators = [(0, swagger_1.ApiProperty)()];
            _unit_decorators = [(0, swagger_1.ApiProperty)()];
            _trend_decorators = [(0, swagger_1.ApiProperty)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _kpiId_decorators, { kind: "field", name: "kpiId", static: false, private: false, access: { has: obj => "kpiId" in obj, get: obj => obj.kpiId, set: (obj, value) => { obj.kpiId = value; } }, metadata: _metadata }, _kpiId_initializers, _kpiId_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
            __esDecorate(null, null, _measurementType_decorators, { kind: "field", name: "measurementType", static: false, private: false, access: { has: obj => "measurementType" in obj, get: obj => obj.measurementType, set: (obj, value) => { obj.measurementType = value; } }, metadata: _metadata }, _measurementType_initializers, _measurementType_extraInitializers);
            __esDecorate(null, null, _formula_decorators, { kind: "field", name: "formula", static: false, private: false, access: { has: obj => "formula" in obj, get: obj => obj.formula, set: (obj, value) => { obj.formula = value; } }, metadata: _metadata }, _formula_initializers, _formula_extraInitializers);
            __esDecorate(null, null, _dataSource_decorators, { kind: "field", name: "dataSource", static: false, private: false, access: { has: obj => "dataSource" in obj, get: obj => obj.dataSource, set: (obj, value) => { obj.dataSource = value; } }, metadata: _metadata }, _dataSource_initializers, _dataSource_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
            __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
            __esDecorate(null, null, _thresholdGreen_decorators, { kind: "field", name: "thresholdGreen", static: false, private: false, access: { has: obj => "thresholdGreen" in obj, get: obj => obj.thresholdGreen, set: (obj, value) => { obj.thresholdGreen = value; } }, metadata: _metadata }, _thresholdGreen_initializers, _thresholdGreen_extraInitializers);
            __esDecorate(null, null, _thresholdYellow_decorators, { kind: "field", name: "thresholdYellow", static: false, private: false, access: { has: obj => "thresholdYellow" in obj, get: obj => obj.thresholdYellow, set: (obj, value) => { obj.thresholdYellow = value; } }, metadata: _metadata }, _thresholdYellow_initializers, _thresholdYellow_extraInitializers);
            __esDecorate(null, null, _thresholdRed_decorators, { kind: "field", name: "thresholdRed", static: false, private: false, access: { has: obj => "thresholdRed" in obj, get: obj => obj.thresholdRed, set: (obj, value) => { obj.thresholdRed = value; } }, metadata: _metadata }, _thresholdRed_initializers, _thresholdRed_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _trend_decorators, { kind: "field", name: "trend", static: false, private: false, access: { has: obj => "trend" in obj, get: obj => obj.trend, set: (obj, value) => { obj.trend = value; } }, metadata: _metadata }, _trend_initializers, _trend_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KPI = KPI;
function initKPIModel(sequelize) {
    KPI.init({
        kpiId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            field: 'kpi_id',
        },
        organizationId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'organization_id',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(150),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        owner: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        measurementType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(KPIMeasurementType)),
            allowNull: false,
            field: 'measurement_type',
        },
        formula: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        dataSource: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            field: 'data_source',
        },
        frequency: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        targetValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'target_value',
        },
        currentValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'current_value',
        },
        thresholdGreen: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'threshold_green',
        },
        thresholdYellow: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'threshold_yellow',
        },
        thresholdRed: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            field: 'threshold_red',
        },
        unit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        trend: {
            type: sequelize_1.DataTypes.ENUM('up', 'down', 'stable'),
            allowNull: false,
            defaultValue: 'stable',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
    }, {
        sequelize,
        tableName: 'kpis',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['organization_id'] },
            { fields: ['category'] },
            { fields: ['owner'] },
            { fields: ['priority'] },
        ],
    });
    return KPI;
}
/**
 * Performance Review Model
 */
let PerformanceReview = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _reviewId_decorators;
    let _reviewId_initializers = [];
    let _reviewId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _reviewCycle_decorators;
    let _reviewCycle_initializers = [];
    let _reviewCycle_extraInitializers = [];
    let _reviewPeriodStart_decorators;
    let _reviewPeriodStart_initializers = [];
    let _reviewPeriodStart_extraInitializers = [];
    let _reviewPeriodEnd_decorators;
    let _reviewPeriodEnd_initializers = [];
    let _reviewPeriodEnd_extraInitializers = [];
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    let _goalAchievement_decorators;
    let _goalAchievement_initializers = [];
    let _goalAchievement_extraInitializers = [];
    let _competencyRatings_decorators;
    let _competencyRatings_initializers = [];
    let _competencyRatings_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _areasForImprovement_decorators;
    let _areasForImprovement_initializers = [];
    let _areasForImprovement_extraInitializers = [];
    let _developmentGoals_decorators;
    let _developmentGoals_initializers = [];
    let _developmentGoals_extraInitializers = [];
    let _promotionRecommendation_decorators;
    let _promotionRecommendation_initializers = [];
    let _promotionRecommendation_extraInitializers = [];
    let _compensationRecommendation_decorators;
    let _compensationRecommendation_initializers = [];
    let _compensationRecommendation_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class PerformanceReview extends _classSuper {
            constructor() {
                super(...arguments);
                this.reviewId = __runInitializers(this, _reviewId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _reviewId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.reviewerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
                this.reviewCycle = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _reviewCycle_initializers, void 0));
                this.reviewPeriodStart = (__runInitializers(this, _reviewCycle_extraInitializers), __runInitializers(this, _reviewPeriodStart_initializers, void 0));
                this.reviewPeriodEnd = (__runInitializers(this, _reviewPeriodStart_extraInitializers), __runInitializers(this, _reviewPeriodEnd_initializers, void 0));
                this.overallRating = (__runInitializers(this, _reviewPeriodEnd_extraInitializers), __runInitializers(this, _overallRating_initializers, void 0));
                this.goalAchievement = (__runInitializers(this, _overallRating_extraInitializers), __runInitializers(this, _goalAchievement_initializers, void 0));
                this.competencyRatings = (__runInitializers(this, _goalAchievement_extraInitializers), __runInitializers(this, _competencyRatings_initializers, void 0));
                this.strengths = (__runInitializers(this, _competencyRatings_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
                this.areasForImprovement = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _areasForImprovement_initializers, void 0));
                this.developmentGoals = (__runInitializers(this, _areasForImprovement_extraInitializers), __runInitializers(this, _developmentGoals_initializers, void 0));
                this.promotionRecommendation = (__runInitializers(this, _developmentGoals_extraInitializers), __runInitializers(this, _promotionRecommendation_initializers, void 0));
                this.compensationRecommendation = (__runInitializers(this, _promotionRecommendation_extraInitializers), __runInitializers(this, _compensationRecommendation_initializers, void 0));
                this.comments = (__runInitializers(this, _compensationRecommendation_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.status = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _reviewId_decorators = [(0, swagger_1.ApiProperty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewerId_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewCycle_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewPeriodStart_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewPeriodEnd_decorators = [(0, swagger_1.ApiProperty)()];
            _overallRating_decorators = [(0, swagger_1.ApiProperty)()];
            _goalAchievement_decorators = [(0, swagger_1.ApiProperty)()];
            _competencyRatings_decorators = [(0, swagger_1.ApiProperty)()];
            _strengths_decorators = [(0, swagger_1.ApiProperty)()];
            _areasForImprovement_decorators = [(0, swagger_1.ApiProperty)()];
            _developmentGoals_decorators = [(0, swagger_1.ApiProperty)()];
            _promotionRecommendation_decorators = [(0, swagger_1.ApiProperty)()];
            _compensationRecommendation_decorators = [(0, swagger_1.ApiProperty)()];
            _comments_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _reviewId_decorators, { kind: "field", name: "reviewId", static: false, private: false, access: { has: obj => "reviewId" in obj, get: obj => obj.reviewId, set: (obj, value) => { obj.reviewId = value; } }, metadata: _metadata }, _reviewId_initializers, _reviewId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
            __esDecorate(null, null, _reviewCycle_decorators, { kind: "field", name: "reviewCycle", static: false, private: false, access: { has: obj => "reviewCycle" in obj, get: obj => obj.reviewCycle, set: (obj, value) => { obj.reviewCycle = value; } }, metadata: _metadata }, _reviewCycle_initializers, _reviewCycle_extraInitializers);
            __esDecorate(null, null, _reviewPeriodStart_decorators, { kind: "field", name: "reviewPeriodStart", static: false, private: false, access: { has: obj => "reviewPeriodStart" in obj, get: obj => obj.reviewPeriodStart, set: (obj, value) => { obj.reviewPeriodStart = value; } }, metadata: _metadata }, _reviewPeriodStart_initializers, _reviewPeriodStart_extraInitializers);
            __esDecorate(null, null, _reviewPeriodEnd_decorators, { kind: "field", name: "reviewPeriodEnd", static: false, private: false, access: { has: obj => "reviewPeriodEnd" in obj, get: obj => obj.reviewPeriodEnd, set: (obj, value) => { obj.reviewPeriodEnd = value; } }, metadata: _metadata }, _reviewPeriodEnd_initializers, _reviewPeriodEnd_extraInitializers);
            __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
            __esDecorate(null, null, _goalAchievement_decorators, { kind: "field", name: "goalAchievement", static: false, private: false, access: { has: obj => "goalAchievement" in obj, get: obj => obj.goalAchievement, set: (obj, value) => { obj.goalAchievement = value; } }, metadata: _metadata }, _goalAchievement_initializers, _goalAchievement_extraInitializers);
            __esDecorate(null, null, _competencyRatings_decorators, { kind: "field", name: "competencyRatings", static: false, private: false, access: { has: obj => "competencyRatings" in obj, get: obj => obj.competencyRatings, set: (obj, value) => { obj.competencyRatings = value; } }, metadata: _metadata }, _competencyRatings_initializers, _competencyRatings_extraInitializers);
            __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
            __esDecorate(null, null, _areasForImprovement_decorators, { kind: "field", name: "areasForImprovement", static: false, private: false, access: { has: obj => "areasForImprovement" in obj, get: obj => obj.areasForImprovement, set: (obj, value) => { obj.areasForImprovement = value; } }, metadata: _metadata }, _areasForImprovement_initializers, _areasForImprovement_extraInitializers);
            __esDecorate(null, null, _developmentGoals_decorators, { kind: "field", name: "developmentGoals", static: false, private: false, access: { has: obj => "developmentGoals" in obj, get: obj => obj.developmentGoals, set: (obj, value) => { obj.developmentGoals = value; } }, metadata: _metadata }, _developmentGoals_initializers, _developmentGoals_extraInitializers);
            __esDecorate(null, null, _promotionRecommendation_decorators, { kind: "field", name: "promotionRecommendation", static: false, private: false, access: { has: obj => "promotionRecommendation" in obj, get: obj => obj.promotionRecommendation, set: (obj, value) => { obj.promotionRecommendation = value; } }, metadata: _metadata }, _promotionRecommendation_initializers, _promotionRecommendation_extraInitializers);
            __esDecorate(null, null, _compensationRecommendation_decorators, { kind: "field", name: "compensationRecommendation", static: false, private: false, access: { has: obj => "compensationRecommendation" in obj, get: obj => obj.compensationRecommendation, set: (obj, value) => { obj.compensationRecommendation = value; } }, metadata: _metadata }, _compensationRecommendation_initializers, _compensationRecommendation_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformanceReview = PerformanceReview;
function initPerformanceReviewModel(sequelize) {
    PerformanceReview.init({
        reviewId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            field: 'review_id',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'employee_id',
        },
        reviewerId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'reviewer_id',
        },
        reviewCycle: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            field: 'review_cycle',
        },
        reviewPeriodStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'review_period_start',
        },
        reviewPeriodEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'review_period_end',
        },
        overallRating: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PerformanceRating)),
            allowNull: false,
            field: 'overall_rating',
        },
        goalAchievement: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            field: 'goal_achievement',
        },
        competencyRatings: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            field: 'competency_ratings',
        },
        strengths: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
        },
        areasForImprovement: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            field: 'areas_for_improvement',
        },
        developmentGoals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            field: 'development_goals',
        },
        promotionRecommendation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'promotion_recommendation',
        },
        compensationRecommendation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            field: 'compensation_recommendation',
        },
        comments: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'calibrated', 'finalized'),
            allowNull: false,
            defaultValue: 'draft',
        },
    }, {
        sequelize,
        tableName: 'performance_reviews',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['employee_id'] },
            { fields: ['reviewer_id'] },
            { fields: ['review_cycle'] },
            { fields: ['status'] },
        ],
    });
    return PerformanceReview;
}
/**
 * Performance Improvement Plan Model
 */
let PerformanceImprovementPlan = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _pipId_decorators;
    let _pipId_initializers = [];
    let _pipId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _concernsIdentified_decorators;
    let _concernsIdentified_initializers = [];
    let _concernsIdentified_extraInitializers = [];
    let _performanceGaps_decorators;
    let _performanceGaps_initializers = [];
    let _performanceGaps_extraInitializers = [];
    let _improvementActions_decorators;
    let _improvementActions_initializers = [];
    let _improvementActions_extraInitializers = [];
    let _successCriteria_decorators;
    let _successCriteria_initializers = [];
    let _successCriteria_extraInitializers = [];
    let _supportProvided_decorators;
    let _supportProvided_initializers = [];
    let _supportProvided_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _progressNotes_decorators;
    let _progressNotes_initializers = [];
    let _progressNotes_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class PerformanceImprovementPlan extends _classSuper {
            constructor() {
                super(...arguments);
                this.pipId = __runInitializers(this, _pipId_initializers, void 0);
                this.employeeId = (__runInitializers(this, _pipId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
                this.managerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                this.startDate = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.reviewDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.concernsIdentified = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _concernsIdentified_initializers, void 0));
                this.performanceGaps = (__runInitializers(this, _concernsIdentified_extraInitializers), __runInitializers(this, _performanceGaps_initializers, void 0));
                this.improvementActions = (__runInitializers(this, _performanceGaps_extraInitializers), __runInitializers(this, _improvementActions_initializers, void 0));
                this.successCriteria = (__runInitializers(this, _improvementActions_extraInitializers), __runInitializers(this, _successCriteria_initializers, void 0));
                this.supportProvided = (__runInitializers(this, _successCriteria_extraInitializers), __runInitializers(this, _supportProvided_initializers, void 0));
                this.status = (__runInitializers(this, _supportProvided_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.progressNotes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progressNotes_initializers, void 0));
                this.outcome = (__runInitializers(this, _progressNotes_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
                this.createdAt = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _pipId_decorators = [(0, swagger_1.ApiProperty)()];
            _employeeId_decorators = [(0, swagger_1.ApiProperty)()];
            _managerId_decorators = [(0, swagger_1.ApiProperty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewDate_decorators = [(0, swagger_1.ApiProperty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)()];
            _concernsIdentified_decorators = [(0, swagger_1.ApiProperty)()];
            _performanceGaps_decorators = [(0, swagger_1.ApiProperty)()];
            _improvementActions_decorators = [(0, swagger_1.ApiProperty)()];
            _successCriteria_decorators = [(0, swagger_1.ApiProperty)()];
            _supportProvided_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)()];
            _progressNotes_decorators = [(0, swagger_1.ApiProperty)()];
            _outcome_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _pipId_decorators, { kind: "field", name: "pipId", static: false, private: false, access: { has: obj => "pipId" in obj, get: obj => obj.pipId, set: (obj, value) => { obj.pipId = value; } }, metadata: _metadata }, _pipId_initializers, _pipId_extraInitializers);
            __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _concernsIdentified_decorators, { kind: "field", name: "concernsIdentified", static: false, private: false, access: { has: obj => "concernsIdentified" in obj, get: obj => obj.concernsIdentified, set: (obj, value) => { obj.concernsIdentified = value; } }, metadata: _metadata }, _concernsIdentified_initializers, _concernsIdentified_extraInitializers);
            __esDecorate(null, null, _performanceGaps_decorators, { kind: "field", name: "performanceGaps", static: false, private: false, access: { has: obj => "performanceGaps" in obj, get: obj => obj.performanceGaps, set: (obj, value) => { obj.performanceGaps = value; } }, metadata: _metadata }, _performanceGaps_initializers, _performanceGaps_extraInitializers);
            __esDecorate(null, null, _improvementActions_decorators, { kind: "field", name: "improvementActions", static: false, private: false, access: { has: obj => "improvementActions" in obj, get: obj => obj.improvementActions, set: (obj, value) => { obj.improvementActions = value; } }, metadata: _metadata }, _improvementActions_initializers, _improvementActions_extraInitializers);
            __esDecorate(null, null, _successCriteria_decorators, { kind: "field", name: "successCriteria", static: false, private: false, access: { has: obj => "successCriteria" in obj, get: obj => obj.successCriteria, set: (obj, value) => { obj.successCriteria = value; } }, metadata: _metadata }, _successCriteria_initializers, _successCriteria_extraInitializers);
            __esDecorate(null, null, _supportProvided_decorators, { kind: "field", name: "supportProvided", static: false, private: false, access: { has: obj => "supportProvided" in obj, get: obj => obj.supportProvided, set: (obj, value) => { obj.supportProvided = value; } }, metadata: _metadata }, _supportProvided_initializers, _supportProvided_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _progressNotes_decorators, { kind: "field", name: "progressNotes", static: false, private: false, access: { has: obj => "progressNotes" in obj, get: obj => obj.progressNotes, set: (obj, value) => { obj.progressNotes = value; } }, metadata: _metadata }, _progressNotes_initializers, _progressNotes_extraInitializers);
            __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformanceImprovementPlan = PerformanceImprovementPlan;
function initPerformanceImprovementPlanModel(sequelize) {
    PerformanceImprovementPlan.init({
        pipId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            field: 'pip_id',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'employee_id',
        },
        managerId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: 'manager_id',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
        },
        reviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'review_date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: 'end_date',
        },
        concernsIdentified: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            field: 'concerns_identified',
        },
        performanceGaps: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            field: 'performance_gaps',
        },
        improvementActions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            field: 'improvement_actions',
        },
        successCriteria: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            field: 'success_criteria',
        },
        supportProvided: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            field: 'support_provided',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PIPStatus)),
            allowNull: false,
            defaultValue: PIPStatus.ACTIVE,
        },
        progressNotes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            field: 'progress_notes',
        },
        outcome: {
            type: sequelize_1.DataTypes.ENUM('successful', 'unsuccessful'),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'performance_improvement_plans',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['employee_id'] },
            { fields: ['manager_id'] },
            { fields: ['status'] },
            { fields: ['start_date', 'end_date'] },
        ],
    });
    return PerformanceImprovementPlan;
}
// ============================================================================
// CORE FUNCTIONS
// ============================================================================
/**
 * Creates a new objective.
 *
 * @swagger
 * @openapi
 * /api/performance/objectives:
 *   post:
 *     tags:
 *       - Performance Management
 *     summary: Create objective
 *     description: Creates a new objective aligned to organizational goals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateObjectiveDto'
 *     responses:
 *       201:
 *         description: Objective created successfully
 *       400:
 *         description: Invalid input data
 *
 * @param {CreateObjectiveDto} data - Objective data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ObjectiveData>} Created objective
 *
 * @example
 * ```typescript
 * const objective = await createObjective({
 *   title: 'Improve Customer Satisfaction',
 *   description: 'Increase NPS by implementing customer feedback loop',
 *   alignmentLevel: AlignmentLevel.DEPARTMENT,
 *   timeFrame: 'Q1 2024',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   weight: 30
 * });
 * ```
 */
async function createObjective(data, transaction) {
    const objectiveId = data.objectiveId || `OBJ-${Date.now()}`;
    return {
        objectiveId,
        organizationId: data.organizationId || '',
        ownerId: data.ownerId || '',
        title: data.title || '',
        description: data.description || '',
        alignmentLevel: data.alignmentLevel || AlignmentLevel.INDIVIDUAL,
        parentObjectiveId: data.parentObjectiveId,
        timeFrame: data.timeFrame || 'Q1 2024',
        startDate: data.startDate || new Date(),
        endDate: data.endDate || new Date(),
        weight: data.weight || 100,
        status: data.status || GoalStatus.DRAFT,
        progress: data.progress || 0,
        confidenceLevel: data.confidenceLevel || 50,
        metadata: data.metadata || {},
    };
}
/**
 * Creates a key result for an objective.
 *
 * @param {CreateKeyResultDto} data - Key result data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KeyResultData>} Created key result
 *
 * @example
 * ```typescript
 * const keyResult = await createKeyResult({
 *   objectiveId: 'OBJ-123',
 *   title: 'Achieve NPS of 70+',
 *   measurementType: KPIMeasurementType.NUMERIC,
 *   startValue: 55,
 *   targetValue: 70,
 *   unit: 'points',
 *   weight: 50
 * });
 * ```
 */
async function createKeyResult(data, transaction) {
    const keyResultId = data.keyResultId || `KR-${Date.now()}`;
    const currentValue = data.currentValue || data.startValue || 0;
    const progress = calculateProgress(data.startValue || 0, currentValue, data.targetValue || 0);
    return {
        keyResultId,
        objectiveId: data.objectiveId || '',
        title: data.title || '',
        description: data.description || '',
        measurementType: data.measurementType || KPIMeasurementType.NUMERIC,
        startValue: data.startValue || 0,
        targetValue: data.targetValue || 0,
        currentValue,
        unit: data.unit || '',
        weight: data.weight || 100,
        status: data.status || GoalStatus.DRAFT,
        progress,
        milestones: data.milestones || [],
    };
}
/**
 * Calculates progress percentage.
 *
 * @param {number} startValue - Starting value
 * @param {number} currentValue - Current value
 * @param {number} targetValue - Target value
 * @returns {number} Progress percentage (0-100)
 */
function calculateProgress(startValue, currentValue, targetValue) {
    if (targetValue === startValue)
        return 100;
    const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
    return Math.max(0, Math.min(100, progress));
}
/**
 * Updates key result progress.
 *
 * @param {string} keyResultId - Key result ID
 * @param {number} newValue - New current value
 * @returns {Promise<KeyResultData>} Updated key result
 */
async function updateKeyResultProgress(keyResultId, newValue) {
    // Simulated - would fetch from database
    const keyResult = {
        keyResultId,
        startValue: 55,
        targetValue: 70,
        currentValue: newValue,
    };
    const progress = calculateProgress(keyResult.startValue, newValue, keyResult.targetValue);
    let status = GoalStatus.ACTIVE;
    if (progress >= 100) {
        status = GoalStatus.COMPLETED;
    }
    else if (progress < 25) {
        status = GoalStatus.AT_RISK;
    }
    return {
        ...keyResult,
        progress,
        status,
    };
}
/**
 * Creates a KPI.
 *
 * @param {CreateKPIDto} data - KPI data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KPIData>} Created KPI
 */
async function createKPI(data, transaction) {
    const kpiId = data.kpiId || `KPI-${Date.now()}`;
    return {
        kpiId,
        organizationId: data.organizationId || '',
        name: data.name || '',
        description: data.description || '',
        category: data.category || '',
        owner: data.owner || '',
        measurementType: data.measurementType || KPIMeasurementType.NUMERIC,
        formula: data.formula || '',
        dataSource: data.dataSource || '',
        frequency: data.frequency || 'monthly',
        targetValue: data.targetValue || 0,
        currentValue: data.currentValue || 0,
        thresholdGreen: data.thresholdGreen || 0,
        thresholdYellow: data.thresholdYellow || 0,
        thresholdRed: data.thresholdRed || 0,
        unit: data.unit || '',
        trend: data.trend || 'stable',
        priority: data.priority || 'medium',
    };
}
/**
 * Updates KPI value and calculates trend.
 *
 * @param {string} kpiId - KPI ID
 * @param {number} newValue - New value
 * @param {number} previousValue - Previous value
 * @returns {Promise<KPIData>} Updated KPI
 */
async function updateKPIValue(kpiId, newValue, previousValue) {
    const trend = newValue > previousValue ? 'up' :
        newValue < previousValue ? 'down' : 'stable';
    return {
        kpiId,
        currentValue: newValue,
        trend,
    };
}
/**
 * Evaluates KPI status based on thresholds.
 *
 * @param {KPIData} kpi - KPI data
 * @returns {Object} KPI status evaluation
 */
function evaluateKPIStatus(kpi) {
    const value = kpi.currentValue;
    let status;
    let message;
    if (value >= kpi.thresholdGreen) {
        status = 'green';
        message = 'KPI is meeting or exceeding target';
    }
    else if (value >= kpi.thresholdYellow) {
        status = 'yellow';
        message = 'KPI is approaching target but needs attention';
    }
    else {
        status = 'red';
        message = 'KPI is below acceptable threshold - immediate action required';
    }
    const performanceLevel = (value / kpi.targetValue) * 100;
    return { status, message, performanceLevel };
}
/**
 * Creates a balanced scorecard.
 *
 * @param {Partial<BalancedScorecardData>} data - Scorecard data
 * @returns {Promise<BalancedScorecardData>} Created scorecard
 */
async function createBalancedScorecard(data) {
    const scorecardId = data.scorecardId || `BSC-${Date.now()}`;
    return {
        scorecardId,
        organizationId: data.organizationId || '',
        name: data.name || '',
        description: data.description || '',
        timeframe: data.timeframe || 'Q1 2024',
        perspectives: data.perspectives || [],
        overallScore: data.overallScore || 0,
        status: data.status || 'draft',
    };
}
/**
 * Adds a perspective to balanced scorecard.
 *
 * @param {string} scorecardId - Scorecard ID
 * @param {BalancedScorecardPerspective} perspective - Perspective type
 * @param {Partial<ScorecardPerspective>} data - Perspective data
 * @returns {Promise<ScorecardPerspective>} Created perspective
 */
async function addScorecardPerspective(scorecardId, perspective, data) {
    const perspectiveId = `PERSP-${Date.now()}`;
    return {
        perspectiveId,
        perspective,
        objectives: data.objectives || [],
        measures: data.measures || [],
        targets: data.targets || [],
        initiatives: data.initiatives || [],
        weight: data.weight || 25,
        score: data.score || 0,
    };
}
/**
 * Calculates balanced scorecard overall score.
 *
 * @param {ScorecardPerspective[]} perspectives - All perspectives
 * @returns {number} Overall weighted score
 */
function calculateBalancedScorecardScore(perspectives) {
    const totalWeight = perspectives.reduce((sum, p) => sum + p.weight, 0);
    const weightedScore = perspectives.reduce((sum, p) => sum + (p.score * p.weight), 0);
    return totalWeight > 0 ? weightedScore / totalWeight : 0;
}
/**
 * Creates a 360 feedback request.
 *
 * @param {CreateFeedbackRequestDto} data - Feedback request data
 * @returns {Promise<FeedbackRequestData>} Created feedback request
 */
async function create360FeedbackRequest(data) {
    const requestId = data.requestId || `FBR-${Date.now()}`;
    return {
        requestId,
        subjectId: data.subjectId || '',
        subjectName: data.subjectName || '',
        requesterId: data.requesterId || '',
        feedbackType: data.feedbackType || FeedbackType.PEER,
        reviewers: data.reviewers || [],
        questions: data.questions || [],
        dueDate: data.dueDate || new Date(),
        purpose: data.purpose || '',
        isAnonymous: data.isAnonymous || false,
        status: data.status || 'pending',
    };
}
/**
 * Submits 360 feedback response.
 *
 * @param {Partial<FeedbackResponseData>} data - Feedback response data
 * @returns {Promise<FeedbackResponseData>} Submitted feedback response
 */
async function submit360FeedbackResponse(data) {
    const responseId = data.responseId || `FBR-${Date.now()}`;
    return {
        responseId,
        requestId: data.requestId || '',
        reviewerId: data.reviewerId || '',
        responses: data.responses || [],
        overallRating: data.overallRating,
        strengths: data.strengths || [],
        areasForImprovement: data.areasForImprovement || [],
        submittedAt: new Date(),
    };
}
/**
 * Aggregates 360 feedback responses.
 *
 * @param {string} requestId - Feedback request ID
 * @param {FeedbackResponseData[]} responses - All responses
 * @returns {Object} Aggregated feedback
 */
function aggregate360Feedback(requestId, responses) {
    const responseCount = responses.length;
    const ratings = responses
        .map(r => r.overallRating)
        .filter((r) => r !== undefined);
    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;
    const allStrengths = responses.flatMap(r => r.strengths);
    const allImprovements = responses.flatMap(r => r.areasForImprovement);
    const strengthCounts = {};
    allStrengths.forEach(s => {
        strengthCounts[s] = (strengthCounts[s] || 0) + 1;
    });
    const improvementCounts = {};
    allImprovements.forEach(i => {
        improvementCounts[i] = (improvementCounts[i] || 0) + 1;
    });
    const commonStrengths = Object.entries(strengthCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([strength]) => strength);
    const commonImprovementAreas = Object.entries(improvementCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([area]) => area);
    return {
        requestId,
        responseCount,
        averageRating,
        commonStrengths,
        commonImprovementAreas,
        thematicAnalysis: { ...strengthCounts, ...improvementCounts },
    };
}
/**
 * Creates a performance review.
 *
 * @param {CreatePerformanceReviewDto} data - Review data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceReviewData>} Created review
 */
async function createPerformanceReview(data, transaction) {
    const reviewId = data.reviewId || `REV-${Date.now()}`;
    return {
        reviewId,
        employeeId: data.employeeId || '',
        reviewerId: data.reviewerId || '',
        reviewCycle: data.reviewCycle || '',
        reviewPeriodStart: data.reviewPeriodStart || new Date(),
        reviewPeriodEnd: data.reviewPeriodEnd || new Date(),
        overallRating: data.overallRating || PerformanceRating.MEETS_EXPECTATIONS,
        goalAchievement: data.goalAchievement || 0,
        competencyRatings: data.competencyRatings || [],
        strengths: data.strengths || [],
        areasForImprovement: data.areasForImprovement || [],
        developmentGoals: data.developmentGoals || [],
        promotionRecommendation: data.promotionRecommendation || false,
        compensationRecommendation: data.compensationRecommendation || '',
        comments: data.comments || '',
        status: data.status || 'draft',
    };
}
/**
 * Creates a calibration session.
 *
 * @param {CreateCalibrationSessionDto} data - Calibration session data
 * @returns {Promise<CalibrationSessionData>} Created session
 */
async function createCalibrationSession(data) {
    const sessionId = data.sessionId || `CAL-${Date.now()}`;
    return {
        sessionId,
        organizationId: data.organizationId || '',
        sessionName: data.sessionName || '',
        calibrationCycle: data.calibrationCycle || '',
        facilitatorId: data.facilitatorId || '',
        participants: data.participants || [],
        reviews: data.reviews || [],
        sessionDate: data.sessionDate || new Date(),
        ratingDistribution: data.ratingDistribution || {
            unsatisfactory: 0,
            needsImprovement: 0,
            meetsExpectations: 0,
            exceedsExpectations: 0,
            outstanding: 0,
            targetDistribution: {
                [PerformanceRating.UNSATISFACTORY]: 5,
                [PerformanceRating.NEEDS_IMPROVEMENT]: 10,
                [PerformanceRating.MEETS_EXPECTATIONS]: 70,
                [PerformanceRating.EXCEEDS_EXPECTATIONS]: 10,
                [PerformanceRating.OUTSTANDING]: 5,
            },
            actualDistribution: {
                [PerformanceRating.UNSATISFACTORY]: 0,
                [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
                [PerformanceRating.MEETS_EXPECTATIONS]: 0,
                [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
                [PerformanceRating.OUTSTANDING]: 0,
            },
        },
        decisions: [],
        status: data.status || 'scheduled',
    };
}
/**
 * Calibrates performance rating.
 *
 * @param {string} sessionId - Calibration session ID
 * @param {string} reviewId - Review ID
 * @param {PerformanceRating} originalRating - Original rating
 * @param {PerformanceRating} calibratedRating - Calibrated rating
 * @param {string} rationale - Calibration rationale
 * @returns {Promise<CalibrationDecisionData>} Calibration decision
 */
async function calibratePerformanceRating(sessionId, reviewId, originalRating, calibratedRating, rationale) {
    const decisionId = `CALDEC-${Date.now()}`;
    let decision;
    if (originalRating === calibratedRating) {
        decision = CalibrationDecision.CONFIRMED;
    }
    else {
        const ratingOrder = [
            PerformanceRating.UNSATISFACTORY,
            PerformanceRating.NEEDS_IMPROVEMENT,
            PerformanceRating.MEETS_EXPECTATIONS,
            PerformanceRating.EXCEEDS_EXPECTATIONS,
            PerformanceRating.OUTSTANDING,
        ];
        const originalIndex = ratingOrder.indexOf(originalRating);
        const calibratedIndex = ratingOrder.indexOf(calibratedRating);
        decision = calibratedIndex > originalIndex
            ? CalibrationDecision.UPGRADED
            : CalibrationDecision.DOWNGRADED;
    }
    return {
        decisionId,
        sessionId,
        reviewId,
        employeeId: '',
        originalRating,
        calibratedRating,
        decision,
        rationale,
        discussionNotes: '',
        approvedBy: '',
    };
}
/**
 * Validates rating distribution against target.
 *
 * @param {RatingDistribution} distribution - Rating distribution
 * @returns {Object} Validation result
 */
function validateRatingDistribution(distribution) {
    const variances = {};
    const recommendations = [];
    Object.values(PerformanceRating).forEach((rating) => {
        const target = distribution.targetDistribution[rating] || 0;
        const actual = distribution.actualDistribution[rating] || 0;
        const variance = actual - target;
        variances[rating] = variance;
        if (Math.abs(variance) > 5) {
            recommendations.push(`${rating}: ${variance > 0 ? 'Reduce' : 'Increase'} by ${Math.abs(variance)}%`);
        }
    });
    const isValid = recommendations.length === 0;
    return { isValid, variances, recommendations };
}
/**
 * Cascades goals from parent to child level.
 *
 * @param {string} parentObjectiveId - Parent objective ID
 * @param {AlignmentLevel} childLevel - Child alignment level
 * @param {string[]} childOwnerIds - Child owner IDs
 * @returns {Promise<GoalCascadeData>} Goal cascade structure
 */
async function cascadeGoals(parentObjectiveId, childLevel, childOwnerIds) {
    const cascadeId = `CASCADE-${Date.now()}`;
    const childGoals = childOwnerIds.map((ownerId, index) => ({
        objectiveId: `OBJ-CHILD-${Date.now()}-${index}`,
        organizationId: '',
        ownerId,
        title: `Cascaded Objective for ${ownerId}`,
        description: 'Cascaded from parent objective',
        alignmentLevel: childLevel,
        parentObjectiveId,
        timeFrame: 'Q1 2024',
        startDate: new Date(),
        endDate: new Date(),
        weight: 100,
        status: GoalStatus.DRAFT,
        progress: 0,
        confidenceLevel: 50,
    }));
    return {
        cascadeId,
        organizationId: '',
        topLevelObjectiveId: parentObjectiveId,
        cascadeLevels: [
            {
                level: childLevel,
                parentGoalId: parentObjectiveId,
                childGoals,
                alignmentStrength: 85,
            },
        ],
        totalGoals: childGoals.length,
        alignmentScore: 85,
        completionPercentage: 0,
    };
}
/**
 * Validates goal alignment.
 *
 * @param {ObjectiveData} childGoal - Child goal
 * @param {ObjectiveData} parentGoal - Parent goal
 * @returns {Object} Alignment validation
 */
function validateGoalAlignment(childGoal, parentGoal) {
    const issues = [];
    const recommendations = [];
    // Check time frame alignment
    if (childGoal.startDate < parentGoal.startDate) {
        issues.push('Child goal starts before parent goal');
    }
    if (childGoal.endDate > parentGoal.endDate) {
        issues.push('Child goal ends after parent goal');
    }
    // Check status alignment
    if (parentGoal.status === GoalStatus.COMPLETED && childGoal.status !== GoalStatus.COMPLETED) {
        issues.push('Parent goal completed but child goal is not');
    }
    // Calculate alignment score
    let alignmentScore = 100;
    alignmentScore -= issues.length * 15;
    const isAligned = alignmentScore >= 70;
    if (!isAligned) {
        recommendations.push('Review goal timelines and status');
        recommendations.push('Ensure child goals support parent goal objectives');
    }
    return { isAligned, alignmentScore, issues, recommendations };
}
/**
 * Creates a performance improvement plan (PIP).
 *
 * @param {CreatePIPDto} data - PIP data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceImprovementPlanData>} Created PIP
 */
async function createPerformanceImprovementPlan(data, transaction) {
    const pipId = data.pipId || `PIP-${Date.now()}`;
    return {
        pipId,
        employeeId: data.employeeId || '',
        managerId: data.managerId || '',
        startDate: data.startDate || new Date(),
        reviewDate: data.reviewDate || new Date(),
        endDate: data.endDate || new Date(),
        concernsIdentified: data.concernsIdentified || [],
        performanceGaps: data.performanceGaps || [],
        improvementActions: data.improvementActions || [],
        successCriteria: data.successCriteria || [],
        supportProvided: data.supportProvided || [],
        status: data.status || PIPStatus.ACTIVE,
        progressNotes: data.progressNotes || [],
        outcome: data.outcome,
    };
}
/**
 * Adds progress note to PIP.
 *
 * @param {string} pipId - PIP ID
 * @param {Partial<ProgressNote>} noteData - Progress note data
 * @returns {Promise<ProgressNote>} Added progress note
 */
async function addPIPProgressNote(pipId, noteData) {
    const noteId = `NOTE-${Date.now()}`;
    return {
        noteId,
        date: new Date(),
        author: noteData.author || '',
        observation: noteData.observation || '',
        progress: noteData.progress || 'neutral',
        nextSteps: noteData.nextSteps || [],
    };
}
/**
 * Evaluates PIP success.
 *
 * @param {PerformanceImprovementPlanData} pip - PIP data
 * @returns {Object} PIP evaluation
 */
function evaluatePIPSuccess(pip) {
    const totalActions = pip.improvementActions.length;
    const completedActions = pip.improvementActions.filter(a => a.status === 'completed').length;
    const completionRate = totalActions > 0
        ? (completedActions / totalActions) * 100
        : 0;
    const positiveProgressNotes = pip.progressNotes.filter(n => n.progress === 'positive').length;
    const totalProgressNotes = pip.progressNotes.length;
    const positiveRatio = totalProgressNotes > 0
        ? positiveProgressNotes / totalProgressNotes
        : 0;
    let recommendation;
    if (completionRate >= 80 && positiveRatio >= 0.7) {
        recommendation = 'close_successful';
    }
    else if (completionRate >= 50 && positiveRatio >= 0.5) {
        recommendation = 'continue';
    }
    else if (completionRate < 50 && new Date() >= pip.endDate) {
        recommendation = 'close_unsuccessful';
    }
    else {
        recommendation = 'extend';
    }
    const isSuccessful = recommendation === 'close_successful';
    return { isSuccessful, completionRate, positiveProgressNotes, recommendation };
}
/**
 * Creates continuous feedback.
 *
 * @param {Partial<ContinuousFeedbackData>} data - Feedback data
 * @returns {Promise<ContinuousFeedbackData>} Created feedback
 */
async function createContinuousFeedback(data) {
    const feedbackId = data.feedbackId || `CFB-${Date.now()}`;
    return {
        feedbackId,
        giverId: data.giverId || '',
        receiverId: data.receiverId || '',
        feedbackDate: new Date(),
        context: data.context || '',
        positiveObservations: data.positiveObservations || [],
        constructiveSuggestions: data.constructiveSuggestions || [],
        actionableItems: data.actionableItems || [],
        isPrivate: data.isPrivate || false,
        isAcknowledged: false,
    };
}
/**
 * Acknowledges continuous feedback.
 *
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<ContinuousFeedbackData>} Updated feedback
 */
async function acknowledgeContinuousFeedback(feedbackId) {
    return {
        feedbackId,
        isAcknowledged: true,
        acknowledgedAt: new Date(),
    };
}
/**
 * Analyzes feedback trends.
 *
 * @param {string} employeeId - Employee ID
 * @param {ContinuousFeedbackData[]} feedbackList - List of feedback
 * @returns {Object} Feedback trend analysis
 */
function analyzeFeedbackTrends(employeeId, feedbackList) {
    const totalFeedback = feedbackList.length;
    const allPositive = feedbackList.flatMap(f => f.positiveObservations);
    const allConstructive = feedbackList.flatMap(f => f.constructiveSuggestions);
    const positiveCount = allPositive.length;
    const constructiveCount = allConstructive.length;
    // Simple frequency analysis
    const positiveCounts = {};
    allPositive.forEach(obs => {
        positiveCounts[obs] = (positiveCounts[obs] || 0) + 1;
    });
    const constructiveCounts = {};
    allConstructive.forEach(sug => {
        constructiveCounts[sug] = (constructiveCounts[sug] || 0) + 1;
    });
    const topPositiveThemes = Object.entries(positiveCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme]) => theme);
    const topImprovementThemes = Object.entries(constructiveCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme]) => theme);
    // Feedback velocity (feedback per month)
    const monthsSpan = 3; // Assume 3 month period
    const feedbackVelocity = totalFeedback / monthsSpan;
    return {
        totalFeedback,
        positiveCount,
        constructiveCount,
        topPositiveThemes,
        topImprovementThemes,
        feedbackVelocity,
    };
}
/**
 * Creates a talent review.
 *
 * @param {Partial<TalentReviewData>} data - Talent review data
 * @returns {Promise<TalentReviewData>} Created talent review
 */
async function createTalentReview(data) {
    const reviewId = data.reviewId || `TR-${Date.now()}`;
    return {
        reviewId,
        organizationId: data.organizationId || '',
        reviewCycle: data.reviewCycle || '',
        reviewDate: new Date(),
        participants: data.participants || [],
        employeesReviewed: data.employeesReviewed || [],
        nineBoxGrid: data.nineBoxGrid || {
            gridId: `GRID-${Date.now()}`,
            positions: {},
            distribution: {},
        },
        successionPlans: data.successionPlans || [],
        talentActions: data.talentActions || [],
    };
}
/**
 * Plots employee on 9-box grid.
 *
 * @param {PerformanceRating} performanceRating - Performance rating
 * @param {'low' | 'medium' | 'high'} potentialRating - Potential rating
 * @returns {string} 9-box position
 */
function plotOn9Box(performanceRating, potentialRating) {
    const performanceMap = {
        [PerformanceRating.UNSATISFACTORY]: 'low',
        [PerformanceRating.NEEDS_IMPROVEMENT]: 'low',
        [PerformanceRating.MEETS_EXPECTATIONS]: 'medium',
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 'high',
        [PerformanceRating.OUTSTANDING]: 'high',
    };
    const performance = performanceMap[performanceRating];
    const boxMap = {
        'low-low': 'Box 1: Low Performance, Low Potential',
        'low-medium': 'Box 2: Low Performance, Medium Potential',
        'low-high': 'Box 3: Low Performance, High Potential',
        'medium-low': 'Box 4: Medium Performance, Low Potential',
        'medium-medium': 'Box 5: Medium Performance, Medium Potential',
        'medium-high': 'Box 6: Medium Performance, High Potential',
        'high-low': 'Box 7: High Performance, Low Potential',
        'high-medium': 'Box 8: High Performance, Medium Potential',
        'high-high': 'Box 9: High Performance, High Potential',
    };
    return boxMap[`${performance}-${potentialRating}`];
}
/**
 * Generates succession plan recommendations.
 *
 * @param {string} criticalRole - Critical role title
 * @param {TalentReviewEmployee[]} potentialSuccessors - Potential successors
 * @returns {SuccessionPlan} Succession plan
 */
function generateSuccessionPlan(criticalRole, potentialSuccessors) {
    const planId = `SUCC-${Date.now()}`;
    // Sort by performance and potential
    const rankedSuccessors = potentialSuccessors.sort((a, b) => {
        const ratingOrder = [
            PerformanceRating.UNSATISFACTORY,
            PerformanceRating.NEEDS_IMPROVEMENT,
            PerformanceRating.MEETS_EXPECTATIONS,
            PerformanceRating.EXCEEDS_EXPECTATIONS,
            PerformanceRating.OUTSTANDING,
        ];
        const aIndex = ratingOrder.indexOf(a.performanceRating);
        const bIndex = ratingOrder.indexOf(b.performanceRating);
        if (bIndex !== aIndex)
            return bIndex - aIndex;
        const potentialOrder = { low: 1, medium: 2, high: 3 };
        return potentialOrder[b.potentialRating] - potentialOrder[a.potentialRating];
    });
    const successors = rankedSuccessors.map((emp) => {
        let readiness;
        if (emp.performanceRating === PerformanceRating.OUTSTANDING && emp.potentialRating === 'high') {
            readiness = 'ready_now';
        }
        else if (emp.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS && emp.potentialRating !== 'low') {
            readiness = '1_year';
        }
        else if (emp.potentialRating === 'high') {
            readiness = '2_3_years';
        }
        else {
            readiness = 'long_term';
        }
        return {
            candidateId: emp.employeeId,
            candidateName: emp.employeeName,
            readiness,
            developmentNeeds: emp.developmentNeeds,
            strengthsAlignment: [],
        };
    });
    const riskLevel = successors.filter(s => s.readiness === 'ready_now').length === 0
        ? 'high'
        : successors.length < 2
            ? 'medium'
            : 'low';
    return {
        planId,
        criticalRole,
        successors,
        developmentTimeline: '12-36 months',
        riskLevel,
    };
}
/**
 * Generates performance analytics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @returns {Promise<PerformanceAnalytics>} Performance analytics
 */
async function generatePerformanceAnalytics(organizationId, reviews, objectives) {
    const totalEmployees = reviews.length;
    const ratingDistribution = {
        [PerformanceRating.UNSATISFACTORY]: 0,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
        [PerformanceRating.MEETS_EXPECTATIONS]: 0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
        [PerformanceRating.OUTSTANDING]: 0,
    };
    reviews.forEach(review => {
        ratingDistribution[review.overallRating]++;
    });
    const completedGoals = objectives.filter(obj => obj.status === GoalStatus.COMPLETED).length;
    const goalCompletionRate = objectives.length > 0
        ? (completedGoals / objectives.length) * 100
        : 0;
    const averageGoalProgress = objectives.length > 0
        ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length
        : 0;
    const topPerformers = reviews
        .filter(r => r.overallRating === PerformanceRating.OUTSTANDING)
        .map(r => r.employeeId);
    const atRiskEmployees = reviews
        .filter(r => r.overallRating === PerformanceRating.NEEDS_IMPROVEMENT ||
        r.overallRating === PerformanceRating.UNSATISFACTORY)
        .map(r => r.employeeId);
    return {
        organizationId,
        analysisPeriod: 'Q1 2024',
        totalEmployees,
        ratingDistribution,
        goalCompletionRate,
        averageGoalProgress,
        feedbackVelocity: 4.5,
        calibrationVariance: 8.2,
        topPerformers,
        atRiskEmployees,
        trendsAnalysis: [
            {
                metric: 'Goal Completion Rate',
                currentValue: goalCompletionRate,
                previousValue: goalCompletionRate - 5,
                changePercentage: 5,
                trend: 'improving',
                insights: ['Improved goal tracking and accountability'],
            },
        ],
    };
}
/**
 * Exports OKRs to structured format.
 *
 * @param {string} organizationId - Organization ID
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {KeyResultData[]} keyResults - Key results
 * @returns {Object} Exported OKR data
 */
function exportOKRs(organizationId, objectives, keyResults) {
    const okrs = objectives.map(objective => {
        const relatedKeyResults = keyResults.filter(kr => kr.objectiveId === objective.objectiveId);
        return { objective, keyResults: relatedKeyResults };
    });
    return {
        organizationId,
        exportDate: new Date(),
        okrs,
    };
}
/**
 * Imports OKRs from external format.
 *
 * @param {any} okrData - External OKR data
 * @returns {Promise<{ objectives: ObjectiveData[]; keyResults: KeyResultData[] }>} Imported OKRs
 */
async function importOKRs(okrData) {
    const objectives = [];
    const keyResults = [];
    // Parse external format (example implementation)
    if (Array.isArray(okrData.okrs)) {
        okrData.okrs.forEach((okr) => {
            objectives.push(okr.objective);
            keyResults.push(...okr.keyResults);
        });
    }
    return { objectives, keyResults };
}
/**
 * Calculates team performance score.
 *
 * @param {PerformanceReviewData[]} teamReviews - Team member reviews
 * @returns {Object} Team performance metrics
 */
function calculateTeamPerformanceScore(teamReviews) {
    const teamSize = teamReviews.length;
    const ratingValues = {
        [PerformanceRating.UNSATISFACTORY]: 1,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 2,
        [PerformanceRating.MEETS_EXPECTATIONS]: 3,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
        [PerformanceRating.OUTSTANDING]: 5,
    };
    const totalRatingValue = teamReviews.reduce((sum, review) => sum + ratingValues[review.overallRating], 0);
    const averageRating = teamSize > 0 ? totalRatingValue / teamSize : 0;
    const goalAchievementAvg = teamSize > 0
        ? teamReviews.reduce((sum, r) => sum + r.goalAchievement, 0) / teamSize
        : 0;
    // Distribution balance (how well-distributed ratings are)
    const ratingCounts = {
        [PerformanceRating.UNSATISFACTORY]: 0,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
        [PerformanceRating.MEETS_EXPECTATIONS]: 0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
        [PerformanceRating.OUTSTANDING]: 0,
    };
    teamReviews.forEach(review => {
        ratingCounts[review.overallRating]++;
    });
    const distributionBalance = 100 - (Math.abs(ratingCounts[PerformanceRating.OUTSTANDING] -
        ratingCounts[PerformanceRating.UNSATISFACTORY]) * 5);
    const teamHealthScore = (averageRating / 5) * 40 +
        (goalAchievementAvg / 100) * 40 +
        (distributionBalance / 100) * 20;
    return {
        teamSize,
        averageRating,
        goalAchievementAvg,
        distributionBalance,
        teamHealthScore,
    };
}
/**
 * Generates performance improvement recommendations.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {string[]} Recommendations
 */
function generatePerformanceRecommendations(review) {
    const recommendations = [];
    // Goal achievement recommendations
    if (review.goalAchievement < 50) {
        recommendations.push('Consider creating a Performance Improvement Plan');
        recommendations.push('Schedule weekly 1-on-1s to discuss goal progress');
    }
    else if (review.goalAchievement < 75) {
        recommendations.push('Provide additional support and resources for goal achievement');
    }
    // Rating-based recommendations
    if (review.overallRating === PerformanceRating.OUTSTANDING) {
        recommendations.push('Consider for promotion or expanded responsibilities');
        recommendations.push('Assign as mentor for other team members');
    }
    else if (review.overallRating === PerformanceRating.EXCEEDS_EXPECTATIONS) {
        recommendations.push('Provide stretch assignments to continue growth');
    }
    else if (review.overallRating === PerformanceRating.NEEDS_IMPROVEMENT) {
        recommendations.push('Implement structured coaching plan');
        recommendations.push('Identify skill gaps and provide training');
    }
    else if (review.overallRating === PerformanceRating.UNSATISFACTORY) {
        recommendations.push('Initiate Performance Improvement Plan immediately');
        recommendations.push('Consider role realignment or transition planning');
    }
    // Development goals
    if (review.developmentGoals.length === 0) {
        recommendations.push('Establish clear development goals for next review period');
    }
    return recommendations;
}
/**
 * Schedules performance review cycle.
 *
 * @param {string} organizationId - Organization ID
 * @param {ReviewCycleFrequency} frequency - Review frequency
 * @param {Date} startDate - Cycle start date
 * @returns {Object} Review cycle schedule
 */
function schedulePerformanceReviewCycle(organizationId, frequency, startDate) {
    const cycleId = `CYCLE-${Date.now()}`;
    const reviewPeriods = [];
    const monthsPerCycle = {
        [ReviewCycleFrequency.QUARTERLY]: 3,
        [ReviewCycleFrequency.SEMI_ANNUAL]: 6,
        [ReviewCycleFrequency.ANNUAL]: 12,
        [ReviewCycleFrequency.CONTINUOUS]: 1,
    };
    const months = monthsPerCycle[frequency];
    const periodsPerYear = 12 / months;
    for (let i = 0; i < periodsPerYear; i++) {
        const periodStart = new Date(startDate);
        periodStart.setMonth(startDate.getMonth() + (i * months));
        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodStart.getMonth() + months);
        periodEnd.setDate(periodEnd.getDate() - 1);
        const dueDate = new Date(periodEnd);
        dueDate.setDate(periodEnd.getDate() + 14); // 2 weeks after period end
        reviewPeriods.push({
            period: `${frequency.toUpperCase()}-${i + 1}`,
            startDate: periodStart,
            endDate: periodEnd,
            dueDate,
        });
    }
    return { cycleId, frequency, reviewPeriods };
}
/**
 * Calculates compensation adjustment based on performance.
 *
 * @param {PerformanceRating} rating - Performance rating
 * @param {number} currentSalary - Current salary
 * @param {number} budgetPool - Available budget pool percentage
 * @returns {Object} Compensation recommendation
 */
function calculateCompensationAdjustment(rating, currentSalary, budgetPool) {
    const increaseMultipliers = {
        [PerformanceRating.UNSATISFACTORY]: 0,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 0.5,
        [PerformanceRating.MEETS_EXPECTATIONS]: 1.0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 1.5,
        [PerformanceRating.OUTSTANDING]: 2.0,
    };
    const baseIncrease = budgetPool * increaseMultipliers[rating];
    const recommendedIncrease = currentSalary * (baseIncrease / 100);
    const newSalary = currentSalary + recommendedIncrease;
    const rationales = {
        [PerformanceRating.UNSATISFACTORY]: 'No increase recommended due to performance concerns',
        [PerformanceRating.NEEDS_IMPROVEMENT]: 'Minimal increase - performance improvement required',
        [PerformanceRating.MEETS_EXPECTATIONS]: 'Standard merit increase for meeting expectations',
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 'Above-average increase for exceeding expectations',
        [PerformanceRating.OUTSTANDING]: 'Maximum increase for outstanding performance',
    };
    return {
        recommendedIncrease,
        increasePercentage: baseIncrease,
        newSalary,
        rationale: rationales[rating],
    };
}
/**
 * Identifies high-potential employees.
 *
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {TalentReviewEmployee[]} talentData - Talent review data
 * @returns {TalentReviewEmployee[]} High-potential employees
 */
function identifyHighPotentialEmployees(reviews, talentData) {
    return talentData.filter(emp => {
        const review = reviews.find(r => r.employeeId === emp.employeeId);
        return (emp.potentialRating === 'high' &&
            (emp.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS ||
                emp.performanceRating === PerformanceRating.OUTSTANDING) &&
            review?.promotionRecommendation === true);
    });
}
/**
 * Generates development plan from performance review.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {Object} Development plan
 */
function generateDevelopmentPlan(review) {
    const developmentAreas = review.areasForImprovement.map((area, index) => {
        const categories = [
            DevelopmentCategory.TECHNICAL_SKILLS,
            DevelopmentCategory.LEADERSHIP,
            DevelopmentCategory.COMMUNICATION,
            DevelopmentCategory.COLLABORATION,
            DevelopmentCategory.INNOVATION,
            DevelopmentCategory.EXECUTION,
        ];
        const category = categories[index % categories.length];
        const suggestedActions = [
            'Enroll in targeted training program',
            'Seek mentorship from senior team member',
            'Take on stretch assignment in this area',
            'Attend relevant workshops or conferences',
        ];
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + 6);
        return {
            area,
            category,
            priority: index < 2 ? 'high' : 'medium',
            suggestedActions: suggestedActions.slice(0, 2),
            targetCompletionDate: targetDate,
        };
    });
    return {
        employeeId: review.employeeId,
        developmentAreas,
        learningObjectives: review.developmentGoals,
        estimatedDuration: '6-12 months',
    };
}
/**
 * Analyzes goal alignment across organization.
 *
 * @param {ObjectiveData[]} allObjectives - All organizational objectives
 * @returns {Object} Alignment analysis
 */
function analyzeOrganizationalAlignment(allObjectives) {
    const alignmentByLevel = {
        [AlignmentLevel.COMPANY]: 0,
        [AlignmentLevel.DIVISION]: 0,
        [AlignmentLevel.DEPARTMENT]: 0,
        [AlignmentLevel.TEAM]: 0,
        [AlignmentLevel.INDIVIDUAL]: 0,
    };
    allObjectives.forEach(obj => {
        alignmentByLevel[obj.alignmentLevel]++;
    });
    const orphanedGoals = allObjectives
        .filter(obj => obj.alignmentLevel !== AlignmentLevel.COMPANY &&
        !obj.parentObjectiveId)
        .map(obj => obj.objectiveId);
    const totalObjectives = allObjectives.length;
    const alignedGoals = totalObjectives - orphanedGoals.length;
    const alignmentHealth = totalObjectives > 0
        ? (alignedGoals / totalObjectives) * 100
        : 100;
    // Calculate cascade depth
    const getDepth = (objId, depth = 0) => {
        const children = allObjectives.filter(o => o.parentObjectiveId === objId);
        if (children.length === 0)
            return depth;
        return Math.max(...children.map(c => getDepth(c.objectiveId, depth + 1)));
    };
    const companyObjectives = allObjectives.filter(o => o.alignmentLevel === AlignmentLevel.COMPANY);
    const cascadeDepth = companyObjectives.length > 0
        ? Math.max(...companyObjectives.map(o => getDepth(o.objectiveId)))
        : 0;
    return {
        totalObjectives,
        alignmentByLevel,
        cascadeDepth,
        orphanedGoals,
        alignmentHealth,
    };
}
/**
 * Generates performance dashboard metrics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {ContinuousFeedbackData[]} feedback - Continuous feedback
 * @returns {Object} Dashboard metrics
 */
function generatePerformanceDashboard(organizationId, reviews, objectives, feedback) {
    const activeGoals = objectives.filter(o => o.status === GoalStatus.ACTIVE).length;
    const completedGoals = objectives.filter(o => o.status === GoalStatus.COMPLETED).length;
    const goalCompletionRate = objectives.length > 0
        ? (completedGoals / objectives.length) * 100
        : 0;
    const ratingValues = {
        [PerformanceRating.UNSATISFACTORY]: 1,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 2,
        [PerformanceRating.MEETS_EXPECTATIONS]: 3,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
        [PerformanceRating.OUTSTANDING]: 5,
    };
    const totalRatingValue = reviews.reduce((sum, r) => sum + ratingValues[r.overallRating], 0);
    const averagePerformanceRating = reviews.length > 0
        ? totalRatingValue / reviews.length
        : 0;
    const calibratedReviews = reviews.filter(r => r.status === 'calibrated' || r.status === 'finalized');
    const calibrationCoverage = reviews.length > 0
        ? (calibratedReviews.length / reviews.length) * 100
        : 0;
    const alerts = [];
    if (goalCompletionRate < 50) {
        alerts.push('Goal completion rate is below 50% - review goal-setting process');
    }
    if (averagePerformanceRating < 2.5) {
        alerts.push('Average performance rating is low - investigate team challenges');
    }
    if (calibrationCoverage < 80) {
        alerts.push('Calibration coverage is incomplete - schedule remaining sessions');
    }
    if (feedback.length < reviews.length * 2) {
        alerts.push('Feedback engagement is low - encourage continuous feedback culture');
    }
    return {
        organizationId,
        period: 'Current Quarter',
        metrics: {
            activeGoals,
            goalCompletionRate,
            averagePerformanceRating,
            feedbackCount: feedback.length,
            employeesWithPIPs: 0,
            calibrationCoverage,
        },
        trends: {
            performanceImprovement: 5.2,
            goalProgressVelocity: 12.5,
            feedbackEngagement: 8.3,
        },
        alerts,
    };
}
//# sourceMappingURL=performance-management-kit.js.map