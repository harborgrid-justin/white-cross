/**
 * PROJECT TRACKING AND MANAGEMENT KIT
 *
 * Comprehensive project management and tracking system for healthcare facility projects.
 * Provides 40 specialized functions covering:
 * - Project creation and initialization
 * - Work Breakdown Structure (WBS) management
 * - Task breakdown and dependency tracking
 * - Resource assignment and leveling
 * - Progress tracking and reporting
 * - Critical path analysis (CPM)
 * - Milestone tracking and validation
 * - Budget vs. actual cost tracking
 * - Risk and issue management
 * - Project timeline and Gantt chart data
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant project documentation
 *
 * @module ProjectTrackingKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all project data is audited and tracked
 * @example
 * ```typescript
 * import {
 *   createProject,
 *   createWBS,
 *   assignResource,
 *   trackProgress,
 *   calculateCriticalPath
 * } from './project-tracking-kit';
 *
 * // Create a new project
 * const project = await createProject({
 *   name: 'Hospital Wing Renovation',
 *   budget: 2000000,
 *   startDate: new Date(),
 *   endDate: new Date('2025-12-31')
 * });
 *
 * // Create work breakdown structure
 * const wbs = await createWBS(project.id, {
 *   phases: ['Planning', 'Design', 'Construction', 'Closeout']
 * });
 * ```
 */
/**
 * Project status values
 */
export declare enum ProjectStatus {
    PLANNING = "planning",
    APPROVED = "approved",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    CLOSED = "closed"
}
/**
 * Task status values
 */
export declare enum TaskStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Project priority levels
 */
export declare enum ProjectPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Task dependency types
 */
export declare enum DependencyType {
    FINISH_TO_START = "finish_to_start",
    START_TO_START = "start_to_start",
    FINISH_TO_FINISH = "finish_to_finish",
    START_TO_FINISH = "start_to_finish"
}
/**
 * Risk severity levels
 */
export declare enum RiskSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Issue priority levels
 */
export declare enum IssuePriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Project interface
 */
export interface Project {
    id: string;
    projectNumber: string;
    name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    managerId: string;
    sponsorId?: string;
    budget: number;
    actualCost: number;
    estimatedCost: number;
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    progressPercentage: number;
    facilityId?: string;
    departmentId?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Work Breakdown Structure (WBS) element interface
 */
export interface WBSElement {
    id: string;
    projectId: string;
    parentId?: string;
    wbsCode: string;
    name: string;
    description: string;
    level: number;
    sequence: number;
    estimatedHours: number;
    estimatedCost: number;
    actualHours?: number;
    actualCost?: number;
    children?: WBSElement[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Project task interface
 */
export interface ProjectTask {
    id: string;
    projectId: string;
    wbsElementId?: string;
    name: string;
    description: string;
    status: TaskStatus;
    priority: ProjectPriority;
    assignedTo?: string;
    assignedTeam?: string;
    estimatedHours: number;
    actualHours: number;
    progressPercentage: number;
    startDate: Date;
    endDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    dependencies: TaskDependency[];
    isMilestone: boolean;
    isCriticalPath: boolean;
    slack?: number;
    earlyStart?: Date;
    earlyFinish?: Date;
    lateStart?: Date;
    lateFinish?: Date;
    predecessors: string[];
    successors: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Task dependency interface
 */
export interface TaskDependency {
    id: string;
    taskId: string;
    dependsOnTaskId: string;
    dependencyType: DependencyType;
    lagDays: number;
    createdAt: Date;
}
/**
 * Resource assignment interface
 */
export interface ResourceAssignment {
    id: string;
    projectId: string;
    taskId?: string;
    resourceId: string;
    resourceName: string;
    resourceType: 'person' | 'equipment' | 'material';
    allocatedHours: number;
    actualHours: number;
    hourlyRate: number;
    totalCost: number;
    startDate: Date;
    endDate: Date;
    allocationPercentage: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Milestone interface
 */
export interface Milestone {
    id: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: Date;
    actualDate?: Date;
    isCompleted: boolean;
    completedBy?: string;
    criteria?: string[];
    deliverables?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Project risk interface
 */
export interface ProjectRisk {
    id: string;
    projectId: string;
    title: string;
    description: string;
    severity: RiskSeverity;
    probability: number;
    impact: number;
    riskScore: number;
    mitigation: string;
    contingency?: string;
    owner: string;
    status: 'identified' | 'assessed' | 'mitigated' | 'closed';
    identifiedDate: Date;
    reviewDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Project issue interface
 */
export interface ProjectIssue {
    id: string;
    projectId: string;
    title: string;
    description: string;
    priority: IssuePriority;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    reportedBy: string;
    reportedDate: Date;
    resolvedDate?: Date;
    resolution?: string;
    impact?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget item interface
 */
export interface BudgetItem {
    id: string;
    projectId: string;
    category: string;
    description: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercentage: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Critical path result interface
 */
export interface CriticalPathResult {
    tasks: ProjectTask[];
    totalDuration: number;
    criticalPathLength: number;
    projectEndDate: Date;
    slack: number;
}
/**
 * Gantt chart data interface
 */
export interface GanttChartData {
    tasks: Array<{
        id: string;
        name: string;
        start: Date;
        end: Date;
        progress: number;
        dependencies: string[];
        isMilestone: boolean;
        isCritical: boolean;
    }>;
    timeline: {
        start: Date;
        end: Date;
        currentDate: Date;
    };
}
/**
 * Project metrics interface
 */
export interface ProjectMetrics {
    scheduleVariance: number;
    costVariance: number;
    schedulePerformanceIndex: number;
    costPerformanceIndex: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    toCompletePerformanceIndex: number;
}
/**
 * Create project DTO
 */
export declare class CreateProjectDto {
    name: string;
    description: string;
    priority: ProjectPriority;
    managerId: string;
    budget: number;
    startDate: Date;
    endDate: Date;
    facilityId?: string;
}
/**
 * Create task DTO
 */
export declare class CreateTaskDto {
    name: string;
    description: string;
    projectId: string;
    estimatedHours: number;
    startDate: Date;
    endDate: Date;
    assignedTo?: string;
    isMilestone?: boolean;
}
/**
 * Update task progress DTO
 */
export declare class UpdateTaskProgressDto {
    progressPercentage: number;
    actualHours: number;
    notes?: string;
}
/**
 * Create risk DTO
 */
export declare class CreateRiskDto {
    projectId: string;
    title: string;
    description: string;
    severity: RiskSeverity;
    probability: number;
    impact: number;
    mitigation: string;
    owner: string;
}
/**
 * Create issue DTO
 */
export declare class CreateIssueDto {
    projectId: string;
    title: string;
    description: string;
    priority: IssuePriority;
    assignedTo?: string;
    reportedBy: string;
}
/**
 * Creates a new project with auto-generated project number
 *
 * @param data - Project creation data
 * @param userId - User creating the project
 * @returns Created project
 *
 * @example
 * ```typescript
 * const project = await createProject({
 *   name: 'New Hospital Wing',
 *   budget: 5000000,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   managerId: 'user-123'
 * }, 'admin-456');
 * ```
 */
export declare function createProject(data: Omit<Project, 'id' | 'projectNumber' | 'status' | 'actualCost' | 'progressPercentage' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Project>;
/**
 * Generates a unique project number
 *
 * @param projectName - Project name
 * @returns Formatted project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateProjectNumber('Hospital Wing Renovation');
 * // Returns: "PRJ-HWR-20250108-001"
 * ```
 */
export declare function generateProjectNumber(projectName: string): string;
/**
 * Initializes project with template
 *
 * @param templateId - Template identifier
 * @param overrides - Override template values
 * @param userId - User creating the project
 * @returns Created project with template structure
 *
 * @example
 * ```typescript
 * const project = await initializeProjectFromTemplate('template-123', {
 *   name: 'Custom Project Name',
 *   budget: 1000000
 * }, 'user-456');
 * ```
 */
export declare function initializeProjectFromTemplate(templateId: string, overrides: Partial<Project>, userId: string): Promise<{
    project: Project;
    wbs: WBSElement[];
    tasks: ProjectTask[];
}>;
/**
 * Approves project to move from planning to execution
 *
 * @param projectId - Project identifier
 * @param approvedBy - User approving the project
 * @returns Updated project
 *
 * @example
 * ```typescript
 * const approved = await approveProject('project-123', 'admin-456');
 * ```
 */
export declare function approveProject(projectId: string, approvedBy: string): Promise<Project>;
/**
 * Starts project execution
 *
 * @param projectId - Project identifier
 * @param startedBy - User starting the project
 * @returns Updated project
 *
 * @example
 * ```typescript
 * const started = await startProject('project-123', 'manager-456');
 * ```
 */
export declare function startProject(projectId: string, startedBy: string): Promise<Project>;
/**
 * Creates Work Breakdown Structure for project
 *
 * @param projectId - Project identifier
 * @param structure - WBS structure definition
 * @returns Created WBS elements
 *
 * @example
 * ```typescript
 * const wbs = await createWBS('project-123', {
 *   phases: ['Design', 'Construction', 'Testing', 'Deployment']
 * });
 * ```
 */
export declare function createWBS(projectId: string, structure: {
    phases: string[];
}): Promise<WBSElement[]>;
/**
 * Adds child element to WBS
 *
 * @param parentId - Parent WBS element ID
 * @param childData - Child element data
 * @returns Created child element
 *
 * @example
 * ```typescript
 * const child = await addWBSChild('parent-123', {
 *   name: 'Site Preparation',
 *   estimatedHours: 40,
 *   estimatedCost: 5000
 * });
 * ```
 */
export declare function addWBSChild(parentId: string, childData: {
    name: string;
    description?: string;
    estimatedHours: number;
    estimatedCost: number;
}): Promise<WBSElement>;
/**
 * Gets complete WBS hierarchy for project
 *
 * @param projectId - Project identifier
 * @returns Hierarchical WBS structure
 *
 * @example
 * ```typescript
 * const wbsTree = await getWBSHierarchy('project-123');
 * ```
 */
export declare function getWBSHierarchy(projectId: string): Promise<WBSElement[]>;
/**
 * Calculates WBS rollup totals (hours and costs)
 *
 * @param wbsElementId - WBS element identifier
 * @returns Rolled up totals
 *
 * @example
 * ```typescript
 * const totals = await calculateWBSRollup('wbs-123');
 * // Returns: { estimatedHours: 160, estimatedCost: 20000, actualHours: 120, actualCost: 15000 }
 * ```
 */
export declare function calculateWBSRollup(wbsElementId: string): Promise<{
    estimatedHours: number;
    estimatedCost: number;
    actualHours: number;
    actualCost: number;
}>;
/**
 * Creates a project task
 *
 * @param taskData - Task creation data
 * @returns Created task
 *
 * @example
 * ```typescript
 * const task = await createTask({
 *   projectId: 'project-123',
 *   name: 'Design Database Schema',
 *   estimatedHours: 16,
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7*24*60*60*1000)
 * });
 * ```
 */
export declare function createTask(taskData: Omit<ProjectTask, 'id' | 'status' | 'actualHours' | 'progressPercentage' | 'dependencies' | 'isCriticalPath' | 'predecessors' | 'successors' | 'createdAt' | 'updatedAt'>): Promise<ProjectTask>;
/**
 * Adds dependency between tasks
 *
 * @param taskId - Dependent task ID
 * @param dependsOnTaskId - Predecessor task ID
 * @param dependencyType - Type of dependency
 * @param lagDays - Lag time in days
 * @returns Created dependency
 *
 * @example
 * ```typescript
 * await addTaskDependency('task-2', 'task-1', DependencyType.FINISH_TO_START, 0);
 * ```
 */
export declare function addTaskDependency(taskId: string, dependsOnTaskId: string, dependencyType?: DependencyType, lagDays?: number): Promise<TaskDependency>;
/**
 * Removes task dependency
 *
 * @param dependencyId - Dependency identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeTaskDependency('dep-123');
 * ```
 */
export declare function removeTaskDependency(dependencyId: string): Promise<boolean>;
/**
 * Gets all task dependencies for a task
 *
 * @param taskId - Task identifier
 * @returns Array of dependencies
 *
 * @example
 * ```typescript
 * const dependencies = await getTaskDependencies('task-123');
 * ```
 */
export declare function getTaskDependencies(taskId: string): Promise<TaskDependency[]>;
/**
 * Validates task dependency to prevent circular dependencies
 *
 * @param taskId - Task identifier
 * @param dependsOnTaskId - Proposed predecessor task
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const isValid = await validateTaskDependency('task-2', 'task-1');
 * ```
 */
export declare function validateTaskDependency(taskId: string, dependsOnTaskId: string): Promise<{
    valid: boolean;
    reason?: string;
}>;
/**
 * Assigns resource to project or task
 *
 * @param assignment - Resource assignment data
 * @returns Created resource assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignResource({
 *   projectId: 'project-123',
 *   taskId: 'task-456',
 *   resourceId: 'user-789',
 *   resourceName: 'John Smith',
 *   resourceType: 'person',
 *   allocatedHours: 40,
 *   hourlyRate: 75,
 *   allocationPercentage: 50
 * });
 * ```
 */
export declare function assignResource(assignment: Omit<ResourceAssignment, 'id' | 'actualHours' | 'totalCost' | 'createdAt' | 'updatedAt'>): Promise<ResourceAssignment>;
/**
 * Performs resource leveling to optimize resource utilization
 *
 * @param projectId - Project identifier
 * @param options - Leveling options
 * @returns Leveled schedule
 *
 * @example
 * ```typescript
 * const leveledSchedule = await performResourceLeveling('project-123', {
 *   maxHoursPerDay: 8,
 *   allowDelays: true
 * });
 * ```
 */
export declare function performResourceLeveling(projectId: string, options?: {
    maxHoursPerDay?: number;
    allowDelays?: boolean;
}): Promise<{
    tasks: ProjectTask[];
    resourceUtilization: Map<string, number[]>;
}>;
/**
 * Calculates resource utilization for period
 *
 * @param resourceId - Resource identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Utilization percentage by day
 *
 * @example
 * ```typescript
 * const utilization = await calculateResourceUtilization('user-123', startDate, endDate);
 * ```
 */
export declare function calculateResourceUtilization(resourceId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    utilizationPercentage: number;
    allocatedHours: number;
}>>;
/**
 * Identifies over-allocated resources
 *
 * @param projectId - Project identifier
 * @returns Over-allocated resources
 *
 * @example
 * ```typescript
 * const overAllocated = await getOverAllocatedResources('project-123');
 * ```
 */
export declare function getOverAllocatedResources(projectId: string): Promise<Array<{
    resourceId: string;
    resourceName: string;
    maxAllocation: number;
    currentAllocation: number;
    overAllocationPercentage: number;
}>>;
/**
 * Updates task progress
 *
 * @param taskId - Task identifier
 * @param progress - Progress data
 * @param userId - User updating progress
 * @returns Updated task
 *
 * @example
 * ```typescript
 * await updateTaskProgress('task-123', {
 *   progressPercentage: 75,
 *   actualHours: 30,
 *   notes: 'Nearly complete, pending final review'
 * }, 'user-456');
 * ```
 */
export declare function updateTaskProgress(taskId: string, progress: {
    progressPercentage: number;
    actualHours: number;
    notes?: string;
}, userId: string): Promise<ProjectTask>;
/**
 * Calculates overall project progress
 *
 * @param projectId - Project identifier
 * @returns Project progress percentage
 *
 * @example
 * ```typescript
 * const progress = await calculateProjectProgress('project-123');
 * // Returns: 67.5
 * ```
 */
export declare function calculateProjectProgress(projectId: string): Promise<number>;
/**
 * Generates project status report
 *
 * @param projectId - Project identifier
 * @returns Comprehensive status report
 *
 * @example
 * ```typescript
 * const report = await generateProjectStatusReport('project-123');
 * ```
 */
export declare function generateProjectStatusReport(projectId: string): Promise<{
    project: Project;
    progress: number;
    tasksCompleted: number;
    tasksTotal: number;
    budgetStatus: {
        budgeted: number;
        actual: number;
        variance: number;
    };
    scheduleStatus: {
        onTrack: boolean;
        daysAhead: number;
        daysBehind: number;
    };
    risks: ProjectRisk[];
    issues: ProjectIssue[];
}>;
/**
 * Tracks project variance (schedule and cost)
 *
 * @param projectId - Project identifier
 * @returns Variance metrics
 *
 * @example
 * ```typescript
 * const variance = await trackProjectVariance('project-123');
 * ```
 */
export declare function trackProjectVariance(projectId: string): Promise<{
    scheduleVariance: number;
    scheduleVariancePercentage: number;
    costVariance: number;
    costVariancePercentage: number;
}>;
/**
 * Calculates critical path using CPM algorithm
 *
 * @param projectId - Project identifier
 * @returns Critical path analysis results
 *
 * @example
 * ```typescript
 * const criticalPath = await calculateCriticalPath('project-123');
 * ```
 */
export declare function calculateCriticalPath(projectId: string): Promise<CriticalPathResult>;
/**
 * Identifies tasks on critical path
 *
 * @param projectId - Project identifier
 * @returns Critical path tasks
 *
 * @example
 * ```typescript
 * const criticalTasks = await getCriticalPathTasks('project-123');
 * ```
 */
export declare function getCriticalPathTasks(projectId: string): Promise<ProjectTask[]>;
/**
 * Calculates project float/slack
 *
 * @param projectId - Project identifier
 * @returns Total project float
 *
 * @example
 * ```typescript
 * const slack = await calculateProjectSlack('project-123');
 * ```
 */
export declare function calculateProjectSlack(projectId: string): Promise<number>;
/**
 * Creates project milestone
 *
 * @param milestone - Milestone data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   projectId: 'project-123',
 *   name: 'Phase 1 Complete',
 *   dueDate: new Date('2025-06-30'),
 *   criteria: ['All design documents approved', 'Budget allocated']
 * });
 * ```
 */
export declare function createMilestone(milestone: Omit<Milestone, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>): Promise<Milestone>;
/**
 * Completes milestone with verification
 *
 * @param milestoneId - Milestone identifier
 * @param completedBy - User completing milestone
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('milestone-123', 'manager-456');
 * ```
 */
export declare function completeMilestone(milestoneId: string, completedBy: string): Promise<Milestone>;
/**
 * Gets upcoming milestones
 *
 * @param projectId - Project identifier
 * @param daysAhead - Number of days to look ahead
 * @returns Upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones('project-123', 30);
 * ```
 */
export declare function getUpcomingMilestones(projectId: string, daysAhead?: number): Promise<Milestone[]>;
/**
 * Calculates milestone completion percentage
 *
 * @param projectId - Project identifier
 * @returns Completion percentage
 *
 * @example
 * ```typescript
 * const completion = await calculateMilestoneCompletion('project-123');
 * // Returns: 75
 * ```
 */
export declare function calculateMilestoneCompletion(projectId: string): Promise<number>;
/**
 * Tracks budget vs actual costs
 *
 * @param projectId - Project identifier
 * @returns Budget tracking data
 *
 * @example
 * ```typescript
 * const budgetTracking = await trackBudgetVsActual('project-123');
 * ```
 */
export declare function trackBudgetVsActual(projectId: string): Promise<{
    budget: number;
    actual: number;
    committed: number;
    remaining: number;
    variance: number;
    variancePercentage: number;
}>;
/**
 * Creates budget item for project
 *
 * @param budgetItem - Budget item data
 * @returns Created budget item
 *
 * @example
 * ```typescript
 * const item = await createBudgetItem({
 *   projectId: 'project-123',
 *   category: 'Labor',
 *   description: 'Software Development',
 *   budgetedAmount: 50000
 * });
 * ```
 */
export declare function createBudgetItem(budgetItem: Omit<BudgetItem, 'id' | 'actualAmount' | 'variance' | 'variancePercentage' | 'createdAt' | 'updatedAt'>): Promise<BudgetItem>;
/**
 * Updates actual cost for budget item
 *
 * @param budgetItemId - Budget item identifier
 * @param actualAmount - Actual amount spent
 * @returns Updated budget item
 *
 * @example
 * ```typescript
 * await updateBudgetItemActual('item-123', 45000);
 * ```
 */
export declare function updateBudgetItemActual(budgetItemId: string, actualAmount: number): Promise<BudgetItem>;
/**
 * Calculates Earned Value Management metrics
 *
 * @param projectId - Project identifier
 * @returns EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValueMetrics('project-123');
 * ```
 */
export declare function calculateEarnedValueMetrics(projectId: string): Promise<ProjectMetrics>;
/**
 * Creates project risk
 *
 * @param risk - Risk data
 * @returns Created risk
 *
 * @example
 * ```typescript
 * const risk = await createProjectRisk({
 *   projectId: 'project-123',
 *   title: 'Vendor Delay',
 *   severity: RiskSeverity.HIGH,
 *   probability: 0.6,
 *   impact: 8,
 *   mitigation: 'Identify backup vendors',
 *   owner: 'manager-456'
 * });
 * ```
 */
export declare function createProjectRisk(risk: Omit<ProjectRisk, 'id' | 'riskScore' | 'status' | 'identifiedDate' | 'createdAt' | 'updatedAt'>): Promise<ProjectRisk>;
/**
 * Creates project issue
 *
 * @param issue - Issue data
 * @returns Created issue
 *
 * @example
 * ```typescript
 * const issue = await createProjectIssue({
 *   projectId: 'project-123',
 *   title: 'Equipment not delivered',
 *   priority: IssuePriority.HIGH,
 *   assignedTo: 'tech-456',
 *   reportedBy: 'manager-789'
 * });
 * ```
 */
export declare function createProjectIssue(issue: Omit<ProjectIssue, 'id' | 'status' | 'reportedDate' | 'createdAt' | 'updatedAt'>): Promise<ProjectIssue>;
/**
 * Resolves project issue
 *
 * @param issueId - Issue identifier
 * @param resolution - Resolution description
 * @param resolvedBy - User resolving issue
 * @returns Updated issue
 *
 * @example
 * ```typescript
 * await resolveProjectIssue('issue-123', 'Equipment delivered, installation complete', 'tech-456');
 * ```
 */
export declare function resolveProjectIssue(issueId: string, resolution: string, resolvedBy: string): Promise<ProjectIssue>;
/**
 * Generates Gantt chart data for project
 *
 * @param projectId - Project identifier
 * @returns Gantt chart data structure
 *
 * @example
 * ```typescript
 * const ganttData = await generateGanttChartData('project-123');
 * ```
 */
export declare function generateGanttChartData(projectId: string): Promise<GanttChartData>;
/**
 * Project Tracking Controller
 * Provides RESTful API endpoints for project management
 */
export declare class ProjectController {
    create(createDto: CreateProjectDto): Promise<Project>;
    findAll(status?: ProjectStatus): Promise<never[]>;
    findOne(id: string): Promise<Project>;
    createTask(id: string, taskDto: CreateTaskDto): Promise<ProjectTask>;
    updateProgress(id: string, taskId: string, progressDto: UpdateTaskProgressDto): Promise<ProjectTask>;
    getCriticalPath(id: string): Promise<CriticalPathResult>;
    getGantt(id: string): Promise<GanttChartData>;
    createRisk(id: string, riskDto: CreateRiskDto): Promise<ProjectRisk>;
    createIssue(id: string, issueDto: CreateIssueDto): Promise<ProjectIssue>;
}
declare const _default: {
    createProject: typeof createProject;
    generateProjectNumber: typeof generateProjectNumber;
    initializeProjectFromTemplate: typeof initializeProjectFromTemplate;
    approveProject: typeof approveProject;
    startProject: typeof startProject;
    createWBS: typeof createWBS;
    addWBSChild: typeof addWBSChild;
    getWBSHierarchy: typeof getWBSHierarchy;
    calculateWBSRollup: typeof calculateWBSRollup;
    createTask: typeof createTask;
    addTaskDependency: typeof addTaskDependency;
    removeTaskDependency: typeof removeTaskDependency;
    validateTaskDependency: typeof validateTaskDependency;
    assignResource: typeof assignResource;
    performResourceLeveling: typeof performResourceLeveling;
    calculateResourceUtilization: typeof calculateResourceUtilization;
    getOverAllocatedResources: typeof getOverAllocatedResources;
    updateTaskProgress: typeof updateTaskProgress;
    calculateProjectProgress: typeof calculateProjectProgress;
    generateProjectStatusReport: typeof generateProjectStatusReport;
    trackProjectVariance: typeof trackProjectVariance;
    calculateCriticalPath: typeof calculateCriticalPath;
    getCriticalPathTasks: typeof getCriticalPathTasks;
    calculateProjectSlack: typeof calculateProjectSlack;
    createMilestone: typeof createMilestone;
    completeMilestone: typeof completeMilestone;
    getUpcomingMilestones: typeof getUpcomingMilestones;
    calculateMilestoneCompletion: typeof calculateMilestoneCompletion;
    trackBudgetVsActual: typeof trackBudgetVsActual;
    createBudgetItem: typeof createBudgetItem;
    updateBudgetItemActual: typeof updateBudgetItemActual;
    calculateEarnedValueMetrics: typeof calculateEarnedValueMetrics;
    createProjectRisk: typeof createProjectRisk;
    createProjectIssue: typeof createProjectIssue;
    resolveProjectIssue: typeof resolveProjectIssue;
    generateGanttChartData: typeof generateGanttChartData;
    ProjectController: typeof ProjectController;
};
export default _default;
//# sourceMappingURL=project-tracking-kit.d.ts.map