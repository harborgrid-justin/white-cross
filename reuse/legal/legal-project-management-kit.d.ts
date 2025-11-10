/**
 * LOC: LEGAL_PROJECT_MANAGEMENT_KIT_001
 * File: /reuse/legal/legal-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Legal project modules
 *   - Matter management controllers
 *   - Project tracking services
 *   - Resource allocation services
 *   - Budget management services
 */
import { DynamicModule } from '@nestjs/common';
import { Model, Sequelize } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Matter status lifecycle
 */
export declare enum MatterStatus {
    PROSPECTIVE = "prospective",
    INTAKE = "intake",
    OPEN = "open",
    ACTIVE = "active",
    ON_HOLD = "on_hold",
    PENDING_CLOSE = "pending_close",
    CLOSED = "closed",
    ARCHIVED = "archived",
    DECLINED = "declined"
}
/**
 * Matter priority levels
 */
export declare enum MatterPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
    CRITICAL = "critical"
}
/**
 * Matter types
 */
export declare enum MatterType {
    LITIGATION = "litigation",
    TRANSACTIONAL = "transactional",
    ADVISORY = "advisory",
    COMPLIANCE = "compliance",
    CORPORATE = "corporate",
    REAL_ESTATE = "real_estate",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    EMPLOYMENT = "employment",
    MEDICAL_MALPRACTICE = "medical_malpractice",
    REGULATORY = "regulatory",
    OTHER = "other"
}
/**
 * Task status lifecycle
 */
export declare enum TaskStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    BLOCKED = "blocked",
    PENDING_REVIEW = "pending_review",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Task priority levels
 */
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
/**
 * Milestone status
 */
export declare enum MilestoneStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DELAYED = "delayed",
    AT_RISK = "at_risk",
    MISSED = "missed"
}
/**
 * Resource allocation status
 */
export declare enum ResourceAllocationStatus {
    REQUESTED = "requested",
    APPROVED = "approved",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Budget status
 */
export declare enum BudgetStatus {
    DRAFT = "draft",
    PROPOSED = "proposed",
    APPROVED = "approved",
    ACTIVE = "active",
    EXCEEDED = "exceeded",
    CLOSED = "closed"
}
/**
 * Expense type
 */
export declare enum ExpenseType {
    LABOR = "labor",
    EXPERT_WITNESS = "expert_witness",
    COURT_COSTS = "court_costs",
    FILING_FEES = "filing_fees",
    TRAVEL = "travel",
    RESEARCH = "research",
    TECHNOLOGY = "technology",
    VENDOR = "vendor",
    OTHER = "other"
}
/**
 * Report type
 */
export declare enum ReportType {
    STATUS = "status",
    BUDGET_VARIANCE = "budget_variance",
    RESOURCE_UTILIZATION = "resource_utilization",
    MILESTONE_PROGRESS = "milestone_progress",
    TASK_COMPLETION = "task_completion",
    RISK_SUMMARY = "risk_summary",
    EXECUTIVE_SUMMARY = "executive_summary"
}
/**
 * Risk level
 */
export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Legal matter entity
 */
export interface LegalMatter {
    id: string;
    matterNumber: string;
    title: string;
    description: string;
    matterType: MatterType;
    status: MatterStatus;
    priority: MatterPriority;
    clientId: string;
    responsibleAttorneyId: string;
    practiceAreaId?: string;
    openDate: Date;
    closeDate?: Date;
    targetCloseDate?: Date;
    budgetAmount?: number;
    estimatedHours?: number;
    actualHours?: number;
    currency: string;
    conflictCheckStatus?: string;
    conflictCheckDate?: Date;
    billingArrangement?: string;
    objectives?: string[];
    scope?: string;
    constraints?: string[];
    assumptions?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Project task entity
 */
export interface ProjectTask {
    id: string;
    matterId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedToId?: string;
    assignedById: string;
    parentTaskId?: string;
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    percentComplete: number;
    dependencies?: string[];
    tags?: string[];
    checklistItems?: TaskChecklistItem[];
    blockers?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Task checklist item
 */
export interface TaskChecklistItem {
    id: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    completedBy?: string;
}
/**
 * Milestone entity
 */
export interface Milestone {
    id: string;
    matterId: string;
    name: string;
    description?: string;
    status: MilestoneStatus;
    targetDate: Date;
    actualDate?: Date;
    deliverables?: string[];
    dependencies?: string[];
    criticalPath: boolean;
    percentComplete: number;
    ownerId?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Resource allocation entity
 */
export interface ResourceAllocation {
    id: string;
    matterId: string;
    resourceId: string;
    resourceType: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';
    roleOnMatter: string;
    status: ResourceAllocationStatus;
    allocationPercentage?: number;
    startDate: Date;
    endDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    billableRate?: number;
    costRate?: number;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Matter budget entity
 */
export interface MatterBudget {
    id: string;
    matterId: string;
    budgetType: 'overall' | 'phase' | 'task' | 'category';
    status: BudgetStatus;
    totalBudget: number;
    laborBudget?: number;
    expenseBudget?: number;
    actualSpent: number;
    committed: number;
    remaining: number;
    variance: number;
    variancePercentage: number;
    currency: string;
    periodStart?: Date;
    periodEnd?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    lastReviewDate?: Date;
    forecastAtCompletion?: number;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Budget line item
 */
export interface BudgetLineItem {
    id: string;
    budgetId: string;
    category: string;
    expenseType: ExpenseType;
    description: string;
    budgetedAmount: number;
    actualAmount: number;
    committedAmount: number;
    variance: number;
    metadata: Record<string, any>;
}
/**
 * Status report entity
 */
export interface StatusReport {
    id: string;
    matterId: string;
    reportType: ReportType;
    reportDate: Date;
    periodStart: Date;
    periodEnd: Date;
    summary: string;
    accomplishments?: string[];
    upcomingTasks?: string[];
    issues?: string[];
    risks?: RiskItem[];
    budgetStatus?: BudgetStatusSummary;
    scheduleStatus?: ScheduleStatusSummary;
    resourceStatus?: ResourceStatusSummary;
    milestonesAchieved?: string[];
    nextMilestones?: string[];
    recommendations?: string[];
    attachments?: string[];
    recipientIds?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk item
 */
export interface RiskItem {
    id: string;
    description: string;
    level: RiskLevel;
    impact: string;
    mitigation?: string;
    owner?: string;
}
/**
 * Budget status summary
 */
export interface BudgetStatusSummary {
    budgeted: number;
    spent: number;
    committed: number;
    remaining: number;
    variance: number;
    variancePercentage: number;
    atRisk: boolean;
}
/**
 * Schedule status summary
 */
export interface ScheduleStatusSummary {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    delayedTasks: number;
    upcomingDeadlines: number;
    criticalPathStatus: 'on_track' | 'at_risk' | 'delayed';
}
/**
 * Resource status summary
 */
export interface ResourceStatusSummary {
    totalResources: number;
    activeResources: number;
    utilization: number;
    overallocated: number;
    underutilized: number;
}
/**
 * Project template entity
 */
export interface ProjectTemplate {
    id: string;
    name: string;
    matterType: MatterType;
    description?: string;
    defaultTasks?: TemplateTask[];
    defaultMilestones?: TemplateMilestone[];
    estimatedDuration?: number;
    estimatedBudget?: number;
    requiredRoles?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Template task
 */
export interface TemplateTask {
    title: string;
    description?: string;
    estimatedHours?: number;
    daysFromStart?: number;
    dependencies?: string[];
    assignedRole?: string;
}
/**
 * Template milestone
 */
export interface TemplateMilestone {
    name: string;
    description?: string;
    daysFromStart: number;
    deliverables?: string[];
}
export declare const CreateMatterSchema: any;
export declare const UpdateMatterSchema: any;
export declare const CreateTaskSchema: any;
export declare const UpdateTaskSchema: any;
export declare const CreateMilestoneSchema: any;
export declare const UpdateMilestoneSchema: any;
export declare const CreateResourceAllocationSchema: any;
export declare const UpdateResourceAllocationSchema: any;
export declare const CreateBudgetSchema: any;
export declare const UpdateBudgetSchema: any;
export declare const CreateStatusReportSchema: any;
export declare class CreateMatterDto {
    matterNumber?: string;
    title: string;
    description: string;
    matterType: MatterType;
    priority: MatterPriority;
    clientId: string;
    responsibleAttorneyId: string;
    practiceAreaId?: string;
    openDate: Date;
    targetCloseDate?: Date;
    budgetAmount?: number;
    estimatedHours?: number;
    currency: string;
    billingArrangement?: string;
    objectives?: string[];
    scope?: string;
    constraints?: string[];
    assumptions?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateMatterDto {
    title?: string;
    description?: string;
    matterType?: MatterType;
    status?: MatterStatus;
    priority?: MatterPriority;
    responsibleAttorneyId?: string;
    targetCloseDate?: Date;
    budgetAmount?: number;
    estimatedHours?: number;
    metadata?: Record<string, any>;
}
export declare class CreateTaskDto {
    matterId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedToId?: string;
    parentTaskId?: string;
    startDate?: Date;
    dueDate?: Date;
    estimatedHours?: number;
    dependencies?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedToId?: string;
    dueDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    percentComplete?: number;
    metadata?: Record<string, any>;
}
export declare class CreateMilestoneDto {
    matterId: string;
    name: string;
    description?: string;
    targetDate: Date;
    deliverables?: string[];
    dependencies?: string[];
    criticalPath: boolean;
    ownerId?: string;
    metadata?: Record<string, any>;
}
export declare class UpdateMilestoneDto {
    name?: string;
    description?: string;
    status?: MilestoneStatus;
    targetDate?: Date;
    actualDate?: Date;
    percentComplete?: number;
    metadata?: Record<string, any>;
}
export declare class CreateResourceAllocationDto {
    matterId: string;
    resourceId: string;
    resourceType: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';
    roleOnMatter: string;
    allocationPercentage?: number;
    startDate: Date;
    endDate?: Date;
    estimatedHours?: number;
    billableRate?: number;
    costRate?: number;
    metadata?: Record<string, any>;
}
export declare class UpdateResourceAllocationDto {
    status?: ResourceAllocationStatus;
    allocationPercentage?: number;
    endDate?: Date;
    actualHours?: number;
    metadata?: Record<string, any>;
}
export declare class CreateBudgetDto {
    matterId: string;
    budgetType: 'overall' | 'phase' | 'task' | 'category';
    totalBudget: number;
    laborBudget?: number;
    expenseBudget?: number;
    currency: string;
    periodStart?: Date;
    periodEnd?: Date;
    metadata?: Record<string, any>;
}
export declare class UpdateBudgetDto {
    status?: BudgetStatus;
    totalBudget?: number;
    laborBudget?: number;
    expenseBudget?: number;
    actualSpent?: number;
    committed?: number;
    metadata?: Record<string, any>;
}
export declare class CreateStatusReportDto {
    matterId: string;
    reportType: ReportType;
    periodStart: Date;
    periodEnd: Date;
    summary: string;
    accomplishments?: string[];
    upcomingTasks?: string[];
    issues?: string[];
    recommendations?: string[];
    recipientIds?: string[];
    metadata?: Record<string, any>;
}
export declare class LegalMatterModel extends Model<LegalMatter> implements LegalMatter {
    id: string;
    matterNumber: string;
    title: string;
    description: string;
    matterType: MatterType;
    status: MatterStatus;
    priority: MatterPriority;
    clientId: string;
    responsibleAttorneyId: string;
    practiceAreaId?: string;
    openDate: Date;
    closeDate?: Date;
    targetCloseDate?: Date;
    budgetAmount?: number;
    estimatedHours?: number;
    actualHours?: number;
    currency: string;
    conflictCheckStatus?: string;
    conflictCheckDate?: Date;
    billingArrangement?: string;
    objectives?: string[];
    scope?: string;
    constraints?: string[];
    assumptions?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class ProjectTaskModel extends Model<ProjectTask> implements ProjectTask {
    id: string;
    matterId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedToId?: string;
    assignedById: string;
    parentTaskId?: string;
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    percentComplete: number;
    dependencies?: string[];
    tags?: string[];
    checklistItems?: TaskChecklistItem[];
    blockers?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    matter?: LegalMatterModel;
}
export declare class MilestoneModel extends Model<Milestone> implements Milestone {
    id: string;
    matterId: string;
    name: string;
    description?: string;
    status: MilestoneStatus;
    targetDate: Date;
    actualDate?: Date;
    deliverables?: string[];
    dependencies?: string[];
    criticalPath: boolean;
    percentComplete: number;
    ownerId?: string;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    matter?: LegalMatterModel;
}
export declare class ResourceAllocationModel extends Model<ResourceAllocation> implements ResourceAllocation {
    id: string;
    matterId: string;
    resourceId: string;
    resourceType: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';
    roleOnMatter: string;
    status: ResourceAllocationStatus;
    allocationPercentage?: number;
    startDate: Date;
    endDate?: Date;
    estimatedHours?: number;
    actualHours?: number;
    billableRate?: number;
    costRate?: number;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    matter?: LegalMatterModel;
}
export declare class MatterBudgetModel extends Model<MatterBudget> implements MatterBudget {
    id: string;
    matterId: string;
    budgetType: 'overall' | 'phase' | 'task' | 'category';
    status: BudgetStatus;
    totalBudget: number;
    laborBudget?: number;
    expenseBudget?: number;
    actualSpent: number;
    committed: number;
    remaining: number;
    variance: number;
    variancePercentage: number;
    currency: string;
    periodStart?: Date;
    periodEnd?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    lastReviewDate?: Date;
    forecastAtCompletion?: number;
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    matter?: LegalMatterModel;
}
export declare class StatusReportModel extends Model<StatusReport> implements StatusReport {
    id: string;
    matterId: string;
    reportType: ReportType;
    reportDate: Date;
    periodStart: Date;
    periodEnd: Date;
    summary: string;
    accomplishments?: string[];
    upcomingTasks?: string[];
    issues?: string[];
    risks?: RiskItem[];
    budgetStatus?: BudgetStatusSummary;
    scheduleStatus?: ScheduleStatusSummary;
    resourceStatus?: ResourceStatusSummary;
    milestonesAchieved?: string[];
    nextMilestones?: string[];
    recommendations?: string[];
    attachments?: string[];
    recipientIds?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    matter?: LegalMatterModel;
}
export declare class ProjectTemplateModel extends Model<ProjectTemplate> implements ProjectTemplate {
    id: string;
    name: string;
    matterType: MatterType;
    description?: string;
    defaultTasks?: TemplateTask[];
    defaultMilestones?: TemplateMilestone[];
    estimatedDuration?: number;
    estimatedBudget?: number;
    requiredRoles?: string[];
    metadata: Record<string, any>;
    tenantId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class LegalProjectManagementService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Function 1: Create new legal matter
     */
    createMatter(data: z.infer<typeof CreateMatterSchema>, userId: string, tenantId?: string): Promise<LegalMatter>;
    /**
     * Function 2: Update legal matter
     */
    updateMatter(matterId: string, data: z.infer<typeof UpdateMatterSchema>, userId: string): Promise<LegalMatter>;
    /**
     * Function 3: Get matter details with related data
     */
    getMatterDetails(matterId: string): Promise<LegalMatter & {
        tasks?: ProjectTask[];
        milestones?: Milestone[];
        resources?: ResourceAllocation[];
        budget?: MatterBudget;
    }>;
    /**
     * Function 4: Create matter from template
     */
    createMatterFromTemplate(templateId: string, matterData: z.infer<typeof CreateMatterSchema>, userId: string, tenantId?: string): Promise<LegalMatter>;
    /**
     * Function 5: Define matter scope and objectives
     */
    updateMatterScope(matterId: string, scope: string, objectives: string[], constraints?: string[], assumptions?: string[], userId?: string): Promise<LegalMatter>;
    /**
     * Function 6: List matters with filters
     */
    listMatters(filters: {
        status?: MatterStatus;
        matterType?: MatterType;
        priority?: MatterPriority;
        clientId?: string;
        responsibleAttorneyId?: string;
        tenantId?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        matters: LegalMatter[];
        total: number;
    }>;
    /**
     * Function 7: Close matter
     */
    closeMatter(matterId: string, userId: string): Promise<LegalMatter>;
    /**
     * Function 8: Create matter budget
     */
    createBudget(data: z.infer<typeof CreateBudgetSchema>, userId: string, tenantId?: string): Promise<MatterBudget>;
    /**
     * Function 9: Update budget actuals
     */
    updateBudgetActuals(budgetId: string, actualSpent: number, committed: number, userId: string): Promise<MatterBudget>;
    /**
     * Function 10: Get budget variance report
     */
    getBudgetVarianceReport(matterId: string): Promise<{
        budget: MatterBudget;
        variance: number;
        variancePercentage: number;
        isOverBudget: boolean;
        projectedOverrun?: number;
    }>;
    /**
     * Function 11: Approve budget
     */
    approveBudget(budgetId: string, approverId: string): Promise<MatterBudget>;
    /**
     * Function 12: Calculate forecast at completion
     */
    calculateForecastAtCompletion(budgetId: string): Promise<number>;
    /**
     * Function 13: Get budget summary by category
     */
    getBudgetSummaryByCategory(matterId: string): Promise<{
        total: number;
        byCategory: Array<{
            category: string;
            budgeted: number;
            actual: number;
            variance: number;
        }>;
    }>;
    /**
     * Function 14: Create project task
     */
    createTask(data: z.infer<typeof CreateTaskSchema>, userId: string, tenantId?: string): Promise<ProjectTask>;
    /**
     * Function 15: Update task status
     */
    updateTaskStatus(taskId: string, status: TaskStatus, percentComplete?: number, userId?: string): Promise<ProjectTask>;
    /**
     * Function 16: Assign task to user
     */
    assignTask(taskId: string, assignedToId: string, assignedById: string): Promise<ProjectTask>;
    /**
     * Function 17: Get task dependencies
     */
    getTaskDependencies(taskId: string): Promise<ProjectTask[]>;
    /**
     * Function 18: Update task progress
     */
    updateTaskProgress(taskId: string, percentComplete: number, actualHours?: number, userId?: string): Promise<ProjectTask>;
    /**
     * Function 19: Get tasks by matter
     */
    getTasksByMatter(matterId: string, filters?: {
        status?: TaskStatus;
        assignedToId?: string;
        priority?: TaskPriority;
    }): Promise<ProjectTask[]>;
    /**
     * Function 20: Get overdue tasks
     */
    getOverdueTasks(tenantId?: string): Promise<ProjectTask[]>;
    /**
     * Function 21: Create milestone
     */
    createMilestone(data: z.infer<typeof CreateMilestoneSchema>, userId: string, tenantId?: string): Promise<Milestone>;
    /**
     * Function 22: Update milestone status
     */
    updateMilestoneStatus(milestoneId: string, status: MilestoneStatus, actualDate?: Date, userId?: string): Promise<Milestone>;
    /**
     * Function 23: Get milestones by matter
     */
    getMilestonesByMatter(matterId: string): Promise<Milestone[]>;
    /**
     * Function 24: Get critical path milestones
     */
    getCriticalPathMilestones(matterId: string): Promise<Milestone[]>;
    /**
     * Function 25: Track milestone deliverables
     */
    updateMilestoneDeliverables(milestoneId: string, deliverables: string[], userId?: string): Promise<Milestone>;
    /**
     * Function 26: Allocate resource to matter
     */
    allocateResource(data: z.infer<typeof CreateResourceAllocationSchema>, userId: string, tenantId?: string): Promise<ResourceAllocation>;
    /**
     * Function 27: Update resource allocation
     */
    updateResourceAllocation(allocationId: string, data: z.infer<typeof UpdateResourceAllocationSchema>, userId: string): Promise<ResourceAllocation>;
    /**
     * Function 28: Get resource allocations by matter
     */
    getResourceAllocationsByMatter(matterId: string): Promise<ResourceAllocation[]>;
    /**
     * Function 29: Calculate resource utilization
     */
    calculateResourceUtilization(resourceId: string, periodStart: Date, periodEnd: Date): Promise<{
        totalAllocated: number;
        totalActual: number;
        utilizationRate: number;
        activeMatters: number;
    }>;
    /**
     * Function 30: Get resource capacity report
     */
    getResourceCapacityReport(resourceIds: string[], periodStart: Date, periodEnd: Date): Promise<Array<{
        resourceId: string;
        allocated: number;
        available: number;
        overallocated: boolean;
    }>>;
    /**
     * Function 31: Create status report
     */
    createStatusReport(data: z.infer<typeof CreateStatusReportSchema>, userId: string, tenantId?: string): Promise<StatusReport>;
    /**
     * Function 32: Generate comprehensive status report
     */
    generateComprehensiveStatusReport(matterId: string, periodStart: Date, periodEnd: Date, userId: string, tenantId?: string): Promise<StatusReport>;
    /**
     * Function 33: Get status reports by matter
     */
    getStatusReportsByMatter(matterId: string, reportType?: ReportType): Promise<StatusReport[]>;
    /**
     * Function 34: Generate Gantt chart data
     */
    generateGanttChartData(matterId: string): Promise<{
        tasks: Array<{
            id: string;
            name: string;
            start: Date;
            end: Date;
            progress: number;
            dependencies: string[];
        }>;
        milestones: Array<{
            id: string;
            name: string;
            date: Date;
        }>;
    }>;
    /**
     * Function 35: Calculate project health score
     */
    calculateProjectHealthScore(matterId: string): Promise<{
        overallScore: number;
        scheduleHealth: number;
        budgetHealth: number;
        resourceHealth: number;
        riskLevel: RiskLevel;
    }>;
    /**
     * Function 36: Generate unique matter number
     */
    generateMatterNumber(tenantId?: string): Promise<string>;
    /**
     * Function 37: Validate task dependencies
     */
    validateTaskDependencies(taskId: string): Promise<{
        valid: boolean;
        blockedBy: string[];
        canStart: boolean;
    }>;
    /**
     * Function 38: Archive closed matters
     */
    archiveClosedMatters(closedBeforeDate: Date, tenantId?: string): Promise<number>;
    /**
     * Function 39: Get matter statistics
     */
    getMatterStatistics(tenantId?: string): Promise<{
        totalMatters: number;
        byStatus: Record<MatterStatus, number>;
        byType: Record<MatterType, number>;
        byPriority: Record<MatterPriority, number>;
        averageBudget: number;
        totalBudget: number;
    }>;
}
export declare class LegalProjectManagementModule {
    static forRoot(): DynamicModule;
}
declare const _default: {
    LegalProjectManagementService: typeof LegalProjectManagementService;
    LegalProjectManagementModule: typeof LegalProjectManagementModule;
    LegalMatterModel: typeof LegalMatterModel;
    ProjectTaskModel: typeof ProjectTaskModel;
    MilestoneModel: typeof MilestoneModel;
    ResourceAllocationModel: typeof ResourceAllocationModel;
    MatterBudgetModel: typeof MatterBudgetModel;
    StatusReportModel: typeof StatusReportModel;
    ProjectTemplateModel: typeof ProjectTemplateModel;
    CreateMatterDto: typeof CreateMatterDto;
    UpdateMatterDto: typeof UpdateMatterDto;
    CreateTaskDto: typeof CreateTaskDto;
    UpdateTaskDto: typeof UpdateTaskDto;
    CreateMilestoneDto: typeof CreateMilestoneDto;
    UpdateMilestoneDto: typeof UpdateMilestoneDto;
    CreateResourceAllocationDto: typeof CreateResourceAllocationDto;
    UpdateResourceAllocationDto: typeof UpdateResourceAllocationDto;
    CreateBudgetDto: typeof CreateBudgetDto;
    UpdateBudgetDto: typeof UpdateBudgetDto;
    CreateStatusReportDto: typeof CreateStatusReportDto;
    CreateMatterSchema: any;
    UpdateMatterSchema: any;
    CreateTaskSchema: any;
    UpdateTaskSchema: any;
    CreateMilestoneSchema: any;
    UpdateMilestoneSchema: any;
    CreateResourceAllocationSchema: any;
    UpdateResourceAllocationSchema: any;
    CreateBudgetSchema: any;
    UpdateBudgetSchema: any;
    CreateStatusReportSchema: any;
    MatterStatus: typeof MatterStatus;
    MatterPriority: typeof MatterPriority;
    MatterType: typeof MatterType;
    TaskStatus: typeof TaskStatus;
    TaskPriority: typeof TaskPriority;
    MilestoneStatus: typeof MilestoneStatus;
    ResourceAllocationStatus: typeof ResourceAllocationStatus;
    BudgetStatus: typeof BudgetStatus;
    ExpenseType: typeof ExpenseType;
    ReportType: typeof ReportType;
    RiskLevel: typeof RiskLevel;
};
export default _default;
//# sourceMappingURL=legal-project-management-kit.d.ts.map