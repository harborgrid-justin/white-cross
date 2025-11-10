"use strict";
/**
 * LOC: HCM_CASE_MGT_001
 * File: /reuse/server/human-capital/hr-case-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - moment
 *
 * DOWNSTREAM (imported by):
 *   - HR service desk implementations
 *   - Employee self-service portals
 *   - Ticketing system integrations (Jira, ServiceNow)
 *   - Knowledge base systems
 *   - Case analytics & reporting
 *   - Workflow automation engines
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
exports.HRCaseManagementService = exports.ExternalTicketIntegrationModel = exports.CaseTemplateModel = exports.CaseResolutionModel = exports.CaseEscalationModel = exports.KnowledgeBaseArticleModel = exports.CaseNoteModel = exports.SLATrackingModel = exports.SLAConfigurationModel = exports.CaseAssignmentModel = exports.CaseCategoryModel = exports.HRCaseModel = exports.CaseTemplateSchema = exports.CaseResolutionSchema = exports.CaseEscalationSchema = exports.KnowledgeBaseArticleSchema = exports.CaseNoteSchema = exports.SLAConfigurationSchema = exports.CaseAssignmentSchema = exports.HRCaseSchema = exports.WorkflowStatus = exports.TicketingSystem = exports.SatisfactionRating = exports.ResolutionType = exports.EscalationLevel = exports.SLAStatus = exports.CaseChannel = exports.CaseSubCategory = exports.CaseCategory = exports.CasePriority = exports.CaseStatus = void 0;
exports.createHRCase = createHRCase;
exports.updateCaseStatus = updateCaseStatus;
exports.getCaseDetails = getCaseDetails;
exports.listEmployeeCases = listEmployeeCases;
exports.categorizeCaseByType = categorizeCaseByType;
exports.setPriority = setPriority;
exports.autoCategorizeCaseUsingML = autoCategorizeCaseUsingML;
exports.assignCaseToAgent = assignCaseToAgent;
exports.routeCaseBySkill = routeCaseBySkill;
exports.reassignCase = reassignCase;
exports.getAgentWorkload = getAgentWorkload;
exports.defineSLAForCaseType = defineSLAForCaseType;
exports.trackSLACompliance = trackSLACompliance;
exports.alertSLABreach = alertSLABreach;
exports.addCaseNote = addCaseNote;
exports.tagCollaborators = tagCollaborators;
exports.getCaseHistory = getCaseHistory;
exports.searchKnowledgeBase = searchKnowledgeBase;
exports.linkArticleToCase = linkArticleToCase;
exports.suggestKBArticles = suggestKBArticles;
exports.escalateCase = escalateCase;
exports.trackEscalationPath = trackEscalationPath;
exports.notifyEscalationStakeholders = notifyEscalationStakeholders;
exports.deEscalateCase = deEscalateCase;
exports.resolveCaseWithSolution = resolveCaseWithSolution;
exports.closeCase = closeCase;
exports.requestEmployeeFeedback = requestEmployeeFeedback;
exports.trackResolutionTime = trackResolutionTime;
exports.submitCaseFromPortal = submitCaseFromPortal;
exports.getCaseStatusForEmployee = getCaseStatusForEmployee;
exports.sendCaseUpdateNotification = sendCaseUpdateNotification;
exports.createCaseTemplate = createCaseTemplate;
exports.applyCaseWorkflow = applyCaseWorkflow;
exports.trackWorkflowProgress = trackWorkflowProgress;
exports.generateCaseAnalytics = generateCaseAnalytics;
exports.trackCaseMetrics = trackCaseMetrics;
exports.exportCaseReports = exportCaseReports;
exports.syncWithExternalTicketingSystem = syncWithExternalTicketingSystem;
exports.createJiraTicketFromCase = createJiraTicketFromCase;
exports.updateCaseFromExternalSystem = updateCaseFromExternalSystem;
/**
 * File: /reuse/server/human-capital/hr-case-management-kit.ts
 * Locator: WC-HCM-CASE-MGT-001
 * Purpose: HR Case Management Kit - Comprehensive employee case and ticket management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Moment
 * Downstream: ../backend/hr-service-desk/*, Employee portals, Ticketing systems, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 40+ utility functions for HR case creation and tracking, case categorization and
 *          prioritization, intelligent case assignment and routing, SLA management with breach
 *          detection, case collaboration and threaded notes, knowledge base integration with search,
 *          escalation management with workflow automation, case resolution and closure workflows,
 *          employee portal integration, customizable case templates and workflows, comprehensive
 *          case analytics and reporting, and bi-directional integration with ticketing systems
 *
 * LLM Context: Enterprise-grade HR case management for White Cross healthcare system. Provides
 * comprehensive employee service desk capabilities including multi-channel case creation (portal,
 * email, phone, chat), intelligent categorization using ML, priority-based routing with skill
 * matching, configurable SLA targets with automated escalation, collaborative case notes with @mentions,
 * integrated knowledge base with AI-powered suggestions, multi-level escalation workflows, satisfaction
 * surveys and feedback collection, self-service portal integration, reusable case templates for common
 * issues, real-time analytics and reporting dashboards, and seamless integration with Jira, ServiceNow,
 * Zendesk, and Freshdesk. Supports ITIL best practices, multi-language case handling, attachment
 * management, audit trails, and compliance reporting. HIPAA-compliant for healthcare HR cases.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS
// ============================================================================
/**
 * Case status
 */
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["NEW"] = "NEW";
    CaseStatus["OPEN"] = "OPEN";
    CaseStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CaseStatus["PENDING_EMPLOYEE"] = "PENDING_EMPLOYEE";
    CaseStatus["PENDING_THIRD_PARTY"] = "PENDING_THIRD_PARTY";
    CaseStatus["ESCALATED"] = "ESCALATED";
    CaseStatus["RESOLVED"] = "RESOLVED";
    CaseStatus["CLOSED"] = "CLOSED";
    CaseStatus["CANCELLED"] = "CANCELLED";
    CaseStatus["REOPENED"] = "REOPENED";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
/**
 * Case priority levels
 */
var CasePriority;
(function (CasePriority) {
    CasePriority["CRITICAL"] = "CRITICAL";
    CasePriority["HIGH"] = "HIGH";
    CasePriority["MEDIUM"] = "MEDIUM";
    CasePriority["LOW"] = "LOW";
    CasePriority["PLANNING"] = "PLANNING";
})(CasePriority || (exports.CasePriority = CasePriority = {}));
/**
 * Case categories
 */
var CaseCategory;
(function (CaseCategory) {
    CaseCategory["PAYROLL"] = "PAYROLL";
    CaseCategory["BENEFITS"] = "BENEFITS";
    CaseCategory["TIME_OFF"] = "TIME_OFF";
    CaseCategory["PERFORMANCE"] = "PERFORMANCE";
    CaseCategory["COMPENSATION"] = "COMPENSATION";
    CaseCategory["ONBOARDING"] = "ONBOARDING";
    CaseCategory["OFFBOARDING"] = "OFFBOARDING";
    CaseCategory["TRAINING"] = "TRAINING";
    CaseCategory["POLICY_QUESTION"] = "POLICY_QUESTION";
    CaseCategory["COMPLAINT"] = "COMPLAINT";
    CaseCategory["IT_ACCESS"] = "IT_ACCESS";
    CaseCategory["FACILITIES"] = "FACILITIES";
    CaseCategory["GENERAL_INQUIRY"] = "GENERAL_INQUIRY";
    CaseCategory["OTHER"] = "OTHER";
})(CaseCategory || (exports.CaseCategory = CaseCategory = {}));
/**
 * Case sub-categories
 */
var CaseSubCategory;
(function (CaseSubCategory) {
    // Payroll
    CaseSubCategory["PAYROLL_MISSING_PAY"] = "PAYROLL_MISSING_PAY";
    CaseSubCategory["PAYROLL_INCORRECT_AMOUNT"] = "PAYROLL_INCORRECT_AMOUNT";
    CaseSubCategory["PAYROLL_TAX_WITHHOLDING"] = "PAYROLL_TAX_WITHHOLDING";
    CaseSubCategory["PAYROLL_DIRECT_DEPOSIT"] = "PAYROLL_DIRECT_DEPOSIT";
    // Benefits
    CaseSubCategory["BENEFITS_ENROLLMENT"] = "BENEFITS_ENROLLMENT";
    CaseSubCategory["BENEFITS_CLAIM"] = "BENEFITS_CLAIM";
    CaseSubCategory["BENEFITS_CHANGE"] = "BENEFITS_CHANGE";
    CaseSubCategory["BENEFITS_TERMINATION"] = "BENEFITS_TERMINATION";
    // Time Off
    CaseSubCategory["TIMEOFF_REQUEST"] = "TIMEOFF_REQUEST";
    CaseSubCategory["TIMEOFF_BALANCE"] = "TIMEOFF_BALANCE";
    CaseSubCategory["TIMEOFF_APPROVAL"] = "TIMEOFF_APPROVAL";
    // Other
    CaseSubCategory["OTHER"] = "OTHER";
})(CaseSubCategory || (exports.CaseSubCategory = CaseSubCategory = {}));
/**
 * Case channel
 */
var CaseChannel;
(function (CaseChannel) {
    CaseChannel["EMPLOYEE_PORTAL"] = "EMPLOYEE_PORTAL";
    CaseChannel["EMAIL"] = "EMAIL";
    CaseChannel["PHONE"] = "PHONE";
    CaseChannel["CHAT"] = "CHAT";
    CaseChannel["IN_PERSON"] = "IN_PERSON";
    CaseChannel["MOBILE_APP"] = "MOBILE_APP";
    CaseChannel["INTEGRATION"] = "INTEGRATION";
})(CaseChannel || (exports.CaseChannel = CaseChannel = {}));
/**
 * SLA status
 */
var SLAStatus;
(function (SLAStatus) {
    SLAStatus["ON_TRACK"] = "ON_TRACK";
    SLAStatus["AT_RISK"] = "AT_RISK";
    SLAStatus["BREACHED"] = "BREACHED";
    SLAStatus["PAUSED"] = "PAUSED";
    SLAStatus["COMPLETED"] = "COMPLETED";
})(SLAStatus || (exports.SLAStatus = SLAStatus = {}));
/**
 * Escalation level
 */
var EscalationLevel;
(function (EscalationLevel) {
    EscalationLevel["LEVEL_0"] = "LEVEL_0";
    EscalationLevel["LEVEL_1"] = "LEVEL_1";
    EscalationLevel["LEVEL_2"] = "LEVEL_2";
    EscalationLevel["LEVEL_3"] = "LEVEL_3";
    EscalationLevel["LEVEL_4"] = "LEVEL_4";
})(EscalationLevel || (exports.EscalationLevel = EscalationLevel = {}));
/**
 * Case resolution type
 */
var ResolutionType;
(function (ResolutionType) {
    ResolutionType["RESOLVED"] = "RESOLVED";
    ResolutionType["WORKAROUND"] = "WORKAROUND";
    ResolutionType["CANNOT_REPRODUCE"] = "CANNOT_REPRODUCE";
    ResolutionType["DUPLICATE"] = "DUPLICATE";
    ResolutionType["NOT_AN_ISSUE"] = "NOT_AN_ISSUE";
    ResolutionType["CANCELLED"] = "CANCELLED";
})(ResolutionType || (exports.ResolutionType = ResolutionType = {}));
/**
 * Satisfaction rating
 */
var SatisfactionRating;
(function (SatisfactionRating) {
    SatisfactionRating["VERY_SATISFIED"] = "VERY_SATISFIED";
    SatisfactionRating["SATISFIED"] = "SATISFIED";
    SatisfactionRating["NEUTRAL"] = "NEUTRAL";
    SatisfactionRating["DISSATISFIED"] = "DISSATISFIED";
    SatisfactionRating["VERY_DISSATISFIED"] = "VERY_DISSATISFIED";
})(SatisfactionRating || (exports.SatisfactionRating = SatisfactionRating = {}));
/**
 * External ticketing system
 */
var TicketingSystem;
(function (TicketingSystem) {
    TicketingSystem["JIRA"] = "JIRA";
    TicketingSystem["SERVICENOW"] = "SERVICENOW";
    TicketingSystem["ZENDESK"] = "ZENDESK";
    TicketingSystem["FRESHDESK"] = "FRESHDESK";
    TicketingSystem["SALESFORCE"] = "SALESFORCE";
    TicketingSystem["INTERNAL"] = "INTERNAL";
})(TicketingSystem || (exports.TicketingSystem = TicketingSystem = {}));
/**
 * Workflow status
 */
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["NOT_STARTED"] = "NOT_STARTED";
    WorkflowStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WorkflowStatus["COMPLETED"] = "COMPLETED";
    WorkflowStatus["FAILED"] = "FAILED";
    WorkflowStatus["SKIPPED"] = "SKIPPED";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.HRCaseSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    subject: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().min(10).max(5000),
    category: zod_1.z.nativeEnum(CaseCategory),
    subCategory: zod_1.z.nativeEnum(CaseSubCategory).optional(),
    priority: zod_1.z.nativeEnum(CasePriority),
    channel: zod_1.z.nativeEnum(CaseChannel),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.CaseAssignmentSchema = zod_1.z.object({
    caseId: zod_1.z.string().uuid(),
    assignedTo: zod_1.z.string().min(1).max(200),
    assignedTeam: zod_1.z.string().min(1).max(200).optional(),
    assignmentReason: zod_1.z.string().min(1).max(500),
});
exports.SLAConfigurationSchema = zod_1.z.object({
    category: zod_1.z.nativeEnum(CaseCategory),
    priority: zod_1.z.nativeEnum(CasePriority),
    responseTimeHours: zod_1.z.number().min(0.5).max(168),
    resolutionTimeHours: zod_1.z.number().min(1).max(720),
    escalationEnabled: zod_1.z.boolean(),
    escalationThresholdPercent: zod_1.z.number().min(0).max(100),
});
exports.CaseNoteSchema = zod_1.z.object({
    caseId: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().min(1).max(200),
    noteType: zod_1.z.enum(['PUBLIC', 'INTERNAL', 'SYSTEM']),
    content: zod_1.z.string().min(1).max(10000),
    mentions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.KnowledgeBaseArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    content: zod_1.z.string().min(10).max(50000),
    category: zod_1.z.nativeEnum(CaseCategory),
    subCategories: zod_1.z.array(zod_1.z.nativeEnum(CaseSubCategory)),
    tags: zod_1.z.array(zod_1.z.string()),
    createdBy: zod_1.z.string().min(1).max(200),
});
exports.CaseEscalationSchema = zod_1.z.object({
    caseId: zod_1.z.string().uuid(),
    escalationLevel: zod_1.z.nativeEnum(EscalationLevel),
    escalatedTo: zod_1.z.string().min(1).max(200),
    reason: zod_1.z.string().min(10).max(500),
});
exports.CaseResolutionSchema = zod_1.z.object({
    caseId: zod_1.z.string().uuid(),
    resolutionType: zod_1.z.nativeEnum(ResolutionType),
    resolutionNotes: zod_1.z.string().min(10).max(5000),
    rootCause: zod_1.z.string().max(1000).optional(),
    preventiveMeasures: zod_1.z.string().max(1000).optional(),
    resolvedBy: zod_1.z.string().min(1).max(200),
});
exports.CaseTemplateSchema = zod_1.z.object({
    templateName: zod_1.z.string().min(3).max(200),
    category: zod_1.z.nativeEnum(CaseCategory),
    subCategory: zod_1.z.nativeEnum(CaseSubCategory).optional(),
    defaultPriority: zod_1.z.nativeEnum(CasePriority),
    subjectTemplate: zod_1.z.string().min(5).max(200),
    descriptionTemplate: zod_1.z.string().min(10).max(5000),
    createdBy: zod_1.z.string().min(1).max(200),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * HR Case Model
 */
let HRCaseModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'hr_cases', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseNumber_decorators;
    let _caseNumber_initializers = [];
    let _caseNumber_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _subCategory_decorators;
    let _subCategory_initializers = [];
    let _subCategory_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedTeam_decorators;
    let _assignedTeam_initializers = [];
    let _assignedTeam_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _relatedCases_decorators;
    let _relatedCases_initializers = [];
    let _relatedCases_extraInitializers = [];
    let _externalTicketId_decorators;
    let _externalTicketId_initializers = [];
    let _externalTicketId_extraInitializers = [];
    let _externalSystem_decorators;
    let _externalSystem_initializers = [];
    let _externalSystem_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _closedAt_decorators;
    let _closedAt_initializers = [];
    let _closedAt_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _assignments_decorators;
    let _assignments_initializers = [];
    let _assignments_extraInitializers = [];
    let _escalations_decorators;
    let _escalations_initializers = [];
    let _escalations_extraInitializers = [];
    var HRCaseModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseNumber_initializers, void 0));
            this.employeeId = (__runInitializers(this, _caseNumber_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.subject = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.subCategory = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subCategory_initializers, void 0));
            this.priority = (__runInitializers(this, _subCategory_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.channel = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedTeam = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedTeam_initializers, void 0));
            this.tags = (__runInitializers(this, _assignedTeam_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.attachments = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.relatedCases = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _relatedCases_initializers, void 0));
            this.externalTicketId = (__runInitializers(this, _relatedCases_extraInitializers), __runInitializers(this, _externalTicketId_initializers, void 0));
            this.externalSystem = (__runInitializers(this, _externalTicketId_extraInitializers), __runInitializers(this, _externalSystem_initializers, void 0));
            this.createdAt = (__runInitializers(this, _externalSystem_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.closedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _closedAt_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _closedAt_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.notes = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.assignments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _assignments_initializers, void 0));
            this.escalations = (__runInitializers(this, _assignments_extraInitializers), __runInitializers(this, _escalations_initializers, void 0));
            __runInitializers(this, _escalations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "HRCaseModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _subject_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _subCategory_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('NEW'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _channel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _assignedTo_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _assignedTeam_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _tags_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _attachments_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _relatedCases_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID))];
        _externalTicketId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _externalSystem_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _closedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _notes_decorators = [(0, sequelize_typescript_1.HasMany)(() => CaseNoteModel)];
        _assignments_decorators = [(0, sequelize_typescript_1.HasMany)(() => CaseAssignmentModel)];
        _escalations_decorators = [(0, sequelize_typescript_1.HasMany)(() => CaseEscalationModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseNumber_decorators, { kind: "field", name: "caseNumber", static: false, private: false, access: { has: obj => "caseNumber" in obj, get: obj => obj.caseNumber, set: (obj, value) => { obj.caseNumber = value; } }, metadata: _metadata }, _caseNumber_initializers, _caseNumber_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _subCategory_decorators, { kind: "field", name: "subCategory", static: false, private: false, access: { has: obj => "subCategory" in obj, get: obj => obj.subCategory, set: (obj, value) => { obj.subCategory = value; } }, metadata: _metadata }, _subCategory_initializers, _subCategory_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedTeam_decorators, { kind: "field", name: "assignedTeam", static: false, private: false, access: { has: obj => "assignedTeam" in obj, get: obj => obj.assignedTeam, set: (obj, value) => { obj.assignedTeam = value; } }, metadata: _metadata }, _assignedTeam_initializers, _assignedTeam_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _relatedCases_decorators, { kind: "field", name: "relatedCases", static: false, private: false, access: { has: obj => "relatedCases" in obj, get: obj => obj.relatedCases, set: (obj, value) => { obj.relatedCases = value; } }, metadata: _metadata }, _relatedCases_initializers, _relatedCases_extraInitializers);
        __esDecorate(null, null, _externalTicketId_decorators, { kind: "field", name: "externalTicketId", static: false, private: false, access: { has: obj => "externalTicketId" in obj, get: obj => obj.externalTicketId, set: (obj, value) => { obj.externalTicketId = value; } }, metadata: _metadata }, _externalTicketId_initializers, _externalTicketId_extraInitializers);
        __esDecorate(null, null, _externalSystem_decorators, { kind: "field", name: "externalSystem", static: false, private: false, access: { has: obj => "externalSystem" in obj, get: obj => obj.externalSystem, set: (obj, value) => { obj.externalSystem = value; } }, metadata: _metadata }, _externalSystem_initializers, _externalSystem_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _closedAt_decorators, { kind: "field", name: "closedAt", static: false, private: false, access: { has: obj => "closedAt" in obj, get: obj => obj.closedAt, set: (obj, value) => { obj.closedAt = value; } }, metadata: _metadata }, _closedAt_initializers, _closedAt_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _assignments_decorators, { kind: "field", name: "assignments", static: false, private: false, access: { has: obj => "assignments" in obj, get: obj => obj.assignments, set: (obj, value) => { obj.assignments = value; } }, metadata: _metadata }, _assignments_initializers, _assignments_extraInitializers);
        __esDecorate(null, null, _escalations_decorators, { kind: "field", name: "escalations", static: false, private: false, access: { has: obj => "escalations" in obj, get: obj => obj.escalations, set: (obj, value) => { obj.escalations = value; } }, metadata: _metadata }, _escalations_initializers, _escalations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HRCaseModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HRCaseModel = _classThis;
})();
exports.HRCaseModel = HRCaseModel;
/**
 * Case Category Configuration Model
 */
let CaseCategoryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_categories', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _subCategories_decorators;
    let _subCategories_initializers = [];
    let _subCategories_extraInitializers = [];
    let _defaultPriority_decorators;
    let _defaultPriority_initializers = [];
    let _defaultPriority_extraInitializers = [];
    let _defaultAssignedTeam_decorators;
    let _defaultAssignedTeam_initializers = [];
    let _defaultAssignedTeam_extraInitializers = [];
    let _requiresApproval_decorators;
    let _requiresApproval_initializers = [];
    let _requiresApproval_extraInitializers = [];
    let _slaTargetHours_decorators;
    let _slaTargetHours_initializers = [];
    let _slaTargetHours_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CaseCategoryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.category = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.subCategories = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subCategories_initializers, void 0));
            this.defaultPriority = (__runInitializers(this, _subCategories_extraInitializers), __runInitializers(this, _defaultPriority_initializers, void 0));
            this.defaultAssignedTeam = (__runInitializers(this, _defaultPriority_extraInitializers), __runInitializers(this, _defaultAssignedTeam_initializers, void 0));
            this.requiresApproval = (__runInitializers(this, _defaultAssignedTeam_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
            this.slaTargetHours = (__runInitializers(this, _requiresApproval_extraInitializers), __runInitializers(this, _slaTargetHours_initializers, void 0));
            this.active = (__runInitializers(this, _slaTargetHours_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.createdAt = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseCategoryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _category_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _subCategories_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _defaultPriority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _defaultAssignedTeam_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _requiresApproval_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _slaTargetHours_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(24), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _active_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _subCategories_decorators, { kind: "field", name: "subCategories", static: false, private: false, access: { has: obj => "subCategories" in obj, get: obj => obj.subCategories, set: (obj, value) => { obj.subCategories = value; } }, metadata: _metadata }, _subCategories_initializers, _subCategories_extraInitializers);
        __esDecorate(null, null, _defaultPriority_decorators, { kind: "field", name: "defaultPriority", static: false, private: false, access: { has: obj => "defaultPriority" in obj, get: obj => obj.defaultPriority, set: (obj, value) => { obj.defaultPriority = value; } }, metadata: _metadata }, _defaultPriority_initializers, _defaultPriority_extraInitializers);
        __esDecorate(null, null, _defaultAssignedTeam_decorators, { kind: "field", name: "defaultAssignedTeam", static: false, private: false, access: { has: obj => "defaultAssignedTeam" in obj, get: obj => obj.defaultAssignedTeam, set: (obj, value) => { obj.defaultAssignedTeam = value; } }, metadata: _metadata }, _defaultAssignedTeam_initializers, _defaultAssignedTeam_extraInitializers);
        __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: obj => "requiresApproval" in obj, get: obj => obj.requiresApproval, set: (obj, value) => { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
        __esDecorate(null, null, _slaTargetHours_decorators, { kind: "field", name: "slaTargetHours", static: false, private: false, access: { has: obj => "slaTargetHours" in obj, get: obj => obj.slaTargetHours, set: (obj, value) => { obj.slaTargetHours = value; } }, metadata: _metadata }, _slaTargetHours_initializers, _slaTargetHours_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseCategoryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseCategoryModel = _classThis;
})();
exports.CaseCategoryModel = CaseCategoryModel;
/**
 * Case Assignment Model
 */
let CaseAssignmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_assignments', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _assignedFrom_decorators;
    let _assignedFrom_initializers = [];
    let _assignedFrom_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedTeam_decorators;
    let _assignedTeam_initializers = [];
    let _assignedTeam_extraInitializers = [];
    let _assignmentReason_decorators;
    let _assignmentReason_initializers = [];
    let _assignmentReason_extraInitializers = [];
    let _assignedAt_decorators;
    let _assignedAt_initializers = [];
    let _assignedAt_extraInitializers = [];
    let _acceptedAt_decorators;
    let _acceptedAt_initializers = [];
    let _acceptedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _case_decorators;
    let _case_initializers = [];
    let _case_extraInitializers = [];
    var CaseAssignmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.assignedFrom = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _assignedFrom_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _assignedFrom_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedTeam = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedTeam_initializers, void 0));
            this.assignmentReason = (__runInitializers(this, _assignedTeam_extraInitializers), __runInitializers(this, _assignmentReason_initializers, void 0));
            this.assignedAt = (__runInitializers(this, _assignmentReason_extraInitializers), __runInitializers(this, _assignedAt_initializers, void 0));
            this.acceptedAt = (__runInitializers(this, _assignedAt_extraInitializers), __runInitializers(this, _acceptedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _acceptedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.case = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _case_initializers, void 0));
            __runInitializers(this, _case_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseAssignmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => HRCaseModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _assignedFrom_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _assignedTo_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _assignedTeam_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _assignmentReason_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _assignedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _acceptedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _case_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => HRCaseModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _assignedFrom_decorators, { kind: "field", name: "assignedFrom", static: false, private: false, access: { has: obj => "assignedFrom" in obj, get: obj => obj.assignedFrom, set: (obj, value) => { obj.assignedFrom = value; } }, metadata: _metadata }, _assignedFrom_initializers, _assignedFrom_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedTeam_decorators, { kind: "field", name: "assignedTeam", static: false, private: false, access: { has: obj => "assignedTeam" in obj, get: obj => obj.assignedTeam, set: (obj, value) => { obj.assignedTeam = value; } }, metadata: _metadata }, _assignedTeam_initializers, _assignedTeam_extraInitializers);
        __esDecorate(null, null, _assignmentReason_decorators, { kind: "field", name: "assignmentReason", static: false, private: false, access: { has: obj => "assignmentReason" in obj, get: obj => obj.assignmentReason, set: (obj, value) => { obj.assignmentReason = value; } }, metadata: _metadata }, _assignmentReason_initializers, _assignmentReason_extraInitializers);
        __esDecorate(null, null, _assignedAt_decorators, { kind: "field", name: "assignedAt", static: false, private: false, access: { has: obj => "assignedAt" in obj, get: obj => obj.assignedAt, set: (obj, value) => { obj.assignedAt = value; } }, metadata: _metadata }, _assignedAt_initializers, _assignedAt_extraInitializers);
        __esDecorate(null, null, _acceptedAt_decorators, { kind: "field", name: "acceptedAt", static: false, private: false, access: { has: obj => "acceptedAt" in obj, get: obj => obj.acceptedAt, set: (obj, value) => { obj.acceptedAt = value; } }, metadata: _metadata }, _acceptedAt_initializers, _acceptedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _case_decorators, { kind: "field", name: "case", static: false, private: false, access: { has: obj => "case" in obj, get: obj => obj.case, set: (obj, value) => { obj.case = value; } }, metadata: _metadata }, _case_initializers, _case_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseAssignmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseAssignmentModel = _classThis;
})();
exports.CaseAssignmentModel = CaseAssignmentModel;
/**
 * SLA Configuration Model
 */
let SLAConfigurationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'sla_configurations', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _responseTimeHours_decorators;
    let _responseTimeHours_initializers = [];
    let _responseTimeHours_extraInitializers = [];
    let _resolutionTimeHours_decorators;
    let _resolutionTimeHours_initializers = [];
    let _resolutionTimeHours_extraInitializers = [];
    let _escalationEnabled_decorators;
    let _escalationEnabled_initializers = [];
    let _escalationEnabled_extraInitializers = [];
    let _escalationThresholdPercent_decorators;
    let _escalationThresholdPercent_initializers = [];
    let _escalationThresholdPercent_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SLAConfigurationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.category = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.responseTimeHours = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _responseTimeHours_initializers, void 0));
            this.resolutionTimeHours = (__runInitializers(this, _responseTimeHours_extraInitializers), __runInitializers(this, _resolutionTimeHours_initializers, void 0));
            this.escalationEnabled = (__runInitializers(this, _resolutionTimeHours_extraInitializers), __runInitializers(this, _escalationEnabled_initializers, void 0));
            this.escalationThresholdPercent = (__runInitializers(this, _escalationEnabled_extraInitializers), __runInitializers(this, _escalationThresholdPercent_initializers, void 0));
            this.active = (__runInitializers(this, _escalationThresholdPercent_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.createdAt = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SLAConfigurationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _responseTimeHours_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(6, 2))];
        _resolutionTimeHours_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(8, 2))];
        _escalationEnabled_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _escalationThresholdPercent_decorators = [(0, sequelize_typescript_1.Default)(80), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _active_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _responseTimeHours_decorators, { kind: "field", name: "responseTimeHours", static: false, private: false, access: { has: obj => "responseTimeHours" in obj, get: obj => obj.responseTimeHours, set: (obj, value) => { obj.responseTimeHours = value; } }, metadata: _metadata }, _responseTimeHours_initializers, _responseTimeHours_extraInitializers);
        __esDecorate(null, null, _resolutionTimeHours_decorators, { kind: "field", name: "resolutionTimeHours", static: false, private: false, access: { has: obj => "resolutionTimeHours" in obj, get: obj => obj.resolutionTimeHours, set: (obj, value) => { obj.resolutionTimeHours = value; } }, metadata: _metadata }, _resolutionTimeHours_initializers, _resolutionTimeHours_extraInitializers);
        __esDecorate(null, null, _escalationEnabled_decorators, { kind: "field", name: "escalationEnabled", static: false, private: false, access: { has: obj => "escalationEnabled" in obj, get: obj => obj.escalationEnabled, set: (obj, value) => { obj.escalationEnabled = value; } }, metadata: _metadata }, _escalationEnabled_initializers, _escalationEnabled_extraInitializers);
        __esDecorate(null, null, _escalationThresholdPercent_decorators, { kind: "field", name: "escalationThresholdPercent", static: false, private: false, access: { has: obj => "escalationThresholdPercent" in obj, get: obj => obj.escalationThresholdPercent, set: (obj, value) => { obj.escalationThresholdPercent = value; } }, metadata: _metadata }, _escalationThresholdPercent_initializers, _escalationThresholdPercent_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SLAConfigurationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SLAConfigurationModel = _classThis;
})();
exports.SLAConfigurationModel = SLAConfigurationModel;
/**
 * SLA Tracking Model
 */
let SLATrackingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'sla_tracking', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _slaConfigId_decorators;
    let _slaConfigId_initializers = [];
    let _slaConfigId_extraInitializers = [];
    let _responseDeadline_decorators;
    let _responseDeadline_initializers = [];
    let _responseDeadline_extraInitializers = [];
    let _resolutionDeadline_decorators;
    let _resolutionDeadline_initializers = [];
    let _resolutionDeadline_extraInitializers = [];
    let _firstResponseAt_decorators;
    let _firstResponseAt_initializers = [];
    let _firstResponseAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _breachedAt_decorators;
    let _breachedAt_initializers = [];
    let _breachedAt_extraInitializers = [];
    let _pausedAt_decorators;
    let _pausedAt_initializers = [];
    let _pausedAt_extraInitializers = [];
    let _pausedDuration_decorators;
    let _pausedDuration_initializers = [];
    let _pausedDuration_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _slaConfig_decorators;
    let _slaConfig_initializers = [];
    let _slaConfig_extraInitializers = [];
    var SLATrackingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.slaConfigId = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _slaConfigId_initializers, void 0));
            this.responseDeadline = (__runInitializers(this, _slaConfigId_extraInitializers), __runInitializers(this, _responseDeadline_initializers, void 0));
            this.resolutionDeadline = (__runInitializers(this, _responseDeadline_extraInitializers), __runInitializers(this, _resolutionDeadline_initializers, void 0));
            this.firstResponseAt = (__runInitializers(this, _resolutionDeadline_extraInitializers), __runInitializers(this, _firstResponseAt_initializers, void 0));
            this.status = (__runInitializers(this, _firstResponseAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.breachedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _breachedAt_initializers, void 0));
            this.pausedAt = (__runInitializers(this, _breachedAt_extraInitializers), __runInitializers(this, _pausedAt_initializers, void 0));
            this.pausedDuration = (__runInitializers(this, _pausedAt_extraInitializers), __runInitializers(this, _pausedDuration_initializers, void 0));
            this.createdAt = (__runInitializers(this, _pausedDuration_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.slaConfig = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _slaConfig_initializers, void 0));
            __runInitializers(this, _slaConfig_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SLATrackingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _slaConfigId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => SLAConfigurationModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _responseDeadline_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolutionDeadline_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _firstResponseAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('ON_TRACK'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _breachedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _pausedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _pausedDuration_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _slaConfig_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SLAConfigurationModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _slaConfigId_decorators, { kind: "field", name: "slaConfigId", static: false, private: false, access: { has: obj => "slaConfigId" in obj, get: obj => obj.slaConfigId, set: (obj, value) => { obj.slaConfigId = value; } }, metadata: _metadata }, _slaConfigId_initializers, _slaConfigId_extraInitializers);
        __esDecorate(null, null, _responseDeadline_decorators, { kind: "field", name: "responseDeadline", static: false, private: false, access: { has: obj => "responseDeadline" in obj, get: obj => obj.responseDeadline, set: (obj, value) => { obj.responseDeadline = value; } }, metadata: _metadata }, _responseDeadline_initializers, _responseDeadline_extraInitializers);
        __esDecorate(null, null, _resolutionDeadline_decorators, { kind: "field", name: "resolutionDeadline", static: false, private: false, access: { has: obj => "resolutionDeadline" in obj, get: obj => obj.resolutionDeadline, set: (obj, value) => { obj.resolutionDeadline = value; } }, metadata: _metadata }, _resolutionDeadline_initializers, _resolutionDeadline_extraInitializers);
        __esDecorate(null, null, _firstResponseAt_decorators, { kind: "field", name: "firstResponseAt", static: false, private: false, access: { has: obj => "firstResponseAt" in obj, get: obj => obj.firstResponseAt, set: (obj, value) => { obj.firstResponseAt = value; } }, metadata: _metadata }, _firstResponseAt_initializers, _firstResponseAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _breachedAt_decorators, { kind: "field", name: "breachedAt", static: false, private: false, access: { has: obj => "breachedAt" in obj, get: obj => obj.breachedAt, set: (obj, value) => { obj.breachedAt = value; } }, metadata: _metadata }, _breachedAt_initializers, _breachedAt_extraInitializers);
        __esDecorate(null, null, _pausedAt_decorators, { kind: "field", name: "pausedAt", static: false, private: false, access: { has: obj => "pausedAt" in obj, get: obj => obj.pausedAt, set: (obj, value) => { obj.pausedAt = value; } }, metadata: _metadata }, _pausedAt_initializers, _pausedAt_extraInitializers);
        __esDecorate(null, null, _pausedDuration_decorators, { kind: "field", name: "pausedDuration", static: false, private: false, access: { has: obj => "pausedDuration" in obj, get: obj => obj.pausedDuration, set: (obj, value) => { obj.pausedDuration = value; } }, metadata: _metadata }, _pausedDuration_initializers, _pausedDuration_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _slaConfig_decorators, { kind: "field", name: "slaConfig", static: false, private: false, access: { has: obj => "slaConfig" in obj, get: obj => obj.slaConfig, set: (obj, value) => { obj.slaConfig = value; } }, metadata: _metadata }, _slaConfig_initializers, _slaConfig_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SLATrackingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SLATrackingModel = _classThis;
})();
exports.SLATrackingModel = SLATrackingModel;
/**
 * Case Note Model
 */
let CaseNoteModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_notes', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _authorId_decorators;
    let _authorId_initializers = [];
    let _authorId_extraInitializers = [];
    let _noteType_decorators;
    let _noteType_initializers = [];
    let _noteType_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _mentions_decorators;
    let _mentions_initializers = [];
    let _mentions_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _case_decorators;
    let _case_initializers = [];
    let _case_extraInitializers = [];
    var CaseNoteModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.authorId = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            this.noteType = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _noteType_initializers, void 0));
            this.content = (__runInitializers(this, _noteType_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.mentions = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _mentions_initializers, void 0));
            this.attachments = (__runInitializers(this, _mentions_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.case = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _case_initializers, void 0));
            __runInitializers(this, _case_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseNoteModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => HRCaseModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _authorId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _noteType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _content_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _mentions_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _attachments_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _case_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => HRCaseModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: obj => "authorId" in obj, get: obj => obj.authorId, set: (obj, value) => { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _noteType_decorators, { kind: "field", name: "noteType", static: false, private: false, access: { has: obj => "noteType" in obj, get: obj => obj.noteType, set: (obj, value) => { obj.noteType = value; } }, metadata: _metadata }, _noteType_initializers, _noteType_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _mentions_decorators, { kind: "field", name: "mentions", static: false, private: false, access: { has: obj => "mentions" in obj, get: obj => obj.mentions, set: (obj, value) => { obj.mentions = value; } }, metadata: _metadata }, _mentions_initializers, _mentions_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _case_decorators, { kind: "field", name: "case", static: false, private: false, access: { has: obj => "case" in obj, get: obj => obj.case, set: (obj, value) => { obj.case = value; } }, metadata: _metadata }, _case_initializers, _case_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseNoteModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseNoteModel = _classThis;
})();
exports.CaseNoteModel = CaseNoteModel;
/**
 * Knowledge Base Article Model
 */
let KnowledgeBaseArticleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'knowledge_base_articles', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _subCategories_decorators;
    let _subCategories_initializers = [];
    let _subCategories_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _views_decorators;
    let _views_initializers = [];
    let _views_extraInitializers = [];
    let _helpful_decorators;
    let _helpful_initializers = [];
    let _helpful_extraInitializers = [];
    let _notHelpful_decorators;
    let _notHelpful_initializers = [];
    let _notHelpful_extraInitializers = [];
    let _relatedArticles_decorators;
    let _relatedArticles_initializers = [];
    let _relatedArticles_extraInitializers = [];
    let _published_decorators;
    let _published_initializers = [];
    let _published_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var KnowledgeBaseArticleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.category = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.subCategories = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subCategories_initializers, void 0));
            this.tags = (__runInitializers(this, _subCategories_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.views = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _views_initializers, void 0));
            this.helpful = (__runInitializers(this, _views_extraInitializers), __runInitializers(this, _helpful_initializers, void 0));
            this.notHelpful = (__runInitializers(this, _helpful_extraInitializers), __runInitializers(this, _notHelpful_initializers, void 0));
            this.relatedArticles = (__runInitializers(this, _notHelpful_extraInitializers), __runInitializers(this, _relatedArticles_initializers, void 0));
            this.published = (__runInitializers(this, _relatedArticles_extraInitializers), __runInitializers(this, _published_initializers, void 0));
            this.createdBy = (__runInitializers(this, _published_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KnowledgeBaseArticleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _content_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _subCategories_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _tags_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _views_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _helpful_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _notHelpful_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _relatedArticles_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID))];
        _published_decorators = [(0, sequelize_typescript_1.Default)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _subCategories_decorators, { kind: "field", name: "subCategories", static: false, private: false, access: { has: obj => "subCategories" in obj, get: obj => obj.subCategories, set: (obj, value) => { obj.subCategories = value; } }, metadata: _metadata }, _subCategories_initializers, _subCategories_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _views_decorators, { kind: "field", name: "views", static: false, private: false, access: { has: obj => "views" in obj, get: obj => obj.views, set: (obj, value) => { obj.views = value; } }, metadata: _metadata }, _views_initializers, _views_extraInitializers);
        __esDecorate(null, null, _helpful_decorators, { kind: "field", name: "helpful", static: false, private: false, access: { has: obj => "helpful" in obj, get: obj => obj.helpful, set: (obj, value) => { obj.helpful = value; } }, metadata: _metadata }, _helpful_initializers, _helpful_extraInitializers);
        __esDecorate(null, null, _notHelpful_decorators, { kind: "field", name: "notHelpful", static: false, private: false, access: { has: obj => "notHelpful" in obj, get: obj => obj.notHelpful, set: (obj, value) => { obj.notHelpful = value; } }, metadata: _metadata }, _notHelpful_initializers, _notHelpful_extraInitializers);
        __esDecorate(null, null, _relatedArticles_decorators, { kind: "field", name: "relatedArticles", static: false, private: false, access: { has: obj => "relatedArticles" in obj, get: obj => obj.relatedArticles, set: (obj, value) => { obj.relatedArticles = value; } }, metadata: _metadata }, _relatedArticles_initializers, _relatedArticles_extraInitializers);
        __esDecorate(null, null, _published_decorators, { kind: "field", name: "published", static: false, private: false, access: { has: obj => "published" in obj, get: obj => obj.published, set: (obj, value) => { obj.published = value; } }, metadata: _metadata }, _published_initializers, _published_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeBaseArticleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeBaseArticleModel = _classThis;
})();
exports.KnowledgeBaseArticleModel = KnowledgeBaseArticleModel;
/**
 * Case Escalation Model
 */
let CaseEscalationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_escalations', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _escalationLevel_decorators;
    let _escalationLevel_initializers = [];
    let _escalationLevel_extraInitializers = [];
    let _escalatedFrom_decorators;
    let _escalatedFrom_initializers = [];
    let _escalatedFrom_extraInitializers = [];
    let _escalatedTo_decorators;
    let _escalatedTo_initializers = [];
    let _escalatedTo_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _escalatedAt_decorators;
    let _escalatedAt_initializers = [];
    let _escalatedAt_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _case_decorators;
    let _case_initializers = [];
    let _case_extraInitializers = [];
    var CaseEscalationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.escalationLevel = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _escalationLevel_initializers, void 0));
            this.escalatedFrom = (__runInitializers(this, _escalationLevel_extraInitializers), __runInitializers(this, _escalatedFrom_initializers, void 0));
            this.escalatedTo = (__runInitializers(this, _escalatedFrom_extraInitializers), __runInitializers(this, _escalatedTo_initializers, void 0));
            this.reason = (__runInitializers(this, _escalatedTo_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.escalatedAt = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _escalatedAt_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _escalatedAt_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.case = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _case_initializers, void 0));
            __runInitializers(this, _case_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseEscalationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => HRCaseModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _escalationLevel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _escalatedFrom_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _escalatedTo_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _reason_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _escalatedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _case_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => HRCaseModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _escalationLevel_decorators, { kind: "field", name: "escalationLevel", static: false, private: false, access: { has: obj => "escalationLevel" in obj, get: obj => obj.escalationLevel, set: (obj, value) => { obj.escalationLevel = value; } }, metadata: _metadata }, _escalationLevel_initializers, _escalationLevel_extraInitializers);
        __esDecorate(null, null, _escalatedFrom_decorators, { kind: "field", name: "escalatedFrom", static: false, private: false, access: { has: obj => "escalatedFrom" in obj, get: obj => obj.escalatedFrom, set: (obj, value) => { obj.escalatedFrom = value; } }, metadata: _metadata }, _escalatedFrom_initializers, _escalatedFrom_extraInitializers);
        __esDecorate(null, null, _escalatedTo_decorators, { kind: "field", name: "escalatedTo", static: false, private: false, access: { has: obj => "escalatedTo" in obj, get: obj => obj.escalatedTo, set: (obj, value) => { obj.escalatedTo = value; } }, metadata: _metadata }, _escalatedTo_initializers, _escalatedTo_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _escalatedAt_decorators, { kind: "field", name: "escalatedAt", static: false, private: false, access: { has: obj => "escalatedAt" in obj, get: obj => obj.escalatedAt, set: (obj, value) => { obj.escalatedAt = value; } }, metadata: _metadata }, _escalatedAt_initializers, _escalatedAt_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _case_decorators, { kind: "field", name: "case", static: false, private: false, access: { has: obj => "case" in obj, get: obj => obj.case, set: (obj, value) => { obj.case = value; } }, metadata: _metadata }, _case_initializers, _case_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseEscalationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseEscalationModel = _classThis;
})();
exports.CaseEscalationModel = CaseEscalationModel;
/**
 * Case Resolution Model
 */
let CaseResolutionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_resolutions', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _resolutionType_decorators;
    let _resolutionType_initializers = [];
    let _resolutionType_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _preventiveMeasures_decorators;
    let _preventiveMeasures_initializers = [];
    let _preventiveMeasures_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _satisfactionRating_decorators;
    let _satisfactionRating_initializers = [];
    let _satisfactionRating_extraInitializers = [];
    let _satisfactionFeedback_decorators;
    let _satisfactionFeedback_initializers = [];
    let _satisfactionFeedback_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var CaseResolutionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.resolutionType = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _resolutionType_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _resolutionType_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.rootCause = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.preventiveMeasures = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _preventiveMeasures_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _preventiveMeasures_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.satisfactionRating = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _satisfactionRating_initializers, void 0));
            this.satisfactionFeedback = (__runInitializers(this, _satisfactionRating_extraInitializers), __runInitializers(this, _satisfactionFeedback_initializers, void 0));
            this.createdAt = (__runInitializers(this, _satisfactionFeedback_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseResolutionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _resolutionType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _resolutionNotes_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _preventiveMeasures_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _resolvedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _resolvedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _satisfactionRating_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _satisfactionFeedback_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _resolutionType_decorators, { kind: "field", name: "resolutionType", static: false, private: false, access: { has: obj => "resolutionType" in obj, get: obj => obj.resolutionType, set: (obj, value) => { obj.resolutionType = value; } }, metadata: _metadata }, _resolutionType_initializers, _resolutionType_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _preventiveMeasures_decorators, { kind: "field", name: "preventiveMeasures", static: false, private: false, access: { has: obj => "preventiveMeasures" in obj, get: obj => obj.preventiveMeasures, set: (obj, value) => { obj.preventiveMeasures = value; } }, metadata: _metadata }, _preventiveMeasures_initializers, _preventiveMeasures_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _satisfactionRating_decorators, { kind: "field", name: "satisfactionRating", static: false, private: false, access: { has: obj => "satisfactionRating" in obj, get: obj => obj.satisfactionRating, set: (obj, value) => { obj.satisfactionRating = value; } }, metadata: _metadata }, _satisfactionRating_initializers, _satisfactionRating_extraInitializers);
        __esDecorate(null, null, _satisfactionFeedback_decorators, { kind: "field", name: "satisfactionFeedback", static: false, private: false, access: { has: obj => "satisfactionFeedback" in obj, get: obj => obj.satisfactionFeedback, set: (obj, value) => { obj.satisfactionFeedback = value; } }, metadata: _metadata }, _satisfactionFeedback_initializers, _satisfactionFeedback_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseResolutionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseResolutionModel = _classThis;
})();
exports.CaseResolutionModel = CaseResolutionModel;
/**
 * Case Template Model
 */
let CaseTemplateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'case_templates', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _templateName_decorators;
    let _templateName_initializers = [];
    let _templateName_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _subCategory_decorators;
    let _subCategory_initializers = [];
    let _subCategory_extraInitializers = [];
    let _defaultPriority_decorators;
    let _defaultPriority_initializers = [];
    let _defaultPriority_extraInitializers = [];
    let _subjectTemplate_decorators;
    let _subjectTemplate_initializers = [];
    let _subjectTemplate_extraInitializers = [];
    let _descriptionTemplate_decorators;
    let _descriptionTemplate_initializers = [];
    let _descriptionTemplate_extraInitializers = [];
    let _workflowSteps_decorators;
    let _workflowSteps_initializers = [];
    let _workflowSteps_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
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
    var CaseTemplateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.templateName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _templateName_initializers, void 0));
            this.category = (__runInitializers(this, _templateName_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.subCategory = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subCategory_initializers, void 0));
            this.defaultPriority = (__runInitializers(this, _subCategory_extraInitializers), __runInitializers(this, _defaultPriority_initializers, void 0));
            this.subjectTemplate = (__runInitializers(this, _defaultPriority_extraInitializers), __runInitializers(this, _subjectTemplate_initializers, void 0));
            this.descriptionTemplate = (__runInitializers(this, _subjectTemplate_extraInitializers), __runInitializers(this, _descriptionTemplate_initializers, void 0));
            this.workflowSteps = (__runInitializers(this, _descriptionTemplate_extraInitializers), __runInitializers(this, _workflowSteps_initializers, void 0));
            this.active = (__runInitializers(this, _workflowSteps_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.usageCount = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.createdBy = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CaseTemplateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _templateName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _category_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _subCategory_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _defaultPriority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _subjectTemplate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _descriptionTemplate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _workflowSteps_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _active_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _usageCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _templateName_decorators, { kind: "field", name: "templateName", static: false, private: false, access: { has: obj => "templateName" in obj, get: obj => obj.templateName, set: (obj, value) => { obj.templateName = value; } }, metadata: _metadata }, _templateName_initializers, _templateName_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _subCategory_decorators, { kind: "field", name: "subCategory", static: false, private: false, access: { has: obj => "subCategory" in obj, get: obj => obj.subCategory, set: (obj, value) => { obj.subCategory = value; } }, metadata: _metadata }, _subCategory_initializers, _subCategory_extraInitializers);
        __esDecorate(null, null, _defaultPriority_decorators, { kind: "field", name: "defaultPriority", static: false, private: false, access: { has: obj => "defaultPriority" in obj, get: obj => obj.defaultPriority, set: (obj, value) => { obj.defaultPriority = value; } }, metadata: _metadata }, _defaultPriority_initializers, _defaultPriority_extraInitializers);
        __esDecorate(null, null, _subjectTemplate_decorators, { kind: "field", name: "subjectTemplate", static: false, private: false, access: { has: obj => "subjectTemplate" in obj, get: obj => obj.subjectTemplate, set: (obj, value) => { obj.subjectTemplate = value; } }, metadata: _metadata }, _subjectTemplate_initializers, _subjectTemplate_extraInitializers);
        __esDecorate(null, null, _descriptionTemplate_decorators, { kind: "field", name: "descriptionTemplate", static: false, private: false, access: { has: obj => "descriptionTemplate" in obj, get: obj => obj.descriptionTemplate, set: (obj, value) => { obj.descriptionTemplate = value; } }, metadata: _metadata }, _descriptionTemplate_initializers, _descriptionTemplate_extraInitializers);
        __esDecorate(null, null, _workflowSteps_decorators, { kind: "field", name: "workflowSteps", static: false, private: false, access: { has: obj => "workflowSteps" in obj, get: obj => obj.workflowSteps, set: (obj, value) => { obj.workflowSteps = value; } }, metadata: _metadata }, _workflowSteps_initializers, _workflowSteps_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseTemplateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseTemplateModel = _classThis;
})();
exports.CaseTemplateModel = CaseTemplateModel;
/**
 * External Ticket Integration Model
 */
let ExternalTicketIntegrationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'external_ticket_integrations', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _system_decorators;
    let _system_initializers = [];
    let _system_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _lastSyncAt_decorators;
    let _lastSyncAt_initializers = [];
    let _lastSyncAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ExternalTicketIntegrationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.system = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _system_initializers, void 0));
            this.status = (__runInitializers(this, _system_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.configuration = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.lastSyncAt = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _lastSyncAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastSyncAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExternalTicketIntegrationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _system_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('DISCONNECTED'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _configuration_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _lastSyncAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _system_decorators, { kind: "field", name: "system", static: false, private: false, access: { has: obj => "system" in obj, get: obj => obj.system, set: (obj, value) => { obj.system = value; } }, metadata: _metadata }, _system_initializers, _system_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _lastSyncAt_decorators, { kind: "field", name: "lastSyncAt", static: false, private: false, access: { has: obj => "lastSyncAt" in obj, get: obj => obj.lastSyncAt, set: (obj, value) => { obj.lastSyncAt = value; } }, metadata: _metadata }, _lastSyncAt_initializers, _lastSyncAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExternalTicketIntegrationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExternalTicketIntegrationModel = _classThis;
})();
exports.ExternalTicketIntegrationModel = ExternalTicketIntegrationModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * HR Case Creation & Tracking Functions
 */
/**
 * Create new HR case
 * @param caseData - Case data
 * @param transaction - Optional database transaction
 * @returns Created case
 */
async function createHRCase(caseData, transaction) {
    const validated = exports.HRCaseSchema.parse(caseData);
    // Generate unique case number
    const caseNumber = await generateCaseNumber(transaction);
    const hrCase = await HRCaseModel.create({
        ...validated,
        caseNumber,
        status: CaseStatus.NEW,
        tags: validated.tags || [],
        attachments: [],
        relatedCases: [],
    }, { transaction });
    // Create SLA tracking
    await createSLATracking(hrCase.id, hrCase.category, hrCase.priority, transaction);
    return hrCase;
}
/**
 * Generate unique case number
 */
async function generateCaseNumber(transaction) {
    const year = new Date().getFullYear();
    const count = await HRCaseModel.count({
        where: {
            caseNumber: { [sequelize_1.Op.like]: `CASE-${year}-%` },
        },
        transaction,
    });
    return `CASE-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Update case status
 * @param caseId - Case ID
 * @param newStatus - New status
 * @param updatedBy - User updating the status
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
async function updateCaseStatus(caseId, newStatus, updatedBy, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const updateData = { status: newStatus };
    if (newStatus === CaseStatus.RESOLVED) {
        updateData.resolvedAt = new Date();
    }
    else if (newStatus === CaseStatus.CLOSED) {
        updateData.closedAt = new Date();
    }
    await hrCase.update(updateData, { transaction });
    // Add system note
    await CaseNoteModel.create({
        caseId,
        authorId: 'SYSTEM',
        noteType: 'SYSTEM',
        content: `Case status changed to ${newStatus} by ${updatedBy}`,
        mentions: [],
        attachments: [],
    }, { transaction });
    return hrCase;
}
/**
 * Get case details with all related data
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case with details
 */
async function getCaseDetails(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, {
        include: [
            CaseNoteModel,
            CaseAssignmentModel,
            CaseEscalationModel,
        ],
        transaction,
    });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    return hrCase;
}
/**
 * List all cases for employee
 * @param employeeId - Employee ID
 * @param options - Query options
 * @param transaction - Optional database transaction
 * @returns List of cases
 */
async function listEmployeeCases(employeeId, options) {
    const where = { employeeId };
    if (options?.status) {
        where.status = options.status;
    }
    if (options?.category) {
        where.category = options.category;
    }
    const { count, rows } = await HRCaseModel.findAndCountAll({
        where,
        limit: options?.limit || 50,
        offset: options?.offset || 0,
        order: [['createdAt', 'DESC']],
        transaction: options?.transaction,
    });
    return { cases: rows, total: count };
}
/**
 * Case Categorization & Prioritization Functions
 */
/**
 * Categorize case by type using ML/rules
 * @param caseId - Case ID
 * @param suggestedCategory - Suggested category
 * @param suggestedSubCategory - Suggested sub-category
 * @param transaction - Optional database transaction
 * @returns Categorized case
 */
async function categorizeCaseByType(caseId, suggestedCategory, suggestedSubCategory, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    await hrCase.update({
        category: suggestedCategory,
        subCategory: suggestedSubCategory,
    }, { transaction });
    return hrCase;
}
/**
 * Set case priority based on urgency and impact
 * @param caseId - Case ID
 * @param priority - Priority level
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
async function setPriority(caseId, priority, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    await hrCase.update({ priority }, { transaction });
    // Update SLA tracking
    const slaTracking = await SLATrackingModel.findOne({
        where: { caseId },
        transaction,
    });
    if (slaTracking) {
        // Recalculate deadlines based on new priority
        const slaConfig = await SLAConfigurationModel.findOne({
            where: {
                category: hrCase.category,
                priority,
                active: true,
            },
            transaction,
        });
        if (slaConfig) {
            const now = new Date();
            const responseDeadline = new Date(now.getTime() + slaConfig.responseTimeHours * 60 * 60 * 1000);
            const resolutionDeadline = new Date(now.getTime() + slaConfig.resolutionTimeHours * 60 * 60 * 1000);
            await slaTracking.update({
                slaConfigId: slaConfig.id,
                responseDeadline,
                resolutionDeadline,
            }, { transaction });
        }
    }
    return hrCase;
}
/**
 * Auto-categorize case using ML
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Categorized case with confidence score
 */
async function autoCategorizeCaseUsingML(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, use ML model to categorize
    // For now, use simple keyword matching
    const subject = hrCase.subject.toLowerCase();
    const description = hrCase.description.toLowerCase();
    let suggestedCategory = CaseCategory.GENERAL_INQUIRY;
    let confidence = 0.5;
    if (subject.includes('payroll') || description.includes('paycheck')) {
        suggestedCategory = CaseCategory.PAYROLL;
        confidence = 0.9;
    }
    else if (subject.includes('benefits') || description.includes('insurance')) {
        suggestedCategory = CaseCategory.BENEFITS;
        confidence = 0.85;
    }
    else if (subject.includes('time off') || description.includes('vacation')) {
        suggestedCategory = CaseCategory.TIME_OFF;
        confidence = 0.8;
    }
    await hrCase.update({ category: suggestedCategory }, { transaction });
    return { case: hrCase, confidence };
}
/**
 * Case Assignment & Routing Functions
 */
/**
 * Assign case to agent
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Assignment record
 */
async function assignCaseToAgent(assignmentData, transaction) {
    const validated = exports.CaseAssignmentSchema.parse(assignmentData);
    const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${validated.caseId} not found`);
    }
    // Create assignment record
    const assignment = await CaseAssignmentModel.create({
        ...validated,
        assignedAt: new Date(),
    }, { transaction });
    // Update case
    await hrCase.update({
        assignedTo: validated.assignedTo,
        assignedTeam: validated.assignedTeam,
        status: CaseStatus.IN_PROGRESS,
    }, { transaction });
    return assignment;
}
/**
 * Route case by skill matching
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Routing recommendation
 */
async function routeCaseBySkill(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, use skill matching algorithm
    // For now, use category-based routing
    const teamMapping = {
        [CaseCategory.PAYROLL]: 'Payroll Team',
        [CaseCategory.BENEFITS]: 'Benefits Team',
        [CaseCategory.TIME_OFF]: 'Time & Attendance Team',
        [CaseCategory.PERFORMANCE]: 'Performance Management Team',
        [CaseCategory.COMPENSATION]: 'Compensation Team',
        [CaseCategory.ONBOARDING]: 'Onboarding Team',
        [CaseCategory.OFFBOARDING]: 'Offboarding Team',
        [CaseCategory.TRAINING]: 'L&D Team',
        [CaseCategory.POLICY_QUESTION]: 'HR Policy Team',
        [CaseCategory.COMPLAINT]: 'Employee Relations Team',
        [CaseCategory.IT_ACCESS]: 'IT Support Team',
        [CaseCategory.FACILITIES]: 'Facilities Team',
        [CaseCategory.GENERAL_INQUIRY]: 'General HR Team',
        [CaseCategory.OTHER]: 'General HR Team',
    };
    const recommendedTeam = teamMapping[hrCase.category] || 'General HR Team';
    const recommendedAgent = `${recommendedTeam}-Agent-01`; // Simplified
    return {
        recommendedAgent,
        recommendedTeam,
        matchScore: 0.85,
    };
}
/**
 * Reassign case to different agent
 * @param caseId - Case ID
 * @param newAssignee - New assignee
 * @param reason - Reassignment reason
 * @param transaction - Optional database transaction
 * @returns Reassignment record
 */
async function reassignCase(caseId, newAssignee, reason, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const assignment = await CaseAssignmentModel.create({
        caseId,
        assignedFrom: hrCase.assignedTo,
        assignedTo: newAssignee,
        assignmentReason: reason,
        assignedAt: new Date(),
    }, { transaction });
    await hrCase.update({ assignedTo: newAssignee }, { transaction });
    return assignment;
}
/**
 * Get agent workload for load balancing
 * @param agentId - Agent ID
 * @param transaction - Optional database transaction
 * @returns Workload metrics
 */
async function getAgentWorkload(agentId, transaction) {
    const activeCases = await HRCaseModel.count({
        where: {
            assignedTo: agentId,
            status: { [sequelize_1.Op.in]: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
        },
        transaction,
    });
    const criticalCases = await HRCaseModel.count({
        where: {
            assignedTo: agentId,
            priority: CasePriority.CRITICAL,
            status: { [sequelize_1.Op.in]: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
        },
        transaction,
    });
    // Simplified capacity calculation
    const capacity = Math.max(0, 20 - activeCases); // Assume max 20 cases per agent
    return {
        activeCases,
        criticalCases,
        averageResolutionTime: 12, // In hours, simplified
        capacity,
    };
}
/**
 * Service Level Agreements (SLA) Functions
 */
/**
 * Define SLA for case type
 * @param slaData - SLA configuration data
 * @param transaction - Optional database transaction
 * @returns Created SLA configuration
 */
async function defineSLAForCaseType(slaData, transaction) {
    const validated = exports.SLAConfigurationSchema.parse(slaData);
    const slaConfig = await SLAConfigurationModel.create({
        ...validated,
        active: true,
    }, { transaction });
    return slaConfig;
}
/**
 * Create SLA tracking for case
 */
async function createSLATracking(caseId, category, priority, transaction) {
    const slaConfig = await SLAConfigurationModel.findOne({
        where: { category, priority, active: true },
        transaction,
    });
    if (!slaConfig) {
        // Use default SLA if no config found
        const defaultResponseHours = 4;
        const defaultResolutionHours = 24;
        const now = new Date();
        const responseDeadline = new Date(now.getTime() + defaultResponseHours * 60 * 60 * 1000);
        const resolutionDeadline = new Date(now.getTime() + defaultResolutionHours * 60 * 60 * 1000);
        // Create default config
        const defaultConfig = await SLAConfigurationModel.create({
            category,
            priority,
            responseTimeHours: defaultResponseHours,
            resolutionTimeHours: defaultResolutionHours,
            escalationEnabled: true,
            escalationThresholdPercent: 80,
            active: true,
        }, { transaction });
        return SLATrackingModel.create({
            caseId,
            slaConfigId: defaultConfig.id,
            responseDeadline,
            resolutionDeadline,
            status: SLAStatus.ON_TRACK,
            pausedDuration: 0,
        }, { transaction });
    }
    const now = new Date();
    const responseDeadline = new Date(now.getTime() + slaConfig.responseTimeHours * 60 * 60 * 1000);
    const resolutionDeadline = new Date(now.getTime() + slaConfig.resolutionTimeHours * 60 * 60 * 1000);
    const slaTracking = await SLATrackingModel.create({
        caseId,
        slaConfigId: slaConfig.id,
        responseDeadline,
        resolutionDeadline,
        status: SLAStatus.ON_TRACK,
        pausedDuration: 0,
    }, { transaction });
    return slaTracking;
}
/**
 * Track SLA compliance for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns SLA tracking with current status
 */
async function trackSLACompliance(caseId, transaction) {
    const slaTracking = await SLATrackingModel.findOne({
        where: { caseId },
        include: [SLAConfigurationModel],
        transaction,
    });
    if (!slaTracking) {
        throw new common_1.NotFoundException(`SLA tracking for case ${caseId} not found`);
    }
    // Update status based on current time
    const now = new Date();
    const resolutionDeadline = slaTracking.resolutionDeadline;
    const timeRemaining = resolutionDeadline.getTime() - now.getTime();
    const totalTime = resolutionDeadline.getTime() - (slaTracking.createdAt?.getTime() || now.getTime());
    const percentRemaining = (timeRemaining / totalTime) * 100;
    let newStatus = SLAStatus.ON_TRACK;
    if (timeRemaining < 0) {
        newStatus = SLAStatus.BREACHED;
        if (!slaTracking.breachedAt) {
            await slaTracking.update({ breachedAt: now, status: newStatus }, { transaction });
        }
    }
    else if (percentRemaining < 20) {
        newStatus = SLAStatus.AT_RISK;
        await slaTracking.update({ status: newStatus }, { transaction });
    }
    return slaTracking;
}
/**
 * Alert when SLA breach is imminent
 * @param hoursBeforeBreach - Hours before breach to alert
 * @param transaction - Optional database transaction
 * @returns List of cases at risk
 */
async function alertSLABreach(hoursBeforeBreach, transaction) {
    const alertTime = new Date();
    alertTime.setHours(alertTime.getHours() + hoursBeforeBreach);
    const atRiskCases = await SLATrackingModel.findAll({
        where: {
            resolutionDeadline: { [sequelize_1.Op.lte]: alertTime },
            status: { [sequelize_1.Op.in]: [SLAStatus.ON_TRACK, SLAStatus.AT_RISK] },
        },
        include: [SLAConfigurationModel],
        transaction,
    });
    return atRiskCases;
}
/**
 * Case Collaboration & Notes Functions
 */
/**
 * Add note to case
 * @param noteData - Note data
 * @param transaction - Optional database transaction
 * @returns Created note
 */
async function addCaseNote(noteData, transaction) {
    const validated = exports.CaseNoteSchema.parse(noteData);
    const note = await CaseNoteModel.create({
        ...validated,
        mentions: validated.mentions || [],
        attachments: [],
    }, { transaction });
    // Update case updatedAt
    await HRCaseModel.update({ updatedAt: new Date() }, { where: { id: validated.caseId }, transaction });
    return note;
}
/**
 * Tag collaborators in case notes
 * @param noteId - Note ID
 * @param userIds - Array of user IDs to tag
 * @param transaction - Optional database transaction
 * @returns Updated note
 */
async function tagCollaborators(noteId, userIds, transaction) {
    const note = await CaseNoteModel.findByPk(noteId, { transaction });
    if (!note) {
        throw new common_1.NotFoundException(`Note ${noteId} not found`);
    }
    const existingMentions = note.mentions || [];
    const updatedMentions = Array.from(new Set([...existingMentions, ...userIds]));
    await note.update({ mentions: updatedMentions }, { transaction });
    return note;
}
/**
 * Get case history with all notes
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case notes in chronological order
 */
async function getCaseHistory(caseId, transaction) {
    const notes = await CaseNoteModel.findAll({
        where: { caseId },
        order: [['createdAt', 'ASC']],
        transaction,
    });
    return notes;
}
/**
 * Knowledge Base Integration Functions
 */
/**
 * Search knowledge base for solutions
 * @param searchQuery - Search query
 * @param category - Optional category filter
 * @param transaction - Optional database transaction
 * @returns Matching articles
 */
async function searchKnowledgeBase(searchQuery, category, transaction) {
    const where = {
        published: true,
        [sequelize_1.Op.or]: [
            { title: { [sequelize_1.Op.iLike]: `%${searchQuery}%` } },
            { content: { [sequelize_1.Op.iLike]: `%${searchQuery}%` } },
            { tags: { [sequelize_1.Op.contains]: [searchQuery] } },
        ],
    };
    if (category) {
        where.category = category;
    }
    const articles = await KnowledgeBaseArticleModel.findAll({
        where,
        order: [['views', 'DESC']],
        limit: 10,
        transaction,
    });
    // Increment view count
    for (const article of articles) {
        await article.increment('views', { transaction });
    }
    return articles;
}
/**
 * Link KB article to case
 * @param caseId - Case ID
 * @param articleId - Article ID
 * @param transaction - Optional database transaction
 * @returns Confirmation
 */
async function linkArticleToCase(caseId, articleId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const article = await KnowledgeBaseArticleModel.findByPk(articleId, { transaction });
    if (!article) {
        throw new common_1.NotFoundException(`Article ${articleId} not found`);
    }
    // Add note with article link
    await CaseNoteModel.create({
        caseId,
        authorId: 'SYSTEM',
        noteType: 'SYSTEM',
        content: `Knowledge base article linked: ${article.title}`,
        mentions: [],
        attachments: [articleId],
    }, { transaction });
    return { linked: true };
}
/**
 * Suggest relevant KB articles for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Suggested articles
 */
async function suggestKBArticles(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // Search based on case subject and category
    const articles = await searchKnowledgeBase(hrCase.subject, hrCase.category, transaction);
    return articles;
}
/**
 * Case Escalation Management Functions
 */
/**
 * Escalate case to higher level
 * @param escalationData - Escalation data
 * @param transaction - Optional database transaction
 * @returns Escalation record
 */
async function escalateCase(escalationData, transaction) {
    const validated = exports.CaseEscalationSchema.parse(escalationData);
    const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${validated.caseId} not found`);
    }
    const escalation = await CaseEscalationModel.create({
        ...validated,
        escalatedAt: new Date(),
    }, { transaction });
    // Update case status
    await hrCase.update({
        status: CaseStatus.ESCALATED,
        assignedTo: validated.escalatedTo,
    }, { transaction });
    return escalation;
}
/**
 * Track escalation path for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Escalation history
 */
async function trackEscalationPath(caseId, transaction) {
    const escalations = await CaseEscalationModel.findAll({
        where: { caseId },
        order: [['escalatedAt', 'ASC']],
        transaction,
    });
    return escalations;
}
/**
 * Notify stakeholders of escalation
 * @param escalationId - Escalation ID
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
async function notifyEscalationStakeholders(escalationId, transaction) {
    const escalation = await CaseEscalationModel.findByPk(escalationId, {
        include: [HRCaseModel],
        transaction,
    });
    if (!escalation) {
        throw new common_1.NotFoundException(`Escalation ${escalationId} not found`);
    }
    // In real implementation, send notifications
    const recipientCount = 3; // Escalated person, manager, HR lead
    return {
        notified: true,
        recipientCount,
    };
}
/**
 * De-escalate case back to normal flow
 * @param caseId - Case ID
 * @param reason - De-escalation reason
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
async function deEscalateCase(caseId, reason, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // Mark latest escalation as resolved
    const latestEscalation = await CaseEscalationModel.findOne({
        where: { caseId, resolvedAt: null },
        order: [['escalatedAt', 'DESC']],
        transaction,
    });
    if (latestEscalation) {
        await latestEscalation.update({ resolvedAt: new Date() }, { transaction });
    }
    await hrCase.update({ status: CaseStatus.IN_PROGRESS }, { transaction });
    await CaseNoteModel.create({
        caseId,
        authorId: 'SYSTEM',
        noteType: 'SYSTEM',
        content: `Case de-escalated: ${reason}`,
        mentions: [],
        attachments: [],
    }, { transaction });
    return hrCase;
}
/**
 * Case Resolution & Closure Functions
 */
/**
 * Resolve case with solution
 * @param resolutionData - Resolution data
 * @param transaction - Optional database transaction
 * @returns Resolution record
 */
async function resolveCaseWithSolution(resolutionData, transaction) {
    const validated = exports.CaseResolutionSchema.parse(resolutionData);
    const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${validated.caseId} not found`);
    }
    const resolution = await CaseResolutionModel.create({
        ...validated,
        resolvedAt: new Date(),
    }, { transaction });
    // Update case
    await hrCase.update({
        status: CaseStatus.RESOLVED,
        resolvedAt: new Date(),
    }, { transaction });
    // Update SLA tracking
    const slaTracking = await SLATrackingModel.findOne({
        where: { caseId: validated.caseId },
        transaction,
    });
    if (slaTracking) {
        await slaTracking.update({
            status: SLAStatus.COMPLETED,
            firstResponseAt: slaTracking.firstResponseAt || new Date(),
        }, { transaction });
    }
    return resolution;
}
/**
 * Close case after resolution
 * @param caseId - Case ID
 * @param closedBy - User closing the case
 * @param transaction - Optional database transaction
 * @returns Closed case
 */
async function closeCase(caseId, closedBy, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    if (hrCase.status !== CaseStatus.RESOLVED) {
        throw new common_1.BadRequestException('Can only close resolved cases');
    }
    await hrCase.update({
        status: CaseStatus.CLOSED,
        closedAt: new Date(),
    }, { transaction });
    await CaseNoteModel.create({
        caseId,
        authorId: closedBy,
        noteType: 'SYSTEM',
        content: `Case closed by ${closedBy}`,
        mentions: [],
        attachments: [],
    }, { transaction });
    return hrCase;
}
/**
 * Request employee feedback on resolution
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Feedback request result
 */
async function requestEmployeeFeedback(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, send survey email
    const surveyUrl = `/feedback/${caseId}`;
    return {
        requestSent: true,
        surveyUrl,
    };
}
/**
 * Track case resolution time metrics
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Resolution metrics
 */
async function trackResolutionTime(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const slaTracking = await SLATrackingModel.findOne({
        where: { caseId },
        transaction,
    });
    const createdAt = hrCase.createdAt.getTime();
    const resolvedAt = hrCase.resolvedAt?.getTime() || Date.now();
    const totalTimeHours = (resolvedAt - createdAt) / (1000 * 60 * 60);
    const firstResponseAt = slaTracking?.firstResponseAt?.getTime() || resolvedAt;
    const responseTimeHours = (firstResponseAt - createdAt) / (1000 * 60 * 60);
    const resolutionTimeHours = totalTimeHours;
    const slaCompliant = slaTracking ? slaTracking.status !== SLAStatus.BREACHED : true;
    return {
        totalTimeHours: Math.round(totalTimeHours * 100) / 100,
        responseTimeHours: Math.round(responseTimeHours * 100) / 100,
        resolutionTimeHours: Math.round(resolutionTimeHours * 100) / 100,
        slaCompliant,
    };
}
/**
 * Employee Portal Integration Functions
 */
/**
 * Submit case from employee portal
 * @param caseData - Case data from portal
 * @param transaction - Optional database transaction
 * @returns Created case
 */
async function submitCaseFromPortal(caseData, transaction) {
    const hrCase = await createHRCase({
        ...caseData,
        channel: CaseChannel.EMPLOYEE_PORTAL,
    }, transaction);
    return hrCase;
}
/**
 * Get case status for employee
 * @param caseId - Case ID
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Case status information
 */
async function getCaseStatusForEmployee(caseId, employeeId, transaction) {
    const hrCase = await HRCaseModel.findOne({
        where: { id: caseId, employeeId },
        transaction,
    });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found for employee ${employeeId}`);
    }
    const publicNotes = await CaseNoteModel.findAll({
        where: {
            caseId,
            noteType: 'PUBLIC',
        },
        order: [['createdAt', 'DESC']],
        transaction,
    });
    return {
        caseNumber: hrCase.caseNumber,
        status: hrCase.status,
        lastUpdate: hrCase.updatedAt,
        assignedTo: hrCase.assignedTo,
        notes: publicNotes,
    };
}
/**
 * Send case update notification to employee
 * @param caseId - Case ID
 * @param message - Update message
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
async function sendCaseUpdateNotification(caseId, message, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, send email/push notification
    return { sent: true };
}
/**
 * Case Templates & Workflows Functions
 */
/**
 * Create reusable case template
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 */
async function createCaseTemplate(templateData, transaction) {
    const validated = exports.CaseTemplateSchema.parse(templateData);
    const template = await CaseTemplateModel.create({
        ...validated,
        workflowSteps: [],
        active: true,
        usageCount: 0,
    }, { transaction });
    return template;
}
/**
 * Apply workflow template to case
 * @param caseId - Case ID
 * @param templateId - Template ID
 * @param transaction - Optional database transaction
 * @returns Case with applied workflow
 */
async function applyCaseWorkflow(caseId, templateId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const template = await CaseTemplateModel.findByPk(templateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Template ${templateId} not found`);
    }
    // Increment usage count
    await template.increment('usageCount', { transaction });
    // Add workflow notes
    for (const step of template.workflowSteps) {
        await CaseNoteModel.create({
            caseId,
            authorId: 'SYSTEM',
            noteType: 'INTERNAL',
            content: `Workflow Step ${step.stepNumber}: ${step.stepName} - ${step.description}`,
            mentions: [],
            attachments: [],
        }, { transaction });
    }
    return hrCase;
}
/**
 * Track workflow progress for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Workflow progress
 */
async function trackWorkflowProgress(caseId, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, track actual workflow progress
    // For now, return simplified metrics
    const totalSteps = 5;
    const completedSteps = 3;
    const currentStep = 4;
    const percentComplete = (completedSteps / totalSteps) * 100;
    return {
        totalSteps,
        completedSteps,
        currentStep,
        percentComplete: Math.round(percentComplete),
    };
}
/**
 * Case Analytics & Reporting Functions
 */
/**
 * Generate case analytics for period
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Analytics data
 */
async function generateCaseAnalytics(startDate, endDate, transaction) {
    const cases = await HRCaseModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        transaction,
    });
    const totalCases = cases.length;
    const openCases = cases.filter((c) => [CaseStatus.NEW, CaseStatus.OPEN, CaseStatus.IN_PROGRESS].includes(c.status)).length;
    const resolvedCases = cases.filter((c) => c.status === CaseStatus.RESOLVED || c.status === CaseStatus.CLOSED).length;
    // Calculate average resolution time
    const resolvedCasesWithTime = cases.filter((c) => c.resolvedAt);
    const avgResolutionTime = resolvedCasesWithTime.length > 0
        ? resolvedCasesWithTime.reduce((sum, c) => sum + (c.resolvedAt.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60), 0) / resolvedCasesWithTime.length
        : 0;
    // Get SLA compliance
    const slaTracking = await SLATrackingModel.findAll({
        where: {
            caseId: { [sequelize_1.Op.in]: cases.map((c) => c.id) },
        },
        transaction,
    });
    const slaCompliantCount = slaTracking.filter((s) => s.status !== SLAStatus.BREACHED).length;
    const slaComplianceRate = slaTracking.length > 0 ? (slaCompliantCount / slaTracking.length) * 100 : 100;
    // Get satisfaction ratings
    const resolutions = await CaseResolutionModel.findAll({
        where: {
            caseId: { [sequelize_1.Op.in]: cases.map((c) => c.id) },
            satisfactionRating: { [sequelize_1.Op.ne]: null },
        },
        transaction,
    });
    const satisfactionScores = resolutions
        .filter((r) => r.satisfactionRating)
        .map((r) => {
        const ratings = {
            [SatisfactionRating.VERY_SATISFIED]: 5,
            [SatisfactionRating.SATISFIED]: 4,
            [SatisfactionRating.NEUTRAL]: 3,
            [SatisfactionRating.DISSATISFIED]: 2,
            [SatisfactionRating.VERY_DISSATISFIED]: 1,
        };
        return ratings[r.satisfactionRating] || 3;
    });
    const satisfactionScore = satisfactionScores.length > 0
        ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
        : 0;
    // Group by category
    const byCategory = new Map();
    cases.forEach((c) => {
        byCategory.set(c.category, (byCategory.get(c.category) || 0) + 1);
    });
    // Group by priority
    const byPriority = new Map();
    cases.forEach((c) => {
        byPriority.set(c.priority, (byPriority.get(c.priority) || 0) + 1);
    });
    return {
        period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
        totalCases,
        openCases,
        resolvedCases,
        averageResolutionTimeHours: Math.round(avgResolutionTime * 100) / 100,
        slaComplianceRate: Math.round(slaComplianceRate * 100) / 100,
        satisfactionScore: Math.round(satisfactionScore * 100) / 100,
        byCategory,
        byPriority,
    };
}
/**
 * Track case metrics over time
 * @param metric - Metric to track
 * @param days - Number of days to track
 * @param transaction - Optional database transaction
 * @returns Metric data
 */
async function trackCaseMetrics(metric, days, transaction) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const cases = await HRCaseModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        transaction,
    });
    const metrics = [];
    // Simplified metrics
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        let value = 0;
        if (metric === 'VOLUME') {
            value = cases.filter((c) => c.createdAt.toISOString().split('T')[0] === dateStr).length;
        }
        else if (metric === 'RESOLUTION_TIME') {
            value = 12; // Simplified
        }
        else if (metric === 'SLA_COMPLIANCE') {
            value = 95; // Simplified
        }
        metrics.push({ date: dateStr, value });
    }
    return metrics;
}
/**
 * Export case reports
 * @param startDate - Start date
 * @param endDate - End date
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
async function exportCaseReports(startDate, endDate, format, transaction) {
    const analytics = await generateCaseAnalytics(startDate, endDate, transaction);
    // In real implementation, generate actual export file
    return {
        exported: true,
        url: `/exports/cases/${startDate.toISOString()}-${endDate.toISOString()}.${format.toLowerCase()}`,
    };
}
/**
 * Integration with Ticketing Systems Functions
 */
/**
 * Sync with external ticketing system
 * @param system - Ticketing system
 * @param transaction - Optional database transaction
 * @returns Sync result
 */
async function syncWithExternalTicketingSystem(system, transaction) {
    const integration = await ExternalTicketIntegrationModel.findOne({
        where: { system },
        transaction,
    });
    if (!integration) {
        throw new common_1.NotFoundException(`Integration with ${system} not found`);
    }
    // In real implementation, sync with external API
    const recordsSynced = 10;
    await integration.update({ lastSyncAt: new Date() }, { transaction });
    return {
        synced: true,
        recordsSynced,
    };
}
/**
 * Create Jira ticket from case
 * @param caseId - Case ID
 * @param projectKey - Jira project key
 * @param transaction - Optional database transaction
 * @returns Jira ticket info
 */
async function createJiraTicketFromCase(caseId, projectKey, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    // In real implementation, create Jira ticket via API
    const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000)}`;
    const ticketUrl = `https://jira.example.com/browse/${ticketId}`;
    await hrCase.update({
        externalTicketId: ticketId,
        externalSystem: TicketingSystem.JIRA,
    }, { transaction });
    return {
        ticketId,
        ticketUrl,
    };
}
/**
 * Update case from external system
 * @param caseId - Case ID
 * @param externalData - Data from external system
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
async function updateCaseFromExternalSystem(caseId, externalData, transaction) {
    const hrCase = await HRCaseModel.findByPk(caseId, { transaction });
    if (!hrCase) {
        throw new common_1.NotFoundException(`Case ${caseId} not found`);
    }
    const updates = {};
    if (externalData.assignee) {
        updates.assignedTo = externalData.assignee;
    }
    if (Object.keys(updates).length > 0) {
        await hrCase.update(updates, { transaction });
    }
    if (externalData.notes) {
        await CaseNoteModel.create({
            caseId,
            authorId: 'EXTERNAL_SYSTEM',
            noteType: 'INTERNAL',
            content: externalData.notes,
            mentions: [],
            attachments: [],
        }, { transaction });
    }
    return hrCase;
}
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * HR Case Management Service
 * Provides enterprise-grade HR case and ticket management
 */
let HRCaseManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('HR Case Management')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HRCaseManagementService = _classThis = class {
        // Case Creation & Tracking
        async createHRCase(data, transaction) {
            return createHRCase(data, transaction);
        }
        async updateCaseStatus(caseId, newStatus, updatedBy, transaction) {
            return updateCaseStatus(caseId, newStatus, updatedBy, transaction);
        }
        async getCaseDetails(caseId, transaction) {
            return getCaseDetails(caseId, transaction);
        }
        async listEmployeeCases(employeeId, options) {
            return listEmployeeCases(employeeId, options);
        }
        // Categorization & Prioritization
        async categorizeCaseByType(caseId, category, subCategory, transaction) {
            return categorizeCaseByType(caseId, category, subCategory, transaction);
        }
        async setPriority(caseId, priority, transaction) {
            return setPriority(caseId, priority, transaction);
        }
        async autoCategorizeCaseUsingML(caseId, transaction) {
            return autoCategorizeCaseUsingML(caseId, transaction);
        }
        // Assignment & Routing
        async assignCaseToAgent(data, transaction) {
            return assignCaseToAgent(data, transaction);
        }
        async routeCaseBySkill(caseId, transaction) {
            return routeCaseBySkill(caseId, transaction);
        }
        async reassignCase(caseId, newAssignee, reason, transaction) {
            return reassignCase(caseId, newAssignee, reason, transaction);
        }
        async getAgentWorkload(agentId, transaction) {
            return getAgentWorkload(agentId, transaction);
        }
        // SLA Management
        async defineSLAForCaseType(data, transaction) {
            return defineSLAForCaseType(data, transaction);
        }
        async trackSLACompliance(caseId, transaction) {
            return trackSLACompliance(caseId, transaction);
        }
        async alertSLABreach(hoursBeforeBreach, transaction) {
            return alertSLABreach(hoursBeforeBreach, transaction);
        }
        // Collaboration & Notes
        async addCaseNote(data, transaction) {
            return addCaseNote(data, transaction);
        }
        async tagCollaborators(noteId, userIds, transaction) {
            return tagCollaborators(noteId, userIds, transaction);
        }
        async getCaseHistory(caseId, transaction) {
            return getCaseHistory(caseId, transaction);
        }
        // Knowledge Base
        async searchKnowledgeBase(query, category, transaction) {
            return searchKnowledgeBase(query, category, transaction);
        }
        async linkArticleToCase(caseId, articleId, transaction) {
            return linkArticleToCase(caseId, articleId, transaction);
        }
        async suggestKBArticles(caseId, transaction) {
            return suggestKBArticles(caseId, transaction);
        }
        // Escalation
        async escalateCase(data, transaction) {
            return escalateCase(data, transaction);
        }
        async trackEscalationPath(caseId, transaction) {
            return trackEscalationPath(caseId, transaction);
        }
        async notifyEscalationStakeholders(escalationId, transaction) {
            return notifyEscalationStakeholders(escalationId, transaction);
        }
        async deEscalateCase(caseId, reason, transaction) {
            return deEscalateCase(caseId, reason, transaction);
        }
        // Resolution & Closure
        async resolveCaseWithSolution(data, transaction) {
            return resolveCaseWithSolution(data, transaction);
        }
        async closeCase(caseId, closedBy, transaction) {
            return closeCase(caseId, closedBy, transaction);
        }
        async requestEmployeeFeedback(caseId, transaction) {
            return requestEmployeeFeedback(caseId, transaction);
        }
        async trackResolutionTime(caseId, transaction) {
            return trackResolutionTime(caseId, transaction);
        }
        // Portal Integration
        async submitCaseFromPortal(data, transaction) {
            return submitCaseFromPortal(data, transaction);
        }
        async getCaseStatusForEmployee(caseId, employeeId, transaction) {
            return getCaseStatusForEmployee(caseId, employeeId, transaction);
        }
        async sendCaseUpdateNotification(caseId, message, transaction) {
            return sendCaseUpdateNotification(caseId, message, transaction);
        }
        // Templates & Workflows
        async createCaseTemplate(data, transaction) {
            return createCaseTemplate(data, transaction);
        }
        async applyCaseWorkflow(caseId, templateId, transaction) {
            return applyCaseWorkflow(caseId, templateId, transaction);
        }
        async trackWorkflowProgress(caseId, transaction) {
            return trackWorkflowProgress(caseId, transaction);
        }
        // Analytics & Reporting
        async generateCaseAnalytics(startDate, endDate, transaction) {
            return generateCaseAnalytics(startDate, endDate, transaction);
        }
        async trackCaseMetrics(metric, days, transaction) {
            return trackCaseMetrics(metric, days, transaction);
        }
        async exportCaseReports(startDate, endDate, format, transaction) {
            return exportCaseReports(startDate, endDate, format, transaction);
        }
        // External Ticketing
        async syncWithExternalTicketingSystem(system, transaction) {
            return syncWithExternalTicketingSystem(system, transaction);
        }
        async createJiraTicketFromCase(caseId, projectKey, transaction) {
            return createJiraTicketFromCase(caseId, projectKey, transaction);
        }
        async updateCaseFromExternalSystem(caseId, externalData, transaction) {
            return updateCaseFromExternalSystem(caseId, externalData, transaction);
        }
    };
    __setFunctionName(_classThis, "HRCaseManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HRCaseManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HRCaseManagementService = _classThis;
})();
exports.HRCaseManagementService = HRCaseManagementService;
//# sourceMappingURL=hr-case-management-kit.js.map