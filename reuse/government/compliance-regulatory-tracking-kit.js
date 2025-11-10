"use strict";
/**
 * LOC: COMPLIANCE_REGULATORY_TRACKING_KIT_001
 * File: /reuse/government/compliance-regulatory-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government compliance services
 *   - Regulatory reporting modules
 *   - Policy management systems
 *   - Compliance dashboard components
 *   - Audit preparation services
 *   - Training tracking systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceDashboardMetricsResponse = exports.CreateComplianceDeadlineDto = exports.CreateRegulatoryRequirementDto = exports.ComplianceTrackingServiceExample = exports.ComplianceViolationModel = exports.ComplianceDeadlineModel = exports.ComplianceCertificationModel = exports.RegulatoryRequirementModel = exports.ViolationStatus = exports.ViolationType = exports.RiskLevel = exports.ChangeStatus = exports.ChangeType = exports.TrainingStatus = exports.ValidationStatus = exports.ValidationScope = exports.ValidationType = exports.SubmissionStatus = exports.DeadlineStatus = exports.CertificationStatus = exports.CompliancePriority = exports.RequirementStatus = exports.ComplianceCategory = exports.RegulationType = void 0;
exports.createRegulatoryRequirement = createRegulatoryRequirement;
exports.updateRequirementStatus = updateRequirementStatus;
exports.linkRelatedRequirements = linkRelatedRequirements;
exports.isRequirementApplicable = isRequirementApplicable;
exports.filterRequirementsByCategory = filterRequirementsByCategory;
exports.filterRequirementsByBody = filterRequirementsByBody;
exports.getExpiringSoonRequirements = getExpiringSoonRequirements;
exports.createComplianceCertification = createComplianceCertification;
exports.isCertificationValid = isCertificationValid;
exports.getExpiringCertifications = getExpiringCertifications;
exports.updateCertificationStatus = updateCertificationStatus;
exports.renewCertification = renewCertification;
exports.daysUntilCertificationExpires = daysUntilCertificationExpires;
exports.createComplianceDeadline = createComplianceDeadline;
exports.generateReminderDates = generateReminderDates;
exports.updateDeadlineStatus = updateDeadlineStatus;
exports.completeDeadline = completeDeadline;
exports.requestDeadlineExtension = requestDeadlineExtension;
exports.approveDeadlineExtension = approveDeadlineExtension;
exports.getOverdueDeadlines = getOverdueDeadlines;
exports.getDeadlinesDueSoon = getDeadlinesDueSoon;
exports.createRegulatoryReportSubmission = createRegulatoryReportSubmission;
exports.submitRegulatoryReport = submitRegulatoryReport;
exports.generateConfirmationNumber = generateConfirmationNumber;
exports.acknowledgeReportSubmission = acknowledgeReportSubmission;
exports.requestReportCorrections = requestReportCorrections;
exports.resubmitCorrectedReport = resubmitCorrectedReport;
exports.createPolicyComplianceValidation = createPolicyComplianceValidation;
exports.addValidationFinding = addValidationFinding;
exports.calculateComplianceScore = calculateComplianceScore;
exports.determineValidationStatus = determineValidationStatus;
exports.completeValidationAssessment = completeValidationAssessment;
exports.createComplianceTrainingRecord = createComplianceTrainingRecord;
exports.completeTraining = completeTraining;
exports.getExpiredTraining = getExpiredTraining;
exports.calculateTrainingCompletionRate = calculateTrainingCompletionRate;
exports.createRegulatoryChange = createRegulatoryChange;
exports.addChangeActionItem = addChangeActionItem;
exports.approveRegulatoryChange = approveRegulatoryChange;
exports.calculateChangeProgress = calculateChangeProgress;
exports.createComplianceRiskAssessment = createComplianceRiskAssessment;
exports.addComplianceRisk = addComplianceRisk;
exports.calculateRiskScore = calculateRiskScore;
exports.determineOverallRiskLevel = determineOverallRiskLevel;
exports.createComplianceViolation = createComplianceViolation;
exports.addCorrectiveAction = addCorrectiveAction;
exports.resolveViolation = resolveViolation;
exports.getOpenViolationsBySeverity = getOpenViolationsBySeverity;
exports.generateComplianceDashboardMetrics = generateComplianceDashboardMetrics;
/**
 * File: /reuse/government/compliance-regulatory-tracking-kit.ts
 * Locator: WC-GOV-COMPLIANCE-REG-TRACK-001
 * Purpose: Comprehensive Compliance and Regulatory Tracking Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Government compliance services, Regulatory modules, Policy systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government compliance and regulatory tracking functions
 *
 * LLM Context: Enterprise-grade compliance and regulatory tracking for government agencies.
 * Provides comprehensive regulatory requirement tracking, compliance certification management,
 * deadline monitoring, regulatory reporting, policy validation, training tracking, change
 * management, risk assessment, violation tracking, and extensive NestJS/Sequelize integration.
 */
const crypto = __importStar(require("crypto"));
/**
 * Regulation types
 */
var RegulationType;
(function (RegulationType) {
    RegulationType["FEDERAL_LAW"] = "FEDERAL_LAW";
    RegulationType["STATE_LAW"] = "STATE_LAW";
    RegulationType["LOCAL_ORDINANCE"] = "LOCAL_ORDINANCE";
    RegulationType["AGENCY_REGULATION"] = "AGENCY_REGULATION";
    RegulationType["EXECUTIVE_ORDER"] = "EXECUTIVE_ORDER";
    RegulationType["POLICY_DIRECTIVE"] = "POLICY_DIRECTIVE";
    RegulationType["STANDARD_OPERATING_PROCEDURE"] = "STANDARD_OPERATING_PROCEDURE";
    RegulationType["INDUSTRY_STANDARD"] = "INDUSTRY_STANDARD";
    RegulationType["INTERNATIONAL_TREATY"] = "INTERNATIONAL_TREATY";
})(RegulationType || (exports.RegulationType = RegulationType = {}));
/**
 * Compliance categories
 */
var ComplianceCategory;
(function (ComplianceCategory) {
    ComplianceCategory["DATA_PRIVACY"] = "DATA_PRIVACY";
    ComplianceCategory["CYBERSECURITY"] = "CYBERSECURITY";
    ComplianceCategory["FINANCIAL_MANAGEMENT"] = "FINANCIAL_MANAGEMENT";
    ComplianceCategory["PROCUREMENT"] = "PROCUREMENT";
    ComplianceCategory["ENVIRONMENTAL"] = "ENVIRONMENTAL";
    ComplianceCategory["HEALTH_SAFETY"] = "HEALTH_SAFETY";
    ComplianceCategory["HUMAN_RESOURCES"] = "HUMAN_RESOURCES";
    ComplianceCategory["RECORDS_MANAGEMENT"] = "RECORDS_MANAGEMENT";
    ComplianceCategory["ETHICS_CONDUCT"] = "ETHICS_CONDUCT";
    ComplianceCategory["ACCESSIBILITY"] = "ACCESSIBILITY";
    ComplianceCategory["CIVIL_RIGHTS"] = "CIVIL_RIGHTS";
    ComplianceCategory["TRANSPARENCY"] = "TRANSPARENCY";
})(ComplianceCategory || (exports.ComplianceCategory = ComplianceCategory = {}));
/**
 * Requirement status
 */
var RequirementStatus;
(function (RequirementStatus) {
    RequirementStatus["ACTIVE"] = "ACTIVE";
    RequirementStatus["DRAFT"] = "DRAFT";
    RequirementStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    RequirementStatus["APPROVED"] = "APPROVED";
    RequirementStatus["SUPERSEDED"] = "SUPERSEDED";
    RequirementStatus["REPEALED"] = "REPEALED";
    RequirementStatus["SUSPENDED"] = "SUSPENDED";
})(RequirementStatus || (exports.RequirementStatus = RequirementStatus = {}));
/**
 * Compliance priority levels
 */
var CompliancePriority;
(function (CompliancePriority) {
    CompliancePriority["CRITICAL"] = "CRITICAL";
    CompliancePriority["HIGH"] = "HIGH";
    CompliancePriority["MEDIUM"] = "MEDIUM";
    CompliancePriority["LOW"] = "LOW";
})(CompliancePriority || (exports.CompliancePriority = CompliancePriority = {}));
/**
 * Certification status
 */
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["VALID"] = "VALID";
    CertificationStatus["EXPIRED"] = "EXPIRED";
    CertificationStatus["PENDING_RENEWAL"] = "PENDING_RENEWAL";
    CertificationStatus["SUSPENDED"] = "SUSPENDED";
    CertificationStatus["REVOKED"] = "REVOKED";
    CertificationStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
/**
 * Deadline status
 */
var DeadlineStatus;
(function (DeadlineStatus) {
    DeadlineStatus["UPCOMING"] = "UPCOMING";
    DeadlineStatus["DUE_SOON"] = "DUE_SOON";
    DeadlineStatus["OVERDUE"] = "OVERDUE";
    DeadlineStatus["COMPLETED"] = "COMPLETED";
    DeadlineStatus["EXTENDED"] = "EXTENDED";
    DeadlineStatus["WAIVED"] = "WAIVED";
    DeadlineStatus["CANCELLED"] = "CANCELLED";
})(DeadlineStatus || (exports.DeadlineStatus = DeadlineStatus = {}));
/**
 * Submission status
 */
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["DRAFT"] = "DRAFT";
    SubmissionStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    SubmissionStatus["APPROVED"] = "APPROVED";
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    SubmissionStatus["REJECTED"] = "REJECTED";
    SubmissionStatus["REQUIRES_CORRECTION"] = "REQUIRES_CORRECTION";
    SubmissionStatus["RESUBMITTED"] = "RESUBMITTED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
/**
 * Validation type
 */
var ValidationType;
(function (ValidationType) {
    ValidationType["SELF_ASSESSMENT"] = "SELF_ASSESSMENT";
    ValidationType["INTERNAL_AUDIT"] = "INTERNAL_AUDIT";
    ValidationType["EXTERNAL_AUDIT"] = "EXTERNAL_AUDIT";
    ValidationType["PEER_REVIEW"] = "PEER_REVIEW";
    ValidationType["AUTOMATED_SCAN"] = "AUTOMATED_SCAN";
    ValidationType["MANUAL_REVIEW"] = "MANUAL_REVIEW";
})(ValidationType || (exports.ValidationType = ValidationType = {}));
/**
 * Validation scope
 */
var ValidationScope;
(function (ValidationScope) {
    ValidationScope["DEPARTMENT"] = "DEPARTMENT";
    ValidationScope["AGENCY_WIDE"] = "AGENCY_WIDE";
    ValidationScope["PROGRAM_SPECIFIC"] = "PROGRAM_SPECIFIC";
    ValidationScope["SYSTEM_LEVEL"] = "SYSTEM_LEVEL";
    ValidationScope["PROCESS_LEVEL"] = "PROCESS_LEVEL";
})(ValidationScope || (exports.ValidationScope = ValidationScope = {}));
/**
 * Validation status
 */
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus["COMPLIANT"] = "COMPLIANT";
    ValidationStatus["PARTIALLY_COMPLIANT"] = "PARTIALLY_COMPLIANT";
    ValidationStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ValidationStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    ValidationStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ValidationStatus || (exports.ValidationStatus = ValidationStatus = {}));
/**
 * Training status
 */
var TrainingStatus;
(function (TrainingStatus) {
    TrainingStatus["NOT_STARTED"] = "NOT_STARTED";
    TrainingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TrainingStatus["COMPLETED"] = "COMPLETED";
    TrainingStatus["PASSED"] = "PASSED";
    TrainingStatus["FAILED"] = "FAILED";
    TrainingStatus["EXPIRED"] = "EXPIRED";
    TrainingStatus["WAIVED"] = "WAIVED";
})(TrainingStatus || (exports.TrainingStatus = TrainingStatus = {}));
/**
 * Change type
 */
var ChangeType;
(function (ChangeType) {
    ChangeType["NEW_REQUIREMENT"] = "NEW_REQUIREMENT";
    ChangeType["REQUIREMENT_UPDATE"] = "REQUIREMENT_UPDATE";
    ChangeType["REQUIREMENT_REPEAL"] = "REQUIREMENT_REPEAL";
    ChangeType["INTERPRETATION_CHANGE"] = "INTERPRETATION_CHANGE";
    ChangeType["ENFORCEMENT_CHANGE"] = "ENFORCEMENT_CHANGE";
    ChangeType["DEADLINE_CHANGE"] = "DEADLINE_CHANGE";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
/**
 * Change status
 */
var ChangeStatus;
(function (ChangeStatus) {
    ChangeStatus["PROPOSED"] = "PROPOSED";
    ChangeStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ChangeStatus["APPROVED"] = "APPROVED";
    ChangeStatus["REJECTED"] = "REJECTED";
    ChangeStatus["IMPLEMENTATION_PLANNED"] = "IMPLEMENTATION_PLANNED";
    ChangeStatus["IMPLEMENTING"] = "IMPLEMENTING";
    ChangeStatus["IMPLEMENTED"] = "IMPLEMENTED";
    ChangeStatus["MONITORING"] = "MONITORING";
})(ChangeStatus || (exports.ChangeStatus = ChangeStatus = {}));
/**
 * Risk level
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["CRITICAL"] = "CRITICAL";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["LOW"] = "LOW";
    RiskLevel["NEGLIGIBLE"] = "NEGLIGIBLE";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
/**
 * Violation type
 */
var ViolationType;
(function (ViolationType) {
    ViolationType["PROCEDURAL"] = "PROCEDURAL";
    ViolationType["DOCUMENTATION"] = "DOCUMENTATION";
    ViolationType["DEADLINE_MISSED"] = "DEADLINE_MISSED";
    ViolationType["REPORTING_FAILURE"] = "REPORTING_FAILURE";
    ViolationType["TRAINING_GAP"] = "TRAINING_GAP";
    ViolationType["POLICY_BREACH"] = "POLICY_BREACH";
    ViolationType["SYSTEM_CONFIGURATION"] = "SYSTEM_CONFIGURATION";
    ViolationType["ACCESS_CONTROL"] = "ACCESS_CONTROL";
})(ViolationType || (exports.ViolationType = ViolationType = {}));
/**
 * Violation status
 */
var ViolationStatus;
(function (ViolationStatus) {
    ViolationStatus["IDENTIFIED"] = "IDENTIFIED";
    ViolationStatus["INVESTIGATING"] = "INVESTIGATING";
    ViolationStatus["CORRECTIVE_ACTION_PLANNED"] = "CORRECTIVE_ACTION_PLANNED";
    ViolationStatus["CORRECTIVE_ACTION_UNDERWAY"] = "CORRECTIVE_ACTION_UNDERWAY";
    ViolationStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    ViolationStatus["RESOLVED"] = "RESOLVED";
    ViolationStatus["CLOSED"] = "CLOSED";
})(ViolationStatus || (exports.ViolationStatus = ViolationStatus = {}));
// ============================================================================
// REGULATORY REQUIREMENT TRACKING
// ============================================================================
/**
 * Creates a new regulatory requirement
 */
function createRegulatoryRequirement(params) {
    return {
        id: crypto.randomUUID(),
        requirementCode: params.requirementCode,
        title: params.title,
        description: params.description,
        regulatoryBody: params.regulatoryBody,
        regulationType: params.regulationType,
        category: params.category,
        effectiveDate: params.effectiveDate,
        mandatoryCompliance: params.mandatoryCompliance ?? true,
        applicableAgencies: params.applicableAgencies || [],
        relatedRequirements: [],
        documentationRequired: [],
        status: RequirementStatus.ACTIVE,
        priority: params.priority || CompliancePriority.MEDIUM,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Updates regulatory requirement status
 */
function updateRequirementStatus(requirement, newStatus) {
    return {
        ...requirement,
        status: newStatus,
        updatedAt: new Date(),
    };
}
/**
 * Links related requirements
 */
function linkRelatedRequirements(requirement, relatedRequirementIds) {
    return {
        ...requirement,
        relatedRequirements: [...new Set([...requirement.relatedRequirements, ...relatedRequirementIds])],
        updatedAt: new Date(),
    };
}
/**
 * Checks if requirement is active and applicable
 */
function isRequirementApplicable(requirement, agencyId, currentDate = new Date()) {
    if (requirement.status !== RequirementStatus.ACTIVE) {
        return false;
    }
    if (currentDate < requirement.effectiveDate) {
        return false;
    }
    if (requirement.expirationDate && currentDate > requirement.expirationDate) {
        return false;
    }
    if (requirement.applicableAgencies.length > 0 && !requirement.applicableAgencies.includes(agencyId)) {
        return false;
    }
    return true;
}
/**
 * Filters requirements by category
 */
function filterRequirementsByCategory(requirements, category) {
    return requirements.filter((req) => req.category === category);
}
/**
 * Filters requirements by regulatory body
 */
function filterRequirementsByBody(requirements, regulatoryBody) {
    return requirements.filter((req) => req.regulatoryBody === regulatoryBody);
}
/**
 * Gets requirements expiring soon
 */
function getExpiringSoonRequirements(requirements, daysThreshold = 90) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return requirements.filter((req) => req.expirationDate &&
        req.expirationDate <= thresholdDate &&
        req.expirationDate > new Date());
}
// ============================================================================
// COMPLIANCE CERTIFICATION MANAGEMENT
// ============================================================================
/**
 * Creates a compliance certification
 */
function createComplianceCertification(params) {
    return {
        id: crypto.randomUUID(),
        certificationName: params.certificationName,
        certificationBody: params.certificationBody,
        requirementId: params.requirementId,
        agencyId: params.agencyId,
        departmentId: undefined,
        certificationLevel: params.certificationLevel,
        issueDate: params.issueDate,
        expirationDate: params.expirationDate,
        renewalRequired: true,
        renewalPeriodDays: params.renewalPeriodDays,
        status: CertificationStatus.VALID,
        certificationNumber: params.certificationNumber,
        attestedBy: params.attestedBy,
        attestationDate: new Date(),
        conditions: [],
        metadata: {},
    };
}
/**
 * Checks certification validity
 */
function isCertificationValid(certification, currentDate = new Date()) {
    return (certification.status === CertificationStatus.VALID &&
        certification.expirationDate > currentDate);
}
/**
 * Gets certifications expiring soon
 */
function getExpiringCertifications(certifications, daysThreshold = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return certifications.filter((cert) => cert.status === CertificationStatus.VALID &&
        cert.expirationDate <= thresholdDate &&
        cert.expirationDate > new Date());
}
/**
 * Updates certification status
 */
function updateCertificationStatus(certification, newStatus) {
    return {
        ...certification,
        status: newStatus,
    };
}
/**
 * Renews a certification
 */
function renewCertification(certification, newIssueDate, newExpirationDate, attestedBy) {
    return {
        ...certification,
        issueDate: newIssueDate,
        expirationDate: newExpirationDate,
        status: CertificationStatus.VALID,
        attestedBy,
        attestationDate: new Date(),
    };
}
/**
 * Calculates days until certification expires
 */
function daysUntilCertificationExpires(certification, currentDate = new Date()) {
    const timeDiff = certification.expirationDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}
// ============================================================================
// COMPLIANCE DEADLINE MONITORING
// ============================================================================
/**
 * Creates a compliance deadline
 */
function createComplianceDeadline(params) {
    const reminderDates = generateReminderDates(params.dueDate);
    return {
        id: crypto.randomUUID(),
        requirementId: params.requirementId,
        title: params.title,
        description: params.description,
        dueDate: params.dueDate,
        reminderDates,
        assignedTo: params.assignedTo,
        departmentId: params.departmentId,
        priority: params.priority || CompliancePriority.MEDIUM,
        status: DeadlineStatus.UPCOMING,
        extensions: [],
        deliverables: params.deliverables || [],
        notificationsSent: 0,
        metadata: {},
    };
}
/**
 * Generates reminder dates for a deadline
 */
function generateReminderDates(dueDate) {
    const reminders = [];
    const intervals = [30, 14, 7, 3, 1]; // days before due date
    intervals.forEach((days) => {
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(reminderDate.getDate() - days);
        if (reminderDate > new Date()) {
            reminders.push(reminderDate);
        }
    });
    return reminders.sort((a, b) => a.getTime() - b.getTime());
}
/**
 * Updates deadline status based on current date
 */
function updateDeadlineStatus(deadline, currentDate = new Date()) {
    if (deadline.status === DeadlineStatus.COMPLETED) {
        return deadline;
    }
    const daysUntilDue = Math.ceil((deadline.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    let newStatus;
    if (daysUntilDue < 0) {
        newStatus = DeadlineStatus.OVERDUE;
    }
    else if (daysUntilDue <= 7) {
        newStatus = DeadlineStatus.DUE_SOON;
    }
    else {
        newStatus = DeadlineStatus.UPCOMING;
    }
    return {
        ...deadline,
        status: newStatus,
    };
}
/**
 * Completes a deadline
 */
function completeDeadline(deadline, completedBy) {
    return {
        ...deadline,
        status: DeadlineStatus.COMPLETED,
        completionDate: new Date(),
        completedBy,
    };
}
/**
 * Requests deadline extension
 */
function requestDeadlineExtension(deadline, requestedBy, newDueDate, reason) {
    const extension = {
        requestedDate: new Date(),
        requestedBy,
        newDueDate,
        reason,
        status: 'pending',
    };
    return {
        ...deadline,
        extensions: [...(deadline.extensions || []), extension],
    };
}
/**
 * Approves deadline extension
 */
function approveDeadlineExtension(deadline, extensionIndex, approvedBy) {
    const updatedExtensions = [...(deadline.extensions || [])];
    if (updatedExtensions[extensionIndex]) {
        updatedExtensions[extensionIndex] = {
            ...updatedExtensions[extensionIndex],
            approvedDate: new Date(),
            approvedBy,
            status: 'approved',
        };
        return {
            ...deadline,
            extensions: updatedExtensions,
            dueDate: updatedExtensions[extensionIndex].newDueDate,
            status: DeadlineStatus.EXTENDED,
        };
    }
    return deadline;
}
/**
 * Gets overdue deadlines
 */
function getOverdueDeadlines(deadlines, currentDate = new Date()) {
    return deadlines.filter((deadline) => deadline.status !== DeadlineStatus.COMPLETED &&
        deadline.dueDate < currentDate);
}
/**
 * Gets deadlines due within specified days
 */
function getDeadlinesDueSoon(deadlines, daysThreshold = 7) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return deadlines.filter((deadline) => deadline.status !== DeadlineStatus.COMPLETED &&
        deadline.dueDate <= thresholdDate &&
        deadline.dueDate >= new Date());
}
// ============================================================================
// REGULATORY REPORTING SUBMISSIONS
// ============================================================================
/**
 * Creates a regulatory report submission
 */
function createRegulatoryReportSubmission(params) {
    return {
        id: crypto.randomUUID(),
        reportType: params.reportType,
        requirementId: params.requirementId,
        reportingPeriodStart: params.reportingPeriodStart,
        reportingPeriodEnd: params.reportingPeriodEnd,
        submissionDeadline: params.submissionDeadline,
        recipientAgency: params.recipientAgency,
        reportData: params.reportData,
        attachments: [],
        status: SubmissionStatus.DRAFT,
        acknowledgmentReceived: false,
        corrections: [],
        metadata: {},
    };
}
/**
 * Submits a regulatory report
 */
function submitRegulatoryReport(submission, submittedBy) {
    return {
        ...submission,
        submittedDate: new Date(),
        submittedBy,
        status: SubmissionStatus.SUBMITTED,
        confirmationNumber: generateConfirmationNumber(),
    };
}
/**
 * Generates a confirmation number for submission
 */
function generateConfirmationNumber() {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `CONF-${timestamp}-${random}`.toUpperCase();
}
/**
 * Acknowledges report submission
 */
function acknowledgeReportSubmission(submission, feedback) {
    return {
        ...submission,
        status: SubmissionStatus.ACKNOWLEDGED,
        acknowledgmentReceived: true,
        feedback,
    };
}
/**
 * Requests report corrections
 */
function requestReportCorrections(submission, requestedBy, issue, correctionRequired) {
    const correction = {
        requestedDate: new Date(),
        requestedBy,
        issue,
        correctionRequired,
    };
    return {
        ...submission,
        status: SubmissionStatus.REQUIRES_CORRECTION,
        corrections: [...(submission.corrections || []), correction],
    };
}
/**
 * Resubmits corrected report
 */
function resubmitCorrectedReport(submission, correctionIndex, correctedBy, updatedReportData) {
    const updatedCorrections = [...(submission.corrections || [])];
    if (updatedCorrections[correctionIndex]) {
        updatedCorrections[correctionIndex] = {
            ...updatedCorrections[correctionIndex],
            correctedDate: new Date(),
            correctedBy,
        };
    }
    return {
        ...submission,
        corrections: updatedCorrections,
        reportData: updatedReportData,
        status: SubmissionStatus.RESUBMITTED,
        submittedDate: new Date(),
    };
}
// ============================================================================
// POLICY COMPLIANCE VALIDATION
// ============================================================================
/**
 * Creates a policy compliance validation
 */
function createPolicyComplianceValidation(params) {
    return {
        id: crypto.randomUUID(),
        policyId: params.policyId,
        policyName: params.policyName,
        validationDate: new Date(),
        validatedBy: params.validatedBy,
        validationType: params.validationType,
        scope: params.scope,
        findings: [],
        overallStatus: ValidationStatus.UNDER_REVIEW,
        complianceScore: 0,
        recommendations: [],
        followUpRequired: false,
        metadata: {},
    };
}
/**
 * Adds validation finding
 */
function addValidationFinding(validation, finding) {
    return {
        ...validation,
        findings: [...validation.findings, finding],
    };
}
/**
 * Calculates compliance score from findings
 */
function calculateComplianceScore(findings) {
    if (findings.length === 0)
        return 100;
    const severityWeights = {
        [CompliancePriority.CRITICAL]: 25,
        [CompliancePriority.HIGH]: 15,
        [CompliancePriority.MEDIUM]: 10,
        [CompliancePriority.LOW]: 5,
    };
    const totalPenalty = findings.reduce((sum, finding) => {
        return sum + (severityWeights[finding.severity] || 0);
    }, 0);
    return Math.max(0, 100 - totalPenalty);
}
/**
 * Determines overall validation status
 */
function determineValidationStatus(complianceScore) {
    if (complianceScore >= 95)
        return ValidationStatus.COMPLIANT;
    if (complianceScore >= 70)
        return ValidationStatus.PARTIALLY_COMPLIANT;
    return ValidationStatus.NON_COMPLIANT;
}
/**
 * Completes validation assessment
 */
function completeValidationAssessment(validation, recommendations) {
    const score = calculateComplianceScore(validation.findings);
    const status = determineValidationStatus(score);
    return {
        ...validation,
        complianceScore: score,
        overallStatus: status,
        recommendations,
        followUpRequired: status !== ValidationStatus.COMPLIANT,
    };
}
// ============================================================================
// COMPLIANCE TRAINING TRACKING
// ============================================================================
/**
 * Creates a compliance training record
 */
function createComplianceTrainingRecord(params) {
    return {
        id: crypto.randomUUID(),
        trainingName: params.trainingName,
        requirementId: params.requirementId,
        employeeId: params.employeeId,
        employeeName: params.employeeName,
        departmentId: params.departmentId,
        passingScore: params.passingScore,
        status: TrainingStatus.NOT_STARTED,
        certificateIssued: false,
        trainingDurationMinutes: params.trainingDurationMinutes,
        attestationSigned: false,
        renewalRequired: false,
        metadata: {},
    };
}
/**
 * Completes training
 */
function completeTraining(training, score, expirationDate) {
    const passed = score >= training.passingScore;
    return {
        ...training,
        completionDate: new Date(),
        expirationDate,
        score,
        status: passed ? TrainingStatus.PASSED : TrainingStatus.FAILED,
        certificateIssued: passed,
        attestationSigned: passed,
    };
}
/**
 * Gets employees with expired training
 */
function getExpiredTraining(trainings, currentDate = new Date()) {
    return trainings.filter((training) => training.expirationDate &&
        training.expirationDate < currentDate &&
        training.status === TrainingStatus.PASSED);
}
/**
 * Calculates training completion rate
 */
function calculateTrainingCompletionRate(trainings) {
    if (trainings.length === 0)
        return 0;
    const completed = trainings.filter((t) => t.status === TrainingStatus.PASSED || t.status === TrainingStatus.COMPLETED).length;
    return (completed / trainings.length) * 100;
}
// ============================================================================
// REGULATORY CHANGE MANAGEMENT
// ============================================================================
/**
 * Creates a regulatory change
 */
function createRegulatoryChange(params) {
    return {
        id: crypto.randomUUID(),
        changeType: params.changeType,
        title: params.title,
        description: params.description,
        changeSource: params.changeSource,
        effectiveDate: params.effectiveDate,
        impactAssessment: params.impactAssessment,
        affectedDepartments: params.affectedDepartments,
        actionItems: [],
        status: ChangeStatus.PROPOSED,
        metadata: {},
    };
}
/**
 * Adds action item to regulatory change
 */
function addChangeActionItem(change, actionItem) {
    return {
        ...change,
        actionItems: [...change.actionItems, actionItem],
    };
}
/**
 * Approves regulatory change
 */
function approveRegulatoryChange(change, approvedBy) {
    return {
        ...change,
        status: ChangeStatus.APPROVED,
        approvedBy,
        approvalDate: new Date(),
    };
}
/**
 * Calculates change implementation progress
 */
function calculateChangeProgress(change) {
    if (change.actionItems.length === 0)
        return 0;
    const completed = change.actionItems.filter((item) => item.status === 'completed').length;
    return (completed / change.actionItems.length) * 100;
}
// ============================================================================
// COMPLIANCE RISK ASSESSMENT
// ============================================================================
/**
 * Creates a compliance risk assessment
 */
function createComplianceRiskAssessment(params) {
    return {
        id: crypto.randomUUID(),
        assessmentDate: new Date(),
        assessmentPeriod: params.assessmentPeriod,
        performedBy: params.performedBy,
        scope: params.scope,
        risks: [],
        overallRiskLevel: RiskLevel.LOW,
        nextAssessmentDate: params.nextAssessmentDate,
        metadata: {},
    };
}
/**
 * Adds risk to assessment
 */
function addComplianceRisk(assessment, risk) {
    return {
        ...assessment,
        risks: [...assessment.risks, risk],
    };
}
/**
 * Calculates risk score
 */
function calculateRiskScore(likelihood, impact) {
    const levelValues = {
        [RiskLevel.CRITICAL]: 5,
        [RiskLevel.HIGH]: 4,
        [RiskLevel.MEDIUM]: 3,
        [RiskLevel.LOW]: 2,
        [RiskLevel.NEGLIGIBLE]: 1,
    };
    return levelValues[likelihood] * levelValues[impact];
}
/**
 * Determines overall risk level from risks
 */
function determineOverallRiskLevel(risks) {
    if (risks.some((r) => r.riskScore >= 20))
        return RiskLevel.CRITICAL;
    if (risks.some((r) => r.riskScore >= 15))
        return RiskLevel.HIGH;
    if (risks.some((r) => r.riskScore >= 9))
        return RiskLevel.MEDIUM;
    if (risks.some((r) => r.riskScore >= 4))
        return RiskLevel.LOW;
    return RiskLevel.NEGLIGIBLE;
}
// ============================================================================
// COMPLIANCE VIOLATION TRACKING
// ============================================================================
/**
 * Creates a compliance violation
 */
function createComplianceViolation(params) {
    return {
        id: crypto.randomUUID(),
        violationType: params.violationType,
        requirementId: params.requirementId,
        discoveryDate: new Date(),
        discoveredBy: params.discoveredBy,
        departmentId: params.departmentId,
        severity: params.severity,
        description: params.description,
        correctiveActions: [],
        reportedToRegulator: false,
        status: ViolationStatus.IDENTIFIED,
        penalties: [],
        metadata: {},
    };
}
/**
 * Adds corrective action to violation
 */
function addCorrectiveAction(violation, action) {
    return {
        ...violation,
        correctiveActions: [...violation.correctiveActions, action],
        status: ViolationStatus.CORRECTIVE_ACTION_PLANNED,
    };
}
/**
 * Resolves violation
 */
function resolveViolation(violation) {
    return {
        ...violation,
        status: ViolationStatus.RESOLVED,
        resolvedDate: new Date(),
    };
}
/**
 * Gets open violations by severity
 */
function getOpenViolationsBySeverity(violations, severity) {
    return violations.filter((v) => v.severity === severity &&
        ![ViolationStatus.RESOLVED, ViolationStatus.CLOSED].includes(v.status));
}
// ============================================================================
// COMPLIANCE DASHBOARD METRICS
// ============================================================================
/**
 * Generates compliance dashboard metrics
 */
function generateComplianceDashboardMetrics(params) {
    const compliantRequirements = params.requirements.filter((r) => r.status === RequirementStatus.ACTIVE).length;
    const categoryBreakdown = params.requirements.reduce((acc, req) => {
        acc[req.category] = (acc[req.category] || 0) + 1;
        return acc;
    }, {});
    return {
        overallComplianceRate: params.requirements.length > 0
            ? (compliantRequirements / params.requirements.length) * 100
            : 0,
        totalRequirements: params.requirements.length,
        compliantRequirements,
        nonCompliantRequirements: params.requirements.length - compliantRequirements,
        upcomingDeadlines: getDeadlinesDueSoon(params.deadlines).length,
        overdueDeadlines: getOverdueDeadlines(params.deadlines).length,
        activeCertifications: params.certifications.filter((c) => isCertificationValid(c)).length,
        expiringCertifications: getExpiringCertifications(params.certifications).length,
        openViolations: params.violations.filter((v) => ![ViolationStatus.RESOLVED, ViolationStatus.CLOSED].includes(v.status)).length,
        criticalRisks: params.violations.filter((v) => v.severity === CompliancePriority.CRITICAL)
            .length,
        trainingCompletionRate: calculateTrainingCompletionRate(params.trainings),
        recentSubmissions: params.submissions.filter((s) => s.status === SubmissionStatus.SUBMITTED || s.status === SubmissionStatus.ACKNOWLEDGED).length,
        categoryBreakdown,
    };
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model decorator for RegulatoryRequirement
 */
exports.RegulatoryRequirementModel = {
    tableName: 'regulatory_requirements',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        requirementCode: { type: 'STRING', allowNull: false, unique: true },
        title: { type: 'STRING', allowNull: false },
        description: { type: 'TEXT', allowNull: false },
        regulatoryBody: { type: 'STRING', allowNull: false },
        regulationType: { type: 'ENUM', values: Object.values(RegulationType) },
        category: { type: 'ENUM', values: Object.values(ComplianceCategory) },
        effectiveDate: { type: 'DATE', allowNull: false },
        expirationDate: { type: 'DATE', allowNull: true },
        mandatoryCompliance: { type: 'BOOLEAN', defaultValue: true },
        applicableAgencies: { type: 'JSON', defaultValue: [] },
        relatedRequirements: { type: 'JSON', defaultValue: [] },
        documentationRequired: { type: 'JSON', defaultValue: [] },
        status: { type: 'ENUM', values: Object.values(RequirementStatus) },
        priority: { type: 'ENUM', values: Object.values(CompliancePriority) },
        metadata: { type: 'JSON', defaultValue: {} },
        createdAt: { type: 'DATE', allowNull: false },
        updatedAt: { type: 'DATE', allowNull: false },
    },
    indexes: [
        { fields: ['requirementCode'] },
        { fields: ['regulatoryBody'] },
        { fields: ['category'] },
        { fields: ['status'] },
        { fields: ['effectiveDate'] },
    ],
};
/**
 * Sequelize model decorator for ComplianceCertification
 */
exports.ComplianceCertificationModel = {
    tableName: 'compliance_certifications',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        certificationName: { type: 'STRING', allowNull: false },
        certificationBody: { type: 'STRING', allowNull: false },
        requirementId: { type: 'UUID', allowNull: false },
        agencyId: { type: 'UUID', allowNull: false },
        departmentId: { type: 'UUID', allowNull: true },
        certificationLevel: { type: 'STRING', allowNull: false },
        issueDate: { type: 'DATE', allowNull: false },
        expirationDate: { type: 'DATE', allowNull: false },
        renewalRequired: { type: 'BOOLEAN', defaultValue: true },
        renewalPeriodDays: { type: 'INTEGER', allowNull: false },
        status: { type: 'ENUM', values: Object.values(CertificationStatus) },
        certificationNumber: { type: 'STRING', allowNull: false, unique: true },
        documentPath: { type: 'STRING', allowNull: true },
        attestedBy: { type: 'STRING', allowNull: false },
        attestationDate: { type: 'DATE', allowNull: false },
        nextReviewDate: { type: 'DATE', allowNull: true },
        conditions: { type: 'JSON', defaultValue: [] },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['requirementId'] },
        { fields: ['agencyId'] },
        { fields: ['status'] },
        { fields: ['expirationDate'] },
        { fields: ['certificationNumber'] },
    ],
};
/**
 * Sequelize model decorator for ComplianceDeadline
 */
exports.ComplianceDeadlineModel = {
    tableName: 'compliance_deadlines',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        requirementId: { type: 'UUID', allowNull: false },
        title: { type: 'STRING', allowNull: false },
        description: { type: 'TEXT', allowNull: false },
        dueDate: { type: 'DATE', allowNull: false },
        reminderDates: { type: 'JSON', defaultValue: [] },
        assignedTo: { type: 'JSON', allowNull: false },
        departmentId: { type: 'UUID', allowNull: false },
        priority: { type: 'ENUM', values: Object.values(CompliancePriority) },
        status: { type: 'ENUM', values: Object.values(DeadlineStatus) },
        completionDate: { type: 'DATE', allowNull: true },
        completedBy: { type: 'STRING', allowNull: true },
        extensions: { type: 'JSON', defaultValue: [] },
        dependencies: { type: 'JSON', defaultValue: [] },
        deliverables: { type: 'JSON', defaultValue: [] },
        notificationsSent: { type: 'INTEGER', defaultValue: 0 },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['requirementId'] },
        { fields: ['departmentId'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['priority'] },
    ],
};
/**
 * Sequelize model decorator for ComplianceViolation
 */
exports.ComplianceViolationModel = {
    tableName: 'compliance_violations',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        violationType: { type: 'ENUM', values: Object.values(ViolationType) },
        requirementId: { type: 'UUID', allowNull: false },
        discoveryDate: { type: 'DATE', allowNull: false },
        discoveredBy: { type: 'STRING', allowNull: false },
        departmentId: { type: 'UUID', allowNull: false },
        severity: { type: 'ENUM', values: Object.values(CompliancePriority) },
        description: { type: 'TEXT', allowNull: false },
        rootCause: { type: 'TEXT', allowNull: true },
        correctiveActions: { type: 'JSON', defaultValue: [] },
        reportedToRegulator: { type: 'BOOLEAN', defaultValue: false },
        reportDate: { type: 'DATE', allowNull: true },
        status: { type: 'ENUM', values: Object.values(ViolationStatus) },
        resolvedDate: { type: 'DATE', allowNull: true },
        penalties: { type: 'JSON', defaultValue: [] },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['requirementId'] },
        { fields: ['departmentId'] },
        { fields: ['status'] },
        { fields: ['severity'] },
        { fields: ['discoveryDate'] },
    ],
};
// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================
/**
 * Example NestJS service for compliance tracking
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ComplianceTrackingService {
 *   constructor(
 *     @InjectModel(RegulatoryRequirementModel)
 *     private requirementRepo: Repository<RegulatoryRequirement>,
 *   ) {}
 *
 *   async createRequirement(dto: CreateRequirementDto): Promise<RegulatoryRequirement> {
 *     const requirement = createRegulatoryRequirement(dto);
 *     return this.requirementRepo.save(requirement);
 *   }
 *
 *   async getApplicableRequirements(agencyId: string): Promise<RegulatoryRequirement[]> {
 *     const requirements = await this.requirementRepo.find();
 *     return requirements.filter(req => isRequirementApplicable(req, agencyId));
 *   }
 * }
 * ```
 */
exports.ComplianceTrackingServiceExample = `
@Injectable()
export class ComplianceTrackingService {
  constructor(
    @InjectModel(RegulatoryRequirementModel)
    private requirementRepo: Repository<RegulatoryRequirement>,
    @InjectModel(ComplianceCertificationModel)
    private certificationRepo: Repository<ComplianceCertification>,
    @InjectModel(ComplianceDeadlineModel)
    private deadlineRepo: Repository<ComplianceDeadline>,
  ) {}

  async getDashboardMetrics(agencyId: string): Promise<ComplianceDashboardMetrics> {
    const requirements = await this.requirementRepo.find();
    const certifications = await this.certificationRepo.find({ where: { agencyId } });
    const deadlines = await this.deadlineRepo.find();

    return generateComplianceDashboardMetrics({
      requirements,
      certifications,
      deadlines,
      violations: [],
      trainings: [],
      submissions: [],
    });
  }
}
`;
// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================
/**
 * Swagger DTO for creating regulatory requirement
 */
exports.CreateRegulatoryRequirementDto = {
    schema: {
        type: 'object',
        required: [
            'requirementCode',
            'title',
            'description',
            'regulatoryBody',
            'regulationType',
            'category',
            'effectiveDate',
        ],
        properties: {
            requirementCode: { type: 'string', example: 'OMB-A123' },
            title: { type: 'string', example: 'Management\'s Responsibility for Enterprise Risk Management' },
            description: { type: 'string', example: 'Federal agencies must implement ERM' },
            regulatoryBody: { type: 'string', example: 'Office of Management and Budget' },
            regulationType: { type: 'string', enum: Object.values(RegulationType) },
            category: { type: 'string', enum: Object.values(ComplianceCategory) },
            effectiveDate: { type: 'string', format: 'date-time' },
            expirationDate: { type: 'string', format: 'date-time', nullable: true },
            mandatoryCompliance: { type: 'boolean', default: true },
            applicableAgencies: { type: 'array', items: { type: 'string' } },
            priority: { type: 'string', enum: Object.values(CompliancePriority) },
        },
    },
};
/**
 * Swagger DTO for compliance deadline
 */
exports.CreateComplianceDeadlineDto = {
    schema: {
        type: 'object',
        required: ['requirementId', 'title', 'description', 'dueDate', 'assignedTo', 'departmentId'],
        properties: {
            requirementId: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Annual FISMA Compliance Report' },
            description: { type: 'string', example: 'Submit annual FISMA compliance assessment' },
            dueDate: { type: 'string', format: 'date-time' },
            assignedTo: { type: 'array', items: { type: 'string' } },
            departmentId: { type: 'string', format: 'uuid' },
            priority: { type: 'string', enum: Object.values(CompliancePriority) },
            deliverables: { type: 'array', items: { type: 'string' } },
        },
    },
};
/**
 * Swagger response schema for dashboard metrics
 */
exports.ComplianceDashboardMetricsResponse = {
    schema: {
        type: 'object',
        properties: {
            overallComplianceRate: { type: 'number', example: 92.5 },
            totalRequirements: { type: 'number', example: 150 },
            compliantRequirements: { type: 'number', example: 139 },
            nonCompliantRequirements: { type: 'number', example: 11 },
            upcomingDeadlines: { type: 'number', example: 8 },
            overdueDeadlines: { type: 'number', example: 2 },
            activeCertifications: { type: 'number', example: 45 },
            expiringCertifications: { type: 'number', example: 5 },
            openViolations: { type: 'number', example: 3 },
            criticalRisks: { type: 'number', example: 1 },
            trainingCompletionRate: { type: 'number', example: 87.5 },
            recentSubmissions: { type: 'number', example: 12 },
            categoryBreakdown: {
                type: 'object',
                additionalProperties: { type: 'number' },
            },
        },
    },
};
//# sourceMappingURL=compliance-regulatory-tracking-kit.js.map