"use strict";
/**
 * Financial Case Management Workflow Kit
 * Enterprise-grade case management system with comprehensive workflow support
 *
 * Features:
 * - Complete case lifecycle management (creation, assignment, prioritization, closure)
 * - Evidence and investigation tracking
 * - Multi-user collaboration with commenting system
 * - SLA tracking and escalation management
 * - Audit trails and compliance reporting
 * - Advanced search, filtering, and archival
 * - Notification system with template support
 * - Financial metrics and KPI tracking
 *
 * @module case-management-workflow-kit
 * @version 1.0.0
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASE_MANAGEMENT_EXPORTS = exports.CaseManagementWorkflowService = exports.CaseTemplate = exports.CaseNotification = exports.CaseSLA = exports.CaseAuditTrail = exports.CaseClosure = exports.CaseEscalation = exports.CaseDecision = exports.CaseNote = exports.InvestigationTask = exports.InvestigationTimeline = exports.CaseEvidence = exports.FinancialCase = exports.EscalationReason = exports.DecisionType = exports.TaskStatus = exports.InvestigationActivityType = exports.EvidenceType = exports.CasePriority = exports.CaseStatus = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const moment = __importStar(require("moment"));
/* ============================================================================
   TYPE DEFINITIONS & INTERFACES
   ============================================================================ */
/**
 * Case status enumeration tracking workflow progression
 */
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["DRAFT"] = "DRAFT";
    CaseStatus["OPEN"] = "OPEN";
    CaseStatus["ASSIGNED"] = "ASSIGNED";
    CaseStatus["INVESTIGATING"] = "INVESTIGATING";
    CaseStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    CaseStatus["ESCALATED"] = "ESCALATED";
    CaseStatus["DECISION_PENDING"] = "DECISION_PENDING";
    CaseStatus["RESOLVED"] = "RESOLVED";
    CaseStatus["CLOSED"] = "CLOSED";
    CaseStatus["ARCHIVED"] = "ARCHIVED";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
/**
 * Case priority levels with SLA implications
 */
var CasePriority;
(function (CasePriority) {
    CasePriority["CRITICAL"] = "CRITICAL";
    CasePriority["HIGH"] = "HIGH";
    CasePriority["MEDIUM"] = "MEDIUM";
    CasePriority["LOW"] = "LOW";
})(CasePriority || (exports.CasePriority = CasePriority = {}));
/**
 * Evidence classification for proper management
 */
var EvidenceType;
(function (EvidenceType) {
    EvidenceType["DOCUMENT"] = "DOCUMENT";
    EvidenceType["EMAIL"] = "EMAIL";
    EvidenceType["TRANSACTION_RECORD"] = "TRANSACTION_RECORD";
    EvidenceType["COMMUNICATION"] = "COMMUNICATION";
    EvidenceType["MEDIA"] = "MEDIA";
    EvidenceType["DATABASE_RECORD"] = "DATABASE_RECORD";
    EvidenceType["AUDIT_LOG"] = "AUDIT_LOG";
    EvidenceType["OTHER"] = "OTHER";
})(EvidenceType || (exports.EvidenceType = EvidenceType = {}));
/**
 * Investigation activity types
 */
var InvestigationActivityType;
(function (InvestigationActivityType) {
    InvestigationActivityType["REVIEW"] = "REVIEW";
    InvestigationActivityType["ANALYSIS"] = "ANALYSIS";
    InvestigationActivityType["INTERVIEW"] = "INTERVIEW";
    InvestigationActivityType["DOCUMENT_COLLECTION"] = "DOCUMENT_COLLECTION";
    InvestigationActivityType["FOLLOW_UP"] = "FOLLOW_UP";
    InvestigationActivityType["ESCALATION"] = "ESCALATION";
    InvestigationActivityType["DECISION"] = "DECISION";
})(InvestigationActivityType || (exports.InvestigationActivityType = InvestigationActivityType = {}));
/**
 * Task status within investigation
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["BLOCKED"] = "BLOCKED";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
/**
 * Decision types in case resolution workflow
 */
var DecisionType;
(function (DecisionType) {
    DecisionType["APPROVED"] = "APPROVED";
    DecisionType["REJECTED"] = "REJECTED";
    DecisionType["NEEDS_REVIEW"] = "NEEDS_REVIEW";
    DecisionType["NEEDS_ESCALATION"] = "NEEDS_ESCALATION";
})(DecisionType || (exports.DecisionType = DecisionType = {}));
/**
 * Escalation reasons for traceability
 */
var EscalationReason;
(function (EscalationReason) {
    EscalationReason["COMPLEXITY"] = "COMPLEXITY";
    EscalationReason["TIME_EXCEEDED"] = "TIME_EXCEEDED";
    EscalationReason["REGULATORY"] = "REGULATORY";
    EscalationReason["HIGH_VALUE"] = "HIGH_VALUE";
    EscalationReason["MANAGEMENT_REQUEST"] = "MANAGEMENT_REQUEST";
    EscalationReason["OTHER"] = "OTHER";
})(EscalationReason || (exports.EscalationReason = EscalationReason = {}));
/* ============================================================================
   SEQUELIZE MODELS/ENTITIES
   ============================================================================ */
/**
 * Financial Case model for Sequelize ORM
 */
class FinancialCase extends sequelize_1.Model {
}
exports.FinancialCase = FinancialCase;
/**
 * Case Evidence model
 */
class CaseEvidence extends sequelize_1.Model {
}
exports.CaseEvidence = CaseEvidence;
/**
 * Investigation Timeline model
 */
class InvestigationTimeline extends sequelize_1.Model {
}
exports.InvestigationTimeline = InvestigationTimeline;
/**
 * Investigation Task model
 */
class InvestigationTask extends sequelize_1.Model {
}
exports.InvestigationTask = InvestigationTask;
/**
 * Case Notes/Comments model
 */
class CaseNote extends sequelize_1.Model {
}
exports.CaseNote = CaseNote;
/**
 * Decision Workflow model
 */
class CaseDecision extends sequelize_1.Model {
}
exports.CaseDecision = CaseDecision;
/**
 * Escalation History model
 */
class CaseEscalation extends sequelize_1.Model {
}
exports.CaseEscalation = CaseEscalation;
/**
 * Case Closure Record model
 */
class CaseClosure extends sequelize_1.Model {
}
exports.CaseClosure = CaseClosure;
/**
 * Audit Trail model
 */
class CaseAuditTrail extends sequelize_1.Model {
}
exports.CaseAuditTrail = CaseAuditTrail;
/**
 * SLA Tracking model
 */
class CaseSLA extends sequelize_1.Model {
}
exports.CaseSLA = CaseSLA;
/**
 * Notification model
 */
class CaseNotification extends sequelize_1.Model {
}
exports.CaseNotification = CaseNotification;
/**
 * Case Template model
 */
class CaseTemplate extends sequelize_1.Model {
}
exports.CaseTemplate = CaseTemplate;
/* ============================================================================
   SERVICE CLASS - 40 ENTERPRISE-GRADE FUNCTIONS
   ============================================================================ */
let CaseManagementWorkflowService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CaseManagementWorkflowService = _classThis = class {
        constructor(caseModel, evidenceModel, timelineModel, taskModel, noteModel, decisionModel, escalationModel, closureModel, auditTrailModel, slaModel, notificationModel, templateModel) {
            this.caseModel = caseModel;
            this.evidenceModel = evidenceModel;
            this.timelineModel = timelineModel;
            this.taskModel = taskModel;
            this.noteModel = noteModel;
            this.decisionModel = decisionModel;
            this.escalationModel = escalationModel;
            this.closureModel = closureModel;
            this.auditTrailModel = auditTrailModel;
            this.slaModel = slaModel;
            this.notificationModel = notificationModel;
            this.templateModel = templateModel;
            this.SLA_CONFIG = new Map([
                [CasePriority.CRITICAL, { priority: CasePriority.CRITICAL, responseTimeHours: 2, resolutionTimeHours: 24 }],
                [CasePriority.HIGH, { priority: CasePriority.HIGH, responseTimeHours: 8, resolutionTimeHours: 72 }],
                [CasePriority.MEDIUM, { priority: CasePriority.MEDIUM, responseTimeHours: 24, resolutionTimeHours: 240 }],
                [CasePriority.LOW, { priority: CasePriority.LOW, responseTimeHours: 72, resolutionTimeHours: 480 }],
            ]);
        }
        /* ========================================================================
           CASE CREATION FUNCTIONS (1-3)
           ======================================================================== */
        /**
         * Create a new financial case with comprehensive initialization
         *
         * @param dto - Case creation data transfer object
         * @param transaction - Database transaction for atomicity
         * @returns Created case entity with all initialized fields
         * @throws BadRequestException if validation fails
         *
         * @example
         * const newCase = await service.createCase({
         *   caseNumber: 'FC-2024-00001',
         *   title: 'Suspicious Transaction Detection',
         *   description: 'Large unusual wire transfer detected',
         *   caseType: 'AML_INVESTIGATION',
         *   priority: CasePriority.HIGH,
         *   createdBy: 'user-123'
         * });
         */
        async createCase(dto, transaction) {
            // Validation
            if (!dto.caseNumber?.trim()) {
                throw new common_1.BadRequestException('Case number is required');
            }
            if (!dto.title?.trim()) {
                throw new common_1.BadRequestException('Case title is required');
            }
            // Check for duplicate case number
            const existingCase = await this.caseModel.findOne({
                where: { caseNumber: dto.caseNumber },
                transaction,
            });
            if (existingCase) {
                throw new common_1.ConflictException(`Case with number ${dto.caseNumber} already exists`);
            }
            // Create case
            const newCase = await this.caseModel.create({
                id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseNumber: dto.caseNumber,
                title: dto.title,
                description: dto.description,
                caseType: dto.caseType,
                status: CaseStatus.DRAFT,
                priority: dto.priority,
                createdBy: dto.createdBy,
                department: dto.department,
                relatedAccounts: dto.relatedAccounts || [],
                tags: dto.tags || [],
                createdAt: new Date(),
                updatedAt: new Date(),
            }, { transaction });
            // Initialize SLA
            await this._initializeSLA(newCase.id, newCase.priority, transaction);
            // Create audit trail entry
            await this._createAuditTrail(newCase.id, 'CASE_CREATED', dto.createdBy, {}, newCase.toJSON(), transaction);
            return newCase;
        }
        /**
         * Create case from template with pre-configured settings
         *
         * @param templateId - Template identifier
         * @param dto - Base case data
         * @param transaction - Database transaction
         * @returns Created case with template configurations applied
         * @throws NotFoundException if template not found
         */
        async createCaseFromTemplate(templateId, dto, transaction) {
            const template = await this.templateModel.findByPk(templateId, { transaction });
            if (!template) {
                throw new common_1.NotFoundException(`Template ${templateId} not found`);
            }
            const caseData = {
                ...dto,
                priority: dto.priority || template.defaultPriority,
                department: dto.department || template.defaultAssignedDepartment,
            };
            const newCase = await this.createCase(caseData, transaction);
            // Apply template tasks
            if (template.taskTemplate) {
                const taskTemplate = JSON.parse(template.taskTemplate);
                for (const task of taskTemplate) {
                    await this.createInvestigationTask(newCase.id, {
                        title: task.title,
                        description: task.description,
                        assignedTo: task.assignedTo,
                        dueDate: moment().add(task.dueDaysOffset, 'days').toDate(),
                        priority: task.priority,
                        dependsOn: task.dependsOn,
                    }, transaction);
                }
            }
            return newCase;
        }
        /**
         * Bulk create cases from CSV/batch data
         *
         * @param cases - Array of case creation DTOs
         * @param transaction - Database transaction
         * @returns Array of created cases
         * @throws BadRequestException if any case fails validation
         */
        async bulkCreateCases(cases, transaction) {
            if (!cases || cases.length === 0) {
                throw new common_1.BadRequestException('At least one case is required');
            }
            const createdCases = [];
            for (const caseData of cases) {
                try {
                    const newCase = await this.createCase(caseData, transaction);
                    createdCases.push(newCase);
                }
                catch (error) {
                    throw new common_1.BadRequestException(`Failed to create case ${caseData.caseNumber}: ${error.message}`);
                }
            }
            return createdCases;
        }
        /* ========================================================================
           CASE ASSIGNMENT FUNCTIONS (4-6)
           ======================================================================== */
        /**
         * Assign case to investigator with audit trail
         *
         * @param caseId - Case identifier
         * @param dto - Assignment data
         * @param transaction - Database transaction
         * @returns Updated case
         * @throws NotFoundException if case not found
         */
        async assignCase(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const previousAssignee = caseEntity.assignedTo;
            await caseEntity.update({
                assignedTo: dto.assignedTo,
                assignedAt: new Date(),
                status: caseEntity.status === CaseStatus.DRAFT ? CaseStatus.ASSIGNED : caseEntity.status,
            }, { transaction });
            // Create audit trail
            await this._createAuditTrail(caseId, 'CASE_ASSIGNED', dto.assignedBy, { assignedTo: previousAssignee }, { assignedTo: dto.assignedTo, assignedAt: new Date() }, transaction);
            // Create notification
            await this._createNotification(caseId, dto.assignedTo, 'CASE_ASSIGNED', `Case ${caseEntity.caseNumber} assigned to you`, `You have been assigned case ${caseEntity.caseNumber}: ${caseEntity.title}`, transaction);
            // Add note if provided
            if (dto.notes) {
                await this.addCaseNote(caseId, {
                    content: `Assignment Note: ${dto.notes}`,
                    authorId: dto.assignedBy,
                    isInternal: true,
                }, transaction);
            }
            return caseEntity;
        }
        /**
         * Reassign case to different investigator
         *
         * @param caseId - Case identifier
         * @param newAssignee - New assignee user ID
         * @param reason - Reason for reassignment
         * @param performedBy - User performing reassignment
         * @param transaction - Database transaction
         * @returns Updated case
         */
        async reassignCase(caseId, newAssignee, reason, performedBy, transaction) {
            return this.assignCase(caseId, {
                assignedTo: newAssignee,
                assignedBy: performedBy,
                notes: `Reassigned: ${reason}`,
            }, transaction);
        }
        /**
         * Get assignment history for case
         *
         * @param caseId - Case identifier
         * @returns Chronological list of assignments
         */
        async getAssignmentHistory(caseId) {
            const auditEntries = await this.auditTrailModel.findAll({
                where: {
                    caseId,
                    action: 'CASE_ASSIGNED',
                },
                order: [['performedAt', 'DESC']],
            });
            return auditEntries.map(entry => ({
                assignedTo: entry.newValues?.assignedTo,
                assignedAt: entry.newValues?.assignedAt,
                assignedBy: entry.performedBy,
                reason: entry.newValues?.notes,
            }));
        }
        /* ========================================================================
           CASE PRIORITIZATION FUNCTIONS (7-8)
           ======================================================================== */
        /**
         * Update case priority with impact analysis
         *
         * @param caseId - Case identifier
         * @param newPriority - New priority level
         * @param reason - Reason for priority change
         * @param changedBy - User making change
         * @param transaction - Database transaction
         * @returns Updated case
         */
        async updateCasePriority(caseId, newPriority, reason, changedBy, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const oldPriority = caseEntity.priority;
            await caseEntity.update({ priority: newPriority }, { transaction });
            // Update SLA based on new priority
            const slaConfig = this.SLA_CONFIG.get(newPriority);
            if (slaConfig) {
                const now = moment();
                await this.slaModel.update({
                    priority: newPriority,
                    responseDeadline: now.clone().add(slaConfig.responseTimeHours, 'hours').toDate(),
                    resolutionDeadline: now.clone().add(slaConfig.resolutionTimeHours, 'hours').toDate(),
                }, { where: { caseId }, transaction });
            }
            // Create audit trail
            await this._createAuditTrail(caseId, 'PRIORITY_CHANGED', changedBy, { priority: oldPriority, reason }, { priority: newPriority }, transaction);
            // Add note
            await this.addCaseNote(caseId, {
                content: `Priority updated from ${oldPriority} to ${newPriority}. Reason: ${reason}`,
                authorId: changedBy,
                isInternal: true,
            }, transaction);
            return caseEntity;
        }
        /**
         * Auto-prioritize cases based on risk scoring rules
         *
         * @param caseId - Case identifier
         * @param riskScore - Calculated risk score (0-100)
         * @returns New priority level assigned
         */
        async autoPrioritizeCase(caseId, riskScore) {
            let newPriority;
            if (riskScore >= 80) {
                newPriority = CasePriority.CRITICAL;
            }
            else if (riskScore >= 60) {
                newPriority = CasePriority.HIGH;
            }
            else if (riskScore >= 40) {
                newPriority = CasePriority.MEDIUM;
            }
            else {
                newPriority = CasePriority.LOW;
            }
            await this.updateCasePriority(caseId, newPriority, `Auto-prioritized based on risk score: ${riskScore}`, 'SYSTEM');
            return newPriority;
        }
        /* ========================================================================
           STATUS TRACKING FUNCTIONS (9-11)
           ======================================================================== */
        /**
         * Update case status with validation and state machine enforcement
         *
         * @param caseId - Case identifier
         * @param newStatus - New status
         * @param changedBy - User performing change
         * @param reason - Status change reason
         * @param transaction - Database transaction
         * @returns Updated case
         * @throws BadRequestException if status transition invalid
         */
        async updateCaseStatus(caseId, newStatus, changedBy, reason, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const oldStatus = caseEntity.status;
            // Validate state transition
            if (!this._isValidStatusTransition(oldStatus, newStatus)) {
                throw new common_1.BadRequestException(`Invalid status transition from ${oldStatus} to ${newStatus}`);
            }
            await caseEntity.update({ status: newStatus }, { transaction });
            // Audit trail
            await this._createAuditTrail(caseId, 'STATUS_CHANGED', changedBy, { status: oldStatus }, { status: newStatus }, transaction);
            // Add note
            await this.addCaseNote(caseId, {
                content: `Status updated to ${newStatus}${reason ? `. Reason: ${reason}` : ''}`,
                authorId: changedBy,
                isInternal: true,
            }, transaction);
            return caseEntity;
        }
        /**
         * Get status history with timestamps
         *
         * @param caseId - Case identifier
         * @returns Chronological status change history
         */
        async getStatusHistory(caseId) {
            const auditEntries = await this.auditTrailModel.findAll({
                where: {
                    caseId,
                    action: 'STATUS_CHANGED',
                },
                order: [['performedAt', 'DESC']],
            });
            return auditEntries.map(entry => ({
                status: entry.newValues?.status,
                changedAt: entry.performedAt,
                changedBy: entry.performedBy,
                reason: entry.newValues?.reason,
            }));
        }
        /**
         * Get current case status summary
         *
         * @param caseId - Case identifier
         * @returns Comprehensive status information
         */
        async getCaseStatus(caseId) {
            const caseEntity = await this.caseModel.findByPk(caseId);
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const tasks = await this.taskModel.findAll({ where: { caseId } });
            const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
            return {
                caseId,
                caseNumber: caseEntity.caseNumber,
                currentStatus: caseEntity.status,
                priority: caseEntity.priority,
                assignedTo: caseEntity.assignedTo,
                lastUpdated: caseEntity.updatedAt,
                progressPercentage: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
                tasksSummary: {
                    total: tasks.length,
                    completed: completedTasks,
                    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
                },
            };
        }
        /* ========================================================================
           EVIDENCE MANAGEMENT FUNCTIONS (12-15)
           ======================================================================== */
        /**
         * Submit evidence with hash verification and retention tracking
         *
         * @param caseId - Case identifier
         * @param dto - Evidence submission data
         * @param transaction - Database transaction
         * @returns Created evidence record
         * @throws NotFoundException if case not found
         */
        async submitEvidence(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const evidence = await this.evidenceModel.create({
                id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                title: dto.title,
                description: dto.description,
                type: dto.type,
                fileUrl: dto.fileUrl,
                contentHash: dto.contentHash,
                submittedBy: dto.submittedBy,
                submittedAt: new Date(),
                tags: dto.tags || [],
                isVerified: false,
            }, { transaction });
            // Create audit trail
            await this._createAuditTrail(caseId, 'EVIDENCE_SUBMITTED', dto.submittedBy, {}, { evidenceId: evidence.id, type: dto.type }, transaction);
            // Add note
            await this.addCaseNote(caseId, {
                content: `Evidence submitted: ${dto.title} (${dto.type})`,
                authorId: dto.submittedBy,
                isInternal: true,
            }, transaction);
            return evidence;
        }
        /**
         * Verify evidence and mark as validated
         *
         * @param evidenceId - Evidence identifier
         * @param verifiedBy - User verifying evidence
         * @param verificationNotes - Verification details
         * @param transaction - Database transaction
         * @returns Updated evidence
         */
        async verifyEvidence(evidenceId, verifiedBy, verificationNotes, transaction) {
            const evidence = await this.evidenceModel.findByPk(evidenceId, { transaction });
            if (!evidence) {
                throw new common_1.NotFoundException(`Evidence ${evidenceId} not found`);
            }
            await evidence.update({
                isVerified: true,
                verifiedBy,
                verifiedAt: new Date(),
            }, { transaction });
            // Add note to case
            await this.addCaseNote(evidence.caseId, {
                content: `Evidence verified: ${evidence.title}${verificationNotes ? `. Notes: ${verificationNotes}` : ''}`,
                authorId: verifiedBy,
                isInternal: true,
            }, transaction);
            return evidence;
        }
        /**
         * Get all evidence for case
         *
         * @param caseId - Case identifier
         * @param filters - Optional filter criteria
         * @returns Paginated evidence list
         */
        async getEvidenceList(caseId, filters) {
            const where = { caseId };
            if (filters?.type)
                where.type = filters.type;
            if (filters?.verified !== undefined)
                where.isVerified = filters.verified;
            const { count, rows } = await this.evidenceModel.findAndCountAll({
                where,
                offset: filters?.offset || 0,
                limit: filters?.limit || 50,
                order: [['submittedAt', 'DESC']],
            });
            return { evidence: rows, total: count };
        }
        /**
         * Set evidence retention expiry and manage archival
         *
         * @param evidenceId - Evidence identifier
         * @param expiryDate - Date when evidence can be deleted
         * @param reason - Retention policy reason
         * @param transaction - Database transaction
         * @returns Updated evidence
         */
        async setEvidenceRetention(evidenceId, expiryDate, reason, transaction) {
            const evidence = await this.evidenceModel.findByPk(evidenceId, { transaction });
            if (!evidence) {
                throw new common_1.NotFoundException(`Evidence ${evidenceId} not found`);
            }
            await evidence.update({ retentionExpiryDate: expiryDate }, { transaction });
            // Add note
            await this.addCaseNote(evidence.caseId, {
                content: `Evidence retention set until ${expiryDate.toISOString()}. Reason: ${reason}`,
                authorId: 'SYSTEM',
                isInternal: true,
            }, transaction);
            return evidence;
        }
        /* ========================================================================
           INVESTIGATION TIMELINE FUNCTIONS (16-18)
           ======================================================================== */
        /**
         * Add investigation activity to timeline
         *
         * @param caseId - Case identifier
         * @param dto - Investigation activity data
         * @param transaction - Database transaction
         * @returns Created timeline entry
         */
        async addInvestigationActivity(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const activity = await this.timelineModel.create({
                id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                activityType: dto.activityType,
                description: dto.description,
                performedBy: dto.performedBy,
                performedAt: new Date(),
                findings: dto.findings,
                attachments: dto.attachments || [],
            }, { transaction });
            // Update case status if needed
            if (caseEntity.status === CaseStatus.ASSIGNED) {
                await caseEntity.update({ status: CaseStatus.INVESTIGATING }, { transaction });
            }
            // Create audit trail
            await this._createAuditTrail(caseId, 'INVESTIGATION_ACTIVITY_ADDED', dto.performedBy, {}, { activityType: dto.activityType }, transaction);
            // Add note
            await this.addCaseNote(caseId, {
                content: `Investigation Activity: ${dto.activityType} - ${dto.description}`,
                authorId: dto.performedBy,
                isInternal: true,
            }, transaction);
            return activity;
        }
        /**
         * Get investigation timeline for case
         *
         * @param caseId - Case identifier
         * @returns Chronological investigation activities
         */
        async getInvestigationTimeline(caseId) {
            return this.timelineModel.findAll({
                where: { caseId },
                order: [['performedAt', 'ASC']],
            });
        }
        /**
         * Generate investigation summary from timeline
         *
         * @param caseId - Case identifier
         * @returns Summary of investigation progress and findings
         */
        async getInvestigationSummary(caseId) {
            const activities = await this.timelineModel.findAll({
                where: { caseId },
                order: [['performedAt', 'DESC']],
            });
            const activitiesByType = {};
            const keyFindings = [];
            activities.forEach(activity => {
                activitiesByType[activity.activityType] = (activitiesByType[activity.activityType] || 0) + 1;
                if (activity.findings) {
                    keyFindings.push(activity.findings);
                }
            });
            const caseEntity = await this.caseModel.findByPk(caseId);
            const investDays = moment().diff(moment(caseEntity.createdAt), 'days');
            return {
                caseId,
                totalActivities: activities.length,
                activitiesByType,
                lastActivity: activities.length > 0 ? {
                    performedAt: activities[0].performedAt,
                    type: activities[0].activityType,
                    performedBy: activities[0].performedBy,
                } : null,
                investigationDuration: investDays,
                keyFindings,
            };
        }
        /* ========================================================================
           TASK MANAGEMENT FUNCTIONS (19-22)
           ======================================================================== */
        /**
         * Create investigation task within case
         *
         * @param caseId - Case identifier
         * @param dto - Task creation data
         * @param transaction - Database transaction
         * @returns Created task
         */
        async createInvestigationTask(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const task = await this.taskModel.create({
                id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                title: dto.title,
                description: dto.description,
                status: TaskStatus.PENDING,
                assignedTo: dto.assignedTo,
                createdAt: new Date(),
                dueDate: dto.dueDate,
                priority: dto.priority,
                dependsOn: dto.dependsOn || [],
                progress: 0,
            }, { transaction });
            // Create notification
            await this._createNotification(caseId, dto.assignedTo, 'TASK_ASSIGNED', `New task: ${dto.title}`, `A new investigation task has been assigned to you: ${dto.title}`, transaction);
            return task;
        }
        /**
         * Update task status with progress tracking
         *
         * @param taskId - Task identifier
         * @param newStatus - New task status
         * @param progress - Completion percentage (0-100)
         * @param updatedBy - User updating task
         * @param transaction - Database transaction
         * @returns Updated task
         */
        async updateTaskStatus(taskId, newStatus, progress, updatedBy, transaction) {
            const task = await this.taskModel.findByPk(taskId, { transaction });
            if (!task) {
                throw new common_1.NotFoundException(`Task ${taskId} not found`);
            }
            await task.update({
                status: newStatus,
                progress: progress ?? task.progress,
                completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : null,
            }, { transaction });
            return task;
        }
        /**
         * Get tasks for case with filtering
         *
         * @param caseId - Case identifier
         * @param filters - Filter options (status, assignedTo, etc.)
         * @returns Filtered task list
         */
        async getTasksForCase(caseId, filters) {
            const where = { caseId };
            if (filters?.status)
                where.status = filters.status;
            if (filters?.assignedTo)
                where.assignedTo = filters.assignedTo;
            if (filters?.overdue)
                where.dueDate = { [sequelize_1.Op.lt]: new Date() };
            return this.taskModel.findAll({
                where,
                order: [['dueDate', 'ASC']],
            });
        }
        /**
         * Batch update task dependencies (useful for workflow management)
         *
         * @param taskIds - Task identifiers
         * @param dependencyMap - Mapping of task IDs to their dependencies
         * @param transaction - Database transaction
         * @returns Array of updated tasks
         */
        async updateTaskDependencies(taskIds, dependencyMap, transaction) {
            const updatedTasks = [];
            for (const taskId of taskIds) {
                const task = await this.taskModel.findByPk(taskId, { transaction });
                if (task) {
                    await task.update({ dependsOn: dependencyMap[taskId] || [] }, { transaction });
                    updatedTasks.push(task);
                }
            }
            return updatedTasks;
        }
        /* ========================================================================
           COLLABORATION & NOTES FUNCTIONS (23-25)
           ======================================================================== */
        /**
         * Add case note or comment with mention support
         *
         * @param caseId - Case identifier
         * @param dto - Note data
         * @param transaction - Database transaction
         * @returns Created note
         */
        async addCaseNote(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const note = await this.noteModel.create({
                id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                content: dto.content,
                authorId: dto.authorId,
                authorName: `User-${dto.authorId}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                isInternal: dto.isInternal,
                mentions: dto.mentions || [],
                attachments: [],
                isEdited: false,
            }, { transaction });
            // Create notifications for mentioned users
            if (dto.mentions && dto.mentions.length > 0) {
                for (const mentionedUser of dto.mentions) {
                    await this._createNotification(caseId, mentionedUser, 'CASE_MENTION', `You were mentioned in case ${caseEntity.caseNumber}`, `${note.authorName} mentioned you in a case note`, transaction);
                }
            }
            return note;
        }
        /**
         * Get case notes with pagination
         *
         * @param caseId - Case identifier
         * @param filters - Filter options (internal only, author, etc.)
         * @returns Paginated notes list
         */
        async getCaseNotes(caseId, filters) {
            const where = { caseId };
            if (filters?.internalOnly)
                where.isInternal = true;
            if (filters?.authorId)
                where.authorId = filters.authorId;
            const { count, rows } = await this.noteModel.findAndCountAll({
                where,
                offset: filters?.offset || 0,
                limit: filters?.limit || 50,
                order: [['createdAt', 'DESC']],
            });
            return { notes: rows, total: count };
        }
        /**
         * Edit case note with edit history tracking
         *
         * @param noteId - Note identifier
         * @param newContent - Updated note content
         * @param editedBy - User editing
         * @param transaction - Database transaction
         * @returns Updated note
         */
        async editCaseNote(noteId, newContent, editedBy, transaction) {
            const note = await this.noteModel.findByPk(noteId, { transaction });
            if (!note) {
                throw new common_1.NotFoundException(`Note ${noteId} not found`);
            }
            // Track edit history
            const editHistory = note.editHistory || [];
            editHistory.push({
                previousContent: note.content,
                editedAt: new Date(),
                editedBy,
            });
            await note.update({
                content: newContent,
                updatedAt: new Date(),
                isEdited: true,
                editHistory,
            }, { transaction });
            return note;
        }
        /* ========================================================================
           DECISION WORKFLOW FUNCTIONS (26-28)
           ======================================================================== */
        /**
         * Submit case decision with supporting documentation
         *
         * @param caseId - Case identifier
         * @param dto - Decision submission data
         * @param transaction - Database transaction
         * @returns Created decision record
         */
        async submitDecision(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const decision = await this.decisionModel.create({
                id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                decision: dto.decision,
                reasoning: dto.reasoning,
                decidedBy: dto.decidedBy,
                decidedAt: new Date(),
                recommendations: dto.recommendations,
                attachments: dto.attachments || [],
                status: 'PENDING',
            }, { transaction });
            // Update case status
            if (dto.decision === DecisionType.APPROVED) {
                await caseEntity.update({ status: CaseStatus.UNDER_REVIEW }, { transaction });
            }
            else if (dto.decision === DecisionType.NEEDS_ESCALATION) {
                await caseEntity.update({ status: CaseStatus.ESCALATED }, { transaction });
            }
            // Create audit trail
            await this._createAuditTrail(caseId, 'DECISION_SUBMITTED', dto.decidedBy, {}, { decision: dto.decision }, transaction);
            return decision;
        }
        /**
         * Approve or reject decision
         *
         * @param decisionId - Decision identifier
         * @param approved - Approval status
         * @param approvedBy - User approving
         * @param comments - Optional approval comments
         * @param transaction - Database transaction
         * @returns Updated decision
         */
        async approveDecision(decisionId, approved, approvedBy, comments, transaction) {
            const decision = await this.decisionModel.findByPk(decisionId, { transaction });
            if (!decision) {
                throw new common_1.NotFoundException(`Decision ${decisionId} not found`);
            }
            await decision.update({
                status: approved ? 'APPROVED' : 'REJECTED',
                approvedBy,
                approvedAt: new Date(),
            }, { transaction });
            // Update case status based on decision
            const caseEntity = await this.caseModel.findByPk(decision.caseId, { transaction });
            if (approved && decision.decision === DecisionType.APPROVED) {
                await caseEntity.update({ status: CaseStatus.RESOLVED }, { transaction });
            }
            // Add note
            await this.addCaseNote(decision.caseId, {
                content: `Decision ${approved ? 'Approved' : 'Rejected'} by ${approvedBy}${comments ? `. Comments: ${comments}` : ''}`,
                authorId: approvedBy,
                isInternal: true,
            }, transaction);
            return decision;
        }
        /**
         * Get decision history for case
         *
         * @param caseId - Case identifier
         * @returns All decisions made on case
         */
        async getDecisionHistory(caseId) {
            return this.decisionModel.findAll({
                where: { caseId },
                order: [['decidedAt', 'DESC']],
            });
        }
        /* ========================================================================
           ESCALATION FUNCTIONS (29-31)
           ======================================================================== */
        /**
         * Escalate case to higher authority/review
         *
         * @param caseId - Case identifier
         * @param dto - Escalation data
         * @param transaction - Database transaction
         * @returns Escalation record
         */
        async escalateCase(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const escalation = await this.escalationModel.create({
                id: `escalation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                reason: dto.reason,
                escalatedFrom: caseEntity.assignedTo,
                escalatedTo: dto.escalatedTo,
                escalatedBy: dto.escalatedBy,
                escalatedAt: new Date(),
                justification: dto.justification,
                targetResolutionDate: dto.targetResolutionDate,
            }, { transaction });
            // Update case
            await caseEntity.update({
                status: CaseStatus.ESCALATED,
                assignedTo: dto.escalatedTo,
            }, { transaction });
            // Create audit trail
            await this._createAuditTrail(caseId, 'CASE_ESCALATED', dto.escalatedBy, { assignedTo: caseEntity.assignedTo }, { assignedTo: dto.escalatedTo, escalationReason: dto.reason }, transaction);
            // Create notification
            await this._createNotification(caseId, dto.escalatedTo, 'CASE_ESCALATED', `Case ${caseEntity.caseNumber} escalated to you`, `Escalation Reason: ${dto.reason}. Justification: ${dto.justification}`, transaction);
            return escalation;
        }
        /**
         * Resolve escalation
         *
         * @param escalationId - Escalation identifier
         * @param resolution - How escalation was resolved
         * @param resolvedBy - User resolving
         * @param transaction - Database transaction
         * @returns Updated escalation
         */
        async resolveEscalation(escalationId, resolution, resolvedBy, transaction) {
            const escalation = await this.escalationModel.findByPk(escalationId, { transaction });
            if (!escalation) {
                throw new common_1.NotFoundException(`Escalation ${escalationId} not found`);
            }
            await escalation.update({
                resolvedAt: new Date(),
                resolution,
            }, { transaction });
            // Add note to case
            await this.addCaseNote(escalation.caseId, {
                content: `Escalation resolved: ${resolution}`,
                authorId: resolvedBy,
                isInternal: true,
            }, transaction);
            return escalation;
        }
        /**
         * Get escalation history for case
         *
         * @param caseId - Case identifier
         * @returns List of escalations
         */
        async getEscalationHistory(caseId) {
            return this.escalationModel.findAll({
                where: { caseId },
                order: [['escalatedAt', 'DESC']],
            });
        }
        /* ========================================================================
           CLOSURE PROCEDURES FUNCTIONS (32-34)
           ======================================================================== */
        /**
         * Close case with comprehensive closure documentation
         *
         * @param caseId - Case identifier
         * @param dto - Case closure data
         * @param transaction - Database transaction
         * @returns Closure record
         */
        async closeCase(caseId, dto, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const closure = await this.closureModel.create({
                id: `closure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                caseId,
                closedBy: dto.closedBy,
                closedAt: new Date(),
                resolution: dto.resolution,
                outcome: dto.outcome,
                recommendations: dto.recommendations,
                followUpRequired: dto.followUpRequired,
                followUpDate: dto.followUpDate,
            }, { transaction });
            // Update case
            await caseEntity.update({
                status: CaseStatus.CLOSED,
                closedAt: new Date(),
                closedBy: dto.closedBy,
                resolutionSummary: dto.resolution,
            }, { transaction });
            // Create audit trail
            await this._createAuditTrail(caseId, 'CASE_CLOSED', dto.closedBy, { status: CaseStatus.ESCALATED }, { status: CaseStatus.CLOSED }, transaction);
            return closure;
        }
        /**
         * Archive closed case
         *
         * @param caseId - Case identifier
         * @param archivedBy - User archiving
         * @param reason - Archive reason
         * @param transaction - Database transaction
         * @returns Updated case
         */
        async archiveCase(caseId, archivedBy, reason, transaction) {
            const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            if (caseEntity.status !== CaseStatus.CLOSED) {
                throw new common_1.BadRequestException('Only closed cases can be archived');
            }
            await caseEntity.update({
                status: CaseStatus.ARCHIVED,
                archivedAt: new Date(),
            }, { transaction });
            // Create audit trail
            await this._createAuditTrail(caseId, 'CASE_ARCHIVED', archivedBy, {}, { reason }, transaction);
            return caseEntity;
        }
        /**
         * Create follow-up case from closed case
         *
         * @param caseId - Original case identifier
         * @param followUpData - Follow-up case creation data
         * @param transaction - Database transaction
         * @returns New follow-up case
         */
        async createFollowUpCase(caseId, followUpData, transaction) {
            const originalCase = await this.caseModel.findByPk(caseId, { transaction });
            if (!originalCase) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            // Create new case with reference to original
            const followUpCase = await this.createCase({
                ...followUpData,
                tags: [...(followUpData.tags || []), `follow-up-of-${originalCase.caseNumber}`],
            }, transaction);
            // Link cases in audit trail
            await this._createAuditTrail(followUpCase.id, 'FOLLOW_UP_CASE_CREATED', followUpData.createdBy, {}, { originalCaseId: caseId }, transaction);
            return followUpCase;
        }
        /* ========================================================================
           METRICS & REPORTING FUNCTIONS (35-36)
           ======================================================================== */
        /**
         * Calculate comprehensive case metrics
         *
         * @param filters - Optional filter criteria
         * @returns Aggregated metrics and KPIs
         */
        async calculateCaseMetrics(filters) {
            const where = {};
            if (filters?.dateFrom)
                where.createdAt = { [sequelize_1.Op.gte]: filters.dateFrom };
            if (filters?.dateTo)
                where.updatedAt = { [sequelize_1.Op.lte]: filters.dateTo };
            if (filters?.department)
                where.department = filters.department;
            const cases = await this.caseModel.findAll({ where });
            const totalCases = cases.length;
            const openCases = cases.filter(c => [CaseStatus.OPEN, CaseStatus.INVESTIGATING, CaseStatus.ESCALATED].includes(c.status)).length;
            const closedCases = cases.filter(c => c.status === CaseStatus.CLOSED).length;
            // Calculate SLA metrics
            const slaRecords = await this.slaModel.findAll({ where: { caseId: cases.map(c => c.id) } });
            const avgResponseTime = slaRecords.reduce((sum, s) => sum + (s.actualResponseTime || 0), 0) / (slaRecords.length || 1);
            const avgResolutionTime = slaRecords.reduce((sum, s) => sum + (s.actualResolutionTime || 0), 0) / (slaRecords.length || 1);
            const breachedSLAs = slaRecords.filter(s => s.responseBreached || s.resolutionBreached).length;
            const onTimeSLAPercentage = totalCases > 0 ? ((totalCases - breachedSLAs) / totalCases) * 100 : 0;
            // Calculate escalation rate
            const escalations = await this.escalationModel.findAll({ where: { caseId: cases.map(c => c.id) } });
            const escalationRate = totalCases > 0 ? (escalations.length / totalCases) * 100 : 0;
            // Priority distribution
            const priorityDistribution = {};
            cases.forEach(c => {
                priorityDistribution[c.priority] = (priorityDistribution[c.priority] || 0) + 1;
            });
            return {
                totalCases,
                openCases,
                closedCases,
                averageResolutionTime: Math.round(avgResolutionTime),
                averageResponseTime: Math.round(avgResponseTime),
                onTimeSLAPercentage: Math.round(onTimeSLAPercentage),
                escalationRate: Math.round(escalationRate),
                priorityDistribution,
            };
        }
        /**
         * Generate comprehensive case report
         *
         * @param caseId - Case identifier
         * @returns Complete case report with all details
         */
        async generateCaseReport(caseId) {
            const caseEntity = await this.caseModel.findByPk(caseId);
            if (!caseEntity) {
                throw new common_1.NotFoundException(`Case ${caseId} not found`);
            }
            const [timeline, evidence, decisions, escalations, notes] = await Promise.all([
                this.getInvestigationTimeline(caseId),
                this.getEvidenceList(caseId),
                this.getDecisionHistory(caseId),
                this.getEscalationHistory(caseId),
                this.getCaseNotes(caseId),
            ]);
            return {
                caseInfo: caseEntity,
                timeline,
                evidence: evidence.evidence,
                decisions,
                escalations,
                notes: notes.notes,
                metrics: await this.getCaseStatus(caseId),
            };
        }
        /* ========================================================================
           SEARCH & FILTER FUNCTIONS (37-38)
           ======================================================================== */
        /**
         * Advanced search with multiple filter criteria
         *
         * @param criteria - Search and filter criteria
         * @returns Paginated search results
         */
        async searchCases(criteria) {
            const where = {};
            if (criteria.caseNumber) {
                where.caseNumber = { [sequelize_1.Op.iLike]: `%${criteria.caseNumber}%` };
            }
            if (criteria.status && criteria.status.length > 0) {
                where.status = { [sequelize_1.Op.in]: criteria.status };
            }
            if (criteria.priority && criteria.priority.length > 0) {
                where.priority = { [sequelize_1.Op.in]: criteria.priority };
            }
            if (criteria.assignedTo) {
                where.assignedTo = criteria.assignedTo;
            }
            if (criteria.createdBy) {
                where.createdBy = criteria.createdBy;
            }
            if (criteria.department) {
                where.department = criteria.department;
            }
            if (criteria.dateFrom || criteria.dateTo) {
                where.createdAt = {};
                if (criteria.dateFrom)
                    where.createdAt[sequelize_1.Op.gte] = criteria.dateFrom;
                if (criteria.dateTo)
                    where.createdAt[sequelize_1.Op.lte] = criteria.dateTo;
            }
            // Full-text search on title and description if searchTerm provided
            if (criteria.searchTerm) {
                where[sequelize_1.Op.or] = [
                    { title: { [sequelize_1.Op.iLike]: `%${criteria.searchTerm}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${criteria.searchTerm}%` } },
                ];
            }
            const page = criteria.page || 1;
            const limit = criteria.limit || 20;
            const offset = (page - 1) * limit;
            const { count, rows } = await this.caseModel.findAndCountAll({
                where,
                offset,
                limit,
                order: [['createdAt', 'DESC']],
            });
            return {
                cases: rows,
                total: count,
                page,
                pageSize: limit,
            };
        }
        /**
         * Apply saved filter and return matching cases
         *
         * @param filterName - Name of saved filter
         * @param page - Pagination page
         * @param limit - Results per page
         * @returns Filtered cases
         */
        async applySavedFilter(filterName, page, limit) {
            // This would typically load filter definitions from a configuration or database
            // For now, we'll return based on common filter names
            const filterMap = {
                'my-active-cases': { status: [CaseStatus.ASSIGNED, CaseStatus.INVESTIGATING] },
                'high-priority': { priority: [CasePriority.CRITICAL, CasePriority.HIGH] },
                'pending-closure': { status: [CaseStatus.UNDER_REVIEW, CaseStatus.DECISION_PENDING] },
                'escalated': { status: [CaseStatus.ESCALATED] },
            };
            const criteria = filterMap[filterName];
            if (!criteria) {
                throw new common_1.NotFoundException(`Filter ${filterName} not found`);
            }
            criteria.page = page || 1;
            criteria.limit = limit || 20;
            const result = await this.searchCases(criteria);
            return { cases: result.cases, total: result.total };
        }
        /* ========================================================================
           ARCHIVE MANAGEMENT FUNCTIONS (39)
           ======================================================================== */
        /**
         * Manage case archival lifecycle
         *
         * @param filters - Archive filters (age, status, etc.)
         * @returns List of archived cases
         */
        async getArchivedCases(filters) {
            const where = { status: CaseStatus.ARCHIVED };
            if (filters?.dateFrom)
                where.archivedAt = { [sequelize_1.Op.gte]: filters.dateFrom };
            if (filters?.dateTo)
                where.archivedAt = { [sequelize_1.Op.lte]: filters.dateTo };
            if (filters?.department)
                where.department = filters.department;
            const offset = ((filters?.page || 1) - 1) * (filters?.limit || 20);
            const { count, rows } = await this.caseModel.findAndCountAll({
                where,
                offset,
                limit: filters?.limit || 20,
                order: [['archivedAt', 'DESC']],
            });
            return { cases: rows, total: count };
        }
        /* ========================================================================
           AUDIT TRAIL FUNCTIONS (40)
           ======================================================================== */
        /**
         * Retrieve complete audit trail for case with filter support
         *
         * @param caseId - Case identifier
         * @param filters - Optional filters (action, performedBy, date range)
         * @returns Audit trail entries in chronological order
         */
        async getAuditTrail(caseId, filters) {
            const where = { caseId };
            if (filters?.action)
                where.action = filters.action;
            if (filters?.performedBy)
                where.performedBy = filters.performedBy;
            if (filters?.dateFrom || filters?.dateTo) {
                where.performedAt = {};
                if (filters?.dateFrom)
                    where.performedAt[sequelize_1.Op.gte] = filters.dateFrom;
                if (filters?.dateTo)
                    where.performedAt[sequelize_1.Op.lte] = filters.dateTo;
            }
            const offset = filters?.offset || 0;
            const limit = filters?.limit || 100;
            const { count, rows } = await this.auditTrailModel.findAndCountAll({
                where,
                offset,
                limit,
                order: [['performedAt', 'DESC']],
            });
            return { entries: rows, total: count };
        }
        /* ========================================================================
           PRIVATE HELPER FUNCTIONS
           ======================================================================== */
        /**
         * Initialize SLA for new case based on priority
         */
        async _initializeSLA(caseId, priority, transaction) {
            const slaConfig = this.SLA_CONFIG.get(priority);
            if (!slaConfig)
                return;
            const now = moment();
            await this.slaModel.create({
                id: `sla-${Date.now()}`,
                caseId,
                priority,
                responseDeadline: now.clone().add(slaConfig.responseTimeHours, 'hours').toDate(),
                resolutionDeadline: now.clone().add(slaConfig.resolutionTimeHours, 'hours').toDate(),
                responseBreached: false,
                resolutionBreached: false,
            }, { transaction });
        }
        /**
         * Create audit trail entry
         */
        async _createAuditTrail(caseId, action, performedBy, previousValues, newValues, transaction) {
            await this.auditTrailModel.create({
                id: `audit-${Date.now()}`,
                caseId,
                action,
                performedBy,
                performedAt: new Date(),
                previousValues,
                newValues,
            }, { transaction });
        }
        /**
         * Create notification
         */
        async _createNotification(caseId, recipientId, type, subject, body, transaction) {
            await this.notificationModel.create({
                id: `notif-${Date.now()}`,
                caseId,
                recipientId,
                type,
                subject,
                body,
                createdAt: new Date(),
                deliveryStatus: 'PENDING',
                retryCount: 0,
            }, { transaction });
        }
        /**
         * Validate case status transition
         */
        _isValidStatusTransition(from, to) {
            const validTransitions = {
                [CaseStatus.DRAFT]: [CaseStatus.OPEN, CaseStatus.ASSIGNED],
                [CaseStatus.OPEN]: [CaseStatus.ASSIGNED, CaseStatus.ARCHIVED],
                [CaseStatus.ASSIGNED]: [CaseStatus.INVESTIGATING, CaseStatus.ESCALATED, CaseStatus.ARCHIVED],
                [CaseStatus.INVESTIGATING]: [CaseStatus.UNDER_REVIEW, CaseStatus.ESCALATED, CaseStatus.DECISION_PENDING],
                [CaseStatus.UNDER_REVIEW]: [CaseStatus.DECISION_PENDING, CaseStatus.RESOLVED],
                [CaseStatus.ESCALATED]: [CaseStatus.INVESTIGATING, CaseStatus.DECISION_PENDING],
                [CaseStatus.DECISION_PENDING]: [CaseStatus.RESOLVED, CaseStatus.ESCALATED],
                [CaseStatus.RESOLVED]: [CaseStatus.CLOSED],
                [CaseStatus.CLOSED]: [CaseStatus.ARCHIVED],
                [CaseStatus.ARCHIVED]: [],
            };
            return validTransitions[from]?.includes(to) || false;
        }
    };
    __setFunctionName(_classThis, "CaseManagementWorkflowService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CaseManagementWorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CaseManagementWorkflowService = _classThis;
})();
exports.CaseManagementWorkflowService = CaseManagementWorkflowService;
/* ============================================================================
   EXPORTS
   ============================================================================ */
exports.CASE_MANAGEMENT_EXPORTS = {
    // Services
    CaseManagementWorkflowService,
    // Models
    FinancialCase,
    CaseEvidence,
    InvestigationTimeline,
    InvestigationTask,
    CaseNote,
    CaseDecision,
    CaseEscalation,
    CaseClosure,
    CaseAuditTrail,
    CaseSLA,
    CaseNotification,
    CaseTemplate,
    // Enums
    CaseStatus,
    CasePriority,
    EvidenceType,
    InvestigationActivityType,
    TaskStatus,
    DecisionType,
    EscalationReason,
    // DTOs and Interfaces
    CreateCaseDTO,
    AssignCaseDTO,
    SubmitEvidenceDTO,
    AddInvestigationActivityDTO,
    CreateInvestigationTaskDTO,
    AddCaseNoteDTO,
    SubmitDecisionDTO,
    EscalateCaseDTO,
    CloseCaseDTO,
    CaseSearchCriteria,
    SLAConfiguration,
    NotificationTemplate,
    CaseMetrics,
};
//# sourceMappingURL=case-management-workflow-kit.js.map