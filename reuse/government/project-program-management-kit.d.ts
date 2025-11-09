/**
 * LOC: PROJPROG1234567
 * File: /reuse/government/project-program-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Project management controllers
 *   - Program tracking engines
 */
/**
 * File: /reuse/government/project-program-management-kit.ts
 * Locator: WC-GOV-PROJ-001
 * Purpose: Comprehensive Project & Program Management Utilities - Government capital project and program lifecycle
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Project controllers, program services, resource allocation, performance tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for capital project tracking, budget management, milestones, resource allocation, cost tracking
 *
 * LLM Context: Enterprise-grade government project and program management system for capital projects.
 * Provides project lifecycle management, program budget oversight, milestone tracking, resource allocation,
 * timeline management, cost tracking, performance metrics, deliverable tracking, multi-year planning,
 * project dashboards, risk management, stakeholder management, compliance tracking, reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CapitalProject {
    projectNumber: string;
    projectName: string;
    projectType: 'INFRASTRUCTURE' | 'BUILDING' | 'EQUIPMENT' | 'IT' | 'ENVIRONMENTAL';
    department: string;
    programId?: number;
    totalBudget: number;
    status: 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    startDate: Date;
    endDate: Date;
    projectManager: string;
    sponsor: string;
}
interface ProjectMilestone {
    milestoneId: string;
    projectId: number;
    milestoneName: string;
    description: string;
    plannedDate: Date;
    actualDate?: Date;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'AT_RISK';
    dependencies: string[];
    deliverables: string[];
    completionPercent: number;
}
interface ResourceAllocation {
    resourceId: string;
    projectId: number;
    resourceType: 'PERSONNEL' | 'EQUIPMENT' | 'MATERIALS' | 'FACILITIES' | 'BUDGET';
    resourceName: string;
    allocatedAmount: number;
    unitOfMeasure: string;
    allocationStart: Date;
    allocationEnd: Date;
    utilizationPercent: number;
    cost: number;
}
interface ProjectTimeline {
    projectId: number;
    phases: ProjectPhase[];
    criticalPath: string[];
    totalDuration: number;
    remainingDuration: number;
    percentComplete: number;
    scheduledCompletion: Date;
    forecastedCompletion: Date;
    scheduleVariance: number;
}
interface ProjectPhase {
    phaseId: string;
    phaseName: string;
    startDate: Date;
    endDate: Date;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
    milestones: string[];
    dependencies: string[];
}
interface ProjectCost {
    projectId: number;
    budgetedCost: number;
    actualCost: number;
    committedCost: number;
    forecastedCost: number;
    costVariance: number;
    costVariancePercent: number;
    contingencyReserve: number;
    contingencyUsed: number;
}
interface ProgramBudget {
    programId: number;
    fiscalYear: number;
    totalBudget: number;
    allocatedToProjects: number;
    unallocatedBudget: number;
    projectCount: number;
    expenditures: number;
    commitments: number;
    availableFunds: number;
}
interface PerformanceMetrics {
    projectId: number;
    reportingPeriod: {
        startDate: Date;
        endDate: Date;
    };
    schedulePerformanceIndex: number;
    costPerformanceIndex: number;
    earnedValue: number;
    plannedValue: number;
    actualCost: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
}
interface ProjectDeliverable {
    deliverableId: string;
    projectId: number;
    deliverableName: string;
    description: string;
    deliverableType: 'DOCUMENT' | 'SYSTEM' | 'FACILITY' | 'EQUIPMENT' | 'SERVICE';
    dueDate: Date;
    completedDate?: Date;
    status: 'PLANNED' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'DELIVERED';
    acceptedBy?: string;
    quality: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'NEEDS_IMPROVEMENT';
}
interface MultiYearPlan {
    planId: string;
    programId: number;
    planName: string;
    startYear: number;
    endYear: number;
    totalYears: number;
    totalBudget: number;
    yearlyAllocations: YearlyAllocation[];
    projects: number[];
    status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
}
interface YearlyAllocation {
    fiscalYear: number;
    budgetedAmount: number;
    projectedSpend: number;
    actualSpend: number;
    projectCount: number;
}
interface ProjectRisk {
    riskId: string;
    projectId: number;
    riskCategory: 'COST' | 'SCHEDULE' | 'SCOPE' | 'QUALITY' | 'SAFETY' | 'REGULATORY';
    riskDescription: string;
    probability: 'LOW' | 'MEDIUM' | 'HIGH';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    riskScore: number;
    mitigationPlan?: string;
    owner: string;
    status: 'IDENTIFIED' | 'ANALYZING' | 'MITIGATING' | 'MONITORING' | 'CLOSED';
}
interface Stakeholder {
    stakeholderId: string;
    projectId: number;
    name: string;
    role: string;
    organization: string;
    interestLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    influenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    communicationPreference: 'EMAIL' | 'MEETING' | 'REPORT' | 'DASHBOARD';
    contactInfo: {
        email: string;
        phone: string;
    };
}
interface ProjectDashboard {
    projectId: number;
    projectName: string;
    status: string;
    healthIndicator: 'GREEN' | 'YELLOW' | 'RED';
    percentComplete: number;
    budgetStatus: ProjectCost;
    scheduleStatus: ProjectTimeline;
    keyMilestones: ProjectMilestone[];
    activeRisks: ProjectRisk[];
    recentActivity: any[];
}
/**
 * Sequelize model for Capital Project Management with lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalProject model
 *
 * @example
 * ```typescript
 * const CapitalProject = createCapitalProjectModel(sequelize);
 * const project = await CapitalProject.create({
 *   projectNumber: 'CAP-2025-001',
 *   projectName: 'Highway Bridge Replacement',
 *   projectType: 'INFRASTRUCTURE',
 *   totalBudget: 5000000,
 *   status: 'PLANNING'
 * });
 * ```
 */
export declare const createCapitalProjectModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectNumber: string;
        projectName: string;
        projectType: string;
        department: string;
        programId: number | null;
        description: string;
        justification: string;
        totalBudget: number;
        currentCost: number;
        status: string;
        priority: string;
        startDate: Date;
        endDate: Date;
        actualStartDate: Date | null;
        actualEndDate: Date | null;
        projectManager: string;
        sponsor: string;
        percentComplete: number;
        healthStatus: string;
        fundingSource: string;
        location: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Project Milestones with dependency tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectMilestone model
 *
 * @example
 * ```typescript
 * const ProjectMilestone = createProjectMilestoneModel(sequelize);
 * const milestone = await ProjectMilestone.create({
 *   projectId: 1,
 *   milestoneName: 'Design Phase Complete',
 *   plannedDate: new Date('2025-03-31'),
 *   status: 'PENDING'
 * });
 * ```
 */
export declare const createProjectMilestoneModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        milestoneId: string;
        projectId: number;
        milestoneName: string;
        description: string;
        milestoneType: string;
        plannedDate: Date;
        actualDate: Date | null;
        baselineDate: Date;
        status: string;
        completionPercent: number;
        dependencies: string[];
        deliverables: string[];
        owner: string;
        approvedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Resource Allocation with utilization tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ResourceAllocation model
 *
 * @example
 * ```typescript
 * const ResourceAllocation = createResourceAllocationModel(sequelize);
 * const allocation = await ResourceAllocation.create({
 *   projectId: 1,
 *   resourceType: 'PERSONNEL',
 *   resourceName: 'Senior Engineer',
 *   allocatedAmount: 1000,
 *   unitOfMeasure: 'hours'
 * });
 * ```
 */
export declare const createResourceAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        resourceId: string;
        projectId: number;
        resourceType: string;
        resourceName: string;
        allocatedAmount: number;
        usedAmount: number;
        remainingAmount: number;
        unitOfMeasure: string;
        allocationStart: Date;
        allocationEnd: Date;
        utilizationPercent: number;
        cost: number;
        actualCost: number;
        rate: number | null;
        status: string;
        allocatedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new capital project with validation.
 *
 * @param {CapitalProject} projectData - Project creation data
 * @param {string} createdBy - User creating project
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCapitalProject({
 *   projectName: 'Highway Bridge Replacement',
 *   projectType: 'INFRASTRUCTURE',
 *   department: 'Public Works',
 *   totalBudget: 5000000,
 *   priority: 'HIGH',
 *   startDate: new Date('2025-04-01'),
 *   endDate: new Date('2026-12-31'),
 *   projectManager: 'john.doe',
 *   sponsor: 'director.smith'
 * }, 'project.admin');
 * ```
 */
export declare const createCapitalProject: (projectData: Partial<CapitalProject>, createdBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates unique project number.
 *
 * @returns {string} Generated project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateProjectNumber();
 * // Returns: 'CAP-2025-001234'
 * ```
 */
export declare const generateProjectNumber: () => string;
/**
 * Updates project status and tracks history.
 *
 * @param {number} projectId - Project ID
 * @param {string} newStatus - New project status
 * @param {string} updatedBy - User updating status
 * @param {string} [notes] - Optional status change notes
 * @returns {Promise<object>} Updated project
 *
 * @example
 * ```typescript
 * const updated = await updateProjectStatus(1, 'IN_PROGRESS', 'project.manager', 'Construction started');
 * ```
 */
export declare const updateProjectStatus: (projectId: number, newStatus: string, updatedBy: string, notes?: string) => Promise<any>;
/**
 * Retrieves project details with related data.
 *
 * @param {number} projectId - Project ID
 * @param {object} [options] - Optional include options (milestones, resources, costs)
 * @returns {Promise<object>} Project with related data
 *
 * @example
 * ```typescript
 * const project = await getProjectDetails(1, {
 *   includeMilestones: true,
 *   includeResources: true,
 *   includeCosts: true
 * });
 * ```
 */
export declare const getProjectDetails: (projectId: number, options?: any) => Promise<any>;
/**
 * Searches projects by multiple criteria.
 *
 * @param {object} searchCriteria - Search filters
 * @returns {Promise<object[]>} Matching projects
 *
 * @example
 * ```typescript
 * const projects = await searchProjects({
 *   status: 'IN_PROGRESS',
 *   department: 'Public Works',
 *   minBudget: 1000000,
 *   priority: 'HIGH'
 * });
 * ```
 */
export declare const searchProjects: (searchCriteria: any) => Promise<any[]>;
/**
 * Allocates budget from program to project.
 *
 * @param {number} programId - Program ID
 * @param {number} projectId - Project ID
 * @param {number} amount - Allocation amount
 * @param {string} allocatedBy - User performing allocation
 * @returns {Promise<object>} Budget allocation record
 *
 * @example
 * ```typescript
 * const allocation = await allocateProgramBudget(5, 10, 2500000, 'program.manager');
 * ```
 */
export declare const allocateProgramBudget: (programId: number, projectId: number, amount: number, allocatedBy: string) => Promise<any>;
/**
 * Calculates program budget utilization.
 *
 * @param {number} programId - Program ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<ProgramBudget>} Program budget data
 *
 * @example
 * ```typescript
 * const budget = await calculateProgramBudget(5, 2025);
 * ```
 */
export declare const calculateProgramBudget: (programId: number, fiscalYear: number) => Promise<ProgramBudget>;
/**
 * Retrieves all projects in a program.
 *
 * @param {number} programId - Program ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<object[]>} Program projects
 *
 * @example
 * ```typescript
 * const projects = await getProgramProjects(5, { status: 'IN_PROGRESS' });
 * ```
 */
export declare const getProgramProjects: (programId: number, filters?: any) => Promise<any[]>;
/**
 * Generates program budget report.
 *
 * @param {number} programId - Program ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Budget report
 *
 * @example
 * ```typescript
 * const report = await generateProgramBudgetReport(5, 2025);
 * ```
 */
export declare const generateProgramBudgetReport: (programId: number, fiscalYear: number) => Promise<any>;
/**
 * Forecasts program budget needs for future years.
 *
 * @param {number} programId - Program ID
 * @param {number} yearsAhead - Number of years to forecast
 * @returns {Promise<object[]>} Budget forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await forecastProgramBudget(5, 3);
 * ```
 */
export declare const forecastProgramBudget: (programId: number, yearsAhead: number) => Promise<any[]>;
/**
 * Creates project milestone.
 *
 * @param {ProjectMilestone} milestoneData - Milestone details
 * @param {string} createdBy - User creating milestone
 * @returns {Promise<object>} Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createProjectMilestone({
 *   projectId: 1,
 *   milestoneName: 'Design Phase Complete',
 *   description: 'All design documents approved',
 *   plannedDate: new Date('2025-03-31'),
 *   status: 'PENDING',
 *   dependencies: [],
 *   deliverables: ['design-doc-001', 'design-doc-002'],
 *   completionPercent: 0
 * }, 'project.manager');
 * ```
 */
export declare const createProjectMilestone: (milestoneData: Partial<ProjectMilestone>, createdBy: string) => Promise<any>;
/**
 * Generates unique milestone ID.
 *
 * @returns {string} Milestone ID
 *
 * @example
 * ```typescript
 * const milestoneId = generateMilestoneId();
 * // Returns: 'MLS-001234'
 * ```
 */
export declare const generateMilestoneId: () => string;
/**
 * Updates milestone progress and completion.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {number} completionPercent - Completion percentage (0-100)
 * @param {string} updatedBy - User updating milestone
 * @returns {Promise<object>} Updated milestone
 *
 * @example
 * ```typescript
 * const updated = await updateMilestoneProgress('MLS-001234', 75, 'project.manager');
 * ```
 */
export declare const updateMilestoneProgress: (milestoneId: string, completionPercent: number, updatedBy: string) => Promise<any>;
/**
 * Retrieves milestones for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ProjectMilestone[]>} Project milestones
 *
 * @example
 * ```typescript
 * const milestones = await getProjectMilestones(1, { status: 'PENDING' });
 * ```
 */
export declare const getProjectMilestones: (projectId: number, filters?: any) => Promise<ProjectMilestone[]>;
/**
 * Identifies delayed or at-risk milestones.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectMilestone[]>} At-risk milestones
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskMilestones(1);
 * ```
 */
export declare const identifyAtRiskMilestones: (projectId: number) => Promise<ProjectMilestone[]>;
/**
 * Allocates resource to project.
 *
 * @param {ResourceAllocation} allocationData - Resource allocation details
 * @param {string} allocatedBy - User allocating resource
 * @returns {Promise<object>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateProjectResource({
 *   projectId: 1,
 *   resourceType: 'PERSONNEL',
 *   resourceName: 'Senior Engineer',
 *   allocatedAmount: 1000,
 *   unitOfMeasure: 'hours',
 *   allocationStart: new Date('2025-01-01'),
 *   allocationEnd: new Date('2025-12-31'),
 *   cost: 150000,
 *   utilizationPercent: 0
 * }, 'resource.manager');
 * ```
 */
export declare const allocateProjectResource: (allocationData: Partial<ResourceAllocation>, allocatedBy: string) => Promise<any>;
/**
 * Generates unique resource allocation ID.
 *
 * @returns {string} Resource ID
 *
 * @example
 * ```typescript
 * const resourceId = generateResourceId();
 * // Returns: 'RES-001234'
 * ```
 */
export declare const generateResourceId: () => string;
/**
 * Updates resource utilization.
 *
 * @param {string} resourceId - Resource allocation ID
 * @param {number} usedAmount - Amount used
 * @param {number} actualCost - Actual cost incurred
 * @returns {Promise<object>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateResourceUtilization('RES-001234', 250, 37500);
 * ```
 */
export declare const updateResourceUtilization: (resourceId: string, usedAmount: number, actualCost: number) => Promise<any>;
/**
 * Retrieves resource allocations for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ResourceAllocation[]>} Resource allocations
 *
 * @example
 * ```typescript
 * const resources = await getProjectResources(1, { resourceType: 'PERSONNEL' });
 * ```
 */
export declare const getProjectResources: (projectId: number, filters?: any) => Promise<ResourceAllocation[]>;
/**
 * Analyzes resource utilization across projects.
 *
 * @param {object} filters - Analysis filters
 * @returns {Promise<object>} Utilization analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeResourceUtilization({
 *   resourceType: 'PERSONNEL',
 *   department: 'Engineering'
 * });
 * ```
 */
export declare const analyzeResourceUtilization: (filters: any) => Promise<any>;
/**
 * Creates project timeline with phases.
 *
 * @param {number} projectId - Project ID
 * @param {ProjectPhase[]} phases - Project phases
 * @returns {Promise<ProjectTimeline>} Project timeline
 *
 * @example
 * ```typescript
 * const timeline = await createProjectTimeline(1, [
 *   {
 *     phaseId: 'DESIGN',
 *     phaseName: 'Design Phase',
 *     startDate: new Date('2025-01-01'),
 *     endDate: new Date('2025-03-31'),
 *     status: 'NOT_STARTED',
 *     milestones: ['MLS-001', 'MLS-002'],
 *     dependencies: []
 *   }
 * ]);
 * ```
 */
export declare const createProjectTimeline: (projectId: number, phases: ProjectPhase[]) => Promise<ProjectTimeline>;
/**
 * Calculates total project duration in days.
 *
 * @param {ProjectPhase[]} phases - Project phases
 * @returns {number} Total duration in days
 *
 * @example
 * ```typescript
 * const duration = calculateTotalDuration(phases);
 * ```
 */
export declare const calculateTotalDuration: (phases: ProjectPhase[]) => number;
/**
 * Updates project schedule and calculates variance.
 *
 * @param {number} projectId - Project ID
 * @param {Date} newCompletionDate - New projected completion date
 * @param {string} reason - Reason for schedule change
 * @returns {Promise<object>} Updated timeline
 *
 * @example
 * ```typescript
 * const updated = await updateProjectSchedule(1, new Date('2026-03-31'), 'Weather delays');
 * ```
 */
export declare const updateProjectSchedule: (projectId: number, newCompletionDate: Date, reason: string) => Promise<any>;
/**
 * Identifies critical path for project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<string[]>} Critical path milestone IDs
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyCriticalPath(1);
 * ```
 */
export declare const identifyCriticalPath: (projectId: number) => Promise<string[]>;
/**
 * Generates project schedule report.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Schedule report
 *
 * @example
 * ```typescript
 * const report = await generateScheduleReport(1);
 * ```
 */
export declare const generateScheduleReport: (projectId: number) => Promise<any>;
/**
 * Records project cost transaction.
 *
 * @param {number} projectId - Project ID
 * @param {object} costData - Cost transaction data
 * @returns {Promise<object>} Cost transaction record
 *
 * @example
 * ```typescript
 * const cost = await recordProjectCost(1, {
 *   amount: 25000,
 *   category: 'MATERIALS',
 *   description: 'Steel beams',
 *   vendor: 'ABC Steel Co',
 *   invoiceNumber: 'INV-2025-001'
 * });
 * ```
 */
export declare const recordProjectCost: (projectId: number, costData: any) => Promise<any>;
/**
 * Calculates project cost performance.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectCost>} Cost performance data
 *
 * @example
 * ```typescript
 * const costs = await calculateProjectCost(1);
 * ```
 */
export declare const calculateProjectCost: (projectId: number) => Promise<ProjectCost>;
/**
 * Forecasts project cost at completion.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<{ estimateAtCompletion: number; estimateToComplete: number; varianceAtCompletion: number }>} Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastProjectCost(1);
 * ```
 */
export declare const forecastProjectCost: (projectId: number) => Promise<{
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
}>;
/**
 * Generates project cost report.
 *
 * @param {number} projectId - Project ID
 * @param {object} [options] - Report options
 * @returns {Promise<object>} Cost report
 *
 * @example
 * ```typescript
 * const report = await generateCostReport(1, { includeForecasts: true });
 * ```
 */
export declare const generateCostReport: (projectId: number, options?: any) => Promise<any>;
/**
 * Tracks contingency reserve usage.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<{ total: number; used: number; remaining: number; percentUsed: number }>} Contingency tracking
 *
 * @example
 * ```typescript
 * const contingency = await trackContingencyReserve(1);
 * ```
 */
export declare const trackContingencyReserve: (projectId: number) => Promise<{
    total: number;
    used: number;
    remaining: number;
    percentUsed: number;
}>;
/**
 * Calculates earned value metrics for project.
 *
 * @param {number} projectId - Project ID
 * @param {Date} asOfDate - Date for metrics calculation
 * @returns {Promise<PerformanceMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateEarnedValueMetrics(1, new Date());
 * ```
 */
export declare const calculateEarnedValueMetrics: (projectId: number, asOfDate: Date) => Promise<PerformanceMetrics>;
/**
 * Generates performance dashboard for project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectDashboard>} Project dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateProjectDashboard(1);
 * ```
 */
export declare const generateProjectDashboard: (projectId: number) => Promise<ProjectDashboard>;
/**
 * Compares performance across multiple projects.
 *
 * @param {number[]} projectIds - Project IDs to compare
 * @returns {Promise<object[]>} Comparison data
 *
 * @example
 * ```typescript
 * const comparison = await compareProjectPerformance([1, 2, 3, 4, 5]);
 * ```
 */
export declare const compareProjectPerformance: (projectIds: number[]) => Promise<any[]>;
/**
 * Generates portfolio performance report.
 *
 * @param {number} programId - Program ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<object>} Portfolio report
 *
 * @example
 * ```typescript
 * const report = await generatePortfolioReport(5, { fiscalYear: 2025 });
 * ```
 */
export declare const generatePortfolioReport: (programId: number, filters?: any) => Promise<any>;
/**
 * Tracks KPIs for program.
 *
 * @param {number} programId - Program ID
 * @returns {Promise<object>} Program KPIs
 *
 * @example
 * ```typescript
 * const kpis = await trackProgramKPIs(5);
 * ```
 */
export declare const trackProgramKPIs: (programId: number) => Promise<any>;
/**
 * Creates project deliverable.
 *
 * @param {ProjectDeliverable} deliverableData - Deliverable details
 * @returns {Promise<object>} Created deliverable
 *
 * @example
 * ```typescript
 * const deliverable = await createProjectDeliverable({
 *   projectId: 1,
 *   deliverableName: 'Final Design Documents',
 *   description: 'Complete set of engineering drawings',
 *   deliverableType: 'DOCUMENT',
 *   dueDate: new Date('2025-03-31'),
 *   status: 'PLANNED'
 * });
 * ```
 */
export declare const createProjectDeliverable: (deliverableData: Partial<ProjectDeliverable>) => Promise<any>;
/**
 * Generates unique deliverable ID.
 *
 * @returns {string} Deliverable ID
 *
 * @example
 * ```typescript
 * const deliverableId = generateDeliverableId();
 * // Returns: 'DEL-001234'
 * ```
 */
export declare const generateDeliverableId: () => string;
/**
 * Updates deliverable status.
 *
 * @param {string} deliverableId - Deliverable ID
 * @param {string} status - New status
 * @param {string} [acceptedBy] - User accepting deliverable
 * @returns {Promise<object>} Updated deliverable
 *
 * @example
 * ```typescript
 * const updated = await updateDeliverableStatus('DEL-001234', 'APPROVED', 'project.sponsor');
 * ```
 */
export declare const updateDeliverableStatus: (deliverableId: string, status: string, acceptedBy?: string) => Promise<any>;
/**
 * Retrieves deliverables for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ProjectDeliverable[]>} Project deliverables
 *
 * @example
 * ```typescript
 * const deliverables = await getProjectDeliverables(1, { status: 'IN_PROGRESS' });
 * ```
 */
export declare const getProjectDeliverables: (projectId: number, filters?: any) => Promise<ProjectDeliverable[]>;
/**
 * Tracks deliverable acceptance and quality.
 *
 * @param {string} deliverableId - Deliverable ID
 * @param {string} quality - Quality rating
 * @param {string} acceptedBy - User accepting deliverable
 * @param {string} [feedback] - Optional feedback
 * @returns {Promise<object>} Acceptance record
 *
 * @example
 * ```typescript
 * const acceptance = await trackDeliverableAcceptance('DEL-001234', 'EXCELLENT', 'sponsor', 'Outstanding work');
 * ```
 */
export declare const trackDeliverableAcceptance: (deliverableId: string, quality: string, acceptedBy: string, feedback?: string) => Promise<any>;
/**
 * Creates multi-year capital improvement plan.
 *
 * @param {MultiYearPlan} planData - Multi-year plan details
 * @returns {Promise<object>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createMultiYearPlan({
 *   programId: 5,
 *   planName: 'Infrastructure Improvement Plan 2025-2029',
 *   startYear: 2025,
 *   endYear: 2029,
 *   totalYears: 5,
 *   totalBudget: 50000000,
 *   yearlyAllocations: [
 *     { fiscalYear: 2025, budgetedAmount: 8000000, projectedSpend: 8000000, actualSpend: 0, projectCount: 3 }
 *   ],
 *   projects: [],
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createMultiYearPlan: (planData: Partial<MultiYearPlan>) => Promise<any>;
/**
 * Generates unique plan ID.
 *
 * @returns {string} Plan ID
 *
 * @example
 * ```typescript
 * const planId = generatePlanId();
 * // Returns: 'PLN-001234'
 * ```
 */
export declare const generatePlanId: () => string;
/**
 * Allocates projects across fiscal years.
 *
 * @param {string} planId - Plan ID
 * @param {object[]} projectAllocations - Project allocations by year
 * @returns {Promise<object>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await allocateProjectsByYear('PLN-001234', [
 *   { fiscalYear: 2025, projectIds: [1, 2, 3], totalBudget: 8000000 }
 * ]);
 * ```
 */
export declare const allocateProjectsByYear: (planId: string, projectAllocations: any[]) => Promise<any>;
/**
 * Tracks multi-year plan execution.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackMultiYearPlanExecution('PLN-001234');
 * ```
 */
export declare const trackMultiYearPlanExecution: (planId: string) => Promise<any>;
/**
 * Generates capital improvement plan report.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} CIP report
 *
 * @example
 * ```typescript
 * const report = await generateCapitalImprovementPlanReport('PLN-001234');
 * ```
 */
export declare const generateCapitalImprovementPlanReport: (planId: string) => Promise<any>;
/**
 * Creates project risk record.
 *
 * @param {ProjectRisk} riskData - Risk details
 * @returns {Promise<object>} Created risk
 *
 * @example
 * ```typescript
 * const risk = await createProjectRisk({
 *   projectId: 1,
 *   riskCategory: 'SCHEDULE',
 *   riskDescription: 'Potential weather delays during foundation work',
 *   probability: 'MEDIUM',
 *   impact: 'HIGH',
 *   riskScore: 15,
 *   owner: 'project.manager',
 *   status: 'IDENTIFIED'
 * });
 * ```
 */
export declare const createProjectRisk: (riskData: Partial<ProjectRisk>) => Promise<any>;
/**
 * Generates unique risk ID.
 *
 * @returns {string} Risk ID
 *
 * @example
 * ```typescript
 * const riskId = generateRiskId();
 * // Returns: 'RSK-001234'
 * ```
 */
export declare const generateRiskId: () => string;
/**
 * Adds stakeholder to project.
 *
 * @param {Stakeholder} stakeholderData - Stakeholder details
 * @returns {Promise<object>} Created stakeholder
 *
 * @example
 * ```typescript
 * const stakeholder = await addProjectStakeholder({
 *   projectId: 1,
 *   name: 'Mayor Johnson',
 *   role: 'Executive Sponsor',
 *   organization: 'City Government',
 *   interestLevel: 'HIGH',
 *   influenceLevel: 'HIGH',
 *   communicationPreference: 'MEETING',
 *   contactInfo: { email: 'mayor@city.gov', phone: '555-0100' }
 * });
 * ```
 */
export declare const addProjectStakeholder: (stakeholderData: Partial<Stakeholder>) => Promise<any>;
/**
 * Generates unique stakeholder ID.
 *
 * @returns {string} Stakeholder ID
 *
 * @example
 * ```typescript
 * const stakeholderId = generateStakeholderId();
 * // Returns: 'STK-001234'
 * ```
 */
export declare const generateStakeholderId: () => string;
/**
 * Generates stakeholder communication plan.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Communication plan
 *
 * @example
 * ```typescript
 * const plan = await generateStakeholderCommunicationPlan(1);
 * ```
 */
export declare const generateStakeholderCommunicationPlan: (projectId: number) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createCapitalProjectModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            projectNumber: string;
            projectName: string;
            projectType: string;
            department: string;
            programId: number | null;
            description: string;
            justification: string;
            totalBudget: number;
            currentCost: number;
            status: string;
            priority: string;
            startDate: Date;
            endDate: Date;
            actualStartDate: Date | null;
            actualEndDate: Date | null;
            projectManager: string;
            sponsor: string;
            percentComplete: number;
            healthStatus: string;
            fundingSource: string;
            location: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
        };
    };
    createProjectMilestoneModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            milestoneId: string;
            projectId: number;
            milestoneName: string;
            description: string;
            milestoneType: string;
            plannedDate: Date;
            actualDate: Date | null;
            baselineDate: Date;
            status: string;
            completionPercent: number;
            dependencies: string[];
            deliverables: string[];
            owner: string;
            approvedBy: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createResourceAllocationModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            resourceId: string;
            projectId: number;
            resourceType: string;
            resourceName: string;
            allocatedAmount: number;
            usedAmount: number;
            remainingAmount: number;
            unitOfMeasure: string;
            allocationStart: Date;
            allocationEnd: Date;
            utilizationPercent: number;
            cost: number;
            actualCost: number;
            rate: number | null;
            status: string;
            allocatedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCapitalProject: (projectData: Partial<CapitalProject>, createdBy: string, transaction?: Transaction) => Promise<any>;
    generateProjectNumber: () => string;
    updateProjectStatus: (projectId: number, newStatus: string, updatedBy: string, notes?: string) => Promise<any>;
    getProjectDetails: (projectId: number, options?: any) => Promise<any>;
    searchProjects: (searchCriteria: any) => Promise<any[]>;
    allocateProgramBudget: (programId: number, projectId: number, amount: number, allocatedBy: string) => Promise<any>;
    calculateProgramBudget: (programId: number, fiscalYear: number) => Promise<ProgramBudget>;
    getProgramProjects: (programId: number, filters?: any) => Promise<any[]>;
    generateProgramBudgetReport: (programId: number, fiscalYear: number) => Promise<any>;
    forecastProgramBudget: (programId: number, yearsAhead: number) => Promise<any[]>;
    createProjectMilestone: (milestoneData: Partial<ProjectMilestone>, createdBy: string) => Promise<any>;
    generateMilestoneId: () => string;
    updateMilestoneProgress: (milestoneId: string, completionPercent: number, updatedBy: string) => Promise<any>;
    getProjectMilestones: (projectId: number, filters?: any) => Promise<ProjectMilestone[]>;
    identifyAtRiskMilestones: (projectId: number) => Promise<ProjectMilestone[]>;
    allocateProjectResource: (allocationData: Partial<ResourceAllocation>, allocatedBy: string) => Promise<any>;
    generateResourceId: () => string;
    updateResourceUtilization: (resourceId: string, usedAmount: number, actualCost: number) => Promise<any>;
    getProjectResources: (projectId: number, filters?: any) => Promise<ResourceAllocation[]>;
    analyzeResourceUtilization: (filters: any) => Promise<any>;
    createProjectTimeline: (projectId: number, phases: ProjectPhase[]) => Promise<ProjectTimeline>;
    calculateTotalDuration: (phases: ProjectPhase[]) => number;
    updateProjectSchedule: (projectId: number, newCompletionDate: Date, reason: string) => Promise<any>;
    identifyCriticalPath: (projectId: number) => Promise<string[]>;
    generateScheduleReport: (projectId: number) => Promise<any>;
    recordProjectCost: (projectId: number, costData: any) => Promise<any>;
    calculateProjectCost: (projectId: number) => Promise<ProjectCost>;
    forecastProjectCost: (projectId: number) => Promise<{
        estimateAtCompletion: number;
        estimateToComplete: number;
        varianceAtCompletion: number;
    }>;
    generateCostReport: (projectId: number, options?: any) => Promise<any>;
    trackContingencyReserve: (projectId: number) => Promise<{
        total: number;
        used: number;
        remaining: number;
        percentUsed: number;
    }>;
    calculateEarnedValueMetrics: (projectId: number, asOfDate: Date) => Promise<PerformanceMetrics>;
    generateProjectDashboard: (projectId: number) => Promise<ProjectDashboard>;
    compareProjectPerformance: (projectIds: number[]) => Promise<any[]>;
    generatePortfolioReport: (programId: number, filters?: any) => Promise<any>;
    trackProgramKPIs: (programId: number) => Promise<any>;
    createProjectDeliverable: (deliverableData: Partial<ProjectDeliverable>) => Promise<any>;
    generateDeliverableId: () => string;
    updateDeliverableStatus: (deliverableId: string, status: string, acceptedBy?: string) => Promise<any>;
    getProjectDeliverables: (projectId: number, filters?: any) => Promise<ProjectDeliverable[]>;
    trackDeliverableAcceptance: (deliverableId: string, quality: string, acceptedBy: string, feedback?: string) => Promise<any>;
    createMultiYearPlan: (planData: Partial<MultiYearPlan>) => Promise<any>;
    generatePlanId: () => string;
    allocateProjectsByYear: (planId: string, projectAllocations: any[]) => Promise<any>;
    trackMultiYearPlanExecution: (planId: string) => Promise<any>;
    generateCapitalImprovementPlanReport: (planId: string) => Promise<any>;
    createProjectRisk: (riskData: Partial<ProjectRisk>) => Promise<any>;
    generateRiskId: () => string;
    addProjectStakeholder: (stakeholderData: Partial<Stakeholder>) => Promise<any>;
    generateStakeholderId: () => string;
    generateStakeholderCommunicationPlan: (projectId: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=project-program-management-kit.d.ts.map