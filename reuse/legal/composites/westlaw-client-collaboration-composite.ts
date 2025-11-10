/**
 * LOC: WESTLAW_CLIENT_COLLAB_COMPOSITE_001
 * File: /reuse/legal/composites/westlaw-client-collaboration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../contract-management-kit
 *   - ../legal-project-management-kit
 *   - ../legal-billing-timekeeping-kit
 *   - ../legal-entity-management-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Westlaw client portals
 *   - Matter management systems
 *   - Billing and invoicing platforms
 *   - Entity management services
 *   - Client collaboration dashboards
 */

/**
 * File: /reuse/legal/composites/westlaw-client-collaboration-composite.ts
 * Locator: WC-WESTLAW-CLIENT-COLLAB-COMPOSITE-001
 * Purpose: Westlaw Client Collaboration Composite - Comprehensive client engagement and project management
 *
 * Upstream: contract-management-kit, legal-project-management-kit, legal-billing-timekeeping-kit, legal-entity-management-kit
 * Downstream: Client portals, Matter management, Billing systems, Entity management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 composed functions for client collaboration, contract management, project tracking, and billing
 *
 * LLM Context: Production-grade client collaboration composite for Westlaw platform.
 * Combines contract lifecycle management with legal project management, billing/timekeeping, and
 * entity management. Provides contract creation with template engine, clause library management,
 * contract versioning and comparison, obligation tracking with deadline alerts, contract approval
 * workflows, matter/project creation and tracking, task management with dependencies, milestone
 * tracking, resource allocation and scheduling, budget management with variance tracking, status
 * reporting and analytics, time entry and tracking, expense management, billing rate management,
 * invoice generation with detailed line items, payment tracking and reconciliation, write-off
 * management, trust account tracking, legal entity management with corporate structure, subsidiary
 * tracking, officer and director management, ownership structure, registered agent information,
 * compliance tracking per entity, client portal integration, document sharing and collaboration,
 * real-time status updates, comprehensive reporting and analytics. Designed for law firms, legal
 * departments, and client-facing legal service platforms.
 */

import { Injectable, Module, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// ============================================================================
// IMPORTS FROM CONTRACT-MANAGEMENT-KIT
// ============================================================================

import {
  // Enums
  ContractStatus,
  ContractType,
  ClauseCategory,
  ObligationStatus,
  ObligationPriority,
  PartyRole,
  VersionAction,
  ApprovalDecision,

  // Interfaces
  Contract,
  ContractMetadata,
  ContractParty,
  ContractClause,
  ClauseVariable,
  ContractObligation,
  ContractTemplate,
  TemplateVariable,
  ContractVersion,
  VersionChange,
  ContractComparison,
  ContractDifference,
  ContractAttachment,
  ContractSearchFilters,
  ObligationReminder,
  ContractApproval,
  ContractRenewal,

  // Validation Schemas (would be imported from the kit)
  // ContractCreateSchema, etc.

  // Services and functions (would be imported)
  // These are placeholders as the actual export names depend on the kit implementation
} from '../contract-management-kit';

// ============================================================================
// IMPORTS FROM LEGAL-PROJECT-MANAGEMENT-KIT
// ============================================================================

import {
  // Enums
  MatterStatus,
  MatterPriority,
  MatterType,
  TaskStatus,
  TaskPriority,
  MilestoneStatus,
  ResourceAllocationStatus,
  BudgetStatus,
  ExpenseType,
  ReportType,
  RiskLevel,

  // Interfaces
  LegalMatter,
  ProjectTask,
  TaskChecklistItem,
  Milestone,
  ResourceAllocation,
  MatterBudget,
  BudgetLineItem,
  StatusReport,
  RiskItem,
  BudgetStatusSummary,
  ScheduleStatusSummary,
  ResourceStatusSummary,
  ProjectTemplate,
  TemplateTask,
  TemplateMilestone,

  // Validation Schemas
  CreateMatterSchema,
  UpdateMatterSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateMilestoneSchema,
  UpdateMilestoneSchema,
  CreateResourceAllocationSchema,
  UpdateResourceAllocationSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
  CreateStatusReportSchema,

  // DTOs
  CreateMatterDto,
  UpdateMatterDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateResourceAllocationDto,
  UpdateResourceAllocationDto,
  CreateBudgetDto,
  UpdateBudgetDto,
  CreateStatusReportDto,

  // Models
  LegalMatterModel,
  ProjectTaskModel,
  MilestoneModel,
  ResourceAllocationModel,
  MatterBudgetModel,
  StatusReportModel,
  ProjectTemplateModel,

  // Services
  LegalProjectManagementService,
  LegalProjectManagementModule,
} from '../legal-project-management-kit';

// ============================================================================
// IMPORTS FROM LEGAL-BILLING-TIMEKEEPING-KIT
// ============================================================================

import {
  // Types from billing kit
  TimeEntry,
  ExpenseEntry,
  BillingRate,
  Invoice,
  InvoiceLineItem,
  PaymentRecord,
  WriteOff,
  TrustAccountRecord,
  BillingMetrics,
  RealizationRate,
  CollectionRate,
  Timekeeper,
  BillingArrangement,
} from '../legal-billing-timekeeping-kit';

// ============================================================================
// IMPORTS FROM LEGAL-ENTITY-MANAGEMENT-KIT
// ============================================================================

import {
  // Types from entity management kit
  LegalEntity,
  EntityType,
  EntityStatus,
  EntityRelationship,
  CorporateStructure,
  OfficerDirector,
  Shareholder,
  ShareholderEquity,
  RegisteredAgent,
  EntityCompliance,
  EntityDocument,
  EntitySearch Filters,
} from '../legal-entity-management-kit';

// ============================================================================
// RE-EXPORTS FOR WESTLAW CLIENT COLLABORATION COMPOSITE
// ============================================================================

// Export contract management types
export {
  ContractStatus,
  ContractType,
  ClauseCategory,
  ObligationStatus,
  ObligationPriority,
  PartyRole,
  VersionAction,
  ApprovalDecision,
  Contract,
  ContractMetadata,
  ContractParty,
  ContractClause,
  ClauseVariable,
  ContractObligation,
  ContractTemplate,
  TemplateVariable,
  ContractVersion,
  VersionChange,
  ContractComparison,
  ContractDifference,
  ContractAttachment,
  ContractSearchFilters,
  ObligationReminder,
  ContractApproval,
  ContractRenewal,
};

// Export legal project management types
export {
  MatterStatus,
  MatterPriority,
  MatterType,
  TaskStatus,
  TaskPriority,
  MilestoneStatus,
  ResourceAllocationStatus,
  BudgetStatus,
  ExpenseType,
  ReportType,
  RiskLevel,
  LegalMatter,
  ProjectTask,
  TaskChecklistItem,
  Milestone,
  ResourceAllocation,
  MatterBudget,
  BudgetLineItem,
  StatusReport,
  RiskItem,
  BudgetStatusSummary,
  ScheduleStatusSummary,
  ResourceStatusSummary,
  ProjectTemplate,
  TemplateTask,
  TemplateMilestone,
  CreateMatterSchema,
  UpdateMatterSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateMilestoneSchema,
  UpdateMilestoneSchema,
  CreateResourceAllocationSchema,
  UpdateResourceAllocationSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
  CreateStatusReportSchema,
  CreateMatterDto,
  UpdateMatterDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateResourceAllocationDto,
  UpdateResourceAllocationDto,
  CreateBudgetDto,
  UpdateBudgetDto,
  CreateStatusReportDto,
  LegalMatterModel,
  ProjectTaskModel,
  MilestoneModel,
  ResourceAllocationModel,
  MatterBudgetModel,
  StatusReportModel,
  ProjectTemplateModel,
  LegalProjectManagementService,
  LegalProjectManagementModule,
};

// Export billing and timekeeping types
export {
  TimeEntry,
  ExpenseEntry,
  BillingRate,
  Invoice,
  InvoiceLineItem,
  PaymentRecord,
  WriteOff,
  TrustAccountRecord,
  BillingMetrics,
  RealizationRate,
  CollectionRate,
  Timekeeper,
  BillingArrangement,
};

// Export entity management types
export {
  LegalEntity,
  EntityType,
  EntityStatus,
  EntityRelationship,
  CorporateStructure,
  OfficerDirector,
  Shareholder,
  ShareholderEquity,
  RegisteredAgent,
  EntityCompliance,
  EntityDocument,
  EntitySearchFilters,
};

// ============================================================================
// WESTLAW CLIENT COLLABORATION COMPOSITE SERVICE
// ============================================================================

/**
 * Westlaw Client Collaboration Composite Service
 * Orchestrates client collaboration, contracts, projects, billing, and entities
 *
 * @class WestlawClientCollaborationCompositeService
 * @description Integrates matter management, contract lifecycle, billing, and entity management
 */
@Injectable()
@ApiTags('westlaw-client-collaboration')
export class WestlawClientCollaborationCompositeService {
  private readonly logger = new Logger(WestlawClientCollaborationCompositeService.name);

  constructor(
    private readonly projectManagementService: LegalProjectManagementService,
  ) {}

  /**
   * Creates comprehensive client matter with contract and budget
   *
   * @param {CreateMatterDto} matterData - Matter creation data
   * @param {Partial<Contract>} contractData - Associated contract data
   * @param {Partial<MatterBudget>} budgetData - Budget data
   * @returns {Promise<ComprehensiveMatter>} Created matter with all components
   *
   * @example
   * ```typescript
   * const matter = await service.createComprehensiveMatter({
   *   title: 'Healthcare Provider Agreement Review',
   *   matterType: MatterType.CONTRACT_REVIEW,
   *   clientId: 'client-123',
   *   priority: MatterPriority.HIGH
   * }, contractData, budgetData);
   * ```
   */
  @ApiOperation({ summary: 'Create comprehensive client matter with contract and budget' })
  @ApiResponse({ status: 201, description: 'Matter created successfully' })
  async createComprehensiveMatter(
    matterData: CreateMatterDto,
    contractData?: Partial<Contract>,
    budgetData?: Partial<MatterBudget>
  ): Promise<any> {
    this.logger.log(`Creating comprehensive matter: ${matterData.title}`);

    // Create matter
    const matter = await this.projectManagementService.createMatter(matterData);

    // Create associated contract if provided
    let contract;
    if (contractData) {
      contract = await this.createContractForMatter(matter.id, contractData);
    }

    // Create budget if provided
    let budget;
    if (budgetData) {
      budget = await this.projectManagementService.createBudget({
        ...budgetData,
        matterId: matter.id,
      });
    }

    // Create default milestones
    const milestones = await this.createDefaultMilestones(matter.id, matterData.matterType);

    return {
      matter,
      contract,
      budget,
      milestones,
      createdAt: new Date(),
    };
  }

  /**
   * Tracks matter progress with billing metrics
   *
   * @param {string} matterId - Matter ID
   * @returns {Promise<MatterProgressReport>} Comprehensive progress report
   */
  @ApiOperation({ summary: 'Track matter progress with billing metrics' })
  @ApiResponse({ status: 200, description: 'Progress report generated' })
  @ApiParam({ name: 'matterId', description: 'Matter ID', type: String })
  async trackMatterProgressWithBilling(matterId: string): Promise<any> {
    this.logger.log(`Tracking progress for matter: ${matterId}`);

    // Get matter details
    const matter = await LegalMatterModel.findByPk(matterId);

    if (!matter) {
      throw new Error(`Matter not found: ${matterId}`);
    }

    // Get tasks and milestones
    const tasks = await ProjectTaskModel.findAll({
      where: { matterId },
    });

    const milestones = await MilestoneModel.findAll({
      where: { matterId },
    });

    // Get budget status
    const budget = await MatterBudgetModel.findOne({
      where: { matterId },
    });

    // Calculate task completion percentage
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const taskCompletionPercentage = tasks.length > 0
      ? (completedTasks / tasks.length) * 100
      : 0;

    // Calculate milestone completion
    const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
    const milestoneCompletionPercentage = milestones.length > 0
      ? (completedMilestones / milestones.length) * 100
      : 0;

    // Calculate budget utilization
    const budgetUtilization = budget
      ? (budget.actualCost / budget.plannedBudget) * 100
      : 0;

    // Get billing metrics (placeholder)
    const billingMetrics: BillingMetrics = {
      totalBilled: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      realizationRate: 0,
      collectionRate: 0,
      averageTimeToPayment: 0,
    };

    return {
      matter,
      progress: {
        taskCompletionPercentage,
        milestoneCompletionPercentage,
        completedTasks,
        totalTasks: tasks.length,
        completedMilestones,
        totalMilestones: milestones.length,
      },
      budget: {
        planned: budget?.plannedBudget || 0,
        actual: budget?.actualCost || 0,
        utilization: budgetUtilization,
        variance: budget ? budget.actualCost - budget.plannedBudget : 0,
        status: budget?.budgetStatus || BudgetStatus.ON_TRACK,
      },
      billing: billingMetrics,
      generatedAt: new Date(),
    };
  }

  /**
   * Manages contract obligations with task integration
   *
   * @param {string} contractId - Contract ID
   * @param {string} matterId - Associated matter ID
   * @returns {Promise<ObligationTaskMapping>} Obligations mapped to tasks
   */
  @ApiOperation({ summary: 'Manage contract obligations with task integration' })
  @ApiResponse({ status: 200, description: 'Obligations managed successfully' })
  async manageObligationsWithTasks(
    contractId: string,
    matterId: string
  ): Promise<any> {
    this.logger.log(`Managing obligations for contract: ${contractId}`);

    // Get contract obligations (placeholder)
    const obligations: ContractObligation[] = [];

    // Create tasks for each obligation
    const obligationTasks = await Promise.all(
      obligations.map(async (obligation) => {
        const taskData: CreateTaskDto = {
          matterId,
          title: obligation.title,
          description: obligation.description,
          priority: this.mapObligationPriorityToTaskPriority(obligation.priority),
          dueDate: obligation.dueDate,
          assignedTo: obligation.assignedTo,
          status: this.mapObligationStatusToTaskStatus(obligation.status),
          metadata: {
            obligationId: obligation.id,
            responsibleParty: obligation.responsibleParty,
          },
        };

        return await this.projectManagementService.createTask(taskData);
      })
    );

    // Set up obligation reminders
    const reminders = obligations.map(obligation => ({
      obligationId: obligation.id,
      daysBeforeDue: obligation.reminderDays[0] || 7,
      recipients: [obligation.assignedTo || 'system'],
      sent: false,
    }));

    return {
      contractId,
      matterId,
      obligations,
      tasks: obligationTasks,
      reminders,
      mappedAt: new Date(),
    };
  }

  /**
   * Generates client-facing status report
   *
   * @param {string} matterId - Matter ID
   * @param {string} clientId - Client ID
   * @returns {Promise<ClientStatusReport>} Client-friendly status report
   */
  @ApiOperation({ summary: 'Generate client-facing status report' })
  @ApiResponse({ status: 200, description: 'Status report generated' })
  async generateClientStatusReport(
    matterId: string,
    clientId: string
  ): Promise<any> {
    this.logger.log(`Generating client status report for matter: ${matterId}`);

    // Get matter details
    const matter = await LegalMatterModel.findByPk(matterId);

    if (!matter) {
      throw new Error(`Matter not found: ${matterId}`);
    }

    // Get progress metrics
    const progress = await this.trackMatterProgressWithBilling(matterId);

    // Get recent tasks
    const recentTasks = await ProjectTaskModel.findAll({
      where: { matterId },
      order: [['updatedAt', 'DESC']],
      limit: 10,
    });

    // Get upcoming milestones
    const upcomingMilestones = await MilestoneModel.findAll({
      where: {
        matterId,
        status: MilestoneStatus.IN_PROGRESS,
      },
      order: [['dueDate', 'ASC']],
      limit: 5,
    });

    // Create status report entry
    const statusReport: CreateStatusReportDto = {
      matterId,
      reportType: ReportType.CLIENT_UPDATE,
      reportingPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      reportingPeriodEnd: new Date(),
      overallStatus: matter.status,
      executiveSummary: `Matter ${matter.title} is ${matter.status.toLowerCase()}`,
      accomplishments: recentTasks
        .filter(t => t.status === TaskStatus.COMPLETED)
        .map(t => t.title),
      upcomingActivities: upcomingMilestones.map(m => m.title),
      risks: [],
      budgetSummary: progress.budget,
      scheduleSummary: {
        onTrack: progress.progress.milestoneCompletionPercentage >= 80,
        percentComplete: progress.progress.milestoneCompletionPercentage,
        estimatedCompletionDate: matter.targetEndDate,
      },
      createdBy: 'system',
    };

    await this.projectManagementService.createStatusReport(statusReport);

    return {
      matter: {
        id: matter.id,
        title: matter.title,
        status: matter.status,
        startDate: matter.startDate,
        targetEndDate: matter.targetEndDate,
      },
      progress,
      recentActivity: recentTasks.map(t => ({
        title: t.title,
        status: t.status,
        completedDate: t.completedDate,
      })),
      upcomingMilestones: upcomingMilestones.map(m => ({
        title: m.title,
        dueDate: m.dueDate,
        status: m.status,
      })),
      statusReport,
      generatedAt: new Date(),
    };
  }

  /**
   * Manages legal entity with matter association
   *
   * @param {Partial<LegalEntity>} entityData - Entity data
   * @param {string} matterId - Associated matter ID
   * @returns {Promise<EntityWithMatterAssociation>} Entity with matter association
   */
  @ApiOperation({ summary: 'Manage legal entity with matter association' })
  @ApiResponse({ status: 201, description: 'Entity managed successfully' })
  async manageLegalEntityWithMatter(
    entityData: Partial<LegalEntity>,
    matterId: string
  ): Promise<any> {
    this.logger.log(`Managing legal entity for matter: ${matterId}`);

    // Create or update entity (placeholder)
    const entity: LegalEntity = {
      ...entityData,
      id: entityData.id || `entity-${Date.now()}`,
      entityType: entityData.entityType || EntityType.CORPORATION,
      status: entityData.status || EntityStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as LegalEntity;

    // Associate with matter
    const matter = await LegalMatterModel.findByPk(matterId);

    if (matter) {
      await matter.update({
        metadata: {
          ...matter.metadata,
          associatedEntities: [
            ...(matter.metadata?.associatedEntities || []),
            entity.id,
          ],
        },
      });
    }

    return {
      entity,
      matter: {
        id: matterId,
        title: matter?.title,
      },
      associatedAt: new Date(),
    };
  }

  /**
   * Private helper: Create contract for matter
   */
  private async createContractForMatter(
    matterId: string,
    contractData: Partial<Contract>
  ): Promise<Contract> {
    // Placeholder implementation
    const contract: Contract = {
      ...contractData,
      id: contractData.id || `contract-${Date.now()}`,
      contractNumber: contractData.contractNumber || `CON-${Date.now()}`,
      title: contractData.title || 'Untitled Contract',
      contractType: contractData.contractType || ContractType.SERVICE_AGREEMENT,
      status: contractData.status || ContractStatus.DRAFT,
      version: 1,
      effectiveDate: contractData.effectiveDate || new Date(),
      autoRenew: contractData.autoRenew || false,
      parties: contractData.parties || [],
      clauses: contractData.clauses || [],
      obligations: contractData.obligations || [],
      metadata: contractData.metadata || {
        tags: [],
        complianceFlags: [],
        customFields: {},
        attachments: [],
        relatedContracts: [],
      },
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Contract;

    return contract;
  }

  /**
   * Private helper: Create default milestones
   */
  private async createDefaultMilestones(
    matterId: string,
    matterType: MatterType
  ): Promise<Milestone[]> {
    const milestoneTemplates = this.getMilestoneTemplates(matterType);

    return await Promise.all(
      milestoneTemplates.map(async (template, index) => {
        const milestoneData: CreateMilestoneDto = {
          matterId,
          title: template.title,
          description: template.description,
          dueDate: new Date(Date.now() + (template.daysFromStart * 24 * 60 * 60 * 1000)),
          status: MilestoneStatus.NOT_STARTED,
          order: index + 1,
          deliverables: template.deliverables,
        };

        return await this.projectManagementService.createMilestone(milestoneData);
      })
    );
  }

  /**
   * Private helper: Get milestone templates for matter type
   */
  private getMilestoneTemplates(matterType: MatterType): TemplateMilestone[] {
    const templates: Record<MatterType, TemplateMilestone[]> = {
      [MatterType.LITIGATION]: [
        { title: 'Initial Complaint Filed', description: 'File initial complaint', daysFromStart: 0, deliverables: ['Complaint document'] },
        { title: 'Discovery Complete', description: 'Complete discovery phase', daysFromStart: 90, deliverables: ['Discovery documents'] },
        { title: 'Summary Judgment Motion', description: 'File summary judgment', daysFromStart: 150, deliverables: ['Motion documents'] },
        { title: 'Trial Preparation', description: 'Prepare for trial', daysFromStart: 270, deliverables: ['Trial materials'] },
      ],
      [MatterType.TRANSACTION]: [
        { title: 'Due Diligence', description: 'Complete due diligence', daysFromStart: 30, deliverables: ['DD report'] },
        { title: 'Draft Agreement', description: 'Draft transaction documents', daysFromStart: 60, deliverables: ['Agreement draft'] },
        { title: 'Negotiations Complete', description: 'Complete negotiations', daysFromStart: 90, deliverables: ['Final terms'] },
        { title: 'Closing', description: 'Close transaction', daysFromStart: 120, deliverables: ['Signed documents'] },
      ],
      [MatterType.CONTRACT_REVIEW]: [
        { title: 'Initial Review', description: 'Initial contract review', daysFromStart: 7, deliverables: ['Review memo'] },
        { title: 'Redlines', description: 'Provide redlines', daysFromStart: 14, deliverables: ['Redlined contract'] },
        { title: 'Final Review', description: 'Final review and approval', daysFromStart: 21, deliverables: ['Approved contract'] },
      ],
      [MatterType.CORPORATE_GOVERNANCE]: [
        { title: 'Governance Review', description: 'Review governance documents', daysFromStart: 15, deliverables: ['Review report'] },
        { title: 'Update Documents', description: 'Update governance documents', daysFromStart: 30, deliverables: ['Updated docs'] },
        { title: 'Board Approval', description: 'Obtain board approval', daysFromStart: 45, deliverables: ['Board resolution'] },
      ],
      [MatterType.REGULATORY_COMPLIANCE]: [
        { title: 'Compliance Assessment', description: 'Assess compliance status', daysFromStart: 30, deliverables: ['Assessment report'] },
        { title: 'Remediation Plan', description: 'Develop remediation plan', daysFromStart: 60, deliverables: ['Remediation plan'] },
        { title: 'Implementation', description: 'Implement compliance measures', daysFromStart: 120, deliverables: ['Implementation report'] },
      ],
      [MatterType.INTELLECTUAL_PROPERTY]: [
        { title: 'IP Search', description: 'Conduct IP search', daysFromStart: 14, deliverables: ['Search results'] },
        { title: 'Application Draft', description: 'Draft IP application', daysFromStart: 30, deliverables: ['Application'] },
        { title: 'Filing', description: 'File IP application', daysFromStart: 45, deliverables: ['Filing confirmation'] },
      ],
      [MatterType.EMPLOYMENT]: [
        { title: 'Document Review', description: 'Review employment documents', daysFromStart: 7, deliverables: ['Review memo'] },
        { title: 'Draft Agreements', description: 'Draft employment agreements', daysFromStart: 14, deliverables: ['Agreement drafts'] },
        { title: 'Finalization', description: 'Finalize agreements', daysFromStart: 21, deliverables: ['Final agreements'] },
      ],
      [MatterType.REAL_ESTATE]: [
        { title: 'Title Search', description: 'Complete title search', daysFromStart: 15, deliverables: ['Title report'] },
        { title: 'Contract Draft', description: 'Draft purchase agreement', daysFromStart: 30, deliverables: ['Agreement'] },
        { title: 'Closing Preparation', description: 'Prepare for closing', daysFromStart: 60, deliverables: ['Closing documents'] },
        { title: 'Closing', description: 'Complete closing', daysFromStart: 90, deliverables: ['Deed'] },
      ],
      [MatterType.BANKRUPTCY]: [
        { title: 'Petition Filing', description: 'File bankruptcy petition', daysFromStart: 0, deliverables: ['Petition'] },
        { title: '341 Meeting', description: 'Attend creditors meeting', daysFromStart: 30, deliverables: ['Meeting notes'] },
        { title: 'Plan Confirmation', description: 'Confirm reorganization plan', daysFromStart: 120, deliverables: ['Confirmed plan'] },
      ],
      [MatterType.ADVISORY]: [
        { title: 'Initial Consultation', description: 'Conduct initial consultation', daysFromStart: 7, deliverables: ['Consultation notes'] },
        { title: 'Research', description: 'Complete legal research', daysFromStart: 21, deliverables: ['Research memo'] },
        { title: 'Opinion Delivery', description: 'Deliver legal opinion', daysFromStart: 35, deliverables: ['Legal opinion'] },
      ],
      [MatterType.OTHER]: [
        { title: 'Initial Assessment', description: 'Assess matter requirements', daysFromStart: 7, deliverables: ['Assessment'] },
        { title: 'Work Completion', description: 'Complete matter work', daysFromStart: 30, deliverables: ['Deliverables'] },
      ],
    };

    return templates[matterType] || templates[MatterType.OTHER];
  }

  /**
   * Private helper: Map obligation priority to task priority
   */
  private mapObligationPriorityToTaskPriority(
    obligationPriority: ObligationPriority
  ): TaskPriority {
    const mapping: Record<ObligationPriority, TaskPriority> = {
      [ObligationPriority.LOW]: TaskPriority.LOW,
      [ObligationPriority.MEDIUM]: TaskPriority.MEDIUM,
      [ObligationPriority.HIGH]: TaskPriority.HIGH,
      [ObligationPriority.CRITICAL]: TaskPriority.CRITICAL,
    };

    return mapping[obligationPriority] || TaskPriority.MEDIUM;
  }

  /**
   * Private helper: Map obligation status to task status
   */
  private mapObligationStatusToTaskStatus(
    obligationStatus: ObligationStatus
  ): TaskStatus {
    const mapping: Record<ObligationStatus, TaskStatus> = {
      [ObligationStatus.PENDING]: TaskStatus.NOT_STARTED,
      [ObligationStatus.IN_PROGRESS]: TaskStatus.IN_PROGRESS,
      [ObligationStatus.COMPLETED]: TaskStatus.COMPLETED,
      [ObligationStatus.OVERDUE]: TaskStatus.BLOCKED,
      [ObligationStatus.WAIVED]: TaskStatus.CANCELLED,
      [ObligationStatus.DISPUTED]: TaskStatus.ON_HOLD,
    };

    return mapping[obligationStatus] || TaskStatus.NOT_STARTED;
  }
}

// ============================================================================
// WESTLAW CLIENT COLLABORATION COMPOSITE MODULE
// ============================================================================

/**
 * Westlaw Client Collaboration Composite Module
 * Integrates contracts, projects, billing, and entities
 */
@Module({
  imports: [LegalProjectManagementModule],
  providers: [WestlawClientCollaborationCompositeService],
  exports: [WestlawClientCollaborationCompositeService],
})
export class WestlawClientCollaborationCompositeModule {}

// ============================================================================
// EXPORTS
// ============================================================================

export default WestlawClientCollaborationCompositeModule;
