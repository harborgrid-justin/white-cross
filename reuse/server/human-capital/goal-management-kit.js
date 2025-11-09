"use strict";
/**
 * LOC: HCM_GOAL_MGT_001
 * File: /reuse/server/human-capital/goal-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Goal management services
 *   - OKR implementations
 *   - Performance review systems
 *   - Talent management platforms
 *   - HR analytics & reporting
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
exports.GoalManagementController = exports.GoalManagementService = exports.GoalTemplateModel = exports.GoalAlignmentModel = exports.GoalCheckInModel = exports.MilestoneModel = exports.KeyResultModel = exports.GoalModel = exports.GoalPlanModel = exports.GoalAlignmentSchema = exports.GoalCheckInSchema = exports.MilestoneSchema = exports.KeyResultSchema = exports.SMARTCriteriaSchema = exports.GoalSchema = exports.AlignmentType = exports.MeasurementUnit = exports.CheckInFrequency = exports.KeyResultStatus = exports.GoalPriority = exports.GoalCategory = exports.GoalStatus = exports.GoalMethodology = exports.GoalType = void 0;
exports.createGoalPlan = createGoalPlan;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.getGoalById = getGoalById;
exports.getEmployeeGoals = getEmployeeGoals;
exports.approveGoal = approveGoal;
exports.activateGoal = activateGoal;
exports.deleteGoal = deleteGoal;
exports.createSMARTGoal = createSMARTGoal;
exports.addKeyResult = addKeyResult;
exports.updateKeyResult = updateKeyResult;
exports.updateKeyResultProgress = updateKeyResultProgress;
exports.getKeyResults = getKeyResults;
exports.calculateGoalProgressFromKeyResults = calculateGoalProgressFromKeyResults;
exports.addMilestone = addMilestone;
exports.completeMilestone = completeMilestone;
exports.getMilestones = getMilestones;
exports.calculateGoalProgressFromMilestones = calculateGoalProgressFromMilestones;
exports.createGoalCheckIn = createGoalCheckIn;
exports.getGoalCheckIns = getGoalCheckIns;
exports.getLatestCheckIn = getLatestCheckIn;
exports.getCheckInHistory = getCheckInHistory;
exports.createGoalAlignment = createGoalAlignment;
exports.getGoalAlignments = getGoalAlignments;
exports.getGoalAlignmentHierarchy = getGoalAlignmentHierarchy;
exports.deleteGoalAlignment = deleteGoalAlignment;
exports.cascadeGoal = cascadeGoal;
exports.getChildGoals = getChildGoals;
exports.getGoalHierarchy = getGoalHierarchy;
exports.createGoalTemplate = createGoalTemplate;
exports.getGoalTemplates = getGoalTemplates;
exports.createGoalFromTemplate = createGoalFromTemplate;
exports.getGoalCompletionStats = getGoalCompletionStats;
exports.getEmployeeGoalSummary = getEmployeeGoalSummary;
exports.getGoalsByStatus = getGoalsByStatus;
exports.getOverdueGoals = getOverdueGoals;
/**
 * File: /reuse/server/human-capital/goal-management-kit.ts
 * Locator: WC-HCM-GOAL-MGT-001
 * Purpose: Goal Management Kit - Comprehensive SMART goals and OKR management system
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/hr/goals/*, ../services/performance/*, Analytics & Reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 46+ utility functions for goal management including SMART goals, OKRs, goal cascading,
 *          individual/team/organizational goals, progress tracking, achievement measurement,
 *          mid-year and year-end reviews, goal templates, weighting, integration with performance
 *          reviews, key results tracking, milestone management, goal alignment, and reporting
 *
 * LLM Context: Enterprise-grade goal management for White Cross healthcare system with
 * SAP SuccessFactors Goal Management parity. Provides comprehensive goal planning and execution
 * including SMART goal creation and validation, OKR methodology support, goal cascading from
 * organizational to individual levels, individual/team/departmental/organizational goal types,
 * progress tracking with percentage completion, achievement measurement and scoring, mid-year
 * and year-end review workflows, goal templates and libraries, goal weighting and prioritization,
 * integration with performance reviews, key results with quantifiable metrics, milestone tracking,
 * goal alignment visualization, check-in and update mechanisms, goal assignment and delegation,
 * collaborative goal setting, goal status management (draft, active, achieved, not achieved),
 * goal categories and tags, stretch goals support, carry-over goals, historical goal tracking,
 * goal analytics and insights, HIPAA compliance for healthcare goals, and advanced reporting.
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
 * Goal type enumeration
 */
var GoalType;
(function (GoalType) {
    GoalType["INDIVIDUAL"] = "individual";
    GoalType["TEAM"] = "team";
    GoalType["DEPARTMENT"] = "department";
    GoalType["ORGANIZATIONAL"] = "organizational";
    GoalType["PROJECT"] = "project";
})(GoalType || (exports.GoalType = GoalType = {}));
/**
 * Goal methodology
 */
var GoalMethodology;
(function (GoalMethodology) {
    GoalMethodology["SMART"] = "smart";
    GoalMethodology["OKR"] = "okr";
    GoalMethodology["KPI"] = "kpi";
    GoalMethodology["CUSTOM"] = "custom";
})(GoalMethodology || (exports.GoalMethodology = GoalMethodology = {}));
/**
 * Goal status enumeration
 */
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DRAFT"] = "draft";
    GoalStatus["SUBMITTED"] = "submitted";
    GoalStatus["APPROVED"] = "approved";
    GoalStatus["ACTIVE"] = "active";
    GoalStatus["IN_PROGRESS"] = "in_progress";
    GoalStatus["ON_HOLD"] = "on_hold";
    GoalStatus["ACHIEVED"] = "achieved";
    GoalStatus["PARTIALLY_ACHIEVED"] = "partially_achieved";
    GoalStatus["NOT_ACHIEVED"] = "not_achieved";
    GoalStatus["CANCELLED"] = "cancelled";
    GoalStatus["CARRIED_OVER"] = "carried_over";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
/**
 * Goal category
 */
var GoalCategory;
(function (GoalCategory) {
    GoalCategory["STRATEGIC"] = "strategic";
    GoalCategory["OPERATIONAL"] = "operational";
    GoalCategory["DEVELOPMENTAL"] = "developmental";
    GoalCategory["FINANCIAL"] = "financial";
    GoalCategory["CUSTOMER"] = "customer";
    GoalCategory["QUALITY"] = "quality";
    GoalCategory["INNOVATION"] = "innovation";
    GoalCategory["COMPLIANCE"] = "compliance";
    GoalCategory["PEOPLE"] = "people";
})(GoalCategory || (exports.GoalCategory = GoalCategory = {}));
/**
 * Goal priority
 */
var GoalPriority;
(function (GoalPriority) {
    GoalPriority["CRITICAL"] = "critical";
    GoalPriority["HIGH"] = "high";
    GoalPriority["MEDIUM"] = "medium";
    GoalPriority["LOW"] = "low";
})(GoalPriority || (exports.GoalPriority = GoalPriority = {}));
/**
 * Key result status
 */
var KeyResultStatus;
(function (KeyResultStatus) {
    KeyResultStatus["NOT_STARTED"] = "not_started";
    KeyResultStatus["ON_TRACK"] = "on_track";
    KeyResultStatus["AT_RISK"] = "at_risk";
    KeyResultStatus["OFF_TRACK"] = "off_track";
    KeyResultStatus["ACHIEVED"] = "achieved";
})(KeyResultStatus || (exports.KeyResultStatus = KeyResultStatus = {}));
/**
 * Check-in frequency
 */
var CheckInFrequency;
(function (CheckInFrequency) {
    CheckInFrequency["WEEKLY"] = "weekly";
    CheckInFrequency["BI_WEEKLY"] = "bi_weekly";
    CheckInFrequency["MONTHLY"] = "monthly";
    CheckInFrequency["QUARTERLY"] = "quarterly";
    CheckInFrequency["AD_HOC"] = "ad_hoc";
})(CheckInFrequency || (exports.CheckInFrequency = CheckInFrequency = {}));
/**
 * Measurement unit
 */
var MeasurementUnit;
(function (MeasurementUnit) {
    MeasurementUnit["PERCENTAGE"] = "percentage";
    MeasurementUnit["NUMBER"] = "number";
    MeasurementUnit["CURRENCY"] = "currency";
    MeasurementUnit["BOOLEAN"] = "boolean";
    MeasurementUnit["CUSTOM"] = "custom";
})(MeasurementUnit || (exports.MeasurementUnit = MeasurementUnit = {}));
/**
 * Goal alignment type
 */
var AlignmentType;
(function (AlignmentType) {
    AlignmentType["SUPPORTS"] = "supports";
    AlignmentType["CONTRIBUTES_TO"] = "contributes_to";
    AlignmentType["DERIVED_FROM"] = "derived_from";
    AlignmentType["RELATED_TO"] = "related_to";
})(AlignmentType || (exports.AlignmentType = AlignmentType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Goal validation schema
 */
exports.GoalSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().min(10).max(5000),
    ownerId: zod_1.z.string().uuid(),
    goalType: zod_1.z.nativeEnum(GoalType),
    methodology: zod_1.z.nativeEnum(GoalMethodology),
    category: zod_1.z.nativeEnum(GoalCategory),
    priority: zod_1.z.nativeEnum(GoalPriority).default(GoalPriority.MEDIUM),
    status: zod_1.z.nativeEnum(GoalStatus).default(GoalStatus.DRAFT),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    weight: zod_1.z.number().min(0).max(100).default(0),
    progressPercentage: zod_1.z.number().min(0).max(100).default(0),
    parentGoalId: zod_1.z.string().uuid().optional(),
    reviewCycleId: zod_1.z.string().uuid().optional(),
    isStretch: zod_1.z.boolean().default(false),
    isCarriedOver: zod_1.z.boolean().default(false),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
}).refine((data) => data.endDate > data.startDate, { message: 'End date must be after start date' });
/**
 * SMART criteria validation schema
 */
exports.SMARTCriteriaSchema = zod_1.z.object({
    specific: zod_1.z.string().min(10).max(500),
    measurable: zod_1.z.string().min(10).max(500),
    achievable: zod_1.z.string().min(10).max(500),
    relevant: zod_1.z.string().min(10).max(500),
    timeBound: zod_1.z.string().min(10).max(500),
});
/**
 * Key result validation schema
 */
exports.KeyResultSchema = zod_1.z.object({
    goalId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().max(1000).optional(),
    measurementUnit: zod_1.z.nativeEnum(MeasurementUnit),
    startValue: zod_1.z.number(),
    targetValue: zod_1.z.number(),
    currentValue: zod_1.z.number(),
    weight: zod_1.z.number().min(0).max(100).default(0),
    dueDate: zod_1.z.coerce.date().optional(),
});
/**
 * Milestone validation schema
 */
exports.MilestoneSchema = zod_1.z.object({
    goalId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().max(1000).optional(),
    dueDate: zod_1.z.coerce.date(),
    order: zod_1.z.number().int().min(0),
});
/**
 * Goal check-in validation schema
 */
exports.GoalCheckInSchema = zod_1.z.object({
    goalId: zod_1.z.string().uuid(),
    submittedBy: zod_1.z.string().uuid(),
    checkInDate: zod_1.z.coerce.date(),
    progressPercentage: zod_1.z.number().min(0).max(100),
    status: zod_1.z.nativeEnum(GoalStatus),
    accomplishments: zod_1.z.string().max(2000).optional(),
    challenges: zod_1.z.string().max(2000).optional(),
    nextSteps: zod_1.z.string().max(2000).optional(),
    supportNeeded: zod_1.z.string().max(2000).optional(),
    confidenceLevel: zod_1.z.number().min(1).max(5).optional(),
});
/**
 * Goal alignment validation schema
 */
exports.GoalAlignmentSchema = zod_1.z.object({
    sourceGoalId: zod_1.z.string().uuid(),
    targetGoalId: zod_1.z.string().uuid(),
    alignmentType: zod_1.z.nativeEnum(AlignmentType),
    description: zod_1.z.string().max(500).optional(),
}).refine((data) => data.sourceGoalId !== data.targetGoalId, { message: 'Source and target goals must be different' });
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Goal Plan Model
 */
let GoalPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goal_plans',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['plan_year'] },
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
    let _planYear_decorators;
    let _planYear_initializers = [];
    let _planYear_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _midYearReviewDate_decorators;
    let _midYearReviewDate_initializers = [];
    let _midYearReviewDate_extraInitializers = [];
    let _yearEndReviewDate_decorators;
    let _yearEndReviewDate_initializers = [];
    let _yearEndReviewDate_extraInitializers = [];
    let _goals_decorators;
    let _goals_initializers = [];
    let _goals_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var GoalPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.planYear = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _planYear_initializers, void 0));
            this.startDate = (__runInitializers(this, _planYear_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.status = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.description = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.midYearReviewDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _midYearReviewDate_initializers, void 0));
            this.yearEndReviewDate = (__runInitializers(this, _midYearReviewDate_extraInitializers), __runInitializers(this, _yearEndReviewDate_initializers, void 0));
            this.goals = (__runInitializers(this, _yearEndReviewDate_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
            this.createdAt = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoalPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Length)({ min: 1, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
                comment: 'Plan name (e.g., "2024 Goal Plan")',
            })];
        _planYear_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'plan_year',
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
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('planning', 'active', 'mid_year_review', 'year_end_review', 'closed'),
                allowNull: false,
                defaultValue: 'planning',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _midYearReviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'mid_year_review_date',
            })];
        _yearEndReviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'year_end_review_date',
            })];
        _goals_decorators = [(0, sequelize_typescript_1.HasMany)(() => GoalModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _planYear_decorators, { kind: "field", name: "planYear", static: false, private: false, access: { has: obj => "planYear" in obj, get: obj => obj.planYear, set: (obj, value) => { obj.planYear = value; } }, metadata: _metadata }, _planYear_initializers, _planYear_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _midYearReviewDate_decorators, { kind: "field", name: "midYearReviewDate", static: false, private: false, access: { has: obj => "midYearReviewDate" in obj, get: obj => obj.midYearReviewDate, set: (obj, value) => { obj.midYearReviewDate = value; } }, metadata: _metadata }, _midYearReviewDate_initializers, _midYearReviewDate_extraInitializers);
        __esDecorate(null, null, _yearEndReviewDate_decorators, { kind: "field", name: "yearEndReviewDate", static: false, private: false, access: { has: obj => "yearEndReviewDate" in obj, get: obj => obj.yearEndReviewDate, set: (obj, value) => { obj.yearEndReviewDate = value; } }, metadata: _metadata }, _yearEndReviewDate_initializers, _yearEndReviewDate_extraInitializers);
        __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: obj => "goals" in obj, get: obj => obj.goals, set: (obj, value) => { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalPlanModel = _classThis;
})();
exports.GoalPlanModel = GoalPlanModel;
/**
 * Goal Model
 */
let GoalModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goals',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['owner_id'] },
                { fields: ['goal_type'] },
                { fields: ['status'] },
                { fields: ['category'] },
                { fields: ['priority'] },
                { fields: ['parent_goal_id'] },
                { fields: ['plan_id'] },
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
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _goalType_decorators;
    let _goalType_initializers = [];
    let _goalType_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _achievementScore_decorators;
    let _achievementScore_initializers = [];
    let _achievementScore_extraInitializers = [];
    let _parentGoalId_decorators;
    let _parentGoalId_initializers = [];
    let _parentGoalId_extraInitializers = [];
    let _reviewCycleId_decorators;
    let _reviewCycleId_initializers = [];
    let _reviewCycleId_extraInitializers = [];
    let _isStretch_decorators;
    let _isStretch_initializers = [];
    let _isStretch_extraInitializers = [];
    let _isCarriedOver_decorators;
    let _isCarriedOver_initializers = [];
    let _isCarriedOver_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _smartCriteria_decorators;
    let _smartCriteria_initializers = [];
    let _smartCriteria_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _plan_decorators;
    let _plan_initializers = [];
    let _plan_extraInitializers = [];
    let _parentGoal_decorators;
    let _parentGoal_initializers = [];
    let _parentGoal_extraInitializers = [];
    let _childGoals_decorators;
    let _childGoals_initializers = [];
    let _childGoals_extraInitializers = [];
    let _keyResults_decorators;
    let _keyResults_initializers = [];
    let _keyResults_extraInitializers = [];
    let _milestones_decorators;
    let _milestones_initializers = [];
    let _milestones_extraInitializers = [];
    let _checkIns_decorators;
    let _checkIns_initializers = [];
    let _checkIns_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var GoalModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.planId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
            this.title = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.ownerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.goalType = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _goalType_initializers, void 0));
            this.methodology = (__runInitializers(this, _goalType_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
            this.category = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.weight = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.progressPercentage = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _progressPercentage_initializers, void 0));
            this.achievementScore = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _achievementScore_initializers, void 0));
            this.parentGoalId = (__runInitializers(this, _achievementScore_extraInitializers), __runInitializers(this, _parentGoalId_initializers, void 0));
            this.reviewCycleId = (__runInitializers(this, _parentGoalId_extraInitializers), __runInitializers(this, _reviewCycleId_initializers, void 0));
            this.isStretch = (__runInitializers(this, _reviewCycleId_extraInitializers), __runInitializers(this, _isStretch_initializers, void 0));
            this.isCarriedOver = (__runInitializers(this, _isStretch_extraInitializers), __runInitializers(this, _isCarriedOver_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _isCarriedOver_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.smartCriteria = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _smartCriteria_initializers, void 0));
            this.tags = (__runInitializers(this, _smartCriteria_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.plan = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
            this.parentGoal = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _parentGoal_initializers, void 0));
            this.childGoals = (__runInitializers(this, _parentGoal_extraInitializers), __runInitializers(this, _childGoals_initializers, void 0));
            this.keyResults = (__runInitializers(this, _childGoals_extraInitializers), __runInitializers(this, _keyResults_initializers, void 0));
            this.milestones = (__runInitializers(this, _keyResults_extraInitializers), __runInitializers(this, _milestones_initializers, void 0));
            this.checkIns = (__runInitializers(this, _milestones_extraInitializers), __runInitializers(this, _checkIns_initializers, void 0));
            this.createdAt = (__runInitializers(this, _checkIns_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoalModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _planId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalPlanModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'plan_id',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Length)({ min: 5, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _ownerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'owner_id',
                comment: 'Goal owner (employee or team)',
            })];
        _goalType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalType)),
                allowNull: false,
                field: 'goal_type',
            })];
        _methodology_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalMethodology)),
                allowNull: false,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalCategory)),
                allowNull: false,
            })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalPriority)),
                allowNull: false,
                defaultValue: GoalPriority.MEDIUM,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalStatus)),
                allowNull: false,
                defaultValue: GoalStatus.DRAFT,
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
        _weight_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                comment: 'Goal weight in overall performance (0-100)',
            })];
        _progressPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                field: 'progress_percentage',
                comment: 'Current progress (0-100)',
            })];
        _achievementScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                field: 'achievement_score',
                comment: 'Final achievement score (0-100)',
            })];
        _parentGoalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'parent_goal_id',
                comment: 'Parent goal for cascading',
            })];
        _reviewCycleId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'review_cycle_id',
                comment: 'Linked performance review cycle',
            })];
        _isStretch_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_stretch',
                comment: 'Stretch goal flag',
            })];
        _isCarriedOver_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_carried_over',
                comment: 'Carried over from previous period',
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'approved_by',
            })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'approved_at',
            })];
        _smartCriteria_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                comment: 'SMART criteria for SMART goals',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _plan_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalPlanModel)];
        _parentGoal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel, 'parentGoalId')];
        _childGoals_decorators = [(0, sequelize_typescript_1.HasMany)(() => GoalModel, 'parentGoalId')];
        _keyResults_decorators = [(0, sequelize_typescript_1.HasMany)(() => KeyResultModel)];
        _milestones_decorators = [(0, sequelize_typescript_1.HasMany)(() => MilestoneModel)];
        _checkIns_decorators = [(0, sequelize_typescript_1.HasMany)(() => GoalCheckInModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _goalType_decorators, { kind: "field", name: "goalType", static: false, private: false, access: { has: obj => "goalType" in obj, get: obj => obj.goalType, set: (obj, value) => { obj.goalType = value; } }, metadata: _metadata }, _goalType_initializers, _goalType_extraInitializers);
        __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
        __esDecorate(null, null, _achievementScore_decorators, { kind: "field", name: "achievementScore", static: false, private: false, access: { has: obj => "achievementScore" in obj, get: obj => obj.achievementScore, set: (obj, value) => { obj.achievementScore = value; } }, metadata: _metadata }, _achievementScore_initializers, _achievementScore_extraInitializers);
        __esDecorate(null, null, _parentGoalId_decorators, { kind: "field", name: "parentGoalId", static: false, private: false, access: { has: obj => "parentGoalId" in obj, get: obj => obj.parentGoalId, set: (obj, value) => { obj.parentGoalId = value; } }, metadata: _metadata }, _parentGoalId_initializers, _parentGoalId_extraInitializers);
        __esDecorate(null, null, _reviewCycleId_decorators, { kind: "field", name: "reviewCycleId", static: false, private: false, access: { has: obj => "reviewCycleId" in obj, get: obj => obj.reviewCycleId, set: (obj, value) => { obj.reviewCycleId = value; } }, metadata: _metadata }, _reviewCycleId_initializers, _reviewCycleId_extraInitializers);
        __esDecorate(null, null, _isStretch_decorators, { kind: "field", name: "isStretch", static: false, private: false, access: { has: obj => "isStretch" in obj, get: obj => obj.isStretch, set: (obj, value) => { obj.isStretch = value; } }, metadata: _metadata }, _isStretch_initializers, _isStretch_extraInitializers);
        __esDecorate(null, null, _isCarriedOver_decorators, { kind: "field", name: "isCarriedOver", static: false, private: false, access: { has: obj => "isCarriedOver" in obj, get: obj => obj.isCarriedOver, set: (obj, value) => { obj.isCarriedOver = value; } }, metadata: _metadata }, _isCarriedOver_initializers, _isCarriedOver_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _smartCriteria_decorators, { kind: "field", name: "smartCriteria", static: false, private: false, access: { has: obj => "smartCriteria" in obj, get: obj => obj.smartCriteria, set: (obj, value) => { obj.smartCriteria = value; } }, metadata: _metadata }, _smartCriteria_initializers, _smartCriteria_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: obj => "plan" in obj, get: obj => obj.plan, set: (obj, value) => { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
        __esDecorate(null, null, _parentGoal_decorators, { kind: "field", name: "parentGoal", static: false, private: false, access: { has: obj => "parentGoal" in obj, get: obj => obj.parentGoal, set: (obj, value) => { obj.parentGoal = value; } }, metadata: _metadata }, _parentGoal_initializers, _parentGoal_extraInitializers);
        __esDecorate(null, null, _childGoals_decorators, { kind: "field", name: "childGoals", static: false, private: false, access: { has: obj => "childGoals" in obj, get: obj => obj.childGoals, set: (obj, value) => { obj.childGoals = value; } }, metadata: _metadata }, _childGoals_initializers, _childGoals_extraInitializers);
        __esDecorate(null, null, _keyResults_decorators, { kind: "field", name: "keyResults", static: false, private: false, access: { has: obj => "keyResults" in obj, get: obj => obj.keyResults, set: (obj, value) => { obj.keyResults = value; } }, metadata: _metadata }, _keyResults_initializers, _keyResults_extraInitializers);
        __esDecorate(null, null, _milestones_decorators, { kind: "field", name: "milestones", static: false, private: false, access: { has: obj => "milestones" in obj, get: obj => obj.milestones, set: (obj, value) => { obj.milestones = value; } }, metadata: _metadata }, _milestones_initializers, _milestones_extraInitializers);
        __esDecorate(null, null, _checkIns_decorators, { kind: "field", name: "checkIns", static: false, private: false, access: { has: obj => "checkIns" in obj, get: obj => obj.checkIns, set: (obj, value) => { obj.checkIns = value; } }, metadata: _metadata }, _checkIns_initializers, _checkIns_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalModel = _classThis;
})();
exports.GoalModel = GoalModel;
/**
 * Key Result Model (for OKRs)
 */
let KeyResultModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'key_results',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['goal_id'] },
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
    let _goalId_decorators;
    let _goalId_initializers = [];
    let _goalId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _measurementUnit_decorators;
    let _measurementUnit_initializers = [];
    let _measurementUnit_extraInitializers = [];
    let _startValue_decorators;
    let _startValue_initializers = [];
    let _startValue_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _goal_decorators;
    let _goal_initializers = [];
    let _goal_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var KeyResultModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.goalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _goalId_initializers, void 0));
            this.title = (__runInitializers(this, _goalId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.measurementUnit = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _measurementUnit_initializers, void 0));
            this.startValue = (__runInitializers(this, _measurementUnit_extraInitializers), __runInitializers(this, _startValue_initializers, void 0));
            this.targetValue = (__runInitializers(this, _startValue_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.currentValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
            this.weight = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.status = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.progressPercentage = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progressPercentage_initializers, void 0));
            this.dueDate = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.goal = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _goal_initializers, void 0));
            this.createdAt = (__runInitializers(this, _goal_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KeyResultModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _goalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'goal_id',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Length)({ min: 5, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _measurementUnit_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(MeasurementUnit)),
                allowNull: false,
                field: 'measurement_unit',
            })];
        _startValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                field: 'start_value',
            })];
        _targetValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                field: 'target_value',
            })];
        _currentValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
                field: 'current_value',
            })];
        _weight_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                comment: 'Key result weight (0-100)',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(KeyResultStatus)),
                allowNull: false,
                defaultValue: KeyResultStatus.NOT_STARTED,
            })];
        _progressPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
                field: 'progress_percentage',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'due_date',
            })];
        _goal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _goalId_decorators, { kind: "field", name: "goalId", static: false, private: false, access: { has: obj => "goalId" in obj, get: obj => obj.goalId, set: (obj, value) => { obj.goalId = value; } }, metadata: _metadata }, _goalId_initializers, _goalId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _measurementUnit_decorators, { kind: "field", name: "measurementUnit", static: false, private: false, access: { has: obj => "measurementUnit" in obj, get: obj => obj.measurementUnit, set: (obj, value) => { obj.measurementUnit = value; } }, metadata: _metadata }, _measurementUnit_initializers, _measurementUnit_extraInitializers);
        __esDecorate(null, null, _startValue_decorators, { kind: "field", name: "startValue", static: false, private: false, access: { has: obj => "startValue" in obj, get: obj => obj.startValue, set: (obj, value) => { obj.startValue = value; } }, metadata: _metadata }, _startValue_initializers, _startValue_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _goal_decorators, { kind: "field", name: "goal", static: false, private: false, access: { has: obj => "goal" in obj, get: obj => obj.goal, set: (obj, value) => { obj.goal = value; } }, metadata: _metadata }, _goal_initializers, _goal_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KeyResultModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KeyResultModel = _classThis;
})();
exports.KeyResultModel = KeyResultModel;
/**
 * Milestone Model
 */
let MilestoneModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goal_milestones',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['goal_id'] },
                { fields: ['due_date'] },
                { fields: ['is_completed'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _goalId_decorators;
    let _goalId_initializers = [];
    let _goalId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _isCompleted_decorators;
    let _isCompleted_initializers = [];
    let _isCompleted_extraInitializers = [];
    let _order_decorators;
    let _order_initializers = [];
    let _order_extraInitializers = [];
    let _goal_decorators;
    let _goal_initializers = [];
    let _goal_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var MilestoneModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.goalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _goalId_initializers, void 0));
            this.title = (__runInitializers(this, _goalId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.dueDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.isCompleted = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _isCompleted_initializers, void 0));
            this.order = (__runInitializers(this, _isCompleted_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.goal = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _goal_initializers, void 0));
            this.createdAt = (__runInitializers(this, _goal_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MilestoneModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _goalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'goal_id',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Length)({ min: 5, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'due_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _isCompleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_completed',
            })];
        _order_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Display order',
            })];
        _goal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _goalId_decorators, { kind: "field", name: "goalId", static: false, private: false, access: { has: obj => "goalId" in obj, get: obj => obj.goalId, set: (obj, value) => { obj.goalId = value; } }, metadata: _metadata }, _goalId_initializers, _goalId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _isCompleted_decorators, { kind: "field", name: "isCompleted", static: false, private: false, access: { has: obj => "isCompleted" in obj, get: obj => obj.isCompleted, set: (obj, value) => { obj.isCompleted = value; } }, metadata: _metadata }, _isCompleted_initializers, _isCompleted_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: obj => "order" in obj, get: obj => obj.order, set: (obj, value) => { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _goal_decorators, { kind: "field", name: "goal", static: false, private: false, access: { has: obj => "goal" in obj, get: obj => obj.goal, set: (obj, value) => { obj.goal = value; } }, metadata: _metadata }, _goal_initializers, _goal_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MilestoneModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MilestoneModel = _classThis;
})();
exports.MilestoneModel = MilestoneModel;
/**
 * Goal Check-In Model
 */
let GoalCheckInModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goal_check_ins',
            timestamps: true,
            indexes: [
                { fields: ['goal_id'] },
                { fields: ['submitted_by'] },
                { fields: ['check_in_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _goalId_decorators;
    let _goalId_initializers = [];
    let _goalId_extraInitializers = [];
    let _submittedBy_decorators;
    let _submittedBy_initializers = [];
    let _submittedBy_extraInitializers = [];
    let _checkInDate_decorators;
    let _checkInDate_initializers = [];
    let _checkInDate_extraInitializers = [];
    let _progressPercentage_decorators;
    let _progressPercentage_initializers = [];
    let _progressPercentage_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _accomplishments_decorators;
    let _accomplishments_initializers = [];
    let _accomplishments_extraInitializers = [];
    let _challenges_decorators;
    let _challenges_initializers = [];
    let _challenges_extraInitializers = [];
    let _nextSteps_decorators;
    let _nextSteps_initializers = [];
    let _nextSteps_extraInitializers = [];
    let _supportNeeded_decorators;
    let _supportNeeded_initializers = [];
    let _supportNeeded_extraInitializers = [];
    let _confidenceLevel_decorators;
    let _confidenceLevel_initializers = [];
    let _confidenceLevel_extraInitializers = [];
    let _goal_decorators;
    let _goal_initializers = [];
    let _goal_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GoalCheckInModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.goalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _goalId_initializers, void 0));
            this.submittedBy = (__runInitializers(this, _goalId_extraInitializers), __runInitializers(this, _submittedBy_initializers, void 0));
            this.checkInDate = (__runInitializers(this, _submittedBy_extraInitializers), __runInitializers(this, _checkInDate_initializers, void 0));
            this.progressPercentage = (__runInitializers(this, _checkInDate_extraInitializers), __runInitializers(this, _progressPercentage_initializers, void 0));
            this.status = (__runInitializers(this, _progressPercentage_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.accomplishments = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _accomplishments_initializers, void 0));
            this.challenges = (__runInitializers(this, _accomplishments_extraInitializers), __runInitializers(this, _challenges_initializers, void 0));
            this.nextSteps = (__runInitializers(this, _challenges_extraInitializers), __runInitializers(this, _nextSteps_initializers, void 0));
            this.supportNeeded = (__runInitializers(this, _nextSteps_extraInitializers), __runInitializers(this, _supportNeeded_initializers, void 0));
            this.confidenceLevel = (__runInitializers(this, _supportNeeded_extraInitializers), __runInitializers(this, _confidenceLevel_initializers, void 0));
            this.goal = (__runInitializers(this, _confidenceLevel_extraInitializers), __runInitializers(this, _goal_initializers, void 0));
            this.createdAt = (__runInitializers(this, _goal_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoalCheckInModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _goalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'goal_id',
            })];
        _submittedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'submitted_by',
            })];
        _checkInDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'check_in_date',
            })];
        _progressPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                field: 'progress_percentage',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalStatus)),
                allowNull: false,
            })];
        _accomplishments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _challenges_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _nextSteps_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'next_steps',
            })];
        _supportNeeded_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'support_needed',
            })];
        _confidenceLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'confidence_level',
                comment: 'Confidence level 1-5',
            })];
        _goal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _goalId_decorators, { kind: "field", name: "goalId", static: false, private: false, access: { has: obj => "goalId" in obj, get: obj => obj.goalId, set: (obj, value) => { obj.goalId = value; } }, metadata: _metadata }, _goalId_initializers, _goalId_extraInitializers);
        __esDecorate(null, null, _submittedBy_decorators, { kind: "field", name: "submittedBy", static: false, private: false, access: { has: obj => "submittedBy" in obj, get: obj => obj.submittedBy, set: (obj, value) => { obj.submittedBy = value; } }, metadata: _metadata }, _submittedBy_initializers, _submittedBy_extraInitializers);
        __esDecorate(null, null, _checkInDate_decorators, { kind: "field", name: "checkInDate", static: false, private: false, access: { has: obj => "checkInDate" in obj, get: obj => obj.checkInDate, set: (obj, value) => { obj.checkInDate = value; } }, metadata: _metadata }, _checkInDate_initializers, _checkInDate_extraInitializers);
        __esDecorate(null, null, _progressPercentage_decorators, { kind: "field", name: "progressPercentage", static: false, private: false, access: { has: obj => "progressPercentage" in obj, get: obj => obj.progressPercentage, set: (obj, value) => { obj.progressPercentage = value; } }, metadata: _metadata }, _progressPercentage_initializers, _progressPercentage_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _accomplishments_decorators, { kind: "field", name: "accomplishments", static: false, private: false, access: { has: obj => "accomplishments" in obj, get: obj => obj.accomplishments, set: (obj, value) => { obj.accomplishments = value; } }, metadata: _metadata }, _accomplishments_initializers, _accomplishments_extraInitializers);
        __esDecorate(null, null, _challenges_decorators, { kind: "field", name: "challenges", static: false, private: false, access: { has: obj => "challenges" in obj, get: obj => obj.challenges, set: (obj, value) => { obj.challenges = value; } }, metadata: _metadata }, _challenges_initializers, _challenges_extraInitializers);
        __esDecorate(null, null, _nextSteps_decorators, { kind: "field", name: "nextSteps", static: false, private: false, access: { has: obj => "nextSteps" in obj, get: obj => obj.nextSteps, set: (obj, value) => { obj.nextSteps = value; } }, metadata: _metadata }, _nextSteps_initializers, _nextSteps_extraInitializers);
        __esDecorate(null, null, _supportNeeded_decorators, { kind: "field", name: "supportNeeded", static: false, private: false, access: { has: obj => "supportNeeded" in obj, get: obj => obj.supportNeeded, set: (obj, value) => { obj.supportNeeded = value; } }, metadata: _metadata }, _supportNeeded_initializers, _supportNeeded_extraInitializers);
        __esDecorate(null, null, _confidenceLevel_decorators, { kind: "field", name: "confidenceLevel", static: false, private: false, access: { has: obj => "confidenceLevel" in obj, get: obj => obj.confidenceLevel, set: (obj, value) => { obj.confidenceLevel = value; } }, metadata: _metadata }, _confidenceLevel_initializers, _confidenceLevel_extraInitializers);
        __esDecorate(null, null, _goal_decorators, { kind: "field", name: "goal", static: false, private: false, access: { has: obj => "goal" in obj, get: obj => obj.goal, set: (obj, value) => { obj.goal = value; } }, metadata: _metadata }, _goal_initializers, _goal_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalCheckInModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalCheckInModel = _classThis;
})();
exports.GoalCheckInModel = GoalCheckInModel;
/**
 * Goal Alignment Model
 */
let GoalAlignmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goal_alignments',
            timestamps: true,
            indexes: [
                { fields: ['source_goal_id'] },
                { fields: ['target_goal_id'] },
                { fields: ['alignment_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sourceGoalId_decorators;
    let _sourceGoalId_initializers = [];
    let _sourceGoalId_extraInitializers = [];
    let _targetGoalId_decorators;
    let _targetGoalId_initializers = [];
    let _targetGoalId_extraInitializers = [];
    let _alignmentType_decorators;
    let _alignmentType_initializers = [];
    let _alignmentType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _sourceGoal_decorators;
    let _sourceGoal_initializers = [];
    let _sourceGoal_extraInitializers = [];
    let _targetGoal_decorators;
    let _targetGoal_initializers = [];
    let _targetGoal_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GoalAlignmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sourceGoalId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sourceGoalId_initializers, void 0));
            this.targetGoalId = (__runInitializers(this, _sourceGoalId_extraInitializers), __runInitializers(this, _targetGoalId_initializers, void 0));
            this.alignmentType = (__runInitializers(this, _targetGoalId_extraInitializers), __runInitializers(this, _alignmentType_initializers, void 0));
            this.description = (__runInitializers(this, _alignmentType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.sourceGoal = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _sourceGoal_initializers, void 0));
            this.targetGoal = (__runInitializers(this, _sourceGoal_extraInitializers), __runInitializers(this, _targetGoal_initializers, void 0));
            this.createdAt = (__runInitializers(this, _targetGoal_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoalAlignmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _sourceGoalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'source_goal_id',
            })];
        _targetGoalId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => GoalModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'target_goal_id',
            })];
        _alignmentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlignmentType)),
                allowNull: false,
                field: 'alignment_type',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _sourceGoal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel, 'sourceGoalId')];
        _targetGoal_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GoalModel, 'targetGoalId')];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sourceGoalId_decorators, { kind: "field", name: "sourceGoalId", static: false, private: false, access: { has: obj => "sourceGoalId" in obj, get: obj => obj.sourceGoalId, set: (obj, value) => { obj.sourceGoalId = value; } }, metadata: _metadata }, _sourceGoalId_initializers, _sourceGoalId_extraInitializers);
        __esDecorate(null, null, _targetGoalId_decorators, { kind: "field", name: "targetGoalId", static: false, private: false, access: { has: obj => "targetGoalId" in obj, get: obj => obj.targetGoalId, set: (obj, value) => { obj.targetGoalId = value; } }, metadata: _metadata }, _targetGoalId_initializers, _targetGoalId_extraInitializers);
        __esDecorate(null, null, _alignmentType_decorators, { kind: "field", name: "alignmentType", static: false, private: false, access: { has: obj => "alignmentType" in obj, get: obj => obj.alignmentType, set: (obj, value) => { obj.alignmentType = value; } }, metadata: _metadata }, _alignmentType_initializers, _alignmentType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _sourceGoal_decorators, { kind: "field", name: "sourceGoal", static: false, private: false, access: { has: obj => "sourceGoal" in obj, get: obj => obj.sourceGoal, set: (obj, value) => { obj.sourceGoal = value; } }, metadata: _metadata }, _sourceGoal_initializers, _sourceGoal_extraInitializers);
        __esDecorate(null, null, _targetGoal_decorators, { kind: "field", name: "targetGoal", static: false, private: false, access: { has: obj => "targetGoal" in obj, get: obj => obj.targetGoal, set: (obj, value) => { obj.targetGoal = value; } }, metadata: _metadata }, _targetGoal_initializers, _targetGoal_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalAlignmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalAlignmentModel = _classThis;
})();
exports.GoalAlignmentModel = GoalAlignmentModel;
/**
 * Goal Template Model
 */
let GoalTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'goal_templates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['category'] },
                { fields: ['methodology'] },
                { fields: ['is_public'] },
                { fields: ['usage_count'] },
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
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _templateData_decorators;
    let _templateData_initializers = [];
    let _templateData_extraInitializers = [];
    let _isPublic_decorators;
    let _isPublic_initializers = [];
    let _isPublic_extraInitializers = [];
    let _usageCount_decorators;
    let _usageCount_initializers = [];
    let _usageCount_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var GoalTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.methodology = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
            this.templateData = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _templateData_initializers, void 0));
            this.isPublic = (__runInitializers(this, _templateData_extraInitializers), __runInitializers(this, _isPublic_initializers, void 0));
            this.usageCount = (__runInitializers(this, _isPublic_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.createdBy = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GoalTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                primaryKey: true,
            })];
        _name_decorators = [(0, sequelize_typescript_1.Length)({ min: 1, max: 200 }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalCategory)),
                allowNull: false,
            })];
        _methodology_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GoalMethodology)),
                allowNull: false,
            })];
        _templateData_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'template_data',
            })];
        _isPublic_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_public',
            })];
        _usageCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
                field: 'usage_count',
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'created_by',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
        __esDecorate(null, null, _templateData_decorators, { kind: "field", name: "templateData", static: false, private: false, access: { has: obj => "templateData" in obj, get: obj => obj.templateData, set: (obj, value) => { obj.templateData = value; } }, metadata: _metadata }, _templateData_initializers, _templateData_extraInitializers);
        __esDecorate(null, null, _isPublic_decorators, { kind: "field", name: "isPublic", static: false, private: false, access: { has: obj => "isPublic" in obj, get: obj => obj.isPublic, set: (obj, value) => { obj.isPublic = value; } }, metadata: _metadata }, _isPublic_initializers, _isPublic_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalTemplateModel = _classThis;
})();
exports.GoalTemplateModel = GoalTemplateModel;
// ============================================================================
// CORE GOAL MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create goal plan
 *
 * @param planData - Goal plan data
 * @param transaction - Optional transaction
 * @returns Created goal plan
 *
 * @example
 * ```typescript
 * const plan = await createGoalPlan({
 *   name: '2024 Goal Plan',
 *   planYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
async function createGoalPlan(planData, transaction) {
    if (planData.endDate <= planData.startDate) {
        throw new common_1.BadRequestException('End date must be after start date');
    }
    const plan = await GoalPlanModel.create(planData, { transaction });
    return plan;
}
/**
 * Create goal
 *
 * @param goalData - Goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoal({
 *   title: 'Increase patient satisfaction',
 *   description: 'Improve patient satisfaction scores by 15%',
 *   ownerId: 'emp-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 *   methodology: GoalMethodology.SMART,
 *   category: GoalCategory.QUALITY,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   weight: 30,
 * });
 * ```
 */
async function createGoal(goalData, transaction) {
    const validated = exports.GoalSchema.parse(goalData);
    const goal = await GoalModel.create(validated, { transaction });
    return goal;
}
/**
 * Update goal
 *
 * @param goalId - Goal ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateGoal('goal-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   progressPercentage: 25,
 * });
 * ```
 */
async function updateGoal(goalId, updates, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    await goal.update(updates, { transaction });
    return goal;
}
/**
 * Get goal by ID
 *
 * @param goalId - Goal ID
 * @param includeRelations - Include related data
 * @returns Goal or null
 *
 * @example
 * ```typescript
 * const goal = await getGoalById('goal-uuid', true);
 * ```
 */
async function getGoalById(goalId, includeRelations = false) {
    const options = {
        where: { id: goalId },
    };
    if (includeRelations) {
        options.include = [
            { model: GoalPlanModel, as: 'plan' },
            { model: GoalModel, as: 'parentGoal' },
            { model: GoalModel, as: 'childGoals' },
            { model: KeyResultModel, as: 'keyResults' },
            { model: MilestoneModel, as: 'milestones' },
            { model: GoalCheckInModel, as: 'checkIns' },
        ];
    }
    return GoalModel.findOne(options);
}
/**
 * Get employee goals
 *
 * @param ownerId - Owner ID
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const goals = await getEmployeeGoals('emp-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   category: GoalCategory.QUALITY,
 * });
 * ```
 */
async function getEmployeeGoals(ownerId, filters) {
    const where = { ownerId };
    if (filters?.planId)
        where.planId = filters.planId;
    if (filters?.status)
        where.status = filters.status;
    if (filters?.goalType)
        where.goalType = filters.goalType;
    if (filters?.category)
        where.category = filters.category;
    if (filters?.priority)
        where.priority = filters.priority;
    if (filters?.startDate || filters?.endDate) {
        where.startDate = {};
        if (filters.startDate) {
            where.startDate[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.startDate[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    return GoalModel.findAll({
        where,
        limit: filters?.limit || 100,
        offset: filters?.offset || 0,
        order: [['priority', 'ASC'], ['endDate', 'ASC']],
        include: [
            { model: GoalPlanModel, as: 'plan' },
            { model: KeyResultModel, as: 'keyResults' },
            { model: MilestoneModel, as: 'milestones' },
        ],
    });
}
/**
 * Approve goal
 *
 * @param goalId - Goal ID
 * @param approvedBy - User approving
 * @param transaction - Optional transaction
 * @returns Approved goal
 *
 * @example
 * ```typescript
 * await approveGoal('goal-uuid', 'manager-uuid');
 * ```
 */
async function approveGoal(goalId, approvedBy, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    if (goal.status !== GoalStatus.SUBMITTED) {
        throw new common_1.BadRequestException('Only submitted goals can be approved');
    }
    await goal.update({
        status: GoalStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
    }, { transaction });
    return goal;
}
/**
 * Activate goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Activated goal
 *
 * @example
 * ```typescript
 * await activateGoal('goal-uuid');
 * ```
 */
async function activateGoal(goalId, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    if (goal.status !== GoalStatus.APPROVED && goal.status !== GoalStatus.DRAFT) {
        throw new common_1.BadRequestException('Goal must be approved or draft to activate');
    }
    await goal.update({
        status: GoalStatus.ACTIVE,
    }, { transaction });
    return goal;
}
/**
 * Delete goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoal('goal-uuid');
 * ```
 */
async function deleteGoal(goalId, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    await goal.destroy({ transaction });
}
/**
 * Create SMART goal
 *
 * @param goalData - Goal data
 * @param smartCriteria - SMART criteria
 * @param transaction - Optional transaction
 * @returns Created SMART goal
 *
 * @example
 * ```typescript
 * const goal = await createSMARTGoal(
 *   { title: '...', ... },
 *   {
 *     specific: 'Increase patient satisfaction scores',
 *     measurable: 'From 75% to 90%',
 *     achievable: 'With improved training',
 *     relevant: 'Aligns with hospital quality goals',
 *     timeBound: 'By December 31, 2024',
 *   }
 * );
 * ```
 */
async function createSMARTGoal(goalData, smartCriteria, transaction) {
    // Validate SMART criteria
    exports.SMARTCriteriaSchema.parse(smartCriteria);
    // Ensure methodology is SMART
    goalData.methodology = GoalMethodology.SMART;
    const validated = exports.GoalSchema.parse(goalData);
    const goal = await GoalModel.create({
        ...validated,
        smartCriteria,
    }, { transaction });
    return goal;
}
// ============================================================================
// KEY RESULT FUNCTIONS (OKR)
// ============================================================================
/**
 * Add key result to goal
 *
 * @param keyResultData - Key result data
 * @param transaction - Optional transaction
 * @returns Created key result
 *
 * @example
 * ```typescript
 * const kr = await addKeyResult({
 *   goalId: 'goal-uuid',
 *   title: 'Increase NPS score',
 *   measurementUnit: MeasurementUnit.NUMBER,
 *   startValue: 65,
 *   targetValue: 85,
 *   currentValue: 65,
 *   weight: 40,
 * });
 * ```
 */
async function addKeyResult(keyResultData, transaction) {
    const validated = exports.KeyResultSchema.parse(keyResultData);
    const keyResult = await KeyResultModel.create(validated, { transaction });
    return keyResult;
}
/**
 * Update key result
 *
 * @param keyResultId - Key result ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated key result
 *
 * @example
 * ```typescript
 * await updateKeyResult('kr-uuid', {
 *   currentValue: 75,
 *   status: KeyResultStatus.ON_TRACK,
 * });
 * ```
 */
async function updateKeyResult(keyResultId, updates, transaction) {
    const keyResult = await KeyResultModel.findByPk(keyResultId, { transaction });
    if (!keyResult) {
        throw new common_1.NotFoundException(`Key result ${keyResultId} not found`);
    }
    await keyResult.update(updates, { transaction });
    return keyResult;
}
/**
 * Update key result progress
 *
 * @param keyResultId - Key result ID
 * @param currentValue - Current value
 * @param transaction - Optional transaction
 * @returns Updated key result with calculated progress
 *
 * @example
 * ```typescript
 * await updateKeyResultProgress('kr-uuid', 75);
 * ```
 */
async function updateKeyResultProgress(keyResultId, currentValue, transaction) {
    const keyResult = await KeyResultModel.findByPk(keyResultId, { transaction });
    if (!keyResult) {
        throw new common_1.NotFoundException(`Key result ${keyResultId} not found`);
    }
    // Calculate progress percentage
    const range = keyResult.targetValue - keyResult.startValue;
    const progress = range !== 0
        ? ((currentValue - keyResult.startValue) / range) * 100
        : 0;
    const progressPercentage = Math.max(0, Math.min(100, progress));
    // Determine status based on progress
    let status = KeyResultStatus.NOT_STARTED;
    if (progressPercentage >= 100) {
        status = KeyResultStatus.ACHIEVED;
    }
    else if (progressPercentage >= 70) {
        status = KeyResultStatus.ON_TRACK;
    }
    else if (progressPercentage >= 40) {
        status = KeyResultStatus.AT_RISK;
    }
    else if (progressPercentage > 0) {
        status = KeyResultStatus.OFF_TRACK;
    }
    await keyResult.update({
        currentValue,
        progressPercentage,
        status,
    }, { transaction });
    return keyResult;
}
/**
 * Get key results for goal
 *
 * @param goalId - Goal ID
 * @returns Array of key results
 *
 * @example
 * ```typescript
 * const keyResults = await getKeyResults('goal-uuid');
 * ```
 */
async function getKeyResults(goalId) {
    return KeyResultModel.findAll({
        where: { goalId },
        order: [['weight', 'DESC']],
    });
}
/**
 * Calculate goal progress from key results
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromKeyResults('goal-uuid');
 * ```
 */
async function calculateGoalProgressFromKeyResults(goalId, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    const keyResults = await KeyResultModel.findAll({
        where: { goalId },
        transaction,
    });
    if (keyResults.length === 0) {
        return goal;
    }
    let totalWeightedProgress = 0;
    let totalWeight = 0;
    keyResults.forEach((kr) => {
        if (kr.weight > 0) {
            totalWeightedProgress += kr.progressPercentage * kr.weight;
            totalWeight += kr.weight;
        }
    });
    const progressPercentage = totalWeight > 0 ? totalWeightedProgress / totalWeight : 0;
    await goal.update({ progressPercentage }, { transaction });
    return goal;
}
// ============================================================================
// MILESTONE FUNCTIONS
// ============================================================================
/**
 * Add milestone to goal
 *
 * @param milestoneData - Milestone data
 * @param transaction - Optional transaction
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await addMilestone({
 *   goalId: 'goal-uuid',
 *   title: 'Complete training program',
 *   dueDate: new Date('2024-03-31'),
 *   order: 1,
 * });
 * ```
 */
async function addMilestone(milestoneData, transaction) {
    const validated = exports.MilestoneSchema.parse(milestoneData);
    const milestone = await MilestoneModel.create(validated, { transaction });
    return milestone;
}
/**
 * Complete milestone
 *
 * @param milestoneId - Milestone ID
 * @param transaction - Optional transaction
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('milestone-uuid');
 * ```
 */
async function completeMilestone(milestoneId, transaction) {
    const milestone = await MilestoneModel.findByPk(milestoneId, { transaction });
    if (!milestone) {
        throw new common_1.NotFoundException(`Milestone ${milestoneId} not found`);
    }
    await milestone.update({
        isCompleted: true,
        completedDate: new Date(),
    }, { transaction });
    return milestone;
}
/**
 * Get milestones for goal
 *
 * @param goalId - Goal ID
 * @returns Array of milestones
 *
 * @example
 * ```typescript
 * const milestones = await getMilestones('goal-uuid');
 * ```
 */
async function getMilestones(goalId) {
    return MilestoneModel.findAll({
        where: { goalId },
        order: [['order', 'ASC']],
    });
}
/**
 * Calculate goal progress from milestones
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromMilestones('goal-uuid');
 * ```
 */
async function calculateGoalProgressFromMilestones(goalId, transaction) {
    const goal = await GoalModel.findByPk(goalId, { transaction });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    const milestones = await MilestoneModel.findAll({
        where: { goalId },
        transaction,
    });
    if (milestones.length === 0) {
        return goal;
    }
    const completedCount = milestones.filter((m) => m.isCompleted).length;
    const progressPercentage = (completedCount / milestones.length) * 100;
    await goal.update({ progressPercentage }, { transaction });
    return goal;
}
// ============================================================================
// GOAL CHECK-IN FUNCTIONS
// ============================================================================
/**
 * Create goal check-in
 *
 * @param checkInData - Check-in data
 * @param transaction - Optional transaction
 * @returns Created check-in
 *
 * @example
 * ```typescript
 * const checkIn = await createGoalCheckIn({
 *   goalId: 'goal-uuid',
 *   submittedBy: 'emp-uuid',
 *   checkInDate: new Date(),
 *   progressPercentage: 40,
 *   status: GoalStatus.IN_PROGRESS,
 *   accomplishments: 'Completed phase 1...',
 *   challenges: 'Resource constraints...',
 * });
 * ```
 */
async function createGoalCheckIn(checkInData, transaction) {
    const validated = exports.GoalCheckInSchema.parse(checkInData);
    const checkIn = await GoalCheckInModel.create(validated, { transaction });
    // Update goal progress
    await updateGoal(checkInData.goalId, {
        progressPercentage: checkInData.progressPercentage,
        status: checkInData.status,
    }, transaction);
    return checkIn;
}
/**
 * Get check-ins for goal
 *
 * @param goalId - Goal ID
 * @param limit - Optional limit
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const checkIns = await getGoalCheckIns('goal-uuid', 10);
 * ```
 */
async function getGoalCheckIns(goalId, limit) {
    return GoalCheckInModel.findAll({
        where: { goalId },
        limit: limit || 100,
        order: [['checkInDate', 'DESC']],
    });
}
/**
 * Get latest check-in for goal
 *
 * @param goalId - Goal ID
 * @returns Latest check-in or null
 *
 * @example
 * ```typescript
 * const latestCheckIn = await getLatestCheckIn('goal-uuid');
 * ```
 */
async function getLatestCheckIn(goalId) {
    return GoalCheckInModel.findOne({
        where: { goalId },
        order: [['checkInDate', 'DESC']],
    });
}
/**
 * Get check-in history for employee
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const history = await getCheckInHistory('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
async function getCheckInHistory(employeeId, startDate, endDate) {
    const goals = await GoalModel.findAll({
        where: { ownerId: employeeId },
        attributes: ['id'],
    });
    const goalIds = goals.map((g) => g.id);
    return GoalCheckInModel.findAll({
        where: {
            goalId: { [sequelize_1.Op.in]: goalIds },
            checkInDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['checkInDate', 'DESC']],
        include: [{ model: GoalModel, as: 'goal' }],
    });
}
// ============================================================================
// GOAL ALIGNMENT FUNCTIONS
// ============================================================================
/**
 * Create goal alignment
 *
 * @param alignmentData - Alignment data
 * @param transaction - Optional transaction
 * @returns Created alignment
 *
 * @example
 * ```typescript
 * const alignment = await createGoalAlignment({
 *   sourceGoalId: 'individual-goal-uuid',
 *   targetGoalId: 'team-goal-uuid',
 *   alignmentType: AlignmentType.SUPPORTS,
 *   description: 'Individual goal supports team objective',
 * });
 * ```
 */
async function createGoalAlignment(alignmentData, transaction) {
    const validated = exports.GoalAlignmentSchema.parse(alignmentData);
    // Check if alignment already exists
    const existing = await GoalAlignmentModel.findOne({
        where: {
            sourceGoalId: validated.sourceGoalId,
            targetGoalId: validated.targetGoalId,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Goal alignment already exists');
    }
    const alignment = await GoalAlignmentModel.create(validated, { transaction });
    return alignment;
}
/**
 * Get goal alignments
 *
 * @param goalId - Goal ID
 * @param direction - 'source' or 'target'
 * @returns Array of alignments
 *
 * @example
 * ```typescript
 * const alignments = await getGoalAlignments('goal-uuid', 'source');
 * ```
 */
async function getGoalAlignments(goalId, direction = 'source') {
    const where = direction === 'source'
        ? { sourceGoalId: goalId }
        : { targetGoalId: goalId };
    return GoalAlignmentModel.findAll({
        where,
        include: [
            { model: GoalModel, as: 'sourceGoal' },
            { model: GoalModel, as: 'targetGoal' },
        ],
    });
}
/**
 * Get goal alignment hierarchy
 *
 * @param goalId - Root goal ID
 * @returns Hierarchical alignment structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalAlignmentHierarchy('org-goal-uuid');
 * ```
 */
async function getGoalAlignmentHierarchy(goalId) {
    const goal = await GoalModel.findByPk(goalId);
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${goalId} not found`);
    }
    const alignments = await GoalAlignmentModel.findAll({
        where: { targetGoalId: goalId },
        include: [{ model: GoalModel, as: 'sourceGoal' }],
    });
    const alignedGoals = alignments.map((alignment) => ({
        goal: alignment.sourceGoal,
        alignmentType: alignment.alignmentType,
    }));
    return { goal, alignedGoals };
}
/**
 * Delete goal alignment
 *
 * @param alignmentId - Alignment ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoalAlignment('alignment-uuid');
 * ```
 */
async function deleteGoalAlignment(alignmentId, transaction) {
    const alignment = await GoalAlignmentModel.findByPk(alignmentId, { transaction });
    if (!alignment) {
        throw new common_1.NotFoundException(`Goal alignment ${alignmentId} not found`);
    }
    await alignment.destroy({ transaction });
}
// ============================================================================
// GOAL CASCADING FUNCTIONS
// ============================================================================
/**
 * Cascade goal to child level
 *
 * @param parentGoalId - Parent goal ID
 * @param childGoalData - Child goal data
 * @param transaction - Optional transaction
 * @returns Created child goal
 *
 * @example
 * ```typescript
 * const childGoal = await cascadeGoal('parent-goal-uuid', {
 *   title: 'Support organizational goal',
 *   ownerId: 'team-lead-uuid',
 *   ...
 * });
 * ```
 */
async function cascadeGoal(parentGoalId, childGoalData, transaction) {
    const parentGoal = await GoalModel.findByPk(parentGoalId, { transaction });
    if (!parentGoal) {
        throw new common_1.NotFoundException(`Parent goal ${parentGoalId} not found`);
    }
    // Set parent reference
    childGoalData.parentGoalId = parentGoalId;
    // Inherit some properties from parent if not specified
    if (!childGoalData.planId)
        childGoalData.planId = parentGoal.planId;
    if (!childGoalData.category)
        childGoalData.category = parentGoal.category;
    if (!childGoalData.startDate)
        childGoalData.startDate = parentGoal.startDate;
    if (!childGoalData.endDate)
        childGoalData.endDate = parentGoal.endDate;
    const childGoal = await createGoal(childGoalData, transaction);
    // Create alignment
    await createGoalAlignment({
        sourceGoalId: childGoal.id,
        targetGoalId: parentGoalId,
        alignmentType: AlignmentType.DERIVED_FROM,
        description: 'Cascaded from parent goal',
    }, transaction);
    return childGoal;
}
/**
 * Get child goals
 *
 * @param parentGoalId - Parent goal ID
 * @returns Array of child goals
 *
 * @example
 * ```typescript
 * const children = await getChildGoals('parent-goal-uuid');
 * ```
 */
async function getChildGoals(parentGoalId) {
    return GoalModel.findAll({
        where: { parentGoalId },
        order: [['priority', 'ASC']],
    });
}
/**
 * Get goal hierarchy
 *
 * @param rootGoalId - Root goal ID
 * @returns Hierarchical goal structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalHierarchy('root-goal-uuid');
 * ```
 */
async function getGoalHierarchy(rootGoalId) {
    const goal = await GoalModel.findByPk(rootGoalId, {
        include: [
            {
                model: GoalModel,
                as: 'childGoals',
                include: [
                    {
                        model: GoalModel,
                        as: 'childGoals',
                    },
                ],
            },
        ],
    });
    if (!goal) {
        throw new common_1.NotFoundException(`Goal ${rootGoalId} not found`);
    }
    return goal;
}
// ============================================================================
// GOAL TEMPLATE FUNCTIONS
// ============================================================================
/**
 * Create goal template
 *
 * @param templateData - Template data
 * @param createdBy - User creating template
 * @param transaction - Optional transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createGoalTemplate({
 *   name: 'Customer Satisfaction Template',
 *   category: GoalCategory.CUSTOMER,
 *   methodology: GoalMethodology.OKR,
 *   templateData: { ... },
 * }, 'user-uuid');
 * ```
 */
async function createGoalTemplate(templateData, transaction) {
    const template = await GoalTemplateModel.create(templateData, { transaction });
    return template;
}
/**
 * Get goal templates
 *
 * @param filters - Optional filters
 * @returns Array of templates
 *
 * @example
 * ```typescript
 * const templates = await getGoalTemplates({
 *   category: GoalCategory.QUALITY,
 *   isPublic: true,
 * });
 * ```
 */
async function getGoalTemplates(filters) {
    const where = {};
    if (filters?.category)
        where.category = filters.category;
    if (filters?.methodology)
        where.methodology = filters.methodology;
    if (filters?.isPublic !== undefined)
        where.isPublic = filters.isPublic;
    return GoalTemplateModel.findAll({
        where,
        order: [['usageCount', 'DESC'], ['name', 'ASC']],
    });
}
/**
 * Create goal from template
 *
 * @param templateId - Template ID
 * @param goalData - Additional goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoalFromTemplate('template-uuid', {
 *   ownerId: 'emp-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
async function createGoalFromTemplate(templateId, goalData, transaction) {
    const template = await GoalTemplateModel.findByPk(templateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Goal template ${templateId} not found`);
    }
    // Merge template data with provided goal data
    const mergedData = {
        ...goalData,
        title: goalData.title || template.templateData.titleTemplate || '',
        description: goalData.description || template.templateData.descriptionTemplate || '',
        category: goalData.category || template.category,
        methodology: goalData.methodology || template.methodology,
        weight: goalData.weight || template.templateData.suggestedWeight || 0,
    };
    const goal = await createGoal(mergedData, transaction);
    // Create key results from template
    if (template.templateData.keyResultsTemplate) {
        for (const krTemplate of template.templateData.keyResultsTemplate) {
            await addKeyResult({
                goalId: goal.id,
                title: krTemplate.title,
                measurementUnit: krTemplate.measurementUnit,
                startValue: 0,
                targetValue: 100,
                currentValue: 0,
                weight: 0,
            }, transaction);
        }
    }
    // Create milestones from template
    if (template.templateData.milestonesTemplate) {
        for (const msTemplate of template.templateData.milestonesTemplate) {
            const dueDate = new Date(goal.startDate);
            dueDate.setDate(dueDate.getDate() + msTemplate.daysFromStart);
            await addMilestone({
                goalId: goal.id,
                title: msTemplate.title,
                dueDate,
                order: 0,
            }, transaction);
        }
    }
    // Increment template usage count
    await template.update({ usageCount: template.usageCount + 1 }, { transaction });
    return goal;
}
// ============================================================================
// GOAL ANALYTICS AND REPORTING FUNCTIONS
// ============================================================================
/**
 * Get goal completion statistics
 *
 * @param filters - Optional filters
 * @returns Goal completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getGoalCompletionStats({
 *   planId: 'plan-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 * });
 * ```
 */
async function getGoalCompletionStats(filters) {
    const where = {};
    if (filters?.planId)
        where.planId = filters.planId;
    if (filters?.ownerId)
        where.ownerId = filters.ownerId;
    if (filters?.goalType)
        where.goalType = filters.goalType;
    if (filters?.category)
        where.category = filters.category;
    const goals = await GoalModel.findAll({ where });
    const stats = {
        total: goals.length,
        draft: 0,
        active: 0,
        achieved: 0,
        notAchieved: 0,
        inProgress: 0,
        completionRate: 0,
        averageProgress: 0,
    };
    let totalProgress = 0;
    goals.forEach((goal) => {
        totalProgress += goal.progressPercentage;
        switch (goal.status) {
            case GoalStatus.DRAFT:
            case GoalStatus.SUBMITTED:
                stats.draft += 1;
                break;
            case GoalStatus.ACTIVE:
            case GoalStatus.APPROVED:
            case GoalStatus.IN_PROGRESS:
                stats.inProgress += 1;
                break;
            case GoalStatus.ACHIEVED:
            case GoalStatus.PARTIALLY_ACHIEVED:
                stats.achieved += 1;
                break;
            case GoalStatus.NOT_ACHIEVED:
                stats.notAchieved += 1;
                break;
        }
    });
    stats.completionRate = stats.total > 0
        ? ((stats.achieved + stats.notAchieved) / stats.total) * 100
        : 0;
    stats.averageProgress = stats.total > 0 ? totalProgress / stats.total : 0;
    return stats;
}
/**
 * Get employee goal summary
 *
 * @param ownerId - Owner ID
 * @param planId - Plan ID
 * @returns Employee goal summary
 *
 * @example
 * ```typescript
 * const summary = await getEmployeeGoalSummary('emp-uuid', 'plan-uuid');
 * ```
 */
async function getEmployeeGoalSummary(ownerId, planId) {
    const goals = await GoalModel.findAll({
        where: { ownerId, planId },
        include: [{ model: KeyResultModel, as: 'keyResults' }],
    });
    const summary = {
        totalGoals: goals.length,
        activeGoals: 0,
        achievedGoals: 0,
        overallProgress: 0,
        byCategory: {},
        byPriority: {},
        stretchGoals: 0,
        atRiskGoals: 0,
    };
    // Initialize category and priority counts
    Object.values(GoalCategory).forEach((cat) => {
        summary.byCategory[cat] = 0;
    });
    Object.values(GoalPriority).forEach((pri) => {
        summary.byPriority[pri] = 0;
    });
    let totalProgress = 0;
    goals.forEach((goal) => {
        totalProgress += goal.progressPercentage;
        // Count by status
        if (goal.status === GoalStatus.ACTIVE || goal.status === GoalStatus.IN_PROGRESS) {
            summary.activeGoals += 1;
        }
        if (goal.status === GoalStatus.ACHIEVED) {
            summary.achievedGoals += 1;
        }
        // Count by category and priority
        summary.byCategory[goal.category] += 1;
        summary.byPriority[goal.priority] += 1;
        // Count stretch goals
        if (goal.isStretch) {
            summary.stretchGoals += 1;
        }
        // Identify at-risk goals (progress < 50% and past mid-point of duration)
        const now = new Date();
        const duration = goal.endDate.getTime() - goal.startDate.getTime();
        const elapsed = now.getTime() - goal.startDate.getTime();
        const midPoint = duration / 2;
        if (elapsed > midPoint && goal.progressPercentage < 50) {
            summary.atRiskGoals += 1;
        }
    });
    summary.overallProgress = summary.totalGoals > 0 ? totalProgress / summary.totalGoals : 0;
    return summary;
}
/**
 * Get goals by status
 *
 * @param status - Goal status
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const activeGoals = await getGoalsByStatus(GoalStatus.ACTIVE, {
 *   ownerId: 'emp-uuid',
 * });
 * ```
 */
async function getGoalsByStatus(status, filters) {
    const where = { status };
    if (filters?.ownerId)
        where.ownerId = filters.ownerId;
    if (filters?.planId)
        where.planId = filters.planId;
    if (filters?.goalType)
        where.goalType = filters.goalType;
    return GoalModel.findAll({
        where,
        order: [['priority', 'ASC'], ['endDate', 'ASC']],
        include: [
            { model: KeyResultModel, as: 'keyResults' },
            { model: MilestoneModel, as: 'milestones' },
        ],
    });
}
/**
 * Get overdue goals
 *
 * @param ownerId - Optional owner ID
 * @returns Array of overdue goals
 *
 * @example
 * ```typescript
 * const overdueGoals = await getOverdueGoals('emp-uuid');
 * ```
 */
async function getOverdueGoals(ownerId) {
    const where = {
        endDate: { [sequelize_1.Op.lt]: new Date() },
        status: {
            [sequelize_1.Op.notIn]: [
                GoalStatus.ACHIEVED,
                GoalStatus.NOT_ACHIEVED,
                GoalStatus.CANCELLED,
            ],
        },
    };
    if (ownerId) {
        where.ownerId = ownerId;
    }
    return GoalModel.findAll({
        where,
        order: [['endDate', 'ASC']],
    });
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let GoalManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GoalManagementService = _classThis = class {
        // Goal plan methods
        async createGoalPlan(data, transaction) {
            return createGoalPlan(data, transaction);
        }
        // Goal methods
        async createGoal(data, transaction) {
            return createGoal(data, transaction);
        }
        async updateGoal(id, data, transaction) {
            return updateGoal(id, data, transaction);
        }
        async getGoalById(id, includeRelations = false) {
            return getGoalById(id, includeRelations);
        }
        async getEmployeeGoals(ownerId, filters) {
            return getEmployeeGoals(ownerId, filters);
        }
        async approveGoal(id, approvedBy, transaction) {
            return approveGoal(id, approvedBy, transaction);
        }
        async activateGoal(id, transaction) {
            return activateGoal(id, transaction);
        }
        async deleteGoal(id, transaction) {
            return deleteGoal(id, transaction);
        }
        async createSMARTGoal(goalData, smartCriteria, transaction) {
            return createSMARTGoal(goalData, smartCriteria, transaction);
        }
        // Key result methods
        async addKeyResult(data, transaction) {
            return addKeyResult(data, transaction);
        }
        async updateKeyResult(id, data, transaction) {
            return updateKeyResult(id, data, transaction);
        }
        async updateKeyResultProgress(id, currentValue, transaction) {
            return updateKeyResultProgress(id, currentValue, transaction);
        }
        async getKeyResults(goalId) {
            return getKeyResults(goalId);
        }
        async calculateGoalProgressFromKeyResults(goalId, transaction) {
            return calculateGoalProgressFromKeyResults(goalId, transaction);
        }
        // Milestone methods
        async addMilestone(data, transaction) {
            return addMilestone(data, transaction);
        }
        async completeMilestone(id, transaction) {
            return completeMilestone(id, transaction);
        }
        async getMilestones(goalId) {
            return getMilestones(goalId);
        }
        async calculateGoalProgressFromMilestones(goalId, transaction) {
            return calculateGoalProgressFromMilestones(goalId, transaction);
        }
        // Check-in methods
        async createGoalCheckIn(data, transaction) {
            return createGoalCheckIn(data, transaction);
        }
        async getGoalCheckIns(goalId, limit) {
            return getGoalCheckIns(goalId, limit);
        }
        async getLatestCheckIn(goalId) {
            return getLatestCheckIn(goalId);
        }
        async getCheckInHistory(employeeId, startDate, endDate) {
            return getCheckInHistory(employeeId, startDate, endDate);
        }
        // Alignment methods
        async createGoalAlignment(data, transaction) {
            return createGoalAlignment(data, transaction);
        }
        async getGoalAlignments(goalId, direction = 'source') {
            return getGoalAlignments(goalId, direction);
        }
        async getGoalAlignmentHierarchy(goalId) {
            return getGoalAlignmentHierarchy(goalId);
        }
        async deleteGoalAlignment(id, transaction) {
            return deleteGoalAlignment(id, transaction);
        }
        // Cascading methods
        async cascadeGoal(parentGoalId, childGoalData, transaction) {
            return cascadeGoal(parentGoalId, childGoalData, transaction);
        }
        async getChildGoals(parentGoalId) {
            return getChildGoals(parentGoalId);
        }
        async getGoalHierarchy(rootGoalId) {
            return getGoalHierarchy(rootGoalId);
        }
        // Template methods
        async createGoalTemplate(data, transaction) {
            return createGoalTemplate(data, transaction);
        }
        async getGoalTemplates(filters) {
            return getGoalTemplates(filters);
        }
        async createGoalFromTemplate(templateId, goalData, transaction) {
            return createGoalFromTemplate(templateId, goalData, transaction);
        }
        // Analytics methods
        async getGoalCompletionStats(filters) {
            return getGoalCompletionStats(filters);
        }
        async getEmployeeGoalSummary(ownerId, planId) {
            return getEmployeeGoalSummary(ownerId, planId);
        }
        async getGoalsByStatus(status, filters) {
            return getGoalsByStatus(status, filters);
        }
        async getOverdueGoals(ownerId) {
            return getOverdueGoals(ownerId);
        }
    };
    __setFunctionName(_classThis, "GoalManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalManagementService = _classThis;
})();
exports.GoalManagementService = GoalManagementService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let GoalManagementController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Goal Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('goal-management')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createPlan_decorators;
    let _createGoal_decorators;
    let _createSMARTGoal_decorators;
    let _getGoal_decorators;
    let _updateGoal_decorators;
    let _deleteGoal_decorators;
    let _approveGoal_decorators;
    let _activateGoal_decorators;
    let _getEmployeeGoals_decorators;
    let _addKeyResult_decorators;
    let _updateKeyResult_decorators;
    let _updateKeyResultProgress_decorators;
    let _getKeyResults_decorators;
    let _addMilestone_decorators;
    let _completeMilestone_decorators;
    let _getMilestones_decorators;
    let _createCheckIn_decorators;
    let _getCheckIns_decorators;
    let _createAlignment_decorators;
    let _getAlignments_decorators;
    let _getAlignmentHierarchy_decorators;
    let _cascadeGoal_decorators;
    let _getChildGoals_decorators;
    let _getHierarchy_decorators;
    let _createTemplate_decorators;
    let _getTemplates_decorators;
    let _createFromTemplate_decorators;
    let _getCompletionStats_decorators;
    let _getEmployeeSummary_decorators;
    let _getOverdueGoals_decorators;
    var GoalManagementController = _classThis = class {
        constructor(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        async createPlan(data) {
            return this.service.createGoalPlan(data);
        }
        async createGoal(data) {
            return this.service.createGoal(data);
        }
        async createSMARTGoal(data) {
            return this.service.createSMARTGoal(data.goalData, data.smartCriteria);
        }
        async getGoal(id, includeRelations) {
            return this.service.getGoalById(id, includeRelations);
        }
        async updateGoal(id, data) {
            return this.service.updateGoal(id, data);
        }
        async deleteGoal(id) {
            await this.service.deleteGoal(id);
        }
        async approveGoal(id, data) {
            return this.service.approveGoal(id, data.approvedBy);
        }
        async activateGoal(id) {
            return this.service.activateGoal(id);
        }
        async getEmployeeGoals(ownerId, filters) {
            return this.service.getEmployeeGoals(ownerId, filters);
        }
        async addKeyResult(data) {
            return this.service.addKeyResult(data);
        }
        async updateKeyResult(id, data) {
            return this.service.updateKeyResult(id, data);
        }
        async updateKeyResultProgress(id, data) {
            return this.service.updateKeyResultProgress(id, data.currentValue);
        }
        async getKeyResults(goalId) {
            return this.service.getKeyResults(goalId);
        }
        async addMilestone(data) {
            return this.service.addMilestone(data);
        }
        async completeMilestone(id) {
            return this.service.completeMilestone(id);
        }
        async getMilestones(goalId) {
            return this.service.getMilestones(goalId);
        }
        async createCheckIn(data) {
            return this.service.createGoalCheckIn(data);
        }
        async getCheckIns(goalId, limit) {
            return this.service.getGoalCheckIns(goalId, limit);
        }
        async createAlignment(data) {
            return this.service.createGoalAlignment(data);
        }
        async getAlignments(goalId, direction) {
            return this.service.getGoalAlignments(goalId, direction);
        }
        async getAlignmentHierarchy(goalId) {
            return this.service.getGoalAlignmentHierarchy(goalId);
        }
        async cascadeGoal(parentGoalId, data) {
            return this.service.cascadeGoal(parentGoalId, data);
        }
        async getChildGoals(parentGoalId) {
            return this.service.getChildGoals(parentGoalId);
        }
        async getHierarchy(rootGoalId) {
            return this.service.getGoalHierarchy(rootGoalId);
        }
        async createTemplate(data) {
            return this.service.createGoalTemplate(data);
        }
        async getTemplates(filters) {
            return this.service.getGoalTemplates(filters);
        }
        async createFromTemplate(templateId, goalData) {
            return this.service.createGoalFromTemplate(templateId, goalData);
        }
        async getCompletionStats(filters) {
            return this.service.getGoalCompletionStats(filters);
        }
        async getEmployeeSummary(ownerId, planId) {
            return this.service.getEmployeeGoalSummary(ownerId, planId);
        }
        async getOverdueGoals(ownerId) {
            return this.service.getOverdueGoals(ownerId);
        }
    };
    __setFunctionName(_classThis, "GoalManagementController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createPlan_decorators = [(0, common_1.Post)('plans'), (0, swagger_1.ApiOperation)({ summary: 'Create goal plan' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Goal plan created successfully' })];
        _createGoal_decorators = [(0, common_1.Post)('goals'), (0, swagger_1.ApiOperation)({ summary: 'Create goal' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Goal created successfully' })];
        _createSMARTGoal_decorators = [(0, common_1.Post)('goals/smart'), (0, swagger_1.ApiOperation)({ summary: 'Create SMART goal' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'SMART goal created successfully' })];
        _getGoal_decorators = [(0, common_1.Get)('goals/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get goal by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Goal ID' }), (0, swagger_1.ApiQuery)({ name: 'includeRelations', required: false, type: Boolean })];
        _updateGoal_decorators = [(0, common_1.Put)('goals/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update goal' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Goal ID' })];
        _deleteGoal_decorators = [(0, common_1.Delete)('goals/:id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT), (0, swagger_1.ApiOperation)({ summary: 'Delete goal' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Goal ID' })];
        _approveGoal_decorators = [(0, common_1.Post)('goals/:id/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve goal' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Goal ID' })];
        _activateGoal_decorators = [(0, common_1.Post)('goals/:id/activate'), (0, swagger_1.ApiOperation)({ summary: 'Activate goal' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Goal ID' })];
        _getEmployeeGoals_decorators = [(0, common_1.Get)('employees/:ownerId/goals'), (0, swagger_1.ApiOperation)({ summary: 'Get employee goals' }), (0, swagger_1.ApiParam)({ name: 'ownerId', description: 'Owner ID' })];
        _addKeyResult_decorators = [(0, common_1.Post)('key-results'), (0, swagger_1.ApiOperation)({ summary: 'Add key result to goal' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Key result created successfully' })];
        _updateKeyResult_decorators = [(0, common_1.Put)('key-results/:id'), (0, swagger_1.ApiOperation)({ summary: 'Update key result' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Key result ID' })];
        _updateKeyResultProgress_decorators = [(0, common_1.Patch)('key-results/:id/progress'), (0, swagger_1.ApiOperation)({ summary: 'Update key result progress' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Key result ID' })];
        _getKeyResults_decorators = [(0, common_1.Get)('goals/:goalId/key-results'), (0, swagger_1.ApiOperation)({ summary: 'Get key results for goal' }), (0, swagger_1.ApiParam)({ name: 'goalId', description: 'Goal ID' })];
        _addMilestone_decorators = [(0, common_1.Post)('milestones'), (0, swagger_1.ApiOperation)({ summary: 'Add milestone to goal' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Milestone created successfully' })];
        _completeMilestone_decorators = [(0, common_1.Post)('milestones/:id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Complete milestone' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Milestone ID' })];
        _getMilestones_decorators = [(0, common_1.Get)('goals/:goalId/milestones'), (0, swagger_1.ApiOperation)({ summary: 'Get milestones for goal' }), (0, swagger_1.ApiParam)({ name: 'goalId', description: 'Goal ID' })];
        _createCheckIn_decorators = [(0, common_1.Post)('check-ins'), (0, swagger_1.ApiOperation)({ summary: 'Create goal check-in' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Check-in created successfully' })];
        _getCheckIns_decorators = [(0, common_1.Get)('goals/:goalId/check-ins'), (0, swagger_1.ApiOperation)({ summary: 'Get check-ins for goal' }), (0, swagger_1.ApiParam)({ name: 'goalId', description: 'Goal ID' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number })];
        _createAlignment_decorators = [(0, common_1.Post)('alignments'), (0, swagger_1.ApiOperation)({ summary: 'Create goal alignment' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Alignment created successfully' })];
        _getAlignments_decorators = [(0, common_1.Get)('goals/:goalId/alignments'), (0, swagger_1.ApiOperation)({ summary: 'Get goal alignments' }), (0, swagger_1.ApiParam)({ name: 'goalId', description: 'Goal ID' }), (0, swagger_1.ApiQuery)({ name: 'direction', required: false, enum: ['source', 'target'] })];
        _getAlignmentHierarchy_decorators = [(0, common_1.Get)('goals/:goalId/alignment-hierarchy'), (0, swagger_1.ApiOperation)({ summary: 'Get goal alignment hierarchy' }), (0, swagger_1.ApiParam)({ name: 'goalId', description: 'Goal ID' })];
        _cascadeGoal_decorators = [(0, common_1.Post)('goals/:parentGoalId/cascade'), (0, swagger_1.ApiOperation)({ summary: 'Cascade goal to child level' }), (0, swagger_1.ApiParam)({ name: 'parentGoalId', description: 'Parent goal ID' })];
        _getChildGoals_decorators = [(0, common_1.Get)('goals/:parentGoalId/children'), (0, swagger_1.ApiOperation)({ summary: 'Get child goals' }), (0, swagger_1.ApiParam)({ name: 'parentGoalId', description: 'Parent goal ID' })];
        _getHierarchy_decorators = [(0, common_1.Get)('goals/:rootGoalId/hierarchy'), (0, swagger_1.ApiOperation)({ summary: 'Get goal hierarchy' }), (0, swagger_1.ApiParam)({ name: 'rootGoalId', description: 'Root goal ID' })];
        _createTemplate_decorators = [(0, common_1.Post)('templates'), (0, swagger_1.ApiOperation)({ summary: 'Create goal template' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' })];
        _getTemplates_decorators = [(0, common_1.Get)('templates'), (0, swagger_1.ApiOperation)({ summary: 'Get goal templates' })];
        _createFromTemplate_decorators = [(0, common_1.Post)('templates/:templateId/create-goal'), (0, swagger_1.ApiOperation)({ summary: 'Create goal from template' }), (0, swagger_1.ApiParam)({ name: 'templateId', description: 'Template ID' })];
        _getCompletionStats_decorators = [(0, common_1.Get)('analytics/completion-stats'), (0, swagger_1.ApiOperation)({ summary: 'Get goal completion statistics' })];
        _getEmployeeSummary_decorators = [(0, common_1.Get)('employees/:ownerId/goal-summary'), (0, swagger_1.ApiOperation)({ summary: 'Get employee goal summary' }), (0, swagger_1.ApiParam)({ name: 'ownerId', description: 'Owner ID' }), (0, swagger_1.ApiQuery)({ name: 'planId', description: 'Plan ID' })];
        _getOverdueGoals_decorators = [(0, common_1.Get)('goals/overdue'), (0, swagger_1.ApiOperation)({ summary: 'Get overdue goals' }), (0, swagger_1.ApiQuery)({ name: 'ownerId', required: false })];
        __esDecorate(_classThis, null, _createPlan_decorators, { kind: "method", name: "createPlan", static: false, private: false, access: { has: obj => "createPlan" in obj, get: obj => obj.createPlan }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGoal_decorators, { kind: "method", name: "createGoal", static: false, private: false, access: { has: obj => "createGoal" in obj, get: obj => obj.createGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSMARTGoal_decorators, { kind: "method", name: "createSMARTGoal", static: false, private: false, access: { has: obj => "createSMARTGoal" in obj, get: obj => obj.createSMARTGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGoal_decorators, { kind: "method", name: "getGoal", static: false, private: false, access: { has: obj => "getGoal" in obj, get: obj => obj.getGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateGoal_decorators, { kind: "method", name: "updateGoal", static: false, private: false, access: { has: obj => "updateGoal" in obj, get: obj => obj.updateGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteGoal_decorators, { kind: "method", name: "deleteGoal", static: false, private: false, access: { has: obj => "deleteGoal" in obj, get: obj => obj.deleteGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveGoal_decorators, { kind: "method", name: "approveGoal", static: false, private: false, access: { has: obj => "approveGoal" in obj, get: obj => obj.approveGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activateGoal_decorators, { kind: "method", name: "activateGoal", static: false, private: false, access: { has: obj => "activateGoal" in obj, get: obj => obj.activateGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEmployeeGoals_decorators, { kind: "method", name: "getEmployeeGoals", static: false, private: false, access: { has: obj => "getEmployeeGoals" in obj, get: obj => obj.getEmployeeGoals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addKeyResult_decorators, { kind: "method", name: "addKeyResult", static: false, private: false, access: { has: obj => "addKeyResult" in obj, get: obj => obj.addKeyResult }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateKeyResult_decorators, { kind: "method", name: "updateKeyResult", static: false, private: false, access: { has: obj => "updateKeyResult" in obj, get: obj => obj.updateKeyResult }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateKeyResultProgress_decorators, { kind: "method", name: "updateKeyResultProgress", static: false, private: false, access: { has: obj => "updateKeyResultProgress" in obj, get: obj => obj.updateKeyResultProgress }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getKeyResults_decorators, { kind: "method", name: "getKeyResults", static: false, private: false, access: { has: obj => "getKeyResults" in obj, get: obj => obj.getKeyResults }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addMilestone_decorators, { kind: "method", name: "addMilestone", static: false, private: false, access: { has: obj => "addMilestone" in obj, get: obj => obj.addMilestone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _completeMilestone_decorators, { kind: "method", name: "completeMilestone", static: false, private: false, access: { has: obj => "completeMilestone" in obj, get: obj => obj.completeMilestone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMilestones_decorators, { kind: "method", name: "getMilestones", static: false, private: false, access: { has: obj => "getMilestones" in obj, get: obj => obj.getMilestones }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCheckIn_decorators, { kind: "method", name: "createCheckIn", static: false, private: false, access: { has: obj => "createCheckIn" in obj, get: obj => obj.createCheckIn }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCheckIns_decorators, { kind: "method", name: "getCheckIns", static: false, private: false, access: { has: obj => "getCheckIns" in obj, get: obj => obj.getCheckIns }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAlignment_decorators, { kind: "method", name: "createAlignment", static: false, private: false, access: { has: obj => "createAlignment" in obj, get: obj => obj.createAlignment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAlignments_decorators, { kind: "method", name: "getAlignments", static: false, private: false, access: { has: obj => "getAlignments" in obj, get: obj => obj.getAlignments }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAlignmentHierarchy_decorators, { kind: "method", name: "getAlignmentHierarchy", static: false, private: false, access: { has: obj => "getAlignmentHierarchy" in obj, get: obj => obj.getAlignmentHierarchy }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cascadeGoal_decorators, { kind: "method", name: "cascadeGoal", static: false, private: false, access: { has: obj => "cascadeGoal" in obj, get: obj => obj.cascadeGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getChildGoals_decorators, { kind: "method", name: "getChildGoals", static: false, private: false, access: { has: obj => "getChildGoals" in obj, get: obj => obj.getChildGoals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHierarchy_decorators, { kind: "method", name: "getHierarchy", static: false, private: false, access: { has: obj => "getHierarchy" in obj, get: obj => obj.getHierarchy }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTemplate_decorators, { kind: "method", name: "createTemplate", static: false, private: false, access: { has: obj => "createTemplate" in obj, get: obj => obj.createTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: obj => "getTemplates" in obj, get: obj => obj.getTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFromTemplate_decorators, { kind: "method", name: "createFromTemplate", static: false, private: false, access: { has: obj => "createFromTemplate" in obj, get: obj => obj.createFromTemplate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCompletionStats_decorators, { kind: "method", name: "getCompletionStats", static: false, private: false, access: { has: obj => "getCompletionStats" in obj, get: obj => obj.getCompletionStats }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEmployeeSummary_decorators, { kind: "method", name: "getEmployeeSummary", static: false, private: false, access: { has: obj => "getEmployeeSummary" in obj, get: obj => obj.getEmployeeSummary }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOverdueGoals_decorators, { kind: "method", name: "getOverdueGoals", static: false, private: false, access: { has: obj => "getOverdueGoals" in obj, get: obj => obj.getOverdueGoals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoalManagementController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoalManagementController = _classThis;
})();
exports.GoalManagementController = GoalManagementController;
//# sourceMappingURL=goal-management-kit.js.map