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

import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, Op, Transaction, literal, fn, col, QueryTypes } from 'sequelize';
import * as moment from 'moment';

/* ============================================================================
   TYPE DEFINITIONS & INTERFACES
   ============================================================================ */

/**
 * Case status enumeration tracking workflow progression
 */
export enum CaseStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  INVESTIGATING = 'INVESTIGATING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ESCALATED = 'ESCALATED',
  DECISION_PENDING = 'DECISION_PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Case priority levels with SLA implications
 */
export enum CasePriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Evidence classification for proper management
 */
export enum EvidenceType {
  DOCUMENT = 'DOCUMENT',
  EMAIL = 'EMAIL',
  TRANSACTION_RECORD = 'TRANSACTION_RECORD',
  COMMUNICATION = 'COMMUNICATION',
  MEDIA = 'MEDIA',
  DATABASE_RECORD = 'DATABASE_RECORD',
  AUDIT_LOG = 'AUDIT_LOG',
  OTHER = 'OTHER'
}

/**
 * Investigation activity types
 */
export enum InvestigationActivityType {
  REVIEW = 'REVIEW',
  ANALYSIS = 'ANALYSIS',
  INTERVIEW = 'INTERVIEW',
  DOCUMENT_COLLECTION = 'DOCUMENT_COLLECTION',
  FOLLOW_UP = 'FOLLOW_UP',
  ESCALATION = 'ESCALATION',
  DECISION = 'DECISION'
}

/**
 * Task status within investigation
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Decision types in case resolution workflow
 */
export enum DecisionType {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  NEEDS_ESCALATION = 'NEEDS_ESCALATION'
}

/**
 * Escalation reasons for traceability
 */
export enum EscalationReason {
  COMPLEXITY = 'COMPLEXITY',
  TIME_EXCEEDED = 'TIME_EXCEEDED',
  REGULATORY = 'REGULATORY',
  HIGH_VALUE = 'HIGH_VALUE',
  MANAGEMENT_REQUEST = 'MANAGEMENT_REQUEST',
  OTHER = 'OTHER'
}

/**
 * Core case creation DTO
 */
export interface CreateCaseDTO {
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  priority: CasePriority;
  createdBy: string;
  department?: string;
  relatedAccounts?: string[];
  tags?: string[];
}

/**
 * Case assignment data
 */
export interface AssignCaseDTO {
  assignedTo: string;
  assignedBy: string;
  notes?: string;
}

/**
 * Evidence submission data
 */
export interface SubmitEvidenceDTO {
  title: string;
  description: string;
  type: EvidenceType;
  fileUrl?: string;
  contentHash: string;
  submittedBy: string;
  tags?: string[];
}

/**
 * Investigation activity tracking
 */
export interface AddInvestigationActivityDTO {
  activityType: InvestigationActivityType;
  description: string;
  performedBy: string;
  findings?: string;
  attachments?: string[];
}

/**
 * Task creation within investigation
 */
export interface CreateInvestigationTaskDTO {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: CasePriority;
  dependsOn?: string[];
}

/**
 * Case note/comment submission
 */
export interface AddCaseNoteDTO {
  content: string;
  authorId: string;
  isInternal: boolean;
  mentions?: string[];
}

/**
 * Decision workflow submission
 */
export interface SubmitDecisionDTO {
  decision: DecisionType;
  reasoning: string;
  decidedBy: string;
  recommendations?: string;
  attachments?: string[];
}

/**
 * Escalation submission
 */
export interface EscalateCaseDTO {
  reason: EscalationReason;
  escalatedTo: string;
  escalatedBy: string;
  justification: string;
  targetResolutionDate?: Date;
}

/**
 * Case closure data
 */
export interface CloseCaseDTO {
  closedBy: string;
  resolution: string;
  outcome: string;
  recommendations?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

/**
 * Search and filter criteria
 */
export interface CaseSearchCriteria {
  caseNumber?: string;
  status?: CaseStatus[];
  priority?: CasePriority[];
  assignedTo?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  department?: string;
  tags?: string[];
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * SLA tracking configuration
 */
export interface SLAConfiguration {
  priority: CasePriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
}

/**
 * Notification template data
 */
export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  placeholders: string[];
  isActive: boolean;
}

/**
 * Case metrics and KPI data
 */
export interface CaseMetrics {
  totalCases: number;
  openCases: number;
  closedCases: number;
  averageResolutionTime: number;
  averageResponseTime: number;
  onTimeSLAPercentage: number;
  escalationRate: number;
  priorityDistribution: Record<string, number>;
}

/* ============================================================================
   SEQUELIZE MODELS/ENTITIES
   ============================================================================ */

/**
 * Financial Case model for Sequelize ORM
 */
export class FinancialCase extends Model {
  declare id: string;
  declare caseNumber: string;
  declare title: string;
  declare description: string;
  declare caseType: string;
  declare status: CaseStatus;
  declare priority: CasePriority;
  declare createdBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare assignedTo?: string;
  declare assignedAt?: Date;
  declare department?: string;
  declare relatedAccounts: string[];
  declare tags: string[];
  declare closedAt?: Date;
  declare closedBy?: string;
  declare archivedAt?: Date;
  declare slaResponseDeadline?: Date;
  declare slaResolutionDeadline?: Date;
  declare resolutionSummary?: string;
}

/**
 * Case Evidence model
 */
export class CaseEvidence extends Model {
  declare id: string;
  declare caseId: string;
  declare title: string;
  declare description: string;
  declare type: EvidenceType;
  declare fileUrl?: string;
  declare contentHash: string;
  declare submittedBy: string;
  declare submittedAt: Date;
  declare tags: string[];
  declare isVerified: boolean;
  declare verifiedBy?: string;
  declare verifiedAt?: Date;
  declare retentionExpiryDate?: Date;
}

/**
 * Investigation Timeline model
 */
export class InvestigationTimeline extends Model {
  declare id: string;
  declare caseId: string;
  declare activityType: InvestigationActivityType;
  declare description: string;
  declare performedBy: string;
  declare performedAt: Date;
  declare findings?: string;
  declare attachments: string[];
  declare duration?: number; // in minutes
}

/**
 * Investigation Task model
 */
export class InvestigationTask extends Model {
  declare id: string;
  declare caseId: string;
  declare title: string;
  declare description: string;
  declare status: TaskStatus;
  declare assignedTo: string;
  declare createdAt: Date;
  declare dueDate: Date;
  declare completedAt?: Date;
  declare priority: CasePriority;
  declare dependsOn: string[];
  declare progress: number; // 0-100
}

/**
 * Case Notes/Comments model
 */
export class CaseNote extends Model {
  declare id: string;
  declare caseId: string;
  declare content: string;
  declare authorId: string;
  declare authorName: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare isInternal: boolean;
  declare mentions: string[];
  declare attachments: string[];
  declare isEdited: boolean;
  declare editHistory?: Record<string, any>[];
}

/**
 * Decision Workflow model
 */
export class CaseDecision extends Model {
  declare id: string;
  declare caseId: string;
  declare decision: DecisionType;
  declare reasoning: string;
  declare decidedBy: string;
  declare decidedAt: Date;
  declare recommendations?: string;
  declare attachments: string[];
  declare approvedBy?: string;
  declare approvedAt?: Date;
  declare status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

/**
 * Escalation History model
 */
export class CaseEscalation extends Model {
  declare id: string;
  declare caseId: string;
  declare reason: EscalationReason;
  declare escalatedFrom: string;
  declare escalatedTo: string;
  declare escalatedBy: string;
  declare escalatedAt: Date;
  declare justification: string;
  declare targetResolutionDate?: Date;
  declare resolvedAt?: Date;
  declare resolution?: string;
}

/**
 * Case Closure Record model
 */
export class CaseClosure extends Model {
  declare id: string;
  declare caseId: string;
  declare closedBy: string;
  declare closedAt: Date;
  declare resolution: string;
  declare outcome: string;
  declare recommendations?: string;
  declare followUpRequired: boolean;
  declare followUpDate?: Date;
  declare satisfactionScore?: number;
}

/**
 * Audit Trail model
 */
export class CaseAuditTrail extends Model {
  declare id: string;
  declare caseId: string;
  declare action: string;
  declare performedBy: string;
  declare performedAt: Date;
  declare previousValues?: Record<string, any>;
  declare newValues?: Record<string, any>;
  declare ipAddress?: string;
  declare userAgent?: string;
}

/**
 * SLA Tracking model
 */
export class CaseSLA extends Model {
  declare id: string;
  declare caseId: string;
  declare priority: CasePriority;
  declare responseDeadline: Date;
  declare resolutionDeadline: Date;
  declare responseBreached: boolean;
  declare responseBreachedAt?: Date;
  declare resolutionBreached: boolean;
  declare resolutionBreachedAt?: Date;
  declare actualResponseTime?: number; // in hours
  declare actualResolutionTime?: number; // in hours
}

/**
 * Notification model
 */
export class CaseNotification extends Model {
  declare id: string;
  declare caseId: string;
  declare recipientId: string;
  declare type: string;
  declare subject: string;
  declare body: string;
  declare createdAt: Date;
  declare sentAt?: Date;
  declare readAt?: Date;
  declare deliveryStatus: 'PENDING' | 'SENT' | 'FAILED';
  declare retryCount: number;
}

/**
 * Case Template model
 */
export class CaseTemplate extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare caseType: string;
  declare defaultPriority: CasePriority;
  declare taskTemplate: string;
  declare checklistItems: string[];
  declare defaultAssignedDepartment?: string;
  declare createdBy: string;
  declare createdAt: Date;
  declare isActive: boolean;
}

/* ============================================================================
   SERVICE CLASS - 40 ENTERPRISE-GRADE FUNCTIONS
   ============================================================================ */

@Injectable()
export class CaseManagementWorkflowService {
  private readonly SLA_CONFIG: Map<CasePriority, SLAConfiguration> = new Map([
    [CasePriority.CRITICAL, { priority: CasePriority.CRITICAL, responseTimeHours: 2, resolutionTimeHours: 24 }],
    [CasePriority.HIGH, { priority: CasePriority.HIGH, responseTimeHours: 8, resolutionTimeHours: 72 }],
    [CasePriority.MEDIUM, { priority: CasePriority.MEDIUM, responseTimeHours: 24, resolutionTimeHours: 240 }],
    [CasePriority.LOW, { priority: CasePriority.LOW, responseTimeHours: 72, resolutionTimeHours: 480 }],
  ]);

  constructor(
    @InjectModel(FinancialCase) private caseModel: typeof FinancialCase,
    @InjectModel(CaseEvidence) private evidenceModel: typeof CaseEvidence,
    @InjectModel(InvestigationTimeline) private timelineModel: typeof InvestigationTimeline,
    @InjectModel(InvestigationTask) private taskModel: typeof InvestigationTask,
    @InjectModel(CaseNote) private noteModel: typeof CaseNote,
    @InjectModel(CaseDecision) private decisionModel: typeof CaseDecision,
    @InjectModel(CaseEscalation) private escalationModel: typeof CaseEscalation,
    @InjectModel(CaseClosure) private closureModel: typeof CaseClosure,
    @InjectModel(CaseAuditTrail) private auditTrailModel: typeof CaseAuditTrail,
    @InjectModel(CaseSLA) private slaModel: typeof CaseSLA,
    @InjectModel(CaseNotification) private notificationModel: typeof CaseNotification,
    @InjectModel(CaseTemplate) private templateModel: typeof CaseTemplate,
  ) {}

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
  async createCase(
    dto: CreateCaseDTO,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    // Validation
    if (!dto.caseNumber?.trim()) {
      throw new BadRequestException('Case number is required');
    }
    if (!dto.title?.trim()) {
      throw new BadRequestException('Case title is required');
    }

    // Check for duplicate case number
    const existingCase = await this.caseModel.findOne({
      where: { caseNumber: dto.caseNumber },
      transaction,
    });
    if (existingCase) {
      throw new ConflictException(`Case with number ${dto.caseNumber} already exists`);
    }

    // Create case
    const newCase = await this.caseModel.create(
      {
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
      },
      { transaction },
    );

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
  async createCaseFromTemplate(
    templateId: string,
    dto: CreateCaseDTO,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const template = await this.templateModel.findByPk(templateId, { transaction });
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    const caseData: CreateCaseDTO = {
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
  async bulkCreateCases(
    cases: CreateCaseDTO[],
    transaction?: Transaction,
  ): Promise<FinancialCase[]> {
    if (!cases || cases.length === 0) {
      throw new BadRequestException('At least one case is required');
    }

    const createdCases: FinancialCase[] = [];
    for (const caseData of cases) {
      try {
        const newCase = await this.createCase(caseData, transaction);
        createdCases.push(newCase);
      } catch (error) {
        throw new BadRequestException(
          `Failed to create case ${caseData.caseNumber}: ${error.message}`,
        );
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
  async assignCase(
    caseId: string,
    dto: AssignCaseDTO,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const previousAssignee = caseEntity.assignedTo;
    await caseEntity.update(
      {
        assignedTo: dto.assignedTo,
        assignedAt: new Date(),
        status: caseEntity.status === CaseStatus.DRAFT ? CaseStatus.ASSIGNED : caseEntity.status,
      },
      { transaction },
    );

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'CASE_ASSIGNED',
      dto.assignedBy,
      { assignedTo: previousAssignee },
      { assignedTo: dto.assignedTo, assignedAt: new Date() },
      transaction,
    );

    // Create notification
    await this._createNotification(
      caseId,
      dto.assignedTo,
      'CASE_ASSIGNED',
      `Case ${caseEntity.caseNumber} assigned to you`,
      `You have been assigned case ${caseEntity.caseNumber}: ${caseEntity.title}`,
      transaction,
    );

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
  async reassignCase(
    caseId: string,
    newAssignee: string,
    reason: string,
    performedBy: string,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
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
  async getAssignmentHistory(caseId: string): Promise<Array<{
    assignedTo: string;
    assignedAt: Date;
    assignedBy: string;
    reason?: string;
  }>> {
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
  async updateCasePriority(
    caseId: string,
    newPriority: CasePriority,
    reason: string,
    changedBy: string,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const oldPriority = caseEntity.priority;
    await caseEntity.update({ priority: newPriority }, { transaction });

    // Update SLA based on new priority
    const slaConfig = this.SLA_CONFIG.get(newPriority);
    if (slaConfig) {
      const now = moment();
      await this.slaModel.update(
        {
          priority: newPriority,
          responseDeadline: now.clone().add(slaConfig.responseTimeHours, 'hours').toDate(),
          resolutionDeadline: now.clone().add(slaConfig.resolutionTimeHours, 'hours').toDate(),
        },
        { where: { caseId }, transaction },
      );
    }

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'PRIORITY_CHANGED',
      changedBy,
      { priority: oldPriority, reason },
      { priority: newPriority },
      transaction,
    );

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
  async autoPrioritizeCase(caseId: string, riskScore: number): Promise<CasePriority> {
    let newPriority: CasePriority;

    if (riskScore >= 80) {
      newPriority = CasePriority.CRITICAL;
    } else if (riskScore >= 60) {
      newPriority = CasePriority.HIGH;
    } else if (riskScore >= 40) {
      newPriority = CasePriority.MEDIUM;
    } else {
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
  async updateCaseStatus(
    caseId: string,
    newStatus: CaseStatus,
    changedBy: string,
    reason?: string,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const oldStatus = caseEntity.status;

    // Validate state transition
    if (!this._isValidStatusTransition(oldStatus, newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${oldStatus} to ${newStatus}`,
      );
    }

    await caseEntity.update({ status: newStatus }, { transaction });

    // Audit trail
    await this._createAuditTrail(
      caseId,
      'STATUS_CHANGED',
      changedBy,
      { status: oldStatus },
      { status: newStatus },
      transaction,
    );

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
  async getStatusHistory(caseId: string): Promise<Array<{
    status: CaseStatus;
    changedAt: Date;
    changedBy: string;
    reason?: string;
  }>> {
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
  async getCaseStatus(caseId: string): Promise<{
    caseId: string;
    caseNumber: string;
    currentStatus: CaseStatus;
    priority: CasePriority;
    assignedTo?: string;
    lastUpdated: Date;
    progressPercentage: number;
    tasksSummary: { total: number; completed: number; pending: number };
  }> {
    const caseEntity = await this.caseModel.findByPk(caseId);
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
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
  async submitEvidence(
    caseId: string,
    dto: SubmitEvidenceDTO,
    transaction?: Transaction,
  ): Promise<CaseEvidence> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const evidence = await this.evidenceModel.create(
      {
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
      },
      { transaction },
    );

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'EVIDENCE_SUBMITTED',
      dto.submittedBy,
      {},
      { evidenceId: evidence.id, type: dto.type },
      transaction,
    );

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
  async verifyEvidence(
    evidenceId: string,
    verifiedBy: string,
    verificationNotes?: string,
    transaction?: Transaction,
  ): Promise<CaseEvidence> {
    const evidence = await this.evidenceModel.findByPk(evidenceId, { transaction });
    if (!evidence) {
      throw new NotFoundException(`Evidence ${evidenceId} not found`);
    }

    await evidence.update(
      {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date(),
      },
      { transaction },
    );

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
  async getEvidenceList(
    caseId: string,
    filters?: { type?: EvidenceType; verified?: boolean; offset?: number; limit?: number },
  ): Promise<{ evidence: CaseEvidence[]; total: number }> {
    const where: any = { caseId };
    if (filters?.type) where.type = filters.type;
    if (filters?.verified !== undefined) where.isVerified = filters.verified;

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
  async setEvidenceRetention(
    evidenceId: string,
    expiryDate: Date,
    reason: string,
    transaction?: Transaction,
  ): Promise<CaseEvidence> {
    const evidence = await this.evidenceModel.findByPk(evidenceId, { transaction });
    if (!evidence) {
      throw new NotFoundException(`Evidence ${evidenceId} not found`);
    }

    await evidence.update(
      { retentionExpiryDate: expiryDate },
      { transaction },
    );

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
  async addInvestigationActivity(
    caseId: string,
    dto: AddInvestigationActivityDTO,
    transaction?: Transaction,
  ): Promise<InvestigationTimeline> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const activity = await this.timelineModel.create(
      {
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        caseId,
        activityType: dto.activityType,
        description: dto.description,
        performedBy: dto.performedBy,
        performedAt: new Date(),
        findings: dto.findings,
        attachments: dto.attachments || [],
      },
      { transaction },
    );

    // Update case status if needed
    if (caseEntity.status === CaseStatus.ASSIGNED) {
      await caseEntity.update({ status: CaseStatus.INVESTIGATING }, { transaction });
    }

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'INVESTIGATION_ACTIVITY_ADDED',
      dto.performedBy,
      {},
      { activityType: dto.activityType },
      transaction,
    );

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
  async getInvestigationTimeline(caseId: string): Promise<InvestigationTimeline[]> {
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
  async getInvestigationSummary(caseId: string): Promise<{
    caseId: string;
    totalActivities: number;
    activitiesByType: Record<string, number>;
    lastActivity: { performedAt: Date; type: InvestigationActivityType; performedBy: string };
    investigationDuration: number; // in days
    keyFindings: string[];
  }> {
    const activities = await this.timelineModel.findAll({
      where: { caseId },
      order: [['performedAt', 'DESC']],
    });

    const activitiesByType: Record<string, number> = {};
    const keyFindings: string[] = [];

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
  async createInvestigationTask(
    caseId: string,
    dto: CreateInvestigationTaskDTO,
    transaction?: Transaction,
  ): Promise<InvestigationTask> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const task = await this.taskModel.create(
      {
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
      },
      { transaction },
    );

    // Create notification
    await this._createNotification(
      caseId,
      dto.assignedTo,
      'TASK_ASSIGNED',
      `New task: ${dto.title}`,
      `A new investigation task has been assigned to you: ${dto.title}`,
      transaction,
    );

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
  async updateTaskStatus(
    taskId: string,
    newStatus: TaskStatus,
    progress?: number,
    updatedBy?: string,
    transaction?: Transaction,
  ): Promise<InvestigationTask> {
    const task = await this.taskModel.findByPk(taskId, { transaction });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    await task.update(
      {
        status: newStatus,
        progress: progress ?? task.progress,
        completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : null,
      },
      { transaction },
    );

    return task;
  }

  /**
   * Get tasks for case with filtering
   *
   * @param caseId - Case identifier
   * @param filters - Filter options (status, assignedTo, etc.)
   * @returns Filtered task list
   */
  async getTasksForCase(
    caseId: string,
    filters?: { status?: TaskStatus; assignedTo?: string; overdue?: boolean },
  ): Promise<InvestigationTask[]> {
    const where: any = { caseId };
    if (filters?.status) where.status = filters.status;
    if (filters?.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters?.overdue) where.dueDate = { [Op.lt]: new Date() };

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
  async updateTaskDependencies(
    taskIds: string[],
    dependencyMap: Record<string, string[]>,
    transaction?: Transaction,
  ): Promise<InvestigationTask[]> {
    const updatedTasks: InvestigationTask[] = [];

    for (const taskId of taskIds) {
      const task = await this.taskModel.findByPk(taskId, { transaction });
      if (task) {
        await task.update(
          { dependsOn: dependencyMap[taskId] || [] },
          { transaction },
        );
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
  async addCaseNote(
    caseId: string,
    dto: AddCaseNoteDTO,
    transaction?: Transaction,
  ): Promise<CaseNote> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const note = await this.noteModel.create(
      {
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
      },
      { transaction },
    );

    // Create notifications for mentioned users
    if (dto.mentions && dto.mentions.length > 0) {
      for (const mentionedUser of dto.mentions) {
        await this._createNotification(
          caseId,
          mentionedUser,
          'CASE_MENTION',
          `You were mentioned in case ${caseEntity.caseNumber}`,
          `${note.authorName} mentioned you in a case note`,
          transaction,
        );
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
  async getCaseNotes(
    caseId: string,
    filters?: { internalOnly?: boolean; authorId?: string; offset?: number; limit?: number },
  ): Promise<{ notes: CaseNote[]; total: number }> {
    const where: any = { caseId };
    if (filters?.internalOnly) where.isInternal = true;
    if (filters?.authorId) where.authorId = filters.authorId;

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
  async editCaseNote(
    noteId: string,
    newContent: string,
    editedBy: string,
    transaction?: Transaction,
  ): Promise<CaseNote> {
    const note = await this.noteModel.findByPk(noteId, { transaction });
    if (!note) {
      throw new NotFoundException(`Note ${noteId} not found`);
    }

    // Track edit history
    const editHistory = note.editHistory || [];
    editHistory.push({
      previousContent: note.content,
      editedAt: new Date(),
      editedBy,
    });

    await note.update(
      {
        content: newContent,
        updatedAt: new Date(),
        isEdited: true,
        editHistory,
      },
      { transaction },
    );

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
  async submitDecision(
    caseId: string,
    dto: SubmitDecisionDTO,
    transaction?: Transaction,
  ): Promise<CaseDecision> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const decision = await this.decisionModel.create(
      {
        id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        caseId,
        decision: dto.decision,
        reasoning: dto.reasoning,
        decidedBy: dto.decidedBy,
        decidedAt: new Date(),
        recommendations: dto.recommendations,
        attachments: dto.attachments || [],
        status: 'PENDING',
      },
      { transaction },
    );

    // Update case status
    if (dto.decision === DecisionType.APPROVED) {
      await caseEntity.update({ status: CaseStatus.UNDER_REVIEW }, { transaction });
    } else if (dto.decision === DecisionType.NEEDS_ESCALATION) {
      await caseEntity.update({ status: CaseStatus.ESCALATED }, { transaction });
    }

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'DECISION_SUBMITTED',
      dto.decidedBy,
      {},
      { decision: dto.decision },
      transaction,
    );

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
  async approveDecision(
    decisionId: string,
    approved: boolean,
    approvedBy: string,
    comments?: string,
    transaction?: Transaction,
  ): Promise<CaseDecision> {
    const decision = await this.decisionModel.findByPk(decisionId, { transaction });
    if (!decision) {
      throw new NotFoundException(`Decision ${decisionId} not found`);
    }

    await decision.update(
      {
        status: approved ? 'APPROVED' : 'REJECTED',
        approvedBy,
        approvedAt: new Date(),
      },
      { transaction },
    );

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
  async getDecisionHistory(caseId: string): Promise<CaseDecision[]> {
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
  async escalateCase(
    caseId: string,
    dto: EscalateCaseDTO,
    transaction?: Transaction,
  ): Promise<CaseEscalation> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const escalation = await this.escalationModel.create(
      {
        id: `escalation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        caseId,
        reason: dto.reason,
        escalatedFrom: caseEntity.assignedTo,
        escalatedTo: dto.escalatedTo,
        escalatedBy: dto.escalatedBy,
        escalatedAt: new Date(),
        justification: dto.justification,
        targetResolutionDate: dto.targetResolutionDate,
      },
      { transaction },
    );

    // Update case
    await caseEntity.update(
      {
        status: CaseStatus.ESCALATED,
        assignedTo: dto.escalatedTo,
      },
      { transaction },
    );

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'CASE_ESCALATED',
      dto.escalatedBy,
      { assignedTo: caseEntity.assignedTo },
      { assignedTo: dto.escalatedTo, escalationReason: dto.reason },
      transaction,
    );

    // Create notification
    await this._createNotification(
      caseId,
      dto.escalatedTo,
      'CASE_ESCALATED',
      `Case ${caseEntity.caseNumber} escalated to you`,
      `Escalation Reason: ${dto.reason}. Justification: ${dto.justification}`,
      transaction,
    );

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
  async resolveEscalation(
    escalationId: string,
    resolution: string,
    resolvedBy: string,
    transaction?: Transaction,
  ): Promise<CaseEscalation> {
    const escalation = await this.escalationModel.findByPk(escalationId, { transaction });
    if (!escalation) {
      throw new NotFoundException(`Escalation ${escalationId} not found`);
    }

    await escalation.update(
      {
        resolvedAt: new Date(),
        resolution,
      },
      { transaction },
    );

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
  async getEscalationHistory(caseId: string): Promise<CaseEscalation[]> {
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
  async closeCase(
    caseId: string,
    dto: CloseCaseDTO,
    transaction?: Transaction,
  ): Promise<CaseClosure> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const closure = await this.closureModel.create(
      {
        id: `closure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        caseId,
        closedBy: dto.closedBy,
        closedAt: new Date(),
        resolution: dto.resolution,
        outcome: dto.outcome,
        recommendations: dto.recommendations,
        followUpRequired: dto.followUpRequired,
        followUpDate: dto.followUpDate,
      },
      { transaction },
    );

    // Update case
    await caseEntity.update(
      {
        status: CaseStatus.CLOSED,
        closedAt: new Date(),
        closedBy: dto.closedBy,
        resolutionSummary: dto.resolution,
      },
      { transaction },
    );

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'CASE_CLOSED',
      dto.closedBy,
      { status: CaseStatus.ESCALATED },
      { status: CaseStatus.CLOSED },
      transaction,
    );

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
  async archiveCase(
    caseId: string,
    archivedBy: string,
    reason?: string,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const caseEntity = await this.caseModel.findByPk(caseId, { transaction });
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    if (caseEntity.status !== CaseStatus.CLOSED) {
      throw new BadRequestException('Only closed cases can be archived');
    }

    await caseEntity.update(
      {
        status: CaseStatus.ARCHIVED,
        archivedAt: new Date(),
      },
      { transaction },
    );

    // Create audit trail
    await this._createAuditTrail(
      caseId,
      'CASE_ARCHIVED',
      archivedBy,
      {},
      { reason },
      transaction,
    );

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
  async createFollowUpCase(
    caseId: string,
    followUpData: CreateCaseDTO,
    transaction?: Transaction,
  ): Promise<FinancialCase> {
    const originalCase = await this.caseModel.findByPk(caseId, { transaction });
    if (!originalCase) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    // Create new case with reference to original
    const followUpCase = await this.createCase(
      {
        ...followUpData,
        tags: [...(followUpData.tags || []), `follow-up-of-${originalCase.caseNumber}`],
      },
      transaction,
    );

    // Link cases in audit trail
    await this._createAuditTrail(
      followUpCase.id,
      'FOLLOW_UP_CASE_CREATED',
      followUpData.createdBy,
      {},
      { originalCaseId: caseId },
      transaction,
    );

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
  async calculateCaseMetrics(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    department?: string;
    caseType?: string;
  }): Promise<CaseMetrics> {
    const where: any = {};
    if (filters?.dateFrom) where.createdAt = { [Op.gte]: filters.dateFrom };
    if (filters?.dateTo) where.updatedAt = { [Op.lte]: filters.dateTo };
    if (filters?.department) where.department = filters.department;

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
    const priorityDistribution: Record<string, number> = {};
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
  async generateCaseReport(caseId: string): Promise<{
    caseInfo: any;
    timeline: any;
    evidence: any;
    decisions: any;
    escalations: any;
    notes: any;
    metrics: any;
  }> {
    const caseEntity = await this.caseModel.findByPk(caseId);
    if (!caseEntity) {
      throw new NotFoundException(`Case ${caseId} not found`);
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
  async searchCases(criteria: CaseSearchCriteria): Promise<{
    cases: FinancialCase[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const where: any = {};

    if (criteria.caseNumber) {
      where.caseNumber = { [Op.iLike]: `%${criteria.caseNumber}%` };
    }
    if (criteria.status && criteria.status.length > 0) {
      where.status = { [Op.in]: criteria.status };
    }
    if (criteria.priority && criteria.priority.length > 0) {
      where.priority = { [Op.in]: criteria.priority };
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
      if (criteria.dateFrom) where.createdAt[Op.gte] = criteria.dateFrom;
      if (criteria.dateTo) where.createdAt[Op.lte] = criteria.dateTo;
    }

    // Full-text search on title and description if searchTerm provided
    if (criteria.searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${criteria.searchTerm}%` } },
        { description: { [Op.iLike]: `%${criteria.searchTerm}%` } },
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
  async applySavedFilter(filterName: string, page?: number, limit?: number): Promise<{
    cases: FinancialCase[];
    total: number;
  }> {
    // This would typically load filter definitions from a configuration or database
    // For now, we'll return based on common filter names
    const filterMap: Record<string, CaseSearchCriteria> = {
      'my-active-cases': { status: [CaseStatus.ASSIGNED, CaseStatus.INVESTIGATING] },
      'high-priority': { priority: [CasePriority.CRITICAL, CasePriority.HIGH] },
      'pending-closure': { status: [CaseStatus.UNDER_REVIEW, CaseStatus.DECISION_PENDING] },
      'escalated': { status: [CaseStatus.ESCALATED] },
    };

    const criteria = filterMap[filterName];
    if (!criteria) {
      throw new NotFoundException(`Filter ${filterName} not found`);
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
  async getArchivedCases(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    department?: string;
    page?: number;
    limit?: number;
  }): Promise<{ cases: FinancialCase[]; total: number }> {
    const where: any = { status: CaseStatus.ARCHIVED };
    if (filters?.dateFrom) where.archivedAt = { [Op.gte]: filters.dateFrom };
    if (filters?.dateTo) where.archivedAt = { [Op.lte]: filters.dateTo };
    if (filters?.department) where.department = filters.department;

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
  async getAuditTrail(
    caseId: string,
    filters?: {
      action?: string;
      performedBy?: string;
      dateFrom?: Date;
      dateTo?: Date;
      offset?: number;
      limit?: number;
    },
  ): Promise<{ entries: CaseAuditTrail[]; total: number }> {
    const where: any = { caseId };
    if (filters?.action) where.action = filters.action;
    if (filters?.performedBy) where.performedBy = filters.performedBy;
    if (filters?.dateFrom || filters?.dateTo) {
      where.performedAt = {};
      if (filters?.dateFrom) where.performedAt[Op.gte] = filters.dateFrom;
      if (filters?.dateTo) where.performedAt[Op.lte] = filters.dateTo;
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
  private async _initializeSLA(
    caseId: string,
    priority: CasePriority,
    transaction?: Transaction,
  ): Promise<void> {
    const slaConfig = this.SLA_CONFIG.get(priority);
    if (!slaConfig) return;

    const now = moment();
    await this.slaModel.create(
      {
        id: `sla-${Date.now()}`,
        caseId,
        priority,
        responseDeadline: now.clone().add(slaConfig.responseTimeHours, 'hours').toDate(),
        resolutionDeadline: now.clone().add(slaConfig.resolutionTimeHours, 'hours').toDate(),
        responseBreached: false,
        resolutionBreached: false,
      },
      { transaction },
    );
  }

  /**
   * Create audit trail entry
   */
  private async _createAuditTrail(
    caseId: string,
    action: string,
    performedBy: string,
    previousValues: any,
    newValues: any,
    transaction?: Transaction,
  ): Promise<void> {
    await this.auditTrailModel.create(
      {
        id: `audit-${Date.now()}`,
        caseId,
        action,
        performedBy,
        performedAt: new Date(),
        previousValues,
        newValues,
      },
      { transaction },
    );
  }

  /**
   * Create notification
   */
  private async _createNotification(
    caseId: string,
    recipientId: string,
    type: string,
    subject: string,
    body: string,
    transaction?: Transaction,
  ): Promise<void> {
    await this.notificationModel.create(
      {
        id: `notif-${Date.now()}`,
        caseId,
        recipientId,
        type,
        subject,
        body,
        createdAt: new Date(),
        deliveryStatus: 'PENDING',
        retryCount: 0,
      },
      { transaction },
    );
  }

  /**
   * Validate case status transition
   */
  private _isValidStatusTransition(from: CaseStatus, to: CaseStatus): boolean {
    const validTransitions: Record<CaseStatus, CaseStatus[]> = {
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
}

/* ============================================================================
   EXPORTS
   ============================================================================ */

export const CASE_MANAGEMENT_EXPORTS = {
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
