"use strict";
/**
 * LOC: HCM_COMP_001
 * File: /reuse/server/human-capital/compliance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - HR compliance controllers
 *   - Audit & reporting services
 *   - Regulatory filing systems
 *   - Employee self-service portals
 *   - Legal & compliance dashboards
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
exports.ComplianceController = exports.ComplianceService = exports.EEOReportModel = exports.WhistleblowerCaseModel = exports.ComplianceAlertModel = exports.DocumentRetentionPolicyModel = exports.ComplianceTrainingModel = exports.WorkAuthorizationModel = exports.I9VerificationModel = exports.PolicyAcknowledgmentModel = exports.PolicyModel = exports.ComplianceIssueModel = exports.WhistleblowerCaseSchema = exports.ComplianceTrainingSchema = exports.WorkAuthorizationSchema = exports.I9RecordSchema = exports.PolicySchema = exports.ComplianceIssueSchema = exports.EEOCategory = exports.WhistleblowerStatus = exports.AlertStatus = exports.AlertSeverity = exports.RetentionCategory = exports.TrainingStatus = exports.AcknowledgmentStatus = exports.WorkAuthorizationType = exports.I9Status = exports.ComplianceStatus = exports.RegulatoryFramework = void 0;
exports.createComplianceIssue = createComplianceIssue;
exports.updateComplianceIssue = updateComplianceIssue;
exports.getComplianceIssuesByFramework = getComplianceIssuesByFramework;
exports.getComplianceIssuesByEmployee = getComplianceIssuesByEmployee;
exports.resolveComplianceIssue = resolveComplianceIssue;
exports.getOverdueComplianceIssues = getOverdueComplianceIssues;
exports.createPolicy = createPolicy;
exports.updatePolicy = updatePolicy;
exports.getActivePolicies = getActivePolicies;
exports.assignPolicyToEmployee = assignPolicyToEmployee;
exports.acknowledgePolicy = acknowledgePolicy;
exports.getPendingPolicyAcknowledgments = getPendingPolicyAcknowledgments;
exports.getOverduePolicyAcknowledgments = getOverduePolicyAcknowledgments;
exports.createI9Record = createI9Record;
exports.updateI9Record = updateI9Record;
exports.completeI9Section1 = completeI9Section1;
exports.completeI9Section2 = completeI9Section2;
exports.getI9RecordsRequiringReverification = getI9RecordsRequiringReverification;
exports.getExpiringI9Records = getExpiringI9Records;
exports.createWorkAuthorization = createWorkAuthorization;
exports.updateWorkAuthorization = updateWorkAuthorization;
exports.getWorkAuthorizationsByEmployee = getWorkAuthorizationsByEmployee;
exports.getExpiringWorkAuthorizations = getExpiringWorkAuthorizations;
exports.verifyWorkAuthorization = verifyWorkAuthorization;
exports.assignComplianceTraining = assignComplianceTraining;
exports.completeComplianceTraining = completeComplianceTraining;
exports.getOverdueComplianceTrainings = getOverdueComplianceTrainings;
exports.getExpiredComplianceTrainings = getExpiredComplianceTrainings;
exports.getEmployeeComplianceTrainings = getEmployeeComplianceTrainings;
exports.createRetentionPolicy = createRetentionPolicy;
exports.getRetentionPolicyByCategory = getRetentionPolicyByCategory;
exports.getActiveRetentionPolicies = getActiveRetentionPolicies;
exports.calculateDisposalDate = calculateDisposalDate;
exports.createComplianceAlert = createComplianceAlert;
exports.updateAlertStatus = updateAlertStatus;
exports.getOpenAlerts = getOpenAlerts;
exports.getEmployeeAlerts = getEmployeeAlerts;
exports.dismissAlert = dismissAlert;
exports.submitWhistleblowerCase = submitWhistleblowerCase;
exports.assignWhistleblowerCase = assignWhistleblowerCase;
exports.updateWhistleblowerInvestigation = updateWhistleblowerInvestigation;
exports.closeWhistleblowerCase = closeWhistleblowerCase;
exports.getActiveWhistleblowerCases = getActiveWhistleblowerCases;
exports.createEEOReport = createEEOReport;
exports.updateEEOReport = updateEEOReport;
exports.getEEOReportByYear = getEEOReportByYear;
exports.getAllEEOReports = getAllEEOReports;
exports.getComplianceDashboardMetrics = getComplianceDashboardMetrics;
exports.generateComplianceReportByFramework = generateComplianceReportByFramework;
/**
 * File: /reuse/server/human-capital/compliance-management-kit.ts
 * Locator: WC-HCM-COMP-001
 * Purpose: Compliance Management Kit - Comprehensive employment law & regulatory compliance
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/compliance/*, ../services/audit/*, Legal systems, Regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 49 utility functions for regulatory compliance tracking (FLSA, ADA, EEOC, OFCCP),
 *          employment law compliance, audit trails, policy management, compliance training,
 *          I-9 verification, work authorization, EEO/AAP reporting, OSHA compliance,
 *          GDPR/CCPA data privacy, document retention, compliance alerts, whistleblower management
 *
 * LLM Context: Enterprise-grade employment compliance management for White Cross healthcare system.
 * Provides comprehensive regulatory compliance including FLSA wage & hour compliance, ADA reasonable
 * accommodation tracking, EEOC/OFCCP affirmative action programs, I-9 employment verification,
 * work authorization management, policy acknowledgment tracking, compliance training records,
 * OSHA workplace safety compliance, data privacy (GDPR/CCPA), document retention policies,
 * compliance alerts & notifications, audit trail management, whistleblower & ethics hotline,
 * compliance analytics & reporting. Designed for healthcare industry with SOC 2 and HIPAA compliance.
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
 * Regulatory framework enumeration
 */
var RegulatoryFramework;
(function (RegulatoryFramework) {
    RegulatoryFramework["FLSA"] = "flsa";
    RegulatoryFramework["ADA"] = "ada";
    RegulatoryFramework["FMLA"] = "fmla";
    RegulatoryFramework["EEOC"] = "eeoc";
    RegulatoryFramework["OFCCP"] = "ofccp";
    RegulatoryFramework["OSHA"] = "osha";
    RegulatoryFramework["COBRA"] = "cobra";
    RegulatoryFramework["HIPAA"] = "hipaa";
    RegulatoryFramework["GDPR"] = "gdpr";
    RegulatoryFramework["CCPA"] = "ccpa";
    RegulatoryFramework["WARN"] = "warn";
    RegulatoryFramework["USERRA"] = "userra";
    RegulatoryFramework["SOX"] = "sox";
    RegulatoryFramework["FCRA"] = "fcra";
    RegulatoryFramework["NLRA"] = "nlra";
})(RegulatoryFramework || (exports.RegulatoryFramework = RegulatoryFramework = {}));
/**
 * Compliance status enumeration
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    ComplianceStatus["PENDING_REVIEW"] = "pending_review";
    ComplianceStatus["UNDER_INVESTIGATION"] = "under_investigation";
    ComplianceStatus["REMEDIATED"] = "remediated";
    ComplianceStatus["WAIVED"] = "waived";
    ComplianceStatus["NOT_APPLICABLE"] = "not_applicable";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * I-9 verification status
 */
var I9Status;
(function (I9Status) {
    I9Status["NOT_STARTED"] = "not_started";
    I9Status["SECTION1_COMPLETED"] = "section1_completed";
    I9Status["SECTION2_PENDING"] = "section2_pending";
    I9Status["SECTION2_COMPLETED"] = "section2_completed";
    I9Status["SECTION3_PENDING"] = "section3_pending";
    I9Status["REVERIFICATION_REQUIRED"] = "reverification_required";
    I9Status["EXPIRED"] = "expired";
    I9Status["COMPLIANT"] = "compliant";
})(I9Status || (exports.I9Status = I9Status = {}));
/**
 * Work authorization type
 */
var WorkAuthorizationType;
(function (WorkAuthorizationType) {
    WorkAuthorizationType["US_CITIZEN"] = "us_citizen";
    WorkAuthorizationType["PERMANENT_RESIDENT"] = "permanent_resident";
    WorkAuthorizationType["H1B_VISA"] = "h1b_visa";
    WorkAuthorizationType["L1_VISA"] = "l1_visa";
    WorkAuthorizationType["F1_OPT"] = "f1_opt";
    WorkAuthorizationType["TN_VISA"] = "tn_visa";
    WorkAuthorizationType["EAD"] = "ead";
    WorkAuthorizationType["GREEN_CARD"] = "green_card";
    WorkAuthorizationType["REFUGEE"] = "refugee";
    WorkAuthorizationType["ASYLUM"] = "asylum";
})(WorkAuthorizationType || (exports.WorkAuthorizationType = WorkAuthorizationType = {}));
/**
 * Policy acknowledgment status
 */
var AcknowledgmentStatus;
(function (AcknowledgmentStatus) {
    AcknowledgmentStatus["PENDING"] = "pending";
    AcknowledgmentStatus["ACKNOWLEDGED"] = "acknowledged";
    AcknowledgmentStatus["DECLINED"] = "declined";
    AcknowledgmentStatus["EXPIRED"] = "expired";
    AcknowledgmentStatus["OVERDUE"] = "overdue";
})(AcknowledgmentStatus || (exports.AcknowledgmentStatus = AcknowledgmentStatus = {}));
/**
 * Compliance training status
 */
var TrainingStatus;
(function (TrainingStatus) {
    TrainingStatus["NOT_STARTED"] = "not_started";
    TrainingStatus["IN_PROGRESS"] = "in_progress";
    TrainingStatus["COMPLETED"] = "completed";
    TrainingStatus["FAILED"] = "failed";
    TrainingStatus["EXPIRED"] = "expired";
    TrainingStatus["WAIVED"] = "waived";
})(TrainingStatus || (exports.TrainingStatus = TrainingStatus = {}));
/**
 * Document retention category
 */
var RetentionCategory;
(function (RetentionCategory) {
    RetentionCategory["EMPLOYEE_RECORDS"] = "employee_records";
    RetentionCategory["PAYROLL"] = "payroll";
    RetentionCategory["TAX_RECORDS"] = "tax_records";
    RetentionCategory["BENEFITS"] = "benefits";
    RetentionCategory["SAFETY_RECORDS"] = "safety_records";
    RetentionCategory["MEDICAL_RECORDS"] = "medical_records";
    RetentionCategory["EMPLOYMENT_CONTRACTS"] = "employment_contracts";
    RetentionCategory["TERMINATION_RECORDS"] = "termination_records";
    RetentionCategory["COMPLIANCE_RECORDS"] = "compliance_records";
    RetentionCategory["LEGAL_HOLDS"] = "legal_holds";
})(RetentionCategory || (exports.RetentionCategory = RetentionCategory = {}));
/**
 * Alert severity
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["CRITICAL"] = "critical";
    AlertSeverity["HIGH"] = "high";
    AlertSeverity["MEDIUM"] = "medium";
    AlertSeverity["LOW"] = "low";
    AlertSeverity["INFO"] = "info";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
/**
 * Alert status
 */
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["OPEN"] = "open";
    AlertStatus["ACKNOWLEDGED"] = "acknowledged";
    AlertStatus["IN_PROGRESS"] = "in_progress";
    AlertStatus["RESOLVED"] = "resolved";
    AlertStatus["DISMISSED"] = "dismissed";
    AlertStatus["ESCALATED"] = "escalated";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
/**
 * Whistleblower case status
 */
var WhistleblowerStatus;
(function (WhistleblowerStatus) {
    WhistleblowerStatus["SUBMITTED"] = "submitted";
    WhistleblowerStatus["UNDER_REVIEW"] = "under_review";
    WhistleblowerStatus["INVESTIGATING"] = "investigating";
    WhistleblowerStatus["SUBSTANTIATED"] = "substantiated";
    WhistleblowerStatus["UNSUBSTANTIATED"] = "unsubstantiated";
    WhistleblowerStatus["CLOSED"] = "closed";
})(WhistleblowerStatus || (exports.WhistleblowerStatus = WhistleblowerStatus = {}));
/**
 * EEO category
 */
var EEOCategory;
(function (EEOCategory) {
    EEOCategory["EXECUTIVE_SENIOR_OFFICIALS"] = "1.1";
    EEOCategory["FIRST_MID_OFFICIALS_MANAGERS"] = "1.2";
    EEOCategory["PROFESSIONALS"] = "2";
    EEOCategory["TECHNICIANS"] = "3";
    EEOCategory["SALES_WORKERS"] = "4";
    EEOCategory["ADMINISTRATIVE_SUPPORT"] = "5";
    EEOCategory["CRAFT_WORKERS"] = "6";
    EEOCategory["OPERATIVES"] = "7";
    EEOCategory["LABORERS_HELPERS"] = "8";
    EEOCategory["SERVICE_WORKERS"] = "9";
})(EEOCategory || (exports.EEOCategory = EEOCategory = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Compliance issue validation schema
 */
exports.ComplianceIssueSchema = zod_1.z.object({
    framework: zod_1.z.nativeEnum(RegulatoryFramework),
    issueType: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(2000),
    severity: zod_1.z.nativeEnum(AlertSeverity),
    status: zod_1.z.nativeEnum(ComplianceStatus).default(ComplianceStatus.PENDING_REVIEW),
    employeeId: zod_1.z.string().uuid().optional(),
    departmentId: zod_1.z.string().uuid().optional(),
    identifiedDate: zod_1.z.coerce.date(),
    dueDate: zod_1.z.coerce.date().optional(),
    identifiedBy: zod_1.z.string().uuid(),
    assignedTo: zod_1.z.string().uuid().optional(),
    remediationPlan: zod_1.z.string().max(2000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Policy validation schema
 */
exports.PolicySchema = zod_1.z.object({
    policyNumber: zod_1.z.string().min(1).max(50),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(1000),
    category: zod_1.z.string().min(1).max(100),
    version: zod_1.z.string().min(1).max(20),
    effectiveDate: zod_1.z.coerce.date(),
    expiryDate: zod_1.z.coerce.date().optional(),
    requiresAcknowledgment: zod_1.z.boolean().default(true),
    acknowledgmentDeadlineDays: zod_1.z.number().int().positive().optional(),
    content: zod_1.z.string().optional(),
    attachments: zod_1.z.array(zod_1.z.string()).optional(),
    applicableRoles: zod_1.z.array(zod_1.z.string()).optional(),
    applicableDepartments: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().default(true),
});
/**
 * I-9 record validation schema
 */
exports.I9RecordSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(I9Status),
    section1CompletedDate: zod_1.z.coerce.date().optional(),
    section2CompletedDate: zod_1.z.coerce.date().optional(),
    section3CompletedDate: zod_1.z.coerce.date().optional(),
    verifiedBy: zod_1.z.string().uuid().optional(),
    documentType: zod_1.z.string().max(100).optional(),
    documentNumber: zod_1.z.string().max(100).optional(),
    expirationDate: zod_1.z.coerce.date().optional(),
    reverificationDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
/**
 * Work authorization validation schema
 */
exports.WorkAuthorizationSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    authorizationType: zod_1.z.nativeEnum(WorkAuthorizationType),
    documentNumber: zod_1.z.string().min(1).max(100),
    issueDate: zod_1.z.coerce.date(),
    expirationDate: zod_1.z.coerce.date().optional(),
    issuingCountry: zod_1.z.string().length(2), // ISO 2-letter code
    verifiedDate: zod_1.z.coerce.date(),
    verifiedBy: zod_1.z.string().uuid(),
    status: zod_1.z.string().max(50),
    notes: zod_1.z.string().max(1000).optional(),
});
/**
 * Compliance training validation schema
 */
exports.ComplianceTrainingSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    trainingTitle: zod_1.z.string().min(1).max(255),
    trainingCategory: zod_1.z.string().min(1).max(100),
    framework: zod_1.z.nativeEnum(RegulatoryFramework).optional(),
    assignedDate: zod_1.z.coerce.date(),
    dueDate: zod_1.z.coerce.date(),
    completedDate: zod_1.z.coerce.date().optional(),
    score: zod_1.z.number().min(0).max(100).optional(),
    passingScore: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.nativeEnum(TrainingStatus),
    certificateUrl: zod_1.z.string().url().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    assignedBy: zod_1.z.string().uuid(),
});
/**
 * Whistleblower case validation schema
 */
exports.WhistleblowerCaseSchema = zod_1.z.object({
    caseNumber: zod_1.z.string().min(1).max(50),
    reporterName: zod_1.z.string().max(255).optional(),
    reporterEmail: zod_1.z.string().email().optional(),
    isAnonymous: zod_1.z.boolean().default(false),
    category: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(5000),
    allegation: zod_1.z.string().min(1).max(5000),
    status: zod_1.z.nativeEnum(WhistleblowerStatus).default(WhistleblowerStatus.SUBMITTED),
    assignedTo: zod_1.z.string().uuid().optional(),
    investigationNotes: zod_1.z.string().optional(),
    finding: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Compliance Issue Model
 */
let ComplianceIssueModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'compliance_issues',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['framework'] },
                { fields: ['status'] },
                { fields: ['severity'] },
                { fields: ['employee_id'] },
                { fields: ['department_id'] },
                { fields: ['identified_date'] },
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
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _issueType_decorators;
    let _issueType_initializers = [];
    let _issueType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _identifiedDate_decorators;
    let _identifiedDate_initializers = [];
    let _identifiedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _resolvedDate_decorators;
    let _resolvedDate_initializers = [];
    let _resolvedDate_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _remediationPlan_decorators;
    let _remediationPlan_initializers = [];
    let _remediationPlan_extraInitializers = [];
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
    var ComplianceIssueModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.framework = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
            this.issueType = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _issueType_initializers, void 0));
            this.description = (__runInitializers(this, _issueType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.employeeId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.identifiedDate = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _identifiedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _identifiedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.resolvedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _resolvedDate_initializers, void 0));
            this.identifiedBy = (__runInitializers(this, _resolvedDate_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _identifiedBy_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.remediationPlan = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _remediationPlan_initializers, void 0));
            this.metadata = (__runInitializers(this, _remediationPlan_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceIssueModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _framework_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RegulatoryFramework)),
                allowNull: false,
                comment: 'Regulatory framework',
            })];
        _issueType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'issue_type',
                comment: 'Type of compliance issue',
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                comment: 'Issue description',
            })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertSeverity)),
                allowNull: false,
                comment: 'Issue severity',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceStatus)),
                allowNull: false,
                defaultValue: ComplianceStatus.PENDING_REVIEW,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'employee_id',
            })];
        _departmentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'department_id',
            })];
        _identifiedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'identified_date',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'due_date',
            })];
        _resolvedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'resolved_date',
            })];
        _identifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'identified_by',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'assigned_to',
            })];
        _remediationPlan_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'remediation_plan',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
        __esDecorate(null, null, _issueType_decorators, { kind: "field", name: "issueType", static: false, private: false, access: { has: obj => "issueType" in obj, get: obj => obj.issueType, set: (obj, value) => { obj.issueType = value; } }, metadata: _metadata }, _issueType_initializers, _issueType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _identifiedDate_decorators, { kind: "field", name: "identifiedDate", static: false, private: false, access: { has: obj => "identifiedDate" in obj, get: obj => obj.identifiedDate, set: (obj, value) => { obj.identifiedDate = value; } }, metadata: _metadata }, _identifiedDate_initializers, _identifiedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _resolvedDate_decorators, { kind: "field", name: "resolvedDate", static: false, private: false, access: { has: obj => "resolvedDate" in obj, get: obj => obj.resolvedDate, set: (obj, value) => { obj.resolvedDate = value; } }, metadata: _metadata }, _resolvedDate_initializers, _resolvedDate_extraInitializers);
        __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _remediationPlan_decorators, { kind: "field", name: "remediationPlan", static: false, private: false, access: { has: obj => "remediationPlan" in obj, get: obj => obj.remediationPlan, set: (obj, value) => { obj.remediationPlan = value; } }, metadata: _metadata }, _remediationPlan_initializers, _remediationPlan_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceIssueModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceIssueModel = _classThis;
})();
exports.ComplianceIssueModel = ComplianceIssueModel;
/**
 * Policy Model
 */
let PolicyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'policies',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['policy_number'], unique: true },
                { fields: ['category'] },
                { fields: ['is_active'] },
                { fields: ['effective_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyNumber_decorators;
    let _policyNumber_initializers = [];
    let _policyNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _requiresAcknowledgment_decorators;
    let _requiresAcknowledgment_initializers = [];
    let _requiresAcknowledgment_extraInitializers = [];
    let _acknowledgmentDeadlineDays_decorators;
    let _acknowledgmentDeadlineDays_initializers = [];
    let _acknowledgmentDeadlineDays_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _applicableRoles_decorators;
    let _applicableRoles_initializers = [];
    let _applicableRoles_extraInitializers = [];
    let _applicableDepartments_decorators;
    let _applicableDepartments_initializers = [];
    let _applicableDepartments_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _acknowledgments_decorators;
    let _acknowledgments_initializers = [];
    let _acknowledgments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PolicyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.policyNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyNumber_initializers, void 0));
            this.title = (__runInitializers(this, _policyNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.version = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.requiresAcknowledgment = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _requiresAcknowledgment_initializers, void 0));
            this.acknowledgmentDeadlineDays = (__runInitializers(this, _requiresAcknowledgment_extraInitializers), __runInitializers(this, _acknowledgmentDeadlineDays_initializers, void 0));
            this.content = (__runInitializers(this, _acknowledgmentDeadlineDays_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.attachments = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.applicableRoles = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _applicableRoles_initializers, void 0));
            this.applicableDepartments = (__runInitializers(this, _applicableRoles_extraInitializers), __runInitializers(this, _applicableDepartments_initializers, void 0));
            this.isActive = (__runInitializers(this, _applicableDepartments_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.acknowledgments = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _acknowledgments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _acknowledgments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PolicyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _policyNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'policy_number',
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'effective_date',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiry_date',
            })];
        _requiresAcknowledgment_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'requires_acknowledgment',
            })];
        _acknowledgmentDeadlineDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'acknowledgment_deadline_days',
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _attachments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _applicableRoles_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'applicable_roles',
            })];
        _applicableDepartments_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: true,
                field: 'applicable_departments',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _acknowledgments_decorators = [(0, sequelize_typescript_1.HasMany)(() => PolicyAcknowledgmentModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _policyNumber_decorators, { kind: "field", name: "policyNumber", static: false, private: false, access: { has: obj => "policyNumber" in obj, get: obj => obj.policyNumber, set: (obj, value) => { obj.policyNumber = value; } }, metadata: _metadata }, _policyNumber_initializers, _policyNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _requiresAcknowledgment_decorators, { kind: "field", name: "requiresAcknowledgment", static: false, private: false, access: { has: obj => "requiresAcknowledgment" in obj, get: obj => obj.requiresAcknowledgment, set: (obj, value) => { obj.requiresAcknowledgment = value; } }, metadata: _metadata }, _requiresAcknowledgment_initializers, _requiresAcknowledgment_extraInitializers);
        __esDecorate(null, null, _acknowledgmentDeadlineDays_decorators, { kind: "field", name: "acknowledgmentDeadlineDays", static: false, private: false, access: { has: obj => "acknowledgmentDeadlineDays" in obj, get: obj => obj.acknowledgmentDeadlineDays, set: (obj, value) => { obj.acknowledgmentDeadlineDays = value; } }, metadata: _metadata }, _acknowledgmentDeadlineDays_initializers, _acknowledgmentDeadlineDays_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _applicableRoles_decorators, { kind: "field", name: "applicableRoles", static: false, private: false, access: { has: obj => "applicableRoles" in obj, get: obj => obj.applicableRoles, set: (obj, value) => { obj.applicableRoles = value; } }, metadata: _metadata }, _applicableRoles_initializers, _applicableRoles_extraInitializers);
        __esDecorate(null, null, _applicableDepartments_decorators, { kind: "field", name: "applicableDepartments", static: false, private: false, access: { has: obj => "applicableDepartments" in obj, get: obj => obj.applicableDepartments, set: (obj, value) => { obj.applicableDepartments = value; } }, metadata: _metadata }, _applicableDepartments_initializers, _applicableDepartments_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _acknowledgments_decorators, { kind: "field", name: "acknowledgments", static: false, private: false, access: { has: obj => "acknowledgments" in obj, get: obj => obj.acknowledgments, set: (obj, value) => { obj.acknowledgments = value; } }, metadata: _metadata }, _acknowledgments_initializers, _acknowledgments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PolicyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PolicyModel = _classThis;
})();
exports.PolicyModel = PolicyModel;
/**
 * Policy Acknowledgment Model
 */
let PolicyAcknowledgmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'policy_acknowledgments',
            timestamps: true,
            indexes: [
                { fields: ['policy_id'] },
                { fields: ['employee_id'] },
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
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _acknowledgedDate_decorators;
    let _acknowledgedDate_initializers = [];
    let _acknowledgedDate_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _policy_decorators;
    let _policy_initializers = [];
    let _policy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PolicyAcknowledgmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
            this.employeeId = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.status = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.acknowledgedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _acknowledgedDate_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _acknowledgedDate_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.notes = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.policy = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _policy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _policy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PolicyAcknowledgmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _policyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PolicyModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'policy_id',
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AcknowledgmentStatus)),
                allowNull: false,
                defaultValue: AcknowledgmentStatus.PENDING,
            })];
        _assignedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'assigned_date',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'due_date',
            })];
        _acknowledgedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'acknowledged_date',
            })];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INET,
                allowNull: true,
                field: 'ip_address',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _policy_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PolicyModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _acknowledgedDate_decorators, { kind: "field", name: "acknowledgedDate", static: false, private: false, access: { has: obj => "acknowledgedDate" in obj, get: obj => obj.acknowledgedDate, set: (obj, value) => { obj.acknowledgedDate = value; } }, metadata: _metadata }, _acknowledgedDate_initializers, _acknowledgedDate_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _policy_decorators, { kind: "field", name: "policy", static: false, private: false, access: { has: obj => "policy" in obj, get: obj => obj.policy, set: (obj, value) => { obj.policy = value; } }, metadata: _metadata }, _policy_initializers, _policy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PolicyAcknowledgmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PolicyAcknowledgmentModel = _classThis;
})();
exports.PolicyAcknowledgmentModel = PolicyAcknowledgmentModel;
/**
 * I-9 Verification Model
 */
let I9VerificationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'i9_verifications',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'], unique: true },
                { fields: ['status'] },
                { fields: ['expiration_date'] },
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
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _section1CompletedDate_decorators;
    let _section1CompletedDate_initializers = [];
    let _section1CompletedDate_extraInitializers = [];
    let _section2CompletedDate_decorators;
    let _section2CompletedDate_initializers = [];
    let _section2CompletedDate_extraInitializers = [];
    let _section3CompletedDate_decorators;
    let _section3CompletedDate_initializers = [];
    let _section3CompletedDate_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _reverificationDate_decorators;
    let _reverificationDate_initializers = [];
    let _reverificationDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var I9VerificationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.status = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.section1CompletedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _section1CompletedDate_initializers, void 0));
            this.section2CompletedDate = (__runInitializers(this, _section1CompletedDate_extraInitializers), __runInitializers(this, _section2CompletedDate_initializers, void 0));
            this.section3CompletedDate = (__runInitializers(this, _section2CompletedDate_extraInitializers), __runInitializers(this, _section3CompletedDate_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _section3CompletedDate_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.documentType = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.documentNumber = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.reverificationDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _reverificationDate_initializers, void 0));
            this.notes = (__runInitializers(this, _reverificationDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "I9VerificationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                unique: true,
                field: 'employee_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(I9Status)),
                allowNull: false,
                defaultValue: I9Status.NOT_STARTED,
            })];
        _section1CompletedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'section1_completed_date',
            })];
        _section2CompletedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'section2_completed_date',
            })];
        _section3CompletedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'section3_completed_date',
            })];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'verified_by',
            })];
        _documentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'document_type',
            })];
        _documentNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'document_number',
            })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiration_date',
            })];
        _reverificationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'reverification_date',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _section1CompletedDate_decorators, { kind: "field", name: "section1CompletedDate", static: false, private: false, access: { has: obj => "section1CompletedDate" in obj, get: obj => obj.section1CompletedDate, set: (obj, value) => { obj.section1CompletedDate = value; } }, metadata: _metadata }, _section1CompletedDate_initializers, _section1CompletedDate_extraInitializers);
        __esDecorate(null, null, _section2CompletedDate_decorators, { kind: "field", name: "section2CompletedDate", static: false, private: false, access: { has: obj => "section2CompletedDate" in obj, get: obj => obj.section2CompletedDate, set: (obj, value) => { obj.section2CompletedDate = value; } }, metadata: _metadata }, _section2CompletedDate_initializers, _section2CompletedDate_extraInitializers);
        __esDecorate(null, null, _section3CompletedDate_decorators, { kind: "field", name: "section3CompletedDate", static: false, private: false, access: { has: obj => "section3CompletedDate" in obj, get: obj => obj.section3CompletedDate, set: (obj, value) => { obj.section3CompletedDate = value; } }, metadata: _metadata }, _section3CompletedDate_initializers, _section3CompletedDate_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _reverificationDate_decorators, { kind: "field", name: "reverificationDate", static: false, private: false, access: { has: obj => "reverificationDate" in obj, get: obj => obj.reverificationDate, set: (obj, value) => { obj.reverificationDate = value; } }, metadata: _metadata }, _reverificationDate_initializers, _reverificationDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        I9VerificationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return I9VerificationModel = _classThis;
})();
exports.I9VerificationModel = I9VerificationModel;
/**
 * Work Authorization Model
 */
let WorkAuthorizationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'work_authorizations',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['authorization_type'] },
                { fields: ['expiration_date'] },
                { fields: ['status'] },
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
    let _authorizationType_decorators;
    let _authorizationType_initializers = [];
    let _authorizationType_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _issuingCountry_decorators;
    let _issuingCountry_initializers = [];
    let _issuingCountry_extraInitializers = [];
    let _verifiedDate_decorators;
    let _verifiedDate_initializers = [];
    let _verifiedDate_extraInitializers = [];
    let _verifiedBy_decorators;
    let _verifiedBy_initializers = [];
    let _verifiedBy_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WorkAuthorizationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.authorizationType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _authorizationType_initializers, void 0));
            this.documentNumber = (__runInitializers(this, _authorizationType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
            this.issueDate = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.issuingCountry = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _issuingCountry_initializers, void 0));
            this.verifiedDate = (__runInitializers(this, _issuingCountry_extraInitializers), __runInitializers(this, _verifiedDate_initializers, void 0));
            this.verifiedBy = (__runInitializers(this, _verifiedDate_extraInitializers), __runInitializers(this, _verifiedBy_initializers, void 0));
            this.status = (__runInitializers(this, _verifiedBy_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkAuthorizationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _authorizationType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WorkAuthorizationType)),
                allowNull: false,
                field: 'authorization_type',
            })];
        _documentNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'document_number',
            })];
        _issueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'issue_date',
            })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiration_date',
            })];
        _issuingCountry_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(2),
                allowNull: false,
                field: 'issuing_country',
            })];
        _verifiedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'verified_date',
            })];
        _verifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'verified_by',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _authorizationType_decorators, { kind: "field", name: "authorizationType", static: false, private: false, access: { has: obj => "authorizationType" in obj, get: obj => obj.authorizationType, set: (obj, value) => { obj.authorizationType = value; } }, metadata: _metadata }, _authorizationType_initializers, _authorizationType_extraInitializers);
        __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _issuingCountry_decorators, { kind: "field", name: "issuingCountry", static: false, private: false, access: { has: obj => "issuingCountry" in obj, get: obj => obj.issuingCountry, set: (obj, value) => { obj.issuingCountry = value; } }, metadata: _metadata }, _issuingCountry_initializers, _issuingCountry_extraInitializers);
        __esDecorate(null, null, _verifiedDate_decorators, { kind: "field", name: "verifiedDate", static: false, private: false, access: { has: obj => "verifiedDate" in obj, get: obj => obj.verifiedDate, set: (obj, value) => { obj.verifiedDate = value; } }, metadata: _metadata }, _verifiedDate_initializers, _verifiedDate_extraInitializers);
        __esDecorate(null, null, _verifiedBy_decorators, { kind: "field", name: "verifiedBy", static: false, private: false, access: { has: obj => "verifiedBy" in obj, get: obj => obj.verifiedBy, set: (obj, value) => { obj.verifiedBy = value; } }, metadata: _metadata }, _verifiedBy_initializers, _verifiedBy_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkAuthorizationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkAuthorizationModel = _classThis;
})();
exports.WorkAuthorizationModel = WorkAuthorizationModel;
/**
 * Compliance Training Model
 */
let ComplianceTrainingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'compliance_trainings',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['training_category'] },
                { fields: ['status'] },
                { fields: ['due_date'] },
                { fields: ['expiry_date'] },
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
    let _trainingTitle_decorators;
    let _trainingTitle_initializers = [];
    let _trainingTitle_extraInitializers = [];
    let _trainingCategory_decorators;
    let _trainingCategory_initializers = [];
    let _trainingCategory_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _passingScore_decorators;
    let _passingScore_initializers = [];
    let _passingScore_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _certificateUrl_decorators;
    let _certificateUrl_initializers = [];
    let _certificateUrl_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _assignedBy_decorators;
    let _assignedBy_initializers = [];
    let _assignedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ComplianceTrainingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.trainingTitle = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _trainingTitle_initializers, void 0));
            this.trainingCategory = (__runInitializers(this, _trainingTitle_extraInitializers), __runInitializers(this, _trainingCategory_initializers, void 0));
            this.framework = (__runInitializers(this, _trainingCategory_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.score = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _score_initializers, void 0));
            this.passingScore = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _passingScore_initializers, void 0));
            this.status = (__runInitializers(this, _passingScore_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.certificateUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _certificateUrl_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _certificateUrl_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.assignedBy = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _assignedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _assignedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceTrainingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _trainingTitle_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'training_title',
            })];
        _trainingCategory_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'training_category',
            })];
        _framework_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RegulatoryFramework)),
                allowNull: true,
            })];
        _assignedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'assigned_date',
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
        _score_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _passingScore_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
                field: 'passing_score',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TrainingStatus)),
                allowNull: false,
                defaultValue: TrainingStatus.NOT_STARTED,
            })];
        _certificateUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'certificate_url',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiry_date',
            })];
        _assignedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'assigned_by',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _trainingTitle_decorators, { kind: "field", name: "trainingTitle", static: false, private: false, access: { has: obj => "trainingTitle" in obj, get: obj => obj.trainingTitle, set: (obj, value) => { obj.trainingTitle = value; } }, metadata: _metadata }, _trainingTitle_initializers, _trainingTitle_extraInitializers);
        __esDecorate(null, null, _trainingCategory_decorators, { kind: "field", name: "trainingCategory", static: false, private: false, access: { has: obj => "trainingCategory" in obj, get: obj => obj.trainingCategory, set: (obj, value) => { obj.trainingCategory = value; } }, metadata: _metadata }, _trainingCategory_initializers, _trainingCategory_extraInitializers);
        __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
        __esDecorate(null, null, _passingScore_decorators, { kind: "field", name: "passingScore", static: false, private: false, access: { has: obj => "passingScore" in obj, get: obj => obj.passingScore, set: (obj, value) => { obj.passingScore = value; } }, metadata: _metadata }, _passingScore_initializers, _passingScore_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _certificateUrl_decorators, { kind: "field", name: "certificateUrl", static: false, private: false, access: { has: obj => "certificateUrl" in obj, get: obj => obj.certificateUrl, set: (obj, value) => { obj.certificateUrl = value; } }, metadata: _metadata }, _certificateUrl_initializers, _certificateUrl_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _assignedBy_decorators, { kind: "field", name: "assignedBy", static: false, private: false, access: { has: obj => "assignedBy" in obj, get: obj => obj.assignedBy, set: (obj, value) => { obj.assignedBy = value; } }, metadata: _metadata }, _assignedBy_initializers, _assignedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceTrainingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceTrainingModel = _classThis;
})();
exports.ComplianceTrainingModel = ComplianceTrainingModel;
/**
 * Document Retention Policy Model
 */
let DocumentRetentionPolicyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_retention_policies',
            timestamps: true,
            indexes: [
                { fields: ['category'], unique: true },
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
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _retentionPeriodYears_decorators;
    let _retentionPeriodYears_initializers = [];
    let _retentionPeriodYears_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _disposalMethod_decorators;
    let _disposalMethod_initializers = [];
    let _disposalMethod_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DocumentRetentionPolicyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.category = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.retentionPeriodYears = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _retentionPeriodYears_initializers, void 0));
            this.framework = (__runInitializers(this, _retentionPeriodYears_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
            this.disposalMethod = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _disposalMethod_initializers, void 0));
            this.isActive = (__runInitializers(this, _disposalMethod_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentRetentionPolicyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RetentionCategory)),
                allowNull: false,
                unique: true,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _retentionPeriodYears_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'retention_period_years',
            })];
        _framework_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RegulatoryFramework)),
                allowNull: true,
            })];
        _disposalMethod_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'disposal_method',
            })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'is_active',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _retentionPeriodYears_decorators, { kind: "field", name: "retentionPeriodYears", static: false, private: false, access: { has: obj => "retentionPeriodYears" in obj, get: obj => obj.retentionPeriodYears, set: (obj, value) => { obj.retentionPeriodYears = value; } }, metadata: _metadata }, _retentionPeriodYears_initializers, _retentionPeriodYears_extraInitializers);
        __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
        __esDecorate(null, null, _disposalMethod_decorators, { kind: "field", name: "disposalMethod", static: false, private: false, access: { has: obj => "disposalMethod" in obj, get: obj => obj.disposalMethod, set: (obj, value) => { obj.disposalMethod = value; } }, metadata: _metadata }, _disposalMethod_initializers, _disposalMethod_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentRetentionPolicyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentRetentionPolicyModel = _classThis;
})();
exports.DocumentRetentionPolicyModel = DocumentRetentionPolicyModel;
/**
 * Compliance Alert Model
 */
let ComplianceAlertModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'compliance_alerts',
            timestamps: true,
            indexes: [
                { fields: ['alert_type'] },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['employee_id'] },
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
    let _alertType_decorators;
    let _alertType_initializers = [];
    let _alertType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _acknowledgedDate_decorators;
    let _acknowledgedDate_initializers = [];
    let _acknowledgedDate_extraInitializers = [];
    let _resolvedDate_decorators;
    let _resolvedDate_initializers = [];
    let _resolvedDate_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdDate_decorators;
    let _createdDate_initializers = [];
    let _createdDate_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ComplianceAlertModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.alertType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _alertType_initializers, void 0));
            this.severity = (__runInitializers(this, _alertType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.title = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.framework = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
            this.employeeId = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.dueDate = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.acknowledgedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _acknowledgedDate_initializers, void 0));
            this.resolvedDate = (__runInitializers(this, _acknowledgedDate_extraInitializers), __runInitializers(this, _resolvedDate_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _resolvedDate_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.metadata = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdDate = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceAlertModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _alertType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'alert_type',
            })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertSeverity)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AlertStatus)),
                allowNull: false,
                defaultValue: AlertStatus.OPEN,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _framework_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RegulatoryFramework)),
                allowNull: true,
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'employee_id',
            })];
        _departmentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'department_id',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'due_date',
            })];
        _acknowledgedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'acknowledged_date',
            })];
        _resolvedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'resolved_date',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'assigned_to',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdDate_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_date' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _alertType_decorators, { kind: "field", name: "alertType", static: false, private: false, access: { has: obj => "alertType" in obj, get: obj => obj.alertType, set: (obj, value) => { obj.alertType = value; } }, metadata: _metadata }, _alertType_initializers, _alertType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _acknowledgedDate_decorators, { kind: "field", name: "acknowledgedDate", static: false, private: false, access: { has: obj => "acknowledgedDate" in obj, get: obj => obj.acknowledgedDate, set: (obj, value) => { obj.acknowledgedDate = value; } }, metadata: _metadata }, _acknowledgedDate_initializers, _acknowledgedDate_extraInitializers);
        __esDecorate(null, null, _resolvedDate_decorators, { kind: "field", name: "resolvedDate", static: false, private: false, access: { has: obj => "resolvedDate" in obj, get: obj => obj.resolvedDate, set: (obj, value) => { obj.resolvedDate = value; } }, metadata: _metadata }, _resolvedDate_initializers, _resolvedDate_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: obj => "createdDate" in obj, get: obj => obj.createdDate, set: (obj, value) => { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceAlertModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceAlertModel = _classThis;
})();
exports.ComplianceAlertModel = ComplianceAlertModel;
/**
 * Whistleblower Case Model
 */
let WhistleblowerCaseModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'whistleblower_cases',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['case_number'], unique: true },
                { fields: ['status'] },
                { fields: ['category'] },
                { fields: ['submitted_date'] },
            ],
        })];
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
    let _reporterName_decorators;
    let _reporterName_initializers = [];
    let _reporterName_extraInitializers = [];
    let _reporterEmail_decorators;
    let _reporterEmail_initializers = [];
    let _reporterEmail_extraInitializers = [];
    let _isAnonymous_decorators;
    let _isAnonymous_initializers = [];
    let _isAnonymous_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _allegation_decorators;
    let _allegation_initializers = [];
    let _allegation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _submittedDate_decorators;
    let _submittedDate_initializers = [];
    let _submittedDate_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _investigationNotes_decorators;
    let _investigationNotes_initializers = [];
    let _investigationNotes_extraInitializers = [];
    let _finding_decorators;
    let _finding_initializers = [];
    let _finding_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
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
    var WhistleblowerCaseModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.caseNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _caseNumber_initializers, void 0));
            this.reporterName = (__runInitializers(this, _caseNumber_extraInitializers), __runInitializers(this, _reporterName_initializers, void 0));
            this.reporterEmail = (__runInitializers(this, _reporterName_extraInitializers), __runInitializers(this, _reporterEmail_initializers, void 0));
            this.isAnonymous = (__runInitializers(this, _reporterEmail_extraInitializers), __runInitializers(this, _isAnonymous_initializers, void 0));
            this.category = (__runInitializers(this, _isAnonymous_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.allegation = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _allegation_initializers, void 0));
            this.status = (__runInitializers(this, _allegation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.submittedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _submittedDate_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _submittedDate_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.investigationNotes = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _investigationNotes_initializers, void 0));
            this.finding = (__runInitializers(this, _investigationNotes_extraInitializers), __runInitializers(this, _finding_initializers, void 0));
            this.closedDate = (__runInitializers(this, _finding_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WhistleblowerCaseModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _caseNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'case_number',
            })];
        _reporterName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'reporter_name',
            })];
        _reporterEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'reporter_email',
            })];
        _isAnonymous_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_anonymous',
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _allegation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WhistleblowerStatus)),
                allowNull: false,
                defaultValue: WhistleblowerStatus.SUBMITTED,
            })];
        _submittedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'submitted_date',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'assigned_to',
            })];
        _investigationNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'investigation_notes',
            })];
        _finding_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'closed_date',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _caseNumber_decorators, { kind: "field", name: "caseNumber", static: false, private: false, access: { has: obj => "caseNumber" in obj, get: obj => obj.caseNumber, set: (obj, value) => { obj.caseNumber = value; } }, metadata: _metadata }, _caseNumber_initializers, _caseNumber_extraInitializers);
        __esDecorate(null, null, _reporterName_decorators, { kind: "field", name: "reporterName", static: false, private: false, access: { has: obj => "reporterName" in obj, get: obj => obj.reporterName, set: (obj, value) => { obj.reporterName = value; } }, metadata: _metadata }, _reporterName_initializers, _reporterName_extraInitializers);
        __esDecorate(null, null, _reporterEmail_decorators, { kind: "field", name: "reporterEmail", static: false, private: false, access: { has: obj => "reporterEmail" in obj, get: obj => obj.reporterEmail, set: (obj, value) => { obj.reporterEmail = value; } }, metadata: _metadata }, _reporterEmail_initializers, _reporterEmail_extraInitializers);
        __esDecorate(null, null, _isAnonymous_decorators, { kind: "field", name: "isAnonymous", static: false, private: false, access: { has: obj => "isAnonymous" in obj, get: obj => obj.isAnonymous, set: (obj, value) => { obj.isAnonymous = value; } }, metadata: _metadata }, _isAnonymous_initializers, _isAnonymous_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _allegation_decorators, { kind: "field", name: "allegation", static: false, private: false, access: { has: obj => "allegation" in obj, get: obj => obj.allegation, set: (obj, value) => { obj.allegation = value; } }, metadata: _metadata }, _allegation_initializers, _allegation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _submittedDate_decorators, { kind: "field", name: "submittedDate", static: false, private: false, access: { has: obj => "submittedDate" in obj, get: obj => obj.submittedDate, set: (obj, value) => { obj.submittedDate = value; } }, metadata: _metadata }, _submittedDate_initializers, _submittedDate_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _investigationNotes_decorators, { kind: "field", name: "investigationNotes", static: false, private: false, access: { has: obj => "investigationNotes" in obj, get: obj => obj.investigationNotes, set: (obj, value) => { obj.investigationNotes = value; } }, metadata: _metadata }, _investigationNotes_initializers, _investigationNotes_extraInitializers);
        __esDecorate(null, null, _finding_decorators, { kind: "field", name: "finding", static: false, private: false, access: { has: obj => "finding" in obj, get: obj => obj.finding, set: (obj, value) => { obj.finding = value; } }, metadata: _metadata }, _finding_initializers, _finding_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WhistleblowerCaseModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WhistleblowerCaseModel = _classThis;
})();
exports.WhistleblowerCaseModel = WhistleblowerCaseModel;
/**
 * EEO Report Model
 */
let EEOReportModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'eeo_reports',
            timestamps: true,
            indexes: [
                { fields: ['reporting_year'], unique: true },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reportingYear_decorators;
    let _reportingYear_initializers = [];
    let _reportingYear_extraInitializers = [];
    let _totalEmployees_decorators;
    let _totalEmployees_initializers = [];
    let _totalEmployees_extraInitializers = [];
    let _byJobCategory_decorators;
    let _byJobCategory_initializers = [];
    let _byJobCategory_extraInitializers = [];
    let _byRaceEthnicity_decorators;
    let _byRaceEthnicity_initializers = [];
    let _byRaceEthnicity_extraInitializers = [];
    let _byGender_decorators;
    let _byGender_initializers = [];
    let _byGender_extraInitializers = [];
    let _newHires_decorators;
    let _newHires_initializers = [];
    let _newHires_extraInitializers = [];
    let _terminations_decorators;
    let _terminations_initializers = [];
    let _terminations_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EEOReportModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reportingYear = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reportingYear_initializers, void 0));
            this.totalEmployees = (__runInitializers(this, _reportingYear_extraInitializers), __runInitializers(this, _totalEmployees_initializers, void 0));
            this.byJobCategory = (__runInitializers(this, _totalEmployees_extraInitializers), __runInitializers(this, _byJobCategory_initializers, void 0));
            this.byRaceEthnicity = (__runInitializers(this, _byJobCategory_extraInitializers), __runInitializers(this, _byRaceEthnicity_initializers, void 0));
            this.byGender = (__runInitializers(this, _byRaceEthnicity_extraInitializers), __runInitializers(this, _byGender_initializers, void 0));
            this.newHires = (__runInitializers(this, _byGender_extraInitializers), __runInitializers(this, _newHires_initializers, void 0));
            this.terminations = (__runInitializers(this, _newHires_extraInitializers), __runInitializers(this, _terminations_initializers, void 0));
            this.metadata = (__runInitializers(this, _terminations_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EEOReportModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _reportingYear_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                unique: true,
                field: 'reporting_year',
            })];
        _totalEmployees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'total_employees',
            })];
        _byJobCategory_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'by_job_category',
            })];
        _byRaceEthnicity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'by_race_ethnicity',
            })];
        _byGender_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                field: 'by_gender',
            })];
        _newHires_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                field: 'new_hires',
            })];
        _terminations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reportingYear_decorators, { kind: "field", name: "reportingYear", static: false, private: false, access: { has: obj => "reportingYear" in obj, get: obj => obj.reportingYear, set: (obj, value) => { obj.reportingYear = value; } }, metadata: _metadata }, _reportingYear_initializers, _reportingYear_extraInitializers);
        __esDecorate(null, null, _totalEmployees_decorators, { kind: "field", name: "totalEmployees", static: false, private: false, access: { has: obj => "totalEmployees" in obj, get: obj => obj.totalEmployees, set: (obj, value) => { obj.totalEmployees = value; } }, metadata: _metadata }, _totalEmployees_initializers, _totalEmployees_extraInitializers);
        __esDecorate(null, null, _byJobCategory_decorators, { kind: "field", name: "byJobCategory", static: false, private: false, access: { has: obj => "byJobCategory" in obj, get: obj => obj.byJobCategory, set: (obj, value) => { obj.byJobCategory = value; } }, metadata: _metadata }, _byJobCategory_initializers, _byJobCategory_extraInitializers);
        __esDecorate(null, null, _byRaceEthnicity_decorators, { kind: "field", name: "byRaceEthnicity", static: false, private: false, access: { has: obj => "byRaceEthnicity" in obj, get: obj => obj.byRaceEthnicity, set: (obj, value) => { obj.byRaceEthnicity = value; } }, metadata: _metadata }, _byRaceEthnicity_initializers, _byRaceEthnicity_extraInitializers);
        __esDecorate(null, null, _byGender_decorators, { kind: "field", name: "byGender", static: false, private: false, access: { has: obj => "byGender" in obj, get: obj => obj.byGender, set: (obj, value) => { obj.byGender = value; } }, metadata: _metadata }, _byGender_initializers, _byGender_extraInitializers);
        __esDecorate(null, null, _newHires_decorators, { kind: "field", name: "newHires", static: false, private: false, access: { has: obj => "newHires" in obj, get: obj => obj.newHires, set: (obj, value) => { obj.newHires = value; } }, metadata: _metadata }, _newHires_initializers, _newHires_extraInitializers);
        __esDecorate(null, null, _terminations_decorators, { kind: "field", name: "terminations", static: false, private: false, access: { has: obj => "terminations" in obj, get: obj => obj.terminations, set: (obj, value) => { obj.terminations = value; } }, metadata: _metadata }, _terminations_initializers, _terminations_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EEOReportModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EEOReportModel = _classThis;
})();
exports.EEOReportModel = EEOReportModel;
// ============================================================================
// COMPLIANCE ISSUE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create compliance issue
 */
async function createComplianceIssue(issueData, transaction) {
    const validated = exports.ComplianceIssueSchema.parse(issueData);
    return ComplianceIssueModel.create(validated, { transaction });
}
/**
 * Update compliance issue
 */
async function updateComplianceIssue(issueId, updates, transaction) {
    const issue = await ComplianceIssueModel.findByPk(issueId, { transaction });
    if (!issue) {
        throw new common_1.NotFoundException(`Compliance issue ${issueId} not found`);
    }
    await issue.update(updates, { transaction });
    return issue;
}
/**
 * Get compliance issues by framework
 */
async function getComplianceIssuesByFramework(framework, status) {
    const where = { framework };
    if (status) {
        where.status = status;
    }
    return ComplianceIssueModel.findAll({
        where,
        order: [['identifiedDate', 'DESC']],
    });
}
/**
 * Get compliance issues by employee
 */
async function getComplianceIssuesByEmployee(employeeId) {
    return ComplianceIssueModel.findAll({
        where: { employeeId },
        order: [['identifiedDate', 'DESC']],
    });
}
/**
 * Resolve compliance issue
 */
async function resolveComplianceIssue(issueId, resolution, resolvedBy, transaction) {
    const issue = await ComplianceIssueModel.findByPk(issueId, { transaction });
    if (!issue) {
        throw new common_1.NotFoundException(`Compliance issue ${issueId} not found`);
    }
    await issue.update({
        status: ComplianceStatus.REMEDIATED,
        resolvedDate: new Date(),
        remediationPlan: resolution,
    }, { transaction });
}
/**
 * Get overdue compliance issues
 */
async function getOverdueComplianceIssues() {
    return ComplianceIssueModel.findAll({
        where: {
            dueDate: { [sequelize_1.Op.lt]: new Date() },
            status: { [sequelize_1.Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] },
        },
        order: [['dueDate', 'ASC']],
    });
}
// ============================================================================
// POLICY MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create policy
 */
async function createPolicy(policyData, transaction) {
    const validated = exports.PolicySchema.parse(policyData);
    const existing = await PolicyModel.findOne({
        where: { policyNumber: validated.policyNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Policy ${validated.policyNumber} already exists`);
    }
    return PolicyModel.create(validated, { transaction });
}
/**
 * Update policy
 */
async function updatePolicy(policyId, updates, transaction) {
    const policy = await PolicyModel.findByPk(policyId, { transaction });
    if (!policy) {
        throw new common_1.NotFoundException(`Policy ${policyId} not found`);
    }
    await policy.update(updates, { transaction });
    return policy;
}
/**
 * Get active policies
 */
async function getActivePolicies(category) {
    const where = { isActive: true };
    if (category) {
        where.category = category;
    }
    return PolicyModel.findAll({
        where,
        order: [['effectiveDate', 'DESC']],
    });
}
/**
 * Assign policy to employee
 */
async function assignPolicyToEmployee(policyId, employeeId, transaction) {
    const policy = await PolicyModel.findByPk(policyId, { transaction });
    if (!policy) {
        throw new common_1.NotFoundException(`Policy ${policyId} not found`);
    }
    const assignedDate = new Date();
    const dueDate = policy.acknowledgmentDeadlineDays
        ? new Date(assignedDate.getTime() + policy.acknowledgmentDeadlineDays * 24 * 60 * 60 * 1000)
        : null;
    return PolicyAcknowledgmentModel.create({
        policyId,
        employeeId,
        assignedDate,
        dueDate,
        status: AcknowledgmentStatus.PENDING,
    }, { transaction });
}
/**
 * Acknowledge policy
 */
async function acknowledgePolicy(acknowledgmentId, ipAddress, transaction) {
    const ack = await PolicyAcknowledgmentModel.findByPk(acknowledgmentId, { transaction });
    if (!ack) {
        throw new common_1.NotFoundException(`Policy acknowledgment ${acknowledgmentId} not found`);
    }
    await ack.update({
        status: AcknowledgmentStatus.ACKNOWLEDGED,
        acknowledgedDate: new Date(),
        ipAddress,
    }, { transaction });
}
/**
 * Get pending policy acknowledgments
 */
async function getPendingPolicyAcknowledgments(employeeId) {
    return PolicyAcknowledgmentModel.findAll({
        where: {
            employeeId,
            status: AcknowledgmentStatus.PENDING,
        },
        include: [{ model: PolicyModel, as: 'policy' }],
        order: [['dueDate', 'ASC']],
    });
}
/**
 * Get overdue policy acknowledgments
 */
async function getOverduePolicyAcknowledgments() {
    return PolicyAcknowledgmentModel.findAll({
        where: {
            status: AcknowledgmentStatus.PENDING,
            dueDate: { [sequelize_1.Op.lt]: new Date() },
        },
        include: [{ model: PolicyModel, as: 'policy' }],
        order: [['dueDate', 'ASC']],
    });
}
// ============================================================================
// I-9 VERIFICATION FUNCTIONS
// ============================================================================
/**
 * Create I-9 record
 */
async function createI9Record(recordData, transaction) {
    const validated = exports.I9RecordSchema.parse(recordData);
    const existing = await I9VerificationModel.findOne({
        where: { employeeId: validated.employeeId },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`I-9 record for employee ${validated.employeeId} already exists`);
    }
    return I9VerificationModel.create(validated, { transaction });
}
/**
 * Update I-9 record
 */
async function updateI9Record(employeeId, updates, transaction) {
    const record = await I9VerificationModel.findOne({
        where: { employeeId },
        transaction,
    });
    if (!record) {
        throw new common_1.NotFoundException(`I-9 record for employee ${employeeId} not found`);
    }
    await record.update(updates, { transaction });
    return record;
}
/**
 * Complete I-9 section 1
 */
async function completeI9Section1(employeeId, transaction) {
    await updateI9Record(employeeId, {
        section1CompletedDate: new Date(),
        status: I9Status.SECTION1_COMPLETED,
    }, transaction);
}
/**
 * Complete I-9 section 2
 */
async function completeI9Section2(employeeId, verifiedBy, documentType, documentNumber, transaction) {
    await updateI9Record(employeeId, {
        section2CompletedDate: new Date(),
        status: I9Status.SECTION2_COMPLETED,
        verifiedBy,
        documentType,
        documentNumber,
    }, transaction);
}
/**
 * Get I-9 records requiring reverification
 */
async function getI9RecordsRequiringReverification() {
    return I9VerificationModel.findAll({
        where: {
            status: I9Status.REVERIFICATION_REQUIRED,
        },
        order: [['reverificationDate', 'ASC']],
    });
}
/**
 * Get expiring I-9 records
 */
async function getExpiringI9Records(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return I9VerificationModel.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
        },
        order: [['expirationDate', 'ASC']],
    });
}
// ============================================================================
// WORK AUTHORIZATION FUNCTIONS
// ============================================================================
/**
 * Create work authorization
 */
async function createWorkAuthorization(authData, transaction) {
    const validated = exports.WorkAuthorizationSchema.parse(authData);
    return WorkAuthorizationModel.create(validated, { transaction });
}
/**
 * Update work authorization
 */
async function updateWorkAuthorization(authId, updates, transaction) {
    const auth = await WorkAuthorizationModel.findByPk(authId, { transaction });
    if (!auth) {
        throw new common_1.NotFoundException(`Work authorization ${authId} not found`);
    }
    await auth.update(updates, { transaction });
    return auth;
}
/**
 * Get work authorizations by employee
 */
async function getWorkAuthorizationsByEmployee(employeeId) {
    return WorkAuthorizationModel.findAll({
        where: { employeeId },
        order: [['issueDate', 'DESC']],
    });
}
/**
 * Get expiring work authorizations
 */
async function getExpiringWorkAuthorizations(daysAhead = 60) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return WorkAuthorizationModel.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
            status: 'active',
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Verify work authorization
 */
async function verifyWorkAuthorization(authId, verifiedBy, transaction) {
    await updateWorkAuthorization(authId, {
        verifiedDate: new Date(),
        verifiedBy,
        status: 'verified',
    }, transaction);
}
// ============================================================================
// COMPLIANCE TRAINING FUNCTIONS
// ============================================================================
/**
 * Assign compliance training
 */
async function assignComplianceTraining(trainingData, transaction) {
    const validated = exports.ComplianceTrainingSchema.parse(trainingData);
    return ComplianceTrainingModel.create(validated, { transaction });
}
/**
 * Complete compliance training
 */
async function completeComplianceTraining(trainingId, score, certificateUrl, transaction) {
    const training = await ComplianceTrainingModel.findByPk(trainingId, { transaction });
    if (!training) {
        throw new common_1.NotFoundException(`Training ${trainingId} not found`);
    }
    const passed = !training.passingScore || score >= training.passingScore;
    await training.update({
        completedDate: new Date(),
        score,
        status: passed ? TrainingStatus.COMPLETED : TrainingStatus.FAILED,
        certificateUrl,
    }, { transaction });
}
/**
 * Get overdue compliance trainings
 */
async function getOverdueComplianceTrainings() {
    return ComplianceTrainingModel.findAll({
        where: {
            dueDate: { [sequelize_1.Op.lt]: new Date() },
            status: { [sequelize_1.Op.notIn]: [TrainingStatus.COMPLETED, TrainingStatus.WAIVED] },
        },
        order: [['dueDate', 'ASC']],
    });
}
/**
 * Get expired compliance trainings
 */
async function getExpiredComplianceTrainings() {
    return ComplianceTrainingModel.findAll({
        where: {
            expiryDate: { [sequelize_1.Op.lt]: new Date() },
            status: TrainingStatus.COMPLETED,
        },
        order: [['expiryDate', 'ASC']],
    });
}
/**
 * Get employee compliance trainings
 */
async function getEmployeeComplianceTrainings(employeeId, status) {
    const where = { employeeId };
    if (status) {
        where.status = status;
    }
    return ComplianceTrainingModel.findAll({
        where,
        order: [['assignedDate', 'DESC']],
    });
}
// ============================================================================
// DOCUMENT RETENTION FUNCTIONS
// ============================================================================
/**
 * Create retention policy
 */
async function createRetentionPolicy(policyData, transaction) {
    return DocumentRetentionPolicyModel.create(policyData, { transaction });
}
/**
 * Get retention policy by category
 */
async function getRetentionPolicyByCategory(category) {
    return DocumentRetentionPolicyModel.findOne({
        where: { category, isActive: true },
    });
}
/**
 * Get all active retention policies
 */
async function getActiveRetentionPolicies() {
    return DocumentRetentionPolicyModel.findAll({
        where: { isActive: true },
        order: [['category', 'ASC']],
    });
}
/**
 * Calculate document disposal date
 */
function calculateDisposalDate(documentDate, retentionYears) {
    const disposalDate = new Date(documentDate);
    disposalDate.setFullYear(disposalDate.getFullYear() + retentionYears);
    return disposalDate;
}
// ============================================================================
// COMPLIANCE ALERT FUNCTIONS
// ============================================================================
/**
 * Create compliance alert
 */
async function createComplianceAlert(alertData, transaction) {
    return ComplianceAlertModel.create(alertData, { transaction });
}
/**
 * Update alert status
 */
async function updateAlertStatus(alertId, status, transaction) {
    const alert = await ComplianceAlertModel.findByPk(alertId, { transaction });
    if (!alert) {
        throw new common_1.NotFoundException(`Alert ${alertId} not found`);
    }
    const updates = { status };
    if (status === AlertStatus.ACKNOWLEDGED) {
        updates.acknowledgedDate = new Date();
    }
    else if (status === AlertStatus.RESOLVED) {
        updates.resolvedDate = new Date();
    }
    await alert.update(updates, { transaction });
}
/**
 * Get open alerts
 */
async function getOpenAlerts(severity) {
    const where = { status: AlertStatus.OPEN };
    if (severity) {
        where.severity = severity;
    }
    return ComplianceAlertModel.findAll({
        where,
        order: [['severity', 'DESC'], ['createdDate', 'DESC']],
    });
}
/**
 * Get employee alerts
 */
async function getEmployeeAlerts(employeeId) {
    return ComplianceAlertModel.findAll({
        where: { employeeId },
        order: [['createdDate', 'DESC']],
    });
}
/**
 * Dismiss alert
 */
async function dismissAlert(alertId, transaction) {
    await updateAlertStatus(alertId, AlertStatus.DISMISSED, transaction);
}
// ============================================================================
// WHISTLEBLOWER & ETHICS FUNCTIONS
// ============================================================================
/**
 * Submit whistleblower case
 */
async function submitWhistleblowerCase(caseData, transaction) {
    const validated = exports.WhistleblowerCaseSchema.parse(caseData);
    return WhistleblowerCaseModel.create({
        ...validated,
        submittedDate: new Date(),
    }, { transaction });
}
/**
 * Assign whistleblower case
 */
async function assignWhistleblowerCase(caseId, assignedTo, transaction) {
    const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
    if (!wbCase) {
        throw new common_1.NotFoundException(`Whistleblower case ${caseId} not found`);
    }
    await wbCase.update({
        assignedTo,
        status: WhistleblowerStatus.UNDER_REVIEW,
    }, { transaction });
}
/**
 * Update whistleblower investigation
 */
async function updateWhistleblowerInvestigation(caseId, investigationNotes, status, transaction) {
    const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
    if (!wbCase) {
        throw new common_1.NotFoundException(`Whistleblower case ${caseId} not found`);
    }
    await wbCase.update({
        investigationNotes,
        status: status || WhistleblowerStatus.INVESTIGATING,
    }, { transaction });
}
/**
 * Close whistleblower case
 */
async function closeWhistleblowerCase(caseId, finding, substantiated, transaction) {
    const wbCase = await WhistleblowerCaseModel.findByPk(caseId, { transaction });
    if (!wbCase) {
        throw new common_1.NotFoundException(`Whistleblower case ${caseId} not found`);
    }
    await wbCase.update({
        finding,
        status: substantiated ? WhistleblowerStatus.SUBSTANTIATED : WhistleblowerStatus.UNSUBSTANTIATED,
        closedDate: new Date(),
    }, { transaction });
}
/**
 * Get active whistleblower cases
 */
async function getActiveWhistleblowerCases() {
    return WhistleblowerCaseModel.findAll({
        where: {
            status: {
                [sequelize_1.Op.notIn]: [WhistleblowerStatus.CLOSED, WhistleblowerStatus.SUBSTANTIATED, WhistleblowerStatus.UNSUBSTANTIATED],
            },
        },
        order: [['submittedDate', 'DESC']],
    });
}
// ============================================================================
// EEO/AAP REPORTING FUNCTIONS
// ============================================================================
/**
 * Create EEO report
 */
async function createEEOReport(reportData, transaction) {
    const existing = await EEOReportModel.findOne({
        where: { reportingYear: reportData.reportingYear },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`EEO report for year ${reportData.reportingYear} already exists`);
    }
    return EEOReportModel.create(reportData, { transaction });
}
/**
 * Update EEO report
 */
async function updateEEOReport(reportingYear, updates, transaction) {
    const report = await EEOReportModel.findOne({
        where: { reportingYear },
        transaction,
    });
    if (!report) {
        throw new common_1.NotFoundException(`EEO report for year ${reportingYear} not found`);
    }
    await report.update(updates, { transaction });
    return report;
}
/**
 * Get EEO report by year
 */
async function getEEOReportByYear(reportingYear) {
    return EEOReportModel.findOne({
        where: { reportingYear },
    });
}
/**
 * Get all EEO reports
 */
async function getAllEEOReports() {
    return EEOReportModel.findAll({
        order: [['reportingYear', 'DESC']],
    });
}
// ============================================================================
// COMPLIANCE ANALYTICS & REPORTING
// ============================================================================
/**
 * Get compliance dashboard metrics
 */
async function getComplianceDashboardMetrics() {
    const [openIssues, overdueIssues, pendingTrainings, expiredTrainings, openAlerts, criticalAlerts, pendingAcknowledgments, activeWhistleblowerCases,] = await Promise.all([
        ComplianceIssueModel.count({
            where: { status: { [sequelize_1.Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] } },
        }),
        ComplianceIssueModel.count({
            where: {
                dueDate: { [sequelize_1.Op.lt]: new Date() },
                status: { [sequelize_1.Op.notIn]: [ComplianceStatus.REMEDIATED, ComplianceStatus.WAIVED] },
            },
        }),
        ComplianceTrainingModel.count({
            where: { status: { [sequelize_1.Op.notIn]: [TrainingStatus.COMPLETED, TrainingStatus.WAIVED] } },
        }),
        ComplianceTrainingModel.count({
            where: {
                expiryDate: { [sequelize_1.Op.lt]: new Date() },
                status: TrainingStatus.COMPLETED,
            },
        }),
        ComplianceAlertModel.count({
            where: { status: AlertStatus.OPEN },
        }),
        ComplianceAlertModel.count({
            where: { status: AlertStatus.OPEN, severity: AlertSeverity.CRITICAL },
        }),
        PolicyAcknowledgmentModel.count({
            where: { status: AcknowledgmentStatus.PENDING },
        }),
        WhistleblowerCaseModel.count({
            where: {
                status: {
                    [sequelize_1.Op.notIn]: [WhistleblowerStatus.CLOSED, WhistleblowerStatus.SUBSTANTIATED, WhistleblowerStatus.UNSUBSTANTIATED],
                },
            },
        }),
    ]);
    return {
        openIssues,
        overdueIssues,
        pendingTrainings,
        expiredTrainings,
        openAlerts,
        criticalAlerts,
        pendingAcknowledgments,
        activeWhistleblowerCases,
    };
}
/**
 * Generate compliance report by framework
 */
async function generateComplianceReportByFramework(framework, startDate, endDate) {
    const where = { framework };
    if (startDate && endDate) {
        where.identifiedDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    const [totalIssues, resolvedIssues, issues] = await Promise.all([
        ComplianceIssueModel.count({ where }),
        ComplianceIssueModel.count({
            where: { ...where, status: ComplianceStatus.REMEDIATED },
        }),
        ComplianceIssueModel.findAll({
            where,
            order: [['identifiedDate', 'DESC']],
        }),
    ]);
    const openIssues = totalIssues - resolvedIssues;
    const complianceRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 100;
    return {
        framework,
        totalIssues,
        resolvedIssues,
        openIssues,
        complianceRate,
        issues,
    };
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let ComplianceService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ComplianceService = _classThis = class {
        async createIssue(data) {
            return createComplianceIssue(data);
        }
        async createPolicy(data) {
            return createPolicy(data);
        }
        async assignPolicy(policyId, employeeId) {
            return assignPolicyToEmployee(policyId, employeeId);
        }
        async createI9(data) {
            return createI9Record(data);
        }
        async assignTraining(data) {
            return assignComplianceTraining(data);
        }
        async submitWhistleblower(data) {
            return submitWhistleblowerCase(data);
        }
        async getDashboard() {
            return getComplianceDashboardMetrics();
        }
    };
    __setFunctionName(_classThis, "ComplianceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceService = _classThis;
})();
exports.ComplianceService = ComplianceService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let ComplianceController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Compliance'), (0, common_1.Controller)('compliance'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getDashboard_decorators;
    let _createIssue_decorators;
    let _createPolicy_decorators;
    let _submitWhistleblower_decorators;
    var ComplianceController = _classThis = class {
        constructor(complianceService) {
            this.complianceService = (__runInitializers(this, _instanceExtraInitializers), complianceService);
        }
        async getDashboard() {
            return this.complianceService.getDashboard();
        }
        async createIssue(data) {
            return this.complianceService.createIssue(data);
        }
        async createPolicy(data) {
            return this.complianceService.createPolicy(data);
        }
        async submitWhistleblower(data) {
            return this.complianceService.submitWhistleblower(data);
        }
    };
    __setFunctionName(_classThis, "ComplianceController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({ summary: 'Get compliance dashboard metrics' })];
        _createIssue_decorators = [(0, common_1.Post)('issues'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create compliance issue' })];
        _createPolicy_decorators = [(0, common_1.Post)('policies'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create policy' })];
        _submitWhistleblower_decorators = [(0, common_1.Post)('whistleblower'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Submit whistleblower case' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: obj => "getDashboard" in obj, get: obj => obj.getDashboard }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createIssue_decorators, { kind: "method", name: "createIssue", static: false, private: false, access: { has: obj => "createIssue" in obj, get: obj => obj.createIssue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPolicy_decorators, { kind: "method", name: "createPolicy", static: false, private: false, access: { has: obj => "createPolicy" in obj, get: obj => obj.createPolicy }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitWhistleblower_decorators, { kind: "method", name: "submitWhistleblower", static: false, private: false, access: { has: obj => "submitWhistleblower" in obj, get: obj => obj.submitWhistleblower }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceController = _classThis;
})();
exports.ComplianceController = ComplianceController;
//# sourceMappingURL=compliance-management-kit.js.map