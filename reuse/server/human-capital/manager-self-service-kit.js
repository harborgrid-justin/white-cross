"use strict";
/**
 * LOC: HCMMSS1234567
 * File: /reuse/server/human-capital/manager-self-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ./employee-self-service-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Manager portal controllers
 *   - Mobile management applications
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
exports.ManagerSelfServiceController = exports.CreateDelegationDto = exports.ScheduleOneOnOneDto = exports.AssignLearningCourseDto = exports.CreateCompensationChangeDto = exports.ScheduleInterviewDto = exports.UpdateCandidateStatusDto = exports.CreateJobRequisitionDto = exports.CompetencyRatingDto = exports.SubmitPerformanceReviewDto = exports.CreateTeamGoalDto = exports.ApprovalDecisionDto = exports.DelegationType = exports.MeetingStatus = exports.CompensationChangeType = exports.OnboardingTaskStatus = exports.CandidateStatus = exports.RequisitionStatus = exports.PerformanceRating = exports.PerformanceReviewCycleStatus = exports.ApprovalType = exports.ApprovalStatus = void 0;
exports.getTeamOverview = getTeamOverview;
exports.getDirectReports = getDirectReports;
exports.getIndirectReports = getIndirectReports;
exports.getTeamMemberDetails = getTeamMemberDetails;
exports.getPendingApprovals = getPendingApprovals;
exports.approveRequest = approveRequest;
exports.rejectRequest = rejectRequest;
exports.escalateRequest = escalateRequest;
exports.bulkApproveRequests = bulkApproveRequests;
exports.getEmployeeApprovalHistory = getEmployeeApprovalHistory;
exports.getApprovalMetrics = getApprovalMetrics;
exports.sendApprovalReminder = sendApprovalReminder;
exports.getTeamPerformanceReviews = getTeamPerformanceReviews;
exports.submitManagerPerformanceReview = submitManagerPerformanceReview;
exports.initiateCalibrationSession = initiateCalibrationSession;
exports.updateCalibrationRating = updateCalibrationRating;
exports.getTeamPerformanceDistribution = getTeamPerformanceDistribution;
exports.exportPerformanceReviews = exportPerformanceReviews;
exports.createTeamGoal = createTeamGoal;
exports.getTeamGoals = getTeamGoals;
exports.updateTeamGoalProgress = updateTeamGoalProgress;
exports.assignTeamMemberToGoal = assignTeamMemberToGoal;
exports.createJobRequisition = createJobRequisition;
exports.submitJobRequisition = submitJobRequisition;
exports.getCandidatesForRequisition = getCandidatesForRequisition;
exports.updateCandidateStatus = updateCandidateStatus;
exports.scheduleInterview = scheduleInterview;
exports.getTeamOnboardingChecklists = getTeamOnboardingChecklists;
exports.createOnboardingChecklist = createOnboardingChecklist;
exports.updateOnboardingTaskStatus = updateOnboardingTaskStatus;
exports.assignBuddy = assignBuddy;
exports.getTeamSchedule = getTeamSchedule;
exports.getTeamAvailability = getTeamAvailability;
exports.getTeamTimeOffCalendar = getTeamTimeOffCalendar;
exports.checkTeamCoverage = checkTeamCoverage;
exports.createCompensationChangeRequest = createCompensationChangeRequest;
exports.getCompensationChangeRequests = getCompensationChangeRequests;
exports.calculateCompensationBudgetImpact = calculateCompensationBudgetImpact;
exports.getCompensationEquityAnalysis = getCompensationEquityAnalysis;
exports.assignLearningCourse = assignLearningCourse;
exports.getTeamLearningAssignments = getTeamLearningAssignments;
exports.getTeamLearningCompletionRate = getTeamLearningCompletionRate;
exports.scheduleOneOnOne = scheduleOneOnOne;
exports.getUpcomingOneOnOnes = getUpcomingOneOnOnes;
exports.completeOneOnOne = completeOneOnOne;
exports.getOneOnOneHistory = getOneOnOneHistory;
exports.getTeamAnalytics = getTeamAnalytics;
exports.getTeamProductivityMetrics = getTeamProductivityMetrics;
exports.createDelegation = createDelegation;
exports.getActiveDelegations = getActiveDelegations;
exports.revokeDelegation = revokeDelegation;
exports.getDelegatedTasks = getDelegatedTasks;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["WITHDRAWN"] = "withdrawn";
    ApprovalStatus["ESCALATED"] = "escalated";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Approval types
 */
var ApprovalType;
(function (ApprovalType) {
    ApprovalType["TIME_OFF"] = "time_off";
    ApprovalType["EXPENSE"] = "expense";
    ApprovalType["TIMESHEET"] = "timesheet";
    ApprovalType["REQUISITION"] = "requisition";
    ApprovalType["COMPENSATION_CHANGE"] = "compensation_change";
    ApprovalType["PROMOTION"] = "promotion";
    ApprovalType["TRANSFER"] = "transfer";
    ApprovalType["HIRE"] = "hire";
    ApprovalType["TERMINATION"] = "termination";
})(ApprovalType || (exports.ApprovalType = ApprovalType = {}));
/**
 * Performance review cycle status
 */
var PerformanceReviewCycleStatus;
(function (PerformanceReviewCycleStatus) {
    PerformanceReviewCycleStatus["NOT_STARTED"] = "not_started";
    PerformanceReviewCycleStatus["SELF_ASSESSMENT"] = "self_assessment";
    PerformanceReviewCycleStatus["MANAGER_REVIEW"] = "manager_review";
    PerformanceReviewCycleStatus["CALIBRATION"] = "calibration";
    PerformanceReviewCycleStatus["COMPLETED"] = "completed";
    PerformanceReviewCycleStatus["CLOSED"] = "closed";
})(PerformanceReviewCycleStatus || (exports.PerformanceReviewCycleStatus = PerformanceReviewCycleStatus = {}));
/**
 * Performance rating scale
 */
var PerformanceRating;
(function (PerformanceRating) {
    PerformanceRating["EXCEEDS_EXPECTATIONS"] = "exceeds_expectations";
    PerformanceRating["MEETS_EXPECTATIONS"] = "meets_expectations";
    PerformanceRating["NEEDS_IMPROVEMENT"] = "needs_improvement";
    PerformanceRating["UNSATISFACTORY"] = "unsatisfactory";
    PerformanceRating["OUTSTANDING"] = "outstanding";
})(PerformanceRating || (exports.PerformanceRating = PerformanceRating = {}));
/**
 * Requisition status
 */
var RequisitionStatus;
(function (RequisitionStatus) {
    RequisitionStatus["DRAFT"] = "draft";
    RequisitionStatus["SUBMITTED"] = "submitted";
    RequisitionStatus["APPROVED"] = "approved";
    RequisitionStatus["REJECTED"] = "rejected";
    RequisitionStatus["ON_HOLD"] = "on_hold";
    RequisitionStatus["FILLED"] = "filled";
    RequisitionStatus["CANCELLED"] = "cancelled";
})(RequisitionStatus || (exports.RequisitionStatus = RequisitionStatus = {}));
/**
 * Candidate status
 */
var CandidateStatus;
(function (CandidateStatus) {
    CandidateStatus["NEW"] = "new";
    CandidateStatus["SCREENING"] = "screening";
    CandidateStatus["INTERVIEWING"] = "interviewing";
    CandidateStatus["OFFER_EXTENDED"] = "offer_extended";
    CandidateStatus["OFFER_ACCEPTED"] = "offer_accepted";
    CandidateStatus["OFFER_REJECTED"] = "offer_rejected";
    CandidateStatus["HIRED"] = "hired";
    CandidateStatus["REJECTED"] = "rejected";
    CandidateStatus["WITHDRAWN"] = "withdrawn";
})(CandidateStatus || (exports.CandidateStatus = CandidateStatus = {}));
/**
 * Onboarding task status
 */
var OnboardingTaskStatus;
(function (OnboardingTaskStatus) {
    OnboardingTaskStatus["NOT_STARTED"] = "not_started";
    OnboardingTaskStatus["IN_PROGRESS"] = "in_progress";
    OnboardingTaskStatus["COMPLETED"] = "completed";
    OnboardingTaskStatus["OVERDUE"] = "overdue";
    OnboardingTaskStatus["SKIPPED"] = "skipped";
})(OnboardingTaskStatus || (exports.OnboardingTaskStatus = OnboardingTaskStatus = {}));
/**
 * Compensation change type
 */
var CompensationChangeType;
(function (CompensationChangeType) {
    CompensationChangeType["MERIT_INCREASE"] = "merit_increase";
    CompensationChangeType["PROMOTION"] = "promotion";
    CompensationChangeType["MARKET_ADJUSTMENT"] = "market_adjustment";
    CompensationChangeType["COST_OF_LIVING"] = "cost_of_living";
    CompensationChangeType["BONUS"] = "bonus";
    CompensationChangeType["EQUITY"] = "equity";
    CompensationChangeType["OTHER"] = "other";
})(CompensationChangeType || (exports.CompensationChangeType = CompensationChangeType = {}));
/**
 * Meeting status
 */
var MeetingStatus;
(function (MeetingStatus) {
    MeetingStatus["SCHEDULED"] = "scheduled";
    MeetingStatus["COMPLETED"] = "completed";
    MeetingStatus["CANCELLED"] = "cancelled";
    MeetingStatus["RESCHEDULED"] = "rescheduled";
    MeetingStatus["NO_SHOW"] = "no_show";
})(MeetingStatus || (exports.MeetingStatus = MeetingStatus = {}));
/**
 * Delegation type
 */
var DelegationType;
(function (DelegationType) {
    DelegationType["APPROVALS"] = "approvals";
    DelegationType["REPORTING"] = "reporting";
    DelegationType["TEAM_MANAGEMENT"] = "team_management";
    DelegationType["ALL"] = "all";
})(DelegationType || (exports.DelegationType = DelegationType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * DTO for approval decision
 */
let ApprovalDecisionDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _rejectedReason_decorators;
    let _rejectedReason_initializers = [];
    let _rejectedReason_extraInitializers = [];
    return _a = class ApprovalDecisionDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.comments = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                this.rejectedReason = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _rejectedReason_initializers, void 0));
                __runInitializers(this, _rejectedReason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(ApprovalStatus)];
            _comments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _rejectedReason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            __esDecorate(null, null, _rejectedReason_decorators, { kind: "field", name: "rejectedReason", static: false, private: false, access: { has: obj => "rejectedReason" in obj, get: obj => obj.rejectedReason, set: (obj, value) => { obj.rejectedReason = value; } }, metadata: _metadata }, _rejectedReason_initializers, _rejectedReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalDecisionDto = ApprovalDecisionDto;
/**
 * DTO for creating team goal
 */
let CreateTeamGoalDto = (() => {
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
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _targetDate_decorators;
    let _targetDate_initializers = [];
    let _targetDate_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    let _teamMembers_decorators;
    let _teamMembers_initializers = [];
    let _teamMembers_extraInitializers = [];
    return _a = class CreateTeamGoalDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.startDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.targetDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _targetDate_initializers, void 0));
                this.metrics = (__runInitializers(this, _targetDate_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
                this.teamMembers = (__runInitializers(this, _metrics_extraInitializers), __runInitializers(this, _teamMembers_initializers, void 0));
                __runInitializers(this, _teamMembers_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _category_decorators = [(0, class_validator_1.IsEnum)(['team_performance', 'department_objective', 'strategic_initiative'])];
            _priority_decorators = [(0, class_validator_1.IsEnum)(['low', 'medium', 'high', 'critical'])];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _targetDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metrics_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(1000)];
            _teamMembers_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _targetDate_decorators, { kind: "field", name: "targetDate", static: false, private: false, access: { has: obj => "targetDate" in obj, get: obj => obj.targetDate, set: (obj, value) => { obj.targetDate = value; } }, metadata: _metadata }, _targetDate_initializers, _targetDate_extraInitializers);
            __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
            __esDecorate(null, null, _teamMembers_decorators, { kind: "field", name: "teamMembers", static: false, private: false, access: { has: obj => "teamMembers" in obj, get: obj => obj.teamMembers, set: (obj, value) => { obj.teamMembers = value; } }, metadata: _metadata }, _teamMembers_initializers, _teamMembers_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTeamGoalDto = CreateTeamGoalDto;
/**
 * DTO for submitting performance review
 */
let SubmitPerformanceReviewDto = (() => {
    var _a;
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    let _competencyRatings_decorators;
    let _competencyRatings_initializers = [];
    let _competencyRatings_extraInitializers = [];
    let _achievements_decorators;
    let _achievements_initializers = [];
    let _achievements_extraInitializers = [];
    let _areasForImprovement_decorators;
    let _areasForImprovement_initializers = [];
    let _areasForImprovement_extraInitializers = [];
    let _developmentPlan_decorators;
    let _developmentPlan_initializers = [];
    let _developmentPlan_extraInitializers = [];
    let _managerComments_decorators;
    let _managerComments_initializers = [];
    let _managerComments_extraInitializers = [];
    return _a = class SubmitPerformanceReviewDto {
            constructor() {
                this.overallRating = __runInitializers(this, _overallRating_initializers, void 0);
                this.competencyRatings = (__runInitializers(this, _overallRating_extraInitializers), __runInitializers(this, _competencyRatings_initializers, void 0));
                this.achievements = (__runInitializers(this, _competencyRatings_extraInitializers), __runInitializers(this, _achievements_initializers, void 0));
                this.areasForImprovement = (__runInitializers(this, _achievements_extraInitializers), __runInitializers(this, _areasForImprovement_initializers, void 0));
                this.developmentPlan = (__runInitializers(this, _areasForImprovement_extraInitializers), __runInitializers(this, _developmentPlan_initializers, void 0));
                this.managerComments = (__runInitializers(this, _developmentPlan_extraInitializers), __runInitializers(this, _managerComments_initializers, void 0));
                __runInitializers(this, _managerComments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _overallRating_decorators = [(0, class_validator_1.IsEnum)(PerformanceRating)];
            _competencyRatings_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => CompetencyRatingDto)];
            _achievements_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _areasForImprovement_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _developmentPlan_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _managerComments_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
            __esDecorate(null, null, _competencyRatings_decorators, { kind: "field", name: "competencyRatings", static: false, private: false, access: { has: obj => "competencyRatings" in obj, get: obj => obj.competencyRatings, set: (obj, value) => { obj.competencyRatings = value; } }, metadata: _metadata }, _competencyRatings_initializers, _competencyRatings_extraInitializers);
            __esDecorate(null, null, _achievements_decorators, { kind: "field", name: "achievements", static: false, private: false, access: { has: obj => "achievements" in obj, get: obj => obj.achievements, set: (obj, value) => { obj.achievements = value; } }, metadata: _metadata }, _achievements_initializers, _achievements_extraInitializers);
            __esDecorate(null, null, _areasForImprovement_decorators, { kind: "field", name: "areasForImprovement", static: false, private: false, access: { has: obj => "areasForImprovement" in obj, get: obj => obj.areasForImprovement, set: (obj, value) => { obj.areasForImprovement = value; } }, metadata: _metadata }, _areasForImprovement_initializers, _areasForImprovement_extraInitializers);
            __esDecorate(null, null, _developmentPlan_decorators, { kind: "field", name: "developmentPlan", static: false, private: false, access: { has: obj => "developmentPlan" in obj, get: obj => obj.developmentPlan, set: (obj, value) => { obj.developmentPlan = value; } }, metadata: _metadata }, _developmentPlan_initializers, _developmentPlan_extraInitializers);
            __esDecorate(null, null, _managerComments_decorators, { kind: "field", name: "managerComments", static: false, private: false, access: { has: obj => "managerComments" in obj, get: obj => obj.managerComments, set: (obj, value) => { obj.managerComments = value; } }, metadata: _metadata }, _managerComments_initializers, _managerComments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SubmitPerformanceReviewDto = SubmitPerformanceReviewDto;
/**
 * DTO for competency rating
 */
let CompetencyRatingDto = (() => {
    var _a;
    let _competency_decorators;
    let _competency_initializers = [];
    let _competency_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class CompetencyRatingDto {
            constructor() {
                this.competency = __runInitializers(this, _competency_initializers, void 0);
                this.rating = (__runInitializers(this, _competency_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.comments = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _competency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _rating_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(5)];
            _comments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _competency_decorators, { kind: "field", name: "competency", static: false, private: false, access: { has: obj => "competency" in obj, get: obj => obj.competency, set: (obj, value) => { obj.competency = value; } }, metadata: _metadata }, _competency_initializers, _competency_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CompetencyRatingDto = CompetencyRatingDto;
/**
 * DTO for creating job requisition
 */
let CreateJobRequisitionDto = (() => {
    var _a;
    let _jobTitle_decorators;
    let _jobTitle_initializers = [];
    let _jobTitle_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _employmentType_decorators;
    let _employmentType_initializers = [];
    let _employmentType_extraInitializers = [];
    let _openPositions_decorators;
    let _openPositions_initializers = [];
    let _openPositions_extraInitializers = [];
    let _jobDescription_decorators;
    let _jobDescription_initializers = [];
    let _jobDescription_extraInitializers = [];
    let _requirements_decorators;
    let _requirements_initializers = [];
    let _requirements_extraInitializers = [];
    let _preferredQualifications_decorators;
    let _preferredQualifications_initializers = [];
    let _preferredQualifications_extraInitializers = [];
    let _salaryRangeMin_decorators;
    let _salaryRangeMin_initializers = [];
    let _salaryRangeMin_extraInitializers = [];
    let _salaryRangeMax_decorators;
    let _salaryRangeMax_initializers = [];
    let _salaryRangeMax_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class CreateJobRequisitionDto {
            constructor() {
                this.jobTitle = __runInitializers(this, _jobTitle_initializers, void 0);
                this.department = (__runInitializers(this, _jobTitle_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.location = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.employmentType = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _employmentType_initializers, void 0));
                this.openPositions = (__runInitializers(this, _employmentType_extraInitializers), __runInitializers(this, _openPositions_initializers, void 0));
                this.jobDescription = (__runInitializers(this, _openPositions_extraInitializers), __runInitializers(this, _jobDescription_initializers, void 0));
                this.requirements = (__runInitializers(this, _jobDescription_extraInitializers), __runInitializers(this, _requirements_initializers, void 0));
                this.preferredQualifications = (__runInitializers(this, _requirements_extraInitializers), __runInitializers(this, _preferredQualifications_initializers, void 0));
                this.salaryRangeMin = (__runInitializers(this, _preferredQualifications_extraInitializers), __runInitializers(this, _salaryRangeMin_initializers, void 0));
                this.salaryRangeMax = (__runInitializers(this, _salaryRangeMin_extraInitializers), __runInitializers(this, _salaryRangeMax_initializers, void 0));
                this.currency = (__runInitializers(this, _salaryRangeMax_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jobTitle_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _department_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _location_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _employmentType_decorators = [(0, class_validator_1.IsEnum)(['full_time', 'part_time', 'contractor', 'intern'])];
            _openPositions_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _jobDescription_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _requirements_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _preferredQualifications_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _salaryRangeMin_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _salaryRangeMax_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            __esDecorate(null, null, _jobTitle_decorators, { kind: "field", name: "jobTitle", static: false, private: false, access: { has: obj => "jobTitle" in obj, get: obj => obj.jobTitle, set: (obj, value) => { obj.jobTitle = value; } }, metadata: _metadata }, _jobTitle_initializers, _jobTitle_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _employmentType_decorators, { kind: "field", name: "employmentType", static: false, private: false, access: { has: obj => "employmentType" in obj, get: obj => obj.employmentType, set: (obj, value) => { obj.employmentType = value; } }, metadata: _metadata }, _employmentType_initializers, _employmentType_extraInitializers);
            __esDecorate(null, null, _openPositions_decorators, { kind: "field", name: "openPositions", static: false, private: false, access: { has: obj => "openPositions" in obj, get: obj => obj.openPositions, set: (obj, value) => { obj.openPositions = value; } }, metadata: _metadata }, _openPositions_initializers, _openPositions_extraInitializers);
            __esDecorate(null, null, _jobDescription_decorators, { kind: "field", name: "jobDescription", static: false, private: false, access: { has: obj => "jobDescription" in obj, get: obj => obj.jobDescription, set: (obj, value) => { obj.jobDescription = value; } }, metadata: _metadata }, _jobDescription_initializers, _jobDescription_extraInitializers);
            __esDecorate(null, null, _requirements_decorators, { kind: "field", name: "requirements", static: false, private: false, access: { has: obj => "requirements" in obj, get: obj => obj.requirements, set: (obj, value) => { obj.requirements = value; } }, metadata: _metadata }, _requirements_initializers, _requirements_extraInitializers);
            __esDecorate(null, null, _preferredQualifications_decorators, { kind: "field", name: "preferredQualifications", static: false, private: false, access: { has: obj => "preferredQualifications" in obj, get: obj => obj.preferredQualifications, set: (obj, value) => { obj.preferredQualifications = value; } }, metadata: _metadata }, _preferredQualifications_initializers, _preferredQualifications_extraInitializers);
            __esDecorate(null, null, _salaryRangeMin_decorators, { kind: "field", name: "salaryRangeMin", static: false, private: false, access: { has: obj => "salaryRangeMin" in obj, get: obj => obj.salaryRangeMin, set: (obj, value) => { obj.salaryRangeMin = value; } }, metadata: _metadata }, _salaryRangeMin_initializers, _salaryRangeMin_extraInitializers);
            __esDecorate(null, null, _salaryRangeMax_decorators, { kind: "field", name: "salaryRangeMax", static: false, private: false, access: { has: obj => "salaryRangeMax" in obj, get: obj => obj.salaryRangeMax, set: (obj, value) => { obj.salaryRangeMax = value; } }, metadata: _metadata }, _salaryRangeMax_initializers, _salaryRangeMax_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateJobRequisitionDto = CreateJobRequisitionDto;
/**
 * DTO for updating candidate status
 */
let UpdateCandidateStatusDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    return _a = class UpdateCandidateStatusDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.rejectionReason = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
                __runInitializers(this, _rejectionReason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(CandidateStatus)];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _rejectionReason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateCandidateStatusDto = UpdateCandidateStatusDto;
/**
 * DTO for scheduling interview
 */
let ScheduleInterviewDto = (() => {
    var _a;
    let _interviewType_decorators;
    let _interviewType_initializers = [];
    let _interviewType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _interviewers_decorators;
    let _interviewers_initializers = [];
    let _interviewers_extraInitializers = [];
    return _a = class ScheduleInterviewDto {
            constructor() {
                this.interviewType = __runInitializers(this, _interviewType_initializers, void 0);
                this.scheduledDate = (__runInitializers(this, _interviewType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.interviewers = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _interviewers_initializers, void 0));
                __runInitializers(this, _interviewers_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _interviewType_decorators = [(0, class_validator_1.IsEnum)(['phone_screen', 'technical', 'behavioral', 'panel', 'final'])];
            _scheduledDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _interviewers_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _interviewType_decorators, { kind: "field", name: "interviewType", static: false, private: false, access: { has: obj => "interviewType" in obj, get: obj => obj.interviewType, set: (obj, value) => { obj.interviewType = value; } }, metadata: _metadata }, _interviewType_initializers, _interviewType_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _interviewers_decorators, { kind: "field", name: "interviewers", static: false, private: false, access: { has: obj => "interviewers" in obj, get: obj => obj.interviewers, set: (obj, value) => { obj.interviewers = value; } }, metadata: _metadata }, _interviewers_initializers, _interviewers_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ScheduleInterviewDto = ScheduleInterviewDto;
/**
 * DTO for compensation change request
 */
let CreateCompensationChangeDto = (() => {
    var _a;
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _proposedSalary_decorators;
    let _proposedSalary_initializers = [];
    let _proposedSalary_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    return _a = class CreateCompensationChangeDto {
            constructor() {
                this.changeType = __runInitializers(this, _changeType_initializers, void 0);
                this.proposedSalary = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _proposedSalary_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _proposedSalary_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.justification = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                __runInitializers(this, _justification_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _changeType_decorators = [(0, class_validator_1.IsEnum)(CompensationChangeType)];
            _proposedSalary_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _effectiveDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _justification_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
            __esDecorate(null, null, _proposedSalary_decorators, { kind: "field", name: "proposedSalary", static: false, private: false, access: { has: obj => "proposedSalary" in obj, get: obj => obj.proposedSalary, set: (obj, value) => { obj.proposedSalary = value; } }, metadata: _metadata }, _proposedSalary_initializers, _proposedSalary_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompensationChangeDto = CreateCompensationChangeDto;
/**
 * DTO for learning assignment
 */
let AssignLearningCourseDto = (() => {
    var _a;
    let _courseId_decorators;
    let _courseId_initializers = [];
    let _courseId_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _isRequired_decorators;
    let _isRequired_initializers = [];
    let _isRequired_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class AssignLearningCourseDto {
            constructor() {
                this.courseId = __runInitializers(this, _courseId_initializers, void 0);
                this.dueDate = (__runInitializers(this, _courseId_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.isRequired = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _isRequired_initializers, void 0));
                this.reason = (__runInitializers(this, _isRequired_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _courseId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _dueDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _isRequired_decorators = [(0, class_validator_1.IsBoolean)()];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _courseId_decorators, { kind: "field", name: "courseId", static: false, private: false, access: { has: obj => "courseId" in obj, get: obj => obj.courseId, set: (obj, value) => { obj.courseId = value; } }, metadata: _metadata }, _courseId_initializers, _courseId_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _isRequired_decorators, { kind: "field", name: "isRequired", static: false, private: false, access: { has: obj => "isRequired" in obj, get: obj => obj.isRequired, set: (obj, value) => { obj.isRequired = value; } }, metadata: _metadata }, _isRequired_initializers, _isRequired_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssignLearningCourseDto = AssignLearningCourseDto;
/**
 * DTO for scheduling one-on-one
 */
let ScheduleOneOnOneDto = (() => {
    var _a;
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _agenda_decorators;
    let _agenda_initializers = [];
    let _agenda_extraInitializers = [];
    return _a = class ScheduleOneOnOneDto {
            constructor() {
                this.scheduledDate = __runInitializers(this, _scheduledDate_initializers, void 0);
                this.duration = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
                this.location = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.agenda = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
                __runInitializers(this, _agenda_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _scheduledDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _duration_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(15), (0, class_validator_1.Max)(180)];
            _location_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _agenda_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: obj => "agenda" in obj, get: obj => obj.agenda, set: (obj, value) => { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ScheduleOneOnOneDto = ScheduleOneOnOneDto;
/**
 * DTO for creating delegation
 */
let CreateDelegationDto = (() => {
    var _a;
    let _delegateId_decorators;
    let _delegateId_initializers = [];
    let _delegateId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _limitations_decorators;
    let _limitations_initializers = [];
    let _limitations_extraInitializers = [];
    return _a = class CreateDelegationDto {
            constructor() {
                this.delegateId = __runInitializers(this, _delegateId_initializers, void 0);
                this.type = (__runInitializers(this, _delegateId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.startDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.reason = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.limitations = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _limitations_initializers, void 0));
                __runInitializers(this, _limitations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _delegateId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(DelegationType)];
            _startDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _limitations_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _delegateId_decorators, { kind: "field", name: "delegateId", static: false, private: false, access: { has: obj => "delegateId" in obj, get: obj => obj.delegateId, set: (obj, value) => { obj.delegateId = value; } }, metadata: _metadata }, _delegateId_initializers, _delegateId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _limitations_decorators, { kind: "field", name: "limitations", static: false, private: false, access: { has: obj => "limitations" in obj, get: obj => obj.limitations, set: (obj, value) => { obj.limitations = value; } }, metadata: _metadata }, _limitations_initializers, _limitations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDelegationDto = CreateDelegationDto;
// ============================================================================
// TEAM OVERVIEW & MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Gets team overview for manager
 *
 * @param managerId - Manager identifier
 * @returns Team overview with metrics
 *
 * @example
 * ```typescript
 * const overview = await getTeamOverview('mgr-123');
 * console.log(overview.teamSize, overview.departments);
 * ```
 */
async function getTeamOverview(managerId) {
    const teamMembers = await getDirectReports(managerId);
    const indirectReports = await getIndirectReports(managerId);
    const departments = [...new Set(teamMembers.map((m) => m.department))];
    const locations = [...new Set(teamMembers.map((m) => m.location))];
    const headcountByDepartment = {};
    const headcountByLocation = {};
    for (const member of teamMembers) {
        headcountByDepartment[member.department] =
            (headcountByDepartment[member.department] || 0) + 1;
        headcountByLocation[member.location] = (headcountByLocation[member.location] || 0) + 1;
    }
    const avgTenure = calculateAverageTenure(teamMembers);
    return {
        managerId,
        teamSize: teamMembers.length + indirectReports.length,
        directReports: teamMembers.length,
        indirectReports: indirectReports.length,
        teamMembers,
        departments,
        locations,
        avgTenure,
        headcountByDepartment,
        headcountByLocation,
    };
}
/**
 * Gets direct reports for manager
 *
 * @param managerId - Manager identifier
 * @returns List of direct reports
 *
 * @example
 * ```typescript
 * const reports = await getDirectReports('mgr-123');
 * ```
 */
async function getDirectReports(managerId) {
    // In production, fetch from database
    return [];
}
/**
 * Gets indirect reports for manager
 *
 * @param managerId - Manager identifier
 * @returns List of indirect reports
 *
 * @example
 * ```typescript
 * const indirectReports = await getIndirectReports('mgr-123');
 * ```
 */
async function getIndirectReports(managerId) {
    // In production, recursively fetch all reports
    return [];
}
/**
 * Gets team member details
 *
 * @param employeeId - Employee identifier
 * @returns Team member details
 *
 * @example
 * ```typescript
 * const member = await getTeamMemberDetails('emp-123');
 * ```
 */
async function getTeamMemberDetails(employeeId) {
    // In production, fetch from database
    return {
        employeeId,
        firstName: faker_1.faker.person.firstName(),
        lastName: faker_1.faker.person.lastName(),
        email: faker_1.faker.internet.email(),
        jobTitle: faker_1.faker.person.jobTitle(),
        department: faker_1.faker.commerce.department(),
        location: faker_1.faker.location.city(),
        hireDate: faker_1.faker.date.past(),
        status: 'active',
    };
}
// ============================================================================
// APPROVAL WORKFLOWS
// ============================================================================
/**
 * Gets pending approvals for manager
 *
 * @param managerId - Manager identifier
 * @param type - Optional approval type filter
 * @returns List of pending approval requests
 *
 * @example
 * ```typescript
 * const approvals = await getPendingApprovals('mgr-123', ApprovalType.TIME_OFF);
 * ```
 */
async function getPendingApprovals(managerId, type) {
    // In production, fetch from database with filters
    return [];
}
/**
 * Approves request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver identifier
 * @param comments - Optional approval comments
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await approveRequest('request-123', 'mgr-456', 'Approved for vacation dates');
 * ```
 */
async function approveRequest(requestId, approverId, comments) {
    const request = await getApprovalRequestById(requestId);
    await logApprovalAuditTrail(requestId, approverId, 'approve', comments);
    return {
        ...request,
        status: ApprovalStatus.APPROVED,
        approverId,
        approverComments: comments,
        approvedDate: new Date(),
    };
}
/**
 * Rejects request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver identifier
 * @param reason - Rejection reason
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await rejectRequest('request-123', 'mgr-456', 'Insufficient coverage during requested dates');
 * ```
 */
async function rejectRequest(requestId, approverId, reason) {
    const request = await getApprovalRequestById(requestId);
    await logApprovalAuditTrail(requestId, approverId, 'reject', reason);
    return {
        ...request,
        status: ApprovalStatus.REJECTED,
        approverId,
        rejectedReason: reason,
        rejectedDate: new Date(),
    };
}
/**
 * Escalates request to higher-level approver
 *
 * @param requestId - Request identifier
 * @param escalatedTo - Higher-level approver ID
 * @param reason - Escalation reason
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await escalateRequest('request-123', 'director-789', 'Requires director approval');
 * ```
 */
async function escalateRequest(requestId, escalatedTo, reason) {
    const request = await getApprovalRequestById(requestId);
    return {
        ...request,
        status: ApprovalStatus.ESCALATED,
        escalatedTo,
        escalationDate: new Date(),
        comments: reason,
    };
}
/**
 * Bulk approves multiple requests
 *
 * @param requestIds - Array of request identifiers
 * @param approverId - Approver identifier
 * @returns Array of updated requests
 *
 * @example
 * ```typescript
 * await bulkApproveRequests(['req-1', 'req-2', 'req-3'], 'mgr-456');
 * ```
 */
async function bulkApproveRequests(requestIds, approverId) {
    const results = [];
    for (const requestId of requestIds) {
        const result = await approveRequest(requestId, approverId);
        results.push(result);
    }
    return results;
}
/**
 * Gets approval history for employee
 *
 * @param employeeId - Employee identifier
 * @param type - Optional approval type filter
 * @returns Approval history
 *
 * @example
 * ```typescript
 * const history = await getEmployeeApprovalHistory('emp-123', ApprovalType.EXPENSE);
 * ```
 */
async function getEmployeeApprovalHistory(employeeId, type) {
    // In production, fetch from database with filters
    return [];
}
/**
 * Gets approval metrics for manager
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Approval metrics
 *
 * @example
 * ```typescript
 * const metrics = await getApprovalMetrics('mgr-123', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getApprovalMetrics(managerId, startDate, endDate) {
    // In production, calculate from database
    return {
        totalRequests: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        avgResponseTime: 0,
    };
}
/**
 * Sends approval reminder to manager
 *
 * @param managerId - Manager identifier
 * @returns Reminder sent status
 *
 * @example
 * ```typescript
 * await sendApprovalReminder('mgr-123');
 * ```
 */
async function sendApprovalReminder(managerId) {
    const pendingApprovals = await getPendingApprovals(managerId);
    // In production, send email/notification
    return true;
}
// ============================================================================
// TEAM PERFORMANCE MANAGEMENT
// ============================================================================
/**
 * Gets team performance reviews
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns List of team performance reviews
 *
 * @example
 * ```typescript
 * const reviews = await getTeamPerformanceReviews('mgr-123', 'cycle-2025');
 * ```
 */
async function getTeamPerformanceReviews(managerId, reviewCycleId) {
    // In production, fetch from database
    return [];
}
/**
 * Submits manager performance review
 *
 * @param reviewId - Review identifier
 * @param reviewData - Review data
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await submitManagerPerformanceReview('review-123', {
 *   overallRating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   competencyRatings: [...],
 *   achievements: '...',
 *   areasForImprovement: '...',
 *   developmentPlan: '...',
 *   managerComments: '...'
 * });
 * ```
 */
async function submitManagerPerformanceReview(reviewId, reviewData) {
    const review = await getPerformanceReviewById(reviewId);
    return {
        ...review,
        ...reviewData,
        managerReviewCompleted: true,
        status: PerformanceReviewCycleStatus.MANAGER_REVIEW,
    };
}
/**
 * Initiates calibration session
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns Calibration session details
 *
 * @example
 * ```typescript
 * await initiateCalibrationSession('mgr-123', 'cycle-2025');
 * ```
 */
async function initiateCalibrationSession(managerId, reviewCycleId) {
    const reviews = await getTeamPerformanceReviews(managerId, reviewCycleId);
    return {
        sessionId: faker_1.faker.string.uuid(),
        reviews,
    };
}
/**
 * Updates calibration rating
 *
 * @param reviewId - Review identifier
 * @param calibrationRating - Calibrated rating
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await updateCalibrationRating('review-123', PerformanceRating.MEETS_EXPECTATIONS);
 * ```
 */
async function updateCalibrationRating(reviewId, calibrationRating) {
    const review = await getPerformanceReviewById(reviewId);
    return {
        ...review,
        calibrationRating,
        status: PerformanceReviewCycleStatus.CALIBRATION,
    };
}
/**
 * Gets performance distribution for team
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns Performance rating distribution
 *
 * @example
 * ```typescript
 * const distribution = await getTeamPerformanceDistribution('mgr-123', 'cycle-2025');
 * ```
 */
async function getTeamPerformanceDistribution(managerId, reviewCycleId) {
    const reviews = await getTeamPerformanceReviews(managerId, reviewCycleId);
    const distribution = {
        [PerformanceRating.OUTSTANDING]: 0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
        [PerformanceRating.MEETS_EXPECTATIONS]: 0,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
        [PerformanceRating.UNSATISFACTORY]: 0,
    };
    for (const review of reviews) {
        if (review.overallRating) {
            distribution[review.overallRating]++;
        }
    }
    return distribution;
}
/**
 * Exports performance review data
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @param format - Export format
 * @returns Export URL
 *
 * @example
 * ```typescript
 * const url = await exportPerformanceReviews('mgr-123', 'cycle-2025', 'pdf');
 * ```
 */
async function exportPerformanceReviews(managerId, reviewCycleId, format) {
    // In production, generate and upload document
    return 'https://storage.example.com/performance-reviews.pdf';
}
// ============================================================================
// TEAM GOAL SETTING & TRACKING
// ============================================================================
/**
 * Creates team goal
 *
 * @param managerId - Manager identifier
 * @param goalData - Goal data
 * @returns Created team goal
 *
 * @example
 * ```typescript
 * const goal = await createTeamGoal('mgr-123', {
 *   title: 'Improve Customer Satisfaction',
 *   description: 'Increase CSAT score to 95%',
 *   category: 'team_performance',
 *   priority: 'high',
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0,
 *   metrics: 'CSAT score >= 95%',
 *   teamMembers: ['emp-1', 'emp-2'],
 *   milestones: []
 * });
 * ```
 */
async function createTeamGoal(managerId, goalData) {
    const goal = {
        id: faker_1.faker.string.uuid(),
        managerId,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...goalData,
    };
    return goal;
}
/**
 * Gets team goals
 *
 * @param managerId - Manager identifier
 * @param status - Optional status filter
 * @returns List of team goals
 *
 * @example
 * ```typescript
 * const goals = await getTeamGoals('mgr-123', 'active');
 * ```
 */
async function getTeamGoals(managerId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Updates team goal progress
 *
 * @param goalId - Goal identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateTeamGoalProgress('goal-123', 75);
 * ```
 */
async function updateTeamGoalProgress(goalId, progress) {
    const goal = await getTeamGoalById(goalId);
    return { ...goal, progress, updatedAt: new Date() };
}
/**
 * Assigns team member to goal
 *
 * @param goalId - Goal identifier
 * @param employeeId - Employee identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await assignTeamMemberToGoal('goal-123', 'emp-456');
 * ```
 */
async function assignTeamMemberToGoal(goalId, employeeId) {
    const goal = await getTeamGoalById(goalId);
    if (!goal.teamMembers.includes(employeeId)) {
        goal.teamMembers.push(employeeId);
    }
    return { ...goal, updatedAt: new Date() };
}
// ============================================================================
// HIRING & RECRUITMENT ACTIONS
// ============================================================================
/**
 * Creates job requisition
 *
 * @param managerId - Manager identifier
 * @param requisitionData - Requisition data
 * @returns Created requisition
 *
 * @example
 * ```typescript
 * const req = await createJobRequisition('mgr-123', {
 *   jobTitle: 'Senior Software Engineer',
 *   department: 'Engineering',
 *   location: 'Boston',
 *   employmentType: 'full_time',
 *   hiringManager: 'mgr-123',
 *   openPositions: 2,
 *   filledPositions: 0,
 *   jobDescription: '...',
 *   requirements: [...],
 *   currency: 'USD'
 * });
 * ```
 */
async function createJobRequisition(managerId, requisitionData) {
    const requisitionNumber = generateRequisitionNumber(managerId);
    const requisition = {
        id: faker_1.faker.string.uuid(),
        requisitionNumber,
        status: RequisitionStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...requisitionData,
    };
    return requisition;
}
/**
 * Submits job requisition for approval
 *
 * @param requisitionId - Requisition identifier
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await submitJobRequisition('req-123');
 * ```
 */
async function submitJobRequisition(requisitionId) {
    const requisition = await getJobRequisitionById(requisitionId);
    return {
        ...requisition,
        status: RequisitionStatus.SUBMITTED,
        updatedAt: new Date(),
    };
}
/**
 * Gets candidates for requisition
 *
 * @param requisitionId - Requisition identifier
 * @param status - Optional status filter
 * @returns List of candidates
 *
 * @example
 * ```typescript
 * const candidates = await getCandidatesForRequisition('req-123', CandidateStatus.INTERVIEWING);
 * ```
 */
async function getCandidatesForRequisition(requisitionId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Updates candidate status
 *
 * @param candidateId - Candidate identifier
 * @param status - New status
 * @param notes - Optional notes
 * @returns Updated candidate
 *
 * @example
 * ```typescript
 * await updateCandidateStatus('candidate-123', CandidateStatus.OFFER_EXTENDED, 'Offer sent via email');
 * ```
 */
async function updateCandidateStatus(candidateId, status, notes) {
    const candidate = await getCandidateById(candidateId);
    return { ...candidate, status, updatedAt: new Date() };
}
/**
 * Schedules candidate interview
 *
 * @param candidateId - Candidate identifier
 * @param interviewData - Interview data
 * @returns Created interview
 *
 * @example
 * ```typescript
 * const interview = await scheduleInterview('candidate-123', {
 *   interviewType: 'technical',
 *   scheduledDate: new Date('2025-11-15T10:00:00'),
 *   interviewers: ['emp-1', 'emp-2']
 * });
 * ```
 */
async function scheduleInterview(candidateId, interviewData) {
    const interview = {
        id: faker_1.faker.string.uuid(),
        candidateId,
        status: 'scheduled',
        ...interviewData,
    };
    return interview;
}
// ============================================================================
// ONBOARDING TASK MANAGEMENT
// ============================================================================
/**
 * Gets onboarding checklists for team
 *
 * @param managerId - Manager identifier
 * @returns List of onboarding checklists
 *
 * @example
 * ```typescript
 * const checklists = await getTeamOnboardingChecklists('mgr-123');
 * ```
 */
async function getTeamOnboardingChecklists(managerId) {
    // In production, fetch from database
    return [];
}
/**
 * Creates onboarding checklist
 *
 * @param employeeId - Employee identifier
 * @param managerId - Manager identifier
 * @returns Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createOnboardingChecklist('emp-123', 'mgr-456');
 * ```
 */
async function createOnboardingChecklist(employeeId, managerId) {
    const checklist = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        employeeName: 'Employee Name',
        startDate: new Date(),
        status: 'not_started',
        tasks: [],
        completionPercentage: 0,
        manager: managerId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return checklist;
}
/**
 * Updates onboarding task status
 *
 * @param taskId - Task identifier
 * @param status - New status
 * @returns Updated task
 *
 * @example
 * ```typescript
 * await updateOnboardingTaskStatus('task-123', OnboardingTaskStatus.COMPLETED);
 * ```
 */
async function updateOnboardingTaskStatus(taskId, status) {
    const task = await getOnboardingTaskById(taskId);
    return {
        ...task,
        status,
        completedDate: status === OnboardingTaskStatus.COMPLETED ? new Date() : undefined,
    };
}
/**
 * Assigns buddy to new hire
 *
 * @param checklistId - Checklist identifier
 * @param buddyId - Buddy employee identifier
 * @returns Updated checklist
 *
 * @example
 * ```typescript
 * await assignBuddy('checklist-123', 'emp-456');
 * ```
 */
async function assignBuddy(checklistId, buddyId) {
    const checklist = await getOnboardingChecklistById(checklistId);
    return { ...checklist, assignedBuddy: buddyId, updatedAt: new Date() };
}
// ============================================================================
// TEAM SCHEDULING & TIME MANAGEMENT
// ============================================================================
/**
 * Gets team schedule for date range
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Team schedule
 *
 * @example
 * ```typescript
 * const schedule = await getTeamSchedule('mgr-123', new Date('2025-11-01'), new Date('2025-11-30'));
 * ```
 */
async function getTeamSchedule(managerId, startDate, endDate) {
    // In production, fetch from database
    return [];
}
/**
 * Gets team availability for date
 *
 * @param managerId - Manager identifier
 * @param date - Target date
 * @returns Team availability
 *
 * @example
 * ```typescript
 * const availability = await getTeamAvailability('mgr-123', new Date('2025-11-15'));
 * ```
 */
async function getTeamAvailability(managerId, date) {
    // In production, calculate from database
    return { available: 0, off: 0, remote: 0, total: 0 };
}
/**
 * Gets team time off calendar
 *
 * @param managerId - Manager identifier
 * @param month - Month (1-12)
 * @param year - Year
 * @returns Time off calendar
 *
 * @example
 * ```typescript
 * const calendar = await getTeamTimeOffCalendar('mgr-123', 11, 2025);
 * ```
 */
async function getTeamTimeOffCalendar(managerId, month, year) {
    // In production, fetch from database
    return [];
}
/**
 * Checks team coverage for date range
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await checkTeamCoverage('mgr-123', new Date('2025-12-20'), new Date('2025-12-31'));
 * ```
 */
async function checkTeamCoverage(managerId, startDate, endDate) {
    // In production, calculate coverage
    return { adequate: true, minimumCoverage: 0, dates: [] };
}
// ============================================================================
// TEAM COMPENSATION ACTIONS
// ============================================================================
/**
 * Creates compensation change request
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param changeData - Change data
 * @returns Created request
 *
 * @example
 * ```typescript
 * const request = await createCompensationChangeRequest('mgr-123', 'emp-456', {
 *   changeType: CompensationChangeType.MERIT_INCREASE,
 *   currentSalary: 80000,
 *   proposedSalary: 88000,
 *   percentageIncrease: 10,
 *   effectiveDate: new Date('2025-01-01'),
 *   justification: 'Excellent performance in 2024',
 *   budgetImpact: 8000
 * });
 * ```
 */
async function createCompensationChangeRequest(managerId, employeeId, changeData) {
    const request = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        employeeName: 'Employee Name',
        requestedBy: managerId,
        status: ApprovalStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...changeData,
    };
    return request;
}
/**
 * Gets compensation change requests
 *
 * @param managerId - Manager identifier
 * @param status - Optional status filter
 * @returns List of compensation change requests
 *
 * @example
 * ```typescript
 * const requests = await getCompensationChangeRequests('mgr-123', ApprovalStatus.PENDING);
 * ```
 */
async function getCompensationChangeRequests(managerId, status) {
    // In production, fetch from database with optional status filter
    return [];
}
/**
 * Calculates compensation budget impact
 *
 * @param managerId - Manager identifier
 * @param changes - Array of proposed changes
 * @returns Budget impact
 *
 * @example
 * ```typescript
 * const impact = calculateCompensationBudgetImpact('mgr-123', [
 *   { currentSalary: 80000, proposedSalary: 88000 },
 *   { currentSalary: 75000, proposedSalary: 82000 }
 * ]);
 * ```
 */
function calculateCompensationBudgetImpact(managerId, changes) {
    const totalCurrent = changes.reduce((sum, c) => sum + c.currentSalary, 0);
    const totalProposed = changes.reduce((sum, c) => sum + c.proposedSalary, 0);
    const totalIncrease = totalProposed - totalCurrent;
    const percentageIncrease = (totalIncrease / totalCurrent) * 100;
    return { totalIncrease, percentageIncrease };
}
/**
 * Gets compensation equity analysis
 *
 * @param managerId - Manager identifier
 * @returns Equity analysis
 *
 * @example
 * ```typescript
 * const analysis = await getCompensationEquityAnalysis('mgr-123');
 * ```
 */
async function getCompensationEquityAnalysis(managerId) {
    // In production, calculate from database
    return {
        avgSalaryByRole: {},
        salaryRangeByRole: {},
        equityGaps: [],
    };
}
// ============================================================================
// TEAM LEARNING ASSIGNMENTS
// ============================================================================
/**
 * Assigns learning course to team member
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param assignmentData - Assignment data
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignLearningCourse('mgr-123', 'emp-456', {
 *   courseId: 'course-789',
 *   courseTitle: 'Advanced Leadership',
 *   assignedBy: 'mgr-123',
 *   assignedDate: new Date(),
 *   dueDate: new Date('2025-12-31'),
 *   isRequired: true,
 *   reason: 'Career development',
 *   status: 'assigned'
 * });
 * ```
 */
async function assignLearningCourse(managerId, employeeId, assignmentData) {
    const assignment = {
        id: faker_1.faker.string.uuid(),
        employeeId,
        employeeName: 'Employee Name',
        ...assignmentData,
    };
    return assignment;
}
/**
 * Gets team learning assignments
 *
 * @param managerId - Manager identifier
 * @returns List of learning assignments
 *
 * @example
 * ```typescript
 * const assignments = await getTeamLearningAssignments('mgr-123');
 * ```
 */
async function getTeamLearningAssignments(managerId) {
    // In production, fetch from database
    return [];
}
/**
 * Gets team learning completion rate
 *
 * @param managerId - Manager identifier
 * @returns Completion rate
 *
 * @example
 * ```typescript
 * const rate = await getTeamLearningCompletionRate('mgr-123');
 * ```
 */
async function getTeamLearningCompletionRate(managerId) {
    const assignments = await getTeamLearningAssignments(managerId);
    const completed = assignments.filter((a) => a.status === 'completed').length;
    return {
        completionRate: assignments.length > 0 ? (completed / assignments.length) * 100 : 0,
        totalAssigned: assignments.length,
        completed,
    };
}
// ============================================================================
// 1-ON-1 MEETING MANAGEMENT
// ============================================================================
/**
 * Schedules one-on-one meeting
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param meetingData - Meeting data
 * @returns Created meeting
 *
 * @example
 * ```typescript
 * const meeting = await scheduleOneOnOne('mgr-123', 'emp-456', {
 *   scheduledDate: new Date('2025-11-15T14:00:00'),
 *   duration: 60,
 *   location: 'Conference Room A',
 *   agenda: ['Career development', 'Project updates', 'Feedback']
 * });
 * ```
 */
async function scheduleOneOnOne(managerId, employeeId, meetingData) {
    const meeting = {
        id: faker_1.faker.string.uuid(),
        managerId,
        employeeId,
        employeeName: 'Employee Name',
        status: MeetingStatus.SCHEDULED,
        actionItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...meetingData,
    };
    return meeting;
}
/**
 * Gets upcoming one-on-one meetings
 *
 * @param managerId - Manager identifier
 * @returns List of upcoming meetings
 *
 * @example
 * ```typescript
 * const meetings = await getUpcomingOneOnOnes('mgr-123');
 * ```
 */
async function getUpcomingOneOnOnes(managerId) {
    // In production, fetch from database
    return [];
}
/**
 * Completes one-on-one meeting
 *
 * @param meetingId - Meeting identifier
 * @param notes - Manager notes
 * @param actionItems - Action items
 * @returns Updated meeting
 *
 * @example
 * ```typescript
 * await completeOneOnOne('meeting-123', 'Discussed career goals...', [
 *   { description: 'Update project plan', assignedTo: 'emp-456', dueDate: new Date('2025-11-30') }
 * ]);
 * ```
 */
async function completeOneOnOne(meetingId, notes, actionItems) {
    const meeting = await getOneOnOneMeetingById(meetingId);
    return {
        ...meeting,
        status: MeetingStatus.COMPLETED,
        managerNotes: notes,
        actionItems: actionItems.map((item) => ({
            ...item,
            id: faker_1.faker.string.uuid(),
            status: 'open',
        })),
        completedDate: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets one-on-one meeting history
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @returns Meeting history
 *
 * @example
 * ```typescript
 * const history = await getOneOnOneHistory('mgr-123', 'emp-456');
 * ```
 */
async function getOneOnOneHistory(managerId, employeeId) {
    // In production, fetch from database
    return [];
}
// ============================================================================
// TEAM ANALYTICS & INSIGHTS
// ============================================================================
/**
 * Gets team analytics
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date for analytics
 * @param endDate - End date for analytics
 * @returns Team analytics
 *
 * @example
 * ```typescript
 * const analytics = await getTeamAnalytics('mgr-123', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
async function getTeamAnalytics(managerId, startDate, endDate) {
    // In production, calculate from database
    return {
        managerId,
        period: { startDate, endDate },
        teamSize: 0,
        headcount: { current: 0, newHires: 0, terminations: 0, transfers: 0 },
        timeOff: { totalDaysRequested: 0, totalDaysApproved: 0, totalDaysTaken: 0, avgDaysPerEmployee: 0 },
        performance: { avgRating: 0, ratingDistribution: {}, goalsOnTrack: 0, goalsAtRisk: 0, goalsBehind: 0 },
        engagement: { avgEngagementScore: 0, participationRate: 0, eNPS: 0 },
        learning: { totalCoursesCompleted: 0, avgHoursPerEmployee: 0, certificationRate: 0 },
        turnover: { voluntaryRate: 0, involuntaryRate: 0, avgTenure: 0 },
    };
}
/**
 * Gets team productivity metrics
 *
 * @param managerId - Manager identifier
 * @param period - Time period
 * @returns Productivity metrics
 *
 * @example
 * ```typescript
 * const metrics = await getTeamProductivityMetrics('mgr-123', 'monthly');
 * ```
 */
async function getTeamProductivityMetrics(managerId, period) {
    // In production, calculate from database
    return {
        avgHoursWorked: 0,
        projectsCompleted: 0,
        goalsAchieved: 0,
        utilizationRate: 0,
    };
}
// ============================================================================
// DELEGATION MANAGEMENT
// ============================================================================
/**
 * Creates delegation
 *
 * @param managerId - Manager identifier
 * @param delegationData - Delegation data
 * @returns Created delegation
 *
 * @example
 * ```typescript
 * const delegation = await createDelegation('mgr-123', {
 *   delegatorName: 'Manager Name',
 *   delegateId: 'emp-456',
 *   delegateName: 'Delegate Name',
 *   type: DelegationType.APPROVALS,
 *   startDate: new Date('2025-12-01'),
 *   endDate: new Date('2025-12-31'),
 *   isActive: true,
 *   reason: 'Holiday coverage'
 * });
 * ```
 */
async function createDelegation(managerId, delegationData) {
    const delegation = {
        id: faker_1.faker.string.uuid(),
        delegatorId: managerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...delegationData,
    };
    return delegation;
}
/**
 * Gets active delegations
 *
 * @param managerId - Manager identifier
 * @returns List of active delegations
 *
 * @example
 * ```typescript
 * const delegations = await getActiveDelegations('mgr-123');
 * ```
 */
async function getActiveDelegations(managerId) {
    // In production, fetch from database
    return [];
}
/**
 * Revokes delegation
 *
 * @param delegationId - Delegation identifier
 * @returns Updated delegation
 *
 * @example
 * ```typescript
 * await revokeDelegation('delegation-123');
 * ```
 */
async function revokeDelegation(delegationId) {
    const delegation = await getDelegationById(delegationId);
    return { ...delegation, isActive: false, updatedAt: new Date() };
}
/**
 * Gets delegated tasks
 *
 * @param delegateId - Delegate identifier
 * @returns List of delegated tasks
 *
 * @example
 * ```typescript
 * const tasks = await getDelegatedTasks('emp-456');
 * ```
 */
async function getDelegatedTasks(delegateId) {
    // In production, fetch from database
    return [];
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates average tenure for team members
 */
function calculateAverageTenure(teamMembers) {
    if (teamMembers.length === 0)
        return 0;
    const totalDays = teamMembers.reduce((sum, member) => {
        const days = Math.floor((Date.now() - member.hireDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
    }, 0);
    return Math.floor(totalDays / teamMembers.length / 365 * 10) / 10; // Years with 1 decimal
}
/**
 * Generates unique requisition number
 */
function generateRequisitionNumber(managerId) {
    const timestamp = Date.now();
    return `REQ-${managerId.slice(0, 6).toUpperCase()}-${timestamp}`;
}
/**
 * Logs approval audit trail
 */
async function logApprovalAuditTrail(requestId, approverId, action, comments) {
    // In production, log to audit database
    console.log(`Approval Audit: ${requestId} - ${action} by ${approverId}`, comments);
}
/**
 * Gets approval request by ID
 */
async function getApprovalRequestById(requestId) {
    return {
        id: requestId,
        type: ApprovalType.TIME_OFF,
        requesterId: 'emp-1',
        requesterName: 'Employee Name',
        approverId: 'mgr-1',
        status: ApprovalStatus.PENDING,
        requestDate: new Date(),
        requestData: {},
        priority: 'medium',
    };
}
/**
 * Gets performance review by ID
 */
async function getPerformanceReviewById(reviewId) {
    return {
        employeeId: 'emp-1',
        employeeName: 'Employee Name',
        reviewCycleId: 'cycle-1',
        reviewPeriodStart: new Date(),
        reviewPeriodEnd: new Date(),
        status: PerformanceReviewCycleStatus.NOT_STARTED,
        selfAssessmentCompleted: false,
        managerReviewCompleted: false,
        competencyRatings: [],
        achievements: '',
        areasForImprovement: '',
        developmentPlan: '',
        managerComments: '',
    };
}
/**
 * Gets team goal by ID
 */
async function getTeamGoalById(goalId) {
    return {
        id: goalId,
        managerId: 'mgr-1',
        title: 'Team Goal',
        description: '',
        category: 'team_performance',
        status: 'draft',
        priority: 'medium',
        startDate: new Date(),
        targetDate: new Date(),
        progress: 0,
        metrics: '',
        teamMembers: [],
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets job requisition by ID
 */
async function getJobRequisitionById(requisitionId) {
    return {
        id: requisitionId,
        requisitionNumber: 'REQ-001',
        jobTitle: 'Job Title',
        department: 'Department',
        location: 'Location',
        employmentType: 'full_time',
        hiringManager: 'mgr-1',
        openPositions: 1,
        filledPositions: 0,
        status: RequisitionStatus.DRAFT,
        jobDescription: '',
        requirements: [],
        preferredQualifications: [],
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets candidate by ID
 */
async function getCandidateById(candidateId) {
    return {
        id: candidateId,
        requisitionId: 'req-1',
        firstName: 'First',
        lastName: 'Last',
        email: 'email@example.com',
        status: CandidateStatus.NEW,
        source: 'LinkedIn',
        appliedDate: new Date(),
        interviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets onboarding checklist by ID
 */
async function getOnboardingChecklistById(checklistId) {
    return {
        id: checklistId,
        employeeId: 'emp-1',
        employeeName: 'Employee Name',
        startDate: new Date(),
        status: 'not_started',
        tasks: [],
        completionPercentage: 0,
        manager: 'mgr-1',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets onboarding task by ID
 */
async function getOnboardingTaskById(taskId) {
    return {
        id: taskId,
        checklistId: 'checklist-1',
        title: 'Task',
        description: '',
        category: 'hr',
        status: OnboardingTaskStatus.NOT_STARTED,
        assignedTo: 'emp-1',
        dueDate: new Date(),
        isBlocking: false,
    };
}
/**
 * Gets one-on-one meeting by ID
 */
async function getOneOnOneMeetingById(meetingId) {
    return {
        id: meetingId,
        managerId: 'mgr-1',
        employeeId: 'emp-1',
        employeeName: 'Employee Name',
        scheduledDate: new Date(),
        duration: 60,
        status: MeetingStatus.SCHEDULED,
        agenda: [],
        actionItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Gets delegation by ID
 */
async function getDelegationById(delegationId) {
    return {
        id: delegationId,
        delegatorId: 'mgr-1',
        delegatorName: 'Manager',
        delegateId: 'emp-1',
        delegateName: 'Employee',
        type: DelegationType.APPROVALS,
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Manager Self-Service Controller
 * Provides RESTful API endpoints for manager self-service operations
 */
let ManagerSelfServiceController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('manager-self-service'), (0, common_1.Controller)('manager-self-service'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getTeam_decorators;
    let _getApprovals_decorators;
    let _approve_decorators;
    let _getPerformanceReviews_decorators;
    let _getGoals_decorators;
    let _createGoal_decorators;
    var ManagerSelfServiceController = _classThis = class {
        /**
         * Get team overview
         */
        async getTeam(managerId) {
            return getTeamOverview(managerId);
        }
        /**
         * Get pending approvals
         */
        async getApprovals(managerId, type) {
            return getPendingApprovals(managerId, type);
        }
        /**
         * Approve request
         */
        async approve(requestId, approvalDto) {
            return approveRequest(requestId, 'manager-id', approvalDto.comments);
        }
        /**
         * Get team performance reviews
         */
        async getPerformanceReviews(managerId, reviewCycleId) {
            return getTeamPerformanceReviews(managerId, reviewCycleId);
        }
        /**
         * Get team goals
         */
        async getGoals(managerId) {
            return getTeamGoals(managerId);
        }
        /**
         * Create team goal
         */
        async createGoal(managerId, createDto) {
            return createTeamGoal(managerId, createDto);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ManagerSelfServiceController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getTeam_decorators = [(0, common_1.Get)('team/:managerId'), (0, swagger_1.ApiOperation)({ summary: 'Get team overview' }), (0, swagger_1.ApiParam)({ name: 'managerId', description: 'Manager ID' })];
        _getApprovals_decorators = [(0, common_1.Get)('approvals/:managerId'), (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals' }), (0, swagger_1.ApiQuery)({ name: 'type', enum: ApprovalType, required: false })];
        _approve_decorators = [(0, common_1.Post)('approvals/:requestId/approve'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Approve request' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _getPerformanceReviews_decorators = [(0, common_1.Get)('performance/:managerId'), (0, swagger_1.ApiOperation)({ summary: 'Get team performance reviews' }), (0, swagger_1.ApiQuery)({ name: 'reviewCycleId', required: true })];
        _getGoals_decorators = [(0, common_1.Get)('goals/:managerId'), (0, swagger_1.ApiOperation)({ summary: 'Get team goals' })];
        _createGoal_decorators = [(0, common_1.Post)('goals/:managerId'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create team goal' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        __esDecorate(_classThis, null, _getTeam_decorators, { kind: "method", name: "getTeam", static: false, private: false, access: { has: obj => "getTeam" in obj, get: obj => obj.getTeam }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getApprovals_decorators, { kind: "method", name: "getApprovals", static: false, private: false, access: { has: obj => "getApprovals" in obj, get: obj => obj.getApprovals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPerformanceReviews_decorators, { kind: "method", name: "getPerformanceReviews", static: false, private: false, access: { has: obj => "getPerformanceReviews" in obj, get: obj => obj.getPerformanceReviews }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGoals_decorators, { kind: "method", name: "getGoals", static: false, private: false, access: { has: obj => "getGoals" in obj, get: obj => obj.getGoals }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGoal_decorators, { kind: "method", name: "createGoal", static: false, private: false, access: { has: obj => "createGoal" in obj, get: obj => obj.createGoal }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManagerSelfServiceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManagerSelfServiceController = _classThis;
})();
exports.ManagerSelfServiceController = ManagerSelfServiceController;
//# sourceMappingURL=manager-self-service-kit.js.map