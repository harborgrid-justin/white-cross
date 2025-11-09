/**
 * LOC: CONSPROJ12345
 * File: /reuse/construction/construction-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Project management controllers
 *   - Portfolio management engines
 *   - Resource allocation services
 */
/**
 * File: /reuse/construction/construction-project-management-kit.ts
 * Locator: WC-CONS-PROJ-001
 * Purpose: Comprehensive Construction Project Management Utilities - USACE EPPM-level construction project lifecycle management
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Construction controllers, project services, portfolio management, resource allocation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for project creation, tracking, portfolio management, coordination, lifecycle management
 *
 * LLM Context: Enterprise-grade construction project management system competing with USACE EPPM.
 * Provides construction project lifecycle management, multi-project portfolio coordination, resource allocation,
 * project phase transitions, baseline management, earned value tracking, project templates, schedule integration,
 * budget integration, quality management integration, contractor coordination, change order management,
 * project closeout, lessons learned capture, project reporting, dashboard metrics.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Construction project status values
 */
export declare enum ConstructionProjectStatus {
    PRE_PLANNING = "pre_planning",
    PLANNING = "planning",
    DESIGN = "design",
    PRE_CONSTRUCTION = "pre_construction",
    CONSTRUCTION = "construction",
    CLOSEOUT = "closeout",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled"
}
/**
 * Project phase types
 */
export declare enum ProjectPhase {
    INITIATION = "initiation",
    PLANNING = "planning",
    DESIGN = "design",
    PROCUREMENT = "procurement",
    CONSTRUCTION = "construction",
    COMMISSIONING = "commissioning",
    CLOSEOUT = "closeout",
    OPERATIONS = "operations"
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
 * Project delivery method
 */
export declare enum DeliveryMethod {
    DESIGN_BID_BUILD = "design_bid_build",
    DESIGN_BUILD = "design_build",
    CM_AT_RISK = "cm_at_risk",
    IPD = "ipd",
    PUBLIC_PRIVATE = "public_private"
}
/**
 * Performance metric type
 */
export declare enum PerformanceMetricType {
    SCHEDULE = "schedule",
    COST = "cost",
    QUALITY = "quality",
    SAFETY = "safety",
    SUSTAINABILITY = "sustainability"
}
/**
 * Construction project interface
 */
export interface ConstructionProject {
    id: string;
    projectNumber: string;
    projectName: string;
    description: string;
    status: ConstructionProjectStatus;
    currentPhase: ProjectPhase;
    priority: ProjectPriority;
    deliveryMethod: DeliveryMethod;
    projectManagerId: string;
    sponsorId?: string;
    contractorId?: string;
    totalBudget: number;
    committedCost: number;
    actualCost: number;
    forecastedCost: number;
    contingencyReserve: number;
    managementReserve: number;
    baselineSchedule?: Date;
    baselineEndDate?: Date;
    currentSchedule?: Date;
    currentEndDate?: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    progressPercentage: number;
    earnedValue: number;
    plannedValue: number;
    siteLocationId?: string;
    districtCode?: string;
    divisionCode?: string;
    regulatoryCompliance: string[];
    environmentalPermits: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Project baseline interface
 */
export interface ProjectBaseline {
    id: string;
    projectId: string;
    baselineNumber: string;
    baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';
    baselineDate: Date;
    budget: number;
    schedule: Date;
    scope: string;
    approvedBy: string;
    approvedAt: Date;
    changeReason?: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Project phase transition interface
 */
export interface PhaseTransition {
    id: string;
    projectId: string;
    fromPhase: ProjectPhase;
    toPhase: ProjectPhase;
    transitionDate: Date;
    approvedBy: string;
    gateReviewCompleted: boolean;
    exitCriteriaMet: boolean;
    entryCriteriaMet: boolean;
    notes?: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Project portfolio interface
 */
export interface ProjectPortfolio {
    id: string;
    portfolioName: string;
    description: string;
    managerId: string;
    totalProjects: number;
    totalBudget: number;
    totalActualCost: number;
    activeProjects: number;
    completedProjects: number;
    averageProgress: number;
    performanceIndex: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Resource allocation interface
 */
export interface ResourceAllocation {
    id: string;
    projectId: string;
    resourceType: 'LABOR' | 'EQUIPMENT' | 'MATERIAL' | 'SUBCONTRACTOR';
    resourceId: string;
    resourceName: string;
    allocationPercentage: number;
    allocatedHours?: number;
    actualHours?: number;
    hourlyRate?: number;
    totalCost: number;
    startDate: Date;
    endDate: Date;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'RELEASED';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Change order interface
 */
export interface ChangeOrder {
    id: string;
    projectId: string;
    changeOrderNumber: string;
    title: string;
    description: string;
    changeType: 'SCOPE' | 'SCHEDULE' | 'COST' | 'COMBINED';
    requestedBy: string;
    requestedDate: Date;
    costImpact: number;
    scheduleImpact: number;
    status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
    approvals: any[];
    implementedDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Project performance metrics interface
 */
export interface ProjectPerformanceMetrics {
    projectId: string;
    schedulePerformanceIndex: number;
    costPerformanceIndex: number;
    scheduleVariance: number;
    costVariance: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    toCompletePerformanceIndex: number;
    earnedValue: number;
    plannedValue: number;
    actualCost: number;
    budgetAtCompletion: number;
}
/**
 * Project template interface
 */
export interface ProjectTemplate {
    id: string;
    templateName: string;
    description: string;
    projectType: string;
    deliveryMethod: DeliveryMethod;
    phases: ProjectPhase[];
    defaultDuration: number;
    defaultBudget: number;
    requiredDocuments: string[];
    checklistItems: string[];
    milestones: any[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create construction project DTO
 */
export declare class CreateConstructionProjectDto {
    projectName: string;
    description: string;
    priority: ProjectPriority;
    deliveryMethod: DeliveryMethod;
    projectManagerId: string;
    totalBudget: number;
    baselineEndDate: Date;
    districtCode?: string;
}
/**
 * Update project progress DTO
 */
export declare class UpdateProjectProgressDto {
    progressPercentage: number;
    actualCost: number;
    notes?: string;
}
/**
 * Create baseline DTO
 */
export declare class CreateBaselineDto {
    projectId: string;
    baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';
    budget: number;
    schedule: Date;
    scope: string;
}
/**
 * Create change order DTO
 */
export declare class CreateChangeOrderDto {
    projectId: string;
    title: string;
    description: string;
    changeType: 'SCOPE' | 'SCHEDULE' | 'COST' | 'COMBINED';
    costImpact: number;
    scheduleImpact: number;
}
/**
 * Sequelize model for Construction Project Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionProject model
 *
 * @example
 * ```typescript
 * const ConstructionProject = createConstructionProjectModel(sequelize);
 * const project = await ConstructionProject.create({
 *   projectName: 'Hospital Expansion Phase 2',
 *   totalBudget: 25000000,
 *   deliveryMethod: 'design_build',
 *   status: 'planning'
 * });
 * ```
 */
export declare const createConstructionProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        projectNumber: string;
        projectName: string;
        description: string;
        status: string;
        currentPhase: string;
        priority: string;
        deliveryMethod: string;
        projectManagerId: string;
        sponsorId: string | null;
        contractorId: string | null;
        totalBudget: number;
        committedCost: number;
        actualCost: number;
        forecastedCost: number;
        contingencyReserve: number;
        managementReserve: number;
        baselineSchedule: Date | null;
        baselineEndDate: Date | null;
        currentSchedule: Date | null;
        currentEndDate: Date | null;
        actualStartDate: Date | null;
        actualEndDate: Date | null;
        progressPercentage: number;
        earnedValue: number;
        plannedValue: number;
        siteLocationId: string | null;
        districtCode: string | null;
        divisionCode: string | null;
        regulatoryCompliance: string[];
        environmentalPermits: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Project Baseline tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectBaseline model
 *
 * @example
 * ```typescript
 * const ProjectBaseline = createProjectBaselineModel(sequelize);
 * const baseline = await ProjectBaseline.create({
 *   projectId: 'proj-uuid',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * });
 * ```
 */
export declare const createProjectBaselineModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        projectId: string;
        baselineNumber: string;
        baselineType: string;
        baselineDate: Date;
        budget: number;
        schedule: Date;
        scope: string;
        approvedBy: string;
        approvedAt: Date;
        changeReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Change Order tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeOrder model
 *
 * @example
 * ```typescript
 * const ChangeOrder = createChangeOrderModel(sequelize);
 * const changeOrder = await ChangeOrder.create({
 *   projectId: 'proj-uuid',
 *   title: 'Add emergency generator',
 *   changeType: 'SCOPE',
 *   costImpact: 150000,
 *   scheduleImpact: 30
 * });
 * ```
 */
export declare const createChangeOrderModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        projectId: string;
        changeOrderNumber: string;
        title: string;
        description: string;
        changeType: string;
        requestedBy: string;
        requestedDate: Date;
        costImpact: number;
        scheduleImpact: number;
        status: string;
        approvals: any[];
        implementedDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new construction project with auto-generated project number.
 *
 * @param {object} projectData - Project creation data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<ConstructionProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createConstructionProject({
 *   projectName: 'Hospital Expansion Phase 2',
 *   description: 'Add 100-bed capacity',
 *   deliveryMethod: DeliveryMethod.DESIGN_BUILD,
 *   totalBudget: 25000000,
 *   projectManagerId: 'user-123',
 *   priority: ProjectPriority.HIGH
 * }, 'admin-456');
 * ```
 */
export declare const createConstructionProject: (projectData: any, userId: string, transaction?: Transaction) => Promise<ConstructionProject>;
/**
 * Generates unique construction project number.
 *
 * @param {string} districtCode - USACE district code
 * @returns {string} Generated project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateConstructionProjectNumber('NAD');
 * // Returns: "NAD-2025-C-001"
 * ```
 */
export declare const generateConstructionProjectNumber: (districtCode: string) => string;
/**
 * Initializes project from template with customizations.
 *
 * @param {string} templateId - Template identifier
 * @param {object} customizations - Template customizations
 * @param {string} userId - User creating project
 * @returns {Promise<object>} Created project with template structure
 *
 * @example
 * ```typescript
 * const result = await initializeProjectFromTemplate('template-hospital', {
 *   projectName: 'City General Hospital Expansion',
 *   totalBudget: 30000000,
 *   districtCode: 'NAD'
 * }, 'admin-123');
 * ```
 */
export declare const initializeProjectFromTemplate: (templateId: string, customizations: any, userId: string) => Promise<{
    project: ConstructionProject;
    baseline: ProjectBaseline;
    phases: PhaseTransition[];
}>;
/**
 * Clones existing project with option to copy data.
 *
 * @param {string} sourceProjectId - Source project ID
 * @param {object} overrides - Property overrides
 * @param {boolean} copyData - Whether to copy project data
 * @param {string} userId - User creating clone
 * @returns {Promise<ConstructionProject>} Cloned project
 *
 * @example
 * ```typescript
 * const cloned = await cloneConstructionProject('proj-123', {
 *   projectName: 'Hospital Phase 3',
 *   totalBudget: 28000000
 * }, true, 'admin-456');
 * ```
 */
export declare const cloneConstructionProject: (sourceProjectId: string, overrides: any, copyData: boolean, userId: string) => Promise<ConstructionProject>;
/**
 * Archives completed or cancelled project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} archiveReason - Reason for archiving
 * @param {string} userId - User archiving project
 * @returns {Promise<object>} Archive confirmation
 *
 * @example
 * ```typescript
 * await archiveConstructionProject('proj-123', 'Project completed', 'admin-456');
 * ```
 */
export declare const archiveConstructionProject: (projectId: string, archiveReason: string, userId: string) => Promise<{
    archived: boolean;
    archiveDate: Date;
    archivedBy: string;
}>;
/**
 * Updates project progress and calculates earned value.
 *
 * @param {string} projectId - Project identifier
 * @param {object} progressData - Progress update data
 * @param {string} userId - User updating progress
 * @returns {Promise<ConstructionProject>} Updated project
 *
 * @example
 * ```typescript
 * const updated = await updateProjectProgress('proj-123', {
 *   progressPercentage: 45.5,
 *   actualCost: 12500000,
 *   notes: 'Foundation work completed'
 * }, 'pm-456');
 * ```
 */
export declare const updateProjectProgress: (projectId: string, progressData: {
    progressPercentage: number;
    actualCost: number;
    notes?: string;
}, userId: string) => Promise<ConstructionProject>;
/**
 * Calculates earned value management (EVM) metrics for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectPerformanceMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateProjectEVM('proj-123');
 * console.log(`CPI: ${metrics.costPerformanceIndex}, SPI: ${metrics.schedulePerformanceIndex}`);
 * ```
 */
export declare const calculateProjectEVM: (projectId: string) => Promise<ProjectPerformanceMetrics>;
/**
 * Tracks project schedule performance and forecasts completion.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Schedule performance data
 *
 * @example
 * ```typescript
 * const schedule = await trackProjectSchedule('proj-123');
 * ```
 */
export declare const trackProjectSchedule: (projectId: string) => Promise<{
    baselineEndDate: Date;
    currentEndDate: Date;
    forecastedEndDate: Date;
    scheduleVarianceDays: number;
    onSchedule: boolean;
}>;
/**
 * Generates comprehensive project status report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} [asOfDate] - Report date (defaults to now)
 * @returns {Promise<object>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateProjectStatusReport('proj-123');
 * ```
 */
export declare const generateProjectStatusReport: (projectId: string, asOfDate?: Date) => Promise<{
    project: ConstructionProject;
    performanceMetrics: ProjectPerformanceMetrics;
    scheduleStatus: any;
    riskSummary: any;
    changeOrderSummary: any;
    reportDate: Date;
}>;
/**
 * Calculates critical path for project schedule.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await calculateProjectCriticalPath('proj-123');
 * ```
 */
export declare const calculateProjectCriticalPath: (projectId: string) => Promise<{
    criticalTasks: any[];
    totalDuration: number;
    slack: number;
    longestPath: string[];
}>;
/**
 * Creates project portfolio for multi-project management.
 *
 * @param {object} portfolioData - Portfolio creation data
 * @param {string} userId - User creating portfolio
 * @returns {Promise<ProjectPortfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createProjectPortfolio({
 *   portfolioName: 'District Infrastructure Projects',
 *   description: 'All active infrastructure projects',
 *   managerId: 'manager-123'
 * }, 'admin-456');
 * ```
 */
export declare const createProjectPortfolio: (portfolioData: any, userId: string) => Promise<ProjectPortfolio>;
/**
 * Adds project to portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Association result
 *
 * @example
 * ```typescript
 * await addProjectToPortfolio('portfolio-123', 'proj-456');
 * ```
 */
export declare const addProjectToPortfolio: (portfolioId: string, projectId: string) => Promise<{
    portfolioId: string;
    projectId: string;
    addedAt: Date;
}>;
/**
 * Calculates portfolio performance metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics('portfolio-123');
 * ```
 */
export declare const calculatePortfolioMetrics: (portfolioId: string) => Promise<{
    totalBudget: number;
    totalActualCost: number;
    averageCPI: number;
    averageSPI: number;
    totalEarnedValue: number;
    portfolioHealth: "EXCELLENT" | "GOOD" | "AT_RISK" | "CRITICAL";
}>;
/**
 * Generates portfolio dashboard with key metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePortfolioDashboard('portfolio-123');
 * ```
 */
export declare const generatePortfolioDashboard: (portfolioId: string) => Promise<{
    metrics: any;
    projectsByPhase: Record<ProjectPhase, number>;
    projectsByStatus: Record<ConstructionProjectStatus, number>;
    topRisks: any[];
    upcomingMilestones: any[];
}>;
/**
 * Identifies portfolio resource conflicts across projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object[]>} Resource conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await identifyPortfolioResourceConflicts('portfolio-123');
 * ```
 */
export declare const identifyPortfolioResourceConflicts: (portfolioId: string) => Promise<Array<{
    resourceId: string;
    resourceName: string;
    totalAllocation: number;
    conflictingProjects: string[];
    overallocationPercentage: number;
}>>;
/**
 * Coordinates dependencies between multiple projects.
 *
 * @param {string} dependentProjectId - Dependent project ID
 * @param {string} predecessorProjectId - Predecessor project ID
 * @param {string} dependencyType - Type of dependency
 * @returns {Promise<object>} Dependency record
 *
 * @example
 * ```typescript
 * await coordinateProjectDependencies('proj-2', 'proj-1', 'FINISH_TO_START');
 * ```
 */
export declare const coordinateProjectDependencies: (dependentProjectId: string, predecessorProjectId: string, dependencyType: string) => Promise<{
    dependentProjectId: string;
    predecessorProjectId: string;
    dependencyType: string;
    createdAt: Date;
}>;
/**
 * Allocates shared resources across multiple projects.
 *
 * @param {object} allocationData - Resource allocation data
 * @returns {Promise<ResourceAllocation>} Resource allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateSharedResources({
 *   resourceId: 'crane-001',
 *   projectAllocations: [
 *     { projectId: 'proj-1', percentage: 60 },
 *     { projectId: 'proj-2', percentage: 40 }
 *   ]
 * });
 * ```
 */
export declare const allocateSharedResources: (allocationData: any) => Promise<ResourceAllocation>;
/**
 * Performs resource leveling across portfolio projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {object} options - Leveling options
 * @returns {Promise<object>} Leveling results
 *
 * @example
 * ```typescript
 * const results = await performCrossProjectResourceLeveling('portfolio-123', {
 *   prioritizeBy: 'priority',
 *   allowDelays: true
 * });
 * ```
 */
export declare const performCrossProjectResourceLeveling: (portfolioId: string, options: any) => Promise<{
    adjustedProjects: any[];
    resourceUtilization: Map<string, number>;
    delaysIntroduced: any[];
}>;
/**
 * Synchronizes schedules across dependent projects.
 *
 * @param {string[]} projectIds - Array of project IDs
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const sync = await synchronizeProjectSchedules(['proj-1', 'proj-2', 'proj-3']);
 * ```
 */
export declare const synchronizeProjectSchedules: (projectIds: string[]) => Promise<{
    synchronized: boolean;
    conflicts: any[];
    recommendations: string[];
}>;
/**
 * Generates cross-project impact analysis for changes.
 *
 * @param {string} projectId - Project with proposed change
 * @param {object} changeData - Change details
 * @returns {Promise<object>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeCrossProjectImpact('proj-1', {
 *   scheduleDelay: 30,
 *   costIncrease: 500000
 * });
 * ```
 */
export declare const analyzeCrossProjectImpact: (projectId: string, changeData: any) => Promise<{
    impactedProjects: string[];
    cumulativeScheduleImpact: number;
    cumulativeCostImpact: number;
    recommendations: string[];
}>;
/**
 * Transitions project to next phase with gate review.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} toPhase - Target phase
 * @param {string} approvedBy - User approving transition
 * @returns {Promise<PhaseTransition>} Phase transition record
 *
 * @example
 * ```typescript
 * const transition = await transitionProjectPhase('proj-123', ProjectPhase.CONSTRUCTION, 'admin-456');
 * ```
 */
export declare const transitionProjectPhase: (projectId: string, toPhase: ProjectPhase, approvedBy: string) => Promise<PhaseTransition>;
/**
 * Validates phase gate criteria before transition.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} targetPhase - Target phase
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validatePhaseGateCriteria('proj-123', ProjectPhase.CONSTRUCTION);
 * ```
 */
export declare const validatePhaseGateCriteria: (projectId: string, targetPhase: ProjectPhase) => Promise<{
    canTransition: boolean;
    exitCriteriaMet: boolean;
    entryCriteriaMet: boolean;
    missingCriteria: string[];
    warnings: string[];
}>;
/**
 * Retrieves phase transition history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<PhaseTransition[]>} Phase history
 *
 * @example
 * ```typescript
 * const history = await getPhaseTransitionHistory('proj-123');
 * ```
 */
export declare const getPhaseTransitionHistory: (projectId: string) => Promise<PhaseTransition[]>;
/**
 * Calculates average phase durations for project type.
 *
 * @param {string} projectType - Project type
 * @param {DeliveryMethod} deliveryMethod - Delivery method
 * @returns {Promise<object>} Phase duration statistics
 *
 * @example
 * ```typescript
 * const durations = await calculatePhaseDurations('hospital', DeliveryMethod.DESIGN_BUILD);
 * ```
 */
export declare const calculatePhaseDurations: (projectType: string, deliveryMethod: DeliveryMethod) => Promise<Record<ProjectPhase, {
    average: number;
    min: number;
    max: number;
}>>;
/**
 * Generates phase completion checklist.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} phase - Phase to generate checklist for
 * @returns {Promise<object>} Phase checklist
 *
 * @example
 * ```typescript
 * const checklist = await generatePhaseChecklist('proj-123', ProjectPhase.DESIGN);
 * ```
 */
export declare const generatePhaseChecklist: (projectId: string, phase: ProjectPhase) => Promise<{
    phase: ProjectPhase;
    items: Array<{
        item: string;
        completed: boolean;
        requiredFor: string;
    }>;
    completionPercentage: number;
}>;
/**
 * Creates project baseline for scope, schedule, and cost.
 *
 * @param {object} baselineData - Baseline creation data
 * @param {string} userId - User creating baseline
 * @returns {Promise<ProjectBaseline>} Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createProjectBaseline({
 *   projectId: 'proj-123',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * }, 'admin-456');
 * ```
 */
export declare const createProjectBaseline: (baselineData: any, userId: string) => Promise<ProjectBaseline>;
/**
 * Compares current project status to baseline.
 *
 * @param {string} projectId - Project identifier
 * @param {string} [baselineId] - Specific baseline ID (uses current if not specified)
 * @returns {Promise<object>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await compareToBaseline('proj-123');
 * ```
 */
export declare const compareToBaseline: (projectId: string, baselineId?: string) => Promise<{
    budgetVariance: number;
    budgetVariancePercentage: number;
    scheduleVariance: number;
    scheduleVarianceDays: number;
    scopeChanges: string[];
}>;
/**
 * Requests baseline re-baselining with justification.
 *
 * @param {string} projectId - Project identifier
 * @param {object} rebaselineData - Re-baseline request data
 * @param {string} userId - User requesting re-baseline
 * @returns {Promise<object>} Re-baseline request
 *
 * @example
 * ```typescript
 * const request = await requestBaselineChange('proj-123', {
 *   newBudget: 28000000,
 *   newSchedule: new Date('2026-03-31'),
 *   justification: 'Major scope change approved'
 * }, 'pm-456');
 * ```
 */
export declare const requestBaselineChange: (projectId: string, rebaselineData: any, userId: string) => Promise<{
    requestId: string;
    status: "PENDING";
    requestedBy: string;
    requestedAt: Date;
}>;
/**
 * Approves baseline change and creates new baseline.
 *
 * @param {string} requestId - Re-baseline request ID
 * @param {string} approvedBy - User approving change
 * @returns {Promise<ProjectBaseline>} New baseline
 *
 * @example
 * ```typescript
 * const newBaseline = await approveBaselineChange('request-123', 'director-789');
 * ```
 */
export declare const approveBaselineChange: (requestId: string, approvedBy: string) => Promise<ProjectBaseline>;
/**
 * Retrieves baseline history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectBaseline[]>} Baseline history
 *
 * @example
 * ```typescript
 * const history = await getBaselineHistory('proj-123');
 * ```
 */
export declare const getBaselineHistory: (projectId: string) => Promise<ProjectBaseline[]>;
/**
 * Creates change order for project modifications.
 *
 * @param {object} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @returns {Promise<ChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const co = await createChangeOrder({
 *   projectId: 'proj-123',
 *   title: 'Add backup power system',
 *   description: 'Install redundant generator',
 *   changeType: 'SCOPE',
 *   costImpact: 250000,
 *   scheduleImpact: 15
 * }, 'pm-456');
 * ```
 */
export declare const createChangeOrder: (changeOrderData: any, userId: string) => Promise<ChangeOrder>;
/**
 * Processes change order approval workflow.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {object} approval - Approval details
 * @returns {Promise<ChangeOrder>} Updated change order
 *
 * @example
 * ```typescript
 * const updated = await processChangeOrderApproval('co-123', {
 *   approvedBy: 'director-789',
 *   status: 'APPROVED',
 *   comments: 'Approved with conditions'
 * });
 * ```
 */
export declare const processChangeOrderApproval: (changeOrderId: string, approval: any) => Promise<ChangeOrder>;
/**
 * Implements approved change order into project.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {string} userId - User implementing change
 * @returns {Promise<object>} Implementation result
 *
 * @example
 * ```typescript
 * await implementChangeOrder('co-123', 'pm-456');
 * ```
 */
export declare const implementChangeOrder: (changeOrderId: string, userId: string) => Promise<{
    implemented: boolean;
    implementedDate: Date;
    projectUpdated: boolean;
}>;
/**
 * Retrieves change order history for project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders('proj-123', { status: 'APPROVED' });
 * ```
 */
export declare const getProjectChangeOrders: (projectId: string, filters?: any) => Promise<ChangeOrder[]>;
/**
 * Analyzes change order trends and patterns.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeChangeOrderTrends('proj-123');
 * ```
 */
export declare const analyzeChangeOrderTrends: (projectId: string) => Promise<{
    totalChangeOrders: number;
    averageCostImpact: number;
    averageScheduleImpact: number;
    mostCommonType: string;
    approvalRate: number;
}>;
/**
 * Integrates project with budget management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} budgetId - Budget system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithBudgetSystem('proj-123', 'budget-456');
 * ```
 */
export declare const integrateWithBudgetSystem: (projectId: string, budgetId: string) => Promise<{
    integrated: boolean;
    budgetId: string;
    syncEnabled: boolean;
}>;
/**
 * Integrates project with schedule management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} scheduleId - Schedule system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithScheduleSystem('proj-123', 'schedule-789');
 * ```
 */
export declare const integrateWithScheduleSystem: (projectId: string, scheduleId: string) => Promise<{
    integrated: boolean;
    scheduleId: string;
    criticalPathSynced: boolean;
}>;
/**
 * Integrates project with quality management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} qualitySystemId - Quality system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithQualitySystem('proj-123', 'qms-321');
 * ```
 */
export declare const integrateWithQualitySystem: (projectId: string, qualitySystemId: string) => Promise<{
    integrated: boolean;
    qualitySystemId: string;
    inspectionsLinked: boolean;
}>;
/**
 * Generates executive project summary report.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary('proj-123');
 * ```
 */
export declare const generateExecutiveSummary: (projectId: string) => Promise<{
    project: ConstructionProject;
    performanceMetrics: ProjectPerformanceMetrics;
    keyMilestones: any[];
    topRisks: any[];
    recommendations: string[];
}>;
/**
 * Exports project data to external formats.
 *
 * @param {string} projectId - Project identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'MSP' | 'PRIMAVERA')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportProjectData('proj-123', 'PDF');
 * ```
 */
export declare const exportProjectData: (projectId: string, format: string) => Promise<Buffer>;
/**
 * Creates reusable project template from existing project.
 *
 * @param {string} projectId - Source project ID
 * @param {object} templateData - Template metadata
 * @param {string} userId - User creating template
 * @returns {Promise<ProjectTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createProjectTemplate('proj-123', {
 *   templateName: 'Standard Hospital Expansion',
 *   description: 'Template for hospital expansion projects'
 * }, 'admin-456');
 * ```
 */
export declare const createProjectTemplate: (projectId: string, templateData: any, userId: string) => Promise<ProjectTemplate>;
/**
 * Initiates project closeout process.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User initiating closeout
 * @returns {Promise<object>} Closeout initiation result
 *
 * @example
 * ```typescript
 * const closeout = await initiateProjectCloseout('proj-123', 'pm-456');
 * ```
 */
export declare const initiateProjectCloseout: (projectId: string, userId: string) => Promise<{
    closeoutId: string;
    status: "IN_PROGRESS";
    initiatedBy: string;
    initiatedAt: Date;
    checklistItems: string[];
}>;
/**
 * Captures lessons learned from project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} lessonsData - Lessons learned data
 * @param {string} userId - User submitting lessons
 * @returns {Promise<object>} Lessons learned record
 *
 * @example
 * ```typescript
 * const lessons = await captureLessonsLearned('proj-123', {
 *   category: 'Schedule Management',
 *   lesson: 'Early contractor involvement improved coordination',
 *   recommendation: 'Continue using design-build for future projects'
 * }, 'pm-456');
 * ```
 */
export declare const captureLessonsLearned: (projectId: string, lessonsData: any, userId: string) => Promise<{
    id: string;
    projectId: string;
    category: string;
    lesson: string;
    recommendation: string;
    submittedBy: string;
    submittedAt: Date;
}>;
/**
 * Completes project closeout and archives project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User completing closeout
 * @returns {Promise<object>} Closeout completion
 *
 * @example
 * ```typescript
 * await completeProjectCloseout('proj-123', 'director-789');
 * ```
 */
export declare const completeProjectCloseout: (projectId: string, userId: string) => Promise<{
    completed: boolean;
    completedBy: string;
    completedAt: Date;
    finalReport: string;
}>;
/**
 * Generates project performance benchmarking report.
 *
 * @param {string} projectId - Project identifier
 * @param {string[]} comparisonProjectIds - Projects to compare against
 * @returns {Promise<object>} Benchmarking report
 *
 * @example
 * ```typescript
 * const benchmark = await generateProjectBenchmark('proj-123', ['proj-100', 'proj-101']);
 * ```
 */
export declare const generateProjectBenchmark: (projectId: string, comparisonProjectIds: string[]) => Promise<{
    project: ConstructionProject;
    metrics: ProjectPerformanceMetrics;
    comparisons: any[];
    ranking: number;
    insights: string[];
}>;
/**
 * Construction Project Management Controller
 * Provides RESTful API endpoints for construction project management
 */
export declare class ConstructionProjectController {
    create(createDto: CreateConstructionProjectDto): Promise<ConstructionProject>;
    findOne(id: string): Promise<ConstructionProject>;
    updateProgress(id: string, progressDto: UpdateProjectProgressDto): Promise<ConstructionProject>;
    getEVM(id: string): Promise<ProjectPerformanceMetrics>;
    createBaseline(id: string, baselineDto: CreateBaselineDto): Promise<ProjectBaseline>;
    createCO(id: string, coDto: CreateChangeOrderDto): Promise<ChangeOrder>;
    getStatusReport(id: string): Promise<{
        project: ConstructionProject;
        performanceMetrics: ProjectPerformanceMetrics;
        scheduleStatus: any;
        riskSummary: any;
        changeOrderSummary: any;
        reportDate: Date;
    }>;
}
declare const _default: {
    createConstructionProjectModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            projectNumber: string;
            projectName: string;
            description: string;
            status: string;
            currentPhase: string;
            priority: string;
            deliveryMethod: string;
            projectManagerId: string;
            sponsorId: string | null;
            contractorId: string | null;
            totalBudget: number;
            committedCost: number;
            actualCost: number;
            forecastedCost: number;
            contingencyReserve: number;
            managementReserve: number;
            baselineSchedule: Date | null;
            baselineEndDate: Date | null;
            currentSchedule: Date | null;
            currentEndDate: Date | null;
            actualStartDate: Date | null;
            actualEndDate: Date | null;
            progressPercentage: number;
            earnedValue: number;
            plannedValue: number;
            siteLocationId: string | null;
            districtCode: string | null;
            divisionCode: string | null;
            regulatoryCompliance: string[];
            environmentalPermits: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createProjectBaselineModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            projectId: string;
            baselineNumber: string;
            baselineType: string;
            baselineDate: Date;
            budget: number;
            schedule: Date;
            scope: string;
            approvedBy: string;
            approvedAt: Date;
            changeReason: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createChangeOrderModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            projectId: string;
            changeOrderNumber: string;
            title: string;
            description: string;
            changeType: string;
            requestedBy: string;
            requestedDate: Date;
            costImpact: number;
            scheduleImpact: number;
            status: string;
            approvals: any[];
            implementedDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createConstructionProject: (projectData: any, userId: string, transaction?: Transaction) => Promise<ConstructionProject>;
    generateConstructionProjectNumber: (districtCode: string) => string;
    initializeProjectFromTemplate: (templateId: string, customizations: any, userId: string) => Promise<{
        project: ConstructionProject;
        baseline: ProjectBaseline;
        phases: PhaseTransition[];
    }>;
    cloneConstructionProject: (sourceProjectId: string, overrides: any, copyData: boolean, userId: string) => Promise<ConstructionProject>;
    archiveConstructionProject: (projectId: string, archiveReason: string, userId: string) => Promise<{
        archived: boolean;
        archiveDate: Date;
        archivedBy: string;
    }>;
    updateProjectProgress: (projectId: string, progressData: {
        progressPercentage: number;
        actualCost: number;
        notes?: string;
    }, userId: string) => Promise<ConstructionProject>;
    calculateProjectEVM: (projectId: string) => Promise<ProjectPerformanceMetrics>;
    trackProjectSchedule: (projectId: string) => Promise<{
        baselineEndDate: Date;
        currentEndDate: Date;
        forecastedEndDate: Date;
        scheduleVarianceDays: number;
        onSchedule: boolean;
    }>;
    generateProjectStatusReport: (projectId: string, asOfDate?: Date) => Promise<{
        project: ConstructionProject;
        performanceMetrics: ProjectPerformanceMetrics;
        scheduleStatus: any;
        riskSummary: any;
        changeOrderSummary: any;
        reportDate: Date;
    }>;
    calculateProjectCriticalPath: (projectId: string) => Promise<{
        criticalTasks: any[];
        totalDuration: number;
        slack: number;
        longestPath: string[];
    }>;
    createProjectPortfolio: (portfolioData: any, userId: string) => Promise<ProjectPortfolio>;
    addProjectToPortfolio: (portfolioId: string, projectId: string) => Promise<{
        portfolioId: string;
        projectId: string;
        addedAt: Date;
    }>;
    calculatePortfolioMetrics: (portfolioId: string) => Promise<{
        totalBudget: number;
        totalActualCost: number;
        averageCPI: number;
        averageSPI: number;
        totalEarnedValue: number;
        portfolioHealth: "EXCELLENT" | "GOOD" | "AT_RISK" | "CRITICAL";
    }>;
    generatePortfolioDashboard: (portfolioId: string) => Promise<{
        metrics: any;
        projectsByPhase: Record<ProjectPhase, number>;
        projectsByStatus: Record<ConstructionProjectStatus, number>;
        topRisks: any[];
        upcomingMilestones: any[];
    }>;
    identifyPortfolioResourceConflicts: (portfolioId: string) => Promise<Array<{
        resourceId: string;
        resourceName: string;
        totalAllocation: number;
        conflictingProjects: string[];
        overallocationPercentage: number;
    }>>;
    coordinateProjectDependencies: (dependentProjectId: string, predecessorProjectId: string, dependencyType: string) => Promise<{
        dependentProjectId: string;
        predecessorProjectId: string;
        dependencyType: string;
        createdAt: Date;
    }>;
    allocateSharedResources: (allocationData: any) => Promise<ResourceAllocation>;
    performCrossProjectResourceLeveling: (portfolioId: string, options: any) => Promise<{
        adjustedProjects: any[];
        resourceUtilization: Map<string, number>;
        delaysIntroduced: any[];
    }>;
    synchronizeProjectSchedules: (projectIds: string[]) => Promise<{
        synchronized: boolean;
        conflicts: any[];
        recommendations: string[];
    }>;
    analyzeCrossProjectImpact: (projectId: string, changeData: any) => Promise<{
        impactedProjects: string[];
        cumulativeScheduleImpact: number;
        cumulativeCostImpact: number;
        recommendations: string[];
    }>;
    transitionProjectPhase: (projectId: string, toPhase: ProjectPhase, approvedBy: string) => Promise<PhaseTransition>;
    validatePhaseGateCriteria: (projectId: string, targetPhase: ProjectPhase) => Promise<{
        canTransition: boolean;
        exitCriteriaMet: boolean;
        entryCriteriaMet: boolean;
        missingCriteria: string[];
        warnings: string[];
    }>;
    getPhaseTransitionHistory: (projectId: string) => Promise<PhaseTransition[]>;
    calculatePhaseDurations: (projectType: string, deliveryMethod: DeliveryMethod) => Promise<Record<ProjectPhase, {
        average: number;
        min: number;
        max: number;
    }>>;
    generatePhaseChecklist: (projectId: string, phase: ProjectPhase) => Promise<{
        phase: ProjectPhase;
        items: Array<{
            item: string;
            completed: boolean;
            requiredFor: string;
        }>;
        completionPercentage: number;
    }>;
    createProjectBaseline: (baselineData: any, userId: string) => Promise<ProjectBaseline>;
    compareToBaseline: (projectId: string, baselineId?: string) => Promise<{
        budgetVariance: number;
        budgetVariancePercentage: number;
        scheduleVariance: number;
        scheduleVarianceDays: number;
        scopeChanges: string[];
    }>;
    requestBaselineChange: (projectId: string, rebaselineData: any, userId: string) => Promise<{
        requestId: string;
        status: "PENDING";
        requestedBy: string;
        requestedAt: Date;
    }>;
    approveBaselineChange: (requestId: string, approvedBy: string) => Promise<ProjectBaseline>;
    getBaselineHistory: (projectId: string) => Promise<ProjectBaseline[]>;
    createChangeOrder: (changeOrderData: any, userId: string) => Promise<ChangeOrder>;
    processChangeOrderApproval: (changeOrderId: string, approval: any) => Promise<ChangeOrder>;
    implementChangeOrder: (changeOrderId: string, userId: string) => Promise<{
        implemented: boolean;
        implementedDate: Date;
        projectUpdated: boolean;
    }>;
    getProjectChangeOrders: (projectId: string, filters?: any) => Promise<ChangeOrder[]>;
    analyzeChangeOrderTrends: (projectId: string) => Promise<{
        totalChangeOrders: number;
        averageCostImpact: number;
        averageScheduleImpact: number;
        mostCommonType: string;
        approvalRate: number;
    }>;
    integrateWithBudgetSystem: (projectId: string, budgetId: string) => Promise<{
        integrated: boolean;
        budgetId: string;
        syncEnabled: boolean;
    }>;
    integrateWithScheduleSystem: (projectId: string, scheduleId: string) => Promise<{
        integrated: boolean;
        scheduleId: string;
        criticalPathSynced: boolean;
    }>;
    integrateWithQualitySystem: (projectId: string, qualitySystemId: string) => Promise<{
        integrated: boolean;
        qualitySystemId: string;
        inspectionsLinked: boolean;
    }>;
    generateExecutiveSummary: (projectId: string) => Promise<{
        project: ConstructionProject;
        performanceMetrics: ProjectPerformanceMetrics;
        keyMilestones: any[];
        topRisks: any[];
        recommendations: string[];
    }>;
    exportProjectData: (projectId: string, format: string) => Promise<Buffer>;
    createProjectTemplate: (projectId: string, templateData: any, userId: string) => Promise<ProjectTemplate>;
    initiateProjectCloseout: (projectId: string, userId: string) => Promise<{
        closeoutId: string;
        status: "IN_PROGRESS";
        initiatedBy: string;
        initiatedAt: Date;
        checklistItems: string[];
    }>;
    captureLessonsLearned: (projectId: string, lessonsData: any, userId: string) => Promise<{
        id: string;
        projectId: string;
        category: string;
        lesson: string;
        recommendation: string;
        submittedBy: string;
        submittedAt: Date;
    }>;
    completeProjectCloseout: (projectId: string, userId: string) => Promise<{
        completed: boolean;
        completedBy: string;
        completedAt: Date;
        finalReport: string;
    }>;
    generateProjectBenchmark: (projectId: string, comparisonProjectIds: string[]) => Promise<{
        project: ConstructionProject;
        metrics: ProjectPerformanceMetrics;
        comparisons: any[];
        ranking: number;
        insights: string[];
    }>;
    ConstructionProjectController: typeof ConstructionProjectController;
};
export default _default;
//# sourceMappingURL=construction-project-management-kit.d.ts.map