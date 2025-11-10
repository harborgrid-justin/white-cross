"use strict";
/**
 * LOC: HCM_PERF_MGT_001
 * File: /reuse/server/human-capital/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Performance review services
 *   - 360 feedback implementations
 *   - Talent management systems
 *   - HR analytics & reporting
 *   - Compensation planning services
 *   - Development planning modules
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceManagementController = exports.PerformanceManagementService = exports.CalibrationSessionModel = exports.CompetencyAssessmentModel = exports.CompetencyModel = exports.PerformanceImprovementPlanModel = exports.ContinuousFeedbackModel = exports.Feedback360RequestModel = exports.ReviewSectionModel = exports.PerformanceReviewModel = exports.PerformanceReviewCycleModel = exports.CalibrationSessionSchema = exports.CompetencyAssessmentSchema = exports.PIPSchema = exports.ContinuousFeedbackSchema = exports.Feedback360RequestSchema = exports.ReviewSectionSchema = exports.PerformanceReviewSchema = exports.Feedback360Status = exports.CalibrationStatus = exports.CompetencyCategory = exports.PIPStatus = exports.FeedbackVisibility = exports.FeedbackType = exports.PerformanceRating = exports.RatingScaleType = exports.ReviewStatus = exports.ReviewCycleType = void 0;
exports.createReviewCycle = createReviewCycle;
exports.createPerformanceReview = createPerformanceReview;
exports.updatePerformanceReview = updatePerformanceReview;
exports.getPerformanceReviewById = getPerformanceReviewById;
exports.getEmployeePerformanceReviews = getEmployeePerformanceReviews;
exports.finalizePerformanceReview = finalizePerformanceReview;
exports.addReviewSection = addReviewSection;
exports.updateReviewSection = updateReviewSection;
exports.getReviewSections = getReviewSections;
exports.calculateOverallScore = calculateOverallScore;
exports.create360FeedbackRequest = create360FeedbackRequest;
exports.submit360FeedbackResponse = submit360FeedbackResponse;
exports.get360FeedbackRequests = get360FeedbackRequests;
exports.get360FeedbackRequestsForRespondent = get360FeedbackRequestsForRespondent;
exports.aggregate360Feedback = aggregate360Feedback;
exports.createContinuousFeedback = createContinuousFeedback;
exports.getEmployeeContinuousFeedback = getEmployeeContinuousFeedback;
exports.acknowledgeFeedback = acknowledgeFeedback;
exports.getFeedbackStatistics = getFeedbackStatistics;
exports.createPerformanceImprovementPlan = createPerformanceImprovementPlan;
exports.updatePIPStatus = updatePIPStatus;
exports.approvePIP = approvePIP;
exports.getEmployeePIPs = getEmployeePIPs;
exports.getActivePIPsForManager = getActivePIPsForManager;
exports.createCompetency = createCompetency;
exports.addCompetencyAssessment = addCompetencyAssessment;
exports.updateCompetencyAssessment = updateCompetencyAssessment;
exports.getCompetencyAssessments = getCompetencyAssessments;
exports.getCompetencyGapAnalysis = getCompetencyGapAnalysis;
exports.createCalibrationSession = createCalibrationSession;
exports.updateCalibrationSession = updateCalibrationSession;
exports.addRatingAdjustment = addRatingAdjustment;
exports.getCalibrationSessions = getCalibrationSessions;
exports.completeCalibrationSession = completeCalibrationSession;
exports.getPerformanceDistribution = getPerformanceDistribution;
exports.getReviewCompletionStats = getReviewCompletionStats;
exports.getManagerPerformanceSummary = getManagerPerformanceSummary;
/**
 * File: /reuse/server/human-capital/performance-management-kit.ts
 * Locator: WC-HCM-PERF-MGT-001
 * Purpose: Performance Management Kit - Comprehensive performance review and appraisal system
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/hr/performance/*, ../services/talent/*, Analytics & Reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 48+ utility functions for performance management including performance reviews, 360 feedback,
 *          appraisal forms, rating scales, performance improvement plans (PIP), KPI management,
 *          continuous feedback, calibration sessions, performance analytics, development plans,
 *          competency assessments, goal linkage, review cycles, and reporting
 *
 * LLM Context: Enterprise-grade performance management for White Cross healthcare system with
 * SAP SuccessFactors Performance & Goal Management parity. Provides comprehensive performance review
 * cycles (annual, mid-year, quarterly), 360-degree feedback collection and analysis, competency-based
 * assessments, behavior-based rating scales, performance improvement plans (PIP), KPI tracking and
 * measurement, continuous feedback mechanisms, calibration session management, performance analytics,
 * compensation linkage, succession planning integration, development plan creation, multi-rater feedback,
 * self-assessment workflows, manager assessment tools, peer reviews, skip-level reviews, custom rating
 * scales, performance distribution analysis, forced ranking support, performance-based rewards integration,
 * HIPAA compliance for healthcare employee performance data, audit trails, and advanced reporting.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Performance review cycle type
 */
var ReviewCycleType;
(function (ReviewCycleType) {
    ReviewCycleType["ANNUAL"] = "annual";
    ReviewCycleType["MID_YEAR"] = "mid_year";
    ReviewCycleType["QUARTERLY"] = "quarterly";
    ReviewCycleType["PROBATION"] = "probation";
    ReviewCycleType["PROJECT_END"] = "project_end";
    ReviewCycleType["AD_HOC"] = "ad_hoc";
})(ReviewCycleType || (exports.ReviewCycleType = ReviewCycleType = {}));
/**
 * Review status enumeration
 */
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["NOT_STARTED"] = "not_started";
    ReviewStatus["SELF_ASSESSMENT"] = "self_assessment";
    ReviewStatus["MANAGER_REVIEW"] = "manager_review";
    ReviewStatus["CALIBRATION"] = "calibration";
    ReviewStatus["PEER_REVIEW"] = "peer_review";
    ReviewStatus["SKIP_LEVEL"] = "skip_level";
    ReviewStatus["HR_REVIEW"] = "hr_review";
    ReviewStatus["COMPLETED"] = "completed";
    ReviewStatus["CANCELLED"] = "cancelled";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
/**
 * Rating scale type
 */
var RatingScaleType;
(function (RatingScaleType) {
    RatingScaleType["NUMERIC_5_POINT"] = "numeric_5_point";
    RatingScaleType["NUMERIC_7_POINT"] = "numeric_7_point";
    RatingScaleType["NUMERIC_10_POINT"] = "numeric_10_point";
    RatingScaleType["BEHAVIORAL"] = "behavioral";
    RatingScaleType["COMPETENCY"] = "competency";
    RatingScaleType["CUSTOM"] = "custom";
})(RatingScaleType || (exports.RatingScaleType = RatingScaleType = {}));
/**
 * Performance rating enumeration
 */
var PerformanceRating;
(function (PerformanceRating) {
    PerformanceRating["OUTSTANDING"] = "outstanding";
    PerformanceRating["EXCEEDS_EXPECTATIONS"] = "exceeds_expectations";
    PerformanceRating["MEETS_EXPECTATIONS"] = "meets_expectations";
    PerformanceRating["NEEDS_IMPROVEMENT"] = "needs_improvement";
    PerformanceRating["UNSATISFACTORY"] = "unsatisfactory";
})(PerformanceRating || (exports.PerformanceRating = PerformanceRating = {}));
/**
 * Feedback type enumeration
 */
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["PRAISE"] = "praise";
    FeedbackType["CONSTRUCTIVE"] = "constructive";
    FeedbackType["DEVELOPMENTAL"] = "developmental";
    FeedbackType["COACHING"] = "coaching";
    FeedbackType["RECOGNITION"] = "recognition";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
/**
 * Feedback visibility
 */
var FeedbackVisibility;
(function (FeedbackVisibility) {
    FeedbackVisibility["PRIVATE"] = "private";
    FeedbackVisibility["MANAGER"] = "manager";
    FeedbackVisibility["EMPLOYEE"] = "employee";
    FeedbackVisibility["PUBLIC"] = "public";
})(FeedbackVisibility || (exports.FeedbackVisibility = FeedbackVisibility = {}));
/**
 * PIP status enumeration
 */
var PIPStatus;
(function (PIPStatus) {
    PIPStatus["DRAFT"] = "draft";
    PIPStatus["ACTIVE"] = "active";
    PIPStatus["IN_PROGRESS"] = "in_progress";
    PIPStatus["SUCCESSFUL"] = "successful";
    PIPStatus["UNSUCCESSFUL"] = "unsuccessful";
    PIPStatus["CANCELLED"] = "cancelled";
})(PIPStatus || (exports.PIPStatus = PIPStatus = {}));
/**
 * Competency category
 */
var CompetencyCategory;
(function (CompetencyCategory) {
    CompetencyCategory["LEADERSHIP"] = "leadership";
    CompetencyCategory["TECHNICAL"] = "technical";
    CompetencyCategory["BEHAVIORAL"] = "behavioral";
    CompetencyCategory["FUNCTIONAL"] = "functional";
    CompetencyCategory["CORE"] = "core";
})(CompetencyCategory || (exports.CompetencyCategory = CompetencyCategory = {}));
/**
 * Calibration session status
 */
var CalibrationStatus;
(function (CalibrationStatus) {
    CalibrationStatus["SCHEDULED"] = "scheduled";
    CalibrationStatus["IN_PROGRESS"] = "in_progress";
    CalibrationStatus["COMPLETED"] = "completed";
    CalibrationStatus["CANCELLED"] = "cancelled";
})(CalibrationStatus || (exports.CalibrationStatus = CalibrationStatus = {}));
/**
 * 360 feedback status
 */
var Feedback360Status;
(function (Feedback360Status) {
    Feedback360Status["PENDING"] = "pending";
    Feedback360Status["IN_PROGRESS"] = "in_progress";
    Feedback360Status["COMPLETED"] = "completed";
    Feedback360Status["DECLINED"] = "declined";
})(Feedback360Status || (exports.Feedback360Status = Feedback360Status = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Performance review validation schema
 */
exports.PerformanceReviewSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    reviewerId: zod_1.z.string().uuid(),
    cycleId: zod_1.z.string().uuid(),
    reviewType: zod_1.z.nativeEnum(ReviewCycleType),
    reviewPeriodStart: zod_1.z.coerce.date(),
    reviewPeriodEnd: zod_1.z.coerce.date(),
    status: zod_1.z.nativeEnum(ReviewStatus).default(ReviewStatus.NOT_STARTED),
    overallRating: zod_1.z.nativeEnum(PerformanceRating).optional(),
    overallScore: zod_1.z.number().min(0).max(100).optional(),
    selfAssessmentCompleted: zod_1.z.boolean().default(false),
    managerAssessmentCompleted: zod_1.z.boolean().default(false),
    calibrationCompleted: zod_1.z.boolean().default(false),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
}).refine((data) => data.reviewPeriodEnd > data.reviewPeriodStart, { message: 'Review period end must be after start date' });
/**
 * Review section validation schema
 */
exports.ReviewSectionSchema = zod_1.z.object({
    reviewId: zod_1.z.string().uuid(),
    sectionName: zod_1.z.string().min(1).max(200),
    sectionOrder: zod_1.z.number().int().min(0),
    weight: zod_1.z.number().min(0).max(100),
    rating: zod_1.z.nativeEnum(PerformanceRating).optional(),
    score: zod_1.z.number().min(0).max(100).optional(),
    comments: zod_1.z.string().max(5000).optional(),
    competencies: zod_1.z.array(zod_1.z.string()).optional(),
    evidence: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * 360 Feedback request validation schema
 */
exports.Feedback360RequestSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    reviewId: zod_1.z.string().uuid(),
    requesterId: zod_1.z.string().uuid(),
    respondentId: zod_1.z.string().uuid(),
    respondentType: zod_1.z.enum(['peer', 'manager', 'direct_report', 'skip_level', 'external']),
    dueDate: zod_1.z.coerce.date(),
    anonymousResponse: zod_1.z.boolean().default(false),
});
/**
 * Continuous feedback validation schema
 */
exports.ContinuousFeedbackSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    giverId: zod_1.z.string().uuid(),
    feedbackType: zod_1.z.nativeEnum(FeedbackType),
    visibility: zod_1.z.nativeEnum(FeedbackVisibility),
    content: zod_1.z.string().min(10).max(5000),
    relatedGoalId: zod_1.z.string().uuid().optional(),
    relatedProjectId: zod_1.z.string().uuid().optional(),
    isAnonymous: zod_1.z.boolean().default(false),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Performance Improvement Plan validation schema
 */
exports.PIPSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    managerId: zod_1.z.string().uuid(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    reviewDate: zod_1.z.coerce.date(),
    performanceIssues: zod_1.z.array(zod_1.z.string()).min(1),
    expectedImprovements: zod_1.z.array(zod_1.z.string()).min(1),
    supportProvided: zod_1.z.array(zod_1.z.string()),
    successCriteria: zod_1.z.array(zod_1.z.string()).min(1),
}).refine((data) => data.endDate > data.startDate, { message: 'End date must be after start date' });
/**
 * Competency assessment validation schema
 */
exports.CompetencyAssessmentSchema = zod_1.z.object({
    reviewId: zod_1.z.string().uuid(),
    competencyId: zod_1.z.string().uuid(),
    competencyName: zod_1.z.string().min(1).max(200),
    category: zod_1.z.nativeEnum(CompetencyCategory),
    expectedLevel: zod_1.z.number().int().min(1).max(5),
    currentLevel: zod_1.z.number().int().min(1).max(5),
    rating: zod_1.z.nativeEnum(PerformanceRating).optional(),
    assessorComments: zod_1.z.string().max(2000).optional(),
    employeeComments: zod_1.z.string().max(2000).optional(),
    developmentActions: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Calibration session validation schema
 */
exports.CalibrationSessionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    cycleId: zod_1.z.string().uuid(),
    facilitatorId: zod_1.z.string().uuid(),
    scheduledDate: zod_1.z.coerce.date(),
    participants: zod_1.z.array(zod_1.z.string().uuid()).min(2),
    reviewsDiscussed: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Performance Review Cycle Model
 */
let PerformanceReviewCycleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'performance_review_cycles',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['cycle_year'] },
                { fields: ['cycle_type'] },
                { fields: ['status'] },
                { fields: ['start_date', 'end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _cycleType_decorators;
    let _cycleType_initializers = [];
    let _cycleType_extraInitializers = [];
    let _cycleYear_decorators;
    let _cycleYear_initializers = [];
    let _cycleYear_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _selfAssessmentDeadline_decorators;
    let _selfAssessmentDeadline_initializers = [];
    let _selfAssessmentDeadline_extraInitializers = [];
    let _managerReviewDeadline_decorators;
    let _managerReviewDeadline_initializers = [];
    let _managerReviewDeadline_extraInitializers = [];
    let _calibrationDeadline_decorators;
    let _calibrationDeadline_initializers = [];
    let _calibrationDeadline_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _reviews_decorators;
    let _reviews_initializers = [];
    let _reviews_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PerformanceReviewCycleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.cycleType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _cycleType_initializers, void 0));
            this.cycleYear = (__runInitializers(this, _cycleType_extraInitializers), __runInitializers(this, _cycleYear_initializers, void 0));
            this.startDate = (__runInitializers(this, _cycleYear_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.selfAssessmentDeadline = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _selfAssessmentDeadline_initializers, void 0));
            this.managerReviewDeadline = (__runInitializers(this, _selfAssessmentDeadline_extraInitializers), __runInitializers(this, _managerReviewDeadline_initializers, void 0));
            this.calibrationDeadline = (__runInitializers(this, _managerReviewDeadline_extraInitializers), __runInitializers(this, _calibrationDeadline_initializers, void 0));
            this.status = (__runInitializers(this, _calibrationDeadline_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.description = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.configuration = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.reviews = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
            this.createdAt = (__runInitializers(this, _reviews_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PerformanceReviewCycleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Length)({ min: 1, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
                comment: 'Cycle name (e.g., "2024 Annual Review")',
            })];
        _cycleType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReviewCycleType)),
                allowNull: false,
                field: 'cycle_type',
            })];
        _cycleYear_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'cycle_year',
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'start_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'end_date',
            })];
        _selfAssessmentDeadline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'self_assessment_deadline',
            })];
        _managerReviewDeadline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'manager_review_deadline',
            })];
        _calibrationDeadline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'calibration_deadline',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('planning', 'active', 'calibration', 'completed', 'closed'),
                allowNull: false,
                defaultValue: 'planning',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _configuration_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Cycle configuration and settings',
            })];
        _reviews_decorators = [(0, sequelize_typescript_1.HasMany)(() => PerformanceReviewModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _cycleType_decorators, { kind: "field", name: "cycleType", static: false, private: false, access: { has: obj => "cycleType" in obj, get: obj => obj.cycleType, set: (obj, value) => { obj.cycleType = value; } }, metadata: _metadata }, _cycleType_initializers, _cycleType_extraInitializers);
        __esDecorate(null, null, _cycleYear_decorators, { kind: "field", name: "cycleYear", static: false, private: false, access: { has: obj => "cycleYear" in obj, get: obj => obj.cycleYear, set: (obj, value) => { obj.cycleYear = value; } }, metadata: _metadata }, _cycleYear_initializers, _cycleYear_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _selfAssessmentDeadline_decorators, { kind: "field", name: "selfAssessmentDeadline", static: false, private: false, access: { has: obj => "selfAssessmentDeadline" in obj, get: obj => obj.selfAssessmentDeadline, set: (obj, value) => { obj.selfAssessmentDeadline = value; } }, metadata: _metadata }, _selfAssessmentDeadline_initializers, _selfAssessmentDeadline_extraInitializers);
        __esDecorate(null, null, _managerReviewDeadline_decorators, { kind: "field", name: "managerReviewDeadline", static: false, private: false, access: { has: obj => "managerReviewDeadline" in obj, get: obj => obj.managerReviewDeadline, set: (obj, value) => { obj.managerReviewDeadline = value; } }, metadata: _metadata }, _managerReviewDeadline_initializers, _managerReviewDeadline_extraInitializers);
        __esDecorate(null, null, _calibrationDeadline_decorators, { kind: "field", name: "calibrationDeadline", static: false, private: false, access: { has: obj => "calibrationDeadline" in obj, get: obj => obj.calibrationDeadline, set: (obj, value) => { obj.calibrationDeadline = value; } }, metadata: _metadata }, _calibrationDeadline_initializers, _calibrationDeadline_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: obj => "reviews" in obj, get: obj => obj.reviews, set: (obj, value) => { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceReviewCycleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceReviewCycleModel = _classThis;
})();
exports.PerformanceReviewCycleModel = PerformanceReviewCycleModel;
/**
 * Performance Review Model
 */
let PerformanceReviewModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'performance_reviews',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['reviewer_id'] },
                { fields: ['cycle_id'] },
                { fields: ['status'] },
                { fields: ['review_period_start', 'review_period_end'] },
                { fields: ['overall_rating'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _cycleId_decorators;
    let _cycleId_initializers = [];
    let _cycleId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _reviewType_decorators;
    let _reviewType_initializers = [];
    let _reviewType_extraInitializers = [];
    let _reviewPeriodStart_decorators;
    let _reviewPeriodStart_initializers = [];
    let _reviewPeriodStart_extraInitializers = [];
    let _reviewPeriodEnd_decorators;
    let _reviewPeriodEnd_initializers = [];
    let _reviewPeriodEnd_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _selfAssessmentCompleted_decorators;
    let _selfAssessmentCompleted_initializers = [];
    let _selfAssessmentCompleted_extraInitializers = [];
    let _managerAssessmentCompleted_decorators;
    let _managerAssessmentCompleted_initializers = [];
    let _managerAssessmentCompleted_extraInitializers = [];
    let _calibrationCompleted_decorators;
    let _calibrationCompleted_initializers = [];
    let _calibrationCompleted_extraInitializers = [];
    let _managerComments_decorators;
    let _managerComments_initializers = [];
    let _managerComments_extraInitializers = [];
    let _employeeComments_decorators;
    let _employeeComments_initializers = [];
    let _employeeComments_extraInitializers = [];
    let _hrComments_decorators;
    let _hrComments_initializers = [];
    let _hrComments_extraInitializers = [];
    let _finalizedAt_decorators;
    let _finalizedAt_initializers = [];
    let _finalizedAt_extraInitializers = [];
    let _finalizedBy_decorators;
    let _finalizedBy_initializers = [];
    let _finalizedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _cycle_decorators;
    let _cycle_initializers = [];
    let _cycle_extraInitializers = [];
    let _sections_decorators;
    let _sections_initializers = [];
    let _sections_extraInitializers = [];
    let _feedback360Requests_decorators;
    let _feedback360Requests_initializers = [];
    let _feedback360Requests_extraInitializers = [];
    let _competencyAssessments_decorators;
    let _competencyAssessments_initializers = [];
    let _competencyAssessments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PerformanceReviewModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.cycleId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _cycleId_initializers, void 0));
            this.employeeId = (__runInitializers(this, _cycleId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.reviewType = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _reviewType_initializers, void 0));
            this.reviewPeriodStart = (__runInitializers(this, _reviewType_extraInitializers), __runInitializers(this, _reviewPeriodStart_initializers, void 0));
            this.reviewPeriodEnd = (__runInitializers(this, _reviewPeriodStart_extraInitializers), __runInitializers(this, _reviewPeriodEnd_initializers, void 0));
            this.status = (__runInitializers(this, _reviewPeriodEnd_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.overallRating = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _overallRating_initializers, void 0));
            this.overallScore = (__runInitializers(this, _overallRating_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
            this.selfAssessmentCompleted = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _selfAssessmentCompleted_initializers, void 0));
            this.managerAssessmentCompleted = (__runInitializers(this, _selfAssessmentCompleted_extraInitializers), __runInitializers(this, _managerAssessmentCompleted_initializers, void 0));
            this.calibrationCompleted = (__runInitializers(this, _managerAssessmentCompleted_extraInitializers), __runInitializers(this, _calibrationCompleted_initializers, void 0));
            this.managerComments = (__runInitializers(this, _calibrationCompleted_extraInitializers), __runInitializers(this, _managerComments_initializers, void 0));
            this.employeeComments = (__runInitializers(this, _managerComments_extraInitializers), __runInitializers(this, _employeeComments_initializers, void 0));
            this.hrComments = (__runInitializers(this, _employeeComments_extraInitializers), __runInitializers(this, _hrComments_initializers, void 0));
            this.finalizedAt = (__runInitializers(this, _hrComments_extraInitializers), __runInitializers(this, _finalizedAt_initializers, void 0));
            this.finalizedBy = (__runInitializers(this, _finalizedAt_extraInitializers), __runInitializers(this, _finalizedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _finalizedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.cycle = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _cycle_initializers, void 0));
            this.sections = (__runInitializers(this, _cycle_extraInitializers), __runInitializers(this, _sections_initializers, void 0));
            this.feedback360Requests = (__runInitializers(this, _sections_extraInitializers), __runInitializers(this, _feedback360Requests_initializers, void 0));
            this.competencyAssessments = (__runInitializers(this, _feedback360Requests_extraInitializers), __runInitializers(this, _competencyAssessments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _competencyAssessments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PerformanceReviewModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _cycleId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PerformanceReviewCycleModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'cycle_id',
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
                comment: 'Employee being reviewed',
            })];
        _reviewerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'reviewer_id',
                comment: 'Primary reviewer (usually manager)',
            })];
        _reviewType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReviewCycleType)),
                allowNull: false,
                field: 'review_type',
            })];
        _reviewPeriodStart_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'review_period_start',
            })];
        _reviewPeriodEnd_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'review_period_end',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReviewStatus)),
                allowNull: false,
                defaultValue: ReviewStatus.NOT_STARTED,
            })];
        _overallRating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceRating)),
                allowNull: true,
                field: 'overall_rating',
            })];
        _overallScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                field: 'overall_score',
                comment: 'Overall performance score (0-100)',
            })];
        _selfAssessmentCompleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'self_assessment_completed',
            })];
        _managerAssessmentCompleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'manager_assessment_completed',
            })];
        _calibrationCompleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'calibration_completed',
            })];
        _managerComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'manager_comments',
            })];
        _employeeComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'employee_comments',
            })];
        _hrComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'hr_comments',
            })];
        _finalizedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'finalized_at',
            })];
        _finalizedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'finalized_by',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _cycle_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PerformanceReviewCycleModel)];
        _sections_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReviewSectionModel)];
        _feedback360Requests_decorators = [(0, sequelize_typescript_1.HasMany)(() => Feedback360RequestModel)];
        _competencyAssessments_decorators = [(0, sequelize_typescript_1.HasMany)(() => CompetencyAssessmentModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _cycleId_decorators, { kind: "field", name: "cycleId", static: false, private: false, access: { has: obj => "cycleId" in obj, get: obj => obj.cycleId, set: (obj, value) => { obj.cycleId = value; } }, metadata: _metadata }, _cycleId_initializers, _cycleId_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _reviewType_decorators, { kind: "field", name: "reviewType", static: false, private: false, access: { has: obj => "reviewType" in obj, get: obj => obj.reviewType, set: (obj, value) => { obj.reviewType = value; } }, metadata: _metadata }, _reviewType_initializers, _reviewType_extraInitializers);
        __esDecorate(null, null, _reviewPeriodStart_decorators, { kind: "field", name: "reviewPeriodStart", static: false, private: false, access: { has: obj => "reviewPeriodStart" in obj, get: obj => obj.reviewPeriodStart, set: (obj, value) => { obj.reviewPeriodStart = value; } }, metadata: _metadata }, _reviewPeriodStart_initializers, _reviewPeriodStart_extraInitializers);
        __esDecorate(null, null, _reviewPeriodEnd_decorators, { kind: "field", name: "reviewPeriodEnd", static: false, private: false, access: { has: obj => "reviewPeriodEnd" in obj, get: obj => obj.reviewPeriodEnd, set: (obj, value) => { obj.reviewPeriodEnd = value; } }, metadata: _metadata }, _reviewPeriodEnd_initializers, _reviewPeriodEnd_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
        __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
        __esDecorate(null, null, _selfAssessmentCompleted_decorators, { kind: "field", name: "selfAssessmentCompleted", static: false, private: false, access: { has: obj => "selfAssessmentCompleted" in obj, get: obj => obj.selfAssessmentCompleted, set: (obj, value) => { obj.selfAssessmentCompleted = value; } }, metadata: _metadata }, _selfAssessmentCompleted_initializers, _selfAssessmentCompleted_extraInitializers);
        __esDecorate(null, null, _managerAssessmentCompleted_decorators, { kind: "field", name: "managerAssessmentCompleted", static: false, private: false, access: { has: obj => "managerAssessmentCompleted" in obj, get: obj => obj.managerAssessmentCompleted, set: (obj, value) => { obj.managerAssessmentCompleted = value; } }, metadata: _metadata }, _managerAssessmentCompleted_initializers, _managerAssessmentCompleted_extraInitializers);
        __esDecorate(null, null, _calibrationCompleted_decorators, { kind: "field", name: "calibrationCompleted", static: false, private: false, access: { has: obj => "calibrationCompleted" in obj, get: obj => obj.calibrationCompleted, set: (obj, value) => { obj.calibrationCompleted = value; } }, metadata: _metadata }, _calibrationCompleted_initializers, _calibrationCompleted_extraInitializers);
        __esDecorate(null, null, _managerComments_decorators, { kind: "field", name: "managerComments", static: false, private: false, access: { has: obj => "managerComments" in obj, get: obj => obj.managerComments, set: (obj, value) => { obj.managerComments = value; } }, metadata: _metadata }, _managerComments_initializers, _managerComments_extraInitializers);
        __esDecorate(null, null, _employeeComments_decorators, { kind: "field", name: "employeeComments", static: false, private: false, access: { has: obj => "employeeComments" in obj, get: obj => obj.employeeComments, set: (obj, value) => { obj.employeeComments = value; } }, metadata: _metadata }, _employeeComments_initializers, _employeeComments_extraInitializers);
        __esDecorate(null, null, _hrComments_decorators, { kind: "field", name: "hrComments", static: false, private: false, access: { has: obj => "hrComments" in obj, get: obj => obj.hrComments, set: (obj, value) => { obj.hrComments = value; } }, metadata: _metadata }, _hrComments_initializers, _hrComments_extraInitializers);
        __esDecorate(null, null, _finalizedAt_decorators, { kind: "field", name: "finalizedAt", static: false, private: false, access: { has: obj => "finalizedAt" in obj, get: obj => obj.finalizedAt, set: (obj, value) => { obj.finalizedAt = value; } }, metadata: _metadata }, _finalizedAt_initializers, _finalizedAt_extraInitializers);
        __esDecorate(null, null, _finalizedBy_decorators, { kind: "field", name: "finalizedBy", static: false, private: false, access: { has: obj => "finalizedBy" in obj, get: obj => obj.finalizedBy, set: (obj, value) => { obj.finalizedBy = value; } }, metadata: _metadata }, _finalizedBy_initializers, _finalizedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _cycle_decorators, { kind: "field", name: "cycle", static: false, private: false, access: { has: obj => "cycle" in obj, get: obj => obj.cycle, set: (obj, value) => { obj.cycle = value; } }, metadata: _metadata }, _cycle_initializers, _cycle_extraInitializers);
        __esDecorate(null, null, _sections_decorators, { kind: "field", name: "sections", static: false, private: false, access: { has: obj => "sections" in obj, get: obj => obj.sections, set: (obj, value) => { obj.sections = value; } }, metadata: _metadata }, _sections_initializers, _sections_extraInitializers);
        __esDecorate(null, null, _feedback360Requests_decorators, { kind: "field", name: "feedback360Requests", static: false, private: false, access: { has: obj => "feedback360Requests" in obj, get: obj => obj.feedback360Requests, set: (obj, value) => { obj.feedback360Requests = value; } }, metadata: _metadata }, _feedback360Requests_initializers, _feedback360Requests_extraInitializers);
        __esDecorate(null, null, _competencyAssessments_decorators, { kind: "field", name: "competencyAssessments", static: false, private: false, access: { has: obj => "competencyAssessments" in obj, get: obj => obj.competencyAssessments, set: (obj, value) => { obj.competencyAssessments = value; } }, metadata: _metadata }, _competencyAssessments_initializers, _competencyAssessments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceReviewModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceReviewModel = _classThis;
})();
exports.PerformanceReviewModel = PerformanceReviewModel;
/**
 * Review Section Model
 */
let ReviewSectionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'review_sections',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['review_id'] },
                { fields: ['section_order'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reviewId_decorators;
    let _reviewId_initializers = [];
    let _reviewId_extraInitializers = [];
    let _sectionName_decorators;
    let _sectionName_initializers = [];
    let _sectionName_extraInitializers = [];
    let _sectionOrder_decorators;
    let _sectionOrder_initializers = [];
    let _sectionOrder_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _competencies_decorators;
    let _competencies_initializers = [];
    let _competencies_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _review_decorators;
    let _review_initializers = [];
    let _review_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ReviewSectionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reviewId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reviewId_initializers, void 0));
            this.sectionName = (__runInitializers(this, _reviewId_extraInitializers), __runInitializers(this, _sectionName_initializers, void 0));
            this.sectionOrder = (__runInitializers(this, _sectionName_extraInitializers), __runInitializers(this, _sectionOrder_initializers, void 0));
            this.weight = (__runInitializers(this, _sectionOrder_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.rating = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.score = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _score_initializers, void 0));
            this.comments = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.competencies = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _competencies_initializers, void 0));
            this.evidence = (__runInitializers(this, _competencies_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
            this.review = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _review_initializers, void 0));
            this.createdAt = (__runInitializers(this, _review_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReviewSectionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _reviewId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PerformanceReviewModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'review_id',
            })];
        _sectionName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
                field: 'section_name',
            })];
        _sectionOrder_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'section_order',
            })];
        _weight_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                comment: 'Section weight in overall review (0-100)',
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceRating)),
                allowNull: true,
            })];
        _score_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                comment: 'Section score (0-100)',
            })];
        _comments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _competencies_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Competencies assessed in this section',
            })];
        _evidence_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Evidence or examples',
            })];
        _review_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PerformanceReviewModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reviewId_decorators, { kind: "field", name: "reviewId", static: false, private: false, access: { has: obj => "reviewId" in obj, get: obj => obj.reviewId, set: (obj, value) => { obj.reviewId = value; } }, metadata: _metadata }, _reviewId_initializers, _reviewId_extraInitializers);
        __esDecorate(null, null, _sectionName_decorators, { kind: "field", name: "sectionName", static: false, private: false, access: { has: obj => "sectionName" in obj, get: obj => obj.sectionName, set: (obj, value) => { obj.sectionName = value; } }, metadata: _metadata }, _sectionName_initializers, _sectionName_extraInitializers);
        __esDecorate(null, null, _sectionOrder_decorators, { kind: "field", name: "sectionOrder", static: false, private: false, access: { has: obj => "sectionOrder" in obj, get: obj => obj.sectionOrder, set: (obj, value) => { obj.sectionOrder = value; } }, metadata: _metadata }, _sectionOrder_initializers, _sectionOrder_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _competencies_decorators, { kind: "field", name: "competencies", static: false, private: false, access: { has: obj => "competencies" in obj, get: obj => obj.competencies, set: (obj, value) => { obj.competencies = value; } }, metadata: _metadata }, _competencies_initializers, _competencies_extraInitializers);
        __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
        __esDecorate(null, null, _review_decorators, { kind: "field", name: "review", static: false, private: false, access: { has: obj => "review" in obj, get: obj => obj.review, set: (obj, value) => { obj.review = value; } }, metadata: _metadata }, _review_initializers, _review_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewSectionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewSectionModel = _classThis;
})();
exports.ReviewSectionModel = ReviewSectionModel;
/**
 * 360 Feedback Request Model
 */
let Feedback360RequestModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'feedback_360_requests',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['review_id'] },
                { fields: ['respondent_id'] },
                { fields: ['status'] },
                { fields: ['due_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _reviewId_decorators;
    let _reviewId_initializers = [];
    let _reviewId_extraInitializers = [];
    let _requesterId_decorators;
    let _requesterId_initializers = [];
    let _requesterId_extraInitializers = [];
    let _respondentId_decorators;
    let _respondentId_initializers = [];
    let _respondentId_extraInitializers = [];
    let _respondentType_decorators;
    let _respondentType_initializers = [];
    let _respondentType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _requestedAt_decorators;
    let _requestedAt_initializers = [];
    let _requestedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _anonymousResponse_decorators;
    let _anonymousResponse_initializers = [];
    let _anonymousResponse_extraInitializers = [];
    let _responses_decorators;
    let _responses_initializers = [];
    let _responses_extraInitializers = [];
    let _review_decorators;
    let _review_initializers = [];
    let _review_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Feedback360RequestModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.reviewId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _reviewId_initializers, void 0));
            this.requesterId = (__runInitializers(this, _reviewId_extraInitializers), __runInitializers(this, _requesterId_initializers, void 0));
            this.respondentId = (__runInitializers(this, _requesterId_extraInitializers), __runInitializers(this, _respondentId_initializers, void 0));
            this.respondentType = (__runInitializers(this, _respondentId_extraInitializers), __runInitializers(this, _respondentType_initializers, void 0));
            this.status = (__runInitializers(this, _respondentType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.requestedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _requestedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _requestedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.dueDate = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.anonymousResponse = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _anonymousResponse_initializers, void 0));
            this.responses = (__runInitializers(this, _anonymousResponse_extraInitializers), __runInitializers(this, _responses_initializers, void 0));
            this.review = (__runInitializers(this, _responses_extraInitializers), __runInitializers(this, _review_initializers, void 0));
            this.createdAt = (__runInitializers(this, _review_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Feedback360RequestModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _reviewId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PerformanceReviewModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'review_id',
            })];
        _requesterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'requester_id',
            })];
        _respondentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'respondent_id',
            })];
        _respondentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('peer', 'manager', 'direct_report', 'skip_level', 'external'),
                allowNull: false,
                field: 'respondent_type',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(Feedback360Status)),
                allowNull: false,
                defaultValue: Feedback360Status.PENDING,
            })];
        _requestedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
                field: 'requested_at',
            })];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_at',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'due_date',
            })];
        _anonymousResponse_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'anonymous_response',
            })];
        _responses_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Feedback responses',
            })];
        _review_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PerformanceReviewModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _reviewId_decorators, { kind: "field", name: "reviewId", static: false, private: false, access: { has: obj => "reviewId" in obj, get: obj => obj.reviewId, set: (obj, value) => { obj.reviewId = value; } }, metadata: _metadata }, _reviewId_initializers, _reviewId_extraInitializers);
        __esDecorate(null, null, _requesterId_decorators, { kind: "field", name: "requesterId", static: false, private: false, access: { has: obj => "requesterId" in obj, get: obj => obj.requesterId, set: (obj, value) => { obj.requesterId = value; } }, metadata: _metadata }, _requesterId_initializers, _requesterId_extraInitializers);
        __esDecorate(null, null, _respondentId_decorators, { kind: "field", name: "respondentId", static: false, private: false, access: { has: obj => "respondentId" in obj, get: obj => obj.respondentId, set: (obj, value) => { obj.respondentId = value; } }, metadata: _metadata }, _respondentId_initializers, _respondentId_extraInitializers);
        __esDecorate(null, null, _respondentType_decorators, { kind: "field", name: "respondentType", static: false, private: false, access: { has: obj => "respondentType" in obj, get: obj => obj.respondentType, set: (obj, value) => { obj.respondentType = value; } }, metadata: _metadata }, _respondentType_initializers, _respondentType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _requestedAt_decorators, { kind: "field", name: "requestedAt", static: false, private: false, access: { has: obj => "requestedAt" in obj, get: obj => obj.requestedAt, set: (obj, value) => { obj.requestedAt = value; } }, metadata: _metadata }, _requestedAt_initializers, _requestedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _anonymousResponse_decorators, { kind: "field", name: "anonymousResponse", static: false, private: false, access: { has: obj => "anonymousResponse" in obj, get: obj => obj.anonymousResponse, set: (obj, value) => { obj.anonymousResponse = value; } }, metadata: _metadata }, _anonymousResponse_initializers, _anonymousResponse_extraInitializers);
        __esDecorate(null, null, _responses_decorators, { kind: "field", name: "responses", static: false, private: false, access: { has: obj => "responses" in obj, get: obj => obj.responses, set: (obj, value) => { obj.responses = value; } }, metadata: _metadata }, _responses_initializers, _responses_extraInitializers);
        __esDecorate(null, null, _review_decorators, { kind: "field", name: "review", static: false, private: false, access: { has: obj => "review" in obj, get: obj => obj.review, set: (obj, value) => { obj.review = value; } }, metadata: _metadata }, _review_initializers, _review_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Feedback360RequestModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Feedback360RequestModel = _classThis;
})();
exports.Feedback360RequestModel = Feedback360RequestModel;
/**
 * Continuous Feedback Model
 */
let ContinuousFeedbackModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'continuous_feedback',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['giver_id'] },
                { fields: ['feedback_type'] },
                { fields: ['visibility'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _giverId_decorators;
    let _giverId_initializers = [];
    let _giverId_extraInitializers = [];
    let _feedbackType_decorators;
    let _feedbackType_initializers = [];
    let _feedbackType_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _relatedGoalId_decorators;
    let _relatedGoalId_initializers = [];
    let _relatedGoalId_extraInitializers = [];
    let _relatedProjectId_decorators;
    let _relatedProjectId_initializers = [];
    let _relatedProjectId_extraInitializers = [];
    let _acknowledgedAt_decorators;
    let _acknowledgedAt_initializers = [];
    let _acknowledgedAt_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ContinuousFeedbackModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.giverId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _giverId_initializers, void 0));
            this.feedbackType = (__runInitializers(this, _giverId_extraInitializers), __runInitializers(this, _feedbackType_initializers, void 0));
            this.visibility = (__runInitializers(this, _feedbackType_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
            this.content = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.relatedGoalId = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _relatedGoalId_initializers, void 0));
            this.relatedProjectId = (__runInitializers(this, _relatedGoalId_extraInitializers), __runInitializers(this, _relatedProjectId_initializers, void 0));
            this.acknowledgedAt = (__runInitializers(this, _relatedProjectId_extraInitializers), __runInitializers(this, _acknowledgedAt_initializers, void 0));
            this.isAnonymous = (__runInitializers(this, _acknowledgedAt_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
            this.tags = (__runInitializers(this, _isAnonymous_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContinuousFeedbackModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _giverId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'giver_id',
            })];
        _feedbackType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FeedbackType)),
                allowNull: false,
                field: 'feedback_type',
            })];
        _visibility_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(FeedbackVisibility)),
                allowNull: false,
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _relatedGoalId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'related_goal_id',
            })];
        _relatedProjectId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'related_project_id',
            })];
        _acknowledgedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'acknowledged_at',
            })];
        _isAnonymous_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_anonymous',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _giverId_decorators, { kind: "field", name: "giverId", static: false, private: false, access: { has: obj => "giverId" in obj, get: obj => obj.giverId, set: (obj, value) => { obj.giverId = value; } }, metadata: _metadata }, _giverId_initializers, _giverId_extraInitializers);
        __esDecorate(null, null, _feedbackType_decorators, { kind: "field", name: "feedbackType", static: false, private: false, access: { has: obj => "feedbackType" in obj, get: obj => obj.feedbackType, set: (obj, value) => { obj.feedbackType = value; } }, metadata: _metadata }, _feedbackType_initializers, _feedbackType_extraInitializers);
        __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _relatedGoalId_decorators, { kind: "field", name: "relatedGoalId", static: false, private: false, access: { has: obj => "relatedGoalId" in obj, get: obj => obj.relatedGoalId, set: (obj, value) => { obj.relatedGoalId = value; } }, metadata: _metadata }, _relatedGoalId_initializers, _relatedGoalId_extraInitializers);
        __esDecorate(null, null, _relatedProjectId_decorators, { kind: "field", name: "relatedProjectId", static: false, private: false, access: { has: obj => "relatedProjectId" in obj, get: obj => obj.relatedProjectId, set: (obj, value) => { obj.relatedProjectId = value; } }, metadata: _metadata }, _relatedProjectId_initializers, _relatedProjectId_extraInitializers);
        __esDecorate(null, null, _acknowledgedAt_decorators, { kind: "field", name: "acknowledgedAt", static: false, private: false, access: { has: obj => "acknowledgedAt" in obj, get: obj => obj.acknowledgedAt, set: (obj, value) => { obj.acknowledgedAt = value; } }, metadata: _metadata }, _acknowledgedAt_initializers, _acknowledgedAt_extraInitializers);
        __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContinuousFeedbackModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContinuousFeedbackModel = _classThis;
})();
exports.ContinuousFeedbackModel = ContinuousFeedbackModel;
/**
 * Performance Improvement Plan Model
 */
let PerformanceImprovementPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'performance_improvement_plans',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['manager_id'] },
                { fields: ['status'] },
                { fields: ['start_date', 'end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _performanceIssues_decorators;
    let _performanceIssues_initializers = [];
    let _performanceIssues_extraInitializers = [];
    let _expectedImprovements_decorators;
    let _expectedImprovements_initializers = [];
    let _expectedImprovements_extraInitializers = [];
    let _supportProvided_decorators;
    let _supportProvided_initializers = [];
    let _supportProvided_extraInitializers = [];
    let _successCriteria_decorators;
    let _successCriteria_initializers = [];
    let _successCriteria_extraInitializers = [];
    let _outcome_decorators;
    let _outcome_initializers = [];
    let _outcome_extraInitializers = [];
    let _hrApprovalBy_decorators;
    let _hrApprovalBy_initializers = [];
    let _hrApprovalBy_extraInitializers = [];
    let _hrApprovalAt_decorators;
    let _hrApprovalAt_initializers = [];
    let _hrApprovalAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PerformanceImprovementPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.managerId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
            this.status = (__runInitializers(this, _managerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.performanceIssues = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _performanceIssues_initializers, void 0));
            this.expectedImprovements = (__runInitializers(this, _performanceIssues_extraInitializers), __runInitializers(this, _expectedImprovements_initializers, void 0));
            this.supportProvided = (__runInitializers(this, _expectedImprovements_extraInitializers), __runInitializers(this, _supportProvided_initializers, void 0));
            this.successCriteria = (__runInitializers(this, _supportProvided_extraInitializers), __runInitializers(this, _successCriteria_initializers, void 0));
            this.outcome = (__runInitializers(this, _successCriteria_extraInitializers), __runInitializers(this, _outcome_initializers, void 0));
            this.hrApprovalBy = (__runInitializers(this, _outcome_extraInitializers), __runInitializers(this, _hrApprovalBy_initializers, void 0));
            this.hrApprovalAt = (__runInitializers(this, _hrApprovalBy_extraInitializers), __runInitializers(this, _hrApprovalAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _hrApprovalAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PerformanceImprovementPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _managerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'manager_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PIPStatus)),
                allowNull: false,
                defaultValue: PIPStatus.DRAFT,
            })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'start_date',
            })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'end_date',
            })];
        _reviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'review_date',
            })];
        _performanceIssues_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'performance_issues',
            })];
        _expectedImprovements_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'expected_improvements',
            })];
        _supportProvided_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'support_provided',
            })];
        _successCriteria_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'success_criteria',
            })];
        _outcome_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _hrApprovalBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'hr_approval_by',
            })];
        _hrApprovalAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'hr_approval_at',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _performanceIssues_decorators, { kind: "field", name: "performanceIssues", static: false, private: false, access: { has: obj => "performanceIssues" in obj, get: obj => obj.performanceIssues, set: (obj, value) => { obj.performanceIssues = value; } }, metadata: _metadata }, _performanceIssues_initializers, _performanceIssues_extraInitializers);
        __esDecorate(null, null, _expectedImprovements_decorators, { kind: "field", name: "expectedImprovements", static: false, private: false, access: { has: obj => "expectedImprovements" in obj, get: obj => obj.expectedImprovements, set: (obj, value) => { obj.expectedImprovements = value; } }, metadata: _metadata }, _expectedImprovements_initializers, _expectedImprovements_extraInitializers);
        __esDecorate(null, null, _supportProvided_decorators, { kind: "field", name: "supportProvided", static: false, private: false, access: { has: obj => "supportProvided" in obj, get: obj => obj.supportProvided, set: (obj, value) => { obj.supportProvided = value; } }, metadata: _metadata }, _supportProvided_initializers, _supportProvided_extraInitializers);
        __esDecorate(null, null, _successCriteria_decorators, { kind: "field", name: "successCriteria", static: false, private: false, access: { has: obj => "successCriteria" in obj, get: obj => obj.successCriteria, set: (obj, value) => { obj.successCriteria = value; } }, metadata: _metadata }, _successCriteria_initializers, _successCriteria_extraInitializers);
        __esDecorate(null, null, _outcome_decorators, { kind: "field", name: "outcome", static: false, private: false, access: { has: obj => "outcome" in obj, get: obj => obj.outcome, set: (obj, value) => { obj.outcome = value; } }, metadata: _metadata }, _outcome_initializers, _outcome_extraInitializers);
        __esDecorate(null, null, _hrApprovalBy_decorators, { kind: "field", name: "hrApprovalBy", static: false, private: false, access: { has: obj => "hrApprovalBy" in obj, get: obj => obj.hrApprovalBy, set: (obj, value) => { obj.hrApprovalBy = value; } }, metadata: _metadata }, _hrApprovalBy_initializers, _hrApprovalBy_extraInitializers);
        __esDecorate(null, null, _hrApprovalAt_decorators, { kind: "field", name: "hrApprovalAt", static: false, private: false, access: { has: obj => "hrApprovalAt" in obj, get: obj => obj.hrApprovalAt, set: (obj, value) => { obj.hrApprovalAt = value; } }, metadata: _metadata }, _hrApprovalAt_initializers, _hrApprovalAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceImprovementPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceImprovementPlanModel = _classThis;
})();
exports.PerformanceImprovementPlanModel = PerformanceImprovementPlanModel;
/**
 * Competency Model
 */
let CompetencyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'competencies',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['code'], unique: true },
                { fields: ['category'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _levelDefinitions_decorators;
    let _levelDefinitions_initializers = [];
    let _levelDefinitions_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _assessments_decorators;
    let _assessments_initializers = [];
    let _assessments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CompetencyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.levelDefinitions = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _levelDefinitions_initializers, void 0));
            this.isActive = (__runInitializers(this, _levelDefinitions_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.assessments = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _assessments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _assessments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CompetencyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _code_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CompetencyCategory)),
                allowNull: false,
            })];
        _levelDefinitions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'Level definitions (1-5)',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _assessments_decorators = [(0, sequelize_typescript_1.HasMany)(() => CompetencyAssessmentModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _levelDefinitions_decorators, { kind: "field", name: "levelDefinitions", static: false, private: false, access: { has: obj => "levelDefinitions" in obj, get: obj => obj.levelDefinitions, set: (obj, value) => { obj.levelDefinitions = value; } }, metadata: _metadata }, _levelDefinitions_initializers, _levelDefinitions_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _assessments_decorators, { kind: "field", name: "assessments", static: false, private: false, access: { has: obj => "assessments" in obj, get: obj => obj.assessments, set: (obj, value) => { obj.assessments = value; } }, metadata: _metadata }, _assessments_initializers, _assessments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CompetencyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompetencyModel = _classThis;
})();
exports.CompetencyModel = CompetencyModel;
/**
 * Competency Assessment Model
 */
let CompetencyAssessmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'competency_assessments',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['review_id'] },
                { fields: ['competency_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reviewId_decorators;
    let _reviewId_initializers = [];
    let _reviewId_extraInitializers = [];
    let _competencyId_decorators;
    let _competencyId_initializers = [];
    let _competencyId_extraInitializers = [];
    let _competencyName_decorators;
    let _competencyName_initializers = [];
    let _competencyName_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _expectedLevel_decorators;
    let _expectedLevel_initializers = [];
    let _expectedLevel_extraInitializers = [];
    let _currentLevel_decorators;
    let _currentLevel_initializers = [];
    let _currentLevel_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _assessorComments_decorators;
    let _assessorComments_initializers = [];
    let _assessorComments_extraInitializers = [];
    let _employeeComments_decorators;
    let _employeeComments_initializers = [];
    let _employeeComments_extraInitializers = [];
    let _developmentActions_decorators;
    let _developmentActions_initializers = [];
    let _developmentActions_extraInitializers = [];
    let _review_decorators;
    let _review_initializers = [];
    let _review_extraInitializers = [];
    let _competency_decorators;
    let _competency_initializers = [];
    let _competency_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CompetencyAssessmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reviewId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reviewId_initializers, void 0));
            this.competencyId = (__runInitializers(this, _reviewId_extraInitializers), __runInitializers(this, _competencyId_initializers, void 0));
            this.competencyName = (__runInitializers(this, _competencyId_extraInitializers), __runInitializers(this, _competencyName_initializers, void 0));
            this.category = (__runInitializers(this, _competencyName_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.expectedLevel = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _expectedLevel_initializers, void 0));
            this.currentLevel = (__runInitializers(this, _expectedLevel_extraInitializers), __runInitializers(this, _currentLevel_initializers, void 0));
            this.rating = (__runInitializers(this, _currentLevel_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.assessorComments = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _assessorComments_initializers, void 0));
            this.employeeComments = (__runInitializers(this, _assessorComments_extraInitializers), __runInitializers(this, _employeeComments_initializers, void 0));
            this.developmentActions = (__runInitializers(this, _employeeComments_extraInitializers), __runInitializers(this, _developmentActions_initializers, void 0));
            this.review = (__runInitializers(this, _developmentActions_extraInitializers), __runInitializers(this, _review_initializers, void 0));
            this.competency = (__runInitializers(this, _review_extraInitializers), __runInitializers(this, _competency_initializers, void 0));
            this.createdAt = (__runInitializers(this, _competency_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CompetencyAssessmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _reviewId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PerformanceReviewModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'review_id',
            })];
        _competencyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => CompetencyModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'competency_id',
            })];
        _competencyName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
                field: 'competency_name',
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CompetencyCategory)),
                allowNull: false,
            })];
        _expectedLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'expected_level',
            })];
        _currentLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'current_level',
            })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceRating)),
                allowNull: true,
            })];
        _assessorComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'assessor_comments',
            })];
        _employeeComments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'employee_comments',
            })];
        _developmentActions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'development_actions',
            })];
        _review_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PerformanceReviewModel)];
        _competency_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CompetencyModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reviewId_decorators, { kind: "field", name: "reviewId", static: false, private: false, access: { has: obj => "reviewId" in obj, get: obj => obj.reviewId, set: (obj, value) => { obj.reviewId = value; } }, metadata: _metadata }, _reviewId_initializers, _reviewId_extraInitializers);
        __esDecorate(null, null, _competencyId_decorators, { kind: "field", name: "competencyId", static: false, private: false, access: { has: obj => "competencyId" in obj, get: obj => obj.competencyId, set: (obj, value) => { obj.competencyId = value; } }, metadata: _metadata }, _competencyId_initializers, _competencyId_extraInitializers);
        __esDecorate(null, null, _competencyName_decorators, { kind: "field", name: "competencyName", static: false, private: false, access: { has: obj => "competencyName" in obj, get: obj => obj.competencyName, set: (obj, value) => { obj.competencyName = value; } }, metadata: _metadata }, _competencyName_initializers, _competencyName_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _expectedLevel_decorators, { kind: "field", name: "expectedLevel", static: false, private: false, access: { has: obj => "expectedLevel" in obj, get: obj => obj.expectedLevel, set: (obj, value) => { obj.expectedLevel = value; } }, metadata: _metadata }, _expectedLevel_initializers, _expectedLevel_extraInitializers);
        __esDecorate(null, null, _currentLevel_decorators, { kind: "field", name: "currentLevel", static: false, private: false, access: { has: obj => "currentLevel" in obj, get: obj => obj.currentLevel, set: (obj, value) => { obj.currentLevel = value; } }, metadata: _metadata }, _currentLevel_initializers, _currentLevel_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _assessorComments_decorators, { kind: "field", name: "assessorComments", static: false, private: false, access: { has: obj => "assessorComments" in obj, get: obj => obj.assessorComments, set: (obj, value) => { obj.assessorComments = value; } }, metadata: _metadata }, _assessorComments_initializers, _assessorComments_extraInitializers);
        __esDecorate(null, null, _employeeComments_decorators, { kind: "field", name: "employeeComments", static: false, private: false, access: { has: obj => "employeeComments" in obj, get: obj => obj.employeeComments, set: (obj, value) => { obj.employeeComments = value; } }, metadata: _metadata }, _employeeComments_initializers, _employeeComments_extraInitializers);
        __esDecorate(null, null, _developmentActions_decorators, { kind: "field", name: "developmentActions", static: false, private: false, access: { has: obj => "developmentActions" in obj, get: obj => obj.developmentActions, set: (obj, value) => { obj.developmentActions = value; } }, metadata: _metadata }, _developmentActions_initializers, _developmentActions_extraInitializers);
        __esDecorate(null, null, _review_decorators, { kind: "field", name: "review", static: false, private: false, access: { has: obj => "review" in obj, get: obj => obj.review, set: (obj, value) => { obj.review = value; } }, metadata: _metadata }, _review_initializers, _review_extraInitializers);
        __esDecorate(null, null, _competency_decorators, { kind: "field", name: "competency", static: false, private: false, access: { has: obj => "competency" in obj, get: obj => obj.competency, set: (obj, value) => { obj.competency = value; } }, metadata: _metadata }, _competency_initializers, _competency_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CompetencyAssessmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompetencyAssessmentModel = _classThis;
})();
exports.CompetencyAssessmentModel = CompetencyAssessmentModel;
/**
 * Calibration Session Model
 */
let CalibrationSessionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_sessions',
            timestamps: true,
            indexes: [
                { fields: ['cycle_id'] },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _cycleId_decorators;
    let _cycleId_initializers = [];
    let _cycleId_extraInitializers = [];
    let _facilitatorId_decorators;
    let _facilitatorId_initializers = [];
    let _facilitatorId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _reviewsDiscussed_decorators;
    let _reviewsDiscussed_initializers = [];
    let _reviewsDiscussed_extraInitializers = [];
    let _ratingAdjustments_decorators;
    let _ratingAdjustments_initializers = [];
    let _ratingAdjustments_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _cycle_decorators;
    let _cycle_initializers = [];
    let _cycle_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CalibrationSessionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.cycleId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _cycleId_initializers, void 0));
            this.facilitatorId = (__runInitializers(this, _cycleId_extraInitializers), __runInitializers(this, _facilitatorId_initializers, void 0));
            this.status = (__runInitializers(this, _facilitatorId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.participants = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
            this.reviewsDiscussed = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _reviewsDiscussed_initializers, void 0));
            this.ratingAdjustments = (__runInitializers(this, _reviewsDiscussed_extraInitializers), __runInitializers(this, _ratingAdjustments_initializers, void 0));
            this.notes = (__runInitializers(this, _ratingAdjustments_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.cycle = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _cycle_initializers, void 0));
            this.createdAt = (__runInitializers(this, _cycle_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationSessionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _cycleId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PerformanceReviewCycleModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'cycle_id',
            })];
        _facilitatorId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'facilitator_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationStatus)),
                allowNull: false,
                defaultValue: CalibrationStatus.SCHEDULED,
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'scheduled_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _participants_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _reviewsDiscussed_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'reviews_discussed',
            })];
        _ratingAdjustments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'rating_adjustments',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _cycle_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PerformanceReviewCycleModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _cycleId_decorators, { kind: "field", name: "cycleId", static: false, private: false, access: { has: obj => "cycleId" in obj, get: obj => obj.cycleId, set: (obj, value) => { obj.cycleId = value; } }, metadata: _metadata }, _cycleId_initializers, _cycleId_extraInitializers);
        __esDecorate(null, null, _facilitatorId_decorators, { kind: "field", name: "facilitatorId", static: false, private: false, access: { has: obj => "facilitatorId" in obj, get: obj => obj.facilitatorId, set: (obj, value) => { obj.facilitatorId = value; } }, metadata: _metadata }, _facilitatorId_initializers, _facilitatorId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
        __esDecorate(null, null, _reviewsDiscussed_decorators, { kind: "field", name: "reviewsDiscussed", static: false, private: false, access: { has: obj => "reviewsDiscussed" in obj, get: obj => obj.reviewsDiscussed, set: (obj, value) => { obj.reviewsDiscussed = value; } }, metadata: _metadata }, _reviewsDiscussed_initializers, _reviewsDiscussed_extraInitializers);
        __esDecorate(null, null, _ratingAdjustments_decorators, { kind: "field", name: "ratingAdjustments", static: false, private: false, access: { has: obj => "ratingAdjustments" in obj, get: obj => obj.ratingAdjustments, set: (obj, value) => { obj.ratingAdjustments = value; } }, metadata: _metadata }, _ratingAdjustments_initializers, _ratingAdjustments_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _cycle_decorators, { kind: "field", name: "cycle", static: false, private: false, access: { has: obj => "cycle" in obj, get: obj => obj.cycle, set: (obj, value) => { obj.cycle = value; } }, metadata: _metadata }, _cycle_initializers, _cycle_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationSessionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationSessionModel = _classThis;
})();
exports.CalibrationSessionModel = CalibrationSessionModel;
// ============================================================================
// CORE PERFORMANCE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create performance review cycle
 *
 * @param cycleData - Review cycle data
 * @param transaction - Optional transaction
 * @returns Created review cycle
 *
 * @example
 * ```typescript
 * const cycle = await createReviewCycle({
 *   name: '2024 Annual Review',
 *   cycleType: ReviewCycleType.ANNUAL,
 *   cycleYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
async function createReviewCycle(cycleData, transaction) {
    if (cycleData.endDate <= cycleData.startDate) {
        throw new common_1.BadRequestException('End date must be after start date');
    }
    const cycle = await PerformanceReviewCycleModel.create(cycleData, { transaction });
    return cycle;
}
/**
 * Create performance review
 *
 * @param reviewData - Performance review data
 * @param transaction - Optional transaction
 * @returns Created performance review
 *
 * @example
 * ```typescript
 * const review = await createPerformanceReview({
 *   employeeId: 'emp-uuid',
 *   reviewerId: 'manager-uuid',
 *   cycleId: 'cycle-uuid',
 *   reviewType: ReviewCycleType.ANNUAL,
 *   reviewPeriodStart: new Date('2024-01-01'),
 *   reviewPeriodEnd: new Date('2024-12-31'),
 * });
 * ```
 */
async function createPerformanceReview(reviewData, transaction) {
    const validated = exports.PerformanceReviewSchema.parse(reviewData);
    // Check if review already exists for this employee and cycle
    const existing = await PerformanceReviewModel.findOne({
        where: {
            employeeId: validated.employeeId,
            cycleId: validated.cycleId,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Performance review already exists for this employee and cycle');
    }
    const review = await PerformanceReviewModel.create(validated, { transaction });
    return review;
}
/**
 * Update performance review
 *
 * @param reviewId - Review ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await updatePerformanceReview('review-uuid', {
 *   status: ReviewStatus.MANAGER_REVIEW,
 *   managerAssessmentCompleted: true,
 * });
 * ```
 */
async function updatePerformanceReview(reviewId, updates, transaction) {
    const review = await PerformanceReviewModel.findByPk(reviewId, { transaction });
    if (!review) {
        throw new common_1.NotFoundException(`Performance review ${reviewId} not found`);
    }
    await review.update(updates, { transaction });
    return review;
}
/**
 * Get performance review by ID
 *
 * @param reviewId - Review ID
 * @param includeRelations - Include related data
 * @returns Performance review or null
 *
 * @example
 * ```typescript
 * const review = await getPerformanceReviewById('review-uuid', true);
 * ```
 */
async function getPerformanceReviewById(reviewId, includeRelations = false) {
    const options = {
        where: { id: reviewId },
    };
    if (includeRelations) {
        options.include = [
            { model: PerformanceReviewCycleModel, as: 'cycle' },
            { model: ReviewSectionModel, as: 'sections' },
            { model: Feedback360RequestModel, as: 'feedback360Requests' },
            { model: CompetencyAssessmentModel, as: 'competencyAssessments' },
        ];
    }
    return PerformanceReviewModel.findOne(options);
}
/**
 * Get employee performance reviews
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of performance reviews
 *
 * @example
 * ```typescript
 * const reviews = await getEmployeePerformanceReviews('emp-uuid', {
 *   status: ReviewStatus.COMPLETED,
 *   limit: 10,
 * });
 * ```
 */
async function getEmployeePerformanceReviews(employeeId, filters) {
    const where = { employeeId };
    if (filters?.cycleId)
        where.cycleId = filters.cycleId;
    if (filters?.status)
        where.status = filters.status;
    if (filters?.reviewType)
        where.reviewType = filters.reviewType;
    return PerformanceReviewModel.findAll({
        where,
        limit: filters?.limit || 100,
        offset: filters?.offset || 0,
        order: [['reviewPeriodEnd', 'DESC']],
        include: [
            { model: PerformanceReviewCycleModel, as: 'cycle' },
        ],
    });
}
/**
 * Finalize performance review
 *
 * @param reviewId - Review ID
 * @param finalizedBy - User finalizing review
 * @param overallRating - Overall performance rating
 * @param overallScore - Overall performance score
 * @param transaction - Optional transaction
 * @returns Finalized review
 *
 * @example
 * ```typescript
 * await finalizePerformanceReview('review-uuid', 'hr-uuid',
 *   PerformanceRating.EXCEEDS_EXPECTATIONS, 85);
 * ```
 */
async function finalizePerformanceReview(reviewId, finalizedBy, overallRating, overallScore, transaction) {
    const review = await PerformanceReviewModel.findByPk(reviewId, { transaction });
    if (!review) {
        throw new common_1.NotFoundException(`Performance review ${reviewId} not found`);
    }
    if (review.status === ReviewStatus.COMPLETED) {
        throw new common_1.BadRequestException('Performance review is already finalized');
    }
    await review.update({
        status: ReviewStatus.COMPLETED,
        overallRating,
        overallScore,
        finalizedAt: new Date(),
        finalizedBy,
    }, { transaction });
    return review;
}
/**
 * Add review section
 *
 * @param sectionData - Review section data
 * @param transaction - Optional transaction
 * @returns Created review section
 *
 * @example
 * ```typescript
 * const section = await addReviewSection({
 *   reviewId: 'review-uuid',
 *   sectionName: 'Job Knowledge',
 *   sectionOrder: 1,
 *   weight: 25,
 * });
 * ```
 */
async function addReviewSection(sectionData, transaction) {
    const validated = exports.ReviewSectionSchema.parse(sectionData);
    const section = await ReviewSectionModel.create(validated, { transaction });
    return section;
}
/**
 * Update review section
 *
 * @param sectionId - Section ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated section
 *
 * @example
 * ```typescript
 * await updateReviewSection('section-uuid', {
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   score: 90,
 *   comments: 'Excellent performance in this area',
 * });
 * ```
 */
async function updateReviewSection(sectionId, updates, transaction) {
    const section = await ReviewSectionModel.findByPk(sectionId, { transaction });
    if (!section) {
        throw new common_1.NotFoundException(`Review section ${sectionId} not found`);
    }
    await section.update(updates, { transaction });
    return section;
}
/**
 * Get review sections
 *
 * @param reviewId - Review ID
 * @returns Array of review sections
 *
 * @example
 * ```typescript
 * const sections = await getReviewSections('review-uuid');
 * ```
 */
async function getReviewSections(reviewId) {
    return ReviewSectionModel.findAll({
        where: { reviewId },
        order: [['sectionOrder', 'ASC']],
    });
}
/**
 * Calculate overall review score
 *
 * @param reviewId - Review ID
 * @returns Calculated overall score
 *
 * @example
 * ```typescript
 * const score = await calculateOverallScore('review-uuid');
 * ```
 */
async function calculateOverallScore(reviewId) {
    const sections = await ReviewSectionModel.findAll({
        where: { reviewId },
    });
    if (sections.length === 0) {
        return 0;
    }
    let totalWeightedScore = 0;
    let totalWeight = 0;
    for (const section of sections) {
        if (section.score !== null && section.weight > 0) {
            totalWeightedScore += section.score * section.weight;
            totalWeight += section.weight;
        }
    }
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}
// ============================================================================
// 360 FEEDBACK FUNCTIONS
// ============================================================================
/**
 * Create 360 feedback request
 *
 * @param requestData - Feedback request data
 * @param transaction - Optional transaction
 * @returns Created feedback request
 *
 * @example
 * ```typescript
 * const request = await create360FeedbackRequest({
 *   employeeId: 'emp-uuid',
 *   reviewId: 'review-uuid',
 *   requesterId: 'manager-uuid',
 *   respondentId: 'peer-uuid',
 *   respondentType: 'peer',
 *   dueDate: new Date('2024-03-31'),
 * });
 * ```
 */
async function create360FeedbackRequest(requestData, transaction) {
    const validated = exports.Feedback360RequestSchema.parse(requestData);
    const request = await Feedback360RequestModel.create(validated, { transaction });
    return request;
}
/**
 * Submit 360 feedback response
 *
 * @param requestId - Request ID
 * @param responses - Feedback responses
 * @param transaction - Optional transaction
 * @returns Updated feedback request
 *
 * @example
 * ```typescript
 * await submit360FeedbackResponse('request-uuid', {
 *   competencyRatings: { leadership: 4, communication: 5 },
 *   strengths: 'Great communicator...',
 *   areasForImprovement: 'Could improve...',
 * });
 * ```
 */
async function submit360FeedbackResponse(requestId, responses, transaction) {
    const request = await Feedback360RequestModel.findByPk(requestId, { transaction });
    if (!request) {
        throw new common_1.NotFoundException(`360 feedback request ${requestId} not found`);
    }
    if (request.status === Feedback360Status.COMPLETED) {
        throw new common_1.BadRequestException('Feedback request already completed');
    }
    await request.update({
        responses,
        status: Feedback360Status.COMPLETED,
        completedAt: new Date(),
    }, { transaction });
    return request;
}
/**
 * Get 360 feedback requests for employee
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequests('emp-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
async function get360FeedbackRequests(employeeId, filters) {
    const where = { employeeId };
    if (filters?.reviewId)
        where.reviewId = filters.reviewId;
    if (filters?.status)
        where.status = filters.status;
    if (filters?.respondentType)
        where.respondentType = filters.respondentType;
    return Feedback360RequestModel.findAll({
        where,
        order: [['requestedAt', 'DESC']],
    });
}
/**
 * Get 360 feedback requests for respondent
 *
 * @param respondentId - Respondent ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequestsForRespondent('user-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
async function get360FeedbackRequestsForRespondent(respondentId, filters) {
    const where = { respondentId };
    if (filters?.status)
        where.status = filters.status;
    return Feedback360RequestModel.findAll({
        where,
        order: [['dueDate', 'ASC']],
    });
}
/**
 * Aggregate 360 feedback for review
 *
 * @param reviewId - Review ID
 * @returns Aggregated feedback data
 *
 * @example
 * ```typescript
 * const aggregated = await aggregate360Feedback('review-uuid');
 * ```
 */
async function aggregate360Feedback(reviewId) {
    const requests = await Feedback360RequestModel.findAll({
        where: {
            reviewId,
            status: Feedback360Status.COMPLETED,
        },
    });
    const aggregated = {
        totalResponses: requests.length,
        byRespondentType: {},
        averageRatings: {},
        themes: {
            strengths: [],
            areasForImprovement: [],
        },
    };
    // Count by respondent type
    requests.forEach((request) => {
        aggregated.byRespondentType[request.respondentType] =
            (aggregated.byRespondentType[request.respondentType] || 0) + 1;
    });
    // Aggregate ratings
    const ratingCounts = {};
    requests.forEach((request) => {
        if (request.responses?.competencyRatings) {
            Object.entries(request.responses.competencyRatings).forEach(([competency, rating]) => {
                if (!ratingCounts[competency]) {
                    ratingCounts[competency] = { sum: 0, count: 0 };
                }
                ratingCounts[competency].sum += rating;
                ratingCounts[competency].count += 1;
            });
        }
        // Collect themes
        if (request.responses?.strengths) {
            aggregated.themes.strengths.push(request.responses.strengths);
        }
        if (request.responses?.areasForImprovement) {
            aggregated.themes.areasForImprovement.push(request.responses.areasForImprovement);
        }
    });
    // Calculate averages
    Object.entries(ratingCounts).forEach(([competency, data]) => {
        aggregated.averageRatings[competency] = data.sum / data.count;
    });
    return aggregated;
}
// ============================================================================
// CONTINUOUS FEEDBACK FUNCTIONS
// ============================================================================
/**
 * Create continuous feedback
 *
 * @param feedbackData - Feedback data
 * @param transaction - Optional transaction
 * @returns Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await createContinuousFeedback({
 *   employeeId: 'emp-uuid',
 *   giverId: 'manager-uuid',
 *   feedbackType: FeedbackType.PRAISE,
 *   visibility: FeedbackVisibility.EMPLOYEE,
 *   content: 'Great work on the project!',
 * });
 * ```
 */
async function createContinuousFeedback(feedbackData, transaction) {
    const validated = exports.ContinuousFeedbackSchema.parse(feedbackData);
    const feedback = await ContinuousFeedbackModel.create(validated, { transaction });
    return feedback;
}
/**
 * Get employee continuous feedback
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback items
 *
 * @example
 * ```typescript
 * const feedback = await getEmployeeContinuousFeedback('emp-uuid', {
 *   feedbackType: FeedbackType.PRAISE,
 *   limit: 20,
 * });
 * ```
 */
async function getEmployeeContinuousFeedback(employeeId, filters) {
    const where = { employeeId };
    if (filters?.feedbackType)
        where.feedbackType = filters.feedbackType;
    if (filters?.giverId)
        where.giverId = filters.giverId;
    if (filters?.visibility)
        where.visibility = filters.visibility;
    if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) {
            where.createdAt[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.createdAt[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    return ContinuousFeedbackModel.findAll({
        where,
        limit: filters?.limit || 100,
        offset: filters?.offset || 0,
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Acknowledge feedback
 *
 * @param feedbackId - Feedback ID
 * @param transaction - Optional transaction
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await acknowledgeFeedback('feedback-uuid');
 * ```
 */
async function acknowledgeFeedback(feedbackId, transaction) {
    const feedback = await ContinuousFeedbackModel.findByPk(feedbackId, { transaction });
    if (!feedback) {
        throw new common_1.NotFoundException(`Feedback ${feedbackId} not found`);
    }
    await feedback.update({
        acknowledgedAt: new Date(),
    }, { transaction });
    return feedback;
}
/**
 * Get feedback statistics
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Feedback statistics
 *
 * @example
 * ```typescript
 * const stats = await getFeedbackStatistics('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function getFeedbackStatistics(employeeId, startDate, endDate) {
    const feedback = await ContinuousFeedbackModel.findAll({
        where: {
            employeeId,
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const stats = {
        totalFeedback: feedback.length,
        byType: {},
        byVisibility: {},
        acknowledgedCount: 0,
    };
    feedback.forEach((item) => {
        stats.byType[item.feedbackType] = (stats.byType[item.feedbackType] || 0) + 1;
        stats.byVisibility[item.visibility] = (stats.byVisibility[item.visibility] || 0) + 1;
        if (item.acknowledgedAt) {
            stats.acknowledgedCount += 1;
        }
    });
    return stats;
}
// ============================================================================
// PERFORMANCE IMPROVEMENT PLAN (PIP) FUNCTIONS
// ============================================================================
/**
 * Create Performance Improvement Plan
 *
 * @param pipData - PIP data
 * @param transaction - Optional transaction
 * @returns Created PIP
 *
 * @example
 * ```typescript
 * const pip = await createPerformanceImprovementPlan({
 *   employeeId: 'emp-uuid',
 *   managerId: 'manager-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   reviewDate: new Date('2024-02-15'),
 *   performanceIssues: ['Issue 1', 'Issue 2'],
 *   expectedImprovements: ['Improvement 1', 'Improvement 2'],
 *   supportProvided: ['Training', 'Mentoring'],
 *   successCriteria: ['Criteria 1', 'Criteria 2'],
 * });
 * ```
 */
async function createPerformanceImprovementPlan(pipData, transaction) {
    const validated = exports.PIPSchema.parse(pipData);
    // Check if active PIP already exists for employee
    const existing = await PerformanceImprovementPlanModel.findOne({
        where: {
            employeeId: validated.employeeId,
            status: {
                [sequelize_1.Op.in]: [PIPStatus.ACTIVE, PIPStatus.IN_PROGRESS],
            },
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Active PIP already exists for this employee');
    }
    const pip = await PerformanceImprovementPlanModel.create(validated, { transaction });
    return pip;
}
/**
 * Update PIP status
 *
 * @param pipId - PIP ID
 * @param status - New status
 * @param outcome - Outcome description (if completed)
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await updatePIPStatus('pip-uuid', PIPStatus.SUCCESSFUL,
 *   'Employee met all success criteria');
 * ```
 */
async function updatePIPStatus(pipId, status, outcome, transaction) {
    const pip = await PerformanceImprovementPlanModel.findByPk(pipId, { transaction });
    if (!pip) {
        throw new common_1.NotFoundException(`PIP ${pipId} not found`);
    }
    const updates = { status };
    if (outcome) {
        updates.outcome = outcome;
    }
    await pip.update(updates, { transaction });
    return pip;
}
/**
 * Approve PIP (HR approval)
 *
 * @param pipId - PIP ID
 * @param hrUserId - HR user approving
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await approvePIP('pip-uuid', 'hr-uuid');
 * ```
 */
async function approvePIP(pipId, hrUserId, transaction) {
    const pip = await PerformanceImprovementPlanModel.findByPk(pipId, { transaction });
    if (!pip) {
        throw new common_1.NotFoundException(`PIP ${pipId} not found`);
    }
    await pip.update({
        status: PIPStatus.ACTIVE,
        hrApprovalBy: hrUserId,
        hrApprovalAt: new Date(),
    }, { transaction });
    return pip;
}
/**
 * Get employee PIPs
 *
 * @param employeeId - Employee ID
 * @param includeCompleted - Include completed PIPs
 * @returns Array of PIPs
 *
 * @example
 * ```typescript
 * const pips = await getEmployeePIPs('emp-uuid', true);
 * ```
 */
async function getEmployeePIPs(employeeId, includeCompleted = false) {
    const where = { employeeId };
    if (!includeCompleted) {
        where.status = {
            [sequelize_1.Op.notIn]: [PIPStatus.SUCCESSFUL, PIPStatus.UNSUCCESSFUL, PIPStatus.CANCELLED],
        };
    }
    return PerformanceImprovementPlanModel.findAll({
        where,
        order: [['startDate', 'DESC']],
    });
}
/**
 * Get active PIPs for manager
 *
 * @param managerId - Manager ID
 * @returns Array of active PIPs
 *
 * @example
 * ```typescript
 * const pips = await getActivePIPsForManager('manager-uuid');
 * ```
 */
async function getActivePIPsForManager(managerId) {
    return PerformanceImprovementPlanModel.findAll({
        where: {
            managerId,
            status: {
                [sequelize_1.Op.in]: [PIPStatus.ACTIVE, PIPStatus.IN_PROGRESS],
            },
        },
        order: [['reviewDate', 'ASC']],
    });
}
// ============================================================================
// COMPETENCY ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Create competency
 *
 * @param competencyData - Competency data
 * @param transaction - Optional transaction
 * @returns Created competency
 *
 * @example
 * ```typescript
 * const competency = await createCompetency({
 *   code: 'LEAD-001',
 *   name: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   description: 'Ability to set and communicate vision...',
 * });
 * ```
 */
async function createCompetency(competencyData, transaction) {
    const existing = await CompetencyModel.findOne({
        where: { code: competencyData.code },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Competency with code ${competencyData.code} already exists`);
    }
    const competency = await CompetencyModel.create(competencyData, { transaction });
    return competency;
}
/**
 * Add competency assessment to review
 *
 * @param assessmentData - Assessment data
 * @param transaction - Optional transaction
 * @returns Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await addCompetencyAssessment({
 *   reviewId: 'review-uuid',
 *   competencyId: 'comp-uuid',
 *   competencyName: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   expectedLevel: 4,
 *   currentLevel: 3,
 * });
 * ```
 */
async function addCompetencyAssessment(assessmentData, transaction) {
    const validated = exports.CompetencyAssessmentSchema.parse(assessmentData);
    const assessment = await CompetencyAssessmentModel.create(validated, { transaction });
    return assessment;
}
/**
 * Update competency assessment
 *
 * @param assessmentId - Assessment ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await updateCompetencyAssessment('assessment-uuid', {
 *   currentLevel: 4,
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   assessorComments: 'Showing strong improvement',
 * });
 * ```
 */
async function updateCompetencyAssessment(assessmentId, updates, transaction) {
    const assessment = await CompetencyAssessmentModel.findByPk(assessmentId, { transaction });
    if (!assessment) {
        throw new common_1.NotFoundException(`Competency assessment ${assessmentId} not found`);
    }
    await assessment.update(updates, { transaction });
    return assessment;
}
/**
 * Get competency assessments for review
 *
 * @param reviewId - Review ID
 * @returns Array of competency assessments
 *
 * @example
 * ```typescript
 * const assessments = await getCompetencyAssessments('review-uuid');
 * ```
 */
async function getCompetencyAssessments(reviewId) {
    return CompetencyAssessmentModel.findAll({
        where: { reviewId },
        include: [{ model: CompetencyModel, as: 'competency' }],
        order: [['category', 'ASC'], ['competencyName', 'ASC']],
    });
}
/**
 * Get competency gap analysis
 *
 * @param reviewId - Review ID
 * @returns Competency gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await getCompetencyGapAnalysis('review-uuid');
 * ```
 */
async function getCompetencyGapAnalysis(reviewId) {
    const assessments = await CompetencyAssessmentModel.findAll({
        where: { reviewId },
    });
    const gaps = assessments.map((assessment) => {
        const gap = assessment.expectedLevel - assessment.currentLevel;
        let developmentPriority = 'low';
        if (gap >= 2) {
            developmentPriority = 'high';
        }
        else if (gap === 1) {
            developmentPriority = 'medium';
        }
        return {
            competencyId: assessment.competencyId,
            competencyName: assessment.competencyName,
            category: assessment.category,
            expectedLevel: assessment.expectedLevel,
            currentLevel: assessment.currentLevel,
            gap,
            developmentPriority,
        };
    });
    return gaps.sort((a, b) => b.gap - a.gap);
}
// ============================================================================
// CALIBRATION SESSION FUNCTIONS
// ============================================================================
/**
 * Create calibration session
 *
 * @param sessionData - Session data
 * @param transaction - Optional transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createCalibrationSession({
 *   name: 'Engineering Team Calibration',
 *   cycleId: 'cycle-uuid',
 *   facilitatorId: 'hr-uuid',
 *   scheduledDate: new Date('2024-03-15'),
 *   participants: ['manager1-uuid', 'manager2-uuid'],
 *   reviewsDiscussed: ['review1-uuid', 'review2-uuid'],
 * });
 * ```
 */
async function createCalibrationSession(sessionData, transaction) {
    const validated = exports.CalibrationSessionSchema.parse(sessionData);
    const session = await CalibrationSessionModel.create(validated, { transaction });
    return session;
}
/**
 * Update calibration session
 *
 * @param sessionId - Session ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await updateCalibrationSession('session-uuid', {
 *   status: CalibrationStatus.COMPLETED,
 *   completedDate: new Date(),
 * });
 * ```
 */
async function updateCalibrationSession(sessionId, updates, transaction) {
    const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Calibration session ${sessionId} not found`);
    }
    await session.update(updates, { transaction });
    return session;
}
/**
 * Add rating adjustment in calibration
 *
 * @param sessionId - Session ID
 * @param reviewId - Review ID
 * @param oldRating - Old rating
 * @param newRating - New rating
 * @param reason - Reason for adjustment
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await addRatingAdjustment('session-uuid', 'review-uuid',
 *   PerformanceRating.MEETS_EXPECTATIONS,
 *   PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   'Performance was underrated compared to peers');
 * ```
 */
async function addRatingAdjustment(sessionId, reviewId, oldRating, newRating, reason, transaction) {
    const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Calibration session ${sessionId} not found`);
    }
    const adjustments = session.ratingAdjustments || [];
    adjustments.push({
        reviewId,
        oldRating,
        newRating,
        reason,
    });
    await session.update({ ratingAdjustments: adjustments }, { transaction });
    // Update the review with new rating
    await updatePerformanceReview(reviewId, {
        overallRating: newRating,
        calibrationCompleted: true,
    }, transaction);
    return session;
}
/**
 * Get calibration sessions for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Array of calibration sessions
 *
 * @example
 * ```typescript
 * const sessions = await getCalibrationSessions('cycle-uuid');
 * ```
 */
async function getCalibrationSessions(cycleId) {
    return CalibrationSessionModel.findAll({
        where: { cycleId },
        order: [['scheduledDate', 'ASC']],
        include: [{ model: PerformanceReviewCycleModel, as: 'cycle' }],
    });
}
/**
 * Complete calibration session
 *
 * @param sessionId - Session ID
 * @param notes - Session notes
 * @param transaction - Optional transaction
 * @returns Completed session
 *
 * @example
 * ```typescript
 * await completeCalibrationSession('session-uuid',
 *   'All ratings reviewed and adjusted as needed');
 * ```
 */
async function completeCalibrationSession(sessionId, notes, transaction) {
    const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });
    if (!session) {
        throw new common_1.NotFoundException(`Calibration session ${sessionId} not found`);
    }
    await session.update({
        status: CalibrationStatus.COMPLETED,
        completedDate: new Date(),
        notes,
    }, { transaction });
    return session;
}
// ============================================================================
// ANALYTICS AND REPORTING FUNCTIONS
// ============================================================================
/**
 * Get performance distribution for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Performance rating distribution
 *
 * @example
 * ```typescript
 * const distribution = await getPerformanceDistribution('cycle-uuid');
 * ```
 */
async function getPerformanceDistribution(cycleId) {
    const reviews = await PerformanceReviewModel.findAll({
        where: {
            cycleId,
            status: ReviewStatus.COMPLETED,
            overallRating: { [sequelize_1.Op.ne]: null },
        },
    });
    const total = reviews.length;
    const distribution = {};
    Object.values(PerformanceRating).forEach((rating) => {
        distribution[rating] = { count: 0, percentage: 0 };
    });
    reviews.forEach((review) => {
        if (review.overallRating) {
            distribution[review.overallRating].count += 1;
        }
    });
    Object.keys(distribution).forEach((rating) => {
        distribution[rating].percentage =
            total > 0 ? (distribution[rating].count / total) * 100 : 0;
    });
    return distribution;
}
/**
 * Get review completion statistics
 *
 * @param cycleId - Cycle ID
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getReviewCompletionStats('cycle-uuid');
 * ```
 */
async function getReviewCompletionStats(cycleId) {
    const reviews = await PerformanceReviewModel.findAll({
        where: { cycleId },
    });
    const stats = {
        total: reviews.length,
        notStarted: 0,
        inProgress: 0,
        completed: 0,
        completionRate: 0,
        selfAssessmentCompleted: 0,
        managerAssessmentCompleted: 0,
        calibrationCompleted: 0,
    };
    reviews.forEach((review) => {
        if (review.status === ReviewStatus.NOT_STARTED) {
            stats.notStarted += 1;
        }
        else if (review.status === ReviewStatus.COMPLETED) {
            stats.completed += 1;
        }
        else {
            stats.inProgress += 1;
        }
        if (review.selfAssessmentCompleted)
            stats.selfAssessmentCompleted += 1;
        if (review.managerAssessmentCompleted)
            stats.managerAssessmentCompleted += 1;
        if (review.calibrationCompleted)
            stats.calibrationCompleted += 1;
    });
    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    return stats;
}
/**
 * Get manager performance summary
 *
 * @param managerId - Manager ID
 * @param cycleId - Cycle ID
 * @returns Performance summary for manager's team
 *
 * @example
 * ```typescript
 * const summary = await getManagerPerformanceSummary('manager-uuid', 'cycle-uuid');
 * ```
 */
async function getManagerPerformanceSummary(managerId, cycleId) {
    const reviews = await PerformanceReviewModel.findAll({
        where: {
            reviewerId: managerId,
            cycleId,
        },
    });
    const summary = {
        totalReviews: reviews.length,
        completedReviews: 0,
        averageScore: 0,
        ratingDistribution: {},
        topPerformers: [],
        needsImprovement: [],
    };
    let totalScore = 0;
    let scoreCount = 0;
    // Initialize rating distribution
    Object.values(PerformanceRating).forEach((rating) => {
        summary.ratingDistribution[rating] = 0;
    });
    reviews.forEach((review) => {
        if (review.status === ReviewStatus.COMPLETED) {
            summary.completedReviews += 1;
            if (review.overallScore) {
                totalScore += review.overallScore;
                scoreCount += 1;
            }
            if (review.overallRating) {
                summary.ratingDistribution[review.overallRating] += 1;
                // Identify top performers and needs improvement
                if (review.overallRating === PerformanceRating.OUTSTANDING ||
                    review.overallRating === PerformanceRating.EXCEEDS_EXPECTATIONS) {
                    summary.topPerformers.push({
                        employeeId: review.employeeId,
                        rating: review.overallRating,
                        score: review.overallScore || 0,
                    });
                }
                else if (review.overallRating === PerformanceRating.NEEDS_IMPROVEMENT ||
                    review.overallRating === PerformanceRating.UNSATISFACTORY) {
                    summary.needsImprovement.push({
                        employeeId: review.employeeId,
                        rating: review.overallRating,
                        score: review.overallScore || 0,
                    });
                }
            }
        }
    });
    summary.averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    // Sort top performers and needs improvement by score
    summary.topPerformers.sort((a, b) => b.score - a.score);
    summary.needsImprovement.sort((a, b) => a.score - b.score);
    return summary;
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let PerformanceManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PerformanceManagementService = _classThis = class {
        // Review cycle methods
        async createReviewCycle(data, transaction) {
            return createReviewCycle(data, transaction);
        }
        // Performance review methods
        async createPerformanceReview(data, transaction) {
            return createPerformanceReview(data, transaction);
        }
        async updatePerformanceReview(id, data, transaction) {
            return updatePerformanceReview(id, data, transaction);
        }
        async getPerformanceReviewById(id, includeRelations = false) {
            return getPerformanceReviewById(id, includeRelations);
        }
        async getEmployeePerformanceReviews(employeeId, filters) {
            return getEmployeePerformanceReviews(employeeId, filters);
        }
        async finalizePerformanceReview(id, finalizedBy, rating, score, transaction) {
            return finalizePerformanceReview(id, finalizedBy, rating, score, transaction);
        }
        // Review section methods
        async addReviewSection(data, transaction) {
            return addReviewSection(data, transaction);
        }
        async updateReviewSection(id, data, transaction) {
            return updateReviewSection(id, data, transaction);
        }
        async getReviewSections(reviewId) {
            return getReviewSections(reviewId);
        }
        async calculateOverallScore(reviewId) {
            return calculateOverallScore(reviewId);
        }
        // 360 feedback methods
        async create360FeedbackRequest(data, transaction) {
            return create360FeedbackRequest(data, transaction);
        }
        async submit360FeedbackResponse(id, responses, transaction) {
            return submit360FeedbackResponse(id, responses, transaction);
        }
        async get360FeedbackRequests(employeeId, filters) {
            return get360FeedbackRequests(employeeId, filters);
        }
        async get360FeedbackRequestsForRespondent(respondentId, filters) {
            return get360FeedbackRequestsForRespondent(respondentId, filters);
        }
        async aggregate360Feedback(reviewId) {
            return aggregate360Feedback(reviewId);
        }
        // Continuous feedback methods
        async createContinuousFeedback(data, transaction) {
            return createContinuousFeedback(data, transaction);
        }
        async getEmployeeContinuousFeedback(employeeId, filters) {
            return getEmployeeContinuousFeedback(employeeId, filters);
        }
        async acknowledgeFeedback(id, transaction) {
            return acknowledgeFeedback(id, transaction);
        }
        async getFeedbackStatistics(employeeId, startDate, endDate) {
            return getFeedbackStatistics(employeeId, startDate, endDate);
        }
        // PIP methods
        async createPerformanceImprovementPlan(data, transaction) {
            return createPerformanceImprovementPlan(data, transaction);
        }
        async updatePIPStatus(id, status, outcome, transaction) {
            return updatePIPStatus(id, status, outcome, transaction);
        }
        async approvePIP(id, hrUserId, transaction) {
            return approvePIP(id, hrUserId, transaction);
        }
        async getEmployeePIPs(employeeId, includeCompleted = false) {
            return getEmployeePIPs(employeeId, includeCompleted);
        }
        async getActivePIPsForManager(managerId) {
            return getActivePIPsForManager(managerId);
        }
        // Competency methods
        async createCompetency(data, transaction) {
            return createCompetency(data, transaction);
        }
        async addCompetencyAssessment(data, transaction) {
            return addCompetencyAssessment(data, transaction);
        }
        async updateCompetencyAssessment(id, data, transaction) {
            return updateCompetencyAssessment(id, data, transaction);
        }
        async getCompetencyAssessments(reviewId) {
            return getCompetencyAssessments(reviewId);
        }
        async getCompetencyGapAnalysis(reviewId) {
            return getCompetencyGapAnalysis(reviewId);
        }
        // Calibration methods
        async createCalibrationSession(data, transaction) {
            return createCalibrationSession(data, transaction);
        }
        async updateCalibrationSession(id, data, transaction) {
            return updateCalibrationSession(id, data, transaction);
        }
        async addRatingAdjustment(sessionId, reviewId, oldRating, newRating, reason, transaction) {
            return addRatingAdjustment(sessionId, reviewId, oldRating, newRating, reason, transaction);
        }
        async getCalibrationSessions(cycleId) {
            return getCalibrationSessions(cycleId);
        }
        async completeCalibrationSession(id, notes, transaction) {
            return completeCalibrationSession(id, notes, transaction);
        }
        // Analytics methods
        async getPerformanceDistribution(cycleId) {
            return getPerformanceDistribution(cycleId);
        }
        async getReviewCompletionStats(cycleId) {
            return getReviewCompletionStats(cycleId);
        }
        async getManagerPerformanceSummary(managerId, cycleId) {
            return getManagerPerformanceSummary(managerId, cycleId);
        }
    };
    __setFunctionName(_classThis, "PerformanceManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceManagementService = _classThis;
})();
exports.PerformanceManagementService = PerformanceManagementService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let PerformanceManagementController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Performance Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('performance-management')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createReviewCycle_decorators;
    let _createReview_decorators;
    let _getReview_decorators;
    let _updateReview_decorators;
    let _finalizeReview_decorators;
    let _getEmployeeReviews_decorators;
    let _create360Request_decorators;
    let _submit360Response_decorators;
    let _aggregate360_decorators;
    let _createFeedback_decorators;
    let _getEmployeeFeedback_decorators;
    let _createPIP_decorators;
    let _updatePIPStatus_decorators;
    let _approvePIP_decorators;
    let _createCompetency_decorators;
    let _addCompetencyAssessment_decorators;
    let _getCompetencyAssessments_decorators;
    let _getGapAnalysis_decorators;
    let _createCalibrationSession_decorators;
    let _addRatingAdjustment_decorators;
    let _completeCalibrationSession_decorators;
    let _getPerformanceDistribution_decorators;
    let _getCompletionStats_decorators;
    let _getManagerSummary_decorators;
    var PerformanceManagementController = _classThis = class {
        constructor(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        async createReviewCycle(data) {
            return this.service.createReviewCycle(data);
        }
        async createReview(data) {
            return this.service.createPerformanceReview(data);
        }
        async getReview(id, includeRelations) {
            return this.service.getPerformanceReviewById(id, includeRelations);
        }
        async updateReview(id, data) {
            return this.service.updatePerformanceReview(id, data);
        }
        async finalizeReview(id, data) {
            return this.service.finalizePerformanceReview(id, data.finalizedBy, data.overallRating, data.overallScore);
        }
        async getEmployeeReviews(employeeId, filters) {
            return this.service.getEmployeePerformanceReviews(employeeId, filters);
        }
        async create360Request(data) {
            return this.service.create360FeedbackRequest(data);
        }
        async submit360Response(id, responses) {
            return this.service.submit360FeedbackResponse(id, responses);
        }
        async aggregate360(reviewId) {
            return this.service.aggregate360Feedback(reviewId);
        }
        async createFeedback(data) {
            return this.service.createContinuousFeedback(data);
        }
        async getEmployeeFeedback(employeeId, filters) {
            return this.service.getEmployeeContinuousFeedback(employeeId, filters);
        }
        async createPIP(data) {
            return this.service.createPerformanceImprovementPlan(data);
        }
        async updatePIPStatus(id, data) {
            return this.service.updatePIPStatus(id, data.status, data.outcome);
        }
        async approvePIP(id, data) {
            return this.service.approvePIP(id, data.hrUserId);
        }
        async createCompetency(data) {
            return this.service.createCompetency(data);
        }
        async addCompetencyAssessment(data) {
            return this.service.addCompetencyAssessment(data);
        }
        async getCompetencyAssessments(reviewId) {
            return this.service.getCompetencyAssessments(reviewId);
        }
        async getGapAnalysis(reviewId) {
            return this.service.getCompetencyGapAnalysis(reviewId);
        }
        async createCalibrationSession(data) {
            return this.service.createCalibrationSession(data);
        }
        async addRatingAdjustment(id, data) {
            return this.service.addRatingAdjustment(id, data.reviewId, data.oldRating, data.newRating, data.reason);
        }
        async completeCalibrationSession(id, data) {
            return this.service.completeCalibrationSession(id, data.notes);
        }
        async getPerformanceDistribution(cycleId) {
            return this.service.getPerformanceDistribution(cycleId);
        }
        async getCompletionStats(cycleId) {
            return this.service.getReviewCompletionStats(cycleId);
        }
        async getManagerSummary(managerId, cycleId) {
            return this.service.getManagerPerformanceSummary(managerId, cycleId);
        }
    };
    __setFunctionName(_classThis, "PerformanceManagementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createReviewCycle_decorators = [(0, common_1.Post)('review-cycles'), (0, swagger_1.ApiOperation)({ summary: 'Create performance review cycle' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Review cycle created successfully' })];
        _createReview_decorators = [(0, common_1.Post)('reviews'), (0, swagger_1.ApiOperation)({ summary: 'Create performance review' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Performance review created successfully' })];
        _getReview_decorators = [(0, common_1.Get)('reviews/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get performance review by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Review ID' }), (0, swagger_1.ApiQuery)({ name: 'includeRelations', required: false, type: Boolean })];
        _updateReview_decorators = [(0, common_1.Put)('reviews/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update performance review' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Review ID' })];
        _finalizeReview_decorators = [(0, common_1.Post)('reviews/:id/finalize'), (0, swagger_1.ApiOperation)({ summary: 'Finalize performance review' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Review ID' })];
        _getEmployeeReviews_decorators = [(0, common_1.Get)('employees/:employeeId/reviews'), (0, swagger_1.ApiOperation)({ summary: 'Get employee performance reviews' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' })];
        _create360Request_decorators = [(0, common_1.Post)('360-feedback/requests'), (0, swagger_1.ApiOperation)({ summary: 'Create 360 feedback request' }), (0, swagger_1.ApiResponse)({ status: 201, description: '360 feedback request created successfully' })];
        _submit360Response_decorators = [(0, common_1.Post)('360-feedback/requests/:id/submit'), (0, swagger_1.ApiOperation)({ summary: 'Submit 360 feedback response' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Request ID' })];
        _aggregate360_decorators = [(0, common_1.Get)('reviews/:reviewId/360-feedback/aggregate'), (0, swagger_1.ApiOperation)({ summary: 'Get aggregated 360 feedback for review' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' })];
        _createFeedback_decorators = [(0, common_1.Post)('continuous-feedback'), (0, swagger_1.ApiOperation)({ summary: 'Create continuous feedback' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback created successfully' })];
        _getEmployeeFeedback_decorators = [(0, common_1.Get)('employees/:employeeId/continuous-feedback'), (0, swagger_1.ApiOperation)({ summary: 'Get employee continuous feedback' }), (0, swagger_1.ApiParam)({ name: 'employeeId', description: 'Employee ID' })];
        _createPIP_decorators = [(0, common_1.Post)('pips'), (0, swagger_1.ApiOperation)({ summary: 'Create Performance Improvement Plan' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'PIP created successfully' })];
        _updatePIPStatus_decorators = [(0, common_1.Patch)('pips/:id/status'), (0, swagger_1.ApiOperation)({ summary: 'Update PIP status' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'PIP ID' })];
        _approvePIP_decorators = [(0, common_1.Post)('pips/:id/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve PIP (HR approval)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'PIP ID' })];
        _createCompetency_decorators = [(0, common_1.Post)('competencies'), (0, swagger_1.ApiOperation)({ summary: 'Create competency' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Competency created successfully' })];
        _addCompetencyAssessment_decorators = [(0, common_1.Post)('competency-assessments'), (0, swagger_1.ApiOperation)({ summary: 'Add competency assessment to review' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment created successfully' })];
        _getCompetencyAssessments_decorators = [(0, common_1.Get)('reviews/:reviewId/competency-assessments'), (0, swagger_1.ApiOperation)({ summary: 'Get competency assessments for review' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' })];
        _getGapAnalysis_decorators = [(0, common_1.Get)('reviews/:reviewId/competency-gap-analysis'), (0, swagger_1.ApiOperation)({ summary: 'Get competency gap analysis' }), (0, swagger_1.ApiParam)({ name: 'reviewId', description: 'Review ID' })];
        _createCalibrationSession_decorators = [(0, common_1.Post)('calibration-sessions'), (0, swagger_1.ApiOperation)({ summary: 'Create calibration session' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Calibration session created successfully' })];
        _addRatingAdjustment_decorators = [(0, common_1.Post)('calibration-sessions/:id/rating-adjustments'), (0, swagger_1.ApiOperation)({ summary: 'Add rating adjustment in calibration' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' })];
        _completeCalibrationSession_decorators = [(0, common_1.Post)('calibration-sessions/:id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Complete calibration session' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Session ID' })];
        _getPerformanceDistribution_decorators = [(0, common_1.Get)('cycles/:cycleId/performance-distribution'), (0, swagger_1.ApiOperation)({ summary: 'Get performance rating distribution for cycle' }), (0, swagger_1.ApiParam)({ name: 'cycleId', description: 'Cycle ID' })];
        _getCompletionStats_decorators = [(0, common_1.Get)('cycles/:cycleId/completion-stats'), (0, swagger_1.ApiOperation)({ summary: 'Get review completion statistics' }), (0, swagger_1.ApiParam)({ name: 'cycleId', description: 'Cycle ID' })];
        _getManagerSummary_decorators = [(0, common_1.Get)('managers/:managerId/performance-summary'), (0, swagger_1.ApiOperation)({ summary: "Get manager's team performance summary" }), (0, swagger_1.ApiParam)({ name: 'managerId', description: 'Manager ID' }), (0, swagger_1.ApiQuery)({ name: 'cycleId', description: 'Cycle ID' })];
        __esDecorate(_classThis, null, _createReviewCycle_decorators, { kind: "method", name: "createReviewCycle", static: false, private: false, access: { has: obj => "createReviewCycle" in obj, get: obj => obj.createReviewCycle }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createReview_decorators, { kind: "method", name: "createReview", static: false, private: false, access: { has: obj => "createReview" in obj, get: obj => obj.createReview }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReview_decorators, { kind: "method", name: "getReview", static: false, private: false, access: { has: obj => "getReview" in obj, get: obj => obj.getReview }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateReview_decorators, { kind: "method", name: "updateReview", static: false, private: false, access: { has: obj => "updateReview" in obj, get: obj => obj.updateReview }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _finalizeReview_decorators, { kind: "method", name: "finalizeReview", static: false, private: false, access: { has: obj => "finalizeReview" in obj, get: obj => obj.finalizeReview }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEmployeeReviews_decorators, { kind: "method", name: "getEmployeeReviews", static: false, private: false, access: { has: obj => "getEmployeeReviews" in obj, get: obj => obj.getEmployeeReviews }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create360Request_decorators, { kind: "method", name: "create360Request", static: false, private: false, access: { has: obj => "create360Request" in obj, get: obj => obj.create360Request }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submit360Response_decorators, { kind: "method", name: "submit360Response", static: false, private: false, access: { has: obj => "submit360Response" in obj, get: obj => obj.submit360Response }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _aggregate360_decorators, { kind: "method", name: "aggregate360", static: false, private: false, access: { has: obj => "aggregate360" in obj, get: obj => obj.aggregate360 }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFeedback_decorators, { kind: "method", name: "createFeedback", static: false, private: false, access: { has: obj => "createFeedback" in obj, get: obj => obj.createFeedback }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEmployeeFeedback_decorators, { kind: "method", name: "getEmployeeFeedback", static: false, private: false, access: { has: obj => "getEmployeeFeedback" in obj, get: obj => obj.getEmployeeFeedback }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPIP_decorators, { kind: "method", name: "createPIP", static: false, private: false, access: { has: obj => "createPIP" in obj, get: obj => obj.createPIP }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePIPStatus_decorators, { kind: "method", name: "updatePIPStatus", static: false, private: false, access: { has: obj => "updatePIPStatus" in obj, get: obj => obj.updatePIPStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approvePIP_decorators, { kind: "method", name: "approvePIP", static: false, private: false, access: { has: obj => "approvePIP" in obj, get: obj => obj.approvePIP }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCompetency_decorators, { kind: "method", name: "createCompetency", static: false, private: false, access: { has: obj => "createCompetency" in obj, get: obj => obj.createCompetency }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addCompetencyAssessment_decorators, { kind: "method", name: "addCompetencyAssessment", static: false, private: false, access: { has: obj => "addCompetencyAssessment" in obj, get: obj => obj.addCompetencyAssessment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCompetencyAssessments_decorators, { kind: "method", name: "getCompetencyAssessments", static: false, private: false, access: { has: obj => "getCompetencyAssessments" in obj, get: obj => obj.getCompetencyAssessments }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGapAnalysis_decorators, { kind: "method", name: "getGapAnalysis", static: false, private: false, access: { has: obj => "getGapAnalysis" in obj, get: obj => obj.getGapAnalysis }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCalibrationSession_decorators, { kind: "method", name: "createCalibrationSession", static: false, private: false, access: { has: obj => "createCalibrationSession" in obj, get: obj => obj.createCalibrationSession }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addRatingAdjustment_decorators, { kind: "method", name: "addRatingAdjustment", static: false, private: false, access: { has: obj => "addRatingAdjustment" in obj, get: obj => obj.addRatingAdjustment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _completeCalibrationSession_decorators, { kind: "method", name: "completeCalibrationSession", static: false, private: false, access: { has: obj => "completeCalibrationSession" in obj, get: obj => obj.completeCalibrationSession }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPerformanceDistribution_decorators, { kind: "method", name: "getPerformanceDistribution", static: false, private: false, access: { has: obj => "getPerformanceDistribution" in obj, get: obj => obj.getPerformanceDistribution }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCompletionStats_decorators, { kind: "method", name: "getCompletionStats", static: false, private: false, access: { has: obj => "getCompletionStats" in obj, get: obj => obj.getCompletionStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManagerSummary_decorators, { kind: "method", name: "getManagerSummary", static: false, private: false, access: { has: obj => "getManagerSummary" in obj, get: obj => obj.getManagerSummary }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerformanceManagementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerformanceManagementController = _classThis;
})();
exports.PerformanceManagementController = PerformanceManagementController;
//# sourceMappingURL=performance-management-kit.js.map