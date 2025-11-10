"use strict";
/**
 * LOC: HCMDEV12345
 * File: /reuse/server/human-capital/development-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Development planning controllers
 *   - Career development services
 *   - Competency management services
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
exports.performSkillsGapAnalysis = exports.createSkillsAssessment = exports.createCompetencyFramework = exports.searchCompetencies = exports.getCompetenciesByRole = exports.updateCompetencyProficiencyLevels = exports.createCompetency = exports.getUserDevelopmentGoals = exports.associateCoursesWithGoal = exports.completeGoal = exports.updateGoalProgress = exports.createDevelopmentGoal = exports.getUserIDPs = exports.updateIDPProgress = exports.activateIDP = exports.approveIDP = exports.submitIDPForReview = exports.createIDP = exports.createMentoringRelationshipModel = exports.createCompetencyModel = exports.createDevelopmentGoalModel = exports.createIDPModel = exports.TuitionReimbursementCreateSchema = exports.ExternalTrainingRequestCreateSchema = exports.LearningResourceCreateSchema = exports.JobRotationCreateSchema = exports.MentoringRelationshipCreateSchema = exports.SkillsAssessmentCreateSchema = exports.CompetencyCreateSchema = exports.DevelopmentGoalCreateSchema = exports.IDPCreateSchema = exports.CreateTuitionReimbursementDto = exports.CreateExternalTrainingRequestDto = exports.CreateLearningResourceDto = exports.CreateJobRotationDto = exports.CreateMentoringRelationshipDto = exports.CreateSkillsAssessmentDto = exports.CreateCompetencyDto = exports.CreateDevelopmentGoalDto = exports.CreateIDPDto = exports.ReimbursementStatus = exports.ResourceType = exports.JobRotationStatus = exports.MentoringType = exports.MentoringStatus = exports.SkillsGapPriority = exports.CompetencyType = exports.ProficiencyLevel = exports.DevelopmentGoalStatus = exports.IDPStatus = void 0;
exports.DevelopmentPlanningController = exports.completeDevelopmentMilestone = exports.createDevelopmentMilestone = exports.trackBudgetExpenditure = exports.initializeDevelopmentBudget = exports.processTuitionReimbursementPayment = exports.createTuitionReimbursementRequest = exports.approveExternalTrainingRequest = exports.submitExternalTrainingRequest = exports.createExternalTrainingRequest = exports.rateLearningResource = exports.searchLearningResources = exports.createLearningResource = exports.completeJobRotation = exports.updateJobRotationProgress = exports.activateJobRotation = exports.createJobRotation = exports.matchMenteeWithMentors = exports.completeMentoringRelationship = exports.recordMentoringSession = exports.activateMentoringRelationship = exports.createMentoringRelationship = exports.getAISkillRecommendations = exports.acceptLearningRecommendation = exports.generateLearningRecommendations = exports.updateUserCompetencyProficiency = exports.compareUserCompetenciesWithRole = exports.identifyCriticalSkillsGaps = void 0;
/**
 * File: /reuse/server/human-capital/development-planning-kit.ts
 * Locator: WC-HCM-DEV-001
 * Purpose: Comprehensive Development Planning System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, development planning services, career development, talent management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45+ utility functions for individual development plans (IDP), competency frameworks, skills gap analysis,
 * learning recommendations, mentoring programs, job rotation, knowledge sharing, external training, professional
 * development budgets, development milestones, career planning integration
 *
 * LLM Context: Enterprise-grade Development Planning System competing with SAP SuccessFactors Career Development.
 * Provides comprehensive individual development planning, competency framework management, skills assessment and
 * gap analysis, personalized learning recommendations, mentoring and coaching program management, job rotation and
 * cross-training coordination, knowledge sharing and collaboration tools, learning resource library management,
 * external training and tuition reimbursement, professional development budget tracking, development milestone
 * tracking, succession planning integration, career path planning, talent pool management, performance review
 * integration, 360-degree feedback integration, development goal tracking, skill certification tracking.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * IDP status values
 */
var IDPStatus;
(function (IDPStatus) {
    IDPStatus["DRAFT"] = "draft";
    IDPStatus["SUBMITTED"] = "submitted";
    IDPStatus["UNDER_REVIEW"] = "under_review";
    IDPStatus["APPROVED"] = "approved";
    IDPStatus["ACTIVE"] = "active";
    IDPStatus["COMPLETED"] = "completed";
    IDPStatus["CANCELLED"] = "cancelled";
    IDPStatus["EXPIRED"] = "expired";
})(IDPStatus || (exports.IDPStatus = IDPStatus = {}));
/**
 * Development goal status
 */
var DevelopmentGoalStatus;
(function (DevelopmentGoalStatus) {
    DevelopmentGoalStatus["NOT_STARTED"] = "not_started";
    DevelopmentGoalStatus["IN_PROGRESS"] = "in_progress";
    DevelopmentGoalStatus["ON_TRACK"] = "on_track";
    DevelopmentGoalStatus["AT_RISK"] = "at_risk";
    DevelopmentGoalStatus["DELAYED"] = "delayed";
    DevelopmentGoalStatus["COMPLETED"] = "completed";
    DevelopmentGoalStatus["CANCELLED"] = "cancelled";
})(DevelopmentGoalStatus || (exports.DevelopmentGoalStatus = DevelopmentGoalStatus = {}));
/**
 * Competency proficiency levels
 */
var ProficiencyLevel;
(function (ProficiencyLevel) {
    ProficiencyLevel["NONE"] = "none";
    ProficiencyLevel["BASIC"] = "basic";
    ProficiencyLevel["INTERMEDIATE"] = "intermediate";
    ProficiencyLevel["ADVANCED"] = "advanced";
    ProficiencyLevel["EXPERT"] = "expert";
    ProficiencyLevel["MASTER"] = "master";
})(ProficiencyLevel || (exports.ProficiencyLevel = ProficiencyLevel = {}));
/**
 * Competency types
 */
var CompetencyType;
(function (CompetencyType) {
    CompetencyType["TECHNICAL"] = "technical";
    CompetencyType["BEHAVIORAL"] = "behavioral";
    CompetencyType["LEADERSHIP"] = "leadership";
    CompetencyType["FUNCTIONAL"] = "functional";
    CompetencyType["CORE"] = "core";
    CompetencyType["ROLE_SPECIFIC"] = "role_specific";
})(CompetencyType || (exports.CompetencyType = CompetencyType = {}));
/**
 * Skills gap priority
 */
var SkillsGapPriority;
(function (SkillsGapPriority) {
    SkillsGapPriority["CRITICAL"] = "critical";
    SkillsGapPriority["HIGH"] = "high";
    SkillsGapPriority["MEDIUM"] = "medium";
    SkillsGapPriority["LOW"] = "low";
})(SkillsGapPriority || (exports.SkillsGapPriority = SkillsGapPriority = {}));
/**
 * Mentoring relationship status
 */
var MentoringStatus;
(function (MentoringStatus) {
    MentoringStatus["PENDING"] = "pending";
    MentoringStatus["ACTIVE"] = "active";
    MentoringStatus["ON_HOLD"] = "on_hold";
    MentoringStatus["COMPLETED"] = "completed";
    MentoringStatus["CANCELLED"] = "cancelled";
})(MentoringStatus || (exports.MentoringStatus = MentoringStatus = {}));
/**
 * Mentoring relationship type
 */
var MentoringType;
(function (MentoringType) {
    MentoringType["FORMAL"] = "formal";
    MentoringType["INFORMAL"] = "informal";
    MentoringType["PEER"] = "peer";
    MentoringType["REVERSE"] = "reverse";
    MentoringType["GROUP"] = "group";
})(MentoringType || (exports.MentoringType = MentoringType = {}));
/**
 * Job rotation status
 */
var JobRotationStatus;
(function (JobRotationStatus) {
    JobRotationStatus["PLANNED"] = "planned";
    JobRotationStatus["ACTIVE"] = "active";
    JobRotationStatus["COMPLETED"] = "completed";
    JobRotationStatus["CANCELLED"] = "cancelled";
})(JobRotationStatus || (exports.JobRotationStatus = JobRotationStatus = {}));
/**
 * Resource types
 */
var ResourceType;
(function (ResourceType) {
    ResourceType["ARTICLE"] = "article";
    ResourceType["VIDEO"] = "video";
    ResourceType["BOOK"] = "book";
    ResourceType["PODCAST"] = "podcast";
    ResourceType["COURSE"] = "course";
    ResourceType["WEBINAR"] = "webinar";
    ResourceType["TOOL"] = "tool";
    ResourceType["TEMPLATE"] = "template";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
/**
 * Tuition reimbursement status
 */
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus["DRAFT"] = "draft";
    ReimbursementStatus["SUBMITTED"] = "submitted";
    ReimbursementStatus["UNDER_REVIEW"] = "under_review";
    ReimbursementStatus["APPROVED"] = "approved";
    ReimbursementStatus["REJECTED"] = "rejected";
    ReimbursementStatus["PAID"] = "paid";
    ReimbursementStatus["CANCELLED"] = "cancelled";
})(ReimbursementStatus || (exports.ReimbursementStatus = ReimbursementStatus = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create IDP DTO
 */
let CreateIDPDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _planYear_decorators;
    let _planYear_initializers = [];
    let _planYear_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _currentRole_decorators;
    let _currentRole_initializers = [];
    let _currentRole_extraInitializers = [];
    let _desiredRole_decorators;
    let _desiredRole_initializers = [];
    let _desiredRole_extraInitializers = [];
    let _careerGoals_decorators;
    let _careerGoals_initializers = [];
    let _careerGoals_extraInitializers = [];
    let _managerIds_decorators;
    let _managerIds_initializers = [];
    let _managerIds_extraInitializers = [];
    return _a = class CreateIDPDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.planName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
                this.description = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.planYear = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _planYear_initializers, void 0));
                this.startDate = (__runInitializers(this, _planYear_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.currentRole = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _currentRole_initializers, void 0));
                this.desiredRole = (__runInitializers(this, _currentRole_extraInitializers), __runInitializers(this, _desiredRole_initializers, void 0));
                this.careerGoals = (__runInitializers(this, _desiredRole_extraInitializers), __runInitializers(this, _careerGoals_initializers, void 0));
                this.managerIds = (__runInitializers(this, _careerGoals_extraInitializers), __runInitializers(this, _managerIds_initializers, void 0));
                __runInitializers(this, _managerIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _planYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan year' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(2020), (0, class_validator_1.Max)(2050)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _currentRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current role' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _desiredRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Desired role', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(255)];
            _careerGoals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Career goals', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _managerIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)(undefined, { each: true })];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _planYear_decorators, { kind: "field", name: "planYear", static: false, private: false, access: { has: obj => "planYear" in obj, get: obj => obj.planYear, set: (obj, value) => { obj.planYear = value; } }, metadata: _metadata }, _planYear_initializers, _planYear_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _currentRole_decorators, { kind: "field", name: "currentRole", static: false, private: false, access: { has: obj => "currentRole" in obj, get: obj => obj.currentRole, set: (obj, value) => { obj.currentRole = value; } }, metadata: _metadata }, _currentRole_initializers, _currentRole_extraInitializers);
            __esDecorate(null, null, _desiredRole_decorators, { kind: "field", name: "desiredRole", static: false, private: false, access: { has: obj => "desiredRole" in obj, get: obj => obj.desiredRole, set: (obj, value) => { obj.desiredRole = value; } }, metadata: _metadata }, _desiredRole_initializers, _desiredRole_extraInitializers);
            __esDecorate(null, null, _careerGoals_decorators, { kind: "field", name: "careerGoals", static: false, private: false, access: { has: obj => "careerGoals" in obj, get: obj => obj.careerGoals, set: (obj, value) => { obj.careerGoals = value; } }, metadata: _metadata }, _careerGoals_initializers, _careerGoals_extraInitializers);
            __esDecorate(null, null, _managerIds_decorators, { kind: "field", name: "managerIds", static: false, private: false, access: { has: obj => "managerIds" in obj, get: obj => obj.managerIds, set: (obj, value) => { obj.managerIds = value; } }, metadata: _metadata }, _managerIds_initializers, _managerIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIDPDto = CreateIDPDto;
/**
 * Create development goal DTO
 */
let CreateDevelopmentGoalDto = (() => {
    var _a;
    let _idpId_decorators;
    let _idpId_initializers = [];
    let _idpId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _goalName_decorators;
    let _goalName_initializers = [];
    let _goalName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _targetLevel_decorators;
    let _targetLevel_initializers = [];
    let _targetLevel_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _successCriteria_decorators;
    let _successCriteria_initializers = [];
    let _successCriteria_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    return _a = class CreateDevelopmentGoalDto {
            constructor() {
                this.idpId = __runInitializers(this, _idpId_initializers, void 0);
                this.userId = (__runInitializers(this, _idpId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.goalName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _goalName_initializers, void 0));
                this.description = (__runInitializers(this, _goalName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.category = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.targetLevel = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _targetLevel_initializers, void 0));
                this.targetDate = (__runInitializers(this, _targetLevel_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.successCriteria = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _successCriteria_initializers, void 0));
                this.managerId = (__runInitializers(this, _successCriteria_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                __runInitializers(this, _managerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _idpId_decorators = [(0, swagger_1.ApiProperty)({ description: 'IDP ID' }), (0, class_validator_1.IsUUID)()];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _goalName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Goal name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Goal description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: SkillsGapPriority }), (0, class_validator_1.IsEnum)(SkillsGapPriority)];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: ['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'] }), (0, class_validator_1.IsEnum)(['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'])];
            _targetLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: ProficiencyLevel }), (0, class_validator_1.IsEnum)(ProficiencyLevel)];
            _targetDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _successCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Success criteria', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _idpId_decorators, { kind: "field", name: "idpId", static: false, private: false, access: { has: obj => "idpId" in obj, get: obj => obj.idpId, set: (obj, value) => { obj.idpId = value; } }, metadata: _metadata }, _idpId_initializers, _idpId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _goalName_decorators, { kind: "field", name: "goalName", static: false, private: false, access: { has: obj => "goalName" in obj, get: obj => obj.goalName, set: (obj, value) => { obj.goalName = value; } }, metadata: _metadata }, _goalName_initializers, _goalName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _targetLevel_decorators, { kind: "field", name: "targetLevel", static: false, private: false, access: { has: obj => "targetLevel" in obj, get: obj => obj.targetLevel, set: (obj, value) => { obj.targetLevel = value; } }, metadata: _metadata }, _targetLevel_initializers, _targetLevel_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _successCriteria_decorators, { kind: "field", name: "successCriteria", static: false, private: false, access: { has: obj => "successCriteria" in obj, get: obj => obj.successCriteria, set: (obj, value) => { obj.successCriteria = value; } }, metadata: _metadata }, _successCriteria_initializers, _successCriteria_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDevelopmentGoalDto = CreateDevelopmentGoalDto;
/**
 * Create competency DTO
 */
let CreateCompetencyDto = (() => {
    var _a;
    let _competencyName_decorators;
    let _competencyName_initializers = [];
    let _competencyName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _requiredForRoles_decorators;
    let _requiredForRoles_initializers = [];
    let _requiredForRoles_extraInitializers = [];
    return _a = class CreateCompetencyDto {
            constructor() {
                this.competencyName = __runInitializers(this, _competencyName_initializers, void 0);
                this.description = (__runInitializers(this, _competencyName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.requiredForRoles = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _requiredForRoles_initializers, void 0));
                __runInitializers(this, _requiredForRoles_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _competencyName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competency name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: CompetencyType }), (0, class_validator_1.IsEnum)(CompetencyType)];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _requiredForRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required for roles', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _competencyName_decorators, { kind: "field", name: "competencyName", static: false, private: false, access: { has: obj => "competencyName" in obj, get: obj => obj.competencyName, set: (obj, value) => { obj.competencyName = value; } }, metadata: _metadata }, _competencyName_initializers, _competencyName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _requiredForRoles_decorators, { kind: "field", name: "requiredForRoles", static: false, private: false, access: { has: obj => "requiredForRoles" in obj, get: obj => obj.requiredForRoles, set: (obj, value) => { obj.requiredForRoles = value; } }, metadata: _metadata }, _requiredForRoles_initializers, _requiredForRoles_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompetencyDto = CreateCompetencyDto;
/**
 * Create skills assessment DTO
 */
let CreateSkillsAssessmentDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _assessmentName_decorators;
    let _assessmentName_initializers = [];
    let _assessmentName_extraInitializers = [];
    let _assessmentType_decorators;
    let _assessmentType_initializers = [];
    let _assessmentType_extraInitializers = [];
    let _assessorId_decorators;
    let _assessorId_initializers = [];
    let _assessorId_extraInitializers = [];
    return _a = class CreateSkillsAssessmentDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.assessmentName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _assessmentName_initializers, void 0));
                this.assessmentType = (__runInitializers(this, _assessmentName_extraInitializers), __runInitializers(this, _assessmentType_initializers, void 0));
                this.assessorId = (__runInitializers(this, _assessmentType_extraInitializers), __runInitializers(this, _assessorId_initializers, void 0));
                __runInitializers(this, _assessorId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _assessmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _assessmentType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['SELF', 'MANAGER', 'PEER', '360', 'EXPERT'] }), (0, class_validator_1.IsEnum)(['SELF', 'MANAGER', 'PEER', '360', 'EXPERT'])];
            _assessorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessor ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _assessmentName_decorators, { kind: "field", name: "assessmentName", static: false, private: false, access: { has: obj => "assessmentName" in obj, get: obj => obj.assessmentName, set: (obj, value) => { obj.assessmentName = value; } }, metadata: _metadata }, _assessmentName_initializers, _assessmentName_extraInitializers);
            __esDecorate(null, null, _assessmentType_decorators, { kind: "field", name: "assessmentType", static: false, private: false, access: { has: obj => "assessmentType" in obj, get: obj => obj.assessmentType, set: (obj, value) => { obj.assessmentType = value; } }, metadata: _metadata }, _assessmentType_initializers, _assessmentType_extraInitializers);
            __esDecorate(null, null, _assessorId_decorators, { kind: "field", name: "assessorId", static: false, private: false, access: { has: obj => "assessorId" in obj, get: obj => obj.assessorId, set: (obj, value) => { obj.assessorId = value; } }, metadata: _metadata }, _assessorId_initializers, _assessorId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSkillsAssessmentDto = CreateSkillsAssessmentDto;
/**
 * Create mentoring relationship DTO
 */
let CreateMentoringRelationshipDto = (() => {
    var _a;
    let _mentorId_decorators;
    let _mentorId_initializers = [];
    let _mentorId_extraInitializers = [];
    let _menteeId_decorators;
    let _menteeId_initializers = [];
    let _menteeId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _focusAreas_decorators;
    let _focusAreas_initializers = [];
    let _focusAreas_extraInitializers = [];
    let _goals_decorators;
    let _goals_initializers = [];
    let _goals_extraInitializers = [];
    let _meetingFrequency_decorators;
    let _meetingFrequency_initializers = [];
    let _meetingFrequency_extraInitializers = [];
    return _a = class CreateMentoringRelationshipDto {
            constructor() {
                this.mentorId = __runInitializers(this, _mentorId_initializers, void 0);
                this.menteeId = (__runInitializers(this, _mentorId_extraInitializers), __runInitializers(this, _menteeId_initializers, void 0));
                this.type = (__runInitializers(this, _menteeId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.startDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.focusAreas = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _focusAreas_initializers, void 0));
                this.goals = (__runInitializers(this, _focusAreas_extraInitializers), __runInitializers(this, _goals_initializers, void 0));
                this.meetingFrequency = (__runInitializers(this, _goals_extraInitializers), __runInitializers(this, _meetingFrequency_initializers, void 0));
                __runInitializers(this, _meetingFrequency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _mentorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mentor user ID' }), (0, class_validator_1.IsUUID)()];
            _menteeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mentee user ID' }), (0, class_validator_1.IsUUID)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: MentoringType }), (0, class_validator_1.IsEnum)(MentoringType)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _focusAreas_decorators = [(0, swagger_1.ApiProperty)({ description: 'Focus areas', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _goals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Goals', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _meetingFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Meeting frequency' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _mentorId_decorators, { kind: "field", name: "mentorId", static: false, private: false, access: { has: obj => "mentorId" in obj, get: obj => obj.mentorId, set: (obj, value) => { obj.mentorId = value; } }, metadata: _metadata }, _mentorId_initializers, _mentorId_extraInitializers);
            __esDecorate(null, null, _menteeId_decorators, { kind: "field", name: "menteeId", static: false, private: false, access: { has: obj => "menteeId" in obj, get: obj => obj.menteeId, set: (obj, value) => { obj.menteeId = value; } }, metadata: _metadata }, _menteeId_initializers, _menteeId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _focusAreas_decorators, { kind: "field", name: "focusAreas", static: false, private: false, access: { has: obj => "focusAreas" in obj, get: obj => obj.focusAreas, set: (obj, value) => { obj.focusAreas = value; } }, metadata: _metadata }, _focusAreas_initializers, _focusAreas_extraInitializers);
            __esDecorate(null, null, _goals_decorators, { kind: "field", name: "goals", static: false, private: false, access: { has: obj => "goals" in obj, get: obj => obj.goals, set: (obj, value) => { obj.goals = value; } }, metadata: _metadata }, _goals_initializers, _goals_extraInitializers);
            __esDecorate(null, null, _meetingFrequency_decorators, { kind: "field", name: "meetingFrequency", static: false, private: false, access: { has: obj => "meetingFrequency" in obj, get: obj => obj.meetingFrequency, set: (obj, value) => { obj.meetingFrequency = value; } }, metadata: _metadata }, _meetingFrequency_initializers, _meetingFrequency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateMentoringRelationshipDto = CreateMentoringRelationshipDto;
/**
 * Create job rotation DTO
 */
let CreateJobRotationDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _rotationName_decorators;
    let _rotationName_initializers = [];
    let _rotationName_extraInitializers = [];
    let _currentRole_decorators;
    let _currentRole_initializers = [];
    let _currentRole_extraInitializers = [];
    let _targetDepartment_decorators;
    let _targetDepartment_initializers = [];
    let _targetDepartment_extraInitializers = [];
    let _targetRole_decorators;
    let _targetRole_initializers = [];
    let _targetRole_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _supervisorId_decorators;
    let _supervisorId_initializers = [];
    let _supervisorId_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    return _a = class CreateJobRotationDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.rotationName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _rotationName_initializers, void 0));
                this.currentRole = (__runInitializers(this, _rotationName_extraInitializers), __runInitializers(this, _currentRole_initializers, void 0));
                this.targetDepartment = (__runInitializers(this, _currentRole_extraInitializers), __runInitializers(this, _targetDepartment_initializers, void 0));
                this.targetRole = (__runInitializers(this, _targetDepartment_extraInitializers), __runInitializers(this, _targetRole_initializers, void 0));
                this.startDate = (__runInitializers(this, _targetRole_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.supervisorId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _supervisorId_initializers, void 0));
                this.objectives = (__runInitializers(this, _supervisorId_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                __runInitializers(this, _objectives_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _rotationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rotation name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _currentRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current role' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _targetDepartment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target department' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _targetRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target role' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _supervisorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supervisor user ID' }), (0, class_validator_1.IsUUID)()];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objectives', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _rotationName_decorators, { kind: "field", name: "rotationName", static: false, private: false, access: { has: obj => "rotationName" in obj, get: obj => obj.rotationName, set: (obj, value) => { obj.rotationName = value; } }, metadata: _metadata }, _rotationName_initializers, _rotationName_extraInitializers);
            __esDecorate(null, null, _currentRole_decorators, { kind: "field", name: "currentRole", static: false, private: false, access: { has: obj => "currentRole" in obj, get: obj => obj.currentRole, set: (obj, value) => { obj.currentRole = value; } }, metadata: _metadata }, _currentRole_initializers, _currentRole_extraInitializers);
            __esDecorate(null, null, _targetDepartment_decorators, { kind: "field", name: "targetDepartment", static: false, private: false, access: { has: obj => "targetDepartment" in obj, get: obj => obj.targetDepartment, set: (obj, value) => { obj.targetDepartment = value; } }, metadata: _metadata }, _targetDepartment_initializers, _targetDepartment_extraInitializers);
            __esDecorate(null, null, _targetRole_decorators, { kind: "field", name: "targetRole", static: false, private: false, access: { has: obj => "targetRole" in obj, get: obj => obj.targetRole, set: (obj, value) => { obj.targetRole = value; } }, metadata: _metadata }, _targetRole_initializers, _targetRole_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _supervisorId_decorators, { kind: "field", name: "supervisorId", static: false, private: false, access: { has: obj => "supervisorId" in obj, get: obj => obj.supervisorId, set: (obj, value) => { obj.supervisorId = value; } }, metadata: _metadata }, _supervisorId_initializers, _supervisorId_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateJobRotationDto = CreateJobRotationDto;
/**
 * Create learning resource DTO
 */
let CreateLearningResourceDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _difficulty_decorators;
    let _difficulty_initializers = [];
    let _difficulty_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _isFree_decorators;
    let _isFree_initializers = [];
    let _isFree_extraInitializers = [];
    return _a = class CreateLearningResourceDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.url = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _url_initializers, void 0));
                this.difficulty = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _difficulty_initializers, void 0));
                this.topics = (__runInitializers(this, _difficulty_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
                this.tags = (__runInitializers(this, _topics_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.isFree = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _isFree_initializers, void 0));
                __runInitializers(this, _isFree_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ResourceType }), (0, class_validator_1.IsEnum)(ResourceType)];
            _url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource URL', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _difficulty_decorators = [(0, swagger_1.ApiProperty)({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] }), (0, class_validator_1.IsEnum)(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])];
            _topics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Topics', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _isFree_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is free resource' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _difficulty_decorators, { kind: "field", name: "difficulty", static: false, private: false, access: { has: obj => "difficulty" in obj, get: obj => obj.difficulty, set: (obj, value) => { obj.difficulty = value; } }, metadata: _metadata }, _difficulty_initializers, _difficulty_extraInitializers);
            __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _isFree_decorators, { kind: "field", name: "isFree", static: false, private: false, access: { has: obj => "isFree" in obj, get: obj => obj.isFree, set: (obj, value) => { obj.isFree = value; } }, metadata: _metadata }, _isFree_initializers, _isFree_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLearningResourceDto = CreateLearningResourceDto;
/**
 * Create external training request DTO
 */
let CreateExternalTrainingRequestDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _requestType_decorators;
    let _requestType_initializers = [];
    let _requestType_extraInitializers = [];
    let _trainingName_decorators;
    let _trainingName_initializers = [];
    let _trainingName_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _managerId_decorators;
    let _managerId_initializers = [];
    let _managerId_extraInitializers = [];
    return _a = class CreateExternalTrainingRequestDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.requestType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _requestType_initializers, void 0));
                this.trainingName = (__runInitializers(this, _requestType_extraInitializers), __runInitializers(this, _trainingName_initializers, void 0));
                this.provider = (__runInitializers(this, _trainingName_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
                this.description = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.cost = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
                this.justification = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.managerId = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                __runInitializers(this, _managerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _requestType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR'] }), (0, class_validator_1.IsEnum)(['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR'])];
            _trainingName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Training name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _provider_decorators = [(0, swagger_1.ApiProperty)({ description: 'Provider name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _cost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _managerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manager ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _requestType_decorators, { kind: "field", name: "requestType", static: false, private: false, access: { has: obj => "requestType" in obj, get: obj => obj.requestType, set: (obj, value) => { obj.requestType = value; } }, metadata: _metadata }, _requestType_initializers, _requestType_extraInitializers);
            __esDecorate(null, null, _trainingName_decorators, { kind: "field", name: "trainingName", static: false, private: false, access: { has: obj => "trainingName" in obj, get: obj => obj.trainingName, set: (obj, value) => { obj.trainingName = value; } }, metadata: _metadata }, _trainingName_initializers, _trainingName_extraInitializers);
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: obj => "managerId" in obj, get: obj => obj.managerId, set: (obj, value) => { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExternalTrainingRequestDto = CreateExternalTrainingRequestDto;
/**
 * Create tuition reimbursement DTO
 */
let CreateTuitionReimbursementDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _programName_decorators;
    let _programName_initializers = [];
    let _programName_extraInitializers = [];
    let _institution_decorators;
    let _institution_initializers = [];
    let _institution_extraInitializers = [];
    let _degreeType_decorators;
    let _degreeType_initializers = [];
    let _degreeType_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _requestedAmount_decorators;
    let _requestedAmount_initializers = [];
    let _requestedAmount_extraInitializers = [];
    return _a = class CreateTuitionReimbursementDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.programName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _programName_initializers, void 0));
                this.institution = (__runInitializers(this, _programName_extraInitializers), __runInitializers(this, _institution_initializers, void 0));
                this.degreeType = (__runInitializers(this, _institution_extraInitializers), __runInitializers(this, _degreeType_initializers, void 0));
                this.startDate = (__runInitializers(this, _degreeType_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.totalCost = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
                this.requestedAmount = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _requestedAmount_initializers, void 0));
                __runInitializers(this, _requestedAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, class_validator_1.IsUUID)()];
            _programName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Program name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _institution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Institution' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _degreeType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE'], required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE'])];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _totalCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total cost' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _requestedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _programName_decorators, { kind: "field", name: "programName", static: false, private: false, access: { has: obj => "programName" in obj, get: obj => obj.programName, set: (obj, value) => { obj.programName = value; } }, metadata: _metadata }, _programName_initializers, _programName_extraInitializers);
            __esDecorate(null, null, _institution_decorators, { kind: "field", name: "institution", static: false, private: false, access: { has: obj => "institution" in obj, get: obj => obj.institution, set: (obj, value) => { obj.institution = value; } }, metadata: _metadata }, _institution_initializers, _institution_extraInitializers);
            __esDecorate(null, null, _degreeType_decorators, { kind: "field", name: "degreeType", static: false, private: false, access: { has: obj => "degreeType" in obj, get: obj => obj.degreeType, set: (obj, value) => { obj.degreeType = value; } }, metadata: _metadata }, _degreeType_initializers, _degreeType_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
            __esDecorate(null, null, _requestedAmount_decorators, { kind: "field", name: "requestedAmount", static: false, private: false, access: { has: obj => "requestedAmount" in obj, get: obj => obj.requestedAmount, set: (obj, value) => { obj.requestedAmount = value; } }, metadata: _metadata }, _requestedAmount_initializers, _requestedAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTuitionReimbursementDto = CreateTuitionReimbursementDto;
// ============================================================================
// ZOD SCHEMAS
// ============================================================================
exports.IDPCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    planName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(5000),
    planYear: zod_1.z.number().min(2020).max(2050),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    currentRole: zod_1.z.string().min(1).max(255),
    desiredRole: zod_1.z.string().max(255).optional(),
    careerGoals: zod_1.z.array(zod_1.z.string()),
    managerIds: zod_1.z.array(zod_1.z.string().uuid()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.DevelopmentGoalCreateSchema = zod_1.z.object({
    idpId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    goalName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(2000),
    priority: zod_1.z.nativeEnum(SkillsGapPriority),
    category: zod_1.z.enum(['SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER']),
    targetLevel: zod_1.z.nativeEnum(ProficiencyLevel),
    targetDate: zod_1.z.date(),
    successCriteria: zod_1.z.array(zod_1.z.string()),
    managerId: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.CompetencyCreateSchema = zod_1.z.object({
    competencyName: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(2000),
    type: zod_1.z.nativeEnum(CompetencyType),
    category: zod_1.z.string().max(100).optional(),
    requiredForRoles: zod_1.z.array(zod_1.z.string()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.SkillsAssessmentCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    assessmentName: zod_1.z.string().min(1).max(255),
    assessmentType: zod_1.z.enum(['SELF', 'MANAGER', 'PEER', '360', 'EXPERT']),
    assessorId: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.MentoringRelationshipCreateSchema = zod_1.z.object({
    mentorId: zod_1.z.string().uuid(),
    menteeId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(MentoringType),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date().optional(),
    focusAreas: zod_1.z.array(zod_1.z.string()),
    goals: zod_1.z.array(zod_1.z.string()),
    meetingFrequency: zod_1.z.string().min(1),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.JobRotationCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    rotationName: zod_1.z.string().min(1).max(255),
    currentRole: zod_1.z.string().min(1).max(255),
    targetDepartment: zod_1.z.string().min(1).max(255),
    targetRole: zod_1.z.string().min(1).max(255),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    supervisorId: zod_1.z.string().uuid(),
    objectives: zod_1.z.array(zod_1.z.string()),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.LearningResourceCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(255),
    description: zod_1.z.string().min(1).max(2000),
    type: zod_1.z.nativeEnum(ResourceType),
    url: zod_1.z.string().url().optional(),
    difficulty: zod_1.z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    topics: zod_1.z.array(zod_1.z.string()),
    tags: zod_1.z.array(zod_1.z.string()),
    isFree: zod_1.z.boolean(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.ExternalTrainingRequestCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    requestType: zod_1.z.enum(['CONFERENCE', 'WORKSHOP', 'CERTIFICATION', 'DEGREE', 'COURSE', 'SEMINAR']),
    trainingName: zod_1.z.string().min(1).max(255),
    provider: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(2000),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    cost: zod_1.z.number().min(0),
    justification: zod_1.z.string().min(1).max(2000),
    managerId: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.TuitionReimbursementCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    programName: zod_1.z.string().min(1).max(255),
    institution: zod_1.z.string().min(1).max(255),
    degreeType: zod_1.z.enum(['CERTIFICATE', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE']).optional(),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    totalCost: zod_1.z.number().min(0),
    requestedAmount: zod_1.z.number().min(0),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Individual Development Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IDP model
 */
const createIDPModel = (sequelize) => {
    class IDP extends sequelize_1.Model {
    }
    IDP.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User ID for whom this IDP is created',
        },
        planName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'IDP plan name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'IDP description',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'under_review', 'approved', 'active', 'completed', 'cancelled', 'expired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'IDP status',
        },
        planYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Plan year',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Plan end date',
        },
        currentRole: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Current role',
        },
        desiredRole: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Desired future role',
        },
        careerGoals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Career goals',
        },
        strengths: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Identified strengths',
        },
        areasForDevelopment: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Areas for development',
        },
        goals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Development goal IDs',
        },
        managerIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Manager user IDs',
        },
        reviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Next review date',
        },
        lastReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last review date',
        },
        completionPercentage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Overall completion percentage',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved the IDP',
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
            comment: 'Additional IDP metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the IDP',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who last updated the IDP',
        },
    }, {
        sequelize,
        tableName: 'individual_development_plans',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['planYear'] },
            { fields: ['startDate'] },
            { fields: ['endDate'] },
        ],
    });
    return IDP;
};
exports.createIDPModel = createIDPModel;
/**
 * Sequelize model for Development Goal.
 */
const createDevelopmentGoalModel = (sequelize) => {
    class DevelopmentGoal extends sequelize_1.Model {
    }
    DevelopmentGoal.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        idpId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related IDP ID',
            references: {
                model: 'individual_development_plans',
                key: 'id',
            },
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User ID',
        },
        goalName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Goal name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Goal description',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('not_started', 'in_progress', 'on_track', 'at_risk', 'delayed', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'not_started',
            comment: 'Goal status',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Goal priority',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('SKILL', 'COMPETENCY', 'BEHAVIOR', 'KNOWLEDGE', 'CAREER'),
            allowNull: false,
            comment: 'Goal category',
        },
        targetCompetencyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Target competency ID',
        },
        currentLevel: {
            type: sequelize_1.DataTypes.ENUM('none', 'basic', 'intermediate', 'advanced', 'expert', 'master'),
            allowNull: true,
            comment: 'Current proficiency level',
        },
        targetLevel: {
            type: sequelize_1.DataTypes.ENUM('none', 'basic', 'intermediate', 'advanced', 'expert', 'master'),
            allowNull: false,
            comment: 'Target proficiency level',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Goal start date',
        },
        targetDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Target completion date',
        },
        completionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Actual completion date',
        },
        progress: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Progress percentage',
        },
        successCriteria: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Success criteria',
        },
        developmentActivities: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Development activities',
        },
        requiredResources: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Required resources',
        },
        supportNeeded: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Support needed description',
        },
        measurementMethod: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'Progress tracking',
            comment: 'How progress is measured',
        },
        milestones: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Goal milestones',
        },
        relatedCourseIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            comment: 'Related course IDs',
        },
        mentorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Mentor user ID',
        },
        managerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Manager user ID',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional goal metadata',
        },
    }, {
        sequelize,
        tableName: 'development_goals',
        timestamps: true,
        indexes: [
            { fields: ['idpId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['targetDate'] },
        ],
    });
    return DevelopmentGoal;
};
exports.createDevelopmentGoalModel = createDevelopmentGoalModel;
/**
 * Sequelize model for Competency.
 */
const createCompetencyModel = (sequelize) => {
    class Competency extends sequelize_1.Model {
    }
    Competency.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        competencyCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique competency code',
        },
        competencyName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Competency name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Competency description',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('technical', 'behavioral', 'leadership', 'functional', 'core', 'role_specific'),
            allowNull: false,
            comment: 'Competency type',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Competency category',
        },
        proficiencyLevels: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Proficiency level definitions',
        },
        relatedSkills: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Related skill names',
        },
        requiredForRoles: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Roles requiring this competency',
        },
        assessmentCriteria: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Assessment criteria',
        },
        developmentResources: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Development resource IDs',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED'),
            allowNull: false,
            defaultValue: 'ACTIVE',
            comment: 'Competency status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional competency metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the competency',
        },
    }, {
        sequelize,
        tableName: 'competencies',
        timestamps: true,
        indexes: [
            { fields: ['competencyCode'], unique: true },
            { fields: ['type'] },
            { fields: ['status'] },
        ],
    });
    return Competency;
};
exports.createCompetencyModel = createCompetencyModel;
/**
 * Sequelize model for Mentoring Relationship.
 */
const createMentoringRelationshipModel = (sequelize) => {
    class MentoringRelationship extends sequelize_1.Model {
    }
    MentoringRelationship.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        programId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related mentoring program ID',
        },
        mentorId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Mentor user ID',
        },
        menteeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Mentee user ID',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('formal', 'informal', 'peer', 'reverse', 'group'),
            allowNull: false,
            comment: 'Mentoring relationship type',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'active', 'on_hold', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Relationship status',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Relationship start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Relationship end date',
        },
        focusAreas: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Focus areas',
        },
        goals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Mentoring goals',
        },
        meetingFrequency: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Meeting frequency description',
        },
        preferredMeetingMode: {
            type: sequelize_1.DataTypes.ENUM('IN_PERSON', 'VIRTUAL', 'HYBRID'),
            allowNull: false,
            defaultValue: 'HYBRID',
            comment: 'Preferred meeting mode',
        },
        sessionCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of completed sessions',
        },
        lastSessionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last session date',
        },
        nextSessionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Next scheduled session date',
        },
        progressNotes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Progress notes',
        },
        feedback: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Feedback from mentor and mentee',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional relationship metadata',
        },
    }, {
        sequelize,
        tableName: 'mentoring_relationships',
        timestamps: true,
        indexes: [
            { fields: ['mentorId'] },
            { fields: ['menteeId'] },
            { fields: ['status'] },
            { fields: ['type'] },
        ],
    });
    return MentoringRelationship;
};
exports.createMentoringRelationshipModel = createMentoringRelationshipModel;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
const generateCompetencyCode = (type) => {
    const typePrefix = type.substring(0, 3).toUpperCase();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `COMP-${typePrefix}-${sequence}`;
};
const generateResourceCode = (type) => {
    const typePrefix = type.substring(0, 3).toUpperCase();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RES-${typePrefix}-${sequence}`;
};
const calculateProgress = (completed, total) => {
    if (total === 0)
        return 0;
    return Math.round((completed / total) * 100 * 100) / 100;
};
// ============================================================================
// INDIVIDUAL DEVELOPMENT PLANS (Functions 1-6)
// ============================================================================
/**
 * Creates a new Individual Development Plan.
 *
 * @param {object} idpData - IDP creation data
 * @param {string} userId - User creating the IDP
 * @returns {Promise<IndividualDevelopmentPlan>} Created IDP
 */
const createIDP = async (idpData, userId, transaction) => {
    const idp = {
        id: generateUUID(),
        userId: idpData.userId,
        planName: idpData.planName,
        description: idpData.description,
        status: IDPStatus.DRAFT,
        planYear: idpData.planYear,
        startDate: idpData.startDate,
        endDate: idpData.endDate,
        currentRole: idpData.currentRole,
        desiredRole: idpData.desiredRole,
        careerGoals: idpData.careerGoals || [],
        strengths: idpData.strengths || [],
        areasForDevelopment: idpData.areasForDevelopment || [],
        goals: [],
        managerIds: idpData.managerIds || [],
        reviewDate: undefined,
        lastReviewDate: undefined,
        completionPercentage: 0,
        approvedBy: undefined,
        approvedAt: undefined,
        metadata: {
            ...idpData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
    };
    return idp;
};
exports.createIDP = createIDP;
/**
 * Submits IDP for manager review.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User submitting
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
const submitIDPForReview = async (idpId, userId, transaction) => {
    return {
        id: idpId,
        status: IDPStatus.SUBMITTED,
        updatedBy: userId,
        updatedAt: new Date(),
        metadata: {
            submittedDate: new Date().toISOString(),
            submittedBy: userId,
        },
    };
};
exports.submitIDPForReview = submitIDPForReview;
/**
 * Approves an IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User approving
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
const approveIDP = async (idpId, userId, transaction) => {
    return {
        id: idpId,
        status: IDPStatus.APPROVED,
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.approveIDP = approveIDP;
/**
 * Activates an approved IDP.
 *
 * @param {string} idpId - IDP ID
 * @param {string} userId - User activating
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
const activateIDP = async (idpId, userId, transaction) => {
    return {
        id: idpId,
        status: IDPStatus.ACTIVE,
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.activateIDP = activateIDP;
/**
 * Updates IDP progress and completion percentage.
 *
 * @param {string} idpId - IDP ID
 * @returns {Promise<IndividualDevelopmentPlan>} Updated IDP
 */
const updateIDPProgress = async (idpId, transaction) => {
    // Implementation would calculate progress from goals
    return {
        id: idpId,
        completionPercentage: 0, // Would be calculated
        updatedAt: new Date(),
    };
};
exports.updateIDPProgress = updateIDPProgress;
/**
 * Gets user's IDPs with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<IndividualDevelopmentPlan[]>} User IDPs
 */
const getUserIDPs = async (userId, filters) => {
    return [];
};
exports.getUserIDPs = getUserIDPs;
// ============================================================================
// DEVELOPMENT GOALS (Functions 7-11)
// ============================================================================
/**
 * Creates a development goal.
 *
 * @param {object} goalData - Goal creation data
 * @param {string} userId - User creating the goal
 * @returns {Promise<DevelopmentGoal>} Created goal
 */
const createDevelopmentGoal = async (goalData, userId, transaction) => {
    const goal = {
        id: generateUUID(),
        idpId: goalData.idpId,
        userId: goalData.userId,
        goalName: goalData.goalName,
        description: goalData.description,
        status: DevelopmentGoalStatus.NOT_STARTED,
        priority: goalData.priority,
        category: goalData.category,
        targetCompetencyId: goalData.targetCompetencyId,
        currentLevel: goalData.currentLevel,
        targetLevel: goalData.targetLevel,
        startDate: goalData.startDate || new Date(),
        targetDate: goalData.targetDate,
        completionDate: undefined,
        progress: 0,
        successCriteria: goalData.successCriteria || [],
        developmentActivities: goalData.developmentActivities || [],
        requiredResources: goalData.requiredResources || [],
        supportNeeded: goalData.supportNeeded,
        measurementMethod: goalData.measurementMethod || 'Progress tracking',
        milestones: goalData.milestones || [],
        relatedCourseIds: goalData.relatedCourseIds || [],
        mentorId: goalData.mentorId,
        managerId: goalData.managerId,
        metadata: {
            ...goalData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return goal;
};
exports.createDevelopmentGoal = createDevelopmentGoal;
/**
 * Updates development goal progress.
 *
 * @param {string} goalId - Goal ID
 * @param {number} progress - Progress percentage
 * @param {string} notes - Progress notes
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
const updateGoalProgress = async (goalId, progress, notes, transaction) => {
    const status = progress === 100 ? DevelopmentGoalStatus.COMPLETED : DevelopmentGoalStatus.IN_PROGRESS;
    return {
        id: goalId,
        progress,
        status,
        completionDate: progress === 100 ? new Date() : undefined,
        updatedAt: new Date(),
    };
};
exports.updateGoalProgress = updateGoalProgress;
/**
 * Marks development goal as completed.
 *
 * @param {string} goalId - Goal ID
 * @param {string} userId - User marking completion
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
const completeGoal = async (goalId, userId, transaction) => {
    return {
        id: goalId,
        status: DevelopmentGoalStatus.COMPLETED,
        progress: 100,
        completionDate: new Date(),
        updatedAt: new Date(),
    };
};
exports.completeGoal = completeGoal;
/**
 * Associates courses with a development goal.
 *
 * @param {string} goalId - Goal ID
 * @param {string[]} courseIds - Course IDs to associate
 * @returns {Promise<DevelopmentGoal>} Updated goal
 */
const associateCoursesWithGoal = async (goalId, courseIds, transaction) => {
    return {
        id: goalId,
        relatedCourseIds: courseIds,
        updatedAt: new Date(),
    };
};
exports.associateCoursesWithGoal = associateCoursesWithGoal;
/**
 * Gets development goals for a user.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<DevelopmentGoal[]>} User goals
 */
const getUserDevelopmentGoals = async (userId, filters) => {
    return [];
};
exports.getUserDevelopmentGoals = getUserDevelopmentGoals;
// ============================================================================
// COMPETENCY FRAMEWORK (Functions 12-16)
// ============================================================================
/**
 * Creates a new competency.
 *
 * @param {object} competencyData - Competency creation data
 * @param {string} userId - User creating the competency
 * @returns {Promise<Competency>} Created competency
 */
const createCompetency = async (competencyData, userId, transaction) => {
    const competencyCode = generateCompetencyCode(competencyData.type);
    const competency = {
        id: generateUUID(),
        competencyCode,
        competencyName: competencyData.competencyName,
        description: competencyData.description,
        type: competencyData.type,
        category: competencyData.category,
        proficiencyLevels: competencyData.proficiencyLevels || [],
        relatedSkills: competencyData.relatedSkills || [],
        requiredForRoles: competencyData.requiredForRoles || [],
        assessmentCriteria: competencyData.assessmentCriteria || [],
        developmentResources: competencyData.developmentResources || [],
        status: 'ACTIVE',
        metadata: {
            ...competencyData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return competency;
};
exports.createCompetency = createCompetency;
/**
 * Updates competency proficiency levels.
 *
 * @param {string} competencyId - Competency ID
 * @param {array} proficiencyLevels - Proficiency level definitions
 * @returns {Promise<Competency>} Updated competency
 */
const updateCompetencyProficiencyLevels = async (competencyId, proficiencyLevels, transaction) => {
    return {
        id: competencyId,
        proficiencyLevels,
        updatedAt: new Date(),
    };
};
exports.updateCompetencyProficiencyLevels = updateCompetencyProficiencyLevels;
/**
 * Gets competencies by role.
 *
 * @param {string} role - Role name
 * @returns {Promise<Competency[]>} Competencies for role
 */
const getCompetenciesByRole = async (role) => {
    return [];
};
exports.getCompetenciesByRole = getCompetenciesByRole;
/**
 * Searches competencies by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<Competency[]>} Matching competencies
 */
const searchCompetencies = async (filters) => {
    return [];
};
exports.searchCompetencies = searchCompetencies;
/**
 * Creates a competency framework.
 *
 * @param {object} frameworkData - Framework creation data
 * @param {string} userId - User creating the framework
 * @returns {Promise<CompetencyFramework>} Created framework
 */
const createCompetencyFramework = async (frameworkData, userId, transaction) => {
    const framework = {
        id: generateUUID(),
        frameworkName: frameworkData.frameworkName,
        description: frameworkData.description,
        version: frameworkData.version || '1.0',
        type: frameworkData.type,
        applicableRoles: frameworkData.applicableRoles || [],
        applicableJobLevels: frameworkData.applicableJobLevels || [],
        competencies: frameworkData.competencies || [],
        status: 'DRAFT',
        effectiveDate: frameworkData.effectiveDate,
        expiryDate: frameworkData.expiryDate,
        ownerId: frameworkData.ownerId,
        metadata: {
            ...frameworkData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return framework;
};
exports.createCompetencyFramework = createCompetencyFramework;
// ============================================================================
// SKILLS ASSESSMENT & GAP ANALYSIS (Functions 17-21)
// ============================================================================
/**
 * Creates a skills assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating assessment
 * @returns {Promise<SkillsAssessment>} Created assessment
 */
const createSkillsAssessment = async (assessmentData, userId, transaction) => {
    const assessment = {
        id: generateUUID(),
        userId: assessmentData.userId,
        assessmentName: assessmentData.assessmentName,
        assessmentDate: new Date(),
        assessmentType: assessmentData.assessmentType,
        assessorId: assessmentData.assessorId,
        competencies: assessmentData.competencies || [],
        overallScore: assessmentData.overallScore,
        strengths: assessmentData.strengths || [],
        developmentAreas: assessmentData.developmentAreas || [],
        recommendations: assessmentData.recommendations || [],
        metadata: {
            ...assessmentData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return assessment;
};
exports.createSkillsAssessment = createSkillsAssessment;
/**
 * Performs skills gap analysis for a user.
 *
 * @param {string} userId - User ID
 * @param {string} targetRole - Target role
 * @returns {Promise<SkillsGapAnalysis>} Gap analysis results
 */
const performSkillsGapAnalysis = async (userId, targetRole, transaction) => {
    // Implementation would compare current vs required competencies
    const analysis = {
        id: generateUUID(),
        userId,
        targetRole,
        analysisDate: new Date(),
        gaps: [],
        overallGapScore: 0,
        criticalGaps: 0,
        recommendedCourses: [],
        recommendedMentors: [],
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return analysis;
};
exports.performSkillsGapAnalysis = performSkillsGapAnalysis;
/**
 * Identifies critical skills gaps.
 *
 * @param {string} userId - User ID
 * @returns {Promise<object[]>} Critical gaps
 */
const identifyCriticalSkillsGaps = async (userId) => {
    return [];
};
exports.identifyCriticalSkillsGaps = identifyCriticalSkillsGaps;
/**
 * Compares user competencies with role requirements.
 *
 * @param {string} userId - User ID
 * @param {string} role - Role to compare against
 * @returns {Promise<object>} Comparison results
 */
const compareUserCompetenciesWithRole = async (userId, role) => {
    return {
        matchPercentage: 0,
        matchingCompetencies: [],
        missingCompetencies: [],
        gaps: [],
    };
};
exports.compareUserCompetenciesWithRole = compareUserCompetenciesWithRole;
/**
 * Updates user competency proficiency.
 *
 * @param {string} userId - User ID
 * @param {string} competencyId - Competency ID
 * @param {ProficiencyLevel} level - New proficiency level
 * @param {string} evidence - Evidence of proficiency
 * @returns {Promise<object>} Updated proficiency
 */
const updateUserCompetencyProficiency = async (userId, competencyId, level, evidence, transaction) => {
    return {
        userId,
        competencyId,
        level,
        evidence,
        updatedAt: new Date(),
    };
};
exports.updateUserCompetencyProficiency = updateUserCompetencyProficiency;
// ============================================================================
// LEARNING RECOMMENDATIONS (Functions 22-24)
// ============================================================================
/**
 * Generates personalized learning recommendations.
 *
 * @param {string} userId - User ID
 * @param {object} options - Recommendation options
 * @returns {Promise<LearningRecommendation[]>} Recommendations
 */
const generateLearningRecommendations = async (userId, options) => {
    return [];
};
exports.generateLearningRecommendations = generateLearningRecommendations;
/**
 * Accepts a learning recommendation.
 *
 * @param {string} recommendationId - Recommendation ID
 * @param {string} userId - User accepting
 * @returns {Promise<LearningRecommendation>} Updated recommendation
 */
const acceptLearningRecommendation = async (recommendationId, userId, transaction) => {
    return {
        id: recommendationId,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.acceptLearningRecommendation = acceptLearningRecommendation;
/**
 * Gets AI-powered skill recommendations based on career goals.
 *
 * @param {string} userId - User ID
 * @param {string[]} careerGoals - User's career goals
 * @returns {Promise<object[]>} AI recommendations
 */
const getAISkillRecommendations = async (userId, careerGoals) => {
    return [];
};
exports.getAISkillRecommendations = getAISkillRecommendations;
// ============================================================================
// MENTORING & COACHING (Functions 25-29)
// ============================================================================
/**
 * Creates a mentoring relationship.
 *
 * @param {object} relationshipData - Relationship data
 * @param {string} userId - User creating relationship
 * @returns {Promise<MentoringRelationship>} Created relationship
 */
const createMentoringRelationship = async (relationshipData, userId, transaction) => {
    const relationship = {
        id: generateUUID(),
        programId: relationshipData.programId,
        mentorId: relationshipData.mentorId,
        menteeId: relationshipData.menteeId,
        type: relationshipData.type,
        status: MentoringStatus.PENDING,
        startDate: relationshipData.startDate,
        endDate: relationshipData.endDate,
        focusAreas: relationshipData.focusAreas || [],
        goals: relationshipData.goals || [],
        meetingFrequency: relationshipData.meetingFrequency,
        preferredMeetingMode: relationshipData.preferredMeetingMode || 'HYBRID',
        sessionCount: 0,
        lastSessionDate: undefined,
        nextSessionDate: undefined,
        progressNotes: [],
        feedback: {},
        metadata: {
            ...relationshipData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return relationship;
};
exports.createMentoringRelationship = createMentoringRelationship;
/**
 * Activates a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User activating
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
const activateMentoringRelationship = async (relationshipId, userId, transaction) => {
    return {
        id: relationshipId,
        status: MentoringStatus.ACTIVE,
        updatedAt: new Date(),
    };
};
exports.activateMentoringRelationship = activateMentoringRelationship;
/**
 * Records a mentoring session.
 *
 * @param {object} sessionData - Session data
 * @param {string} userId - User recording session
 * @returns {Promise<MentoringSession>} Created session
 */
const recordMentoringSession = async (sessionData, userId, transaction) => {
    const session = {
        id: generateUUID(),
        relationshipId: sessionData.relationshipId,
        sessionNumber: sessionData.sessionNumber,
        sessionDate: sessionData.sessionDate,
        duration: sessionData.duration,
        topics: sessionData.topics || [],
        objectives: sessionData.objectives || [],
        outcomes: sessionData.outcomes || [],
        actionItems: sessionData.actionItems || [],
        mentorNotes: sessionData.mentorNotes,
        menteeNotes: sessionData.menteeNotes,
        rating: sessionData.rating,
        metadata: {
            ...sessionData.metadata,
            recordedDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return session;
};
exports.recordMentoringSession = recordMentoringSession;
/**
 * Completes a mentoring relationship.
 *
 * @param {string} relationshipId - Relationship ID
 * @param {string} userId - User completing
 * @param {object} feedback - Final feedback
 * @returns {Promise<MentoringRelationship>} Updated relationship
 */
const completeMentoringRelationship = async (relationshipId, userId, feedback, transaction) => {
    return {
        id: relationshipId,
        status: MentoringStatus.COMPLETED,
        endDate: new Date(),
        feedback,
        updatedAt: new Date(),
    };
};
exports.completeMentoringRelationship = completeMentoringRelationship;
/**
 * Matches mentees with potential mentors.
 *
 * @param {string} menteeId - Mentee user ID
 * @param {object} criteria - Matching criteria
 * @returns {Promise<object[]>} Potential mentors
 */
const matchMenteeWithMentors = async (menteeId, criteria) => {
    return [];
};
exports.matchMenteeWithMentors = matchMenteeWithMentors;
// ============================================================================
// JOB ROTATION & CROSS-TRAINING (Functions 30-33)
// ============================================================================
/**
 * Creates a job rotation.
 *
 * @param {object} rotationData - Rotation data
 * @param {string} userId - User creating rotation
 * @returns {Promise<JobRotation>} Created rotation
 */
const createJobRotation = async (rotationData, userId, transaction) => {
    const duration = Math.ceil((rotationData.endDate.getTime() - rotationData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const rotation = {
        id: generateUUID(),
        userId: rotationData.userId,
        programId: rotationData.programId,
        rotationName: rotationData.rotationName,
        currentRole: rotationData.currentRole,
        targetDepartment: rotationData.targetDepartment,
        targetRole: rotationData.targetRole,
        status: JobRotationStatus.PLANNED,
        startDate: rotationData.startDate,
        endDate: rotationData.endDate,
        duration,
        objectives: rotationData.objectives || [],
        competenciesToDevelop: rotationData.competenciesToDevelop || [],
        supervisorId: rotationData.supervisorId,
        mentorId: rotationData.mentorId,
        progress: 0,
        learningOutcomes: [],
        feedback: undefined,
        rating: undefined,
        completionCertificate: false,
        metadata: {
            ...rotationData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return rotation;
};
exports.createJobRotation = createJobRotation;
/**
 * Activates a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User activating
 * @returns {Promise<JobRotation>} Updated rotation
 */
const activateJobRotation = async (rotationId, userId, transaction) => {
    return {
        id: rotationId,
        status: JobRotationStatus.ACTIVE,
        updatedAt: new Date(),
    };
};
exports.activateJobRotation = activateJobRotation;
/**
 * Updates job rotation progress.
 *
 * @param {string} rotationId - Rotation ID
 * @param {number} progress - Progress percentage
 * @param {string[]} learningOutcomes - Learning outcomes achieved
 * @returns {Promise<JobRotation>} Updated rotation
 */
const updateJobRotationProgress = async (rotationId, progress, learningOutcomes, transaction) => {
    return {
        id: rotationId,
        progress,
        learningOutcomes: learningOutcomes || [],
        updatedAt: new Date(),
    };
};
exports.updateJobRotationProgress = updateJobRotationProgress;
/**
 * Completes a job rotation.
 *
 * @param {string} rotationId - Rotation ID
 * @param {string} userId - User completing
 * @param {object} completionData - Completion data
 * @returns {Promise<JobRotation>} Updated rotation
 */
const completeJobRotation = async (rotationId, userId, completionData, transaction) => {
    return {
        id: rotationId,
        status: JobRotationStatus.COMPLETED,
        progress: 100,
        feedback: completionData.feedback,
        rating: completionData.rating,
        completionCertificate: completionData.issueCertificate || false,
        updatedAt: new Date(),
    };
};
exports.completeJobRotation = completeJobRotation;
// ============================================================================
// LEARNING RESOURCES (Functions 34-36)
// ============================================================================
/**
 * Creates a learning resource.
 *
 * @param {object} resourceData - Resource data
 * @param {string} userId - User creating resource
 * @returns {Promise<LearningResource>} Created resource
 */
const createLearningResource = async (resourceData, userId, transaction) => {
    const resourceCode = generateResourceCode(resourceData.type);
    const resource = {
        id: generateUUID(),
        resourceCode,
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        url: resourceData.url,
        author: resourceData.author,
        publisher: resourceData.publisher,
        publicationDate: resourceData.publicationDate,
        duration: resourceData.duration,
        difficulty: resourceData.difficulty,
        competencies: resourceData.competencies || [],
        topics: resourceData.topics || [],
        tags: resourceData.tags || [],
        rating: undefined,
        reviewCount: 0,
        cost: resourceData.cost,
        language: resourceData.language || 'en',
        isFree: resourceData.isFree,
        requiresApproval: resourceData.requiresApproval || false,
        status: 'ACTIVE',
        metadata: {
            ...resourceData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return resource;
};
exports.createLearningResource = createLearningResource;
/**
 * Searches learning resources.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningResource[]>} Matching resources
 */
const searchLearningResources = async (filters) => {
    return [];
};
exports.searchLearningResources = searchLearningResources;
/**
 * Rates a learning resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} userId - User rating
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Review text
 * @returns {Promise<object>} Rating record
 */
const rateLearningResource = async (resourceId, userId, rating, review, transaction) => {
    return {
        resourceId,
        userId,
        rating,
        review,
        createdAt: new Date(),
    };
};
exports.rateLearningResource = rateLearningResource;
// ============================================================================
// EXTERNAL TRAINING & TUITION (Functions 37-41)
// ============================================================================
/**
 * Creates external training request.
 *
 * @param {object} requestData - Request data
 * @param {string} userId - User creating request
 * @returns {Promise<ExternalTrainingRequest>} Created request
 */
const createExternalTrainingRequest = async (requestData, userId, transaction) => {
    const request = {
        id: generateUUID(),
        userId: requestData.userId,
        requestType: requestData.requestType,
        trainingName: requestData.trainingName,
        provider: requestData.provider,
        description: requestData.description,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        cost: requestData.cost,
        currency: requestData.currency || 'USD',
        justification: requestData.justification,
        expectedOutcomes: requestData.expectedOutcomes || [],
        relatedCompetencies: requestData.relatedCompetencies || [],
        status: 'DRAFT',
        approvalWorkflow: [],
        reimbursementEligible: requestData.reimbursementEligible || false,
        reimbursementPercentage: requestData.reimbursementPercentage,
        managerId: requestData.managerId,
        departmentId: requestData.departmentId,
        budgetCode: requestData.budgetCode,
        metadata: {
            ...requestData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return request;
};
exports.createExternalTrainingRequest = createExternalTrainingRequest;
/**
 * Submits external training request for approval.
 *
 * @param {string} requestId - Request ID
 * @param {string} userId - User submitting
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
const submitExternalTrainingRequest = async (requestId, userId, transaction) => {
    return {
        id: requestId,
        status: 'SUBMITTED',
        updatedAt: new Date(),
    };
};
exports.submitExternalTrainingRequest = submitExternalTrainingRequest;
/**
 * Approves external training request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {string} comments - Approval comments
 * @returns {Promise<ExternalTrainingRequest>} Updated request
 */
const approveExternalTrainingRequest = async (requestId, approverId, comments, transaction) => {
    return {
        id: requestId,
        status: 'APPROVED',
        updatedAt: new Date(),
    };
};
exports.approveExternalTrainingRequest = approveExternalTrainingRequest;
/**
 * Creates tuition reimbursement request.
 *
 * @param {object} reimbursementData - Reimbursement data
 * @param {string} userId - User creating request
 * @returns {Promise<TuitionReimbursement>} Created request
 */
const createTuitionReimbursementRequest = async (reimbursementData, userId, transaction) => {
    const request = {
        id: generateUUID(),
        userId: reimbursementData.userId,
        externalTrainingId: reimbursementData.externalTrainingId,
        programName: reimbursementData.programName,
        institution: reimbursementData.institution,
        degreeType: reimbursementData.degreeType,
        startDate: reimbursementData.startDate,
        endDate: reimbursementData.endDate,
        totalCost: reimbursementData.totalCost,
        requestedAmount: reimbursementData.requestedAmount,
        approvedAmount: undefined,
        currency: reimbursementData.currency || 'USD',
        status: ReimbursementStatus.DRAFT,
        proofOfEnrollment: undefined,
        proofOfPayment: undefined,
        grade: undefined,
        passingGradeRequired: reimbursementData.passingGradeRequired || true,
        serviceCommitmentMonths: reimbursementData.serviceCommitmentMonths,
        approvalWorkflow: [],
        paymentDate: undefined,
        metadata: {
            ...reimbursementData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return request;
};
exports.createTuitionReimbursementRequest = createTuitionReimbursementRequest;
/**
 * Processes tuition reimbursement payment.
 *
 * @param {string} reimbursementId - Reimbursement ID
 * @param {number} amount - Payment amount
 * @param {string} userId - User processing payment
 * @returns {Promise<TuitionReimbursement>} Updated reimbursement
 */
const processTuitionReimbursementPayment = async (reimbursementId, amount, userId, transaction) => {
    return {
        id: reimbursementId,
        approvedAmount: amount,
        status: ReimbursementStatus.PAID,
        paymentDate: new Date(),
        updatedAt: new Date(),
    };
};
exports.processTuitionReimbursementPayment = processTuitionReimbursementPayment;
// ============================================================================
// PROFESSIONAL DEVELOPMENT BUDGETS (Functions 42-43)
// ============================================================================
/**
 * Initializes professional development budget for user.
 *
 * @param {string} userId - User ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} allocatedBudget - Allocated budget amount
 * @returns {Promise<ProfessionalDevelopmentBudget>} Created budget
 */
const initializeDevelopmentBudget = async (userId, fiscalYear, allocatedBudget, transaction) => {
    const budget = {
        id: generateUUID(),
        userId,
        departmentId: undefined,
        fiscalYear,
        allocatedBudget,
        spentBudget: 0,
        committedBudget: 0,
        availableBudget: allocatedBudget,
        currency: 'USD',
        budgetItems: [],
        approvalRequired: true,
        approverId: undefined,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return budget;
};
exports.initializeDevelopmentBudget = initializeDevelopmentBudget;
/**
 * Tracks budget expenditure.
 *
 * @param {string} budgetId - Budget ID
 * @param {object} expenditure - Expenditure details
 * @returns {Promise<ProfessionalDevelopmentBudget>} Updated budget
 */
const trackBudgetExpenditure = async (budgetId, expenditure, transaction) => {
    return {
        id: budgetId,
        updatedAt: new Date(),
    };
};
exports.trackBudgetExpenditure = trackBudgetExpenditure;
// ============================================================================
// DEVELOPMENT MILESTONES (Functions 44-45)
// ============================================================================
/**
 * Creates a development milestone.
 *
 * @param {object} milestoneData - Milestone data
 * @param {string} userId - User creating milestone
 * @returns {Promise<DevelopmentMilestone>} Created milestone
 */
const createDevelopmentMilestone = async (milestoneData, userId, transaction) => {
    const milestone = {
        id: generateUUID(),
        userId: milestoneData.userId,
        idpId: milestoneData.idpId,
        goalId: milestoneData.goalId,
        milestoneName: milestoneData.milestoneName,
        description: milestoneData.description,
        category: milestoneData.category,
        targetDate: milestoneData.targetDate,
        completionDate: undefined,
        status: 'NOT_STARTED',
        evidence: undefined,
        validatedBy: undefined,
        validatedAt: undefined,
        reward: milestoneData.reward,
        metadata: {
            ...milestoneData.metadata,
            createdDate: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return milestone;
};
exports.createDevelopmentMilestone = createDevelopmentMilestone;
/**
 * Completes and validates a development milestone.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {string} userId - User completing
 * @param {string} validatorId - Validator user ID
 * @param {string} evidence - Evidence of completion
 * @returns {Promise<DevelopmentMilestone>} Updated milestone
 */
const completeDevelopmentMilestone = async (milestoneId, userId, validatorId, evidence, transaction) => {
    return {
        id: milestoneId,
        status: 'COMPLETED',
        completionDate: new Date(),
        evidence,
        validatedBy: validatorId,
        validatedAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.completeDevelopmentMilestone = completeDevelopmentMilestone;
// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================
/**
 * Example NestJS Controller for Development Planning
 */
let DevelopmentPlanningController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Development Planning'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('development')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createIDPEndpoint_decorators;
    let _createGoal_decorators;
    let _createCompetencyEndpoint_decorators;
    let _createAssessment_decorators;
    let _performGapAnalysis_decorators;
    let _getRecommendations_decorators;
    let _createMentoring_decorators;
    let _createRotation_decorators;
    var DevelopmentPlanningController = _classThis = class {
        async createIDPEndpoint(dto) {
            return await (0, exports.createIDP)(dto, 'system-user');
        }
        async createGoal(dto) {
            return await (0, exports.createDevelopmentGoal)(dto, 'system-user');
        }
        async createCompetencyEndpoint(dto) {
            return await (0, exports.createCompetency)(dto, 'system-user');
        }
        async createAssessment(dto) {
            return await (0, exports.createSkillsAssessment)(dto, 'system-user');
        }
        async performGapAnalysis(userId, targetRole) {
            return await (0, exports.performSkillsGapAnalysis)(userId, targetRole);
        }
        async getRecommendations(userId) {
            return await (0, exports.generateLearningRecommendations)(userId);
        }
        async createMentoring(dto) {
            return await (0, exports.createMentoringRelationship)(dto, 'system-user');
        }
        async createRotation(dto) {
            return await (0, exports.createJobRotation)(dto, 'system-user');
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "DevelopmentPlanningController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createIDPEndpoint_decorators = [(0, common_1.Post)('idps'), (0, swagger_1.ApiOperation)({ summary: 'Create Individual Development Plan' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'IDP created successfully' })];
        _createGoal_decorators = [(0, common_1.Post)('goals'), (0, swagger_1.ApiOperation)({ summary: 'Create development goal' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Goal created successfully' })];
        _createCompetencyEndpoint_decorators = [(0, common_1.Post)('competencies'), (0, swagger_1.ApiOperation)({ summary: 'Create competency' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Competency created successfully' })];
        _createAssessment_decorators = [(0, common_1.Post)('assessments'), (0, swagger_1.ApiOperation)({ summary: 'Create skills assessment' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment created successfully' })];
        _performGapAnalysis_decorators = [(0, common_1.Post)('gap-analysis/:userId'), (0, swagger_1.ApiOperation)({ summary: 'Perform skills gap analysis' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' })];
        _getRecommendations_decorators = [(0, common_1.Get)('recommendations/:userId'), (0, swagger_1.ApiOperation)({ summary: 'Get learning recommendations' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' })];
        _createMentoring_decorators = [(0, common_1.Post)('mentoring'), (0, swagger_1.ApiOperation)({ summary: 'Create mentoring relationship' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Mentoring relationship created successfully' })];
        _createRotation_decorators = [(0, common_1.Post)('job-rotations'), (0, swagger_1.ApiOperation)({ summary: 'Create job rotation' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Job rotation created successfully' })];
        __esDecorate(_classThis, null, _createIDPEndpoint_decorators, { kind: "method", name: "createIDPEndpoint", static: false, private: false, access: { has: obj => "createIDPEndpoint" in obj, get: obj => obj.createIDPEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGoal_decorators, { kind: "method", name: "createGoal", static: false, private: false, access: { has: obj => "createGoal" in obj, get: obj => obj.createGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCompetencyEndpoint_decorators, { kind: "method", name: "createCompetencyEndpoint", static: false, private: false, access: { has: obj => "createCompetencyEndpoint" in obj, get: obj => obj.createCompetencyEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAssessment_decorators, { kind: "method", name: "createAssessment", static: false, private: false, access: { has: obj => "createAssessment" in obj, get: obj => obj.createAssessment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _performGapAnalysis_decorators, { kind: "method", name: "performGapAnalysis", static: false, private: false, access: { has: obj => "performGapAnalysis" in obj, get: obj => obj.performGapAnalysis }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecommendations_decorators, { kind: "method", name: "getRecommendations", static: false, private: false, access: { has: obj => "getRecommendations" in obj, get: obj => obj.getRecommendations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMentoring_decorators, { kind: "method", name: "createMentoring", static: false, private: false, access: { has: obj => "createMentoring" in obj, get: obj => obj.createMentoring }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRotation_decorators, { kind: "method", name: "createRotation", static: false, private: false, access: { has: obj => "createRotation" in obj, get: obj => obj.createRotation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DevelopmentPlanningController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DevelopmentPlanningController = _classThis;
})();
exports.DevelopmentPlanningController = DevelopmentPlanningController;
//# sourceMappingURL=development-planning-kit.js.map